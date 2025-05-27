import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createEntryPayload } from "@thalalabs/surf";
import { ABI as StakingABI } from "../../services/Staking.ts";
import { useAptosWallet } from "@razorlabs/wallet-kit";
import { useStake } from "../useStake";
import { useVotes } from "../useVotes";
import { FaChartBar, FaUser, FaCalendarAlt, FaClock, FaCopy, FaCheck } from "react-icons/fa";
import { DVOTING } from "./constants";
import "./vote.css";

const Vote = () => {
  const { signAndSubmitTransaction } = useAptosWallet();
  const { data: userStake } = useStake();
  const { data: votes } = useVotes();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const proposalId = queryParams.get("id");

  const [proposal, setProposal] = useState<{
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    total_yes_votes: string;
    total_no_votes: string;
  } | null>(null);

  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (votes && proposalId) {
      const selectedProposal = votes.find((p) => p.id === proposalId);
      if (selectedProposal) {
        setProposal(selectedProposal);
      } else {
        setProposal(null);
      }
    }
  }, [votes, proposalId]);

  // Check if proposal voting has ended
  const isProposalCompleted = (endTime: number): boolean => {
    return Date.now() > endTime * 1000;
  };

  // Calculate vote percentage for progress bar
  const calculateVotePercentage = (yesVotes: string, noVotes: string) => {
    const yes = parseInt(yesVotes) / Math.pow(10, 8);
    const no = parseInt(noVotes) / Math.pow(10, 8);
    const total = yes + no;
    
    if (total === 0) return { yesPercent: 0, noPercent: 0 };
    
    return {
      yesPercent: (yes / total) * 100,
      noPercent: (no / total) * 100
    };
  };

  // Format vote counts for display
  const formatVoteCount = (voteString: string): string => {
    const votes = parseInt(voteString) / Math.pow(10, 8);
    return votes.toLocaleString();
  };

  // Function to shorten address
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to copy address
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(DVOTING);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!userStake || !proposal) return null;

  const vote = async (yes: boolean) => {
    try {
      const payload = createEntryPayload(StakingABI, {
        function: "vote",
        typeArguments: [],
        functionArguments: [
          BigInt(proposal.id),
          BigInt(stakeAmount),
          yes
        ],
      });

      const response = await signAndSubmitTransaction({
        payload
      });
      
      console.log("Transaction submitted:", response);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate the voting results
  const { yesPercent, noPercent } = calculateVotePercentage(
    proposal.total_yes_votes || "0",
    proposal.total_no_votes || "0"
  );

  const totalYesVotes = formatVoteCount(proposal.total_yes_votes || "0");
  const totalNoVotes = formatVoteCount(proposal.total_no_votes || "0");
  const isCompleted = isProposalCompleted(Number(proposal.end_time));

  return (
    <div className="vote-container-modern">
      <div className="vote-header">
        <div className="breadcrumb">
          
        </div>
      </div>
      
      <div className="vote-content">
        <div className="vote-main-section">
     
          <div className="vote-proposal-card">
            <h1 className="proposal-title">{proposal.title}</h1>
            <p className="proposal-description">{proposal.description}</p>
          </div>
          
          <div className="cast-vote-section">
            <div className="cast-vote-header">
              <h3>Cast your vote</h3>
              <div className="voting-power">
                <span>⚡ Voting power: </span>
                <span className="power-amount">{userStake || 0}</span>
              </div>
            </div>
            
            <div className="vote-form">
              <div className="vote-buttons">
                <button
                  className="vote-btn yes-btn"
                  type="button"
                  onClick={() => vote(true)}
                  disabled={isCompleted}
                >
                  {isCompleted ? "Voting Ended" : "Vote Yes"}
                </button>
                <button
                  className="vote-btn no-btn"
                  type="button"
                  onClick={() => vote(false)}
                  disabled={isCompleted}
                >
                  {isCompleted ? "Voting Ended" : "Vote No"}
                </button>
              </div>
              
              {!isCompleted && (
                <input
                  type="number"
                  min="0"
                  placeholder="Enter stake amount for vote"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="stake-input"
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="vote-sidebar">
          <div className="results-section">
            <div className="results-header">
              <h3>Results</h3>
              <span className="total-votes">Total votes: {(parseInt(totalYesVotes.replace(/,/g, '')) + parseInt(totalNoVotes.replace(/,/g, ''))).toLocaleString()}</span>
            </div>
            
            <div className="vote-results">
              <div className="result-bar">
                <div className="yes-bar" style={{width: `${yesPercent}%`}}></div>
                <div className="no-bar" style={{width: `${noPercent}%`}}></div>
              </div>
              
              <div className="result-options">
                <div className="result-option">
                  <div className="option-indicator yes-indicator"></div>
                  <span className="option-text">Yes</span>
                  <div className="option-stats">
                    <span className="option-count">{totalYesVotes}</span>
                    <span className="option-percentage">({Math.round(yesPercent)}%)</span>
                  </div>
                </div>
                
                <div className="result-option">
                  <div className="option-indicator no-indicator"></div>
                  <span className="option-text">No</span>
                  <div className="option-stats">
                    <span className="option-count">{totalNoVotes}</span>
                    <span className="option-percentage">({Math.round(noPercent)}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="proposal-details">
            <div className="detail-item">
              <span className="detail-label"><FaChartBar className="detail-icon" /> Status:</span>
              <span className={`status-badge ${isCompleted ? 'completed' : 'active'}`}>
                {isCompleted ? 'Completed' : 'Active'}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label"><FaUser className="detail-icon" /> Created by:</span>
              <div className="admin-address-container">
                <span className="admin-address">{shortenAddress(DVOTING)}</span>
                <button 
                  className="copy-button" 
                  onClick={copyToClipboard}
                  title="Copy full address"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-label"><FaCalendarAlt className="detail-icon" /> Start:</span>
              <span>{formatDate(Number(proposal.start_time))}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label"><FaClock className="detail-icon" /> End:</span>
              <span>{formatDate(Number(proposal.end_time))}</span>
            </div>
          </div>
          
          <div className="timeline-section">
            <h4>Timeline</h4>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot completed">
                  <FaCheck />
                </div>
                <div className="timeline-content">
                  <span className="timeline-status">Created</span>
                  <span className="timeline-date">{formatDate(Number(proposal.start_time))}</span>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-dot completed">
                   <FaCheck />
                </div>
                <div className="timeline-content">
                  <span className="timeline-status">Activated</span>
                  <span className="timeline-date">{formatDate(Number(proposal.start_time))}</span>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className={`timeline-dot ${isCompleted ? 'completed' : ''}`}>
                   {isCompleted && <FaCheck />}
                </div>
                <div className="timeline-content">
                  <span className="timeline-status">{isCompleted ? 'Completed' : 'In Progress'}</span>
                  <span className="timeline-date">{formatDate(Number(proposal.end_time))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote;