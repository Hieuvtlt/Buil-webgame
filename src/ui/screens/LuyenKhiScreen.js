import { forgingMaterials } from '../../data/items/forging.js'

export function LuyenKhiScreen() {
  const materials = forgingMaterials.slice(0, 10)

  return `
    <div class="craft-screen game-screen">
      <h1 class="craft-title">LUYỆN KHÍ</h1>
      <div class="craft-layout">
        <section class="craft-main-panel">
          <div class="craft-machine-frame"><div class="craft-machine-placeholder">⚒ BÚA LUYỆN KHÍ</div></div>
          <div class="craft-fields">
            <label class="craft-field"><span>Loại trang bị</span><select><option>-- Chọn loại trang bị --</option><option>Vũ khí</option><option>Mũ</option><option>Áo</option><option>Bao tay</option><option>Đai lưng</option><option>Giày</option><option>Dây chuyền</option></select></label>
            <label class="craft-field"><span>Level</span><select><option>-- Chọn level --</option>${Array.from({ length: 12 }, (_, i) => `<option>Trang bị Lv${(i + 1) * 10}</option>`).join('')}</select></label>
            <label class="craft-field"><span>Phẩm cấp</span><select><option>-- Chọn phẩm cấp --</option><option>Hạ phẩm</option><option>Trung phẩm</option><option>Thượng phẩm</option><option>Cực phẩm</option></select></label>
            <label class="craft-field"><span>Số lượng</span><input type="number" min="1" max="99" value="1"></label>
            <button class="craft-button" type="button">LUYỆN KHÍ</button>
          </div>
        </section>
        <aside class="craft-side-panel">
          <section class="craft-info-box"><h3>Thông tin</h3><div class="craft-result-placeholder">Chọn loại trang bị, level và phẩm cấp để xem thông tin.</div></section>
          <section class="craft-info-box"><h3>Nguyên liệu</h3><div class="craft-material-list">${materials.map((item) => `<div class="craft-material-row"><span>${item.name}</span><b>x${item.quantity ?? 1}</b></div>`).join('')}</div></section>
        </aside>
      </div>
    </div>`
}
