import { alchemyMaterials } from '../../data/items/alchemy.js'

export function LuyenDanScreen() {
  const herbs = alchemyMaterials.slice(0, 8)

  return `
    <div class="craft-screen game-screen">
      <h1 class="craft-title">LUYỆN ĐAN</h1>
      <div class="craft-layout">
        <section class="craft-main-panel">
          <div class="craft-machine-frame"><div class="craft-machine-placeholder">ĐAN LÔ</div></div>
          <div class="craft-fields">
            <label class="craft-field"><span>Loại đan</span><select><option>-- Chọn loại đan --</option><option>Hồi máu</option><option>Hồi mana</option><option>EXP</option><option>EXP võ kỹ</option></select></label>
            <label class="craft-field"><span>Level</span><select><option>-- Chọn level --</option>${Array.from({ length: 10 }, (_, i) => `<option>Đan dược Lv${i + 1}</option>`).join('')}</select></label>
            <label class="craft-field"><span>Phẩm cấp</span><select><option>-- Chọn phẩm cấp --</option><option>Hạ phẩm</option><option>Trung phẩm</option><option>Thượng phẩm</option><option>Cực phẩm</option></select></label>
            <label class="craft-field"><span>Số lượng</span><input type="number" min="1" max="99" value="1"></label>
            <button class="craft-button" type="button">LUYỆN ĐAN</button>
          </div>
        </section>
        <aside class="craft-side-panel">
          <section class="craft-info-box"><h3>Thông tin</h3><div class="craft-result-placeholder">Chọn loại đan, level và phẩm cấp để xem thông tin.</div></section>
          <section class="craft-info-box"><h3>Nguyên liệu</h3><div class="craft-material-list">${herbs.map((item) => `<div class="craft-material-row"><span>${item.name}</span><b>x${item.quantity ?? 1}</b></div>`).join('')}</div></section>
        </aside>
      </div>
    </div>`
}
