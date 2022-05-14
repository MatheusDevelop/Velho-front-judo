import { ModeloGrupoInput } from "../modelos/ModeloGrupoInput"
import { ModeloInput } from "../modelos/ModeloInput"

export function paraCadaInputDoGrupoDeInputsExecutar(funcao: Function, grupoDeInputs: ModeloGrupoInput[]) {
    return grupoDeInputs.map(grupo => grupo.inputs.map(input => 
        funcao(input)
    ))
}
