<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, userRole, logout } from '$lib/stores/auth';
  import { get } from 'svelte/store';

  let patientId: string | undefined;
  let currentUser: any;
  let patientName = '';

  type aliment = {
    name: string;
    amount:number;
    unit: string;
  };

  type meal = {
    id:number;
    name: string;
    description?:string;
    aliments: aliment[]; 
  };

  let meals: meal[] = [];

  type ingredient = {
    id:number;
    name:string;
    amount:number;
    unit:string;
  }

  type group = {
    id: number;
    name: string;
    ingredients:ingredient[];
  }

  let groups: group[] = [];

  let openSection: number | null = null;

  // Campos del formulario
  let selectedGroup = "";
  let selectedFood = "";
  let quantity = 0;
  let unit = "";

  // NUEVO CAMPO
  let nuevaComida = "";

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

      for (const p of patient_event) {
        try {
          const req_part = await fetch(
            `http://127.0.0.1:8000/food/menu?food_id=${p.id}`,
            {
              headers: { Authorization: `Bearer ${currentUser.token}` }
            }
          );

          const res_part = await req_part.json();
          const patient_part = res_part.data ?? [];

          const current_aliment: aliment[] =
            patient_part.length > 0
              ? patient_part.map((pp) => ({
                  name: pp.aliment,
                  amount: pp.amount,
                  unit: pp.unit
          })): [];

          meals = [
            ...meals,
            {
              id: p.id,
              name: p.food_name,
              aliments: current_aliment
            }
          ];
        } catch (e) {
          console.log('Error al fetch patient menu part: ', e);
        }
      }
      console.log(meals);
    } catch (e) {
      console.log('Error al fetch patient food: ', e);
    }

    try {
      const req_group = await fetch('http://127.0.0.1:8000/equivalent/group', {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });

      const res_group = await req_group.json();
      const current_groups = res_group.data;

      for (const g of current_groups){
        try{
          const req_equivalent = await fetch(`http://127.0.0.1:8000/equivalent/aliment?group_id=${g.id}`,{
            method:'GET',
            headers: { Authorization: `Bearer ${currentUser.token}` }
          });

          const res_equivalent = await req_equivalent.json();
          const equivalents = res_equivalent.data;

          const current_equivalent :ingredient[] = equivalents.map((e)=>({
            id: e.id,
            name: e.aliment_name,
            amount: e.amount,
            unit: e.unit
          }));

          groups = [
            ...groups,
            {
              id: g.id, 
              name: g.group_name,
              ingredients: current_equivalent
            }
          ];
        }catch(e){
          console.log('Algo salio mal con los alimentos equivalentes ', e);
        }
      }
      console.log('gRUPOS:', groups);
    } catch (e) {
      console.log('Error al fetch group food: ', e);
    }
  });


  function toggleSection(id: number) {
    openSection = openSection === id ? null : id;
  }

  // NUEVA FUNCIÓN PARA CREAR BOTÓN DE COMIDA
  async function agregarComida () {
    if (!nuevaComida.trim()) {
      alert("Ingrese un nombre válido.");
      return;
    }

    try{
      const req_add_event = await fetch('http://127.0.0.1:8000/food/nutriologist',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          patient_id: patientId,
          food_name: nuevaComida,
          description: nuevaComida
        })
      });
      const res_add_event = await req_add_event.json();
      meals = [
        ...meals,
        {
          id: res_add_event.id,
          name: res_add_event.food_name,
          aliments: []
        }
      ]
    }catch(e){
      console.log('Error al fetch insert food event: ', e);
    }
    nuevaComida = ""; // limpiar
  }

  async function agregarAlimento(mealId: number) {
    if (!selectedGroup || !selectedFood || !quantity || !unit) {
      alert("Por favor completa todos los campos.");
      return;
    }
    console.log(`Id ${mealId},Nombre ${selectedGroup}, Nombre ALimento ${selectedFood}, unidad  ${unit}, cantidad ${quantity}`);

    try{
      const req_add_part = await fetch('http://127.0.0.1:8000/food/menu/nutriologist',{
        method:'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          food_event_id: mealId,
          group_name: selectedGroup,
          aliment: selectedFood,
          description: selectedFood,
          amount: quantity,
          unit: unit
        })
      });
      const res_add_part = await req_add_part.json();
      const new_meal = res_add_part.data;
      meals = meals.map(m =>
        m.id === mealId
          ? {
              ...m,
              aliments: [
                ...m.aliments,
                {
                  name: new_meal.aliment,
                  amount: new_meal.amount,
                  unit: new_meal.unit
                }
              ]
            }
          : m
      );
      console.log(meals);

    }catch(e){
      console.log('Algo salio mal al momento de incertar datos: ',e);
    }
    selectedGroup = "";
    selectedFood = "";
    quantity = 0;
    unit = "";
  }

  function goBack() {
    goto('/nutriologo');
  }
</script>

<main class="min-h-screen bg-gray-50 py-10">
  <div class="container mx-auto px-6 max-w-3xl">

    <!-- Encabezado -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-emerald-700">
        Dieta de {patientName}
      </h2>
      <button
        on:click={goBack}
        class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
      >
        ← Regresar
      </button>
    </div>

    <!-- NUEVO FORMULARIO PARA AGREGAR COMIDA -->
    <div class="bg-white p-4 rounded-xl shadow mb-6">
      <h3 class="font-semibold text-emerald-700 mb-2">Agregar comida</h3>

      <div class="flex gap-3">
        <input
          class="flex-1 border rounded p-2 text-sm"
          placeholder="Ej. Snack, Almuerzo 2, Refrigerio..."
          bind:value={nuevaComida}
        />
        <button
          class="px-4 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
          on:click={agregarComida}
        >
          Agregar
        </button>
      </div>
    </div>

    <!-- Secciones dinámicas -->
    <div class="space-y-4">
      {#each meals as meal}
        <div class="bg-white rounded-xl shadow">

          <!-- Botón principal -->
          <button
            class="w-full text-left p-4 font-semibold text-emerald-700 hover:bg-emerald-50 rounded-xl"
            on:click={() => toggleSection(meal.id)}
          >
            {meal.name}
          </button>

          {#if openSection === meal.id}
            <div class="p-4 border-t">

              <!-- Formulario interno -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">

                <!-- Grupo -->
                <div>
                  <label class="text-xs font-semibold text-gray-600">Grupo</label>
                  <select
                    class="w-full mt-1 border rounded p-1.5 text-xs"
                    bind:value={selectedGroup}
                  >
                    <option value="">Seleccione</option>

                    {#each groups as g}
                      <option value={g.name}>{g.name}</option>
                    {/each}

                  </select>
                </div>

                <!-- Alimento -->
                <div>
                  <label class="text-xs font-semibold text-gray-600">Alimento</label>
                  <select
                    class="w-full mt-1 border rounded p-1.5 text-xs"
                    bind:value={selectedFood}
                    disabled={!selectedGroup}
                    on:change={() => console.log('selectedGroup =', selectedGroup)}
                  >
                    <option value="">Seleccione</option>

                    {#if selectedGroup}
                      {#each groups.find(g => g.name == selectedGroup)?.ingredients ?? [] as food}
                        <option value={food.name}>{food.name}</option>
                      {/each}
                    {/if}

                  </select>
                </div>
                <!-- Unidad -->
                <div>
                  <label class="text-xs font-semibold text-gray-600">Unidad</label>
                  <select
                    class="w-full mt-1 border rounded p-1.5 text-xs"
                    bind:value={unit}
                    on:change={() => console.log('selectedGroup =', selectedFood)}
                  >
                    <option value="">Seleccione</option>

                    {#if selectedFood}
                      {#each [
                        groups
                          .find(g => g.name == selectedGroup)
                          ?.ingredients
                          .find(i => i.name == selectedFood)
                          ?.unit
                      ] as u}
                        <option value={u}>{u}</option>
                      {/each}
                    {/if}

                  </select>
                </div>

                <!-- Cantidad -->
                <div>
                  <label class="text-xs font-semibold text-gray-600">Cantidad</label>
                  <input
                    class="w-full mt-1 border rounded p-1.5 text-xs"
                    placeholder="Ej. 100"
                    bind:value={quantity}
                  />
                </div>

                <!-- Botón Agregar -->
                <div class="flex items-end md:col-span-1">
                  <button
                    class="w-full px-3 py-1.5 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700"
                    on:click={() => agregarAlimento(meal.id)}
                  >
                    Agregar
                  </button>
                </div>

              </div>
            </div>
          {/if}

        </div>
      {/each}

      {#if meals}
        <div class="mb-6">
          <h3 class="font-bold text-3xl">Dieta actual</h3>
          {#each meals as meal}
              <h4 class="font-semibold text-emerald-600 mb-3">{meal.name}</h4>
              {#if meal.aliments.length > 0}
                <div class="space-y-2">
                  {#each meal.aliments as a}
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                      <div class="md:col-span-5">
                        <span class="text-xs text-gray-600 block mb-1">Alimento</span>
                        <span class="font-medium text-gray-800">{a.name}</span>
                      </div>

                      <div class="md:col-span-3">
                        <span class="text-xs text-gray-600 block mb-1">Cantidad</span>
                        <span class="font-medium text-gray-800">{a.amount}</span>
                      </div>

                      <div class="md:col-span-4">
                        <span class="text-xs text-gray-600 block mb-1">Unidad</span>
                        <span class="font-medium text-gray-800">{a.unit}</span>
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

    </div>
</main>
