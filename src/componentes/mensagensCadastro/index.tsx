import { Box, Grid, Paper, Alert, AlertTitle, AlertColor } from '@mui/material';
import React from 'react';
import { ModeloGrupoInput } from '../../modelos/ModeloGrupoInput';
import { ModeloInput } from '../../modelos/ModeloInput';
import { ModeloValidacao } from '../../modelos/ModeloValidacao';
import { paraCadaInputDoGrupoDeInputsExecutar } from '../../utilitarios/grupoDeInputsUtilitarios';

export function ComponenteMensagensCadastro({ toquesDosInputs, validacoes, grupoDeInputs }: { toquesDosInputs: any; validacoes: ModeloValidacao[]; grupoDeInputs: ModeloGrupoInput[] }) {

    const AlertaBase = ({ tipo, mensagem, nomeDaPropriedadeDoInput }: { tipo: AlertColor, mensagem: string, nomeDaPropriedadeDoInput: string }) => (
        <Box mb={2}>
            <Alert severity={tipo}>
                <AlertTitle>
                    {paraCadaInputDoGrupoDeInputsExecutar((input: ModeloInput) => (
                        <>
                            {input.propriedade == nomeDaPropriedadeDoInput &&
                                <div key={input.propriedade}>{input.nome}</div>
                            }
                        </>
                    ), grupoDeInputs)}
                </AlertTitle>
                {mensagem}
            </Alert>
        </Box>
    )
    return (
        <Grid container spacing={2}>
            <Grid item xs>
                <Paper elevation={2} component={Box} padding={2} mt={2}>

                    {Object.keys(toquesDosInputs).map((propriedadeDoInputTocadoPeloUsuario,idxP) => (
                        <div key={idxP}>
                            {
                                validacoes.filter(e=> e.propriedade == propriedadeDoInputTocadoPeloUsuario).map((validacao,idx) => (
                                    <div key={idx}>
                                        {validacao.tipo == "ERRO" &&
                                            <>
                                                <AlertaBase
                                                    tipo="error"
                                                    mensagem={validacao.mensagem}
                                                    nomeDaPropriedadeDoInput={propriedadeDoInputTocadoPeloUsuario} />
                                            </>
                                        }

                                        {validacao.tipo == "ALER" &&
                                            <AlertaBase
                                                tipo="warning"
                                                mensagem={validacao.mensagem}
                                                nomeDaPropriedadeDoInput={propriedadeDoInputTocadoPeloUsuario} />
                                        }
                                        
                                        {validacao.tipo == "INFO" &&
                                            <AlertaBase
                                                tipo="info"
                                                mensagem={validacao.mensagem}
                                                nomeDaPropriedadeDoInput={propriedadeDoInputTocadoPeloUsuario} />
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    ))}
                </Paper>
            </Grid>
        </Grid>
    );
}
