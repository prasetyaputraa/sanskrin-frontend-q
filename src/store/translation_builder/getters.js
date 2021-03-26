/*
export function someGetter (state) {
}
*/
export const builtTranslationsLowestIndex = (state) => {
  state.builtTranslations = new Map(
    [...state.builtTranslations.entries()].sort((a, b) => {
      return a[0] - b[0]
    })
  )
}
