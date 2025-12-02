<script lang="ts">
  import { goto } from '$app/navigation';

  type Patient = {
    id: number;
    firstName: string;
    middleName?: string;
    lastNameP: string;
    lastNameM: string;
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

  let message = '';
  let error = '';

  function validateEmail(e: string) {
    return /^\S+@\S+\.\S+$/.test(e);
  }

  function resetForm() {
    firstName = middleName = lastNameP = lastNameM = email = password = confirmPassword = '';
    message = error = '';
  }

  function cancelar() {
    // Volver al dashboard del nutriólogo
    goto('/nutriologo');
  }

  function guardarPaciente() {
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

    // Verificar que el correo no esté ya registrado
    const existingUsers = JSON.parse(localStorage.getItem('nutriapp_users') || '[]');
    if (existingUsers.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      error = 'Este correo ya está registrado.';
      return;
    }

    const id = Date.now();
    const newPatient: Patient = {
      id,
      firstName: firstName.trim(),
      middleName: middleName.trim() || undefined,
      lastNameP: lastNameP.trim(),
      lastNameM: lastNameM.trim(),
      email: email.trim().toLowerCase(),
      password,
      createdAt: new Date().toISOString()
    };

    // Guardar en la lista de pacientes
    const pacientes: Patient[] = JSON.parse(localStorage.getItem('nutriapp_pacientes') || '[]');
    pacientes.push(newPatient);
    localStorage.setItem('nutriapp_pacientes', JSON.stringify(pacientes));

    // También guardar en el sistema de usuarios para que pueda iniciar sesión
    const userObj = {
      firstName: newPatient.firstName,
      middleName: newPatient.middleName,
      lastNameP: newPatient.lastNameP,
      lastNameM: newPatient.lastNameM,
      cedulaProfesional: '',
      email: newPatient.email,
      password: newPatient.password,
      role: 'paciente'
    };
    existingUsers.push(userObj);
    localStorage.setItem('nutriapp_users', JSON.stringify(existingUsers));

    message = 'Paciente registrado correctamente.';
    // Limpiar formulario
    resetForm();
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
