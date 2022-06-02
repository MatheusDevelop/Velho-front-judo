import { KeyboardArrowDownOutlined, LogoutOutlined } from '@mui/icons-material';
import { AppBar, Toolbar, Box, Button, Menu, MenuItem, Link, Breadcrumbs, Typography, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { IEstadoInicial, IModeloPermissao } from '../../redux/reducerRaiz';

function MenuComponente() {
    const [menus, setMenus] = useState([
        {
            nome: 'Cadastros', menus: [
                { nome: 'Atletas', link: 'atletas', sigla: "CADATLE" },
                { nome: 'Agremiações', link: 'agremiacoes', sigla: "CADATLE" },
                { nome: 'Árbitros', link: 'arbitros', sigla: "CADATLE" },
                { nome: 'Professores', link: 'professores', sigla: "CADATLE" },
                { nome: 'Pessoal apoio', link: 'apoio', sigla: "CADATLE" },
            ]
        },
        {
            nome: 'Tabelas Aux.', menus: [
                { nome: 'Regiões', link: 'regioes', sigla: "CADATLE" },
                { nome: 'Locais competições', link: 'apoio', sigla: "CADATLE" },
                { nome: 'Patrocionadores', link: 'apoio', sigla: "CADATLE" },
                { nome: 'Profissões', link: 'apoio', sigla: "CADATLE" },
                { nome: 'Emissores identidades', link: 'apoio', sigla: "CADATLE" },
                { nome: 'Paises', link: 'apoio', sigla: "CADATLE" },
                { nome: 'Estados', link: 'apoio', sigla: "CADATLE" },
                { nome: 'Cidades', link: 'apoio', sigla: "CADATLE" },
                { nome: 'Faixas', link: 'apoio', sigla: "CADATLE" },
                { nome: 'Categorias', link: 'apoio', sigla: "CADATLE" },
                { nome: 'Classes', link: 'apoio', sigla: "CADATLE" },
                { nome: 'Tabela pesos', link: 'apoio', sigla: "CADATLE" },
                { nome: 'Níveis Árbitros', link: 'apoio', sigla: "CADATLE" },
                { nome: 'Funções Apoios', link: 'apoio', sigla: "CADATLE" },
                { nome: 'Tipos Desfilações', link: 'apoio', sigla: "CADATLE" },
            ]
        },
        {
            nome: 'Serviços', menus: [
            ]
        },
        {
            nome: 'Competições', menus: [
            ]
        },
        {
            nome: 'Segurança', menus: [
            ]
        },
    ])
    const { nomeMenuAtual, nomeSubmenuAtual } = useSelector<IEstadoInicial, { nomeMenuAtual: string, nomeSubmenuAtual: string }>((estado: IEstadoInicial) => {
        return {
            nomeMenuAtual: estado.nomeMenuAtual,
            nomeSubmenuAtual: estado.nomeSubmenuAtual,
        }
    });
    const dispatch = useDispatch();

    return (
        <AppBar

            position="fixed" color="inherit" sx={{ zIndex: 90, backgroundColor: '#ebeaea!important' }}>
            <Toolbar
                variant="dense"
            >
                {menus.map(menu => (
                    <MenuDropdownComponente nome={menu.nome} items={menu.menus} />
                ))}
                <Box sx={{ position: 'absolute', right: 25, flexDirection: "row", display: 'flex', alignItems: "center" }}>

                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography color="text.divider">{nomeMenuAtual}</Typography>
                        <Typography color="text.primary">{nomeSubmenuAtual}</Typography>
                    </Breadcrumbs>
                    <Box ml={2} sx={{ borderLeft: 1, borderColor: '#00000021', pr: 2, display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle2" sx={{ mx: 2 }}>
                            FJERJ
                        </Typography>
                        <IconButton
                            onClick={() => {
                                dispatch({
                                    type: "DESLOGIN"
                                })
                                localStorage.removeItem("JUDO-V1-USUARIO")
                                localStorage.removeItem("JUDO-V1-SENHA")
                                localStorage.removeItem("JUDO-V1-CLIENTE")
                            }}
                            size="large"
                        >
                            <LogoutOutlined />
                        </IconButton>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
interface ITipoProps {
    nome: string,
    items: { nome: string, link: string, sigla: string }[]
}
const MenuDropdownComponente = ({ nome, items }: ITipoProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuAberto = Boolean(anchorEl);
    const lidarComClickEmExpandir = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const navegar = useNavigate()
    const dispatch = useDispatch();
    const lidarComClickEmItem = (link: string, menuAtual: string, nomeSubmenuAtual: string) => {
        navegar("/" + link)
        setAnchorEl(null);
        dispatch({
            type: "SETAR-MENU",
            payload: {
                menuAtual,
                nomeMenuAtual: nome,
                nomeSubmenuAtual
            }
        })
    };
    const location = useLocation();
    useEffect(() => {
        items.map(item => {
            console.log(item.link, location.pathname)
            if ("/" + item.link == location.pathname)
                dispatch({
                    type: "SETAR-MENU",
                    payload: {
                        menuAtual: item.sigla,
                        nomeMenuAtual: nome,
                        nomeSubmenuAtual: item.nome
                    }
                })
        })
    }, [location])

    return (
        <Box mr={2} sx={{ borderRight: 1, borderColor: '#00000021', pr: 2 }}>
            <Button
                id="basic-button"
                aria-controls={menuAberto ? 'basic-menu' : undefined}
                aria-haspopup="true"
                color="primary"
                aria-expanded={menuAberto ? 'true' : undefined}
                onClick={lidarComClickEmExpandir}
            >
                {nome}
            </Button>
            <Menu

                id="basic-menu"
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                open={menuAberto}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                PaperProps={{
                    sx: { minWidth: 150 }
                }}
            >
                {
                    items.map(item => (
                        <MenuItem dense onClick={() => { lidarComClickEmItem(item.link, item.sigla, item.nome) }}>{item.nome}</MenuItem>
                    ))
                }
            </Menu>
        </Box>
    )
}

export default MenuComponente