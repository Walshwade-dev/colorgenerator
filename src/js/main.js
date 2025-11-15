import {
    normalizeHex,
    blendWithWhite,
    copyToClipboard,
    flashCopied,
    savePalettesToStorage,
    loadPalettesFromStorage
} from "./utils.js";


// Elements
const colorPicker = document.getElementById("color-picker");
const getSchemeBtn = document.getElementById("get-scheme-btn");
const swatchWraps = document.querySelectorAll(".swatch-wrap");
const savedPalettesContainer = document.getElementById("saved-palettes");


const darkToggle = document.getElementById("dark-toggle");




let savedPalettes = loadPalettesFromStorage();


darkToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    darkToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});


const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark");
    darkToggle.textContent = "☀️";
}



// generate 5 tints from a base color
function generateLocalPalette(baseHex) {
    const palette = [];
    for (let i = 0; i < 5; i++) {
        const amt = i / 4 * 0.7; // blend up to 70%
        palette.push(blendWithWhite(baseHex, amt));
    }
    return palette;
}



function savePalette(palette) {
    savedPalettes.unshift(palette);   // add to top
    savePalettesToStorage(savedPalettes);
    renderSavedPalettes();
}



function renderPalette(palette) {
    swatchWraps.forEach((wrap, i) => {
        const box = wrap.querySelector(".swatch");
        const label = wrap.querySelector(".hex");

        box.style.backgroundColor = palette[i];
        label.textContent = palette[i];
    });

    // activate click-to-copy behavior
    enableCopy();
}


function renderSavedPalettes() {
    savedPalettesContainer.innerHTML = "";

    savedPalettes.forEach((palette, index) => {
        const card = createPaletteCard(palette, index);
        savedPalettesContainer.appendChild(card);

        // Fade in animation
        requestAnimationFrame(() => {
            card.classList.remove("opacity-0", "scale-95");
        });
    });
}



function createPaletteCard(palette, index) {
    const card = document.createElement("div");
    card.className =
        "w-full p-3 bg-gray-200 dark:bg-gray-900 shadow-md cursor-pointer " +
        "hover:shadow-lg transition rounded-md ring-1 ring-black/10 dark:ring-white/10 " +
        "opacity-0 scale-95 relative group";

    const header = createPaletteHeader(index, card);
    const row = createPaletteRow(palette); // <-- swatches

    // Load + copy full palette
    card.addEventListener("click", async () => {
        renderPalette(palette);

        const ok = await copyToClipboard(palette.join(", "));
        if (ok) {
            card.classList.add("ring-2", "ring-blue-400");
            setTimeout(() => card.classList.remove("ring-2", "ring-blue-400"), 500);
        }
    });

    // ORDER MATTERS
    card.appendChild(header);
    card.appendChild(row);

    return card;
}


function createPaletteHeader(index, card) {
    const header = document.createElement("div");
    header.className = "flex justify-between items-center mb-2";

    const title = document.createElement("span");
    title.className = "text-xs text-gray-500 dark:text-gray-400 font-medium";
    title.textContent = "Palette";

    const trash = document.createElement("i");
    trash.className =
        "fa-solid fa-trash text-red-500 hover:text-red-600 cursor-pointer " +
        "opacity-0 group-hover:opacity-100 transition";

    trash.addEventListener("click", (e) => {
        e.stopPropagation();

        card.classList.add("opacity-0", "scale-95");

        setTimeout(() => {
            savedPalettes.splice(index, 1);
            savePalettesToStorage(savedPalettes);
            renderSavedPalettes();
        }, 200);
    });

    header.appendChild(title);
    header.appendChild(trash);
    return header;
}


function createPaletteRow(palette) {
    const row = document.createElement("div");
    row.className = "grid grid-cols-5 gap-2";

    palette.forEach((hex) => {
        const item = document.createElement("div");
        item.className = "flex flex-col items-center gap-1";

        const sw = document.createElement("div");
        sw.className =
            "h-10 w-full shadow ring-1 ring-black/10 dark:ring-white/10";
        sw.style.backgroundColor = hex;

        const label = document.createElement("p");
        label.className =
            "text-xs font-mono text-gray-700 dark:text-gray-300 text-center";
        label.textContent = hex;

        // Copy single hex
        label.addEventListener("click", async (e) => {
            e.stopPropagation();
            const ok = await copyToClipboard(hex);
            if (ok) flashCopied(label, hex);
        });

        item.appendChild(sw);
        item.appendChild(label);
        row.appendChild(item);
    });

    return row;
}







getSchemeBtn.addEventListener("click", () => {
    const base = normalizeHex(colorPicker.value);
    const palette = generateLocalPalette(base);
    renderPalette(palette);
    savePalette(palette);
});


function enableCopy() {
    swatchWraps.forEach((wrap) => {
        const label = wrap.querySelector(".hex");

        label.addEventListener("click", async () => {
            const hex = label.textContent.trim();
            const ok = await copyToClipboard(hex);

            if (ok) flashCopied(label, hex);
        });
    });
}

renderSavedPalettes();


// Accordion elements
const savedHeader = document.getElementById("saved-header");
const savedPanel = document.getElementById("saved-panel");
const savedChevron = savedHeader.querySelector("i");

savedHeader.addEventListener("click", () => {
    const isOpen = savedPanel.classList.contains("open");

    if (isOpen) {
        savedPanel.classList.remove("open");
        savedPanel.style.maxHeight = "0px";
        savedChevron.style.transform = "rotate(0deg)";
    } else {
        const scrollHeight = savedPanel.scrollHeight;
        savedPanel.classList.add("open");
        savedPanel.style.maxHeight = scrollHeight + "px";
        savedChevron.style.transform = "rotate(180deg)";
    }
});



