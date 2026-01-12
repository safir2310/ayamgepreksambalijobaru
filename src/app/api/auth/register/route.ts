import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hash } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      username,
      password,
      email,
      phone,
      address,
      role,
      verificationCode,
      birthDate,
    } = body

    // Validation
    if (!username || !password || !email || !phone) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUsername = await db.user.findUnique({
      where: { username },
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username sudah digunakan' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await db.user.findUnique({
      where: { email },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email sudah digunakan' },
        { status: 400 }
      )
    }

    // Check if phone already exists
    const existingPhone = await db.user.findUnique({
      where: { phone },
    })

    if (existingPhone) {
      return NextResponse.json(
        { error: 'No HP sudah digunakan' },
        { status: 400 }
      )
    }

    // For admin registration, verify the code
    if (role === 'ADMIN') {
      if (!birthDate || !verificationCode) {
        return NextResponse.json(
          { error: 'Data tidak lengkap' },
          { status: 400 }
        )
      }

      // Verification code should match DDMMYY format
      const dateObj = new Date(birthDate)
      const dd = String(dateObj.getDate()).padStart(2, '0')
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
      const yy = String(dateObj.getFullYear()).slice(-2)
      const expectedCode = `${dd}${mm}${yy}`

      if (verificationCode !== expectedCode) {
        return NextResponse.json(
          { error: 'Gagal mendaftar' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        phone,
        address,
        role: role || 'USER',
      },
    })

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: 'Registrasi berhasil',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    )
  }
}
