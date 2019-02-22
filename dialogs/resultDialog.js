const { formStyles } = require("./styles.js");
const { getPrefs, createPrefs } = require("../file-handlers/prefs.js");

/**
 *
 * @param {Object} strings - Localized strings for the dialog.
 * @param {Object} [options] - Configuration options for the results dialog.
 * @param {string} [options.isError=false] - Flag for when the result is an error.
 * @param {RenditionResult[]} [options.renditionResults] - Rendition result data from XD on successful export.
 * @returns {string} The return value of `dialog#close`. Currently an empty string.
 */
async function showResultDialog(strings, options) {
  let dialog = document.querySelector("#result-dialog");

  if (dialog) {
    return await dialog.showModal();
  } else {
    dialog = getResultDialog(strings, options);

    return await dialog.showModal();
  }
}

/**
 * Appends the dialog to the DOM.
 * @param {Object} strings - Localized strings for the dialog.
 * @param {Object} [options] - Configuration options for the results dialog.
 * @param {string} [options.isError=false] - Flag for when the result is an error.
 * @param {RenditionResult[]} [options.renditionResults] - Rendition result data from XD on successful export.
 * @returns {HTMLDialogElement} The result dialog element.
 */
function getResultDialog(strings, options) {
  // HTML markup
  document.body.innerHTML = `
    ${formStyles}
    <dialog id="result-dialog">
      <form id="result-form" method="dialog">
        <h1 ${options.isError ? `class="color-red"` : ""}>${strings.h1}</h1>
        <p>${strings.p}</p>
        ${
          options.renditionResults
            ? `<input type="text" readonly uxp-quiet="true" value="${
                options.renditionResults[0].outputFile.nativePath
              }">`
            : ""
        }
        <footer>
          ${
            strings.checkbox
              ? `
            <label class="row row-wrapper">
              <input type="checkbox" id="skip-no-folder-msg"/>
              <span>Don't show this message again</span>
            </label>
          `
              : ""
          }
          <button type="submit" uxp-variant="primary" id="ok-button" autofocus>${
            strings.button
          }</button>
        </footer>
      </form>
    </dialog>
  `;

  return getResultDialogWithEventHandlers();
}

/**
 * Adds the required event handlers to the result dialog.
 * @returns {HTMLDialogElement} The result dialog element.
 */
function getResultDialogWithEventHandlers() {
  // Add event handlers
  const [dialog, form, skipNoFolderMsg, okButton] = [
    "#result-dialog",
    "#result-form",
    "#skip-no-folder-msg",
    "#ok-button"
  ].map(sel => document.querySelector(sel));

  if (skipNoFolderMsg)
    skipNoFolderMsg.addEventListener("change", updateNoFolderPref);

  okButton.addEventListener("click", e => handleSubmit(e, dialog));
  form.onsubmit = e => handleSubmit(e, dialog);

  return dialog;
}

function handleSubmit(e, dialog) {
  dialog.close();
  e.preventDefault();
}

/**
 * Stores the user perference for seeing an alert when they don't select a folder from the picker.
 * @param {Object} e - The event.
 * @returns {Object} Updated preferences stored in prefs.json.
 */
async function updateNoFolderPref(e) {
  const initialPrefs = await getPrefs();

  return await createPrefs({
    ...initialPrefs,
    skipNoFolderMessage: e.target.checked
  });
}

module.exports = {
  showResultDialog
};
