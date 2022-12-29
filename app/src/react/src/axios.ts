import axios from "axios";
import { Member } from "./interfaces/member";

axios.defaults.withCredentials = true

export const instance = axios.create({
  baseURL: "http://sv7.comm.nitech.ac.jp",
});

export const autholize = async() => {
  const response =  await instance.get('/autholize')
  return response;
}

export const logIn = async(data: Member) => {
  const response = await instance.post('/login', data);
  return response;
}

export const logOut = async() => {
  await instance.post('/logout');
  return;
}



