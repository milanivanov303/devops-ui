<template>
  <div class="input-field" :class="{invalid: this.invalid}">
    <i v-if="icon" class="material-icons prefix">{{ icon }}</i>
    <input
      :id="inputId"
      ref="input"
      type="text"
      class="autocomplete"
      v-model="currentValue"
      @blur="emitEvent('blur')"
      @click="emitEvent('click')"
    >
    <label v-if="label" :for="inputId">{{ label }}</label>
  </div>
</template>

<script>

export default {
  props: {
    id: String,
    label: String,
    icon: String,
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
      currentValue: null,
    };
  },
  watch: {
    currentValue(value) {
      const item = this.items.find(item => item[this.getValueKey()] === value);
      this.$emit('select', item || value);
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
        data[item[this.getValueKey()]] = item.icon || null;
      });
      return data;
    },
    emitEvent(event) {
      this.$emit(event);
    },
  },
  mounted() {
    this.$M.Autocomplete.init(this.$refs.input, {
      minLength: this.minLength || 0,
      limit: this.limit || Number.MAX_SAFE_INTEGER,
      data: this.getData(),
      onAutocomplete: (value) => { this.currentValue = value; },
    });
  },
};
</script>
