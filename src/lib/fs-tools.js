import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const mediasJSONPath = join(dataFolderPath, "medias.json");

export const getMedias = () => readJSON(mediasJSONPath);
export const writeMedias = (mediasArray) =>
  writeJSON(mediasJSONPath, mediasArray);

export const getComments = () => readJSON(commentsJSONPath);
export const writeComments = (commentsArray) =>
  writeJSON(commentsJSONPath, commentsArray);
