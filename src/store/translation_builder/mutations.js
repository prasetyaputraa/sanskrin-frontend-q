/*
export function someMutation (state) {
}
*/

export const buildTranslation = (state, payload) => {
  state.builtTranslations = payload
}

export const placeTranslationAtTheEnd = (state, payload) => {
  state.builtTranslations.set(payload.wordSpanIndex, payload.data)
}

export const placeTranslationAtIndex = (state, { index, payload }) => {
  state.builtTranslations = new Map([...state.builtTranslations.entries()].splice(index, 0, [payload.wordSpanIndex, payload.data]))
}

export const reorderTranslations = (state, { from, to }) => {
  state.builtTranslations = new Map(
    [...state.builtTranslations.entries()].splice(to, 0, [...state.builtTranslations.entries()].splice(from, 1)[0])
  )
}
