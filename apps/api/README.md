# `api`

> TODO: description

## Environmment

```bash
NODE_ENV=development
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PORT=3306
DB_TABLE=ftcase
LOG_QUERIES=false
CONNECTION_TIMEOUT=5000

CACHE_HOST=127.0.0.1
CACHE_PORT=6379
```

### Requests

- Get Customers

```bash
curl --request GET  --url http://localhost:3000/customers
```

- Create Customer

```bash
curl --request POST  --url http://localhost:3000/customers --header "Content-Type: application/json" --data "{\"name\":\"Test\"}"
```

- Update Customer

```bash
curl --request PATCH  --url http://localhost:3000/customers/1 --header "Content-Type: application/json" --data "{\"name\":\"Test123\"}"
```

- DELETE Customer

```bash
curl --request DELETE  --url http://localhost:3000/customers/1
```
