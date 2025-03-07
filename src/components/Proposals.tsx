// import { useState } from "react";
// import "./css/proposal.css";
// import { Link } from "react-router-dom";
// import { useVotes } from "./useVotes";
// import { IoCloudOfflineOutline } from "react-icons/io5"; // Offline icon

// const Proposals = () => {
//   const [filter, setFilter] = useState<string>("");

//   // Get votes and account information
//   const { data: votes } = useVotes();
//   const isConnected = votes !== undefined && votes.length > 0; // Check if connected by ensuring data exists

//   // Show offline icon and message if the wallet is not connected
//   if (!isConnected) {
//     return (
//       <div className="offline-container">
//         <IoCloudOfflineOutline size={80} color="#6c757d" />
//         <p>Your wallet is not connected. Please connect your wallet to view proposals.</p>
//       </div>
//     );
//   }

//   // Show offline icon and message if no votes are retrieved
//   if (!votes || votes.length === 0) {
//     return (
//       <div className="offline-container">
//         <IoCloudOfflineOutline size={80} color="#6c757d" />
//         <p>No votes found on the blockchain. Please check your connection or try again later.</p>
//       </div>
//     );
//   }

//   // Filter proposals based on user input
//   const filteredProposals = votes.filter((proposal) =>
//     proposal.title.toLowerCase().includes(filter.toLowerCase())
//   );

//   // Format timestamps for display
//   const formatDate = (timestamp: number): string => {
//     const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="proposal">
//       <div className="proposal-filter">
//         <h3>Proposals</h3>
//         <form>
//           <input
//             type="text"
//             placeholder="Search"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//           />
//         </form>
//       </div>

//       <div className="proposal-container">
//         <table className="styled-table">
//           <thead>
//             <tr>
//               <th>id</th>
//               <th>Topic</th>
//               <th></th>
//               <th>Start</th>
//               <th>End</th>
//               <th>Yes Votes</th>
//               <th>No Votes</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProposals.map((proposal) => (
//               <tr key={proposal.id}>
//                 <td className="link">{proposal.id}.</td>
//                 <td>{proposal.title}</td>
//                 <td>
//                   <button className="prior-plan">
//                     <Link to={`/vote?id=${proposal.id}`}>
//                       <p>Vote Here</p>
//                     </Link>
//                   </button>
//                 </td>
//                 <td>{proposal.start_time ? formatDate(Number(proposal.start_time)) : "N/A"}</td>
//                 <td>{proposal.end_time ? formatDate(Number(proposal.end_time)) : "N/A"}</td>
//                 <td>
//                   {parseInt(proposal.total_yes_votes) / Math.pow(10, 8)} MOVE
//                 </td>
//                 <td>
//                   {parseInt(proposal.total_no_votes) / Math.pow(10, 8)} MOVE
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Proposals;


import { useState, useEffect } from "react";
import "./css/proposal.css";
import { Link } from "react-router-dom";
import { useVotes } from "./useVotes";
import { IoCloudOfflineOutline } from "react-icons/io5";
import { FaChevronRight, FaPlus } from "react-icons/fa";
import { useAptosWallet } from "@razorlabs/wallet-kit";

// Skeleton loader component for better user experience during loading
const ProposalSkeleton = () => {
  return (
    <div className="proposal-card skeleton">
      <div className="proposal-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-date"></div>
        <div className="vote-count">
          <div className="skeleton-vote"></div>
          <div className="skeleton-vote"></div>
        </div>
      </div>
      <div className="skeleton-button"></div>
    </div>
  );
};

const ADMIN_ADDRESS = "0x160c30b861d6e3ac4864903423e6523a2ed873ae1b41132382f699b07ac684ec"; // Replace with the actual admin address

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

  // Always render the proposal container frame
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
        
        <div className="proposal-grid">
          {loading ? (
            // Show skeleton loaders while loading
            Array(4).fill(0).map((_, index) => (
              <ProposalSkeleton key={`skeleton-${index}`} />
            ))
          ) : !isConnected ? (
            // Wallet not connected message inside the proposal frame
            <div className="proposal-card">
              <div className="proposal-content offline-container">
                <IoCloudOfflineOutline size={60} color="#6c757d" />
                <p>Your wallet is not connected. Please connect your wallet to view proposals.</p>
              </div>
            </div>
          ) : !votes || votes.length === 0 ? (
            // No proposals found message inside the proposal frame
            <div className="proposal-card">
              <div className="proposal-content offline-container">
                <IoCloudOfflineOutline size={60} color="#6c757d" />
                <p>No votes found on the blockchain. Please check your connection or try again later.</p>
              </div>
            </div>
          ) : (
            // Render actual proposals
            votes
              .filter((proposal) => proposal.title.toLowerCase().includes(filter.toLowerCase()))
              .map((proposal) => (
                <div key={proposal.id} className="proposal-card">
                  <div className="proposal-content">
                    <h4>{proposal.title}</h4>
                    <p className="proposal-date">
                      Start: {proposal.start_time ? formatDate(Number(proposal.start_time)) : "N/A"} | 
                      End: {proposal.end_time ? formatDate(Number(proposal.end_time)) : "N/A"}
                    </p>
                    <div className="vote-count">
                      <span className="vote-yes">✅ {parseInt(proposal.total_yes_votes) / Math.pow(10, 8)} MOVE</span>
                      <span className="vote-no">❌ {parseInt(proposal.total_no_votes) / Math.pow(10, 8)} MOVE</span>
                    </div>
                  </div>
                  
                  <Link to={`/vote?id=${proposal.id}`} className="vote-button">
                    Vote <FaChevronRight />
                  </Link>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

export default Proposals;