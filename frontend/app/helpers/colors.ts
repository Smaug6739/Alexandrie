function drawColorWheel(colorWheel: Ref<HTMLCanvasElement | undefined>) {
  if (!colorWheel.value) return;
  const canvas = colorWheel.value,
    ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width,
    h = canvas.height,
    cx = w / 2,
    cy = h / 2,
    r = Math.min(cx, cy) - 10;
  ctx.clearRect(0, 0, w, h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const dx = x - cx,
        dy = y - cy,
        dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= r) {
        const hue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
        ctx.fillStyle = hsvToHex(hue, (dist / r) * 100, 100);
        ctx.fillRect(x, y, 1, 1);
      }
    }
  ctx.strokeStyle = 'var(--border-color)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.stroke();
}

function hsvToHex(h: number, s: number, v: number): string {
  s /= 100;
  v /= 100;
  const c = v * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = v - c;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return (
    '#' +
    [r, g, b]
      .map(v =>
        Math.round((v + m) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
      .toUpperCase()
  );
}

export { drawColorWheel, hsvToHex };
