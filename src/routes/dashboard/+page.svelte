<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let email = '';

  onMount(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('user');
    if (!raw) {
      goto('/registro');
      return;
    }
    try {
      const u = JSON.parse(raw);
      email = u?.email ?? '';
    } catch {
      goto('/registro');
    }
  });

  function logout() {
    if (typeof window !== 'undefined') localStorage.removeItem('user');
    goto('/');
  }
</script>

<main class="min-h-screen flex items-center justify-center bg-gray-50 py-12">
  <div class="w-full max-w-2xl bg-white rounded-xl shadow p-8">
    <h1 class="text-2xl font-bold text-emerald-700">Bienvenido</h1>
    <p class="mt-2 text-gray-700">Has iniciado sesión como <strong>{email}</strong>.</p>

    <section class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 bg-emerald-50 rounded">
        <h3 class="font-semibold text-emerald-700">Tu plan</h3>
        <p class="text-sm text-gray-600 mt-2">Aquí aparecerán tus planes de alimentación (simulado).</p>
      </div>
      <div class="p-4 bg-emerald-50 rounded">
        <h3 class="font-semibold text-emerald-700">Progreso</h3>
        <p class="text-sm text-gray-600 mt-2">Gráficas y métricas del seguimiento (simulado).</p>
      </div>
    </section>

    <div class="mt-6 flex gap-3">
      <button on:click={logout} class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cerrar sesión</button>
      <a href="/" class="px-4 py-2 border rounded text-emerald-600">Ir al inicio</a>
    </div>
  </div>
</main>
