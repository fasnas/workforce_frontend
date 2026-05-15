import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Briefcase,
  MapPin,
  User,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Building2,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Activity
} from 'lucide-react';
import axiosInstance from '../../services/AxiosInstance';

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const itemsPerPage = 9; // 3x3 grid

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/getallprojects');
      
      if (response.data.success) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    
    try {
      await api.delete(`/deleteproject/${selectedProject._id}`);
      await fetchProjects();
      setShowDeleteModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const getFilteredProjects = () => {
    let filtered = projects;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
    
    return {
      items: currentItems,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
      totalItems: filtered.length
    };
  };

  const { items: currentProjects, totalPages, totalItems } = getFilteredProjects();

  const getStatusConfig = (status) => {
    switch(status) {
      case 'pending':
        return { 
          label: 'Pending', 
          color: 'yellow', 
          bgColor: 'bg-yellow-100', 
          textColor: 'text-yellow-800',
          icon: Clock,
          borderColor: 'border-yellow-200'
        };
      case 'ongoing':
        return { 
          label: 'Ongoing', 
          color: 'blue', 
          bgColor: 'bg-blue-100', 
          textColor: 'text-blue-800',
          icon: Activity,
          borderColor: 'border-blue-200'
        };
      case 'completed':
        return { 
          label: 'Completed', 
          color: 'green', 
          bgColor: 'bg-green-100', 
          textColor: 'text-green-800',
          icon: CheckCircle,
          borderColor: 'border-green-200'
        };
      default:
        return { 
          label: 'Unknown', 
          color: 'gray', 
          bgColor: 'bg-gray-100', 
          textColor: 'text-gray-800',
          icon: AlertCircle,
          borderColor: 'border-gray-200'
        };
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const ProjectCard = ({ project }) => {
    const statusConfig = getStatusConfig(project.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
        {/* Status Bar */}
        <div className={`h-1.5 w-full ${statusConfig.bgColor.replace('100', '500')}`}></div>
        
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                {project.projectName}
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 inline-flex text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                  <StatusIcon size={12} className="mr-1" />
                  {statusConfig.label}
                </span>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  const dropdown = document.getElementById(`dropdown-${project._id}`);
                  dropdown?.classList.toggle('hidden');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical size={18} className="text-gray-500" />
              </button>
              <div
                id={`dropdown-${project._id}`}
                className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
              >
                <button
                  onClick={() => {
                    navigate(`/admin/projects/${project._id}`);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Eye size={16} />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => {
                    navigate(`/admin/projects/edit/${project._id}`);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>Edit Project</span>
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setShowDeleteModal(true);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Delete Project</span>
                </button>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <User size={14} className="mr-2 text-gray-400" />
              <span className="font-medium">Client:</span>
              <span className="ml-1">{project.clientName}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={14} className="mr-2 text-gray-400" />
              <span className="font-medium">Location:</span>
              <span className="ml-1 line-clamp-1">{project.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users size={14} className="mr-2 text-gray-400" />
              <span className="font-medium">Supervisor:</span>
              <span className="ml-1">{project.supervisor?.name || 'Not Assigned'}</span>
            </div>
          </div>

          {/* Description Preview */}
          {project.description && (
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {project.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={12} className="mr-1" />
              {formatDate(project.createdAt)}
            </div>
            <button
              onClick={() => navigate(`/admin/projects/${project._id}`)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View Details
              <ChevronRight size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const stats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'pending').length,
    ongoing: projects.filter(p => p.status === 'ongoing').length,
    completed: projects.filter(p => p.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage and track all construction projects</p>
        </div>
        <button
          onClick={() => navigate('/admin/projects/add')}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
        >
          <Plus size={18} />
          <span>New Project</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Projects</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <Briefcase size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending</p>
              <p className="text-3xl font-bold mt-1">{stats.pending}</p>
            </div>
            <Clock size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Ongoing</p>
              <p className="text-3xl font-bold mt-1">{stats.ongoing}</p>
            </div>
            <Activity size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Completed</p>
              <p className="text-3xl font-bold mt-1">{stats.completed}</p>
            </div>
            <CheckCircle size={32} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects by name, client, or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Status Filter Buttons */}
          <div className="flex space-x-2">
            {['all', 'pending', 'ongoing', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
          
          {/* Export Button */}
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : currentProjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Briefcase size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first project'}
          </p>
          {(searchTerm || statusFilter !== 'all') ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => navigate('/admin/projects/add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Create New Project</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} projects
          </div>
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                {[...Array(totalPages)].map((_, idx) => {
                  if (
                    idx + 1 === 1 ||
                    idx + 1 === totalPages ||
                    (idx + 1 >= currentPage - 1 && idx + 1 <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === idx + 1
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  } else if (
                    (idx + 1 === currentPage - 2 && currentPage > 3) ||
                    (idx + 1 === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return <span key={idx} className="px-2">...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 size={24} className="text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete Project
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedProject?.projectName}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;