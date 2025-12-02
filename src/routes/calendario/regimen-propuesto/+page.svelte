<script lang="ts">
  import BackButton from '$lib/BackButton.svelte';
  
  type MealItem = { alimento: string; cantidad: string; unidad: string };
  
  // Datos simulados del régimen propuesto por el nutriólogo
  let registroAlimentos = {
    desayuno: [
      { alimento: 'Avena con fruta', cantidad: '1', unidad: 'tazas' },
      { alimento: 'Yogur natural', cantidad: '150', unidad: 'gramos' },
      { alimento: 'Café o té', cantidad: '1', unidad: 'tazas' }
    ],
    comida: [
      { alimento: 'Pollo a la plancha', cantidad: '150', unidad: 'gramos' },
      { alimento: 'Arroz integral', cantidad: '100', unidad: 'gramos' },
      { alimento: 'Ensalada verde', cantidad: '1', unidad: 'tazas' }
    ],
    cena: [
      { alimento: 'Pescado', cantidad: '120', unidad: 'gramos' },
      { alimento: 'Verduras al vapor', cantidad: '1', unidad: 'tazas' },
      { alimento: 'Pan integral', cantidad: '50', unidad: 'gramos' }
    ],
    snacks: [
      { alimento: 'Nueces', cantidad: '30', unidad: 'gramos' },
      { alimento: 'Manzana', cantidad: '1', unidad: 'piezas' },
      { alimento: 'Zanahorias baby', cantidad: '100', unidad: 'gramos' }
    ]
  };
</script>

<main class="min-h-screen bg-gray-50 py-10">
  <div class="container mx-auto px-6 max-w-screen-lg">
    <div class="mb-4"><BackButton fallback="/calendario" /></div>

    <h1 class="text-3xl font-bold text-emerald-700 mb-6">Régimen propuesto</h1>

    <!-- Visualización del Régimen Propuesto -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">

      <!-- Desayuno -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-emerald-600 mb-3">🍳 Desayuno</h3>
        {#if registroAlimentos.desayuno.length > 0}
          <div class="space-y-2">
            {#each registroAlimentos.desayuno as item}
              <div class="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                <div class="md:col-span-5">
                  <span class="text-xs text-gray-600 block mb-1">Alimento</span>
                  <span class="font-medium text-gray-800">{item.alimento}</span>
                </div>
                <div class="md:col-span-3">
                  <span class="text-xs text-gray-600 block mb-1">Cantidad</span>
                  <span class="font-medium text-gray-800">{item.cantidad}</span>
                </div>
                <div class="md:col-span-4">
                  <span class="text-xs text-gray-600 block mb-1">Unidad</span>
                  <span class="font-medium text-gray-800">{item.unidad}</span>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500 text-sm italic">No hay alimentos registrados para el desayuno</p>
        {/if}
      </div>

      <!-- Comida -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-emerald-600 mb-3">🍽️ Comida</h3>
        {#if registroAlimentos.comida.length > 0}
          <div class="space-y-2">
            {#each registroAlimentos.comida as item}
              <div class="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                <div class="md:col-span-5">
                  <span class="text-xs text-gray-600 block mb-1">Alimento</span>
                  <span class="font-medium text-gray-800">{item.alimento}</span>
                </div>
                <div class="md:col-span-3">
                  <span class="text-xs text-gray-600 block mb-1">Cantidad</span>
                  <span class="font-medium text-gray-800">{item.cantidad}</span>
                </div>
                <div class="md:col-span-4">
                  <span class="text-xs text-gray-600 block mb-1">Unidad</span>
                  <span class="font-medium text-gray-800">{item.unidad}</span>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500 text-sm italic">No hay alimentos registrados para la comida</p>
        {/if}
      </div>

      <!-- Cena -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-emerald-600 mb-3">🌙 Cena</h3>
        {#if registroAlimentos.cena.length > 0}
          <div class="space-y-2">
            {#each registroAlimentos.cena as item}
              <div class="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                <div class="md:col-span-5">
                  <span class="text-xs text-gray-600 block mb-1">Alimento</span>
                  <span class="font-medium text-gray-800">{item.alimento}</span>
                </div>
                <div class="md:col-span-3">
                  <span class="text-xs text-gray-600 block mb-1">Cantidad</span>
                  <span class="font-medium text-gray-800">{item.cantidad}</span>
                </div>
                <div class="md:col-span-4">
                  <span class="text-xs text-gray-600 block mb-1">Unidad</span>
                  <span class="font-medium text-gray-800">{item.unidad}</span>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500 text-sm italic">No hay alimentos registrados para la cena</p>
        {/if}
      </div>

      <!-- Snacks -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-emerald-600 mb-3">🍎 Snacks</h3>
        {#if registroAlimentos.snacks.length > 0}
          <div class="space-y-2">
            {#each registroAlimentos.snacks as item}
              <div class="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                <div class="md:col-span-5">
                  <span class="text-xs text-gray-600 block mb-1">Alimento</span>
                  <span class="font-medium text-gray-800">{item.alimento}</span>
                </div>
                <div class="md:col-span-3">
                  <span class="text-xs text-gray-600 block mb-1">Cantidad</span>
                  <span class="font-medium text-gray-800">{item.cantidad}</span>
                </div>
                <div class="md:col-span-4">
                  <span class="text-xs text-gray-600 block mb-1">Unidad</span>
                  <span class="font-medium text-gray-800">{item.unidad}</span>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500 text-sm italic">No hay snacks registrados</p>
        {/if}
      </div>
    </div>
  </div>
</main>
