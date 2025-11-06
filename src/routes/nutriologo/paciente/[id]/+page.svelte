<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Chart from 'chart.js/auto';

  let patientId: number;
  let patient: any = null;
  let loading = true;
  let weightChart: Chart;
  let imcChart: Chart;

  onMount(async () => {
    patientId = Number($page.params.id);

    // Simular fetch de datos del paciente
    await new Promise((r) => setTimeout(r, 300));

    const patients = [
      { 
        id: 1, 
        name: 'María González', 
        age: 34,
        visits: [
          { date: '2025-08-01', weight: 70, imc: 26.2 },
          { date: '2025-09-01', weight: 68.5, imc: 25.7 },
          { date: '2025-10-20', weight: 67.8, imc: 25.4 }
        ]
      },
      { 
        id: 2, 
        name: 'Carlos Pérez', 
        age: 46,
        visits: [
          { date: '2025-07-01', weight: 88, imc: 28.5 },
          { date: '2025-08-10', weight: 86.5, imc: 27.9 },
          { date: '2025-09-15', weight: 85.9, imc: 27.7 }
        ]
      },
      { 
        id: 3, 
        name: 'Ana López', 
        age: 29,
        visits: [
          { date: '2025-09-01', weight: 59, imc: 22.1 },
          { date: '2025-10-01', weight: 58.7, imc: 21.9 },
          { date: '2025-11-01', weight: 58.3, imc: 21.8 }
        ]
      }
    ];

    patient = patients.find(p => p.id === patientId);
    if (!patient) {
      goto('/nutriologo');
      return;
    }

    loading = false;

    // Esperar a que el DOM se actualice antes de dibujar
    await tick();
    drawCharts();
  });

  function drawCharts() {
    const weightCtx = document.getElementById('chart-weight') as HTMLCanvasElement;
    const imcCtx = document.getElementById('chart-imc') as HTMLCanvasElement;

    if (!weightCtx || !imcCtx) return;

    // Destruir gráficas previas si existían
    if (weightChart) weightChart.destroy();
    if (imcChart) imcChart.destroy();

    // Peso
    weightChart = new Chart(weightCtx, {
      type: 'line',
      data: {
        labels: patient.visits.map(v => v.date),
        datasets: [{
          label: 'Peso (kg)',
          data: patient.visits.map(v => v.weight),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: { 
          title: { display: true, text: 'Evolución del Peso', color: '#065f46' },
          legend: { display: false }
        },
        scales: {
          x: { title: { display: true, text: 'Fecha' } },
          y: { title: { display: true, text: 'Peso (kg)' } }
        }
      }
    });

    // IMC
    imcChart = new Chart(imcCtx, {
      type: 'line',
      data: {
        labels: patient.visits.map(v => v.date),
        datasets: [{
          label: 'IMC',
          data: patient.visits.map(v => v.imc),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: { 
          title: { display: true, text: 'Evolución del IMC', color: '#1e3a8a' },
          legend: { display: false }
        },
        scales: {
          x: { title: { display: true, text: 'Fecha' } },
          y: { title: { display: true, text: 'IMC' } }
        }
      }
    });
  }
</script>

<main class="min-h-screen bg-gray-50 py-10">
  <div class="container mx-auto px-6">
    {#if loading}
      <p>Cargando datos del paciente...</p>
    {:else}
      <button
        on:click={() => goto('/nutriologo')}
        class="text-emerald-700 hover:underline mb-4 flex items-center gap-1"
      >
        ← Volver
      </button>

      <h2 class="text-2xl font-bold text-emerald-700 mb-2">{patient.name}</h2>
      <p class="text-gray-600 mb-6">Edad: {patient.age} años</p>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white p-5 rounded-xl shadow">
          <canvas id="chart-weight" height="280"></canvas>
        </div>

        <div class="bg-white p-5 rounded-xl shadow">
          <canvas id="chart-imc" height="280"></canvas>
        </div>
      </div>
    {/if}
  </div>
</main>
