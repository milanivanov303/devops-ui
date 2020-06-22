<script>
export default {
  props: {
    show: { type: [String, Function] },
    label: { type: [String, Function] },
    info: { type: String },
    sortable: { default: true, type: Boolean },
    filterType: { type: String },
  },
};
</script>
