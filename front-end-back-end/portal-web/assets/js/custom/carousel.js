/* MÉTODO PARA CARGAR data.json Y CREAR CAROUSEL */
function  customCarousel(){

    let carousel = "";
    let indicators = '<div class="carousel-indicators">';
    let items = '<div class="carousel-inner">';

    /* FUNCIÓN QUE EJECUTA UNA LLAMADO A OBJETO data.json */
    const resp = fetch("assets/data.json",{
                    //method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
                    /* SECCIÓN PARA VERIFICAR LA RESPUESTA AL OBTENER data.json */
                    if(response.ok){
                        console.log('RESPUESTA CORRECTA. data.json OBTENIDO');
                        /* RETORNANDO data.json EN FORMATO TEXTO (data)*/
                        return response.text();
                    }else{
                        console.log('ERROR AL OBTENER data.json');
                        throw new Exception('ERROR AL OBTENER data.json');
                    }
                
                }).then((data) => {
                    /* SECCIÓN PARA LEER data.json */
                    console.log('TRASFORMANDO data.json de texto a JSON');
                    const objJSON = JSON.parse(data);
                    console.log('data: ', objJSON);
                    /*  RECORRER LISTA CON OBJETOS OBTENIDOS DE data.json
                        PARA POSTERIORMENTE MEDIANTE INTERPOLACIÓN AGREGAR 
                        CARDS POR CADA OBJETO JSON DE LA LISTA */
                    for (i = 0; i < objJSON.length; i++) {
                        let itemActive = "";
                        let indicatorActive = "";
                        if(i == 0){
                            itemActive = " active"
                            indicatorActive = ' class="active" aria-current="true"';
                        }
                        indicators = `
                                    ${indicators}
                                    <button type="button" data-bs-target="#customCarousel" 
                                        data-bs-slide-to="${i}" ${indicatorActive}
                                        aria-label="${i}"></button>`;
                        items = `
                                ${items}
                                <div class="carousel-item${itemActive}">
                                    <img src="${objJSON[i].imagen}" class="d-block w-100" alt="...">
                                </div>`;
                    }
                    
                    indicators = `${indicators}</div>`;
                    items = `${items}</div>`;
                    carousel = `${indicators}
                                ${items}`;
                    console.log('OBTENER DIV CON id = customCarousel');
                    const carouselHTML = document.getElementById("customCarousel");
                    console.log('RENDERIZANDO O REESCRIBIENDO DIV CON id = carousel AGREGANDO LA INFORMACIÓN DE LA VARIABLE carouselHTML');
                    /* SE REESCRIBE ESTRUCTURA DIV CON INNERHTML
                
                        https://developer.mozilla.org/es/docs/Web/API/Element/innerHTML
                    */
                    carouselHTML.innerHTML = carousel;
                }).catch((err) => {
                    /* SECCIÓN PARA CAPTURAR ERRORES */
                    console.log('ERROR: ', err.message);
                });
}

/* SE LLAMA MÉTODO PARA CARGAR CARROUSEL AL MOMENTO DE MOSTRAR LA PÁGINA */
customCarousel();