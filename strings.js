// An object representing possible outcomes of running the plugin.
// Contains strings to display in the dialog.
const results = {
  success: {
    en: {
      h1: "Your rendition has been saved!",
      p: "A PNG rendition of your selection has been saved at:",
      button: "Got it!"
    },
    ja: {
      h1: "レンディションを保存しました",
      p: "レンディションはこちらのパスでPNGとして保存しました：",
      button: "了解！"
    }
  },
  errorNoFolder: {
    en: {
      h1: "No folder selected",
      p:
        "To save a rendition, please run the plugin again and choose a destination folder in the system folder picker.",
      button: "OK!",
      checkbox: "Don't show this message again"
    },
    ja: {
      h1: "フォルダーを選択してください",
      p:
        "レンディションを保存するには、プラグインを再度実行し、システムフォルダピッカーでデスティネーションフォルダを選択してください。",
      button: "了解！",
      checkbox: "Don't show this message again"
    }
  },
  errorNoSelection: {
    en: {
      h1: "Please select something to render",
      p:
        "Select the artboard or object in the document that you want to render, and run the plugin again.",
      button: "OK!"
    },
    ja: {
      h1: "オブジェクトを選択してください",
      p:
        "レンダリングするドキュメント内のアートボードまたはオブジェクトを選択し、プラグインを再度実行します。",
      button: "了解！"
    }
  },
  errorFileExists: {
    en: {
      h1: "File already exists",
      p:
        "A file with this name already exists. Please move the file and run again. Alternatively, you can run the plugin again and select a different save location.",
      button: "OK!"
    },
    ja: {
      h1: "ファイルは既に存在します",
      p:
        "同じファイル名この名前のファイルは既に存在します。ファイルを移動して、もう一度実行してください。または、プラグインを再度実行して、別の保存場所を選択することもできます。",
      button: "了解！"
    }
  },
  errorRenditionsFailed: {
    en: {
      h1: "Renditions failed",
      p:
        "Rendering your selection failed for an unknown reason. Please try again and let us know if you continue experiencing this problem.",
      button: "OK!"
    },
    ja: {
      h1: "レンディションの失敗",
      p:
        "不明な理由により、選択をレンダリングできませんでした。もう一度試してみて、この問題が引き続き発生するかどうかをお知らせください。",
      button: "OK!"
    }
  },
  errorUnknown: {
    en: {
      h1: "Unknown plugin error",
      p:
        "An unknown plugin error occured. Please try again and let us know if you continue experiencing this problem.",
      button: "OK!"
    },
    ja: {
      h1: "不明なプラグインエラー",
      p:
        "不明なプラグインエラーが発生しました。もう一度試してみて、この問題が引き続き発生するかどうかをお知らせください。",
      button: "OK!"
    }
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
