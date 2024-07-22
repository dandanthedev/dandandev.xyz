import Text from '$lib/Text.svelte';
import Explorer from '$lib/Explorer.svelte';
import SendMessage from '$lib/SendMessage.svelte';
import Choices from '$lib/Choices.svelte';
import ChoicesResults from '$lib/ChoicesResults.svelte';

export function getScreenSize() {
    const screenW =
        window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const screenH =
        window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return {
        screenW,
        screenH
    };
}

export const availableComponents = {
    Text: Text,
    Explorer: Explorer,
    SendMessage: SendMessage,
    Choices: Choices,
    ChoicesResults: ChoicesResults
};