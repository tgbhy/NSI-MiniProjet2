const baseDestroySrc = "assets/imgs/FirstSee/destroy_stage_{Stage}.png";
const maxStage = 10;
var currentStage = -1;
var mouseDown = false;
var interval = null;

document.addEventListener('mousedown', () => { mouseDown = true; });
document.addEventListener('mouseup', () => {
    mouseDown = false;
    clearInterval(interval);
    interval = null;
});


let divBlock = document.getElementsByClassName("start")[0]; // ? Récupération de la div
let divContent = document.getElementsByClassName("content")[0];

let image = divBlock.getElementsByTagName("img").item(1);
image.addEventListener('mousedown', mineGrassBlock);

function mineGrassBlock() {
    upgradeStage();
    if (interval !== null) return;

    function upgradeStage() {
        console.log("Upgrade !");
        currentStage++;

        if (currentStage >= maxStage) {
            clearInterval(interval);
            image.removeEventListener('mousedown', mineGrassBlock);
            explodeImage();
            return;
        }

        image.src = baseDestroySrc.replace('{Stage}', currentStage.toString());
    }

    interval = setInterval(() => {
        if (!mouseDown) {
            clearInterval(interval);
            interval = null;
            return;
        }

        upgradeStage();
    }, 500); // ? Attendre 500ms entre chaque étape
}

function explodeImage() {
    document.body.style.overflow = "hidden"; // ? Cacher la barre de scroll
    const startDiv = document.querySelector('.start'); // ? Récupérer la div principal étant pour l'animation
    const images = startDiv.querySelectorAll('img'); // ? Récupération des images disponibles dans la div principal
    const fragments = 128; // ? Nombre de fragments pour l'explosion
    
    // ? Obtenir les dimensions et la position des images
    const rect = images[0].getBoundingClientRect(); // ! Les deux images ont la même taille, pas besoin de calcul pour chaque image
    
    // ? Créer un conteneur pour les fragments
    const container = document.createElement('div');
    container.className = 'explosion-container';
    container.style.position = 'absolute';
    container.style.width = `${rect.width}px`;
    container.style.height = `${rect.height}px`;
    container.style.top = `${rect.top}px`;
    container.style.left = `${rect.left}px`;
    container.style.pointerEvents = 'none'; // ? Désactiver les interactions avec le conteneur
    container.style.zIndex = '15';
    
    // ? Créer les fragments
    for (let i = 0; i < fragments; i++) {
        const fragment = document.createElement('div'); // ? Création du fragement
        // ? Définir le fragment à 1/10 de la taille de l'image initiale
        fragment.style.width = `${rect.width / 10}px`;
        fragment.style.height = `${rect.height / 10}px`;
        fragment.style.position = 'absolute'; // ? Evite que HTML/CSS viennent bousculer les éléments
        fragment.style.left = `${(i % 10) * (rect.width / 10)}px`; // ? Position horizontale en grille
        fragment.style.top = `${Math.floor(i / 10) * (rect.height / 10)}px`; // ? Position verticale en grille
        fragment.style.imageRendering = 'pixelated'; // ? Définition de l'image, permet d'avoir une résolution net
        
        // ? Créer deux divs pour chaque image (superposition des fragments)
        // * Etapes
            // * 1 => Définition du "background" de l'image : Image du fragment
            // * 2 => Définition de la taille pour récupérer uniquement un fragment de l'image
            // * 3 => Définition de la position du background à récupérer
            // * 4 => Définition de la hauteur/largeur à 100% pour récupérer le fragment entier
            // * 5 => Définition d'une position "absolute" pour faire abstraction des autres éléments lors du positionnement
        const img1Fragment = document.createElement('div');
        img1Fragment.style.backgroundImage = `url(${images[0].src})`;
        img1Fragment.style.backgroundSize = `${rect.width}px ${rect.height}px`;
        img1Fragment.style.backgroundPosition = `-${fragment.style.left} -${fragment.style.top}`;
        img1Fragment.style.width = '100%';
        img1Fragment.style.height = '100%';
        img1Fragment.style.position = 'absolute';
        
        // * Voir au dessus pour l'explication...
        const img2Fragment = document.createElement('div');
        img2Fragment.style.backgroundImage = `url(${images[1].src})`;
        img2Fragment.style.backgroundSize = `${rect.width}px ${rect.height}px`;
        img2Fragment.style.backgroundPosition = `-${fragment.style.left} -${fragment.style.top}`;
        img2Fragment.style.width = '100%';
        img2Fragment.style.height = '100%';
        img2Fragment.style.position = 'absolute';
        
        // * Ajout des deux fragments d'image pour les superposés
        fragment.appendChild(img1Fragment);
        fragment.appendChild(img2Fragment);
        
        // * Ajouter le fragment généré au conteneur principal
        container.appendChild(fragment);
    }
    
    // * Ajouter le conteneur au body
    document.body.appendChild(container);
    
    // * Cacher les images originales pour laisser place aux fragments
    images.forEach(img => (img.style.visibility = 'hidden'));
    
    // ? Animation de l'explosion
    container.childNodes.forEach(fragment => {
        const angle = Math.random() * Math.PI * 2; // ? Calcul d'un angle en radian pseudo-aléatoire
        const distance = Math.random() * 500 + 200; // ? Calcul d'une distance pseudo-aléatoire
        fragment.animate(
            [
                // ? Faire tourner le fragment
                { transform: 'translate(0, 0) rotate(0deg)' },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(720deg)` }
            ],
            {
                duration: 1000, // ? Durée de 1000ms (= 1 seconde)
                easing: 'ease-out', // ? Version de l'animation, voir internet pour une animation ;)
                fill: 'forwards' // ? Aller de l'avant et non en arrière !
            }
        );
    });
    
    // ? Supprimer les fragments après l'animationd
    setTimeout(() => {
        container.remove(); // ? Supprimer tous les fragments
        startDiv.remove(); // ? Supprimer la div de démarrage
        document.body.style.overflow = "visible"; // ? Permettre le scroll
        divContent.style.display = "block"; // ? Afficher le contenu de la page
        // ? Ajouter les succès
        MinecraftToastManager.ShowToast("BreakStartBlock", "Destruction", "Détruisez le bloc présent sur le site !");
        MinecraftToastManager.ShowToast("SeeIndexPage", "Présentation", "Visionnez le contenu de la page principale.")
    }, 1000);
}