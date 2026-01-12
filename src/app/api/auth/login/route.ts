import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { compare } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    console.log('='.repeat(50))
    console.log('LOGIN API')
    console.log('='.repeat(50))

    const body = await request.json()
    console.log('RAW REQUEST BODY:', body)

    const { username, password } = body

    console.log('PARSED CREDENTIALS:')
    console.log('Username:', username)
    console.log('Password:', password ? '***' : '(empty or undefined)')

    // Validation 1: Cek field kosong
    if (!username || !password) {
      console.log('VALIDATION FAILED: Username atau password kosong')
      return NextResponse.json(
        { error: 'Username dan password harus diisi' },
        { status: 400 }
      )
    }

    // Validation 2: Username tidak boleh kosong setelah trim
    if (username.trim() === '') {
      console.log('VALIDATION FAILED: Username kosong setelah trim')
      return NextResponse.json(
        { error: 'Username tidak boleh kosong' },
        { status: 400 }
      )
    }

    // Validation 3: Password tidak boleh kosong setelah trim
    if (password.trim() === '') {
      console.log('VALIDATION FAILED: Password kosong setelah trim')
      return NextResponse.json(
        { error: 'Password tidak boleh kosong' },
        { status: 400 }
      )
    }

    // Validation 4: Username minimal 3 karakter
    if (username.length < 3) {
      console.log('VALIDATION FAILED: Username terlalu pendek')
      return NextResponse.json(
        { error: 'Username minimal 3 karakter' },
        { status: 400 }
      )
    }

    // Validation 5: Password minimal 6 karakter
    if (password.length < 6) {
      console.log('VALIDATION FAILED: Password terlalu pendek')
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Check 1: Cek user exists di database
    console.log('CHECKING: User exists in database')
    const user = await db.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        points: true,
      },
    })

    if (!user) {
      console.log('FAILED: User tidak ditemukan')
      console.log('Username yang dicari:', username)
      return NextResponse.json(
        { error: `Username "${username}" tidak ditemukan. Pastikan username sudah benar.` },
        { status: 401 }
      )
    }

    console.log('SUCCESS: User ditemukan')
    console.log('User ID:', user.id)
    console.log('User Role:', user.role)
    console.log('User Email:', user.email)

    // Check 2: Compare password
    console.log('COMPARING: Password hash')
    console.log('Input password length:', password.length)

    let isValidPassword = false
    try {
      isValidPassword = await compare(password, user.password)
      console.log('Password comparison result:', isValidPassword)
    } catch (compareError) {
      console.error('ERROR: Password comparison failed:', compareError)
      console.error('Error type:', compareError instanceof Error ? compareError.name : 'Unknown')
      console.error('Error message:', compareError instanceof Error ? compareError.message : 'No message')

      return NextResponse.json(
        { error: 'Gagal memproses login. Terjadi kesalahan saat memvalidasi password.' },
        { status: 500 }
      )
    }

    if (!isValidPassword) {
      console.log('FAILED: Password salah')
      return NextResponse.json(
        { error: 'Password salah. Pastikan password sudah benar.' },
        { status: 401 }
      )
    }

    console.log('SUCCESS: Login berhasil')
    console.log('User logged in:', user.username)
    console.log('User role:', user.role)

    // Return user data tanpa password
    const { password: _, ...userWithoutPassword } = user

    console.log('='.repeat(50))
    console.log('LOGIN SUCCESSFUL')
    console.log('='.repeat(50))

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: 'Login berhasil! Selamat datang kembali.',
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('='.repeat(50))
    console.error('LOGIN ERROR CATCH')
    console.error('='.repeat(50))
    console.error('Error:', error)
    console.error('Error Type:', error instanceof Error ? error.constructor.name : 'Unknown')
    console.error('Error Message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error Stack:', error instanceof Error ? error.stack : 'No stack trace available')
    console.error('='.repeat(50))

    return NextResponse.json(
      {
        error: 'Terjadi kesalahan saat login',
        details: error instanceof Error ? {
          message: error.message,
          type: error.name,
          stack: error.stack,
        } : 'Kesalahan tidak diketahui',
      },
      { status: 500 }
    )
  }
}
