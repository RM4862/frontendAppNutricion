<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, userRole, logout } from '$lib/stores/auth';
  import { get } from 'svelte/store';

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

  let currentUser: any;

  let patientId: string | undefined;
  let patient: Patient | null = null;
  let editing = false;
  let form: Partial<Patient> = {};

  onMount(async() => {
    patientId = $page.params.id;
    if (!get(isAuthenticated)) {
      goto('/registro');
      return;
    }

    if (get(userRole) !== 'NUTRIOLOGO') {
      goto('/');
      return;
    }

    currentUser = get(user);
    console.log('User:', currentUser);
    try{
      const req = await fetch(`http://127.0.0.1:8000/patient/nutriologist?patient_id=${patientId}`,{
        method: 'GET',
        headers:{
          Authorization: `Bearer ${currentUser.token}`
        }
      });

      const res =  await req.json();
      const res_user = res.data;
      console.log('User: ',res.data);
      patient = {
        id: Number(res_user.id),
        name: res_user.name || [res_user.firstName, res_user.middleName, res_user.lastNameP, res_user.lastNameM].filter(Boolean).join(' '),
        age: res_user.age ?? 0,
        gender: res_user.gender ?? '',
        email: res_user.mail ?? '',
        phone: res_user.cellphone ?? '',
        height: res_user.height ?? 0,
        weight: res_user.actual_weight ?? 0,
        goalWeight: res_user.goal_weight ?? 0,
        lastVisit: res_user.last_visit ?? '',
        notes: res_user.notes ?? ''
      };

    }catch(e){
      console.log('Error: ', e);
    }
    
  });

  function goBack() {
    goto('/nutriologo');
  }

  function startEdit() {
    if (!patient) return;
    form = { ...patient };
    editing = true;
  }

  function deletePatient() {
    if (!patient) return;
    const ok = confirm(`¿Eliminar al paciente ${patient.name}? Esta acción no se puede deshacer.`);
    if (!ok) return;
    try {
      const all: any[] = JSON.parse(localStorage.getItem('nutriapp_pacientes') || '[]');
      const remaining = all.filter((p: any) => String(p.id) !== String(patient!.id));
      localStorage.setItem('nutriapp_pacientes', JSON.stringify(remaining));
      // eliminar usuario asociado si existe
      const users: any[] = JSON.parse(localStorage.getItem('nutriapp_users') || '[]');
      const filteredUsers = users.filter((u: any) => u.email !== patient!.email);
      localStorage.setItem('nutriapp_users', JSON.stringify(filteredUsers));
    } catch (e) {
      console.error('Error al eliminar paciente', e);
    }
    goto('/nutriologo');
  }

  function saveChanges() {
    if (!patient) return;
    // Actualizar en memoria
    patient = { ...patient, ...form } as any;
    // Persistir en localStorage
    try {
      const all: any[] = JSON.parse(localStorage.getItem('nutriapp_pacientes') || '[]');
      const idx = all.findIndex((p: any) => String(p.id) === String(patient!.id));
      const toSave = {
        id: patient!.id,
        // mantener estructura que usa la app
        firstName: (patient!.name || '').split(' ')[0] || '',
        middleName: undefined,
        lastNameP: '',
        lastNameM: '',
        name: patient!.name,
        age: patient!.age,
        gender: patient!.gender,
        email: patient!.email,
        phone: patient!.phone,
        height: patient!.height,
        weight: patient!.weight,
        goalWeight: patient!.goalWeight,
        lastVisit: patient!.lastVisit,
        notes: patient!.notes
      };
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...toSave };
      } else {
        all.push(toSave);
      }
      localStorage.setItem('nutriapp_pacientes', JSON.stringify(all));
      // también actualizar usuarios si corresponde
      const users: any[] = JSON.parse(localStorage.getItem('nutriapp_users') || '[]');
      const uidx = users.findIndex((u: any) => u.email === patient!.email);
      if (uidx >= 0) {
        users[uidx] = { ...users[uidx], firstName: patient!.name };
        localStorage.setItem('nutriapp_users', JSON.stringify(users));
      }
    } catch (e) {
      console.error('Error guardando paciente', e);
    }

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
            <button
              on:click={deletePatient}
              class="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Eliminar paciente
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
            <select class="border rounded p-2 text-sm" bind:value={form.gender}>
              <option value="">Seleccionar</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>
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
