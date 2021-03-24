<template>
  <q-tab-panel :name="name">
    <div class="row fit justify-between items-center">
      <div class="col-md-6">
        <div class="row fit justify-start">
          <h6 style="margin: 1em 1em 1em 1em">{{ title }}</h6>
        </div>
      </div>
      <div class="col-md-6 small-fit">
        <div class="row fit justify-end q-gutter-xs small-justify-center">
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
    <ExpansionItemForSanskritDict
      ref="collapsible"

      v-for="word in Object.keys(sanskritWords)"
      :key="word"
      :word="word"
      :wordChipData="{'sanskritWords': sanskritWords}"

      @input="handleExpansionItemForSanskritToggle"
    />
  </q-tab-panel>
</template>

<script>
import ExpansionItemForSanskritDict from 'components/TabPanels/Dictionary/ExpansionItemForSanskritDict'

export default {
  name: 'DictionaryTabPanel',

  components: {
    ExpansionItemForSanskritDict
  },

  props: {
    name: String,
    title: String,
    sanskritWords: Object
  },

  methods: {
    isAllCollapsed: function () {
      let collapsible
      for (collapsible in this.$refs.collapsible) {
        if (this.$refs.collapsible[collapsible].expanded) return false
      }

      return true
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

    handleExpansionItemForSanskritToggle: function (targetValue) {
      // target value sends the value of clicked collapsible
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
      collapseIcon: 'expand_less'
    }
  }

}
</script>

<style>

</style>
