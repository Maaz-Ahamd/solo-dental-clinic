import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import api from '../../api/axiosConfig';

const AddTreatmentModal = ({ isOpen, onClose, onSuccess, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                price: initialData.price
            });
        } else {
            setFormData({
                name: '',
                price: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (initialData) {
                await api.put(`/treatments/${initialData.treatment_id}`, formData);
            } else {
                await api.post('/treatments', formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.details || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-2xl shadow-soft w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200/60">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                        <h3 className="text-lg font-bold leading-6 text-slate-900 tracking-tight">
                            {initialData ? 'Edit Treatment' : 'Add New Treatment'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 focus:outline-none bg-slate-50 p-1.5 rounded-full hover:bg-slate-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {error && (
                        <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Treatment Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                                placeholder="e.g., Teeth Cleaning"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 text-sm">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:transform-none"
                            >
                                {loading ? 'Saving...' : (initialData ? 'Update Treatment' : 'Add Treatment')}
                            </button>
                        </div>
                    </form>
            </div>
        </div>,
        document.body
    );
};

export default AddTreatmentModal;
