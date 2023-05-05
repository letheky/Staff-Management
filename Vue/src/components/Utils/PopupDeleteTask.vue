<template>
  <v-dialog v-model="confirmDialog" :max-width="maxWidth || 515" :width="width">
    <v-card class="pa-5">
      <div :style="{ width: 'fit-content', marginLeft: 'auto' }">
        <img @click="cancel" src="../../assets/images/icon-close-round.svg" alt="" srcset="" />
      </div>
      <div class="d-flex flex-column">
        <slot name="icon" />

        <slot name="title" />
        <slot name="content" />
      </div>
      <v-card-actions class="pa-0 d-flex justify-space-between">
        <v-btn :style="{ width: '31%' }" outlined :color="cancelColor || 'primary'" @click="cancel">
          <template v-if="cancelText">
            <p v-html="cancelText"></p>
          </template>
          <template v-else> Cancel </template>
        </v-btn>
        <v-btn
          :style="{ width: '31%' }"
          :color="confirmColor || 'primary'"
          :disabled="checkConfirm"
          class="white--text"
          @click="confirmSingle"
        >
          <template v-if="confirmText">
            {{ confirmText }}
          </template>
          <template v-else> Delete single </template>
        </v-btn>
        <v-btn
          :style="{ width: '31%' }"
          :color="confirmColor || 'primary'"
          :disabled="checkConfirm"
          class="white--text"
          @click="confirmIncomplete"
        >
          <template v-if="confirmText">
            {{ confirmText }}
          </template>
          <template v-else> Delete incomplete </template>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    maxWidth: Number,
    confirmColor: String,
    cancelColor: String,
    cancelText: String,
    confirmText: String,
    width: Number,
    checkConfirm: Boolean,
  },
  data() {
    return {
      confirmDialog: false,
      item: null,
    }
  },
  methods: {
    open(item) {
      this.confirmDialog = true
      this.item = item
    },
    cancel() {
      this.$emit('cancel', this.item)
      this.confirmDialog = false
    },
    confirmSingle() {
      this.$emit('confirmSingle', this.item)
      this.confirmDialog = false
    },
    confirmIncomplete() {
      this.$emit('confirmIncomplete', this.item)
      this.confirmDialog = false
    },
  },
}
</script>
<style lang="scss"></style>
