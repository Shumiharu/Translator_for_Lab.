import express from 'express'
import * as deepl from 'deepl-node';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import * as fs from 'fs';
import { Member } from './entity/Member.js'
import { AppDataSource } from './data_source/data-source.js';
import { createToken } from './jwt_helper/jwtHelper.js';
import { verifyToken } from './jwt_helper/jwtHelper.js';
import { handleDisconnect } from './database/mysql.js';

// okamotolab
const okamotolab_txt = fs.readFileSync("/run/secrets/okamotolab").toString();
const okamotolab = JSON.parse(okamotolab_txt);

const api_key = fs.readFileSync("/run/secrets/api_key").toString();

const app: express.Express = express();

// CORSの許可
const corsOptions = {
  credentials: true,
  origin: [
    "http://sv7.comm.nitech.ac.jp", // これ絶対必要
    "https://api-free.deepl.com/v2/translate"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
}
app.use(cors(corsOptions));

//ミドルウエアでstaticパスを追加（ただ、これだけだと直アクセスや無いpathだと動かない）
app.use(express.static("/app/src/react/build"));

// body-parserに基づいた着信リクエストの解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// https通信のためのやつ
// const server_opt = {
//   key: fs.readFileSync('./privatekey.pem'),
//   cert: fs.readFileSync('./cert.pem'),
// }

// const server = https.createServer(server_opt, app);

// app.set("trust proxy", 1);

// mariadbへの接続
handleDisconnect();

// detabase initialize
AppDataSource.initialize().then(async() => {
  const saveMembers = async() => {
    let promise = Promise.resolve();
    okamotolab.members.forEach(async(member: Member) => {
        promise = promise.then(async() => {
            const newMember = new Member(member.name, member.password, "");
            await AppDataSource.getRepository(Member).save(newMember);
        })
    })
    await promise;
  }
  saveMembers();
}).catch(error => console.log(error))

app.use(morgan('combined'));



app.get('/autholize', async(req: express.Request, res: express.Response) => {
  let token = req.cookies.token;
  if(token == null) {
    return res.status(200).json({ isAuthenticated: false });
  }

  const decode = verifyToken(token);
  if(decode) {
    const member = await AppDataSource.getRepository(Member).findOne({
      where: {token: req.cookies.token}
    });

    res.status(200).json({ isAuthenticated: true , member: member});
  }
})

app.post('/login', async(req: express.Request, res: express.Response) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      throw new Error("USERS_INVALID_VALUE");
    }

    const member = await AppDataSource.getRepository(Member).findOne({
      where: {name: name}
    }); 

    if(!member) {
      throw new Error("USERS_NOT_EXISTS_USER");
    }

    // const match = await bcrypt.compare(password, member.password);
    const match = (password === member.password);

    if(match === true) {
      const token = createToken();

      member.token = token;
      await AppDataSource.getRepository(Member).save(member);

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60*60*10000 
      }).json({
        isAuthenticated: true,
        name: member.name
      })
    } else {
      throw Error("PASSWORD_INVALID_VALUE");
    }
  } catch(error) {
    console.log(error)
    res.json({
      isAuthenticated: false,
    })
  }
})

app.post('/logout', async(req: express.Request, res: express.Response) => {
  try {
    res.clearCookie('token')
    res.end();
  } catch (error) {
    console.log(error);
  }
})

app.post('/api/translation', async(req: express.Request, res: express.Response) => {
  const text: string = req.body.text;
  const target_lang: deepl.TargetLanguageCode = req.body.target_lang
  const translator = new deepl.Translator(api_key);
  await translator.translateText(text, null, target_lang)
  .then((result) => {
    res.send(result.text);
  })
  .catch((error) => {
    console.log(error);
    res.end();
  })
})
//これを追加（全てをindex.htmlにリダイレクト．いわゆるrewrite設定）
app.use((req, res, next) => {
  res.sendFile("/app/src/react/build/index.html");
});

// 3001番ポートでAPIサーバ起動
const port = 3001
app.listen(port,()=>{ console.log(`Translator API server is listening on port ${port}!`) });

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

// ESmoduleとCommonJSの勉強が必要だった
// ts.configの設定やpackage.jsonの設定など復習
// 参考サイト
// https://www.memory-lovers.blog/entry/2022/05/31/110000
// https://zenn.dev/yodaka/articles/596f441acf1cf3

// 復習！！！！
// 必ず各app.get, app.post にはres.sendやres.end入れる！！1

// https://zenn.dev/ryota_koba04/scraps/1556360172954c

// 11/26
// Corsの設定はちゃんとしよう
// 原因が出てこない時は一度立ち止まって違う原因がないか調べよう
// Databaseのポート番号が一致してるかちゃんと確かめて

// 11/27
// dockerの環境でnpm installするからこっちでインストールする必要ないかと思ったがやっぱりいるみたい
// docker環境でも動作確認

// 12/4
// なぜかdockerfileでRUN npm run build しても buildディレクトリが生成されない
 