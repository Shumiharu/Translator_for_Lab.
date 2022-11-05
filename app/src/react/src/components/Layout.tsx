import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { autholize, logOut } from '../axios';

import style from '../stylesheets/layout.module.css'

// import { MemberContext } from '../providers/MemberProvider'
import { Member } from '../interfaces/member';

export const Layout = () => {
  const navigate = useNavigate();
  // const memberContext = useContext(MemberContext);
  const [ member, setMember ] = useState<Member | null>(null);

  useEffect(() => {
    const handleAutholization = async() => {
      try{
        const response = await autholize();
        const {isAuthenticated, member} = response.data
        if(isAuthenticated && member) {
          setMember(response.data.member);
        } else {
          navigate('/login', {replace: false});
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    handleAutholization();
  }, [])

  const handleLogout = async() => {
    const result = window.confirm("Are you sure your account will log out?");
    if(result) {
      navigate('/login', { replace: false });
      logOut();
    }
    return result;
  }

  return(
    <>
      <header className={style.headerLayout}>
        <div className={style.headerContent}>
          <h1 className={style.title}>Translator for Okamoto Lab.</h1>
          <div className={style.user}>Logged in as {member?.name}</div>
        </div>
        <button className={style.logout} onClick={handleLogout}>LogOut</button>
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