import { PrivKey } from 'bsv'

const LOCAL_STORAGE_KEY = 'paypresto_bip270_demo_k1'

export default {
  privKey: null,

  init() {
    let wif
    if (wif = localStorage.getItem(LOCAL_STORAGE_KEY)) {
      this.privKey = PrivKey.fromWif(wif)
    } else {
      this.privKey = PrivKey.fromRandom()
      localStorage.setItem(LOCAL_STORAGE_KEY, this.privKey.toWif())
    }
  }
}