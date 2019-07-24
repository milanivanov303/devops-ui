<template>
    <div class="input-field">
        <i class="material-icons prefix">{{ select.icon }}</i>
        <select :id="select.id" 
                :name="select.name" 
                ref="custom-select"
                v-model="value" 
                @change="returnSelectedValue()">
            <option disabled selected>Choose your option</option>
            <option v-for="option in select.options" v-bind:value="option.name">{{ option.name }}</option>
        </select>
        <label>{{ select.label }}</label>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: '',
            }
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
            }
        },
        mounted() {
            M.FormSelect.init(this.$refs['custom-select'], {});
        },
    };
</script>

<style scoped>

</style>