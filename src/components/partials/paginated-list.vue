<template>
  <div>
    <table class="responsive-table"> 
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Department</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.department.name }}</td>
          <td>
            <a class="modal-trigger" href="#modal-user"><i class="material-icons">attachment</i></a>
          </td>
        </tr>
      </tbody>
      </table>
    <button 
      :disabled="pageNumber === 0" 
      @click="prevPage">
      Previous
    </button>
    <button 
      :disabled="pageNumber >= pageCount -1" 
      @click="nextPage">
      Next
    </button>
  </div>
</template>


<script>
export default {
  data(){
    return {
    pageNumber: 0

    }
  },
  props:{
    listData:{
      type:Array,
      required:true
    },
    size:{
      type:Number,
      required:false,
      default: 10
    }
  },
  methods:{
      nextPage(){
         this.pageNumber++;
      },
      prevPage(){
        this.pageNumber--;
      }
  },
  computed:{
    pageCount(){
      let l = this.listData.length,
          s = this.size;
      return Math.ceil(l/s);
    },
    paginatedData(){
      const start = this.pageNumber * this.size,
            end = start + this.size;
      return this.listData.slice(start, end);
    }
  },
};
