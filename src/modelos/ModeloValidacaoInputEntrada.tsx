import { ModeloValidacaoInput } from "./ModeloValidacaoInput";

export interface ModeloValidacaoInputEntrada{
    idCliente:number,
    idEntidade?:string,
    tabela:string,
    campos:ModeloValidacaoInput[]
}