import {DispatchAction, IEstadoInicial, reducerRaiz} from "./reducerRaiz";
import {createStore} from "redux";


export const reduxStore = createStore<IEstadoInicial, DispatchAction, null, null>(reducerRaiz);