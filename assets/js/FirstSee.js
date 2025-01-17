const baseDestroySrc = "assets/imgs/FirstSee/destroy_stage_{Stage}.png";
const maxStage = 10;
var currentStage = -1;
var mouseDown = false;

document.addEventListener('mousedown', () => function() {
    mouseDown = true;
    console.log("MouseDown !");
});
document.addEventListener('mouseup', () => function() {
    mouseDown = false;
    console.log("MouseUp !");
});


let divBlock = document.getElementsByClassName("start")[0]; // ? Récupération de la div
let divContent = document.getElementsByClassName("content")[0];

let image = divBlock.getElementsByTagName("img").item(1);
image.addEventListener('mousedown', mineGrassBlock);

function mineGrassBlock() {
    do {
        currentStage++;

        if (currentStage >= maxStage) {
            image.removeEventListener('mousedown', mineGrassBlock);
            explodeImage();
            return;
        }

        image.src = baseDestroySrc.replace('{Stage}', currentStage.toString());
        setTimeout(() => {}, 2500);
    } while (mouseDown);
}

function explodeImage() {
    document.body.style.overflow = "hidden";
    const startDiv = document.querySelector('.start');
    const images = startDiv.querySelectorAll('img');
    const fragments = 128; // Nombre de fragments
    
    // Obtenir les dimensions et la position des images
    const rect = images[0].getBoundingClientRect(); // On suppose que les deux images ont la même taille
    
    // Créer un conteneur pour les fragments
    const container = document.createElement('div');
    container.className = 'explosion-container';
    container.style.position = 'absolute';
    container.style.width = `${rect.width}px`;
    container.style.height = `${rect.height}px`;
    container.style.top = `${rect.top}px`;
    container.style.left = `${rect.left}px`;
    container.style.pointerEvents = 'none'; // Désactiver les interactions avec le conteneur
    container.style.zIndex = '15';
    
    // Créer les fragments
    for (let i = 0; i < fragments; i++) {
        const fragment = document.createElement('div');
        fragment.style.width = `${rect.width / 10}px`;
        fragment.style.height = `${rect.height / 10}px`;
        fragment.style.position = 'absolute';
        fragment.style.left = `${(i % 10) * (rect.width / 10)}px`; // Position horizontale en grille
        fragment.style.top = `${Math.floor(i / 10) * (rect.height / 10)}px`; // Position verticale en grille
        fragment.style.imageRendering = 'pixelated';
        
        // Créer deux divs pour chaque image (superposition des fragments)
        const img1Fragment = document.createElement('div');
        img1Fragment.style.backgroundImage = `url(${images[0].src})`;
        img1Fragment.style.backgroundSize = `${rect.width}px ${rect.height}px`;
        img1Fragment.style.backgroundPosition = `-${fragment.style.left} -${fragment.style.top}`;
        img1Fragment.style.width = '100%';
        img1Fragment.style.height = '100%';
        img1Fragment.style.position = 'absolute';
        
        const img2Fragment = document.createElement('div');
        img2Fragment.style.backgroundImage = `url(${images[1].src})`;
        img2Fragment.style.backgroundSize = `${rect.width}px ${rect.height}px`;
        img2Fragment.style.backgroundPosition = `-${fragment.style.left} -${fragment.style.top}`;
        img2Fragment.style.width = '100%';
        img2Fragment.style.height = '100%';
        img2Fragment.style.position = 'absolute';
        
        // Ajouter les fragments d'images au fragment principal
        fragment.appendChild(img1Fragment);
        fragment.appendChild(img2Fragment);
        
        // Ajouter le fragment au conteneur
        container.appendChild(fragment);
    }
    
    // Ajouter le conteneur au body
    document.body.appendChild(container);
    
    // Cacher les images originales
    images.forEach(img => (img.style.visibility = 'hidden'));
    
    // Animation de l'explosion
    container.childNodes.forEach(fragment => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 500 + 200;
        fragment.animate(
            [
                { transform: 'translate(0, 0) rotate(0deg)' },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(720deg)` }
            ],
            {
                duration: 1000,
                easing: 'ease-out',
                fill: 'forwards'
            }
        );
    });
    
    // Supprimer les fragments après l'animation
    setTimeout(() => {
        container.remove();
        startDiv.remove();
        document.body.style.overflow = "visible";
        divContent.style.display = "block";
        ShowToast("Destruction", "Détruisez le bloc présent sur le site !");
    }, 1000);
}