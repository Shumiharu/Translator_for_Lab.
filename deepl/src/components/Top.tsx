import { useRef, useState } from 'react';
import style from '../stylesheets/top.module.css';
import { Container } from '@mui/system';

import axios, { AxiosResponse } from 'axios';

interface Translation {
  detected_source_language: string;
  text: string;
}

interface TranslationInfo {
  translations: Translation[]
}


export const Top = () => {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [result, setResult] = useState<string>("")
  

  const translate = () => {
    const value = ref.current?.value;

    if(value) {
      axios.post("https://api-free.deepl.com/v2/translate", {
        "auth_key": "6d436b98-3cfe-55aa-b2d9-3ccc2ecd556f:fx",
        "text": value,
        "source_lang": 'EN',
        "target_lang": 'JA'
      }).then((response: AxiosResponse<TranslationInfo>) => {
        let responseText: string = "";
        console.log(typeof(response))
        console.log(response)
        // translationInfo.translations.forEach((translation) => {
        //   responseText += "\n" + translation;
        // })
        setResult(responseText);
      }).catch((error) => {
        console.log(error);
      })
    } else {
      alert("Input field is blank. Please enter text.")
    }
  }

  return(
    <>
      <Container sx={{marginTop: "120px"}}>
        <textarea placeholder='Please enter text to translate (in English)' className={style.textarea} ref={ref}>{result}</textarea>
        <div className={style.translateLayout}>
          <button className={style.translate} onClick={translate}>translate</button>
        </div>
        <div>翻訳結果:</div>
        <div className={style.results}>
          {}
        </div>
      </Container>
    </>
  )
}