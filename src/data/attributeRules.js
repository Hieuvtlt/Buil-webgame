// Quy tắc thuộc tính chung của game.
// Không có Kháng tất cả và Tốc độ đánh.

export const ELEMENTAL_RESISTANCES = [
  'poisonResistance',
  'fireResistance',
  'iceResistance',
  'lightningResistance',
]

export const MAX_RESISTANCE = 80

export function clampResistance(value) {
  return Math.min(MAX_RESISTANCE, Math.max(0, Number(value) || 0))
}

export function clampCharacterResistances(resistances = {}) {
  return Object.fromEntries(
    ELEMENTAL_RESISTANCES.map((key) => [key, clampResistance(resistances[key])]),
  )
}

// Thiên Cơ Đan: thuộc tính dạng điểm +1..100, dạng kháng +1..5%.
export const THIEN_CO_DAN_POINT_MIN = 1
export const THIEN_CO_DAN_POINT_MAX = 100
export const THIEN_CO_DAN_PERCENT_MIN = 1
export const THIEN_CO_DAN_PERCENT_MAX = 5
