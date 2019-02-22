# How to export a rendition

This developer sample generates an export rendition of an object in XD.
[Read the step-by-step guide for a much simpler version of this sample](https://adobexdplatform.com/plugin-docs/tutorials/how-to-export-a-rendition/).

## Usage

1. Select an object in an XD document
1. Run "Plugins > \[Sample\] Export rendition"
1. Select the destination folder from the picker
1. Get confirmation of success or errors in a modal dialog

## Topics covered in this sample

In no particular order:

- Exporting renditions of a user selection
- Saving and getting user preferences from the plugin data folder
- Localizing UI with a plain ol' JavaScript object and `appLanguage`
- Storing data in the temporary folder as well as in user-selected folders
- Displaying an image in a modal dialog
- Skipping modals based on user preferences
