<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  type Meal = { id: number; name: string; description: string; calories: number };

  let patientId: string;
  let patientName = '';
  let meals: Meal[] = [];
  let newMeal: Omit<Meal, 'id'> = { name: '', description: '', calories: 0 };
  let editingMeal: Meal | null = null;

  onMount(() => {
    // Obtener el ID del paciente desde la URL
    patientId = $page.params.id;

    // Obtener el nombre desde la query (por ejemplo: ?name=María González)
    const query = new URLSearchParams($page.url.search);
    patientName = query.get('name') ?? `Paciente ${patientId}`;

    // Simular obtener comidas del paciente
    meals = [
      { id: 1, name: 'Desayuno', description: 'Avena con fruta y leche', calories: 350 },
      { id: 2, name: 'Comida', description: 'Pollo a la plancha con arroz y ensalada', calories: 600 },
      { id: 3, name: 'Cena', description: 'Atún con tostadas y verduras', calories: 400 }
    ];
  });

  function addMeal() {
    if (!newMeal.name || !newMeal.description) return;
    const id = Math.max(0, ...meals.map(m => m.id)) + 1;
    meals = [...meals, { id, ...newMeal }];
    newMeal = { name: '', description: '', calories: 0 };
  }

  function deleteMeal(id: number) {
    meals = meals.filter(m => m.id !== id);
  }

  function startEdit(meal: Meal) {
    editingMeal = { ...meal };
  }

  function saveEdit() {
    if (!editingMeal) return;
    meals = meals.map(m => (m.id === editingMeal!.id ? editingMeal! : m));
    editingMeal = null;
  }

  function cancelEdit() {
    editingMeal = null;
  }

  function goBack() {
    goto('/nutriologo');
  }
</script>

<main class="min-h-screen bg-gray-50 py-10">
  <div class="container mx-auto px-6 max-w-3xl">
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

    <div class="bg-white rounded-xl shadow p-6 mb-8">
      <h3 class="text-lg font-semibold text-emerald-700 mb-4">Agregar comida</h3>
      <div class="grid gap-3 md:grid-cols-3">
        <input
          class="border rounded p-2 text-sm"
          placeholder="Nombre (ej. Desayuno)"
          bind:value={newMeal.name}
        />
        <input
          class="border rounded p-2 text-sm"
          placeholder="Descripción"
          bind:value={newMeal.description}
        />
        <input
          type="number"
          class="border rounded p-2 text-sm"
          placeholder="Calorías"
          bind:value={newMeal.calories}
        />
      </div>
      <button
        on:click={addMeal}
        class="mt-3 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
      >
        Agregar
      </button>
    </div>

    <div class="space-y-4">
      {#each meals as meal (meal.id)}
        <div
          class="bg-white p-5 rounded-xl shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          {#if editingMeal && editingMeal.id === meal.id}
            <div class="flex-1 grid gap-2 md:grid-cols-3">
              <input
                class="border rounded p-2 text-sm"
                bind:value={editingMeal.name}
              />
              <input
                class="border rounded p-2 text-sm"
                bind:value={editingMeal.description}
              />
              <input
                type="number"
                class="border rounded p-2 text-sm"
                bind:value={editingMeal.calories}
              />
            </div>
            <div class="flex gap-2">
              <button
                on:click={saveEdit}
                class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 text-sm"
              >
                Guardar
              </button>
              <button
                on:click={cancelEdit}
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
              >
                Cancelar
              </button>
            </div>
          {:else}
            <div>
              <h4 class="font-semibold text-emerald-700">{meal.name}</h4>
              <p class="text-sm text-gray-700">{meal.description}</p>
              <p class="text-xs text-gray-500">Calorías: {meal.calories}</p>
            </div>
            <div class="flex gap-2">
              <button
                on:click={() => startEdit(meal)}
                class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"
              >
                Editar
              </button>
              <button
                on:click={() => deleteMeal(meal.id)}
                class="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
              >
                Eliminar
              </button>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</main>
