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
          />
        </q-tab-panels>
      </q-list>

      <TranslationBuilderCard
        :list="wordChipsToShowOnTranslationBuilderCard" ref="transBuilder"
      ></TranslationBuilderCard>
    </div>

    <!-- END OF: the second part of the page (after the translation boxes) -->

  </q-page>
</template>

<script>
import DictionaryTabPanel from 'components/TabPanels/Dictionary/DictionaryTabPanel'
import SentencesTabPanel from 'components/TabPanels/Sentences/SentencesTabPanel'
import TranslationBuilderCard from 'components/TranslationBuilder/TranslationBuilderCard'

import Vue from 'vue'

alert(Vue.version)

export default {
  name: 'PageIndex',

  components: {
    DictionaryTabPanel,
    SentencesTabPanel,
    TranslationBuilderCard
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
      sanskritWords: {},
      selectedCoordinates: []
    }
  },

  methods: {
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

    sendTranslations: function (word) {
      let translations

      try {
        translations = JSON.parse(this.sanskritWords[word.trim()])
      } catch (err) {
        translations = null
      }

      this.$refs.sentencesTabPanel.translationsToShow = translations
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
