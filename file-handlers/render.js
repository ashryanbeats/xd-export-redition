const { createRenditions } = require("application");
const { localFileSystem } = require("uxp").storage;

/**
 * Creates the rendition and returns the results.
 * @param {selection} selectionItemToRender - The item to export as a rendition.
 * @param {Object} prefs - An object containing prefs that are now stored in the user prefs file.
 * @param {Object} [options] - Configuration options for the creating the rendition.
 * @param {Object} [options.preview = false] - Set to true when creating a temporary render for display in the control dialog.
 * @returns {RenditionResult[]} Rendition result data from XD on successful export.
 */
async function renderToFile(
  selectionItemToRender,
  prefs,
  options = { preview: false }
) {
  // Try to create a File that will contain the output of the rendition.
  let file = await createFile(prefs, options);

  const renditionSettings = [
    {
      node: selectionItemToRender,
      outputFile: file,
      type: prefs.renditionType,
      scale: prefs.scale,
      quality: 100,
      minify: false,
      embedImages: true
    }
  ];

  // Try to create the rendition as configured in `renditionSettings`
  try {
    return await createRenditions(renditionSettings);
  } catch (err) {
    throw new Error("errorRenditionsFailed");
  }
}

/**
 * Prompts the user to select a folder, then within that folder tries to create a File that will contain the output of the rendition.
 * This will fail if the user doesn't select a destination folder in the picker or if file overwrite isn't set to true and the file already exists.
 * @param {Object} prefs - An object containing prefs that are now stored in the user prefs file.
 * @param {Object} [options] - Configuration options for the creating the rendition.
 * @param {Object} [options.preview = false] - Set to true when creating a temporary render for display in the control dialog.
 * @returns {File} A file that the rendition will be written to.
 */
async function createFile(prefs, options) {
  const folder = options.preview
    ? await localFileSystem.getTemporaryFolder()
    : await localFileSystem.getFolder();
  if (!folder) throw new Error("errorNoFolder");

  const filenameWithExtension = `${prefs.filename}.${prefs.renditionType}`;

  try {
    return await folder.createFile(filenameWithExtension, {
      overwrite: prefs.overwriteFile
    });
  } catch (err) {
    throw new Error("errorFileExists");
  }
}

module.exports = {
  renderToFile
};
