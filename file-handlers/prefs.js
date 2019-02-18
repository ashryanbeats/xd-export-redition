const application = require("application");
const { localFileSystem, errors } = require("uxp").storage;

const defaultPrefs = {
  skipNoFolderMessage: false,
  renditionType: application.RenditionType.PNG,
  overwriteFile: true,
  scale: 2,
  filename: ""
};

function getImageTypeOptions() {
  return Object.keys(application.RenditionType).map(
    key => application.RenditionType[key]
  );
}

async function createPrefs(prefsObj = defaultPrefs) {
  const prefsString = JSON.stringify(prefsObj);
  const dataFolder = await localFileSystem.getDataFolder();
  const prefsFile = await dataFolder.createFile("prefs.json", {
    overwrite: true
  });

  try {
    await prefsFile.write(prefsString);
    return await getPrefs();
  } catch (err) {
    if (err instanceof errors.FileIsReadOnly) {
      // todo
      console.log("prefs file is readonly");
    }
  }
}

async function getPrefs() {
  const dataFolder = await localFileSystem.getDataFolder();

  try {
    const prefsFile = await dataFolder.getEntry("prefs.json");
    const prefsJSON = await prefsFile.read();

    return JSON.parse(prefsJSON);
  } catch (err) {
    console.log(err.message);
    return await createPrefs();
  }
}

module.exports = {
  getPrefs,
  createPrefs,
  getImageTypeOptions
};
