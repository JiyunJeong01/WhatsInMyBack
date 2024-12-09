# 빌드 단계
FROM node:lts AS build

WORKDIR /usr/src/app

COPY package.json . 
RUN npm install

# 실행 단계
FROM node:lts

WORKDIR /usr/src/app

COPY . .

ENV PORT 5000
EXPOSE 5000

CMD ["node", "main.js"]
