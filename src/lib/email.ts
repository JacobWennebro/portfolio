const r = (s: string) => [...s].reverse().join("");
const v = "t92Yu8mciVmbuV2dAJ2bjFma";

// Draw the text to a canvas and use it as a mask, so it never exists as DOM text
// and still follows the element's color through bg-current.
async function paint(label: HTMLElement) {
    const font = "400 14px Inter, sans-serif";
    await document.fonts.load(font);

    const text = atob(r(v));
    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = font;
    const width = Math.ceil(ctx.measureText(text).width);
    const height = 20;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.font = font;
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, height / 2);

    const mask = `url(${canvas.toDataURL()}) no-repeat 0 0 / 100% 100%`;
    label.style.width = `${width}px`;
    label.style.height = `${height}px`;
    label.style.mask = mask;
    label.style.webkitMask = mask;
}

document.querySelectorAll<HTMLElement>(".c-label").forEach(paint);

document.addEventListener("click", (e) => {
    if (!(e.target as Element).closest?.(".c-link")) return;
    e.preventDefault();
    window.location.href = r(":otliam") + atob(r(v));
});
