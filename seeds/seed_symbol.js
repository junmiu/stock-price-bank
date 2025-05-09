const { MongoClient, Collection } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const defaultSymbols = [
    { currency: 'USD', code: 'AAPL', name: 'Apple Inc.' },
    { currency: 'USD', code: 'MSFT', name: 'Microsoft Corporation' },
    { currency: 'USD', code: 'GOOGL', name: 'Alphabet Inc.' },
    { currency: 'USD', code: 'AMZN', name: 'Amazon.com, Inc.' },
    { currency: 'USD', code: 'TSLA', name: 'Tesla, Inc.' },
    { currency: 'USD', code: 'FB', name: 'Meta Platforms, Inc.' },
    { currency: 'USD', code: 'NFLX', name: 'Netflix, Inc.' },
    { currency: 'USD', code: 'NVDA', name: 'NVIDIA Corporation' },
    { currency: 'USD', code: 'BRK.A', name: 'Berkshire Hathaway Inc.' },
    { currency: 'USD', code: 'JPM', name: 'JPMorgan Chase & Co.' },
    { currency: 'USD', code: 'V', name: 'Visa Inc.' },
    { currency: 'USD', code: 'PG', name: 'Procter & Gamble Co.' },
    { currency: 'USD', code: 'JNJ', name: 'Johnson & Johnson' },
    { currency: 'USD', code: 'UNH', name: 'UnitedHealth Group Incorporated' },
    { currency: 'USD', code: 'HD', name: 'The Home Depot, Inc.' },
    { currency: 'USD', code: 'DIS', name: 'The Walt Disney Company' },
    { currency: 'USD', code: 'IBM', name: 'International Business Machines Corporation' },
    { currency: 'USD', code: 'ORCL', name: 'Oracle Corporation' },
    { currency: 'USD', code: 'INTC', name: 'Intel Corporation' },
    { currency: 'USD', code: 'CSCO', name: 'Cisco Systems, Inc.' },
    { currency: 'USD', code: 'ADBE', name: 'Adobe Inc.' },
    { currency: 'USD', code: 'PYPL', name: 'PayPal Holdings, Inc.' },
    { currency: 'USD', code: 'CRM', name: 'Salesforce, Inc.' },
    { currency: 'USD', code: 'PEP', name: 'PepsiCo, Inc.' },
    { currency: 'USD', code: 'KO', name: 'The Coca-Cola Company' },
    { currency: 'USD', code: 'MCD', name: 'McDonald’s Corporation' },
    { currency: 'USD', code: 'NKE', name: 'Nike, Inc.' },
    { currency: 'USD', code: 'COST', name: 'Costco Wholesale Corporation' },
    { currency: 'USD', code: 'WMT', name: 'Walmart Inc.' },
    { currency: 'USD', code: 'T', name: 'AT&T Inc.' },
    { currency: 'USD', code: 'VZ', name: 'Verizon Communications Inc.' },
    { currency: 'USD', code: 'BA', name: 'The Boeing Company' },
    { currency: 'USD', code: 'GE', name: 'General Electric Company' },
    { currency: 'USD', code: 'CAT', name: 'Caterpillar Inc.' },
    { currency: 'USD', code: 'MMM', name: '3M Company' },
    { currency: 'USD', code: 'UPS', name: 'United Parcel Service, Inc.' },
    { currency: 'USD', code: 'FDX', name: 'FedEx Corporation' },
    { currency: 'USD', code: 'XOM', name: 'Exxon Mobil Corporation' },
    { currency: 'USD', code: 'CVX', name: 'Chevron Corporation' },
    { currency: 'USD', code: 'SLB', name: 'Schlumberger Limited' },
    { currency: 'USD', code: 'BP', name: 'BP p.l.c.' },
    { currency: 'USD', code: 'RDS.A', name: 'Royal Dutch Shell plc' },
    { currency: 'USD', code: 'TSM', name: 'Taiwan Semiconductor Manufacturing Company Limited' },
    { currency: 'USD', code: 'ASML', name: 'ASML Holding N.V.' },
    { currency: 'USD', code: 'SAP', name: 'SAP SE' },
    { currency: 'USD', code: 'TM', name: 'Toyota Motor Corporation' },
    { currency: 'USD', code: 'HMC', name: 'Honda Motor Co., Ltd.' },
    { currency: 'USD', code: 'F', name: 'Ford Motor Company' },
    { currency: 'USD', code: 'GM', name: 'General Motors Company' },
    { currency: 'USD', code: 'LMT', name: 'Lockheed Martin Corporation' },
    { currency: 'USD', code: 'NOC', name: 'Northrop Grumman Corporation' },
    { currency: 'USD', code: 'RTX', name: 'Raytheon Technologies Corporation' },
    { currency: 'USD', code: 'GD', name: 'General Dynamics Corporation' },
    { currency: 'USD', code: 'SPCE', name: 'Virgin Galactic Holdings, Inc.' },
    { currency: 'USD', code: 'PLTR', name: 'Palantir Technologies Inc.' },
    { currency: 'USD', code: 'SNOW', name: 'Snowflake Inc.' },
    { currency: 'USD', code: 'SQ', name: 'Block, Inc.' },
    { currency: 'USD', code: 'SHOP', name: 'Shopify Inc.' },
    { currency: 'USD', code: 'TWLO', name: 'Twilio Inc.' },
    { currency: 'USD', code: 'ZM', name: 'Zoom Video Communications, Inc.' },
    { currency: 'USD', code: 'DOCU', name: 'DocuSign, Inc.' },
    { currency: 'USD', code: 'ROKU', name: 'Roku, Inc.' },
    { currency: 'USD', code: 'SPOT', name: 'Spotify Technology S.A.' },
    { currency: 'USD', code: 'UBER', name: 'Uber Technologies, Inc.' },
    { currency: 'USD', code: 'LYFT', name: 'Lyft, Inc.' },
    { currency: 'USD', code: 'PINS', name: 'Pinterest, Inc.' },
    { currency: 'USD', code: 'ETSY', name: 'Etsy, Inc.' },
    { currency: 'USD', code: 'SQSP', name: 'Squarespace, Inc.' },
    { currency: 'USD', code: 'FVRR', name: 'Fiverr International Ltd.' },
    { currency: 'USD', code: 'UPWK', name: 'Upwork Inc.' },
    { currency: 'USD', code: 'TTD', name: 'The Trade Desk, Inc.' },
    { currency: 'USD', code: 'CRWD', name: 'CrowdStrike Holdings, Inc.' },
    { currency: 'USD', code: 'ZS', name: 'Zscaler, Inc.' },
    { currency: 'USD', code: 'OKTA', name: 'Okta, Inc.' },
    { currency: 'USD', code: 'NET', name: 'Cloudflare, Inc.' },
    { currency: 'USD', code: 'DDOG', name: 'Datadog, Inc.' },
    { currency: 'USD', code: 'MDB', name: 'MongoDB, Inc.' },
    { currency: 'USD', code: 'TEAM', name: 'Atlassian Corporation Plc' },
    { currency: 'USD', code: 'WORK', name: 'Slack Technologies, Inc.' },
    { currency: 'USD', code: 'WDAY', name: 'Workday, Inc.' },
    { currency: 'USD', code: 'NOW', name: 'ServiceNow, Inc.' },
    { currency: 'USD', code: 'INTU', name: 'Intuit Inc.' },
    { currency: 'USD', code: 'ADSK', name: 'Autodesk, Inc.' },
    { currency: 'USD', code: 'ANET', name: 'Arista Networks, Inc.' },
    { currency: 'USD', code: 'PANW', name: 'Palo Alto Networks, Inc.' },
    { currency: 'USD', code: 'FTNT', name: 'Fortinet, Inc.' },
    { currency: 'USD', code: 'SPLK', name: 'Splunk Inc.' },
    { currency: 'USD', code: 'ZEN', name: 'Zendesk, Inc.' },
    { currency: 'USD', code: 'HUBS', name: 'HubSpot, Inc.' },
    { currency: 'USD', code: 'TWTR', name: 'Twitter, Inc.' },
    { currency: 'USD', code: 'SNAP', name: 'Snap Inc.' },
    { currency: 'USD', code: 'BABA', name: 'Alibaba Group Holding Limited' },
    { currency: 'USD', code: 'JD', name: 'JD.com, Inc.' },
    { currency: 'USD', code: 'PDD', name: 'Pinduoduo Inc.' },
    { currency: 'USD', code: 'BIDU', name: 'Baidu, Inc.' },
    { currency: 'USD', code: 'TCEHY', name: 'Tencent Holdings Limited' },
    { currency: 'USD', code: 'NTES', name: 'NetEase, Inc.' },
    { currency: 'USD', code: 'SE', name: 'Sea Limited' },
    { currency: 'USD', code: 'MELI', name: 'MercadoLibre, Inc.' },
    { currency: 'USD', code: 'WIX', name: 'Wix.com Ltd.' },
    { currency: 'USD', code: 'Z', name: 'Zillow Group, Inc.' },
    { currency: 'USD', code: 'RDFN', name: 'Redfin Corporation' },
    { currency: 'USD', code: 'OPEN', name: 'Opendoor Technologies Inc.' },
    { currency: 'USD', code: 'EXPE', name: 'Expedia Group, Inc.' },
    { currency: 'USD', code: 'BKNG', name: 'Booking Holdings Inc.' },
    { currency: 'USD', code: 'TRIP', name: 'Tripadvisor, Inc.' },

];

const connect = async () => {
  const { MONGODB_URI, MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;
  const options = {
    auth: {
      username: MONGODB_USERNAME,
      password: MONGODB_PASSWORD,
    },
    directConnection: true,
    connectTimeoutMS: 3000,
  };
  return await MongoClient.connect(MONGODB_URI, options);
}

/**
 * @param {MongoClient} client 
 */
const disconnect = (client) => {
  return client.close();
}

/**
 * @param {Collection} collection 
 * @returns {Promise<{code: string, name: string, currency: string}[]>} result
 */
const listAllCodeRicWithCurrency = async (collection) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: { codeRic: "$codeRic", currencyCode: "$currencyCode" },
        },
      },
      { $sort: { "_id.codeRic": 1 } },
      {
        $project: {
          _id: 0,
          code: "$_id.codeRic",
          currency: "$_id.currencyCode",
          name: "$_id.codeRic",
        },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();
    return result;
  } catch (error) {
    console.error("Error listing codeRic with currency:", error);
    throw new Error("Failed to list codeRic with currency");
  }
};

const insertSymbols = async (knex, symbols) => {
  const n = 100;
  for (let i = 0; i< symbols.length; i += n) {
    const batch = symbols.slice(i, i + n);
    await knex('symbols').insert(batch).returning('id');
  }
};

const insertReferences = async (knex, symbols) => {
  return await knex('references').insert(
    symbols.reduce((acc, symbol, index) => {
      const rate = Math.random() * index; // Random rate between 0.8 and 1.0
      const sign = Math.random() < 0.5 ? -1 : 1; // Random sign for rate
      const today = new Date();
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(today.getDate() - 2);
      const r1 = {
        symbol: symbol.id,
        rate: rate, // Incremental rate
        date: today.toISOString().split('T')[0], // Today's date
      };
      const r2 = {
        symbol: symbol.id,
        rate: rate + sign * Math.random(), // Incremental rate
        date: twoDaysAgo.toISOString().split('T')[0], // Today's date
      };
      acc.push(r1);
      acc.push(r2);
      return acc;
    }, []),
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const { MONGODB_NAME, MONGODB_COLLECTION } = process.env;
  // Deletes ALL existing entries
  await knex('symbols').del();
  await knex('references').del();
  const client = await connect();
  const symbolArr = await listAllCodeRicWithCurrency(client.db(MONGODB_NAME).collection(MONGODB_COLLECTION));
  const symbols = await insertSymbols(knex, symbolArr);
  await disconnect(client);
  // await insertReferences(knex, symbols);
};
