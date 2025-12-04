<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, userRole, logout } from '$lib/stores/auth';
  import { get } from 'svelte/store';

  type PatientFull = {
    id?: number;
    firstName?: string;
    middleName?: string;
    lastNameP?: string;
    lastNameM?: string;
    name?: string;
    age?: number;
    gender?: string;
    email?: string;
    phone?: string;
    height?: number;
    weight?: number;
    goalWeight?: number;
    lastVisit?: string;
    notes?: string;
    createdAt?: string;
  };

  let currentUser: any;
  let fullProfile: PatientFull;

  // Se asume que ya validaste sesión/rol antes o en un load server-side
  function nav(href: string) {
    return (e: MouseEvent) => { e.preventDefault(); goto(href); };
  }
  function doLogout() { logout(); goto('/'); }

  onMount(() => {
    currentUser = get(user);

    // Validaciones
    if (!get(isAuthenticated)) {
      goto('/registro');
      return;
    }

    if (get(userRole) !== 'PACIENTE') {
      goto('/');
      return;
    }
    console.log(currentUser);
  });

</script>

<main class="min-h-screen bg-gray-50 py-12">
  <div class="container mx-auto px-6 max-w-screen-lg">
    <!-- Encabezado -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <h2 class="text-3xl font-bold text-emerald-700">Mi cuenta</h2>
      <div class="flex items-center gap-3">
        <div class="text-sm text-gray-600">{#if currentUser}{currentUser.name ?? currentUser.email}{/if}</div>
        <button on:click={doLogout} class="px-3 py-1 bg-red-50 text-red-700 rounded">
          Cerrar sesión
        </button>
      </div>
    </div>

    <!-- Menú de opciones -->
    <section aria-label="Opciones del paciente"
      class="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 mb-10">
      <!-- Estadísticas -->
      <a href="/estadisticas/mensuales" on:click={nav('/estadisticas/mensuales')}
        class="flex items-start gap-3 p-5 bg-white rounded-lg shadow hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
        <span class="text-2xl" aria-hidden="true"></span>
        <div>
          <h3 class="font-semibold text-emerald-700">Estadísticas</h3>
          <p class="text-sm text-gray-600">Mensuales y semanales</p>
        </div>
      </a>

      <!-- Calendario -->
      <a href="/calendario" on:click={nav('/calendario')}
        class="flex items-start gap-3 p-5 bg-white rounded-lg shadow hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
        <span class="text-2xl" aria-hidden="true"></span>
        <div>
          <h3 class="font-semibold text-emerald-700">Calendario</h3>
          <p class="text-sm text-gray-600">Agenda y seguimiento</p>
        </div>
      </a>

      
    </section>

    <!-- Tarjeta de perfil -->
    <section class="bg-white p-6 rounded-lg shadow max-w-3xl">
      {#if currentUser}
        <p><span class="font-semibold">Nombre:</span> {currentUser.name ?? (currentUser.last_name ?? 'Sin nombre')}</p>
        <div class="grid md:grid-cols-2 gap-2 mt-3">
          <p><strong>Correo:</strong> {currentUser.email}</p>
          <p><strong>Teléfono:</strong> {currentUser.cellphone ?? '—'}</p>
          <p><strong>Edad:</strong> {currentUser.age ?? '—'}</p>
          <p><strong>Género:</strong> {currentUser.gender ?? '—'}</p>
          <p><strong>Altura:</strong> {currentUser.height ? `${currentUser.height} cm` : '—'}</p>
          <p><strong>Peso:</strong> {currentUser.actual_weight ? `${currentUser.actual_weight} kg` : '—'}</p>
          <p><strong>Peso meta:</strong> {currentUser.goal_weight ? `${currentUser.goal_weight} kg` : '—'}</p>
          <p><strong>Última visita:</strong> {currentUser.last_visit ?? '—'}</p>
        </div>

      {:else}
        {#if $user}
          <p><span class="font-semibold">Nombre:</span> {$user.name ?? 'Sin nombre'}</p>
          <p class="mt-2"><span class="font-semibold">Correo:</span> {$user.email}</p>
          <p class="mt-2 text-sm text-gray-600">Rol: Paciente</p>
        {/if}
      {/if}
    </section>
  </div>
</main>
