<script lang="ts">
  
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let firstName = '';
  let middleName = '';
  let lastNameP = '';
  let lastNameM = '';
  let cedulaProfesional = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
  let loading = false;

  const role = 'nutriologo'; // Solo se registran nutriólogos aquí

  const USERS_KEY = 'nutriapp_users';

  function validateEmail(e: string) {
    return /\S+@\S+\.\S+/.test(e);
  }

  function readUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveUser(u: any) {
    const all = readUsers();
    all.push(u);
    localStorage.setItem(USERS_KEY, JSON.stringify(all));
  }

  async function handleSubmit(ev: Event) {
    ev.preventDefault();
    error = '';

    if (!firstName) { error = 'Por favor ingresa tu primer nombre.'; return; }
    if (!lastNameP) { error = 'Por favor ingresa tu apellido paterno.'; return; }
    if (!lastNameM) { error = 'Por favor ingresa tu apellido materno.'; return; }
    if (!cedulaProfesional) { error = 'Por favor ingresa tu cédula profesional.'; return; }
    if (!email) { error = 'Por favor ingresa tu correo.'; return; }
    if (!validateEmail(email)) { error = 'Formato de correo inválido.'; return; }
    if (!password) { error = 'Por favor ingresa una contraseña.'; return; }
    if (password.length < 6) { error = 'La contraseña debe tener al menos 6 caracteres.'; return; }
    if (password !== confirmPassword) { error = 'Las contraseñas no coinciden.'; return; }

    // Evitar registros duplicados
    const existing = readUsers().find((x: any) => x.email.toLowerCase() === email.toLowerCase());
    if (existing) { error = 'El correo ya está registrado.'; return; }

    loading = true;
    
    // TODO: Reemplazar con llamada real al backend
    // const response = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     firstName,
    //     middleName,
    //     lastNameP,
    //     lastNameM,
    //     cedulaProfesional: role === 'nutriologo' ? cedulaProfesional : '',
    //     email,
    //     password,
    //     role
    //   })
    // });
    // 
    // if (!response.ok) {
    //   const data = await response.json();
    //   error = data.message || 'Error al registrar usuario';
    //   loading = false;
    //   return;
    // }
    //
    // loading = false;
    // goto('/registro'); // Redirigir al login

    // SIMULACIÓN TEMPORAL con localStorage (eliminar cuando se integre backend)
    await new Promise((r) => setTimeout(r, 700));

    const userObj = {
      firstName,
      middleName,
      lastNameP,
      lastNameM,
      cedulaProfesional,
      email,
      password,
      role: 'nutriologo' // Solo se registran nutriólogos
    };

    try {
      saveUser(userObj);
    } catch (e) {
      error = 'Error al guardar el usuario.';
      loading = false;
      return;
    }

    loading = false;
    // Redirigir al login
    goto('/registro');
  }

  let firstInput: HTMLInputElement | null = null;
  onMount(() => firstInput?.focus());
</script>


<main class="min-h-screen flex bg-gradient-to-b from-white to-amber-50 relative">
  <!-- Sección izquierda: Formulario de registro -->
  <section class="w-full md:w-1/2 flex flex-col items-center justify-center p-8 relative">
    
    <!-- Encabezado con logo y nombre arriba a la izquierda -->
    <div class="absolute top-6 left-6 flex items-center">
      <img src="/src/images/Logo_App.png" alt="Logo NutriApp" class="w-16 h-22 mr-3" />
      <h2 class="text-2xl font-bold text-emerald-700">NutriApp</h2>
    </div>

    <!-- Card del formulario con margen superior para evitar superposición -->
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8 mt-24">
      <h1 class="text-2xl font-bold text-emerald-700 mb-2">Crear cuenta de nutriólogo</h1>
      <p class="text-sm text-gray-600 mb-6">
        Regístrate como nutriólogo para comenzar a usar NutriApp. Los pacientes deben ser registrados desde tu panel de control.
      </p>

      {#if error}
        <div class="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>
      {/if}
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700">Primer nombre</label>
          <input
            bind:this={firstInput}
            type="text"
            bind:value={firstName}
            placeholder="Primer nombre"
            class="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Segundo nombre (opcional)</label>
          <input
            type="text"
            bind:value={middleName}
            placeholder="Segundo nombre"
            class="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700">Apellido paterno</label>
          <input
            type="text"
            bind:value={lastNameP}
            placeholder="Apellido paterno"
            class="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Apellido materno</label>
          <input
            type="text"
            bind:value={lastNameM}
            placeholder="Apellido materno"
            class="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Correo</label>
        <input
          type="email"
          bind:value={email}
          placeholder="tu@correo.com"
          class="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Cédula profesional</label>
        <input
          type="text"
          bind:value={cedulaProfesional}
          placeholder="Número de cédula profesional"
          class="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
        <p class="mt-1 text-xs text-gray-500">Requerido para validar tu cuenta profesional</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          type="password"
          bind:value={password}
          placeholder="Mínimo 6 caracteres"
          class="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
        <input
          type="password"
          bind:value={confirmPassword}
          placeholder="Repite la contraseña"
          class="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div>
        <button
          type="submit"
          class="w-full inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          aria-busy={loading}
        >
          {#if loading}
            <span class="mr-2">Registrando…</span>
          {/if}
          Crear cuenta
        </button>
      </div>
    </form>
    <p class="mt-6 text-center text-sm text-gray-600">¿Ya tienes cuenta? <a href="/registro" class="text-emerald-600 hover:underline">Inicia sesión</a></p>
  </div>
 </section>

  <!-- Sección derecha: Imagen decorativa con contenido centrado -->
<section class="hidden md:flex w-1/2 items-center justify-center bg-cover bg-center relative p-8" style="background-image: url('/src/images/fondo\ registro.png');">
  <div class="flex flex-col items-center justify-center w-full max-w-xl text-center text-gray-700">
    
    <!-- Título principal -->
    <h3 class="text-3xl font-bold text-emerald-700 mb-8">Cómo funciona</h3>

    <!-- Tarjetas alargadas con pasos -->
    <div class="space-y-8 w-full px-4">
      <div class="bg-white bg-opacity-100 rounded-lg shadow-md p-6 text-left">
        <h4 class="text-lg font-semibold text-emerald-700 mb-2">Paso 1</h4>
        <p>Regístrate y define tus objetivos.</p>
      </div>

      <div class="bg-white bg-opacity-90 rounded-lg shadow-md p-6 text-left">
        <h4 class="text-lg font-semibold text-emerald-700 mb-2">Paso 2</h4>
        <p>Elige o personaliza tu plan de comidas.</p>
      </div>

      <div class="bg-white bg-opacity-90 rounded-lg shadow-md p-6 text-left">
        <h4 class="text-lg font-semibold text-emerald-700 mb-2">Paso 3</h4>
        <p>Consulta recetas y registra tus comidas día a día.</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-12 text-sm text-gray-600">
      <p>¿Tienes dudas? <a href="mailto:info@nutriapp.example" class="text-emerald-600 hover:underline">Contáctanos</a></p>
      <p class="mt-2">© {new Date().getFullYear()} NutriApp</p>
    </footer>
  </div>
</section>


  
</main>

<style>
  /* Pequeño fallback si Tailwind no está activo */
  input { box-sizing: border-box; }
</style>
