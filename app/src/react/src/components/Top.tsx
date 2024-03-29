import { useRef, useState } from 'react';
import style from '../stylesheets/top.module.css';
import { Container } from '@mui/system';
import axios, { AxiosResponse } from 'axios';
import { response } from 'express';

// interface Translation {
//   detected_source_language: string;
//   text: string;
// }

export const Top = () => {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [result, setResult] = useState<string>("");
  const [target_lang, setTarget_lang] = useState('JA');

  const translate = () => {
    const value = ref.current?.value;
    if(value) {
      axios.post('/api/translation', {
        "text": value,
        "target_lang": target_lang,
      }).then((response: AxiosResponse<string>) => {
        setResult(response.data);
      })
      .catch((error) => {
        console.log(error);
      })

      
    } else {
      alert("Input field is blank. Please enter text.")
    }
  }

  return(
    <>
      <Container sx={{marginTop: "120px"}}>
        <textarea placeholder='Please enter text to translate (in English)' className={style.textarea} ref={ref}></textarea>
        <div className={style.translateLayout}>
          <button className={style.translate} onClick={translate}>translate</button>
        </div>
        <div>翻訳結果:</div>
        <div className={style.results}>
          {result}
        </div>
      </Container>
    </>
  )
}