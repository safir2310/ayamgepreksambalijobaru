import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { compare } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    console.log('='.repeat(50))
    console.log('LOGIN REQUEST')
    console.log('='.repeat(50))
    console.log('Username:', username)
    console.log('='.repeat(50))

    const body = await request.json()
    const { username, password } = body

    // Log untuk debugging
    console.log('LOGIN REQUEST')
    console.log('='.repeat(50))
    console.log('Username:', username)
    console.log('='.repeat(50))

    // Validation 1: Cek field kosong
    if (!username || !password) {
      console.log('VALIDATION FAILED: Username atau password kosong')
      return NextResponse.json(
        { error: 'Username dan password harus diisi' },
        { status: 400 }
      )
    }

    // Validation 2: Username tidak kosong
    if (username.trim() === '') {
      console.log('VALIDATION FAILED: Username kosong setelah trim')
      return NextResponse.json(
        { error: 'Username tidak boleh kosong' },
        { status: 400 }
      )
    }

    // Validation 3: Password tidak kosong
    if (password.trim() === '') {
      console.log('VALIDATION FAILED: Password kosong setelah trim')
      return NextResponse.json(
        { error: 'Password tidak boleh kosong' },
        { status: 400 }
      )
    }

    // Find user by username
    console.log('CHECKING: User exists')
    const user = await db.user.findUnique({
      where: { username },
    })

    console.log('User found:', !!user)

    if (!user) {
      console.log('FAILED: User tidak ditemukan')
      return NextResponse.json(
        { error: 'Username tidak ditemukan. Pastikan username sudah benar.' },
        { status: 401 }
      )
    }

    console.log('SUCCESS: User ditemukan')
    console.log('User ID:', user.id)
    console.log('User Role:', user.role)

    // Compare password
    console.log('COMPARING: Password')
    const isValidPassword = await compare(password, user.password)

    if (!isValidPassword) {
      console.log('FAILED: Password salah')
      return NextResponse.json(
        { error: 'Password salah. Pastikan password sudah benar.' },
        { status: 401 }
      )
    }

    console.log('SUCCESS: Password cocok')
    console.log('='.repeat(50))

    // Return user data tanpa password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: 'Login berhasil',
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('='.repeat(50))
    console.error('LOGIN ERROR CATCH')
    console.error('='.repeat(50))
    console.error('Error:', error)
    console.error('Message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('='.repeat(50))

    return NextResponse.json(
      {
        error: 'Terjadi kesalahan saat login',
        details: error instanceof Error ? error.message : 'Kesalahan tidak diketahui',
      },
      { status: 500 }
    )
  }
}
