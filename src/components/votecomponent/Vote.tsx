// Import necessary React hooks and external libraries
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // For accessing URL parameters
import { createEntryPayload } from "@thalalabs/surf"; // For creating blockchain transaction payloads
import { ABI as StakingABI } from "../../services/Staking.ts"; // Smart contract ABI
import { useAptosWallet } from "@razorlabs/wallet-kit"; // Wallet connection hook
import { useStake } from "../useStake"; // Custom hook for user's stake data
import { useVotes } from "../useVotes"; // Custom hook for voting data
import { FaChartBar, FaUser, FaCalendarAlt, FaClock, FaCopy, FaCheck } from "react-icons/fa"; // Icons
import { DVOTING } from "./constants"; // Contract address constant
import "./vote.css"; // Styling

// Main Vote component for handling proposal voting
const Vote = () => {
  // Wallet interaction hook for signing and submitting transactions
  const { signAndSubmitTransaction } = useAptosWallet();
  
  // Custom hooks to fetch user's stake amount and all voting proposals
  const { data: userStake } = useStake();
  const { data: votes } = useVotes();
  
  // React Router hooks to get current URL and extract query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const proposalId = queryParams.get("id"); // Extract proposal ID from URL

  // State to store the current proposal being viewed
  const [proposal, setProposal] = useState<{
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    total_yes_votes: string;
    total_no_votes: string;
  } | null>(null);

  // State to store the amount user wants to stake for their vote
  const [stakeAmount, setStakeAmount] = useState<string>("");
  
  // State to manage copy-to-clipboard feedback
  const [copied, setCopied] = useState(false);

  // Effect to find and set the current proposal when votes data or proposalId changes
  useEffect(() => {
    if (votes && proposalId) {
      // Find the proposal matching the ID from URL parameters
      const selectedProposal = votes.find((p) => p.id === proposalId);
      if (selectedProposal) {
        setProposal(selectedProposal);
      } else {
        setProposal(null); // Proposal not found
      }
    }
  }, [votes, proposalId]);

  // Function to check if voting period has ended
  // Takes end time as Unix timestamp and compares with current time
  const isProposalCompleted = (endTime: number): boolean => {
    return Date.now() > endTime * 1000; // Convert seconds to milliseconds
  };

  // Function to calculate vote percentages for progress bar visualization
  const calculateVotePercentage = (yesVotes: string, noVotes: string) => {
    // Convert from blockchain format (divide by 10^8 for token decimals)
    const yes = parseInt(yesVotes) / Math.pow(10, 8);
    const no = parseInt(noVotes) / Math.pow(10, 8);
    const total = yes + no;
    
    // Handle edge case where no votes have been cast
    if (total === 0) return { yesPercent: 0, noPercent: 0 };
    
    // Return percentages for both options
    return {
      yesPercent: (yes / total) * 100,
      noPercent: (no / total) * 100
    };
  };

  // Function to format vote counts for human-readable display
  const formatVoteCount = (voteString: string): string => {
    // Convert from blockchain format and add thousand separators
    const votes = parseInt(voteString) / Math.pow(10, 8);
    return votes.toLocaleString();
  };

  // Function to create a shortened version of blockchain addresses
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to copy contract address to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(DVOTING);
      setCopied(true); // Show success feedback
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Show loading state if proposal data hasn't loaded yet
  if (!proposal) return <div>Loading proposal...</div>;

  // Main voting function - handles both Yes and No votes
  const vote = async (yes: boolean) => {
    try {
      // Create transaction payload using the smart contract ABI
      const payload = createEntryPayload(StakingABI, {
        function: "vote", // Smart contract function name
        typeArguments: [], // No generic types needed
        functionArguments: [
          BigInt(proposal.id), // Proposal ID as big integer
          BigInt(stakeAmount), // Stake amount as big integer
          yes // Boolean for vote direction (true = yes, false = no)
        ],
      });

      // Submit transaction through connected wallet
      const response = await signAndSubmitTransaction({
        payload
      });
      
      console.log("Transaction submitted:", response);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // Function to format Unix timestamps into readable dates
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate voting statistics for display
  const { yesPercent, noPercent } = calculateVotePercentage(
    proposal.total_yes_votes || "0",
    proposal.total_no_votes || "0"
  );

  // Format vote counts for display
  const totalYesVotes = formatVoteCount(proposal.total_yes_votes || "0");
  const totalNoVotes = formatVoteCount(proposal.total_no_votes || "0");
  
  // Check if voting period has ended
  const isCompleted = isProposalCompleted(Number(proposal.end_time));
  
  // Check if user has staked tokens (required for voting)
  const hasStake = userStake !== undefined && userStake !== null && userStake > 0;

  // Main component render
  return (
    <div className="vote-container-modern">
      {/* Header section with navigation breadcrumbs */}
      <div className="vote-header">
        <div className="breadcrumb">
          {/* Breadcrumb navigation could be added here */}
        </div>
      </div>
      
      {/* Main content area */}
      <div className="vote-content">
        {/* Left side - Main voting section */}
        <div className="vote-main-section">
          {/* Proposal information card */}
          <div className="vote-proposal-card">
            <h1 className="proposal-title">{proposal.title}</h1>
            <p className="proposal-description">{proposal.description}</p>
          </div>
          
          {/* Voting interface section */}
          <div className="cast-vote-section">
            <div className="cast-vote-header">
              <h3>Cast your vote</h3>
              {/* Display user's voting power based on their stake */}
              <div className="voting-power">
                <span>⚡ Voting power: </span>
                <span className="power-amount">{userStake || 0}</span>
              </div>
            </div>
            
            {/* Voting form */}
            <div className="vote-form">
              {/* Warning message if user has no stake */}
              {!hasStake && !isCompleted && (
                <div className="no-stake-warning">
                  <p>You need to stake tokens to participate in voting.</p>
                </div>
              )}
              
              {/* Vote buttons */}
              <div className="vote-buttons">
                <button
                  className="vote-btn yes-btn"
                  type="button"
                  onClick={() => vote(true)} // Vote Yes
                  disabled={isCompleted || !hasStake} // Disable if voting ended or no stake
                >
                  {/* Dynamic button text based on state */}
                  {isCompleted ? "Voting Ended" : !hasStake ? "Stake Required" : "Vote Yes"}
                </button>
                <button
                  className="vote-btn no-btn"
                  type="button"
                  onClick={() => vote(false)} // Vote No
                  disabled={isCompleted || !hasStake} // Disable if voting ended or no stake
                >
                  {/* Dynamic button text based on state */}
                  {isCompleted ? "Voting Ended" : !hasStake ? "Stake Required" : "Vote No"}
                </button>
              </div>
              
              {/* Stake amount input - only show if voting is active and user has stake */}
              {!isCompleted && hasStake && (
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
        
        {/* Right side - Sidebar with results and details */}
        <div className="vote-sidebar">
          {/* Voting results section */}
          <div className="results-section">
            <div className="results-header">
              <h3>Results</h3>
              {/* Calculate and display total vote count */}
              <span className="total-votes">
                Total votes: {(parseInt(totalYesVotes.replace(/,/g, '')) + parseInt(totalNoVotes.replace(/,/g, ''))).toLocaleString()}
              </span>
            </div>
            
            {/* Visual representation of vote results */}
            <div className="vote-results">
              {/* Progress bar showing vote distribution */}
              <div className="result-bar">
                <div className="yes-bar" style={{width: `${yesPercent}%`}}></div>
                <div className="no-bar" style={{width: `${noPercent}%`}}></div>
              </div>
              
              {/* Detailed breakdown of votes */}
              <div className="result-options">
                {/* Yes votes section */}
                <div className="result-option">
                  <div className="option-indicator yes-indicator"></div>
                  <span className="option-text">Yes</span>
                  <div className="option-stats">
                    <span className="option-count">{totalYesVotes}</span>
                    <span className="option-percentage">({Math.round(yesPercent)}%)</span>
                  </div>
                </div>
                
                {/* No votes section */}
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
          
          {/* Proposal details section */}
          <div className="proposal-details">
            {/* Proposal status */}
            <div className="detail-item">
              <span className="detail-label"><FaChartBar className="detail-icon" /> Status:</span>
              <span className={`status-badge ${isCompleted ? 'completed' : 'active'}`}>
                {isCompleted ? 'Completed' : 'Active'}
              </span>
            </div>
            
            {/* Proposal creator information */}
            <div className="detail-item">
              <span className="detail-label"><FaUser className="detail-icon" /> Created by:</span>
              <div className="admin-address-container">
                <span className="admin-address">{shortenAddress(DVOTING)}</span>
                {/* Copy button with dynamic icon */}
                <button 
                  className="copy-button" 
                  onClick={copyToClipboard}
                  title="Copy full address"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
            </div>
            
            {/* Proposal start date */}
            <div className="detail-item">
              <span className="detail-label"><FaCalendarAlt className="detail-icon" /> Start:</span>
              <span>{formatDate(Number(proposal.start_time))}</span>
            </div>
            
            {/* Proposal end date */}
            <div className="detail-item">
              <span className="detail-label"><FaClock className="detail-icon" /> End:</span>
              <span>{formatDate(Number(proposal.end_time))}</span>
            </div>
          </div>
          
          {/* Timeline section showing proposal lifecycle */}
          <div className="timeline-section">
            <h4>Timeline</h4>
            <div className="timeline">
              {/* Creation milestone */}
              <div className="timeline-item">
                <div className="timeline-dot completed">
                  <FaCheck />
                </div>
                <div className="timeline-content">
                  <span className="timeline-status">Created</span>
                  <span className="timeline-date">{formatDate(Number(proposal.start_time))}</span>
                </div>
              </div>
              
              {/* Activation milestone */}
              <div className="timeline-item">
                <div className="timeline-dot completed">
                   <FaCheck />
                </div>
                <div className="timeline-content">
                  <span className="timeline-status">Activated</span>
                  <span className="timeline-date">{formatDate(Number(proposal.start_time))}</span>
                </div>
              </div>
              
              {/* Completion milestone (conditional styling) */}
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