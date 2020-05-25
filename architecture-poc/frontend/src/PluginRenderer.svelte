<script>
  import Plugin from './plugin'
	export let pluginName
	export let pluginJson

	let plugin, model, error
	try {
		plugin = new Plugin(pluginName, pluginJson)
		model = plugin.model
	} catch (e) {
		error = e
	}

	plugin.__runHook('created')

	/**
	 * formats a content, replacing {{ someProperty }} with plugin.model.someProperty
	 * @param {object} item the item to update the content
	 * @param {object} model is an argument just so Svelte reactivity works here
	 */
	function formatContent (item, model) {
		return item.content && item.content.replace(/{{ (\S+) }}/g, (found, field) => {
			const value = model[field]
			return typeof value === 'object' ? JSON.stringify(value) : value
		})
	}
</script>

<main>
	{#if error}
		<span style="color: red">{ error }</span>
	{:else}
		{#each plugin.layout as item}
		<svelte:component this={item.component} {...item.props} events={item.events}>
			{ formatContent(item, $model) }
		</svelte:component>
		{/each}
	{/if}
</main>
