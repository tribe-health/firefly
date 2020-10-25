import { writable } from 'svelte/store'

export const isCreatingAccount = writable(false);

export const wallet = writable({
    accounts: []
})
