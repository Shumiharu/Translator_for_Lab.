import express from 'express'
import deepl from 'deepl';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import * as bcrypt from 'bcrypt';
import { Member } from './entity/Member.js'
import { AppDataSource } from './data-source.js';
import { createRequire } from "module";
import { createToken } from './helper/jwtHelper.js';
import { verifyToken } from './helper/jwtHelper.js';

// jsonをECMA形式で読み込む
const require = createRequire(import.meta.url);
const okamotolab = require('../dev/okamotolab.json');

const app: express.Express = express();

// CORSの許可
const corsOptions = {
  credentials: true,
  origin: [
    "http://localhost:3000", 
    "https://api-free.deepl.com/v2/translate"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
}
app.use(cors(corsOptions));

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
    const match = (password == '6Goukan1010');

    if(match) {
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

app.post('/api/translation', (req: express.Request, res: express.Response) => {
  const { text, target_lang } = req.body;
  deepl({
    free_api: true,
    text: text,
    target_lang: target_lang,
    // auth_key: process.env.API_KEY!
    auth_key: "6d436b98-3cfe-55aa-b2d9-3ccc2ecd556f:fx"
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

// ESmoduleとCommonJSの勉強が必要だった
// ts.configの設定やpackage.jsonの設定など復習
// 参考サイト
// https://www.memory-lovers.blog/entry/2022/05/31/110000
// https://zenn.dev/yodaka/articles/596f441acf1cf3

// 復習！！！！
// 必ず各app.get, app.post にはres.sendやres.end入れる！！1

