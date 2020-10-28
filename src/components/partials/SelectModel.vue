<template>
  <div class="input-field" :class="{invalid: this.invalid}">
    <i v-if="icon" class="material-icons prefix">{{ icon }}</i>
    <select
      :id="selectId"
      :disabled="disabled"
      :readonly="readonly"
      v-model="selected"
      :multiple="multiple"
      ref="select"
      @blur="$emit('blur')"
      @change="$emit('change', selected)"
      @click="$emit('click')">
      <option disabled value="">Choose your option</option>
      <option v-if="customOption"
              :value="customOption.value">{{customOption.text}}</option>
      <option v-for="(option, key) in options"
              :key="key"
              :value="option">{{
                option[displayed][options.key] ||
                option[displayed]
              }}
      </option>
    </select>
    <label v-if="label" :for="selectId">{{ label }}</label>
    <span v-if="helperText" class="helper-text">{{ helperText }}</span>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    multiple: {
      default: false,
      type: Boolean,
    },
    value: {
      default: null,
    },
    label: String,
    helperText: String,
    icon: String,
    displayed: String,
    invalid: Boolean,
    options: {
      type: Array,
      required: true,
    },
    customOption: Object,
  },
  data() {
    return {
      selectId: this.getSelectId(),
      selected: this.getSelectValue(),
    };
  },
  methods: {
    getSelectId() {
      if (this.id) {
        return this.id;
      }
      return `el-${Math.random()}`;
    },
    getSelectValue() {
      if (this.value !== null) {
        return this.value;
      }
      if (this.multiple) {
        return [];
      }
      return null;
    },
  },
  watch: {
    selected(newVal) {
      this.$emit('input', newVal);
    },
    value(value) {
      this.selected = value;
    },
  },
  mounted() {
    this.$M.FormSelect.init(this.$refs.select, {});
  },
  updated() {
    this.$M.FormSelect.init(this.$refs.select, {});
  },
};
</script>

<style scoped>

</style>
