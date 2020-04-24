<template>
  <div class="input-field" :class="{invalid: this.invalid}">
    <i v-if="icon" class="material-icons prefix">{{ icon }}</i>
    <textarea
      class="materialize-textarea"
      ref="textarea"
      :id="inputId"
      :value="value"
      @input="$emit('input', $refs.textarea.value)"
      @blur="$emit('blur')"
      @change="$emit('change')"
      @click="$emit('click')"
    ></textarea>
    <label :class="{'active': value}" v-if="label" :for="inputId">{{ label }}</label>
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
    };
  },
  methods: {
    getInputId() {
      if (this.id) {
        return this.id;
      }
      return `el-${Math.random()}`;
    },
  },
  mounted() {
    this.$M.textareaAutoResize(this.$refs.textarea);
  },
};
</script>
