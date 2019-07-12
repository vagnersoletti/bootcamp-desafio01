const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let countReq = 0;

/**
 * Middleware global
 * Count amount requisitions
 */
server.use((req, res, next) => {
  countReq += 1;

  next();

  console.log(`O total de requisições foi: ${countReq}. `);
});

/**
 * Middleware local
 * Check id exists in array
 */
function checkProjectExistsArray(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project not found!" });
  }

  return next();
}

/**
 * Projects.
 */
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id: id, title: title, tasks: [] });

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExistsArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExistsArray, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id === id);

  projects.splice(index, 1);

  return res.send();
});

/**
 * Tasks.
 */
server.post("/projects/:id/tasks", checkProjectExistsArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
