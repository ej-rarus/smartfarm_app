import React from "react";
import '../App.css';

function Footer(){
    return (

        <div className="component-container">
            <footer>
                <div className="footer-content-wrap">
                    <div className="footer-content">© 2024 EJ, Inc.</div>
                    <div className="footer-content-container">
                        <div className="footer-content">Terms</div>    
                        <div className="footer-content">Privacy</div>    
                        <div className="footer-content">Status</div>    
                        <div className="footer-content">Docs</div>    
                    </div>
                </div>
            </footer>
        </div>

    );
}

export default Footer;