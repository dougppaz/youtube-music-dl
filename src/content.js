const VIDEO_ID_INPUT_ID = 'ytm-dl-video-id'

const inputElem = document.getElementById(VIDEO_ID_INPUT_ID) || document.createElement('input')
inputElem.id = VIDEO_ID_INPUT_ID
inputElem.style.display = 'none'
inputElem.addEventListener('change', (e) => {
  chrome.runtime.sendMessage({
    action: 'newVideoId',
    videoId: e.target.value
  })
})
document.body.appendChild(inputElem)

const scriptElem = document.createElement('script')
scriptElem.innerText = `
  var inputElem = document.getElementById('${VIDEO_ID_INPUT_ID}');
  var currentVideoId = null;
  setInterval(function () {
    var playerResponse_ = document.querySelector('ytmusic-app').$['player-page'].$.player.playerResponse_;
    var videoId = (playerResponse_ && playerResponse_.videoDetails && playerResponse_.videoDetails.videoId) || null;
    if (currentVideoId !== videoId) {
      currentVideoId = videoId;
      console.log('new video id', videoId);
      inputElem.value = videoId;
      inputElem.dispatchEvent(new Event('change'));
    }
  }, 1000);
`
document.body.appendChild(scriptElem)
