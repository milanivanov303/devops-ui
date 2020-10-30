<template>
    <div class="switch-box">
        <div class="switch-box-header">
            <p>{{request.header}}</p>
        </div>
        <div class="switch-box-content scrollbar style-8">
            <div
              class="switch"
              v-for="(option, key) in request.options"
              v-bind:key="key"
              v-bind:value="option">
              {{option}}
            </div>
        </div>
    </div>
</template>

<script>

export default {
  props: {
    request: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>

.title, .checkbox-switch {
  display: inline-block;
  width: 50%;
  font-size: 1.1rem;
  padding: 10px;
}

.checkbox-switch label {
  position: absolute;
  left: 62%;
}

.switch-box {
  height: 600px;
  border: 1px solid #888888;
  width: 100%;
  display: inline-block;
}

.switch-box-content {
  padding: 10px;
  height: 92%;
  overflow-y: scroll;
  box-sizing: border-box;
}

.switch {
  display: flex;
  justify-content: space-between;
  position: relative;
  -webkit-user-select: all;  /* Chrome all / Safari all */
  -moz-user-select: all;     /* Firefox all */
  -ms-user-select: all;      /* IE 10+ */
  user-select: all;          /* Likely future */
}

.switch-box-header {
  box-sizing: border-box;
  background-color: #003042;
  height: 8%;
  display: table;
  width: 100%;
  position: sticky;
  top: 0;

  p {
    text-align: center;
    vertical-align: middle;
    display: table-cell;
    color: #f5f5f5;
    letter-spacing: 0.2em;
    font-weight: bold;
  }
}

.scrollbar {
  background: #F5F5F5;
  overflow-y: scroll;
  margin-bottom: 25px;
}

.style-8::-webkit-scrollbar-track {
  background-color: #F5F5F5;
}

.style-8::-webkit-scrollbar {
  width: 10px;
  background-color: #F5F5F5;
}

.style-8::-webkit-scrollbar-thumb {
  background-color: #000000;
}

</style>
