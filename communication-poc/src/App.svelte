<script>
	import { simpleCommand, asyncCommand } from './backend'
	import { on } from './event-system'
	export let promise;

	on('commandCall', message => {
		console.log('got command call event', message)
	})
	
	simpleCommand('string arg', 17)
	promise = asyncCommand('arg')

	setTimeout(() => {
		promise = asyncCommand('')
	}, 2000)
</script>

<main>
	{#await promise}
		<h1>...waiting</h1>
	{:then _}
		<h1>Promise resolved</h1>
	{:catch error}
		<h1 style="color: red">Promise rejected: {error}</h1>
	{/await}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>