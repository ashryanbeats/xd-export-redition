function showDialog(resultStrings, languageCode, renditionResults) {
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
            ? `<p>${renditionResults[0].outputFile.nativePath}</p>`
            : ""
        }
        <footer>
          ${
            resultStrings[languageCode].checkbox
              ? `
            <label class="row checkbox-wrapper">
              <input type="checkbox" />
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

  const okButton = document.querySelector("#ok-button");
  okButton.addEventListener("click", e => dialog.close());

  const dialog = document.querySelector("dialog");
  return dialog.showModal();
}

module.exports = {
  showDialog
};
