<script lang="ts">
  import BackButton from '$lib/BackButton.svelte';
  let { children } = $props();
</script>

<div class="container mx-auto px-6 max-w-screen-lg py-6">
  <div class="mb-4">
    <BackButton fallback="/paciente" />
  </div>

  <nav class="flex gap-6 text-sm mb-6">
    <a href="/estadisticas/mensuales" class="hover:underline">Mensuales</a>
    <a href="/estadisticas/semanales" class="hover:underline">Semanales</a>
  </nav>

  <main>
    {@render children()}
  </main>
</div>
