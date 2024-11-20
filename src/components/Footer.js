import React from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';

function Footer() {
    const navigate = useNavigate();

    const footerLinks = [
        { id: 1, text: 'Terms', path: '/terms' },
        { id: 2, text: 'Privacy', path: '/privacy' },
        { id: 3, text: 'Status', path: '/status' },
        { id: 4, text: 'Docs', path: '/docs' }
    ];

    return (
        <div className="component-container">
            <footer>
                    <div className="footer-content-container">
                        <div className="footer-content">© 2024 FARMSTER, Inc.</div>
                        {footerLinks.map(link => (
                            <div 
                                key={link.id} 
                                className="footer-content"
                                onClick={() => navigate(link.path)}
                                style={{ cursor: 'pointer' }}
                            >
                                {link.text}
                            </div>
                        ))}
                    </div>
            </footer>
        </div>
    );
}

export default Footer;