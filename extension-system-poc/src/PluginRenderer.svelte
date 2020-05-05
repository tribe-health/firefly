<script>
  import Plugin from './plugin'
  export let pluginName

	const plugin = new Plugin(pluginName)

	let model = plugin.model

	/**
	 * formats a content, replacing {{ someProperty }} with plugin.model.someProperty
	 * @param {object} item the item to update the content
	 * @param {object} model is an argument just so Svelte reactivity works here
	 */
	function formatContent (item, model) {
		return item.content && item.content.replace(/{{ (\S+) }}/g, (found, field) => model[field])
	}
</script>

<main>
	{#each plugin.layout as item}
	<svelte:component this={item.component} {...item.props} events={item.events}>
		{ formatContent(item, $model) }
	</svelte:component>
	{/each}
</main>
