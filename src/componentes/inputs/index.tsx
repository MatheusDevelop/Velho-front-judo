import { Image, InputSharp } from "@mui/icons-material";
import { Stack, Paper, Typography, Divider, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Avatar } from "@mui/material";
import { Box } from "@mui/system";
import { Field, useFormikContext } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { ModeloFiltroOpcaoSelect } from "../../modelos/ModeloFiltroOpcaoSelect";
import { ModeloInput } from "../../modelos/ModeloInput";
import { filtrarEnderecos } from "../../servicos/servicosFiltros";

export default function ComponenteGrupoDeInputs(props: {
    titulo: string,
    apenasLeitura?: boolean,
    erros: any,
    usuarioTocouNoInput: any
    inputs: ModeloInput[]
}) {
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
        // verificarSeExisteSelectsDeEnderecosAninhados()
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

        const filtros = await filtrarEnderecos(idPais);
        setFiltrosDeOpcoesSelect(filtros)
        if (filtros[0].opcoes.length > 0)
            //Habilita ID_ESTADO e desabilita apenas ID_CIDADE
            setInputsDesabilitados(["ID_CIDADE"])
    }
    const lidarComMudancaEmSelectDeEstados = async (idEstado: string) => {
        formikProps.setFieldValue("ID_CIDADE", '')

        const filtros = await filtrarEnderecos(formikProps.values["ID_PAIS"], idEstado);
        const filtroDeEstadosAtual = filtrosDeOpcoesSelect[0];
        const novoFiltro = [filtroDeEstadosAtual, filtros[1]];
        if (filtros[0].opcoes.length > 0) {
            setFiltrosDeOpcoesSelect(novoFiltro);
            setInputsDesabilitados([])
        }
    }

    return (
        <Paper elevation={2} component={Box} padding={2}>
            <Typography variant='subtitle2' mb={2}>
                {props.titulo}
            </Typography>
            <Divider />
            <Box mt={2}>
                <Grid container>
                    {
                        props.inputs.map((input, idx) => (
                            input.tipo == "imagem" &&
                            <Grid key={idx} item xs={3} justifyContent="center" >
                                <Avatar
                                    src={formikProps.values[input.propriedade] || ''}
                                    sx={{ width: 150, height: 150 }}
                                >
                                    <Image />
                                </Avatar>

                                <input accept=".jpg" hidden type="file" id={input.propriedade} onChange={(e) => lidarComMudancaEmInputArquivo(e, input.propriedade)} />
                                <Box mt={2}>
                                    <Button
                                        disabled={props.apenasLeitura}
                                        color="secondary"
                                        variant="contained" onClick={() => {
                                            let elemento = document.getElementById(input.propriedade);
                                            elemento?.click()
                                        }}>
                                        {input.nome}
                                    </Button>
                                </Box>
                            </Grid>
                        ))
                    }
                    <Grid item container xs spacing={2} >
                        {
                            props.inputs.map((input, idx) => (
                                input.tipo != "imagem" &&
                                <Grid key={idx} item xs="auto"
                                >
                                    <Field
                                        name={input.propriedade}
                                        type={input.tipo}
                                        select={input.tipo == "select"}
                                        as={TextField}
                                        disabled={inputsDesabilitados.includes(input.propriedade)}
                                        required={input.requerido}
                                        error={props.erros[input.propriedade] && props.usuarioTocouNoInput[input.propriedade]}
                                        label={input.nome}
                                        variant="outlined"
                                        size="small"
                                        id={input.propriedade}
                                        {...input.tamanho > 0 && ({
                                            inputProps: {
                                                maxLength: input.tamanho,
                                            }

                                        })}
                                        {...input.tamanho > 40 && ({
                                            inputProps: {
                                                size: input.tamanho - 20,
                                            }

                                        })}
                                        {...input.tipo == 'date' && ({
                                            InputLabelProps: {
                                                shrink: true,
                                            }
                                        })}
                                        {...input.tipo == 'select' && ({
                                            sx: {
                                                width: 250,
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
                                                    id={input.propriedade +"-"+ opcao.valor}
                                                    key={opcao.valor} value={opcao.valor}>
                                                    {opcao.nome}
                                                </MenuItem>
                                            ))}
                                    </Field>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>

            </Box>
        </Paper>
    )
}