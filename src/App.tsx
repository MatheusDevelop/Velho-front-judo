import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ModeloRota } from './modelos/ModeloRota';
import PaginaCadastro from './paginas/cadastro';
import { obterRotas } from './servicos/servicosRotas';
function App() {
  const [rotas, setRotas] = useState<ModeloRota[]>()
  useEffect(() => {
    adicionarRotas();
  }, [])
  const adicionarRotas = async () => {
    try {

      const rotasEncontradas = await obterRotas()
      setRotas(rotasEncontradas);

    } catch (erro) {
      console.log(erro)
    }
  }
  return (
    <BrowserRouter>
      {
        rotas &&
        <Routes>
          {rotas.map((rota, idx) => (
            <Route key={idx} path={rota.nomeRota} element={<PaginaCadastro nomeTabela={rota.nomeTabela} />} />
          ))}
        </Routes>
      }
    </BrowserRouter>
  );
}

export default App;
