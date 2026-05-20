import React, { useState } from 'react';
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
  Calendar
} from 'lucide-react';

import axiosInstance from '../../services/AxiosInstance';

const SupervisorPotentialProjectAdd = () => {

  const navigate = useNavigate();

  // Local User
  const localUser = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    location: '',
    description: '',
    status: 'pending'
  });

  const [errors, setErrors] = useState({});

  const [successMessage, setSuccessMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  // Handle Input Change
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Remove Error While Typing
    if (errors[name]) {

      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));

    }
  };

  // Validate Form
  const validateForm = () => {

    const newErrors = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit Form
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    setErrorMessage('');

    setSuccessMessage('');

    try {

      const response = await axiosInstance.post(
        "/addproject",
        {
          projectName: formData.projectName,
          clientName: formData.clientName,
          location: formData.location,
          description: formData.description,

          // Supervisor From LocalStorage
          supervisor: localUser._id,

          // Default Status
          status: "pending"
        }
      );

      console.log(response.data);

      setSuccessMessage(
        `Project "${formData.projectName}" created successfully`
      );

      // Reset Form
      setFormData({
        projectName: '',
        clientName: '',
        location: '',
        description: '',
        status: 'pending'
      });

      // Redirect
      setTimeout(() => {
        navigate("/supervisor/projects");
      }, 2000);

    } catch (error) {

      console.log(error);

      setErrorMessage(
        error.response?.data?.message ||
        "Failed to create project"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="max-w-5xl mx-auto p-5">

      {/* Header */}
      <div className="mb-6">

        <div className="flex items-center gap-3">

          <div className="p-2 bg-blue-100 rounded-lg">
            <Briefcase className="text-blue-600" size={24} />
          </div>

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              Add New Project
            </h1>

            <p className="text-gray-600 mt-1">
              Create a new potential project request
            </p>

          </div>

        </div>

      </div>

     
      {/* Form */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">

        <form onSubmit={handleSubmit}>

          <div className="p-6 space-y-6">

            {/* Project Name */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Building2 size={18} className="text-gray-400" />
                </div>

                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.projectName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

              </div>

              {errors.projectName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.projectName}
                </p>
              )}

            </div>

            {/* Client Name */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User size={18} className="text-gray-400" />
                </div>

                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.clientName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

              </div>

              {errors.clientName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.clientName}
                </p>
              )}

            </div>

            {/* Location */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MapPin size={18} className="text-gray-400" />
                </div>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter project location"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

              </div>

              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location}
                </p>
              )}

            </div>

            {/* Status */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Status
              </label>

              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 border border-yellow-300">
                Potential Project
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Newly created projects will always start with pending status.
              </p>

            </div>

            {/* Description */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <div className="relative">

                <div className="absolute top-3 left-3">
                  <FileText size={18} className="text-gray-400" />
                </div>

                <textarea
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter project description"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>
               {/* Success Message */}
      {successMessage && (

        <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-start">

          <div className="flex gap-3">

            <CheckCircle className="text-green-600 mt-1" size={20} />

            <p className="text-green-700">
              {successMessage}
            </p>

          </div>

          <button onClick={() => setSuccessMessage('')}>
            <X size={18} />
          </button>

        </div>

      )}

      {/* Error Message */}
      {errorMessage && (

        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-start">

          <div className="flex gap-3">

            <AlertCircle className="text-red-600 mt-1" size={20} />

            <p className="text-red-700">
              {errorMessage}
            </p>

          </div>

          <button onClick={() => setErrorMessage('')}>
            <X size={18} />
          </button>

        </div>

      )}


            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

              <div className="flex gap-3">

                <Calendar
                  className="text-blue-600 mt-1"
                  size={20}
                />

                <div>

                  <p className="font-medium text-blue-900">
                    Project Information
                  </p>

                  <ul className="mt-2 space-y-1 text-sm text-blue-800">

                    <li>
                      • Project will be submitted for admin approval
                    </li>

                    <li>
                      • Status will remain pending initially
                    </li>

                    <li>
                      • Current logged-in supervisor will be assigned automatically
                    </li>

                    <li>
                      • Admin can later approve and activate project
                    </li>

                  </ul>

                </div>

              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">

            <button
              type="button"
              onClick={() => navigate("/supervisor/projects")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >

              {loading ? (

                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
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

      </div>

    </div>
  );
};

export default SupervisorPotentialProjectAdd;