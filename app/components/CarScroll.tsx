'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

const TOTAL_FRAMES = 80
const FRAME_PATH = '/frames/ezgif-frame-'

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

const specs = [
    { label: 'ENGINE', value: 'V12 6.5L', icon: '⚡' },
    { label: 'POWER', value: '780 CV', icon: '🔥' },
    { label: '0-100 KM/H', value: '2.8s', icon: '⏱️' },
    { label: 'TOP SPEED', value: '355 km/h', icon: '💨' },
    { label: 'TORQUE', value: '720 Nm', icon: '⚙️' },
    { label: 'WEIGHT', value: '1,525 kg', icon: '🪶' },
]

const features = [
    {
        title: 'CARBON FIBER MONOCOQUE',
        description: 'Revolutionary single-shell chassis for maximum rigidity and minimum weight.',
        gradient: 'from-amber-500/20 to-transparent',
    },
    {
        title: 'ACTIVE AERODYNAMICS',
        description: 'Adaptive rear wing and underbody flaps for optimal downforce at all speeds.',
        gradient: 'from-blue-500/20 to-transparent',
    },
    {
        title: 'ISR TRANSMISSION',
        description: 'Independent Shifting Rods gearbox with shift times under 50 milliseconds.',
        gradient: 'from-purple-500/20 to-transparent',
    },
    {
        title: 'MAGNETIC SUSPENSION',
        description: 'Magnetorheological dampers adapt in real-time to road conditions.',
        gradient: 'from-green-500/20 to-transparent',
    },
]

export default function CarScroll() {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imagesRef = useRef<HTMLImageElement[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [loadProgress, setLoadProgress] = useState(0)
    const [navScrolled, setNavScrolled] = useState(false)
    const currentFrameRef = useRef(0)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    })

    const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.95])

    const midOpacity = useTransform(scrollYProgress, [0.2, 0.28, 0.45, 0.52], [0, 1, 1, 0])
    const midX = useTransform(scrollYProgress, [0.2, 0.28], [-50, 0])

    const specsOpacity = useTransform(scrollYProgress, [0.5, 0.58, 0.72, 0.78], [0, 1, 1, 0])

    const finalOpacity = useTransform(scrollYProgress, [0.78, 0.88], [0, 1])
    const finalScale = useTransform(scrollYProgress, [0.78, 0.88], [0.9, 1])

    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const images = imagesRef.current

        if (!canvas || !ctx || !images.length) return

        const img = images[frameIndex]
        if (!img || !img.complete) return

        const dpr = window.devicePixelRatio || 1
        canvas.width = window.innerWidth * dpr
        canvas.height = window.innerHeight * dpr
        canvas.style.width = `${window.innerWidth}px`
        canvas.style.height = `${window.innerHeight}px`
        ctx.scale(dpr, dpr)

        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

        const imgRatio = img.width / img.height
        const canvasRatio = window.innerWidth / window.innerHeight

        let drawWidth, drawHeight, drawX, drawY

        if (imgRatio > canvasRatio) {
            drawHeight = window.innerHeight
            drawWidth = img.width * (window.innerHeight / img.height)
            drawX = (window.innerWidth - drawWidth) / 2
            drawY = 0
        } else {
            drawWidth = window.innerWidth
            drawHeight = img.height * (window.innerWidth / img.width)
            drawX = 0
            drawY = (window.innerHeight - drawHeight) / 2
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
    }, [])

    useEffect(() => {
        preloadImages((loaded, total) => {
            setLoadProgress(Math.round((loaded / total) * 100))
        }).then((images) => {
            imagesRef.current = images
            setIsLoaded(true)
            requestAnimationFrame(() => drawFrame(0))
        })
    }, [drawFrame])

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

    useEffect(() => {
        const handleResize = () => {
            if (isLoaded) {
                drawFrame(currentFrameRef.current)
            }
        }

        const handleScroll = () => {
            setNavScrolled(window.scrollY > 100)
        }

        window.addEventListener('resize', handleResize)
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [isLoaded, drawFrame])

    return (
        <>
            {/* Preloader */}
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mb-12"
                        >
                            <svg width="80" height="80" viewBox="0 0 100 100" className="text-amber-500">
                                <motion.polygon
                                    points="50,5 95,50 50,95 5,50"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <motion.polygon
                                    points="50,20 80,50 50,80 20,50"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    initial={{ pathLength: 0, rotate: 0 }}
                                    animate={{ pathLength: 1, rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    style={{ transformOrigin: 'center' }}
                                />
                            </svg>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xs tracking-[0.5em] text-white/40 uppercase mb-8"
                        >
                            Loading Experience
                        </motion.p>

                        <div className="w-64 h-[1px] bg-white/10 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"
                                initial={{ width: 0, x: '-100%' }}
                                animate={{ width: `${loadProgress}%`, x: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-4 text-3xl font-extralight tracking-[0.3em] text-white/80"
                        >
                            {loadProgress}<span className="text-amber-500">%</span>
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: isLoaded ? 0 : -100 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navScrolled ? 'bg-black/80 backdrop-blur-xl' : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border border-amber-500 rotate-45 flex items-center justify-center">
                            <div className="w-3 h-3 bg-amber-500 rotate-45" />
                        </div>
                        <span className="text-sm tracking-[0.3em] font-light text-white uppercase hidden sm:block">
                            Lamborghini
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-12">
                        {['Heritage', 'Performance', 'Design', 'Configure'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-xs tracking-[0.2em] text-white/60 hover:text-amber-500 transition-colors uppercase"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    <button className="group relative px-6 py-3 overflow-hidden">
                        <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-500 transition-transform duration-300 group-hover:scale-105" />
                        <span className="relative text-xs tracking-[0.2em] text-black uppercase font-medium">
                            Book Test Drive
                        </span>
                    </button>
                </div>
            </motion.nav>

            {/* Main scroll container */}
            <div
                ref={containerRef}
                className="relative h-[500vh] bg-black"
            >
                <canvas
                    ref={canvasRef}
                    className="sticky top-0 left-0 w-full h-screen"
                />

                <div className="absolute inset-0 pointer-events-none">
                    {/* Hero Title */}
                    <motion.div
                        style={{ opacity: heroOpacity, scale: heroScale }}
                        className="sticky top-0 h-screen flex flex-col items-center justify-center px-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: isLoaded ? 0.1 : 0, scale: isLoaded ? 1 : 0 }}
                            transition={{ delay: 0.3, duration: 1.5 }}
                            className="absolute w-[600px] h-[600px] rounded-full bg-gradient-radial from-amber-500/20 to-transparent blur-3xl"
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-xs md:text-sm tracking-[0.5em] text-amber-500/80 uppercase mb-6 font-light"
                        >
                            Automobili Lamborghini Presents
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                            transition={{ delay: 0.7, duration: 1 }}
                            className="text-5xl md:text-7xl lg:text-[10rem] font-display font-bold tracking-[0.1em] md:tracking-[0.2em] text-metallic glow-text text-center leading-none"
                        >
                            AVENTADOR
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isLoaded ? 1 : 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="mt-6 text-lg md:text-xl tracking-[0.3em] text-white/50 uppercase font-extralight"
                        >
                            LP 780-4 Ultimae
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: isLoaded ? 1 : 0, scaleX: isLoaded ? 1 : 0 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="mt-12 flex items-center gap-4"
                        >
                            <div className="w-16 md:w-24 h-[1px] bg-gradient-to-r from-transparent to-amber-500" />
                            <span className="text-xs tracking-[0.3em] text-white/30 uppercase">Scroll</span>
                            <div className="w-16 md:w-24 h-[1px] bg-gradient-to-l from-transparent to-amber-500" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isLoaded ? 1 : 0 }}
                            transition={{ delay: 1.5, duration: 0.8 }}
                            className="absolute bottom-12 flex flex-col items-center"
                        >
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-6 h-10 border border-white/20 rounded-full flex items-start justify-center p-2"
                            >
                                <motion.div
                                    className="w-1 h-2 bg-amber-500 rounded-full"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Mid Section - Engine */}
                    <motion.div
                        style={{ opacity: midOpacity, x: midX }}
                        className="sticky top-0 h-screen flex items-center"
                    >
                        <div className="ml-6 md:ml-16 lg:ml-24 max-w-xl">
                            <p className="text-amber-500 text-xs tracking-[0.5em] uppercase mb-6 font-light">
                                The Heart of the Beast
                            </p>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-wider text-metallic glow-text leading-none">
                                NATURALLY
                                <br />
                                ASPIRATED
                                <br />
                                <span className="text-gold">FURY</span>
                            </h2>
                            <div className="mt-8 w-20 h-[2px] bg-gradient-to-r from-amber-500 to-transparent" />

                            <div className="mt-8 space-y-4">
                                <p className="text-xl md:text-2xl font-light tracking-widest text-white/90">
                                    V12 ARCHITECTURE
                                </p>
                                <p className="text-3xl md:text-4xl font-bold tracking-wider text-white">
                                    780 CV <span className="text-amber-500 text-xl">@</span> 8,500 RPM
                                </p>
                            </div>

                            <p className="mt-6 text-sm md:text-base text-white/40 font-light leading-relaxed max-w-md">
                                A 6.5-liter masterpiece of Italian engineering. No turbos. No superchargers.
                                Just pure, unadulterated atmospheric power screaming to 8,500 revolutions
                                per minute. The last of its kind.
                            </p>

                            <div className="mt-8 flex gap-8">
                                <div>
                                    <p className="text-2xl md:text-3xl font-bold text-white">2.8s</p>
                                    <p className="text-xs tracking-wider text-white/40 uppercase">0-100 km/h</p>
                                </div>
                                <div>
                                    <p className="text-2xl md:text-3xl font-bold text-white">355</p>
                                    <p className="text-xs tracking-wider text-white/40 uppercase">km/h top speed</p>
                                </div>
                                <div>
                                    <p className="text-2xl md:text-3xl font-bold text-white">720</p>
                                    <p className="text-xs tracking-wider text-white/40 uppercase">Nm torque</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Specs Grid */}
                    <motion.div
                        style={{ opacity: specsOpacity }}
                        className="sticky top-0 h-screen flex items-center justify-center px-4"
                    >
                        <div className="max-w-5xl w-full">
                            <div className="text-center mb-12">
                                <p className="text-amber-500 text-xs tracking-[0.5em] uppercase mb-4 font-light">
                                    Technical Excellence
                                </p>
                                <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wider text-metallic">
                                    SPECIFICATIONS
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {specs.map((spec, i) => (
                                    <motion.div
                                        key={spec.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative p-6 md:p-8 border border-white/10 hover:border-amber-500/50 transition-all duration-500 bg-white/[0.02] backdrop-blur-sm"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-2xl md:text-3xl mb-3 block">{spec.icon}</span>
                                        <p className="text-2xl md:text-3xl font-bold text-white mb-2">{spec.value}</p>
                                        <p className="text-xs tracking-[0.2em] text-white/40 uppercase">{spec.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Final Section */}
                    <motion.div
                        style={{ opacity: finalOpacity, scale: finalScale }}
                        className="sticky top-0 h-screen flex flex-col items-center justify-center px-4"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 0.15 }}
                            className="absolute w-[800px] h-[800px] rounded-full bg-gradient-radial from-amber-500/30 to-transparent blur-3xl"
                        />

                        <p className="text-amber-500 text-xs tracking-[0.5em] uppercase mb-8 font-light">
                            Engineered For Those Who Dare
                        </p>

                        <h2 className="text-5xl md:text-7xl lg:text-9xl font-display font-bold tracking-[0.1em] md:tracking-[0.2em] text-metallic glow-text text-center leading-none">
                            BEYOND
                            <br />
                            <span className="text-gold">GRAVITY</span>
                        </h2>

                        <div className="mt-10 w-32 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

                        <p className="mt-10 text-sm md:text-lg text-white/40 font-light tracking-wider max-w-lg text-center leading-relaxed">
                            Every component. Every bolt. Every curve.
                            <br />
                            Meticulously crafted to defy the impossible.
                        </p>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="pointer-events-auto mt-12 group relative px-10 py-4 overflow-hidden border border-amber-500/50 hover:border-amber-500"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative text-sm tracking-[0.3em] text-amber-500 group-hover:text-black uppercase font-medium transition-colors">
                                Configure Your Aventador
                            </span>
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <section className="relative bg-black py-32 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <p className="text-amber-500 text-xs tracking-[0.5em] uppercase mb-4 font-light">
                            Innovation Without Compromise
                        </p>
                        <h2 className="text-4xl md:text-6xl font-display font-bold tracking-wider text-metallic">
                            ENGINEERING
                            <br />
                            <span className="text-gold">EXCELLENCE</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className={`group relative p-8 md:p-12 border border-white/10 hover:border-amber-500/30 transition-all duration-500 bg-gradient-to-br ${feature.gradient}`}
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 border-r border-t border-white/5 group-hover:border-amber-500/20 transition-colors" />
                                <span className="text-6xl md:text-7xl font-bold text-white/5 absolute top-4 right-4">
                                    0{i + 1}
                                </span>
                                <h3 className="text-xl md:text-2xl font-display font-bold tracking-wider text-white mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-white/50 font-light leading-relaxed">
                                    {feature.description}
                                </p>
                                <div className="mt-6 w-12 h-[2px] bg-gradient-to-r from-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ultimae Section */}
            <section className="relative bg-black py-32 px-6 md:px-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <p className="text-amber-500 text-xs tracking-[0.5em] uppercase mb-4 font-light">
                            Limited to 600 Units Worldwide
                        </p>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-wider text-metallic mb-8">
                            THE ULTIMAE
                        </h2>
                        <p className="text-white/40 font-light max-w-2xl mx-auto leading-relaxed mb-12">
                            The final chapter of the Aventador saga. A collector&apos;s dream.
                            A tribute to twelve cylinders of naturally aspirated perfection
                            that will never be replicated.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button className="group relative px-10 py-4 overflow-hidden bg-gradient-to-r from-amber-600 to-amber-500">
                                <span className="relative text-sm tracking-[0.3em] text-black uppercase font-medium">
                                    Request Information
                                </span>
                            </button>
                            <button className="group relative px-10 py-4 overflow-hidden border border-white/20 hover:border-white/50 transition-colors">
                                <span className="text-sm tracking-[0.3em] text-white uppercase font-light">
                                    View Gallery
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative bg-black border-t border-white/5 py-16 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 border border-amber-500 rotate-45 flex items-center justify-center">
                                    <div className="w-3 h-3 bg-amber-500 rotate-45" />
                                </div>
                                <span className="text-sm tracking-[0.3em] font-light text-white uppercase">
                                    Lamborghini
                                </span>
                            </div>
                            <p className="text-xs text-white/40 font-light leading-relaxed">
                                Automobili Lamborghini S.p.A.
                                <br />
                                Via Modena, 12
                                <br />
                                40019 Sant&apos;Agata Bolognese, Italy
                            </p>
                        </div>

                        {[
                            { title: 'Models', links: ['Huracán', 'Urus', 'Revuelto', 'Aventador'] },
                            { title: 'Experience', links: ['Motorsport', 'Events', 'Museum', 'Factory Tour'] },
                            { title: 'Company', links: ['About', 'Careers', 'Sustainability', 'Press'] },
                        ].map((col) => (
                            <div key={col.title}>
                                <h4 className="text-xs tracking-[0.3em] text-white/60 uppercase mb-6">
                                    {col.title}
                                </h4>
                                <ul className="space-y-3">
                                    {col.links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-sm text-white/40 hover:text-amber-500 transition-colors font-light">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-xs text-white/30 font-light">
                            © 2026 Automobili Lamborghini S.p.A. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            {['Privacy', 'Terms', 'Cookies'].map((item) => (
                                <a key={item} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
