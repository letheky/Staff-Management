<template>
  <div>
    <div v-on:click="mouseDownInput">
      <v-menu
        ref="menus"
        v-model="menu"
        @scroll="scrollSelect"
        :open-on-click="false"
        :close-on-click="true"
        :close-on-content-click="false"
        max-height="300"
        offset-y
      >
        <template v-slot:activator="{ attrs }">
          <v-text-field
            v-if="keyFilter === 'none'"
            :label="
              filterSelect.length === 0
                ? labelSelect === 'staff'
                  ? 'Select Staff'
                  : labelSelect === 'class'
                  ? 'Chọn lớp'
                  : 'Select Centers'
                : labelSelect === 'staff'
                ? filterSelect.length + ' Staff Selected'
                : labelSelect === 'class'
                ? filterSelect.length + ' lớp đã chọn'
                : filterSelect.length + ' Center Selected'
            "
            v-model="inputSearch"
            v-bind="attrs"
            placeholder="Select"
            outlined
            ref="refInput"
            :append-icon="menu ? 'mdi-menu-down' : 'mdi-menu-up'"
            class="mb-1"
          >
          </v-text-field>
          <v-text-field
            v-else-if="styleBorder === 'out-lined'"
            :label="
              label ? label : filterSelect.length === 0 ? '' : filterSelect.length + ' selected'
            "
            v-model="inputSearch"
            v-bind="attrs"
            outlined
            @input="val => $emit('keySearch', val)"
            :error="error"
            placeholder="Select"
            :dense="dense ? true : false"
            ref="refInput"
            :append-icon="menu ? 'mdi-menu-up' : 'mdi-menu-down'"
            class="mb-1"
          >
          </v-text-field>
          <v-text-field
            v-else-if="styleBorder === 'border-bottom'"
            :label="filterSelect.length === 0 ? '' : filterSelect.length + ' selected'"
            v-model="inputSearch"
            v-bind="attrs"
            ref="refInput"
            placeholder="Select"
            :append-icon="menu ? 'mdi-menu-down' : 'mdi-menu-up'"
            class="ml-1 mr-1 mb-1"
          >
          </v-text-field>

          <v-text-field
            v-else
            :label="filterSelect.length === 0 ? '' : filterSelect.length + ' selected'"
            v-model="inputSearch"
            v-bind="attrs"
            ref="refInput"
            placeholder="Select"
            :append-icon="menu ? 'mdi-menu-down' : 'mdi-menu-up'"
            loading
            class="mb-1"
          >
            <template v-slot:progress>
              <v-progress-linear absolute height="0"></v-progress-linear>
            </template>
          </v-text-field>
        </template>
        <v-list>
          <div>
            <v-list-item
              @click="unSelectAll"
              v-if="filterSelect.length === removeTheSameItem(listItem).length && !onceSelect"
              :class="'pt-2 pb-2'"
            >
              <v-list-item-title :class="'d-flex align-center'"
                ><v-icon> mdi-close-box </v-icon>

                <p :class="'ml-2'">Select All</p></v-list-item-title
              >
            </v-list-item>
            <div v-else>
              <v-list-item v-if="!onceSelect" @click="onceSelect || selectAll" :class="'mt-2 mb-2'">
                <v-list-item-title :class="'d-flex align-center'">
                  <v-icon> mdi-checkbox-blank-outline </v-icon>

                  <p :class="'ml-2'">Select All</p></v-list-item-title
                >
              </v-list-item>
            </div>

            <div v-if="!onceSelect" v-show="inputSearch.trim() !== ''">
              <v-list-item
                @click="unSelectAll"
                v-if="
                  filterSelect.length === removeTheSameItem(searchResult).length &&
                  filterSelect.reduce((count, item) => {
                    removeTheSameItem(searchResult).includes(item) ? count + 1 : count
                    return count
                  }, 0).length !== 0
                "
                :class="'pt-2 pb-2'"
              >
                <v-list-item-title :class="'d-flex align-center'"
                  ><v-icon :class="'mr-2'"> mdi-close-box </v-icon>

                  <p :class="'ml-2'">Select All Matched</p></v-list-item-title
                >
              </v-list-item>
              <v-list-item v-else @click="selectAllMatch()" :class="'mt-2 mb-2'">
                <v-list-item-title :class="'d-flex align-center'">
                  <v-icon> mdi-checkbox-blank-outline </v-icon>
                  <p :class="'ml-2'">Select All Matched</p></v-list-item-title
                >
              </v-list-item>
            </div>
            <v-list-item
              :class="'pt-2 pb-2'"
              v-for="(item, index) in removeTheSameItem(searchResult)"
              :key="index"
              :style="{ background: filterSelect.includes(item) ? '#f1f1f1 ' : '' }"
            >
              <v-list-item-title
                style="width: 100%"
                @click="removeData(item)"
                v-if="filterSelect.includes(item) || !onceSelect"
                :class="'d-flex align-center'"
                ><v-icon v-if="!onceSelect"> mdi-close-box </v-icon>

                <p :class="'ml-2'">
                  {{ item }}
                </p></v-list-item-title
              >
              <v-list-item-title
                style="width: 100%"
                @click="addData(item)"
                v-else
                :class="'d-flex align-center'"
              >
                <v-icon v-if="!onceSelect"> mdi-checkbox-blank-outline </v-icon>
                <p :class="'ml-2'">{{ item }}</p></v-list-item-title
              >
            </v-list-item>
          </div>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    return {}
  },
  computed: {
    searchResult() {
      const data = this.removeTheSameItem(this.listItem).filter(item => {
        return this.inputSearch.trim() === ''
          ? true
          : this.removeAccents(item).indexOf(this.removeAccents(this.inputSearch)) !== -1
      })
      return data.filter((item, index) => {
        return index < this.countItem
      })
    },
  },
  data() {
    return {
      menu: false,
      errorInput: false,
      isSelectAll: false,
      inputSearch: '',
      filterSelect: [],
      countItem: 20,
    }
  },
  watch: {
    inputSearch: function () {
      if ((!this.inputSearch || this.inputSearch.trim() === '') && this.onceSelect) {
        this.errorInput = true

        this.$emit('setFilter', { name: this.keyFilter, filter: [] })
      } else {
        this.errorInput = false
      }
    },
    selectedInit: function (data) {
      if (this.selectedInit.length === 0) {
        this.inputSearch = ''
      }
      this.selectedInit = data
    },

    filterSelect: function () {},
    menu: function () {},
  },
  created() {
    this.filterSelect = this.selectedInit
    if (this.selectedInit.length === this.removeTheSameItem(this.listItem).length) {
      this.isSelectAll = true
    }
  },
  props: [
    'listItem',
    'keyFilter',
    'selectedInit',
    'styleBorder',
    'label',
    'list',
    'error',
    'placeholder',
    'labelSelect',
    'dense',
    'onceSelect',
  ],
  methods: {
    removeTheSameItem(data) {
      return data.reduce((arr, item) => {
        arr.find(e => item === e) || arr.push(item)
        return arr
      }, [])
    },
    scrollSelect(e) {
      const element = e.target
      // this.countItem = this.countItem+10
      if (element.scrollTop > element.scrollHeight - element.offsetHeight - 100) {
        this.countItem = this.countItem + 10
      }
    },
    removeAccents(str) {
      return str
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
    },
    addData(item) {
      this.isSelectAll = true
      if (this.filterSelect.length === this.removeTheSameItem(this.listItem).length) {
        this.filterSelect = [item]
      } else {
        if (this.onceSelect) {
          this.filterSelect = [item]
          this.inputSearch = item
          this.menu = false
        } else {
          this.filterSelect.push(item)
        }
      }

      this.$emit('setFilter', { name: this.keyFilter, filter: this.filterSelect })
    },
    selectAll() {
      this.inputSearch = ''
      this.filterSelect = this.removeTheSameItem(this.listItem)

      this.isSelectAll = true
      this.$emit('setFilter', {
        name: this.keyFilter,
        filter: this.filterSelect,
      })
    },
    unSelectAll() {
      this.filterSelect = []

      this.isSelectAll = false
      this.$emit('setFilter', {
        name: this.keyFilter,
        filter: [],
      })
    },
    selectAllMatch() {
      this.filterSelect = this.removeTheSameItem(this.searchResult)
      this.isSelectAll = true

      this.$emit('setFilter', {
        name: this.keyFilter,
        filter: this.removeTheSameItem(this.searchResult),
      })
    },

    removeData(item) {
      this.isSelectAll = true
      this.filterSelect.splice(this.filterSelect.indexOf(item), 1)
      this.$emit('setFilter', { name: this.keyFilter, filter: this.filterSelect })
    },
    mouseDownInput() {
      setTimeout(() => {
        this.menu = true
      }, 1)
    },
  },
}
</script>

<style lang="scss" scoped></style>
