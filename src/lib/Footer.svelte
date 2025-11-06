<script lang="ts">
	export let small = false;
</script>

<footer class="mt-12 border-t pt-6 text-center text-sm text-gray-600">
	<div class="container mx-auto px-6">
		<p>© {new Date().getFullYear()} NutriApp — Hecho con ❤️</p>
		{#if !small}
			<p class="mt-2"><a href="mailto:info@nutriapp.example" class="text-emerald-600 hover:underline">Contacto</a></p>
		{/if}
	</div>
</footer>
