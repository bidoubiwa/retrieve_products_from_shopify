const axios = require('axios');
const fs = require('fs')


if (!process.argv[2]) {
  throw new Error(`Shopify domain name is required: ex: yarn start https://www.decathlon.com`)
}
const shopify = process.argv[2].replace(/\/$/, "");
try {
  const url = new URL(shopify);
}
catch(e) {
  throw new Error(`Not valid URL: ${shopify}`)
}
const limit = process.argv[3] || 30;

if (!Number.isInteger(limit)) {
  throw new Error(`Batch number should be an integer, but instead recieved: ${limit}`)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function fetchProducts(page) {
  await sleep(page * 100)
  try{
    const res = await axios.get(`${shopify}/products.json`, {
        params: {
          limit: 250,
          page
        },
        setTimeout: 200000
      })
      const products = res.data.products
      if (products.length === 0) {
        console.log(`page_${page}.json has no products. No new batches will be launched`);
        return -1
      }
      fs.writeFileSync(`${process.cwd()}/json/page_${page}.json`, JSON.stringify(products, null, 2))
      console.log(`page_${page}.json COMPLETED`);
      return 0
  } catch(e) {
    console.log(`page_${page}.json FAILED`);
    console.error(e.status)
    return -1
  }
}

async function batchFetch(limit = 30, currIndex = 0) {
  console.log({ limit, currIndex });

  const requests = []
  for (let index = currIndex; index < limit; index++) {
    requests.push(fetchProducts(index+1))
  }
  return await Promise.all(requests)
}

(async () => {
  try {
    if (!fs.existsSync(`${process.cwd()}/json`)){
      fs.mkdirSync(`${process.cwd()}/json`);
    }
    let index = 0;
    let batch = limit;
    while (1) {
      const res = await batchFetch(batch, index);
      console.log(res);
      if (res.find(x => x === -1)) {
        return;
      }
      index = index + limit
      batch = batch + limit
    }
  } catch (err) {
    console.error(err);
  }
})();
