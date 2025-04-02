export function playSound(sound) {
    const audio = new Audio(`./${sound}`);
    audio.play();
}
