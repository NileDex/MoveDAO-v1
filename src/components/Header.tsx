import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import favicon from "../../public/images/favicon.png";
import { AptosConnectButton } from "@razorlabs/wallet-kit";
import "./css/header.css";

const Header = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  let lastScrollY = 0;

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }

    lastScrollY = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`header ${isHidden ? "hidden" : ""}`}>
      <div className="logo-section">
        <div className="logo">
          <img src={favicon} alt="logo" />
          <img className="mobile-logo" src={favicon} alt="mobile logo" />
        </div>
        <div className="logo-info">
          <p className="governance-text">Governance</p>
          <div className="testnet-block">Testnet</div>
        </div>
      </div>

      <div className="hamburger" onClick={toggleNav}>
        <div className={isNavOpen ? "open-top" : ""} />
        <div className={isNavOpen ? "open-mid" : ""} />
        <div className={isNavOpen ? "open-bottom" : ""} />
      </div>

      <nav className={`nav-items ${isNavOpen ? "show" : ""}`}>
        {/* Wrap Link in a div to avoid possible nesting issues */}
        <div className="nav-link-wrapper">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => setIsNavOpen(false)}
          >
            MoveDAO
          </Link>
        </div>

       
        <div className="nav-button-container">
          <AptosConnectButton className="whit" />
        </div>
      </nav>
    </div>
  );
};

export default Header;
