const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
	return response.json(repositories)
});

app.post("/repositories", (request, response) => {
	const { title, url, techs } = request.body

	const repository = { 
		id: uuid(),
		title,
		url, 
		techs,
		likes: 0
	}
	
	repositories.push(repository)

	return response.json(repository)
	
});

app.put("/repositories/:id", (request, response) => {
	const { id } = request.params

	const repoIndex = repositories.findIndex(repo => repo.id === id)

	if(repoIndex < 0) 
		return response.status(400).json({error: 'Project Not Found'})

	const { title, url, techs } = request.body

	const previousRepo = repositories[repoIndex]

	const project = {
		id, 
		title: title || previousRepo.title, 
		url: url || previousRepo.url, 
		techs: techs || previousRepo.techs,
		likes: previousRepo.likes	
	}

	repositories[repoIndex] = project

	return response.json(project)
});

app.delete("/repositories/:id", (request, response) => {
	const { id } = request.params

	const repoIndex = repositories.findIndex(repo => repo.id === id)

	if(repoIndex < 0) 
		return response.status(400).json({error: 'Project Not Found'})

	repositories.splice(repoIndex, 1)

	return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params

	const repoIndex = repositories.findIndex(repo => repo.id === id)

	if(repoIndex < 0) 
		return response.status(400).json({error: 'Project Not Found'})

	const previousRepo = repositories[repoIndex]

	const project = {
		...previousRepo,
		likes: previousRepo.likes + 1
	}

	repositories[repoIndex] = project

	return response.send(project)
	
});

module.exports = app;
