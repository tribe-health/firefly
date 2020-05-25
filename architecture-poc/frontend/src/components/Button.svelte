<script>
  import bindEvents from '../util/bind-events'
  export let events = {}
</script>

<button use:bindEvents={events}>
  <slot></slot>
</button>
