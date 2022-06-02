import { ModeloRota } from "../modelos/ModeloRota"

export const obterRotas = async ()=>{
    //TODO: Fazer comunicação cmo o servidor
    let rotas:ModeloRota[] = [
        {nomeTabela:'TB_ATLETAS',nomeRota:'/atletas'},
        {nomeTabela:'TB_AGREMIACOES',nomeRota:'/agremiacoes'},
    ]
    return rotas;
}