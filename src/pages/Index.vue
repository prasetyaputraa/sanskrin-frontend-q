<template>
  <q-page class="">
    <div class="q-pa-lg fit row justify-center items-start q-col-gutter-sm">
      <div class="col-xs-12 col-md-6 flex fit" style="padding: 0">
        <q-card flat bordered class="my-card fit">
          <q-card-section style="padding-top: 2em">
            <div class="gutter-sm row justify-center">
              <q-input borderless type="textarea" class="col-md-6 col-sm-12 input-text-sanskrit" v-model="inputText" label="Kalimat dalam Sansekerta..." />
              <q-input borderless type="textarea" class="col-md-6 col-sm-12 output-text-indonesian" v-model="outputText" label="Kalimat dalam Indonesia..." />
            </div>
          </q-card-section>

          <!-- <q-separator /> -->

          <q-card-actions class="q-card-actions-translate" align="center">
            <q-btn flat padding="1em" class="fit" color="primary">Terjemahkan</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-xs-12 col-md-6 flex fit">
      </div>
    </div>

    <!-- START OF: the second part of the page (after the translation boxes) -->

    <div class="q-pa-lg fit row items-start q-col-gutter-sm">
      <q-list bordered class="rounded-borders col-xs-12 col-lg-6">
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
      </q-list>
    </div>

    <!-- END OF: the second part of the page (after the translation boxes) -->

  </q-page>
</template>

<script>
import ExpansionItemForSanskrit from 'components/ExpansionItemForSanskrit'

export default {
  name: 'PageIndex',

  components: {
    ExpansionItemForSanskrit
  },

  methods: {
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
    }
  },

  data: () => {
    return {
      percentOccurenceToggle: 'percentage',
      collapseIcon: 'expand_less',
      inputText: '',
      outputText: '',
      sanskritWords: {
        Deava: {
          meaning: [
            ['dewa santuy', 100, 29],
            ['dewa sanjuy', 35, 890],
            ['dewa', 75, 908]
          ],
          posTag: 'Noun'
        },
        Sanjaya: {
          meaning: [
            ['melihat dari jauh', 10, 1290]
          ],
          posTag: 'Adverb'
        },
        Subaru: {
          meaning: [
            ['anak dewa', 10, 122]
          ],
          posTag: 'Adjective'
        },
        Toyoya: {
          meaning: [
            ['anak dewa', 87, 1230]
          ],
          posTag: 'Adverb'
        },
        Snnyasii: {
          meaning: [
            ['melihat dari jauh', 10, 1290],
            ['melihat dari kejaih', 10, 1202]
          ],
          posTag: 'Adverb'
        },
        Yamaya: {
          meaning: [
            ['anak dewa', 87, 214]
          ],
          posTag: 'Verb'
        }
      }
    }
  }
}
</script>

// limited to the components in this SFC, but do not achievable if scoped
// the reason is that this scss trying to style
// inside component of component defined here
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
