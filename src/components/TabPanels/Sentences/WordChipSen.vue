<template>
  <q-chip size="md" class="q-chip-with-right-avatar" :class="{ selected: selected }">
    <q-avatar
      v-ripple
      color="green" text-color="white" :icon="selected ? 'check_box' : 'keyboard_arrow_right'" class="right-avatar cursor-pointer"
      @click="checkIfOtherIsSelected"
    >
    </q-avatar>
    {{ translation }}
  </q-chip>
</template>

<script>
export default {
  name: 'WordChipSen',

  props: {
    translation: String,
    sanskritIndex: Number,
    index: Number,
    wordSpanIndex: Number
  },

  data: function () {
    return {
      selected: false,
      otherGroups: [],
      coordinate: []
    }
  },

  methods: {
    checkIfOtherIsSelected: function () {
      console.log('Coordinate', this.coordinate)
      // this.$emit('can-i-be-selected', this)
    },

    proceedSelection: function (coordinateToBeReplaced = null) {
      if (this.selected) {
        return
      }

      this.selected = !this.selected

      this.group.forEach((chipSen) => {
        if (chipSen !== this) {
          chipSen.selected = false
        }
      })

      this.$emit('get-selected', this)
    }
  },

  created: function () {
    this.coordinate = [this.wordSpanIndex, this.sanskritIndex, this.index]
  },

  updated: function () {
    this.coordinate = [this.wordSpanIndex, this.sanskritIndex, this.index]
  }
}
</script>

<style lang="scss" scoped>
  .selected {
    background-color: #4caf50 !important;
    color: white;
  }

</style>
