import { urlBase } from "./urlBase"

const url = urlBase + '/Entidades/selecao'
export const atualizarSelecao = async (id: string, checkMarcado: boolean, nomeTabela: string, nomeChavePrimaria: string) => {
    try {
        let requisicaoUrl = url + '?nomeTabela=' + nomeTabela + '&id=' + id + '&nomeChavePrimaria=' + nomeChavePrimaria
        if (checkMarcado)
            requisicaoUrl += '&marcar=true'
        else
            requisicaoUrl += '&marcar=false'
        
        await fetch(requisicaoUrl, {
            method: 'PUT'
        })
    } catch (erro) {
        throw erro;
    }
}