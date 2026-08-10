import characterImg from '../../assets/character.png'

export function CharacterScreen() {
  return `
    <div class="character-screen">
      <section class="char-left">
        <div class="char-left-top">
          <h3 class="panel-title-sm">Thông tin nhân vật</h3>

          <div class="char-basic">
            <div><b>Tên:</b> Tên nhân vật</div>
            <div><b>HP:</b> 75 / 100</div>
            <div><b>MP:</b> 50 / 100</div>
          </div>

          <div class="char-hint">Placeholder: thông tin khác (level, exp, trạng thái...)</div>
        </div>

        <div class="char-left-bottom">
          <h3 class="panel-title-sm">Thuộc tính</h3>

          <div class="attr-grid">
            <div class="attr-item"><span>Ngoại công</span><b>0</b></div>
            <div class="attr-item"><span>Nội công</span><b>0</b></div>
            <div class="attr-item"><span>Thân pháp</span><b>0</b></div>
            <div class="attr-item"><span>Thể lực</span><b>0</b></div>
          </div>

          <div class="free-point">
            <span>Điểm tự do</span>
            <b>1</b>
          </div>
        </div>
      </section>

      <section class="char-right">
        <h3 class="panel-title-sm">Nhân vật & Trang bị</h3>

        <div class="char-figure-area">
          <div class="figure-placeholder">
            <img src="${characterImg}" alt="Nhân vật" class="character-avatar" />
          </div>

          <div class="equip-panel">
            <div class="equip-title">Trang bị (10 slot)</div>

            <div class="equip-grid" id="equip-grid">
              ${Array.from({ length: 10 }, (_, i) => `
                <button
                  class="equip-slot"
                  type="button"
                  data-slot-index="${i}"
                  data-has-item="${i === 0 ? 'true' : 'false'}"
                >
                  Slot ${i + 1}
                </button>
              `).join('')}
            </div>

            <!-- NÚT BÊN DƯỚI KHUNG TRANG BỊ -->
            <div class="equip-actions">
              <button class="action-btn" type="button" id="btn-equip">Trang bị</button>
              <button class="action-btn danger" type="button" id="btn-unequip">Gỡ</button>
            </div>
          </div>
        </div>

          <!-- Khung túi đồ nằm dưới -->
        <div class="inventory-under-panel">
          <div class="inventory-under-title">Túi đồ (Thiết bị): Trang 1</div>

          <div class="inventory-pagination" id="inventory-pagination">
            <button class="page-btn active" type="button" data-page="1">Trang 1</button>
            <button class="page-btn" type="button" data-page="2">2</button>
            <button class="page-btn" type="button" data-page="3">3</button>
          </div>

          <div class="inventory-under-grid" id="inventory-grid">
            ${Array.from({ length: 24 }, (_, i) => `
              <button
                class="inv-slot"
                type="button"
                data-inv-index="${i}"
                data-has-item="false"
              >
                Slot ${i + 1}
              </button>
            `).join('')}
          </div>
        </div>
      </section>
    </div>
  `;
}