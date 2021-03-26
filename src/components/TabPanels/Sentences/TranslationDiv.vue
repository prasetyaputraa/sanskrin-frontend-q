<template>
  <div v-if="active" class="base-ground">
    <q-card flat class="base-card bg-grey-3 text-white">
      <q-card-section v-if="translations">
        <q-card flat bordered class="test-many text-black bg-grey-2"
          v-for="index in Object.keys(translations.sanskrit)" :key="parseInt(index)"
          :index="parseInt(index)"
        >
          <q-card-section style="padding-top: 0px; padding-left: 0px; padding-bottom: 8px">
            <div class="text-h6">
              {{translations.sanskrit[index]}}
            </div>
          </q-card-section>
          <q-separator inset/>
          <!-- <q-card-section> -->
            <WordChipSen v-for="translation in explodeTranslations(translations.translations[parseInt(index)], ';')"
              :sanskritIndex="parseInt(index)"
              :translation="translation"
              :key="translation"
              :index="explodeTranslations(translations.translations[parseInt(index)], ';').indexOf(translation)"
              :wordSpanIndex="wordSpanIndex"
              ref="wordChipSen"
            />
          <!-- </q-card-section> -->
        </q-card>
      </q-card-section>
      <q-card-section v-else>
        <h6 class="text-red">Terjemahan tidak ditemukan dalam kamus.</h6>
      </q-card-section>
      <q-card-section>
        <q-btn unelevated no-caps class="fit" :color="(isManualTranslated) ? 'green' : 'primary'" icon-right="keyboard_arrow_right">Terjemahkan secara manual</q-btn>
        <!-- <q-bar v-ripple>Terjemahkan secara manual</q-bar> -->
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import WordChipSen from 'components/TabPanels/Sentences/WordChipSen'

export default {
  name: 'TranslationDiv',

  components: {
    WordChipSen
  },

  props: {
    active: Boolean,
    translations: Object,
    row: Number
  },

  methods: {
    explodeTranslations: function (translationsString, delimiter) {
      if (translationsString === null) {
        return []
      }

      const translations = translationsString.split(delimiter)

      return translations
    },

    hide: function () {
      this.active = false
    },

    show: function () {
      this.active = true
    },

    showDict: function (translations) {
      this.translations = translations
    },

    sendWord: function (index, translation) {
      this.$emit('add-to-translation', translation)
    }
  },

  data: function () {
    return {
      WordChipSenGroups: {},
      wordSpanIndex: null,
      selectedCoordinatesGotFromRoot: [],
      isManualTranslated: false,
      recurse: 1
    }
  },

  mounted: function () {
    this.selectedWcs = null
    this.wordSpanLinked = null
    this.isManualTranslated = false
  },

  updated: function () {
    console.log('HISTORIA CHAN', this.wordSpanIndex)
  }
}
</script>

<style lang="scss">
  .base-ground {
    margin-top: 16px;
    width: 100%;
    // height: 50px;
    // background-color: blue;
  }

  .base-card {
    padding: 16px;
  }

  .test-many {
    display: inline-block;
    padding: 24px;
    margin-bottom: 16px;
    margin-right: 24px;
    max-width: 50%;
  }
</style>
