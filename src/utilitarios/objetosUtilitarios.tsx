export const paraCadaChaveNoObjetoExecutar = (funcao: Function, objeto: any) => {
    Object.keys(objeto).forEach(chaveDoObjeto => {
        funcao(chaveDoObjeto)
    })
}