const YTM_DL_APP_STATE_INPUT_ID = 'ytm-dl-ytmusic-app-state'
const YTM_DL_DOWNLOAD_BUTTON_ID = 'ytm-dl-download-button'

const bindInputElem = (elemId, action) => {
  const inputElem = document.getElementById(elemId) || document.createElement('input')
  inputElem.id = elemId
  inputElem.style.display = 'none'
  inputElem.addEventListener('change', (e) => {
    chrome.runtime.sendMessage({
      action,
      value: e.target.value
    })
  })
  document.body.appendChild(inputElem)
}

(() => {
  bindInputElem(YTM_DL_APP_STATE_INPUT_ID, 'newYtMusicAppState')

  const downloadButtonElem = document.getElementById(YTM_DL_DOWNLOAD_BUTTON_ID) || document.createElement('button')
  downloadButtonElem.id = YTM_DL_DOWNLOAD_BUTTON_ID
  downloadButtonElem.style.display = 'none'
  downloadButtonElem.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      action: 'downloadFromPlayerButton',
      state: document.getElementById(YTM_DL_APP_STATE_INPUT_ID).value
    })
  })
  document.body.appendChild(downloadButtonElem)

  const scriptElem = document.createElement('script')
  scriptElem.setAttribute('type', 'text/javascript')
  scriptElem.setAttribute('src', chrome.runtime.getURL('content-script.js'))
  document.body.appendChild(scriptElem)
})()
