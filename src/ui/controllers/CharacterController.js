import { CharacterScreen } from '../screens/CharacterScreen.js'
import {
  player,
  addFreeAttributePoints,
  unequipItem,
} from '../../data/character.js'

function rerenderCharacter() {
  const root = document.getElementById('content-root')
  if (!root) return
  root.innerHTML = CharacterScreen()
  mountCharacterScreen()
}

export function mountCharacterScreen() {
  document.querySelectorAll('.attr-add-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const attribute = button.dataset.attribute
      if (!addFreeAttributePoints(attribute, 1)) return
      rerenderCharacter()
    })
  })

  let selectedEquipSlot = null
  const equipSlots = document.querySelectorAll('.character-equip-slot-v2')

  equipSlots.forEach((btn) => {
    btn.addEventListener('click', () => {
      equipSlots.forEach((b) => b.classList.remove('is-selected'))
      btn.classList.add('is-selected')
      selectedEquipSlot = btn.dataset.slotId
    })
  })

  document.getElementById('btn-unequip')?.addEventListener('click', () => {
    if (selectedEquipSlot === null) return
    if (!unequipItem(selectedEquipSlot)) return
    rerenderCharacter()
    window.dispatchEvent(new CustomEvent('game:inventory-changed'))
  })
}
