import { urlBase } from "./urlBase";
export const cadastrarModelo = async (nomeApi: string, modelo: any, possuiArquivo: boolean) => {
    const conteudo = possuiArquivo ? await JsonComArquivoPost(nomeApi, modelo, false) : await JsonPost(nomeApi, modelo, false)
    const json = await conteudo.json();
    return json;
}
export const atualizarModelo = async (nomeApi: string, modelo: any, possuiArquivo: boolean, idModelo: number) => {
    const conteudo = possuiArquivo ? await JsonComArquivoPost(nomeApi, modelo, true, idModelo) : await JsonPost(nomeApi, modelo, true, idModelo)
    const json = await conteudo.json();
    return json;
}

async function JsonPost(nomeApi: string, modelo: any, ehUpdate: boolean, idModelo?: number) {
    let url = urlBase + nomeApi
    if (ehUpdate && idModelo)
        url += '/' + idModelo
    return await fetch(url, {
        method: ehUpdate ? 'PUT' : 'POST',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify(modelo)
    });
}
async function JsonComArquivoPost(nomeApi: string, modelo: any, ehUpdate: boolean, idModelo?: number) {
    let formData = new FormData();
    Object.keys(modelo).forEach(chave => {
        formData.append(chave, modelo[chave])
    })
    let url = urlBase + nomeApi
    if (ehUpdate && idModelo)
        url += '/' + idModelo
    return await fetch(url, {
        method: ehUpdate ? 'PUT' : 'POST',
        body: formData
    });
}
