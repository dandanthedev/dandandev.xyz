import io from 'socket.io-client';

const SOUNDS_URL = 'https://sounds.daanschenkel.nl';

export let socket;

let list = [];


export function initSocket() {
    socket = io(SOUNDS_URL);

    socket.on('list', function (data) {
        list = data;
    });

    socket.on('play', function (data) {
        if (typeof window === 'undefined') return;

        const url = SOUNDS_URL + '/' + data + '.wav';

        const audio = new Audio(url);
        audio.play();
    });

    return new Promise((resolve) => {
        socket.on('connect', function () {
            resolve();
        });
    });
}

export async function getList() {
    //wait for list to be populated
    while (list.length == 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return list;
}

export function play(id) {
    socket.emit('play', id);
}
export function sendMessage(message) {
    socket.emit('msg', message);
}