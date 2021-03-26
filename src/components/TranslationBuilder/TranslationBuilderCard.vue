<template>
  <q-card flat bordered class="col-5 rounded-borders q-pa-lg text-white bg-primary" style="min-height: 150px" @mouseleave="hoverOut">
    <draggable :list="list" @start="drag=true" @end="drag=false" ghost-class="ghost" drag-class="move-drag">
      <WordSpan v-for="item in list" :__data="item" :key="item.wordSpanIndex" :translation="item.translation"
      />
    </draggable>
  </q-card>
</template>

<script>
import WordSpan from 'components/TranslationBuilder/WordSpan'
import draggable from 'vuedraggable'

export default {
  name: 'TranslationBuilderCard',

  components: {
    WordSpan,
    draggable
  },

  props: {
    builtTranslationsMap: Map
  },

  computed: {

  },

  methods: {
    log: function (evt) {
      this.$emit('word-span-moved', evt)
    },

    hoverOut: function () {
      this.$emit('hover-out')
    },

    findHoveredWordSpanInOtherPanel: function (index) {
      this.$emit('a-word-hovered', index)
    },

    addNewPhrase: function (data) {
      this.$emit('add-new-phrase', data)
    },

    changeToNewPhrase: function (data) {
      this.$emit('change-to-new-phrase', data)
    },

    updateWordSpanData: function (index, data) {
      this.$refs.wordSpan.forEach((wordSpan) => {
        if (wordSpan.wordSpanIndex === index) {
          wordSpan.updateData(data)
        }
      })
    },

    setList: function (list) {
      this.list = list
    }
  },

  update: function () {
    console.log('INSIDE UPDATE', this.list)
  }
}
</script>

<style lang="scss">
  .ghost {
    color: black;
    background-color: darkcyan;
  }

  .move-drag {
    background-color: indianred !important;
  }
</style>
