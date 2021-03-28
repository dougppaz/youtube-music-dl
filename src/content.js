import downloadSvg from './imgs/download.svg'

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
  scriptElem.innerHTML = `
    function youtubeMusicDLWatch (elemId, getValueFn) {
      var inputElem = document.getElementById(elemId);
      var currentValue = null;

      setInterval(function () {
        var value = getValueFn();

        if (currentValue !== value) {
          currentValue = value;
          console.log('new value for', elemId, '->', value);
          inputElem.value = value;
          inputElem.dispatchEvent(new Event('change'));
        }
      }, 1000);
    }

    function createDownloadBtn () {
      const elem = document.createElement('tp-yt-paper-icon-button');
      setTimeout(function () {
        elem.$.icon.innerHTML = \`
          ${downloadSvg}
        \`
      }, 500);
      elem.onclick = function () {
        var downloadButtonElem = document.getElementById('${YTM_DL_DOWNLOAD_BUTTON_ID}');
        downloadButtonElem.click();
      }
      return elem;
    }

    function insertDownloadBtn () {
      const expandBtn = document.querySelector('tp-yt-paper-icon-button.expand-button.ytmusic-player-bar');
      const downloadBtn = createDownloadBtn();
      downloadBtn.classList.add('ytmusic-player-bar');
      expandBtn.parentElement.insertBefore(downloadBtn, expandBtn);
    }

    youtubeMusicDLWatch(
      '${YTM_DL_APP_STATE_INPUT_ID}',
      function () {
        return JSON.stringify(document.querySelector('ytmusic-app').getState());
      }
    );

    insertDownloadBtn();
  `
  document.body.appendChild(scriptElem)
})()
