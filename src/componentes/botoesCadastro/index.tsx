import { AttachFileOutlined, CloseOutlined, Delete, DeleteOutlined, Download, EditOutlined, FilterAltOutlined, NoteAddOutlined, PictureAsPdf, SaveOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Box, Button, CircularProgress, Paper } from '@mui/material';
export default function ComponentesDeBotoesCadastro({ anexandoArquivos, alteracaoSendoFeita, temPermissao, formularioEhValido, paginaDeVisualizacao, lidarComClickEmAnotar, lidarComClickEmCancelar, lidarComClickEmEditar, lidarComClickEmAnexar, lidarComClickEmVisualizar, lidarComClickEmExcluir }: { anexandoArquivos: boolean, alteracaoSendoFeita: boolean, temPermissao: any, formularioEhValido: boolean, paginaDeVisualizacao: boolean, lidarComClickEmAnotar: any, lidarComClickEmCancelar: any, lidarComClickEmEditar: any, lidarComClickEmAnexar: any, lidarComClickEmVisualizar: any, lidarComClickEmExcluir: any }) {
    return (
        <>
            <Paper component={Box} elevation={5} sx={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '#ffffff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {
                        alteracaoSendoFeita && (temPermissao("2") || temPermissao("3")) &&
                        <Box margin={1}>
                            <Button
                                disabled={!formularioEhValido}
                                type="submit"
                                variant="contained" size='large' startIcon={<SaveOutlined />}>
                                Salvar
                            </Button>
                        </Box>
                    }
                    {
                        paginaDeVisualizacao && !alteracaoSendoFeita &&
                        <>
                            {
                                temPermissao("3") &&
                                <Box margin={1}>
                                    <Button
                                        onClick={lidarComClickEmEditar}
                                        variant="contained"
                                        size='large'
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
                                        variant="contained" size='large' startIcon={<DeleteOutlined />}>
                                        Excluir
                                    </Button>
                                </Box>
                            }
                        </>

                    }
                    {
                        paginaDeVisualizacao && alteracaoSendoFeita &&
                        <>
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
                                            startIcon={anexandoArquivos ? <CircularProgress size={16} /> : <AttachFileOutlined />}
                                            disabled={anexandoArquivos}
                                            onClick={() => {
                                                let el = document.getElementById("anexos")
                                                el?.click();
                                            }}

                                            variant="contained" size='large'>
                                            Anexar
                                        </Button>
                                    </Box>
                                    <Box margin={1}>
                                        <Button
                                            onClick={lidarComClickEmVisualizar}
                                            variant="contained" size='large' startIcon={<VisibilityOutlined />}>
                                            Visualizar
                                        </Button>
                                    </Box>
                                </>
                            }
                            {
                                temPermissao("6") && (temPermissao("2") || temPermissao("3")) &&
                                <Box margin={1} >
                                    <Button
                                        onClick={lidarComClickEmAnotar}
                                        variant="contained" size='large' startIcon={<NoteAddOutlined />}>
                                        Anotar
                                    </Button>
                                </Box>
                            }
                        </>
                    }
                    {
                        !paginaDeVisualizacao && alteracaoSendoFeita &&
                        <>
                            {
                                temPermissao("7") &&
                                <>
                                    {/* <Box margin={1}>
                                        <input
                                            onChange={(e) => {
                                                lidarComClickEmAnexar(e.target.files)
                                            }}
                                            accept=".pdf" hidden type="file" id="anexos" multiple />
                                        <Button
                                            startIcon={anexandoArquivos ? <CircularProgress size={16} /> : <AttachFileOutlined />}
                                            disabled={anexandoArquivos}
                                            onClick={() => {
                                                let el = document.getElementById("anexos")
                                                el?.click();
                                            }}
                                            variant="contained" size='large'>
                                            Anexar
                                        </Button>
                                    </Box> */}
                                </>
                            }
                            {
                                temPermissao("6") && (temPermissao("2") || temPermissao("3")) &&
                                <Box margin={1} >
                                    <Button
                                        onClick={lidarComClickEmAnotar}
                                        variant="contained" size='large' startIcon={<NoteAddOutlined />}>
                                        Anotar
                                    </Button>
                                </Box>
                            }
                        </>
                    }
                    <Box margin={1}>
                        <Button
                            onClick={lidarComClickEmCancelar}
                            variant="contained" size='large' startIcon={<CloseOutlined />}>
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Paper >
        </>
    );
}
