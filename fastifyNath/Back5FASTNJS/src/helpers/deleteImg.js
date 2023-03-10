import fs from "fs-extra";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const deleteImg = async (nameImage) => {
  promisify(fs.unlink)(path.resolve(__dirname, "../storage/imgs", nameImage));
};
