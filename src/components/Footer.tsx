'use client'

import { Facebook, Instagram, Phone, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  const storePhone = '085260812758'
  const storeAddress =
    'Jl. Medan - Banda Aceh, Simpang Camat, Gampong Tijue, Kec. Pidie, Kab. Pidie, 24151'

  const handlePhoneClick = () => {
    window.open(`https://wa.me/${storePhone}`, '_blank')
  }

  const handleInstagramClick = () => {
    window.open('https://instagram.com', '_blank')
  }

  const handleFacebookClick = () => {
    window.open('https://facebook.com', '_blank')
  }

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-auto bg-orange-500 text-white py-8 px-4"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Store Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">AYAM GEPREK SAMBAL IJO</h3>
            <p className="text-sm mb-4">Pedasnya Bikin Nagih!</p>
          </div>

          {/* Contact Information */}
          <div className="text-center md:text-left">
            <h4 className="font-bold mb-4">Kontak</h4>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handlePhoneClick}
              className="flex items-center justify-center md:justify-start gap-2 mb-2 text-white hover:text-orange-200 transition-colors"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{storePhone}</span>
            </motion.button>
            <div className="flex items-start justify-center md:justify-start gap-2 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-orange-100 text-left">
                {storeAddress}
              </span>
            </div>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-left">
            <h4 className="font-bold mb-4">Ikuti Kami</h4>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstagramClick}
                className="p-3 bg-orange-600 rounded-full hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <Instagram className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFacebookClick}
                className="p-3 bg-orange-600 rounded-full hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <Facebook className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-4 border-t border-orange-400 text-center text-sm text-orange-100"
        >
          <p>© {new Date().getFullYear()} AYAM GEPREK SAMBAL IJO. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  )
}
