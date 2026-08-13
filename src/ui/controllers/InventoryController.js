import { getItemById } from '../../data/items/index.js'
import { player, equipItem, getEquippedItem, getEquipFailureReason } from '../../data/character.js'

const STAT_LABELS = {
  attackMin: 'Ngoại công thấp',
  attackMax: 'Ngoại công cao',
  defense: 'Ngoại phòng',
  strength: 'Sức mạnh',
  dexterity: 'Thân pháp',
  vitality: 'Sinh khí',
  energy: 'Nội lực',
  accuracy: 'Chính xác',
  dodge: 'Né tránh',
  hp: 'HP',
  mp: 'MP',
  externalAttack: 'Ngoại công cộng thêm',
  poisonResist: 'Kháng độc',
  fireResist: 'Kháng hỏa',
  iceResist: 'Kháng băng',
  lightningResist: 'Kháng lôi',
}

const QUALITY_LABELS = {
  haPham: 'Hạ phẩm',
  trungPham: 'Trung phẩm',
  thuongPham: 'Thượng phẩm',
  cucPham: 'Cực phẩm',
}

const RESIST_KEYS = new Set(['poisonResist', 'fireResist', 'iceResist', 'lightningResist'])
const SLOT_BY_CATEGORY = {
  sword: 'weapon', blade: 'weapon', staff: 'weapon', spear: 'weapon', weapon: 'weapon',
  helmet: 'helmet', body: 'armor', armor: 'armor', gauntlet: 'gloves', gloves: 'gloves', belt: 'belt', boots: 'boots',
  ring: 'ring1', necklace: 'necklace', amulet: 'amulet',
}

function formatStat(key, value) {
  if (!value) return ''
  return `${STAT_LABELS[key] ?? key}: ${value}${RESIST_KEYS.has(key) ? '%' : ''}`
}

function getEffectText(item) {
  if (item.effect?.hp) return `Phục hồi HP ${item.effect.hp}`
  if (item.effect?.mp) return `Phục hồi MP ${item.effect.mp}`
  if (item.effect?.characterExp) return `Nhận ${item.effect.characterExp} EXP`
  if (item.effect?.skillExp) return `Nhận ${item.effect.skillExp} EXP võ kỹ`
  if (item.effect?.rebirth) return `Dùng cho Trùng Sinh ${item.effect.rebirth}`
  return ''
}

function getStats(item) {
  return item?.displayedStats ?? item?.stats ?? {}
}

function getMeta(item) {
  if (item.potionLevel) {
    const range = item.usableLevelRange
    return `Đan dược cấp ${item.potionLevel} • Dùng Lv.${range.min}-${range.max}`
  }
  if (item.tierMeta) {
    const quality = item.quality ? ` • ${QUALITY_LABELS[item.quality] ?? item.quality}` : ''
    return `${item.tierMeta.label}${quality} • Yêu cầu Lv.${item.requirements.level}`
  }
  return `Loại: ${item.type} • Yêu cầu Lv.${item.requirements?.level ?? item.level ?? '-'}`
}

function getSlot(item) {
  return SLOT_BY_CATEGORY[item?.category] ?? null
}

function getAction(item) {
  if (!item) return null
  const slot = getSlot(item)
  const equipped = slot ? getEquippedItem(slot) : null
  if (['equipment', 'weapon', 'armor', 'accessory'].includes(item.type)) {
    return { label: equipped ? 'Thay thế' : 'Trang bị', slot, equipped }
  }
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

function renderStats(item) {
  const stats = getStats(item)
  const entries = Object.entries(stats).filter(([, value]) => Number(value) > 0)
  return entries.length
    ? entries.map(([key, value]) => `<div class="inventory-detail-stat"><span>${STAT_LABELS[key] ?? key}</span><strong>${Number(value)}${RESIST_KEYS.has(key) ? '%' : ''}</strong></div>`).join('')
    : '<div class="inventory-detail-description">Không có thuộc tính chiến đấu.</div>'
}

function renderDetail(item) {
  if (!item) {
    return `<div class="inventory-detail-empty"><div class="inventory-detail-empty-icon">◈</div><strong>CHƯA CHỌN VẬT PHẨM</strong><span>Chọn một vật phẩm trong túi để xem thông tin chi tiết.</span></div>`
  }
  const color = item.qualityColor ?? item.tierMeta?.color ?? '#d7d7d7'
  const action = getAction(item)
  const effect = getEffectText(item)
  return `
    <div class="inventory-detail-head" style="--item-color:${color}">
      <div class="inventory-detail-icon-wrap"><img class="inventory-detail-icon" src="${item.icon ?? ''}" alt="" /></div>
      <div>
        <div class="inventory-detail-title" style="--item-color:${color};color:${color}">${item.name}</div>
        <div class="inventory-detail-meta">${getMeta(item)}</div>
        <div class="inventory-detail-meta">Giá bán: ${Number(item.price?.sell ?? 0).toLocaleString('vi-VN')}</div>
      </div>
    </div>
    <div class="inventory-detail-section">
      <div class="inventory-detail-section-title">THUỘC TÍNH</div>
      ${renderStats(item)}
    </div>
    ${effect ? `<div class="inventory-detail-section"><div class="inventory-detail-section-title">HIỆU ỨNG</div><div class="inventory-detail-description">${effect}</div></div>` : ''}
    ${item.description ? `<div class="inventory-detail-section"><div class="inventory-detail-section-title">MÔ TẢ</div><div class="inventory-detail-description">${item.description}</div></div>` : ''}
    <div class="inventory-detail-actions">
      ${action ? `<button type="button" class="inventory-detail-action primary" data-detail-action="main">${action.label}</button>` : '<span></span>'}
      <button type="button" class="inventory-detail-action" data-detail-action="quick-sell">Bán</button>
      <button type="button" class="inventory-detail-action danger" data-detail-action="delete">Xóa</button>
    </div>
  `
}

export function mountInventoryScreen() {
  const grid = document.getElementById('inventory-screen-grid')
  const detail = document.getElementById('inventory-item-detail')
  if (!grid || !detail) return

  let currentFilter = 'all'
  let selectedId = null
  let sortAsc = true

  function paintGrid() {
    const items = getFilteredItems(currentFilter)
    const slots = Array.from(grid.querySelectorAll('.inv-slot2'))
    slots.forEach((slot, index) => {
      const item = items[index]
      slot.dataset.itemId = item?.id ?? ''
      slot.disabled = !item
      slot.setAttribute('aria-label', item?.name ?? `Ô trống ${index + 1}`)
      slot.innerHTML = item
        ? `${item.icon ? `<img class="item-icon inventory-item-icon" src="${item.icon}" alt="" loading="lazy" />` : '<span class="inventory-item-icon-placeholder">?</span>'}${item.stackable ? '<span class="stack-badge">1</span>' : ''}<span class="inventory-item-name" style="color:${item.qualityColor ?? item.tierMeta?.color ?? '#d7d7d7'}">${item.name}</span><span class="inventory-item-rarity"></span>`
        : `<span class="inventory-empty-slot">${index + 1}</span>`
      slot.classList.toggle('is-selected', Number(slot.dataset.itemId) === Number(selectedId))
    })
    const label = document.getElementById('inventory-filter-label')
    if (label) label.textContent = currentFilter === 'all' ? 'Tất cả vật phẩm' : currentFilter === 'equipment' ? 'Trang bị' : currentFilter === 'consumable' ? 'Đan dược' : currentFilter === 'material' ? 'Nguyên liệu' : currentFilter === 'manual' ? 'Bí kíp' : 'Khác'
  }

  function selectItem(item) {
    selectedId = item?.id ?? null
    Array.from(grid.querySelectorAll('.inv-slot2')).forEach((slot) => slot.classList.toggle('is-selected', Number(slot.dataset.itemId) === Number(selectedId)))
    detail.innerHTML = renderDetail(item)
    bindDetailActions()
  }

  function bindDetailActions() {
    detail.querySelector('[data-detail-action="main"]')?.addEventListener('click', () => {
      const item = getItemById(selectedId)
      const action = getAction(item)
      if (!item || !action?.slot) return
      const reason = getEquipFailureReason(item.id, action.slot)
      if (reason) {
        window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `Không thể trang bị ${item.name}: ${reason}`, type: 'danger' } }))
        return
      }
      if (equipItem(action.slot, item.id)) window.dispatchEvent(new CustomEvent('game:item-equipped', { detail: { itemId: item.id } }))
    })
    detail.querySelector('[data-detail-action="quick-sell"]')?.addEventListener('click', () => sellSelected())
    detail.querySelector('[data-detail-action="delete"]')?.addEventListener('click', () => deleteSelected())
  }

  function sellSelected() {
    const item = getItemById(selectedId)
    if (!item) return
    const index = player.inventory.findIndex((id) => Number(id) === Number(item.id))
    if (index < 0) return
    const equipped = Object.values(player.equipment).some((id) => Number(id) === Number(item.id))
    if (equipped) {
      window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `Không thể bán ${item.name} khi đang trang bị.`, type: 'warning' } }))
      return
    }
    player.inventory.splice(index, 1)
    player.gold += Number(item.price?.sell ?? 0)
    selectedId = null
    window.dispatchEvent(new CustomEvent('game:inventory-changed'))
  }

  function deleteSelected() {
    const item = getItemById(selectedId)
    if (!item) return
    const index = player.inventory.findIndex((id) => Number(id) === Number(item.id))
    if (index < 0) return
    const equipped = Object.values(player.equipment).some((id) => Number(id) === Number(item.id))
    if (equipped) return
    player.inventory.splice(index, 1)
    selectedId = null
    window.dispatchEvent(new CustomEvent('game:inventory-changed'))
  }

  function sortInventory() {
    player.inventory.sort((a, b) => {
      const ia = getItemById(a)
      const ib = getItemById(b)
      const nameA = ia?.name ?? ''
      const nameB = ib?.name ?? ''
      return sortAsc ? nameA.localeCompare(nameB, 'vi') : nameB.localeCompare(nameA, 'vi')
    })
    sortAsc = !sortAsc
    paintGrid()
    if (selectedId) selectItem(getItemById(selectedId))
  }

  grid.addEventListener('click', (event) => {
    const slot = event.target.closest('.inv-slot2')
    if (!slot || !slot.dataset.itemId) return
    const item = getItemById(Number(slot.dataset.itemId))
    if (item) selectItem(item)
  })

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter
      document.querySelectorAll('[data-filter]').forEach((el) => el.classList.toggle('active', el.dataset.filter === currentFilter))
      paintGrid()
      if (selectedId && !getFilteredItems(currentFilter).some((item) => Number(item.id) === Number(selectedId))) {
        selectedId = null
        detail.innerHTML = renderDetail(null)
      }
    })
  })

  document.querySelectorAll('[data-inventory-action="sort"]').forEach((button) => button.addEventListener('click', sortInventory))
  document.querySelectorAll('[data-inventory-action="storage"]').forEach((button) => button.addEventListener('click', () => window.dispatchEvent(new CustomEvent('game:log', { detail: 'Kho đồ đang được phát triển.' }))))
  document.querySelectorAll('[data-inventory-action="split"]').forEach((button) => button.addEventListener('click', () => window.dispatchEvent(new CustomEvent('game:log', { detail: 'Chọn vật phẩm có thể xếp chồng để tách.' }))))
  document.querySelectorAll('[data-inventory-action="quick-sell"]').forEach((button) => button.addEventListener('click', sellSelected))
  document.querySelectorAll('[data-page-action]').forEach((button) => button.addEventListener('click', () => window.dispatchEvent(new CustomEvent('game:log', { detail: 'Túi đồ hiện hiển thị trang 1.' }))))

  paintGrid()
  if (player.inventory.length) selectItem(getItemById(player.inventory[0]))
}
