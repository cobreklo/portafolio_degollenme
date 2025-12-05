const preloader = document.getElementById('preloader')
const flash = document.getElementById('flash')
const audio = document.getElementById('shutter-audio')
const cameraUi = document.getElementById('camera-ui')
const aperture = document.getElementById('aperture')
const shutterBtn = document.querySelector('.shutter-btn')
const lensGloss = document.getElementById('lens-gloss')
const contactForm = document.querySelector('#contact form')
const contactStatus = document.getElementById('contact-status')
const contactSubmit = document.getElementById('contact-submit')
const bgBlobs = document.querySelectorAll('#page-bg .blob')

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(contactForm)
    if (contactStatus) {
      contactStatus.textContent = 'Enviando…'
      contactStatus.classList.remove('hidden')
      contactStatus.classList.remove('text-green-600', 'dark:text-green-400', 'text-red-600', 'dark:text-red-400')
      contactStatus.classList.add('text-primary')
    }
    if (contactSubmit) {
      contactSubmit.disabled = true
      contactSubmit.classList.add('opacity-50', 'cursor-not-allowed')
    }
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      if (res.ok) {
        if (contactStatus) {
          contactStatus.textContent = 'Enviado'
          contactStatus.classList.remove('text-primary')
          contactStatus.classList.add('text-green-600', 'dark:text-green-400')
        }
        contactForm.reset()
        setTimeout(() => { if (contactStatus) contactStatus.classList.add('hidden') }, 4000)
      } else {
        if (contactStatus) {
          contactStatus.textContent = 'Error al enviar'
          contactStatus.classList.remove('text-primary')
          contactStatus.classList.add('text-red-600', 'dark:text-red-400')
        }
      }
    } catch (err) {
      if (contactStatus) {
        contactStatus.textContent = 'Error al enviar'
        contactStatus.classList.remove('text-primary')
        contactStatus.classList.add('text-red-600', 'dark:text-red-400')
      }
    } finally {
      if (contactSubmit) {
        contactSubmit.disabled = false
        contactSubmit.classList.remove('opacity-50', 'cursor-not-allowed')
      }
    }
  })
}

function playShutter() {
  if (!audio) return
  audio.currentTime = 0
  audio.play().catch(() => {})
}

function tiltCamera(e) {
  if (!cameraUi || !preloader) return
  const r = preloader.getBoundingClientRect()
  const nx = (e.clientX - r.left) / r.width * 2 - 1
  const ny = (e.clientY - r.top) / r.height * 2 - 1
  const ry = nx * 18
  const rx = -ny * 12
  cameraUi.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg)`
  if (lensGloss) {
    const tx = nx * 14
    const ty = ny * 10
    lensGloss.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(12deg)`
  }
}

preloader.addEventListener('pointermove', tiltCamera)
preloader.addEventListener('pointerleave', () => { if (cameraUi) cameraUi.style.transform = 'rotateY(0deg) rotateX(0deg)' })

preloader.addEventListener('click', () => {
  if (aperture) {
    aperture.classList.remove('active')
    void aperture.offsetWidth
    aperture.classList.add('active')
  }
  playShutter()
  flash.classList.add('opacity-100')
  setTimeout(() => {
    flash.classList.remove('opacity-100')
    preloader.classList.add('opacity-0', 'transition-opacity')
    setTimeout(() => {
      preloader.classList.add('hidden')
      document.body.classList.remove('overflow-hidden')
      const el = document.getElementById('about')
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }, 150)
})

if (shutterBtn) {
  shutterBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    preloader.click()
  })
}

const revealEls = document.querySelectorAll('.reveal')
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const t = entry.target
      const d = t.dataset && t.dataset.delay
      if (d) t.style.transitionDelay = d
      t.classList.add('in-view')
      io.unobserve(t)
    }
  })
}, { threshold: 0.2 })
revealEls.forEach((el) => io.observe(el))

window.addEventListener('mousemove', (e) => {
  const nx = (e.clientX / window.innerWidth) - 0.5
  const ny = (e.clientY / window.innerHeight) - 0.5
  bgBlobs.forEach((b) => {
    const s = Number(b.dataset.strength || 8)
    b.style.setProperty('--ox', `${nx * s * 10}px`)
    b.style.setProperty('--oy', `${ny * s * 8}px`)
  })
})

const bubble = document.getElementById('bubble-menu')
const bubbleHandle = document.getElementById('bubble-handle')
const bubbleToggle = document.getElementById('bubble-toggle')
const bubblePanel = document.getElementById('bubble-panel')
const bubbleShutter = document.getElementById('bubble-shutter')
const bubbleTheme = document.getElementById('bubble-theme')
let bubbleAudioCtx
function playBubbleBounce(open) {
  try {
    if (!bubbleAudioCtx) bubbleAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const ctx = bubbleAudioCtx
    const t = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    const fStart = open ? 700 : 350
    const fEnd = open ? 300 : 600
    osc1.frequency.setValueAtTime(fStart, t)
    osc1.frequency.exponentialRampToValueAtTime(fEnd, t + 0.16)
    gain1.gain.setValueAtTime(0, t)
    gain1.gain.linearRampToValueAtTime(0.22, t + 0.02)
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)

    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(fStart * 0.8, t)
    osc2.frequency.exponentialRampToValueAtTime(fEnd * 0.9, t + 0.16)
    gain2.gain.setValueAtTime(0, t)
    gain2.gain.linearRampToValueAtTime(0.14, t + 0.02)
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)

    osc1.start(t)
    osc2.start(t)
    osc1.stop(t + 0.2)
    osc2.stop(t + 0.2)
  } catch (e) {}
}
const rootEl = document.documentElement
try {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') rootEl.classList.add('dark')
} catch (e) {}
if (bubbleTheme) {
  const updateThemeIcon = () => {
    const icon = bubbleTheme.querySelector('.material-symbols-outlined')
    const isDark = rootEl.classList.contains('dark')
    if (icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode'
    bubbleTheme.setAttribute('aria-label', isDark ? 'Cambiar a claro' : 'Cambiar a oscuro')
  }
  updateThemeIcon()
  bubbleTheme.addEventListener('click', () => {
    const nowDark = !rootEl.classList.contains('dark')
    if (nowDark) rootEl.classList.add('dark')
    else rootEl.classList.remove('dark')
    try { localStorage.setItem('theme', nowDark ? 'dark' : 'light') } catch (e) {}
    updateThemeIcon()
  })
}

if (bubble && bubbleHandle && bubbleToggle && bubblePanel) {
  let dragging = false
  let sx = 0
  let sy = 0
  let bx = 0
  let by = 0
  let lastX = 0
  let lastY = 0
  let lastT = 0
  function onDown(e) {
    if (e.target === bubbleToggle || (bubbleShutter && e.target === bubbleShutter) || (bubbleShutter && e.target.closest('#bubble-shutter'))) return
    e.preventDefault()
    dragging = true
    bubble.classList.remove('cursor-grab')
    bubble.classList.add('cursor-grabbing')
    const r = bubble.getBoundingClientRect()
    sx = e.clientX
    sy = e.clientY
    bx = r.left
    by = r.top
    bubble.style.right = 'auto'
    bubble.style.bottom = 'auto'
    lastX = bx
    lastY = by
    lastT = performance.now()
    bubbleHandle.style.willChange = 'transform'
    bubbleHandle.style.transition = 'none'
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onUp)
  }
  function onMove(e) {
    if (!dragging) return
    const nx = bx + (e.clientX - sx)
    const ny = by + (e.clientY - sy)
    const w = bubble.offsetWidth
    const h = bubble.offsetHeight
    const maxX = window.innerWidth - w - 8
    const maxY = window.innerHeight - h - 8
    const clampedX = Math.max(8, Math.min(maxX, nx))
    const clampedY = Math.max(8, Math.min(maxY, ny))
    bubble.style.left = `${clampedX}px`
    bubble.style.top = `${clampedY}px`

    const now = performance.now()
    const dt = Math.max(16, now - lastT)
    const vx = (clampedX - lastX) / dt
    const vy = (clampedY - lastY) / dt
    const ax = Math.min(0.25, Math.abs(vx) * 0.35)
    const ay = Math.min(0.25, Math.abs(vy) * 0.35)
    const sxq = 1 + ax - ay * 0.4
    const syq = 1 + ay - ax * 0.4
    bubbleHandle.style.transform = `scale(${sxq}, ${syq})`

    lastX = clampedX
    lastY = clampedY
    lastT = now
  }
  function onUp() {
    dragging = false
    bubble.classList.add('cursor-grab')
    bubble.classList.remove('cursor-grabbing')
    bubbleHandle.style.transition = 'transform 220ms cubic-bezier(.22,1,.36,1)'
    bubbleHandle.style.transform = 'scale(1.06)'
    setTimeout(() => { bubbleHandle.style.transform = 'scale(1)' }, 120)
    setTimeout(() => { bubbleHandle.style.transition = '' }, 400)
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
  }
  bubbleHandle.addEventListener('pointerdown', onDown)
  bubbleToggle.addEventListener('click', (e) => {
    e.stopPropagation()
    const expanded = bubble.classList.toggle('expanded')
    bubblePanel.classList.toggle('hidden', !expanded)
    const icon = bubbleToggle.querySelector('.material-symbols-outlined')
    if (icon) icon.textContent = expanded ? 'close' : 'menu'
    playBubbleBounce(expanded)
  })
  if (bubbleShutter) {
    bubbleShutter.addEventListener('click', () => {
      if (!audio) return
      audio.currentTime = 0
      audio.play().catch(() => {})
    })
  }
}
