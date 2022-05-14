import { AttachFileOutlined, CloseOutlined, Delete, DeleteOutlined, Download, EditOutlined, FilterAltOutlined, NoteAddOutlined, PictureAsPdf, SaveOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Dialog, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper } from '@mui/material';
import { useState } from 'react';
import { anexarArquivo, baixarAnexo, deletarAnexo, lerAnexos } from '../../servicos/servicosAnexos';
import { deletarModelo } from '../../servicos/servicosModelo'
export default function ComponentesDeBotoesCadastro({ formularioEhValido, paginaDeLeitura, lidarComClickEmAnotar, lidarComClickEmCancelar }: { formularioEhValido: boolean, paginaDeLeitura: boolean, lidarComClickEmAnotar: any, lidarComClickEmCancelar: any }) {
    return (
        <>
            <Paper component={Box} elevation={5} padding={2} sx={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '#ffffffd4' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {
                        paginaDeLeitura ?
                            <>
                                <Box margin={1}>
                                    <Button
                                        variant="contained" size='large' startIcon={<EditOutlined />}>
                                        Editar
                                    </Button>
                                </Box>
                                <Box margin={1}>
                                    <Button
                                        variant="contained" color="error" size='large' startIcon={<DeleteOutlined />}>
                                        Excluir
                                    </Button>
                                </Box>
                                <Box margin={1}>
                                    <Button
                                        variant="outlined" size='large' startIcon={<VisibilityOutlined />}>
                                        Visualizar
                                    </Button>
                                </Box>
                                <Box margin={1}>
                                    <input accept=".pdf" hidden type="file" id="anexos" multiple />
                                    <Button
                                        variant="outlined" size='large' startIcon={<AttachFileOutlined />}>
                                        Anexar
                                    </Button>
                                </Box>
                            </>
                            :
                            <>
                                <Box margin={1}>
                                    <Button
                                        disabled={!formularioEhValido}
                                        type="submit"
                                        variant="contained" size='large' startIcon={<SaveOutlined />}>
                                        Salvar
                                    </Button>
                                </Box>
                                <Box margin={1} >
                                    <Button
                                        onClick={lidarComClickEmAnotar}
                                        variant="outlined" size='large' startIcon={<NoteAddOutlined />}>
                                        Anotar
                                    </Button>
                                </Box>
                            </>
                    }
                    <Box margin={1}>
                        <Button
                            onClick={lidarComClickEmCancelar}
                            variant="outlined" color="error" size='large' startIcon={<CloseOutlined />}>
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Paper >
        </>
    );
}
