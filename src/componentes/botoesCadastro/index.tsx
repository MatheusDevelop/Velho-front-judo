import { AttachFileOutlined, CloseOutlined, Delete, DeleteOutlined, Download, EditOutlined, FilterAltOutlined, NoteAddOutlined, PictureAsPdf, SaveOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Box, Button, Paper } from '@mui/material';
export default function ComponentesDeBotoesCadastro({ temPermissao, formularioEhValido, paginaDeLeitura, lidarComClickEmAnotar, lidarComClickEmCancelar, lidarComClickEmEditar, lidarComClickEmAnexar, lidarComClickEmVisualizar, lidarComClickEmExcluir }: { temPermissao: any, formularioEhValido: boolean, paginaDeLeitura: boolean, lidarComClickEmAnotar: any, lidarComClickEmCancelar: any, lidarComClickEmEditar: any, lidarComClickEmAnexar: any, lidarComClickEmVisualizar: any, lidarComClickEmExcluir: any }) {
    return (
        <>
            <Paper component={Box} elevation={5} padding={1} sx={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '#ffffff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {
                        !paginaDeLeitura && (temPermissao("2") || temPermissao("3")) &&
                        <Box margin={1}>
                            <Button
                                disabled={!formularioEhValido}
                                type="submit"
                                variant="contained" size='small' startIcon={<SaveOutlined />}>
                                Salvar
                            </Button>
                        </Box>
                    }
                    {
                        paginaDeLeitura ?
                            <>
                                {
                                    temPermissao("3") &&
                                    <Box margin={1}>
                                        <Button
                                            onClick={lidarComClickEmEditar}
                                            variant="contained"
                                            size='small'
                                            startIcon={<EditOutlined />}
                                        >
                                            Editar
                                        </Button>
                                    </Box>
                                }
                                {
                                    temPermissao("4") &&
                                    <Box margin={1}>
                                        <Button
                                            onClick={lidarComClickEmExcluir}
                                            variant="contained" size='small' startIcon={<DeleteOutlined />}>
                                            Excluir
                                        </Button>
                                    </Box>
                                }
                                {
                                    temPermissao("7") &&
                                    <>


                                        <Box margin={1}>
                                            <input
                                                onChange={(e) => {
                                                    lidarComClickEmAnexar(e.target.files)
                                                }}
                                                accept=".pdf" hidden type="file" id="anexos" multiple />
                                            <Button
                                                onClick={() => {
                                                    let el = document.getElementById("anexos")
                                                    el?.click();
                                                }}

                                                variant="contained" size='small' startIcon={<AttachFileOutlined />}>
                                                Anexar
                                            </Button>
                                        </Box>
                                        <Box margin={1}>
                                            <Button
                                                onClick={lidarComClickEmVisualizar}
                                                variant="contained" size='small' startIcon={<VisibilityOutlined />}>
                                                Visualizar
                                            </Button>
                                        </Box>
                                    </>
                                }
                            </>
                            :
                            <>
                                {
                                    temPermissao("6") && (temPermissao("2") || temPermissao("3")) &&
                                    <Box margin={1} >
                                        <Button
                                            onClick={lidarComClickEmAnotar}
                                            variant="contained" size='small' startIcon={<NoteAddOutlined />}>
                                            Anotar
                                        </Button>
                                    </Box>
                                }
                            </>
                    }

                    <Box margin={1}>
                        <Button
                            onClick={lidarComClickEmCancelar}
                            variant="contained" size='small' startIcon={<CloseOutlined />}>
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Paper >
        </>
    );
}
