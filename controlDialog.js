const {
  updateOverwritePref,
  getImageTypeOptions,
  updateImageTypePref,
  updateScalePref
} = require("./prefs.js");

function showControlDialog(resultStrings, languageCode, prefs) {
  const imageTypeOptions = getImageTypeOptions();
  const imageTypePref = prefs.renditionType;

  // HTML markup
  document.body.innerHTML = `
    <style>
      form {
        width: 400;
      }
      .row-wrapper {
        align-items: center;
      }
      .spread {
        justify-content: space-between;
      }
    </style>
    <dialog>
      <form method="dialog">
        <h1>${resultStrings[languageCode].h1}</h1>
        <label class="row row-wrapper">
          <span>Image type to render</span>
          <select id="file-type-select">
            ${getImageTypeOptions().map(el => {
              return `<option value="${el}">${el}</option>`;
            })}
          </select>
        </label>
        <label>
          <div class="row spread">
            <span>Render scale</span>
            <span id="scale-display-value">${prefs.scale}</span>
          </div>
          <input id="scale-range" type="range" min=1 max=5 step=1 value=${
            prefs.scale
          } />
        </label>
        <label class="row row-wrapper">
          <span>Overwrite existing file</span>
          <input type="checkbox" id="overwrite-file"/ ${
            prefs.overwriteFile ? "checked" : ""
          }>
        </label>
        <footer>
          <button uxp-variant="primary" id="cancel-button">${
            resultStrings[languageCode].cancelButton
          }</button>
          <button uxp-variant="cta" id="ok-button">${
            resultStrings[languageCode].okButton
          }</button>
        </footer>
      </form>
    </dialog>
  `;

  // Add event handlers
  const select = document.querySelector("#file-type-select");
  select.addEventListener("change", updateImageTypePref);
  setSelectedFileType(imageTypeOptions, imageTypePref);

  const range = document.querySelector("#scale-range");
  const displayValue = document.querySelector("#scale-display-value");
  range.addEventListener("change", updateScalePref);
  range.addEventListener(
    "change",
    e => (displayValue.textContent = e.target.value)
  );

  const overwriteFile = document.querySelector("#overwrite-file");
  overwriteFile.addEventListener("change", updateOverwritePref);

  const cancelButton = document.querySelector("#cancel-button");
  cancelButton.addEventListener("click", e => dialog.close());

  const okButton = document.querySelector("#ok-button");
  okButton.addEventListener("click", e => dialog.close());

  // Show the modal
  const dialog = document.querySelector("dialog");
  return dialog.showModal();
}

// Workaround since dropdowns don't support `selected` / `disabled` yet
// https://adobexdplatform.com/plugin-docs/reference/ui/elements/dropdowns.html#known-issues
function setSelectedFileType(imageTypeOptions, imageTypePref) {
  const select = document.querySelector("#file-type-select");
  select.selectedIndex = imageTypeOptions.indexOf(imageTypePref);
}

module.exports = {
  showControlDialog
};
