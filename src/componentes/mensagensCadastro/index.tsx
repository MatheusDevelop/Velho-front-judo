import { Box, Grid, Paper, Alert, AlertTitle, AlertColor, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import { ModeloGrupoInput } from '../../modelos/ModeloGrupoInput';
import { ModeloInput } from '../../modelos/ModeloInput';
import { ModeloValidacao } from '../../modelos/ModeloValidacao';
import { paraCadaInputDoGrupoDeInputsExecutar } from '../../utilitarios/grupoDeInputsUtilitarios';

export function ComponenteMensagensCadastro({ toquesDosInputs, validacoes, grupoDeInputs }: { toquesDosInputs: any; validacoes: ModeloValidacao[]; grupoDeInputs: ModeloGrupoInput[] }) {
    const [alertasOcultos, setAlertasOcultos] = useState<string[]>([])
    const AlertaBase = ({ tipo, mensagem, nomeDaPropriedadeDoInput }: { tipo: AlertColor, mensagem: string, nomeDaPropriedadeDoInput: string }) => (
        <>

            {!alertasOcultos.includes(nomeDaPropriedadeDoInput) &&
                <Box mt={1} sx={{ width: 370 }}>
                    <Alert
                        onClose={() => {
                            setAlertasOcultos(s => [...s, nomeDaPropriedadeDoInput])
                        }}
                        variant="filled" severity={tipo}>

                        {paraCadaInputDoGrupoDeInputsExecutar((input: ModeloInput) => (
                            <>
                                {input.propriedade == nomeDaPropriedadeDoInput &&
                                    input.nome
                                }
                            </>
                        ), grupoDeInputs)} - {" "}
                        {mensagem}
                    </Alert>
                </Box>
            }
        </>

    )
    return (
        <Box sx={{ position: 'fixed', bottom: 100, right: 15, zIndex: 99 }}>
            {Object.keys(toquesDosInputs).map((propriedadeDoInputTocadoPeloUsuario, idxP) => (
                <div key={idxP}>
                    {
                        validacoes.filter(e => e.propriedade == propriedadeDoInputTocadoPeloUsuario).map((validacao, idx) => (
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
        </Box>

    );
}
