import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch store profile
export async function GET() {
  try {
    const profiles = await db.storeProfile.findMany()

    if (profiles.length === 0) {
      // Return default profile if none exists
      return NextResponse.json([])
    }

    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Error fetching store profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch store profile' },
      { status: 500 }
    )
  }
}

// POST - Create or update store profile
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slogan, address, phone, instagram, facebook } = body

    // Check if profile already exists
    const existingProfile = await db.storeProfile.findFirst()

    if (existingProfile) {
      // Update existing profile
      const profile = await db.storeProfile.update({
        where: {
          id: existingProfile.id,
        },
        data: {
          name,
          slogan,
          address,
          phone,
          instagram,
          facebook,
        },
      })

      return NextResponse.json(profile)
    } else {
      // Create new profile
      const profile = await db.storeProfile.create({
        data: {
          name,
          slogan,
          address,
          phone,
          instagram,
          facebook,
        },
      })

      return NextResponse.json(profile, { status: 201 })
    }
  } catch (error) {
    console.error('Error saving store profile:', error)
    return NextResponse.json(
      { error: 'Failed to save store profile' },
      { status: 500 }
    )
  }
}
