<main class="min-h-screen bg-gradient-to-b from-white to-amber-50 py-16">
	<div class="container mx-auto px-6">
		<header class="flex items-center justify-between mb-10">
			<h2 class="text-xl font-semibold text-emerald-700">NutriApp</h2>
			<nav class="hidden md:flex gap-6 text-sm text-emerald-600">
				<a href="#features" class="hover:underline">Características</a>
				<a href="#como-funciona" class="hover:underline">Cómo funciona</a>
				<a href="#contacto" class="hover:underline">Contacto</a>
			</nav>
		</header>

		<section class="text-center max-w-3xl mx-auto">
			<h1 class="text-4xl md:text-5xl font-extrabold text-emerald-700">Come mejor. Vive mejor.</h1>
			<p class="mt-4 text-lg text-gray-700">Planifica comidas, descubre recetas balanceadas y sigue tu progreso nutricional de forma simple y práctica.</p>

		</section>

		<section id="features" class="mt-16 grid gap-8 md:grid-cols-3">
			<article class="p-6 bg-white rounded-lg shadow">
				<h3 class="text-xl font-semibold text-emerald-700">Planes personalizados</h3>
				<p class="mt-2 text-gray-600 text-sm">Crea planes de alimentación adaptados a tus metas y preferencias.</p>
			</article>

			<article class="p-6 bg-white rounded-lg shadow">
				<h3 class="text-xl font-semibold text-emerald-700">Recetas saludables</h3>
				<p class="mt-2 text-gray-600 text-sm">Busca recetas sencillas, con información nutricional y pasos claros.</p>
			</article>

			<article class="p-6 bg-white rounded-lg shadow">
				<h3 class="text-xl font-semibold text-emerald-700">Seguimiento</h3>
				<p class="mt-2 text-gray-600 text-sm">Registra comidas y observa tu progreso con gráficos y métricas.</p>
			</article>
		</section>

		<section id="como-funciona" class="mt-16 bg-emerald-50 p-8 rounded-lg">
			<h3 class="text-2xl font-bold text-emerald-700">Cómo funciona</h3>
			<ol class="mt-4 space-y-3 text-gray-700 list-decimal list-inside">
				<li>Regístrate y define tus objetivos.</li>
				<li>Elige o personaliza tu plan de comidas.</li>
				<li>Consulta recetas y registra tus comidas día a día.</li>
			</ol>
		</section>

		<footer id="contacto" class="mt-16 text-center text-sm text-gray-600">
			<p>¿Tienes dudas? <a href="mailto:info@nutriapp.example" class="text-emerald-600 hover:underline">Contáctanos</a></p>
			<p class="mt-2">© {new Date().getFullYear()} NutriApp</p>
		</footer>
	</div>
</main>

<style>
	/* Pequeño ajuste: si no tienes Tailwind cargado, aplica estilos base */
	@media (max-width: 767px) {
		main { padding-left: 1rem; padding-right: 1rem; }
	}
</style>
