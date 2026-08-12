import { CharacterScreen } from '../screens/CharacterScreen.js'
import {
  player,
  addFreeAttributePoints,
  equipItem,
  unequipItem,
} from '../../data/character.js'

function rerenderCharacter() {
  const root = document.getElementById('content-root')
  if (!root) return
  root.innerHTML = CharacterScreen()
  mountCharacterScreen()
}

export function mountCharacterScreen() {
  const equipGrid = document.getElementById('equip-grid')
  const inventoryGrid = document.getElementById('inventory-grid')

  document.querySelectorAll('.attr-add-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const attribute = button.dataset.attribute
      if (!addFreeAttributePoints(attribute, 1)) return
      rerenderCharacter()
    })
  })

  if (!equipGrid || !inventoryGrid) return

  let selectedEquipSlot = null
  let selectedInvIndex = null

  equipGrid.querySelectorAll('.equip-slot').forEach((btn) => {
    btn.addEventListener('click', () => {
      equipGrid.querySelectorAll('.equip-slot').forEach((b) => b.classList.remove('is-selected'))
      btn.classList.add('is-selected')
      selectedEquipSlot = btn.dataset.slotId
    })
  })

  inventoryGrid.querySelectorAll('.inv-slot').forEach((btn) => {
    btn.addEventListener('click', () => {
      inventoryGrid.querySelectorAll('.inv-slot').forEach((b) => b.classList.remove('is-selected'))
      btn.classList.add('is-selected')
      selectedInvIndex = Number(btn.dataset.invIndex)
    })
  })

  document.getElementById('btn-equip')?.addEventListener('click', () => {
    if (selectedEquipSlot === null || selectedInvIndex === null) return
    const itemId = player.inventory[selectedInvIndex]
    if (!itemId) return
    if (!equipItem(selectedEquipSlot, itemId)) return
    rerenderCharacter()
  })

  document.getElementById('btn-unequip')?.addEventListener('click', () => {
    if (selectedEquipSlot === null) return
    if (!unequipItem(selectedEquipSlot)) return
    rerenderCharacter()
  })
}
