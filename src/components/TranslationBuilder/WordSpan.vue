<template>
  <span @click="handleClick">
    <span :contenteditable="mainEditable"
      class="input" role="textbox" style="font-size: 1.25em"
      @mouseover="highlightWordSpan"
      @mouseleave="isHighlighted = false"
      @mousedown="isHighlighted = false"
      @keydown.enter.prevent="changeToManualTrans"
      :class="{ highlighted : isHighlighted }"
      ref="mainSpace"
    >{{ translation ? translation : '' }}</span>
    <span :contenteditable="spaceEditable"
      @mouseover="mouseOnBlank = true" @mouseleave="mouseOnBlank = false"
      @keydown.enter.prevent="submitManualTrans"
      style="font-size: 1.25em"
      ref="additionalSpace"
      class="show-up-space"
    >{{ ' ' }}<q-tooltip>Double click to add manual translation</q-tooltip></span>
  </span>
</template>

<script>
export default {
  name: 'WordSpan',

  props: {
    __data: {},
    translation: String
  },

  methods: {
    updateData: function (data) {
      this.translation = data.translation
    },

    highlightWordSpan: function () {
      this.isHighlighted = true

      this.$emit('hovered-up', this.wordSpanIndex)
    },

    unHighlight: function () {
      this.isHighlighted = false

      this.$emit('hovered-up', this.wordSpanIndex)
    },

    handleClick: function (evt) {
      this.clicks++

      if (this.clicks === 1) {
        this.clickTimer = setTimeout(() => {
          this.clicks = 0
        }, 500)
      } else {
        clearTimeout(this.clickTimer)
        this.clicks = 0

        if (this.mouseOnBlank) {
          this.spaceEditable = true
        }

        this.mainEditable = true
      }
    },

    submitManualTrans: function () {
      this.spaceEditable = false
      this.$emit(
        'add-new-phrase',
        {
          data: {
            translation: this.$refs.additionalSpace.textContent.trim(),
            wordSpanIndex: -1,
            coordinate: [-1, -1, -1]
          },
          after: this.wordSpanIndex
        }
      )
      this.$refs.additionalSpace.textContent = ' '
    },

    changeToManualTrans: function () {
      console.log('SHOULD BE RUNNING I SHOULD NOT I?')
      this.mainEditable = false
      const newCoordinate = [this.wordSpanIndex, -1, -1]

      this.$emit(
        'change-to-new-phrase',
        {
          data: {
            translation: this.$refs.mainSpace.textContent.trim(),
            wordSpanIndex: this.wordSpanIndex,
            coordinate: newCoordinate
          }
        }
      )
    }
  },

  data: function () {
    return {
      words: '',
      wordSpanIndex: -1,
      isHighlighted: false,
      mouseOnBlank: false,
      spaceEditable: false,
      mainEditable: false,
      mouseIsDown: false,
      clicks: 0,
      clickTimer: null
    }
  },

  created: function () {
    this.wordSpanIndex = this.__data.wordSpanIndex
    this.translation = this.__data.translation
  },

  updated: function () {
    this.wordSpanIndex = this.__data.wordSpanIndex
    this.translation = this.__data.translation
  }
}
</script>

<style lang="scss" scoped>
  .highlighted {
    background-color: yellow;
    color: black;
  }

  [contenteditable] {
    outline: 0px solid transparent;
  }
</style>
