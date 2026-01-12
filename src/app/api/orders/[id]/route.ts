import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch a single order
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await db.order.findUnique({
      where: {
        id,
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

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PUT - Update order status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Valid statuses
    const validStatuses = [
      'MENUNGGU_PERSETUJUAN',
      'DISETUJUI',
      'SEDANG_DIPROSES',
      'SELESAI',
      'CANCEL',
    ]

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Get current order to check if status is changing to SELESAI
    const currentOrder = await db.order.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order status
    const order = await db.order.update({
      where: {
        id,
      },
      data: {
        status,
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

    // If order is completed, award points to user
    if (status === 'SELESAI' && currentOrder.status !== 'SELESAI') {
      // Award 1 point per 1000 rupiah
      const pointsToAward = Math.floor(currentOrder.totalAmount / 1000)

      await db.user.update({
        where: {
          id: currentOrder.userId,
        },
        data: {
          points: {
            increment: pointsToAward,
          },
        },
      })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
