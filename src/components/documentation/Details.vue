<template>
  <div class="row">
    <div class="col s12">
      <a class='dropdown-trigger btn btn-tiny right' href='#' data-target='details'>Show details</a>

      <!-- Dropdown Structure -->
      <div id="details" class="dropdown-content card" ref="details">
        <div class="card-content">
          <Alert v-if="error" :msg="error"/>

          <table>
            <tr>
              <th>Commit</th>
              <td>{{ details.commit }}</td>
            </tr>
            <tr>
              <th>Committed by</th>
              <td>{{ details.user }}</td>
            </tr>
            <tr>
              <th>Commit message</th>
              <td><pre>{{ details.message }}</pre></td>
            </tr>
            <tr>
              <th>Documentation date</th>
              <td>{{ $date(details.time).toHuman() }}</td>
            </tr>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    repo: String,
    branch: String,
  },
  data() {
    return {
      details: {},
      error: null,
      dropdown: null,
    };
  },
  methods: {

    getDetails() {
      const loader = this.$loading.show({ container: this.$refs.details });

      this.$store.dispatch('documentation/getDetails', {
        branch: this.branch,
        repo: this.repo,
      })
        .then((response) => {
          this.details = response.data;
          setTimeout(() => this.dropdown.recalculateDimensions(), 10);
        })
        .catch(() => {
          this.error = 'Could not get documentation details!';
        })
        .finally(() => {
          loader.hide();
        });
    },
  },

  mounted() {
    this.dropdown = this.$M.Dropdown.init(
      this.$el.querySelector('.dropdown-trigger'),
      {
        constrainWidth: false,
        onOpenStart: () => this.getDetails(),
      },
    );
  },
};
</script>
