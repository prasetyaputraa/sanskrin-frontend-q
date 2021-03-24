import dictionaryWord from 'modules/entities/dictionary-word'

class dictionaryDataMapper {

}

class dictionaryRepository {
  constructor () {
    this.mapper = dictionaryDataMapper()
    this.domain = dictionaryWord()
  }
}

export default dictionaryRepository
