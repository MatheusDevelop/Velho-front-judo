import { AddCircleTwoTone, Filter, Filter1Outlined, FilterAlt } from '@mui/icons-material'
import { Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import InsertAthleteComponent from '../../componentes/insertAthlete'
import ListAthletesComponent from '../../componentes/listAthletes'

function PaginaAtleta() {
  const [value, setValue] = useState(0)
  const handleTabChange = (event: any, newValue: number) => {
    setValue(newValue)
  }
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleTabChange}>
          <Tab label="Listagem" />
          <Tab label="Cadastrar" />
        </Tabs>
      </Box>
      {
        value === 0 &&
        <ListAthletesComponent setPage={setValue} />
      }
      {value === 1 &&
        <InsertAthleteComponent setPage={setValue} />
      }
    </div>
  )
}

export default PaginaAtleta


