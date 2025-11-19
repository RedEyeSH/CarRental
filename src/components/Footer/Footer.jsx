// ...existing code...
import React from "react";
import "./Footer.css";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <h3 className="brand-title">Car Rental</h3>
                    <p className="brand-desc">{t("footer.tagline", "Fast, reliable car rentals")}</p>
                </div>

                <div className="footer-col">
                    <h4>{t("footer.company", "Company")}</h4>
                    <ul>
                        <li><a>{t("footer.about", "About")}</a></li>
                        <li><a>{t("footer.careers", "Careers")}</a></li>
                        <li><a>{t("footer.terms", "Terms")}</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>{t("footer.resources", "Resources")}</h4>
                    <ul>
                        <li><a>{t("footer.help", "Help Center")}</a></li>
                        <li><a>{t("footer.docs", "Docs")}</a></li>
                        <li><a>{t("footer.blog", "Blog")}</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>{t("footer.contact", "Contact")}</h4>
                    <address className="footer-contact">
                        <p>info@carrental.local</p>
                        <p>+1 234 567 890</p>
                        <p>{t("footer.address", "123 Main St, City")}</p>
                    </address>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright">© {new Date().getFullYear()} Car Rental. {t("footer.rights", "All rights reserved.")}</p>
                <div className="footer-social">
                    <p>Twitter</p>
                    <p>Facebook</p>
                    <p>Instagram</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;