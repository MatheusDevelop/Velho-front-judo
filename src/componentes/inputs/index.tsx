import { Image } from "@mui/icons-material";
import { Stack, Paper, Typography, Divider, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Avatar } from "@mui/material";
import { Box } from "@mui/system";
import { Field, useFormikContext } from "formik";
import React, { useState } from "react";
import { ModeloInput } from "../../modelos/ModeloInput";

export default function ComponenteGrupoDeInputs(props: {
    titulo: string,
    apenasLeitura?: boolean,
    erros: any,
    usuarioTocouNoInput: any
    inputs: ModeloInput[]
}) {
    const formikProps: any = useFormikContext()
    const [imagensPrevisualizacao, setImagensPrevisualizacao]: any = useState({})

    const lidarComMudancaEmInputArquivo = (evento: React.ChangeEvent<HTMLInputElement>, propriedade: string) => {
        if (evento.target.files != null) {
            formikProps.setFieldValue(propriedade, evento.target.files[0])
            setImagensPrevisualizacao({ ...imagensPrevisualizacao, [propriedade]: URL.createObjectURL(evento.target.files[0]) })
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
                        props.inputs.map(input => (
                            input.tipo == "imagem" &&
                            <Grid item xs={3} justifyContent="center" >
                                <Avatar
                                    src={imagensPrevisualizacao[input.propriedade] || ''}
                                    sx={{ width: 150, height: 150 }}
                                >
                                    <Image />
                                </Avatar>

                                <input hidden type="file" id={input.propriedade} onChange={(e) => lidarComMudancaEmInputArquivo(e, input.propriedade)} />
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
                    <Grid item container xs spacing={2}>

                        {
                            props.inputs.map(input => (
                                input.tipo != "imagem" &&
                                <Grid item={!input.larguraMaxima} container={input.larguraMaxima} xs={!input.larguraMaxima} >
                                    {
                                        input.tipo == "select" ?
                                            <Field
                                                name={input.propriedade}
                                                select
                                                as={TextField}
                                                label={input.nome}
                                                fullWidth
                                                sx={{ ml: input.larguraMaxima ? 2 : 0, mt: input.larguraMaxima ? 2 : 0 }}

                                                value={formikProps.values[input.propriedade] || ''}
                                                required={input.requerido}
                                                error={props.erros[input.propriedade] && props.usuarioTocouNoInput[input.propriedade]}
                                                helperText={props.erros[input.propriedade] && props.usuarioTocouNoInput[input.propriedade] && props.erros[input.propriedade]}
                                                disabled={props.apenasLeitura}
                                                variant="outlined"
                                                size="small"
                                            >
                                                {input.opcoes != null && input.opcoes.map(opcao => (
                                                    <MenuItem key={opcao.valor} value={opcao.valor}>
                                                        {opcao.nome}
                                                    </MenuItem>
                                                ))}
                                            </Field>
                                            :
                                            <Field
                                                name={input.propriedade}
                                                type={input.tipo}
                                                as={TextField}
                                                label={input.nome}
                                                fullWidth
                                                sx={{ ml: input.larguraMaxima ? 2 : 0, mt: input.larguraMaxima ? 2 : 0 }}
                                                required={input.requerido}
                                                helperText={props.erros[input.propriedade] && props.usuarioTocouNoInput[input.propriedade] && props.erros[input.propriedade]}
                                                error={props.erros[input.propriedade] && props.usuarioTocouNoInput[input.propriedade]}
                                                disabled={props.apenasLeitura}
                                                variant="outlined"
                                                {...input.tamanhoMaximo != 0 && ({
                                                    inputProps: {
                                                        maxLength: input.tamanhoMaximo
                                                    }
                                                })}
                                                {...input.tipo == 'date' && ({
                                                    InputLabelProps: {
                                                        shrink: true,
                                                    }
                                                })}
                                                {...input.tipo == 'date' && ({
                                                    value: formikProps.values[input.propriedade] && formikProps.values[input.propriedade].split("T")[0]
                                                })}
                                                {...props.apenasLeitura && ({
                                                    InputLabelProps: {
                                                        shrink: true,
                                                    }
                                                })}
                                                {...formikProps.values[input.propriedade] && ({
                                                    InputLabelProps: {
                                                        shrink: true,
                                                    }
                                                })}
                                                size="small"
                                            />
                                    }
                                </Grid>

                            ))
                        }
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}