const baseDestroySrc = "assets/imgs/FirstSee/destroy_stage_{Stage}.png";
var currentStage = -1;

let divBlock = document.getElementsByClassName("start")[0]; // ? Récupération de la div

let image = divBlock.getElementsByTagName("img").item(1);
image.addEventListener('click', mineGrassBlock);

function mineGrassBlock(event) {
    currentStage++;
    image.src = baseDestroySrc.replace('{Stage}', currentStage.toString());
    if (currentStage >= maxStage) {
        image.removeEventListener('click', mineGrassBlock);
    }
}