<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async () => {
		return {
			redirect: 'items',
			status: 302
		};
	};
</script>
