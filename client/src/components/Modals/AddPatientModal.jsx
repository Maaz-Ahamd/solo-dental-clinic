import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Trash2 } from 'lucide-react';
import api from '../../api/axiosConfig';

const AddPatientModal = ({ isOpen, onClose, onPatientAdded, initialData, onDelete }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        medical_history: '',
        date_of_birth: '',
        gender: 'Male',
        email: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            // function to format date yyyy-MM-dd
            const formatDate = (dateString) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            };

            setFormData({
                first_name: initialData.first_name || '',
                last_name: initialData.last_name || '',
                phone: initialData.phone || '',
                medical_history: initialData.medical_history || '',
                date_of_birth: formatDate(initialData.date_of_birth) || '',
                gender: initialData.gender || 'Male',
                email: initialData.email || '',
                address: initialData.address || ''
            });
        } else {
            setFormData({
                first_name: '',
                last_name: '',
                phone: '',
                medical_history: '',
                date_of_birth: '',
                gender: 'Male',
                email: '',
                address: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await api.put(`/patients/${initialData.patient_id}`, formData);
            } else {
                await api.post('/patients', formData);
            }
            onPatientAdded();
            onClose();
        } catch (error) {
            console.error("Error saving patient:", error);
            alert("Failed to save patient");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData) return;
        if (window.confirm("Are you sure you want to delete this patient?")) {
            setLoading(true);
            try {
                if (onDelete) {
                    await onDelete(initialData.patient_id);
                } else {
                    await api.delete(`/patients/${initialData.patient_id}`);
                    onPatientAdded();
                    onClose();
                }
            } catch (error) {
                console.error("Error deleting patient:", error);
                alert("Failed to delete patient");
            } finally {
                setLoading(false);
            }
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-2xl shadow-soft w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200/60">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {initialData ? 'Edit Patient Details' : 'Add New Patient'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-1.5 rounded-full hover:bg-slate-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name *</label>
                            <input
                                type="text"
                                name="first_name"
                                required
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name *</label>
                            <input
                                type="text"
                                name="last_name"
                                required
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email <span className="text-slate-400 font-normal">(Optional)</span></label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Address <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Medical History</label>
                        <textarea
                            name="medical_history"
                            rows="3"
                            value={formData.medical_history}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-4 flex justify-between items-center border-t border-slate-100 mt-6 text-sm">
                        {initialData ? (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex items-center px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Patient
                            </button>
                        ) : (
                            <div></div> // Spacer
                        )}
                        <div className="flex space-x-3">
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
                                {loading ? 'Saving...' : initialData ? 'Update Patient' : 'Save Patient'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddPatientModal;
