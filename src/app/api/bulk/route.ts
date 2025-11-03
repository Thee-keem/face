import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BoltAuth } from '@/lib/boltAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Papa from 'papaparse'

interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

interface CustomSession {
  user: SessionUser;
  expires: string;
}

// POST /api/bulk/import - Import data from CSV
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN and MANAGER can import data)
    if (session.user && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user?.id || '', session.user?.role || '')

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const entityType = formData.get('entityType') as string
    
    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }
    
    if (!entityType) {
      return NextResponse.json({ error: 'Entity type is required' }, { status: 400 })
    }
    
    // Convert file to text
    const text = await file.text()
    
    // Parse CSV
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true
    })
    
    if (parsed.errors.length > 0) {
      return NextResponse.json({ error: 'Error parsing CSV file', details: parsed.errors }, { status: 400 })
    }
    
    let results: any[] = []
    let errors: any[] = []
    
    // Process based on entity type
    switch (entityType) {
      case 'products':
        for (const row of parsed.data as any[]) {
          try {
            // Validate required fields
            if (!row.name) {
              errors.push({ row, error: 'Name is required' })
              continue
            }
            
            // Check if product with same SKU or barcode already exists
            if (row.sku) {
              // Check if product exists by SKU
              const existingProduct = await db.product.findUnique({
                where: { sku: row.sku }
              });
              
              if (existingProduct) {
                // Update existing product
                const product = await db.product.update({
                  where: { id: existingProduct.id },
                  data: {
                    name: row.name,
                    description: row.description || existingProduct.description,
                    sku: row.sku || existingProduct.sku,
                    barcode: row.barcode || existingProduct.barcode,
                    price: row.price ? parseFloat(row.price) : existingProduct.price,
                    cost: row.cost ? parseFloat(row.cost) : existingProduct.cost,
                    stock: row.stock ? parseInt(row.stock) : existingProduct.stock,
                    minStock: row.minStock ? parseInt(row.minStock) : existingProduct.minStock,
                    maxStock: row.maxStock ? parseInt(row.maxStock) : existingProduct.maxStock,
                    isActive: row.isActive !== 'false',
                    categoryId: row.categoryId || existingProduct.categoryId,
                    imageUrl: row.imageUrl || existingProduct.imageUrl
                  }
                });
                results.push({ action: 'updated', product });
                continue;
              }
            } else if (row.barcode) {
              // Check if product exists by barcode
              const existingProduct = await db.product.findUnique({
                where: { barcode: row.barcode }
              });
              
              if (existingProduct) {
                // Update existing product
                const product = await db.product.update({
                  where: { id: existingProduct.id },
                  data: {
                    name: row.name,
                    description: row.description || existingProduct.description,
                    sku: row.sku || existingProduct.sku,
                    barcode: row.barcode || existingProduct.barcode,
                    price: row.price ? parseFloat(row.price) : existingProduct.price,
                    cost: row.cost ? parseFloat(row.cost) : existingProduct.cost,
                    stock: row.stock ? parseInt(row.stock) : existingProduct.stock,
                    minStock: row.minStock ? parseInt(row.minStock) : existingProduct.minStock,
                    maxStock: row.maxStock ? parseInt(row.maxStock) : existingProduct.maxStock,
                    isActive: row.isActive !== 'false',
                    categoryId: row.categoryId || existingProduct.categoryId,
                    imageUrl: row.imageUrl || existingProduct.imageUrl
                  }
                });
                results.push({ action: 'updated', product });
                continue;
              }
            }
            
            // If no SKU or barcode, or product doesn't exist, create new product
            const product = await db.product.create({
              data: {
                name: row.name,
                description: row.description || null,
                sku: row.sku || null,
                barcode: row.barcode || null,
                price: parseFloat(row.price) || 0,
                cost: parseFloat(row.cost) || 0,
                stock: parseInt(row.stock) || 0,
                minStock: parseInt(row.minStock) || 0,
                maxStock: parseInt(row.maxStock) || 100,
                isActive: row.isActive !== 'false',
                categoryId: row.categoryId || null,
                imageUrl: row.imageUrl || null
              }
            });
            results.push({ action: 'created', product });

          } catch (error) {
            errors.push({ row, error: (error as Error).message })
          }
        }
        break
        
      case 'categories':
        for (const row of parsed.data as any[]) {
          try {
            // Validate required fields
            if (!row.name) {
              errors.push({ row, error: 'Name is required' })
              continue
            }
            
            // Check if category with same name already exists
            const existingCategory = await db.category.findUnique({
              where: { name: row.name }
            })
            
            if (existingCategory) {
              // Update existing category
              const category = await db.category.update({
                where: { id: existingCategory.id },
                data: {
                  description: row.description || existingCategory.description
                }
              })
              results.push({ action: 'updated', category })
            } else {
              // Create new category
              const category = await db.category.create({
                data: {
                  name: row.name,
                  description: row.description || null
                }
              })
              results.push({ action: 'created', category })
            }
          } catch (error) {
            errors.push({ row, error: (error as Error).message })
          }
        }
        break
        
      default:
        return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 })
    }
    
    return NextResponse.json({
      message: 'Import completed',
      results,
      errors
    })
  } catch (error) {
    console.error('Error importing data:', error)
    return NextResponse.json({ error: 'Failed to import data' }, { status: 500 })
  }
}

// GET /api/bulk/export?entityType=... - Export data to CSV
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType')
    
    if (!entityType) {
      return NextResponse.json({ error: 'Entity type is required' }, { status: 400 })
    }
    
    let data: any[] = []
    let fields: string[] = []
    
    // Export based on entity type
    switch (entityType) {
      case 'products':
        const products = await db.product.findMany({
          include: {
            category: {
              select: {
                name: true
              }
            }
          }
        })
        
        data = products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          sku: product.sku,
          barcode: product.barcode,
          price: product.price,
          cost: product.cost,
          stock: product.stock,
          minStock: product.minStock,
          maxStock: product.maxStock,
          isActive: product.isActive,
          categoryId: product.categoryId,
          categoryName: product.category?.name || '',
          imageUrl: product.imageUrl,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString()
        }))
        
        fields = [
          'id', 'name', 'description', 'sku', 'barcode', 'price', 'cost', 
          'stock', 'minStock', 'maxStock', 'isActive', 'categoryId', 
          'categoryName', 'imageUrl', 'createdAt', 'updatedAt'
        ]
        break
        
      case 'categories':
        const categories = await db.category.findMany()
        
        data = categories.map(category => ({
          id: category.id,
          name: category.name,
          description: category.description,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString()
        }))
        
        fields = ['id', 'name', 'description', 'createdAt', 'updatedAt']
        break
        
      default:
        return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 })
    }
    
    // Convert to CSV
    const csv = Papa.unparse({
      fields,
      data: data.map(item => fields.map(field => item[field]))
    })
    
    // Return CSV response
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=${entityType}-${new Date().toISOString().split('T')[0]}.csv`
      }
    })
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}