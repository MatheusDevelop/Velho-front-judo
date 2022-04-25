export interface ModeloInput {
    tipo:string,
    nome:string,
    propriedade:string,
    requerido:boolean,
    larguraMaxima:boolean,
    tamanhoMaximo:number,
    opcoes?:{
        nome:string,
        valor:any
    }[]
}