import { ModeloGrupoInput } from "../modelos/ModeloGrupoInput";
import { urlBase } from "./urlBase";

export const requisitarModeloDeInputs = async(nomeApi:string)=>{
    const conteudo = await fetch(urlBase + nomeApi + '/inputs/model')
    const json = await conteudo.json();
    const inputs:ModeloGrupoInput[] = json;
    return inputs;
}
export const ValidarInputs = async(nomeApi:string,modelo:any,ehUpdate:boolean)=>{
    let tipoRequisicao = ehUpdate ? 'PUT':'POST'
    const conteudo = await fetch(urlBase + nomeApi + '/inputs/model',{
        method:tipoRequisicao,
        headers:{'Content-type':"application/json"},
        body:JSON.stringify(modelo)
    })
    const json = await conteudo.json();
    return json;
}