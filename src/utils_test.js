import assert from 'assert'
import utils from './utils.js'

// Eslint error with no ignore: https://github.com/eslint/eslint/discussions/15305
import YTMusicAppStateMock1 from './test_mocks/ytmusic-app-state-1.json' with { type: "json" }
import YTMusicAppStateMock2 from './test_mocks/ytmusic-app-state-2.json' with { type: "json" }
import YTMusicAppStateMock3 from './test_mocks/ytmusic-app-state-3.json' with { type: "json" }
import YTMusicAppStateMock4 from './test_mocks/ytmusic-app-state-4.json' with { type: "json" }

describe('utils', () => {
  describe('#getMusicTagsFromYTMusicAppState()', () => {
    it('Mock 1', () => {
      assert.deepStrictEqual(
        utils.getMusicTagsFromYTMusicAppState(YTMusicAppStateMock1),
        {
          title: 'Oasis (Ao Vivo no Estúdio MangoLab)',
          artist: 'Potyguara Bardo, MangoLab',
          album: 'Oasis (Ao Vivo no Estúdio MangoLab)',
          track: null,
          genre: null,
          year: 2019,
          coverUrl: 'https://lh3.googleusercontent.com/F0TqhiZZ0_TwnbtXKbmhPkiMKx3S9ryXPzlcB2w9ojM-kCB9PEublvq3E8OB5bFbcdDJQpjYwAvVSIy45Q=w544-h544-l90-rj'
        }
      )
    })

    it('Mock 2', () => {
      assert.deepStrictEqual(
        utils.getMusicTagsFromYTMusicAppState(YTMusicAppStateMock2),
        {
          title: 'AmarElo (Sample: Sujeito de Sorte - Belchior) (part. Majur e Pabllo Vittar)',
          artist: 'Emicida',
          album: 'AmarElo (Sample: Sujeito de Sorte - Belchior)',
          track: null,
          genre: null,
          year: 2019,
          coverUrl: 'https://lh3.googleusercontent.com/qntNlGkVK1An5SR5nAw6ASXeyBu3JvuSVEPBML6rRrRgKjPNdQEGSMdNy5jbKJSrgjumS5R9hU0fWPsR=w544-h544-l90-rj'
        }
      )
    })

    it('Mock 3', () => {
      assert.deepStrictEqual(
        utils.getMusicTagsFromYTMusicAppState(YTMusicAppStateMock3),
        {
          title: 'Meu Jeito de Amar',
          artist: 'Omulu, Lux & Tróia, DUDA BEAT',
          album: 'Meu Jeito de Amar',
          track: null,
          genre: null,
          year: 2019,
          coverUrl: 'https://lh3.googleusercontent.com/tq3tDp8XrcBVz0pqsZ_AI_QYZlYdPN9jm7ZV_NbvNNPapyQjunJ5PvJQ-oDAr52fL9sHIphZbN3rFEH6=w544-h544-l90-rj'
        }
      )
    })

    it('Mock 4', () => {
      // Test from https://music.youtube.com/watch?v=_7SqQa_6ywA&list=RDCLAK5uy_mb6USApIgQTkWJBW1MhquqHg_zlq4kdjk&index=0
      assert.deepStrictEqual(
        utils.getMusicTagsFromYTMusicAppState(YTMusicAppStateMock4),
        {
          title: 'Deu Onda',
          artist: 'Mc G15, DJ Jorgin',
          album: 'Deu Onda',
          track: null,
          genre: null,
          year: 2020,
          coverUrl: 'https://lh3.googleusercontent.com/lw0wqcYtG1xyQWzZ3D_2-WCjf1JENxlkJv4Nod6wjAaibvGb9dr6oGcOeZsV7Wf_PlzYj7iwauqKjXnI=w544-h544-l90-rj'
        }
      )
    })
  })
})
