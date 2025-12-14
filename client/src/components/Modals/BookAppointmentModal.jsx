import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import api from '../../api/axiosConfig';

const BookAppointmentModal = ({ isOpen, onClose, onAppointmentBooked }) => {
    const [patients, setPatients] = useState([]);
    const [treatments, setTreatments] = useState([]);
    const [dentists, setDentists] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [assistants, setAssistants] = useState([]);
    
    const [formData, setFormData] = useState({
        patient_id: '',
        dentist_id: '',
        room_id: '',
        assistant_id: '',
        appointment_date: '',
        status: 'Scheduled'
    });
    const [selectedTreatmentId, setSelectedTreatmentId] = useState(''); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [patRes, treatRes, dentRes, roomRes, assistRes] = await Promise.all([
                        api.get('/patients'),
                        api.get('/treatments'),
                        api.get('/dentists'),
                        api.get('/rooms'),
                        api.get('/assistants')
                    ]);
                    setPatients(patRes.data);
                    setTreatments(treatRes.data);
                    setDentists(dentRes.data);
                    setRooms(roomRes.data);
                    setAssistants(assistRes.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    if (!isOpen) return null;

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
                // Ensure IDs are integers
                patient_id: parseInt(formData.patient_id),
                dentist_id: parseInt(formData.dentist_id),
                room_id: parseInt(formData.room_id),
                assistant_id: formData.assistant_id ? parseInt(formData.assistant_id) : null
            };

            await api.post('/appointments', payload);
            
            onAppointmentBooked();
            onClose();
            // Reset form
            setFormData({
                patient_id: '',
                dentist_id: '',
                room_id: '',
                assistant_id: '',
                appointment_date: '',
                status: 'Scheduled'
            });
            setSelectedTreatmentId('');
        } catch (error) {
            console.error("Error booking appointment:", error);
            const errorMessage = error.response?.data?.details || error.message || "Failed to book appointment";
            alert(`Error: ${errorMessage}`); 
        } finally {
            setLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-2xl shadow-soft w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto border border-slate-200/60 animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Book Appointment</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-1.5 rounded-full hover:bg-slate-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Patient Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Patient</label>
                        <select
                            name="patient_id"
                            required
                            value={formData.patient_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        >
                            <option value="">Select a Patient</option>
                            {patients.map(p => (
                                <option key={p.patient_id} value={p.patient_id}>
                                    {p.first_name} {p.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dentist Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Dentist</label>
                        <select
                            name="dentist_id"
                            required
                            value={formData.dentist_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        >
                            <option value="">Select a Dentist</option>
                            {dentists.map(d => (
                                <option key={d.dentist_id} value={d.dentist_id}>
                                    {d.name} ({d.specialization})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Assistant Selection (New) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Assistant (Optional)</label>
                        <select
                            name="assistant_id"
                            value={formData.assistant_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        >
                            <option value="">Select an Assistant</option>
                            {assistants.map(a => (
                                <option key={a.assistant_id} value={a.assistant_id}>
                                    {a.name} ({a.shift})
                                </option>
                            ))}
                        </select>
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

                    {/* Treatment Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Treatment (Intended)</label>
                        <select
                            value={selectedTreatmentId}
                            onChange={(e) => setSelectedTreatmentId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        >
                            <option value="">Select a Treatment</option>
                            {treatments.map(t => (
                                <option key={t.treatment_id} value={t.treatment_id}>
                                    {t.name} (${t.price})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-1">Note: This is for reference.</p>
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Date & Time (30-min slots)</label>
                        <input
                            type="datetime-local"
                            name="appointment_date"
                            required
                            step="1800" 
                            value={formData.appointment_date}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                        <p className="text-xs text-slate-500 mt-1">Please select time in 30-minute intervals (e.g., 9:00, 9:30).</p>
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
                            {loading ? 'Booking...' : 'Book Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default BookAppointmentModal;
