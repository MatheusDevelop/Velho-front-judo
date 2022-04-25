import { urlBase } from "./urlBase";

export const deletarModelo = async (nomeApi: string, idModelo: number) => {
    const conteudo = await fetch(urlBase + nomeApi + '/' + idModelo, {
        method: 'DELETE'
    })
    const json = await conteudo.json();
    return json;
}