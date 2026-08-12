import '../../craft.css'

const types = ['Linh dược', 'Đan dược']

export function HopThanhScreen() {
  return `
    <div class="craft-screen game-screen">
      <h1 class="craft-title">HỢP THÀNH</h1>
      <div class="craft-layout">
        <section class="craft-main-panel">
          <div class="craft-machine-frame"><div class="craft-machine-placeholder">KHUNG HỢP THÀNH</div></div>
          <div class="craft-fields">
            <label class="craft-field"><span>Loại</span><select id="fusion-type">${types.map((x) => `<option>${x}</option>`).join('')}</select></label>
            <label class="craft-field"><span>Level</span><select id="fusion-level">${Array.from({length:9},(_,i)=>`<option value="${i+1}">Lv${i+1}</option>`).join('')}</select></label>
            <div class="fusion-rule">2 vật phẩm cùng loại + cùng level → 1 vật phẩm level kế tiếp.</div>
            <div class="fusion-rule">Vượt cấp: tỷ lệ 1%–5% → nhận vật phẩm cao hơn 1 level.</div>
            <button class="craft-button" type="button">HỢP THÀNH</button>
          </div>
        </section>
        <aside class="craft-side-panel">
          <section class="craft-info-box"><h3>Thông tin</h3><div id="fusion-info" class="craft-result-placeholder">Chọn loại và level để xem kết quả.</div></section>
          <section class="craft-info-box"><h3>Nguyên liệu</h3><div id="fusion-material" class="craft-material-list"></div></section>
        </aside>
      </div>
    </div>`
}

export function mountHopThanhScreen() {
  const type = document.querySelector('#fusion-type')
  const level = document.querySelector('#fusion-level')
  const info = document.querySelector('#fusion-info')
  const material = document.querySelector('#fusion-material')
  const update = () => {
    const lv = Number(level.value)
    const next = lv + 1
    const over = lv + 2
    const chance = lv < 9 ? Math.floor(Math.random() * 5) + 1 : 0
    info.innerHTML = `${type.value} Lv${lv}<br><strong>2 Lv${lv} → 1 Lv${next}</strong><br>Vượt cấp lên Lv${over}: ${chance}%`
    material.innerHTML = `<div class="craft-material-row"><span>${type.value} Lv${lv}</span><b>0/2</b></div>`
  }
  type.addEventListener('change', update)
  level.addEventListener('change', update)
  update()
}
