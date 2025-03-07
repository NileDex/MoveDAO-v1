import React, { useState, useEffect } from "react";
import { useStake } from "../useStake";
import { Link } from 'react-router-dom';
import "./css/DAO.css";

const MarinadeDashboard = () => {

  const [batchVoting, setBatchVoting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
    

     const { data: stake } = useStake();
 


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <div className="dashboard-header">
          <div className="back-button">
            <a href="../" className="link-button">
              Back
            </a>
          </div>
          <div className="dao-title">
            <div className="dao-logo">
              <img src="/api/placeholder/40/40" alt="Marinade logo" />
            </div>
            <h1>Marinade</h1>
          </div>
          <div className="dao-controls">
            <a href="./stats" className="control-button link-button">
              <span>MNDE stats</span>
            </a>
            <a href="./members" className="control-button link-button">
              <span>Members</span>
            </a>
            <a href="./params" className="control-button link-button">
              <span>Params</span>
            </a>
            <a
              href="https://marinade.finance"
              target="_blank"
              rel="noopener noreferrer"
              className="control-button link-button"
            >
              <span>Link</span>
            </a>
            <a
              href="./metadata"
              className="control-button metadata link-button"
            >
              <span>Add Onchain Metadata</span>
            </a>
          </div>
        </div>

        <div className="banner">
          <div className="banner-content">
            <div className="logo-big">
              <div className="chef-hat"></div>
              <h1>Marinade</h1>
            </div>
          </div>
        </div>

        <div className="search-and-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="DAO Checker - Enter DAO name or Mint Address"
            />
          </div>
          <div className="filter-buttons">
            <button className="filter-button">Filter</button>
            <button className="filter-button">Sorting</button>
          </div>
        </div>

        <div className="proposals-header">
          <div className="proposal-count">185 Proposals</div>
          <div className="batch-voting">
            <span>Batch voting</span>
            <div
              className="toggle-switch"
              onClick={() => setBatchVoting(!batchVoting)}
            >
              <div
                className={`toggle-circle ${batchVoting ? "active" : ""}`}
              ></div>
            </div>
            <a
              href="./new-proposal"
              className="new-proposal-button link-button"
            >
              New Proposal
            </a>
          </div>
        </div>

        <div className="daoproposals-list">
          <div className="daoproposal-card">
            <div className="daoproposal-info">
              <h3>MIP.10 - Simplification of SAM's Delegation Strategy</h3>
              <p className="daoproposal-status">Succeeded 9 days ago</p>
            </div>
            <a
              href="./proposal/10"
              className="daoproposal-status-badge completed link-button"
            >
              <span>Completed</span>
               <Link to="/DAOVotinginterface" className="">
                            <span>View</span>
              
                          </Link>
            </a>
          </div>

          <div className="daoproposal-card">
            <div className="daoproposal-info">
              <h3>
                MIP.9 - Blocklisting malicious validators from Stake Auction
                Marketplace to
              </h3>
              <p className="daoproposal-status">Succeeded 14 days ago</p>
            </div>
            <a
              href="./proposal/9"
              className="daoproposal-status-badge completed link-button"
            >
              <span>Completed</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sidebar - moves to bottom on mobile */}
      <div className="sidebar">
        <div className="sidebar-section">
          <div className="section-header">
            <h2>My governance power</h2>
            <a href="./governance-power" className="view-button link-button">
              View
            </a>
          </div>
          <p className="no-power">
            <p>Staked: {stake}</p>
          </p>
        </div>

        <div className="sidebar-section">
          <div className="section-header">
            <h2>NFTs</h2>
            <a href="./nfts" className="view-button link-button">
              View
            </a>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-header">
            <h2>DAO Wallets & Assets</h2>
            <a href="./wallets" className="view-button link-button">
              View
            </a>
          </div>

          <div className="treasury-balance">
            <p>Treasury Balance</p>
            <h2>$72,416,990.01</h2>
          </div>

          <div className="wallet-list">
            <div className="wallet-item">
              <div className="wallet-logo">
                <img src="/api/placeholder/32/32" alt="Marinade logo" />
              </div>
              <div className="wallet-info">
                <h3>Marinade MNDE Treasury Vault</h3>
                <p className="wallet-address">569,642,951.2161248 MNDE</p>
                <p className="wallet-value">≈$60,283,087</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarinadeDashboard;

