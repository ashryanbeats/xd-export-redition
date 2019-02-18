const application = require("application");
const { results } = require("./strings.js");
const { getResultFromControlDialog } = require("./dialogs/controlDialog.js");
const { showResultDialog } = require("./dialogs/resultDialog.js");
const { renderToFile } = require("./file-handlers/render.js");
const { getPrefs } = require("./file-handlers/prefs.js");

async function initiatePlugin(selection) {
  const languageCode = application.appLanguage;

  // Exit if there is no selection
  if (selection.items.length === 0)
    return showResultDialog(results.errorNoSelection, languageCode);

  let dialogResult = await getResultFromControlDialog(results, languageCode);
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
    return showResultDialog(results.success, languageCode, renditionResults);
  } catch (err) {
    console.log("[Error]", err.message);

    const prefs = await getPrefs();

    if (err.message === "errorNoFolder" && prefs.skipNoFolderMessage) return;
    return showResultDialog(results[err.message], languageCode);
  }
}

module.exports = {
  commands: {
    initiatePlugin
  }
};
