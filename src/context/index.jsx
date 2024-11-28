import React, { useContext, createContext, useState, useEffect } from "react";
import { ethers, parseEther, formatEther } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  // Replace with your contract's ABI and address
  //   const contractAddress = '0xac3462EDb6a57DE1c727bdFCf959D249C60074E7';
  //   const contractABI = [ /* Your contract ABI here */ ];

  // Initialize ethers provider and contract

  // useEffect(() => {
  //   console.log("Provider state updated:", { contract, address });
  // }, [contract, address]);

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          console.warn("Metamask is not installed");
          return;
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length) {
          console.log("Wallet is already connected:", accounts[0]);
          setAddress(accounts[0]);

          const providerInstance = new ethers.BrowserProvider(ethereum);
          const signerInstance = await providerInstance.getSigner();
          setProvider(providerInstance);
          setSigner(signerInstance);

          const contractInstance = new ethers.Contract(
            contractAddress,
            contractABI,
            signerInstance
          );
          console.log("Contract initialized automatically:", contractInstance);
          setContract(contractInstance);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return alert("Please install Metamask");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);

      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      const signerInstance = await providerInstance.getSigner();
      setProvider(providerInstance);
      setSigner(signerInstance);

      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signerInstance
      );
      console.log("Contract initialised:", contractInstance);
      setContract(contractInstance);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const publishCampaign = async (form) => {
    try {
      const tx = await contract.createCampaign(
        address,
        form.title,
        form.description,
        parseEther(form.target.toString()),
        new Date(form.deadline).getTime(),
        form.image
      );
      await tx.wait();
      console.log("Campaign published:", tx);
    } catch (error) {
      console.error("Failed to publish campaign:", error);
    }
  };

  const getCampaigns = async () => {
    if (!contract) {
      console.error("Contract is not initialized. please connect your wallet");
      return [];
    }
    try {
      const campaigns = await contract.getCampaigns();
      console.log("Raw campaigns from contract:", campaigns);
      // return campaigns.map((campaign, i) => ({

      console.log("Type of campaigns:", typeof campaigns);
      console.log("Keys in campaigns:", Object.keys(campaigns));
      console.log("Campaigns[0]:", campaigns[0]); // Check first item

      const formattedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: formatEther(campaign.target.toString()),
        // deadline: campaign.deadline.toNumber(),
        deadline: BigInt(campaign.deadline).toString(),
        amountCollected: formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        pId: i,
      }));
      console.log("Formatted campaigns:", formattedCampaigns); // Log formatted campaigns
      return formattedCampaigns;
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      return [];
    }
  };

  useEffect(() => {
    getCampaigns();
  }, []);

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    return allCampaigns.filter((campaign) => campaign.owner === address);
  };

  const donate = async (pId, amount) => {
    try {
      const tx = await contract.donateToCampaign(pId, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Donation failed:", error);
    }
  };

  const getDonations = async (pId) => {
    try {
      const donations = await contract.getDonators(pId);
      const parsedDonations = donations[0].map((donator, i) => ({
        donator,
        donation: ethers.formatEther(donations[1][i].toString()),
      }));
      return parsedDonations;
    } catch (error) {
      console.error("Failed to fetch donations:", error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connectWallet,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
