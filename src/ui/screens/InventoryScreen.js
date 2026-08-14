import { player } from '../../data/character.js'
import { getItemById } from '../../data/items/index.js'

const FILTERS = [
  ['all', 'Tất cả'],
  ['equipment', 'Trang bị'],
  ['consumable', 'Đan dược'],
  ['material', 'Nguyên liệu'],
  ['manual', 'Bí kíp'],
  ['other', 'Khác'],
]

function getItemColor(item) {
  return item?.qualityColor ?? item?.tierMeta?.color ?? '#d7d7d7'
}

function renderItem(item, index) {
  const color = getItemColor(item)
  const icon = item?.icon
  const quantity = item?.stackable ? 1 : null
  return `
    <button class="inv-slot2 inventory-item-slot${item?.stackable ? ' is-stackable' : ''}" type="button"
      data-inv-slot-index="${index}"
      data-item-id="${item?.id ?? ''}"
      style="${item ? `--item-color:${color}` : ''}"
      aria-label="${item?.name ?? `Ô trống ${index + 1}`}" ${item ? '' : 'disabled'}>
      ${item ? `
        <span class="inventory-item-rarity"></span>
        ${icon ? `<img class="item-icon inventory-item-icon" src="${icon}" alt="" loading="lazy" />` : '<span class="inventory-item-icon-placeholder">?</span>'}
        ${quantity ? `<span class="stack-badge">${quantity}</span>` : ''}
        <span class="inventory-item-name" style="color:${color}">${item.name}</span>
      ` : `<span class="inventory-empty-slot">${index + 1}</span>`}
    </button>
  `
}

export function InventoryScreen() {
  const inventoryItems = player.inventory
    .map((id) => getItemById(id))
    .filter(Boolean)

  const capacity = 150
  const used = inventoryItems.length

  return `
    <div class="inventory-screen inventory-screen-v2 game-screen">
      <div class="inventory-topbar">
        <div class="inventory-capacity">${used}/${capacity} ô sử dụng</div>
      </div>

      <div class="inventory-layout-v2 inventory-layout-tooltip">
        <section class="inventory-main-panel inventory-main-panel-full">
          <div class="inventory-filter-tabs" role="tablist" aria-label="Loại vật phẩm">
            ${FILTERS.map(([key, label], index) => `
              <button type="button" class="inventory-filter-tab${index === 0 ? ' active' : ''}" data-filter="${key}">${label}</button>
            `).join('')}
          </div>

          <div class="inventory-grid-header">
            <span id="inventory-filter-label">Tất cả vật phẩm</span>
            <div class="inventory-grid-tools">
              <span>${used}/${capacity}</span>
              <button type="button" class="inventory-tool-btn" data-inventory-action="sort">Sắp xếp</button>
            </div>
          </div>

          <div class="inventory-grid-wrap-v2">
            <div class="inventory-grid inventory-grid-v2" id="inventory-screen-grid">
              ${Array.from({ length: capacity }, (_, i) => renderItem(inventoryItems[i], i)).join('')}
            </div>
          </div>

          <div class="inventory-bottom-actions">
            <button type="button" class="inventory-action-btn secondary" data-inventory-action="sort">Sắp xếp</button>
            <button type="button" class="inventory-action-btn" data-inventory-action="quick-sell">Bán nhanh</button>
            <button type="button" class="inventory-action-btn" data-inventory-action="split">Tách vật phẩm</button>
          </div>

          <div class="inventory-page-row">
            <button type="button" class="inventory-page-btn" data-page-action="prev">‹</button>
            <button type="button" class="inventory-page-number active">1</button>
            <button type="button" class="inventory-page-number">2</button>
            <button type="button" class="inventory-page-number">3</button>
            <button type="button" class="inventory-page-number">4</button>
            <button type="button" class="inventory-page-number">5</button>
            <button type="button" class="inventory-page-btn" data-page-action="next">›</button>
          </div>
        </section>
      </div>

      <div class="inventory-footer-stats">
        <span>Ngân lượng <strong>${Number(player.gold ?? 0).toLocaleString('vi-VN')}</strong></span>
        <span>Linh thạch <strong>${Number(player.spiritStone ?? 0).toLocaleString('vi-VN')}</strong></span>
      </div>
    </div>
  `
}
