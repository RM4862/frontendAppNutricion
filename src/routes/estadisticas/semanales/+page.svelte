<!-- src/routes/estadisticas/semanales/+page.svelte -->
<script lang="ts">
    const semanas = [
      { rango: 'Sem 1', kcal: 1930, prot: 82, carb: 225, grasa: 58 },
      { rango: 'Sem 2', kcal: 2010, prot: 87, carb: 235, grasa: 62 },
      { rango: 'Sem 3', kcal: 1880, prot: 79, carb: 218, grasa: 55 },
      { rango: 'Sem 4', kcal: 1965, prot: 85, carb: 230, grasa: 61 }
    ];
  </script>
  
  <main class="min-h-screen bg-gray-50 py-10">
    <div class="container mx-auto px-6 max-w-screen-lg">
      <h1 class="text-2xl font-bold text-emerald-700 mb-6">Estadísticas semanales</h1>
  
      <section class="bg-white rounded shadow divide-y">
        {#each semanas as s}
          <div class="p-4 flex items-center justify-between">
            <p class="font-medium text-emerald-700">{s.rango}</p>
            <div class="text-sm text-gray-700 flex gap-6">
              <span>Kcal: {s.kcal}</span>
              <span>Prot: {s.prot} g</span>
              <span>Carb: {s.carb} g</span>
              <span>Grasa: {s.grasa} g</span>
            </div>
          </div>
        {/each}
      </section>
    </div>
  </main>
  