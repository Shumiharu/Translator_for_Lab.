import { Outlet, useNavigate } from 'react-router-dom';

import style from '../stylesheets/layout.module.css'

export const Layout = () => {
  const navigate = useNavigate();

  const logout = () => {
    const result = window.confirm("ログアウトしますか?");
    if(result) {
      navigate('/login', { replace: false });
    }
    return result;
  }

  return(
    <>
      <header className={style.headerLayout}>
        <h1 className={style.title}>Translator for Okamoto Lab.</h1>
        <button className={style.logout} onClick={logout}>LogOut</button>
      </header>
      <main style={{flex: 1}}>
        <Outlet />
      </main>
      <footer className={style.footerLayout}>
        <div className={style.copyRight}>Copyright Okamoto Lab, NITech all rights reseverved.</div>
        <div className={style.poweredBy}>Powered by DeepL</div>
      </footer>
    </>
  )
}