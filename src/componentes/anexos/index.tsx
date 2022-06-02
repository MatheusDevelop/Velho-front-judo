import { Close, Delete, Download } from '@mui/icons-material'
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { baixarAnexo, deletarAnexo, lerAnexos } from '../../servicos/servicosAnexos'
interface ITipoProps {
    mostrarAnexos: boolean,
    setMostrarAnexos: any,
    nomeTabela: string,
    idCliente: number,
    idEntidade: string
}
function AnexosComponente({ nomeTabela, idCliente, idEntidade, mostrarAnexos, setMostrarAnexos }: ITipoProps) {
    const [anexos, setAnexos] = useState<string[]>([])
    const listaDeAnexos: any = anexos && anexos.map(nomeAnexo => (
        <ListItem
            secondaryAction={
                <IconButton
                    onClick={() => lidarComClickDeletarAnexo(nomeAnexo)}
                    edge="end" aria-label="delete">
                    <Delete />
                </IconButton>
            }
        >
            <ListItemButton
                onClick={() => lidarComClickBaixarAnexo(nomeAnexo)}
            >
                <ListItemAvatar>
                    <Avatar>
                        <Download />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    secondary={nomeAnexo}
                />
            </ListItemButton>
        </ListItem>
    ))
    const lidarComClickBaixarAnexo = async (nomeAnexo: string) => {
        await baixarAnexo(nomeTabela, idEntidade, idCliente, nomeAnexo)
    }
    const lidarComClickDeletarAnexo = async (nomeAnexo: string) => {
        await deletarAnexo(nomeTabela, idEntidade, idCliente, nomeAnexo)
        await adicionarAnexos();
    }
    useEffect(() => {
        if (mostrarAnexos)
            adicionarAnexos();
    }, [mostrarAnexos])
    const adicionarAnexos = async () => {
        const conteudo = await lerAnexos(nomeTabela, idEntidade, idCliente);
        setAnexos(conteudo.arquivos)
    }
    return (
        <Dialog
            open={mostrarAnexos}
            onClose={() => setMostrarAnexos(false)}
            aria-labelledby="alert-dialog-title"
            fullWidth
            maxWidth="sm"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <DialogTitle id="alert-dialog-title">
                    {"Anexos"}
                </DialogTitle>
                <Divider />
                <List>
                    {listaDeAnexos}
                </List>
                {anexos.length == 0 &&
                    <Typography variant="subtitle2" m={3}>
                        Nenhum anexo encontrado
                    </Typography>
                }

            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => setMostrarAnexos(false)}
                    variant="contained"
                    size='large'
                    startIcon={<Close />}
                >
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AnexosComponente