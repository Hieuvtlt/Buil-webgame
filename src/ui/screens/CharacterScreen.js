import characterImg from '../../assets/character.png'
import { player, getPlayerStats, getMaxSkillLevel, getEquippedItem } from '../../data/character.js'
import { EQUIPMENT_SLOTS } from '../../data/equipmentSlots.js'

const RESISTANCE_LABELS = [
  ['poisonResistance', 'Kháng độc'],
  ['fireResistance', 'Kháng hỏa'],
  ['iceResistance', 'Kháng băng'],
  ['lightningResistance', 'Kháng lôi'],
]

function renderResource(label, value, max, type) {
  const safeMax = Math.max(1, Number(max) || 1)
  const percent = Math.max(0, Math.min(100, (Number(value) || 0) / safeMax * 100))
  return `
    <div class="character-resource-row">
      <span>${label}</span>
      <strong>${value} / ${max}</strong>
      <div class="character-resource-bar ${type}"><span style="width:${percent}%"></span></div>
    </div>
  `
}

function renderEquipSlot(slot) {
  const item = getEquippedItem(slot.id)
  return `
    <button class="character-equip-slot-v2${item ? ' has-item' : ''}" type="button"
      data-slot-id="${slot.id}" data-slot-index="${EQUIPMENT_SLOTS.indexOf(slot)}" data-has-item="${item ? 'true' : 'false'}">
      ${item
        ? `<img class="character-equip-icon-v2" src="${item.icon}" alt="" /><span>${item.name}</span>`
        : `<span class="character-equip-empty">${slot.name}<br>Trống</span>`}
    </button>
  `
}

export function CharacterScreen() {
  const stats = getPlayerStats()
  const leftEquip = EQUIPMENT_SLOTS.filter((slot) => ['weapon', 'armor', 'gloves', 'belt', 'boots'].includes(slot.id))
  const rightEquip = EQUIPMENT_SLOTS.filter((slot) => ['helmet', 'necklace', 'amulet', 'ring1', 'ring2'].includes(slot.id))

  return `
    <div class="character-screen-v2">
      <div class="character-tabs">
        <button class="character-tab active" type="button">Thông tin</button>
        <button class="character-tab" type="button">Thuộc tính</button>
        <button class="character-tab" type="button">Danh hiệu</button>
        <button class="character-tab" type="button">Kinh mạch</button>
      </div>

      <div class="character-main-v2">
        <section class="character-info-v2">
          <div class="character-panel-v2">
            <h3 class="character-panel-title-v2">THÔNG TIN NHÂN VẬT</h3>
            <div class="character-basic-grid">
              <div class="character-basic-row"><b>Tên:</b><span>${player.name}</span></div>
              <div class="character-basic-row"><b>Cấp:</b><span>${player.level} / 200</span></div>
              <div class="character-basic-row"><b>Môn phái:</b><span>${player.sect === 'tanTu' ? 'Tán Tu' : player.sect}</span></div>
              <div class="character-basic-row"><b>Trùng sinh:</b><span>${player.rebirth}</span></div>
            </div>
            <div class="character-resource">
              ${renderResource('HP', player.hp, stats.maxHp, 'hp')}
              ${renderResource('MP', player.mp, stats.maxMp, 'mp')}
              ${renderResource('EXP', player.exp, player.expToNextLevel, 'exp')}
            </div>
          </div>
        </section>

        <section class="character-panel-v2 character-equipment-v2">
          <h3 class="character-panel-title-v2">TRANG BỊ</h3>
          <div class="character-equipment-stage">
            <div class="character-equip-column" id="equip-column-left">
              ${leftEquip.map(renderEquipSlot).join('')}
            </div>
            <div class="character-figure-v2">
              <img src="${characterImg}" alt="Nhân vật" class="character-avatar-v2" />
            </div>
            <div class="character-equip-column" id="equip-column-right">
              ${rightEquip.map(renderEquipSlot).join('')}
            </div>
          </div>
          <div class="character-equip-actions-v2">
            <button class="action-btn danger" type="button" id="btn-unequip">Gỡ</button>
          </div>
          <div class="character-equip-hint-v2">Chọn ô trang bị để xem hoặc gỡ. Muốn trang bị/thay thế, chọn item trong Túi đồ.</div>
        </section>
      </div>

      <section class="character-panel-v2 character-combat-v2">
        <h3 class="character-panel-title-v2">CHỈ SỐ CHIẾN ĐẤU</h3>
        <div class="character-combat-grid">
          <div class="character-combat-item"><span>HP tối đa</span><b>${stats.maxHp}</b></div>
          <div class="character-combat-item"><span>MP tối đa</span><b>${stats.maxMp}</b></div>
          <div class="character-combat-item"><span>Ngoại công</span><b>${stats.attackMin} - ${stats.attackMax}</b></div>
          <div class="character-combat-item"><span>Nội công</span><b>${stats.magicAttack ?? 0}</b></div>
          <div class="character-combat-item"><span>Ngoại phòng</span><b>${stats.defense}</b></div>
          <div class="character-combat-item"><span>Nội phòng</span><b>${stats.magicDefense ?? 0}</b></div>
          <div class="character-combat-item"><span>Chính xác</span><b>${stats.accuracy}</b></div>
          <div class="character-combat-item"><span>Né tránh</span><b>${stats.dodge}</b></div>
          <div class="character-combat-item"><span>Chí mạng</span><b>${stats.critRate ?? 0}%</b></div>
          ${RESISTANCE_LABELS.map(([key, label]) => `
            <div class="character-combat-item resistance"><span>${label}</span><b>${stats[key] ?? 0}%</b></div>
          `).join('')}
          <div class="character-combat-item"><span>Max võ kỹ</span><b>${getMaxSkillLevel()}</b></div>
        </div>
      </section>
    </div>
  `
}
