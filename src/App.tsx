import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Vitals from "./components/Vitals";
import VoteData from "./components/VoteData";
import Proposals from "./components/Proposals";
import Vote from "./components/votecomponent/Vote";
import Profile from "./components/profilecomponent/Profile";
import Footer from "./components/votecomponent/utils/Footer";
import AnalyticsPage from "./components/Analytics/analytics";
import DAOGrid from "./components/community/CommunityGovernance";
import DAOVotingInterface from "./components/community/DAOVotinginterface";
import CreateProposal from "./components/votecomponent/createvote/CreateProposal";
import CreateDaoForm from "./components/community/createdaoform/CreateDaoForm";
import hero from "./components/images/hero.png";

function App() {
  return (
    <BrowserRouter>
      <div className="hero-background">
        <img src={hero} alt="" className="hero-img" />
      </div>
      <div className="content-wrapper">
        <Header />
        <Routes>
          <Route path="/" element={
            <div className="App">
              <Vitals />
              <VoteData />
              <Proposals />
            </div>
          } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/CommunityGovernance" element={<DAOGrid />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/CreateProposal" element={<CreateProposal />} />
          <Route path="/CreateDao" element={<CreateDaoForm />} />
          <Route path="/DAOVotinginterface" element={<DAOVotingInterface />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;