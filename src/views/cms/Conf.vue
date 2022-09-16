<template>
  <div>
    <h1 class="center">Configurations</h1>
    <Table
      :data="codixTeams"
      sort-by="name"
      sort-dir="asc"
      :export-btn="false"
      :view-btn="false"
      :add-btn="false"
      :edit-btn="false"
      :delete-btn="false"
    >
      <Column show="abbreviation"/>
      <Column show="name"/>
      <Column show="tts_group_name"/>
      <Column show="manager"/>
      <template v-slot:actions-before="{ row }">
        <a
          @click="openAddEditAbbrevModal(row, 'update')"
          data-tooltip="Edit team"
          class="tooltipped">
          <i class="material-icons">edit</i>
        </a>
      </template>
    </Table>
    <AddEditTeamModal
      v-if="showAddEditTeamModal"
      @close="showAddEditTeamModal = false"
      :selectedTeam="selectedTeam"
      :action="action"
    />
  </div>
</template>
<script>
import AddEditTeamModal from '../../components/cms/AddEditTeamModal';

export default {
  components: {
    AddEditTeamModal,
  },
  data() {
    return {
      action: null,
      showAddEditTeamModal: false,
      selectedTeam: {},
    };
  },
  computed: {
    codixTeams() {
      return this.$store.state.cms.codixTeams;
    },
  },
  methods: {
    openAddEditAbbrevModal(team, action) {
      this.selectedTeam = { ...team };
      this.action = action;
      this.showAddEditTeamModal = true;
    },
    getCodixTeams() {
      this.$store.dispatch('cms/getCodixTeams');
    },
  },
  created() {
    this.getCodixTeams();
    this.$store.dispatch('cms/codixTeamsTTS');
  },
};
</script>

