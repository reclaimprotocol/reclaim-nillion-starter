import * as client from "@reclaimprotocol/zk-fetch";
import "./App.css";
import { useState } from "react";
import { JsonEditor } from "json-edit-react";
import { Toaster, toast } from "react-hot-toast";

const APP_ID = import.meta.env.VITE_NILLION_APP_ID;
const USER_SEED = "user_1234"; // Place Holder for Nillion User Id
const API_BASE = "https://nillion-storage-apis-v0.onrender.com";

function App() {
  const [proofData, setProofData] = useState(null);
  const [storedData, setStoredData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isStoring, setIsStoring] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [nillionStoreId, SetNillionStoreId] = useState("");

  // Initialize the ReclaimClient with the app id and app secret (you can get these from the Reclaim dashboard - https://dev.reclaimprotocol.org/)
  const reclaim = new client.ReclaimClient(
    import.meta.env.VITE_RECLAIM_APP_ID,
    import.meta.env.VITE_RECLAIM_APP_SECRET,
    true
  );

  const getStoredData = async () => {
    setIsGetting(true);
    console.log("\nRetrieving secrets...");

    // Fetch the list of store IDs associated with the app
    const storeIds = await fetch(`${API_BASE}/api/apps/${APP_ID}/store_ids`)
      .then((res) => res.json())
      .then((data) => data.store_ids);

    // Retrieve the proof data for the first store ID in the list
    const storedProof = await fetch(
      `${API_BASE}/api/secret/retrieve/${storeIds[0].store_id}?retrieve_as_nillion_user_seed=${USER_SEED}&secret_name=${storeIds[0].secret_name}`
    ).then((res) => res.json());

    setStoredData(storedProof);
    console.log("Stored Proof retrieved:", storedProof);

    setIsGetting(false);
  };

  const generateProof = async () => {
    setIsFetching(true);
    try {
      // replace with your url to fetch data from (in this case, we are fetching Crypto Global Market Data from coingecko)
      const url = "https://api.coingecko.com/api/v3/global";
      const data = await reclaim.zkFetch(
        url,
        {
          // public options for the fetch request
          method: "GET",
        },
        {
          /*
            * The proof will match the response body with the regex pattern (search for the number of active cryptocurrencies in the response body)
            the regex will capture the number in the named group 'active_cryptocurrencies'.
            */
          responseMatches: [
            {
              type: "regex",
              // the regex pattern to match the response body and capture the number of active cryptocurrencies
              value:
                'active_cryptocurrencies":(?<active_cryptocurrencies>[\\d\\.]+)',
            },
          ],
          responseRedactions: [
            {
              regex:
                'active_cryptocurrencies":(?<active_cryptocurrencies>[\\d\\.]+)',
            },
          ],
        }
      );
      console.log(data);
      setProofData(data);
      setIsFetching(false);

      setIsStoring(true);
      console.log("\nStoring Proof...");
      const storeResult = await fetch(
        `${API_BASE}/api/apps/${APP_ID}/secrets`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: {
              nillion_seed: USER_SEED,
              secret_value: JSON.stringify(data), // The proof data to be stored, serialized as a string
              secret_name: data.identifier, // Use the proof identifier as the secret name
            },
            permissions: {
              retrieve: [], // Define permissions for retrieval (currently none)
              update: [], // Define permissions for updates (currently none)
              delete: [], // Define permissions for deletion (currently none)
              compute: {}, // Define compute permissions (currently empty)
            },
          }),
        }
      ).then((res) => res.json());
      console.log("Proof stored at:", storeResult);
      SetNillionStoreId(storeResult.store_id);
      setIsStoring(false);
      return data;
    } catch (error) {
      toast.error(`${error?.message}`);
      console.error(error);
    }
  };

  const updatedStoredData = {
    ...storedData,
    secret: storedData?.secret ? JSON.parse(storedData.secret) : null,
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <main className="main-container">
        <div className="content-container">
          <h2 className="main-title">
            Reclaim Protocol (zkFetch) - Nillion Starter
          </h2>
          <h4 className="subtitle">
            This demo uses{" "}
            <span className="highlight">
              <a
                href="https://www.npmjs.com/package/@reclaimprotocol/zk-fetch"
                target="_blank"
                rel="noreferrer"
              >
                @reclaimprotocol/zk-fetch
              </a>{" "}
              to fetch data from{" "}
              <a
                href="https://www.coingecko.com/en/api/documentation"
                target="_blank"
                rel="noreferrer"
              >
                coingecko
              </a>{" "}
              and generate a proof Then Store it on{" "}
              <a href="https://nillion.com/" target="_blank" rel="noreferrer">
                Nillion
              </a>{" "}
            </span>
          </h4>

          <button className="generate-button" onClick={generateProof}>
            {isFetching
              ? "Fetching..."
              : isStoring
              ? "Storing..."
              : "Generate Proof"}
          </button>
          {proofData && !isFetching && !isStoring && (
            <div className="proof-container">
              <h3 className="proof-title">Proof Generated</h3>

              <div className="json-editor-container">
                <JsonEditor
                  rootName="proof"
                  style={{ padding: "1rem" }}
                  data={proofData}
                  viewOnly={true}
                  restrictEdit={true}
                  restrictAdd={true}
                  restrictDelete={true}
                  restrictDrag={true}
                  theme={"githubDark"}
                  maxWidth={"100%"}
                  minWidth={"100%"}
                />
                <p className="subtitle">
                  Proof Stored on Nillion with the id: {nillionStoreId}
                </p>
              </div>
              <button className="generate-button" onClick={getStoredData}>
                {isGetting
                  ? "Getting your Stored Data..."
                  : "Get your Stored Proof Data from Nillion"}
              </button>
              {storedData && !isGetting && (
                <div className="json-editor-container">
                  <JsonEditor
                    rootName="Stored Proof Data"
                    style={{ padding: "1rem" }}
                    data={updatedStoredData}
                    viewOnly={true}
                    restrictEdit={true}
                    restrictAdd={true}
                    restrictDelete={true}
                    restrictDrag={true}
                    theme={"githubDark"}
                    maxWidth={"100%"}
                    minWidth={"100%"}
                    indentWidth={2}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
