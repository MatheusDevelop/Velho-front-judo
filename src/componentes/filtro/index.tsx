import { Add, Close, FilterList } from '@mui/icons-material';
import { FormControl, Select, MenuItem, InputLabel, Button, Dialog, DialogActions, DialogContent, IconButton, TextField, Grid, Divider, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { ModeloCabecalho } from '../../modelos/ModeloCabecalho';

interface ITipoProps {
  mostrarFiltro: boolean, 
  setMostrarFiltro: any, 
  cabecalhos: ModeloCabecalho[],
  aplicarFiltro: any
}

interface IFiltro {
  parentesesInicial?: string,
  propriedade?: string,
  operador?: string,
  valor?: string,
  valorOpcional?: string,
  parentesesFinal?: string,
  proximoOperadorGrupo?: string,
  ehData?: boolean
}
export default function FiltroComponente({ mostrarFiltro, setMostrarFiltro, cabecalhos, aplicarFiltro }: ITipoProps) {
  const [filtros, setFiltros] = useState<IFiltro[]>([])
  const [parentesesAbertos, setParentesesAbertos] = useState(0)
  const estadoInicial: IFiltro = {
    proximoOperadorGrupo: '&&',
    parentesesFinal: '',
    parentesesInicial: ''
  };
  const [filtroAtual, setFiltroAtual] = useState<IFiltro>(estadoInicial)
  useEffect(() => {
  }, [filtroAtual])

  const lidarComClickEmAdicionarFiltro = () => {
    if (filtroAtual.parentesesInicial != null)
      setParentesesAbertos(estadoAtual => estadoAtual + 1)

    if (filtroAtual.parentesesFinal != null)
      setParentesesAbertos(estadoAtual => estadoAtual - 1)

    if (
      (filtroAtual.operador == "BETWEEN" && (filtroAtual.valorOpcional == null || filtroAtual.valorOpcional == ''))
      || (filtroAtual.valor == null || filtroAtual.valor == '')
    )
      setFiltrosValidos(false)


    setFiltros(estadoAtual => ([...estadoAtual, filtroAtual]))
    setFiltroAtual(estadoInicial)
  }
  const lidarComAplicarFiltro = async () => {
    if (parentesesAbertos != 0) {
      alert("Verifique os parenteses abertos/fechados e tente novamente")
      return
    }
    let filtroString = "";
    filtros.map((filtro, idx) => {
      if (!filtro.operador) return
      if (filtro.operador == "BETWEEN")
        if (filtro.ehData)
          filtroString += filtro.parentesesInicial
            + "dados.some(e=> {"
            + "return e.cabecalho == '" + filtro.propriedade + "' && new Date(e.valor).getTime()" + " >=" + "new Date('" + filtro.valor?.split('-').reverse().join('-') + "').getTime() && new Date(e.valor).getTime() <= new Date('" + filtro.valorOpcional?.split('-').reverse().join('-') + "').getTime()" +
            "})"
            + filtro.parentesesFinal
        else
          filtroString += filtro.parentesesInicial + "dados.some(e=> e.cabecalho == '" + filtro.propriedade + "' && e.valor >= " + filtro.valor + " && valor <= " + filtro.valorOpcional + ")" + filtro.parentesesFinal

      if (filtro.operador == "CONTAINS")
        if (filtro.ehData)
          filtroString += filtro.parentesesInicial
            + "dados.some(e=> {"
            + "return e.cabecalho == '" + filtro.propriedade + "' && new Date(e.valor).getTime()" + " ==" + "new Date('" + filtro.valor?.split('-').reverse().join('-') + "').getTime()" +
            "})"
            + filtro.parentesesFinal
        else
          filtroString += filtro.parentesesInicial + "dados.some(e=> e.cabecalho == '" + filtro.propriedade + "' && e.valor.includes('" + filtro.valor + "')" + ")" + filtro.parentesesFinal

      if (filtro.operador.includes(">") || filtro.operador.includes("<"))
        if (filtro.ehData)
          filtroString += filtro.parentesesInicial
            + "dados.some(e=> {"
            + "return e.cabecalho == '" + filtro.propriedade + "' && new Date(e.valor).getTime()" + filtro.operador + " new Date('" + filtro.valor?.split('-').reverse().join('-') + "').getTime()" +
            "})"
            + filtro.parentesesFinal
        else
          filtroString += filtro.parentesesInicial + "dados.some(e=> e.cabecalho == '" + filtro.propriedade + "' && e.valor" + filtro.operador + " " + filtro.valor + ")" + filtro.parentesesFinal

      if (idx + 1 != filtros.length)
        filtroString += " " + filtro.proximoOperadorGrupo + " "
    })
    console.log(filtroString)
    aplicarFiltro(filtroString)
    setMostrarFiltro(false)
  }
  const [filtrosValidos, setFiltrosValidos] = useState(true)
  return (
    <Dialog
      open={mostrarFiltro}
      onClose={() => setMostrarFiltro(false)}
      aria-labelledby="alert-dialog-title"
      fullWidth
      maxWidth="lg"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <Grid container mt={.2} spacing={2}>
          {filtros.map((filtro, idx) => {
            return (
              <FiltroLinha
                filtroAtual={filtro}
                cabecalhos={cabecalhos}
                gridItem={false}
                lidarComMudancaNoFiltro={(propriedade: string, valor: any) => {
                  if (propriedade == "parentesesFinal")
                    if (valor == ")")
                      setParentesesAbertos(estadoAtual => estadoAtual - 1)
                    else
                      setParentesesAbertos(estadoAtual => estadoAtual + 1)

                  if (propriedade == "parentesesInicial")
                    if (valor == "(")
                      setParentesesAbertos(estadoAtual => estadoAtual + 1)
                    else
                      setParentesesAbertos(estadoAtual => estadoAtual - 1)

                  setFiltros(estadoAtual => {
                    let novosFiltros = [...estadoAtual]
                    let filtro = novosFiltros[idx]
                    filtro = { ...filtro, [propriedade]: valor }
                    if (
                      (filtro.operador == "BETWEEN" && (filtro.valorOpcional == null || filtro.valorOpcional == ''))
                      || ((propriedade == 'valor') && filtro.valor == null || filtro.valor == '')
                    )
                      setFiltrosValidos(false)
                    else
                      setFiltrosValidos(true)
                    novosFiltros[idx] = filtro;
                    return novosFiltros
                  })
                }}
                lidarComRemoverFiltro={() => {
                  let novosFiltros = [...filtros];

                  let filtro = novosFiltros[idx]

                  if (filtro.parentesesFinal == ")") setParentesesAbertos(s => s + 1)
                  if (filtro.parentesesInicial == "(") setParentesesAbertos(s => s - 1)

                  if (
                    (filtro.operador == "BETWEEN" && (filtro.valorOpcional == null || filtro.valorOpcional == ''))
                    || (filtro.valor == null || filtro.valor == '')
                  )
                    setFiltrosValidos(true)

                  novosFiltros.splice(idx, 1);
                  setFiltros(novosFiltros)
                }}
                setFiltrosValidos={setFiltrosValidos}
                abrirParenteses={() => setParentesesAbertos(s => s + 1)}
                fecharParenteses={() => setParentesesAbertos(s => s - 1)}

              />
            )
          })}
        </Grid>
        <Divider />
        <Grid container mt={2}>
          <FiltroLinha
            gridItem
            filtroAtual={filtroAtual}
            cabecalhos={cabecalhos}
            setFiltrosValidos={setFiltrosValidos}
            lidarComMudancaNoFiltro={(propriedade: string, valor: any) => {
              setFiltroAtual(estadoAtual => ({ ...estadoAtual, [propriedade]: valor }))
            }}
            lidarComRemoverFiltro={null}
            abrirParenteses={() => setParentesesAbertos(parentesesAbertos + 1)}
            fecharParenteses={() => setParentesesAbertos(parentesesAbertos - 1)}
          />
          <Grid container item xs={1.5} spacing={1} ml={1}>
            <Grid item>
              <IconButton
                disabled={!filtrosValidos}
                onClick={lidarComClickEmAdicionarFiltro}
                color="success">
                <Add />
              </IconButton>
            </Grid>

            <Grid item>
              <IconButton color="error"
                onClick={() => {
                  setFiltroAtual(estadoInicial)
                }}
              >
                <Close />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!filtrosValidos || filtros.length == 0}
          variant="contained"
          onClick={lidarComAplicarFiltro}
          size='large' startIcon={<FilterList />}
          autoFocus>
          Executar
        </Button>
        <Button
          color="error"
          variant="outlined"
          size='large' startIcon={<Close />}
          onClick={() => setMostrarFiltro(false)}>Cancelar</Button>
      </DialogActions>
    </Dialog >
  );
}

interface IFiltroLinhaTipoProps {
  filtroAtual: IFiltro, cabecalhos: ModeloCabecalho[], lidarComMudancaNoFiltro: any, gridItem: boolean, lidarComRemoverFiltro: any,
  abrirParenteses: any, fecharParenteses: any, setFiltrosValidos: any
}
function FiltroLinha({ setFiltrosValidos, filtroAtual, cabecalhos, lidarComMudancaNoFiltro, gridItem, lidarComRemoverFiltro, abrirParenteses, fecharParenteses }: IFiltroLinhaTipoProps) {
  useEffect(() => {
  }, [filtroAtual])
  return (
    <Grid container item={gridItem} xs={gridItem} spacing={2} mb={2}>
      <Grid item>
        <FormControl
          size="small"
        >
          <Select
            fullWidth
            value={filtroAtual.parentesesInicial || ''}
            onChange={e => {
              const valor = e.target.value;
              lidarComMudancaNoFiltro('parentesesInicial', `${valor}`)
            }}
          >
            <MenuItem value={''}><i>Vazio</i></MenuItem>
            <MenuItem value={'('}>(</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs>
        <FormControl
          size="small"
          fullWidth
        >
          <InputLabel id="filter-modal-label">Campo</InputLabel>
          <Select
            value={filtroAtual.propriedade || ''}
            label="Campo"
            onChange={e => {
              const valor = e.target.value;
              let cabecalho = cabecalhos.find(e => e.nome == valor);
              if (!cabecalho) return
              lidarComMudancaNoFiltro('propriedade', `${valor}`)
              lidarComMudancaNoFiltro('ehData', cabecalho.tipo == 'date')
              lidarComMudancaNoFiltro('valor', '')
              lidarComMudancaNoFiltro('valorOpcional', '')

            }}
          >
            {cabecalhos.filter(e => e.tipo != "imagem").map(cabecalho => (
              <MenuItem value={cabecalho.nome}>
                {cabecalho.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs>
        <FormControl
          size="small"
          fullWidth>
          <InputLabel>Filtro</InputLabel>
          <Select
            label="Filtro"
            value={filtroAtual.operador || ''}
            disabled={filtroAtual.propriedade == null}
            onChange={e => {
              const valor = e.target.value;
              lidarComMudancaNoFiltro('operador', `${valor}`)
            }}
          >
            <MenuItem value={'CONTAINS'}>CONTÉM</MenuItem>
            <MenuItem value={'IN'}>IN</MenuItem>
            <MenuItem value={'BETWEEN'}>Entre</MenuItem>
            <MenuItem value={'>='}> {'>='} </MenuItem>
            <MenuItem value={'<='}> {'<='} </MenuItem>
            <MenuItem value={'<'}> {'<'} </MenuItem>
            <MenuItem value={'>'}> {'>'} </MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs>
        <TextField
          fullWidth

          type={filtroAtual.ehData ? "date" : "text"}
          value={filtroAtual.valor || ''}
          disabled={filtroAtual.operador == null}
          error={filtroAtual.valor == null || filtroAtual.valor == ''}
          onChange={e => {
            const valor = e.target.value;
            lidarComMudancaNoFiltro('valor', `${valor}`)

          }}
          InputLabelProps={{ shrink: true }}
          size="small"
          variant="outlined" />
      </Grid>
      <Grid item>
        <TextField
          fullWidth
          type={filtroAtual.ehData ? "date" : "text"}
          value={filtroAtual.valorOpcional || ''}
          disabled={filtroAtual.operador != 'BETWEEN'}
          error={filtroAtual.operador == "BETWEEN" && filtroAtual.valorOpcional == null || filtroAtual.valorOpcional == ''}
          onChange={e => {
            const valor = e.target.value;
            lidarComMudancaNoFiltro('valorOpcional', `${valor}`)
          }}
          size="small"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
        />
      </Grid>

      <Grid item xs={1}>
        <FormControl
          size="small"
        >
          <Select
            value={filtroAtual.parentesesFinal || ''}
            onChange={e => {
              const valor = e.target.value;
              lidarComMudancaNoFiltro('parentesesFinal', `${valor}`)
            }}
          >
            <MenuItem value={''}><i>Vazio</i></MenuItem>
            <MenuItem value={')'}>)</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={1}>
        <FormControl
          size="small"
        >
          <Select
            value={filtroAtual.proximoOperadorGrupo || ''}
            onChange={e => {
              const valor = e.target.value;
              lidarComMudancaNoFiltro('proximoOperadorGrupo', `${valor}`)
            }}
          >
            <MenuItem value={'&&'}>E</MenuItem>
            <MenuItem value={'||'}>OU</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {!gridItem &&
        <Grid container item xs={1} spacing={1}>
          <Grid item>
            <IconButton color="error"
              onClick={lidarComRemoverFiltro}
            >

              <Close />
            </IconButton>
          </Grid>
        </Grid>
      }
    </Grid>
  )
}

