fetch('project.json')
  .then(response => response.json())
  .then(data => {
    const projectContainer = document.getElementById('project-container');
    data.projects.forEach(project => {
      const projectElement = document.createElement('div');
      projectElement.classList.add('project');
      projectElement.innerHTML = `
                <img src="${project.thumbnail}" alt="${project.name}">
                <div class="project-name">${project.name}</div>
            `;
      projectElement.addEventListener('click', () => {
        window.location.href = project.url;
      });
      projectContainer.appendChild(projectElement);
    });
  })
  .catch(error => console.error('Error loading projects:', error));