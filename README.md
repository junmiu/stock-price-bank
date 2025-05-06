# A Stock Price Server

## Get Started

```shell
npm run dev
```

if you need a dummy data:

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
query { references(date: "2023-10-01", option: { limit: 3, cursor: "12" }) { info { hasNext, cursor }, total, nodes { rate, date } } }
```