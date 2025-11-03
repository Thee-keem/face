import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Currency } from '@prisma/client';
import { currencyConverter } from '@/lib/currency';

interface ConvertRequest {
  amount: number;
  fromCurrency: Currency;
  toCurrency: Currency;
}

export async function POST(request: Request) {
  try {
    const body: ConvertRequest = await request.json();
    const { amount, fromCurrency, toCurrency } = body;
    
    // Validate input
    if (typeof amount !== 'number' || isNaN(amount)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    if (!fromCurrency || !toCurrency) {
      return NextResponse.json({ error: 'Both fromCurrency and toCurrency are required' }, { status: 400 });
    }
    
    // If currencies are the same, return the original amount
    if (fromCurrency === toCurrency) {
      return NextResponse.json({ 
        convertedAmount: amount,
        exchangeRate: 1,
        fromCurrency,
        toCurrency
      });
    }
    
    // Try to get the latest exchange rate from database
    const latestRate = await db.currencyRate.findFirst({
      where: {
        fromCurrency,
        toCurrency,
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    let exchangeRate: number | undefined = latestRate?.rate;
    
    // If no rate found in database, try to get from converter cache
    if (exchangeRate === undefined) {
      const rate = currencyConverter.getRate(fromCurrency, toCurrency);
      if (rate !== null) {
        exchangeRate = rate;
      }
    }
    
    // If still no rate, return error
    if (exchangeRate === undefined) {
      return NextResponse.json({ 
        error: `No exchange rate found for ${fromCurrency} to ${toCurrency}` 
      }, { status: 400 });
    }
    
    // Perform conversion
    const convertedAmount = amount * exchangeRate;
    
    return NextResponse.json({
      convertedAmount,
      exchangeRate,
      fromCurrency,
      toCurrency,
      convertedAt: latestRate?.date || new Date(),
    });
    
  } catch (error) {
    console.error('Error converting currency:', error);
    return NextResponse.json({ error: 'Failed to convert currency' }, { status: 500 });
  }
}