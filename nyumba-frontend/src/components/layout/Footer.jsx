import "../../styles/footer.css";

function Footer() {
  return (
    <footer className="footer" id="contact">

      <div className="footer-container">

        <div>
          <h2>Nyumba Digital</h2>

          <p>
            Smart rental management platform for Kenya.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>

          <ul>
            <li>Home</li>
            <li>Properties</li>
            <li>About</li>
          </ul>
        </div>

        <div>
          <h3>Contact</h3>

          <p>Nairobi, Kenya</p>
          <p>info@nyumbadigital.com</p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Nyumba Digital. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;