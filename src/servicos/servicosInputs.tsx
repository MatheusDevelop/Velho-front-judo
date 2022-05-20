import { ModeloCabecalho } from "../modelos/ModeloCabecalho";
import { ModeloGrupoInput } from "../modelos/ModeloGrupoInput";
import { ModeloLinha } from "../modelos/ModeloLinha";
import { ModeloValidacao } from "../modelos/ModeloValidacao";
import { ModeloValidacaoInputEntrada } from "../modelos/ModeloValidacaoInputEntrada";
import { urlBase } from "./urlBase";

const url = urlBase + '/Inputs'
interface RespostaApi {
    gruposDeInputs: ModeloGrupoInput[],
    cabecalhos:ModeloCabecalho[],
    linhas:ModeloLinha[]
}
export const obterGrupoDeInputs = async (nomeTabela: string, idCliente: number) => {
    try {
        const conteudo = await fetch(url + '?nomeTabela=' + nomeTabela + '&idCliente=' + idCliente)
        const json = await conteudo.json();
        const inputs: RespostaApi = json;
        return inputs;

    } catch (erro) {
        throw erro;
    }
}
export const validarInputs = async (modeloEntrada: ModeloValidacaoInputEntrada) => {
    try {
        const conteudo = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': "application/json" },
            body: JSON.stringify(modeloEntrada)
        })
        const json = await conteudo.json();
        const validacoes: ModeloValidacao[] | null = json;
        return validacoes
    } catch (erro) {
        throw erro;
    }
}