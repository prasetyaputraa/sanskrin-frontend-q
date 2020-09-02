// import something here
import Vue from 'vue'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async (/* { app, router, Vue ... } */) => {
  // something to do
  const percentageCOlors = [
    'red-10',
    'pink-10',
    'purple-10',
    'deep-purple-11',
    'indigo-12',
    'blue-12',
    'light-blue-12',
    'cyan-12',
    'teal-12',
    'green-13',
    'light-green-13'
  ]

  Vue.prototype.$percentageColors = percentageCOlors
}
