import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProducts } from '../api/products'
import {
  fetchTasks,
  completeTask,
  deleteTask,
} from '../api/tasks'
import { ProductSelector } from '../components/ProductSelector'
import { SessionMetrics } from '../components/SessionMetrics'
import { ProductTimeline } from '../components/ProductTimeline'
import { Card } from '@/components/ui/card'
import type { Product } from '../schemas/product'

interface Props {
  onMandatoryStatusChange?: (canGoLive: boolean) => void
  onProductsSelected?: (products: Product[]) => void
}

export const SessionPrepPage = ({ onMandatoryStatusChange, onProductsSelected }: Props) => {
  const queryClient = useQueryClient()
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])
  const [expandedProductId, setExpandedProductId] = useState<number>()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

  // Fetch products
  const { data: products = [], isLoading: productsLoading, isError: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  })

  // Fetch tasks
  const { data: response = { tasks: [], pagination: { page: 1, limit: 100, total: 0, totalPages: 1 } } } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => fetchTasks(1),
  })

  const tasks = response.tasks || []

  // Mandatory tasks are always included (fetched from API on mount via bulk endpoint)
  const mandatoryTasks = useMemo(() => tasks.filter(t => t.isMandatory), [tasks])
  const allMandatoryCompleted = useMemo(
    () => mandatoryTasks.length > 0 && mandatoryTasks.every(t => t.status === 'completed'),
    [mandatoryTasks]
  )

  // Complete task mutation
  const completeMutation = useMutation({
    mutationFn: (id: string) => completeTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setSelected(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    },
  })

  // Compute metrics
  const selectedProducts = useMemo(
    () => products.filter(p => selectedProductIds.includes(p.id)),
    [products, selectedProductIds]
  )

  // Tasks for selected products (+ mandatory + manual tasks without productId)
  const tasksForSelectedProducts = useMemo(
    () => tasks.filter(t => t.isMandatory || !t.productId || (t.productId && selectedProductIds.includes(t.productId))),
    [tasks, selectedProductIds]
  )

  const productsWithAllTasksComplete = useMemo(() => {
    return selectedProductIds.filter(productId => {
      const productTasks = tasks.filter(t => t.productId === productId)
      if (productTasks.length === 0) return false
      return productTasks.every(t => t.status === 'completed')
    })
  }, [tasks, selectedProductIds])

  const completedTasksForSelected = useMemo(
    () => tasksForSelectedProducts.filter(t => t.status === 'completed').length,
    [tasksForSelectedProducts]
  )

  const isSessionReady =
    selectedProducts.length > 0 &&
    tasksForSelectedProducts.length > 0 &&
    completedTasksForSelected === tasksForSelectedProducts.length &&
    allMandatoryCompleted

  // Group tasks by product
  const productsWithTasks = useMemo(() => {
    return selectedProducts
      .map(product => ({
        product,
        tasks: tasks.filter(t => t.productId === product.id),
      }))
      .filter(({ tasks: pTasks }) => pTasks.length > 0)
  }, [selectedProducts, tasks])

  const handleConfirmSelection = (selectedProds: Product[]) => {
    onProductsSelected?.(selectedProds)
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 3000)
  }

  const handleToggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleToggleAll = () => {
    setSelected(prev => {
      const allSelected = tasksForSelectedProducts.every(t => prev.has(t.id))
      if (allSelected) return new Set()
      return new Set(tasksForSelectedProducts.map(t => t.id))
    })
  }

  // Notify parent when mandatory status changes
  useEffect(() => {
    onMandatoryStatusChange?.(allMandatoryCompleted)
  }, [allMandatoryCompleted, onMandatoryStatusChange])

  return (
    <div className="min-h-screen bg-background">
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Products added to simulated live session</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="mb-8 border-b border-border/50 pb-6"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Session Prep
          </h1>
          <p className="text-sm text-muted-foreground">
            Select products, auto-generate tasks, verify completion, and go live
          </p>
        </motion.div>

        {/* Metrics */}
        <SessionMetrics
          totalProducts={selectedProducts.length}
          readyProducts={productsWithAllTasksComplete.length}
          totalTasks={tasksForSelectedProducts.length}
          completedTasks={completedTasksForSelected}
          mandatoryCompleted={allMandatoryCompleted}
          isSessionReady={isSessionReady}
          sessionTasks={tasksForSelectedProducts}
          selectedTasks={selected}
          allSelected={
            tasksForSelectedProducts.length > 0 &&
            tasksForSelectedProducts.every(t => selected.has(t.id))
          }
          onToggleSelect={handleToggleSelect}
          onToggleAll={handleToggleAll}
          onComplete={(id) => completeMutation.mutate(id)}
          onUpdate={() => {}}
          onDelete={(id) => deleteMutation.mutate(id)}
          showProductInfo={selectedProducts.length > 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Product Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-3"
          >
            <Card className="p-6 border-border/50 bg-card">
              <ProductSelector
                products={products}
                isLoading={productsLoading}
                isError={productsError}
                onSelectionChange={setSelectedProductIds}
                onConfirmSelection={handleConfirmSelection}
              />
            </Card>
          </motion.div>

          {/* Right: Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <Card className="p-5 h-fit sticky top-24 border-border/50 bg-card">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-3">
                Stats
              </h3>
              <dl className="space-y-4 text-center">
                <div>
                  <dt className="text-xs text-muted-foreground mb-1">Products</dt>
                  <dd className="text-3xl font-bold text-foreground font-mono">
                    {selectedProducts.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground mb-1">Tasks</dt>
                  <dd className="text-3xl font-bold text-foreground font-mono">
                    {tasksForSelectedProducts.length}
                  </dd>
                </div>
                <div className="border-t border-border/50 pt-4">
                  <dt className="text-xs text-muted-foreground mb-1">Done</dt>
                  <dd className={`text-3xl font-bold font-mono ${completedTasksForSelected === tasksForSelectedProducts.length && tasksForSelectedProducts.length > 0 ? 'text-green-500' : 'text-foreground'}`}>
                    {completedTasksForSelected}/{tasksForSelectedProducts.length}
                  </dd>
                </div>
              </dl>
            </Card>
          </motion.div>
        </div>

        {/* Timeline and Tasks */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 space-y-6"
          >
            {/* Product Timeline */}
            {productsWithTasks.length > 0 && (
              <Card className="p-6 border-border/50 bg-card">
                <ProductTimeline
                  productsWithTasks={productsWithTasks}
                  expandedProductId={expandedProductId}
                  onToggleExpand={setExpandedProductId}
                />
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
