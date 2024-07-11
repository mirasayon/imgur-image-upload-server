import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
export const work_path = process.cwd();
const temp_folder_path = join(work_path, "temp");
if (!existsSync(temp_folder_path)) {
	await mkdir(temp_folder_path);
}
export const portnumber = Number(process.env.PORT);
export const hostname = process.env.HOST!;
