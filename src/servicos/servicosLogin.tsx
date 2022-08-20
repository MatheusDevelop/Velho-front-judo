import { IModeloPermissao } from "../redux/reducerRaiz"
import { urlBase } from "./urlBase"

const url = urlBase + "/Login"
interface ModeloLoginResposta {
    autenticado: boolean, 
    permissoes: IModeloPermissao[],
    idCliente:number,
    fotoBit64:string,
    nomeUsuario:string,
    nomeCliente:string,
    usuario:string,
    emailUsuario:string
}
export const fazerLogin = async (usuario: string, senha: string, cliente: string) => {
    try {
        const conteudo = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': "application/json" },
            body: JSON.stringify({ usuario, senha, cliente })
        })
        const json: ModeloLoginResposta = await conteudo.json();
        return json;
    } catch (erro) {
        throw erro;
    }
}