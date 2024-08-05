import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const FooterComponent = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-container">
          <div className="footer-logo">
          </div>
          <div className="footer-info">
            <div className="footer-section">
              <h6 className="footer-title">Want to work with us?</h6>
              <p>Use This Email:</p>
              <p><a href="mailto:contact@yatrifriendly.com" className="footer-email">contact@yatrifriendly.com</a></p>
            </div>
            <div className="footer-section">
              <h6 className="footer-title">Want to say hi?</h6>
              <p>General Inquiries:</p>
              <p><a href="mailto:contact@yatrifriendly.com" className="footer-email">contact@yatrifriendly.com</a></p>
            </div>
            <div className="footer-section">
              <h6 className="footer-title">Find us on social media.</h6>
              <div className="footer-social">
                <a href="#facebook" className="social-icon facebook"><FaFacebookF /></a>
                <a href="#twitter" className="social-icon twitter"><FaTwitter /></a>
                <a href="#instagram" className="social-icon instagram"><FaInstagram /></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>Yatrifriendly | All Rights Reserved &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
