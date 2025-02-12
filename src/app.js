const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title || !url || !techs) return response.status(404).json({
    message: "Parameters not found"
  });

  const repositoryCreated = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repositoryCreated);

  return response.status(201).json(repositoryCreated);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({
      message: "Repository not found."
    });
  }

  if (title) repositories[repositoryIndex].title = title;
  if (url) repositories[repositoryIndex].url = url;
  if (techs) repositories[repositoryIndex].techs = techs;

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({
      message: "Repository not found."
    });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({
      message: "Repository not found."
    });
  }

  repositories[repositoryIndex].likes += 1;

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
