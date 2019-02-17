const application = require("application");
const fs = require("uxp").storage.localFileSystem;
const { results, xdLogMessages } = require("./strings.js");
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
  console.log("dialogResult", dialogResult);

  // Try to get rendition results for the first item in the selection.
  // Exit if there is an error encountered along the way.
  let renditionResults;
  try {
    const selectionItemToRender = selection.items[0];
    renditionResults = await renderToFile(selectionItemToRender, dialogResult);
  } catch (err) {
    return displayError(err, languageCode);
  }

  // Success! Let the user know!
  return showResultDialog(results.success, languageCode, renditionResults);
}

// Creates the rendition and returns the results.
async function renderToFile(selectionItemToRender, prefs) {
  // Try to create a File that will contain the output of the rendition.
  let file;
  try {
    file = await createFile(prefs);
  } catch (err) {
    return new Error(err);
  }

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

  console.log("renderToFile prefs", prefs);
  console.log("renditionSettings", renditionSettings);

  // Try to create the rendition as configured in `renditionSettings`
  try {
    return await application.createRenditions(renditionSettings);
  } catch (err) {
    console.log(err);
    throw results.errorRenditionsFailed;
  }
}

// Prompts the user to select a folder, then within that folder
// tries to create a File that will contain the output of the rendition.
// This will fail if the user doesn't select a destination folder in the picker
// or if file overwrite isn't set to true and the file already exists.
async function createFile(prefs) {
  console.log("createFile");
  console.log(prefs);
  try {
    const folder = await fs.getFolder();
    if (!folder) return new Error(results.errorNoFolder);
    const filenameWithExtension = `${prefs.filename}.${prefs.renditionType}`;

    return await folder.createFile(filenameWithExtension, {
      overwrite: prefs.overwriteFile
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
      console.log("Error>>>>>>>>>");
      throw results.errorUnknown;
  }
}

// Takes in thrown error messages and
// displays the appropriate strings to the user in a dialog.
function displayError(err, languageCode) {
  switch (err) {
    case results.errorNoSelection:
      return showResultDialog(results.errorNoSelection, languageCode);
    case results.errorNoFolder:
      return prefs.showNoFolderMessage
        ? showResultDialog(results.errorNoFolder, languageCode)
        : null;
    case results.errorFileExists:
      return showResultDialog(results.errorFileExists, languageCode);
    case results.errorRenditionsFailed:
      return showResultDialog(results.errorRenditionsFailed, languageCode);

    default:
      console.log("Error!!!!!!!!!", err);
      return showResultDialog(results.errorUnknown, languageCode);
  }
}

module.exports = {
  commands: {
    exportRendition
  }
};
