<script lang="ts">
  import '../app.css';
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  let { children } = $props();

  // Rutas donde se ocultan header y footer
  const hideRoutes = ['/registro', '/registro/crear', '/login'];

  // Mostrar header/footer solo si la ruta no está en hideRoutes
  const showHeaderFooter = derived(page, ($page) => {
    const path = $page.url.pathname;
    return !hideRoutes.some((hide) => path === hide || path.startsWith(hide + '/'));
  });
</script>

{#if $showHeaderFooter}
  <Header />
{/if}

<main class={$showHeaderFooter ? 'pt-20' : ''}>
  {@render children()}
</main>

{#if $showHeaderFooter}
  <Footer />
{/if}
