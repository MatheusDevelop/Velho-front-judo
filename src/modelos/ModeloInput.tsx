export interface ModeloInput {
    tipo:string,
    propriedade:string,
    nome:string,
    requerido:boolean,
    larguraMaxima:boolean,
    tamanho:number,
    valor:string,
    mascara?:string,
    quebrarLinha:boolean,
    opcoes?:{
        nome:string,
        valor:any
    }[]
    validadores:number[]
}