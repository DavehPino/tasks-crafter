import { motion } from "motion/react"
import { Star } from "lucide-react"
import type { Product } from '../schemas/product'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Props {
  product: Product;
  onSelect?: (product: Product) => void;
  index?: number;
}

export const ProductCard = ({ product, onSelect, index = 0 }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.3,
      delay: index * 0.05,
      ease: [0.23, 1, 0.32, 1]
    }}
  >
    <Card className="group relative overflow-hidden border-border/50 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-square flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted p-4 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-32 object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {/* Category Badge */}
        <Badge
          variant="secondary"
          className="absolute top-2 left-2 text-[10px] font-medium"
        >
          {product.category.replace(/['']/g, '')}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <h3
          className="font-semibold text-xs text-foreground line-clamp-2 h-8 leading-4"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Price & Rating */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground font-mono tabular-nums">
            ${product.price.toFixed(0)}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.rating.rate}</span>
          </div>
        </div>

        {/* Action Button */}
        {onSelect && (
          <Button
            variant="default"
            size="sm"
            className="w-full mt-2 h-8 text-xs"
            onClick={() => onSelect(product)}
          >
            Assign to Session
          </Button>
        )}
      </div>
    </Card>
  </motion.div>
)
