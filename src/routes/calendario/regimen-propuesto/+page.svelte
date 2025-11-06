<script lang="ts">
  import BackButton from '$lib/BackButton.svelte';
  const plan = [
    { title: 'Desayuno', items: ['Avena con fruta', 'Yogur natural', 'Café o té'] },
    { title: 'Comida', items: ['Pollo a la plancha', 'Arroz integral', 'Ensalada verde'] },
    { title: 'Cena', items: ['Pescado', 'Verduras al vapor', 'Pan integral'] },
    { title: 'Snacks', items: ['Nueces', 'Manzana', 'Zanahorias baby'] }
  ];
</script>

<main class="min-h-screen bg-gray-50 py-10">
  <div class="container mx-auto px-6 max-w-screen-lg">
    <div class="mb-4"><BackButton fallback="/calendario" /></div>

    <h1 class="text-3xl font-bold text-emerald-700 mb-6">Régimen propuesto</h1>

    <section class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each plan as p}
        <article class="bg-white p-5 rounded shadow">
          <h3 class="font-semibold text-emerald-700 mb-2">{p.title}</h3>
          <ul class="text-sm text-gray-700 list-disc pl-5 space-y-1">
            {#each p.items as it}<li>{it}</li>{/each}
          </ul>
        </article>
      {/each}
    </section>
  </div>
</main>
