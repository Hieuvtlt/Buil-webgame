import { WORLD_MAPS } from '../../data/worldMaps.js'
import { player } from '../../data/character.js'
import './NgoaiCanhScreen.css'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const mapIcon = (className = '') => `<span class="map-icon ${className}" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 5.5 9 3l6 2.5L20 3v15.5L15 21l-6-2.5L4 21z"/><path d="M9 3v15.5M15 5.5V21"/><path d="m7 9 2-1 2 1 2-1 2 1"/></svg></span>`

function mapCard(map, index, currentId) {
  const unlocked = player.level >= map.levelMin
  const current = currentId === map.id
  return `<article class="world-map-card${current ? ' is-current' : ''}${!unlocked ? ' is-locked' : ''}" data-map-id="${map.id}">
    <button class="world-map-card-hit" type="button" data-open-map="${map.id}" aria-label="Mở ${map.name}">
      <div class="world-map-image-wrap">
        <img src="${map.image}" alt="${map.name}" loading="lazy" data-map-image="1"/>
        <div class="world-map-image-fallback" aria-hidden="true"><span>${map.id}</span><b>${map.name}</b></div>
        <span class="world-map-number">${String(index + 1).padStart(2, '0')}</span>
        ${mapIcon('world-map-card-icon')}
        ${current ? '<span class="world-map-current">ĐANG Ở ĐÂY</span>' : ''}
        ${!unlocked ? `<span class="world-map-lock">🔒 Lv.${map.levelMin}</span>` : ''}
      </div>
      <div class="world-map-card-body">
        <div><h3>${map.name}</h3><small>Lv. ${map.levelMin}–${map.levelMax}</small></div>
        <span class="world-map-arrow">›</span>
      </div>
    </button>
  </article>`
}

export function NgoaiCanhScreen() {
  return `<section class="new-world-screen">
    <div class="world-intro">
      <div class="world-intro-main">
        ${mapIcon('world-intro-icon')}
        <div>
          <div class="eyebrow">THẾ GIỚI • NGOẠI CẢNH</div>
          <h2>BẢN ĐỒ GIANG HỒ</h2>
          <p>17 khu vực được nối thành tuyến phiêu lưu. Chọn bản đồ để xem toàn cảnh, phóng to, kéo bản đồ và tiến vào khu vực để bắt đầu chiến đấu.</p>
        </div>
      </div>
      <div class="world-count"><strong>17</strong><span>KHU VỰC</span></div>
    </div>
    <div class="world-toolbar">
      <div class="world-progress"><span class="world-progress-label">Hành trình</span><div class="world-progress-track"><i style="width:${Math.round((player.level / 200) * 100)}%"></i></div><b>Lv.${player.level}</b></div>
      <div class="world-filter"><button class="world-filter-btn active" type="button" data-filter="all">TẤT CẢ</button><button class="world-filter-btn" type="button" data-filter="available">CÓ THỂ VÀO</button></div>
    </div>
    <div class="world-map-grid">${WORLD_MAPS.map((map,index)=>mapCard(map,index,null)).join('')}</div>
    <div id="world-map-modal" class="world-map-modal" hidden></div>
  </section>`
}

export function mountNgoaiCanhScreen() {
  const screen = document.querySelector('.new-world-screen')
  if (!screen) return () => {}

  const modal = screen.querySelector('#world-map-modal')
  let currentId = null
  let cleanupViewer = null

  const emit = (message, type = 'system') => window.dispatchEvent(new CustomEvent('game:log', { detail: { message, type } }))
  const getMap = id => WORLD_MAPS.find(map => map.id === id)

  const markCurrent = map => {
    currentId = map.id
    screen.querySelectorAll('.world-map-card').forEach(card => card.classList.toggle('is-current', card.dataset.mapId === map.id))
    const status = document.querySelector('#world-status-name')
    if (status) status.textContent = `◉ Khu vực: ${map.name}`
    window.dispatchEvent(new CustomEvent('game:map-entered', { detail: { map } }))
  }

  const close = () => {
    cleanupViewer?.()
    cleanupViewer = null
    modal.hidden = true
    modal.innerHTML = ''
  }

  const open = id => {
    const map = getMap(id)
    if (!map) return
    const unlocked = player.level >= map.levelMin
    modal.hidden = false
    modal.innerHTML = `<div class="world-map-dialog-backdrop" data-close="1">
      <div class="world-map-dialog" role="dialog" aria-modal="true" aria-label="${map.name}">
        <button class="world-map-dialog-close" type="button" data-close="1" aria-label="Đóng">×</button>
        <div class="world-map-viewer" data-viewer>
          <div class="world-map-canvas" data-canvas>
            <img src="${map.image}" alt="${map.name}" data-pan-image/>
            <div class="world-map-image-fallback viewer-fallback" aria-hidden="true"><span>${map.id}</span><b>${map.name}</b></div>
          </div>
          <div class="world-map-viewer-tools">
            <button type="button" data-zoom="-1">−</button><span data-zoom-label>100%</span><button type="button" data-zoom="1">+</button><button type="button" data-fit>VỪA KHUNG</button>
          </div>
          <div class="world-map-hint">Kéo để di chuyển • Con lăn hoặc +/- để phóng to</div>
        </div>
        <div class="world-map-dialog-content">
          <div class="eyebrow">KHU VỰC ${map.id} • BẢN ĐỒ ${Number(map.id)} / 17</div>
          <h3>${map.name}</h3>
          <div class="world-map-level">Lv. ${map.levelMin}–${map.levelMax}</div>
          <p>${map.description}</p>
          <div class="world-map-route"><span>◈ Điểm vào</span><b>${map.name}</b><span>⚔ Chiến trường thời gian thực</span></div>
          <div class="world-map-dialog-actions"><button class="map-cancel" type="button" data-close="1">ĐÓNG</button><button class="map-enter" type="button" data-enter="${map.id}" ${unlocked ? '' : 'disabled'}>${unlocked ? 'TIẾN VÀO' : `CẦN LV.${map.levelMin}`}</button></div>
        </div>
      </div>
    </div>`

    const viewer = modal.querySelector('[data-viewer]')
    const image = modal.querySelector('[data-pan-image]')
    const zoomLabel = modal.querySelector('[data-zoom-label]')
    let zoom = 1
    let x = 0
    let y = 0
    let dragging = false
    let startX = 0
    let startY = 0

    const render = () => {
      image.style.transform = `translate3d(${x}px,${y}px,0) scale(${zoom})`
      zoomLabel.textContent = `${Math.round(zoom * 100)}%`
    }
    const fit = () => { zoom = 1; x = 0; y = 0; render() }
    const changeZoom = direction => { const next = clamp(zoom + direction * 0.2, 0.7, 2.8); zoom = Math.round(next * 10) / 10; render() }
    const onWheel = event => { event.preventDefault(); changeZoom(event.deltaY > 0 ? -1 : 1) }
    const onDown = event => { dragging = true; startX = event.clientX - x; startY = event.clientY - y; viewer.classList.add('is-dragging') }
    const onMove = event => { if (!dragging) return; x = event.clientX - startX; y = event.clientY - startY; render() }
    const onUp = () => { dragging = false; viewer.classList.remove('is-dragging') }

    image.addEventListener('wheel', onWheel, { passive: false })
    image.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    modal.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => changeZoom(Number(button.dataset.zoom))))
    modal.querySelector('[data-fit]').addEventListener('click', fit)
    render()
    cleanupViewer = () => {
      image.removeEventListener('wheel', onWheel)
      image.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    image.addEventListener('error', () => image.parentElement?.classList.add('has-error'), { once: true })
  }

  const onClick = event => {
    const openButton = event.target.closest('[data-open-map]')
    if (openButton) open(openButton.dataset.openMap)

    const enter = event.target.closest('[data-enter]')
    if (enter && !enter.disabled) {
      const map = getMap(enter.dataset.enter)
      if (!map || player.level < map.levelMin) return
      close()
      markCurrent(map)
      emit(`Tiến vào ${map.name}.`, 'map')
      window.dispatchEvent(new CustomEvent('game:combat-start', { detail: { map } }))
    }

    if (event.target.closest('[data-close]')) close()

    const filter = event.target.closest('[data-filter]')
    if (filter) {
      screen.querySelectorAll('.world-filter-btn').forEach(button => button.classList.toggle('active', button === filter))
      const availableOnly = filter.dataset.filter === 'available'
      screen.querySelectorAll('.world-map-card').forEach(card => {
        const map = getMap(card.dataset.mapId)
        card.hidden = availableOnly && player.level < map.levelMin
      })
    }
  }

  const onKey = event => { if (event.key === 'Escape' && !modal.hidden) close() }
  screen.addEventListener('click', onClick)
  window.addEventListener('keydown', onKey)
  screen.querySelectorAll('[data-map-image]').forEach(img => img.addEventListener('error', () => img.parentElement?.classList.add('has-error'), { once: true }))

  return () => {
    cleanupViewer?.()
    screen.removeEventListener('click', onClick)
    window.removeEventListener('keydown', onKey)
  }
}
