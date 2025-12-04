<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { login as doLogin } from '$lib/stores/auth';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  let emailInput: HTMLInputElement | null = null;

  onMount(() => {
    emailInput?.focus();
  });

  function validateEmail(e: string): boolean {
    return /^\S+@\S+\.\S+$/.test(e);
  }

  async function handleSubmit(ev: Event) {
    ev.preventDefault();
    error = '';

    if (!email.trim()) {
      error = 'Por favor ingresa tu correo.';
      return;
    }
    if (!validateEmail(email)) {
      error = 'Formato de correo inválido.';
      return;
    }
    if (!password.trim()) {
      error = 'Por favor ingresa tu contraseña.';
      return;
    }

    loading = true;

    try {
      // ----------- LOGIN / TOKEN -----------
      const params = new URLSearchParams();
      params.append('username', email.trim().toLowerCase());
      params.append('password', password);

      const tokenResp = await fetch('http://127.0.0.1:8000/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      if (!tokenResp.ok) {
        const status = tokenResp.status;
        const body = await tokenResp.text().catch(() => '');
        let data = {};
        try { data = JSON.parse(body); } catch {}
        error = (data as any)?.detail || `Credenciales incorrectas (${status})`;
        loading = false;
        return;
      }

      const tokenData = await tokenResp.json();
      console.log(tokenData);
      const token = tokenData.access_token;

      // ----------- GET USER INFO (/me) -----------
      const meResp = await fetch('http://127.0.0.1:8000/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!meResp.ok) {
        error = 'No se pudo obtener la información del usuario.';
        loading = false;
        return;
      }

      const me = await meResp.json();
      console.log(me);
      const info = me.data; // Tu endpoint devuelve { data: {...} }

      const fullName =
        info.name ||
        [info.first_name || '', info.last_name || '']
          .filter(Boolean)
          .join(' ')
          .trim();

      // ----------- OBJETO QUE SE GUARDA EN EL STORE -----------
      const userData = {
        email: info.mail,
        name: fullName,
        first_name: info.first_name,
        last_name: info.last_name,
        id:info.id,
        age:info.age,
        height:info.height,
        goal_weight: info.goal_weight, 
        actual_weight: info.actual_weight,
        gender: info.gender,
        cellphone: info.cellphone,
        last_visit:info.last_visit,
        role: info.role,       // NUTRIOLOGO | PACIENTE
        token: token           // token OAuth2
      };

      doLogin(userData);
      
      loading = false;

      // ----------- REDIRECCIÓN -----------
      console.log('Validando roles: ',info.role === 'NUTRIOLOGO');
      goto(info.role === 'NUTRIOLOGO' ? '/nutriologo' : '/paciente');

    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof TypeError) {
        error =
          'No se pudo conectar al servidor backend. Verifica que esté ejecutándose en http://127.0.0.1:8000';
      } else {
        error = 'Error al iniciar sesión';
      }
      loading = false;
    }
  }
</script>

<main class="min-h-screen flex bg-gradient-to-b from-white to-amber-50">
  <!-- Sección izquierda: Imagen decorativa -->
  <!-- Sección izquierda: Imagen decorativa con contenido centrado -->
<section class="hidden md:flex w-1/2 flex-col items-center justify-center bg-cover bg-center p-8 overflow-y-auto" style="background-image: url('/src/images/fondo\ registro.png');">
  
  <!-- Título principal -->
  <section class="text-center max-w-3xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-extrabold text-emerald-700">Come mejor. Vive mejor.</h1>
    <p class="mt-4 text-lg text-gray-700">
      Planifica comidas, descubre recetas balanceadas y sigue tu progreso nutricional de forma simple y práctica.
    </p>
  </section>

  <!-- Características destacadas -->
  <section id="features" class="mt-16 grid gap-8 md:grid-cols-3 w-full max-w-4xl px-4">
    <article class="p-6 bg-white bg-opacity-90 rounded-lg shadow text-center">
      <h3 class="text-xl font-semibold text-emerald-700">Planes personalizados</h3>
      <p class="mt-2 text-gray-600 text-sm">Crea planes de alimentación adaptados a tus metas y preferencias.</p>
    </article>

    <article class="p-6 bg-white bg-opacity-90 rounded-lg shadow text-center">
      <h3 class="text-xl font-semibold text-emerald-700">Recetas saludables</h3>
      <p class="mt-2 text-gray-600 text-sm">Busca recetas sencillas, con información nutricional y pasos claros.</p>
    </article>

    <article class="p-6 bg-white bg-opacity-90 rounded-lg shadow text-center">
      <h3 class="text-xl font-semibold text-emerald-700">Seguimiento</h3>
      <p class="mt-2 text-gray-600 text-sm">Registra comidas y observa tu progreso con gráficos y métricas.</p>
    </article>
  </section>
</section>


  <!-- Sección derecha: Formulario de inicio de sesión -->
  <section class="w-full md:w-1/2 flex flex-col items-center justify-center p-8 relative">
    
    <!-- Encabezado con nombre y logo alineados a la derecha, más arriba -->
    <div class="absolute top-6 right-6 flex items-center">
      <h2 class="text-2xl font-bold text-emerald-700 mr-3">NutriApp</h2>
      <img src="/src/images/Logo_App.png" alt="Logo NutriApp" class="w-16 h-22" />
    </div>

    <!-- Card del formulario -->
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8 mt-20">
      <h1 class="text-2xl font-bold text-emerald-700 mb-2">Iniciar sesión</h1>
      <p class="text-sm text-gray-600 mb-6">Ingresa tu correo y contraseña para continuar.</p>

      {#if error}
        <div class="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>
      {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Correo</label>
        <input
          id="email"
          bind:this={emailInput}
          type="email"
          bind:value={email}
          placeholder="tu@correo.com"
          class="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          required
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          class="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          required
        />
      </div>

      <div class="flex items-center justify-between">
        <label for="remember" class="flex items-center text-sm gap-2 text-gray-600">
          <input id="remember" type="checkbox" class="rounded text-emerald-600" />
          <span>Recordarme</span>
        </label>
        <button type="button" class="text-sm text-emerald-600 hover:underline bg-transparent border-none p-0 m-0">Olvidé mi contraseña</button>
      </div>

      <div>
        <button
          type="submit"
          class="w-full inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          aria-busy={loading}
          >
          {#if loading}
            <span class="mr-2">Cargando…</span>
          {/if}
          Iniciar sesión
        </button>
      </div>
    </form>

   <p class="mt-6 text-center text-sm text-gray-600">
        ¿No tienes cuenta? <a href="/registro/crear" class="text-emerald-600 hover:underline">Regístrate</a>
      </p>
    </div>
  </section>
</main>

<style>
  /* Ajustes menores por si Tailwind no está activo */
  input[required] { box-sizing: border-box; }
</style>
