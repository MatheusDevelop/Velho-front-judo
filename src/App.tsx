
import { Backdrop, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/system';
import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MenuComponente from './componentes/menu';
import { ModeloRota } from './modelos/ModeloRota';
import PaginaCadastro from './paginas/cadastro';
import PaginaLogin from './paginas/login';
import { IEstadoInicial, IModeloPermissao } from './redux/reducerRaiz';
import { fazerLogin } from './servicos/servicosLogin';
import { obterRotas } from './servicos/servicosRotas';

function App() {
  const [rotas, setRotas] = useState<ModeloRota[]>()
  const [carregandoRotas, setCarregandoRotas] = useState(true)

  const dispatch = useDispatch()

  const { autenticado } = useSelector<IEstadoInicial, { autenticado: boolean }>((estado: IEstadoInicial) => {
    return {
      autenticado: estado.autenticado,
    }
  });

  useEffect(() => {
    iniciarApp();
  }, [autenticado])

  const iniciarApp = async () => {
    window.document.documentElement.requestFullscreen();
    try {
      // if (!autenticado) {
      //   const email = localStorage.getItem("JUDO-V1-USUARIO");
      //   const senha = localStorage.getItem("JUDO-V1-SENHA");
      //   const cliente = localStorage.getItem("JUDO-V1-CLIENTE");
      //   if (!email || !senha || !cliente) {
      //     setCarregandoRotas(false)
      //     return
      //   }
      //   const conteudo = await fazerLogin(email, senha, cliente)
      //   if (!conteudo.autenticado) {
      //     alert("Login inválido")
      //     return;
      //   }
      //   dispatch({
      //     type: 'LOGIN',
      //     payload: {
      //       permissoes: conteudo.permissoes,
      //       idCliente: conteudo.idCliente,
      //       nomeUsuario: conteudo.nomeUsuario,
      //       nomeCliente: conteudo.nomeCliente,
      //       usuario: conteudo.usuario,
      //       fotoBit64: conteudo.fotoBit64,
      //       emailUsuario: conteudo.emailUsuario,
      //     }
      //   })
      // }
      const rotasEncontradas = await obterRotas()
      setCarregandoRotas(false)
      setRotas(rotasEncontradas);
    } catch (erro) {
      console.log(erro)
    }
  }

  return (
    <BrowserRouter>
      {
        autenticado && <MenuComponente />
      }
      <Backdrop
        sx={{ color: '#fff', zIndex: 99 }}
        open={carregandoRotas}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {
        autenticado ?
          <Routes>
            {rotas && rotas.map((rota, idx) => (
              <Route key={idx} path={rota.nomeRota} element={<PaginaCadastro nomeTabela={rota.nomeTabela} />} />
            ))}
            <Route path="*" element={<div style={{ backgroundColor: '#cccccc', height: '100vh' }}></div>} />
          </Routes>
          :
          <>
            {
              !carregandoRotas &&
              <Routes>
                <Route path="/login" element={<PaginaLogin />} />
                <Route
                  path="*"
                  element={<Navigate to="/login" replace />}
                />
              </Routes>
            }
          </>
      }
    </BrowserRouter>

  );
}


export default App;
