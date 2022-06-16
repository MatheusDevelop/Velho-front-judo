import { Add, ArrowCircleLeftOutlined, CleaningServices, CloseOutlined, EastOutlined, FilterAltOutlined, IosShareOutlined, ReplayOutlined, Search, UploadFileOutlined, VisibilityOutlined, WestOutlined } from '@mui/icons-material';
import { Alert, AlertTitle, Button, DialogContentText, DialogTitle, IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Divider, Checkbox, FormControlLabel, Typography, TableSortLabel } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModeloCabecalho } from '../../modelos/ModeloCabecalho';
import { ModeloLinha } from '../../modelos/ModeloLinha';
import { atualizarSelecao } from '../../servicos/servicosSelecao';
import { adicionaZero } from '../../utilitarios/dataUtilitarios';
import ExportarComponente from '../exportar';
import FiltroComponente from '../filtro';

interface ITipoProps {
  cabecalhos: ModeloCabecalho[],
  linhas: ModeloLinha[],
  nomeTabela: string,
  setarSecaoAtual: any,
  carregando: boolean,
  lidarComClickEmLinhaGrid: any
  temPermissao: any
}

export default function ComponenteListagem({ temPermissao, cabecalhos, linhas, nomeTabela, setarSecaoAtual, carregando, lidarComClickEmLinhaGrid }: ITipoProps) {
  const [termo, setTermo] = useState("")
  const [idsSelecionados, setIdsSelecionados] = useState<string[]>([])
  const [ordenacoes, setOrdenacoes] = useState<{ cabecalho: string, asc: boolean }[]>([])

  const [linhasEncontradas, setLinhasEncontradas] = useState<ModeloLinha[]>([])
  const [mostrarFiltro, setMostrarFiltro] = useState(false)
  const [mostrarExportar, setMostrarExportar] = useState(false)
  const [limpezasFiltro, setLimpezasFiltro] = useState(0)
  const [filtro, setFiltro] = useState("");
  const navegar = useNavigate()
  const lidarComQuicksearch = async (termoProcurado: string) => {
    setTermo(termoProcurado)
  }
  const [marcarTodos, setMarcarTodos] = useState(false)

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
    let linhasFiltradas = linhas
      .filter((linha, idx) => {
        if (termo == "" && filtro == "") {
          // setLinhasEncontradas(idx + 1)
          return true
        }
        let termoFiltrado = false
        let filtroFiltrado = false
        let dadosParaFiltrar: { cabecalho: string, valor: string }[] = []

        linha.valores.map((valor, idx) => {
          if (termo != "")
            if (valor.nome.toLowerCase().includes(termo.toLowerCase()))
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

      }).sort((atual, posterior) => {
        const valores: { valor: any, tipo: string }[] = []
        atual.valores.map((valor, idx) => {
          let pular = 1;
          if (atual.valores.find(e => e.nome == "SELECAO"))
            pular++
          if (atual.valores.find(e => e.nome == "ANOTACAO"))
            pular++
          if (idx < pular) return
          let cabecalho = cabecalhos[idx - pular]
          let coluna = {
            cabecalho: cabecalho.nome,
            indice: idx,
            tipo: cabecalho.tipo
          }
          let valorAtual: any = atual.valores[idx].nome.toUpperCase();
          let valorPosterior: any = posterior.valores[idx].nome.toUpperCase();
          if (coluna.tipo.includes('date')) {
            valorAtual = new Date(valorAtual)
            valorPosterior = new Date(valorPosterior)
          }
          let ordenacao = ordenacoes.find(e => e.cabecalho == coluna.cabecalho)
          if (!ordenacao) return;
          valores.push({ valor: valorAtual, tipo: coluna.tipo })
          valores.push({ valor: valorPosterior, tipo: coluna.tipo })
        })
        if (valores.length == 0) return 0
        if (valores[0].tipo == "date")
          return valores[0].valor - valores[1].valor

        return valores[1].valor.localeCompare(valores[0].valor)
      })
    if (ordenacoes.length > 0)
      if (ordenacoes[0].asc)
        linhasFiltradas = linhasFiltradas.reverse();

    setLinhasEncontradas(linhasFiltradas)
  }, [filtro, termo, ordenacoes])


  return (
    <>
      <Stack sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', position: "absolute",right:45,zIndex:99,top:58 }}>
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
              color={filtro != '' || ordenacoes.length > 0 ? 'warning' : 'default'}
              onClick={() => {
                setFiltro('')
                setLimpezasFiltro(s => s + 1)
                setOrdenacoes([])
              }}
            >
              <CleaningServices />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ flex: 1, backgroundColor: "#cccccc", display: 'flex', flexDirection: "column" }}>
          <Box margin={2} sx={{ position: 'relative', flex: 1 }}>
            <TableContainer component={Paper} sx={{ overflowY: 'scroll', position: 'absolute', right: 0, top: 0, bottom: 0, left: 0 }}>
              <Table>
                {
                  !carregando &&
                  <TableHead
                    sx={{
                      backgroundColor: '#f5f5f5',
                      color: "#1976d2!important"
                    }}
                  >
                    {
                      linhas[0] && linhas[0].valores.find(e => e.nome == "SELECAO") && temPermissao("10") &&
                      <TableCell
                        padding="none"

                      >
                        <Checkbox checked={marcarTodos} onChange={
                          lidarComMudancaEmSelecionarTudo
                        } />
                      </TableCell>
                    }
                    {
                      cabecalhos.filter(e => {
                        return e.tipo != "imagem"
                      }).map((cabecalho, idx) => {
                        const idxOrd = ordenacoes.findIndex(e => e.cabecalho == cabecalho.nome);
                        const ord = ordenacoes[idxOrd]
                        return (
                          <>
                            <TableCell
                              padding="none"
                              sx={{ pr: 3 }}
                              key={idx} style={{ minWidth: cabecalho.nome.length * 1.31 + 'ch', marginRight: 16 }}>
                              <TableSortLabel
                                active={ord != undefined}
                                direction={ord ? ord.asc ? 'asc' : 'desc' : 'asc'}
                                onClick={() => {
                                  setOrdenacoes(s => {
                                    if (ord) {
                                      let arr = [...s]
                                      arr[idxOrd] = { cabecalho: cabecalho.nome, asc: !ord.asc }
                                      return arr;
                                    }
                                    return [{ cabecalho: cabecalho.nome, asc: true }]
                                  })
                                }}
                              >
                                {cabecalho.nome}
                              </TableSortLabel>
                            </TableCell>
                          </>
                        )
                      })
                    }
                    {
                      linhas[0] && linhas[0].valores.find(e => e.nome == "ANOTACAO") &&
                      <TableCell
                        padding="none"
                        style={{ minWidth: 200 }}>
                        Anotações
                      </TableCell>
                    }

                  </TableHead>
                }
                {
                  linhas.length == 0 && !carregando &&
                  <Box m={2} sx={{ width: 300 }}>

                    <Typography variant={'subtitle2'}>
                      Nenhum dado encontrado
                    </Typography>
                  </Box>
                }
                <TableBody>

                  {
                    linhasEncontradas.map((linha, id) => (
                      <TableRow
                        key={id}

                        sx={{ cursor: 'pointer' }}
                        hover={temPermissao("5")}>
                        <>
                          {linha.valores.map((valor, idx) => {
                            var chavePrimaria = linha.valores.find(e => e.chavePrimaria == true);
                            if (valor.chavePrimaria) return
                            if (valor.nome == "SELECAO" && temPermissao("10")) {
                              return (
                                <TableCell
                                  padding="none"
                                  key={idx}>
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
                                <TableCell
                                  padding="none"
                                  sx={{ pr: 3 }}
                                  onClick={() => {
                                    if (!temPermissao("5")) return
                                    let inputsIniciais: { nome: string, valor: string }[] = []
                                    linha.valores.map((valor, idx) => {
                                      let pular = 1;
                                      if (linha.valores.find(e => e.nome == "SELECAO"))
                                        pular++
                                      if (linha.valores.find(e => e.nome == "ANOTACAO"))
                                        pular++
                                      if (idx < pular) return
                                      let cabecalho = cabecalhos[idx - pular];
                                      cabecalho.tipo == "date" ?
                                        inputsIniciais.push({ nome: cabecalho.nomeColunaBanco, valor: new Date(valor.valor).getFullYear() + "-" + adicionaZero(new Date(valor.valor).getMonth() + 1) + "-" + adicionaZero(new Date(valor.valor).getDate()) })
                                        :
                                        inputsIniciais.push({ nome: cabecalho.nomeColunaBanco, valor: valor.valor })
                                    })
                                    let valorAnotacao = linha.valores.find(e => e.nome == "ANOTACAO")
                                    if (valorAnotacao)
                                      inputsIniciais.push({ nome: 'ANOTACAO', valor: valorAnotacao.valor })

                                    let chavePrimaria = linha.valores.find(e => e.chavePrimaria)
                                    if (chavePrimaria)
                                      lidarComClickEmLinhaGrid(inputsIniciais, chavePrimaria.valor, chavePrimaria.nome)
                                  }}

                                  key={idx}>
                                  {dataFormatada}
                                </TableCell>
                              )
                            }

                            return (
                              <TableCell
                                padding="none"
                                sx={{ pr: 3 }}
                                onClick={() => {
                                  if (!temPermissao("5")) return
                                  let inputsIniciais: { nome: string, valor: string }[] = []
                                  linha.valores.map((valor, idx) => {
                                    let pular = 1;
                                    if (linha.valores.find(e => e.nome == "SELECAO"))
                                      pular++
                                    if (linha.valores.find(e => e.nome == "ANOTACAO"))
                                      pular++
                                    if (idx < pular) return
                                    let cabecalho = cabecalhos[idx - pular];
                                    cabecalho.tipo == "date" ?
                                      inputsIniciais.push({ nome: cabecalho.nomeColunaBanco, valor: new Date(valor.valor).getFullYear() + "-" + adicionaZero(new Date(valor.valor).getMonth() + 1) + "-" + adicionaZero(new Date(valor.valor).getDate()) })
                                      :
                                      inputsIniciais.push({ nome: cabecalho.nomeColunaBanco, valor: valor.valor })
                                  })
                                  let valorAnotacao = linha.valores.find(e => e.nome == "ANOTACAO")
                                  if (valorAnotacao)
                                    inputsIniciais.push({ nome: 'ANOTACAO', valor: valorAnotacao.valor })

                                  let chavePrimaria = linha.valores.find(e => e.chavePrimaria)
                                  if (chavePrimaria)
                                    lidarComClickEmLinhaGrid(inputsIniciais, chavePrimaria.valor, chavePrimaria.nome)
                                }}
                                key={idx}>
                                {valor.nome}
                              </TableCell>
                            )
                          })}
                          {linha.valores.filter(e => e.nome == "ANOTACAO").map((valor, ida) => {
                            return (
                              <TableCell
                                padding="none"
                                key={ida}>
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
              {
                linhas.length > 0 &&
                <Box sx={{ position: 'absolute', bottom: 0, left: 10 }}>
                  <Typography>
                    {linhasEncontradas.length} de {linhas.length}  encontrados
                  </Typography>
                </Box>
              }
            </TableContainer>
          </Box>
        </Box>
        <Box  sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {
              temPermissao("2") &&
              <Box margin={1}>
                <Button
                  onClick={() => setarSecaoAtual(1)}
                  size='large'
                  variant="contained"
                  startIcon={<Add />}
                >
                  Incluir
                </Button>
              </Box>
            }
            {
              temPermissao("11") &&
              <Box margin={1}>
                <Button
                  disabled={linhas.length == 0}
                  onClick={() => setMostrarFiltro(true)}
                  variant="contained"
                  size='large'

                  startIcon={<FilterAltOutlined />}
                >
                  Filtrar
                </Button>
              </Box>
            }
            {
              temPermissao("8") &&
              <Box margin={1}>
                <Button
                  disabled={linhasEncontradas.length == 0}
                  onClick={() => setMostrarExportar(true)}
                  variant="contained"
                  size='large'
                  startIcon={<UploadFileOutlined />}
                >
                  Exportar
                </Button>
              </Box>
            }
              <Box margin={1}>
                <Button
                  onClick={() => navegar('/')}
                  variant="contained"
                  size='large'
                  startIcon={<ReplayOutlined />}
                >
                  Voltar
                </Button>
              </Box>

          </Box>
        </Box>
        <FiltroComponente
          limparFiltro={limpezasFiltro}
          mostrarFiltro={mostrarFiltro}
          setMostrarFiltro={setMostrarFiltro}
          cabecalhos={cabecalhos}
          aplicarFiltro={(filtroString: string) => {
            setFiltro(filtroString)
          }}
        />
        <ExportarComponente
          mostrarExportar={mostrarExportar}
          cabecalhos={cabecalhos}
          setMostrarExportar={setMostrarExportar}
          linhasEncontradas={linhasEncontradas}
        />
      </Stack>
    </>

  );
}



