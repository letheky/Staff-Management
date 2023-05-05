<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-6 pt-5">
          <h2>
            <v-icon size="">arrow_back_ios</v-icon> Cầu Giấy
            <v-icon>arrow_back_ios</v-icon> Add account
          </h2>
        </div>
      </v-col>
      <v-col md="12">
        <v-row>
          <v-col md="6">
            <div class="px-6">
              <label>Select account</label>
              <v-select
                label="User account"
                items="items"
                outlined
                hide-details
              ></v-select>
              Want to create a new account? Create new account
            </div>
          </v-col>
          <v-col md="6">
            <div class="px-6">
              <label>&nbsp;</label>
              <v-text-field
                outlined
                label="User name"
                disabled
                hide-details
              ></v-text-field></div
          ></v-col>
        </v-row>
      </v-col>
      <v-col md="12">
        <v-row>
          <v-col md="6">
            <div class="px-6">
              <h3 class="mb-2 mt-4">Select role</h3>
              <label>Select role</label>
              <v-select
                label="Select role"
                items="items"
                outlined
                hide-details
              ></v-select>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col md="6">
        <div class="pa-6">
          <h3 class="mb-2">More information</h3>
          <v-select label="Pri./ Sec. School" items="items" outlined></v-select>
          <v-select label="English School" items="items" outlined></v-select>
          <v-select label="Counselor" items="items" outlined></v-select>
          <v-select label="Record type" items="items" outlined></v-select>
          <v-select label="Referral by" items="items" outlined></v-select>
          <v-select label="Source reference" items="items" outlined></v-select>
          <v-select
            label="Source reference note"
            items="items"
            outlined
          ></v-select>
          <v-select label="Date of Joining" items="items" outlined></v-select>
          <v-select label="Remark" items="items" outlined></v-select>
          <v-select label="Study Purpose" items="items" outlined></v-select>
          <v-select label="IELTS Band Score" items="items" outlined></v-select>
          <v-btn color="warning" class="pl-10 pr-10 mr-5" outlined
            >Cancel</v-btn
          >
          <v-btn color="secondary" class="pl-10 pr-10">Add account</v-btn>
        </div>
      </v-col>
      <v-col md="6">
        <div class="pa-6">
          <h3 class="mb-2">Guardian</h3>
          <v-checkbox label="Have guardian"></v-checkbox>
          <v-select label="Guardian account" items="items" outlined></v-select>
          <v-text-field label="Guardian name" outlined disabled></v-text-field>
          <v-text-field label="Guardian phone" outlined disabled></v-text-field>
          <v-text-field label="Guardian email" outlined disabled></v-text-field>
          <h3 class="mb-2 mt-4">Relative</h3>
          <div class="relative d-flex justify-space-between align-center pb-2">
            <v-text-field
              label="OtherStudentCode - Name"
              outlined
              hide-details=""
            ></v-text-field>
            -
            <v-text-field
              label="RelativeType"
              hide-details=""
              outlined
            ></v-text-field>
          </div>
          <v-btn color="secondary" width="100%">Add relative</v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      data: [
        { label: "Phone contact", value: "(043) 546 3653" },
        { label: "Email", value: "emailexame@email.com" },
        {
          label: "Adress",
          value: "CT3B, Khu đô thị Văn Quán, Hà Đông, Hà Nội",
        },
        { label: "Status", value: true },
      ],
      headers: [
        {
          text: "No",
          align: "start",
          value: "no",
          width: "5%",
        },
        { text: "ID", value: "id", width: "20%" },
        { text: "Full name", value: "fullname", width: "40%" },
        { text: "Role", value: "role", width: "15%" },
        { text: "Status", value: "status", width: "15%" },
        { text: "Action", value: "action", width: "15%" },
      ],
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: [],
      currentPlace: null,
    };
  },
  mounted() {
    this.geolocate();
  },
  methods: {
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
  },
};
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
