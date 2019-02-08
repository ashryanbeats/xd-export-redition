const application = require("application");
const fs = require("uxp").storage.localFileSystem;
const { results, xdLogMessages } = require("./strings.js");
const { showDialog } = require("./dialog.js");
const { getPrefs } = require("./prefs.js");

// Options or settings for this plugin for developers to play with.
// With additional work, you could make these user-settable.
const pluginOptions = {
  renditionType: application.RenditionType.PNG,
  overwriteFile: true,
  scale: 2,
  filename: "rendition.png"
};

let prefs;

// The main plugin function.
// Returns a dialog that communicates the outcome of running the plugin to the user.
async function exportRendition(selection) {
  const languageCode = application.appLanguage;
  prefs = await getPrefs();

  // Exit if there is no selection
  if (selection.items.length === 0)
    return displayError(results.errorNoSelection, languageCode);

  // Try to get rendition results for the first item in the selection.
  // Exit if there is an error encountered along the way.
  let renditionResults;
  try {
    const selectionItemToRender = selection.items[0];
    renditionResults = await renderToFile(selectionItemToRender);
  } catch (err) {
    return displayError(err, languageCode);
  }

  // Success! Let the user know!
  return showDialog(results.success, languageCode, renditionResults);
}

// Creates the rendition and returns the results.
async function renderToFile(selectionItemToRender) {
  // Try to create a File that will contain the output of the rendition.
  let file;
  try {
    file = await createFile();
  } catch (err) {
    throw err;
  }

  const renditionSettings = [
    {
      node: selectionItemToRender,
      outputFile: file,
      type: pluginOptions.renditionType,
      scale: pluginOptions.scale
    }
  ];

  // Try to create the rendition as configured in `renditionSettings`
  try {
    return await application.createRenditions(renditionSettings);
  } catch (err) {
    throw results.errorRenditionsFailed;
  }
}

// Prompts the user to select a folder, then within that folder
// tries to create a File that will contain the output of the rendition.
// This will fail if the user doesn't select a destination folder in the picker
// or if file overwrite isn't set to true and the file already exists.
async function createFile() {
  try {
    const folder = await fs.getFolder();
    return await folder.createFile(pluginOptions.filename, {
      overwrite: pluginOptions.overwriteFile
    });
  } catch (err) {
    throwError(err);
  }
}

// Takes in application error messages
// and throws the appropriate error from the `results` object
function throwError(err) {
  console.log(err);
  switch (err.message) {
    case xdLogMessages.errorNoFolder:
      throw results.errorNoFolder;
    case xdLogMessages.errorFileExists:
      throw results.errorFileExists;

    default:
      throw results.errorUnknown;
  }
}

// Takes in thrown error messages and
// displays the appropriate strings to the user in a dialog.
function displayError(err, languageCode) {
  switch (err) {
    case results.errorNoSelection:
      return showDialog(results.errorNoSelection, languageCode);
    case results.errorNoFolder:
      return prefs.showNoFolderMessage
        ? showDialog(results.errorNoFolder, languageCode)
        : null;
    case results.errorFileExists:
      return showDialog(results.errorFileExists, languageCode);
    case results.errorRenditionsFailed:
      return showDialog(results.errorRenditionsFailed, languageCode);

    default:
      return showDialog(results.errorUnknown, languageCode);
  }
}

module.exports = {
  commands: {
    exportRendition
  }
};
