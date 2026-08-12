import { items } from '../../data/items/index.js'

function getItemColor(item) {
  return item?.tierMeta?.color ?? '#d7d7d7'
}

export function InventoryScreen() {
  const slotsPerPage = 50
  const previewItems = items.slice(0, slotsPerPage)

  return `
    <div class="inventory-screen game-screen">
      <h3 class="panel-title-sm">Túi đồ</h3>
      <div class="inventory-layout-2col">
        <div class="inventory-left">
          <div class="inventory-grid-wrap">
            <div class="inventory-grid" id="inventory-screen-grid">
              ${Array.from({ length: slotsPerPage }, (_, i) => {
                const item = previewItems[i]
                const color = getItemColor(item)
                const quantityText = item ? (item.stackable ? `x1/${item.maxStack}` : 'x1') : ''
                return `
                  <button class="inv-slot2${item?.stackable ? ' is-stackable' : ''}" type="button"
                    data-inv-slot-index="${i}"
                    data-item-id="${item?.id ?? ''}"
                    data-item-name="${item?.name ?? ''}"
                    data-item-type="${item?.type ?? ''}"
                    style="${item ? `color:${color}` : ''}">
                    ${item ? `
                      <span class="item-icon-wrap">
                        <img class="item-icon" src="${item.icon}" alt="${item.name}" loading="lazy" />
                        ${item.stackable ? `<span class="stack-badge">${quantityText}</span>` : ''}
                      </span>
                      <span class="item-name">${item.name}</span>
                    ` : `Slot ${i + 1}`}
                  </button>
                `
              }).join('')}
            </div>
          </div>
        </div>

        <div class="inventory-right">
          <div class="inv-info-box" id="inv-info-box">
            <div class="inv-info-icon-wrap">
              <img class="inv-info-icon" id="inv-info-icon" src="/assets/icons/potion.svg" alt="" />
            </div>
            <div class="inv-info-title" id="inv-info-title">Chọn vật phẩm</div>
            <div class="inv-info-meta" id="inv-info-meta">Đẳng cấp yêu cầu: -</div>
            <div class="inv-info-stats" id="inv-info-stats">-</div>
          </div>
        </div>
      </div>
      <div class="inventory-currency">
        <div class="currency-box">Ngân lượng: 0</div>
        <div class="currency-box">Linh thạch: 0</div>
      </div>
    </div>
  `
}
