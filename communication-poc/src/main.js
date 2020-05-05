import { TextDecoder } from 'text-encoding';
if (!window['TextDecoder']) {
  window['TextDecoder'] = TextDecoder;
}

import App from './App.svelte';

const app = new App({
	target: document.body
});

export default app;