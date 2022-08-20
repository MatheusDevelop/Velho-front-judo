import { Action, Reducer } from "redux";

export interface IEstadoInicial {
    autenticado: boolean,
    idCliente: number,
    nomeUsuario:string,
    nomeCliente:string,
    usuario:string,
    fotoBit64:string,
    emailUsuario:string,
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
    permissoes: [{ funcaoMenu: '', idsTipoOperacoes: [] }],
    nomeCliente:'',
    nomeUsuario:'',
    usuario:'',
    fotoBit64:'',
    emailUsuario:''
};

export interface DispatchAction extends Action {
    payload: Partial<IEstadoInicial>;
}

export const reducerRaiz: Reducer<IEstadoInicial, DispatchAction> = (estadoAtual = estadoInicial, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...estadoAtual
                , permissoes: action.payload.permissoes as IModeloPermissao[]
                , autenticado: true
                , idCliente: action.payload.idCliente as number
                , nomeUsuario: action.payload.nomeUsuario as string
                , nomeCliente: action.payload.nomeCliente as string
                , usuario:action.payload.usuario as string
                , fotoBit64 : action.payload.fotoBit64 as string
                , emailUsuario : action.payload.emailUsuario as string
             }
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