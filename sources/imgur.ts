import * as got from "got";
import fs from "node:fs";
import FormData from "form-data";
import { imgur_response } from "./types.js";
const anon_client_id = "f0ea04148a54268";

export async function uploadFile(path: fs.PathLike): Promise<imgur_response> {
	const form = new FormData();
	const payload = fs.createReadStream(path);
	form.append("image", payload);
	const options: got.OptionsInit = {
		url: "https://api.imgur.com/3/upload",
		method: "POST",
		encoding: "utf-8",
		headers: { Authorization: `Client-ID ${anon_client_id}` },
		body: form,
	};
	const { statusCode, statusMessage, body } = (await got.default(options)) as got.Response<string>;
	if (statusCode !== 200) {
		console.error(`status code: ${statusCode}`);
		throw new Error(statusMessage);
	}
	const image_data = JSON.parse(body).data as imgur_response;
	return image_data;
}
