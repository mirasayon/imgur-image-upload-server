import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
const work_path = process.cwd();
const build_path = join(work_path, "build");
if (existsSync(build_path)) {
	await rm(build_path, { recursive: true, force: true });
	await mkdir(build_path);
}
