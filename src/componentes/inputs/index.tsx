import { AddAPhotoOutlined, AddOutlined, AddPhotoAlternateOutlined, CloseOutlined, DeleteOutlined, EditOutlined, Image, InputSharp, InputTwoTone, PhotoCameraBackTwoTone, PhotoOutlined } from "@mui/icons-material";
import { Stack, Paper, Typography, Divider, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Avatar, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { Field, useFormikContext } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { ModeloFiltroOpcaoSelect } from "../../modelos/ModeloFiltroOpcaoSelect";
import { ModeloInput } from "../../modelos/ModeloInput";
import { filtrarEnderecos } from "../../servicos/servicosFiltros";
import InputMask from 'react-input-mask'
import { useSelector } from "react-redux";
import { IEstadoInicial } from "../../redux/reducerRaiz";
export default function ComponenteGrupoDeInputs(props: {
    titulo: string,
    apenasLeitura?: boolean,
    alteracaoSendoFeita: boolean,
    erros: any,
    usuarioTocouNoInput: any
    inputs: ModeloInput[]
}) {
    const { idCliente } = useSelector<IEstadoInicial, { idCliente: number }>((estado: IEstadoInicial) => {
        return {
            idCliente: estado.idCliente
        }
    });
    const formikProps: any = useFormikContext()
    const [imagensPrevisualizacao, setImagensPrevisualizacao]: any = useState({})
    const [inputsDesabilitados, setInputsDesabilitados] = useState<string[]>([])
    const [possuiFiltrosDeInputsRelacionadosComEndereco, setPossuiFiltrosDeInputsRelacionadosComEndereco] = useState(false)
    const [filtrosDeOpcoesSelect, setFiltrosDeOpcoesSelect] = useState<ModeloFiltroOpcaoSelect[]>([])
    const lidarComMudancaEmInputArquivo = async (evento: React.ChangeEvent<HTMLInputElement>, propriedade: string) => {
        if (evento.target.files != null) {
            try {

                const base64Imagem = await transformarArquivoEmBase64(evento.target.files[0])
                console.log(base64Imagem)
                formikProps.setFieldValue(propriedade, base64Imagem)

            } catch (erro) {
                console.error(erro)
            }
        }
    }
    const transformarArquivoEmBase64 = (arquivo: any) => new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.readAsDataURL(arquivo);
        leitor.onload = () => resolve(leitor.result);
        leitor.onerror = error => reject(error);
    });

    useEffect(() => {
        if (!props.apenasLeitura)
            verificarSeExisteSelectsDeEnderecosAninhados()
    }, [])

    const verificarSeExisteSelectsDeEnderecosAninhados = () => {
        let inputsRelacionadosEncontrados = 0
        props.inputs.map(input => {
            if (input.propriedade == "ID_PAIS")
                inputsRelacionadosEncontrados++
            if (input.propriedade == "ID_ESTADO")
                inputsRelacionadosEncontrados++
            if (input.propriedade == "ID_CIDADE")
                inputsRelacionadosEncontrados++
        })
        let numeroDeInputsNecessariosParaFiltrarOsSelects = 3
        if (inputsRelacionadosEncontrados == numeroDeInputsNecessariosParaFiltrarOsSelects) {
            // Primeiro o usuario seleciona o pais, depois vai liberando os selects relacionados. De inicio esses selects ficam desabilitados
            setInputsDesabilitados(["ID_CIDADE", "ID_ESTADO"])

            formikProps.setFieldValue("ID_PAIS", '26')

            lidarComMudancaEmSelectDePaises('26')
            setPossuiFiltrosDeInputsRelacionadosComEndereco(true)
        }
    }

    const lidarComMudancaEmSelectDePaises = async (idPais: string) => {
        setInputsDesabilitados(["ID_CIDADE", "ID_ESTADO"])
        formikProps.setFieldValue("ID_CIDADE", '')
        formikProps.setFieldValue("ID_ESTADO", '')

        const filtros = await filtrarEnderecos(idPais, idCliente);
        setFiltrosDeOpcoesSelect(filtros)
        if (filtros[0].opcoes.length > 0)
            //Habilita ID_ESTADO e desabilita apenas ID_CIDADE
            setInputsDesabilitados(["ID_CIDADE"])
    }
    const lidarComMudancaEmSelectDeEstados = async (idEstado: string) => {
        formikProps.setFieldValue("ID_CIDADE", '')
        const filtros = await filtrarEnderecos(formikProps.values["ID_PAIS"], idCliente, idEstado);
        const filtroDeEstadosAtual = filtrosDeOpcoesSelect[0];
        const novoFiltro = [filtroDeEstadosAtual, filtros[1]];
        if (filtros[0].opcoes.length > 0) {
            setFiltrosDeOpcoesSelect(novoFiltro);
            setInputsDesabilitados([])
        }
    }

    return (
        <Box sx={{ background: 'white', padding: 2 }}>
            <Grid container my={1} sx={{ alignItems: "center" }}>
                {
                    props.inputs.map((input, idx) => (
                        input.tipo == "imagem" &&
                        <Grid item key={idx} sx={{ mr: 4, position: "relative", display: "flex", flexDirection: "column", border: '1px solid #00000020', padding: 2 }} alignItems="center">


                            <Avatar
                                variant="square"
                                src={formikProps.values[input.propriedade] || ''}
                                sx={{ width: 120, height: 160 }}
                            >
                                <Image />
                            </Avatar>

                            <input accept=".jpg" hidden type="file" id={input.propriedade} onChange={(e) => lidarComMudancaEmInputArquivo(e, input.propriedade)} />
                            <Box mt={2} sx={{ flexDirection: "row" }}>
                                <IconButton
                                    sx={{ mr: 1 }}
                                    disabled={!props.alteracaoSendoFeita || formikProps.values[input.propriedade]}
                                    color="primary"
                                    onClick={() => {
                                        let elemento = document.getElementById(input.propriedade);
                                        elemento?.click()
                                    }}>
                                    <AddPhotoAlternateOutlined />
                                </IconButton>
                                <IconButton
                                    sx={{ mr: 1 }}
                                    disabled={!props.alteracaoSendoFeita || !formikProps.values[input.propriedade]}
                                    color="primary"
                                    onClick={() => {
                                        let elemento = document.getElementById(input.propriedade);
                                        elemento?.click()
                                    }}>


                                    <EditOutlined />
                                </IconButton>

                                <IconButton
                                    color="primary"
                                    disabled={!props.alteracaoSendoFeita || !formikProps.values[input.propriedade]}
                                    onClick={() => formikProps.setFieldValue(input.propriedade, "")}
                                >
                                    <DeleteOutlined />
                                </IconButton>
                            </Box>
                        </Grid>
                    ))
                }
                <Grid xs item>
                    <Grid container>
                        <Grid item container xs spacing={2} sx={{ flexWrap: 'wrap' }}>
                            {
                                props.inputs.map((input, idx) => (
                                    input.tipo != "imagem" &&
                                    <>
                                        {
                                            input.quebrarLinha &&
                                            <div style={{ flexBasis: '100%', height: 0 }} />
                                        }
                                        <Grid
                                            key={idx}
                                            item
                                            xs={"auto"}
                                        >
                                            {input.mascara != null ?
                                                <>
                                                    <InputMask
                                                        mask={input.mascara.replace("#", "-")}
                                                        onBlur={e => {
                                                            formikProps.setFieldTouched(input.propriedade)
                                                        }}
                                                        value={formikProps.values[input.propriedade]}
                                                        disabled={inputsDesabilitados.includes(input.propriedade) || !props.alteracaoSendoFeita}
                                                        onChange={e => {
                                                            formikProps.setFieldValue(input.propriedade, e.target.value)
                                                        }}>
                                                        <TextField
                                                            required={input.requerido}
                                                            error={props.erros[input.propriedade] && props.usuarioTocouNoInput[input.propriedade]}
                                                            label={input.nome}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </InputMask>
                                                </>
                                                :
                                                <Field
                                                    name={input.propriedade}
                                                    type={input.tipo}
                                                    select={input.tipo == "select"}
                                                    as={TextField}
                                                    disabled={inputsDesabilitados.includes(input.propriedade) || !props.alteracaoSendoFeita}
                                                    required={input.requerido}
                                                    error={props.erros[input.propriedade] && props.usuarioTocouNoInput[input.propriedade]}
                                                    label={input.nome}
                                                    variant="outlined"
                                                    size="small"
                                                    id={input.propriedade}
                                                    {...input.tamanho > 0 && ({
                                                        inputProps: {
                                                            maxLength: input.tamanho,
                                                            size: input.tamanho
                                                        }

                                                    })}
                                                    {...input.tipo == 'date' && ({
                                                        InputLabelProps: {
                                                            shrink: true,
                                                        }
                                                    })}


                                                    {...input.tipo == 'select' && ({
                                                        sx: {
                                                            width: input.tamanho * 1.1 + "ch",
                                                            background: inputsDesabilitados.includes(input.propriedade) ? '#efefefa9' : ''
                                                        }
                                                    })}

                                                    {...input.tipo == 'select' && input.propriedade == "ID_PAIS" && possuiFiltrosDeInputsRelacionadosComEndereco && ({
                                                        onChange: (e: any) => {
                                                            lidarComMudancaEmSelectDePaises(e.target.value)
                                                            return formikProps.handleChange(e);
                                                        }
                                                    })}
                                                    {...input.tipo == 'select' && input.propriedade == "ID_ESTADO" && possuiFiltrosDeInputsRelacionadosComEndereco && ({
                                                        onChange: (e: any) => {
                                                            lidarComMudancaEmSelectDeEstados(e.target.value)
                                                            return formikProps.handleChange(e);
                                                        }
                                                    })}
                                                >
                                                    {
                                                        input.tipo == "select" && input.opcoes != null && !input.requerido &&
                                                        <MenuItem value={""}>
                                                            Vazio
                                                        </MenuItem>
                                                    }
                                                    {
                                                        input.tipo == "select" && input.opcoes != null &&
                                                        input.opcoes.filter(opcao => {
                                                            if (possuiFiltrosDeInputsRelacionadosComEndereco) {
                                                                const filtro = filtrosDeOpcoesSelect.find(e => e.propriedade == input.propriedade);
                                                                if (filtro == null) return true;
                                                                return filtro.opcoes.includes(opcao.valor)
                                                            }
                                                            return true;
                                                        }).map(opcao => (

                                                            <MenuItem
                                                                id={input.propriedade + "-" + opcao.valor}
                                                                key={opcao.valor} value={opcao.valor}>
                                                                {opcao.nome}
                                                            </MenuItem>
                                                        ))}

                                                </Field>
                                            }
                                        </Grid>
                                    </>

                                ))
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}