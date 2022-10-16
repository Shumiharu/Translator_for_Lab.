import express from 'express'
import deepl from 'deepl';

const app: express.Express = express();

// apiのエンドポイントとキー
const apiEndpoint: string = 'https://api-free.deepl.com/v2/translate';
const apiKey: string = '6d436b98-3cfe-55aa-b2d9-3ccc2ecd556f:fx';


// CORSの許可
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://api-free.deepl.com/v2/translate");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Custom-Header, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next()
})

// body-parserに基づいた着信リクエストの解析
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// GetとPostのルーティング
const router: express.Router = express.Router()
router.get('/', (req:express.Request, res:express.Response) => {
  res.send('Hello, world!!');
})

router.post('/translate', (req: express.Request, res: express.Response) => {
  const { text, target_lang } = req.body;
  deepl({
    free_api: true,
    text: text,
    target_lang: target_lang,
    auth_key: apiKey
  }).then((result) => {
    res.send(result.data.translations[0]);
  }).catch((error) => {
    console.log(error);
  })
})

app.use(router)

// 3000番ポートでAPIサーバ起動
app.listen(3000,()=>{ console.log('Translator app listening on port 3000!') })