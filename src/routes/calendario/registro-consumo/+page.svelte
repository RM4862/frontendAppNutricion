<script lang="ts">
  import BackButton from '$lib/BackButton.svelte';
  export let data: { message?: string };
</script>

<main class="min-h-screen bg-gray-50 py-10">
  <div class="container mx-auto px-6 max-w-screen-md">
    <div class="mb-4"><BackButton fallback="/calendario" /></div>

    <h1 class="text-3xl font-bold text-emerald-700 mb-6">Registro de consumo</h1>

    {#if data.message}
      <div class="mb-4 rounded bg-emerald-50 text-emerald-700 px-4 py-2">{data.message}</div>
    {/if}

    <form method="POST" class="bg-white p-6 rounded shadow space-y-4">
      <div>
        <label class="block text-sm text-gray-700 mb-1">Fecha</label>
        <input name="date" type="date" class="w-full border rounded px-3 py-2" required />
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Comida</label>
        <select name="meal" class="w-full border rounded px-3 py-2" required>
          <option>Desayuno</option>
          <option>Comida</option>
          <option>Cena</option>
          <option>Snack</option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Descripción</label>
        <textarea name="desc" class="w-full border rounded px-3 py-2" rows="3" required></textarea>
      </div>

      <div class="grid sm:grid-cols-3 gap-4">
        <div><label class="block text-sm mb-1">Kcal</label><input name="kcal" type="number" class="w-full border rounded px-3 py-2" required /></div>
        <div><label class="block text-sm mb-1">Proteína (g)</label><input name="prot" type="number" class="w-full border rounded px-3 py-2" required /></div>
        <div><label class="block text-sm mb-1">Carbohidratos (g)</label><input name="carb" type="number" class="w-full border rounded px-3 py-2" required /></div>
      </div>

      <button class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Guardar</button>
    </form>
  </div>
</main>
