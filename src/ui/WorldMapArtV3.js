const W = 1200
const H = 700
const hash = value => { let h = 2166136261; for (const ch of String(value || 'world')) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) } return h >>> 0 }
const rng = seed => () => { seed = (seed + 0x6D2B79F5) | 0; let t = seed; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296 }

const themeOf = area => {
  const text = `${area?.name || ''} ${area?.terrain || ''}`.toLowerCase()
  if (text.includes('sa mạc')) return 'desert'
  if (text.includes('tuyết')) return 'snow'
  if (text.includes('độc')) return 'poison'
  if (text.includes('nước') || text.includes('bến')) return 'water'
  if (text.includes('hang') || text.includes('động') || text.includes('lăng') || text.includes('huyệt')) return 'cave'
  if (text.includes('núi') || text.includes('côn lôn') || text.includes('đạo sơn')) return 'mountain'
  if (text.includes('cổ địa')) return 'ruins'
  return 'forest'
}

const palettes = {
  forest: ['#5f9d4f', '#87b85d', '#2c5d35', '#d0a36a', '#2f6f9a'],
  water: ['#5f9d52', '#8bc66a', '#2b5d38', '#d4ad72', '#3b8eaa'],
  mountain: ['#718b68', '#a1b785', '#425c4d', '#c5a274', '#537f9a'],
  cave: ['#4e6258', '#708277', '#293d35', '#967653', '#3b6f85'],
  desert: ['#c99d58', '#e0bd6e', '#74583c', '#d7a05c', '#7f9360'],
  snow: ['#bcd1cd', '#e4efea', '#4b6e67', '#c7a981', '#6ca0b2'],
  ruins: ['#668c55', '#96b86c', '#3d5f3f', '#a88968', '#4d8290'],
  poison: ['#638d47', '#91ad55', '#315438', '#927456', '#5f7fb0'],
}

const esc = value => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const tree = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="22" rx="25" ry="7" fill="#14291b" opacity=".28"/><rect x="-4" y="0" width="8" height="28" fill="#66462d"/><circle cx="-12" cy="-10" r="17" fill="${c[2]}"/><circle cx="10" cy="-14" r="20" fill="${c[1]}"/><circle cx="0" cy="-27" r="17" fill="${c[0]}"/></g>`
const rock = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="9" rx="18" ry="6" fill="#16271d" opacity=".25"/><path d="M-20 6L-13-13 2-20 19-9 14 9-4 14Z" fill="#7f8880" stroke="#4d5b52" stroke-width="3"/><path d="M-7-11L4-15 9-6-2 0Z" fill="#d9ddd4" opacity=".7"/></g>`
const flower = (x, y, s, color) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0v12" stroke="#3d6e3c" stroke-width="2"/><circle cx="0" cy="-3" r="5" fill="${color}"/><circle cx="-5" cy="1" r="4" fill="${color}"/><circle cx="5" cy="1" r="4" fill="${color}"/><circle cx="0" cy="1" r="2" fill="#f2d46c"/></g>`
const house = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-32" y="-8" width="64" height="42" fill="#b57d49" stroke="#5e402d" stroke-width="3"/><path d="M-40-8L0-45 40-8Z" fill="${c[2]}" stroke="#4a3327" stroke-width="3"/><rect x="-7" y="9" width="14" height="25" fill="#54382a"/><rect x="13" y="2" width="11" height="12" fill="#9ed1d2"/></g>`
const ruin = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 25V-18L-18-37 0-12 18-42 42-18V25Z" fill="#80877d" stroke="#4d5950" stroke-width="4"/><path d="M-20 24V-8M15 24V-16" stroke="#56645a" stroke-width="6"/></g>`
const bridge = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-55" y="-12" width="110" height="24" rx="3" fill="#a97343" stroke="#553a29" stroke-width="4"/><path d="M-35-11V11M-10-11V11M15-11V11M40-11V11" stroke="#62412c" stroke-width="3"/></g>`

function artSvg(area) {
  const theme = themeOf(area)
  const c = palettes[theme] || palettes.forest
  const random = rng(hash(area?.name || 'world'))
  let objects = ''
  for (let i = 0; i < 70; i += 1) {
    const x = 35 + random() * (W - 70)
    const y = 40 + random() * (H - 80)
    const s = .55 + random() * .8
    const roll = random()
    if (theme === 'desert') objects += roll < .35 ? ruin(x, y, s) : rock(x, y, s)
    else if (theme === 'snow') objects += roll < .55 ? tree(x, y, s, c) : rock(x, y, s)
    else if (theme === 'mountain') objects += roll < .45 ? rock(x, y, s) : tree(x, y, s, c)
    else if (theme === 'cave') objects += rock(x, y, s)
    else objects += roll < .55 ? tree(x, y, s, c) : roll < .82 ? flower(x, y, s, '#f0cf6a') : rock(x, y, s)
  }

  const road = `M-30 520 C180 500 210 330 390 360 C560 390 570 170 760 220 C920 265 1000 180 1230 210`
  const road2 = `M40 150 C220 110 320 190 470 210 C610 230 700 100 860 120 C1000 140 1090 95 1220 120`
  const river = theme === 'desert' || theme === 'cave' ? '' : `<path d="M910-40 C820 120 950 220 840 330 C730 445 840 520 730 760" fill="none" stroke="${c[4]}" stroke-width="80" opacity=".8"/><path d="M910-40 C820 120 950 220 840 330 C730 445 840 520 730 760" fill="none" stroke="#8ed2df" stroke-width="4" stroke-dasharray="18 20" opacity=".7"/>`
  const landmarks = theme === 'water' ? bridge(350, 360, 1.1) + bridge(800, 470, .8) : theme === 'ruins' ? ruin(300, 260, 1.2) + ruin(900, 470, 1) : theme === 'cave' ? ruin(610, 360, 1.3) : theme === 'mountain' || theme === 'snow' ? ruin(980, 170, .8) : house(300, 300, 1, c) + house(980, 500, .75, c)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><pattern id="ground" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="${c[0]}"/><path d="M10 45l4-8m7 8l3-6M45 18l4-8" stroke="${c[1]}" stroke-width="2" opacity=".55"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#ground)"/>${river}<path d="${road}" fill="none" stroke="#5b412f" stroke-width="30" stroke-linecap="round"/><path d="${road}" fill="none" stroke="${c[3]}" stroke-width="22" stroke-linecap="round"/><path d="${road2}" fill="none" stroke="#5b412f" stroke-width="24" stroke-linecap="round"/><path d="${road2}" fill="none" stroke="${c[3]}" stroke-width="17" stroke-linecap="round"/>${objects}${landmarks}<rect x="24" y="24" width="360" height="48" rx="6" fill="#0b1710" opacity=".86" stroke="${c[3]}" stroke-width="2"/><text x="42" y="56" font-family="monospace" font-size="22" font-weight="700" fill="#f0d890">${esc(area?.name || 'Ngoại cảnh')}</text></svg>`
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`
}

export function getAreaThemeV3(area) { return themeOf(area) }
export function getAreaArtV3(area) { return artSvg(area) }
export function getAreaArt(area) { return artSvg(area) }
