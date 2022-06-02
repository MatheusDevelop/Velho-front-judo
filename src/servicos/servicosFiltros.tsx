import { ModeloFiltroOpcaoSelect } from "../modelos/ModeloFiltroOpcaoSelect"
import { urlBase } from "./urlBase"

const url = urlBase + "/Filtros"
export const filtrarEnderecos = async (idPais: string, idCliente: number, idEstado: string | null = null) => {
    let requisicaoUrl = url + '/selects/enderecos?idPais=' + idPais + "&idCliente=" + idCliente
    if (idEstado != null)
        requisicaoUrl += '&idEstado=' + idEstado
    const conteudo = await fetch(requisicaoUrl)
    const json: ModeloFiltroOpcaoSelect[] = await conteudo.json();
    return json;

}