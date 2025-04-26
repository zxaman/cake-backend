import fs from "fs";

/**
 *
 * @param {string} localPath
 * @description Removed the local file from the local file system based on the file path
 */
export const removeLocalFile = (localPath) => {
  fs.unlink(localPath, (err) => {
    if (err) console.error("Error while removing local files: ", err);
    else {
      console.log("Removed local: ", localPath);
    }
  });
};
