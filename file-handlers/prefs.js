const application = require("application");
const { localFileSystem, errors } = require("uxp").storage;

const defaultPrefs = {
  skipNoFolderMessage: false,
  renditionType: application.RenditionType.PNG,
  overwriteFile: true,
  scale: 1,
  filename: ""
};

/**
 * Gets all supported image types for rendition from XD.
 * @returns {string[]} File extension strings for supported image types.
 */
function getImageTypeOptions() {
  return Object.keys(application.RenditionType).map(
    key => application.RenditionType[key]
  );
}

/**
 * Creates/updates user preferences by creating a prefs file if one doesn't exist, or by overwriting the existing prefs file.
 * @param {Object} prefsObj - Preferences to write to a JSON file in the plugin settings folder.
 * @returns {Object} An object containing prefs that are now stored in the prefs file.
 */
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

/**
 * Gets existing prefs or calls `createPrefs()` if a prefs file isn't found.
 * @returns {Object} An object containing prefs that are now stored in the prefs file.
 */
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
  getImageTypeOptions,
  defaultPrefs
};
