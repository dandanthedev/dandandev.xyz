import io from 'socket.io-client';

const SOUNDS_URL = 'https://sounds.daanschenkel.nl';

const socket = io(SOUNDS_URL); //todo: env var

let list = [];

socket.on('list', function (data) {
    list = data;
});

socket.on('play', function (data) {
    if (typeof window === 'undefined') return;

    const url = SOUNDS_URL + '/' + data + '.wav';

    const audio = new Audio(url);
    audio.play();
});

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