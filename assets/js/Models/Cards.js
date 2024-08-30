class Game {
  constructor(contGame) {
    const element = document.getElementById(contGame);
    this.contGame = element;
    this.contCardClass = "contCard";
    this.URL_PROPERTIES = "https://conexion-agraria-default-rtdb.firebaseio.com/Api/Properties.json";
    this.URL_DEPARTMENTS = "https://conexion-agraria-default-rtdb.firebaseio.com/Api/Department.json";
    this.pathImg = "https://firebasestorage.googleapis.com/v0/b/conexion-agraria.appspot.com/o/predios%2F";
    this.defaultImage = "https://via.placeholder.com/200x200.png?text=No+Image"; // URL de la imagen por defecto

    this.propertiesPromise = this.getDataProperties();
    this.departmentsPromise = this.getDepartments();

    this.initializeGame();
  }

  async initializeGame() {
    try {
      const [properties, departments] = await Promise.all([this.propertiesPromise, this.departmentsPromise]);
      this.departments = departments;
      this.setElements(properties);
      this.addClickEventToCards();
    } catch (error) {
      console.error("Error initializing game:", error);
    }
  }

  async getDataProperties() {
    try {
      const response = await fetch(this.URL_PROPERTIES);
      const data = await response.json();

      // Convertir el objeto en un array de objetos
      const propertiesArray = Object.keys(data).map(key => {
        data[key].id = key; // Añadir el ID como una propiedad de cada objeto
        return data[key];
      });

      // Filtrar propiedades con estado_predio_id igual a "estado1" o "estado2"
      const filteredProperties = propertiesArray.filter(property => property.estado_predio_id === "estado1" || property.estado_predio_id === "estado2");

      return filteredProperties;
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
      throw error;
    }
  }

  async getDepartments() {
    try {
      const response = await fetch(this.URL_DEPARTMENTS);
      return await response.json();
    } catch (error) {
      console.error("Error fetching department data:", error);
      throw error;
    }
  }

  async setElements(arrayJson) {
    try {
      if (!Array.isArray(arrayJson)) {
        arrayJson = Object.keys(arrayJson).map(key => arrayJson[key]);
      }
      this.renderCards(arrayJson);
    } catch (error) {
      console.error('Error setting elements:', error);
    }
  }

  renderCards(arrayJson) {
    this.contGame.innerHTML = '';

    let cardsHtml = '';
    arrayJson.forEach(property => {
      const firstImage = property.imagenes && property.imagenes.length > 0 ? property.imagenes[0] : "default-image.jpg";
      let departmentName = "Desconocido";
      let municipalityName = "Desconocido";
      if (this.departments && this.departments[property.departamento]) {
        departmentName = this.departments[property.departamento].nombre;
        if (property.municipio) {
          municipalityName = property.municipio;
        }
      }

      const isRented = property.estado === 'arrendado';

      cardsHtml += `
        <div class="col-md-3 mb-3 ${this.contCardClass}">
          <div class="card" style="border: none;">
            ${isRented ? '<div class="ribbon"><span>Arrendado</span></div>' : ''}
            <div class="image-container">
              <img 
                class="card-img-top" 
                src="${this.pathImg}${encodeURIComponent(firstImage)}?alt=media" 
                alt="Card image cap"
                style="border-radius: 15px; object-fit: cover; width: 100%; height: 200px;"
                onerror="this.onerror=null; this.src='${this.defaultImage}';"
              >
            </div>
            <div class="card-body">
              <!-- Nombre de la propiedad con un tamaño de fuente más grande -->
              <h5 class="card-title" style="font-size: 1.8rem; font-weight: bold;">
                ${property.nombre}
              </h5>
              <!-- Municipio y departamento en la misma fila, con fuente más pequeña, cerca del nombre y en color gris -->
              <p class="card-text" style="font-size: 0.9rem; margin-top: -5px; color: grey; margin-bottom: 0.5rem;">
                ${municipalityName}, ${departmentName}
              </p>
              <!-- Otros datos de la propiedad -->
              <p class="card-text" style="font-size: 1rem; margin-bottom: 0.2rem;">Medida: ${property.medida}</p>
              <p class="card-text" style="font-size: 1rem; margin-bottom: 0.2rem;">Precio Arriendo: ${property.precio_arriendo}</p>
            </div>
          </div>
        </div>`;
    });

    this.contGame.innerHTML = `<div class="row">${cardsHtml}</div>`;
  }



  addClickEventToCards() {
    const cards = this.contGame.querySelectorAll('.card');
    cards.forEach(card => {
      if (!card.dataset.clickEventAdded) {
        card.dataset.clickEventAdded = true;
        card.addEventListener('click', () => {
          const property = JSON.parse(card.dataset.property);

          const modalImageContainer = document.getElementById('modal-carousel-inner');
          const imagesHtml = (property.imagenes || []).map((image) => `
                          <div class="swiper-slide">
                              ${property.estado === 'arrendado' ? '<div class="ribbon"><span>Arrendado</span></div>' : ''}
                              <img src="${this.pathImg}${encodeURIComponent(image)}?alt=media" class="d-block w-100" alt="...">
                          </div>
                      `).join("");
          modalImageContainer.innerHTML = imagesHtml;

          const modalTitle = document.getElementById('modal-title');
          const modalDireccion = document.getElementById('modal-direccion');
          const modalDepartamento = document.getElementById('modal-departamento');
          const modalMunicipio = document.getElementById('modal-municipio');
          const modalClima = document.getElementById('modal-clima');
          const modalMedidas = document.getElementById('modal-medidas');
          const modalDescription = document.getElementById('modal-description');
          const modalPreciometroCuadrado = document.getElementById('modal-precio-metroCuadrado');
          const modalPrecioArriendo = document.getElementById('modal-precio-arriendo');

          let departmentName = "Desconocido";
          let municipalityName = "Desconocido";

          if (this.departments && this.departments[property.departamento]) {
            departmentName = this.departments[property.departamento].nombre;
            if (property.municipio) {
              municipalityName = property.municipio;
            }
          }

          modalTitle.textContent = property.nombre;
          modalDireccion.innerHTML = `<ion-icon name="location-outline"></ionicon> <strong>Dirección:</strong> ${property.direccion}`;
          modalDepartamento.innerHTML = `<ion-icon name="business-outline"></ionicon> <strong>Departamento:</strong> ${departmentName}`;
          modalMunicipio.innerHTML = `<ion-icon name="home-outline"></ionicon> <strong>Municipio:</strong> ${municipalityName}`;
          modalClima.innerHTML = `<ion-icon name="partly-sunny-outline"></ionicon> <strong>Clima:</strong> ${property.clima}`;
          modalDescription.innerHTML = `<ion-icon name="document-text-outline"></ionicon> <strong>Descripción:</strong> <br>${property.descripcion}`;
          modalMedidas.innerHTML = `<ion-icon name="cube-outline"></ionicon> <strong>Medida:</strong> ${property.medida}`;
          modalPreciometroCuadrado.innerHTML = `<ion-icon name="cash-outline"></ionicon> <strong>Precio por metro cuadrado:</strong> ${property.precio_metro_cuadrado || "Desconocido"}`;
          modalPrecioArriendo.innerHTML = `<ion-icon name="cash-outline"></ionicon> <strong>Precio de arriendo:</strong> ${property.precio_arriendo}`;

          const meInteresaButton = document.querySelector('.me-interesa-button');
          meInteresaButton.dataset.predioId = property.id;

          // Ocultar el botón "Me interesa" si la propiedad está arrendada
          if (property.estado === 'arrendado') {
            meInteresaButton.style.display = 'none';
          } else {
            meInteresaButton.style.display = 'block';
          }

          document.getElementById('contactFormSection').style.display = 'none';
          document.getElementById('cardInfo').style.display = 'block';
          $('#gameModal').modal('show');

          if (this.modalSwiper) {
            this.modalSwiper.destroy();
          }

          this.modalSwiper = new Swiper('.modal-swiper-container', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            loop: true,
            slidesPerView: 'auto',
            coverflowEffect: {
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            },
            pagination: {
              el: '.swiper-pagination',
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          });
        });
      }
    });
  }
}

const game = new Game("contGame");
