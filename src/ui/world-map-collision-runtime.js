import { isWalkable, findNearestWalkable } from './world-map-collision.js'

const nativeRAF = window.requestAnimationFrame.bind(window)
let installed = false
let correcting = false

function worldPoint(el) {
  return { x: parseFloat(el.style.left) || 0, y: parseFloat(el.style.top) || 0 }
}

function nearest(x, y) {
  return findNearestWalkable(x, y, 340) || { x, y }
}

function correctVisualUnits() {
  if (correcting) return
  const root = document.querySelector('#world-explorer-root')
  const field = root?.querySelector('#world-field')
  const camera = root?.querySelector('#world-camera')
  if (!root || !field || !camera) return

  correcting = true
  try {
    const player = root.querySelector('#world-player')
    if (player) {
      const p = worldPoint(player)
      if (!isWalkable(p.x, p.y)) {
        const q = nearest(p.x, p.y)
        player.style.left = q.x + 'px'
        player.style.top = q.y + 'px'
      }
    }

    root.querySelectorAll('.world-monster-node').forEach((monster) => {
      const p = worldPoint(monster)
      if (!isWalkable(p.x, p.y)) {
        const q = nearest(p.x, p.y)
        monster.style.left = q.x + 'px'
        monster.style.top = q.y + 'px'
      }
    })
  } finally {
    correcting = false
  }
}

if (!installed) {
  installed = true

  document.addEventListener('click', (event) => {
    const field = event.target.closest?.('#world-field')
    if (!field || event.target.closest('.world-action-bar,.world-minimap,.world-combat-hud,.world-npc-node')) return

    const camera = field.querySelector('#world-camera')
    if (!camera) return

    const nums = camera.style.transform.match(/-?[\d.]+/g) || []
    const tx = Number(nums[0] || 0)
    const ty = Number(nums[1] || 0)
    const rect = field.getBoundingClientRect()
    const x = Math.max(35, Math.min(2965, event.clientX - rect.left - tx))
    const y = Math.max(35, Math.min(1765, event.clientY - rect.top - ty))

    if (!isWalkable(x, y)) {
      event.preventDefault()
      event.stopImmediatePropagation()
      const q = nearest(x, y)
      field.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + tx + q.x,
        clientY: rect.top + ty + q.y,
      }))
    }
  }, true)

  window.requestAnimationFrame = function (callback) {
    return nativeRAF((time) => {
      callback(time)
      correctVisualUnits()
    })
  }
}
