import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Radio,
  AlertTriangle,
  ShoppingCart,
  Share2,
  MessageSquare,
  Settings,
  Camera,
  Wifi,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  canGoLive: boolean
}

export const LiveShoppingDialog = ({ open, onOpenChange, canGoLive }: Props) => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Start camera when streaming begins
  useEffect(() => {
    if (isStreaming && !isCameraOff) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [isStreaming, isCameraOff])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera access denied:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const handleStartStream = () => {
    setIsStreaming(true)
  }

  const handleEndStream = () => {
    setIsStreaming(false)
    setIsMuted(false)
    setIsCameraOff(false)
  }

  const handleClose = () => {
    handleEndStream()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[800px] lg:max-w-[1000px] p-0 gap-0 bg-background overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Radio className="h-5 w-5 text-terrific-orange" />
              Live Shopping Simulator
            </DialogTitle>
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <Badge variant="destructive" className="font-mono text-xs">
                  LIVE
                </Badge>
              </motion.div>
            )}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6">
          {!canGoLive ? (
            /* Not Ready State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-6">
                <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Cannot Start Live Session
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                You must complete all pre-session checklist items before starting
                a live shopping simulation. This ensures a smooth broadcast
                experience for your viewers.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Settings className="h-4 w-4" />
                <span>Complete tasks in the Pre-Session Checklist above</span>
              </div>
            </motion.div>
          ) : isStreaming ? (
            /* Streaming State */
            <div className="space-y-4">
              {/* Video Feed */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-video bg-black rounded-lg overflow-hidden"
              >
                {/* Video Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={cn(
                    "w-full h-full object-cover",
                    isCameraOff && "hidden"
                  )}
                />

                {/* Camera Off State */}
                {isCameraOff && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                    <Camera className="h-12 w-12 text-gray-600 mb-3" />
                    <span className="text-sm text-gray-500">Camera is off</span>
                  </div>
                )}

                {/* Viewfinder Frame */}
                <div className="absolute inset-4 pointer-events-none">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/50" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/50" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/50" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/50" />
                </div>

                {/* Live Badge */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-mono font-bold text-white">LIVE</span>
                  </div>
                </div>

                {/* Viewer Count */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded">
                    <Wifi className="h-3 w-3 text-green-400" />
                    <span className="text-xs font-mono text-white">1,247 watching</span>
                  </div>
                </div>

                {/* Product Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-black/70 backdrop-blur-sm rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-terrific-orange" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            Featured Product
                          </p>
                          <p className="text-xs text-gray-400">
                            Tap to view details
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-terrific-orange hover:bg-terrific-orange/90 text-white"
                      >
                        Buy Now - $99
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Controls Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-3"
              >
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  variant={isCameraOff ? "destructive" : "secondary"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setIsCameraOff(!isCameraOff)}
                >
                  {isCameraOff ? (
                    <VideoOff className="h-5 w-5" />
                  ) : (
                    <Video className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                >
                  <Share2 className="h-5 w-5" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>

                <div className="w-px h-8 bg-border mx-2" />

                <Button
                  variant="destructive"
                  size="lg"
                  className="px-6"
                  onClick={handleEndStream}
                >
                  <Phone className="h-4 w-4 mr-2 rotate-[135deg]" />
                  End Stream
                </Button>
              </motion.div>

              {/* Stream Stats */}
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Connected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Duration: 00:32:15</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>1,247 viewers</span>
                </div>
              </div>
            </div>
          ) : (
            /* Ready to Start State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                <Radio className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Ready to Go Live
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                All pre-session checks are complete. You can now start your live
                shopping simulation. Your camera and microphone will be activated.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-8 shadow-lg shadow-red-500/25"
                onClick={handleStartStream}
              >
                <Radio className="h-4 w-4 mr-2 animate-pulse" />
                Start Live Stream
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
