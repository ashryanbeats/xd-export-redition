const application = require("application");
const { localFileSystem } = require("uxp").storage;

// Creates the rendition and returns the results.
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
    return await application.createRenditions(renditionSettings);
  } catch (err) {
    throw new Error("errorRenditionsFailed");
  }
}

// Prompts the user to select a folder, then within that folder
// tries to create a File that will contain the output of the rendition.
// This will fail if the user doesn't select a destination folder in the picker
// or if file overwrite isn't set to true and the file already exists.
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
