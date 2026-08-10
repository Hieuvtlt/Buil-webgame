export function InventoryScreen() {
  const slotsPerPage = 50

  return `
    <div class="inventory-screen">
      <h3 class="panel-title-sm">Túi đồ</h3>

      <div class="inventory-pagination" id="inventory-pagination-2">
        <button class="inv-page-btn active" type="button" data-inv-page="1">Trang 1</button>
        <button class="inv-page-btn" type="button" data-inv-page="2">2</button>
        <button class="inv-page-btn" type="button" data-inv-page="3">3</button>
      </div>

      <div class="inventory-layout-2col">
        <div class="inventory-left">
          <div class="inventory-grid-wrap">
            <div class="inventory-grid" id="inventory-screen-grid">
              ${Array.from({ length: slotsPerPage }, (_, i) => `
                <div class="inv-slot2"
                  role="button"
                  tabindex="0"
                  data-inv-slot-index="${i}"
                  data-item-name="Vật phẩm ${i + 1}"
                  data-item-type="Trang bị"
                  data-item-level="${(i % 5) + 1}"
                  data-item-desc="Mô tả placeholder cho Vật phẩm ${i + 1}">
                  Slot ${i + 1}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="inventory-right">
          <div class="inv-info-box">
            <div class="inv-info-title" id="inv-info-title">Tên item (chọn)</div>
            <div class="inv-info-meta" id="inv-info-meta">Loại: - | Cấp: -</div>
            <div class="inv-info-desc" id="inv-info-desc">Mô tả: (placeholder)</div>
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