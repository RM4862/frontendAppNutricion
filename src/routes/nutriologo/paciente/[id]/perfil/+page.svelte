<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  type Patient = {
    id: number;
    name: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    height: number;
    weight: number;
    goalWeight: number;
    lastVisit: string;
    notes: string;
  };

  let patientId: string;
  let patient: Patient | null = null;
  let editing = false;
  let form: Partial<Patient> = {};

  onMount(() => {
    patientId = $page.params.id;
    const query = new URLSearchParams($page.url.search);
    const name = query.get('name') ?? 'Paciente ' + patientId;

    // Simular obtención de información del paciente
    patient = {
      id: Number(patientId),
      name,
      age: 34,
      gender: 'Femenino',
      email: 'maria.gonzalez@example.com',
      phone: '555-123-4567',
      height: 165,
      weight: 74,
      goalWeight: 68,
      lastVisit: '2025-10-20',
      notes: 'Paciente con buena adherencia al plan alimenticio.'
    };
  });

  function goBack() {
    goto('/nutriologo');
  }

  function startEdit() {
    if (!patient) return;
    form = { ...patient };
    editing = true;
  }

  function saveChanges() {
    if (!patient) return;
    patient = { ...patient, ...form };
    editing = false;
  }

  function cancelEdit() {
    editing = false;
  }
</script>

<main class="min-h-screen bg-gray-50 py-10">
  <div class="container mx-auto px-6 max-w-3xl">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-emerald-700">
        Perfil de {patient?.name}
      </h2>
      <button
        on:click={goBack}
        class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
      >
        ← Regresar
      </button>
    </div>

    {#if patient}
      <div class="bg-white rounded-xl shadow p-6 space-y-6">
        <!-- Información general -->
        <section>
          <h3 class="text-lg font-semibold text-emerald-700 mb-3">
            Información general
          </h3>

          <div class="grid md:grid-cols-2 gap-4">
            <p><strong>Edad:</strong> {patient.age} años</p>
            <p><strong>Género:</strong> {patient.gender}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Teléfono:</strong> {patient.phone}</p>
            <p><strong>Altura:</strong> {patient.height} cm</p>
            <p><strong>Peso actual:</strong> {patient.weight} kg</p>
            <p><strong>Peso meta:</strong> {patient.goalWeight} kg</p>
            <p><strong>Última visita:</strong> {patient.lastVisit}</p>
          </div>
        </section>

        <!-- Notas -->
        <section>
          <h3 class="text-lg font-semibold text-emerald-700 mb-2">Notas</h3>
          <p class="text-gray-700">{patient.notes}</p>
        </section>

        <!-- Acciones -->
        <div class="flex justify-end gap-3">
          {#if !editing}
            <button
              on:click={startEdit}
              class="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
            >
              Editar información
            </button>
          {/if}
        </div>
      </div>

      {#if editing}
        <div class="bg-white rounded-xl shadow p-6 mt-8">
          <h3 class="text-lg font-semibold text-emerald-700 mb-4">
            Editar información
          </h3>

          <div class="grid gap-4 md:grid-cols-2">
            <input class="border rounded p-2 text-sm" bind:value={form.name} placeholder="Nombre" />
            <input class="border rounded p-2 text-sm" type="number" bind:value={form.age} placeholder="Edad" />
            <input class="border rounded p-2 text-sm" bind:value={form.gender} placeholder="Género" />
            <input class="border rounded p-2 text-sm" bind:value={form.email} placeholder="Email" />
            <input class="border rounded p-2 text-sm" bind:value={form.phone} placeholder="Teléfono" />
            <input class="border rounded p-2 text-sm" type="number" bind:value={form.height} placeholder="Altura (cm)" />
            <input class="border rounded p-2 text-sm" type="number" bind:value={form.weight} placeholder="Peso actual (kg)" />
            <input class="border rounded p-2 text-sm" type="number" bind:value={form.goalWeight} placeholder="Peso meta (kg)" />
            <input class="border rounded p-2 text-sm" type="date" bind:value={form.lastVisit} />
            <textarea
              class="border rounded p-2 text-sm md:col-span-2"
              bind:value={form.notes}
              placeholder="Notas"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button
              on:click={saveChanges}
              class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Guardar cambios
            </button>
            <button
              on:click={cancelEdit}
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      {/if}
    {:else}
      <p class="text-gray-600">Cargando información del paciente...</p>
    {/if}
  </div>
</main>
