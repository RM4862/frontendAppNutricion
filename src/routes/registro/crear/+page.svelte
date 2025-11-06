<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { getRoleFromEmail } from '$lib/stores/auth';

  let firstName = '';
  let middleName = '';
  let lastNameP = '';
  let lastNameM = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
  let loading = false;

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
    if (!email) { error = 'Por favor ingresa tu correo.'; return; }
    if (!validateEmail(email)) { error = 'Formato de correo inválido.'; return; }
    if (!password) { error = 'Por favor ingresa una contraseña.'; return; }
    if (password.length < 6) { error = 'La contraseña debe tener al menos 6 caracteres.'; return; }
    if (password !== confirmPassword) { error = 'Las contraseñas no coinciden.'; return; }

    // Evitar registros duplicados
    const existing = readUsers().find((x: any) => x.email.toLowerCase() === email.toLowerCase());
    if (existing) { error = 'El correo ya está registrado.'; return; }

    loading = true;
    // Simular llamada a API
    await new Promise((r) => setTimeout(r, 700));

    const role = getRoleFromEmail(email);
    const userObj = {
      firstName,
      middleName,
      lastNameP,
      lastNameM,
      email,
      password,
      role
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

<main class="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-amber-50 py-12">
  <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
    <h1 class="text-2xl font-bold text-emerald-700 mb-2">Crear cuenta</h1>
    <p class="text-sm text-gray-600 mb-6">Regístrate para comenzar a usar NutriApp. Usa <code class="text-xs">@nut.com</code> para cuentas de nutriólogo y <code class="text-xs">@pac.com</code> para pacientes.</p>

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
</main>

<style>
  /* Pequeño fallback si Tailwind no está activo */
  input { box-sizing: border-box; }
</style>
