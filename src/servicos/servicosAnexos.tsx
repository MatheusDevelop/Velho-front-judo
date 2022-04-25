import { urlBase } from "./urlBase";
import fileDownload from "js-file-download";

export const anexarArquivo = async (nomeApi: string, idModelo: number, listaArquivos: []) => {
    let formData = new FormData();
    listaArquivos.map(arquivo => {
        formData.append("Anexos", arquivo);
    })
    formData.append("id", `${idModelo}`)
    let url = urlBase + nomeApi + "/anexos"
    const conteudo =  await fetch(url, {
        method: 'POST',
        body: formData
    });
    const json = await conteudo.json();
    return json;
}
export const lerAnexos = async (nomeApi: string, idModelo: number)=>{
    let url = urlBase + nomeApi + "/anexos/"+idModelo
    const conteudo = await fetch(url);
    const json = await conteudo.json();
    return json;
}
export const baixarAnexo = async (nomeApi: string, idModelo: number,nomeAnexo:string)=>{
    let url = urlBase + nomeApi + "/anexos/"+idModelo+"/download/"+nomeAnexo
    const conteudo = await fetch(url);
    const blob = await conteudo.blob();
    fileDownload(blob,nomeAnexo);
}
export const deletarAnexo = async (nomeApi: string, idModelo: number,nomeAnexo:string)=>{
    let url = urlBase + nomeApi + "/anexos/"+idModelo+"/delete/"+nomeAnexo
    return await fetch(url,{method:'DELETE'});
    
}