<template>
  <div class="input-field" :class="{invalid: this.invalid}">
    <i v-if="icon" class="material-icons prefix">{{ icon }}</i>
    <input
      :id="inputId"
      ref="input"
      type="text"
      class="autocomplete"
      :value="computedValue"
      @input="input($refs.input.value)"
      @blur="$emit('blur')"
      @change="$emit('change')"
      @click="$emit('click')"
    >
    <label :class="{'active': computedValue}" v-if="label" :for="inputId">{{ label }}</label>
  </div>
</template>

<script>

export default {
  props: {
    id: String,
    label: String,
    icon: String,
    value: {},
    invalid: Boolean,
    items: {
      type: Array,
      required: true,
    },
    valueKey: String,
    minLength: Number,
    limit: Number,
  },
  data() {
    return {
      inputId: this.getInputId(),
    };
  },
  computed: {
    computedValue() {
      if (!this.value || this.value[this.getValueKey()] === '') {
        return '';
      }
      return this.value[this.getValueKey()] || this.value;
    },
  },
  methods: {
    getInputId() {
      if (this.id) {
        return this.id;
      }
      return `el-${Math.random()}`;
    },
    getValueKey() {
      if (this.valueKey) {
        return this.valueKey;
      }
      return 'name';
    },
    getData() {
      const data = {};
      this.items.forEach((item) => {
        data[item[this.getValueKey()] || item] = item.icon || null;
      });
      return data;
    },
    input(value) {
      const item = this.items.find(item => item[this.getValueKey()] === value);
      this.$emit('input', item || value);
    },
    init() {
      this.$M.Autocomplete.init(this.$refs.input, {
        minLength: this.minLength || 0,
        limit: this.limit || Number.MAX_SAFE_INTEGER,
        data: this.getData(),
        onAutocomplete: (value) => { this.input(value); },
      });
    },
  },
  watch: {
    items() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
};
</script>
