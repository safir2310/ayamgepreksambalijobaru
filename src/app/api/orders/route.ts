import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all orders (for admin) or user orders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId) {
      // Fetch user orders
      const orders = await db.order.findMany({
        where: {
          userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json(orders)
    } else {
      // Fetch all orders (admin)
      const orders = await db.order.findMany({
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json(orders)
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, items, totalAmount } = body

    if (!userId || !items || !totalAmount || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create order with items
    const order = await db.order.create({
      data: {
        userId,
        totalAmount: parseFloat(totalAmount),
        status: 'MENUNGGU_PERSETUJUAN',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
