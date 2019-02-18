const { formStyles } = require("./styles.js");
const { getPrefs, createPrefs } = require("../file-handlers/prefs.js");

function showResultDialog(resultStrings, languageCode, renditionResults) {
  // HTML markup
  document.body.innerHTML = `
    ${formStyles}
    <dialog>
      <form method="dialog">
        <h1>${resultStrings[languageCode].h1}</h1>
        <p>${resultStrings[languageCode].p}</p>
        ${
          renditionResults
            ? `<input type="text" readonly uxp-quiet="true" value="${
                renditionResults[0].outputFile.nativePath
              }">`
            : ""
        }
        <footer>
          ${
            resultStrings[languageCode].checkbox
              ? `
            <label class="row row-wrapper">
              <input type="checkbox" id="skip-no-folder-msg"/>
              <span>Don't show this message again</span>
            </label>
          `
              : ""
          }
          <button uxp-variant="cta" id="ok-button">${
            resultStrings[languageCode].button
          }</button>
        </footer>
      </form>
    </dialog>
  `;

  // Add event handlers
  const skipNoFolderMsg = document.querySelector("#skip-no-folder-msg");
  if (skipNoFolderMsg)
    skipNoFolderMsg.addEventListener("change", updateNoFolderPref);

  const okButton = document.querySelector("#ok-button");
  okButton.addEventListener("click", e => dialog.close());

  // Show the modal
  const dialog = document.querySelector("dialog");
  return dialog.showModal();
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
