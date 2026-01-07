'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const TOTAL_FRAMES = 80
const FRAME_PATH = '/frames/ezgif-frame-'

// Preload all images and return array of loaded Image objects
const preloadImages = (
    onProgress: (loaded: number, total: number) => void
): Promise<HTMLImageElement[]> => {
    return new Promise((resolve) => {
        const images: HTMLImageElement[] = []
        let loadedCount = 0

        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image()
            const frameNumber = String(i).padStart(3, '0')
            img.src = `${FRAME_PATH}${frameNumber}.jpg`

            img.onload = () => {
                loadedCount++
                onProgress(loadedCount, TOTAL_FRAMES)
                if (loadedCount === TOTAL_FRAMES) {
                    resolve(images)
                }
            }

            img.onerror = () => {
                loadedCount++
                onProgress(loadedCount, TOTAL_FRAMES)
                if (loadedCount === TOTAL_FRAMES) {
                    resolve(images)
                }
            }

            images[i - 1] = img
        }
    })
}

export default function CarScroll() {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imagesRef = useRef<HTMLImageElement[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [loadProgress, setLoadProgress] = useState(0)
    const currentFrameRef = useRef(0)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    })

    // Map scroll progress to text opacities
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95])

    const midOpacity = useTransform(scrollYProgress, [0.25, 0.35, 0.55, 0.65], [0, 1, 1, 0])
    const midX = useTransform(scrollYProgress, [0.25, 0.35], [-50, 0])

    const finalOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1])
    const finalScale = useTransform(scrollYProgress, [0.75, 0.85], [0.9, 1])

    // Draw frame to canvas with cover-fit logic
    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const images = imagesRef.current

        if (!canvas || !ctx || !images.length) return

        const img = images[frameIndex]
        if (!img || !img.complete) return

        // Set canvas size to match window
        const dpr = window.devicePixelRatio || 1
        canvas.width = window.innerWidth * dpr
        canvas.height = window.innerHeight * dpr
        canvas.style.width = `${window.innerWidth}px`
        canvas.style.height = `${window.innerHeight}px`
        ctx.scale(dpr, dpr)

        // Clear canvas
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

        // Calculate cover dimensions
        const imgRatio = img.width / img.height
        const canvasRatio = window.innerWidth / window.innerHeight

        let drawWidth, drawHeight, drawX, drawY

        if (imgRatio > canvasRatio) {
            // Image is wider - fit height
            drawHeight = window.innerHeight
            drawWidth = img.width * (window.innerHeight / img.height)
            drawX = (window.innerWidth - drawWidth) / 2
            drawY = 0
        } else {
            // Image is taller - fit width
            drawWidth = window.innerWidth
            drawHeight = img.height * (window.innerWidth / img.width)
            drawX = 0
            drawY = (window.innerHeight - drawHeight) / 2
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
    }, [])

    // Preload images on mount
    useEffect(() => {
        preloadImages((loaded, total) => {
            setLoadProgress(Math.round((loaded / total) * 100))
        }).then((images) => {
            imagesRef.current = images
            setIsLoaded(true)
            // Draw first frame
            requestAnimationFrame(() => drawFrame(0))
        })
    }, [drawFrame])

    // Handle scroll animation
    useEffect(() => {
        if (!isLoaded) return

        const unsubscribe = scrollYProgress.on('change', (progress) => {
            const frameIndex = Math.min(
                TOTAL_FRAMES - 1,
                Math.floor(progress * TOTAL_FRAMES)
            )

            if (frameIndex !== currentFrameRef.current) {
                currentFrameRef.current = frameIndex
                requestAnimationFrame(() => drawFrame(frameIndex))
            }
        })

        return () => unsubscribe()
    }, [isLoaded, scrollYProgress, drawFrame])

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (isLoaded) {
                drawFrame(currentFrameRef.current)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isLoaded, drawFrame])

    return (
        <>
            {/* Preloader */}
            {!isLoaded && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
                    <div className="loader relative mb-8" />
                    <p className="text-sm tracking-[0.3em] text-white/60 uppercase font-light">
                        Loading Experience
                    </p>
                    <p className="mt-2 text-2xl font-light tracking-widest text-white">
                        {loadProgress}%
                    </p>
                    <div className="mt-6 w-48 h-[2px] bg-white/10 overflow-hidden rounded-full">
                        <motion.div
                            className="h-full bg-gradient-to-r from-amber-500 to-yellow-300"
                            initial={{ width: 0 }}
                            animate={{ width: `${loadProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            )}

            {/* Main scroll container */}
            <div
                ref={containerRef}
                className="relative h-[500vh] bg-black"
            >
                {/* Sticky canvas */}
                <canvas
                    ref={canvasRef}
                    className="sticky top-0 left-0 w-full h-screen"
                />

                {/* Text overlays */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Hero Title - 0% scroll */}
                    <motion.div
                        style={{ opacity: heroOpacity, scale: heroScale }}
                        className="sticky top-0 h-screen flex flex-col items-center justify-center"
                    >
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-sm md:text-base tracking-[0.4em] text-white/50 uppercase mb-4 font-light"
                        >
                            Introducing
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                            transition={{ delay: 0.7, duration: 1 }}
                            className="text-5xl md:text-7xl lg:text-9xl font-display font-bold tracking-[0.2em] md:tracking-[0.3em] text-metallic glow-text text-center"
                        >
                            THE AVENTADOR
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: isLoaded ? 1 : 0, scaleX: isLoaded ? 1 : 0 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="mt-8 w-32 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                        />
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isLoaded ? 1 : 0 }}
                            transition={{ delay: 1.5, duration: 0.8 }}
                            className="mt-6 text-xs md:text-sm tracking-[0.5em] text-white/30 uppercase"
                        >
                            Scroll to explore
                        </motion.p>
                    </motion.div>

                    {/* Mid Section - 40% scroll */}
                    <motion.div
                        style={{ opacity: midOpacity, x: midX }}
                        className="sticky top-0 h-screen flex items-center"
                    >
                        <div className="ml-8 md:ml-16 lg:ml-24 max-w-lg">
                            <p className="text-amber-500 text-xs md:text-sm tracking-[0.4em] uppercase mb-4 font-light">
                                The Heart
                            </p>
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-wider text-metallic glow-text leading-tight">
                                NATURALLY
                                <br />
                                ASPIRATED
                                <br />
                                <span className="text-gold">FURY</span>
                            </h2>
                            <div className="mt-6 md:mt-8 w-16 md:w-24 h-[2px] bg-gradient-to-r from-amber-500 to-transparent" />
                            <p className="mt-6 md:mt-8 text-lg md:text-xl lg:text-2xl font-light tracking-widest text-white/80">
                                V12 ARCHITECTURE
                            </p>
                            <p className="mt-2 text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-white">
                                780 CV <span className="text-white/40 text-lg md:text-xl">@</span> 8,500 RPM
                            </p>
                            <p className="mt-4 text-sm md:text-base text-white/40 font-light leading-relaxed max-w-sm">
                                A 6.5-liter masterpiece. No turbos. No superchargers.
                                Pure atmospheric power screaming to 8,500 revolutions.
                            </p>
                        </div>
                    </motion.div>

                    {/* Final Section - 90% scroll */}
                    <motion.div
                        style={{ opacity: finalOpacity, scale: finalScale }}
                        className="sticky top-0 h-screen flex flex-col items-center justify-center"
                    >
                        <p className="text-amber-500 text-xs md:text-sm tracking-[0.4em] uppercase mb-6 font-light">
                            Engineered for
                        </p>
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-[0.2em] md:tracking-[0.3em] text-metallic glow-text text-center">
                            BEYOND
                            <br />
                            <span className="text-gold">GRAVITY</span>
                        </h2>
                        <div className="mt-8 w-32 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                        <p className="mt-8 text-sm md:text-base text-white/40 font-light tracking-wider max-w-md text-center">
                            Every component. Every bolt. Every curve.
                            <br />
                            Designed to defy the impossible.
                        </p>
                    </motion.div>
                </div>
            </div>
        </>
    )
}
