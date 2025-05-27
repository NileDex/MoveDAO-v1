import './css/footer.css'
const Footer = () => {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="footer">
        <div className="footer-container">
  
          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-socials">
              {['Github', 'Twitter',].map((social) => (
                <a key={social} href="#" className="footer-social-link">
                  {social}
                </a>
              ))}
            </div>
            <p className="footer-text">
              &copy; {currentYear} MoveDAO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  