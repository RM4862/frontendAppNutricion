<script lang="ts">
	export let title = 'NutriApp';
</script>

<header class="py-4">
	<div class="container mx-auto px-6 flex items-center justify-between">
		<h1 class="text-lg font-semibold text-emerald-700">{title}</h1>
		<nav class="hidden md:flex gap-4 text-sm text-emerald-600">
			<a href="/" class="hover:underline">Inicio</a>
			<a href="/registro" class="hover:underline">Iniciar sesión</a>
		</nav>
	</div>
</header>
