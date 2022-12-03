# 環境はnode.jsの最新版
FROM node:latest

# 以降の作業ディレクトリを指定
WORKDIR /app

# /appのディレクトリにpackage.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# npm install
RUN npm install

# アプリケーションのソースをバンドルする
COPY . .

# 特定のポートをコンテナがリッスンするために使う
EXPOSE 80

# npm start
CMD ["npm", "run", "prod"]