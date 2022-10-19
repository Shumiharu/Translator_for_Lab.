import { useNavigate } from 'react-router-dom';
import style from '../stylesheets/login.module.css'

export const Login = () => {
  const navigate = useNavigate();

  const login = () => {
    navigate('/', { replace: false });
  }

  return(
    <>
      <div className={style.container}>
        <h1 className={style.title}>Translator for Okamoto Lab.</h1>
        <input type='text' className={style.username} placeholder={"Username"}/>
        <input type='password' className={style.password} placeholder={"Password"}/>
        <button className={style.login} onClick={login}>Log In</button>
      </div>
    </>
  )
}