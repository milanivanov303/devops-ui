<template>
  <div class="input-field" :class="{invalid: this.invalid}">
    <i v-if="icon" class="material-icons prefix">{{ icon }}</i>
    <input
      ref="input"
      :id="inputId"
      :type="inputType"
      :value="value"
      @input="$emit('input', $refs.input.value)"
      @blur="$emit('blur')"
      @change="$emit('change')"
      @click="$emit('click')"
    >
    <label v-if="label" :for="inputId">{{ label }}</label>
  </div>
</template>

<script lang="js">
export default {
  props: {
    id: String,
    type: String,
    label: String,
    icon: String,
    value: String,
    invalid: Boolean,
  },
  data() {
    return {
      inputId: this.getInputId(),
      inputType: this.getInputType(),
    };
  },
  methods: {
    getInputId() {
      if (this.id) {
        return this.id;
      }
      return `el-${Math.random()}`;
    },
    getInputType() {
      return this.type || 'text';
    },
  },
  mounted() {
    this.$M.updateTextFields();
  },
};
</script>
