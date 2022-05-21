import { Stack, Box, Grid, AlertTitle } from '@mui/material'
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
import { inserirEntidade } from '../../servicos/servicosEntidades'

interface ITipoProps {
    grupoDeInputs: ModeloGrupoInput[],
    valoresIniciaisDoFormulario: any,
    nomeTabela: string,
    setarSecaoAtual: any
}
function ComponenteCadastro({ grupoDeInputs, valoresIniciaisDoFormulario, nomeTabela, setarSecaoAtual }: ITipoProps) {
    const idCliente = 1;
    const [validacoes, setValidacoes] = useState<ModeloValidacao[]>()
    const [anotacoes, setAnotacoes] = useState('')
    const [abrirAnotacoes, setAbrirAnotacoes] = useState(false)

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

            await inserirEntidade(modeloInsercao)
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
                    inputsParaValidar.push({ valor: valorDigitadoNoInput, validadores: input.validadores, propriedade: input.propriedade })
            }, grupoDeInputs)
        }, valores)
        return inputsParaValidar;
    }
    const lidarComClickEmCancelar = () => {
        setarSecaoAtual(0);
    }
    const lidarComClickEmAnotar = () => {
        setAbrirAnotacoes(true);
    }
    const lidarComClickEmFecharAnotacoes = () => {
        setAbrirAnotacoes(false)
    }

    return (
        <>
            <Stack sx={{ flex: 1, backgroundColor: "#cccccc" }}>
                <Formik
                    initialValues={valoresIniciaisDoFormulario}
                    onSubmit={lidarComEventoDeSubmit}
                    validate={lidarComMudancasDosInputs}
                >
                    {({ errors, touched }) => {
                        return (
                            <Form>
                                <Box padding={2} sx={{ flex: 1}} >
                                    <Grid container spacing={2}>
                                        <Grid item xs={7}>
                                            <Stack>
                                                <ComponenteGrupoDeInput
                                                    apenasLeitura={false}
                                                    titulo={grupoDeInputs[0].nome}
                                                    erros={errors}
                                                    inputs={grupoDeInputs[0].inputs}
                                                    usuarioTocouNoInput={touched}
                                                />
                                            </Stack>
                                            {
                                                grupoDeInputs[3] &&
                                                <Stack mt={2}>
                                                    <ComponenteGrupoDeInput
                                                        apenasLeitura={false}
                                                        titulo={grupoDeInputs[3].nome}
                                                        erros={errors}
                                                        inputs={grupoDeInputs[3].inputs}
                                                        usuarioTocouNoInput={touched}
                                                    />
                                                </Stack>
                                            }
                                        </Grid>
                                        <Grid item xs>
                                            {
                                                grupoDeInputs[1] &&
                                                <Stack>
                                                    <ComponenteGrupoDeInput
                                                        apenasLeitura={false}
                                                        titulo={grupoDeInputs[1].nome}
                                                        erros={errors}
                                                        inputs={grupoDeInputs[1].inputs}
                                                        usuarioTocouNoInput={touched}
                                                    />
                                                </Stack>
                                            }
                                            {
                                                grupoDeInputs[2] &&
                                                <Stack mt={2}>
                                                    <ComponenteGrupoDeInput
                                                        apenasLeitura={false}
                                                        titulo={grupoDeInputs[2].nome}
                                                        erros={errors}
                                                        inputs={grupoDeInputs[2].inputs}
                                                        usuarioTocouNoInput={touched}
                                                    />
                                                </Stack>
                                            }
                                        </Grid>
                                    </Grid>
                                    {
                                        validacoes &&
                                        <ComponenteMensagensCadastro toquesDosInputs={touched} validacoes={validacoes} grupoDeInputs={grupoDeInputs} />
                                    }
                                </Box>
                                <Box sx={{ height: 100 }}>
                                    <Box sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 99 }}>
                                        <ComponentesDeBotoesCadastro
                                            lidarComClickEmCancelar={lidarComClickEmCancelar}
                                            lidarComClickEmAnotar={lidarComClickEmAnotar}
                                            paginaDeLeitura={false}
                                            formularioEhValido={Object.keys(errors).length == 0
                                            }
                                        />
                                    </Box>
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
        </>

    )






}

export default ComponenteCadastro


