import Text from '$lib/Text.svelte';
import Explorer from '$lib/Explorer.svelte';
import SendMessage from '$lib/SendMessage.svelte';
import Choices from '$lib/Choices.svelte';
import ChoicesResults from '$lib/ChoicesResults.svelte';

export function getScreenSize() {
    //find with and height of element with class backgroundImage 
    const screenW = document.querySelector('.backgroundImage').clientWidth;
    const screenH = document.querySelector('.backgroundImage').clientHeight;
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