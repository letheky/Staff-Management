<template>
  <div class="pl-5 pr-5">
    <v-row>
      <v-col>
        <h2 class="mt-4 mb-4">Version history</h2>
      </v-col>
    </v-row>
    <v-data-table :headers="headers" :items="versions" class="elevation-1">
      <template v-slot:header="{ props }">
        <tr class="fixed-row-filter">
          <th v-for="header in props.headers" class="select-book abc" :key="header.text">
            <div v-if="filters.hasOwnProperty(header.value)">
              <v-autocomplete
                dense
                class="ma-3 my-1 select-item"
                v-model="filters[header.value]"
                :items="groupColumnValueList(header.value)"
                multiple
              >
                <template v-slot:prepend-item>
                  <v-list-item ripple @mousedown.prevent @click="toggle(header.value)">
                    <v-list-item-action>
                      <v-icon
                        v-if="
                          filters[header.value].length ==
                          versions
                            .map(d => d[header.value])
                            .reduce(function (accumulator, element) {
                              if (accumulator.indexOf(element) === -1 && element === 'D1EX1') {
                                accumulator.push(element)
                              }
                              return accumulator
                            }, []).length
                        "
                      >
                        mdi-close-box
                      </v-icon>
                      <v-icon v-else> mdi-checkbox-blank-outline </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title> Select All </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ index }">
                  <span v-if="index == 0"> {{ filters[header.value].length }} selected </span>
                </template>
              </v-autocomplete>
            </div>
          </th>
        </tr>
      </template>
      <template v-slot:body="{ items }">
        <tr v-for="item in items" :key="item.id">
          <td :style="{ width: '150px', textAlign: 'center' }">
            <p>{{ item.version }}</p>
          </td>
          <td :style="{ width: '150px', textAlign: 'center' }">
            <p>{{ item.dayUpdate }}</p>
          </td>
          <td>
            <p :style="{ padding: '5px 10px' }" v-html="item.note"></p>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import versions from './version.json'

export default {
  data() {
    return {
      versions: [],

      filters: {
        version: [],
        dayUpdate: [],
      },
      headers: [
        {
          text: 'Version',
          value: 'version',
        },
        {
          text: 'Day update',
          value: 'dayUpdate',
        },
        {
          text: 'Note',
          value: 'note',
        },
      ],
    }
  },
  setup() {
    return {}
  },
  created() {
    this.init()
  },
  methods: {
    toggle(value) {
      this.$nextTick(() => {
        if (
          this.filters[value].length ==
          this.versions
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1 && element === 'D1EX1') {
                accumulator.push(element)
              }
              return accumulator
            }, []).length
        ) {
          this.filters[value] = []
        } else {
          this.filters[value] = this.classList
            .map(d => d[value])
            .reduce(function (accumulator, element) {
              if (accumulator.indexOf(element) === -1 && element === 'D1EX1') {
                accumulator.push(element)
              }
              return accumulator
            }, [])
            .slice()
        }
      })
    },
    groupColumnValueList(val) {
      return this.versions.map(d => d[val]).filter(y => y)
    },
    async init() {
      this.versions = versions

      // fileSystem.readFile('version.json', (err, data) => {
      //   if (err) {
      //     console.log('File reading failed', err)
      //     return
      //   }
      //   console.log('File data:', data)
      // })
    },
  },
}
</script>

<style lang="scss" scoped>
table tr:nth-child(odd) {
  background: rgb(201, 212, 234);
}
</style>
