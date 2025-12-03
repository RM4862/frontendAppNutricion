<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let patientId: string;
  let patientName = '';

  // Cada comida tiene su propio formulario interno
  let meals = [
    { id: 1, name: 'Desayuno', items: [], form: { group: "", food: "", quantity: "", unit: "" } },
    { id: 2, name: 'Comida', items: [], form: { group: "", food: "", quantity: "", unit: "" } },
    { id: 3, name: 'Cena', items: [], form: { group: "", food: "", quantity: "", unit: "" } }
  ];

  let openSection: number | null = null;

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

  function agregarComida() {
    if (!nuevaComida.trim()) {
      alert("Ingrese un nombre válido.");
      return;
    }

    const nuevoId = meals.length + 1;

    meals = [
      ...meals,
      { id: nuevoId, name: nuevaComida, items: [], form: { group: "", food: "", quantity: "", unit: "" } }
    ];

    nuevaComida = "";
  }

  function agregarAlimento(mealId: number) {
    const meal = meals.find(m => m.id === mealId);
    if (!meal) return;

    const f = meal.form;

    if (!f.group || !f.food || !f.quantity || !f.unit) {
      alert("Por favor completa todos los campos.");
      return;
    }

    meal.items.push({
      group: f.group,
      food: f.food,
      quantity: f.quantity,
      unit: f.unit
    });

    meal.form = { group: "", food: "", quantity: "", unit: "" };
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
                    bind:value={meal.form.group}
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
                    bind:value={meal.form.food}
                    disabled={!meal.form.group}
                  >
                    <option value="">Seleccione</option>
                    {#if meal.form.group}
                      {#each alimentos[meal.form.group] as food}
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
                    bind:value={meal.form.quantity}
                  />
                </div>

                <div>
                  <label class="text-xs font-semibold text-gray-600">Unidad</label>
                  <select
                    class="w-full mt-1 border rounded p-1.5 text-xs"
                    bind:value={meal.form.unit}
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
            </div>
          {/if}

        </div>
      {/each}
    </div>

    <!-- TABLA FINAL (DEBAJO DE TODOS LOS BOTONES) -->
    <h3 class="text-xl font-semibold text-emerald-700 mt-10 mb-3">Resumen de alimentos</h3>

    <div class="space-y-8">
      {#each meals as meal}
        {#if meal.items.length > 0}
          <div class="border rounded-xl overflow-hidden shadow-sm">

            <h4 class="bg-emerald-600 text-white p-3 font-semibold text-sm">
              {meal.name}
            </h4>

            <table class="w-full text-xs">
              <thead>
                <tr class="bg-emerald-100 text-gray-700">
                  <th class="p-3 text-center">Alimento</th>
                  <th class="p-3 text-center">Cantidad</th>
                  <th class="p-3 text-center">Unidad</th>
                  <th class="p-3 text-center">Grupo</th>
                </tr>
              </thead>

              <tbody>
                {#each meal.items as item}
                  <tr class="border-t hover:bg-gray-50">
                    <td class="p-3 text-center">{item.food}</td>
                    <td class="p-3 text-center">{item.quantity}</td>
                    <td class="p-3 text-center">{item.unit}</td>
                    <td class="p-3 text-center">{item.group}</td>
                  </tr>
                {/each}
              </tbody>
            </table>


          </div>
        {/if}
      {/each}
    </div>

  </div>
</main>
