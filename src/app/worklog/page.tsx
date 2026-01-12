import { readFile } from 'fs/promises'
import { join } from 'path'

export default async function WorklogPage() {
  try {
    const worklogPath = join(process.cwd(), 'worklog.md')
    const content = await readFile(worklogPath, 'utf-8')

    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-4">
            Worklog - AYAM GEPREK SAMBAL IJO
          </h1>
          <div className="prose max-w-none bg-gray-50 p-6 rounded-lg overflow-auto max-h-[70vh]">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
              {content}
            </pre>
          </div>
          <div className="mt-6">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Kembali ke Halaman Utama
            </a>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Memuat Worklog
          </h1>
          <p className="text-gray-600 mb-6">
            Terjadi kesalahan saat membuka file worklog.md
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
          >
            Kembali ke Halaman Utama
          </a>
        </div>
      </div>
    )
  }
}
