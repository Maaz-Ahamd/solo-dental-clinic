import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Search } from 'lucide-react';
import api from '../../api/axiosConfig';

const AddPaymentModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        appointment_id: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Credit Card',
        status: 'Completed'
    });
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchAppointments();
        }
    }, [isOpen]);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post('/payments', formData);
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
            <div className="bg-white rounded-2xl shadow-soft w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto border border-slate-200/60 sm:p-0 animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Record New Payment</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-1.5 rounded-full hover:bg-slate-100">
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
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Appointment</label>
                        <select
                            required
                            value={formData.appointment_id}
                            onChange={(e) => setFormData({ ...formData, appointment_id: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        >
                            <option value="">Select an appointment...</option>
                            {appointments.map((apt) => (
                                <option key={apt.appointment_id} value={apt.appointment_id}>
                                    {apt.patient_first_name} {apt.patient_last_name} - {new Date(apt.appointment_date).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Date</label>
                        <input
                            type="date"
                            required
                            value={formData.payment_date}
                            onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Method</label>
                        <select
                            value={formData.payment_method}
                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        >
                            <option value="Cash">Cash</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Insurance">Insurance</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        >
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Failed">Failed</option>
                            <option value="Refunded">Refunded</option>
                        </select>
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
                            {loading ? 'Recording...' : 'Record Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddPaymentModal;
