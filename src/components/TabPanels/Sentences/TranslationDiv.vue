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
              :group="getWordChipSenGroup(index)"
              :translation="translation"
              :key="translation"
              :index="explodeTranslations(translations.translations[parseInt(index)], ';').indexOf(translation)"
              :wordSpanIndex="wordSpanIndex"
              ref="wordChipSen"
              @can-i-be-selected="canAWCSbeSelected"
              @get-selected="deselectOtherWCS"
              @pass-coordinate="passCoordinate"
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
    canAWCSbeSelected: function (wcs) {
      if (this.isManualTranslated) {
        this.selectedWcs = wcs
        wcs.proceedSelection([this.wordSpanIndex, -1, -1])

        return
      }

      if (!this.selectedWcs) {
        this.selectedWcs = wcs
        wcs.proceedSelection()
      } else {
        this.selectedWcs = wcs
        wcs.proceedSelection(this.selectedWcs.coordinate)
      }
    },

    passCoordinate: function (coordinate) {
      this.$emit('pass-coordinate', coordinate)
    },

    explodeTranslations: function (translationsString, delimiter) {
      if (translationsString === null) {
        return []
      }

      const translations = translationsString.split(delimiter)

      return translations
    },

    getWordChipSenGroup: function (index) {
      let group = this.WordChipSenGroups[index]

      if (!group) {
        group = []
        this.WordChipSenGroups[index] = group
      }

      return group
    },

    getOtherWCSGroups: function (index) {
      const groups = []

      let i

      const indexes = Object.keys(this.translations.sanskrit)

      for (i in indexes) {
        if (parseInt(index) !== parseInt(indexes[i])) {
          groups.push(this.getWordChipSenGroup(i))
        }
      }

      return groups
    },

    deselectOtherWCS: function (wcs) {
      this.$emit('a-chip-selected', { wordSpanIndex: this.wordSpanIndex, wcs: wcs })

      this.isManualTranslated = false

      this.$refs.wordChipSen.forEach((pointedWcs) => {
        if (pointedWcs !== wcs) {
          pointedWcs.selected = false
        }
      })
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
      // selectedWcs: null
    }
  },

  mounted: function () {
    this.selectedWcs = null
    this.wordSpanLinked = null
    this.isManualTranslated = false
  },

  beforeUpdate: function () {
    // console.log('ACTIVE', this.row, this.active)
  },

  updated: function () {
    this.$refs.wordChipSen.forEach((wcs) => {
      wcs.wordSpanIndex = this.wordSpanIndex
      wcs.$forceUpdate()
    })

    this.selectedWcs = null

    this.selectedCoordinatesGotFromRoot.filter((sc) => {
      const parsedSCoordinate = JSON.parse(JSON.stringify(sc))

      if (parsedSCoordinate[0] === this.wordSpanIndex) {
        return true
      }

      return false
    }).forEach((sc) => {
      const parsedSCoordinate = JSON.parse(JSON.stringify(sc))

      let i

      for (i in this.$refs.wordChipSen) {
        const wcs = this.$refs.wordChipSen[i]

        wcs.selected = false

        const parsedWCSCoordinate = JSON.parse(JSON.stringify(wcs.coordinate))

        if (this.wordSpanIndex === parsedSCoordinate[0] &&
            parsedSCoordinate[1] === -1 &&
            parsedSCoordinate[2] === -1) {
          this.isManualTranslated = true

          break
        }

        if (this.wordSpanIndex === parsedSCoordinate[0] &&
            parsedWCSCoordinate[1] === parsedSCoordinate[1] &&
            parsedWCSCoordinate[2] === parsedSCoordinate[2]) {
          this.isManualTranslated = false
          wcs.selected = true
          this.selectedWcs = wcs

          this.$emit('there-is-a-selected-wcs', wcs)
          break
        }
      }

      // this.$refs.wordChipSen.forEach((wcs) => {
      //   wcs.selected = false

      //   const parsedWCSCoordinate = JSON.parse(JSON.stringify(wcs.coordinate))

      //   if (this.wordSpanIndex === parsedSCoordinate[0] &&
      //       parsedWCSCoordinate[1] === parsedSCoordinate[1] &&
      //       parsedWCSCoordinate[2] === parsedSCoordinate[2]) {
      //     this.isManualTranslated = false
      //     wcs.selected = true
      //     this.selectedWcs = wcs

      //     this.$emit('there-is-a-selected-wcs', wcs)
      //   }
      // })
    })

    // this.$refs.wordChipSen.forEach((wcs) => {
    //   wcs.selected = false

    //   const parsedWCSCoordinate = JSON.parse(JSON.stringify(wcs.coordinate))

    //   this.selectedCoordinatesGotFromRoot.forEach((sc) => {
    //     const parsedSCoordinate = JSON.parse(JSON.stringify(sc))

    //     if (this.wordSpanIndex === parsedSCoordinate[0] &&
    //         parsedWCSCoordinate[1] === parsedSCoordinate[1] &&
    //         parsedWCSCoordinate[2] === parsedSCoordinate[2]) {
    //       this.isManualTranslated = false
    //       wcs.selected = true
    //       this.selectedWcs = wcs

    //       this.$emit('there-is-a-selected-wcs', wcs)
    //     }
    //   })
    // })
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

  // .q-chip-with-right-avatar {
  //   .q-chip__content {
  //     direction: rtl;
  //   }

  // }

  // .right-avatar {
  //   margin-right: -.45em !important;
  //   margin-left: .2em !important;
  //   border-radius: 0 3px 3px 0!important;
  // }
</style>
