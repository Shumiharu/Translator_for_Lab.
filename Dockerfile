# 環境はnode.jsの最新版
FROM node:latest

# 以降の作業ディレクトリを指定
WORKDIR /app

# /appのディレクトリにpackage.jsonをコピー
COPY package.json ./

# /appのディレクトリにpackage-lock.jsonをコピー
COPY package-lock.json ./

# npm install
RUN npm install

# アプリケーションのソースをバンドルする
COPY . .

# 特定のポートをコンテナがリッスンするために使う
EXPOSE 3000

# npm start
CMD ["npm", "start"]
