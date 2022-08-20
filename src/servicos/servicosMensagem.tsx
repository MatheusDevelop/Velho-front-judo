import { urlBase } from "./urlBase"

const url = urlBase + "/Mensagens"
export const lerMensagem = async( sigla:string )=>{
    try {
        const conteudo = await fetch(url + '?sigla='+sigla)
        const json = await conteudo.json();
        console.log(json)
        const mensagem: {
            propriedade:string,
            tipo:string,
            mensagem:string
        } = json;
        return mensagem;

    } catch (erro) {
        throw erro;
    }
}