// Icon VLTK đã export sang public/assets/vltk.
// Trang bị ưu tiên cấu trúc PNG mới: loại trang bị -> phẩm cấp -> đẳng phẩm.
// Các nhóm chưa đổi tên vẫn dùng catalog cũ làm fallback.

const root = '/assets/vltk'

const pick = (folder, files) => files.map((file) => `${root}/${folder}/${file}`)

const EQUIPMENT_TIER_NAMES = {
  hoang: 'hoangcap',
  huyen: 'huyencap',
  dia: 'diacap',
  thien: 'Thiencap',
}

const QUALITY_NAMES = {
  haPham: 'hapham',
  trungPham: 'trungpham',
  thuongPham: 'thuongpham',
  cucPham: 'cucpham',
}

const SIMPLE_EQUIPMENT_FOLDERS = {
  helmet: 'mu',
  gauntlet: 'baotay',
  belt: 'dailung',
  boots: 'giay',
  necklace: 'daychuyen',
  amulet: 'ngocboi',
  ring: 'nhan',
}

const WEAPON_FOLDERS = {
  sword: 'kiem',
  blade: 'dao',
  staff: 'bong',
  spear: 'thuong',
}

function getTier(level) {
  const safeLevel = Math.max(1, Math.min(120, Number(level) || 1))
  if (safeLevel <= 30) return 'hoang'
  if (safeLevel <= 60) return 'huyen'
  if (safeLevel <= 90) return 'dia'
  return 'thien'
}

function getNewEquipmentIcon(data = {}) {
  const tier = getTier(data.level)
  const tierFolder = EQUIPMENT_TIER_NAMES[tier]
  const category = data.category

  // Áo có icon riêng theo cả phẩm cấp và đẳng phẩm.
  if (category === 'body') {
    const quality = QUALITY_NAMES[data.quality]
    if (quality) {
      const tierFile = tier === 'thien' ? 'Thiencap' : tierFolder
      const tierPrefix = tier === 'thien' ? 'thiencap' : tier
      return `${root}/ao/${tierFile}/${tierPrefix}${quality}.png`
    }
  }

  // Vũ khí có icon theo loại vũ khí và phẩm cấp trang bị.
  if (data.type === 'weapon') {
    const folder = WEAPON_FOLDERS[category]
    if (folder) return `${root}/vukhi/${folder}/${tierFolder}.png`
  }

  // Mũ, bao tay, đai lưng, giày, dây chuyền, ngọc bội, nhẫn.
  const folder = SIMPLE_EQUIPMENT_FOLDERS[category]
  if (folder) return `${root}/${folder}/${tierFolder}.png`

  return null
}

export const VLTK_ICONS = {
  potion: pick('danduoc', [
    '07325EB5_0000.png', '0B0D6473_0000.png', '123D5C2D_0000.png',
    '15D3BFBA_0000.png', '189F354B_0000.png', '242973C8_0000.png',
    '25E553AE_0000.png', '31242D3B_0000.png', '360E18B9_0000.png',
    '3B16B363_0000.png', '5E996F3D_0000.png', 'AB40780B_0000.png',
    'ABD74F23_0000.png', 'BE625910_0000.png', 'F6A92DA9_0000.png',
    'F84F1D09_0000.png',
  ]),
  manual: pick('bikip', [
    '00ED0AC3_0000.png', '117AD7D4_0000.png', '17F69AA1_0000.png',
    '29D14936_0000.png', '49739D86_0000.png', '70ADF78A_0000.png',
    '97BF8906_0000.png', '98036BB9_0000.png',
  ]),
  herb: pick('linhduoc', [
    '04F0B0A6_0000.png', '1DF29F57_0000.png', '23FE6829_0000.png',
    '260ADF06_0000.png', '275C0A84_0000.png', '38590AB2_0000.png',
    '3D61A55C_0000.png', '3ED5F18F_0000.png', '40825D1E_0000.png',
    '41EB889C_0000.png', '4826BA95_0000.png', 'FB1CD881_0000.png',
  ]),
  ore: pick('khoangthach', [
    '09992B40_0000.png', '1BB5D9CD_0000.png', '20C1D5A9_0000.png',
    '3077C94C_0000.png', '35CD47E5_0000.png', '376BEEA2_0000.png',
    '6220952B_0000.png', '8451221C_0000.png', '882114A3_0000.png',
    'B650062A_0000.png', 'C553E21D_0000.png', 'FB2F835E_0000.png',
  ]),
  weapon: pick('vukhi', [
    '00D4539E_0000.png', '07D1292E_0000.png', '0B0627D5_0000.png',
    '0DF80023_0000.png', '0E4B327C_0000.png', '10857A7D_0000.png',
    '1437351B_0000.png', '17CA4824_0000.png', '1ACD7899_0000.png',
    '1DA745F7_0000.png', '1E727740_0000.png', '1EA91E69_0000.png',
    '2B566F0A_0000.png', '2B68A213_0000.png', '2D90A13F_0000.png',
    '2DC84858_0000.png',
  ]),
}

function fromList(list, index = 0) {
  if (!list?.length) return null
  return list[Math.abs(index) % list.length]
}

export function getVltkIcon(data = {}) {
  if (data.icon) return data.icon

  const equipmentIcon = getNewEquipmentIcon(data)
  if (equipmentIcon) return equipmentIcon

  const index = Number(data.level ?? 1) - 1
  if (data.type === 'consumable') return fromList(VLTK_ICONS.potion, index)
  if (data.type === 'manual') return fromList(VLTK_ICONS.manual, index)
  if (data.type === 'weapon') return fromList(VLTK_ICONS.weapon, index)
  if (data.category === 'ore') return fromList(VLTK_ICONS.ore, index)
  if (data.category === 'herb') return fromList(VLTK_ICONS.herb, index)

  return null
}
