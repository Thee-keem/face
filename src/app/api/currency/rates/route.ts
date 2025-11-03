import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Currency } from '@prisma/client';
import { currencyConverter, MOCK_EXCHANGE_RATES } from '@/lib/currency';

// Free currency API - in production, you would use a paid service for better reliability
const CURRENCY_API_URL = 'https://api.fxratesapi.com/latest'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const baseCurrency = searchParams.get('base') || 'USD'
  const targetCurrency = searchParams.get('target')

  try {
    // For the free API, we need to fetch all rates and then filter
    const response = await fetch(`${CURRENCY_API_URL}?base=${baseCurrency}`)
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    
    const data = await response.json()
    
    // If a specific target currency is requested, return only that rate
    if (targetCurrency && data.rates[targetCurrency]) {
      return NextResponse.json({
        success: true,
        base: baseCurrency,
        target: targetCurrency,
        rate: data.rates[targetCurrency],
        timestamp: data.timestamp
      })
    }
    
    // Otherwise return all rates
    return NextResponse.json({
      success: true,
      base: baseCurrency,
      rates: data.rates,
      timestamp: data.timestamp
    })
  } catch (error) {
    console.error('Error fetching currency rates:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch currency rates',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromCurrency, toCurrency, rate, date, source } = body;
    
    // Validate input
    if (!fromCurrency || !toCurrency || !rate || !date) {
      return NextResponse.json({ error: 'fromCurrency, toCurrency, rate, and date are required' }, { status: 400 });
    }
    
    // Save exchange rate to database
    const currencyRate = await db.currencyRate.create({
      data: {
        fromCurrency,
        toCurrency,
        rate,
        date: new Date(date),
        source: source || 'manual',
      },
    });
    
    // Update currency converter cache
    currencyConverter.setRate(fromCurrency, toCurrency, rate);
    
    return NextResponse.json(currencyRate);
    
  } catch (error) {
    console.error('Error saving currency rate:', error);
    return NextResponse.json({ error: 'Failed to save currency rate' }, { status: 500 });
  }
}

// Sync exchange rates from external API (mock implementation)
export async function PUT(request: Request) {
  try {
    // In a real implementation, this would fetch from an external API like Fixer.io
    // For now, we'll use mock data
    
    const savedRates: any[] = [];
    
    // Save mock exchange rates to database
    for (const [pair, rate] of Object.entries(MOCK_EXCHANGE_RATES)) {
      const [from, to] = pair.split('-') as [Currency, Currency];
      
      const currencyRate = await db.currencyRate.create({
        data: {
          fromCurrency: from,
          toCurrency: to,
          rate: rate as number,
          date: new Date(),
          source: 'mock',
        },
      });
      
      savedRates.push(currencyRate);
      
      // Update currency converter cache
      currencyConverter.setRate(from, to, rate as number);
    }
    
    return NextResponse.json({
      message: 'Exchange rates synced successfully',
      count: savedRates.length,
      rates: savedRates,
    });
    
  } catch (error) {
    console.error('Error syncing currency rates:', error);
    return NextResponse.json({ error: 'Failed to sync currency rates' }, { status: 500 });
  }
}