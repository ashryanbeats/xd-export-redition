const {
  createPrefs,
  getPrefs,
  getImageTypeOptions
} = require("../file-handlers/prefs.js");

async function getResultFromControlDialog(results, languageCode) {
  const intialPrefs = await getPrefs();

  const dialog = await getControlDialog(
    results.controls,
    languageCode,
    intialPrefs
  );

  return await dialog.showModal();
}

async function getControlDialog(resultStrings, languageCode, prefs) {
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
    <dialog id="control-dialog">
      <form id="control-form" method="dialog">
        <h1>${resultStrings[languageCode].h1}</h1>
        <label class="row row-wrapper">
          <span>File name</span>
          <input id="file-name" type="text" uxp-quiet="false" placeholder="Enter a file name" ${
            prefs.filename.length ? `value="${prefs.filename}"` : null
          } />
        </label>
        <label class="row row-wrapper">
          <span>Image type to render</span>
          <select id="file-type-select">
            ${getImageTypeOptions().map(el => {
              return `<option value="${el}">${el.toUpperCase()}</option>`;
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
          <button id="cancel-button">${
            resultStrings[languageCode].cancelButton
          }</button>
          <button type="submit" uxp-variant="cta" id="ok-button">${
            resultStrings[languageCode].okButton
          }</button>
        </footer>
      </form>
    </dialog>
  `;
  setSelectedFileType(imageTypeOptions, imageTypePref);

  // Add event handlers
  const [dialog, form, range, cancelButton, okButton] = [
    "#control-dialog",
    "#control-dialog form",
    "#scale-range",
    "#cancel-button",
    "#ok-button"
  ].map(s => document.querySelector(s));

  cancelButton.addEventListener("click", e => dialog.close("reasonCanceled"));
  okButton.addEventListener("click", e => handleSubmit(e, dialog, prefs));
  form.onsubmit = e => handleSubmit(e, dialog, prefs);

  const displayValue = document.querySelector("#scale-display-value");
  range.addEventListener(
    "change",
    e => (displayValue.textContent = e.target.value)
  );

  // Show the modal
  try {
    return dialog;
  } catch (err) {
    console.log(err.message);
  }
}

// Workaround since dropdowns don't support `selected` / `disabled` yet
// https://adobexdplatform.com/plugin-docs/reference/ui/elements/dropdowns.html#known-issues
function setSelectedFileType(imageTypeOptions, imageTypePref) {
  const select = document.querySelector("#file-type-select");
  select.selectedIndex = imageTypeOptions.indexOf(imageTypePref);
}

async function handleSubmit(e, dialog, currentPrefs) {
  saveAndClose(dialog, currentPrefs);
  e.preventDefault();
}

async function saveAndClose(dialog, currentPrefs) {
  const savedPrefs = await savePrefs(currentPrefs);

  return await dialog.close(savedPrefs);
}

async function savePrefs(currentPrefs) {
  const prefsToSave = getSettingsFromForm(currentPrefs);
  return await createPrefs(prefsToSave);
}

function getSettingsFromForm(currentPrefs) {
  const [filenameInput, select, range, overwriteFile] = [
    "#file-name",
    "#file-type-select",
    "#scale-range",
    "#overwrite-file"
  ].map(sel => document.querySelector(sel));

  return {
    ...currentPrefs,
    renditionType: select.value,
    overwriteFile: overwriteFile.checked ? true : false,
    scale: Number(range.value),
    filename: filenameInput.value
  };
}

module.exports = {
  getResultFromControlDialog
};
