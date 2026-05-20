import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/AxiosInstance';

const SingleProject = () => {

  const { id } = useParams();

  const [project, setProject] = useState(null);

  const [timeLogs, setTimeLogs] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    workDate: '',
    logHours: '',
    description: '',
  });

  // Get Single Project
  const getProject = async () => {

    try {

      const response = await axiosInstance.get(`/project/${id}`);

      setProject(response.data.project);

    } catch (error) {

      console.log(error);

    }
  };

  // Get Time Logs
  const getTimeLogs = async () => {

    try {

      const response = await axiosInstance.get(
        `/gettimelogprojectwise/${id}`
      );
       console.log("responsetimelog",response)
      setTimeLogs(response.data.timeLogs);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    getProject();
    getTimeLogs();

  }, [id]);

  // Handle Input Change
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // Submit Time Log
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await axiosInstance.post(
        "/createtimelog",
        {
          projectId: id,
          logHours: Number(formData.logHours),
          workDate: formData.workDate,
          description: formData.description,
        }
      );

      console.log(response.data);

      alert("Time Log Created Successfully");

      // Refresh Logs
      getTimeLogs();

      // Close Modal
      setShowModal(false);

      // Clear Form
      setFormData({
        workDate: '',
        logHours: '',
        description: '',
      });

    } catch (error) {

      console.log(error.response?.data || error);

      alert(
        error.response?.data?.message || "Something went wrong"
      );

    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">

      {/* Project Details */}
      <div className="border rounded-lg p-5 shadow">

        <h1 className="text-3xl font-bold">
          {project.projectName}
        </h1>

        <p className="mt-3">
          {project.description}
        </p>

        <p className="mt-3">
          <strong>Status:</strong> {project.status}
        </p>

        <p className="mt-3">
          <strong>Supervisor:</strong>{" "}
          {project.supervisor?.name}
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="mt-5 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Log Time
        </button>

      </div>

      {/* Time Log History */}
      <div className="mt-8 border rounded-lg p-5 shadow">

        <h2 className="text-2xl font-bold mb-5">
          Time Log History
        </h2>

        {timeLogs.length === 0 ? (

          <p>No Time Logs Found</p>

        ) : (

          <div className="space-y-3">

            {timeLogs.map((log) => (

              <div
                key={log._id}
                className="border p-3 rounded flex justify-between"
              >

                <p>
                  {new Date(log.workDate).toLocaleDateString()}
                </p>

                <p>
                  {log.logHours} Hours
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Modal */}
      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white p-5 rounded-lg w-[400px]">

            <h2 className="text-2xl font-bold mb-4">
              Log Time
            </h2>

            <form onSubmit={handleSubmit}>

              {/* Work Date */}
              <div className="mb-3">

                <label className="block mb-1">
                  Work Date
                </label>

                <input
                  type="date"
                  name="workDate"
                  value={formData.workDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full border p-2 rounded"
                  required
                />

              </div>

              {/* Log Hours */}
              <div className="mb-3">

                <label className="block mb-1">
                  Log Hours
                </label>

                <input
                  type="number"
                  name="logHours"
                  value={formData.logHours}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  min="1"
                  required
                />

              </div>

              {/* Description */}
              <div className="mb-3">

                <label className="block mb-1">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  rows="4"
                  required
                />

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-5">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default SingleProject;