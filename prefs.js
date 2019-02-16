const application = require("application");
const { localFileSystem, errors } = require("uxp").storage;
const { xdLogMessages } = require("./strings.js");

const defaultPrefs = {
  showNoFolderMessage: true,
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

    return JSON.parse(await prefsFile.read());
  } catch (err) {
    switch (err.message) {
      case xdLogMessages.errorFileNotFound:
        return await createPrefs();

      default:
        console.log(err);
    }
  }
}

async function togglePrefs() {
  console.log("togglePrefs");

  const prefsObj = await getPrefs();
  prefsObj.showNoFolderMessage = !prefsObj.showNoFolderMessage;

  return createPrefs(prefsObj);
}

async function updateOverwritePref() {
  const prefsObj = await getPrefs();
  prefsObj.overwriteFile = !prefsObj.overwriteFile;

  return createPrefs(prefsObj);
}

async function updateImageTypePref(e) {
  const prefsObj = await getPrefs();
  prefsObj.renditionType = e.target.value;

  return createPrefs(prefsObj);
}

async function updateScalePref(e) {
  const prefsObj = await getPrefs();
  prefsObj.scale = e.target.value;

  return createPrefs(prefsObj);
}

async function updateFilenamePref(filename) {
  const prefsObj = await getPrefs();
  prefsObj.filename = filename;

  return createPrefs(prefsObj);
}

module.exports = {
  getPrefs,
  togglePrefs,
  updateOverwritePref,
  updateImageTypePref,
  updateScalePref,
  updateFilenamePref,
  getImageTypeOptions
};
