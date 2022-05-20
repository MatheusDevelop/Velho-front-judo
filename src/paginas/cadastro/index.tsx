import { AddCircleTwoTone, Filter, Filter1Outlined, FilterAlt, LiveTv } from '@mui/icons-material'
import { Backdrop, CircularProgress, Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import ComponenteCadastro from '../../componentes/cadastro'
import ComponenteListagem from '../../componentes/listagem'
import { ModeloCabecalho } from '../../modelos/ModeloCabecalho'
import { ModeloGrupoInput } from '../../modelos/ModeloGrupoInput'
import { ModeloInput } from '../../modelos/ModeloInput'
import { ModeloLinha } from '../../modelos/ModeloLinha'
import { obterGrupoDeInputs } from '../../servicos/servicosInputs'
import { paraCadaInputDoGrupoDeInputsExecutar } from '../../utilitarios/grupoDeInputsUtilitarios'

interface ITipoProps {
  nomeTabela: string
}
function PaginaCadastro({ nomeTabela }: ITipoProps) {
  const idCliente = 1
  const [secaoAtual, setSecaoAtual] = useState(0)
  const [grupoDeInputs, setGrupoDeInputs] = useState<ModeloGrupoInput[]>()
  const [valoresIniciaisDoFormulario, setValoresIniciaisDoFormulario]: any = useState()
  const [cabecalhosIniciais, setCabecalhosIniciais] = useState<ModeloCabecalho[]>([])
  const [linhasIniciais, setLinhasIniciais] = useState<ModeloLinha[]>([])
  const [carregandoDados, setCarregandoDados] = useState(false)
  const lidarComMudancaEmTab = (event: any, novoValor: number) => {
    setSecaoAtual(novoValor)
  }

  useEffect(() => {
    adicionarInputs()
  }, [])

  const adicionarInputs = async () => {
    try {
      setCarregandoDados(true)
      const conteudo = await obterGrupoDeInputs(nomeTabela, idCliente);
      var inputsEncontrados = conteudo.gruposDeInputs;
      var cabecalhosEncontrados = conteudo.cabecalhos;
      var linhasEncontradas = conteudo.linhas;
      setGrupoDeInputs(inputsEncontrados)
      setCabecalhosIniciais(cabecalhosEncontrados)
      setLinhasIniciais(linhasEncontradas);
      extrairValoresIniciaisParaFormulario(inputsEncontrados)
      setCarregandoDados(false)

    } catch (erro) {
      console.error(erro)
    }
  }
  const extrairValoresIniciaisParaFormulario = (grupoDeInputs: ModeloGrupoInput[]) => {
    let valoresIniciais = extrairValoresIniciaisDoGrupoDeInput(grupoDeInputs)
    setValoresIniciaisDoFormulario(valoresIniciais)
  }
  const extrairValoresIniciaisDoGrupoDeInput = (grupoDeInputs: ModeloGrupoInput[]) => {
    const tiposDeInputsNaoMapeados = ["imagem"]
    let valoresIniciais = {}

    paraCadaInputDoGrupoDeInputsExecutar((input: ModeloInput) => {
      if (tiposDeInputsNaoMapeados.includes(input.tipo)) {
        console.info(input.tipo)
        return
      }
      //Ex Valores Iniciais = {NOME_ATLETA:''}
      valoresIniciais = { ...valoresIniciais, [input.propriedade]: '' }
    }, grupoDeInputs)

    // let valoresIniciais = {
    //   "REGISTRO_FEDERACAO": "123456",
    //   "DATA_FILIACAO": "2022-04-02",
    //   "REGISTRO_CONFEDERACAO": "123456",
    //   "NOME": "John",
    //   "DATA_NASCIMENTO": "2003-04-02",
    //   "ID_AGREMIACAO": "7",
    //   "ID_ESTADO_CIVIL": "1",
    //   "ID_SEXO": "1",
    //   "ID_FAIXA": "1",
    //   "ID_NACIONALIDADE": "26",
    //   "ID_PROFISSAO_ATLETA": "1",
    //   "CPF": "123456",
    //   "IDENTIDADE": "123456",
    //   "DATA_IDENTIDADE": "2003-04-02",
    //   "ID_EMISSOR": "1",
    //   "NOME_MAE": "Mae",
    //   "ID_PROFISSAO_MAE": "1",
    //   "NOME_PAI": "Pai",
    //   "ID_PROFISSAO_PAI": "1",
    //   "TELEFONE": "1194456905",
    //   "EMAIL": "gmail@emai.com",
    //   "CEP": "02872020",
    //   "ENDERECO": "R. lorem ipsum",
    //   "COMPLEMENTO": "Casa 2",
    //   "BAIRRO": "1",
    //   "ID_CIDADE": "1",
    //   "ID_ESTADO": "19",
    //   "ID_PAIS": "26",
    //   "FOTO": ""
    // }
    return valoresIniciais
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={secaoAtual} onChange={lidarComMudancaEmTab}>
          <Tab label="Listagem" />
          <Tab label="Cadastrar" />
        </Tabs>
      </Box>

      <Backdrop
        sx={{ color: '#fff', zIndex: 99 }}
        open={carregandoDados}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {
        grupoDeInputs && valoresIniciaisDoFormulario && secaoAtual == 1 &&
        <ComponenteCadastro setarSecaoAtual={setSecaoAtual} grupoDeInputs={grupoDeInputs} valoresIniciaisDoFormulario={valoresIniciaisDoFormulario} nomeTabela={nomeTabela} />
      }
      {
        cabecalhosIniciais && secaoAtual == 0 && linhasIniciais.length > 0 &&
        <ComponenteListagem setarSecaoAtual={setSecaoAtual} cabecalhos={cabecalhosIniciais} linhas={linhasIniciais} nomeTabela={nomeTabela} />
      }
    </div>
  )


}

export default PaginaCadastro


