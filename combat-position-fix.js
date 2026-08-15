(() => {
  const EDGE_POWER = 0.45;
  const EDGE_MIN = 6.5;
  const EDGE_MAX = 93.5;
  const MONSTER_VISUAL_SMOOTHING = 0.18;
  const lastRendered = new WeakMap();
  const lastPosition = new WeakMap();
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function edgeCoordinate(value) {
    const n = (Number(value) - 50) / 50;
    if (!Number.isFinite(n) || Math.abs(n) < 0.001) return 50;
    const magnitude = Math.pow(Math.min(1, Math.abs(n)), EDGE_POWER) * 50;
    return clamp(50 + Math.sign(n) * magnitude, EDGE_MIN, EDGE_MAX);
  }

  function readTranslate(transform) {
    const match = String(transform || '').match(/translate\(\s*(-?[\d.]+)%\s*,\s*(-?[\d.]+)%\s*\)/);
    return match ? [Number(match[1]), Number(match[2])] : null;
  }

  function applyMonsterEdgeBias(field) {
    field.querySelectorAll('.combat-unit-wrap.monster').forEach((unit) => {
      const raw = unit.style.transform;
      if (!raw || raw === lastRendered.get(unit)) return;
      const xy = readTranslate(raw);
      if (!xy) return;

      const target = [edgeCoordinate(xy[0]), edgeCoordinate(xy[1])];
      const previous = lastPosition.get(unit) || target;
      const next = [
        previous[0] + (target[0] - previous[0]) * MONSTER_VISUAL_SMOOTHING,
        previous[1] + (target[1] - previous[1]) * MONSTER_VISUAL_SMOOTHING
      ];

      lastPosition.set(unit, next);
      const output = `translate(${next[0]}%,${next[1]}%)`;
      lastRendered.set(unit, output);
      unit.style.transform = output;
    });
  }

  function attach(field) {
    if (!field || field.dataset.edgeLayoutAttached === '1') return;
    field.dataset.edgeLayoutAttached = '1';
    applyMonsterEdgeBias(field);
    const observer = new MutationObserver(() => applyMonsterEdgeBias(field));
    observer.observe(field, {subtree:true, childList:true, attributes:true, attributeFilter:['style','class']});
  }

  const rootObserver = new MutationObserver(() => {
    document.querySelectorAll('.combat-battlefield').forEach(attach);
  });
  rootObserver.observe(document.body, {childList:true, subtree:true});
  document.querySelectorAll('.combat-battlefield').forEach(attach);
})();
