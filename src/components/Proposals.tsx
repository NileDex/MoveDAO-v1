import { useState, useEffect } from "react";
import "./css/proposal.css";
import { Link } from "react-router-dom";
import { useVotes } from "./useVotes";
import { IoCloudOfflineOutline } from "react-icons/io5";
import { FaPlus, FaCheck } from "react-icons/fa";
import { useAptosWallet } from  "@razorlabs/wallet-kit";
import { DVOTING } from "./votecomponent/constants";
// Skeleton loader component for table rows
const ProposalSkeleton = () => {
  return (
    <tr className="skeleton-row">
      <td><div className="skeleton-item skeleton-title"></div></td>
      <td><div className="skeleton-item skeleton-status"></div></td>
      <td><div className="skeleton-item skeleton-status"></div></td>
      <td><div className="skeleton-item skeleton-results"></div></td>
      <td><div className="skeleton-item skeleton-date"></div></td>
      <td><div className="skeleton-item skeleton-date"></div></td>
    </tr>
  );
};

const ADMIN_ADDRESS = DVOTING; // Use DVOTING constant for admin check

const Proposals = () => {
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  
  const { data: votes } = useVotes();
  const isConnected = votes !== undefined;
  const { address } = useAptosWallet(); // Get the connected wallet's address

  // Simulate loading state
  useEffect(() => {
    if (votes !== undefined) {
      // Add a slight delay to show skeleton even if data loads quickly
      const timer = setTimeout(() => {
        setLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [votes]);

  // Format timestamps for display
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  // Check if the current user has voted on a proposal
  const hasUserVoted = (proposal: any): boolean => {
    if (!address || !proposal.voters) return false;
    
    // Check if the current user's address is in the voters array
    return proposal.voters.some((voterAddress: string) => 
      voterAddress.toLowerCase() === address.toLowerCase()
    );
  };

  // Filter proposals based on user input
  const filteredProposals = votes ? votes.filter((proposal) =>
    proposal.title.toLowerCase().includes(filter.toLowerCase())
  ) : [];

  return (
    <div className="proposal-wrapper">
      <div className="proposal">
        <div className="proposal-header">
          <div className="header-content">
            <h3>Proposals</h3>
            {/* Conditionally render the "Create Proposal" button */}
            {address === ADMIN_ADDRESS && (
              <Link to="/CreateProposal" className="create-button">
                <FaPlus /> Create
              </Link>
            )}
          </div>
          <div className="filter-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search Proposals"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                disabled={loading || !isConnected}
              />
            </div>
          </div>
        </div>
        
        <div className="proposal-table-container">
          {loading ? (
            <table className="proposal-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Voted</th>
                  <th>Status</th>
                  <th>Results</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody>
                {Array(4).fill(0).map((_, index) => (
                  <ProposalSkeleton key={`skeleton-${index}`} />
                ))}
              </tbody>
            </table>
          ) : !isConnected ? (
            <div className="offline-container">
              <IoCloudOfflineOutline size={60} color="#6c757d" />
              <p>Your wallet is not connected. Please connect your wallet to view proposals.</p>
            </div>
          ) : !votes || votes.length === 0 ? (
            <div className="offline-container">
              <IoCloudOfflineOutline size={60} color="#6c757d" />
              <p>No votes found on the blockchain. Please check your connection or try again later.</p>
            </div>
          ) : (
            <table className="proposal-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Voted</th>
                  <th>Status</th>
                  <th>Results</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody>
                {filteredProposals.map((proposal) => {
                  const { yesPercent, noPercent } = calculateVotePercentage(
                    proposal.total_yes_votes,
                    proposal.total_no_votes
                  );
                  const isCompleted = isProposalCompleted(Number(proposal.end_time));
                  const userHasVoted = hasUserVoted(proposal);
                  
                  return (
                    <tr key={proposal.id} className="proposal-row">
                      <td className="title-cell">
                        <div className="proposal-title">
                          <Link to={`/vote?id=${proposal.id}`} className="title-link">
                            {proposal.title}
                          </Link>
                          <div className="proposal-subtitle">Standard DAO Proposal</div>
                        </div>
                      </td>
                      <td className="voted-cell">
                        {userHasVoted ? (
                          <FaCheck style={{ color: '#28a745', fontSize: '16px' }} />
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="status-cell">
                        <span className={`status-badge ${isCompleted ? 'completed' : 'active'}`}>
                          {isCompleted ? 'Completed' : 'Active'}
                        </span>
                      </td>
                      <td className="results-cell">
                        <div className="progress-bar">
                          <div 
                            className="progress-yes" 
                            style={{ width: `${yesPercent}%` }}
                          ></div>
                          <div 
                            className="progress-no" 
                            style={{ width: `${noPercent}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="date-cell">
                        <div className="date-info">
                          <div className="date">
                            {proposal.start_time ? formatDate(Number(proposal.start_time)) : "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="date-cell">
                        <div className="date-info">
                          <div className="date">
                            {proposal.end_time ? formatDate(Number(proposal.end_time)) : "N/A"}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Proposals;