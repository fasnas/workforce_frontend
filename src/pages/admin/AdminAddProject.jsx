import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Building2, 
  User, 
  MapPin, 
  FileText, 
  Briefcase,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  Users,
  Calendar
} from 'lucide-react';
import axiosInstance from '../../services/AxiosInstance';

const AdminAddProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [loadingSupervisors, setLoadingSupervisors] = useState(true);
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    location: '',
    description: '',
    supervisor: '',
    status: 'pending'
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    setLoadingSupervisors(true);
    try {
      const response = await axiosInstance.get('/getallsupervisor');
      
      if (response.data.success) {
        setSupervisors(response.data.supervisors);
      }
    } catch (error) {
      console.error('Error fetching supervisors:', error);
      setErrorMessage('Failed to load supervisors list');
    } finally {
      setLoadingSupervisors(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    } else if (formData.projectName.length < 3) {
      newErrors.projectName = 'Project name must be at least 3 characters';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.supervisor) {
      newErrors.supervisor = 'Please select a supervisor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axiosInstance.post('/addproject', {
        projectName: formData.projectName,
        clientName: formData.clientName,
        location: formData.location,
        description: formData.description,
        supervisor: formData.supervisor,
        status: formData.status
      });

      if (response.data.success) {
        setSuccessMessage(`Project "${formData.projectName}" has been created successfully!`);
        
        // Reset form after 2 seconds and redirect
        setTimeout(() => {
          setFormData({
            projectName: '',
            clientName: '',
            location: '',
            description: '',
            supervisor: '',
            status: 'pending'
          });
          setSuccessMessage('');
          // Optional: Redirect to projects list
          navigate('/admin/projects');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to create project. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow', description: 'Project is in planning phase' },
    { value: 'ongoing', label: 'Ongoing', color: 'blue', description: 'Project is currently in progress' },
    { value: 'completed', label: 'Completed', color: 'green', description: 'Project has been completed' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'yellow';
      case 'ongoing': return 'blue';
      case 'completed': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Briefcase className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Project</h1>
            <p className="text-gray-600 mt-1">Create a new construction project and assign a supervisor</p>
          </div>
        </div>
      </div>

      

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.projectName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter project name"
                />
              </div>
              {errors.projectName && (
                <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>
              )}
            </div>

            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.clientName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter client name"
                />
              </div>
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter project location"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Supervisor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Supervisor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users size={18} className="text-gray-400" />
                </div>
                <select
                  name="supervisor"
                  value={formData.supervisor}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.supervisor ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    loadingSupervisors ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  }`}
                  disabled={loadingSupervisors}
                >
                  <option value="">Select a supervisor</option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor._id} value={supervisor._id}>
                      {supervisor.name} - {supervisor.email}
                    </option>
                  ))}
                </select>
                {loadingSupervisors && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Loader size={18} className="text-gray-400 animate-spin" />
                  </div>
                )}
              </div>
              {errors.supervisor && (
                <p className="mt-1 text-sm text-red-600">{errors.supervisor}</p>
              )}
              {!loadingSupervisors && supervisors.length === 0 && (
                <p className="mt-2 text-sm text-yellow-600 flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span>No supervisors available. Please add a supervisor first.</span>
                </p>
              )}
            </div>

            {/* Project Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Status
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statusOptions.map((status) => {
                  const isSelected = formData.status === status.value;
                  return (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: status.value }))}
                      className={`relative p-3 border-2 rounded-lg text-left transition-all ${
                        isSelected
                          ? `border-${status.color}-500 bg-${status.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full bg-${status.color}-500`}></div>
                        <span className={`font-medium ${
                          isSelected ? `text-${status.color}-700` : 'text-gray-900'
                        }`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{status.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter project description (optional)"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Calendar className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-blue-900">Project Information</p>
                  <ul className="mt-2 space-y-1 text-sm text-blue-800">
                    <li>• Once created, the assigned supervisor will be notified</li>
                    <li>• Project status can be updated as work progresses</li>
                    <li>• You can assign multiple projects to the same supervisor</li>
                    <li>• All project updates will be tracked automatically</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!loadingSupervisors && supervisors.length === 0)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Project...</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
        {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3 animate-fade-in">
          <CheckCircle className="text-green-600 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-green-800">{successMessage}</p>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-green-600">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-red-800">{errorMessage}</p>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-red-600">
            <X size={18} />
          </button>
        </div>
      )}
      </div>

      {/* Recent Projects Preview (Optional) */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
            <p>Assign the right supervisor based on project expertise</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
            <p>Keep project descriptions detailed for better tracking</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></div>
            <p>Update project status regularly for accurate reporting</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
            <p>You can add multiple projects at once using bulk upload</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProject;