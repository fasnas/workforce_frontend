import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import { useNavigate } from 'react-router-dom';

const SupervisorPotentialProject = () => {

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate=useNavigate()

  // Get Pending Projects
  const getPendingProjects = async () => {

    try {

      const response = await axiosInstance.get(
        "/getallpendigprojects"
      );

      setProjects(response.data.projects);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    getPendingProjects();
  }, []);

  if (loading) {
    return (
      <div className="p-5 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-5">

      {/* Heading */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Potential Projects
        </h1>

        <p className="text-gray-500 mt-1">
          All potential projects waiting for approval
        </p>

      </div>

      {/* Empty */}
      {projects.length === 0 ? (

        <div className="bg-white border rounded-xl p-10 text-center shadow-sm">

          <h2 className="text-xl font-semibold text-gray-700">
            No Pending Projects
          </h2>

          <p className="text-gray-500 mt-2">
            There are currently no pending projects.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {projects.map((project) => (

            <div
              key={project._id}
              className="bg-white border rounded-xl p-5 shadow hover:shadow-md transition"
                onClick={() => navigate(`/supervisor/potentialproject/${project._id}`)}

            >

              {/* Project Name */}
              <h2 className="text-2xl font-bold text-gray-800">
                {project.projectName}
              </h2>

              {/* Client */}
              <div className="mt-4">

                <p className="text-sm text-gray-500">
                  Client Name
                </p>

                <p className="font-medium text-gray-800">
                  {project.clientName}
                </p>

              </div>

              {/* Location */}
              <div className="mt-4">

                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="font-medium text-gray-800">
                  {project.location}
                </p>

              </div>

              {/* Description */}
              <div className="mt-4">

                <p className="text-sm text-gray-500">
                  Description
                </p>

                <p className="text-gray-700">
                  {project.description || "No Description"}
                </p>

              </div>

              {/* Supervisor */}
              <div className="mt-4">

                <p className="text-sm text-gray-500">
                  Supervisor
                </p>

                <p className="font-medium text-gray-800">
                  {project.supervisor?.name}
                </p>

              </div>

              {/* Status */}
              <div className="mt-5">

                <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700 border border-yellow-300">
                  Potential Project
                </span>

              </div>

              {/* Created Date */}
              <div className="mt-5 text-sm text-gray-400">

                Created:
                {" "}
                {new Date(project.createdAt).toLocaleDateString()}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default SupervisorPotentialProject;