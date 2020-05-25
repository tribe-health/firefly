<script>
  import bindEvents from '../util/bind-events'
  export let events = {}
</script>


<span use:bindEvents={events}>
  <slot></slot>
</span>
