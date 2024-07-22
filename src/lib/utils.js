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