class MinecraftToast {
    constructor() {
        this.queue = []; // ? File d'attente des succès à venir
        this.isProcessing = false; // ? Un succès est entrain d'être affiché ?
    }

    ShowToast(id, name, description) {
        if (localStorage.getItem('Achievements') == null || localStorage.getItem('Achievements').split(',').includes(id)) return; // ? Plus d'informations dans le **readme.md** !
        localStorage.setItem('Achievements', localStorage.getItem('Achievements') + "," + id); // ? Ajout du succès dans le stockage local (plus d'informations dans le **readme.md**)
        let image = id + ".png"; // ? Récupération de l'image du succès
        return new Promise((resolve) => { // ? Création d'une Promise (Voir plus d'informations dans le **readme.md**) pour l'affichage du succès
            this.queue.push({ name, description, image, resolve }); // ? Ajout du succès dans la file d'attente
            if (!this.isProcessing) // ? Si aucun succès n'est actuellement affiché, alors l'afficher.
                this.processQueue();
        });
    }

    async processQueue() {
        if (this.isProcessing) return; // ? Si un succès est déjà en affichage, annuler la commande.
        this.isProcessing = true; // ? Mettre l'état de la file en actif

        while (this.queue.length > 0) { // ? Jusqu'à ce qu'il n'y ai plus de succès...
            const { name, description, image, resolve } = this.queue.shift(); // ? Récupération des informations sur le succès à afficher
            await this.run(name, description, image); // ? Afficher le succès et attendre que ce soit finit...
            resolve(); // ? Appeler la fonction de callback (Voir **readme.md**)
        }

        this.isProcessing = false; // ? Une fois finit, mettre l'état de la file en inactif
    }

    /**
     * @description Show toasts on the current page.
     * @param {String} name The title showed on the toast
     * @param {String} description The description showed on the toast
     */
    run(name, description, image) {
        return new Promise((resolve) => { // ? Création d'une promise pour l'affichage (Voir **readme.md** pour plus d'informations)
            const toast = document.createElement('div'); // ? Création de l'élément "<div>" pour afficher le succès
            toast.classList.add('toast'); // ? Lui ajouter la classe "toast" pour le style

            const toastImage = document.createElement('div'); // ? Création d'une div pour contenir l'image
            toastImage.classList.add('image'); // ? Lui ajouter la classe "image" pour le style
            const toastImageImg = document.createElement('img'); // ? Ajouter l'élément <img> qui servira pour afficher l'image du succès
            toastImageImg.src = "assets/imgs/Toasts/" + image; // ? Mettre la source de l'élément <img> à l'image du succès siué dans "racine/assets/imgs/Toasts/"
            toastImage.appendChild(toastImageImg); // ? Ajouter l'élément <img> au conteneur de l'image

            const toastContent = document.createElement('div'); // ? Créer l'élément "<div>" qui contiendra le titre et la description du succès
            toastContent.classList.add('toastContent'); // ? Ajouter la classe "toastContent" pour le style
            const toastContentTitle = document.createElement('h1'); // ? Créer un élément "<h1>" qui contiendra le titre
            toastContentTitle.innerText = name; // ? Mettre le texte de <h1> au nom du succès
            const toastContentDescription = document.createElement('p'); // ? Créer un élément "<p>" qui contiendra la description du succès
            toastContentDescription.innerText = description; // ? Ajouter la description du succès au texte de l'élément "<p>"
            toastContent.appendChild(toastContentTitle); // ? Ajouter le titre au conteneur des informations
            toastContent.appendChild(toastContentDescription); // ? Ajouter la description au conteneur des informations

            toast.appendChild(toastImage); // ? Ajouter le conteneur de l'image au succès final
            toast.appendChild(toastContent); // ? Ajouter le conteneur des informations au succès final

            const toastElement = document.body.appendChild(toast); // ? Afficher le succès final
            setTimeout(() => { // * Au bout de 5000ms (=5 secondes)...
                toastElement.classList.add('revert'); // ? Inverser l'animation du succès

                setTimeout(() => { // * Au bout de 2000ms (=2 secondes) soit la fin de l'animation...
                    toastElement.remove(); // ? Supprimer le succès de la page
                    resolve(); // ? Appeler la méthode de callback
                }, 2000)
            }, 5000);
        })
    }
}

if (!localStorage.getItem('Achievements')) localStorage.setItem('Achievements', ''); // ? Initialiser les succès dans le localstorage (Voir **readme.md** pour plus d'informations) à vide s'il n'existe pas
const MinecraftToastManager = new MinecraftToast(); // ? Initialiser le Gérant des succès.