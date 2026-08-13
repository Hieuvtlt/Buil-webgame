import { getItemById } from '../../data/items/index.js'
import { player, equipItem, getEquippedItem, getEquipFailureReason } from '../../data/character.js'

const STAT_LABELS = {
  attackMin: 'Ngoại công thấp', attackMax: 'Ngoại công cao', defense: 'Ngoại phòng',
  strength: 'Sức mạnh', dexterity: 'Thân pháp', vitality: 'Sinh khí', energy: 'Nội lực',
  accuracy: 'Chính xác', dodge: 'Né tránh', hp: 'HP', mp: 'MP',
  externalAttack: 'Ngoại công cộng thêm', poisonResist: 'Kháng độc', fireResist: 'Kháng hỏa',
  iceResist: 'Kháng băng', lightningResist: 'Kháng lôi',
}

const QUALITY_LABELS = {
  haPham: 'Trắng - Hạ phẩm', trungPham: 'Xanh - Trung phẩm',
  thuongPham: 'Vàng - Thượng phẩm', cucPham: 'Đỏ - Cực phẩm',
}
const QUALITY_COLORS = { haPham: '#ffffff', trungPham: '#4da6ff', thuongPham: '#ffd54a', cucPham: '#ff4d4d' }
const RESIST_KEYS = new Set(['poisonResist', 'fireResist', 'iceResist', 'lightningResist'])
const SLOT_BY_CATEGORY = {
  sword: 'weapon', blade: 'weapon', staff: 'weapon', spear: 'weapon', weapon: 'weapon',
  helmet: 'helmet', body: 'armor', armor: 'armor', gauntlet: 'gloves', gloves: 'gloves', belt: 'belt', boots: 'boots',
  ring: 'ring1', necklace: 'necklace', amulet: 'amulet',
}

function getStats(item) { return item?.displayedStats ?? item?.stats ?? {} }
function getMeta(item) {
  if (item.potionLevel) return `Đan dược cấp ${item.potionLevel} • Dùng Lv.${item.usableLevelRange.min}-${item.usableLevelRange.max}`
  if (item.tierMeta) return `${item.tierMeta.label}${item.quality ? ` • ${QUALITY_LABELS[item.quality] ?? item.quality}` : ''} • Yêu cầu Lv.${item.requirements.level}`
  return `Loại: ${item.type} • Yêu cầu Lv.${item.requirements?.level ?? item.level ?? '-'}`
}
function getEffectText(item) {
  if (item?.effect?.hp) return `Phục hồi HP ${item.effect.hp}`
  if (item?.effect?.mp) return `Phục hồi MP ${item.effect.mp}`
  if (item?.effect?.characterExp) return `Nhận ${item.effect.characterExp} EXP`
  if (item?.effect?.skillExp) return `Nhận ${item.effect.skillExp} EXP võ kỹ`
  if (item?.effect?.rebirth) return `Dùng cho Trùng Sinh ${item.effect.rebirth}`
  return ''
}
function getSlot(item) { return SLOT_BY_CATEGORY[item?.category] ?? null }
function getAction(item) {
  if (!item) return null
  const slot = getSlot(item)
  const equipped = slot ? getEquippedItem(slot) : null
  if (['equipment', 'weapon', 'armor', 'accessory'].includes(item.type)) return { label: equipped ? 'Thay thế' : 'Trang bị', slot, equipped }
  if (item.type === 'consumable') return { label: 'Sử dụng', slot: null, equipped: null }
  return null
}
function getFilteredItems(filter) {
  const items = player.inventory.map((id) => getItemById(id)).filter(Boolean)
  if (filter === 'all') return items
  if (filter === 'equipment') return items.filter((item) => ['equipment', 'weapon', 'armor', 'accessory'].includes(item.type))
  if (filter === 'consumable') return items.filter((item) => item.type === 'consumable')
  if (filter === 'material') return items.filter((item) => item.type === 'material')
  if (filter === 'manual') return items.filter((item) => item.type === 'manual')
  return items.filter((item) => !['equipment', 'weapon', 'armor', 'accessory', 'consumable', 'material', 'manual'].includes(item.type))
}

function getSellableInventoryItems() {
  return player.inventory.map((id, inventoryIndex) => ({ id: Number(id), inventoryIndex, item: getItemById(id) })).filter(({ item }) => item)
}
function getQuickSellMatches(criteria) {
  const equipmentTypes = new Set(['equipment', 'weapon', 'armor', 'accessory'])
  const potionLevels = new Set(criteria.potionLevels)
  const herbLevels = new Set(criteria.herbLevels)
  return getSellableInventoryItems().filter(({ item }) => {
    if (Object.values(player.equipment).some((id) => Number(id) === Number(item.id))) return false
    if (criteria.qualities.length && equipmentTypes.has(item.type) && criteria.qualities.includes(item.quality)) return true
    if (criteria.potionLevels.length && item.type === 'consumable' && potionLevels.has(Number(item.potionLevel))) return true
    if (criteria.herbLevels.length && item.type === 'material' && item.category === 'alchemy_herb' && herbLevels.has(Number(item.level))) return true
    return false
  })
}
function quickSellLabel(criteria) {
  const chunks = []
  if (criteria.qualities.length) chunks.push(`Trang bị: ${criteria.qualities.map((q) => QUALITY_LABELS[q].split(' - ')[0]).join(', ')}`)
  if (criteria.potionLevels.length) chunks.push(`Đan dược: ${criteria.potionLevels.map((n) => `Lv.${n}`).join(', ')}`)
  if (criteria.herbLevels.length) chunks.push(`Linh dược: ${criteria.herbLevels.map((n) => `Lv.${n}`).join(', ')}`)
  return chunks.length ? chunks.join(' • ') : 'Chưa chọn tiêu chí'
}

function openQuickSellModal() {
  document.getElementById('quick-sell-modal')?.remove()
  const qualityOptions = Object.entries(QUALITY_LABELS).map(([key, label]) => `<label class="quick-sell-option quick-sell-quality" style="--option-color:${QUALITY_COLORS[key]}"><input type="checkbox" data-quick-sell-quality="${key}"><span class="quick-sell-check"></span><span>${label}</span></label>`).join('')
  const potionOptions = Array.from({ length: 10 }, (_, i) => `<label class="quick-sell-option"><input type="checkbox" data-quick-sell-potion="${i + 1}"><span class="quick-sell-check"></span><span>Lv.${i + 1}</span></label>`).join('')
  const herbOptions = Array.from({ length: 10 }, (_, i) => `<label class="quick-sell-option"><input type="checkbox" data-quick-sell-herb="${i + 1}"><span class="quick-sell-check"></span><span>Lv.${i + 1}</span></label>`).join('')

  const modal = document.createElement('div')
  modal.id = 'quick-sell-modal'
  modal.className = 'quick-sell-modal'
  modal.innerHTML = `<div class="quick-sell-backdrop" data-quick-sell-close></div><section class="quick-sell-dialog" role="dialog" aria-modal="true" aria-labelledby="quick-sell-title"><header class="quick-sell-header"><div><div class="quick-sell-title" id="quick-sell-title">BÁN NHANH</div><div class="quick-sell-subtitle">Chọn những nhóm vật phẩm muốn bán tự động.</div></div><button type="button" class="quick-sell-close" data-quick-sell-close aria-label="Đóng">×</button></header><div class="quick-sell-body"><section class="quick-sell-group"><div class="quick-sell-group-title">TRANG BỊ</div><div class="quick-sell-options quick-sell-options-4">${qualityOptions}</div></section><section class="quick-sell-group"><div class="quick-sell-group-title">ĐAN DƯỢC</div><div class="quick-sell-options">${potionOptions}</div></section><section class="quick-sell-group"><div class="quick-sell-group-title">LINH DƯỢC</div><div class="quick-sell-options">${herbOptions}</div></section></div><div class="quick-sell-summary"><div class="quick-sell-summary-text" id="quick-sell-summary-text">Chưa chọn tiêu chí</div><div class="quick-sell-summary-count" id="quick-sell-summary-count">0 vật phẩm</div></div><footer class="quick-sell-footer"><button type="button" class="quick-sell-btn ghost" data-quick-sell-close>Hủy</button><button type="button" class="quick-sell-btn confirm" id="quick-sell-confirm">BÁN NGAY</button></footer></section>`
  document.body.appendChild(modal)

  const getCriteria = () => ({
    qualities: Array.from(modal.querySelectorAll('[data-quick-sell-quality]:checked')).map((input) => input.dataset.quickSellQuality),
    potionLevels: Array.from(modal.querySelectorAll('[data-quick-sell-potion]:checked')).map((input) => Number(input.dataset.quickSellPotion)),
    herbLevels: Array.from(modal.querySelectorAll('[data-quick-sell-herb]:checked')).map((input) => Number(input.dataset.quickSellHerb)),
  })
  const refreshSummary = () => {
    const criteria = getCriteria(); const matches = getQuickSellMatches(criteria)
    modal.querySelector('#quick-sell-summary-text').textContent = quickSellLabel(criteria)
    modal.querySelector('#quick-sell-summary-count').textContent = `${matches.length} vật phẩm • ${matches.reduce((sum, entry) => sum + Number(entry.item.price?.sell ?? 0), 0).toLocaleString('vi-VN')} ngân lượng`
    modal.querySelector('#quick-sell-confirm').disabled = matches.length === 0
  }
  modal.querySelectorAll('input[type="checkbox"]').forEach((input) => input.addEventListener('change', refreshSummary))
  modal.querySelectorAll('[data-quick-sell-close]').forEach((button) => button.addEventListener('click', () => modal.remove()))
  modal.querySelector('#quick-sell-confirm').addEventListener('click', () => {
    const criteria = getCriteria(); const matches = getQuickSellMatches(criteria); if (!matches.length) return
    const idsToRemove = new Set(matches.map((entry) => entry.id)); const totalGold = matches.reduce((sum, entry) => sum + Number(entry.item.price?.sell ?? 0), 0)
    player.inventory = player.inventory.filter((id) => !idsToRemove.has(Number(id))); player.gold += totalGold; modal.remove()
    window.dispatchEvent(new CustomEvent('game:inventory-changed'))
    window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `Bán nhanh ${matches.length} vật phẩm, nhận ${totalGold.toLocaleString('vi-VN')} ngân lượng.`, type: 'item' } }))
  })
  refreshSummary()
}

function ensureTooltip() {
  let tooltip = document.getElementById('inventory-item-tooltip')
  if (tooltip) return tooltip
  tooltip = document.createElement('div'); tooltip.id = 'inventory-item-tooltip'; tooltip.className = 'inventory-item-tooltip'; document.body.appendChild(tooltip); return tooltip
}
function statLines(item, compareTo = null) {
  const source = getStats(item); const compare = getStats(compareTo); const color = item?.qualityColor ?? item?.tierMeta?.color ?? '#ffffff'
  const entries = Object.entries(source).filter(([, value]) => Number(value) > 0)
  if (!entries.length) return '<div class="inventory-tooltip-empty">Không có thuộc tính chiến đấu.</div>'
  return entries.map(([key, value]) => {
    const delta = Number(value) - Number(compare[key] ?? 0)
    const suffix = compareTo && delta !== 0 ? `<span class="inventory-tooltip-delta ${delta > 0 ? 'up' : 'down'}">${delta > 0 ? '▲' : '▼'} ${delta > 0 ? '+' : ''}${delta}</span>` : ''
    return `<div class="inventory-tooltip-stat" style="color:${color}"><span>${STAT_LABELS[key] ?? key}</span><strong>${Number(value)}${RESIST_KEYS.has(key) ? '%' : ''}${suffix}</strong></div>`
  }).join('')
}
function renderTooltipCard(item, title, compareTo = null) {
  const color = item?.qualityColor ?? item?.tierMeta?.color ?? '#d7d7d7'; const effect = getEffectText(item)
  return `<div class="inventory-tooltip-card"><div class="inventory-tooltip-card-title">${title || '&nbsp;'}</div><div class="inventory-tooltip-head"><div class="inventory-tooltip-icon-frame" style="--item-color:${color}"><img src="${item?.icon ?? ''}" alt=""></div><div class="inventory-tooltip-info"><div class="inventory-tooltip-name" style="color:${color}">${item?.name ?? ''}</div><div class="inventory-tooltip-meta">${getMeta(item)}</div><div class="inventory-tooltip-meta">Giá bán: ${Number(item?.price?.sell ?? 0).toLocaleString('vi-VN')}</div></div></div><div class="inventory-tooltip-section-title">THUỘC TÍNH</div><div class="inventory-tooltip-stats">${statLines(item, compareTo)}</div>${effect ? `<div class="inventory-tooltip-effect">${effect}</div>` : ''}${item?.description ? `<div class="inventory-tooltip-description">${item.description}</div>` : ''}</div>`
}
function positionTooltip(tooltip, clientX, clientY) {
  tooltip.style.left = '0px'; tooltip.style.top = '0px'
  const rect = tooltip.getBoundingClientRect(); const gap = 14
  const left = clientX + gap + rect.width <= window.innerWidth ? clientX + gap : Math.max(8, clientX - rect.width - gap)
  const top = clientY + gap + rect.height <= window.innerHeight ? clientY + gap : Math.max(8, window.innerHeight - rect.height - gap)
  tooltip.style.left = `${left}px`; tooltip.style.top = `${top}px`
}

export function mountInventoryScreen() {
  const grid = document.getElementById('inventory-screen-grid')
  if (!grid) return
  const tooltip = ensureTooltip(); let currentFilter = 'all'; let selectedId = null; let sortAsc = true
  const hideTooltip = () => { tooltip.classList.remove('is-open'); tooltip.innerHTML = '' }

  const showTooltip = (item, clientX, clientY) => {
    const action = getAction(item); const equipped = action?.equipped ?? null; const hasCompare = Boolean(equipped && Number(equipped.id) !== Number(item.id))
    tooltip.innerHTML = `<div class="inventory-tooltip-grid ${hasCompare ? 'has-compare' : ''}">${hasCompare ? renderTooltipCard(equipped, 'ĐANG TRANG BỊ') : ''}${renderTooltipCard(item, hasCompare ? 'VẬT PHẨM MỚI' : '')}</div><div class="inventory-tooltip-actions">${action ? `<button type="button" class="inventory-tooltip-action primary" data-tooltip-action="main">${action.label}</button>` : ''}<button type="button" class="inventory-tooltip-action" data-tooltip-action="sell">Bán</button><button type="button" class="inventory-tooltip-action danger" data-tooltip-action="delete">Xóa</button></div>`
    tooltip.classList.add('is-open'); positionTooltip(tooltip, clientX, clientY)
    tooltip.querySelector('[data-tooltip-action="main"]')?.addEventListener('click', () => {
      const actionNow = getAction(item); if (!actionNow?.slot) return; const reason = getEquipFailureReason(item.id, actionNow.slot)
      if (reason) { window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `Không thể trang bị ${item.name}: ${reason}`, type: 'danger' } })); return }
      if (equipItem(actionNow.slot, item.id)) { hideTooltip(); window.dispatchEvent(new CustomEvent('game:item-equipped', { detail: { itemId: item.id } })) }
    })
    tooltip.querySelector('[data-tooltip-action="sell"]')?.addEventListener('click', () => {
      const index = player.inventory.findIndex((id) => Number(id) === Number(item.id)); if (index < 0) return
      if (Object.values(player.equipment).some((id) => Number(id) === Number(item.id))) { window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `Không thể bán ${item.name} khi đang trang bị.`, type: 'warning' } })); return }
      player.inventory.splice(index, 1); player.gold += Number(item.price?.sell ?? 0); hideTooltip(); window.dispatchEvent(new CustomEvent('game:inventory-changed'))
    })
    tooltip.querySelector('[data-tooltip-action="delete"]')?.addEventListener('click', () => {
      const index = player.inventory.findIndex((id) => Number(id) === Number(item.id)); if (index < 0) return
      if (Object.values(player.equipment).some((id) => Number(id) === Number(item.id))) return
      player.inventory.splice(index, 1); hideTooltip(); window.dispatchEvent(new CustomEvent('game:inventory-changed'))
    })
  }

  function paintGrid() {
    const items = getFilteredItems(currentFilter); const slots = Array.from(grid.querySelectorAll('.inv-slot2'))
    slots.forEach((slot, index) => {
      const item = items[index]; slot.dataset.itemId = item?.id ?? ''; slot.disabled = !item; slot.setAttribute('aria-label', item?.name ?? `Ô trống ${index + 1}`)
      slot.innerHTML = item ? `${item.icon ? `<img class="item-icon inventory-item-icon" src="${item.icon}" alt="" loading="lazy" />` : '<span class="inventory-item-icon-placeholder">?</span>'}${item.stackable ? '<span class="stack-badge">1</span>' : ''}<span class="inventory-item-name" style="color:${item.qualityColor ?? item.tierMeta?.color ?? '#d7d7d7'}">${item.name}</span><span class="inventory-item-rarity"></span>` : `<span class="inventory-empty-slot">${index + 1}</span>`
      slot.classList.toggle('is-selected', Number(slot.dataset.itemId) === Number(selectedId))
    })
    const label = document.getElementById('inventory-filter-label'); if (label) label.textContent = ({ all: 'Tất cả vật phẩm', equipment: 'Trang bị', consumable: 'Đan dược', material: 'Nguyên liệu', manual: 'Bí kíp', other: 'Khác' })[currentFilter]
  }
  function sortInventory() {
    player.inventory.sort((a, b) => { const ia = getItemById(a); const ib = getItemById(b); const aa = ia?.name ?? ''; const bb = ib?.name ?? ''; return sortAsc ? aa.localeCompare(bb, 'vi') : bb.localeCompare(aa, 'vi') })
    sortAsc = !sortAsc; paintGrid(); hideTooltip()
  }

  grid.addEventListener('click', (event) => {
    const slot = event.target.closest('.inv-slot2'); if (!slot || !slot.dataset.itemId) return
    const item = getItemById(Number(slot.dataset.itemId)); if (!item) return
    selectedId = item.id; Array.from(grid.querySelectorAll('.inv-slot2')).forEach((node) => node.classList.toggle('is-selected', Number(node.dataset.itemId) === Number(selectedId)))
    showTooltip(item, event.clientX, event.clientY); event.stopPropagation()
  })
  grid.addEventListener('contextmenu', (event) => {
    const slot = event.target.closest('.inv-slot2'); if (!slot || !slot.dataset.itemId) return
    event.preventDefault(); const item = getItemById(Number(slot.dataset.itemId)); if (item) showTooltip(item, event.clientX, event.clientY)
  })
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => { currentFilter = button.dataset.filter; document.querySelectorAll('[data-filter]').forEach((el) => el.classList.toggle('active', el.dataset.filter === currentFilter)); selectedId = null; hideTooltip(); paintGrid() }))
  document.querySelectorAll('[data-inventory-action="sort"]').forEach((button) => button.addEventListener('click', sortInventory))
  document.querySelectorAll('[data-inventory-action="quick-sell"]').forEach((button) => button.addEventListener('click', openQuickSellModal))
  document.querySelectorAll('[data-inventory-action="split"]').forEach((button) => button.addEventListener('click', () => window.dispatchEvent(new CustomEvent('game:log', { detail: 'Chọn vật phẩm có thể xếp chồng để tách.' }))))
  document.querySelectorAll('[data-page-action]').forEach((button) => button.addEventListener('click', () => window.dispatchEvent(new CustomEvent('game:log', { detail: 'Túi đồ hiện hiển thị trang 1.' }))))
  document.addEventListener('click', (event) => { if (!tooltip.contains(event.target) && !grid.contains(event.target)) hideTooltip() })
  window.addEventListener('resize', hideTooltip); document.addEventListener('scroll', hideTooltip, true)
  paintGrid()
}
