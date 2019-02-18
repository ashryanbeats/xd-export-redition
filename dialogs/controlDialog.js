const { formStyles } = require("./styles.js");
const {
  createPrefs,
  getPrefs,
  getImageTypeOptions
} = require("../file-handlers/prefs.js");

async function getResultFromControlDialog(strings, languageCode) {
  const intialPrefs = await getPrefs();

  const dialog = await getControlDialog(
    strings.controls,
    languageCode,
    intialPrefs
  );

  return await dialog.showModal();
}

async function getControlDialog(strings, languageCode, intialPrefs) {
  const imageTypeOptions = getImageTypeOptions();
  const imageTypePref = intialPrefs.renditionType;

  console.log(strings);

  // HTML markup
  document.body.innerHTML = `
    ${formStyles}
    <dialog id="control-dialog">
      <form id="control-form" method="dialog">
        <h1>${strings[languageCode].h1}</h1>
        <label class="row row-wrapper">
          <span>${strings[languageCode].filenameLabel}</span>
          <input id="file-name" type="text" uxp-quiet="false" placeholder="${
            strings[languageCode].filenamePlaceholder
          }" ${
    intialPrefs.filename.length ? `value="${intialPrefs.filename}"` : null
  } />
        </label>
        <label class="row row-wrapper">
          <span>${strings[languageCode].renditionTypeLabel}</span>
          <select id="file-type-select">
            ${getImageTypeOptions().map(el => {
              return `<option value="${el}">${el.toUpperCase()}</option>`;
            })}
          </select>
        </label>
        <label>
          <div class="row spread">
            <span>${strings[languageCode].renderScaleLabel}</span>
            <span id="scale-display-value">${intialPrefs.scale}x</span>
          </div>
          <input id="scale-range" type="range" min=1 max=5 step=1 value=${
            intialPrefs.scale
          } />
        </label>
        <label class="row row-wrapper">
          <span>${strings[languageCode].overwriteFileLabel}</span>
          <input type="checkbox" id="overwrite-file"/ ${
            intialPrefs.overwriteFile ? "checked" : ""
          }>
        </label>
        <footer>
          <button id="cancel-button">${
            strings[languageCode].cancelButton
          }</button>
          <button type="submit" uxp-variant="cta" id="ok-button">${
            strings[languageCode].okButton
          }</button>
        </footer>
      </form>
    </dialog>
  `;
  setSelectedFileType(imageTypeOptions, imageTypePref);

  return getControlDialogWithEventHandlers(intialPrefs);
}

function getControlDialogWithEventHandlers(intialPrefs) {
  // Add event handlers
  const [dialog, form, scaleRange, cancelButton, okButton] = [
    "#control-dialog",
    "#control-dialog form",
    "#scale-range",
    "#cancel-button",
    "#ok-button"
  ].map(s => document.querySelector(s));

  cancelButton.addEventListener("click", _ => dialog.close("reasonCanceled"));
  okButton.addEventListener("click", e => handleSubmit(e, dialog, intialPrefs));
  form.onsubmit = e => handleSubmit(e, dialog, intialPrefs);

  const scaleDisplayValue = document.querySelector("#scale-display-value");
  scaleRange.addEventListener(
    "change",
    e => (scaleDisplayValue.textContent = `${e.target.value}x`)
  );

  return dialog;
}

// Workaround since dropdowns don't support `selected` / `disabled` yet
// https://adobexdplatform.com/plugin-docs/reference/ui/elements/dropdowns.html#known-issues
function setSelectedFileType(imageTypeOptions, imageTypePref) {
  const select = document.querySelector("#file-type-select");
  select.selectedIndex = imageTypeOptions.indexOf(imageTypePref);
}

async function handleSubmit(e, dialog, intialPrefs) {
  saveAndClose(dialog, intialPrefs);
  e.preventDefault();
}

async function saveAndClose(dialog, intialPrefs) {
  const savedPrefs = await savePrefs(intialPrefs);

  return await dialog.close(savedPrefs);
}

async function savePrefs(intialPrefs) {
  const prefsToSave = getSettingsFromForm(intialPrefs);
  return await createPrefs(prefsToSave);
}

function getSettingsFromForm(intialPrefs) {
  const [filenameInput, filetypeSelect, scaleRange, overwriteFile] = [
    "#file-name",
    "#file-type-select",
    "#scale-range",
    "#overwrite-file"
  ].map(sel => document.querySelector(sel));

  return {
    ...intialPrefs,
    renditionType: filetypeSelect.value,
    overwriteFile: overwriteFile.checked ? true : false,
    scale: Number(scaleRange.value),
    filename: filenameInput.value
  };
}

module.exports = {
  getResultFromControlDialog
};
