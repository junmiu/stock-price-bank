# A Stock Price Server

## Get Started

1. set the required var in `.env.example` file and rename it

```shell
cp .env.example .env
```

2. run the server

```shell
npm run dev
```

3. cache all the symbols from mongoDB

```shell
npm run seed
```

## Testing

Test your query in a Http client. e.g., [Postman](https://www.postman.com/), [Insomnia](https://github.com/Kong/insomnia)

1. query paginated symbol

```
query { symbols(option: { limit: 2 }) { total nodes { name code } info { hasNext cursor } } }
```

2. query a symbol 

```
query {symbol(code: "AAPL") {name, code} }
```

3. list 3 references

```
query { references(startDate: "2023-10-01", option: { limit: 3, cursor: "12" }) { info { hasNext, cursor }, total, nodes { rate, date } } }
```