'use client'

import { motion } from 'framer-motion'
import { Plus, Flame, Sparkles } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface ProductCardProps {
  id: string
  name: string
  description?: string
  price: number
  discountPrice?: number
  image?: string
  isPromotion?: boolean
  isNew?: boolean
  onAddToCart: (product: {
    productId: string
    name: string
    price: number
    discountPrice?: number
    quantity: number
    image?: string
  }) => void
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  discountPrice,
  image,
  isPromotion,
  isNew,
  onAddToCart,
}: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart({
      productId: id,
      name,
      price,
      discountPrice,
      quantity: 1,
      image,
    })
  }

  const hasDiscount = discountPrice && discountPrice < price

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        {/* Product Image */}
        <div className="relative w-full h-48 bg-gray-100">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-orange-100">
              <span className="text-4xl">🍗</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {isPromotion && (
              <Badge className="bg-red-500 text-white flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Promosi
              </Badge>
            )}
            {isNew && (
              <Badge className="bg-green-500 text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Baru
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-4">
          <h3 className="font-bold text-lg text-gray-800 mb-1">{name}</h3>
          {description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-orange-500">
                  Rp {discountPrice.toLocaleString('id-ID')}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  Rp {price.toLocaleString('id-ID')}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-orange-500">
                Rp {price.toLocaleString('id-ID')}
              </span>
            )}
          </div>
        </CardContent>

        {/* Add to Cart Button */}
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah ke Keranjang
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
