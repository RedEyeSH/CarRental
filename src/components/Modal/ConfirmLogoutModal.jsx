import React from "react";
import { useTranslation } from "react-i18next";
import "./Modal.css";

const ConfirmLogoutModal = ({ isOpen, onConfirm, onCancel }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="confirm-logout-overlay" onClick={onCancel}>
            <div className="confirm-logout-modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="confirm-logout-title">{t("confirmLogout.title")}</h3>
                <p className="confirm-logout-message">{t("confirmLogout.message")}</p>
                <div className="confirm-logout-buttons">
                    <button className="confirm-logout-cancel" onClick={onCancel}>
                        {t("confirmLogout.cancel")}
                    </button>
                    <button className="confirm-logout-confirm" onClick={onConfirm}>
                        {t("confirmLogout.confirm")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmLogoutModal;