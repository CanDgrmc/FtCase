FROM node:23
WORKDIR /app

COPY ./package.json .
COPY ./lerna.json .
COPY ./nx.json .

RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000 3001

CMD npm start