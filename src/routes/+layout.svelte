<script lang="ts">
  import '../app.css';
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  let { children } = $props();

  const hideRoutes = ['/registro', '/registro/crear', '/login'];

  const showHeaderFooter = derived(page, ($page) => {
    return !hideRoutes.some((path) => $page.url.pathname.startsWith(path));
  });
</script>

{#if $showHeaderFooter}
  <Header />
{/if}

<main>
  {@render children()}
</main>

{#if $showHeaderFooter}
  <Footer />
{/if}
