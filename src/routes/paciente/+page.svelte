<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, logout } from '$lib/stores/auth';
  import { get } from 'svelte/store';

  let currentUser = null;

  onMount(() => {
    const authed = get(isAuthenticated);
    const u = get(user);
    if (!authed || !u) {
      goto('/registro');
      return;
    }
    if (u.role !== 'paciente') {
      goto('/');
      return;
    }

    currentUser = u;
  });

  function doLogout() {
    logout();
    goto('/');
  }
</script>

<main class="min-h-screen bg-gray-50 py-12">
  <div class="container mx-auto px-6 max-w-2xl">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-emerald-700">Mi cuenta</h2>
      <div class="flex items-center gap-3">
        <div class="text-sm text-gray-600">{#if $user}{$user.name ?? $user.email}{/if}</div>
        <button on:click={doLogout} class="px-3 py-1 bg-red-50 text-red-700 rounded">Cerrar sesión</button>
      </div>
    </div>
    {#if currentUser}
      <div class="bg-white p-6 rounded shadow">
        <p><strong>Nombre:</strong> {currentUser.name ?? 'Sin nombre'}</p>
        <p class="mt-2"><strong>Correo:</strong> {currentUser.email}</p>
        <p class="mt-2 text-sm text-gray-600">Rol: Paciente</p>
      </div>
    {/if}
  </div>
</main>
