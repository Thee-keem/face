import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Currency } from '@prisma/client';

interface CustomSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
  };
  expires: string;
}

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check permissions (all roles can view products)
    if (!['ADMIN', 'MANAGER', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const brandId = searchParams.get('brandId') || '';
    const isActive = searchParams.get('isActive');
    const currency = searchParams.get('currency') as Currency || Currency.USD;
    
    // Build query conditions
    const where: any = {
      // Only show active products by default
      isActive: true,
    };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (brandId) {
      where.brandId = brandId;
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    // Get products
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
          brand: {
            select: {
              name: true,
            },
          },
          unit: {
            select: {
              name: true,
              symbol: true,
            },
          },
          prices: {
            where: {
              currency: currency,
              isActive: true,
            },
            take: 1,
          },
        },
      }),
      db.product.count({ where }),
    ]);
    
    // Add currency-specific pricing to products
    const productsWithPricing = products.map(product => {
      const priceInfo = product.prices[0] || {
        price: product.price,
        cost: product.cost,
      };
      
      return {
        ...product,
        currencyPrice: priceInfo.price,
        currencyCost: priceInfo.cost,
        currency,
      };
    });
    
    return NextResponse.json({
      products: productsWithPricing,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check permissions (ADMIN and MANAGER can create products)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const {
      name,
      description,
      sku,
      barcode,
      price,
      cost,
      stock,
      minStock,
      maxStock,
      categoryId,
      unitId,
      brandId,
      warrantyId,
      sellingPriceGroupId,
      imageUrl,
      prices, // Array of { currency, price, cost }
      isActive = true,
    } = body;
    
    // Validate input
    if (!name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }
    
    // Validate SKU and barcode uniqueness
    if (sku) {
      const existingProductWithSku = await db.product.findUnique({
        where: { sku },
      });
      
      if (existingProductWithSku) {
        return NextResponse.json({ error: 'Product with this SKU already exists' }, { status: 400 });
      }
    }
    
    if (barcode) {
      const existingProductWithBarcode = await db.product.findUnique({
        where: { barcode },
      });
      
      if (existingProductWithBarcode) {
        return NextResponse.json({ error: 'Product with this barcode already exists' }, { status: 400 });
      }
    }
    
    // Create product
    const product = await db.product.create({
      data: {
        name,
        description,
        sku,
        barcode,
        price,
        cost,
        stock: stock || 0,
        minStock: minStock || 0,
        maxStock: maxStock || 100,
        categoryId,
        unitId,
        brandId,
        warrantyId,
        sellingPriceGroupId,
        imageUrl,
        isActive,
      },
    });
    
    // Create currency-specific prices if provided
    if (prices && Array.isArray(prices)) {
      for (const priceInfo of prices) {
        if (priceInfo.currency && Object.values(Currency).includes(priceInfo.currency)) {
          await db.productPrice.create({
            data: {
              productId: product.id,
              currency: priceInfo.currency,
              price: priceInfo.price || price,
              cost: priceInfo.cost || cost,
              isActive: true,
            },
          });
        }
      }
    }
    
    return NextResponse.json(product);
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check permissions (ADMIN and MANAGER can update products)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const { id, prices, ...updateData } = body;
    
    // Validate input
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    // Validate SKU and barcode uniqueness (if changed)
    if (updateData.sku) {
      const existingProductWithSku = await db.product.findFirst({
        where: {
          sku: updateData.sku,
          NOT: { id },
        },
      });
      
      if (existingProductWithSku) {
        return NextResponse.json({ error: 'Product with this SKU already exists' }, { status: 400 });
      }
    }
    
    if (updateData.barcode) {
      const existingProductWithBarcode = await db.product.findFirst({
        where: {
          barcode: updateData.barcode,
          NOT: { id },
        },
      });
      
      if (existingProductWithBarcode) {
        return NextResponse.json({ error: 'Product with this barcode already exists' }, { status: 400 });
      }
    }
    
    // Update product
    const product = await db.product.update({
      where: { id },
      data: updateData,
    });
    
    // Update currency-specific prices if provided
    if (prices && Array.isArray(prices)) {
      // Deactivate all existing prices for this product
      await db.productPrice.updateMany({
        where: { productId: id },
        data: { isActive: false },
      });
      
      // Create or update new prices
      for (const priceInfo of prices) {
        if (priceInfo.currency && Object.values(Currency).includes(priceInfo.currency)) {
          // Check if price already exists for this currency
          const existingPrice = await db.productPrice.findFirst({
            where: {
              productId: id,
              currency: priceInfo.currency,
            },
          });
          
          if (existingPrice) {
            // Update existing price
            await db.productPrice.update({
              where: { id: existingPrice.id },
              data: {
                price: priceInfo.price,
                cost: priceInfo.cost,
                isActive: true,
              },
            });
          } else {
            // Create new price
            await db.productPrice.create({
              data: {
                productId: id,
                currency: priceInfo.currency,
                price: priceInfo.price,
                cost: priceInfo.cost,
                isActive: true,
              },
            });
          }
        }
      }
    }
    
    return NextResponse.json(product);
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can delete products
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const { id } = body;
    
    // Validate input
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    // Delete product
    await db.product.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}