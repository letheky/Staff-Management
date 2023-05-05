<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5 d-flex justify-space-between">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">Center Information</div>
          </h2>
          <!-- <v-btn @click="addNewAccount()" color="primary">Add account</v-btn> -->
        </div>
      </v-col>
    </v-row>
    <div v-if="isLoading" class="px-10">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
    </div>
    <v-row v-if="!isLoading" no-gutters>
      <v-col md="6">
        <div class="pl-10 pa-6">
          <h3 class="mb-2">Information</h3>
          <div class="center-info mb-0">
            <v-list-item class="item pa-0">
              <v-list-item-content>
                <v-row>
                  <v-col md="4">Name</v-col>
                  <v-col md="8">
                    {{ centerDetail.location }}
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="item pa-0">
              <v-list-item-content>
                <v-row>
                  <v-col md="4">Phone contact</v-col>
                  <v-col md="8">
                    {{ centerDetail.tel }}
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="item pa-0">
              <v-list-item-content>
                <v-row>
                  <v-col md="4">Email</v-col>
                  <v-col md="8">
                    {{ centerDetail.email }}
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="item pa-0">
              <v-list-item-content>
                <v-row>
                  <v-col md="4">Address</v-col>
                  <v-col md="8">
                    {{ centerDetail.address }}
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </div>
        </div>
      </v-col>
    </v-row>
    <!-- <v-row v-if="!isLoading" no-gutters>
      <v-col md="6">
        <div class="pl-10 pa-6 pt-0">
          <h3 class="mb-2">Location</h3>
          <div class="center-map">
            <gmap-map
              :center="center"
              :zoom="12"
              style="width: 100%; height: 300px"
            >
              <gmap-marker
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                @click="center = m.position"
              ></gmap-marker>
            </gmap-map>
          </div>
        </div>
      </v-col>
    </v-row> -->
  </div>
</template>

<script>
import { center_managerment } from '@/api/center-management.js'

export default {
  components: {},
  data() {
    return {
      isLoading: false,
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      centerId: this.$route.params.centerId,
      centerDetail: null,
      headers: [
        { text: 'Username', value: 'userName', sortable: false, width: '20%' },
        { text: 'Full name', value: 'fullName', sortable: false, width: '30%' },
        {
          text: 'Role',
          value: 'accountTypeName',
          sortable: false,
          width: '20%',
        },
        { text: 'Status', value: 'status', sortable: false, width: '10%' },
        { text: 'Action', value: 'action', sortable: false, width: '20%' },
      ],
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: [],
      currentPlace: null,
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.geolocate()
  },
  methods: {
    async init() {
      this.isLoading = true
      await center_managerment.getDetailCenter(this.centerId).then(res => {
        if (res) {
          this.centerDetail = res
        }
      })
      this.isLoading = false
    },
    addNewAccount() {
      this.$router.push({
        name: 'center-management-add-new-account',
      })
    },
    viewDetailUser(userId) {
      this.$router.push({
        name: 'center-management-user-detail',
        params: { userId: userId },
      })
    },
    back() {
      window.history.back()
    },
    setPlace(place) {
      this.currentPlace = place
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        }
        this.markers.push({ position: marker })
        this.places.push(this.currentPlace)
        this.center = marker
        this.currentPlace = null
      }
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
#center-management {
  .center-info {
    background: #faf9ff;
    border-radius: 6px;
    padding: 10px 24px;
    .item {
      border-bottom: 1px dashed #dadbe6;
      &:last-child {
        border: none;
      }
    }
  }
  footer {
    box-shadow: 0px -2px 9px rgba(184, 184, 184, 0.1);
  }
}
</style>
