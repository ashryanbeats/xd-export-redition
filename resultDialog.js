const { togglePrefs } = require("./prefs.js");

function showResultDialog(resultStrings, languageCode, renditionResults) {
  // HTML markup
  document.body.innerHTML = `
    <style>
      form {
        width: 400;
      }
      .checkbox-wrapper {
        align-items: center;
      }
    </style>
    <dialog>
      <form>
        <h1>${resultStrings[languageCode].h1}</h1>
        <p>${resultStrings[languageCode].p}</p>
        ${
          renditionResults
            ? `<input type="text" readonly uxp-quiet="true" value=${
                renditionResults[0].outputFile.nativePath
              }>`
            : ""
        }
        <footer>
          ${
            resultStrings[languageCode].checkbox
              ? `
            <label class="row checkbox-wrapper">
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
  if (skipNoFolderMsg) skipNoFolderMsg.addEventListener("change", togglePrefs);

  const okButton = document.querySelector("#ok-button");
  okButton.addEventListener("click", e => dialog.close());

  // Show the modal
  const dialog = document.querySelector("dialog");
  return dialog.showModal();
}

module.exports = {
  showResultDialog
};
