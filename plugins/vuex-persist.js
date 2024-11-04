import VuexPersistence from 'vuex-persist'
import Crypto from 'crypto-js'
import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'

/**
 * Encrypts the state before it is stored in the localStorage.
 *
 * @see https://sandulat.com/safely-persisting-vuex-store-in-local-storage/
 */

export default ({ store, $config }) => {
  const cookieName = 'stateCookie'
  const storageKey = 'stateKey'
  const encryptionToken = Cookies.get(cookieName) || uuidv4()
  let persistentModules = []

  Cookies.set(cookieName, encryptionToken, {
    secure: $config.environment === 'production',
    expires: 2, // days
  })

  if ($config !== 'production') {
    persistentModules = $config.persistentVuexModules
  } else {
    persistentModules = [ 'auth' ]
  }

  new VuexPersistence({
    storage: {
      getItem: () => {
        const storage = window.localStorage.getItem(storageKey)

        if (storage) {
          try {
            const bytes = Crypto.AES.decrypt(storage, encryptionToken)

            return JSON.parse(bytes.toString(Crypto.enc.Utf8))
          } catch (e) {
            window.localStorage.removeItem(storageKey)
          }
        }

        return null
      },
      setItem: (key, value) => {
        const storage = Crypto.AES.encrypt(value, encryptionToken).toString()

        return window.localStorage.setItem(storageKey, storage)
      },
      removeItem: () => window.localStorage.removeItem(storageKey),
    },
    modules: persistentModules,
  }).plugin(store)
}