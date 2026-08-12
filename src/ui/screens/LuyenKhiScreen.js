import '../../craft.css'
import { mountLuyenKhi } from '../controllers/CraftController.js'

export function LuyenKhiScreen() {
  return `
    <div class="craft-screen game-screen">
      <h1 class="craft-title">LUYỆN KHÍ</h1>
      <div class="craft-layout">
        <section class="craft-main-panel">
          <div class="craft-machine-frame"><div class="craft-machine-placeholder">⚒ BÚA LUYỆN KHÍ</div></div>
          <div class="craft-fields">
            <label class="craft-field"><span>Loại trang bị</span><select data-craft-type><option value="">-- Chọn loại trang bị --</option><option value="vu_khi">Vũ khí</option><option value="mu">Mũ</option><option value="ao">Áo</option><option value="baotay">Bao tay</option><option value="dailung">Đai lưng</option><option value="giay">Giày</option></select></label>
            <label class="craft-field"><span>Level</span><select data-craft-level><option value="">-- Chọn level --</option>${Array.from({ length: 12 }, (_, i) => `<option value="${(i + 1) * 10}">Trang bị Lv${(i + 1) * 10}</option>`).join('')}</select></label>
            <label class="craft-field"><span>Phẩm cấp</span><select data-craft-quality><option value="">-- Chọn phẩm cấp --</option><option>Hạ phẩm</option><option>Trung phẩm</option><option>Thượng phẩm</option><option>Cực phẩm</option></select></label>
            <label class="craft-field"><span>Số lượng</span><input type="number" min="1" max="99" value="1"></label>
            <button class="craft-button" type="button">LUYỆN KHÍ</button>
          </div>
        </section>
        <aside class="craft-side-panel">
          <section class="craft-info-box"><h3>Thông tin luyện</h3><div data-craft-info class="craft-result-placeholder">Chọn loại trang bị, level và phẩm cấp để xem thông tin và nguyên liệu.</div></section>
        </aside>
      </div>
    </div>`
}

export function mountLuyenKhiScreen(root) {
  mountLuyenKhi(root)
}
