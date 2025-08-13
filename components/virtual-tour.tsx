"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Video,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import type { VirtualTour as VirtualTourType } from "@/lib/types"

interface VirtualTourProps {
  tour: VirtualTourType
  propertyTitle: string
  onClose?: () => void
  className?: string
}

export default function VirtualTour({ tour, propertyTitle, onClose, className }: VirtualTourProps) {
  const [currentView, setCurrentView] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const currentTourView = tour.views[currentView]

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          navigateView("prev")
          break
        case "ArrowRight":
          navigateView("next")
          break
        case "Escape":
          if (isFullscreen) {
            exitFullscreen()
          } else if (onClose) {
            onClose()
          }
          break
        case " ":
          e.preventDefault()
          togglePlayback()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentView, isFullscreen, onClose])

  const navigateView = (direction: "prev" | "next") => {
    setIsLoading(true)
    if (direction === "prev") {
      setCurrentView((prev) => Math.max(0, prev - 1))
    } else {
      setCurrentView((prev) => Math.min(tour.views.length - 1, prev + 1))
    }

    // Simulate loading time
    setTimeout(() => setIsLoading(false), 500)
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    // In a real implementation, this would control auto-rotation or video playback
  }

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      if (direction === "in") {
        return Math.min(3, prev + 0.2)
      } else {
        return Math.max(0.5, prev - 0.2)
      }
    })
  }

  const resetView = () => {
    setZoom(1)
    setRotation(0)
  }

  const handleRotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360)
  }

  if (!tour.enabled || tour.views.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Virtual Tour Not Available</h3>
          <p className="text-gray-600">This property doesn't have a virtual tour yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Virtual Tour
            </CardTitle>
            <CardDescription>Explore {propertyTitle} with our 360° virtual tour</CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Main Tour Viewer */}
          <div
            ref={containerRef}
            className={`relative bg-gray-100 rounded-lg overflow-hidden ${
              isFullscreen ? "fixed inset-0 z-50 bg-black" : "aspect-video"
            }`}
          >
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
              </div>
            )}

            {/* Main Image/Panorama */}
            <img
              ref={imageRef}
              src={currentTourView?.image || "/placeholder.svg"}
              alt={currentTourView?.name}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                cursor: zoom > 1 ? "grab" : "default",
              }}
              draggable={false}
            />

            {/* Tour Controls Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-black/50 text-white border-0">
                    <Video className="h-3 w-3 mr-1" />
                    360° Tour
                  </Badge>
                  <Badge variant="secondary" className="bg-black/50 text-white border-0">
                    {currentView + 1} / {tour.views.length}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-black/50 text-white border-0 hover:bg-black/70"
                    onClick={togglePlayback}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-black/50 text-white border-0 hover:bg-black/70"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-black/50 text-white border-0 hover:bg-black/70"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-black/50 text-white border-0 hover:bg-black/70"
                  onClick={() => navigateView("prev")}
                  disabled={currentView === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-black/50 text-white border-0 hover:bg-black/70"
                  onClick={() => navigateView("next")}
                  disabled={currentView === tour.views.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2">
                  <span className="text-white bg-black/50 px-3 py-1 rounded text-sm font-medium">
                    {currentTourView?.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-black/50 text-white border-0 hover:bg-black/70"
                    onClick={() => handleZoom("out")}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-black/50 text-white border-0 hover:bg-black/70"
                    onClick={() => handleZoom("in")}
                    disabled={zoom >= 3}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-black/50 text-white border-0 hover:bg-black/70"
                    onClick={resetView}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Room Navigation Thumbnails */}
          {!isFullscreen && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tour.views.map((view, index) => (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(index)}
                  className={`flex-shrink-0 relative rounded-lg overflow-hidden w-20 h-16 border-2 transition-all ${
                    currentView === index
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={view.image || "/placeholder.svg"} alt={view.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                    <div className="text-white text-xs font-medium text-center truncate">{view.name}</div>
                  </div>
                  {currentView === index && <div className="absolute inset-0 bg-blue-500/20" />}
                </button>
              ))}
            </div>
          )}

          {/* Tour Information */}
          {!isFullscreen && (
            <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
              <div className="flex items-center gap-4">
                <span>Use mouse to look around</span>
                <span>•</span>
                <span>Arrow keys to navigate</span>
                <span>•</span>
                <span>Space to play/pause</span>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Video className="h-3 w-3" />
                {tour.provider === "matterport" ? "Matterport" : "360° Tour"}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
