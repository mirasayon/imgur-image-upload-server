import express, { urlencoded, json } from "express";
import { uploadFile } from "./imgur.js";
import * as nodeFS from "node:fs/promises";
import * as node_process from "node:process";
import fileUpload from "express-fileupload";

const __dirname = node_process.cwd();
const app = express();

app.use(fileUpload());

const PORT = Number(process.env.PORT) || 3000;

app.set("view engine", "ejs");
app.set("views", "views");

const encoded = urlencoded({ extended: false });

app.use(encoded);
app.use(json());

app.get("/", (_req, reply) => {
	reply.render("index.ejs");
});

app.post("/upload", async (request, response) => {
	if (!request.files) {
		return response.status(400).send("No files were uploaded.");
	}
	const sampleFile = request.files.sampleFile as fileUpload.UploadedFile;

	const uploadPath = `${__dirname}/temp/${sampleFile.name}`;
	const uploadPathfs = `./temp/${sampleFile.name}`;
	await nodeFS.writeFile(uploadPathfs, sampleFile.data);
	const image = await uploadFile(uploadPath);
	response.render("uploaded.ejs", { link: image.link });
	await nodeFS.unlink(uploadPath);
});

app.listen({ port: PORT }, () => {
	console.log(`Server started on http://localhost:${PORT}/`);
});

