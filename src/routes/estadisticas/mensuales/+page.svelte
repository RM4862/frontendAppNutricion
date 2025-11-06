<script lang="ts">
  import BackButton from '$lib/BackButton.svelte';

  type Month = {
    label: string;  // etiqueta corta
    kcal: number;   // kilocalorías promedio
    prot: number;   // gramos de proteína
    carb: number;   // gramos de carbohidratos
    fat: number;    // gramos de grasa
  };

  // Datos de ejemplo (ajusta con tus valores reales)
  const months: Month[] = [
    { label: 'E', kcal: 1950, prot: 85,  carb: 230, fat: 60 },
    { label: 'F', kcal: 2020, prot: 88,  carb: 240, fat: 62 },
    { label: 'M', kcal: 1880, prot: 80,  carb: 220, fat: 58 },
    { label: 'A', kcal: 2100, prot: 92,  carb: 245, fat: 65 },
    { label: 'M', kcal: 1975, prot: 86,  carb: 232, fat: 60 },
    { label: 'J', kcal: 2050, prot: 90,  carb: 238, fat: 63 },
    { label: 'J', kcal: 2010, prot: 87,  carb: 235, fat: 61 },
    { label: 'A', kcal: 2120, prot: 93,  carb: 248, fat: 66 },
    { label: 'S', kcal: 1985, prot: 86,  carb: 231, fat: 60 },
    { label: 'O', kcal: 2070, prot: 91,  carb: 240, fat: 64 },
    { label: 'N', kcal: 2030, prot: 89,  carb: 236, fat: 62 },
    { label: 'D', kcal: 2150, prot: 95,  carb: 250, fat: 68 }
  ];

  // Dimensiones del gráfico
  const W = 900, H = 320;
  const m = { t: 20, r: 20, b: 40, l: 48 };
  const cw = W - m.l - m.r;
  const ch = H - m.t - m.b;

  // Escalas
  const maxKcal = Math.max(...months.map(d => d.kcal)) * 1.1;
  const maxMacro = Math.max(...months.map(d => Math.max(d.prot, d.carb, d.fat))) * 1.2;

  const xStep = cw / months.length;
  const barGroupWidth = xStep * 0.7;      // ancho del grupo de barras por mes
  const barWidth = barGroupWidth / 3 - 4; // 3 barras por grupo
  const groupOffset = (xStep - barGroupWidth) / 2;

  const yK = (v: number) => m.t + (1 - v / maxKcal) * ch;
  const yM = (v: number) => m.t + (1 - v / maxMacro) * ch;

  // Colores
  const c = {
    kcal: '#059669',     // emerald-600 (línea)
    prot: '#2563eb',     // blue-600
    carb: '#f59e0b',     // amber-500
    fat:  '#ef4444'      // red-500
  };

  // Ruta de la línea de kcal
  const linePath = months.map((d, i) => {
    const x = m.l + i * xStep + xStep / 2;
    const y = yK(d.kcal);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
</script>

<main class="min-h-screen bg-gray-50 py-10">
  <div class="container mx-auto px-6 max-w-screen-lg">
    <div class="mb-4"><BackButton fallback="/estadisticas" /></div>

    <h1 class="text-3xl font-bold text-emerald-700 mb-6">Estadísticas mensuales</h1>

    <!-- KPIs superiores -->
    <section class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-5 rounded shadow">
        <p class="text-sm text-gray-600">Consumo promedio</p>
        <p class="text-2xl font-semibold text-emerald-700">
          {Math.round(months.reduce((a, b) => a + b.kcal, 0) / months.length)} kcal
        </p>
      </div>
      <div class="bg-white p-5 rounded shadow">
        <p class="text-sm text-gray-600">Proteína promedio</p>
        <p class="text-2xl font-semibold text-emerald-700">
          {Math.round(months.reduce((a, b) => a + b.prot, 0) / months.length)} g
        </p>
      </div>
      <div class="bg-white p-5 rounded shadow">
        <p class="text-sm text-gray-600">Grasa promedio</p>
        <p class="text-2xl font-semibold text-emerald-700">
          {Math.round(months.reduce((a, b) => a + b.fat, 0) / months.length)} g
        </p>
      </div>
      <div class="bg-white p-5 rounded shadow">
        <p class="text-sm text-gray-600">Carbohidratos</p>
        <p class="text-2xl font-semibold text-emerald-700">
          {Math.round(months.reduce((a, b) => a + b.carb, 0) / months.length)} g
        </p>
      </div>
    </section>

    <!-- Gráfico combinado: línea (kcal) + barras agrupadas (prot/carb/fat) -->
    <section class="bg-white p-6 rounded shadow">
      <h2 class="font-semibold text-emerald-700 mb-4">Kcal y macronutrientes por mes</h2>

      <svg {W} {H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Kcal y macros por mes">
        <!-- Ejes -->
        <g stroke="#e5e7eb" stroke-width="1">
          <line x1={m.l} y1={m.t} x2={m.l} y2={m.t + ch} />
          <line x1={m.l} y1={m.t + ch} x2={m.l + cw} y2={m.t + ch} />
        </g>

        <!-- Ticks y etiquetas (kcal a la izquierda) -->
        {#each [0, 0.25, 0.5, 0.75, 1] as t}
          {#key t}
            <g>
              <line x1={m.l - 4} x2={m.l} y1={m.t + (1 - t) * ch} y2={m.t + (1 - t) * ch} stroke="#e5e7eb" />
              <text x={m.l - 8} y={m.t + (1 - t) * ch + 4} text-anchor="end" font-size="10" fill="#6b7280">
                {Math.round(t * maxKcal)}
              </text>
            </g>
          {/key}
        {/each}

        <!-- Barras agrupadas (prot/carb/fat) -->
        {#each months as d, i}
          {#key d.label}
            <g>
              <!-- Prot -->
              <rect
                x={m.l + i * xStep + groupOffset + 0 * (barWidth + 4)}
                y={yM(d.prot)}
                width={barWidth}
                height={m.t + ch - yM(d.prot)}
                fill={c.prot}>
                <title>{`Mes ${d.label} · Proteína: ${d.prot} g`}</title>
              </rect>

              <!-- Carb -->
              <rect
                x={m.l + i * xStep + groupOffset + 1 * (barWidth + 4)}
                y={yM(d.carb)}
                width={barWidth}
                height={m.t + ch - yM(d.carb)}
                fill={c.carb}>
                <title>{`Mes ${d.label} · Carbohidratos: ${d.carb} g`}</title>
              </rect>

              <!-- Grasa -->
              <rect
                x={m.l + i * xStep + groupOffset + 2 * (barWidth + 4)}
                y={yM(d.fat)}
                width={barWidth}
                height={m.t + ch - yM(d.fat)}
                fill={c.fat}>
                <title>{`Mes ${d.label} · Grasa: ${d.fat} g`}</title>
              </rect>
            </g>
          {/key}
        {/each}

        <!-- Línea de kcal -->
        <path d={linePath} fill="none" stroke={c.kcal} stroke-width="2.5" />
        {#each months as d, i}
          {#key `pt-${i}`}
            <circle
              cx={m.l + i * xStep + xStep / 2}
              cy={yK(d.kcal)}
              r="3.5"
              fill={c.kcal}>
              <title>{`Mes ${d.label} · Kcal: ${d.kcal}`}</title>
            </circle>
          {/key}
        {/each}

        <!-- Etiquetas de meses -->
        {#each months as d, i}
          <text
            x={m.l + i * xStep + xStep / 2}
            y={m.t + ch + 18}
            text-anchor="middle"
            font-size="12"
            fill="#6b7280">{d.label}</text>
        {/each}
      </svg>

      <!-- Leyenda -->
      <div class="mt-4 flex flex-wrap gap-4 text-sm">
        <span class="inline-flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full" style="background:#059669"></span> Kcal (línea)
        </span>
        <span class="inline-flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded" style="background:#2563eb"></span> Proteína (g)
        </span>
        <span class="inline-flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded" style="background:#f59e0b"></span> Carbohidratos (g)
        </span>
        <span class="inline-flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded" style="background:#ef4444"></span> Grasa (g)
        </span>
      </div>
    </section>
  </div>
</main>
