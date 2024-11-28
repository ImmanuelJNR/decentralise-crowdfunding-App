import React from "react";
import { useNavigate } from "react-router-dom";
import FundCard from "./FundCard";
import { loader } from "../assets";

const DisplayCampaignz = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  console.log("Campaigns passed to DisplayCampaignz:", campaigns);
  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  // if (isLoading) return <p>Loading campaigns...</p>;
  // if (!campaigns || campaigns.length === 0) return <p>No campaigns found.</p>;
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({campaigns.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campigns yet
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard
              key={campaign.pId}
              title={campaign.title}
              description={campaign.description}
              target={campaign.target}
              deadline={campaign.deadline}
              amountCollected={campaign.amountCollected}
              image={campaign.image}
              owner={campaign.owner}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaignz;
