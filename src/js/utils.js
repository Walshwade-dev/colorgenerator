export function normalizeHex(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    return "#" + hex.toUpperCase();
}

export function hexToRgb(hex) {
    hex = normalizeHex(hex).replace("#", "");
    return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
    };
}

export function blendWithWhite(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    const blend = (c) => Math.round(c + (255 - c) * amount);
    return (
        "#" +
        blend(r).toString(16).padStart(2, "0") +
        blend(g).toString(16).padStart(2, "0") +
        blend(b).toString(16).padStart(2, "0")
    ).toUpperCase();
}


// copy text to clipboard
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error("Copy failed", err);
        return false;
    }
}

// temporary "Copied!" feedback
export function flashCopied(labelEl, oldText) {
    labelEl.textContent = "Copied!";
    labelEl.style.opacity = "0.6";

    setTimeout(() => {
        labelEl.textContent = oldText;
        labelEl.style.opacity = "1";
    }, 800);
}


export function savePalettesToStorage(palettes) {
    localStorage.setItem("saved-palettes", JSON.stringify(palettes));
}

export function loadPalettesFromStorage() {
    return JSON.parse(localStorage.getItem("saved-palettes")) || [];
}
