const csv = require("csvtojson");

const { readdir, writeFile } = require("fs/promises");

(async function () {
  const sourcePath = `./src/data/csv`;

  try {
    const files = await readdir(sourcePath);
    for await (const fileNm of files) {
      const newFileName = fileNm.replace("csv", "json");
      const targetPath = `./src/data/json/${newFileName}`;
      try {
        const json = await csv().fromFile(`${sourcePath}/${fileNm}`);
        await writeFile(targetPath, JSON.stringify(json));
      } catch (err) {
        // When a request is aborted - err is an AbortError
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
