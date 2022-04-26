import { Close, SaveOutlined } from '@mui/icons-material'
import { AppBar, Box, Button, Dialog, IconButton, Toolbar, Typography } from '@mui/material'
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function BlocoAnotacaoComponente(props: { aberto: boolean, lidarComClickEmFechar: any, anotacao: string, setAnotacao: any }) {

    return (
        <Dialog
            maxWidth="lg"
            open={props.aberto}
            onClose={props.lidarComClickEmFechar}
        >
            <AppBar
                color="default"
                sx={{ position: 'relative' }}>
                <Toolbar>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Anotações
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={props.lidarComClickEmFechar}
                        aria-label="close"
                    >
                        <Close />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box p={4} 
                sx={{height:500,width:800}}
            >
                <ReactQuill
                    theme="snow"
                    modules={{
                        toolbar: [
                            [{ 'header': '1' }, { 'header': '2' }], [{ size: [] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{ 'align': [] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                            ['clean']
                        ],
                    }}
                    formats={[
                        'header', 'font', 'size',
                        'bold', 'italic', 'underline', 'strike', 'blockquote', 'color', 'background',
                        'list', 'bullet', 'indent', 'link', 'video', 'image', "code-block", "align"
                    ]}
                    value={props.anotacao}
                    onChange={props.setAnotacao}
                />
            </Box>

        </Dialog>
    )
}

export default BlocoAnotacaoComponente