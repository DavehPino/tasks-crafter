import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Product } from '../schemas/product'
import { ProductCard } from './ProductCard'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ProductCardSkeleton } from './skeletons/ProductCardSkeleton'
import { AlertCircle, Sparkles } from 'lucide-react'

interface Props {
  products: Product[]
  isLoading: boolean
  isError: boolean
  onSelectionChange: (selectedProductIds: number[]) => void
  onConfirmSelection: (products: Product[]) => void
}

export const ProductSelector = ({
  products,
  isLoading,
  isError,
  onSelectionChange,
  onConfirmSelection,
}: Props) => {
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const handleToggleProduct = (productId: number) => {
    const newSelected = new Set(selected)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelected(newSelected)
    onSelectionChange(Array.from(newSelected))
  }

  const handleSelectAll = () => {
    if (selected.size === products.length) {
      setSelected(new Set())
      onSelectionChange([])
    } else {
      setSelected(new Set(products.map(p => p.id)))
      onSelectionChange(products.map(p => p.id))
    }
  }

  const handleConfirmSelection = () => {
    const selectedProducts = products.filter(p => selected.has(p.id))
    onConfirmSelection(selectedProducts)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-border/50 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Products
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select items to prepare for session
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selected.size === products.length && products.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-xs text-muted-foreground">All</span>
          </div>
          <Badge variant="secondary" className="font-mono">
            {selected.size}/{products.length}
          </Badge>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <ProductCardSkeleton key={i} index={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20"
        >
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">
            Error loading products. Make sure the API is running.
          </p>
        </motion.div>
      )}

      {/* Products Grid */}
      {products && products.length > 0 && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {products.map((product, index) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} index={index} />
                <label className="absolute top-2 right-2 z-10">
                  <Checkbox
                    checked={selected.has(product.id)}
                    onCheckedChange={() => handleToggleProduct(product.id)}
                    className="h-5 w-5 bg-white/90 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground shadow-sm"
                  />
                </label>
              </div>
            ))}
          </div>

          {/* Generate Button */}
          <AnimatePresence>
            {selected.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex gap-3 pt-2"
              >
                <Button
                  onClick={handleConfirmSelection}
                  variant="terrific"
                  size="lg"
                  className="flex-1 h-11"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Add to Live Session ({selected.size})
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
