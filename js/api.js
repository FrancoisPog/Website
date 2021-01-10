export function fetchProjects() {
  return new Promise((resolve, reject) => {
    fetch(`./data/projects.json`, { mode: "cors" })
      .then((data) => data.json().then(resolve).catch(reject))
      .catch(reject);
  });
}

export function fetchSkills() {
  return new Promise((resolve, reject) => {
    fetch(`./data/skills.json`, { mode: "cors" })
      .then((data) => data.json().then(resolve).catch(console.error))
      .catch(console.error);
  });
}
