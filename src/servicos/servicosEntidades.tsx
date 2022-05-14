import { ModeloInsercaoEntrada } from "../modelos/ModeloInsercaoEntrada";
import { urlBase } from "./urlBase";

const url = urlBase + '/Entidades'
export const inserirEntidade = async (modeloEntrada:ModeloInsercaoEntrada)=>{
    try{
        const conteudo = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': "application/json" },
            body: JSON.stringify(modeloEntrada)
        })
        const json = await conteudo.json();

    }catch(erro){
        throw erro;
    }
}