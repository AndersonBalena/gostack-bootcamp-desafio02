const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositorieId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repositorie ID.'});
  }

  return next();
}

app.use('/repositories/:id', validateRepositorieId);

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repositorie = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  }

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs, likes } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not exists.' });
  }
  console.log(likes);
  if (likes) {
    return response.json({ likes:  repositories[repositorieIndex].likes});
  }

  const repositorie = {
    id,
    url,
    title,
    techs
  }

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not exists.' });
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not exists.' });
  }

  repositories[repositorieIndex].likes++;

  return response.json({ likes:  repositories[repositorieIndex].likes});
});

module.exports = app;
