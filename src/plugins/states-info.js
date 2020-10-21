export default {
  async install (Vue, { videoStates: states, tab }) {
    const getState = states => (states[tab.id])

    Vue.prototype.$videoStates = Vue.observable({ states: getState(states) })

    chrome.runtime.onMessage.addListener(async (message) => {
      switch (message.action) {
        case 'videoStatesUpdated':
          console.log('video states updated')
          Vue.set(
            Vue.prototype.$videoStates,
            'states',
            getState(message.videoStates)
          )
          break

        default:
          console.log('[state-info plugin] new message', message)
      }
    })
  }
}
