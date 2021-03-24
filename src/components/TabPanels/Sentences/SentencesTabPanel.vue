<template>
  <q-tab-panel :name="name" ref="alpha" @click="clickEvent">
    <div style="font-size: 2em;">
      <WordSpan v-for="i in sentences.split(' ').length" :key="i" ref="wordInPar" :word="sentences.split(' ')[i - 1]" v-on:word-clicked="activateTranslationDivOnRow" :index="i - 1"/>
    </div>
  </q-tab-panel>
</template>

<script>
import WordSpan from 'components/TabPanels/Sentences/WordSpan'
import TranslationDiv from 'components/TabPanels/Sentences/TranslationDiv'
import Vue from 'vue'

export default {
  name: 'SentencesTabPanel',

  components: {
    WordSpan,
    // eslint-disable-next-line vue/no-unused-components
    TranslationDiv
  },

  props: {
    name: String,
    sentences: String
  },

  data: function () {
    return {
      lastInLineWordInPar: [],
      translationDivs: [],
      translationsToShow: Object,
      activeTranslationDiv: null,
      activeWord: ''
    }
  },

  methods: {
    forceUpdateTranslationDiv: function () {
      if (this.activeTranslationDiv) {
        this.activeTranslationDiv.$forceUpdate()
      }
    },

    highlightLinkedWordSpanByIndex: function (index) {
      this.$refs.wordInPar.forEach((wip) => {
        if (parseInt(index) !== parseInt(wip.index)) {
          wip.isHighlightedByTransalation = false
          return
        }

        wip.isHighlightedByTransalation = true
      })
    },

    unhighlightAllLinkedWordSpan: function () {
      this.$refs.wordInPar.forEach((wip) => {
        wip.isHighlightedByTransalation = false
      })
    },

    activateTranslationDivOnRow: function (wordInPar) {
      const row = wordInPar.row
      let activeTranslationDiv = null

      this.$refs.wordInPar.forEach((inLoopWordInPar) => {
        if (wordInPar === inLoopWordInPar) {
          return
        }

        inLoopWordInPar.clicked = false
      })

      this.translationDivs.forEach((translationDiv) => {
        if (row === translationDiv.row) {
          activeTranslationDiv = translationDiv
          activeTranslationDiv.key = wordInPar.index
          activeTranslationDiv.$forceUpdate()
          activeTranslationDiv.isManualTranslated = false
          activeTranslationDiv.show()

          return
        }

        translationDiv.hide()
      })

      this.changeActiveWord(wordInPar.word)

      activeTranslationDiv.wordSpanIndex = wordInPar.index

      activeTranslationDiv.showDict(this.translationsToShow)

      this.$emit('wcs-sent-from-activated-div', activeTranslationDiv)

      this.activeTranslationDiv = activeTranslationDiv

      return activeTranslationDiv
    },

    changeActiveWord: function (word) {
      this.activeWord = word

      this.$emit('active-word-changed', word)
    },

    clickEvent: function (whatever) {
    },

    createTranslationDiv: function (lastInLineWordInPar) {
      const TranslationDivClass = Vue.extend(TranslationDiv)

      const sentencesTabPanelInstance = this

      lastInLineWordInPar.forEach((wordInPar) => {
        const translationDiv = new TranslationDivClass({
          propsData: {
            dpText: 'Ya beginilah',
            active: false,
            row: wordInPar.row,
            key: wordInPar.index
          },
          created: function () {
            this.$on('a-chip-selected', (data) => { sentencesTabPanelInstance.sendWCSToTranslationBuilder(data) })
            this.$on('pass-coordinate', (coordinate) => { sentencesTabPanelInstance.passCoordinate(coordinate) })
          }
        })

        const parentComp = wordInPar.$parent

        const containerEl = parentComp.$el.childNodes[0]

        translationDiv.$mount()

        containerEl.insertBefore(translationDiv.$el, wordInPar.$el.nextSibling)

        this.translationDivs.push(translationDiv)
      })
    },

    sendWCSToTranslationBuilder: function (data) {
      this.$emit('there-is-wcs-to-be-sent-to-trans-builder', data)
    },

    passCoordinate: function (coordinate) {
      this.$emit('pass-coordinate', coordinate)
    }
  },

  mounted: function () {
    const firstWordInPar = this.$refs.wordInPar[0]
    let currentRow = 1

    firstWordInPar.row = currentRow
    const firstRowTopRectY = firstWordInPar.$el.getBoundingClientRect().top

    let currentRowTopRectY = firstRowTopRectY

    let i

    // note: wordInPar means word in paragraph
    // adding pointers to every component that ending the line
    for (i in this.$refs.wordInPar) {
      if ((this.$refs.wordInPar[i].$el.getBoundingClientRect().top) === currentRowTopRectY) {
        this.$refs.wordInPar[i].row = currentRow
      } else if ((this.$refs.wordInPar[i].$el.getBoundingClientRect().top) >= currentRowTopRectY) {
        currentRow += 1
        currentRowTopRectY = this.$refs.wordInPar[i].$el.getBoundingClientRect().top

        this.$refs.wordInPar[i].row = currentRow

        this.lastInLineWordInPar.push(this.$refs.wordInPar[i - 1])
      }

      // adding pointer to the last row
      if (parseInt(i) === (this.$refs.wordInPar.length - 1)) {
        if (this.$refs.wordInPar[i] !== this.lastInLineWordInPar[this.lastInLineWordInPar.length - 1]) {
          this.lastInLineWordInPar.push(this.$refs.wordInPar[i])
        }
      }
    }

    this.createTranslationDiv(this.lastInLineWordInPar)
  }
}

</script>

<style>

</style>
