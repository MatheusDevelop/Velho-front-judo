import { AttachFileOutlined, CloseOutlined, EditOutlined, FilterAltOutlined, NoteAddOutlined, SaveOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Box, Button, Paper } from '@mui/material';
import React from 'react';

export default function ComponenteBotoesDeCadastro(props:{clickEmSalvar:any}) {
    return <Paper component={Box} elevation={5} padding={2} sx={{ display: 'flex', justifyContent: 'flex-end',backgroundColor:'#ffffffd4' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box margin={1}>
                <Button onClick={props.clickEmSalvar} variant="contained" size='large' startIcon={<SaveOutlined />}>
                    Salvar
                </Button>
            </Box>
            <Box margin={1}>
                <Button variant="outlined" size='large' startIcon={<NoteAddOutlined />}>
                    Anotar
                </Button>
            </Box>
            <Box margin={1}>
                <Button variant="outlined" size='large' startIcon={<EditOutlined />}>
                    Editar
                </Button>
            </Box>
            <Box margin={1}>
                <Button variant="outlined" size='large' startIcon={<FilterAltOutlined />}>
                    Filtrar
                </Button>
            </Box>
            <Box margin={1}>
                <Button variant="outlined" size='large' startIcon={<VisibilityOutlined />}>
                    Visualizar
                </Button>
            </Box>
            <Box margin={1}>
                <Button variant="outlined" size='large' startIcon={<AttachFileOutlined />}>
                    Anexar
                </Button>
            </Box>
            <Box margin={1}>
                <Button variant="outlined" color="error" size='large' startIcon={<CloseOutlined />}>
                    Cancelar
                </Button>
            </Box>
        </Box>
    </Paper>;
}
