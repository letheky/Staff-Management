<template>
  <div>
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 py-5">
          <v-row>
            <v-icon
              v-show="accountTypeID === 5 && $route.name !== 'account-management-view-account'"
              @click="back()"
              >arrow_back_ios</v-icon
            >
            <h2 v-if="$route.name === 'view-account'">
              {{
                $route.name === 'account-management-view-account'
                  ? 'Study Pathway'
                  : 'Hoạch định lộ trình học tập'
              }}
            </h2>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row
      v-if="$route.name !== 'account-management-view-account'"
      class="pa-10 py-5 infor-student"
    >
      <v-col md="4">
        <div class="list-info">
          <div class="item">
            <v-row>
              <v-col md="6"><h4>Học sinh</h4></v-col>
              <v-col md="6">{{ studentInfor.studentName }}</v-col>
            </v-row>
          </div>
          <div class="item">
            <v-row>
              <v-col md="6"><h4>Mã học sinh</h4></v-col>
              <v-col md="6">{{ studentInfor.studentCode }}</v-col>
            </v-row>
          </div>
        </div>
      </v-col>
      <v-col md="3">
        <div class="list-info">
          <div class="item">
            <v-row>
              <v-col md="6"><h4>DOB</h4></v-col>
              <v-col md="6">{{ dayjs(studentInfor.dob).format('DD/MM/YYYY') }}</v-col>
            </v-row>
          </div>
          <div class="item">
            <v-row>
              <v-col md="6"><h4>Start date</h4></v-col>
              <v-col md="6">{{ dayjs(studentInfor.startDate).format('DD/MM/YYYY') }}</v-col>
            </v-row>
          </div>
        </div>
      </v-col>
      <v-col md="5">
        <div class="list-info">
          <div class="item">
            <v-row>
              <v-col md="4"><h4>Trường học</h4></v-col>
              <v-col md="8">{{ studentInfor.school }}</v-col>
            </v-row>
          </div>
          <div class="item">
            <v-row>
              <v-col md="4"><h4>Nhân viên tư vấn</h4></v-col>
              <v-col md="8">{{ studentInfor.counselorName }}</v-col>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>
    <div v-if="roadmap_table.length > 0" class="roadmap-container">
      <div class="roadmap">
        <!-- generate first part of roadmap if there exists at least one element in array-->
        <!-- tạo phần đầu của roadmap nếu tồn tại ít nhất một đơn vị trong array-->
        <div class="line-left"><img src="../../assets/images/icon-map.svg" /></div>
        <!-- <div class="content-1">
          <div class="circle">
            <p class="date">{{ roadmap_table[0].startTime }}</p>
          </div>
          <div class="connect"></div>
          <div class="note">
            <p>{{ roadmap_table[0].remarks }}</p>
          </div>
        </div>
        <div class="content-2">
          <div class="subtext">
            {{ roadmap_table[0].thoiGianHoc }} giờ ~ {{ roadmap_table[0].soThang }} tháng
          </div>
          <div class="right-rect"></div>
          <div class="left-rect"></div>
          <div class="rectangle">{{ roadmap_table[0].khoaHoc }}</div>
        </div>
        <div class="content-1">
          <div class="circle">
            <p class="date">{{ roadmap_table[0].endTime }}</p>
          </div>
          <div v-if="roadmap_table.length > 1">
            <div class="connect"></div>
            <div class="note">
              <p>
                {{ roadmap_table[0].remarks }}
              </p>
            </div>
          </div>
        </div> -->
        <!-- Continue to generate if there are more than one element in array -->
        <!-- Tiếp tục xây dựng nếu tồn hơn một đơn vị trong array -->
        <div style="display: flex">
          <div style="display: flex" v-for="item in roadmap_table" :key="item.studentPathwayID">
            <div style="display: flex">
              <div class="content-1">
                <div class="circle">
                  <p class="date">{{ item.startTime }}</p>
                </div>
                <div class="connect"></div>
                <div class="note">
                  <p>
                    {{ item.remarks }}
                  </p>
                </div>
              </div>
              <div class="content-2">
                <div class="subtext">{{ item.thoiGianHoc }} giờ ~ {{ item.soThang }} tháng</div>
                <div class="right-rect"></div>
                <div class="left-rect"></div>
                <div class="rectangle">
                  <p :style="{ width: '150px' }">{{ item.khoaHoc }}</p>
                  <p :style="{ color: '#F6B91A' }">{{ item.pathways }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="circle">
            <p class="date">{{ roadmap_table[roadmap_table.length - 1].endTime }}</p>
          </div>
        </div>
        <!-- <div class="line-right"></div> -->

        <div class="triangle-right">
          <img src="../../assets/images/icon-arrow.svg" />
        </div>
        <div>
          <h2 class="text-final">Cam kết đầu ra</h2>
          <p class="final">{{ roadmap_table[roadmap_table.length - 1].pathways }}</p>
        </div>
        <!-- <div class="btn-start">
          <h3>Cam kết đầu ra</h3>
          <v-btn>Starters</v-btn>
        </div> -->
      </div>
    </div>
    <v-data-table
      height="350"
      :headers="headers"
      :items="roadmap_table"
      hide-default-footer
      class="elevation-1 mr-5 ml-5 table-road-map"
    >
      <template v-slot:[`item.hocPhiBuoiHoc`]="{ item }"
        >{{ item.hocPhiBuoiHoc.toLocaleString('en') }}
      </template>
      <!-- <template v-slot:[`item.hocPhiBuoiHoc`]="{ item }"
        >{{ item.hocPhiBuoiHoc.toLocaleString('en') }}
      </template> -->
      <template v-slot:[`item.hocPhiKhoaHoc`]="{ item }"
        >{{ item.hocPhiKhoaHoc.toLocaleString('en') }}
      </template>
      <template v-slot:[`item.uuDai`]="{ item }">{{ item.uuDai.toLocaleString('en') }} </template>

      <template v-slot:[`item.hocPhiThucTe`]="{ item }"
        >{{ item.hocPhiThucTe.toLocaleString('en') }}
      </template>
      <template v-slot:[`item.hocPhiBuoiHocUuDai`]="{ item }"
        >{{ item.hocPhiBuoiHocUuDai.toLocaleString('en') }}
      </template>
      <template v-slot:foot>
        <tfoot>
          <tr>
            <td><p :style="{ width: '150px' }">Tổng cộng:</p></td>
            <td>{{ totalRoadMap.thoiGianHoc }}</td>
            <td>{{ totalRoadMap.soThang }}</td>
            <td>{{ totalRoadMap.thoiLuong }}</td>

            <td>{{ totalRoadMap.sobuoiHoc }}</td>
            <td></td>
            <td>{{ totalRoadMap.hocPhiKhoaHoc.toLocaleString('en') }}</td>
            <td></td>
            <td>{{ totalRoadMap.hocPhiThucTe.toLocaleString('en') }}</td>
            <td>{{ totalRoadMap.uuDai }}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </template>
    </v-data-table>
    <!-- will not generate roadmap if there array is empty -->
    <!-- không tạo roadmap nếu array trống -->
  </div>
</template>

<script>
import { roadmap } from '@/api/roadmap.js'
import dayjs from 'dayjs'
import { student_information } from '@/api/student-information'

export default {
  data() {
    return {
      dayjs: dayjs,
      totalRoadMap: {
        thoiGianHoc: 0,
        soThang: 0,
        thoiLuong: 0,
        tanSuat: 0,
        sobuoiHoc: 0,
        hocPhiBuoiHoc: 0,
        hocPhiKhoaHoc: 0,
        uuDai: 0,
        hocPhiUuDai: 0,
        hocPhiThucTe: 0,
        hocPhiBuoiHocUuDai: 0,
      },
      headers: [
        {
          text: 'Khóa học',
          align: 'start',
          sortable: false,
          value: 'khoaHoc',
        },
        { text: 'Thời gian học (h)', value: 'thoiGianHoc' },
        { text: 'Số tháng', value: 'soThang' },
        { text: 'Thời lượng (h/Buổi)', value: 'thoiLuong' },
        { text: 'Số buổi học', value: 'sobuoiHoc' },
        { text: 'Học phí', value: 'hocPhiBuoiHoc' },
        { text: 'Học phí khóa học', value: 'hocPhiKhoaHoc' },
        { text: 'HP ưu đãi( Buổi)', value: 'hocPhiBuoiHocUuDai' },
        { text: 'Học phí thực tế ', value: 'hocPhiThucTe' },
        { text: 'Ưu đãi', value: 'uuDai' },
        { text: 'Thời gian bắt đầu', value: 'startTime' },
        { text: 'Thời gian kết thúc', value: 'endTime' },
        { text: 'Ghi chú', value: 'remarks' },
        { text: 'Pathways', value: 'pathways' },
      ],
      roadmap_table: [],
      studentInfor: {},
      studentID:
        Object.keys(this.$route.query).length === 0
          ? JSON.parse(localStorage.getItem('currentUser')).userInfo.studentID
          : this.$route.query.studentID,
      accountTypeID: JSON.parse(localStorage.getItem('currentUser')).userInfo.accountTypeID,
      userID:
        JSON.parse(localStorage.getItem('currentUser')).userInfo.accountTypeID === 1
          ? JSON.parse(localStorage.getItem('currentUser')).userInfo.userID
          : this.$route.query.userID,
    }
  },
  watch: {
    studentInfor: function () {},
  },

  created() {
    if (this.$route.name === 'account-management-view-account') {
      this.userID = this.$route.params.userId
    }
    this.init()
  },
  methods: {
    back() {
      if (this.$route.query.isFromDetail) {
        this.$router.push({
          name: 'class-management-detail',
          query: {
            classID: this.$route.query.classID,
            tabPage: 3,
          },
        })
      } else {
        window.history.back()
      }
    },
    async init() {
      await student_information.getStudentInfor(this.userID).then(res => {
        this.studentInfor = res
      })
      await roadmap.getStudyPathways(this.studentInfor.studentID).then(result => {
        if (result) {
          const roadmap_table = result.reduce((arr, item) => {
            arr.push({
              ...item,
              uuDai: item.hocPhiKhoaHoc - item.hocPhiThucTe,
            })
            return arr
          }, [])
          const totalRoadMap = {
            thoiGianHoc: 0,
            soThang: 0,
            thoiLuong: 0,
            tanSuat: 0,
            sobuoiHoc: 0,
            hocPhiBuoiHoc: 0,
            hocPhiKhoaHoc: 0,
            uuDai: 0,
            hocPhiUuDai: 0,
            hocPhiThucTe: 0,
            hocPhiBuoiHocUuDai: 0,
          }
          this.roadmap_table = roadmap_table

          roadmap_table.forEach(y => {
            totalRoadMap.thoiGianHoc += y.thoiGianHoc
            totalRoadMap.soThang += y.soThang
            totalRoadMap.thoiLuong += y.thoiLuong
            totalRoadMap.sobuoiHoc += y.sobuoiHoc
            totalRoadMap.hocPhiBuoiHoc += y.hocPhiBuoiHoc
            totalRoadMap.hocPhiKhoaHoc += y.hocPhiKhoaHoc
            totalRoadMap.hocPhiUuDai += y.hocPhiUuDai
            totalRoadMap.hocPhiThucTe += y.hocPhiThucTe
            totalRoadMap.uuDai += y.uuDai
            totalRoadMap.hocPhiBuoiHocUuDai += y.hocPhiBuoiHocUuDai
            if (y.startTime) y.startTime = y.startTime.replace('-', '/')
            if (y.startTime) y.endTime = y.endTime.replace('-', '/')
            if (!y.remarks) y.remarks = '-'
          })

          this.totalRoadMap = totalRoadMap
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.roadmap-container {
  position: relative;
  display: flex;
  overflow: auto;
  padding: 0 1rem;
  padding-top: 50px;
  margin-bottom: 2rem;

  // margin-top: 42px;
}
.content-1 {
  z-index: 3;
  position: relative;
  width: 100px;
}
.content-2 {
  transform: translateY(-23px);
  z-index: 0;
  width: 150px;
}
.line-left {
  height: 10px;
  width: 60px;
  background-color: rgb(31, 9, 112);
  margin-top: 42px;
  float: left;
}
.line-left img {
  transform: translate(-50%, -100%);
}
.line-right {
  height: 10px;
  width: 60px;
  background-color: rgb(31, 9, 112);
  margin-top: 42px;
  float: right;
}
.btn-start {
  display: flex;
  padding-top: 10px;
  flex-direction: column;
  align-items: center;
}
.btn-start button {
  padding: 9.01288px;
  margin: 0 auto;
  gap: 7.51px;
  width: 100px;
  color: #fff;
  height: 35px;
  background: linear-gradient(180deg, #fe6262 0%, #ff063f 100%);
  border-radius: 19.5279px;
}
.triangle-right h3 {
  position: absolute;
  top: 50%;
  left: 50%;
  background: #ffff;
  padding: 0.2rem;
  transform: translate(-60%, -100%);
}
.triangle-right {
  margin-top: 20px;
  margin-left: -21px;
  /* display: flex; */
  justify-content: center;
  position: relative;
  top: 0;
  // align-items: center;
  // border-top: 20px solid transparent;
  // border-left: 40px solid rgb(31, 9, 112);
  // border-bottom: 20px solid transparent;
  // margin-top: 25px;
}
.triangle-right img {
  width: 115px;
}
.roadmap {
  display: flex;
  flex-direction: row;
  // overflow-y: auto;

  justify-content: center;
  position: relative;
  // width: 100%;
  margin: auto;
}
.btn-start {
  padding-left: 100px;
}
.infor-student {
  width: 90%;
  // margin: 0 auto;
}
.roadmap .rectangle {
  padding: 0px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  display: flex;

  justify-content: center;
  align-items: center;
  height: 70px;
  background-color: rgb(31, 9, 112);
  transition: all 200ms ease-in;
  margin-top: 14px;
  z-index: 1;
  color: white;
}
.item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed #dadbe6;
  padding: 11px 0;
}
.roadmap .left-rect {
  height: 70px;
  width: 40px;
  background-color: rgb(31, 9, 112);
  float: left;
  margin-top: 14px;
  margin-left: -20px;
}
.roadmap .right-rect {
  height: 70px;
  width: 40px;
  background-color: rgb(31, 9, 112);
  float: right;
  margin-top: 14px;
  margin-right: -20px;
}
.roadmap .subtext {
  text-align: center;
}
.roadmap .note {
  position: relative;
  width: 13em;
  border: 1px solid #fcbf29;
  background-color: #fffacf;
  text-align: center;
  border-style: solid;
  /* max-width: 100px; */
  height: auto;
  left: 80%;
  -webkit-border-radius: 4px;
  -webkit-border-top-left-radius: 0;
  -moz-border-radius: 4px;
  -moz-border-radius-topleft: 0;
  border-radius: 4px;
  border-top-left-radius: 0;
  // margin-top: 50px;
}
.roadmap .note p {
  padding: 10px;
  word-break: break-all;
  // margin-top: 50px;
}
.roadmap .connect {
  height: 32px;
  margin-top: -18px;
  background-color: #fcbf29;
  width: 2px;
  margin-left: 170%;
}
.final {
  padding: 1rem 0rem;
  border: 2px solid #fd003a;
  font-style: normal;
  font-weight: 700;
  font-size: 25.9381px;
  line-height: 32px;
  /* identical to box height */

  text-align: center;

  color: #fd003a;
}
.text-final {
  text-align: center;
  margin-top: -15px;
  width: 160px;
}
.roadmap .circle {
  height: 100px;
  width: 100px;
  background: #fff;
  border: 4px solid rgb(240, 206, 14);
  border-radius: 50%;
  position: relative;
  justify-content: center;
  align-items: center;
  display: flex;
  font-weight: 800;
}
tfoot {
  position: sticky;
  bottom: 0;
  background: rgb(247, 239, 239);
}
tfoot * {
  color: rgb(236, 5, 5) !important;
  font-weight: 900;
}
</style>
