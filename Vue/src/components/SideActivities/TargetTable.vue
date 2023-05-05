<template>
  <v-form v-model="formActivityTarget" ref="formActivityTarget">
    <v-dialog v-model="dialog" persistent width="600" class="mt-5 mr-10 ml-10">
      <v-card :class="'table-activity-target'">
        <v-card-title class="text-h5">
          <div class="header-target">
            <p>Set target</p>
            <img
              @click="$emit('setLog', false)"
              :src="require('../../assets/images/icon-close-round.svg')"
              alt=""
              srcset=""
            />
          </div>
        </v-card-title>
        <v-card-text>
          <div class="d-flex align-center mb-3">
            <h3>Activity code:</h3>
            <h3 style="font-weight: 500">&nbsp;{{ code }}</h3>
          </div>
          <v-tabs v-model="tab" color="deep-purple accent-4">
            <v-tab>view</v-tab>
            <v-tab>edit</v-tab>

            <v-tab-item>
              <template>
                <v-data-table
                  :items="target"
                  hide-default-header
                  hide-default-footer
                  class="elevation-0"
                  fixed-header
                  max-height="60vh"
                >
                  <template v-slot:header="{}">
                    <thead class="header-report-activity">
                      <tr>
                        <th
                          v-for="(header, index) in headers"
                          :style="{
                            background: header.bgColor,
                            border: '1px solid #ffff',
                            color: '#ffff !important',
                          }"
                          :key="index"
                          :colspan="header.children.length === 0 ? 1 : header.children.length"
                          :rowspan="header.children.length === 0 ? 2 : 1"
                        >
                          {{ header.text }}
                        </th>
                      </tr>
                      <tr>
                        <template v-for="(header, index) in headersForTable">
                          <th
                            :key="index + headerChild.text"
                            v-for="(headerChild, index2) in header.children"
                            :style="{
                              background: headerChild.bgColor,
                              border: '1px solid #ffff',
                              color: '#ffff !important',
                            }"
                          >
                            <p :class="headerChild.isFixW === true ? 'w-150' : ''" :key="index2">
                              {{ headerChild.text }}
                            </p>
                          </th>
                        </template>
                      </tr>
                    </thead>
                  </template>
                  <template v-slot:body="{}">
                    <tbody
                      :set="
                        (listTable = headersForTable.reduce((arr, el) => {
                          el.children.length === 0 ? arr.push(el) : arr.push(...el.children)
                          return arr
                        }, []))
                      "
                    >
                      <tr v-for="center in target" :key="center.locationID">
                        <td v-for="header in listTable" :key="header.value">
                          {{
                            header.isMoney
                              ? numberWithCommas(center[header.value])
                              : center[header.value]
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                  <template v-slot:foot="{}"> </template>
                </v-data-table>
              </template>
            </v-tab-item>
            <v-tab-item>
              <template>
                <v-data-table
                  :items="targetList"
                  hide-default-header
                  hide-default-footer
                  class="elevation-0"
                  fixed-header
                  max-height="60vh"
                >
                  <template v-slot:header="{}">
                    <thead class="header-report-activity">
                      <tr>
                        <th
                          v-for="(header, index) in headers"
                          :style="{
                            background: header.bgColor,
                            border: '1px solid #ffff',
                            color: '#ffff !important',
                          }"
                          :key="index"
                          :colspan="header.children.length === 0 ? 1 : header.children.length"
                          :rowspan="header.children.length === 0 ? 2 : 1"
                        >
                          {{ header.text }}
                        </th>
                      </tr>
                      <tr>
                        <template v-for="(header, index) in headers">
                          <th
                            :key="index + headerChild.text"
                            v-for="(headerChild, index2) in header.children"
                            :style="{
                              background: headerChild.bgColor,
                              border: '1px solid #ffff',
                              color: '#ffff !important',
                            }"
                          >
                            <p :class="headerChild.isFixW === true ? 'w-150' : ''" :key="index2">
                              {{ headerChild.text }}
                            </p>
                          </th>
                        </template>
                      </tr>
                    </thead>
                  </template>
                  <template v-slot:body="{}">
                    <tbody
                      :set="
                        (listTable = headers.reduce((arr, el) => {
                          el.children.length === 0 ? arr.push(el) : arr.push(...el.children)
                          return arr
                        }, []))
                      "
                    >
                      <tr v-for="(center2, index) in targetList" :key="index">
                        <td v-for="(header, index2) in listTable" :key="index2">
                          <p v-if="header.value === 'location'">{{ center2[header.value] }}</p>
                          <v-text-field
                            v-else
                            type="number"
                            :rules="[v => !!v || 'This filed is required']"
                            v-model="center2[header.value]"
                          ></v-text-field>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                  <template v-slot:foot="{}"> </template>
                </v-data-table>
              </template>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" outlined @click="tab == 1 ? (tab = 0) : $emit('setLog', false)"
            >Cancel
          </v-btn>
          <v-btn color="primary" v-if="tab === 0" @click="tab = 1"> Edit </v-btn>
          <v-btn color="primary" v-else @click="SaveTarget()"> Save </v-btn>
        </v-card-actions>
      </v-card>
      <FlashMessage></FlashMessage>
    </v-dialog>
  </v-form>
</template>

<script>
import { activities } from '@/api/activities'

export default {
  data() {
    return {
      listHidden: [],
      tab: 0,
      formActivityTarget: false,
      headers: [
        { text: 'Center', value: 'location', bgColor: '#0B2585', children: [] },
        {
          text: 'Target',
          bgColor: '#0B2585',
          children: [
            { text: 'Number', value: 'targetNumEdit', bgColor: '#0B2585' },
            { text: 'Value', value: 'targetValueEdit', bgColor: '#0B2585' },
          ],
        },
      ],
      locationListAll: [],
      headersForTable: [
        { text: 'Center', value: 'location', bgColor: '#0B2585', children: [] },
        {
          text: 'Target',
          bgColor: '#0B2585',
          children: [
            { text: 'Number', value: 'targetNum', bgColor: '#0B2585' },
            { text: 'Value', value: 'targetValue', bgColor: '#0B2585', isMoney: true },
          ],
        },
      ],
      targetList: [],
    }
  },
  setup() {
    return {}
  },

  created() {
    this.targetList = this.target.map(element => {
      return {
        ...element,
        targetNumEdit: element.targetNum,
        targetValueEdit: element.targetValue,
      }
    })
  },
  mounted() {},
  props: ['dialog', 'target', 'idUp', 'code'],
  watch: {},

  methods: {
    async SaveTarget() {
      this.$refs.formActivityTarget.validate()
      if (this.formActivityTarget) {
        const dataTarget = {
          activityID: this.idUp,
          target: this.targetList.map(item => {
            return {
              locationID: item?.locationID,
              targetNumber: parseFloat(item?.targetNumEdit),
              targetValue: parseFloat(item?.targetValueEdit),
            }
          }),
        }
        await activities
          .updateTarget(dataTarget)
          .then(() => {
            this.$emit('callData')
            this.$emit('setLog', false)
          })
          .catch(() => {
            this.flashMessage.show({
              status: 'error',
              title: 'Error edit target ',
              message: 'Please try again',
            })
          })
      }
    },
    changeHiddenSup(subItem) {
      if (this.listHidden.includes(subItem)) {
        this.listHidden = this.listHidden.filter(function (item) {
          return item !== subItem
        })
      } else {
        this.listHidden = [...this.listHidden, subItem]
      }
    },
    numberWithCommas(number) {
      var parts = parseInt(number).toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join(',')
    },
    findSupervisorInList(subList, staff) {
      return subList.find(sub => sub.supID === staff.managerCounselorID)
    },
  },
}
</script>

<style lang="scss" scoped>
.header-report-activity th {
  border: '1px solid #ffff';
  text-align: center !important;
  color: #ffffff !important;
}
.w-150 {
  width: 50px;
}
.sale-byqcec {
  margin-top: 28px;
}
.row-sale:nth-of-type(odd) {
  background: #bde6fbb0;
}
tbody tr:nth-of-type(even) {
  background: #d1eeff;
}
.header-target {
  width: 100%;
  position: relative;
  img {
    position: absolute;
    right: 0;
    top: 0;
  }
  p {
    text-align: center;
  }
}
</style>
