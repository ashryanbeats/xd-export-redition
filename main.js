const application = require("application");
const { localFileSystem, errors } = require("uxp").storage;
const { results } = require("./strings.js");
const { getControlDialog } = require("./controlDialog.js");
const { showResultDialog } = require("./resultDialog.js");
const { getPrefs } = require("./prefs.js");

// The main plugin function.
// Returns a dialog that communicates the outcome of running the plugin to the user.
async function exportRendition(selection) {
  const languageCode = application.appLanguage;

  // Exit if there is no selection
  if (selection.items.length === 0)
    return displayError(results.errorNoSelection, languageCode);

  const intialPrefs = await getPrefs();

  const dialog = await getControlDialog(
    results.controls,
    languageCode,
    intialPrefs
  );

  const dialogResult = await dialog.showModal();
  if (dialogResult === "reasonCanceled") return;

  // Try to get rendition results for the first item in the selection.
  // Exit if there is an error encountered along the way.
  try {
    const selectionItemToRender = selection.items[0];
    const renditionResults = await renderToFile(
      selectionItemToRender,
      dialogResult
    );

    // Success! Let the user know!
    return showResultDialog(results.success, languageCode, renditionResults);
  } catch (err) {
    console.log("[Error]", err.message);
    return displayError(err, languageCode);
  }
}

// Creates the rendition and returns the results.
async function renderToFile(selectionItemToRender, prefs) {
  // Try to create a File that will contain the output of the rendition.
  let file = await createFile(prefs);

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
async function createFile(prefs) {
  const folder = await localFileSystem.getFolder();
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

// Takes in thrown error messages and
// displays the appropriate strings to the user in a dialog.
function displayError(err, languageCode) {
  return showResultDialog(results[err.message], languageCode);
}

module.exports = {
  commands: {
    exportRendition
  }
};
