class MinecraftToast {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }

    ShowToast(id, name, description) {
        console.log(!localStorage.getItem('Achievements') == null);
        console.log(localStorage.getItem('Achievements').split(',').includes(id));
        if (localStorage.getItem('Achievements') == null || localStorage.getItem('Achievements').split(',').includes(id)) return;
        localStorage.setItem('Achievements', localStorage.getItem('Achievements') + "," + id);
        let image = id + ".png";
        return new Promise((resolve) => {
            this.queue.push({ name, description, image, resolve });
            if (!this.isProcessing) {
                this.processQueue();
            }
        });
    }

    async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const { name, description, image, resolve } = this.queue.shift();
            await this.run(name, description, image);
            resolve();
        }

        this.isProcessing = false;
    }

    /**
     * @description Show toasts on the current page.
     * @param {String} name The title showed on the toast
     * @param {String} description The description showed on the toast
     */
    run(name, description, image) {
        return new Promise((resolve) => {
            const toast = document.createElement('div');
            toast.classList.add('toast');

            const toastImage = document.createElement('div');
            toastImage.classList.add('image');
            const toastImageImg = document.createElement('img');
            toastImageImg.src = "assets/imgs/Toasts/" + image;
            toastImage.appendChild(toastImageImg);

            const toastContent = document.createElement('div');
            toastContent.classList.add('toastContent');
            const toastContentTitle = document.createElement('h1');
            toastContentTitle.innerText = name;
            const toastContentDescription = document.createElement('p');
            toastContentDescription.innerText = description;
            toastContent.appendChild(toastContentTitle);
            toastContent.appendChild(toastContentDescription);

            toast.appendChild(toastImage);
            toast.appendChild(toastContent);

            const toastElement = document.body.appendChild(toast);
            setTimeout(() => {
                toastElement.classList.add('revert');

                setTimeout(() => {
                    toastElement.remove();
                    resolve();
                }, 2000)
            }, 5000);
        })
    }
}

localStorage.setItem('Achievements', '');
const MinecraftToastManager = new MinecraftToast();