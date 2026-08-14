// Central asset paths for the game.
// New UI images/icons should be stored in src/assets/images or src/assets/icons.
// Keep filenames descriptive so replacing an asset never requires changing game logic.

const base = import.meta.env.BASE_URL

export const GAME_IMAGES = {
  hinhdanlo: `${base}assets/images/hinhdanlo.svg`,
  hinhbualuyenkhi: `${base}assets/images/hinhbualuyenkhi.svg`,
  hinhhopthanh: `${base}assets/images/hinhhopthanh.svg`,
}

export const GAME_ICONS = {
  icontrangbi: `${base}assets/icons/icontrangbi.svg`,
  iconnguyenlieu: `${base}assets/icons/iconnguyenlieu.svg`,
  icondanduoc: `${base}assets/icons/icondanduoc.svg`,
  iconskill: `${base}assets/icons/iconskill.svg`,
  equipment: `${base}assets/icons/equipment.svg`,
  material: `${base}assets/icons/material.svg`,
  potion: `${base}assets/icons/potion.svg`,
  skill: `${base}assets/icons/skill.svg`,
}

export const GAME_ASSETS = {
  base,
  images: GAME_IMAGES,
  icons: GAME_ICONS,
}
