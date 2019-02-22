const { formStyles } = require("./styles.js");
const { getPrefs, createPrefs } = require("../file-handlers/prefs.js");

async function showResultDialog(strings, options) {
  let dialog = document.querySelector("#result-dialog");

  if (dialog) {
    return await dialog.showModal();
  } else {
    dialog = createResultDialog(strings, options);

    return await dialog.showModal();
  }
}

function createResultDialog(strings, options) {
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
          <button type="submit" uxp-variant="cta" id="ok-button">${
            strings.button
          }</button>
        </footer>
      </form>
    </dialog>
  `;

  // Add event handlers
  const [dialog, form, skipNoFolderMsg, okButton] = [
    "#result-dialog",
    "#result-form",
    "#skip-no-folder-msg",
    "#ok-button"
  ].map(sel => document.querySelector(sel));

  if (skipNoFolderMsg)
    skipNoFolderMsg.addEventListener("change", updateNoFolderPref);

  okButton.addEventListener("click", _ => dialog.close());
  form.onsubmit = _ => dialog.close();

  return dialog;
}

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
