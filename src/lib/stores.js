import { writable } from 'svelte/store';

export const preloadedAssets = writable({
    loading: true
});

let inittedLocals = false;
export function didInitLocals() {
    inittedLocals = true;
}

export const trolls = [
    '11',
    "update"
];


export const biosSettings = writable({
    trolls: {
        type: "boolean",
        displayName: "Enable Trolls on bootup",
        value: true
    },
    forceTroll: {
        type: "select",
        displayName: "Always trigger this troll",
        value: null,
        options: trolls.map(t => ({ value: t, displayName: t })).concat({ value: null, displayName: "None" })
    },
    trollChance: {
        type: "select",
        displayName: "Troll chance",
        value: 0.1,
        options: [
            { value: 0.1, displayName: "10%" },
            { value: 0.2, displayName: "20%" },
            { value: 0.3, displayName: "30%" },
            { value: 0.4, displayName: "40%" },
            { value: 0.5, displayName: "50%" },
            { value: 0.6, displayName: "60%" },
            { value: 0.7, displayName: "70%" },
            { value: 0.8, displayName: "80%" },
            { value: 0.9, displayName: "90%" },
            { value: 1, displayName: "100%" }
        ]
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
});

biosSettings.subscribe(value => {
    if (!inittedLocals) return;
    for (const key in value) {
        localStorage.setItem(`biosSettings.${key}`, JSON.stringify(value[key].value));
    }
});