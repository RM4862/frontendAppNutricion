
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, userRole, logout } from '$lib/stores/auth';
  import { get } from 'svelte/store';

  let currentUser: any;

  onMount(() => {
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
  });

  type Patient = {
    name?: string;
    middleName?: string;
    lastNameP: string;
    lastNameM: string;
    age: number;
    gender: string;
    phone?: string;
    height?: number;
    weight?: number;
    goalWeight?: number;
    lastVisit?: string;
    notes?: string;
    email: string;
    password: string;
    createdAt: string;
  };
  
  let firstName = '';
  let middleName = '';
  let lastNameP = '';
  let lastNameM = '';
  let email = '';
  let password = '';
  let confirmPassword = '';

  let age: number ;
  let gender = '';
  let phone = '';
  let height: number ;
  let weight: number ;
  let goalWeight: number ;
  let lastVisit = '';
  let notes = '';

  let message = '';
  let error = '';

  function validateEmail(e: string) {
    return /^\S+@\S+\.\S+$/.test(e);
  }

  function resetForm() {
    firstName = middleName = lastNameP = lastNameM = email = password = confirmPassword = '';
    age = 0;
    gender = '';
    phone = '';
    height = 0;
    weight = 0;
    goalWeight = 0;
    lastVisit = '';
    notes = '';
    message = error = '';
  }

  function cancelar() {
    // Volver al dashboard del nutriólogo
    goto('/nutriologo');
  }

  async function guardarPaciente() {
    error = '';
    message = '';

    if (!firstName.trim()) {
      error = 'El primer nombre es necesario.';
      return;
    }
    if (!lastNameP.trim()) {
      error = 'El apellido paterno es necesario.';
      return;
    }
    if (!lastNameM.trim()) {
      error = 'El apellido materno es necesario.';
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      error = 'Introduce un correo válido.';
      return;
    }
    if (!password) {
      error = 'La contraseña es necesaria.';
      return;
    }
    if (password !== confirmPassword) {
      error = 'Las contraseñas no coinciden.';
      return;
    }

   const newPatient: Patient = {
      name: [firstName, middleName].filter(Boolean).join(' '),
      lastNameP,
      lastNameM,
      email,
      gender,
      password,
      age: age,
      phone,
      height: height,
      weight,
      goalWeight,
      lastVisit,
      createdAt: new Date().toISOString()
    };

    const to_send = {
      name:newPatient.name,
      first_name: newPatient.lastNameP,
      last_name: newPatient.lastNameM,
      age: newPatient.age,
      gender: newPatient.gender,
      phone: newPatient.phone,
      height: newPatient.height,
      actual_weight: newPatient.weight,
      goal_weight: newPatient.goalWeight,
      last_visit: newPatient.lastVisit, 
      mail: newPatient.email,
      password: newPatient.password

    }
    console.log('Para mandar:  ', to_send);
    try {
      const res = await fetch('http://127.0.0.1:8000/patients/nutriologist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(to_send)
      });

      const data = await res.json();
      console.log('Response:', data);

      if (!res.ok) {
        error = data.detail || 'Error al crear paciente';
        return;
      }

      const id = data.user.id;  

      message = 'Paciente registrado correctamente.';
      resetForm();

      goto(`/nutriologo/paciente/${id}/perfil?name=${encodeURIComponent(newPatient.name!)}`);


    } catch (e) {
      console.error(e);
      error = 'Error al conectar con el servidor.';
    }

  }
</script>

<main class="p-6 max-w-md mx-auto">
  <h1 class="text-2xl font-bold text-emerald-700 mb-4">Agregar paciente</h1>

  <form class="space-y-4" on:submit|preventDefault={guardarPaciente}>
    <div>
      <label for="firstName" class="block text-sm font-medium text-emerald-700">Primer nombre <span class="text-red-600">*</span></label>
      <input id="firstName" bind:value={firstName} class="w-full border rounded px-3 py-2" required />
    </div>

    <div>
      <label for="middleName" class="block text-sm font-medium text-emerald-700">Segundo nombre (opcional)</label>
      <input id="middleName" bind:value={middleName} class="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label for="lastNameP" class="block text-sm font-medium text-emerald-700">Apellido paterno <span class="text-red-600">*</span></label>
      <input id="lastNameP" bind:value={lastNameP} class="w-full border rounded px-3 py-2" required />
    </div>

    <div>
      <label for="lastNameM" class="block text-sm font-medium text-emerald-700">Apellido materno <span class="text-red-600">*</span></label>
      <input id="lastNameM" bind:value={lastNameM} class="w-full border rounded px-3 py-2" required />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-emerald-700">Correo <span class="text-red-600">*</span></label>
      <input id="email" type="email" bind:value={email} class="w-full border rounded px-3 py-2" required />
    </div>

    <div>
      <label for="age" class="block text-sm font-medium text-emerald-700">Edad</label>
      <input id="age" type="number" bind:value={age} min="0" class="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label for="gender" class="block text-sm font-medium text-emerald-700">Género</label>
      <select id="gender" bind:value={gender} class="w-full border rounded px-3 py-2">
        <option value="">Seleccionar</option>
        <option value="Femenino">Femenino</option>
        <option value="Masculino">Masculino</option>
        <option value="Otro">Otro</option>
      </select>
    </div>

    <div>
      <label for="phone" class="block text-sm font-medium text-emerald-700">Teléfono</label>
      <input id="phone" bind:value={phone} class="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label for="height" class="block text-sm font-medium text-emerald-700">Altura (cm)</label>
      <input id="height" type="number" bind:value={height} class="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label for="weight" class="block text-sm font-medium text-emerald-700">Peso actual (kg)</label>
      <input id="weight" type="number" bind:value={weight} class="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label for="goalWeight" class="block text-sm font-medium text-emerald-700">Peso meta (kg)</label>
      <input id="goalWeight" type="number" bind:value={goalWeight} class="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label for="lastVisit" class="block text-sm font-medium text-emerald-700">Última visita</label>
      <input id="lastVisit" type="date" bind:value={lastVisit} class="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label for="notes" class="block text-sm font-medium text-emerald-700">Notas</label>
      <textarea id="notes" bind:value={notes} class="w-full border rounded px-3 py-2"></textarea>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-emerald-700">Contraseña <span class="text-red-600">*</span></label>
      <input id="password" type="password" bind:value={password} class="w-full border rounded px-3 py-2" required />
    </div>

    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-emerald-700">Confirmar contraseña <span class="text-red-600">*</span></label>
      <input id="confirmPassword" type="password" bind:value={confirmPassword} class="w-full border rounded px-3 py-2" required />
    </div>

    <div class="flex gap-3">
      <button type="submit" class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">Guardar</button>
      <button type="button" on:click={cancelar} class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Cancelar</button>
    </div>

    {#if error}
      <p class="mt-2 text-sm text-red-600">{error}</p>
    {/if}

    {#if message}
      <p class="mt-2 text-sm text-emerald-700">{message}</p>
    {/if}
  </form>
</main>
