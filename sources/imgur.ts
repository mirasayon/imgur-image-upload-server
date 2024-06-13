import * as got from "got";
import { createReadStream } from "node:fs";
import FormData from "form-data";
import type { PathLike } from "node:fs";

const default_client_id = "f0ea04148a54268";

export async function uploadFile(path: PathLike) {
	const form = new FormData();
	const payload = createReadStream(path);
	if (!path) {
		return console.error("No file to upload");
	}
	form.append("image", payload);

	const options: type_option = {
		url: "https://api.imgur.com/3/upload",
		method: "POST",
		encoding: "utf8",
		headers: { Authorization: `Client-ID ${default_client_id}` },
		body: form,
	};
	const { statusCode, statusMessage, body: body_ } = await _request(options);
	if (statusCode !== 200) {
		console.error(`status code: ${statusCode}`);
		throw new Error(statusMessage);
	}
	return JSON.parse(body_).data;
}
async function _request(options: type_option): Promise<got.Response<string>> {
	const got_ = (await got.default(options as got.OptionsInit)) as got.Response<string>;
	return got_;
}

type type_option = {
	url: string;
	method: string;
	encoding: string;
	headers: {
		Authorization: string;
	};
	body: FormData;
};

