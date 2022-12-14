import { Stack, Box, Grid, AlertTitle, Divider, Button, Dialog, DialogActions, DialogTitle, Typography, Backdrop, CircularProgress } from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import BlocoAnotacaoComponente from '../blocoAnotacao'
import ComponentesDeBotoesCadastro from '../botoesCadastro'
import ComponenteGrupoDeInput from '../inputs'
import { ModeloGrupoInput } from '../../modelos/ModeloGrupoInput'
import { validarInputs } from '../../servicos/servicosInputs'
import { atualizarModelo, cadastrarModelo } from '../../servicos/servicosCadastro'
import { ModeloInput } from '../../modelos/ModeloInput'
import { paraCadaInputDoGrupoDeInputsExecutar } from '../../utilitarios/grupoDeInputsUtilitarios'
import { ModeloValidacaoInput } from '../../modelos/ModeloValidacaoInput'
import { paraCadaChaveNoObjetoExecutar } from '../../utilitarios/objetosUtilitarios'
import { ModeloValidacao } from '../../modelos/ModeloValidacao'
import { ComponenteMensagensCadastro } from '../mensagensCadastro'
import { ModeloCampoInsercao } from '../../modelos/ModeloCampoInsercao'
import { ModeloInsercaoEntrada } from '../../modelos/ModeloInsercaoEntrada'
import { excluirEntidade, inserirEntidade } from '../../servicos/servicosEntidades'
import { anexarArquivos, verificarSeAnexoJaExiste } from '../../servicos/servicosAnexos'
import AnexosComponente from '../anexos'
import { lerMensagem } from '../../servicos/servicosMensagem'
import { WarningOutlined } from '@mui/icons-material'


interface ITipoProps {
    grupoDeInputs: ModeloGrupoInput[],
    valoresIniciaisDoFormulario: any,
    nomeTabela: string,
    setarSecaoAtual: any,
    atualizarLeitura: any,
    anotacoesIniciais: string,
    chavePrimariaEntidade?: string,
    nomeChavePrimariaEntidade?: string,
    paginaDeVisualizacao: boolean,
    idCliente: number,
    temPermissao: any
}
function ComponenteCadastro({ temPermissao, idCliente, atualizarLeitura, grupoDeInputs, valoresIniciaisDoFormulario, nomeTabela, setarSecaoAtual, anotacoesIniciais, paginaDeVisualizacao, chavePrimariaEntidade, nomeChavePrimariaEntidade }: ITipoProps) {
    const [validacoes, setValidacoes] = useState<ModeloValidacao[]>()
    const [anotacoes, setAnotacoes] = useState(anotacoesIniciais)
    const [abrirAnotacoes, setAbrirAnotacoes] = useState(false)
    const [alteracaoSendoFeita, setAlteracaoSendoFeita] = useState(!paginaDeVisualizacao)
    const [abrirAnexos, setAbrirAnexos] = useState(false)
    const [inserindoCadastro, setInserindoCadastro] = useState(false)
    const lidarComMudancasDosInputs = async (valores: any) => {
        let inputsParaValidar: ModeloValidacaoInput[] = extrairInputsParaValidar(valores)
        const validacoes = await obterValidacaoDosInputs(inputsParaValidar)
        if (validacoes == null) return
        setValidacoes(validacoes)
        let validacoesDeErros = extrairErrosDeValidacaoParaFormik(validacoes)
        return validacoesDeErros;
    }
    const lidarComEventoDeSubmit = async (valores: any) => {
        let campos: ModeloCampoInsercao[] = []
        paraCadaChaveNoObjetoExecutar((nomeDaPropriedade: any) => {
            const valor = valores[nomeDaPropriedade];
            if (valor == "") return;
            const valorEhForeignKey = nomeDaPropriedade.substring(0, 3) == "ID_";
            const tamanhoMinimoDeUmaStringBase64 = 200
            const valorEhArquivo: boolean = valor.length > tamanhoMinimoDeUmaStringBase64
            const campo: ModeloCampoInsercao = {
                valor,
                coluna: nomeDaPropriedade,
                tipoString: !valorEhForeignKey,
                tipoArquivo: valorEhArquivo
            }
            campos.push(campo)
        }, valores)

        campos.push({
            tipoString: false,
            tipoArquivo: false,
            valor: `${idCliente}`,
            coluna: 'ID_CLIENTE'
        })

        if (anotacoes != '')
            campos.push({
                tipoString: true,
                tipoArquivo: false,
                valor: anotacoes,
                coluna: 'ANOTACOES'
            })
        try {
            const modeloInsercao: ModeloInsercaoEntrada = {
                tabela: nomeTabela,
                campos
            }
            setInserindoCadastro(true)
            if (chavePrimariaEntidade && nomeChavePrimariaEntidade)
                await inserirEntidade(modeloInsercao, chavePrimariaEntidade, nomeChavePrimariaEntidade)
            else {
                const { idChavePrimaria } = await inserirEntidade(modeloInsercao)
                if (arquivosASeremAnexados.length > 0) {
                    setAnexandoArquivos(true)
                    await adicionarAnexos(nomeTabela, idChavePrimaria, idCliente, arquivosASeremAnexados);
                }
            }
            setInserindoCadastro(false)

            atualizarLeitura()
            setarSecaoAtual(0)
        } catch (erro) {
            console.error(erro)
        }

    }
    const obterValidacaoDosInputs = async (inputsParaValidar: ModeloValidacaoInput[]) => {
        try {
            const validacoes = await validarInputs({
                tabela: nomeTabela,
                idCliente: idCliente,
                idEntidade: chavePrimariaEntidade,
                campos: inputsParaValidar
            })
            return validacoes;
        } catch (erro) {
            console.error(erro)
        }
    }
    const extrairErrosDeValidacaoParaFormik = (validacoes: ModeloValidacao[]) => {
        let errosDeValidacao: any = {};
        validacoes.map((validacao) => {
            if (validacao.tipo == 'ERRO')
                errosDeValidacao[validacao.propriedade] = validacao.mensagem
        })
        return errosDeValidacao
    }
    const extrairInputsParaValidar = (valores: any) => {
        let inputsParaValidar: ModeloValidacaoInput[] = []
        paraCadaChaveNoObjetoExecutar((chaveDoObjetoValores: any) => {
            let valorDigitadoNoInput = valores[chaveDoObjetoValores]

            let nomeDoInputParaValidar = chaveDoObjetoValores
            paraCadaInputDoGrupoDeInputsExecutar((input: ModeloInput) => {
                if (input.propriedade == nomeDoInputParaValidar)
                    inputsParaValidar.push({ valor: input.mascara ? valorDigitadoNoInput.replace(/[^a-zA-Z0-9]/g, '') : valorDigitadoNoInput, validadores: input.validadores, propriedade: input.propriedade })
            }, grupoDeInputs)
        }, valores)
        return inputsParaValidar;
    }
    const [abrirCancelarDialog, setAbrirCancelarDialog] = useState(false)
    const lidarComClickEmCancelar = (toques: any) => {
        let usuarioJaTocousNosInputs = Object.values(toques).length > 0
        if (usuarioJaTocousNosInputs) {
            setAbrirCancelarDialog(true)
            return;
        }
        setarSecaoAtual(0);
    }
    const lidarComClickEmAnotar = () => {
        setAbrirAnotacoes(true);
    }
    const lidarComClickEmFecharAnotacoes = () => {
        setAbrirAnotacoes(false)
    }
    const [mostrarDialogAnexado, setMostrarDialogAnexado] = useState(false)
    const [mostrarDialogAnexoExistente, setMostrarDialogAnexoExistente] = useState(false)
    const [mensagemDeAnexoExistente, setMensagemDeAnexoExistente] = useState({
        tipo: '',
        mensagem: ''
    })


    const [anexandoArquivos, setAnexandoArquivos] = useState(false)
    const [arquivosASeremAnexados, setArquivosASeremAnexados] = useState<any>()

    const lidarComClickEmAnexar = async (arquivos: any) => {
        try {
            if (paginaDeVisualizacao) {
                if (chavePrimariaEntidade) {
                    setAnexandoArquivos(true)
                    const verificacaoDoAnexo = await verificarSeAnexoJaExiste(nomeTabela, chavePrimariaEntidade, idCliente, arquivos);
                    if (verificacaoDoAnexo.existente) {
                        if (mensagemDeAnexoExistente.mensagem === '') {
                            const { mensagem, tipo } = await lerMensagem('ANXEX')
                            setMensagemDeAnexoExistente({ mensagem, tipo });
                        }
                        setArquivosASeremAnexados(arquivos)
                        setMostrarDialogAnexoExistente(true)
                        return;
                    }
                    await adicionarAnexos(nomeTabela, chavePrimariaEntidade, idCliente, arquivos)
                }
            }
            if (!paginaDeVisualizacao) {
                setArquivosASeremAnexados(arquivos)
            }

        } catch (erro) {
            console.error(erro)
        }
    }
    const adicionarAnexos = async (nomeTabela: string, chavePrimariaEntidade: string | undefined, idCliente: number, arquivos: any) => {
        try {
            if (!chavePrimariaEntidade)
                return;
            await anexarArquivos(nomeTabela, chavePrimariaEntidade, idCliente, arquivos)
            setAnexandoArquivos(false)
            setMostrarDialogAnexado(true)
            setMostrarDialogAnexoExistente(false)
        } catch (erro) {
            console.error(erro)
        }
    }
    const [abrirDialogExcluir, setAbrirDialogExcluir] = useState(false)
    const lidarComClickEmExcluir = () => {
        setAbrirDialogExcluir(true)
    }
    const excluirRegistro = async () => {
        try {
            if (chavePrimariaEntidade && nomeChavePrimariaEntidade)
                await excluirEntidade(nomeTabela, nomeChavePrimariaEntidade, chavePrimariaEntidade, idCliente)
            atualizarLeitura();
            setarSecaoAtual(0);
        } catch (erro) {
            console.error(erro)
        }
    }
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: 99 }}
                open={inserindoCadastro}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Dialog
                open={mostrarDialogAnexoExistente}
                onClose={() => setMostrarDialogAnexoExistente(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginTop: 12, marginRight: 14 }}>
                        {mensagemDeAnexoExistente.tipo == 'ALER' && <WarningOutlined color="warning" />}
                    </div>
                    <div>
                        {mensagemDeAnexoExistente.mensagem}
                    </div>
                </DialogTitle>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button variant="contained" onClick={() => setMostrarDialogAnexoExistente(false)} autoFocus>
                        N??o
                    </Button>
                    <Button variant="contained" onClick={() => adicionarAnexos(nomeTabela, chavePrimariaEntidade, idCliente, arquivosASeremAnexados)} autoFocus>
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={mostrarDialogAnexado}
                onClose={() => setMostrarDialogAnexado(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Arquivo anexado com sucesso"}
                </DialogTitle>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button variant="contained" onClick={() => setMostrarDialogAnexado(false)} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={abrirCancelarDialog}
                onClose={() => setAbrirCancelarDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Deseja mesmo cancelar? Suas altera????es n??o ser??o salvas."}
                </DialogTitle>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button variant="contained" onClick={() => setarSecaoAtual(0)}>Sim</Button>
                    <Button variant="contained" onClick={() => setAbrirCancelarDialog(false)} autoFocus>
                        N??o
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={abrirDialogExcluir}
                onClose={() => setAbrirDialogExcluir(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Deseja mesmo excluir esse registro?"}
                </DialogTitle>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button variant="contained" onClick={excluirRegistro}>Excluir</Button>
                    <Button variant="contained" onClick={() => setAbrirDialogExcluir(false)} autoFocus>
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
            <Stack sx={{ flex: 1, backgroundColor: "#ccc", pt: 1 }}>
                <Formik
                    initialValues={valoresIniciaisDoFormulario}
                    onSubmit={lidarComEventoDeSubmit}
                    validate={lidarComMudancasDosInputs}
                    autoComplete="off"
                >
                    {({ errors, touched }) => {
                        return (
                            <Form>
                                <Box padding={2} mb={3} sx={{ flex: 1 }} >
                                    <Stack>
                                        {
                                            grupoDeInputs.map(grupo => (
                                                <Stack>
                                                    <ComponenteGrupoDeInput
                                                        alteracaoSendoFeita={alteracaoSendoFeita}
                                                        apenasLeitura={paginaDeVisualizacao}
                                                        titulo={grupo.nome}
                                                        erros={errors}
                                                        inputs={grupo.inputs}
                                                        usuarioTocouNoInput={touched}
                                                    />
                                                    <Divider />
                                                </Stack>
                                            ))
                                        }
                                    </Stack>
                                    {
                                        validacoes &&
                                        <ComponenteMensagensCadastro toquesDosInputs={touched} validacoes={validacoes} grupoDeInputs={grupoDeInputs} />
                                    }
                                </Box>
                                <Box sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 98 }}>
                                    <ComponentesDeBotoesCadastro
                                        anexandoArquivos={anexandoArquivos}
                                        alteracaoSendoFeita={alteracaoSendoFeita}
                                        temPermissao={temPermissao}
                                        lidarComClickEmVisualizar={() => setAbrirAnexos(true)}
                                        lidarComClickEmAnexar={lidarComClickEmAnexar}
                                        lidarComClickEmCancelar={() => lidarComClickEmCancelar(touched)}
                                        lidarComClickEmAnotar={lidarComClickEmAnotar}
                                        lidarComClickEmExcluir={lidarComClickEmExcluir}
                                        lidarComClickEmEditar={() => setAlteracaoSendoFeita(true)}
                                        paginaDeVisualizacao={paginaDeVisualizacao}
                                        formularioEhValido={Object.keys(errors).length == 0}
                                    />
                                </Box>
                            </Form>

                        )
                    }
                    }
                </Formik>
            </Stack >
            <BlocoAnotacaoComponente
                anotacao={anotacoes}
                setAnotacao={setAnotacoes}
                aberto={abrirAnotacoes}
                lidarComClickEmFechar={lidarComClickEmFecharAnotacoes}
            />
            {
                chavePrimariaEntidade &&
                <AnexosComponente
                    idCliente={idCliente}
                    nomeTabela={nomeTabela}
                    idEntidade={chavePrimariaEntidade}
                    mostrarAnexos={abrirAnexos}
                    setMostrarAnexos={setAbrirAnexos}
                />
            }
        </>

    )






}

export default ComponenteCadastro


