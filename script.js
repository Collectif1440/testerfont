// ============================================
// LISTE DES TYPOS : le seul endroit à modifier pour les polices.
//
// nom     : le texte affiché dans la boîte cliquable
// fichier : le chemin du fichier de police (.woff2, .woff, .otf ou .ttf)
//
// L'ordre de cette liste = l'ordre des boîtes dans la grille (5 par rangée).
// Si un fichier est introuvable, sa boîte reste grisée et non cliquable.
// ============================================
const POLICES = [
    { nom: "Typo 01", fichier: "fonts/01.woff2" },
    { nom: "Typo 02", fichier: "fonts/02.woff2" },
    { nom: "Typo 03", fichier: "fonts/03.woff2" },
    { nom: "Typo 04", fichier: "fonts/04.woff2" },
    { nom: "Typo 05", fichier: "fonts/05.woff2" },
    { nom: "Typo 06", fichier: "fonts/06.woff2" },
    { nom: "Typo 07", fichier: "fonts/07.woff2" },
    { nom: "Typo 08", fichier: "fonts/08.woff2" },
    { nom: "Typo 09", fichier: "fonts/09.woff2" },
    { nom: "Typo 10", fichier: "fonts/10.woff2" },
    { nom: "Typo 11", fichier: "fonts/11.woff2" },
    { nom: "Typo 12", fichier: "fonts/12.woff2" },
    { nom: "Typo 13", fichier: "fonts/13.woff" },
    { nom: "Typo 14", fichier: "fonts/14.woff" },
    { nom: "Typo 15", fichier: "fonts/15.woff" },
    { nom: "Typo 16", fichier: "fonts/16.woff" },
    { nom: "Typo 17", fichier: "fonts/17.woff" },
    { nom: "Typo 18", fichier: "fonts/18.woff" },
    { nom: "Typo 19", fichier: "fonts/19.woff" },
    { nom: "Typo 20", fichier: "fonts/20.woff" },
    { nom: "Typo 21", fichier: "fonts/21.woff" },
    { nom: "Typo 22", fichier: "fonts/22.woff" },
    { nom: "Typo 23", fichier: "fonts/23.woff" },
    { nom: "Typo 24", fichier: "fonts/24.woff" },
    { nom: "Typo 25", fichier: "fonts/25.woff" },
    { nom: "Typo 26", fichier: "fonts/26.woff" },
    { nom: "Typo 27", fichier: "fonts/27.woff" }
];

document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("main");
    const grille = document.getElementById("grille-polices");
    const zoneTexte = document.getElementById("zone-texte");
    const placeholderTexte = document.getElementById("placeholder-texte");
    const rangeeDuHaut = document.querySelector(".rangee-du-haut");
    const espaceReserve = document.querySelector(".espace-reserve");
    const jaugeTaille = document.getElementById("jauge-taille");
    const jaugeEspacement = document.getElementById("jauge-espacement");
    const jaugeHauteur = document.getElementById("jauge-hauteur");

    // Boîtes cliquables : une par typo. Chaque typo est chargée au
    // démarrage pour que le changement soit instantané au clic.
    const boutons = [];

    function choisirPolice(index) {
        zoneTexte.style.fontFamily = `"Typo-${index + 1}", sans-serif`;
        boutons.forEach((bouton, i) => {
            bouton.classList.toggle("actif", i === index);
        });
    }

    POLICES.forEach((police, index) => {
        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.textContent = police.nom;
        bouton.title = police.nom;

        // Garde le curseur dans le texte quand on clique sur une boîte
        bouton.addEventListener("mousedown", (evenement) => evenement.preventDefault());
        bouton.addEventListener("click", () => choisirPolice(index));

        grille.appendChild(bouton);
        boutons.push(bouton);

        const fonte = new FontFace(`Typo-${index + 1}`, `url("${police.fichier}")`);
        fonte.load()
            .then(() => document.fonts.add(fonte))
            .catch(() => bouton.classList.add("indisponible"));
    });

    // Typo choisie au départ : la première de la liste
    choisirPolice(0);

    // Jauges: taille de police, espacement des lettres, hauteur de ligne.
    // Chaque jauge applique directement son style à #zone-texte.
    jaugeTaille.addEventListener("input", () => {
        zoneTexte.style.fontSize = `${jaugeTaille.value}pt`;
    });

    jaugeEspacement.addEventListener("input", () => {
        zoneTexte.style.letterSpacing = `${jaugeEspacement.value / 100}em`;
    });

    jaugeHauteur.addEventListener("input", () => {
        zoneTexte.style.lineHeight = jaugeHauteur.value / 100;
    });

    // Double-clic sur une jauge: retour à sa valeur de base.
    [jaugeTaille, jaugeEspacement, jaugeHauteur].forEach((jauge) => {
        jauge.addEventListener("dblclick", () => {
            jauge.value = jauge.dataset.valeurBase;
            jauge.dispatchEvent(new Event("input"));
        });
    });

    // La barre (boîtes + jauges) est en flux normal par défaut : elle
    // défile avec la page et sort de l'écran, pour ne jamais obstruer
    // un long texte. Elle ne devient immobile (fixe à l'écran) que
    // pendant qu'on utilise activement la jauge "Taille de police".
    function verrouillerBarre() {
        const rect = rangeeDuHaut.getBoundingClientRect();
        espaceReserve.style.height = `${rect.height}px`;
        rangeeDuHaut.style.top = `${rect.top}px`;
        rangeeDuHaut.classList.add("verrouillee");
    }

    function deverrouillerBarre() {
        rangeeDuHaut.classList.remove("verrouillee");
        rangeeDuHaut.style.top = "";
        espaceReserve.style.height = "0";
    }

    jaugeTaille.addEventListener("mousedown", verrouillerBarre);
    jaugeTaille.addEventListener("touchstart", verrouillerBarre, { passive: true });
    jaugeTaille.addEventListener("keydown", verrouillerBarre);

    document.addEventListener("mouseup", deverrouillerBarre);
    document.addEventListener("touchend", deverrouillerBarre);
    document.addEventListener("keyup", () => {
        if (document.activeElement === jaugeTaille) deverrouillerBarre();
    });

    // Centrage vertical du contenu (barre + zone de texte) dans la fenêtre.
    // Le calcul se fait au chargement et au redimensionnement seulement,
    // jamais quand le texte grossit : la barre reste donc immobile et le
    // texte grossit uniquement vers le bas.
    function centrerContenu() {
        main.style.paddingTop = "0px";
        main.style.minHeight = "0px";
        const hauteurContenu = main.scrollHeight;
        main.style.minHeight = "100vh";
        const espaceDisponible = window.innerHeight - hauteurContenu;
        main.style.paddingTop = `${Math.max(0, espaceDisponible / 2)}px`;
    }

    centrerContenu();
    window.addEventListener("resize", centrerContenu);

    // La photo change la hauteur du contenu une fois chargée : on recentre.
    window.addEventListener("load", centrerContenu);

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(centrerContenu);
    }

    // Affiche le message gris seulement quand la zone est vide ET qu'elle
    // n'est pas en focus (donc pas pendant que l'utilisateur écrit).
    function mettreAJourPlaceholder() {
        const estVide = zoneTexte.textContent.trim() === "";
        const estFocus = document.activeElement === zoneTexte;
        placeholderTexte.style.display = (estVide && !estFocus) ? "block" : "none";
    }

    zoneTexte.addEventListener("focus", mettreAJourPlaceholder);
    zoneTexte.addEventListener("blur", mettreAJourPlaceholder);

    zoneTexte.addEventListener("input", () => {
        if (zoneTexte.textContent.trim() === "") {
            zoneTexte.innerHTML = "";
        }
        mettreAJourPlaceholder();
    });

    mettreAJourPlaceholder();
});