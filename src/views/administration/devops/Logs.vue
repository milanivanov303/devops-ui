<template>
  <div class="logs">
    <div class="row">
      <div class="input-field col s12 m6">
        <i class="material-icons prefix">event</i>
        <datetime input-id="from"
                  input-class="datetime-input"
                  type="datetime"
                  v-model="from"
                  class="datetime-theme"
                  :format="$date.format"
                  :week-start="1"/>
        <label :class="{active: from}"
               for="from">From
        </label>
      </div>
      <div class="input-field col s12 m6">
        <i class="material-icons prefix">event_available</i>
        <datetime input-id="to"
                  input-class="datetime-input"
                  type="datetime"
                  v-model="to"
                  class="datetime-theme"
                  :format="$date.format"
                  :min-datetime="from"
                  :max-datetime="dateNow"
                  :week-start="1"/>
        <label :class="{active: to}"
               for="to">To
        </label>
      </div>
    </div>
    <Logs :index="appCode" :axios="axios" :from="from" :to="to"/>
  </div>
</template>

<script>
import { Logs } from '@enterpriseapps/vue-administration';
import Axios from 'axios';

import { Datetime } from 'vue-datetime';
import { DateTime } from 'luxon';
import 'vue-datetime/dist/vue-datetime.css';

export default {
  components: {
    Logs,
    datetime: Datetime,
  },
  data() {
    return {
      dateNow: DateTime.now().toString(),
      from: DateTime
        .local(DateTime.now().year, DateTime.now().month, DateTime.now().day, 0, 0, 0).toString(),
      to: DateTime.now().toString(),
    };
  },
  computed: {
    appCode() {
      return this.$config.devops.code.toLowerCase();
    },
    axios() {
      const axios = Axios.create({
        baseURL: this.$config.elastic.url,
        headers: {
          Authorization: `Basic ${btoa(`${this.$config.elastic.username}:${this.$config.elastic.pass}`)}`,
          'Content-Type': 'application/json',
        },
      });
      axios.CancelToken = Axios.CancelToken;
      return axios;
    },
  },
};
</script>
