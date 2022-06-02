import { Add, Close, FilterList } from '@mui/icons-material';
import { FormControl, Select, MenuItem, InputLabel, Button, Dialog, DialogActions, DialogContent, IconButton, TextField, Grid, Divider, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { ModeloCabecalho } from '../../modelos/ModeloCabecalho';

interface ITipoProps {
  mostrarFiltro: boolean,
  setMostrarFiltro: any,
  cabecalhos: ModeloCabecalho[],
  aplicarFiltro: any,
  limparFiltro: any
}

interface IFiltro {
  parentesesInicial?: string,
  propriedade?: string,
  operador?: string,
  valor?: string,
  valorOpcional?: string,
  parentesesFinal?: string,
  proximoOperadorGrupo?: string,
  ehData?: boolean,

}
export default function FiltroComponente({ mostrarFiltro, setMostrarFiltro, cabecalhos, aplicarFiltro, limparFiltro }: ITipoProps) {
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

  useEffect(() => {
    setFiltros([])
  }, [limparFiltro])


  const lidarComClickEmAdicionarFiltro = () => {
    console.log(filtroAtual.parentesesInicial != '', filtroAtual.parentesesFinal != '')
    if (filtroAtual.parentesesInicial != '')
      setParentesesAbertos(estadoAtual => estadoAtual + 1)

    if (filtroAtual.parentesesFinal != '')
      setParentesesAbertos(estadoAtual => estadoAtual - 1)
    console.log(parentesesAbertos, filtroAtual)
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
          filtroString += filtro.parentesesInicial + "dados.some(e=> e.cabecalho == '" + filtro.propriedade + "' && e.valor >= " + filtro.valor + " && e.valor <= " + filtro.valorOpcional + ")" + filtro.parentesesFinal

      if (filtro.operador == "CONTAINS")
        if (filtro.ehData)
          filtroString += filtro.parentesesInicial
            + "dados.some(e=> {"
            + "return e.cabecalho == '" + filtro.propriedade + "' && new Date(e.valor).getTime()" + " ==" + "new Date('" + filtro.valor?.split('-').reverse().join('-') + "').getTime()" +
            "})"
            + filtro.parentesesFinal
        else
          filtroString += filtro.parentesesInicial + "dados.some(e=> e.cabecalho == '" + filtro.propriedade + "' && e.valor.toLowerCase().includes('" + filtro.valor?.toLowerCase() + "')" + ")" + filtro.parentesesFinal
      if (filtro.operador == "IN")
        if (filtro.ehData)
          filtroString += filtro.parentesesInicial
            + "dados.some(e=> {"
            + "return e.cabecalho == '" + filtro.propriedade + "' && new Date(e.valor).getTime()" + " ==" + "new Date('" + filtro.valor?.split('-').reverse().join('-') + "').getTime()" +
            "})"
            + filtro.parentesesFinal
        else
          filtroString += filtro.parentesesInicial + "dados.some(e=> e.cabecalho == '" + filtro.propriedade + "' && '" + filtro.valor + "'.includes(e.valor))" + filtro.parentesesFinal

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
      <DialogContent sx={{ px: 2 }}>
        <Grid container pt={2} px={2} sx={{ backgroundColor: '#fff', boxShadow: '0px 0px 20px #2929294d' }}>

          <FiltroLinha
            gridItem
            lidarComClickEmAdicionarFiltro={lidarComClickEmAdicionarFiltro}
            filtroAtual={filtroAtual}
            cabecalhos={cabecalhos}
            setFiltrosValidos={setFiltrosValidos}
            lidarComMudancaNoFiltro={(propriedade: string, valor: any) => {
              setFiltroAtual(estadoAtual => ({ ...estadoAtual, [propriedade]: valor }))
            }}
            lidarComRemoverFiltro={() => setFiltroAtual(estadoInicial)}
            abrirParenteses={() => setParentesesAbertos(s => s + 1)}
            fecharParenteses={() => setParentesesAbertos(s => s - 1)}
          />


        </Grid>
        <Grid container pt={2} px={2} mt={2}>
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
          variant="contained"
          size='large' startIcon={<Close />}
          onClick={() => setMostrarFiltro(false)}>Cancelar</Button>
      </DialogActions>
    </Dialog >
  );
}

interface IFiltroLinhaTipoProps {
  filtroAtual: IFiltro, cabecalhos: ModeloCabecalho[], lidarComMudancaNoFiltro: any, gridItem: boolean, lidarComRemoverFiltro: any,
  abrirParenteses: any, fecharParenteses: any, setFiltrosValidos: any, lidarComClickEmAdicionarFiltro?: any
}
function FiltroLinha({ lidarComClickEmAdicionarFiltro, setFiltrosValidos, filtroAtual, cabecalhos, lidarComMudancaNoFiltro, gridItem, lidarComRemoverFiltro, abrirParenteses, fecharParenteses }: IFiltroLinhaTipoProps) {
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
          <InputLabel>Operador</InputLabel>
          <Select
            label="Operador"
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
          label="Valor 1"
          fullWidth
          type={filtroAtual.ehData ? "date" : "text"}
          value={filtroAtual.valor || ''}
          disabled={filtroAtual.operador == null}
          error={filtroAtual.valor == '' && filtroAtual.operador != ''}
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
          label="Valor 2"
          fullWidth
          type={filtroAtual.ehData ? "date" : "text"}
          value={filtroAtual.valorOpcional || ''}
          disabled={filtroAtual.operador != 'BETWEEN'}
          error={filtroAtual.operador == "BETWEEN" && filtroAtual.valorOpcional == ''}
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
      <Grid container item xs={1.5} spacing={1} mr={!gridItem ? 1.9 : 0}>
        {
          gridItem && lidarComClickEmAdicionarFiltro &&
          <Grid item xs>
            <IconButton
              onClick={lidarComClickEmAdicionarFiltro}
              color="success">
              <Add />
            </IconButton>
          </Grid>
        }
        <Grid item xs>
          <IconButton
            color="error"
            onClick={lidarComRemoverFiltro}
          >
            <Close />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  )
}

