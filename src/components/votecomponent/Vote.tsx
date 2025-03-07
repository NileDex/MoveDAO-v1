import { useState, useEffect } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { createEntryPayload } from "@thalalabs/surf";
import { ABI as StakingABI } from "../../services/Staking.ts";
import { useAptosWallet } from "@razorlabs/wallet-kit";
import { useStake } from "../useStake";
import { useVotes } from "../useVotes"; // Assuming you have a hook to fetch votes
import "./Vote.css"; // Import the CSS file

const Vote = () => {
  const { signAndSubmitTransaction } = useAptosWallet();
  const { data: stake } = useStake();
  const { data: votes } = useVotes(); // Fetch all proposals
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const proposalId = queryParams.get("id"); // Get the proposal ID from the URL

  const [proposal, setProposal] = useState<{
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
  } | null>(null);

  // Find the proposal based on the ID
  useEffect(() => {
    if (votes && proposalId) {
      const selectedProposal = votes.find((p) => p.id === proposalId);
      if (selectedProposal) {
        setProposal(selectedProposal);
      }
    }
  }, [votes, proposalId]);

  if (!stake || !proposal) return null;

  const vote = async (yes: boolean) => {
    const payload = createEntryPayload(StakingABI, {
      function: "vote",
      typeArguments: [],
      functionArguments: [proposal.id, (stake * Math.pow(10, 8)).toString(), yes],
    });

    await signAndSubmitTransaction({
      payload,
    });
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="vote-container">
      <div className="back">
        <Link to="/main">
          <span className="backicon">
            <IoChevronBackOutline />
          </span>
        </Link>
      </div>
      <div className="votequestion">
        <h4>Proposal / Governance</h4>
        <h1>Vote Question</h1>
        <h3>{proposal.title}</h3>
        <p>{proposal.description}</p>
        <p>
          Start: {formatDate(Number(proposal.start_time))} | End:{" "}
          {formatDate(Number(proposal.end_time))}
        </p>
      </div>
      <div className="answer-container">
        <div className="voteanswer">
          <form>
            <button
              className="votebtn"
              type="button"
              onClick={() => vote(true)}
            >
              Vote yes
            </button>
            <button
              className="votebtn"
              type="button"
              onClick={() => vote(false)}
            >
              Vote no
            </button>
          </form>
        </div>
        <div className="votedescription">
          <p>
            General Voting Rules One Person, One Vote: Each eligible voter
            should be allowed to cast only one vote. Eligibility Verification:
            Ensure that only eligible voters (those who meet predefined criteria
            such as age, residency, etc.) can participate in the voting process.
            Confidentiality: Voting should be confidential to protect voter
            privacy and prevent undue influence. Transparency: The voting
            process should be transparent to build trust. This includes clear
            instructions, open counting processes, and accessible records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vote;