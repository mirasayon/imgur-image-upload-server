import express from "express";
import { uploadFile } from "./imgur.js";
import fileUpload from "express-fileupload";
import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
const work_path = process.cwd();
const app = express();
const temp_folder_path = join(work_path, "temp");
if (!existsSync(temp_folder_path)) {
	await mkdir(temp_folder_path);
}
app.use(fileUpload());
const port = Number(process.env.PORT);
const host = process.env.HOST!;

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

app.listen({ port: port, host: host }, () => console.info(`Server has been started: http://${host}:${port}/`));
