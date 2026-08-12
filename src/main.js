import './style.css'
import './game.css'
import './responsive.css'

import { CharacterScreen } from './ui/screens/CharacterScreen.js'
import { InventoryScreen } from './ui/screens/InventoryScreen.js'
import { SkillsScreen } from './ui/screens/SkillsScreen.js'
import { LuyenDanScreen } from './ui/screens/LuyenDanScreen.js'
import { LuyenKhiScreen } from './ui/screens/LuyenKhiScreen.js'
import { HopThanhScreen, mountHopThanhScreen } from './ui/screens/HopThanhScreen.js'
import { ThuongHoiScreen } from './ui/screens/ThuongHoiScreen.js'
import { NhiemVuScreen } from './ui/screens/NhiemVuScreen.js'
import { NgoaiCanhScreen } from './ui/screens/NgoaiCanhScreen.js'
import { GMScreen } from './ui/screens/GMScreen.js'
import { SettingsScreen } from './ui/screens/SettingsScreen.js'

import { mountCharacterScreen } from './ui/controllers/CharacterController.js'
import { mountInventoryScreen } from './ui/controllers/InventoryController.js'
import { mountSkillsScreen } from './ui/controllers/SkillsController.js'
import { mountMerchantScreen } from './ui/controllers/MerchantController.js'

const screens = {
  'Nhân vật': { render: CharacterScreen, mount: mountCharacterScreen },
  'Túi đồ': { render: InventoryScreen, mount: mountInventoryScreen },
  'Kỹ năng': { render: SkillsScreen, mount: mountSkillsScreen },
  'Luyện đan': { render: LuyenDanScreen },
  'Luyện khí': { render: LuyenKhiScreen },
  'Hợp thành': { render: HopThanhScreen, mount: mountHopThanhScreen },
  'Thương hội': { render: ThuongHoiScreen, mount: mountMerchantScreen },
  'Nhiệm vụ': { render: NhiemVuScreen },
  'Ngoại cảnh': { render: NgoaiCanhScreen },
  'GM': { render: GMScreen },
  'Cài đặt': { render: SettingsScreen },
}

const menuNames = Object.keys(screens)

document.querySelector('#app').innerHTML = `
  <div id="game-grid">
    <aside id="col-left">
      <h2 class="panel-title">Menu</h2>
      <nav id="left-menu">
        ${menuNames.map((name, index) => `
          <button class="menu-item${index === 0 ? ' active' : ''}" type="button" data-screen="${name}">${name}</button>
        `).join('')}
      </nav>
    </aside>

    <main id="col-center">
      <h2 class="panel-title">Màn hình</h2>
      <div id="content-root"></div>
    </main>

    <aside id="col-right" aria-label="Auto và nhật ký">
      <section id="auto-panel" class="side-panel">
        <h3 class="side-panel-title">[ AUTO ]</h3>
        <div class="auto-options">
          <label><input type="checkbox" checked /> Auto đánh</label>
          <label><input type="checkbox" checked /> Auto nhặt</label>
          <label><input type="checkbox" checked /> Auto dùng buff</label>
          <label><input type="checkbox" /> Auto dùng HP &lt; 50%</label>
          <label><input type="checkbox" /> Auto dùng MP &lt; 30%</label>
          <label><input type="checkbox" /> Auto dùng đan dược</label>
          <label><input type="checkbox" /> Auto luyện võ kỹ</label>
        </div>
        <div class="auto-range-row">
          <span>Phạm vi tìm</span>
          <input id="auto-range" type="number" min="1" max="20" value="5" />
        </div>
        <div class="auto-actions">
          <button class="side-action danger" type="button" id="auto-pause">TẠM DỪNG</button>
          <button class="side-action" type="button" id="auto-stop">DỪNG</button>
        </div>
      </section>

      <section id="log-panel" class="side-panel">
        <h3 class="side-panel-title log-title">[ NHẬT KÝ ]</h3>
        <div id="game-log" class="game-log" aria-live="polite">
          <div class="log-line">[Hệ thống] Sẵn sàng.</div>
          <div class="log-line">[Nhân vật] Đã vào trò chơi.</div>
          <div class="log-line">[Túi đồ] Hệ thống trang bị đã sẵn sàng.</div>
        </div>
      </section>
    </aside>
  </div>
`

const contentRoot = document.querySelector('#content-root')
const menuButtons = Array.from(document.querySelectorAll('#left-menu .menu-item'))
let currentScreenName = null

function openScreen(name) {
  const screen = screens[name]
  if (!screen) return
  currentScreenName = name
  contentRoot.innerHTML = screen.render()
  screen.mount?.()
}

function addGameLog(message, type = 'system') {
  const log = document.querySelector('#game-log')
  if (!log) return
  const line = document.createElement('div')
  line.className = `log-line log-${type}`
  line.textContent = `[${new Date().toLocaleTimeString('vi-VN')}] ${message}`
  log.appendChild(line)
  while (log.children.length > 100) log.removeChild(log.firstElementChild)
  log.scrollTop = log.scrollHeight
}

menuButtons.forEach((button) => {
  button.addEventListener('click', () => {
    menuButtons.forEach((item) => item.classList.remove('active'))
    button.classList.add('active')
    openScreen(button.dataset.screen)
    addGameLog(`Mở menu ${button.dataset.screen}.`, 'system')
  })
})

document.querySelector('#auto-pause')?.addEventListener('click', () => {
  addGameLog('Auto đã tạm dừng.', 'warning')
})

document.querySelector('#auto-stop')?.addEventListener('click', () => {
  addGameLog('Auto đã dừng.', 'danger')
})

window.addEventListener('game:inventory-changed', () => {
  if (currentScreenName === 'Túi đồ') openScreen('Túi đồ')
  addGameLog('Túi đồ đã được cập nhật.', 'item')
})

window.addEventListener('game:item-equipped', () => {
  if (currentScreenName === 'Túi đồ') openScreen('Túi đồ')
  addGameLog('Trang bị đã được cập nhật.', 'item')
})

window.addEventListener('game:log', (event) => {
  const detail = event.detail
  if (typeof detail === 'string') addGameLog(detail)
  else if (detail?.message) addGameLog(detail.message, detail.type ?? 'system')
})

openScreen('Nhân vật')
