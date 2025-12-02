<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let patientId: string;
  let patientName = '';

  let meals = [
    { id: 1, name: 'Desayuno', items: [] },
    { id: 2, name: 'Comida', items: [] },
    { id: 3, name: 'Cena', items: [] }
  ];

  let openSection: number | null = null;

  // Campos del formulario
  let selectedGroup = "";
  let selectedFood = "";
  let quantity = "";
  let unit = "";

  // NUEVO CAMPO
  let nuevaComida = "";

  const alimentos = {
    Cereales: ["Avena", "Arroz", "Tortilla", "Pan integral"],
    Frutas: ["Manzana", "Banana", "Fresas", "Uvas"],
    Verduras: ["Zanahoria", "Espinaca", "Brócoli", "Pepino"],
    Lácteos: ["Leche", "Yogur", "Queso"],
    Proteínas: ["Pollo", "Atún", "Huevo", "Carne magra"],
    Grasas: ["Aguacate", "Nueces", "Aceite de oliva"]
  };

  const unidades = ["g", "ml", "pieza(s)", "taza(s)", "cucharada(s)"];

  onMount(() => {
    patientId = $page.params.id;

    const query = new URLSearchParams($page.url.search);
    patientName = query.get('name') ?? `Paciente ${patientId}`;
  });

  function toggleSection(id: number) {
    openSection = openSection === id ? null : id;
  }

  // NUEVA FUNCIÓN PARA CREAR BOTÓN DE COMIDA
  function agregarComida() {
    if (!nuevaComida.trim()) {
      alert("Ingrese un nombre válido.");
      return;
    }

    const nuevoId = meals.length + 1;

    meals = [
      ...meals,
      { id: nuevoId, name: nuevaComida, items: [] }
    ];

    nuevaComida = ""; // limpiar
  }

  function agregarAlimento(mealId: number) {
    if (!selectedGroup || !selectedFood || !quantity || !unit) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const meal = meals.find(m => m.id === mealId);
    if (meal) {
      meal.items.push({
        group: selectedGroup,
        food: selectedFood,
        quantity,
        unit
      });
    }

    selectedGroup = "";
    selectedFood = "";
    quantity = "";
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

                <div>
                  <label class="text-xs font-semibold text-gray-600">Grupo</label>
                  <select
                    class="w-full mt-1 border rounded p-1.5 text-xs"
                    bind:value={selectedGroup}
                  >
                    <option value="">Seleccione</option>
                    {#each Object.keys(alimentos) as g}
                      <option value={g}>{g}</option>
                    {/each}
                  </select>
                </div>

                <div>
                  <label class="text-xs font-semibold text-gray-600">Alimento</label>
                  <select
                    class="w-full mt-1 border rounded p-1.5 text-xs"
                    bind:value={selectedFood}
                    disabled={!selectedGroup}
                  >
                    <option value="">Seleccione</option>
                    {#if selectedGroup}
                      {#each alimentos[selectedGroup] as food}
                        <option value={food}>{food}</option>
                      {/each}
                    {/if}
                  </select>
                </div>

                <div>
                  <label class="text-xs font-semibold text-gray-600">Cantidad</label>
                  <input
                    class="w-full mt-1 border rounded p-1.5 text-xs"
                    placeholder="Ej. 100"
                    bind:value={quantity}
                  />
                </div>

                <div>
                  <label class="text-xs font-semibold text-gray-600">Unidad</label>
                  <select
                    class="w-full mt-1 border rounded p-1.5 text-xs"
                    bind:value={unit}
                  >
                    <option value="">Seleccione</option>
                    {#each unidades as u}
                      <option value={u}>{u}</option>
                    {/each}
                  </select>
                </div>

                <div class="flex items-end md:col-span-1">
                  <button
                    class="w-full px-3 py-1.5 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700"
                    on:click={() => agregarAlimento(meal.id)}
                  >
                    Agregar
                  </button>
                </div>
              </div>

              <!-- Tabla -->
              {#if meal.items.length > 0}
                <div class="mt-6 overflow-hidden rounded-xl shadow-sm border border-gray-200">
                  <table class="w-full text-xs">
                    <thead>
                      <tr class="bg-emerald-600 text-white text-left">
                        <th class="p-3">Nombre de Alimento</th>
                        <th class="p-3">Cantidad</th>
                        <th class="p-3">Unidad de medida</th>
                        <th class="p-3">Grupo Alimenticio</th>
                      </tr>
                    </thead>

                    <tbody>
                      {#each meal.items as item}
                        <tr class="bg-white border-t hover:bg-emerald-50 transition">
                          <td class="p-3">{item.food}</td>
                          <td class="p-3">{item.quantity}</td>
                          <td class="p-3">{item.unit}</td>
                          <td class="p-3">{item.group}</td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}

            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</main>
