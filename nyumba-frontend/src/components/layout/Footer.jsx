import { Link } from "react-router-dom";

import "../../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-section">
          <h3>Nyumba Digital</h3>

          <p>
            Smart rental management platform for Kenya.
          </p>
        </div>

        <div className="footer-section">

          <h3>Quick Links</h3>

          <ul>

            <li>
              <Link to="/">
                Home
              </Link>
            </li>

            <li>
              <Link to="/properties">
                Properties
              </Link>
            </li>

            <li>
              <a href="/#features">
                Features
              </a>
            </li>

            <li>
              <a href="/#about">
                About
              </a>
            </li>

            <li>
              <Link to="/login">
                Login
              </Link>
            </li>

            <li>
              <Link to="/register">
                Register
              </Link>
            </li>

            <li>
                <Link to="/tenant/dashboard">
                  Dashboard
                </Link>
            </li>
            
          </ul>

        </div>

        <div className="footer-section">

          <p>Nairobi, Kenya</p>
          <p>+254 799 804 307</p>

            <a href="mailto:info@nyumbadigital.com">
              info@nyumbadigital.com
            </a>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 Nyumba Digital. All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;