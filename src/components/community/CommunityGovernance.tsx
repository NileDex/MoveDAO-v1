import "./css/CommunityGovernance.css";
import { Link } from "react-router-dom";

const DAOGrid = () => {
  const daos = [
    {
      id: 1,
      logo: "https://pbs.twimg.com/profile_images/1792972232819388416/l9fSx-_U_400x400.jpg",
      name: "Gorrila Moverz",
    },
    {
      id: 2,
      logo: "/realms-consensus.png",
      backdrop: "/bonkdao.png",
      name: "Nuttered",
    },
    {
      id: 3,
      logo: "/jito.png",
      backdrop: "/bonkdao.png",
      name: "Movetopia",
    },
    {
      id: 4,
      logo: "/bonkdao.png",
      backdrop: "/bonkdao.png",
      name: "Movementlabs",
    },
    {
      id: 5,
      logo: "/metaplex.png",
      backdrop: "/bonkdao.png",
      name: "Movedrome",
    },
    {
      id: 6,
      logo: "/marinade.png",
      backdrop: "/bonkdao.png",
      name: "ZebraFinance",
    },
    {
      id: 7,
      logo: "/solblaze.png",
      backdrop: "/bonkdao.png",
      name: "Curvance",
    },
    {
      id: 8,
      logo: "/solend.png",
      backdrop: "/bonkdao.png",
      name: "Solend DAO",
    },
    {
      id: 9,
      logo: "/pyth.png",
      backdrop: "/bonkdao.png",
      name: "Pyth Network",
    },
    {
      id: 10,
      logo: "/orca.png",
      backdrop: "/bonkdao.png",
      name: "Orca DAO",
    },
  ];

  return (
    <div className="app">
      <header className="daoheader">
        <div className="header-left">
          <h1>DAOs</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="DAO Checker - Enter DAO name or Mint Address"
            />
          </div>
        </div>
        <Link to="/CreateDao" className="button-link">
          <button className="create-dao-btn">Create DAO</button>
        </Link>
      </header>

      <div className="dao-grid">
        {daos.map((dao) => (
          <div key={dao.id} className="dao-card">
            <div className="dao-logo">
              <img src={dao.logo} alt={dao.name} />
            </div>
            <h3>{dao.name}</h3>
            <Link to="/DAO" className="">
              <span>View</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DAOGrid;
