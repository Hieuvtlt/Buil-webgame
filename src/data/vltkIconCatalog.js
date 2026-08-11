// Icon VLTK đã export sang public/assets/vltk.
// Tên PNG giữ nguyên như nguồn tham khảo; mapping hiện tại theo NHÓM item.
// Khi xác định chính xác từng mã item, chỉ cần thay bảng này, không phải sửa UI.

const root = '/assets/vltk'

const pick = (folder, files) => files.map((file) => `${root}/${folder}/${file}`)

export const VLTK_ICONS = {
  potion: pick('danduoc', [
    '07325EB5_0000.png',
    '0B0D6473_0000.png',
    '123D5C2D_0000.png',
    '15D3BFBA_0000.png',
    '189F354B_0000.png',
    '242973C8_0000.png',
    '25E553AE_0000.png',
    '31242D3B_0000.png',
    '360E18B9_0000.png',
    '3B16B363_0000.png',
    '5E996F3D_0000.png',
    'AB40780B_0000.png',
    'ABD74F23_0000.png',
    'BE625910_0000.png',
    'F6A92DA9_0000.png',
    'F84F1D09_0000.png',
  ]),
  manual: pick('bikip', [
    '00ED0AC3_0000.png',
    '117AD7D4_0000.png',
    '17F69AA1_0000.png',
    '29D14936_0000.png',
    '49739D86_0000.png',
    '70ADF78A_0000.png',
    '97BF8906_0000.png',
    '98036BB9_0000.png',
  ]),
  herb: pick('linhduoc', [
    '04F0B0A6_0000.png',
    '1DF29F57_0000.png',
    '23FE6829_0000.png',
    '260ADF06_0000.png',
    '275C0A84_0000.png',
    '38590AB2_0000.png',
    '3D61A55C_0000.png',
    '3ED5F18F_0000.png',
    '40825D1E_0000.png',
    '41EB889C_0000.png',
    '4826BA95_0000.png',
    'FB1CD881_0000.png',
  ]),
  ore: pick('khoangthach', [
    '09992B40_0000.png',
    '1BB5D9CD_0000.png',
    '20C1D5A9_0000.png',
    '3077C94C_0000.png',
    '35CD47E5_0000.png',
    '376BEEA2_0000.png',
    '6220952B_0000.png',
    '8451221C_0000.png',
    '882114A3_0000.png',
    'B650062A_0000.png',
    'C553E21D_0000.png',
    'FB2F835E_0000.png',
  ]),
  weapon: pick('vukhi', [
    '00D4539E_0000.png',
    '07D1292E_0000.png',
    '0B0627D5_0000.png',
    '0DF80023_0000.png',
    '0E4B327C_0000.png',
    '10857A7D_0000.png',
    '1437351B_0000.png',
    '17CA4824_0000.png',
    '1ACD7899_0000.png',
    '1DA745F7_0000.png',
    '1E727740_0000.png',
    '1EA91E69_0000.png',
    '2B566F0A_0000.png',
    '2B68A213_0000.png',
    '2D90A13F_0000.png',
    '2DC84858_0000.png',
  ]),
  helmet: pick('mu', [
    '2193718B_0000.png',
    '29CA8EE7_0000.png',
    '2B5C330F_0000.png',
    '41ED748D_0000.png',
    '42CCD24B_0000.png',
    '507B806B_0000.png',
    '570422AD_0000.png',
    'F75626EA_0000.png',
  ]),
  body: pick('ao', [
    '00851804_0000.png',
    '0287BEF5_0000.png',
    '077EC7E0_0000.png',
    '098D77DC_0000.png',
    '18710EF9_0000.png',
    '1F48F6FF_0000.png',
    '2DC52583_0000.png',
    '409EAEA0_0000.png',
    '41C5D08A_0000.png',
    '4631CDED_0000.png',
    '530C546D_0000.png',
    '5D47E6AA_0000.png',
    'AAF85AAD_0000.png',
    'B6F89BCC_0000.png',
    'C98AF290_0000.png',
    'CCC1BA96_0000.png',
    'F974B631_0000.png',
  ]),
  boots: pick('giay', [
    '037DD33F_0000.png',
    '12B39CD9_0000.png',
    'C04988F9_0000.png',
    'C77C848A_0000.png',
  ]),
  gauntlet: pick('baotay', [
    '930CD347_0000.png',
    'A0174659_0000.png',
    'F9C42044_0000.png',
  ]),
  belt: pick('dailung', [
    '00D27811_0000.png',
    '0272D8E2_0000.png',
    '111C39F7_0000.png',
    '12BC99B8_0000.png',
    '17FC5926_0000.png',
    '19331884_0000.png',
    '1A53F955_0000.png',
    '1F92B8B3_0000.png',
    '21A4AAF3_0000.png',
    '22C50AC4_0000.png',
    '39864B66_0000.png',
    '3B262B37_0000.png',
    '79EC3E8C_0000.png',
  ]),
}

function fromList(list, index = 0) {
  if (!list?.length) return null
  return list[Math.abs(index) % list.length]
}

export function getVltkIcon(data = {}) {
  if (data.icon) return data.icon

  const index = Number(data.level ?? 1) - 1
  if (data.type === 'consumable') return fromList(VLTK_ICONS.potion, index)
  if (data.type === 'manual') return fromList(VLTK_ICONS.manual, index)
  if (data.type === 'weapon') return fromList(VLTK_ICONS.weapon, index)

  if (data.category === 'ore') return fromList(VLTK_ICONS.ore, index)
  if (data.category === 'herb') return fromList(VLTK_ICONS.herb, index)
  if (data.category === 'helmet') return fromList(VLTK_ICONS.helmet, index)
  if (data.category === 'body') return fromList(VLTK_ICONS.body, index)
  if (data.category === 'boots') return fromList(VLTK_ICONS.boots, index)
  if (data.category === 'gauntlet') return fromList(VLTK_ICONS.gauntlet, index)
  if (data.category === 'belt') return fromList(VLTK_ICONS.belt, index)

  return null
}
