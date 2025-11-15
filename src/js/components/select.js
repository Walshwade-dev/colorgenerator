// components/select.js

export function initCustomSelect() {
    const wrapper = document.getElementById("mode-select");
    const toggle = document.getElementById("select-toggle");
    const label = document.getElementById("select-label");
    const options = document.getElementById("select-options");

    if (!wrapper || !toggle || !label || !options) return;

    let isOpen = false;

    //function clear check marks
    function clearCheckMarks() {
        options.querySelectorAll("li").forEach((opt) => {
            opt.querySelector(".check-icon")?.remove();
        });
    }

    function addCheckTo(optionEl) {
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-check text-green-500 check-icon";
        icon.style.opacity = "1";
        icon.classList.add("ml-auto");
        optionEl.appendChild(icon);
    }

    // Open / Close dropdown
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        options.classList.toggle("hidden", !isOpen);

        // Rotate icon
        toggle.querySelector("i").classList.toggle("rotate-180");
    });

    // Handle choice
    options.querySelectorAll("li").forEach((opt) => {
        opt.addEventListener("click", () => {
            const value = opt.dataset.value;
            const text = opt.textContent;

            // Update UI
            label.textContent = text;
            wrapper.dataset.value = value;

            //update checkmarks
            clearCheckMarks();
            addCheckTo(opt);

            // Close menu
            isOpen = false;
            options.classList.add("hidden");
            toggle.querySelector("i").classList.remove("rotate-180");
        });
    });

    // Click outside = close
    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) {
            isOpen = false;
            options.classList.add("hidden");
            toggle.querySelector("i").classList.remove("rotate-180");
        }
    });
}
