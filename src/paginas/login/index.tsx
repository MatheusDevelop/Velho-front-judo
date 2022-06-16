import { Container, Box, Avatar, Typography, Grid, TextField, Button } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fazerLogin } from '../../servicos/servicosLogin'

function PaginaLogin() {
    const navegar = useNavigate();
    const dispatch = useDispatch();
    const [dados, setDados] = useState({
        usuario: '',
        senha: '',
        cliente: 'FJERJ'
    })
    const lidarComLogin = async () => {
        const conteudo = await fazerLogin(dados.usuario, dados.senha, dados.cliente)
        if (!conteudo.autenticado) {
            alert("Login inválido")
            return;
        }
        dispatch({
            type: 'LOGIN',
            payload: {
                permissoes: conteudo.permissoes,
                idCliente:conteudo.idCliente
            }
        })
        localStorage.setItem("JUDO-V1-USUARIO", dados.usuario)
        localStorage.setItem("JUDO-V1-SENHA", dados.senha)
        localStorage.setItem("JUDO-V1-CLIENTE", dados.cliente)
        navegar("/");
    }
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Entrar
                </Typography>
                <Box component="form"
                    onSubmit={(e: any) => {
                        e.preventDefault();
                        lidarComLogin();

                    }}
                    sx={{ mt: 3 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                onChange={(e) => {
                                    setDados(dadosAtuais => ({ ...dadosAtuais, usuario: e.target.value }))
                                }}
                                size="small"
                                required
                                value={dados.usuario}
                                fullWidth
                                label="Usuario"
                                name="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onChange={(e) => {
                                    setDados(dadosAtuais => ({ ...dadosAtuais, senha: e.target.value }))
                                }}
                                size="small"
                                value={dados.senha}
                                required
                                fullWidth
                                name="password"
                                label="Senha"
                                type="password"
                            />
                        </Grid>
                        {/* <Grid item xs={12}>
                            <TextField
                                onChange={(e) => {
                                    setDados(dadosAtuais => ({ ...dadosAtuais, cliente: e.target.value }))
                                }}
                                value={dados.cliente}
                                required
                                size="small"
                                fullWidth
                                name="cliente"
                                label="Cliente"
                                type="text"
                            />
                        </Grid> */}
                    </Grid>
                    <Button
                        size="large"
                        type="submit"

                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                    <Link to="/login">
                        <Typography variant="subtitle2">
                            Recuperar senha
                        </Typography>
                    </Link>
                </Box>
            </Box>
        </Container>
    )
}

export default PaginaLogin