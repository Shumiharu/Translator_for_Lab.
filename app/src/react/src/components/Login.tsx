import style from '../stylesheets/login.module.css'
import { useContext, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Member } from '../interfaces/member';
import { autholize, logIn } from '../axios';
import { MemberContext } from '../providers/MemberProvider';
import { alpha } from '@mui/system';

export const Login = () => {
  const navigate = useNavigate();
  // const memberContext = useContext(MemberContext);
  const { register, handleSubmit, formState:{ errors } } = useForm<Member>();

  useEffect(() => {
    const handleAutholization = async() => {
      try{
        const response = await autholize();
        const {isAuthenticated, member} = response.data
        if(isAuthenticated && member) {
          navigate('/', {replace: false});
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    handleAutholization();
  }, [])

  const onSubmit: SubmitHandler<Member> = async(member) => {
    await logIn(member)
    .then((response) => {
      console.log(response);
      if(response.data.isAuthenticated) {
        alert("Login successfully");
        navigate('/', {replace: false});
      } else {
        alert("Sorry, name or password you entered was incorrect. ")
      }
    })
  }

  return(
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.container}>
          <h1 className={style.title}>Translator for Okamoto Lab.</h1>
          <input type='text' className={style.name} placeholder={"Name"} {...register("name", {required: true})}/>
          <input type='password' className={style.password} placeholder={"Password"} {...register("password", {required: true})}/>
          <button className={style.login}>Log In</button>
        </div>
      </form>
    </>
  )
}