<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, userRole, logout } from '$lib/stores/auth';
  import { get } from 'svelte/store';

  // ------------------------
  // Tipado paciente
  // ------------------------
  type Patient = {
    id: number;
    name: string;
    age: number;
    lastVisit: string;
  };

  let list_patients: Patient[] = [];
  let loading = true;
  let currentUser: any;

  // ------------------------
  // Validación de acceso y carga de pacientes
  // ------------------------
onMount(async () => {
  if (!get(isAuthenticated)) {
    goto('/registro');
    return;
  }

  if (get(userRole) !== 'NUTRIOLOGO') {
    goto('/');
    return;
  }

  currentUser = get(user);
  console.log('User: ', currentUser);

  try {
    const res = await fetch('http://127.0.0.1:8000/patients/nutriologist', {
      method: 'GET',
      headers: { Authorization: `Bearer ${currentUser.token}` }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    list_patients = data.data.map((p: any) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      lastVisit: p.last_visit
    }));  

    console.log('Pacientes: ', list_patients);
  } catch (e) {
    console.error('Error fetching patients: ', e);
  }

  loading = false;
});


  // ------------------------
  // Logout
  // ------------------------
  import { tick } from 'svelte';
  async function doLogout() {
    logout();
    await tick();
    goto('/');
  }
  
  // ------------------------
  // Funciones de navegación
  // ------------------------
  function openDieta(p: Patient) {
    goto(`/nutriologo/paciente/${p.id}/dieta?name=${encodeURIComponent(p.name)}`);
  }

  function openCalendario(p: Patient) {
    goto(`/nutriologo/paciente/${p.id}/calendario?name=${encodeURIComponent(p.name)}`);
  }

  function openPerfil(p: Patient) {
    goto(`/nutriologo/paciente/${p.id}/perfil?name=${encodeURIComponent(p.name)}`);
  }

  function openEstadisticas(p: Patient) {
    goto(`/nutriologo/paciente/${p.id}/estadisticas?name=${encodeURIComponent(p.name)}`);
  }
</script>


<main class="min-h-screen bg-gray-50 py-12">
  <div class="container mx-auto px-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-emerald-700">Panel de Nutriólogo — Mis pacientes</h2>
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-600">{#if $user}{$user.name ?? $user.email}{/if}</div>
        <button on:click={doLogout} class="px-3 py-1 bg-red-50 text-red-700 rounded">Cerrar sesión</button>
      </div>
    </div>

    {#if loading}
      <p>Cargando pacientes…</p>
    {:else}
      {#if list_patients.length === 0}
        <p class="text-gray-600">No tienes pacientes aún.</p>
      {:else}
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {#each list_patients as p}
            <article class="p-4 bg-white rounded shadow flex flex-col justify-between">
              <div>
                <h3 class="font-semibold text-emerald-700">{p.name}</h3>
                <p class="text-sm text-gray-600">Edad: {p.age}</p>
                <p class="text-sm text-gray-600">Última visita: {p.lastVisit}</p>
              </div>
              <div class="mt-4 grid grid-cols-2 gap-2">
                <button
                  on:click={() => openDieta(p)}
                  class="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 text-sm"
                >
                  Dieta
                </button>
                <button
                  on:click={() => openCalendario(p)}
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                >
                  Calendario
                </button>
                <button
                  on:click={() => openPerfil(p)}
                  class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 text-sm"
                >
                  Perfil
                </button>
                <button
                  on:click={() => openEstadisticas(p)}
                  class="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
                >
                  Estadísticas
                </button>
              </div>
            </article>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</main>
