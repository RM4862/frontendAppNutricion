<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, logout } from '$lib/stores/auth';
  import { get } from 'svelte/store';
  import { redirect } from '@sveltejs/kit';

export const load = async ({ session }) => {
  if (session.user.role === 'nutriologo') {
    throw redirect(302, '/nutriologo');
  } else {
    throw redirect(302, '/paciente');
  }
};


  // Sample patients data (replace with API call later)
  type Patient = { id: number; name: string; age: number; lastVisit: string };


  import { page } from '$app/stores';
  let patients: Patient[] = [];
  let filteredPatients: Patient[] = [];
  let loading = true;


  onMount(async () => {
    const authed = get(isAuthenticated);
    const current = get(user);
    if (!authed) {
      goto('/registro');
      return;
    }
    // Permitir solo a nutriólogos
    if (!current || current.role !== 'nutriologo') {
      goto('/');
      return;
    }

    // Simular fetch de pacientes
    await new Promise((r) => setTimeout(r, 400));
    patients = [
      { id: 1, name: 'María González', age: 34, lastVisit: '2025-10-20' },
      { id: 2, name: 'Carlos Pérez', age: 46, lastVisit: '2025-09-15' },
      { id: 3, name: 'Ana López', age: 29, lastVisit: '2025-11-01' }
    ];

    filterPatients();
    loading = false;
  });

  $: filterPatients();

  function filterPatients() {
    const search = $page.url.searchParams.get('search')?.trim().toLowerCase();
    if (!search) {
      filteredPatients = patients;
      return;
    }
    // Coincidencia por palabra completa o exacta
    filteredPatients = patients.filter(p =>
      p.name.toLowerCase().split(/\s+/).some(word => word === search) ||
      p.name.toLowerCase() === search
    );
  }

  function doLogout() {
    logout();
    goto('/');
  }
</script>

<main class="min-h-screen bg-gray-50 py-12">
  <div class="container mx-auto px-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-emerald-700">Mis pacientes</h2>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-600">{#if $user}{$user.email}{/if}</span>
        <button on:click={doLogout} class="px-3 py-1 bg-red-50 text-red-700 rounded">Cerrar sesión</button>
      </div>
    </div>

    {#if loading}
      <p>Cargando pacientes…</p>
    {:else}
      {#if filteredPatients.length === 0}
        <p class="text-gray-600">No se encontraron pacientes con ese nombre.</p>
      {:else}
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {#each filteredPatients as p}
            <article class="p-4 bg-white rounded shadow flex flex-col gap-2">
              <h3 class="font-semibold text-emerald-700">{p.name}</h3>
              <p class="text-sm text-gray-600">Edad: {p.age}</p>
              <p class="text-sm text-gray-600">Última visita: {p.lastVisit}</p>
              <div class="flex flex-wrap gap-2 mt-2">
                <a href={`/nutriologo/paciente/${p.id}/dieta?name=${encodeURIComponent(p.name)}`}
                  class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 text-sm">
                  Dieta
                </a>
                <a href={`/nutriologo/paciente/${p.id}/calendario?name=${encodeURIComponent(p.name)}`}
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">
                  Calendario
                </a>
                <a href={`/nutriologo/paciente/${p.id}/perfil?name=${encodeURIComponent(p.name)}`}
                  class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm">
                  Perfil
                </a>
                <a href={`/nutriologo/paciente/${p.id}/estadisticas?name=${encodeURIComponent(p.name)}`}
                  class="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm">
                  Estadísticas
                </a>
              </div>
            </article>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</main>
