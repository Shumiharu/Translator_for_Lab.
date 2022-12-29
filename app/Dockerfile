# 環境はnode.jsの最新版
FROM node:18.3.0-slim

# 以降の作業ディレクトリを指定
WORKDIR /app

# /appのディレクトリにpackage.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

COPY tsconfig.json ./

# npm install
RUN npm install

# アプリケーションのソースをバンドルする
COPY . .

RUN npm run build

RUN npm install pm2 --location=global

RUN ./node_modules/.bin/pm2 install typescript

# 特定のポートをコンテナがリッスンするために使う
EXPOSE 80

# npm run dev/prod
CMD ["npm", "run", "prod"]
