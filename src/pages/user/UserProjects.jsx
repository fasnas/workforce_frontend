import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../services/AxiosInstance';
import { useNavigate } from 'react-router-dom';

const   UserProjects = () => {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getProjects = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axiosInstance.get("/getallactiveprojects");

      setProjects(response.data.projects);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">

      <h1 className="text-2xl font-bold mb-5">
        All Projects
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {projects.map((project) => (

          <div
            key={project._id}
            onClick={() => navigate(`/user/projects/${project._id}`)}
            className="border rounded-lg p-4 shadow"
          >

            <h2 className="text-xl font-semibold">
              {project.projectName}
            </h2>

            <p className="mt-2">
              {project.description}
            </p>

            <p className="mt-2">
              <strong>Status:</strong> {project.status}
            </p>

            <p className="mt-2">
              <strong>Supervisor:</strong>{" "}
              {project.supervisor?.name}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default UserProjects;