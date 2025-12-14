import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import api from '../../api/axiosConfig';

const EditAppointmentModal = ({ isOpen, onClose, onAppointmentUpdated, appointment }) => {
    const [rooms, setRooms] = useState([]);
    
    // We only need to edit specific fields supported by the backend:
    // appointment_date, status, room_id
    const [formData, setFormData] = useState({
        appointment_date: '',
        status: '',
        room_id: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Fetch rooms for the dropdown
            const fetchRooms = async () => {
                try {
                    const response = await api.get('/rooms');
                    setRooms(response.data);
                } catch (error) {
                    console.error("Error fetching rooms:", error);
                }
            };
            fetchRooms();

            if (appointment) {
                // Pre-fill form
                // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
                const date = new Date(appointment.appointment_date);
                // Adjust for local timezone offset if necessary, or just use toISOString().slice(0, 16) if dealing with UTC->Local correctly
                // A simple way to get local "YYYY-MM-DDTHH:mm" for the input:
                const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

                setFormData({
                    appointment_date: localISOTime,
                    status: appointment.status,
                    room_id: appointment.room_id || ''
                });
            }
        }
    }, [isOpen, appointment]);

    if (!isOpen || !appointment) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                room_id: parseInt(formData.room_id),
                appointment_date: new Date(formData.appointment_date).toISOString() // Send back as ISO
            };

            await api.put(`/appointments/${appointment.appointment_id}`, payload);
            
            onAppointmentUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating appointment:", error);
            alert("Failed to update appointment");
        } finally {
            setLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-2xl shadow-soft w-full max-w-md overflow-hidden border border-slate-200/60 animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Edit Appointment</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-1.5 rounded-full hover:bg-slate-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Read-Only Details */}
                    <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-2 text-sm text-slate-600 mb-4">
                        <p><span className="font-semibold text-slate-800">Patient:</span> {appointment.patient_first_name} {appointment.patient_last_name}</p>
                        <p><span className="font-semibold text-slate-800">Dentist:</span> {appointment.dentist_name}</p>
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Date & Time</label>
                        <input
                            type="datetime-local"
                            name="appointment_date"
                            required
                            step="1800" 
                            value={formData.appointment_date}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                    </div>

                    {/* Room Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Clinic Room</label>
                        <select
                            name="room_id"
                            required
                            value={formData.room_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        >
                            <option value="">Select a Room</option>
                            {rooms.map(r => (
                                <option key={r.room_id} value={r.room_id}>
                                    {r.room_name} ({r.room_type})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                        <select
                            name="status"
                            required
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="No Show">No Show</option>
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
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default EditAppointmentModal;
