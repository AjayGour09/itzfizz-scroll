
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const headline = 'WELCOME ITZFIZZ'

const stats = [
  { value: '58%', label: 'Increase in pick up point use' },
  { value: '23%', label: 'Decrease in customer phone calls' },
  { value: '27%', label: 'Increase in pick up point use' },
  { value: '40%', label: 'Decrease in customer phone calls' },
]

function Car() {
  return (
    <svg viewBox="0 0 220 100" role="img" aria-label="Illustrated sports car">
      <defs>
        <linearGradient id="bodyPaint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f0e8" />
          <stop offset="48%" stopColor="#a7aca0" />
          <stop offset="100%" stopColor="#444940" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#53605a" />
          <stop offset="100%" stopColor="#171c19" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="53" rx="99" ry="35" fill="#c8ff37" opacity=".09" />

      <g fill="#080908" stroke="#555a50" strokeWidth="1.5">
        <rect x="32" y="13" width="25" height="22" rx="6" />
        <rect x="163" y="13" width="25" height="22" rx="6" />
        <rect x="32" y="65" width="25" height="22" rx="6" />
        <rect x="163" y="65" width="25" height="22" rx="6" />
      </g>

      <path
        d="M20 50 L31 32 Q40 26 56 25 L73 13 Q85 7 110 7 Q135 7 147 13 L164 25 Q180 26 189 32 L200 50 L189 68 Q180 74 164 75 L147 87 Q135 93 110 93 Q85 93 73 87 L56 75 Q40 74 31 68 Z"
        fill="url(#bodyPaint)"
        stroke="#e6e8df"
        strokeWidth="1.5"
      />

      <path
        d="M58 29 L78 17 Q89 12 110 12 Q131 12 142 17 L162 29 L153 42 L67 42 Z"
        fill="url(#glass)"
        stroke="#777e72"
        strokeWidth="1"
      />

      <path
        d="M67 59 L153 59 L162 72 L142 83 Q131 88 110 88 Q89 88 78 83 L58 72 Z"
        fill="url(#glass)"
        stroke="#777e72"
        strokeWidth="1"
      />

      <path d="M110 13 L110 41 M110 60 L110 87" stroke="#8c9488" strokeWidth="1" />
      <path d="M45 37 L59 39 M175 37 L161 39" stroke="#c8ff37" strokeWidth="4" strokeLinecap="round" />
      <path d="M45 64 L59 62 M175 64 L161 62" stroke="#d52d2d" strokeWidth="4" strokeLinecap="round" />
      <path d="M82 48 L138 48 M82 52 L138 52" stroke="#30352f" strokeWidth="2" />
      <path d="M93 10 L93 4 L127 4 L127 10" stroke="#858b80" strokeWidth="2" fill="none" />
      <path d="M93 90 L93 96 L127 96 L127 90" stroke="#858b80" strokeWidth="2" fill="none" />
    </svg>
  )
}

function App() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray('.letter')
      const cards = gsap.utils.toArray('.stat')
      const car = document.querySelector('.car')
      const trail = document.querySelector('.trail')

      // Premium intro: title first, followed by the statistics.
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })

      intro
        .from('.navbar', { y: -16, opacity: 0, duration: 0.7 })
        .from('.eyebrow', { y: 12, opacity: 0, duration: 0.5 }, '-=0.3')
        .from('.headline', { y: 25, opacity: 0, duration: 0.8 }, '-=0.2')
        .from('.subheading', { y: 10, opacity: 0, duration: 0.5 }, '-=0.45')
        .from('.road', { opacity: 0, scaleX: 0.92, duration: 0.7 }, '-=0.25')
        .from(car, { x: -80, opacity: 0, duration: 0.65 }, '-=0.35')
        .to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.12,
          ease: 'power2.out',
        }, '-=0.15')
        .from('.hero-footer', { opacity: 0, duration: 0.5 }, '-=0.25')

      // Scroll owns the car's position. It does not autoplay.
      const getTravel = () => {
        const road = document.querySelector('.road')
        const carWidth = car.getBoundingClientRect().width
        return Math.max(0, road.clientWidth - carWidth - 24)
      }

      gsap.set(letters, { opacity: 0.15 })
      gsap.set(trail, { scaleX: 0, transformOrigin: 'left center' })

      const driving = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: '+=180%',
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      })

      driving
        .to(car, {
          x: getTravel,
          ease: 'none',
          duration: 1,
        }, 0)
        .to(trail, {
          scaleX: 1,
          ease: 'none',
          duration: 1,
        }, 0)
        .to(letters, {
          opacity: 1,
          color: '#c8ff37',
          stagger: {
            each: 0.045,
            from: 'start',
          },
          ease: 'none',
          duration: 0.75,
        }, 0.12)

      // Scroll-triggered stat emphasis as the car progresses.
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { borderColor: '#ffffff18' },
          {
            borderColor: '#c8ff3766',
            duration: 0.2,
            scrollTrigger: {
              trigger: '.hero',
              start: `top+=${180 + index * 180} top`,
              end: `top+=${320 + index * 180} top`,
              scrub: true,
            },
          },
        )
      })

      // Keep responsive measurements correct after resizing.
      ScrollTrigger.refresh()
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={root}>
      <section className="hero">
        <nav className="navbar">
          <div className="logo">
            <span className="logo-mark">IF</span>
            <span>ITZFIZZ / MOTION</span>
          </div>
          <span className="nav-note">Digital experiences · 2026</span>
        </nav>

        <div className="hero-content">
          <span className="eyebrow">A better way forward</span>

          <h1 className="headline" aria-label={headline}>
            {headline.split('').map((char, index) => (
              <span
                className={char === ' ' ? 'word-gap' : 'letter'}
                key={`${char}-${index}`}
                aria-hidden="true"
              >
                {char === ' ' ? '\u00a0' : char}
              </span>
            ))}
          </h1>

          <p className="subheading">
            Small changes. Meaningful impact.
          </p>

          <div className="road">
            <div className="road-lines top" />
            <div className="road-lines bottom" />
            <div className="trail" />
            <div className="car">
              <Car />
            </div>
          </div>

          <div className="stats">
            {stats.map((stat) => (
              <article className="stat" key={stat.value}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </article>
            ))}
          </div>
        </div>

        <div className="hero-footer">
          <span className="scroll-cue">
            <span className="scroll-dot" />
            Scroll to explore
          </span>
          <span>Scroll-driven experience · 01 / 04</span>
        </div>
      </section>

      <section className="next-section">
        <div>
          <span className="eyebrow">Beyond the first screen</span>
          <h2>KEEP MOVING.</h2>
          <p>
            Thoughtful motion, clean design, and interactions that respond
            to you. Scroll back up to experience the animation again.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
