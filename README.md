# Instruction

1- (DATASOURCE) NodeJS ile Historical-Data.sql dosyasında bulunan sembolleri içeren, bu sembollere ait rastgele fiyatlar oluşturan (sembolün son bar verisindeki kapanışın çok altında veya çok üstünde olmayacak, mantıklı şekilde artıp azalacak), rastgele milisaniyelerde bu fiyatların dağıtımını yapan veri kaynağı hazırlanmalıdır.

2- (SOCKET SERVER) NodeJS Amqplib paketi ile bu fiyat kaynağından gelen fiyatları alıp Redis’te tutan ve güncel verileri 500 milisaniyede bir Client’lara dağıtan bir soket sunucusu yapısı oluşturulmalıdır.

3- (SOCKET CLIENT) Soket sunucusundan gelen verileri konsol ekranında gösteren Client yapısı kurulmalıdır.

4- (API) Müşteri tablosu oluşturup, müşteri ekleme-silme-güncelleme-listeleme fonksiyonlarını içeren basit bir API yazılmalıdır.

# Explanation of architecture

Prefered monorepo architecture based on requirements.

- Pros:
  - Versioning
  - Scalibility
  - Reusability
  - Easy to test
  - Modular
- Cons:
  - Probably over engineered
  - Maintanance/Development Cost
  - Complexity

# Installation

- clone repository

```bash
git clone ...
```

- install dependencies

```bash
npm i
```

- run
```bash
docker-compose up -d --build
```

# Packages

## Packages/Core

### Usage

Contains application factory functionality and able to create job, api, socket with redis, db, queue connections

- Build script

```bash
npm run build:core
```

- Import

```js
import { applicationFactory } from "@ftcase-sdk/core";
```

- Example

```js
import { applicationFactory } from "@ftcase-sdk/core";

applicationFactory("job", {
  env: "development",
  db: {
    host: env.withDefault(process.env.DB_HOST, "127.0.0.1"),
    port: Number.parseInt(env.withDefault(process.env.DB_PORT, "3306")),
    user: env.withDefault(process.env.DB_USER, "root"),
    database: env.withDefault(process.env.DB_TABLE, "ftcase"),
    logQueries: ["true", "TRUE", "1"].includes(
      env.withDefault(process.env.LOG_QUERIES, "false")
    ),
    connectionTimeout: Number.parseInt(
      env.withDefault(process.env.CONNECTION_TIMEOUT, "500")
    ),
  },
  cache: {
    host: env.withDefault(process.env.CACHE_HOST, "127.0.0.1"),
    port: Number.parseInt(env.withDefault(process.env.CACHE_PORT, "6379")),
    password: process.env.CACHE_PASSWORD,
  },
  queue: {
    host: env.withDefault(process.env.QUEUE_HOST, "127.0.0.1"),
    user: env.withDefault(process.env.QUEUE_USER, "guest"),
    password: env.withDefault(process.env.QUEUE_PASSWORD, "guest"),
    port: Number.parseInt(env.withDefault(process.env.QUEUE_PORT, "5672")),
  },
  exec: job,
  execInterval: Number.parseInt(
    env.withDefault(process.env.JOB_INTERVAL, "1000")
  ),
});
```

## Packages/data

Data access layer. able to create db & redis connections. Contains db models and data sources. <b>[ medium maintainance ] </b>

- Build script

```bash
npm run build:data
```

- Import

```js
import { HSymbolChart } from "@ftcase-sdk/data";
```

```js
import { Cache, DB } from "@ftcase-sdk/data";
```

- Example

```js
import { DB, Cache } from "@ftcase-sdk/data";

export default class AppBase {
  db: IDB;
  cache: ICache;
  async buildDatabaseInstance(config: IDBConfig): Promise<IDB> {
    const databaseInstance = new DB(config);
    await databaseInstance.connect();

    await databaseInstance.buildModels();

    this.db = databaseInstance;

    return databaseInstance;
  }

  ...
```

## Packages/pubsub

Basic PubSub service using RabbitMq adapter through amqplib

- Build script

```bash
npm run build:pubsub
```

- Import

```js
import PubSub from "@ftcase-sdk/pubsub";
```

- Example

```js
import PubSub from "@ftcase-sdk/pubsub";

async buildPubSubInstance(config: IPubSubConfig): Promise<IPubSub> {
    const pubSubInstance = new PubSub(config);
    await pubSubInstance.connect();
    this.pubsub = pubSubInstance;
    return pubSubInstance;
  }
```

## Packages/types

Contains structural application types and interfaces. basically used everywhere. <b>[ high maintainance ] </b>

- Build script

```bash
npm run build:types
```

- Import

```js
import { IJob, IJobAppConfig } from "@ftcase-sdk/types";
```

- Example

```js
import {
  ICacheConfig,
  IDBConfig,
  IPubSub,
  IPubSubConfig,
  ICache,
  IDB,
} from "@ftcase-sdk/types";

export default class AppBase {
  db: IDB;
  cache: ICache;
  pubsub: IPubSub;
  async buildDatabaseInstance(config: IDBConfig): Promise<IDB> {
    ...
  }

  async buildCacheInstance(config: ICacheConfig): Promise<ICache> {
   ...
  }

  async buildPubSubInstance(config: IPubSubConfig): Promise<IPubSub> {
    ...
  }
}
```

## Packages/utils

Common utility packages. <b>[ low maintainance ] </b>

```bash
npm run build:utils
```

```js
import { env } from "@ftcase-sdk/utils";
```

- Example

```js
import { Timer } from "@ftcase-sdk/utils";
const timer = new Timer();
timer.start();
...
console.log(`Execution time: ${timer.end()}ms`);

```
