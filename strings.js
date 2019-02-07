// An object representing possible outcomes of running the plugin.
// Contains strings to display in the dialog.
const results = {
  success: {
    h1: "Your rendition has been saved!",
    p: "A PNG rendition of your selection has been saved at:",
    button: "Got it!"
  },
  errorNoFolder: {
    h1: "No folder selected",
    p:
      "To save a rendition, please run the plugin again and choose a destination folder in the system folder picker.",
    button: "OK!"
  },
  errorNoSelection: {
    h1: "Please select something to render",
    p:
      "Select the artboard or object in the document that you want to render, and run the plugin again.",
    button: "OK!"
  },
  errorFileExists: {
    h1: "File already exists",
    p:
      "A file with this name already exists. Please move the file and run again. Alternatively, you can run the plugin again and select a different save location.",
    button: "OK!"
  },
  errorRenditionsFailed: {
    h1: "Renditions failed",
    p:
      "Rendering your selection failed for an unknown reason. Please try again and let us know if you continue experiencing this problem.",
    button: "OK!"
  },
  errorUnknown: {
    h1: "Unknown plugin error",
    p:
      "An unknown plugin error occured. Please try again and let us know if you continue experiencing this problem.",
    button: "OK!"
  }
};

const xdLogMessages = {
  errorNoFolder: "Cannot read property 'createFile' of null",
  errorFileExists:
    "A File with given name already exists. Set `overwrite: true` to replace."
};

module.exports = {
  results,
  xdLogMessages
};
