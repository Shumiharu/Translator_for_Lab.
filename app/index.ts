import express from 'express'
import deepl from 'deepl';

const app: express.Express = express();

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

app.get('/.*', (req: express.Request, res: express.Response) => {

})

app.post('/api/translation', (req: express.Request, res: express.Response) => {
  const { text, target_lang } = req.body;
  deepl({
    free_api: true,
    text: text,
    target_lang: target_lang,
    auth_key: process.env.API_KEY!
  }).then((result) => {
    res.send(result.data.translations[0]);
  }).catch((error) => {
    console.log(error);
  })
})

// 3001番ポートでAPIサーバ起動
app.listen(3001,()=>{ console.log('Translator app listening on port 3001!') })

// 開発時はexpressのサーバーとReactのサーバーを別々で起動する
// 本番は
// create-react-appで作成したclientフォルダ内で
// cd client
// npm run build
// するとbuild/staticフォルダ内にjsフォルダ、 cssフォルダが作成され、
// その中にjsファイルとcssファイルがwebpackによって作成されます。
// ExpressサーバーはAPIサーバーとしての機能と、Proxyすることなくただ単純にこの静的なjsファイルとcssファイルを返すだけになります。プロダクション時には静的なファイルを返すだけなので、Reactサーバーは必要ないわけです。
// 参考: https://applingo.tokyo/article/1568

// API_KEYをどうやって持ってくるか