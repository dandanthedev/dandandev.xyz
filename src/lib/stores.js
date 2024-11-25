import { writable } from 'svelte/store';

export const preloadedAssets = writable({
    loading: true
});

let inittedLocals = false;
export function didInitLocals() {
    inittedLocals = true;
}



export const biosSettings = writable({
    trolls: {
        type: "boolean",
        displayName: "Enable Trolls on bootup",
        value: true
    },
    debug: {
        type: "boolean",
        displayName: "Enable debug mode",
        value: false
    },
    music: {
        type: "boolean",
        displayName: "Enable music",
        value: false
    },
    sound: {
        type: "boolean",
        displayName: "Enable sound effects",
        value: true
    },
    soundserver: {
        type: "boolean",
        displayName: "Enable sound server",
        value: true
    }
});

biosSettings.subscribe(value => {
    if (!inittedLocals) return;
    for (const key in value) {
        localStorage.setItem(`biosSettings.${key}`, JSON.stringify(value[key].value));
    }
});