<template>
  <q-page class="flex">
    <div class="q-pa-lg fit row justify-center items-start q-col-gutter-sm">
      <div class="col-xs-12 col-md-6 flex fit">
        <q-card class="my-card fit">
          <q-card-section>
            <div class="gutter-sm row justify-center">
              <q-input type="textarea" class="col-md-6 col-sm-12 input-text-sanskrit" standout="bg-primary text-white" v-model="inputText" label="Kalimat dalam Sansekerta..." />
              <q-input type="textarea" class="col-md-6 col-sm-12 output-text-indonesian" standout="bg-primary text-white" v-model="outputText" label="Kalimat dalam Indonesia..." />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="center">
            <q-btn class="fit" flat>Terjemahkan</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-xs-12 col-md-6 flex fit">
        <WordChip word='Sanskrin' color='red' percentage='5'/>
        <WordChip word='Testerdamn' color='blue' percentage='18'/>
        <WordChip word='Snakeerin' color='orange' percentage='30'/>
        <WordChip word='Sanskrin' color='green' percentage='100'/>
      </div>
    </div>
  </q-page>
</template>

<script>
import WordChip from 'components/WordChip'

export default {
  name: 'PageIndex',
  components: {
    WordChip
  },
  data: () => {
    return {
      inputText: '',
      outputText: ''
    }
  }
}
</script>

<style lang="scss">
  .input-text-sanskrit {
    .q-field__inner {
      .q-field__control {
        padding-left: 24px !important;

        border-radius: 5px !important;
        border-top-right-radius: 0px !important;
        border-bottom-right-radius: 0px !important;

        border-right: 1px solid silver;
        textarea {
          resize: none;
        }
      }
    }
  }

  .output-text-indonesian {
    .q-field__inner {
      .q-field__control {
        padding-left: 24px !important;

        border-radius: 5px !important;
        border-top-left-radius: 0px !important;
        border-bottom-left-radius: 0px !important;
        textarea {
          resize: none;
        }
      }
    }
  }
</style>
