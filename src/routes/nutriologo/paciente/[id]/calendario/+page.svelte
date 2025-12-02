<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  type Appointment = {
    id: number;
    date: string;
    time: string;
    description: string;
    completed: boolean;
  };

  let patientId = '';
  let patientName = '';
  let appointments: Appointment[] = [];
  let newAppointment = { date: '', time: '', description: '' };

  // Visualización de registro de alimentos del paciente
  let selectedDate = '';
  let displayDate = '';
  
  type MealItem = { alimento: string; cantidad: string; unidad: string };
  
  // Datos simulados de lo que el paciente registró
  let registroAlimentos = {
    desayuno: [
      { alimento: 'Huevo', cantidad: '2', unidad: 'piezas' },
      { alimento: 'Pan', cantidad: '50', unidad: 'gramos' }
    ],
    comida: [
      { alimento: 'Pollo', cantidad: '150', unidad: 'gramos' },
      { alimento: 'Arroz', cantidad: '100', unidad: 'gramos' },
      { alimento: 'Verduras', cantidad: '1', unidad: 'tazas' }
    ],
    cena: [
      { alimento: 'Pescado', cantidad: '120', unidad: 'gramos' },
      { alimento: 'Ensalada', cantidad: '1', unidad: 'tazas' }
    ]
  };

  onMount(() => {
    patientId = $page.params.id ?? '';
    const query = new URLSearchParams($page.url.search);
    patientName = query.get('name') ?? 'Paciente sin nombre';

    // Fecha actual por defecto
    const today = new Date().toISOString().split('T')[0];
    selectedDate = today;
    updateDisplayDate(today);

    // Aquí cargarías los datos del registro del paciente según la fecha
    // fetchRegistroAlimentos(patientId, selectedDate);

    // Citas simuladas (pasadas y próximas)
    appointments = [
      { id: 1, date: '2025-10-15', time: '09:00', description: 'Control de peso', completed: true },
      { id: 2, date: '2025-10-30', time: '11:00', description: 'Revisión de dieta', completed: true },
      { id: 3, date: '2025-11-15', time: '10:30', description: 'Seguimiento mensual', completed: false }
    ];
  });

  function updateDisplayDate(dateStr: string) {
    if (!dateStr) return;
    const d = new Date(dateStr + 'T00:00:00');
    displayDate = d.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  function handleDateChange() {
    updateDisplayDate(selectedDate);
    // Aquí cargarías los datos del registro del paciente según la nueva fecha
    // fetchRegistroAlimentos(patientId, selectedDate);
  }

  function addAppointment() {
    if (!newAppointment.date || !newAppointment.time) return;
    appointments = [
      ...appointments,
      { ...newAppointment, id: Date.now(), completed: false }
    ];
    newAppointment = { date: '', time: '', description: '' };
  }

  function goBack() {
    goto('/nutriologo');
  }
</script>

<main class="min-h-screen bg-gray-50 py-12">
  <div class="container mx-auto px-6">
    <!-- Encabezado -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-emerald-700">Calendario de {patientName}</h2>
      <button
        on:click={goBack}
        class="px-4 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
      >
        Regresar
      </button>
    </div>

    <!-- Formulario de Registro de Alimentos -->
    <div class="bg-white rounded shadow p-6 mb-6">
      <h3 class="text-xl font-semibold text-emerald-700 mb-4">Registro de Alimentos</h3>
      
      <!-- Selector de fecha -->
      <div class="mb-4">
        <label for="dateSelector" class="block text-sm font-medium text-gray-700 mb-2">Selecciona el día</label>
        <input 
          id="dateSelector"
          type="date" 
          bind:value={selectedDate}
          on:change={handleDateChange}
          class="border border-gray-300 rounded px-3 py-2 w-full md:w-auto focus:border-emerald-500 focus:ring-emerald-500"
        />
        {#if displayDate}
          <p class="text-sm text-gray-600 mt-2">📅 {displayDate}</p>
        {/if}
      </div>

      <!-- Desayuno -->
      <div class="mb-6">
        <h4 class="font-semibold text-emerald-600 mb-3">🍳 Desayuno</h4>
        {#if registroAlimentos.desayuno.length > 0}
          <div class="space-y-2">
            {#each registroAlimentos.desayuno as item}
              <div class="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                <div class="md:col-span-5">
                  <span class="text-xs text-gray-600 block mb-1">Alimento</span>
                  <span class="font-medium text-gray-800">{item.alimento}</span>
                </div>
                <div class="md:col-span-3">
                  <span class="text-xs text-gray-600 block mb-1">Cantidad</span>
                  <span class="font-medium text-gray-800">{item.cantidad}</span>
                </div>
                <div class="md:col-span-4">
                  <span class="text-xs text-gray-600 block mb-1">Unidad</span>
                  <span class="font-medium text-gray-800">{item.unidad}</span>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500 text-sm italic">No hay alimentos registrados para el desayuno</p>
        {/if}
      </div>

      <!-- Comida -->
      <div class="mb-6">
        <h4 class="font-semibold text-emerald-600 mb-3">🍽️ Comida</h4>
        {#if registroAlimentos.comida.length > 0}
          <div class="space-y-2">
            {#each registroAlimentos.comida as item}
              <div class="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                <div class="md:col-span-5">
                  <span class="text-xs text-gray-600 block mb-1">Alimento</span>
                  <span class="font-medium text-gray-800">{item.alimento}</span>
                </div>
                <div class="md:col-span-3">
                  <span class="text-xs text-gray-600 block mb-1">Cantidad</span>
                  <span class="font-medium text-gray-800">{item.cantidad}</span>
                </div>
                <div class="md:col-span-4">
                  <span class="text-xs text-gray-600 block mb-1">Unidad</span>
                  <span class="font-medium text-gray-800">{item.unidad}</span>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500 text-sm italic">No hay alimentos registrados para la comida</p>
        {/if}
      </div>

      <!-- Cena -->
      <div class="mb-6">
        <h4 class="font-semibold text-emerald-600 mb-3">🌙 Cena</h4>
        {#if registroAlimentos.cena.length > 0}
          <div class="space-y-2">
            {#each registroAlimentos.cena as item}
              <div class="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                <div class="md:col-span-5">
                  <span class="text-xs text-gray-600 block mb-1">Alimento</span>
                  <span class="font-medium text-gray-800">{item.alimento}</span>
                </div>
                <div class="md:col-span-3">
                  <span class="text-xs text-gray-600 block mb-1">Cantidad</span>
                  <span class="font-medium text-gray-800">{item.cantidad}</span>
                </div>
                <div class="md:col-span-4">
                  <span class="text-xs text-gray-600 block mb-1">Unidad</span>
                  <span class="font-medium text-gray-800">{item.unidad}</span>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500 text-sm italic">No hay alimentos registrados para la cena</p>
        {/if}
      </div>
    </div>

    <!-- Formulario para agregar cita -->
    <div class="bg-white rounded shadow p-4 mb-6">
      <h3 class="font-semibold text-gray-700 mb-2">Agregar nueva cita</h3>
      <div class="flex flex-col md:flex-row gap-2">
        <input type="date" bind:value={newAppointment.date} class="border rounded px-2 py-1" />
        <input type="time" bind:value={newAppointment.time} class="border rounded px-2 py-1" />
        <input bind:value={newAppointment.description} placeholder="Descripción" class="border rounded px-2 py-1 flex-1" />
        <button on:click={addAppointment} class="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700">
          Agregar
        </button>
      </div>
    </div>

    <!-- Lista de citas -->
    <div class="space-y-3">
      {#each appointments as a}
        <article class="p-4 bg-white rounded shadow flex justify-between items-center">
          <div>
            <p class="font-semibold text-emerald-700">{a.description}</p>
            <p class="text-sm text-gray-600">{a.date} — {a.time}</p>
          </div>
          <span
            class="text-sm px-2 py-1 rounded 
            {a.completed ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-700'}"
          >
            {a.completed ? 'Completada' : 'Próxima'}
          </span>
        </article>
      {/each}
    </div>
  </div>
</main>
