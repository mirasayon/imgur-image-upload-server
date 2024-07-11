import express from "express";
import { uploadFile } from "./imgur.js";
import fileUpload from "express-fileupload";
import { unlink, writeFile } from "fs/promises";
import { join } from "node:path";
import { hostname, portnumber, work_path } from "./configs.js";

const app = express();
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (_req, reply) => {
	return reply.send("Hello. Upload your images to the /upload path with post method");
});
app.post("/upload", async (req, reply) => {
	if (!req.files) {
		return reply.status(400).send("No files were uploaded.");
	}
	const image_ = req.files.my_image as fileUpload.UploadedFile;
	const uploadPath = join(work_path, "temp", image_.name);
	await writeFile(uploadPath, image_.data);
	const uploaded_image = await uploadFile(uploadPath);
	await unlink(uploadPath);
	return reply.status(202).json({ link: uploaded_image.link });
});

app.listen({ port: portnumber, host: hostname }, () => console.info(`Server has been started: http://${hostname}:${portnumber}/`));
