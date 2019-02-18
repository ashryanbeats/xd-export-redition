const application = require("application");
const { strings } = require("./strings.js");
const { getResultFromControlDialog } = require("./dialogs/controlDialog.js");
const { showResultDialog } = require("./dialogs/resultDialog.js");
const { renderToFile } = require("./file-handlers/render.js");
const { getPrefs } = require("./file-handlers/prefs.js");

async function initiatePlugin(selection) {
  const languageCode = application.appLanguage;

  // Exit if there is no selection
  if (selection.items.length === 0)
    return showResultDialog(strings.errorNoSelection, languageCode);

  let dialogResult = await getResultFromControlDialog(strings, languageCode);
  if (dialogResult === "reasonCanceled") return;

  return exportRendition(selection, dialogResult, languageCode);
}

// The main plugin function.
// Returns a dialog that communicates the outcome of running the plugin to the user.
async function exportRendition(selection, dialogResult, languageCode) {
  // Try to get rendition results for the first item in the selection.
  // Exit if there is an error encountered along the way.
  try {
    const selectionItemToRender = selection.items[0];
    const renditionResults = await renderToFile(
      selectionItemToRender,
      dialogResult
    );

    // Success! Let the user know!
    return showResultDialog(strings.success, languageCode, renditionResults);
  } catch (err) {
    const prefs = await getPrefs();
    console.log("[Error]", err.message);
    console.log("prefs", prefs);

    if (err.message === "errorNoFolder" && prefs.skipNoFolderMessage) return;
    return showResultDialog(strings[err.message], languageCode);
  }
}

module.exports = {
  commands: {
    initiatePlugin
  }
};
