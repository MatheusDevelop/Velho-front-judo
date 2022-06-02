import { Close, IosShareOutlined } from '@mui/icons-material'
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ModeloCabecalho } from '../../modelos/ModeloCabecalho'
import { ModeloLinha } from '../../modelos/ModeloLinha'
import { ModeloCelula } from '../../modelos/ModeloCelula'
import { gerarArquivoExcel } from '../../servicos/servicosExcel'
import { adicionaZero } from '../../utilitarios/dataUtilitarios'
import { useSelector } from 'react-redux'
import { IEstadoInicial } from '../../redux/reducerRaiz'

interface ITipoProps {
    mostrarExportar: boolean,
    setMostrarExportar: any,
    cabecalhos: ModeloCabecalho[],
    linhasEncontradas: ModeloLinha[]
}
function ExportarComponente({ mostrarExportar, setMostrarExportar, cabecalhos, linhasEncontradas }: ITipoProps) {
    const [indicesDeCabecalhosSelecionados, setIndicesDeCabecalhosSelecionados] = useState<number[]>(cabecalhos.filter(e => e.tipo != 'imagem').map((c, index) => index))
    const [tudoChecado, setTudoChecado] = useState(false)
    const { nomeFuncao } = useSelector<IEstadoInicial, { nomeFuncao: string }>((estado: IEstadoInicial) => {
        return {
            nomeFuncao: estado.menuAtual,
        }
    });
    useEffect(() => {
        setIndicesDeCabecalhosSelecionados(cabecalhos.filter(e => e.tipo != 'imagem').map((c, index) => index))
        setTudoChecado(true)
    }, [mostrarExportar])

    const listaDeCabecalhos = cabecalhos.filter(e => e.tipo != "imagem").map((cabecalho, indice) => (
        <ListItem
            disableGutters
            disablePadding
            key={indice}
        >
            <ListItemButton
                role={undefined}
                onClick={() => lidarComClickEmItem(indice)}
            >
                <ListItemIcon>
                    <Checkbox
                        size="small"
                        checked={indicesDeCabecalhosSelecionados.includes(indice)}
                    />
                </ListItemIcon>
                <ListItemText primary={cabecalho.nome} />
            </ListItemButton>
        </ListItem>
    ))
    const lidarComClickEmItem = (indice: number) => {
        const indiceJaAdicionado = indicesDeCabecalhosSelecionados.includes(indice)
        if (indiceJaAdicionado) {
            setTudoChecado(false)
            setIndicesDeCabecalhosSelecionados(indicesAtuais => indicesAtuais.filter(indiceAtual => indiceAtual != indice))
        }
        else {
            setIndicesDeCabecalhosSelecionados(indicesAtuais => {
                if (cabecalhos.filter(e => e.tipo != 'imagem').length == indicesAtuais.length + 1)
                    setTudoChecado(true)
                return [...indicesAtuais, indice]
            })
        }
    }
    const lidarComClickEmExportar = async () => {
        let linhasFiltradas: ModeloLinha[] = []
        linhasEncontradas.map(linha => {
            let valoresFiltrados = linha.valores.filter((valor, indice) => {
                let pular = 1;
                if (linha.valores.find(e => e.nome == "SELECAO"))
                    pular++
                if (linha.valores.find(e => e.nome == "ANOTACAO"))
                    pular++
                if (indice < pular) return false
                let tipo = cabecalhos[indice - pular].tipo;
                if (tipo == "imagem") return
                return valor;
            }).filter((valor, indice) => indicesDeCabecalhosSelecionados.includes(indice))
            linhasFiltradas.push({ valores: valoresFiltrados })
        })
        let cabecalhosSelecionados = indicesDeCabecalhosSelecionados.sort((a, p) => a - p).map(indiceDoCabecalho => cabecalhos.filter(e => e.tipo != 'imagem')[indiceDoCabecalho])
        let linhaCabecalhos: string[] = cabecalhosSelecionados.map(c => c.nome)
        let linhas: string[][] = linhasFiltradas.map((linha) => linha.valores.map((valor, indice) => {
            if (cabecalhosSelecionados[indice].tipo == "date") {
                let data = new Date(valor.nome);
                //@ts-ignore
                let dataFormatada = (adicionaZero(+data.getDate().toString()) + "/" + (adicionaZero(data.getMonth() + 1).toString()) + "/" + data.getFullYear());
                return dataFormatada;
            }
            return `${valor.nome}`
        }))
        const modelo = {
            cabecalhos: linhaCabecalhos,
            linhas
        }
        await gerarArquivoExcel(modelo, nomeFuncao)
        setMostrarExportar(false)
    }
    return (
        <Dialog
            open={mostrarExportar}
            onClose={() => setMostrarExportar(false)}
            aria-labelledby="alert-dialog-title"
            fullWidth
            maxWidth="sm"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <Grid container alignItems="center" padding={2}>
                    <Grid item>
                        <Checkbox checked={tudoChecado} onClick={() => {
                            if (!tudoChecado)
                                setIndicesDeCabecalhosSelecionados(cabecalhos.filter(e => e.tipo != 'imagem').map((c, index) => index))
                            else
                                setIndicesDeCabecalhosSelecionados([])
                            setTudoChecado(s => !s)
                        }} />
                    </Grid>
                    <Grid item>
                        <DialogTitle id="alert-dialog-title">
                            {"Selecione os campos para exportar"}
                        </DialogTitle>

                    </Grid>
                </Grid>
                <Divider />
                <List dense>
                    {listaDeCabecalhos}
                </List>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    size='large'
                    onClick={lidarComClickEmExportar}
                    disabled={indicesDeCabecalhosSelecionados.length == 0}
                    startIcon={<IosShareOutlined />}
                >
                    Exportar
                </Button>
                <Button
                    onClick={() => setMostrarExportar(false)}
                    variant="contained"
                    size='large'
                    startIcon={<Close />}
                >
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )

}

export default ExportarComponente