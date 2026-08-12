import './style.css'
import './game.css'

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
    <aside id="col-right">
      <section>
        <h2 class="panel-title">Thông tin hệ thống</h2>
        <div>Level nhân vật: 1–200</div>
        <div>Trang bị: Lv1–120</div>
        <div>Võ kỹ: 10 + 10 × Trùng Sinh</div>
      </section>
    </aside>
  </div>
`

const contentRoot = document.querySelector('#content-root')
const menuButtons = Array.from(document.querySelectorAll('#left-menu .menu-item'))

function openScreen(name) {
  const screen = screens[name]
  if (!screen) return
  contentRoot.innerHTML = screen.render()
  screen.mount?.()
}

menuButtons.forEach((button) => {
  button.addEventListener('click', () => {
    menuButtons.forEach((item) => item.classList.remove('active'))
    button.classList.add('active')
    openScreen(button.dataset.screen)
  })
})

openScreen('Nhân vật')
