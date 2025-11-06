<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let patientId: string;
  let patientName = '';
  let appointments = [];
  let newAppointment = { date: '', time: '', description: '' };

  onMount(() => {
    patientId = $page.params.id;
    const query = new URLSearchParams($page.url.search);
    patientName = query.get('name') ?? 'Paciente sin nombre';

    // Citas simuladas (pasadas y próximas)
    appointments = [
      { id: 1, date: '2025-10-15', time: '09:00', description: 'Control de peso', completed: true },
      { id: 2, date: '2025-10-30', time: '11:00', description: 'Revisión de dieta', completed: true },
      { id: 3, date: '2025-11-15', time: '10:30', description: 'Seguimiento mensual', completed: false }
    ];
  });

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
