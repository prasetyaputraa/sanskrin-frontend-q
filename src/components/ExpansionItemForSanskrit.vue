<template>
  <q-expansion-item
    @input="handleToggle"
    v-model="expanded"
    expand-separator
    icon="code"
    :label="word"
  >
    <q-card class="sanskrit-words-dropdown">
      <WordChip ref="wordchip" v-for="meaning in filterSemantics(wordChipData.sanskritWords[word])"
        :key="meaning[0]" :word='meaning[0]' :percentage='meaning[1]' :occurence='meaning[2]'
      />
    </q-card>
  </q-expansion-item>
</template>

<script>
import WordChip from 'components/WordChip'

export default {
  name: 'ExpansionItemForSanskrit',

  components: {
    WordChip
  },

  data: () => {
    return {
      expanded: true
    }
  },

  methods: {
    handleToggle: function (nextState) {
      this.expanded = nextState

      this.$emit('input', nextState)
    },

    filterSemantics: function (arr) {
      try {
        return arr.filter(function (val, index, arr) {
          for (let i = 0; i < index; i++) {
            if (arr[i][0] === val[0]) {
              if (arr[i][1] === val[1]) {
                throw new Error('Duplicate entries of semantic found')
              }

              return false
            }
          }
          return true
        })
          .sort((a, b) => a[1] - b[1])
      } catch (e) {
        return [[`Calculation Error: ${e.message}`, 0, 0]]
      }
    }
  },
  props: {
    word: String,
    value: Boolean,
    wordChipData: Object
  }
}
</script>

<style lang="scss" scoped>
  .sanskrit-words-dropdown {
    padding-top: 1em;
    padding-bottom: 1em;

    padding-left: 64px;
  }
</style>
