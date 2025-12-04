<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, userRole, logout } from '$lib/stores/auth';
  import { get } from 'svelte/store';

  type Appointment = {
    id: number;
    date: string;
    time: string;
    description: string;
    completed: boolean;
  };


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

  
  let patientId: string | undefined;
  let currentUser: any;
  let patientName = '';

  type part = {
    id?:  number;
    date: string;
    group_name: string;
    description: string;
    aliment: string;
    amount:number;
    unit: string;
  };

  type meal = {
    id:number;
    name: string;
    description?:string;
    parts: part[]; 
  };

  let meals: meal[] = [];

  onMount(async () => {
    patientId = $page.params.id;
    currentUser = get(user);

    const query = new URLSearchParams($page.url.search);
    patientName = query.get('name') ?? `Paciente ${patientId}`;

    // Validaciones
    if (!get(isAuthenticated)) {
      goto('/registro');
      return;
    }

    if (get(userRole) !== 'NUTRIOLOGO') {
      goto('/');
      return;
    }

    try {
      const req = await fetch(`http://127.0.0.1:8000/food/nutriologist/${patientId}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });

      const res = await req.json();
      const patient_event = res.data ?? [];
      console.log(res, patientId);

      for (const p of patient_event) {
        try {
          const req_part = await fetch(
            `http://127.0.0.1:8000/food/menu/register?food_event_id=${p.id}`,
            {
              headers: { Authorization: `Bearer ${currentUser.token}` }
            }
          );

          const res_part = await req_part.json();
          const patient_part = res_part.data ?? [];
          console.log(patient_part);

          const current_part: part[] =
            patient_part.length > 0
              ? patient_part.map((pp) => ({
                  id:  pp.id,
                  date: pp.date,
                  group_name: pp.group_name,
                  description: pp.description,
                  aliment: pp.aliment,
                  amount:pp.amount,
                  unit: pp.unit,
          })): [];

          meals = [
            ...meals,
            {
              id: p.id,
              name: p.food_name,
              parts: current_part
            }
          ];
        } catch (e) {
          console.log('Error al fetch patient menu part: ', e);
        }
      }
      console.log('meals: ',meals);
    } catch (e) {
      console.log('Error al fetch patient food: ', e);
    }

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
      {#if meals}
        <div class="mb-6">
          {#each meals as meal}
              <h4 class="font-semibold text-emerald-600 mb-3">{meal.name}</h4>
              {#if meal.parts.length > 0}
                <div class="space-y-2">
                  {#each meal.parts as a}
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                      <div class="md:col-span-5">
                        <span class="text-xs text-gray-600 block mb-1">Alimento</span>
                        <span class="font-medium text-gray-800">{a.group_name}</span>
                      </div>

                      <div class="md:col-span-3">
                        <span class="text-xs text-gray-600 block mb-1">Cantidad</span>
                        <span class="font-medium text-gray-800">{a.amount}</span>
                      </div>

                      <div class="md:col-span-4">
                        <span class="text-xs text-gray-600 block mb-1">Unidad</span>
                        <span class="font-medium text-gray-800">{a.unit}</span>
                      </div>

                      <div class="md:col-span-4">
                        <span class="text-xs text-gray-600 block mb-1">Unidad</span>
                        <span class="font-medium text-gray-800">{a.date}</span>
                      </div>
                    </div>
                  {/each}
                </div>
              {:else}
                <p class="text-gray-500 text-sm italic">
                  No hay alimentos registrados para esta comida.
                </p>
              {/if}
          {/each}
        </div>
      {/if}
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

</main>
