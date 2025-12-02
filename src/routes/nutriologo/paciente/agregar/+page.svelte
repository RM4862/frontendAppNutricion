<script lang="ts">
  import { goto } from '$app/navigation';
  import { login as storeLogin } from '$lib/stores/auth';

  type Patient = {
    id: number;
    firstName: string;
    name?: string;
    middleName?: string;
    lastNameP: string;
    lastNameM: string;
    age?: number;
    gender?: string;
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

  let age: number | '' = '';
  let gender = '';
  let phone = '';
  let height: number | '' = '';
  let weight: number | '' = '';
  let goalWeight: number | '' = '';
  let lastVisit = '';
  let notes = '';

  let message = '';
  let error = '';

  function validateEmail(e: string) {
    return /^\S+@\S+\.\S+$/.test(e);
  }

  function resetForm() {
    firstName = middleName = lastNameP = lastNameM = email = password = confirmPassword = '';
    age = '';
    gender = '';
    phone = '';
    height = '';
    weight = '';
    goalWeight = '';
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
      name: [firstName.trim(), middleName.trim(), lastNameP.trim(), lastNameM.trim()].filter(Boolean).join(' '),
      middleName: middleName.trim() || undefined,
      lastNameP: lastNameP.trim(),
      lastNameM: lastNameM.trim(),
      age: typeof age === 'number' ? age : undefined,
      gender: gender || undefined,
      phone: phone || undefined,
      height: typeof height === 'number' ? height : undefined,
      weight: typeof weight === 'number' ? weight : undefined,
      goalWeight: typeof goalWeight === 'number' ? goalWeight : undefined,
      lastVisit: lastVisit || undefined,
      notes: notes || undefined,
      email: email.trim().toLowerCase(),
      password,
      createdAt: new Date().toISOString()
    };

    // Guardar en la lista de pacientes
    const pacientes: Patient[] = JSON.parse(localStorage.getItem('nutriapp_pacientes') || '[]');
    pacientes.push(newPatient);
    localStorage.setItem('nutriapp_pacientes', JSON.stringify(pacientes));

    // Prepare user object (don't persist to local users yet — wait for server confirmation or fallback)
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

    // Intentar crear el usuario también en el backend para permitir login real
    try {
      const payload = {
        name: newPatient.name,
        first_name: newPatient.firstName,
        last_name: `${newPatient.lastNameP} ${newPatient.lastNameM}`.trim(),
        mail: newPatient.email,
        password: newPatient.password,
        role: 'paciente'
      };

      const resp = await fetch('http://127.0.0.1:8000/auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const body = await resp.text().catch(() => '');
        console.warn('No se pudo crear usuario en backend', resp.status, body);
        if (resp.status === 409) {
          // Conflict: email already exists on server
          error = 'El correo ya está registrado en el servidor. Usa otro correo o solicita restablecer la cuenta.';
          // Do NOT add to local `nutriapp_users` because server already has this account
          message = 'Paciente registrado localmente.';
          // stop here (do not attempt auto-login)
        } else {
          // Other server error: fallback to local-only user
          existingUsers.push(userObj);
          localStorage.setItem('nutriapp_users', JSON.stringify(existingUsers));
          message = 'Paciente registrado localmente. (No se pudo crear en servidor)';
        }
      } else {
        // Si el backend creó el usuario, persistir en usuarios locales y intentar auto-login
        existingUsers.push(userObj);
        localStorage.setItem('nutriapp_users', JSON.stringify(existingUsers));
        try {
          const params = new URLSearchParams();
          // Normalize username before sending
          params.append('username', (newPatient.email || '').trim().toLowerCase());
          params.append('password', newPatient.password || '');
          console.debug('/auth/token params (auto-login)', params.toString());

          const tokenResp = await fetch('http://127.0.0.1:8000/auth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
          });

          if (tokenResp.ok) {
            const tokenData = await tokenResp.json();
            const token = tokenData.access_token;
            // Obtener info del usuario
            const meResp = await fetch('http://127.0.0.1:8000/auth/me', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (meResp.ok) {
              const me = await meResp.json();
              const fullName = me.name || [me.first_name || '', me.last_name || ''].filter(Boolean).join(' ').trim();
              storeLogin({ email: newPatient.email, name: fullName, role: (me.role||'').toLowerCase(), token });
              message = 'Paciente registrado correctamente.';
              // redirigir al perfil del paciente (ya autenticado)
              setTimeout(() => goto(`/nutriologo/paciente/${id}/perfil?name=${encodeURIComponent(newPatient.name || '')}`), 600);
              return;
            }
          }

          // Si no obtuvimos token, mostrar mensaje pero seguir con redirección a perfil local
          message = 'Paciente registrado correctamente (no se pudo iniciar sesión automáticamente).';
        } catch (e) {
          console.warn('Error durante auto-login', e);
          message = 'Paciente registrado localmente. (Error al autenticarse automáticamente)';
        }
      }
    } catch (e) {
      console.warn('Error creando usuario en backend', e);
      message = 'Paciente registrado localmente. (Error de conexión con servidor)';
    }

    message = 'Paciente registrado correctamente.';
    // Limpiar formulario
    resetForm();

    // Redirigir al perfil del paciente recién creado (mostrar nombre en query)
    setTimeout(() => {
      goto(`/nutriologo/paciente/${id}/perfil?name=${encodeURIComponent(newPatient.name || '')}`);
    }, 600);
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
