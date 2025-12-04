<script lang="ts">
  import BackButton from '$lib/BackButton.svelte';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, userRole } from '$lib/stores/auth';

  let selectedGroup = "";
  let selectedFood = "";
  let quantity: number = 0;
  let unit = "";
  let date = new Date().toISOString().split("T")[0];
  let description = "";
  let mealId = 0;

  // Modal
  let showModal = false;
  let modalMessage = "";
  let modalSuccess = false;

  type ingredient = { id: number; name: string; amount: number; unit: string };
  type group = { id: number; name: string; ingredients: ingredient[] };
  type meal = { id: number; name: string };

  let groups: group[] = [];
  let meals: meal[] = [];
  let currentUser: any;

  // -------------------------
  // ON MOUNT
  // -------------------------
  onMount(async () => {
    currentUser = get(user);

    if (!get(isAuthenticated)) {
      goto('/registro');
      return;
    }

    if (get(userRole) !== 'PACIENTE') {
      goto('/');
      return;
    }

    // Obtener datos
    try {
      const req_event = await fetch('http://127.0.0.1:8000/food/patient', {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });

      const res_event = await req_event.json();
      const event = res_event.data;
      console.log(event);
      event.forEach(e => {
        meals = [...meals,{ id: e.id, name: e.food_name }];
      });

      console.log(meals);
    } catch (e) {
      console.log("Error eventos alimenticios:", e);
    }

    try {
      const req_group = await fetch('http://127.0.0.1:8000/equivalent/group', {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });

      const res_group = await req_group.json();

      for (const g of res_group.data) {
        try {
          const req_equivalent = await fetch(
            `http://127.0.0.1:8000/equivalent/aliment?group_id=${g.id}`,
            { headers: { Authorization: `Bearer ${currentUser.token}` } }
          );

          const res_equivalent = await req_equivalent.json();

          groups = [
            ...groups,
            {
              id: g.id,
              name: g.group_name,
              ingredients: res_equivalent.data.map((e) => ({
                id: e.id,
                name: e.aliment_name,
                amount: e.amount,
                unit: e.unit
              }))
            }
          ];
        } catch (e) {
          console.log("Error alimentos equivalentes:", e);
        }
      }
    } catch (e) {
      console.log("Error groups:", e);
    }
  });

  // -------------------------
  // AGREGAR REGISTRO
  // -------------------------
  async function addResgister() {
    if (!selectedGroup || !selectedFood || !quantity || !unit) {
      showModal = true;
      modalSuccess = false;
      modalMessage = "Por favor completa todos los campos.";
      return;
    }

    try {
      const req = await fetch('http://127.0.0.1:8000/food/menu/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          date,
          food_event_id: mealId,
          group_name: selectedGroup,
          aliment: selectedFood,
          description,
          amount: quantity,
          unit
        })
      });

      const status = req.status;

      if (status === 201) {
        modalSuccess = true;
        modalMessage = "Registro guardado exitosamente.";
      } else {
        modalSuccess = false;
        modalMessage = "Hubo un error al guardar el registro.";
      }

      showModal = true;

    } catch (e) {
      modalSuccess = false;
      modalMessage = "Error de conexión al servidor.";
      showModal = true;
      console.log(e);
    }

    // Limpiar formulario
    selectedGroup = "";
    selectedFood = "";
    quantity = 0;
    unit = "";
    mealId = 0;
    description = "";
  }

  function closeModal() {
    showModal = false;
  }
</script>

<!-- ========================= -->
<!--        MODAL              -->
<!-- ========================= -->
{#if showModal}
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow w-80 text-center">
      <h2 class="text-lg font-semibold mb-4 {modalSuccess ? 'text-green-600' : 'text-red-600'}">
        {modalSuccess ? 'Éxito' : 'Error'}
      </h2>

      <p class="mb-4">{modalMessage}</p>

      <button
        on:click={closeModal}
        class="mt-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
      >
        Cerrar
      </button>
    </div>
  </div>
{/if}

<!-- ========================= -->
<!--      FORMULARIO           -->
<!-- ========================= -->

<main class="min-h-screen bg-gray-50 py-10">
  <div class="container mx-auto px-6 max-w-screen-md">
    <div class="mb-4"><BackButton fallback="/calendario" /></div>

    <h1 class="text-3xl font-bold text-emerald-700 mb-6">Registro de consumo</h1>

    <form on:submit|preventDefault={addResgister} class="bg-white p-6 rounded shadow space-y-4">

      <!-- Fecha -->
      <div>
        <label class="block text-sm text-gray-700 mb-1">Fecha</label>
        <input type="date" class="w-full border rounded px-3 py-2" bind:value={date}/>
      </div>

      <!-- Comida -->
      <div>
        <label class="block text-sm text-gray-700 mb-1">Comida</label>
        <select class="w-full border rounded px-3 py-2" bind:value={mealId}>
          <option value="">Seleccione</option>

          {#each meals as g}
            <option value={g.id}>{g.name}</option>
          {/each}

        </select>
      </div>

      <!-- Descripción -->
      <div>
        <label class="block text-sm text-gray-700 mb-1">Descripción</label>
        <textarea class="w-full border rounded px-3 py-2" rows="3" bind:value={description}></textarea>
      </div>

      <!-- Grupo, alimento, unidad, cantidad -->
      <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-4">

        <!-- Grupo -->
        <div>
          <label class="text-sm block">Grupo</label>
          <select class="w-full border rounded px-2 py-2" bind:value={selectedGroup}>
            <option value="" disabled selected>Seleccione</option>
            {#each groups as g}
              <option value={g.name}>{g.name}</option>
            {/each}
          </select>
        </div>

        <!-- Alimento -->
        <div>
          <label class="text-sm block">Alimento</label>
          <select class="w-full border rounded px-2 py-2" bind:value={selectedFood} disabled={!selectedGroup}>
            <option value="">Seleccione</option>

            {#if selectedGroup}
              {#each groups.find(g => g.name === selectedGroup)?.ingredients ?? [] as food}
                <option value={food.name}>{food.name}</option>
              {/each}
            {/if}
          </select>
        </div>

        <!-- Unidad -->
        <div>
          <label class="text-sm block">Unidad</label>
          <select class="w-full border rounded px-2 py-2" bind:value={unit}>
            <option value="">Seleccione</option>

            {#if selectedFood}
              <option>
                {groups
                  .find(g => g.name === selectedGroup)
                  ?.ingredients
                  .find(i => i.name === selectedFood)
                  ?.unit}
              </option>
            {/if}
          </select>
        </div>

        <!-- Cantidad -->
        <div>
          <label class="text-sm block">Cantidad</label>
          <input type="number" class="w-full border rounded px-2 py-2" bind:value={quantity}/>
        </div>
      </div>

      <button type="submit" class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
        Guardar
      </button>

    </form>
  </div>
</main>
