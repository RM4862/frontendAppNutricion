<script lang="ts">
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, logout } from '$lib/stores/auth';
  import { onMount } from 'svelte';

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

  let fullProfile: PatientFull | null = null;

  // Se asume que ya validaste sesión/rol antes o en un load server-side
  function nav(href: string) {
    return (e: MouseEvent) => { e.preventDefault(); goto(href); };
  }
  function doLogout() { logout(); goto('/'); }

  onMount(() => {
    const u = (typeof window !== 'undefined') ? JSON.parse(localStorage.getItem('nutriapp_user') || 'null') : null;
    const email = u?.email;
    if (!email) return;
    try {
      const all: any[] = JSON.parse(localStorage.getItem('nutriapp_pacientes') || '[]');
      const found = all.find((p: any) => (p.email || '').toLowerCase() === (email || '').toLowerCase());
      if (found) {
        fullProfile = {
          id: found.id,
          firstName: found.firstName,
          middleName: found.middleName,
          lastNameP: found.lastNameP,
          lastNameM: found.lastNameM,
          name: found.name || [found.firstName, found.middleName, found.lastNameP, found.lastNameM].filter(Boolean).join(' '),
          age: found.age,
          gender: found.gender,
          email: found.email,
          phone: found.phone,
          height: found.height,
          weight: found.weight,
          goalWeight: found.goalWeight,
          lastVisit: found.lastVisit,
          notes: found.notes,
          createdAt: found.createdAt
        };
      }
    } catch (e) {
      console.warn('Error loading patient profile from localStorage', e);
    }
  });
</script>

<main class="min-h-screen bg-gray-50 py-12">
  <div class="container mx-auto px-6 max-w-screen-lg">
    <!-- Encabezado -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <h2 class="text-3xl font-bold text-emerald-700">Mi cuenta</h2>
      <div class="flex items-center gap-3">
        <div class="text-sm text-gray-600">{#if $user}{$user.name ?? $user.email}{/if}</div>
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
      {#if fullProfile}
        <p><span class="font-semibold">Nombre:</span> {fullProfile.name ?? (fullProfile.firstName ?? 'Sin nombre')}</p>
        <div class="grid md:grid-cols-2 gap-2 mt-3">
          <p><strong>Correo:</strong> {fullProfile.email}</p>
          <p><strong>Teléfono:</strong> {fullProfile.phone ?? '—'}</p>
          <p><strong>Edad:</strong> {fullProfile.age ?? '—'}</p>
          <p><strong>Género:</strong> {fullProfile.gender ?? '—'}</p>
          <p><strong>Altura:</strong> {fullProfile.height ? `${fullProfile.height} cm` : '—'}</p>
          <p><strong>Peso:</strong> {fullProfile.weight ? `${fullProfile.weight} kg` : '—'}</p>
          <p><strong>Peso meta:</strong> {fullProfile.goalWeight ? `${fullProfile.goalWeight} kg` : '—'}</p>
          <p><strong>Última visita:</strong> {fullProfile.lastVisit ?? '—'}</p>
        </div>

        <section class="mt-4">
          <h3 class="text-sm font-semibold text-emerald-700">Notas</h3>
          <p class="text-gray-700 mt-1">{fullProfile.notes ?? 'Sin notas'}</p>
        </section>
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
