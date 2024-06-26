import * as got from "got";
import { createReadStream } from "node:fs";
import FormData from "form-data";
import type { PathLike } from "node:fs";

const default_client_id = "f0ea04148a54268";

export async function uploadFile(path: PathLike) {
	const form = new FormData();
	const payload = createReadStream(path);
	if (!path) {
		throw new Error("No file to upload");
	}
	form.append("image", payload);

	const options: got.OptionsInit = {
		url: "https://api.imgur.com/3/upload",
		method: "POST",
		encoding: "utf8",
		headers: { Authorization: `Client-ID ${default_client_id}` },
		body: form,
	};
	const { statusCode, statusMessage, body } = (await got.default(options)) as got.Response<string>;
	if (statusCode !== 200) {
		console.error(`status code: ${statusCode}`);
		throw new Error(statusMessage);
	}

	const res = JSON.parse(body).data as imgur_res;
	console.info(JSON.parse(body).data);
	return res;
}

type imgur_res = {
	id: string;
	deletehash: string;
	account_id: null;
	account_url: null;
	ad_type: null;
	ad_url: null;
	title: null;
	description: null | string;
	name: string;
	type: string;
	width: number;
	height: number;
	size: number;
	views: number;
	section: null;
	vote: null;
	bandwidth: number;
	animated: boolean;
	favorite: boolean;
	in_gallery: boolean;
	in_most_viral: boolean;
	has_sound: boolean;
	is_ad: boolean;
	nsfw: null;
	link: string;
	tags: [];
	datetime: number;
	mp4: string;
	hls: string;
};
