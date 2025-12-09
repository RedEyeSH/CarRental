import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

const ConfirmModal = ({
    isOpen,
    title = 'Confirm',
    message = 'Are you sure?',
    onCancel,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    loading = false,
}) => {
    useEffect(() => {
        if (!isOpen) return;
        console.log('ConfirmModal: mounted, isOpen=', isOpen);
        const onKey = (e) => {
            if (e.key === 'Escape') {
                if (onCancel) onCancel();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    const modal = (
        <div className="confirm-overlay" onClick={onCancel}>
            <div
                className="confirm-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
            >
                <h4 id="confirm-modal-title">{title}</h4>
                <p>{message}</p>
                <div className="confirm-actions">
                    <button type="button" onClick={onCancel} disabled={loading}>{cancelText}</button>
                    <button type="button" onClick={onConfirm} disabled={loading}>{loading ? `${confirmText}...` : confirmText}</button>
                </div>
            </div>
        </div>
    );

    // Try to portal to document.body; if that fails (rare), render inline as a fallback
    try {
        return createPortal(modal, document.body);
    } catch (err) {
        console.warn('ConfirmModal: createPortal failed, rendering inline fallback', err);
        return modal;
    }
};

export default ConfirmModal;
