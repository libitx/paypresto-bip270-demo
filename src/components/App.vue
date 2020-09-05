<template>
  <div class="mw7 center pv4">
    <h1 class="mt0 mb4 f2 lh-title">Paypresto BIP270 demo</h1>
    <p class="mt0 mb3 f5 lh-copy">
      This page demonstrates Paypresto's BIP270 implementation, which more
      closely follows <a href="https://github.com/moneybutton/bips/blob/master/bip-0270.mediawiki" class="link blue hover-hot-pink">the spec</a>
      than the existing Handcash BIP270-ish implementation.
    </p>
    <p class="mt0 mb3 f5 lh-copy">
      This demo will create two transactions: a funding tx sent from your BIP270
      compatible wallet; and a secondary "hello world" data transaction.
    </p>


    <div v-if="status === 0">
      <a class="dib pa3 link white bg-blue dim pointer"
        @click="createTx">
        Create transaction
      </a>
    </div>

    <div ref="widget" class="mb3"></div>
    <pre class="mt0 mb3 pa2 f6 lh-copy near-white bg-dark-gray br2"
      v-if="txid">{{ txid }}</pre>

    <footer class="mt5 pv3 bt b--moon-gray">
      <p class="mv0 f7 lh-copy"><a href="http://www.paypresto.co" class="link blue hover-hot-pink">Paypresto</a></p>
    </footer>

  </div>
</template>

<script>
import { Presto, embed } from 'paypresto.js'
import keystore from 'keystore'

export default {
  data() {
    return {
      status: 0,
      invoiceId: null,
      txid: null
    }
  },

  created() {
    keystore.init()
  },

  methods: {
    createTx() {
      if (!this.invoiceId) {
        this.status = 1
        const payment = Presto.create({
          key: keystore.privKey,
          description: 'Paypresto BIP270 demo',
          outputs: [{ data: ['Hello world! From Paypresto'] }]
        })

        payment.mount(embed(this.$refs.widget, { payWith: ['bip270']}))

        payment
          .on('invoice', invoice => {
            console.log('locking script invoiced')
            this.invoiceId = invoice.id
          })
          .on('funded', payment => {
            console.log('locking script funded')
            payment.pushTx()
          })
          .on('success', ({ txid }) => {
            console.log('locking script pushed')
            this.txid = txid
          })
          .on('error', err => {
            console.error(err)
            alert('Something went wrong. Check browser console.')
          })
      }
    }
  }
}
</script>