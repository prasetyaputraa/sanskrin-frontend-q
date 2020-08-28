<template>
  <q-chip square icon-right="school" :value="true">
    <q-avatar v-bind:color="color" text-color="white">{{ percentage }}%</q-avatar>
    {{ word }}
  </q-chip>
</template>

<script>
export default {
  name: 'WordChip',
  props: {
    word: String,
    color: String,
    percentage: Number
  }
}
</script>

<style lang="scss" scoped>

</style>
