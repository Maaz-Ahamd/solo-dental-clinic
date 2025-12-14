import React, { useEffect, useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, Edit2, Trash2 } from 'lucide-react';
import api from '../api/axiosConfig';
import BookAppointmentModal from './Modals/BookAppointmentModal';
import EditAppointmentModal from './Modals/EditAppointmentModal';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await api.delete(`/appointments/${id}`);
                fetchAppointments();
            } catch (error) {
                console.error("Error deleting appointment:", error);
                alert("Failed to delete appointment");
            }
        }
    };

    const handleEdit = (appointment) => {
        setSelectedAppointment(appointment);
        setIsEditModalOpen(true);
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Book Appointment
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Dentist</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Room</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-slate-500">Loading appointments...</td>
                                </tr>
                            ) : appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-slate-500">No appointments scheduled.</td>
                                </tr>
                            ) : (
                                appointments.map((app) => {
                                    const { date, time } = formatDateTime(app.appointment_date);
                                    return (
                                        <tr key={app.appointment_id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center text-sm font-medium text-slate-900">
                                                        <CalendarIcon className="h-3 w-3 mr-1 text-slate-400" />
                                                        {date}
                                                    </div>
                                                    <div className="flex items-center text-sm text-slate-500 mt-1">
                                                        <Clock className="h-3 w-3 mr-1 text-slate-400" />
                                                        {time}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                {app.patient_first_name} {app.patient_last_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {app.dentist_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {app.room_name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => handleEdit(app)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(app.appointment_id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <BookAppointmentModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAppointmentBooked={fetchAppointments} 
            />

            <EditAppointmentModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onAppointmentUpdated={fetchAppointments}
                appointment={selectedAppointment}
            />
        </div>
    );
};

export default Appointments;
