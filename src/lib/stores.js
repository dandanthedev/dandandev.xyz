import { writable } from 'svelte/store';

export const preloadedAssets = writable({
    loading: true
});