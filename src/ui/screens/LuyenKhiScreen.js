import '../../craft.css'
import { mountLuyenKhi } from '../controllers/CraftController.js'
import { setupPersistentCraftImage } from '../craftImageStorage.js'

export function LuyenKhiScreen() {
  const html = `
    <div class="craft-screen game-screen craft-forging">
      <div class="craft-layout">
        <section class="craft-main-panel">
          <div class="craft-machine-frame craft-image-slot" data-image-slot="hinhbualuyenkhi" title="Click để thay hình">
            <input class="craft-image-input" type="file" accept="image/*" data-image-input hidden>
            <div class="craft-machine-placeholder">THAY HÌNH</div>
          </div>
          <div class="craft-fields">
            <label class="craft-field"><span>Loại trang bị</span><select data-craft-type><option value="">-- Chọn loại trang bị --</option><option value="vu_khi">Vũ khí</option><option value="mu">Mũ</option><option value="ao">Áo</option><option value="baotay">Bao tay</option><option value="dailung">Đai lưng</option><option value="giay">Giày</option><option value="daychuyen">Dây chuyền</option><option value="ngocboi">Ngọc bội</option><option value="nhan">Nhẫn</option></select></label>
            <label class="craft-field"><span>Cấp độ</span><select data-craft-level><option value="">-- Chọn cấp độ --</option><option value="1">Hoàng cấp</option><option value="31">Huyền cấp</option><option value="61">Địa cấp</option><option value="91">Thiên cấp</option></select></label>
            <label class="craft-field"><span>Phẩm cấp</span><select data-craft-quality><option value="">-- Chọn phẩm cấp --</option><option value="Hạ phẩm">Hạ phẩm</option><option value="Trung phẩm">Trung phẩm</option><option value="Thượng phẩm">Thượng phẩm</option><option value="Cực phẩm">Cực phẩm</option></select></label>
            <label class="craft-field"><span>Số lượng</span><input type="number" min="1" max="1" value="1"></label>
            <button class="craft-button" type="button">LUYỆN KHÍ</button>
          </div>
        </section>
        <aside class="craft-side-panel">
          <section class="craft-info-box craft-info-unified"><h3>Thông tin luyện</h3><div data-craft-info class="craft-result-placeholder">Chọn loại trang bị, cấp độ và phẩm cấp để xem thông tin và nguyên liệu.</div></section>
        </aside>
      </div>
    </div>`
  setTimeout(() => {
    const root = document.querySelector('.craft-screen')
    mountLuyenKhi(root)
    setupPersistentCraftImage(root)
  }, 0)
  return html
}

export function mountLuyenKhiScreen(root) {
  mountLuyenKhi(root)
}
