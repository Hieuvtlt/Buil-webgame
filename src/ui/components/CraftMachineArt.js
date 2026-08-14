export function craftMachineArt(type) {
  const common = `fill="none" stroke-linecap="round" stroke-linejoin="round"`
  if (type === 'alchemy') {
    return `<svg class="craft-machine-art craft-machine-art-alchemy" viewBox="0 0 260 220" aria-label="Đan lô" role="img">
      <defs><radialGradient id="alGlow" cx="50%" cy="50%"><stop offset="0" stop-color="#f0c84b" stop-opacity=".28"/><stop offset="1" stop-color="#f0c84b" stop-opacity="0"/></radialGradient><linearGradient id="alMetal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#705f2c"/><stop offset=".5" stop-color="#d7b94a"/><stop offset="1" stop-color="#58471f"/></linearGradient></defs>
      <ellipse cx="130" cy="108" rx="105" ry="88" fill="url(#alGlow)"/>
      <path d="M62 96 Q130 126 198 96 L187 154 Q130 184 73 154 Z" fill="#07130e" stroke="#d7b94a" stroke-width="4"/>
      <path d="M72 100 Q130 126 188 100" ${common} stroke="#00f28a" stroke-width="3"/>
      <path d="M82 151 Q130 169 178 151" ${common} stroke="#8e7630" stroke-width="3"/>
      <path d="M82 86 Q130 52 178 86 Q172 108 130 116 Q88 108 82 86Z" fill="url(#alMetal)" stroke="#f0c84b" stroke-width="4"/>
      <path d="M96 82 Q130 63 164 82" ${common} stroke="#00f28a" stroke-width="3"/>
      <path d="M112 55 Q130 34 148 55" ${common} stroke="#f0c84b" stroke-width="5"/>
      <path d="M108 55 Q130 66 152 55" ${common} stroke="#00f28a" stroke-width="3"/>
      <path d="M61 108 L42 101 M199 108 L218 101 M76 143 L57 153 M184 143 L203 153" ${common} stroke="#d7b94a" stroke-width="5"/>
      <circle cx="130" cy="100" r="8" fill="#00f28a" opacity=".75"/><circle cx="130" cy="100" r="3" fill="#f0c84b"/>
    </svg>`
  }
  if (type === 'forge') {
    return `<svg class="craft-machine-art craft-machine-art-forge" viewBox="0 0 260 220" aria-label="Búa luyện khí" role="img">
      <defs><linearGradient id="fgMetal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e0c45a"/><stop offset=".45" stop-color="#765f26"/><stop offset="1" stop-color="#c6a83d"/></linearGradient><radialGradient id="fgGlow"><stop stop-color="#00f28a" stop-opacity=".28"/><stop offset="1" stop-color="#00f28a" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="130" cy="115" rx="108" ry="88" fill="url(#fgGlow)"/>
      <path d="M72 166 L188 166 L176 184 L84 184 Z" fill="#07130e" stroke="#d7b94a" stroke-width="4"/>
      <path d="M92 166 L168 166 L158 150 L102 150 Z" fill="#14251b" stroke="#00f28a" stroke-width="3"/>
      <path d="M102 150 L158 150 L150 139 L110 139 Z" fill="url(#fgMetal)" stroke="#f0c84b" stroke-width="3"/>
      <path d="M158 82 L184 56 Q192 48 200 56 L207 63 Q213 70 205 77 L178 103 Z" fill="url(#fgMetal)" stroke="#f0c84b" stroke-width="4"/>
      <path d="M158 82 L178 103" ${common} stroke="#00f28a" stroke-width="3"/>
      <path d="M178 103 L129 151" ${common} stroke="#8e7630" stroke-width="12"/><path d="M178 103 L129 151" ${common} stroke="#b18f37" stroke-width="7"/>
      <path d="M94 74 L125 105" ${common} stroke="#00f28a" stroke-width="3" opacity=".7"/><path d="M78 91 L108 112" ${common} stroke="#f0c84b" stroke-width="3" opacity=".7"/>
      <circle cx="118" cy="129" r="7" fill="#f0c84b"/><circle cx="136" cy="124" r="4" fill="#00f28a"/>
    </svg>`
  }
  return `<svg class="craft-machine-art craft-machine-art-fusion" viewBox="0 0 260 220" aria-label="Hợp thành" role="img">
    <defs><radialGradient id="fuGlow"><stop stop-color="#f0c84b" stop-opacity=".3"/><stop offset="1" stop-color="#f0c84b" stop-opacity="0"/></radialGradient></defs>
    <circle cx="130" cy="110" r="96" fill="url(#fuGlow)"/>
    <circle cx="130" cy="110" r="68" fill="#07130e" stroke="#d7b94a" stroke-width="4"/>
    <circle cx="130" cy="110" r="52" fill="#03100a" stroke="#00f28a" stroke-width="2" opacity=".9"/>
    <path d="M72 92 L94 70 L112 88 L90 110 Z" fill="#173326" stroke="#f0c84b" stroke-width="3"/>
    <path d="M166 92 L188 70 L206 88 L184 110 Z" fill="#173326" stroke="#f0c84b" stroke-width="3"/>
    <path d="M88 145 L110 123 L128 141 L106 163 Z" fill="#173326" stroke="#f0c84b" stroke-width="3"/>
    <path d="M172 145 L150 123 L132 141 L154 163 Z" fill="#173326" stroke="#f0c84b" stroke-width="3"/>
    <path d="M96 102 L116 112 M164 102 L144 112 M112 143 L123 122 M148 143 L137 122" ${common} stroke="#00f28a" stroke-width="4"/>
    <circle cx="130" cy="110" r="17" fill="#f0c84b" opacity=".18" stroke="#f0c84b" stroke-width="3"/><path d="M130 98 V122 M118 110 H142" ${common} stroke="#00f28a" stroke-width="3"/>
  </svg>`
}
