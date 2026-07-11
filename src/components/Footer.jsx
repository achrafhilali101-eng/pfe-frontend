export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand" style={{ color: "white" }}>
            <span className="brand-mark" style={{ color: "var(--color-secondary)" }}>Vend</span>io
          </span>
          <p className="footer-tagline">
            La marketplace qui apprend vos goûts et ne vous laisse jamais tomber en rupture.
          </p>
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h4>Support</h4>
            <a href="#">Centre d'aide</a>
            <a href="#">Livraison</a>
            <a href="#">Retours</a>
            <a href="#">FAQ</a>
          </div>

          <div className="footer-column">
            <h4>Entreprise</h4>
            <a href="#">À propos</a>
            <a href="#">Carrières</a>
            <a href="#">Devenir vendeur</a>
            <a href="#">Presse</a>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <a href="#">contact@vendio.com</a>
            <a href="#">+212 5 00 00 00 00</a>
            <a href="#">Rabat, Maroc</a>
          </div>
        </div>

        <div className="footer-social">
          <a href="#" aria-label="Facebook" className="social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
            </svg>
          </a>
          <a href="#" aria-label="X (Twitter)" className="social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.9 3H22l-7.6 8.7L23 21h-6.9l-5.4-6.6L4.4 21H1.3l8.1-9.3L1 3h7.1l4.9 6.1L18.9 3Zm-1.2 16h1.7L7.4 5H5.6l12.1 14Z" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram" className="social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .3 2.4.5.6.2 1 .5 1.5 1 .4.4.7.9 1 1.5.2.5.4 1.2.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 2-.5 2.4-.2.6-.5 1-1 1.5-.4.4-.9.7-1.5 1-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.3-2.4-.5-.6-.2-1-.5-1.5-1-.4-.4-.7-.9-1-1.5-.2-.5-.4-1.2-.5-2.4-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-2 .5-2.4.2-.6.5-1 1-1.5.4-.4.9-.7 1.5-1 .5-.2 1.2-.4 2.4-.5 1.3-.1 1.7-.1 4.9-.1ZM12 0C8.7 0 8.3 0 7 .1c-1.3.1-2.2.3-3 .6-.8.3-1.5.8-2.2 1.4C1.1 2.8.6 3.5.3 4.3c-.3.8-.5 1.7-.6 3C-.4 8.7-.4 9 -.4 12.4s0 3.7.1 5c.1 1.3.3 2.2.6 3 .3.8.8 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.7.5 3 .6 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.3-.1 2.2-.3 3-.6.8-.3 1.5-.8 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.5-1.7.6-3 .1-1.3.1-1.7.1-5s0-3.7-.1-5c-.1-1.3-.3-2.2-.6-3-.3-.8-.8-1.5-1.4-2.2C21.2 1.1 20.5.6 19.7.3c-.8-.3-1.7-.5-3-.6C15.4 0 15 0 12 0Z" />
              <path d="M12 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
              <circle cx="18.4" cy="5.6" r="1.4" />
            </svg>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Vendio. Tous droits réservés.</span>
        <span className="footer-note">Projet académique (PFE) — contenu de démonstration</span>
      </div>
    </footer>
  );
}
