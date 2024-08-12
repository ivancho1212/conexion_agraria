document.addEventListener("DOMContentLoaded", function () {
    const contId = "contGame";
    const firebaseUser = new FirebaseUser();
    let game;

    function startGame() {
        game = new Game(contId);
        game.getDataProperties();
    }

    startGame();

    const btnStart = document.getElementById("btn_start");
    if (btnStart) {
        btnStart.addEventListener("click", function () {
            const contactForm = document.getElementById("contactForm");
            if (contactForm) {
                contactForm.reset();
            }

            // Limpia el input del ID
            const propertyIdInput = document.getElementById("predioId");
            if (propertyIdInput) {
                propertyIdInput.value = '';
            }

            const modalTitle = document.getElementById('modal-title');
            const modalDescription = document.getElementById('modal-description');
            const modalCarouselInner = document.getElementById('modal-carousel-inner');
            if (modalTitle) modalTitle.textContent = '';
            if (modalDescription) modalDescription.innerHTML = '';
            if (modalCarouselInner) modalCarouselInner.innerHTML = '';

            const cardInfo = document.getElementById('cardInfo');
            if (cardInfo) cardInfo.style.display = 'none';

            const contactFormSection = document.getElementById('contactFormSection');
            if (contactFormSection) contactFormSection.style.display = 'block';

            const carouselPrev = document.querySelector('.carousel-control-prev');
            const carouselNext = document.querySelector('.carousel-control-next');
            if (carouselPrev) carouselPrev.style.display = 'none';
            if (carouselNext) carouselNext.style.display = 'none';
            const carouselIndicators = document.querySelector('.carousel-indicators');
            if (carouselIndicators) carouselIndicators.style.display = 'none';

            setTimeout(() => {
                $("#gameModal").modal("show");
            }, 100);
        });
    }

    const script = document.createElement("script");
    script.src = "assets/js/form.js";
    document.body.appendChild(script);
});
