import { Stack, Box, Grid } from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import BlocoAnotacaoComponente from '../blocoAnotacao'
import ComponentesDeBotoesCadastro from '../botoesCadastro'
import * as Yup from 'yup'
import ComponenteGrupoDeInput from '../inputs'
import { ModeloGrupoInput } from '../../modelos/ModeloGrupoInput'
import { ValidarInputs } from '../../servicos/servicosInputs'
import { atualizarModelo, cadastrarModelo } from '../../servicos/servicosCadastro'
const baseUrl = 'https://localhost:7082/api/v1'

function ComponenteCadastro(props: {
    grupoInputs: ModeloGrupoInput[],
    nomeApi: string,
    setPage: any,
    valoresIniciais?: any
}) {
    const [idCliente, setClientId] = useState(1)
    const [paginaApenasLeitura, setPaginaApenasLeitura] = useState(false)
    const [abrirAnotacao, setAbrirAnotacao] = useState(false)
    const [anotacao, setAnotacao] = useState('')
    const [propriedadeDosInputs, setPropriedadeDosInputs]: any = useState({})
    const [possuiArquivo, setPossuiArquivo] = useState(false)
    const lidarComClickEmSalvar = async (valores: any) => {
        let modelo = valores
        if (anotacao != '')
            modelo = { ...valores, anotacao }

        modelo = { ...modelo, clientId: idCliente }

        const conteudo = props.valoresIniciais ?
            await atualizarModelo(props.nomeApi, modelo, possuiArquivo, props.valoresIniciais.id)
            :
            await cadastrarModelo(props.nomeApi, modelo, possuiArquivo);

        if (conteudo.success) {
            props.valoresIniciais ?
                alert("Atualizado com sucesso")
                :
                alert("Cadastrado com sucesso")
            props.setPage(0)
        }
    }
    const esquemaDeValidacao = async (values: any) => {
        const erros: any = {}
        let valoresFiltrados = {}
        Object.keys(values).forEach(chave => {
            if (values[chave] instanceof File) {
                setPossuiArquivo(true)
                return
            }
            valoresFiltrados = { ...valoresFiltrados, [chave]: values[chave] }
        })
        console.log('EhUpdate', props.valoresIniciais != null)
        const validacoes = await ValidarInputs(props.nomeApi, { ...valoresFiltrados, clientId: idCliente }, props.valoresIniciais != null);
        if (validacoes.status == 400)
            Object.keys(validacoes.errors).forEach((key) => {
                erros[key] = validacoes.errors[key][0]
            });
        return erros;
    }

    const adicionarPropriedadesDosInputs = () => {
        let propriedades = {}
        props.grupoInputs.map(grupo => grupo.inputs.map(input => {
            if (input.tipo != "imagem")
                propriedades = { ...propriedades, [input.propriedade]: '' }
        }))
        setPropriedadeDosInputs(propriedades)
    }
    const adicionarValoresExistentesDosInputs = () => {
        let propriedades = {}
        Object.keys(props.valoresIniciais).forEach(chave => {
            let normal = chave;
            let capitalizado = normal[0].toUpperCase() + normal.substring(1)
            if (capitalizado.length == 3)
                capitalizado = capitalizado.toUpperCase()
            propriedades = { ...propriedades, [capitalizado]: props.valoresIniciais[chave] }
        })
        setPropriedadeDosInputs(propriedades)
    }

    useEffect(() => {
        if (props.valoresIniciais) {
            setPaginaApenasLeitura(true)
            adicionarValoresExistentesDosInputs();
        }
        else
            adicionarPropriedadesDosInputs()
    }, [])
    return (
        <>
            <Stack sx={{ flex: 1, backgroundColor: "#cccccc" }}>
                <Formik
                    initialValues={propriedadeDosInputs}
                    onSubmit={lidarComClickEmSalvar}
                    enableReinitialize={paginaApenasLeitura}
                    validate={esquemaDeValidacao}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Box padding={2} sx={{ flex: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={7}>
                                        <Stack>
                                            <ComponenteGrupoDeInput
                                                apenasLeitura={paginaApenasLeitura}
                                                titulo={props.grupoInputs[0].nome}
                                                erros={errors}
                                                inputs={props.grupoInputs[0].inputs}
                                                usuarioTocouNoInput={touched}
                                            />
                                        </Stack>
                                        {
                                            props.grupoInputs[3] &&
                                            <Stack mt={2}>
                                                <ComponenteGrupoDeInput
                                                    apenasLeitura={paginaApenasLeitura}
                                                    titulo={props.grupoInputs[3].nome}
                                                    erros={errors}
                                                    inputs={props.grupoInputs[3].inputs}
                                                    usuarioTocouNoInput={touched}
                                                />
                                            </Stack>
                                        }
                                    </Grid>
                                    <Grid item xs>
                                        {
                                            props.grupoInputs[1] &&
                                            <Stack>
                                                <ComponenteGrupoDeInput
                                                    apenasLeitura={paginaApenasLeitura}
                                                    titulo={props.grupoInputs[1].nome}
                                                    erros={errors}
                                                    inputs={props.grupoInputs[1].inputs}
                                                    usuarioTocouNoInput={touched}
                                                />
                                            </Stack>
                                        }
                                        {
                                            props.grupoInputs[2] &&
                                            <Stack mt={2}>
                                                <ComponenteGrupoDeInput
                                                    apenasLeitura={paginaApenasLeitura}
                                                    titulo={props.grupoInputs[2].nome}
                                                    erros={errors}
                                                    inputs={props.grupoInputs[2].inputs}
                                                    usuarioTocouNoInput={touched}
                                                />
                                            </Stack>
                                        }
                                    </Grid>
                                </Grid >
                            </Box >
                            <Box sx={{ height: 100 }}>
                                <Box sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 99 }}>
                                    <ComponentesDeBotoesCadastro
                                        lidarComClickEmEditar={() => setPaginaApenasLeitura(false)}
                                        setPage={props.setPage}
                                        nomeApi={props.nomeApi}
                                        idModelo={props.valoresIniciais && props.valoresIniciais.id}
                                        apenasLeitura={paginaApenasLeitura}
                                        lidarComClickEmAbrirAnotacao={() => setAbrirAnotacao(true)}
                                    />
                                </Box>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Stack >
            <BlocoAnotacaoComponente
                anotacao={anotacao}
                setAnotacao={setAnotacao}
                aberto={abrirAnotacao}
                lidarComClickEmFechar={() => setAbrirAnotacao(false)}
            />
        </>

    )
}

export default ComponenteCadastro
