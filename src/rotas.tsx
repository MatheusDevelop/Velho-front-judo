import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from 'react'
import PaginaAtleta from "./paginas/atleta";
import ComponenteCadastro from "./componentes/cadastro";

function Rotas() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/atletas" element={<PaginaAtleta/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default Rotas