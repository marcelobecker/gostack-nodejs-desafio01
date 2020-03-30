const express = require("express");
const server = express();
server.use(express.json());

let count = 0;
let projects = [];

function countCalls(req, res, next) {
  count++;
  console.log(`Número de vezes que a aplicação foi executada: ${count}`);
  return next();
}

server.use(countCalls);

function checkBodyIdExist(req, res, next) {
  if (req.body.id) {
    const project = projects.find(r => r.id === req.body.id) || {};
    if (project !== {}) {
      req.project = project;
      return next();
    }
  }
  return res.status(400).json({ error: "Projeto não encontrado!" });
}

function checkBodyTitleExist(req, res, next) {
  if (!req.body.title) {
    return res
      .status(400)
      .json({ error: "Titulo do Projeto não foi informado!" });
  }
  return next();
}

function checkParamsIdExist(req, res, next) {
  if (!req.params.id) {
    return res.status(400).json({
      error: "Id do projeto não foi informado para esta tarefa!"
    });
  } else {
    const idx = projects.findIndex(r => r.id === req.params.id);
    if (idx === -1) {
      return res
        .status(400)
        .json({ error: "Projeto do Id informado não existe!" });
    } else {
      req.idx = idx;
    }
  }
  return next();
}

server.post("/projects", checkBodyIdExist, checkBodyTitleExist, (req, res) => {
  const newProject = {
    id: req.body.id,
    title: req.body.title,
    tasks: []
  };
  projects.push(newProject);
  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put(
  "/projects/:id",
  checkParamsIdExist,
  checkBodyTitleExist,
  (req, res) => {
    projects[req.idx].title = req.body.title;
    return res.json(projects);
  }
);

server.delete("/projects/:id", checkParamsIdExist, (req, res) => {
  projects.splice(req.idx, 1);
  return res.send();
});

server.post(
  "/projects/:id/tasks",
  checkParamsIdExist,
  checkBodyTitleExist,
  (req, res) => {
    projects[req.idx].tasks.push(req.body.title);
    return res.json(projects);
  }
);

server.listen(3001);
