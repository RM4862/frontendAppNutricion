<!-- src/lib/BackButton.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    export let fallback = '/';
    export let label = 'Regresar';
    export let icon: string | null = '←';
  
    function back() {
      if (history.length > 1) history.back();
      else goto(fallback, { replaceState: true });
    }
  </script>
  
  <button on:click={back}
    class="inline-flex items-center gap-2 px-3 py-2 rounded-md
           text-emerald-700 bg-white border border-emerald-200
           hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
    {#if icon}<span aria-hidden="true" class="text-lg leading-none">{icon}</span>{/if}
    <span class="font-medium">{label}</span>
  </button>
  