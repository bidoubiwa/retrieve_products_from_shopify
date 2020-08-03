# Shopify product fetcher

This script will retrieve all products from a given shopify website. Each batch of 250 products will be written in a json file, and added in the `/json` directory at the root of the project.


## Installation

```
yarn install
```

## Running

```
yarn start [SHOPIFY_DOMAIN] [BATCH_LIMIT]
```
`SHOPIFY_DOMAIN` expect an url to the shopify you want the products from.
Ex: `https://www.decathlon.com`.
It expects a well formated URL.

`BATCH_LIMIT` is not mandatory. Its default value is `30`. It expects an integer.

## Exemple

```
yarn start https://www.decathlon.com
```

Once over, head over to the directory called `/json`. Inside you will find files called `page_*.json` each corresponding to maximum `250` products.
