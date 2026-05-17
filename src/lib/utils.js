import Text from '$lib/Text.svelte';
import Explorer from '$lib/Explorer.svelte';
import Choices from '$lib/Choices.svelte';
import ChoicesResults from '$lib/ChoicesResults.svelte';
import Credits from '$lib/Credits.svelte';

export function getScreenSize() {
    // Prefer the actual viewport size (prevents positioning issues
    // when the background element size differs). Fallback to the
    // backgroundImage element if `window` is not available.
    let screenW = typeof window !== 'undefined' ? window.innerWidth : 0;
    let screenH = typeof window !== 'undefined' ? window.innerHeight : 0;

    if ((!screenW || !screenH) && typeof document !== 'undefined') {
        const el = document.querySelector('.backgroundImage');
        if (el) {
            screenW = el.clientWidth;
            screenH = el.clientHeight;
        }
    }

    return {
        screenW,
        screenH
    };
}

export const availableComponents = {
    Text: Text,
    Explorer: Explorer,
    Choices: Choices,
    ChoicesResults: ChoicesResults,
    Credits: Credits
};