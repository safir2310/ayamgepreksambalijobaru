import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all users (admin only)
export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Remove passwords from response
    const usersWithoutPasswords = users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json(usersWithoutPasswords)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
