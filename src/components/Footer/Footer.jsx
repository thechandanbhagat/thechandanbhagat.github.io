import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer">
      <div className="container">
        <h3>Chandan Gupta Bhagat</h3>
        <p>Software Engineer | Cloud Consultant | Trainer</p>
        <div className="social-links">
          <a href="https://twitter.com/chandangbhagat" className="twitter" target="_blank" rel="noreferrer">
            <i className="bx bxl-twitter"></i>
          </a>
          <a href="https://facebook.com/thechandanbhagat" className="facebook" target="_blank" rel="noreferrer">
            <i className="bx bxl-facebook"></i>
          </a>
          <a href="https://instagram.com/thechandanbhagat" className="instagram" target="_blank" rel="noreferrer">
            <i className="bx bxl-instagram"></i>
          </a>
          <a href="https://linkedin.com/in/guptac" className="linkedin" target="_blank" rel="noreferrer">
            <i className="bx bxl-linkedin"></i>
          </a>
          <a href="https://github.com/thechandanbhagat" className="github" target="_blank" rel="noreferrer">
            <i className="bx bxl-github"></i>
          </a>
        </div>
        <div className="copyright">
          &copy; Copyright {currentYear} <strong><span>Chandan Bhagat</span></strong>. All Rights Reserved
        </div>
      </div>
    </footer>
  )
}

export default Footer