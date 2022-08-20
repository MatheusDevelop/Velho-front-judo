import { ArrowRight, KeyboardArrowDownOutlined, LogoutOutlined } from '@mui/icons-material';
import { AppBar, Toolbar, Box, Button, Menu, MenuItem, Link, Breadcrumbs, Typography, IconButton, Avatar, ListItemIcon } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { IEstadoInicial, IModeloPermissao } from '../../redux/reducerRaiz';
import MenuPerfil from '../menuPerfil';

function MenuComponente() {
    const [menus, setMenus] = useState(
        [
        {
            nome: 'Cadastros', menus: [
                { nome: 'Atletas', link: 'atletas', sigla: "CADATLE" },
                { nome: 'Agremiações', link: 'agremiacoes', sigla: "CADATLE" },
                { nome: 'Professores', link: 'professores', sigla: "CADATLE" },
                { nome: 'Professores X Agremiações', link: 'professores', sigla: "CADATLE" },
                { nome: 'Pessoal Apoio', link: 'professores', sigla: "CADATLE" },
                { nome: 'Pessoal Apoio X Funções', link: 'professores', sigla: "CADATLE" },
                { nome: 'Árbitros', link: 'professores', sigla: "CADATLE" },
                { nome: 'Regiões', link: 'professores', sigla: "CADATLE" },
                { nome: 'Locais Competições', link: 'professores', sigla: "CADATLE" },
                { nome: 'Patrocinadores', link: 'professores', sigla: "CADATLE" },
                {
                    nome: 'Tabelas auxiliares', link: '', sigla: '', submenus: [
                        { nome: 'Profissões', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Emissores Identidades', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Cidades', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Estados', link: 'estados', sigla: "CADEST" },
                        { nome: 'Países', link: 'paises', sigla: "CADPAI" },
                        { nome: 'Faixas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Categorias', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Classes', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tabelas pesos', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Penalidades', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Níveis Árbitros', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tipos Desfiliações Atletas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tipos Desfiliações Agremiações', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tipos Currículos Atletas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tipos Currículos Agremiações', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tipos Promoções Atletas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tipos Promoções Árbitros', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tipos Transferências', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tipos Anuidades', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tipos Pagamentos Atletas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tipos Pagamentos Agremiações', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tipos Itens Recibos', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Formas Pagamentos', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tabelas Anuidades', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tabelas Mensalidades', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tabelas Serviços', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Valores Default', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                },
            ]
        },
        {
            nome: 'Finanças',
            menus: [
                {
                    nome: 'Pagamentos', link: '', sigla: '', submenus: [
                        { nome: 'Anuidades Federação', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Anuidades Confederação', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Mensalidades', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Multiplas Mensalidades', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                },
                { nome: 'Cobrança', link: 'atletas', sigla: "CADATLE" },
                {
                    nome: 'Recibos', link: '', sigla: '', submenus: [
                        { nome: 'Serviços', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Genéricos', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                },
                {
                    nome: 'Definir isentos', link: '', sigla: '', submenus: [
                        { nome: 'Atletas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Agremiações', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                },
                {
                    nome: 'Relatórios', link: '', sigla: '', submenus: [
                        { nome: 'Anuidades', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Anuidades Confederação', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Mensalidades', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Recibos Emitidos', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                },
            ]
        },
        {
            nome: 'Serviços',
            menus: [
                {
                    nome: 'Promoções', link: '', sigla: '', submenus: [
                        { nome: 'Atletas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Árbitros', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                },
                { nome: 'Transferências', link: 'atletas', sigla: "CADATLE" },
                { nome: 'Emissão Carteiras', link: 'atletas', sigla: "CADATLE" },
                {
                    nome: 'Currículos', link: '', sigla: '', submenus: [
                        { nome: 'Atletas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Agremiações', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                },
                {
                    nome: 'Desfiliações', link: '', sigla: '', submenus: [
                        { nome: 'Atletas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Agremiações', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                },
                {
                    nome: 'Relatórios', link: '', sigla: '', submenus: [
                        { nome: 'Promoções Atletas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Promoções Árbitros', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Transferência Atletas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Histórico Atletas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Certificados Atletas', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                },
            ]
        },
        {
            nome: 'Competições',
            menus: [
                { nome: 'Criar Competição', link: 'atletas', sigla: "CADATLE" },
                {
                    nome: 'Definir Competição Ativa', link: 'atletas', sigla: "CADATLE", submenus: [
                        { nome: 'Faixas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Categorias', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Classes', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tabela Peso', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Penalidades', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Pontuações', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Áreas Competição', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Confronto entre Classes', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                },
                {
                    nome: 'Alocar Recursos', link: 'atletas', sigla: "CADATLE", submenus: [
                        { nome: 'Árbitros', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Patrocinadores', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Pessoal Apoio', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                },
                { nome: 'Definir Chaves', link: 'atletas', sigla: "CADATLE" },
                { nome: 'Inscrever Atletas', link: 'atletas', sigla: "CADATLE" },
                { nome: 'Realizar Sorteio', link: 'atletas', sigla: "CADATLE" },
                {
                    nome: 'Relatórios', link: 'atletas', sigla: "CADATLE", submenus: [
                        { nome: 'Atletas X Chaves', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Atletas X Agremiações', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Agremiações X Classes', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Chaves', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                },
                { nome: 'Registrar Luta', link: 'atletas', sigla: "CADATLE" },
                {
                    nome: 'Registrar Faltas', link: 'atletas', sigla: "CADATLE", submenus: [
                        { nome: 'Atletas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Árbitros', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Pessoal Apoio', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                },
                { nome: 'Parametrizar Competição', link: 'atletas', sigla: "CADATLE" },
                { nome: 'Registrar Resultados', link: 'atletas', sigla: "CADATLE" },
            ]
        },
        {
            nome: 'Segurança',
            menus: [
                { nome: 'Usuários', link: 'atletas', sigla: "CADATLE" },
                { nome: 'Perfís', link: 'atletas', sigla: "CADATLE" },
                { nome: 'Perfil X Usuario', link: 'atletas', sigla: "CADATLE" },
                { nome: 'Funções Menu', link: 'atletas', sigla: "CADATLE" },
                { nome: 'Tipos operações', link: 'atletas', sigla: "CADATLE" },
                { nome: 'Atribuir Permissões', link: 'atletas', sigla: "CADATLE" },
                { nome: 'Visualizar Log Eventos', link: 'atletas', sigla: "CADATLE" },
                {
                    nome: 'Funções Restritas', link: '', sigla: '', submenus: [
                        { nome: 'Cadastrar Sistemas', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Cadastrar Clientes', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Tipos Mensagens Sistema', link: 'agremiacoes', sigla: "CADATLE" },
                        { nome: 'Mensagens Sistema', link: 'agremiacoes', sigla: "CADATLE" },
                    ]
                }
            ]
        },
    ])
    const { nomeMenuAtual, nomeSubmenuAtual, foto, cliente, usuario, nome, email } = useSelector<
        IEstadoInicial,
        any
    >((estado: IEstadoInicial) => {
        return {
            nomeMenuAtual: estado.nomeMenuAtual,
            nomeSubmenuAtual: estado.nomeSubmenuAtual,
            foto: estado.fotoBit64,
            cliente: estado.nomeCliente,
            usuario: estado.usuario,
            nome: estado.nomeUsuario,
            email: estado.emailUsuario
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
                        <MenuPerfil
                            imagemPerfil={foto}
                            cliente={cliente}
                            usuario={usuario}
                            email={email}
                            nomeUsuario={nome}
                        />
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
    items: { nome: string, link: string, sigla: string, submenus?: any }[]
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
        console.log('Normal')
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

    // useEffect(() => {
    //     items.map(item => {
    //         if ("/" + item.link == location.pathname)
    //             dispatch({
    //                 type: "SETAR-MENU",
    //                 payload: {
    //                     menuAtual: item.sigla,
    //                     nomeMenuAtual: nome,
    //                     nomeSubmenuAtual: item.nome
    //                 }
    //             })
    //     })
    // }, [location])

    return (
        <Box mr={2} sx={{ borderRight: 1, borderColor: '#00000021', pr: 2 }}>
            <Button
                id={'basic-button' + nome}
                aria-controls={menuAberto ? 'basic-menu' + nome : undefined}
                aria-haspopup="true"
                color="primary"
                aria-expanded={menuAberto ? 'true' : undefined}
                onClick={lidarComClickEmExpandir}
            >
                {nome}
            </Button>
            <Menu

                id={'basic-menu' + nome}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                open={menuAberto}
                MenuListProps={{
                    'aria-labelledby': 'basic-button' + nome,
                }}
                PaperProps={{
                    sx: { minWidth: 150 }
                }}
            >
                {
                    items.map(item => (
                        <>
                            {item.submenus ?
                                <SubmenuItem item={item} lidarComClickEmItem={lidarComClickEmItem} />
                                :
                                <MenuItem dense onClick={() => { lidarComClickEmItem(item.link, item.sigla, item.nome) }}>{item.nome}</MenuItem>
                            }
                        </>
                    ))
                }
            </Menu>
        </Box>
    )
}
const SubmenuItem = (props: any) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuAberto = Boolean(anchorEl);
    const navegar = useNavigate()
    const dispatch = useDispatch();
    const lidarComClickEmExpandir = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    return (
        <>
            <MenuItem
                id={'basic-button-sub' + props.item.nome}
                dense sx={{ fontWeight: "bold", alignItems: 'center', justifyContent: 'space-between' }}
                aria-controls={menuAberto ? 'basic-menu-' + props.item.nome : undefined}
                onClick={(e) => lidarComClickEmExpandir(e)}
            >
                {props.item.nome}
                <ListItemIcon sx={{ marginRight: -2 }}>
                    <ArrowRight fontSize="small" color="action" />
                </ListItemIcon>
            </MenuItem>
            <Menu
                id={'basic-menu-' + props.item.nome}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                open={menuAberto}
                MenuListProps={{
                    'aria-labelledby': 'basic-button-sub' + props.item.nome,
                }}
                PaperProps={{
                    sx: { minWidth: 150, marginLeft: 1 }
                }}
            >
                {props.item.submenus.map((item: any) => (
                    <MenuItem dense onClick={() => { props.lidarComClickEmItem(item.link, item.sigla, item.nome) }}>{item.nome}</MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default MenuComponente