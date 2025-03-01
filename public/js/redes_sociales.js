import { redes_sociales_data } from "/src/const/redes_sociales_data.js";
class redesSociales extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){

        document.head.insertAdjacentHTML(
            'beforeend',
            '<link rel="stylesheet" href="/css/redesSociales.css" />'
            );
        redes_sociales_data.forEach((redes_sociales_data) => {
        const container = document.querySelector("redes-sociales");
        const redesSociales = document.createElement("div");
        redesSociales.className = `redes-sociales ${redes_sociales_data.id}`;
        redesSociales.innerHTML = `
       <div class="logoRedesSociales"><a href="${redes_sociales_data.url}" target="_blank"><img src="${redes_sociales_data.svg}" alt="${redes_sociales_data.descripcion}"/></a></div>
     `;
        container.appendChild(redesSociales);
        });
    };
}

window.customElements.define("redes-sociales", redesSociales)