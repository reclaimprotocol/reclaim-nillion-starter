# Reclaim Protocol with Nillion Starter

This project demonstrates the use of the [Reclaim Protocol](https://dev.reclaimprotocol.org/) and [Nillion](https://nillion.com/) to fetch data, generate zero-knowledge proofs (`zkFetch`), and securely store and retrieve those proofs.

## Features

- Fetches data from an external API ([CoinGecko](https://www.coingecko.com/en/api/documentation)).
- Generates zero-knowledge proofs using the Reclaim Protocol.
- Stores proofs securely in Nillion's decentralized storage.
- Retrieves stored proofs for further use or verification.

## Prerequisites

1. **Reclaim Protocol Credentials**:
   - Obtain an `APP_ID` and `APP_SECRET` from the [Reclaim Dashboard](https://dev.reclaimprotocol.org/).
2. **Nillion APP ID**:
   - Get [Nillion APP ID](https://docs.nillion.com/storage-apis#0-register-your-app) for storing and retrieving data.

## Environment Variables

Set the following variables in your `.env` file:

```env
VITE_RECLAIM_APP_ID=<your-reclaim-app-id>
VITE_RECLAIM_APP_SECRET=<your-reclaim-app-secret>
VITE_NILLION_APP_ID=<your-nillion-app-id>
```

## Getting Started

1. **Clone the Repository**:

```bash
git clone https://github.com/reclaimprotocol/reclaim-nillion-starter
cd reclaim-nillion-starter
```

2. **Install Dependencies**:

```bash
npm install
```

3. **Copy browser-rpc files to public dir**:

```bash
npm run postinstall
```

4. **Run the Application**:

```bash
npm run dev
```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:5173`.

## Functionality

### 1. **Generate Proof**

Click the "Generate Proof" button to:

- Fetch data from CoinGecko's API.
- Generate a zero-knowledge proof of the fetched data.
- Store the proof on Nillion.

### 2. **Retrieve Stored Proof**

Click "Get your Stored Proof Data from Nillion" to:

- Retrieve the stored proof data from Nillion.
- Display the retrieved proof in a JSON .
