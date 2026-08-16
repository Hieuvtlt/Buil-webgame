import { isWalkable, findNearestWalkable } from './world-map-collision.js'

const nativeRAF = window.requestAnimationFrame.bind(window)
let installed = false
let correcting = false

function pointFromStyle(el) {
  return {
    x: Number.parseFloat(el.style.left) || 0,
    y: Number.parseFloat(el.style.top) || 0,
  }
}

function correctToWalkable(el, radius) {
  const p = pointFromStyle(el)
  if (isWalkable(p.x, p.y)) return
  const safe = findNearestWalkable(p.x, p.y, radius)
  if (!safe) return
  el.style.left = `${safe.x}px`
  el.style.top = `${safe.y}px`
}

function correctWorldUnits() {
  if (correcting) return
  const root = document.querySelector('#world-explorer-root')
  if (!root) return

  correcting = true
  try {
    const player = root.querySelector('#world-player')
    if (player) correctToWalkable(player, 180)

    root.querySelectorAll('.world-monster-node').forEach(monster => {
      correctToWalkable(monster, 220)
    })
  } finally {
    correcting = false
  }
}

if (!installed) {
  installed = true
  window.requestAnimationFrame = callback => nativeRAF(time => {
    callback(time)
    correctWorldUnits()
  })
}
