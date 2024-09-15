import io from 'socket.io-client';

const SOUNDS_URL = 'https://sounds.dandandev.xyz';

export let socket;

let list = [];

let _toastWrapper;

export function setToastWrapper(toastWrapper) {
    _toastWrapper = toastWrapper;
}

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

    socket.on('danny', function (data) {
        _toastWrapper(`Message from Danny: ${data}`, 'success', {
            duration: 6000
        });
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