import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all users
export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        points: true,
        createdAt: true,
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, email, phone, role } = body

    const user = await db.user.create({
      data: {
        username,
        password,
        email,
        phone,
        role: role || 'USER',
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
