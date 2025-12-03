<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let searchQuery = '';

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    
    if ($user?.role === 'nutriologo') {
      // Redirigir a la página de búsqueda de pacientes
      await goto(`/pacientes?search=${encodeURIComponent(searchQuery)}`);
    } else if ($user?.role === 'paciente') {
      // Redirigir a la página de búsqueda de dietas
      await goto(`/calendario/regimen-propuesto?search=${encodeURIComponent(searchQuery)}`);
    }
    
    searchQuery = ''; // Limpiar el campo después de la búsqueda
  }
</script>

<header class="bg-emerald-700 py-4 shadow fixed top-0 left-0 w-full z-50">
  <div class="container mx-auto px-6 flex items-center justify-between">
    
    <!-- Logo + Nombre -->
    <div class="flex items-center gap-3">
      <img src="/src/images/Logo_App.png" alt="Logo NutriApp" class="w-10 h-10" />
      <h1 class="text-xl font-bold text-emerald-300">NutriApp</h1>
    </div>

    <!-- Navegación + Acciones -->
    <div class="hidden md:flex items-center gap-4 text-sm text-emerald-300 font-medium">
      
      <!-- Botón Inicio -->
      {#if $user?.role === 'nutriologo'}
        <a href="/nutriologo" class="hover:underline">Inicio</a>
      {:else if $user?.role === 'paciente'}
        <a href="/paciente" class="hover:underline">Inicio</a>
      {:else}
        <a href="/" class="hover:underline">Inicio</a>
      {/if}

		<span class="text-emerald-600">|</span>
      <!-- Buscador refinado -->
      {#if $user}
        <form 
          on:submit|preventDefault={handleSearch} 
          class="flex items-center border border-emerald-300 rounded-md overflow-hidden"
        >
          <input
            bind:value={searchQuery}
            type="text"
            placeholder={$user.role === 'nutriologo' ? 'Buscar pacientes' : 'Buscar dietas'}
            class="px-3 py-1 text-sm text-gray-700 bg-emerald-50 border-none focus:outline-none"
          />
          <button 
            type="submit"
            class="bg-emerald-600 p-2 hover:bg-emerald-300 transition-colors"
          >
            <!-- Lupa minimalista blanca -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z" />
            </svg>
          </button>
        </form>
      {/if}
      <span class="text-emerald-600">|</span>

      <!-- Botón Mensajes -->
      <button class="px-3 py-1 rounded-md hover:bg-emerald-200">Mensajes</button>

      <!-- Botón Agregar pacientes (solo para nutriólogos) -->
      {#if $user?.role === 'NUTRIOLOGO'}
        <span class="text-emerald-600">|</span>
        <button 
          class="px-3 py-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-700"
          on:click={() => goto('/nutriologo/paciente/agregar')}
        >
          Agregar pacientes
        </button>
      {/if}
    </div>
  </div>
</header>

