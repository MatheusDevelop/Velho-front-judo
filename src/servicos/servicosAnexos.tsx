import { urlBase } from "./urlBase";
import fileDownload from "js-file-download";
import { paraCadaChaveNoObjetoExecutar } from "../utilitarios/objetosUtilitarios";
const url =  urlBase+"/Anexos"
export const anexarArquivos = async (nomeTabela:string,idEntidade: string, idCliente: number, arquivosObj:any) => {
    let formData = new FormData();
    paraCadaChaveNoObjetoExecutar((chave:any)=>{
        formData.append("Arquivos", arquivosObj[chave]);
    },arquivosObj)

    formData.append("idCliente", `${idCliente}`)
    formData.append("idEntidade", `${idEntidade}`)
    formData.append("nomeTabela", `${nomeTabela}`)
    const conteudo =  await fetch(url, {
        method: 'POST',
        body: formData
    });
    const json = await conteudo.json();
    return json;
}
export const lerAnexos = async (nomeTabela:string,idEntidade: string, idCliente: number)=>{
    const requisicaoUrl = url + "?nomeTabela="+nomeTabela+"&idEntidade="+idEntidade+"&idCliente="+idCliente
    const conteudo = await fetch(requisicaoUrl);
    const json:{arquivos:string[]} = await conteudo.json();
    return json;
}
export const baixarAnexo = async (nomeTabela:string,idEntidade: string, idCliente: number,nomeAnexo:string)=>{
    const requisicaoUrl = url + "/download?nomeTabela="+nomeTabela+"&idEntidade="+idEntidade+"&idCliente="+idCliente+"&nomeAnexo="+nomeAnexo
    const conteudo = await fetch(requisicaoUrl);
    const blob = await conteudo.blob();
    fileDownload(blob,nomeAnexo);
}
export const deletarAnexo = async (nomeTabela:string,idEntidade: string, idCliente: number,nomeAnexo:string)=>{
    const requisicaoUrl = url + "?nomeTabela="+nomeTabela+"&idEntidade="+idEntidade+"&idCliente="+idCliente+"&nomeAnexo="+nomeAnexo
    return await fetch(requisicaoUrl,{method:'DELETE'});
    
}