import { AddCircleTwoTone, Filter, Filter1Outlined, FilterAlt, LiveTv } from '@mui/icons-material'
import { AppBar, Backdrop, Breadcrumbs, CircularProgress, IconButton, Link, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import ComponenteCadastro from '../../componentes/cadastro'
import ComponenteListagem from '../../componentes/listagem'
import MenuComponente from '../../componentes/menu'
import { ModeloCabecalho } from '../../modelos/ModeloCabecalho'
import { ModeloGrupoInput } from '../../modelos/ModeloGrupoInput'
import { ModeloInput } from '../../modelos/ModeloInput'
import { ModeloLinha } from '../../modelos/ModeloLinha'
import { IEstadoInicial, IModeloPermissao } from '../../redux/reducerRaiz'
import { obterGrupoDeInputs } from '../../servicos/servicosInputs'
import { paraCadaInputDoGrupoDeInputsExecutar } from '../../utilitarios/grupoDeInputsUtilitarios'

interface ITipoProps {
  nomeTabela: string
}
function PaginaCadastro({ nomeTabela }: ITipoProps) {

  const { idCliente, nomeMenuAtual, permissoes } = useSelector<IEstadoInicial, { idCliente: number, nomeMenuAtual: string, permissoes: IModeloPermissao[] }>((estado: IEstadoInicial) => {
    return {
      idCliente: estado.idCliente,
      nomeMenuAtual: estado.menuAtual,
      permissoes: estado.permissoes
    }
  });


  const [secaoAtual, setSecaoAtual] = useState(0)
  const [anotacoesIniciais, setAnotacoesIniciais] = useState('')
  const [grupoDeInputs, setGrupoDeInputs] = useState<ModeloGrupoInput[]>()
  const [valoresIniciaisDoFormulario, setValoresIniciaisDoFormulario]: any = useState()
  const [valoresJaPreenchidosDoFormulario, setValoresJaPreenchidosDoFormulario]: any = useState()
  const [cabecalhosIniciais, setCabecalhosIniciais] = useState<ModeloCabecalho[]>([])
  const [linhasIniciais, setLinhasIniciais] = useState<ModeloLinha[]>([])
  const [chavePrimariaEntidade, setChavePrimariaEntidade] = useState('')
  const [nomeChavePrimaria, setNomeChavePrimaria] = useState('')
  const [carregandoDados, setCarregandoDados] = useState(true)
  const [atualizarLeitura, setAtualizarLeitura] = useState(0)
  const lidarComMudancaEmTab = (event: any, novoValor: number) => {
    setSecaoAtual(novoValor)
  }
  const location = useLocation();
  useEffect(() => {
  }, [permissoes])

  useEffect(() => {
    adicionarInputs()
  }, [atualizarLeitura])
  useEffect(() => {
    setCarregandoDados(true)
    adicionarInputs()
  }, [location])


  const adicionarInputs = async () => {
    try {
      if (atualizarLeitura > 0)
        setCarregandoDados(true)
      setLinhasIniciais([])
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
      valoresIniciais = { ...valoresIniciais, [input.propriedade]: input.valor }
    }, grupoDeInputs)
    return valoresIniciais
  }
  const lidarComClickEmLinhaGrid = (inputs: { nome: string, valor: string }[], chavePrimaria: string, nomeDaChavePrimaria: string) => {
    let valores = {}
    inputs.map(input => {
      if (input.nome == "ANOTACAO") {
        setAnotacoesIniciais(input.valor)
        return
      }
      valores = { ...valores, [input.nome]: input.valor }
    })
    setValoresJaPreenchidosDoFormulario(valores)
    setChavePrimariaEntidade(chavePrimaria)
    setNomeChavePrimaria(nomeDaChavePrimaria)
    setSecaoAtual(2)
  }
  const temPermissao = temPermissaoParaAcessar(permissoes, nomeMenuAtual)
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: 96 }}>

        <Box sx={{ borderBottom: 1, borderColor: '#00000021', position: "fixed", top: 48, zIndex: 89, background: 'white', width: '100%', px: 2 }}>
          <Tabs
            sx={{ height: 55 }}
            value={secaoAtual}
            onChange={lidarComMudancaEmTab}
          >
            <Tab
              label="Listagem"
              sx={{ borderRight: '1px solid #00000021!important', borderLeft: '1px solid #00000021!important' }}
              disabled={secaoAtual >= 1}
            />

            {
              temPermissao('2') &&
              <Tab label="Detalhes" sx={{ height:'55px',borderRight: '1px solid #00000021!important' }} value={secaoAtual == 2 ? 2 : 1} disabled={secaoAtual < 1} />
            }
          </Tabs>
        </Box>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: 99 }}
        open={carregandoDados}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {
        grupoDeInputs && valoresIniciaisDoFormulario && chavePrimariaEntidade && secaoAtual == 2 &&
        <ComponenteCadastro
          temPermissao={temPermissao}
          idCliente={idCliente}
          atualizarLeitura={() => {
            setAtualizarLeitura(e => e + 1)
          }} nomeChavePrimariaEntidade={nomeChavePrimaria} chavePrimariaEntidade={chavePrimariaEntidade} paginaDeVisualizacao anotacoesIniciais={anotacoesIniciais} setarSecaoAtual={setSecaoAtual} grupoDeInputs={grupoDeInputs} valoresIniciaisDoFormulario={valoresJaPreenchidosDoFormulario} nomeTabela={nomeTabela} />
      }
      {
        grupoDeInputs && valoresIniciaisDoFormulario && secaoAtual == 1 &&
        <ComponenteCadastro
          temPermissao={temPermissao}
          idCliente={idCliente}
          atualizarLeitura={() => {
            setAtualizarLeitura(e => e + 1)
          }}
          paginaDeVisualizacao={false} anotacoesIniciais={""} setarSecaoAtual={setSecaoAtual} grupoDeInputs={grupoDeInputs} valoresIniciaisDoFormulario={valoresIniciaisDoFormulario} nomeTabela={nomeTabela} />
      }
      {
        cabecalhosIniciais && secaoAtual == 0 && linhasIniciais.length > 0 &&

        <ComponenteListagem temPermissao={temPermissao} lidarComClickEmLinhaGrid={lidarComClickEmLinhaGrid} carregando={carregandoDados} setarSecaoAtual={setSecaoAtual} cabecalhos={cabecalhosIniciais} linhas={linhasIniciais} nomeTabela={nomeTabela} />
      }
      {
        cabecalhosIniciais && secaoAtual == 0 && linhasIniciais.length == 0 &&
        <ComponenteListagem temPermissao={temPermissao} lidarComClickEmLinhaGrid={lidarComClickEmLinhaGrid} carregando={carregandoDados} setarSecaoAtual={setSecaoAtual} cabecalhos={cabecalhosIniciais} linhas={linhasIniciais} nomeTabela={nomeTabela} />
      }



    </div >
  )


}

export default PaginaCadastro


function temPermissaoParaAcessar(permissoes: IModeloPermissao[], nomeMenuAtual: string) {
  return (idPermissao: string) => {
    return permissoes.find(e => e.funcaoMenu == nomeMenuAtual && e.idsTipoOperacoes.includes(idPermissao) || e.idsTipoOperacoes.includes("12"))
  }
}

