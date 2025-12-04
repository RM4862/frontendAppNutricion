<script lang="ts">
  import BackButton from '$lib/BackButton.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, userRole, logout } from '$lib/stores/auth';
  import { get } from 'svelte/store';

  let currentUser: any;
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

  onMount(async () => {
    currentUser = get(user);

    const query = new URLSearchParams($page.url.search);


    // Validaciones
    if (!get(isAuthenticated)) {
      goto('/registro');
      return;
    }

    if (get(userRole) !== 'PACIENTE') {
      goto('/');
      return;
    }
    try {
      const req = await fetch(`http://127.0.0.1:8000/food/patient`, {
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
  });
  
    
</script>

<main class="min-h-screen bg-gray-50 py-10">
  <div class="container mx-auto px-6 max-w-screen-lg">
    <div class="mb-4"><BackButton fallback="/calendario" /></div>

    <h1 class="text-3xl font-bold text-emerald-700 mb-6">Régimen propuesto</h1>

    <!-- Visualización del Régimen Propuesto -->
     <div class="bg-white rounded-lg shadow-md p-6 mb-6">
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
