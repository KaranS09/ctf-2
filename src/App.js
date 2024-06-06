import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Sieze from "./Sieze.json";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Create a provider to interact with a smart contract
  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  async function requestAccount() {
    console.log("Requesting account....");

    //checking if metamask exists
    if (window.ethereum) {
      console.log("detected");

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log("Error connecting.....");
      }
    } else {
      console.log("Metamask not detected");
    }
  }

  // Function to generate a random string
  function generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  // Function to deploy smart contract
  async function deployContract() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // Generate a random flag
      const flag =
        generateRandomString(10) +
        "flag{4lway5_vi3w_data_1n_all_f0rmats_98098}";
      // const flag = "karan";

      // Define the preset value
      //const presetValue = ethers.utils.parseEther("0.01"); // Set to 0.01 ether, adjust as needed

      const factory = new ethers.ContractFactory(
        Sieze.abi,
        Sieze.bytecode,
        signer
      );

      setLoading(true); // Set loading to true before deploying the contract

      try {
        const contract = await factory.deploy(flag);
        await contract.deployed();
        console.log("Contract deployed at address:", contract.address);
        // console.log("Flag:", flag);

        // Update the contract address state
        setContractAddress(contract.address);
      } catch (error) {
        console.error("Error deploying contract:", error);
      } finally {
        setLoading(false); // Set loading to false after deployment is complete
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  return (
    <div className="App">
      <video autoPlay loop muted className="video-background">
        <source src="vid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <header className="App-header">
        <section>
          <h2>Locate the flag</h2>
        </section>
        <button onClick={requestAccount}>Connect Wallet</button>
        <h3>Wallet Address: {walletAddress}</h3>
        <button onClick={deployContract}>Deploy Contract</button>
        {loading ? (
          <h3>
            <div className="loading-animation">Loading...</div>
          </h3>
        ) : (
          <h3>
            {contractAddress && <p>Contract Address: {contractAddress}</p>}
          </h3>
        )}
      </header>
    </div>
  );
}

export default App;
