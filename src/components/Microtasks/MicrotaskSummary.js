import React from 'react'

const ProjectSummary = ({ project }) => {
  if (project.missionType === undefined) { console.log(project) }

  return (
    <div className="card z-depth-0 project-summary">
      <div className="card-content grey-text text-darken-3">
        <span className="card-title ">{project.title["es"]}</span>
        <p>Tipo: {project.missionType["es"]}</p>
      </div>
    </div>
  )
}

export default ProjectSummary