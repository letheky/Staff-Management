<style lang="scss">
#date-picker {
  position: relative;
  .date-picker__icon {
    position: absolute;
    top: 5px;
    right: 16px;
  }
}
</style>
<template>
  <v-layout wrap id="date-picker">
    <v-flex class="relative">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        :format="formatDate"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-text-field
              :class="error"
              @click="changeData()"
              v-model="dateFormatted"
              @blur="date = parseDate(dateFormatted)"
              :label="title"
              readonly
              :error="error"
              :disabled="disabled"
              outlined
              dense
              hide-details
              append-icon="mdi-calendar"
            ></v-text-field>
          </div>
        </template>
        <v-date-picker
          v-model="date"
          :min="min"
          :max="max"
          @input="menu = false"
          :locale="lang"
          :type="type"
          :format="format"
          :disabled-dates="disabledDates"
        ></v-date-picker>
      </v-menu>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    title: String,
    model: String,
    error: Boolean,
    disabled: Boolean,
    min: String,
    max: String,
    type: String,
    format: String,
    disabledDates: Array,
  },
  data() {
    return {
      date: null,
      dateFormatted: null,
      menu: false,
      lang: this.$i18n.locale,
      dateFormat: this.format,
    }
  },
  created() {
    this.date = this.model
  },
  watch: {
    model(value) {
      this.date = value
    },
    date() {
      this.dateFormatted = this.formatDate(this.date)
      this.$emit('update:error', false)
      this.$emit('update:model', this.date)
    },
    // disabled() {
    //   this.reset();
    // }
  },
  methods: {
    // dateFormat() {
    //   return 'MM/YYYY';
    // },
    reset() {
      this.date = null
      this.$emit('update:error', false)
      this.$emit('update:model', this.date)
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      if (this.type && this.type == 'month') {
        return `${month}/${year}`
      } else {
        return `${day}/${month}/${year}`
      }
    },
    parseDate(date) {
      if (!date) return null

      if (this.type && this.type == 'month') {
        const [month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}`
      } else {
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
    },
    changeData() {
      this.$emit('changeData')
    },
  },
}
</script>
