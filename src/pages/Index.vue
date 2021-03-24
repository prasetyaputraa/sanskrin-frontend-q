<template>
  <q-page class="">
    <div class="q-pa-lg fit row justify-center items-start q-col-gutter-sm">
      <div class="col-xs-12 col-md-6 flex fit" style="padding: 0">
        <q-card flat bordered class="my-card fit">
        <form @submit.prevent="requestTranslation">
          <q-card-section style="padding-top: 2em">
            <div class="gutter-sm row justify-center">
              <q-input @keydown.ctrl.enter.prevent="requestTranslation" type="textarea" class="col-md-6 col-sm-12 input-text-sanskrit" v-model="inputText" label="Kalimat dalam Sansekerta..." />
              <q-input borderless type="textarea" class="col-md-6 col-sm-12 output-text-indonesian" v-model="outputText" label="Kalimat dalam Indonesia..." />
            </div>
          </q-card-section>

          <!-- <q-separator /> -->

          <q-card-actions class="q-card-actions-translate" align="center">
            <q-btn type="submit" flat padding="1em" class="fit" color="primary" :loading="submitting">
              <template v-slot:loading>
                <q-spinner-cube/>
              </template>
              Terjemahkan
            </q-btn>
          </q-card-actions>
        </form>
        </q-card>
      </div>
      <div class="col-xs-12 col-md-6 flex fit">
      </div>
    </div>

    <!-- START OF: the second part of the page (after the translation boxes) -->

    <div class="q-pa-lg fit row items-start justify-center content-start q-gutter-x-lg">
      <q-list bordered class="col-6 rounded-borders bg-white">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <!-- <q-tab name="statistical" label="Statistical" /> -->
          <q-tab name="dictionary" label="Kamus" />
          <q-tab name="bysentences" label="Tampilan dalam Kalimat" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>

          <!-- START OF: Statistical tab panel -->
          <q-tab-panel name="statistical">
            <div class="row fit justify-between items-center">
              <div class="col-md-6">
                <div class="row fit justify-start">
                  <h6 style="margin: 1em 1em 1em 1em">Distribusi Semantik</h6>
                </div>
              </div>
              <div class="col-md-6 small-fit">
                <div class="row fit justify-end q-gutter-xs small-justify-center">
                  <q-btn-toggle unelevated no-caps style="border: 1px solid silver !important"
                    v-model="percentOccurenceToggle"
                    @input="handlePercentOccurenceToggle"
                    toggle-color="primary"
                    color="white"
                    text-color="primary"
                    :options="[
                      {label: '# okurensi', value: 'occurence'},
                      {label: '% persentase', value: 'percentage'}
                    ]"
                  />
                  <q-btn unelevated style="border: 1px solid silver !important"
                    :ripple="false"
                    size="md"
                    color="white"
                    text-color="primary"
                    :icon="collapseIcon"
                    class="right-button-in-distribution"

                    @click="handleCollapseOrExpandAll"
                  >
                    <q-tooltip content-class="silver">Collapse/Expand All</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
            <ExpansionItemForSanskrit
              ref="collapsible"

              v-for="word in Object.keys(sanskritWords)"
              :key="word"
              :word="word"
              :wordChipData="{'sanskritWords': sanskritWords}"

              @input="handleExpansionItemForSanskritToggle"
            />
          </q-tab-panel>
          <!-- END OF: Statistical tab panel -->

          <!-- START OF: Dictionary tab panel -->
          <DictionaryTabPanel name="dictionary" title="Ditemukan dalam Kamus" :sanskritWords="sanskritWords"/>
          <!-- END OF: Dictionary tab panel -->

          <SentencesTabPanel
            name="bysentences"
            :sentences="sentences"
            :key="sentences"
            ref="sentencesTabPanel"
            @active-word-changed="sendTranslations"
            @there-is-wcs-to-be-sent-to-trans-builder="pushTranslationFromWCS"
            @pass-coordinate="addToSelectedCoordinates"
            @wcs-sent-from-activated-div="turnSelectedOnSelectedWCS"
          />
        </q-tab-panels>
      </q-list>

      <TranslationBuilderCard
        :list="wordChipsToShowOnTranslationBuilderCard" ref="transBuilder"
        @word-span-moved="moveWordChipsToShowArray"
        @add-new-phrase="addManualTrans"
        @change-to-new-phrase="changeToManualTrans"
        @a-word-hovered="highlightWordInSentencesPanel"
        @hover-out="unhighlightWordSpanInSentencesPanel"
      ></TranslationBuilderCard>
    </div>

    <!-- END OF: the second part of the page (after the translation boxes) -->

  </q-page>
</template>

<script>
import DictionaryTabPanel from 'components/TabPanels/Dictionary/DictionaryTabPanel'
import SentencesTabPanel from 'components/TabPanels/Sentences/SentencesTabPanel'
import ExpansionItemForSanskrit from 'components/ExpansionItemForSanskrit'
import TranslationBuilderCard from 'components/TranslationBuilder/TranslationBuilderCard'

export default {
  name: 'PageIndex',

  components: {
    ExpansionItemForSanskrit,
    DictionaryTabPanel,
    SentencesTabPanel,
    TranslationBuilderCard
  },

  methods: {
    turnSelectedOnSelectedWCS: function (activatedTranslationDiv) {
      activatedTranslationDiv.selectedCoordinatesGotFromRoot = this.selectedCoordinates
      // console.log('EVENT CALLBACK FIRED')
      // console.log(wcsesOnDiv)
      // wcsesOnDiv.forEach((wcs) => {
      //   this.selectedCoordinates.forEach((coordinate) => {
      //     if (JSON.parse(JSON.stringify(wcs.coordinate)) === JSON.parse(JSON.stringify(coordinate))) {
      //       wcs.selected = true
      //     }
      //   })
      // })
    },

    unhighlightWordSpanInSentencesPanel: function () {
      this.$refs.sentencesTabPanel.unhighlightAllLinkedWordSpan()
    },

    highlightWordInSentencesPanel: function (index) {
      if (index >= 0) {
        this.$refs.sentencesTabPanel.highlightLinkedWordSpanByIndex(index)
      }
    },

    moveWordChipsToShowArray: function (evt) {
      this.selectedCoordinates.splice(
        evt.moved.newIndex,
        0,
        this.selectedCoordinates.splice(evt.moved.oldIndex, 1)[0]
      )
    },

    addToSelectedCoordinates: function (coordinate) {
      if (!coordinate.old) {
        this.selectedCoordinates.push(coordinate.new)
      } else {
        const parsedOldCoord = JSON.parse(JSON.stringify(coordinate.old))
        this.selectedCoordinates.forEach((sc, index) => {
          const parsedSC = JSON.parse(JSON.stringify(sc))

          if (parsedOldCoord[0] === parsedSC[0] &&
              parsedOldCoord[1] === parsedSC[1] &&
              parsedOldCoord[2] === parsedSC[2]
          ) {
            this.selectedCoordinates[index] = coordinate.new
          }
        })
      }
    },

    pushTranslationFromWCS: function (data) {
      console.log('THE THING IS I AM BEING RUN TOO')
      const __data = {
        wordSpanIndex: data.wordSpanIndex,
        translation: data.wcs.translation,
        coordinate: data.wcs.coordinate
      }
      let i

      for (i in this.wordChipsToShowOnTranslationBuilderCard) {
        if (this.wordChipsToShowOnTranslationBuilderCard[i].wordSpanIndex === __data.wordSpanIndex) {
          this.wordChipsToShowOnTranslationBuilderCard[i] = __data

          this.$refs.transBuilder.$forceUpdate()
          // this.$refs.transBuilder.updateDraggable()

          return
        }
      }

      this.wordChipsToShowOnTranslationBuilderCard.push(__data)
    },

    addManualTrans: function (data) {
      const __data = {
        wordSpanIndex: data.data.wordSpanIndex,
        translation: data.data.translation,
        coordinate: data.data.coordinate
      }

      let replaceWSIndex = -1
      let after = 0
      let i

      for (i in this.wordChipsToShowOnTranslationBuilderCard) {
        if (parseInt(this.wordChipsToShowOnTranslationBuilderCard[i].wordSpanIndex) <= parseInt(replaceWSIndex)) {
          replaceWSIndex -= 1
        }

        if (parseInt(this.wordChipsToShowOnTranslationBuilderCard[i].wordSpanIndex) === parseInt(data.after)) {
          after = i
        }
      }

      __data.wordSpanIndex = replaceWSIndex
      __data.coordinate[0] = replaceWSIndex

      this.wordChipsToShowOnTranslationBuilderCard.splice((parseInt(after) + 1), 0, __data)
      this.selectedCoordinates.splice((parseInt(after) + 1), 0, __data.coordinate)
    },

    changeToManualTrans: function (data) {
      const __data = {
        wordSpanIndex: data.data.wordSpanIndex,
        translation: data.data.translation,
        coordinate: data.data.coordinate
      }

      let i

      for (i in this.wordChipsToShowOnTranslationBuilderCard) {
        if (this.wordChipsToShowOnTranslationBuilderCard[i].wordSpanIndex === __data.wordSpanIndex) {
          this.wordChipsToShowOnTranslationBuilderCard[i] = __data
          this.selectedCoordinates[i] = __data.coordinate
        }
      }

      this.$refs.sentencesTabPanel.forceUpdateTranslationDiv()
    },

    requestTranslation: function () {
      if (this.inputText === '') {
        return
      }

      const words = this.inputText.split(' ')

      this.selectedCoordinates = []

      if (words.length === 1) {
        this.submitting = true

        const word = this.inputText.trim()

        this.$axios
          .get(`/translate/word/?word=${word}`)
          .then((response) => {
            this.sanskritWords = response.data.translation
            this.submitting = false
          }).catch((error) => {
            if (!error.response) {
              this.$q.notify({ message: 'Connection refused, server unreachable.', type: 'negative', position: 'top', timeout: 3000 })
            }

            this.submitting = false
          })
      } else {
        this.submitting = true
        this.wordChipsToShowOnTranslationBuilderCard = []

        const sentence = this.inputText.trim()

        this.$axios
          .post('/translate/sentences/', {
            sentence: sentence
          }).then((response) => {
            this.sentences = response.data.sentence
            this.words = this.sentences.split(' ')
            this.sanskritWords = response.data.translations
            this.submitting = false
          }).catch((error) => {
            if (!error.response) {
              this.$q.notify({ message: 'Connection refused, server unreachable.', type: 'negative', position: 'top', timeout: 3000 })
            }

            this.submitting = false
          })
      }
    },

    isAllCollapsed: function () {
      let collapsible
      for (collapsible in this.$refs.collapsible) {
        if (this.$refs.collapsible[collapsible].expanded) return false
      }

      return true
    },

    handlePercentOccurenceToggle: function (value) {
      let collapsible
      for (collapsible in this.$refs.collapsible) {
        const currColl = this.$refs.collapsible[collapsible]
        let wordChip

        for (wordChip in currColl.$refs.wordchip) {
          currColl.$refs.wordchip[wordChip].toggleToShow(value)
        }
      }
    },

    handleExpansionItemForSanskritToggle: function (targetValue) {
      // target value sends the value of clicked collapsible
      this.changeCollapseExpandAllIcon()
    },

    handleCollapseOrExpandAll: function () {
      const action = (this.collapseIcon === 'expand_less') ? 'hide' : 'show'

      let collapsible

      for (collapsible in this.$refs.collapsible) {
        if (action === 'show') {
          this.$refs.collapsible[collapsible].expanded = true
        }

        if (action === 'hide') {
          this.$refs.collapsible[collapsible].expanded = false
        }
      }

      this.changeCollapseExpandAllIcon()
    },

    changeCollapseExpandAllIcon: function () {
      if (this.isAllCollapsed()) {
        this.collapseIcon = 'expand_more'
      } else {
        this.collapseIcon = 'expand_less'
      }
    },

    sendTranslations: function (word) {
      let translations

      try {
        translations = JSON.parse(this.sanskritWords[word.trim()])
      } catch (err) {
        translations = null
      }

      this.$refs.sentencesTabPanel.translationsToShow = translations
    }
  },

  data: () => {
    return {
      submitting: false,
      sentences: '',
      wordChipsToShowOnTranslationBuilderCard: [],
      tab: 'dictionary',
      percentOccurenceToggle: 'percentage',
      collapseIcon: 'expand_less',
      inputText: '',
      outputText: '',
      sanskritWords: {
      },
      selectedCoordinates: []
    }
  }
}
</script>

// limited to the components in this SFC, but do not achievable if scoped
// the reason is that this scss trying to style
// inner component of component defined here
<style lang="scss">
  .q-field {
    @media only screen and (max-width: 720px) {
      width: 100% !important;
      height: 100% !important;
    }
  }

  .input-text-sanskrit {
    .q-field__inner {
      .q-field__control {
        padding-left: 24px !important;

        border-radius: 5px !important;
        border-top-right-radius: 0px !important;
        border-bottom-right-radius: 0px !important;

        border-right: 1px solid silver;

        @media only screen and (max-width: 720px) {
          border-right: none;
          border-bottom: 1px solid silver;
        }
        textarea {
          resize: none;
        }
      }
    }
  }

  .output-text-indonesian {
    .q-field__inner {
      .q-field__control {
        padding-left: 24px !important;

        border-radius: 5px !important;
        border-top-left-radius: 0px !important;
        border-bottom-left-radius: 0px !important;
        textarea {
          resize: none;
        }
      }
    }
  }

  .right-button-in-distribution {
    .q-btn__wrapper {
      padding: 4px;
    }
  }

  .gigante {
    margin-top: 16px;
    margin-left: -16px;
    margin-right: -16px;
    width: 100%;
    height: 200px;
    background-color: dodgerblue;
  }
</style>

// scoped styling
<style lang="scss" scoped>
  @media only screen and (max-width: 720px) {
      .small-justify-center {
          justify-content: center;
          margin-bottom: 8px !important;
      }

      .small-fit {
        width: 100% !important;
        height: 100% !important;
      }
  }

  .q-card-actions-translate {
    padding: 0 !important;
  }

  .q-list--bordered {
    padding-right: 8px;
    padding-bottom: 8px;
  }
</style>
