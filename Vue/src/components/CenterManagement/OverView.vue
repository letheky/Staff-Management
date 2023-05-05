<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="mb-10">Center management</h2>
          <v-data-table
            :headers="headers"
            :items="centerList"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="pageCount = $event"
            class="elevation-0"
            fixed-header
            height="65vh"
          >
            <template v-slot:header="{}"> </template>
            <template v-slot:[`item.no`]="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.name`]="{ item }">
              <span @click="viewDetail(item.locationID)">{{ item.location }}</span>
            </template>

            <template v-slot:[`item.tel`]="{ item }">
              {{ item.tel }}
            </template>

            <template v-slot:[`item.address`]="{ item }">
              {{ item.address }}
            </template>

            <template v-slot:[`item.action`]="{ item }">
              <v-icon size="18" @click="viewDetail(item.locationID)" color="primary"
                >visibility</v-icon
              >
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <div color="#fff" class="w-100 pl-10 pr-10">
      <v-row>
        <v-col md="2">
          <v-select
            outlined
            hide-details
            dense
            :value="itemsPerPage"
            :items="[20, 50, 100, 200]"
            @change="itemsPerPage = parseInt($event, 10)"
            style="height: 32px"
          ></v-select>
        </v-col>
        <v-col md="4" class="d-flex align-center justify-end">
          <h3 v-if="centerList.length != 1">Total: {{ centerList.length }} centers</h3>
          <h3 v-else>Total: {{ centerList.length }} center</h3>
        </v-col>
        <v-col md="6" class="d-flex justify-end">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="7"
            elevation="0"
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      headers: [
        {
          text: 'No',
          align: 'start',
          value: 'no',
          sortable: false,
          width: '5%',
        },
        { text: 'Center name', value: 'name', sortable: false, width: '25%' },
        { text: 'Tel', value: 'tel', sortable: false, width: '15%' },
        { text: 'Address', value: 'address', sortable: false, width: '45%' },
        { text: 'Action', value: 'action', sortable: false, width: '10%' },
      ],
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
    }
  },
  methods: {
    viewDetail(centerId) {
      this.$router.push({
        name: 'center-management-detail',
        params: { centerId: centerId },
      })
    },
  },
}
</script>
<style lang="scss" scoped></style>
