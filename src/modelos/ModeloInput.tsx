export interface ModeloInput {
    tipo:string,
    propriedade:string,
    nome:string,
    requerido:boolean,
    larguraMaxima:boolean,
    tamanho:number,
    opcoes?:{
        nome:string,
        valor:any
    }[]
    validadores:number[]
}