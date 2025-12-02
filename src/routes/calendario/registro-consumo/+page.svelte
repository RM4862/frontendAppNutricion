<script lang="ts">
  import BackButton from '$lib/BackButton.svelte';
  export let data: { message?: string };

  let selectedGroup = "";
  let selectedFood = "";
  let quantity = "";
  let unit = "";

  const alimentos = {
    Cereales: ["Avena", "Arroz", "Tortilla", "Pan integral"],
    Frutas: ["Manzana", "Banana", "Fresas", "Uvas"],
    Verduras: ["Zanahoria", "Espinaca", "Brócoli", "Pepino"],
    Lácteos: ["Leche", "Yogur", "Queso"],
    Proteínas: ["Pollo", "Atún", "Huevo", "Carne magra"],
    Grasas: ["Aguacate", "Nueces", "Aceite de oliva"]
  };

  const unidades = ["g", "ml", "pieza(s)", "taza(s)", "cucharada(s)"];
</script>

<main class="min-h-screen bg-gray-50 py-10">
  <div class="container mx-auto px-6 max-w-screen-md">
    <div class="mb-4"><BackButton fallback="/calendario" /></div>

    <h1 class="text-3xl font-bold text-emerald-700 mb-6">Registro de consumo</h1>

    {#if data.message}
      <div class="mb-4 rounded bg-emerald-50 text-emerald-700 px-4 py-2">
        {data.message}
      </div>
    {/if}

    <form method="POST" class="bg-white p-6 rounded shadow space-y-4">
      
      <!-- Fecha -->
      <div>
        <label class="block text-sm text-gray-700 mb-1">Fecha</label>
        <input name="date" type="date" class="w-full border rounded px-3 py-2" required />
      </div>

      <!-- Comida -->
      <div>
        <label class="block text-sm text-gray-700 mb-1">Comida</label>
        <select name="meal" class="w-full border rounded px-3 py-2" required>
          <option>Desayuno</option>
          <option>Comida</option>
          <option>Cena</option>
          <option>Snack</option>
        </select>
      </div>

      <!-- Descripción -->
      <div>
        <label class="block text-sm text-gray-700 mb-1">Descripción</label>
        <textarea name="desc" class="w-full border rounded px-3 py-2" rows="3" required></textarea>
      </div>

      <!-- NUEVA SECCIÓN: Grupo, alimento, cantidad, unidad -->
      <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-4">

        <!-- Grupo alimenticio -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">Grupo</label>
          <select
            name="group"
            class="w-full border rounded px-3 py-2 text-sm"
            bind:value={selectedGroup}
            required
          >
            <option value="">Seleccione</option>
            {#each Object.keys(alimentos) as g}
              <option value={g}>{g}</option>
            {/each}
          </select>
        </div>

        <!-- Alimento -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">Alimento</label>
          <select
            name="food"
            class="w-full border rounded px-3 py-2 text-sm"
            bind:value={selectedFood}
            required
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

        <!-- Cantidad -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">Cantidad</label>
          <input
            name="quantity"
            class="w-full border rounded px-3 py-2 text-sm"
            placeholder="Ej. 100"
            bind:value={quantity}
            required
          />
        </div>

        <!-- Unidad -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">Unidad</label>
          <select
            name="unit"
            class="w-full border rounded px-3 py-2 text-sm"
            bind:value={unit}
            required
          >
            <option value="">Seleccione</option>
            {#each unidades as u}
              <option value={u}>{u}</option>
            {/each}
          </select>
        </div>

      </div>

      <button class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
        Guardar
      </button>
    </form>
  </div>
</main>
