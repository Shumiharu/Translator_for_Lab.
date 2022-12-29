import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Top } from './components/Top';
import { Error } from './components/Error';
import { Login } from './components/Login';

export const App = () => {
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Layout /> }>
            <Route index element={ <Top/> } />
            <Route path='*' element={ <Error /> } />
          </Route>
          <Route path='login' element= { <Login/> } />
        </Routes>
      </BrowserRouter>
    </>
  )
} 