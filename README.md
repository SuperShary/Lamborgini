# 🚗 Lamborghini Aventador - Scroll Animation Website

> **Built with AI in Minutes** | A SuperShary Tutorial 🔥

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-FF0055?style=for-the-badge&logo=framer)

### 🔴 [Live Demo → lamborgini-mu.vercel.app](https://lamborgini-mu.vercel.app)

A stunning **Awwwards-level scrollytelling** landing page where the Lamborghini Aventador **explodes into parts** as you scroll! Built entirely using AI coding assistants - no manual coding required! 🤯

---

## 🎬 Watch the Tutorial

[![SuperShary YouTube](https://img.shields.io/badge/YouTube-SuperShary-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/@SuperSharyG63)

**Subscribe for more AI + Web Development tutorials!**

---

## ✨ Features

- 🎞️ **80-Frame Scroll Animation** - Car "explodes" into mechanical parts
- ⚡ **Buttery Smooth Performance** - HTML5 Canvas rendering
- 🎨 **Luxury Aesthetics** - Metallic text, glassmorphism, gradients
- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop
- ⏳ **Animated Preloader** - Diamond logo with progress bar
- 🧭 **Sticky Navigation** - Blur effect on scroll

---

## 🚀 Quick Start

```bash
# Clone this repo
git clone https://github.com/SuperShary/Lamborgini.git

# Install dependencies
cd Lamborgini
npm install

# Run locally
npm run dev

# Open http://localhost:3000
```

---

## 🤖 AI Prompts Used (Copy-Paste Ready!)

### The Master Prompt

This is the main prompt used to build the entire website:

```
ACT AS: A world-class Creative Developer (Awwwards-level) specializing 
in Next.js, Framer Motion, and high-performance 3D web interactions.

THE TASK: Build a high-end "Scrollytelling" landing page for the 
Lamborghini Aventador. The core mechanic is a scroll-linked animation 
that plays an image sequence of the car "exploding" (disassembling 
into its mechanical parts) as the user scrolls down.

TECH STACK:
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Animation: Framer Motion (using useScroll and useTransform)
- Rendering: HTML5 Canvas (Crucial for performance with 80 frames)

VISUAL DIRECTION & COLOR:
- Seamless Blending: The background must be Pure Black (#000000)
- Vibe: Ultra-modern, luxurious, "Anti-gravity" aesthetic
- Typography: Inter or Syncopate. Uppercase, tracking-widest, metallic silver/white

IMPLEMENTATION DETAILS:

The "Sticky" Canvas (CarScroll.tsx):
- Create a container with h-[500vh] (5x viewport height)
- Place a <canvas> element that is sticky, top-0, h-screen, w-full

The Scroll Logic:
- Load a sequence of 80 images from /frames/
- Naming convention: ezgif-frame-[001-080].jpg
- Use Framer Motion's useScroll to map scroll progress (0.0 to 1.0) 
  to image frame index (0 to 79)
- Draw the current frame to canvas on every scroll tick

Text Overlays (The Story):
- 0% Scroll: "THE AVENTADOR" (Large, Centered, Hero Title)
- 40% Scroll: "NATURALLY ASPIRATED FURY" + V12 specs (Left aligned)
- 90% Scroll: "BEYOND GRAVITY" (Centered, final impact)

Polish & Performance:
- Preloader: Add loading spinner that blocks until all 80 images cached
- Responsiveness: Ensure canvas uses object-fit: cover logic

OUTPUT: Generate the full code for page.tsx, CarScroll.tsx, and globals.css.
```

### Additional Enhancement Prompt

```
Build the complete website with:
- Navigation header with glassmorphism effect
- Specs grid section with 6 technical specifications
- Engineering Excellence section with 4 feature cards
- The Ultimae limited edition CTA section
- Premium footer with links
```

---

## 📁 Project Structure

```
Lamborgini/
├── app/
│   ├── components/
│   │   └── CarScroll.tsx    # Main scroll animation component
│   ├── globals.css          # Metallic effects, loader styles
│   ├── layout.tsx           # Root layout with SEO
│   └── page.tsx             # Home page
├── public/
│   └── frames/              # 80 car explosion images
│       ├── ezgif-frame-001.jpg
│       ├── ezgif-frame-002.jpg
│       └── ... (001-080)
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## 🖼️ Getting the Frame Images

### Method 1: Create Your Own (Recommended for uniqueness)

1. Find a 3D car explosion animation video
2. Use [ezgif.com](https://ezgif.com/video-to-jpg) to extract frames
3. Export as JPG with naming: `ezgif-frame-001.jpg` to `ezgif-frame-080.jpg`
4. Place in `/public/frames/`

### Method 2: Use AI Image Generation

Prompt for Midjourney/DALL-E:
```
Lamborghini Aventador exploding into mechanical parts, 
floating components, black background, studio lighting, 
8k, cinematic, technical illustration
```

---

## 🛠️ Tech Stack Explained

| Technology        | Purpose                          |
| ----------------- | -------------------------------- |
| **Next.js 14**    | React framework with App Router  |
| **Tailwind CSS**  | Utility-first styling            |
| **Framer Motion** | Scroll-linked animations         |
| **HTML5 Canvas**  | High-performance image rendering |

---

## 🎯 Key Concepts You'll Learn

1. **Scroll-Linked Animations** - `useScroll()` + `useTransform()`
2. **Canvas Rendering** - Drawing images with cover-fit logic
3. **Image Preloading** - Loading 80+ images before render
4. **Sticky Positioning** - CSS `position: sticky` magic
5. **Glassmorphism** - Modern backdrop-blur effects
6. **Metallic Text** - CSS gradient text effects

---

## 💡 Pro Tips

- **Black Background is Key** - Your frame images MUST have black backgrounds for seamless blending
- **Optimize Images** - Compress JPGs to ~50KB each for faster loading
- **Test on Mobile** - Always verify the responsive canvas works
- **Preloader is Crucial** - Without it, you'll see white flashes during scroll

---

## 🔗 Connect with SuperShary

- 📺 **YouTube**: [@SuperSharyG63](https://www.youtube.com/@SuperSharyG63)
- 🐦 **Twitter/X**: [@SuperShary](https://twitter.com/SuperShary)
- 💼 **LinkedIn**: [SuperShary](https://linkedin.com/in/supershary)

---

## ⭐ Support This Project

If this helped you build something awesome:

1. **Star this repo** ⭐
2. **Subscribe to SuperShary** 🔔
3. **Share with friends** 🚀

---

## 📄 License

MIT License - Use it for your projects, portfolios, or clients!

---

Made with 🖤 by **SuperShary** | Powered by AI ✨
