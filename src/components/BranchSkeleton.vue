<template>
    <div class="card">
      <div class="card-content">
        <div class="card-title truncate">
            <Skeleton width="40%"/>
        </div>
        <p>
          <Skeleton width="70%"/>
        </p>
        <p>
          <Skeleton width="20%"/>
        </p>
      </div>
    </div>
</template>

<script>
import { Skeleton } from 'vue-loading-skeleton';

export default {
  components: {
    Skeleton,
  },
};
</script>
