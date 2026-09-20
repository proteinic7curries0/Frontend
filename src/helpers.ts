export function randomColor(): string {
    const h = Math.floor(Math.random() * 360);
    const s = 65 + Math.floor(Math.random() * 45); // 65–100%
    const l = 35 + Math.floor(Math.random() * 10); // 35–65%

    return `hsl(${h} ${s}% ${l}%)`;
}