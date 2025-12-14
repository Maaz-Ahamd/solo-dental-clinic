import React, { useEffect, useState } from 'react';
import { Plus, Search, Stethoscope, Pencil, Trash2 } from 'lucide-react';
import api from '../api/axiosConfig';
import AddTreatmentModal from './Modals/AddTreatmentModal';

const Treatments = () => {
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTreatments = async () => {
        try {
            const response = await api.get('/treatments');
            setTreatments(response.data);
        } catch (error) {
            console.error("Error fetching treatments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTreatments();
    }, []);

    const filteredTreatments = treatments.filter(treatment => 
        treatment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (treatment) => {
        setSelectedTreatment(treatment);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this treatment?')) {
            try {
                await api.delete(`/treatments/${id}`);
                fetchTreatments();
            } catch (error) {
                console.error("Error deleting treatment:", error);
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTreatment(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Manage Treatments</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Treatment
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search treatments..."
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Treatment Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-slate-500">Loading treatments...</td>
                                </tr>
                            ) : filteredTreatments.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-slate-500">No treatments found.</td>
                                </tr>
                            ) : (
                                filteredTreatments.map((treatment) => (
                                    <tr key={treatment.treatment_id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                                    <Stethoscope className="h-4 w-4" />
                                                </div>
                                                <div className="text-sm font-medium text-slate-900">
                                                    {treatment.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            ${treatment.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => handleEdit(treatment)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(treatment.treatment_id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddTreatmentModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onSuccess={fetchTreatments}
                initialData={selectedTreatment}
            />
        </div>
    );
};

export default Treatments;
