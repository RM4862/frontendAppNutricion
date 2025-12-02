<script lang="ts">
  import BackButton from '$lib/BackButton.svelte';
  import { goto } from '$app/navigation';
  const nav = (href: string) => (e: MouseEvent) => { e.preventDefault(); goto(href); };
</script>

<main class="min-h-screen bg-gray-50 py-10">
  <div class="container mx-auto px-6 max-w-screen-lg">
    <div class="mb-4"><BackButton fallback="/paciente" /></div>

    <h1 class="text-3xl font-bold text-emerald-700 mb-6">Calendario</h1>

    <section class="grid sm:grid-cols-2 gap-6">
      <a href="/calendario/registro-consumo" on:click={nav('/calendario/registro-consumo')}
         class="p-5 bg-white rounded-lg shadow hover:bg-emerald-50">
        <div class="text-2xl mb-2"></div>
        <h3 class="font-semibold text-emerald-700">Registro de consumo</h3>
        <p class="text-sm text-gray-600">Añade comidas por día</p>
      </a>

      <a href="/calendario/regimen-propuesto" on:click={nav('/calendario/regimen-propuesto')}
         class="p-5 bg-white rounded-lg shadow hover:bg-emerald-50">
        <div class="text-2xl mb-2"></div>
        <h3 class="font-semibold text-emerald-700">Régimen propuesto</h3>
        <p class="text-sm text-gray-600">Plan sugerido por tu nutriólogo</p>
      </a>
    </section>
  </div>
</main>
