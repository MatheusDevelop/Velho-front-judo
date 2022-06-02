import { ModeloInsercaoEntrada } from "../modelos/ModeloInsercaoEntrada";
import { urlBase } from "./urlBase";

const url = urlBase + '/Entidades'
export const inserirEntidade = async (modeloEntrada: ModeloInsercaoEntrada, idEntidade?: string, nomeChavePrimaria?: string) => {
    let requisicaoUrl = url;
    if (idEntidade && nomeChavePrimaria)
        requisicaoUrl += "?idEntidade=" + idEntidade + "&nomeChavePrimaria=" + nomeChavePrimaria
    try {
        const conteudo = await fetch(requisicaoUrl, {
            method: idEntidade ? 'PUT' : 'POST',
            headers: { 'Content-type': "application/json" },
            body: JSON.stringify(modeloEntrada)
        })
        const json = await conteudo.json();

    } catch (erro) {
        throw erro;
    }
}
export const excluirEntidade = async (nomeTabela: string, nomeChavePrimaria: string, idEntidade: string, idCliente: number) => {
    const requisicaoUrl = url + "?nomeTabela=" + nomeTabela + "&idEntidade=" + idEntidade + "&nomeChavePrimaria=" + nomeChavePrimaria + "&idCliente=" + idCliente
    return await fetch(requisicaoUrl, { method: 'DELETE' });
}