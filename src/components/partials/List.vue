<template>
    <div>
        <div class="col s12 l6 left">
            <table class="responsive">
                <caption>
                    <input type="text" placeholder="Search" v-model="searchAvailable">
                    <a class="waves-effect waves-light btn-small left" @click="selectAvailable(filteredItems)">
                        <i class="material-icons left">add</i>
                        Add all
                    </a>
                </caption>
                <tr>
                    <th>Name</th>
                </tr>
                <tbody>
                    <tr v-for="(item, index) in filteredItems" :key="index">
                        <td>
                            {{ item.name }}
                            <a href="#!" @click="selectItem(item)">
                                <i class="material-icons tiny">add_circle</i>
                                <b> Add</b>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="col s12 l6 right">
            <table class="responsive">
                <caption>
                    <input type="text" placeholder="Search" v-model="searchSelected">
                    <a class="waves-effect waves-light btn-small left" @click="removeSelected(filteredSelectedItems)">
                        <i class="material-icons left">remove</i>
                        Remove all
                    </a>
                </caption>
                <tr>
                    <th>Name</th>
                </tr>
                <tbody>
                    <tr v-for="(item, index) in filteredSelectedItems" :key="index">
                        <td>
                            {{  item.name }}
                            <a href="#!" @click=" removeItem(item) ">
                                <i class="material-icons tiny">do_not_disturb_on</i>
                                <b> Remove</b>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div> 
    </div>
</template>

<script>
export default {
    props: {
        items: Array,
        selected: Array
    },
    computed: {
        filteredItems() {
            let availableItems = this.items.filter(item => {
                return !this.selectedItems.find(i => i.id === item.id);
            });

            if (!this.searchAvailable) {
                return availableItems;
            }

            const regexp = new RegExp(this.searchAvailable, 'i');
            return availableItems.filter(item => item.name.match(regexp));
        },
        filteredSelectedItems() {
            if (!this.searchSelected) {
                return this.selectedItems;
            }

            const regexp = new RegExp(this.searchSelected, 'i');
            return this.selectedItems.filter(item => item.name.match(regexp));
        }
    },
    data(){
        return {
            searchAvailable: '',
            searchSelected: '',
            selectedItems: [],
        };
    },
    mounted() {
        var elems = document.querySelectorAll('.tabs');
        this.$M.Tabs.init(elems);
        this.selectedItems = this.selected;

    },
    methods: {
        selectItem(item) {
            this.selectedItems.push(item);
            this.$emit('input', this.selectedItems);
        },
        selectAvailable(filteredItems) {
            this.selectedItems = this.selectedItems.concat(this.filteredItems); 
            this.$emit('input', this.selectedItems);
            
        },
        removeItem(item) {
            const index = this.selectedItems.indexOf(item);
            this.selectedItems.splice(index, 1);
            this.$emit('input', this.selectedItems);
        },
        removeSelected(filteredSelectedItems) {
            this.selectedItems = this.selectedItems.filter(item => !this.filteredSelectedItems.includes(item));
            this.$emit('input', this.selectedItems);
        },
    
    },
}
</script>

<style scoped>

thead,
tbody {
  display: block;
}

tbody {
  max-height: 400px;
  overflow: auto;
}
</style>