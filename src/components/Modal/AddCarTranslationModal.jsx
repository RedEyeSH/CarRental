import React, { useState, useEffect } from "react";
import "./Modal.css";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

const AddCarTranslationModal = ({ onClose, carId, token, onTranslationAdded }) => {
    const [formData, setFormData] = useState({
        locale: "",
        description_translated: "",
    });
    const [submitting, setSubmitting] = useState(false);

    // New state to hold fetched translations
    const [translations, setTranslations] = useState([]);
    const [loadingTranslations, setLoadingTranslations] = useState(false);

    // Edit state for inline editing of existing translations
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        locale: "",
        description_translated: "",
    });
    const [updating, setUpdating] = useState(false);

    // Delete confirmation state
    const [deleteTarget, setDeleteTarget] = useState(null); // translation object or null
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    // Fetch translations for this car when the modal opens or carId/token change
    useEffect(() => {
        const fetchTranslations = async () => {
            if (!carId) return;
            setLoadingTranslations(true);
            try {
                const auth = token || localStorage.getItem("token");
                if (!auth) {
                    toast.error("Missing authentication token for fetching translations");
                    setTranslations([]);
                    setLoadingTranslations(false);
                    return;
                }

                const url = `http://localhost:3000/api/v1/car-translations?car_id=${encodeURIComponent(carId)}`;
                const res = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${auth}`,
                    },
                });

                if (!res.ok) {
                    const errText = await res.text().catch(() => null);
                    toast.error(errText || "Failed to load translations");
                    setTranslations([]);
                    setLoadingTranslations(false);
                    return;
                }

                const data = await res.json();
                // Expecting an array of translations
                setTranslations(Array.isArray(data) ? data : (data.translations || []));
            } catch (err) {
                console.error(err);
                toast.error("Failed to load translations");
                setTranslations([]);
            } finally {
                setLoadingTranslations(false);
            }
        };

        fetchTranslations();
    }, [carId, token]);

    // Start editing a translation row
    const startEdit = (t) => {
        if (!t || !t.id) return;
        setEditingId(t.id);
        setEditForm({
            locale: t.locale || "",
            description_translated: t.description_translated || "",
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ locale: "", description_translated: "" });
    };

    // Save edited translation (PUT to /api/v1/car-translations/{id})
    const saveEdit = async (id) => {
        if (!id) return;
        setUpdating(true);
        try {
            const auth = token || localStorage.getItem("token");
            if (!auth) {
                toast.error("Missing authentication token for updating translation");
                setUpdating(false);
                return;
            }

            const url = `http://localhost:3000/api/v1/car-translations/${encodeURIComponent(id)}`;
            const body = {
                // Include locale and translated description; API may ignore car_id on update
                locale: editForm.locale,
                description_translated: editForm.description_translated,
            };

            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errText = await res.text().catch(() => null);
                toast.error(errText || "Failed to update translation");
                setUpdating(false);
                return;
            }

            const updated = await res.json();
            // Update local translations state: replace the item with same id
            setTranslations(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
            toast.success("Translation updated");
            cancelEdit();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update translation");
        } finally {
            setUpdating(false);
        }
    };

    // Open delete confirmation modal for a translation
    const confirmDelete = (t) => {
        if (!t || !t.id) return;
        console.log('AddCarTranslationModal: confirmDelete called for translation:', t); // debug log
        setDeleteTarget(t);
        setShowDeleteConfirm(true);

        // Fallback check: after a short delay, if the confirm modal hasn't been mounted into the DOM,
        // show a native window.confirm so the user can continue deleting while we debug visibility.
        setTimeout(() => {
            try {
                const el = document.querySelector('.confirm-overlay');
                if (!el) {
                    console.warn('ConfirmModal not found in DOM after confirmDelete — falling back to window.confirm for now');
                    const ok = window.confirm(`Delete translation for locale "${t.locale}"?`);
                    if (ok) {
                        // ensure deleteTarget is set, then call performDelete
                        setDeleteTarget(t);
                        performDelete();
                      } else {
                        cancelDelete();
                      }
                }
            } catch (err) {
                console.error('Error checking for confirm modal fallback', err);
            }
        }, 80);
    };

    const cancelDelete = () => {
        setDeleteTarget(null);
        setShowDeleteConfirm(false);
    };

    // Perform DELETE request for translation
    const performDelete = async () => {
        if (!deleteTarget || !deleteTarget.id) return;
        console.log('AddCarTranslationModal: performDelete starting for id=', deleteTarget.id);
        setDeleting(true);
        try {
            const auth = token || localStorage.getItem("token");
            if (!auth) {
                toast.error("Missing authentication token for deleting translation");
                setDeleting(false);
                return;
            }

            const url = `http://localhost:3000/api/v1/car-translations/${encodeURIComponent(deleteTarget.id)}`;
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth}`,
                },
            });

            if (!res.ok) {
                const errText = await res.text().catch(() => null);
                toast.error(errText || "Failed to delete translation");
                setDeleting(false);
                return;
            }

            // Removal from local state
            setTranslations(prev => prev.filter(item => item.id !== deleteTarget.id));
            toast.success("Translation deleted");
            // Close confirmation
            cancelDelete();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete translation");
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.locale) {
            toast.error("Please enter a locale (e.g. fi)");
            return;
        }
        setSubmitting(true);
        const body = {
            car_id: carId,
            locale: formData.locale,
            description_translated: formData.description_translated,
        };

        try {
            const res = await fetch("http://localhost:3000/api/v1/car-translations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token || localStorage.getItem("token")}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const jsonResponse = await res.json().catch(() => null);
                
                const errText = jsonResponse?.error || "Failed to add translation";

                toast.error(errText);
                setSubmitting(false);
                return;
            }

            const created = await res.json();
            toast.success("Translation added successfully");
            if (onTranslationAdded) onTranslationAdded(created);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add translation");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h2>Add Car Translation</h2>

                {/* Translations table */}
                <div className="translations-section">
                    <h3>Existing Translations</h3>

                    {loadingTranslations ? (
                        <p>Loading translations...</p>
                    ) : translations && translations.length > 0 ? (
                        <div className="translations-table-wrapper">
                            <table className="translations-table">
                                <thead>
                                    <tr>
                                        <th>Locale</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {translations.map((t, idx) => (
                                        <tr key={t.id ?? `${t.locale}-${idx}`}>
                                            {/* If this row is being edited, show inputs */}
                                            <td>
                                                {t.locale || "—"}
                                            </td>
                                            <td>
                                                {editingId === t.id ? (
                                                    <textarea
                                                        name="description_translated"
                                                        value={editForm.description_translated}
                                                        onChange={handleEditChange}
                                                        className="inline-edit-textarea"
                                                        rows={3}
                                                    />
                                                ) : (
                                                    t.description_translated || "—"
                                                )}
                                            </td>
                                            <td>
                                                {t.id ? (
                                                    editingId === t.id ? (
                                                        <div className="translation-actions">
                                                            <button
                                                                type="button"
                                                                className="translation-action-btn save"
                                                                onClick={() => saveEdit(t.id)}
                                                                disabled={updating}
                                                            >
                                                                {updating ? "Saving..." : "Save"}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="translation-action-btn cancel"
                                                                onClick={cancelEdit}
                                                                disabled={updating}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="translation-actions">
                                                            <button
                                                                type="button"
                                                                className="translation-action-btn edit"
                                                                onClick={() => startEdit(t)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="translation-action-btn delete"
                                                                onClick={() => confirmDelete(t)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )
                                                ) : (
                                                    <em>—</em>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No translations found for this car.</p>
                    )}
                </div>

                {/* Use separate ConfirmModal component for delete confirmation */}
                <ConfirmModal
                    isOpen={showDeleteConfirm && !!deleteTarget}
                    title="Confirm delete"
                    message={deleteTarget ? `Are you sure you want to delete the translation for locale "${deleteTarget.locale}"?` : 'Are you sure?'}
                    onCancel={cancelDelete}
                    onConfirm={performDelete}
                    confirmText="Delete"
                    cancelText="Cancel"
                    loading={deleting}
                />

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="locale"
                            value={formData.locale}
                            onChange={handleChange}
                            required
                            placeholder=" "
                        />
                        <label htmlFor="locale">Locale (e.g. fi)</label>
                    </div>

                    <div className="form-group">
                        <textarea
                            name="description_translated"
                            value={formData.description_translated}
                            onChange={handleChange}
                            placeholder=" "
                            rows={4}
                        />
                        <label htmlFor="description_translated">Description (translated)</label>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add Translation"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCarTranslationModal;

