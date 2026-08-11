import { items } from '../../data/items/index.js'

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
                const color = item?.tierMeta?.color ?? '#d7d7d7'
                return `
                  <button class="inv-slot2" type="button"
                    data-inv-slot-index="${i}"
                    data-item-id="${item?.id ?? ''}"
                    data-item-name="${item?.name ?? ''}"
                    data-item-type="${item?.type ?? ''}"
                    style="${item ? `color:${color}` : ''}">
                    ${item ? item.name : `Slot ${i + 1}`}
                  </button>
                `
              }).join('')}
            </div>
          </div>
        </div>

        <div class="inventory-right">
          <div class="inv-info-box">
            <div class="inv-info-title" id="inv-info-title">Chọn vật phẩm</div>
            <div class="inv-info-meta" id="inv-info-meta">Loại: - | Cấp: -</div>
            <div class="inv-info-desc" id="inv-info-desc">Mô tả: -</div>
          </div>
        </div>
      </div>
      <div class="inventory-currency">
        <div class="currency-box">Ngân lượng: ${0}</div>
        <div class="currency-box">Linh thạch: ${0}</div>
      </div>
    </div>
  `
}
