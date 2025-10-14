# Rules.md - Portfolio DevOps Lofi Design System

## 🎨 Color Palette

### Primary Colors
```
Primary Background:      #0a0e27 (Deep navy blue)
Secondary Background:    #1a1f3a (Dark blue-gray)
Cards Background:        #0f172a (Slate 900)
Overlays Background:     rgba(15, 23, 42, 0.9) (Slate 900/90)
```

### Neon Accents
```
Main Cyan:               #22d3ee (rgb(34, 211, 238))
Cyan Hover:              #06b6d4 (rgb(6, 182, 212))
Main Purple:             #a855f7 (rgb(168, 85, 247))
Dark Purple:             #7c3aed (rgb(124, 58, 237))
Flashy Pink:             #ec4899 (rgb(236, 72, 153))
Bright Pink:             #ff6ec7 (rgb(255, 110, 199))
Matrix Green:            #00ff41 (rgb(0, 255, 65))
Terminal Green:          #10b981 (rgb(16, 185, 129))
```

### Text Colors
```
Main Text:               #e2e8f0 (Cyan 50)
Secondary Text:          #94a3b8 (Slate 400)
Disabled Text:           #64748b (Slate 500)
Terminal Text:           #22d3ee (Cyan)
Code Text:               #a855f7 (Purple)
```

### Borders & Shadows
```
Cyan Border:             border-cyan-500/30    (rgba(34, 211, 238, 0.3))
Purple Border:           border-purple-500/30  (rgba(168, 85, 247, 0.3))
Pink Border:             border-pink-500/30    (rgba(236, 72, 153, 0.3))

Cyan Shadow:             shadow-cyan-500/20
Purple Shadow:           shadow-purple-500/20
Pink Shadow:             shadow-pink-500/20
```

### Gradients
```css
/* Main background */
background: linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a);

/* CTA Buttons */
background: linear-gradient(to right, #22d3ee, #a855f7);
background: linear-gradient(to right, #06b6d4, #7c3aed); /* Hover */

/* Progress bars */
background: linear-gradient(to right, #22d3ee, #a855f7);

/* Animated accents */
background: radial-gradient(circle, #22d3ee, transparent); /* Cyan blob */
background: radial-gradient(circle, #a855f7, transparent); /* Purple blob */
```

---

## 🔤 Typography

### Main Fonts

**Google Fonts to import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

### Hierarchy
```
Sans-Serif Font (Text):  'Inter', -apple-system, sans-serif
Monospace Font (Code):   'Fira Code', 'Space Mono', 'Courier New', monospace
```

### Sizes & Weights
```
Hero Title:              text-5xl md:text-7xl, font-bold (700-900)
Section Title:           text-3xl md:text-4xl, font-bold (700)
Card Title:              text-xl md:text-2xl, font-semibold (600)
Body Text:               text-base md:text-lg, font-normal (400)
Small Text:              text-sm, font-normal (400)
Terminal Text:           text-sm md:text-base, font-mono (400)
Code Snippets:           text-xs md:text-sm, font-mono (500)
```

### Line Heights
```
Headings:    leading-tight (1.25)
Body:        leading-relaxed (1.625)
Code:        leading-normal (1.5)
Terminal:    leading-snug (1.375)
```

---

## 🎭 Tech Elements to Integrate

### 1. Interactive Terminal
**Features:**
- Background: `#0f172a` (Slate 900)
- Border: 2px solid cyan/50
- Header: Traffic light buttons (red, yellow, green)
- Prompt: `visitor@portfolio:~$` in green (#10b981)
- Cursor: Blinking cyan block (`▊`)
- Scroll bar: Custom neon cyan

**Suggested Commands:**
```bash
help, whoami, ls, pwd, cat, clear, neofetch, htop, docker ps, kubectl get pods
```

### 2. Docker Containers Style
**Design:**
- Cards with header container ID (8 characters)
- Status indicator: pulsing green circle
- Display port mappings
- Scrollable console logs
- Hover: Border glow effect

**Structure:**
```
CONTAINER ID   IMAGE          STATUS      PORTS
a3f5d9e2       nginx:latest   Up 24h      80:80
```

### 3. Monitoring Dashboard
**Metrics to show:**
- Uptime (real time)
- Projects Count
- GitHub Commits
- Coffee Consumed
- Code Lines Written
- Docker Containers Running

**Style:**
- Cards with neon border
- Lucide React icons
- Numbers in large mono font
- Incremental counter animation

### 4. Animated Code Snippets
**Features:**
- Syntax highlighting (Prism.js or highlight.js)
- Typewriter effect (delay 50-100ms/char)
- Line numbers
- Copy button on hover
- Theme: Dracula or Monokai neon-adapted

**Languages to show:**
```yaml
Dockerfile, docker-compose.yml, bash scripts, Python, YAML (CI/CD), Terraform
```

### 5. Neon Charts
**Types:**
- Progress bars (skills)
- Radar chart (skills)
- Line chart (GitHub activity)
- Bar chart (projects by tech)

**Libraries:**
- Recharts (recommended)
- Chart.js
- D3.js (advanced)

**Style:**
- Lines: Cyan/Purple gradient
- Points: Neon glow circles
- Grid: Dotted gray lines (#334155)
- Labels: Mono font, cyan

---

## ✨ Animations & Effects

### Hover Effects
```css
/* Neon glow */
.hover-glow:hover {
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.5);
  border-color: #22d3ee;
  transition: all 0.3s ease;
}

/* Glitch */
@keyframes glitch {
  0%, 100% { transform: translate(0); }
  25% { transform: translate(-2px, 2px); }
  50% { transform: translate(2px, -2px); }
  75% { transform: translate(-2px, -2px); }
}

/* Neon pulse */
@keyframes neon-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Scanline */
@keyframes scanline {
  from { transform: translateY(-100%); }
  to { transform: translateY(100vh); }
}

/* Typing cursor */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

### Transitions
```
Buttons:        0.3s ease-in-out
Borders:        0.3s ease
Shadows:        0.3s cubic-bezier(0.4, 0, 0.2, 1)
Colors:         0.2s ease
Transforms:     0.4s cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Scroll Animations
```
Section entry: fade-up (opacity 0→1, translateY 30px→0)
Element delay: 0.1s stagger
Duration: 0.6s ease-out
Trigger: IntersectionObserver (threshold: 0.2)
```

---

## 🎯 Micro-interactions

### Custom Cursor
```css
cursor: crosshair; /* For tech sections */
cursor: url('data:image/svg+xml;utf8,<svg>...</svg>'), auto; /* Custom neon */
```

### Buttons
**States:**
- Default: Gradient cyan→purple, 2px border
- Hover: Scale 1.05, glow shadow
- Active: Scale 0.98
- Focus: Cyan ring 2px

### Links
```css
text-decoration: none;
position: relative;
color: #22d3ee;

/* Animated underline */
&::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, #22d3ee, #a855f7);
  transition: width 0.3s ease;
}

&:hover::after {
  width: 100%;
}
```

### Cards
```
Default: border-cyan-500/30
Hover: border-cyan-500, shadow-lg shadow-cyan-500/20
Click: Reveal hidden content (logs, details)
```

---

## 📐 Layout & Spacing

### Container Widths
```
Full width:       w-full
Content:          max-w-7xl mx-auto (1280px)
Cards:            max-w-5xl mx-auto (1024px)
Text:             max-w-3xl mx-auto (768px)
```

### Padding & Margins
```
Sections:         py-16 md:py-24
Cards:            p-6 md:p-8
Buttons:          px-6 py-3
Text blocks:      mb-4
Headings:         mb-8 md:mb-12
```

### Grid Systems
```
2 columns:        grid md:grid-cols-2 gap-6
3 columns:        grid md:grid-cols-3 gap-6
4 columns:        grid md:grid-cols-2 lg:grid-cols-4 gap-4
Auto-fit:         grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))]
```

### Breakpoints (Tailwind)
```
sm:  640px   (Mobile landscape)
md:  768px   (Tablet)
lg:  1024px  (Desktop)
xl:  1280px  (Large desktop)
2xl: 1536px  (Extra large)
```

---

## 🎨 Specific UI Components

### Terminal Window
```jsx
<div className="bg-slate-900/90 border-2 border-cyan-500/50 rounded-lg">
  {/* Header */}
  <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-red-500"></div>
    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
    <div className="w-3 h-3 rounded-full bg-green-500"></div>
    <span className="ml-4 text-sm text-gray-400 font-mono">terminal</span>
  </div>
  {/* Content */}
  <div className="p-6 font-mono text-sm h-96 overflow-y-auto">
    {/* Terminal content */}
  </div>
</div>
```

### Status Badge
```jsx
<span className="flex items-center gap-2 text-sm">
  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
  running
</span>
```

### Neon Button
```jsx
<button className="
  bg-gradient-to-r from-cyan-500 to-purple-500
  hover:from-cyan-400 hover:to-purple-400
  text-white font-bold py-3 px-8 rounded
  transition-all duration-300
  shadow-lg shadow-purple-500/30
  hover:shadow-xl hover:shadow-purple-500/50
  hover:scale-105
  active:scale-95
">
  Deploy
</button>
```

### Progress Bar
```jsx
<div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
  <div 
    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-1000"
    style={{ width: `${percentage}%` }}
  ></div>
</div>
```

### Card Container
```jsx
<div className="
  bg-slate-900/80 backdrop-blur-sm
  border-2 border-purple-500/30
  hover:border-purple-500
  rounded-lg p-6
  transition-all duration-300
  hover:shadow-lg hover:shadow-purple-500/20
  cursor-pointer
">
  {/* Content */}
</div>
```

---

## 🎭 Easter Eggs & Features

### Console Messages
```javascript
console.log('%c🚀 Welcome to Vladimir\'s Portfolio', 'color: #22d3ee; font-size: 20px; font-weight: bold;');
console.log('%c💡 Try the Konami Code (↑↑↓↓←→←→BA)', 'color: #a855f7; font-size: 14px;');
console.log('%c🔧 Built with React + Coffee ☕', 'color: #10b981; font-size: 12px;');
```

### Konami Code
```
Sequence: ↑ ↑ ↓ ↓ ← → ← → B A
Effect: Matrix rain, background flip, secret message
```

### Terminal Easter Eggs
```bash
matrix           # Matrix effect fullscreen
coffee           # ASCII art coffee animation
sudo rm -rf /    # Joke warning message
hack             # Fake hacking sequence
rickroll         # You know what this is
konami           # Alternative Konami trigger
```

### Hidden Commands
```bash
whoami --god-mode     # Special status
ls -la /.secrets      # Hidden files
cat /dev/urandom      # Random characters
echo $SECRET_MESSAGE  # Hidden message
fortune               # Random quote
```

---

## 🌟 Recommended Sections

### 1. Hero / Landing
**Elements:**
- Large interactive terminal
- Avatar with neon glow border
- Tagline typewriter effect
- Gradient CTA buttons
- Floating particles background

### 2. About / Timeline
**Elements:**
- Vertical timeline with neon nodes
- Icons for milestones (42, projects, certs)
- Expandable cards on click
- Skills chart (radar chart)

### 3. Projects / Docker Containers
**Elements:**
- 2-column grid
- Container cards with status
- Toggle console logs
- Tech stack badges
- GitHub/Live links with icons

### 4. Skills / Tech Stack
**Elements:**
- Bento grid or progress bars
- Tech icons (Docker, K8s, etc.)
- Expertise percentage
- Hover for details/certifications

### 5. Experience / Deployments
**Elements:**
- Horizontal scrollable timeline
- Job/project cards with dates
- Bullet points achievements
- Technologies used (badges)

### 6. Blog / DevOps Logs (Optional)
**Elements:**
- Article cards styled as logs
- Date + read time
- Tech tags
- Excerpt with "Read more"

### 7. Contact / Deploy Request
**Elements:**
- CLI-style form
- Inputs with `--flag` labels
- Button `./send_message.sh`
- Neon social links with icons
- Obfuscated email (anti-spam)

### 8. Footer / Shutdown
**Elements:**
- Neon separator line
- Copyright with ASCII art
- Social links
- "Made with ❤️ and ☕"
- Version number (joke)

---

## 🔧 Technical Configurations

### Tailwind Config Additions
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#22d3ee',
          purple: '#a855f7',
          pink: '#ec4899',
          green: '#00ff41'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'Space Mono', 'Courier New', 'monospace'],
        sans: ['Inter', '-apple-system', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        glow: {
          'from': { boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)' },
          'to': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.8)' }
        }
      }
    }
  }
}
```

### Custom Scrollbar
```css
/* index.css */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #0f172a;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #22d3ee, #a855f7);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #06b6d4, #7c3aed);
}
```

### Selection Color
```css
::selection {
  background: rgba(34, 211, 238, 0.3);
  color: #e2e8f0;
}

::-moz-selection {
  background: rgba(34, 211, 238, 0.3);
  color: #e2e8f0;
}
```

---

## 📱 Responsive Rules

### Mobile First Approach
```
Base styles: Mobile (< 640px)
Progressively enhance: md:, lg:, xl:
Touch targets: min 44x44px
Font size: Base 14px mobile, 16px desktop
```

### Breakpoint Strategy
```
Mobile:        Single column, stacked content
Tablet (md):   2 columns grid, larger fonts
Desktop (lg):  3-4 columns, full features
XL (xl):       Max width constraints, optimal reading
```

### Navigation
```
Mobile:        Hamburger menu with overlay
Tablet/Desktop: Fixed top horizontal nav
```

---

## ✅ Design Quality Checklist

**Consistency:**
- [ ] Same color family (cyan/purple/pink)
- [ ] Uniform border thickness (2px)
- [ ] Consistent radius (rounded-lg = 8px)
- [ ] Spacing system respected (4, 6, 8, 12, 16, 24)

**Accessibility:**
- [ ] Text/background contrast > 4.5:1
- [ ] Visible focus states (ring-2)
- [ ] Alt text on images
- [ ] Aria labels on buttons
- [ ] Functional keyboard navigation

**Performance:**
- [ ] Optimized images (WebP)
- [ ] Lazy loading sections
- [ ] Code splitting
- [ ] Minimal bundle size
- [ ] Lighthouse score > 90

**Polish:**
- [ ] Smooth animations (60fps)
- [ ] Loading states everywhere
- [ ] Error states handled
- [ ] Designed empty states
- [ ] Consistent transitions

---

## 🎨 Inspiration & References

**DevOps Portfolios:**
- Lars Olson (clean, minimal)
- Bruno Simon (creative, interactive)
- Brittany Chiang (developer focus)

**Lofi Styles:**
- Synthwave aesthetics
- Cyberpunk 2077 UI
- Terminal-based portfolios
- Retrowave graphics

**Color Schemes:**
- Dracula Theme
- Monokai Pro
- Nord Aurora
- Cyberpunk Neon

---

**Version:** 1.0  
**Last update:** October 2025  
**Author:** Vladimir - DevOps Portfolio Design System