import { AddCircleTwoTone, Filter, Filter1Outlined, FilterAlt } from '@mui/icons-material'
import { Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import ComponenteCadastro from '../../componentes/cadastro'
import ComponenteListagemAtletas from '../../componentes/listagem'
import { ModeloGrupoInput } from '../../modelos/ModeloGrupoInput'
import { requisitarModeloDeInputs } from '../../servicos/servicosInputs'

function PaginaAtleta() {
  const [value, setValue] = useState(0)
  const [grupoInputs, setGrupoInputs] = useState<ModeloGrupoInput[]>()
  const handleTabChange = (event: any, newValue: number) => {
    setValue(newValue)
  }
  useEffect(() => {
    requisitarGrupoDeInputs();
  }, [])
  const requisitarGrupoDeInputs = async () => {
    const conteudo = await requisitarModeloDeInputs("athletes");
    setGrupoInputs(conteudo);
  }
  const [modeloLeitura, setModeloLeitura]: any = useState({})
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleTabChange}>
          <Tab label="Listagem" />
          <Tab label="Cadastrar" />
        </Tabs>
      </Box>
      {
        value == 0 &&
        <ComponenteListagemAtletas setModelo={setModeloLeitura} setPage={setValue} />
      }
      {grupoInputs && value == 1 &&
        <ComponenteCadastro setPage={setValue} grupoInputs={grupoInputs} nomeApi="athletes" />
      }
      {grupoInputs && value == 2 &&
        <ComponenteCadastro setPage={setValue} grupoInputs={grupoInputs} valoresIniciais={modeloLeitura} nomeApi="athletes" />
      }
    </div>
  )
}

export default PaginaAtleta


