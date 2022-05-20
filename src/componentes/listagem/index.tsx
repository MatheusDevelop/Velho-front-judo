import { Add, CleaningServices, CloseOutlined, FilterAltOutlined, IosShareOutlined, Search, UploadFileOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Alert, AlertTitle, Button, DialogContentText, DialogTitle, IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Divider, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { ModeloCabecalho } from '../../modelos/ModeloCabecalho';
import { ModeloLinha } from '../../modelos/ModeloLinha';
import { atualizarSelecao } from '../../servicos/servicosSelecao';
import FiltroComponente from '../filtro';

interface ITipoProps {
  cabecalhos: ModeloCabecalho[],
  linhas: ModeloLinha[],
  nomeTabela: string,
  setarSecaoAtual: any
}

export default function ComponenteListagem({ cabecalhos, linhas, nomeTabela, setarSecaoAtual }: ITipoProps) {
  const [termo, setTermo] = useState("")
  const [idsSelecionados, setIdsSelecionados] = useState<string[]>([])

  const [linhasEncontradas, setLinhasEncontradas] = useState<ModeloLinha[]>([])
  const [mostrarFiltro, setMostrarFiltro] = useState(false)
  const [filtro, setFiltro] = useState("");

  const lidarComQuicksearch = async (termoProcurado: string) => {
    setTermo(termoProcurado)
  }
  const [marcarTodos, setMarcarTodos] = useState(false)
  function adicionaZero(numero: number) {
    if (numero <= 9)
      return "0" + numero;
    else
      return numero;
  }
  const lidarComMudancaEmSelecionarTudo = async () => {
    linhas.filter(linha => {
      if (termo == "")
        return true
      let filtrado = false
      linha.valores.map(valor => {
        if (valor.nome.includes(termo))
          filtrado = true;
      });
      return filtrado;

    }).map(async linha => {
      var chavePrimaria = linha.valores.find(e => e.chavePrimaria == true);
      if (chavePrimaria) {
        if (marcarTodos)
          await desmarcarCheck(chavePrimaria.valor)
        else
          await marcarCheck(chavePrimaria.valor)
      }
    })

    setMarcarTodos(!marcarTodos)

  }
  const marcarCheck = async (id: string) => {
    var chavePrimaria = linhas[0].valores.find(e => e.chavePrimaria == true);
    setIdsSelecionados(s => [...s, id])
    if (chavePrimaria)
      await atualizarSelecao(id, true, nomeTabela, chavePrimaria.nome)
  }
  const desmarcarCheck = async (id: string) => {
    setMarcarTodos(false)
    var chavePrimaria = linhas[0].valores.find(e => e.chavePrimaria == true);
    setIdsSelecionados(estado => estado.filter(idSelecionado => idSelecionado != id))
    if (chavePrimaria)
      await atualizarSelecao(id, false, nomeTabela, chavePrimaria.nome)
  }
  useEffect(() => {
    linhas.map(linha => {
      linha.valores.map(valor => {
        if (valor.nome == "SELECAO") {
          if (valor.valor != " ") {
            var chavePrimaria = linha.valores.find(e => e.chavePrimaria == true);
            if (chavePrimaria) {
              let id = chavePrimaria.valor
              setIdsSelecionados(s => [...s, id])
            }
          }
        }

      })
    })
  }, [])
  useEffect(() => {
    let linhasFiltradas = linhas.filter((linha, idx) => {
      if (termo == "" && filtro == "") {
        // setLinhasEncontradas(idx + 1)
        return true
      }
      let termoFiltrado = false
      let filtroFiltrado = false
      let dadosParaFiltrar: { cabecalho: string, valor: string }[] = []

      linha.valores.map((valor, idx) => {
        if (termo != "")
          if (valor.nome.includes(termo))
            termoFiltrado = true;

        if (filtro != "") {
          let pular = 1;
          if (linha.valores.find(e => e.nome == "SELECAO"))
            pular++
          if (linha.valores.find(e => e.nome == "ANOTACAO"))
            pular++
          if (idx < pular) return
          let cabecalho = cabecalhos[idx - pular]
          let objeto = {
            cabecalho: cabecalho.nome,
            valor: valor.nome
          }
          dadosParaFiltrar.push(objeto)
        }
      });
      if (filtro != "") {
        let funcaoDeFiltrar = new Function('dados', `
        return ${filtro}
        `)
        filtroFiltrado = funcaoDeFiltrar(dadosParaFiltrar);
      }
      if (termo == "" && filtro != "")
        return filtroFiltrado
      if (termo != "" && filtro == "")
        return termoFiltrado

      return filtroFiltrado && termoFiltrado;

    })

    setLinhasEncontradas(linhasFiltradas)
  }, [filtro, termo])


  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Box padding={2}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>

            <TextField variant='outlined' size='small' label='Pesquisar'
              onChange={e => lidarComQuicksearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              }} />
            <Box marginLeft={1}>
              <IconButton
                color={filtro != '' ? 'warning':'default'}
                
                onClick={()=> setFiltro('')}
              >
                <CleaningServices />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 1, backgroundColor: "#cccccc", display: 'flex', flexDirection: "column" }}>
          <Box margin={2} sx={{ position: 'relative', flex: 1 }}>
            <TableContainer component={Paper} sx={{ overflowY: 'scroll', position: 'absolute', right: 0, top: 0, bottom: 0, left: 0 }}>
              <Table>
                <TableHead>
                  {
                    linhas[0] && linhas[0].valores.find(e => e.nome == "SELECAO") &&
                    <TableCell>
                      <Checkbox checked={marcarTodos} onChange={
                        lidarComMudancaEmSelecionarTudo
                      } />
                    </TableCell>
                  }
                  {
                    cabecalhos.filter(e => {
                      return e.tipo != "imagem"
                    }).map(cabecalho => (
                      <>
                        <TableCell style={{ minWidth: 200 }}>
                          {cabecalho.nome}
                        </TableCell>
                      </>
                    ))
                  }
                  {
                    linhas[0] && linhas[0].valores.find(e => e.nome == "ANOTACAO") &&
                    <TableCell style={{ minWidth: 200 }}>
                      Anotações
                    </TableCell>
                  }

                </TableHead>
                <TableBody>
                  {
                    linhasEncontradas.map(linha => (
                      <TableRow
                        onClick={() => {
                          var chavePrimaria = linha.valores.find(e => e.chavePrimaria == true);
                        }}
                        sx={{ cursor: 'pointer' }}
                        hover>
                        <>
                          {linha.valores.map((valor, idx) => {
                            var chavePrimaria = linha.valores.find(e => e.chavePrimaria == true);
                            if (valor.chavePrimaria) return
                            if (valor.nome == "SELECAO") {
                              return (
                                <TableCell>
                                  <Checkbox checked={chavePrimaria && idsSelecionados.includes(chavePrimaria.valor)}
                                    onChange={() => {
                                      if (chavePrimaria) {
                                        let id = chavePrimaria.valor
                                        if (idsSelecionados.includes(chavePrimaria.valor)) {
                                          desmarcarCheck(id);
                                        } else {
                                          marcarCheck(id);
                                        }
                                      }
                                    }} />
                                </TableCell>
                              )
                            }
                            let pular = 1;

                            if (linha.valores.find(e => e.nome == "SELECAO"))
                              pular++
                            if (linha.valores.find(e => e.nome == "ANOTACAO"))
                              pular++
                            if (idx < pular) return
                            let tipo = cabecalhos[idx - pular].tipo;
                            if (tipo == "imagem") return;
                            if (tipo == "date") {

                              let data = new Date(valor.nome);
                              //@ts-ignore
                              let dataFormatada = (adicionaZero(+data.getDate().toString()) + "/" + (adicionaZero(data.getMonth() + 1).toString()) + "/" + data.getFullYear());
                              return (
                                <TableCell>
                                  {dataFormatada}
                                </TableCell>
                              )
                            }

                            return (
                              <TableCell>
                                {valor.nome}
                              </TableCell>
                            )
                          })}
                          {linha.valores.filter(e => e.nome == "ANOTACAO").map(valor => {
                            return (
                              <TableCell>
                                {valor.valor.length > 1 ? "SIM" : "NÃO"}
                              </TableCell>
                            )
                          })}
                        </>

                      </TableRow>
                    ))
                  }

                </TableBody>
              </Table>
              <Box sx={{ position: 'absolute', bottom: 0, left: 10 }}>
                <Typography>
                  {linhasEncontradas.length} de {linhas.length}  encontrados
                </Typography>
              </Box>
            </TableContainer>
          </Box>
        </Box>
        <Box padding={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box margin={1}>
              <Button onClick={() => setarSecaoAtual(1)} variant="contained" size='large' startIcon={<Add />}>
                Incluir
              </Button>
            </Box>
            <Box margin={1}>
              <Button
                onClick={() => setMostrarFiltro(true)}
                variant="outlined" size='large' startIcon={<FilterAltOutlined />}>
                Filtrar
              </Button>
            </Box>
            {/*
            <Box margin={1}>
              <Button
                onClick={() => setAbrirModalExportar(true)}
                variant="outlined" size='large' startIcon={<UploadFileOutlined />}>
                Exportar
              </Button>
            </Box> */}



          </Box>
        </Box>
        <FiltroComponente mostrarFiltro={mostrarFiltro} setMostrarFiltro={setMostrarFiltro} cabecalhos={cabecalhos} aplicarFiltro={(filtroString: string) => {
          setFiltro(filtroString)
        }} />
      </Stack>
    </>

  );
}



