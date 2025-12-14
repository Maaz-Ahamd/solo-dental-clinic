import React, { useEffect, useState } from 'react';
import { Users, Calendar, DollarSign, Activity } from 'lucide-react';
import api from '../api/axiosConfig';
import AddPatientModal from './Modals/AddPatientModal';
import BookAppointmentModal from './Modals/BookAppointmentModal';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        appointmentsToday: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch all data locally for summary (in a real app, backend would provide summary endpoints)
                const [patientsRes, appointmentsRes, paymentsRes] = await Promise.all([
                    api.get('/patients'),
                    api.get('/appointments'),
                    api.get('/payments'),
                ]);

                const patients = patientsRes.data;
                const appointments = appointmentsRes.data;
                const payments = paymentsRes.data;

                // Calculate Appointments Today
                const today = new Date().toISOString().split('T')[0];
                const todayAppointments = appointments.filter(app => {
                    if (!app.appointment_date) return false;
                    return app.appointment_date.split('T')[0] === today;
                }).length;

                // Calculate Total Revenue
                const revenue = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

                setStats({
                    totalPatients: patients.length,
                    appointmentsToday: todayAppointments,
                    totalRevenue: revenue,
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Refresh stats when actions are performed
    const handlePatientAdded = () => {
        // Re-fetch stats or simpler: just reload page or increment local count
        // For now, let's just re-run the effect dependency if we had one, or simpler:
        window.location.reload(); 
    };

    const handleAppointmentBooked = () => {
        window.location.reload();
    };

    const cards = [
        { name: 'Total Patients', value: stats.totalPatients, icon: Users },
        { name: 'Appointments Today', value: stats.appointmentsToday, icon: Calendar },
        { name: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign },
    ];

    if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-2">Welcome back, Dr. Hamza. Here is what's happening today.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.name} className="bg-white rounded-xl shadow-soft p-6 border border-slate-200/60 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Icon className="h-16 w-16 text-slate-800 transform rotate-12" />
                            </div>
                            <div className="relative">
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">{card.name}</p>
                                <p className="text-3xl font-semibold tracking-tight text-slate-900">{card.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-xl shadow-soft p-8 border border-slate-200/60">
                <div className="flex items-center mb-6">
                    <Activity className="h-5 w-5 text-slate-800 mr-2" />
                    <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Quick Actions</h2>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <button 
                        onClick={() => setIsPatientModalOpen(true)}
                        className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left group"
                     >
                        <span className="font-medium text-slate-900 block group-hover:text-blue-600 transition-colors">Add New Patient</span>
                        <span className="text-sm text-slate-500 mt-1 block">Register a new patient to the system</span>
                     </button>
                     <button 
                        onClick={() => setIsAppointmentModalOpen(true)}
                        className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left group"
                     >
                        <span className="font-medium text-slate-900 block group-hover:text-blue-600 transition-colors">Book Appointment</span>
                        <span className="text-sm text-slate-500 mt-1 block">Schedule a visit for an existing patient</span>
                     </button>
                </div>
            </div>

            <AddPatientModal 
                isOpen={isPatientModalOpen} 
                onClose={() => setIsPatientModalOpen(false)} 
                onPatientAdded={handlePatientAdded}
            />

            <BookAppointmentModal 
                isOpen={isAppointmentModalOpen} 
                onClose={() => setIsAppointmentModalOpen(false)} 
                onAppointmentBooked={handleAppointmentBooked}
            />
        </div>
    );
};

export default Dashboard;
