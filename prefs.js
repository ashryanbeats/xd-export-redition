const fs = require("uxp").storage.localFileSystem;
const { xdLogMessages } = require("./strings.js");

async function createPrefs(prefsObj = { showNoFolderMessage: true }) {
  const prefsString = JSON.stringify(prefsObj);
  const dataFolder = await fs.getDataFolder();
  const prefsFile = await dataFolder.createFile("prefs.json", {
    overwrite: true
  });

  return await prefsFile.write(prefsString);
}

async function getPrefs() {
  const dataFolder = await fs.getDataFolder();

  try {
    const prefsFile = await dataFolder.getEntry("prefs.json");
    console.log("prefs gotten");

    return JSON.parse(await prefsFile.read());
  } catch (err) {
    switch (err.message) {
      case xdLogMessages.errorFileNotFound:
        return createPrefs();

      default:
        console.log(err);
    }
  }
}

async function togglePrefs() {
  console.log("togglePrefs");

  const prefsObj = await getPrefs();
  prefsObj.showNoFolderMessage = !prefsObj.showNoFolderMessage;

  console.log(prefsObj);

  return createPrefs(prefsObj);
}

module.exports = {
  getPrefs,
  togglePrefs
};
