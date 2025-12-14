import React, { useEffect, useState } from 'react';
import { Plus, Search, User } from 'lucide-react';
import api from '../api/axiosConfig';
import AddPatientModal from './Modals/AddPatientModal';

const PatientManager = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPatients = async () => {
        try {
            const response = await api.get('/patients');
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(patient => 
        patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.phone && patient.phone.includes(searchTerm))
    );

    const handleRowClick = (patient) => {
        setSelectedPatient(patient);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPatient(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Patient Manager</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Patient
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Medical History</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-slate-500">Loading patients...</td>
                                </tr>
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-slate-500">No patients found.</td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <tr 
                                        key={patient.patient_id} 
                                        onClick={() => handleRowClick(patient)}
                                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div className="text-sm font-medium text-slate-900">
                                                    {patient.first_name} {patient.last_name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {patient.phone || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                                            {patient.medical_history || 'No history recorded'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                            #{patient.patient_id}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddPatientModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onPatientAdded={fetchPatients}
                initialData={selectedPatient}
            />
        </div>
    );
};

export default PatientManager;
