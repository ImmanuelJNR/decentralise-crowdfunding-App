import React, { useState, useEffect } from "react";

import { DisplayCampaignz } from "../components";
import { useStateContext } from "../context";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns, connectWallet } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    console.log("Fetched campaigns data:", data);
    setCampaigns(data);
    setIsLoading(false);
  };

  // useEffect(() => {
  //   if (contract) fetchCampaigns();
  // }, [address, contract]);

  useEffect(() => {
    if (!contract) {
      console.error(
        "Contract is not available in Home component, prompting wallet connection"
      );
      connectWallet();
      return;
    }

    console.log("Contract is available in Home component");
    fetchCampaigns();
  }, [contract, address]);

  return (
    <DisplayCampaignz
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
};

export default Home;
