import * as got from "got";
import fs from "node:fs";
import FormData from "form-data";
const anon_client_id = "f0ea04148a54268";

export async function uploadFile(path: fs.PathLike): Promise<imgur_res> {
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
	const image_data = JSON.parse(body).data as imgur_res;
	return image_data;
}

export type imgur_res = {
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
