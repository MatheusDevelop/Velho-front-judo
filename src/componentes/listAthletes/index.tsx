import { Add, CleaningServices, FilterAltOutlined, Search, UploadFileOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Alert, AlertTitle, Button, IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';

const baseUrl = 'https://localhost:7082/api/v1'

export default function ListAthletesComponent(props: { setPage: any }) {
  const [headers, setHeaders] = useState([])
  const [rows, setRows] = useState([])
  const [showErrorOnLoadingAlert, setShowErrorOnLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    const content = await fetch(baseUrl + '/athletes')
    const json = await content.json()
    console.log(json)
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
        <Box padding={2} sx={{ flex: 1, backgroundColor: "#cccccc" }}>
          <TableContainer component={Paper}>
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
                    <TableRow hover>
                      {Object.keys(row).map(item => (
                        <TableCell>
                          {row[item]}
                        </TableCell>
                      ))}

                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box padding={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box margin={1}>
              <Button onClick={() => props.setPage(1)} variant="contained" size='large' startIcon={<Add />}>
                Incluir
              </Button>
            </Box>
            <Box margin={1}>
              <Button variant="outlined" size='large' startIcon={<VisibilityOutlined />}>
                Consultar
              </Button>
            </Box>
            <Box margin={1}>
              <Button variant="outlined" size='large' startIcon={<FilterAltOutlined />}>
                Filtrar
              </Button>
            </Box>
            <Box margin={1}>
              <Button variant="outlined" size='large' startIcon={<UploadFileOutlined />}>
                Exportar
              </Button>
            </Box>
          </Box>
        </Box>
      </Stack>
    </>

  );
}
