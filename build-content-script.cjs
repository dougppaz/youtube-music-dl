const fs = require('node:fs')
const ssri = require('ssri')
const downloadSvg = fs.readFileSync('./src/imgs/download.svg')
const YTM_DL_APP_STATE_INPUT_ID = 'ytm-dl-ytmusic-app-state'
const YTM_DL_DOWNLOAD_BUTTON_ID = 'ytm-dl-download-button'

const content = `
  const escapeHTMLPolicy = trustedTypes.createPolicy('forceInner', {
    createHTML: (to_escape) => to_escape
  })

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
      elem.$.icon.innerHTML = escapeHTMLPolicy.createHTML('${downloadSvg.toString().trim()}')
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

const integrityObj = ssri.fromData(content)
const integrity = integrityObj.toString()

module.exports = () => {
  return {
    content,
    integrity,
  }
}
