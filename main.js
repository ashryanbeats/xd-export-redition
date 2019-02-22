const { appLanguage } = require("application");
const { strings } = require("./strings.js");
const { getResultFromControlDialog } = require("./dialogs/controlDialog.js");
const { showResultDialog } = require("./dialogs/resultDialog.js");
const { renderToFile } = require("./file-handlers/render.js");
const { getPrefs } = require("./file-handlers/prefs.js");

/**
 * Initiates the plugin by performing selection check and running the control dialog.
 * @param {selection} selection - The currently selected node in XD's UI.
 */
async function initiatePlugin(selection) {
  const selectionItemToRender = selection.items[0];

  // Exit if there is no selection
  if (!selectionItemToRender)
    return await showResultDialog(strings.errorNoSelection[appLanguage], {
      isError: true
    });

  // Get rendition settings from the control dialog
  let dialogResult = await getResultFromControlDialog(
    strings.controls[appLanguage],
    selectionItemToRender
  );

  // Exit if the user clicked Cancel or pressed Escape
  if (dialogResult === "reasonCanceled") return;

  // Handle export and exit
  return await exportRendition(selectionItemToRender, dialogResult);
}

/**
 * Shows the results dialog modal that communicates the outcome of running the plugin to the user.
 * @param {selection} selectionItemToRender - The item to export as a rendition.
 * @param {Object} dialogResult - The results of successfully running the control dialog. An Object containing settings for the render.
 */
async function exportRendition(selectionItemToRender, dialogResult) {
  // Try to get rendition results for the selection item.
  try {
    const renditionResults = await renderToFile(
      selectionItemToRender,
      dialogResult
    );

    // Success! Let the user know!
    return await showResultDialog(strings.success[appLanguage], {
      renditionResults
    });
  } catch (err) {
    // Exit if there is an error encountered along the way.
    const prefs = await getPrefs();
    console.log("[Error]", err.message);
    console.log("prefs", prefs);

    // Skip the results dialog if the user has set the skip preference.
    if (err.message === "errorNoFolder" && prefs.skipNoFolderMessage) return;
    // Error! Let the user know!
    return await showResultDialog(strings[err.message][appLanguage], {
      isError: true
    });
  }
}

module.exports = {
  commands: {
    initiatePlugin
  }
};
