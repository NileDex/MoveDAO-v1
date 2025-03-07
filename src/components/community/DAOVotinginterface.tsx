import React, { useState } from 'react';
import './css/DAOVotingInterface.css';

const DAOVotingInterface = () => {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [comment, setComment] = useState('');

  return (
    <div className="dao-container">
      <div className="dao-header">
        <button className="back-button">
          <span>← Back</span>
        </button>
        <a href="#" className="external-link">
          <svg className="external-icon" viewBox="0 0 24 24" width="16" height="16">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M15 3h6v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 14L21 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </a>
      </div>

      <div className="dao-content">
        <div className="dao-main">
          <div className="proposal-header">
            <h1>Add community member FrfGP...K5itq</h1>
            <div className="proposal-meta">
              <span>Proposed by: 3PKhzE9wuEkOPHHu2sNCvGBGxNtDJduAcyBPXpE6cSNt</span>
            </div>
            <div className="proposer-name">Artrade Martin</div>
          </div>

          <div className="warning-box">
            <div className="warning-icon">⚠️</div>
            <div className="warning-content">
              <p className="warning-title">Instructions like this one change the way the DAO is governed</p>
              <p className="warning-description">
                This proposal writes to your realm configuration, which could affect how votes are counted. Both the instruction data AND accounts list contain parameters. Before you vote, make sure you review the proposal's instructions and the concerned accounts, and understand the implications of passing this proposal.
              </p>
            </div>
          </div>

          <div className="instructions-section">
            <div 
              className="section-header" 
              onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
            >
              <h2>Instructions</h2>
              <span className={`chevron ${isInstructionsOpen ? 'open' : ''}`}>▼</span>
            </div>
            {isInstructionsOpen && (
              <div className="instructions-content">
                <p>Instruction details would appear here.</p>
              </div>
            )}
          </div>

          <div className="discussion-section">
            <h2>Discussion (0)</h2>
            <div className="comment-box">
              <textarea 
                placeholder="Thoughts?..." 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
              />
              <button className="send-button">Send It</button>
            </div>
          </div>
        </div>

        <div className="dao-sidebar">
          <div className="vote-card">
            <h2>Cast your council vote</h2>
            <div className="vote-buttons">
              <button className="vote-yes">
                <span className="thumb-icon"></span> Vote Yes
              </button>
              <button className="vote-no">
                <span className="thumb-icon"></span> Vote No
              </button>
            </div>
          </div>

          <div className="voting-power-card">
            <h3>My voting power</h3>
            <div className="power-details">
              <div className="power-label">RED Council votes</div>
              <div className="power-value">0</div>
              <div className="power-percentage">0% of total</div>
            </div>
          </div>

          <div className="voting-stats-card">
            <div className="stats-header">
              <h3>Voting Now</h3>
              <span className="refresh-icon">↻</span>
            </div>
            <div className="timer">
              <span className="time-icon">⏱</span>
              <span className="time-value">02d 19h 21m</span>
              <span className="info-icon">ⓘ</span>
            </div>

            <div className="quorum-section">
              <div className="quorum-header">
                <span>Approval Quorum</span>
                <span className="info-icon">ⓘ</span>
              </div>
              <div>1 more Yes vote required</div>
              <div className="progress-bar">
                <div className="progress" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div className="votes-section">
              <div className="yes-votes">
                <h4>Yes Votes</h4>
                <div className="votes-count">1</div>
                <div className="votes-percentage">100.0%</div>
              </div>
              <div className="no-votes">
                <h4>No Votes</h4>
                <div className="votes-count">0</div>
                <div className="votes-percentage">0.0%</div>
              </div>
              <div className="votes-bar">
                <div className="yes-progress" style={{ width: '100%' }}></div>
              </div>
            </div>

            <button className="explore-button">
              Explore <span className="chevron">›</span>
            </button>
          </div>

          <div className="voting-rules-card">
            <div className="rules-header" onClick={() => {}}>
              <h3>Voting Rules</h3>
              <span className="chevron">▼</span>
            </div>
            <div className="rules-content">
              <div className="rule-item">
                <span className="rule-icon">👥</span>
                <span className="rule-label">Council</span>
              </div>
              <div className="rule-item">
                <span className="rule-icon">⏱</span>
                <span className="rule-label">3d</span>
              </div>
              <div className="rule-item">
                <span className="rule-icon">⚖️</span>
                <span className="rule-label">60%</span>
              </div>
              <div className="rule-item">
                <span className="rule-icon">📊</span>
                <span className="rule-label">Strict</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DAOVotingInterface;