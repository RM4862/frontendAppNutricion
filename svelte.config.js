import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createRequire } from 'module';

// Use createRequire to allow a graceful fallback in editors that can't
// resolve `@sveltejs/adapter-auto` (avoids spurious "module not found"
// errors while still using the adapter at runtime when installed).
const require = createRequire(import.meta.url);
let adapter;
try {
	// prefer the default adapter when available
	adapter = require('@sveltejs/adapter-auto').default;
} catch (err) {
	// fallback noop adapter for editor/static analysis environments
	adapter = () => ({ name: 'noop-adapter', adapt: () => {} });
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
