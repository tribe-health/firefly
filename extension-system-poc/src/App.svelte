<script>
	import { onMount } from 'svelte'
	import PluginRenderer from './PluginRenderer.svelte'
	import corePlugin from './plugins/core.json'

	let corePlugins = [{
		id: '@iota/core',
		json: corePlugin
	}]
	let externalPlugins = []

	onMount(() => {
		try {
			externalPlugins = window.loadPlugins()
		} catch (e) {
		}

		(['sample', 'invalid-component', 'unset-component']).forEach(id => {
			window.installPlugin(id)
				.then(json => {
					if (!externalPlugins.some(p => p.id === id)) {
						externalPlugins = [...externalPlugins, {
							id,
							json
						}]
					}
				})
		})
	})

	$: plugins = [...corePlugins, ...externalPlugins]
</script>

<main>
	{#each plugins as plugin}
	<div style="margin-top: 24px">
		<span>{plugin.id}</span>
		<PluginRenderer pluginName={plugin.id} pluginJson={plugin.json}/>
	</div>
	{/each}
</main>
