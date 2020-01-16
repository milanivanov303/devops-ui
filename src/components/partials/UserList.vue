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
                
                <div v-if="groupBy" class="userlist">
                    <ul  v-for="(items, group) in getGroupedBy(filteredItems)" :key="group">
                        <h6>{{group}}</h6>
                        <li v-for="(item, index) in items" :key="index">
                            {{ item.name }}
                            <a href="#!" @click="selectItem(item)">
                                <i class="material-icons tiny">add_circle</i>
                                <b> Add</b>
                            </a>
                            <div class="divider"></div>
                        </li>
                    </ul>
                </div>

                <div v-else class="userlist">
                    <ul v-for="(item, index) in filteredItems" :key="index">
                        <li>
                            {{ item.name }}
                            <a href="#!" @click="selectItem(item)">
                                <i class="material-icons tiny">add_circle</i>
                                <b> Add</b>
                            </a>
                        </li>
                    </ul>
                </div>
            </table>
        </div>

        <div class="col s12 l6 right" >
            <table class="responsive">
                <caption>
                    <input type="text" placeholder="Search" v-model="searchSelected">
                    <a class="waves-effect waves-light btn-small left" @click="removeSelected(filteredSelectedItems)">
                        <i class="material-icons left">remove</i>
                        Remove all
                    </a>
                </caption>
                
                <div v-if="groupBy" class="userlist">
                    <ul  v-for="(items, group) in getGroupedBy(filteredSelectedItems)" :key="group">
                        <h6>{{group}}</h6>
                        <li v-for="(item, index) in items" :key="index">
                            {{ item.name }}
                            <a href="#!" @click="removeItem(item)">
                                <i class="material-icons tiny">do_not_disturb_on</i>
                                <b> Remove</b>
                            </a>
                            <div class="divider"></div>
                        </li>
                    </ul>
                </div>

                <div v-else class="userlist">
                    <ul v-for="(item, index) in filteredSelectedItems" :key="index">
                        <li>
                            {{ item.name }}
                            <a href="#!" @click="removeItem(item)">
                                <i class="material-icons tiny">do_not_disturb_on</i>
                                <b> Remove</b>
                            </a>
                        </li>
                    </ul>
                </div>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        items: Array,
        selected: Array,
        groupBy: String
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
            return availableItems.filter(item => {
                if (item.name.match(regexp)) {
                    return true;
                }

                if (this.getProperty(item, this.groupBy).match(regexp)) {
                    return true;
                }

                return false;
            });
        
        },
        filteredSelectedItems() {
            if (!this.searchSelected) {
                return this.selectedItems;
            }

            const regexp = new RegExp(this.searchSelected, 'i');
            return this.selectedItems.filter(item => {
                if (item.name.match(regexp)) {
                    return true;
                }

                if (this.getProperty(item, this.groupBy).match(regexp)) {
                    return true;
                }

                return false;
            });
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
        if (this.selected) {
            this.selectedItems = this.items.filter(item => {
                return this.selected.find(i => i.id === item.id);
            });
        }

    },
    methods: {
        getGroupedBy(items) {
            let groupedBy = {};

            items.forEach(item => {
                const group = this.getProperty(item, this.groupBy);

                if(!groupedBy[group]) {
                    groupedBy[group] = []
                }
                groupedBy[group].push(item)                
            });

            return groupedBy;
        },
        getProperty(item, property) {
            let value = item;
            property.split('.').forEach((key) => {
                if (value[key]) {
                    value = value[key];
                }
            });

            return value;
        },
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
.userlist {
  display: block;
}

.userlist {
  max-height: 400px;
  overflow: auto;
}
li {
    height: 40px;
}

</style>
