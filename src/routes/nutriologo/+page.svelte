<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, logout } from '$lib/stores/auth';
  import { get } from 'svelte/store';

  type Patient = { id: number; name: string; age: number; lastVisit: string };
  let patients: Patient[] = [];
  let loading = true;

  onMount(async () => {
    const authed = get(isAuthenticated);
    const current = get(user);
    if (!authed) {
      goto('/registro');
      return;
    }
    if (!current || current.role !== 'nutriologo') {
      goto('/');
      return;
    }

    // Simular fetch
    await new Promise((r) => setTimeout(r, 400));
    patients = [
      { id: 1, name: 'María González', age: 34, lastVisit: '2025-10-20' },
      { id: 2, name: 'Carlos Pérez', age: 46, lastVisit: '2025-09-15' },
      { id: 3, name: 'Ana López', age: 29, lastVisit: '2025-11-01' }
    ];

    loading = false;
  });

  function doLogout() {
    logout();
    goto('/');
  }

  function openPatient(id: number) {
    goto(`/nutriologo/paciente/${id}`);
  }

  function openDieta(id: number) {
    goto(`/nutriologo/paciente/${id}/dieta`);
  }

  function openCalendario(id: number) {
    goto(`/nutriologo/paciente/${id}/calendario`);
  }
</script>

<main class="min-h-screen bg-gray-50 py-12">
  <div class="container mx-auto px-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-emerald-700">
        Panel de Nutriólogo — Mis pacientes
      </h2>
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-600">
          {#if $user}{$user.name ?? $user.email}{/if}
        </div>
        <button
          on:click={doLogout}
          class="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
        >
          Cerrar sesión
        </button>
      </div>
    </div>

    {#if loading}
      <p>Cargando pacientes…</p>
    {:else}
      {#if patients.length === 0}
        <p class="text-gray-600">No tienes pacientes aún.</p>
      {:else}
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {#each patients as p}
            <article class="p-5 bg-white rounded-xl shadow flex flex-col justify-between">
              <div>
                <h3 class="font-semibold text-emerald-700 text-lg">{p.name}</h3>
                <p class="text-sm text-gray-600">Edad: {p.age}</p>
                <p class="text-sm text-gray-600 mb-4">
                  Última visita: {p.lastVisit}
                </p>
              </div>

              <div class="flex flex-wrap gap-2 mt-auto">
                <button
                  on:click={() => openPatient(p.id)}
                  class="flex-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 text-sm"
                >
                  Ver estadísticas
                </button>

                <button
                  on:click={() => openDieta(p.id)}
                  class="flex-1 px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 text-sm"
                >
                  Dieta
                </button>

                <button
                  on:click={() => openCalendario(p.id)}
                  class="flex-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                >
                  Calendario
                </button>
              </div>
            </article>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</main>
