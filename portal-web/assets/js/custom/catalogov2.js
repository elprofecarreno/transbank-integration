/* MÉTODO PARA CARGAR data.json Y CREAR CARDS */
function  load(){

    let cards = "";

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
                        cards = `
                                ${cards}
                                <div class="col-sm m-3">
                                    <div class="card m-auto" style="width: 18rem;">
                                        <img src="${objJSON[i].imagen}" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <h5 class="card-title">${objJSON[i].titulo}</h5>
                                            <p class="card-text text-truncate">${objJSON[i].descripcion}</p>
                                            <h6 class="text-center">$${objJSON[i].precio}</h6>
                                            <a href="#" class="btn btn-primary">COMPRAR</a>
                                        </div>
                                    </div>
                                </div>`;
                    }

                    console.log('OBTENER DIV CON id = catalogo');
                    const catalogoHTML = document.getElementById("catalogo");
                    console.log('RENDERIZANDO O REESCRIBIENDO DIV CON id = catalogo AGREGANDO LA INFORMACIÓN DE LA VARIABLE catalogoHTML');
                    /* SE REESCRIBE ESTRUCTURA DIV CON INNERHTML
                
                        https://developer.mozilla.org/es/docs/Web/API/Element/innerHTML
                    */
                    catalogoHTML.innerHTML = cards;
                }).catch((err) => {
                    /* SECCIÓN PARA CAPTURAR ERRORES */
                    console.log('ERROR: ', err.message);
                });
}

/* SE LLAMA MÉTODO PARA CARGAR CARDS AL MOMENTO DE MOSTRAR LA PÁGINA */
load()