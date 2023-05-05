<template>
  <v-app>
    <v-row no-gutters id="choose-center" fill-height>
      <v-col md="4">
        <div class="pa-6">
          <img src="@/assets/images/logo-white.svg" />
          <h1 class="white--text slogan-action">Be confident to reach your dream</h1>
        </div>
      </v-col>
      <v-col md="8">
        <div class="choose-center-wrapper">
          <div class="choose-center-inner">
            <div class="list-center mb-3">
              <div
                v-for="center in centerList"
                :key="center.locationID"
                class="item mb-0"
                @click="viewCenter(center.locationID)"
                style="cursor: pointer"
              >
                {{ center.location }}
              </div>
            </div>
            <div class="d-flex justify-center align-center">
              <h3>Select center to continue</h3>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import { center_managerment } from '@/api/center-management.js'
export default {
  components: {},
  data() {
    return {
      accountType: '',
      groupID: '',
    }
  },
  computed: {
    centerList() {
      return JSON.parse(localStorage.getItem('currentUser')).locationPermissions
    },
  },
  methods: {
    async viewCenter(locationID) {
      localStorage.setItem('currentCenter', JSON.stringify(locationID))
      let currentCenter = JSON.parse(localStorage.getItem('currentCenter'))
      this.centerList.forEach(x => {
        if (currentCenter === x.locationID) {
          this.accountType = x.accountTypeName
          this.groupID = x.groupID
        }
      })

      if (this.accountType === 'Teacher') {
        this.$router.push({
          name: 'my-calendar-overview',
        })
      } else {
        await center_managerment.functionRole(this.groupID).then(res => {
          if (res) {
            localStorage.setItem('functionRole', JSON.stringify(res))
          }
        })
        this.$router.push({
          name: 'home',
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#choose-center {
  background: url('~@/assets/images/bg-login.jpg') left bottom;
  .choose-center-wrapper {
    background-color: #fff;
    border-radius: 25px 0px 0px 25px;
    height: 100vh;
    flex: 1;
    display: flex;
    align-items: center;
    .choose-center-inner {
      width: 450px;
      margin: 0 auto;
      .list-center {
        background: #f7f8fc;
        border: 1px solid #e6e8ec;
        border-radius: 3px;
        padding: 0 24px;
        .item {
          border-bottom: 1px dashed #d6e1f7;
          padding: 10px 0px;
          &:last-child {
            border: none;
          }
        }
      }
    }
  }
  img {
    height: 200px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .slogan-action {
    font-size: 24px;
    text-align: center;
  }
}

@media (max-width: 641px) {
  #choose-center {
    background: none;
    .choose-center-inner {
      width: calc(100vw - 30px) !important;
    }
  }
}
</style>
