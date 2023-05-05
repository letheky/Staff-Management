<template>
  <v-dialog v-model="confirmDialog" :max-width="maxWidth || 515" :width="width">
    <v-card class="pa-8">
      <slot name="icon" />
      <slot name="title" />
      <slot name="content" />
      <v-card-actions class="pa-0">
        <v-btn
          outlined
          :color="cancelColor || 'primary'"
          @click="cancel"
          width="150"
        >
          <template v-if="cancelText">
            {{ cancelText }}
          </template>
          <template v-else> Cancel </template>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :color="confirmColor || 'primary'"
          :disabled="checkConfirm"
          class="white--text"
          width="150"
          @click="confirm"
        >
          <template v-if="confirmText">
            {{ confirmText }}
          </template>
          <template v-else> OK </template>
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
    };
  },
  methods: {
    open(item) {
      this.confirmDialog = true;
      this.item = item;
    },
    cancel() {
      this.$emit("cancel", this.item);
      this.confirmDialog = false;
    },
    confirm() {
      this.$emit("confirm", this.item);
      this.confirmDialog = false;
    },
  },
};
</script>
<style lang="scss"></style>
