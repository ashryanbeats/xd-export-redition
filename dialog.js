function showDialog(resultStrings, renditionResults) {
  let dialog = document.createElement("dialog");

  // create the form element, which has default styling and spacing
  let form = document.createElement("form");
  dialog.appendChild(form);
  form.style.width = 400;

  // add form content
  let title = document.createElement("h1");
  title.textContent = resultStrings.h1;
  form.appendChild(title);

  let p = document.createElement("p");
  p.textContent = resultStrings.p;
  form.appendChild(p);

  if (renditionResults) {
    let p = document.createElement("p");
    p.textContent = renditionResults[0].outputFile.nativePath;
    form.appendChild(p);
  }

  // create a footer to hold your form dismissal button
  let footer = document.createElement("footer");
  form.appendChild(footer);

  // include at least one way to close the dialog
  let closeButton = document.createElement("button");
  closeButton.uxpVariant = "cta";
  closeButton.textContent = resultStrings.button;
  closeButton.onclick = e => dialog.close();
  footer.appendChild(closeButton);

  // append dialog to DOM and show modal
  document.body.appendChild(dialog);
  return dialog.showModal();
}

module.exports = {
  showDialog
};
