import { Action, Reducer } from "redux";

export interface IEstadoInicial {
    autenticado: boolean,
    idCliente: number,
    menuAtual: string,
    nomeMenuAtual: string,
    nomeSubmenuAtual: string,
    permissoes: IModeloPermissao[]
}

export interface IModeloPermissao {
    funcaoMenu: string, idsTipoOperacoes: string[]
}
export const estadoInicial: IEstadoInicial = {
    autenticado: false,
    idCliente: 0,
    menuAtual: '',
    nomeMenuAtual: '',
    nomeSubmenuAtual: '',
    permissoes: [{ funcaoMenu: '', idsTipoOperacoes: [] }]
};

export interface DispatchAction extends Action {
    payload: Partial<IEstadoInicial>;
}

export const reducerRaiz: Reducer<IEstadoInicial, DispatchAction> = (estadoAtual = estadoInicial, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...estadoAtual, permissoes: action.payload.permissoes as IModeloPermissao[], autenticado: true, idCliente: action.payload.idCliente as number }
        case 'SETAR-MENU':
            return {
                ...estadoAtual
                , menuAtual: action.payload.menuAtual as string
                , nomeMenuAtual: action.payload.nomeMenuAtual as string
                , nomeSubmenuAtual: action.payload.nomeSubmenuAtual as string
            }
        case 'DESLOGIN':
            return estadoInicial
        default:
            return estadoAtual;
    }
};