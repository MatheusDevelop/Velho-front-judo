import { AttachFileOutlined, CloseOutlined, Delete, DeleteOutlined, Download, EditOutlined, FilterAltOutlined, NoteAddOutlined, PictureAsPdf, SaveOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Dialog, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper } from '@mui/material';
import { useState } from 'react';
import { anexarArquivo, baixarAnexo, deletarAnexo, lerAnexos } from '../../servicos/servicosAnexos';
import { deletarModelo } from '../../servicos/servicosModelo'
export default function ComponentesDeBotoesCadastro(props: { valido:boolean,lidarComClickEmAbrirAnotacao: any, apenasLeitura: boolean, nomeApi: string, setPage: any, idModelo?: number, lidarComClickEmEditar: any }) {
    const [anexosAberto, setAnexosAberto] = useState(false)
    const [anexos, setAnexos]: any = useState([])
    const lidarComApagarRegistro = async () => {
        if (!props.idModelo) return
        const resposta = await deletarModelo(props.nomeApi, props.idModelo)
        if (resposta.success) {
            alert("Registro apagado")
            props.setPage(0)
            return
        }
        alert("Ocorreu um erro ao deletar o registro, tente novamente mais tarde")
    }
    const lidarComMudancaArquivosAnexos = async (e: any) => {
        if (!props.idModelo) return;
        let listaArquivos: any = []
        Object.keys(e.target.files).forEach(chaveArquivo => {
            let arquivo = e.target.files[chaveArquivo]
            listaArquivos.push(arquivo)
        })
        const resposta = await anexarArquivo(props.nomeApi, props.idModelo, listaArquivos);
        if (resposta.success)
            alert("Arquivos anexados com sucesso")
    }
    const lidarComClickEmVisualizar = async () => {
        if (!props.idModelo) return;
        setAnexosAberto(true);
        await lerAnexosDaApi()

    }
    const lerAnexosDaApi = async () => {
        if (!props.idModelo) return;
        const resposta = await lerAnexos(props.nomeApi, props.idModelo)
        if (resposta.success)
            setAnexos(resposta.data)
    }
    const lidarComClickDeletarArquivo = async (nomeAnexo: string) => {
        if (!props.idModelo) return;
        await deletarAnexo(props.nomeApi, props.idModelo, nomeAnexo)
        alert("Anexo deletado")
        await lerAnexosDaApi();
    }
    const lidarComClickBaixarAnexo = async (nomeAnexo: string) => {
        if (!props.idModelo) return;
        await baixarAnexo(props.nomeApi, props.idModelo, nomeAnexo);
    }
    return (
        <>
            <Dialog
                open={anexosAberto} onClose={() => setAnexosAberto(false)}>
                <DialogTitle>
                    Anexos
                </DialogTitle>
                <List sx={{minWidth:600}} dense>
                    {
                        anexos.map((anexo: any) => (
                            <ListItem
                                secondaryAction={
                                    <IconButton
                                        onClick={() => lidarComClickDeletarArquivo(anexo)}
                                        edge="end" aria-label="delete">
                                        <Delete />
                                    </IconButton>
                                }
                            >
                                <ListItemButton
                                    onClick={() => lidarComClickBaixarAnexo(anexo)}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Download />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        secondary={anexo}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                    {anexos.length ==0 && <ListItem><ListItemText primary="Nenhum anexo encontrado"/></ListItem>}
                </List>
            </Dialog>
            <Paper component={Box} elevation={5} padding={2} sx={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '#ffffffd4' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {
                        !props.apenasLeitura &&
                        <>
                            <Box margin={1}>
                                <Button
                                    disabled={!props.valido}
                                    type="submit"
                                    variant="contained" size='large' startIcon={<SaveOutlined />}>
                                    Salvar
                                </Button>
                            </Box>
                            <Box margin={1} >
                                <Button
                                    onClick={props.lidarComClickEmAbrirAnotacao}
                                    variant="outlined" size='large' startIcon={<NoteAddOutlined />}>
                                    Anotar
                                </Button>
                            </Box>
                        </>
                    }
                    {
                        props.apenasLeitura && props.idModelo &&
                        <>

                            <Box margin={1}>
                                <Button
                                    onClick={props.lidarComClickEmEditar}
                                    variant="contained" size='large' startIcon={<EditOutlined />}>
                                    Editar
                                </Button>
                            </Box>
                            <Box margin={1}>
                                <Button
                                    onClick={() => {
                                        if (window.confirm("Deseja mesmo excluir esse registro?"))
                                            lidarComApagarRegistro()
                                    }
                                    }
                                    variant="contained" color="error" size='large' startIcon={<DeleteOutlined />}>
                                    Excluir
                                </Button>
                            </Box>
                            {/* <Box margin={1}>
                            <Button variant="outlined" size='large' startIcon={<FilterAltOutlined />}>
                                Filtrar
                            </Button>
                        </Box> */}
                            <Box margin={1}>
                                <Button
                                    onClick={lidarComClickEmVisualizar}
                                    variant="outlined" size='large' startIcon={<VisibilityOutlined />}>
                                    Visualizar
                                </Button>
                            </Box>
                            <Box margin={1}>
                                <input accept=".pdf" hidden type="file" id="anexos" multiple onChange={lidarComMudancaArquivosAnexos} />
                                <Button
                                    onClick={() => {
                                        let elemento = document.getElementById("anexos");
                                        elemento?.click()
                                    }}
                                    variant="outlined" size='large' startIcon={<AttachFileOutlined />}>
                                    Anexar
                                </Button>
                            </Box>
                            <Box margin={1}>
                                <Button onClick={() => props.setPage(0)} variant="outlined" color="error" size='large' startIcon={<CloseOutlined />}>
                                    Cancelar
                                </Button>
                            </Box>
                        </>
                    }
                </Box>
            </Paper>
        </>
    );
}
