<template>
  <div class="input-field">
    <i v-if="select.icon" class="material-icons prefix">{{ select.icon }}</i>
    <select :id="select.id"
            :name="select.name"
            ref="custom-select"
            v-model="currentValue"
            @change="$emit('input', currentValue)">
      <option v-for="(option, key) in select.options"
              v-bind:key="key"
              v-bind:value="option">{{ option.name }}</option>
    </select>
    <label v-if="select.label">{{ select.label }}</label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentValue: this.value,
    };
  },
  props: {
    value: {},
    select: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.$M.FormSelect.init(this.$refs['custom-select'], {});
  },
};
</script>

<style scoped>

</style>
