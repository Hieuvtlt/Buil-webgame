import './style.css'
import './game.css'
import './responsive.css'
import './game-ui-redesign.css'
import './game-ui-compact.css'
import './character-screen-redesign.css'

import characterImg from './assets/character.png'
import { player, getPlayerStats } from './data/character.js'
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
