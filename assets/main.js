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

preloader.addEventListener('mousemove', tiltCamera)
preloader.addEventListener('mouseleave', () => { if (cameraUi) cameraUi.style.transform = 'rotateY(0deg) rotateX(0deg)' })

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
