const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function verifyRepositoryExists (request, response, next) {
  const { id } = request.params

  const repositoryExists = repositories.find(repository => repository.id === id);
  
  if(!repositoryExists) {
    return response.status(404).json({ error: 'Repository not found'})
  }

  const repositoryIndex = repositories.filter(repository => repository.id === id);
  if(!repositoryIndex[0]) {
    return response.status(404).json({ error: 'Repository not found'})
  }

  request.repository = repositoryIndex[0]

  return next()
}

app.get("/repositories", (request, response) => {
  const AllRepositories = repositories.map(repository => repository)

  request.AllRepositories = AllRepositories

  return response.json(AllRepositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  request.repository = repository

  return response.status(201).json(repository);
});

app.put("/repositories/:id", verifyRepositoryExists, (request, response) => {
  const { title, url, techs } = request.body;
  const { repository } = request

  repository.title = title
  repository.url = url
  repository.techs = techs

  return response.json(repository);
});

app.delete("/repositories/:id", verifyRepositoryExists, (request, response) => {
  const { repository } = request;

  const repositoryIndex = repositories.indexOf(repository);

  if (repositoryIndex === -1) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", verifyRepositoryExists, (request, response) => {
  const { repository } = request

  repository.likes++

  return response.json(repository);
});

module.exports = app;
