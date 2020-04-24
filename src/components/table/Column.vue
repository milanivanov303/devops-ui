<script>
export default {
  props: {
    show: { type: [String, Function] },
    label: { type: [String, Function] },
    info: { type: String },
    sortable: { default: true, type: Boolean },
    filterable: { default: true, type: Boolean },
  },
};
</script>
