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

    // Log untuk debugging
    console.log('='.repeat(50))
    console.log('REGISTER REQUEST')
    console.log('='.repeat(50))
    console.log('Role:', role)
    console.log('Username:', username)
    console.log('Email:', email)
    console.log('Phone:', phone)
    console.log('Address:', address || '(User - Tidak ada)')
    console.log('Birth Date:', birthDate || '(User - Tidak ada)')
    console.log('Verification Code:', verificationCode || '(User - Tidak ada)')
    console.log('='.repeat(50))

    // Validation 1: Cek field kosong
    if (!username || !password || !email || !phone) {
      console.log('VALIDATION FAILED: Required fields kosong')
      return NextResponse.json(
        { error: 'Semua field wajib diisi: username, password, email, no HP' },
        { status: 400 }
      )
    }

    // Validation 2: Username minimal 3 karakter
    if (username.length < 3) {
      console.log('VALIDATION FAILED: Username terlalu pendek')
      return NextResponse.json(
        { error: 'Username minimal 3 karakter' },
        { status: 400 }
      )
    }

    // Validation 3: Password minimal 6 karakter
    if (password.length < 6) {
      console.log('VALIDATION FAILED: Password terlalu pendek')
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Validation 4: Email valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('VALIDATION FAILED: Email tidak valid')
      return NextResponse.json(
        { error: 'Format email tidak valid. Contoh: user@email.com' },
        { status: 400 }
      )
    }

    // Validation 5: No HP minimal 10 digit
    if (phone.length < 10) {
      console.log('VALIDATION FAILED: No HP terlalu pendek')
      return NextResponse.json(
        { error: 'No HP minimal 10 digit. Contoh: 08123456789' },
        { status: 400 }
      )
    }

    // Check 1: Cek username sudah ada
    console.log('CHECKING: Username uniqueness')
    const existingUsername = await db.user.findUnique({
      where: { username },
    })

    if (existingUsername) {
      console.log('FAILED: Username sudah ada:', existingUsername.username)
      return NextResponse.json(
        { error: `Username "${username}" sudah digunakan, silakan gunakan username lain` },
        { status: 400 }
      )
    }

    console.log('PASSED: Username unik')

    // Check 2: Cek email sudah ada
    console.log('CHECKING: Email uniqueness')
    const existingEmail = await db.user.findUnique({
      where: { email },
    })

    if (existingEmail) {
      console.log('FAILED: Email sudah ada:', existingEmail.email)
      return NextResponse.json(
        { error: `Email "${email}" sudah digunakan, silakan gunakan email lain` },
        { status: 400 }
      )
    }

    console.log('PASSED: Email unik')

    // Check 3: Cek no HP sudah ada
    console.log('CHECKING: Phone uniqueness')
    const existingPhone = await db.user.findUnique({
      where: { phone },
    })

    if (existingPhone) {
      console.log('FAILED: No HP sudah ada:', existingPhone.phone)
      return NextResponse.json(
        { error: `No HP "${phone}" sudah digunakan, silakan gunakan no HP lain` },
        { status: 400 }
      )
    }

    console.log('PASSED: No HP unik')

    // Admin verification
    if (role === 'ADMIN') {
      console.log('ADMIN REGISTRATION: Verifikasi kode')
      console.log('='.repeat(50))

      // Check admin data lengkap
      if (!birthDate || !verificationCode) {
        console.log('FAILED: Data admin tidak lengkap')
        return NextResponse.json(
          { error: 'Data tidak lengkap. Admin harus mengisi tanggal lahir dan kode verifikasi' },
          { status: 400 }
        )
      }

      // Verification code harus 6 digit
      if (verificationCode.length !== 6) {
        console.log('FAILED: Kode verifikasi harus 6 digit')
        return NextResponse.json(
          { error: 'Kode verifikasi harus 6 digit. Contoh: 150590' },
          { status: 400 }
        )
    }

    // Verification code harus numeric
    if (!/^\d{6}$/.test(verificationCode)) {
      console.log('FAILED: Kode verifikasi harus angka 6 digit')
      return NextResponse.json(
        { error: 'Kode verifikasi harus berupa 6 digit angka. Contoh: 150590' },
        { status: 400 }
      )
    }

      // Parsing tanggal lahir
      console.log('PARSING: Tanggal lahir:', birthDate)

      let dateObj: Date
      try {
        dateObj = new Date(birthDate)
        console.log('Parsed date:', dateObj.toISOString())

        if (isNaN(dateObj.getTime())) {
          console.log('FAILED: Tanggal lahir invalid')
          return NextResponse.json(
            { error: 'Format tanggal lahir tidak valid. Pastikan format YYYY-MM-DD atau MM/DD/YYYY' },
            { status: 400 }
          )
        }
      } catch (dateError) {
        console.log('FAILED: Tanggal lahir parse error:', dateError)
        return NextResponse.json(
          { error: 'Gagal memproses tanggal lahir. Pastikan format tanggal benar' },
          { status: 400 }
        )
      }

      const dd = String(dateObj.getDate()).padStart(2, '0')
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
      const yy = String(dateObj.getFullYear()).slice(-2)
      const expectedCode = `${dd}${mm}${yy}`

      console.log('EXPECTED CODE:', expectedCode)
      console.log('PROVIDED CODE:', verificationCode)

      if (verificationCode !== expectedCode) {
        console.log('FAILED: Kode verifikasi tidak cocok')
        return NextResponse.json(
          { error: `Kode verifikasi salah! Expected: ${expectedCode} (DDMMYY dari tanggal lahir Anda). Provided: ${verificationCode}. Pastikan format tanggal lahir benar.` },
          { status: 400 }
        )
      }

      console.log('PASSED: Kode verifikasi cocok!')
    }

    // Hash password
    console.log('HASHING: Password...')
    const hashedPassword = await hash(password, 10)
    console.log('Password hashed successfully')

    // Create user di database
    console.log('CREATING: User di database...')
    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        phone,
        address: address || null,
        role: role || 'USER',
      },
    })

    console.log('SUCCESS: User created with ID:', user.id)

    // Return user data tanpa password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: 'Registrasi berhasil! Silakan login untuk melanjutkan.',
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('='.repeat(50))
    console.error('REGISTRATION ERROR CATCH')
    console.error('='.repeat(50))
    console.error('Error:', error)
    console.error('Message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('='.repeat(50))

    return NextResponse.json(
      {
        error: 'Terjadi kesalahan saat registrasi',
        details: error instanceof Error ? error.message : 'Kesalahan tidak diketahui',
      },
      { status: 500 }
    )
  }
}
