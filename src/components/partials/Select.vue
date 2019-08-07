<template>
    <div class="input-field">
        <i class="material-icons prefix">{{ select.icon }}</i>
        <select :id="select.id"
                :name="select.name"
                ref="custom-select"
                v-model="value"
                @change="returnSelectedValue()">
            <option disabled value="">Choose your option</option>
            <option v-for="(option, key) in select.options"
                    v-bind:key="key"
                    v-bind:value="option">{{ option.name }}</option>
        </select>
        <label>{{ select.label }}</label>
    </div>
</template>

<script>
export default {
  data() {
    return {
      value: this.select.selected,
    };
  },
  props: {
    select: {
      type: Object,
      required: true,
    },
  },
  methods: {
    returnSelectedValue() {
      this.$emit('selectedVal', this.value);
    },
  },
  mounted() {
    this.$M.FormSelect.init(this.$refs['custom-select'], {});
  },
};
</script>

<style scoped>

</style>
