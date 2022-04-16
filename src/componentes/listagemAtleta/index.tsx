import { Add, CleaningServices, FilterAltOutlined, Search, UploadFileOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

export default function ComponenteListagemAtleta() {
  return (
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
              <TableCell style={{ minWidth: 250 }}>
                Nome
              </TableCell>
              <TableCell style={{ minWidth: 250 }}>
                Idade
              </TableCell>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell>
                  Matheus Barbosa
                </TableCell>
                <TableCell>
                  19
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box padding={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box margin={1}>
            <Button variant="contained" size='large' startIcon={<Add />}>
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
  );
}
