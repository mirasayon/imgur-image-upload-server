import Express, { urlencoded, json } from "express";
import { uploadFile } from "./imgur.js";
import fileUpload from "express-fileupload";
import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

const __dirname = process.cwd();
const app = Express();
const temp_folder_path = join(__dirname, "temp");
if (!existsSync(temp_folder_path)) {
	await mkdir(temp_folder_path);
}

app.use(fileUpload());

const port = Number(process.env.PORT) || 3000;

const encoded = urlencoded({ extended: false });

app.use(encoded);
app.use(json());

app.get("/", (_req, reply) => {
	reply.send("Hello. Upload your images to the /upload path with post method");
});
app.post("/upload", async (req, reply) => {
	if (!req.files) {
		return reply.status(400).send("No files were uploaded.");
	}
	const image_ = req.files.sampleFile as fileUpload.UploadedFile;

	const uploadPath = join(__dirname, "temp", image_.name);
	await writeFile(uploadPath, image_.data);
	const image = await uploadFile(uploadPath);
	reply.json({ link: image.link });
	await unlink(uploadPath);
});

app.listen({ port: port }, () => {
	console.log(`Server started on http://localhost:${port}/`);
});
