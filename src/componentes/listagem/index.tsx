import { Add, CleaningServices, Close, CloseOutlined, FilterAltOutlined, IosShareOutlined, Search, UploadFileOutlined, VisibilityOutlined } from '@mui/icons-material';
import { FormControl, Select, MenuItem, InputLabel, Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Grid, Divider, Checkbox, FormControlLabel } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { GerarArquivoExcel } from '../../servicos/servicosExcel';

const baseUrl = 'https://localhost:7082/api/v1'

export default function ComponenteListagemAtletas(props: { setPage: any, setModelo: any }) {
  const [headers, setHeaders] = useState([])
  const [rows, setRows] = useState([])
  const [showErrorOnLoadingAlert, setShowErrorOnLoading] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)

  const initialFilterValue = {
    firstParentesis: '',
    property: '',
    operator: '',
    value: '',
    optionalValue: '',
    lastParentesis: '',
    groupOperator: 'E',
  }

  const [filterInitial, setFilterInitial] = useState(initialFilterValue)
  const [filters, setFilters]: any = useState([])
  const [filterParentesisOpened, setFilterParentesisOpened] = useState(false)

  const [listaDeExportacoes, setListaDeExportacoes]: any = useState([])
  const [abrirModalExportar, setAbrirModalExportar] = useState(false)
  useEffect(() => {
    fetchData()
  }, [])
  const makeFilter = () => {
    filters.map((filter: any) => {
      let filterObjectRequest = {}
    })
  }
  const fetchData = async () => {
    const content = await fetch(baseUrl + '/athletes')
    const json = await content.json()
    if (json.success) {
      setHeaders(json.data.headers)
      setRows(json.data.rows)
    } else {
      setShowErrorOnLoading(true)
      setTimeout(() => {
        setShowErrorOnLoading(false)
      }, 8000);
    }
  }
  const handleApplyFilter = async () => {
    makeFilter();
  }
  const handleAddFilter = (property: string, operator: string, value: string, optionalValue: string, groupOperator: string) => {
    setFilters((state: any) => ([...state, { property, value, operator, optionalValue, groupOperator }]))
    setFilterInitial(initialFilterValue)
  }
  const handleDeleteFilter = (indexToDelete: any) => {
    setFilters(filters.filter((item: any, index: any) => index !== indexToDelete));
  }
  const lidarComClickEmExportar = async () => {
    let linhasFiltradas: any = []
    let cabecalhos: any = listaDeExportacoes.sort((a: any, b: any) => a.id - b.id).map((e: any) => headers[e.id])

    rows.map(linhaTabela => {
      let linhaFiltrada: any = []
      Object.keys(linhaTabela).forEach(chave => {
        if (listaDeExportacoes.find((e: any) => e.propriedade == chave)) {
          linhaFiltrada = [...linhaFiltrada, linhaTabela[chave]]
        }
      })
      linhasFiltradas = [...linhasFiltradas, linhaFiltrada]
    })
    await GerarArquivoExcel(cabecalhos, linhasFiltradas);
    setAbrirModalExportar(false)
  }
  return (
    <>
      {
        showErrorOnLoadingAlert &&
        <Box sx={{ width: '100%', position: 'fixed', left: 0, top: 0, display: 'flex', justifyContent: 'center' }}>
          <Alert severity='error'>
            <AlertTitle>Ocorreu um erro ao carregar o conteudo, tente novamente mais tarde.</AlertTitle>
          </Alert>
        </Box>
      }



      <Stack sx={{ flex: 1 }}>
        <Box padding={2}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <TextField variant='outlined' size='small' label='Pesquisar'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              }} />
            <Box marginLeft={1}>
              <IconButton
              >
                <CleaningServices />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 1, backgroundColor: "#cccccc", display: 'flex' }}>
          <Box margin={2} sx={{ position: 'relative', flex: 1 }}>
            <TableContainer component={Paper} sx={{ overflowY: 'scroll', position: 'absolute', right: 0, top: 0, bottom: 0, left: 0 }}>
              <Table>
                <TableHead>
                  {
                    headers.map(header => (
                      <TableCell style={{ minWidth: 250 }}>
                        {header}
                      </TableCell>
                    ))
                  }

                </TableHead>
                <TableBody>
                  {
                    rows.map(row => (
                      <TableRow
                        sx={{ cursor: 'pointer' }}
                        hover onClick={() => {
                          props.setModelo(row)
                          props.setPage(2)
                        }}>
                        {Object.keys(row).map((item, index) => {
                          if (index + 1 <= headers.length)
                            return (
                              <TableCell>
                                {row[item]}
                              </TableCell>
                            )
                        })}

                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

        </Box>
        <Box padding={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box margin={1}>
              <Button onClick={() => props.setPage(1)} variant="contained" size='large' startIcon={<Add />}>
                Incluir
              </Button>
            </Box>
            {/* <Box margin={1}>
              <Button variant="outlined" size='large' startIcon={<VisibilityOutlined />}>
                Consultar
              </Button>
            </Box> */}

            <Box margin={1}>
              <Button
                onClick={() => setShowFilterModal(true)}
                variant="outlined" size='large' startIcon={<FilterAltOutlined />}>
                Filtrar
              </Button>
            </Box>
            <Box margin={1}>
              <Button
                onClick={() => setAbrirModalExportar(true)}
                variant="outlined" size='large' startIcon={<UploadFileOutlined />}>
                Exportar
              </Button>
            </Box>
          </Box>
        </Box>
      </Stack>
      <Dialog
        // hideBackdrop
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        aria-labelledby="alert-dialog-title"
        fullWidth
        maxWidth="md"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
        >
          <DialogContentText id="filter-modal"
          >
            {
              filters.map((filter: any, idx: number) => (

                <FilterLineComponent
                  {...filter}
                  setLine={(line: any) => {
                    let keyname = Object.keys(line)[0]
                    const newFilters = [...filters];
                    newFilters[idx] = { ...filter, [keyname]: line[keyname] };
                    setFilters(newFilters)
                  }}
                  handleDeleteFilter={handleDeleteFilter}
                  key={idx}
                  index={idx}
                  handleAddFilter={handleAddFilter}
                  headers={headers} />
              ))
            }
            <Divider />
            <FilterLineComponent
              {...filterInitial}
              setLine={(line: any) => {
                let keyname = Object.keys(line)[0]
                setFilterInitial({ ...filterInitial, [keyname]: line[keyname] })
              }}
              handleDeleteFilter={handleDeleteFilter}
              key={-1}
              index={-1}
              handleAddFilter={handleAddFilter}
              headers={headers} />

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setShowFilterModal(false)
              handleApplyFilter()
            }} autoFocus>
            Executar
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setShowFilterModal(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={abrirModalExportar}
        onClose={() => setAbrirModalExportar(false)}
        aria-labelledby="exp-dialog-title"
        fullWidth
        aria-describedby="exp-dialog-description"
      >
        <DialogContent
        >
          <DialogTitle>
            Selecione as colunas para exportar
          </DialogTitle>
          <DialogContentText id="exp-filter-modal"
          >
            {headers.map((header: string, idx: number) => {
              if (rows.length == 0) return;
              const propriedade = Object.keys(rows[0])[idx]
              const exportarObj = { nome: header, id: idx, propriedade }
              return (
                <Box sx={{ ml: 4 }}>
                  <FormControlLabel control={
                    <Checkbox
                      onClick={() => {
                        const objEncontrado = listaDeExportacoes.find((e: any) => e.id == exportarObj.id)
                        if (objEncontrado)
                          setListaDeExportacoes(listaDeExportacoes.filter((e: any) => e.id != objEncontrado.id))
                        else {
                          setListaDeExportacoes((state: any) => ([...state, exportarObj]))
                        }
                      }}
                      checked={listaDeExportacoes.find((e: any) => e.id == exportarObj.id)}
                    />}
                    label={header} />
                </Box>
              )
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<IosShareOutlined />}
            variant="contained"
            onClick={lidarComClickEmExportar} autoFocus>
            Exportar
          </Button>
          <Button
            startIcon={<CloseOutlined />}
            color="error"
            variant="outlined"
            onClick={() => setAbrirModalExportar(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </>

  );
}
function FilterLineComponent(props: { headers: any[], index: number, handleAddFilter: any, handleDeleteFilter: any, firstParentesis: string, lastParentesis: string, value: string, property: string, operator: string, groupOperator: string, optionalValue: string, setLine: any }) {
  return (
    <Grid container mb={2} mt={.2} spacing={2}>
      <Grid item>
        <FormControl
          disabled
          size="small"
        >
          <Select
            value={props.firstParentesis || ''}
            onChange={(e) => { props.setLine({ firstParentesis: e.target.value }) }}
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
          <InputLabel id="filter-modal-label">Seleção</InputLabel>
          <Select
            value={props.property || ''}
            label="Seleção"
            onChange={(e) => { props.setLine({ property: e.target.value }) }}
          >
            {props.headers.map(header => (
              <MenuItem value={header}>
                {header}
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
            value={props.operator || ''}
            label="Filtro"
            onChange={(e) => { props.setLine({ operator: e.target.value }) }}
          >
            <MenuItem value={'CONTÉM'}>CONTÉM</MenuItem>
            <MenuItem value={'IN'}>IN</MenuItem>
            <MenuItem value={'Entre'}>Entre</MenuItem>
            <MenuItem value={'>='}> {'>='} </MenuItem>
            <MenuItem value={'<='}> {'<='} </MenuItem>
            <MenuItem value={'<'}> {'<'} </MenuItem>
            <MenuItem value={'>'}> {'>'} </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs>
        <TextField
          value={props.value || ''}
          onChange={(e) => { props.setLine({ value: e.target.value }) }}
          size="small"
          variant="outlined" />
      </Grid>
      <Grid item xs>
        <TextField
          value={props.optionalValue || ''}
          onChange={(e) => { props.setLine({ optionalValue: e.target.value }) }}
          disabled={props.operator != 'Entre'}
          variant={props.operator != 'Entre' ? "standard" : 'outlined'}
          size="small" />
      </Grid>
      <Grid item xs={1}>
        <FormControl
          disabled
          size="small"
        >
          <Select
            value={props.lastParentesis || ''}
            onChange={(e) => { props.setLine({ lastParentesis: e.target.value }) }}
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
            value={props.groupOperator || ''}
            onChange={(e) => { props.setLine({ groupOperator: e.target.value }) }}
          >
            <MenuItem value={'E'}>E</MenuItem>
            <MenuItem value={'OU'}>OU</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid container item xs={1.5} spacing={1}>
        {
          props.index == -1 &&
          <Grid item>
            <IconButton
              disabled={props.property == '' || props.value == '' || props.operator == ''}
              onClick={() => props.handleAddFilter(props.property, props.operator, props.value, props.optionalValue, props.groupOperator)} color="success">
              <Add />
            </IconButton>
          </Grid>
        }
        {
          props.index != -1 &&
          <Grid item>
            <IconButton color="error" onClick={() => props.handleDeleteFilter(props.index)}>
              <Close />
            </IconButton>
          </Grid>
        }
      </Grid>
    </Grid >
  );
}

