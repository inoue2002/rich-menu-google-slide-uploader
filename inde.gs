// ※最初に設定※LINEBotのアクセストークン
const access_token = ''
// ※最初に設定※リッチメニューにするSlideファイルID
const presentationId = ''
// ※最初に設定※画像をアップロードするGoogleDriveのフォルダーID
const folderId = ''
/**
 * googleSlideを利用して新しいリッチメニューをデフォルト設定
 */
function main() {
  try {
    // slideデータを取得
    const presentation = SlidesApp.openById(presentationId)
    const slides = presentation.getSlides();
    const page_id = slides[0].getObjectId();
    // richiMenuIdを取得
    const richMenuId = createNewRichMenu()
    // 生成した画像のファイルを取得
    const file = slideToPng(presentationId, page_id, 'png', 1);
    // richMenuIdに画像を紐付け
    uploadImage(richMenuId, file)
    // デフォルトのリッチメニューに設定
    setDefaultMenu(richMenuId)
    console.log(`richMenuId:${richMenuId}を作成し、デフォルトに設定しました`)
  } catch (e) {
    console.log(e)
    console.log('リッチメニューの作成に失敗しました')
  }
}

/**
 * slideをpng画像にしてGoogleDriveにアップロード
 */
function slideToPng(presentation_id, page_id, slidesNumber) {
  const folder = DriveApp.getFolderById(folderId)
  let ext = 'png';
  const url = "https://docs.google.com/presentation/d/" + presentation_id + "/export/" + 'png' + "?id=" + presentation_id + "&pageid=" + page_id;
  const options = {
    method: "get",
    headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() === 200) {
    const presentation = SlidesApp.openById(presentation_id);
    const newFile = folder.createFile(response.getBlob()).setName(presentation.getName() + '_' + slidesNumber + '.' + ext);
    console.log(`uploaded!: https://drive.google.com/uc?export=view&id=${newFile.getId()}`)
    return newFile
  } else {
    throw new Error('slideを画像に変換できませんでした')
  }
}

/**
 * リッチメニューをデフォルトに設定
 * @param {string} richMenuId - 設定するリッチメニューID
 */
function setDefaultMenu(richMenuId) {
  const url = `https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`
  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + access_token,
  }

  const options = {
    'method': 'post',
    'headers': headers,
  }
  try {
    const res = UrlFetchApp.fetch(url, options);
    return
  } catch (e) {
    throw new Error('リッチメニューをデフォルトに設定できませんでした')
  }
}

/** 
 * リッチメニューを作成し、成功した場合はrichiMenuIdを返却
 * @return {string} richMenuId - LINEから返されたリッチメニュー固有のID
 */
function createNewRichMenu() {
  const url = 'https://api.line.me/v2/bot/richmenu';

  //自分の作成したいrichMenuJSONに書き換える
  const postData = {
    "size": {
      "width": 2500,
      "height": 1686
    },
    "selected": true,
    "name": "リッチメニュー",
    "chatBarText": "メニュー",
    "areas": [
      {
        "bounds": {
          "x": 37,
          "y": 21,
          "width": 107,
          "height": 111
        },
        "action": {
          "type": "postback",
          "data": "closeRichMenu",
          "inputOption": "closeRichMenu"
        }
      },
      {
        "bounds": {
          "x": 54,
          "y": 243,
          "width": 2392,
          "height": 685
        },
        "action": {
          "type": "postback",
          "data": "openVoice",
          "inputOption": "openVoice"
        }
      },
      {
        "bounds": {
          "x": 58,
          "y": 1060,
          "width": 2392,
          "height": 574
        },
        "action": {
          "type": "postback",
          "data": "openKeyboard",
          "inputOption": "openKeyboard",
          "fillInText": "【お問い合わせ】<PlaceHolder>"
        }
      }
    ]
  }
  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + access_token,
  }

  const options = {
    'method': 'post',
    'headers': headers,
    'payload': JSON.stringify(postData),
  }
  try {
    const res = UrlFetchApp.fetch(url, options);
    const richMenuId = JSON.parse(res).richMenuId
    console.log('richMenuId: ', richMenuId)
    return richMenuId
  } catch (e) {
    throw new Error(e)
  }
}

/**
 * richMenuIdに対して画像をアタッチする
 * @param {string} richMenuId - リッチメニューID
 * @param {file} file - 画像ファイル
 */
function uploadImage(richMenuId, file) {
  // 画像のblobを取得
  const blob = file.getAs(MimeType.PNG)

  const headers = {
    'Content-Type': 'image/png',
    'Authorization': 'Bearer ' + access_token,
  };

  const options = {
    'method': 'post',
    'headers': headers,
    'payload': blob,
  };

  try {
    UrlFetchApp.fetch(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, options);
    return
  } catch (e) {
    console.log(e)
    throw new Error('リッチメニューに画像を紐づけることに失敗しました')
  }
}
