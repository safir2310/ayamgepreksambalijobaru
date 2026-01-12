import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all products
export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create a new product (Admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      image,
      isPromotion,
      isNew,
    } = body

    // Validation
    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        category,
        image,
        isPromotion: isPromotion || false,
        isNew: isNew || false,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
