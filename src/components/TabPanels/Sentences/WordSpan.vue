<template>
  <span>
    <span
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
      @click="clickedEvent()"
      :class="{ hovered: isHover, clicked: clicked, bytrans: isHighlightedByTransalation }"
    >{{ word }}</span>
    <span>{{ ' ' }}</span>
  </span>
</template>

<script>
export default {
  name: 'WordSpan',

  props: {
    word: String,
    index: Number
  },

  methods: {
    clickedEvent: function () {
      this.clicked = true
      this.$emit('word-clicked', this)
    }
  },

  data: function () {
    return {
      row: 0,
      isHover: false,
      clicked: false,
      isHighlightedByTransalation: false
    }
  }
}
</script>

<style lang="scss">
  .hovered {
    background-color: yellow;
  }

  .bytrans {
    background-color: indianred;
  }

  .bytrans.hovered {
    background-color: indianred !important;
  }

  .clicked {
    background-color: yellow;
  }
</style>
