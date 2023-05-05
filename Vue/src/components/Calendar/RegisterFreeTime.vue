<template>
  <div id="account-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="d-flex justify-space-between pa-10 pb-0 py-5">
          <div>
            <h2>Time available</h2>
            <div v-if="code == 200" class="success">
              <v-alert
                :value="checkSuccess"
                transition="scale-transition"
                type="success"
                style="font-size: 14px; padding: 12px"
              >
                Register free time successfully!
              </v-alert>
            </div>
          </div>
          <div>
            <v-btn
              @click="
                addTimeAvailableDialog = true;
                weekDayPop = '';
                picker = '';
                fromTimePop = '';
                toTimePop = '';
              "
              style="background-color: mediumblue"
              dark
              >Add any available time</v-btn
            >
          </div>
        </div>
        <div class="pa-10 py-5">
          <h4 style="background-color: #fff1c9" class="pa-2 pb-0">
            <v-icon style="color: orange" class="pb-1 pr-3"
              >mdi-alert-circle-outline</v-icon
            >
            Working time and free time are allowed to change from 8:00 to 16:00
            of the day.
          </h4>
        </div>
      </v-col>
    </v-row>
    <template v-if="isLoading">
      <div class="px-10">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <template v-else>
      <v-row no-gutters class="fill-height">
        <v-col>
          <div class="pa-10 pt-0">
            <v-sheet height="64">
              <v-toolbar flat elevation="0">
                <v-btn text color="secondary" @click="prev">
                  <v-icon> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn outlined color="secondary" @click="setToday">
                  Today
                </v-btn>
                <v-btn text color="secondary" @click="next">
                  <v-icon> mdi-chevron-right </v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">
                  {{ $refs.calendar.title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            </v-sheet>
            <v-sheet height="980">
              <v-calendar
                ref="calendar"
                v-model="focus"
                color="primary"
                :events="events"
                :event-color="getEventColor"
                :event-ripple="false"
                event-start="fromTime"
                event-end="toTime"
                event-name="crtdUser"
                :type="type"
                first-time="7:00"
                interval-count="17"
                :interval-format="intervalFormatter"
                @click:event="showEvent"
                @click:time="viewDay"
                :weekday-format="showDay"
              >
              </v-calendar>

              <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
              >
                <v-card min-width="350px" flat>
                  <v-toolbar
                    flat
                    :color="getEventColor(selectedEvent)"
                    height="40"
                  >
                    <v-toolbar-title
                      style="font-size: 14px"
                      class="font-weight-bold"
                      >{{ selectedEvent.crtdUser }}</v-toolbar-title
                    >
                  </v-toolbar>
                  <v-card-text>
                    <div v-if="selectedEvent.type == 'Fix'">
                      <div>Type: {{ selectedEvent.type }}</div>
                      <div>
                        From time:
                        {{
                          _dayjs(selectedEvent.fromTime).format(
                            "DD/MM/YYYY HH:mm"
                          )
                        }}
                      </div>
                      <div>
                        To time:
                        {{
                          _dayjs(selectedEvent.toTime).format(
                            "DD/MM/YYYY HH:mm"
                          )
                        }}
                      </div>
                    </div>
                    <div v-else>
                      <div>
                        Type: {{ selectedEvent.type }} -
                        {{
                          selectedEvent.dayOfWeek == "Mon"
                            ? "Monday"
                            : selectedEvent.dayOfWeek == "Tue"
                            ? "Tuesday"
                            : selectedEvent.dayOfWeek == "Wed"
                            ? "Wednesday"
                            : selectedEvent.dayOfWeek == "Thu"
                            ? "Thursday"
                            : selectedEvent.dayOfWeek == "Fri"
                            ? "Friday"
                            : selectedEvent.dayOfWeek == "Sat"
                            ? "Saturday"
                            : "Sunday"
                        }}
                      </div>
                      <div>
                        From time:
                        {{ _dayjs(selectedEvent.fromTime).format("HH:mm") }}
                      </div>
                      <div>
                        To time:
                        {{ _dayjs(selectedEvent.toTime).format("HH:mm") }}
                      </div>
                    </div>
                    <div class="d-flex justify-space-between">
                      <v-btn
                        v-if="selectedEvent.type == 'Weekly'"
                        color="primary"
                        outlined
                        @click="editWeeklyType = true"
                        >Edit</v-btn
                      >
                      <v-btn
                        v-else
                        color="primary"
                        outlined
                        @click="editFixType = true"
                        >Edit</v-btn
                      >
                      <v-btn
                        color="error"
                        outlined
                        @click="$refs.confirmDelete.open()"
                        >Delete</v-btn
                      >
                    </div>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-sheet>
          </div>
        </v-col>
      </v-row>
    </template>
    <v-dialog v-model="addTimeDialog" width="600">
      <v-card>
        <v-card-title>
          <h3>Add any available time</h3>
        </v-card-title>
        <v-card-text>
          <div>
            <v-row>
              <v-col md="6">
                <v-btn
                  @click="addTimePermanent()"
                  :class="
                    checkPermanent
                      ? 'add-time-button-active'
                      : 'add-time-button'
                  "
                  width="100%"
                  elevation="0"
                >
                  Add any available time for permanent classes
                </v-btn>
              </v-col>
              <v-col md="6">
                <v-btn
                  @click="addTimeCover()"
                  :class="
                    checkCover ? 'add-time-button-active' : 'add-time-button'
                  "
                  width="100%"
                  elevation="0"
                >
                  Add any available time for cover
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <div>
            <v-row>
              <v-col md="4">
                <v-select
                  v-if="checkPermanent"
                  class="pt-4"
                  label="Select"
                  v-model="weekDay"
                  :items="weekDays"
                  item-text="weekDayName"
                  item-value="weekDayID"
                  outlined
                  dense
                ></v-select>
                <date-picker
                  class="pt-4"
                  v-else
                  :model="picker"
                  title="Date"
                  @update:model="updatePicker"
                ></date-picker>
              </v-col>
              <v-col md="4">
                <v-menu
                  ref="menuFrom"
                  v-model="fromTimePicker"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="fromTime"
                      label="From"
                      prepend-icon="mdi-clock-time-four-outline"
                      class="time-picker"
                      type="time"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="fromTimePicker"
                    v-model="fromTime"
                    format="24hr"
                    full-width
                    @click:minute="$refs.menuFrom.save(time)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col md="4">
                <v-menu
                  ref="menuTo"
                  v-model="toTimePicker"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="toTime"
                      label="To"
                      prepend-icon="mdi-clock-time-four-outline"
                      class="time-picker"
                      type="time"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="toTimePicker"
                    v-model="toTime"
                    format="24hr"
                    full-width
                    @click:minute="$refs.menuTo.save(time)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
          </div>
          <div class="d-flex align-center justify-space-between">
            <div>
              <v-btn @click="addTimeDialog = false"> Cancel </v-btn>
            </div>
            <div>
              <v-btn
                @click="save()"
                color="primary"
                :disabled="fromTime >= toTime"
              >
                Save
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addTimeAvailableDialog" width="600">
      <v-card>
        <v-card-title>
          <h3>Add any available time</h3>
        </v-card-title>
        <v-card-text>
          <div>
            <v-row>
              <v-col md="6">
                <v-btn
                  @click="addTimePermanent()"
                  :class="
                    checkPermanent
                      ? 'add-time-button-active'
                      : 'add-time-button'
                  "
                  width="100%"
                  elevation="0"
                >
                  Add any available time for permanent classes
                </v-btn>
              </v-col>
              <v-col md="6">
                <v-btn
                  @click="addTimeCover()"
                  :class="
                    checkCover ? 'add-time-button-active' : 'add-time-button'
                  "
                  width="100%"
                  elevation="0"
                >
                  Add any available time for cover
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <div>
            <v-row>
              <v-col md="4">
                <v-select
                  v-if="checkPermanent"
                  class="pt-4"
                  label="Select"
                  v-model="weekDayPop"
                  :items="weekDays"
                  item-text="weekDayName"
                  item-value="weekDayID"
                  outlined
                  dense
                ></v-select>
                <date-picker
                  class="pt-4"
                  v-else
                  :model="picker"
                  title="Date"
                  @update:model="updatePicker"
                ></date-picker>
              </v-col>
              <v-col md="4">
                <v-menu
                  ref="menuFrom"
                  v-model="fromTimePickerPop"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="fromTimePop"
                      label="From"
                      prepend-icon="mdi-clock-time-four-outline"
                      class="time-picker"
                      type="time"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="fromTimePickerPop"
                    v-model="fromTimePop"
                    format="24hr"
                    full-width
                    @click:minute="$refs.menuFrom.save(time)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col md="4">
                <v-menu
                  ref="menuTo"
                  v-model="toTimePickerPop"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="toTimePop"
                      label="To"
                      prepend-icon="mdi-clock-time-four-outline"
                      class="time-picker"
                      type="time"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="toTimePickerPop"
                    v-model="toTimePop"
                    format="24hr"
                    full-width
                    @click:minute="$refs.menuTo.save(time)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
          </div>
          <div class="d-flex align-center justify-space-between">
            <div>
              <v-btn @click="addTimeAvailableDialog = false"> Cancel </v-btn>
            </div>
            <div>
              <v-btn
                @click="savePop()"
                color="primary"
                :disabled="fromTimePop >= toTimePop"
              >
                Save
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editWeeklyType" width="600">
      <v-card>
        <v-card-title>
          <h3>Update free time</h3>
        </v-card-title>
        <v-card-text>
          <div>
            <v-row>
              <v-col md="12">
                <h3>Update free time available for weekly type</h3>
              </v-col>
            </v-row>
          </div>
          <div>
            <v-row>
              <v-col md="4">
                <v-select
                  class="pt-4"
                  label="Select"
                  v-model="weekDayUpdate"
                  :items="weekDays"
                  item-text="weekDayName"
                  item-value="weekDayID"
                  outlined
                  dense
                ></v-select>
              </v-col>
              <v-col md="4">
                <v-menu
                  ref="menuFrom"
                  v-model="fromTimeUpdate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="fromUpdate"
                      label="From"
                      prepend-icon="mdi-clock-time-four-outline"
                      class="time-picker"
                      type="time"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="fromTimeUpdate"
                    v-model="fromUpdate"
                    format="24hr"
                    full-width
                    @click:minute="$refs.menuFrom.save(time)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col md="4">
                <v-menu
                  ref="menuTo"
                  v-model="toTimeUpdate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="toUpdate"
                      label="To"
                      prepend-icon="mdi-clock-time-four-outline"
                      class="time-picker"
                      type="time"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="toTimeUpdate"
                    v-model="toUpdate"
                    format="24hr"
                    full-width
                    @click:minute="$refs.menuTo.save(time)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
          </div>
          <div class="d-flex align-center justify-space-between">
            <div>
              <v-btn @click="editWeeklyType = false"> Cancel </v-btn>
            </div>
            <div>
              <v-btn
                @click="updateWeekly()"
                color="primary"
                :disabled="fromUpdate >= toUpdate"
              >
                Save
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editFixType" width="600">
      <v-card>
        <v-card-title>
          <h3>Update free time</h3>
        </v-card-title>
        <v-card-text>
          <div>
            <v-row>
              <v-col md="12">
                <h3>Update free time available for fix type</h3>
              </v-col>
            </v-row>
          </div>
          <div>
            <v-row>
              <v-col md="4">
                <date-picker
                  class="pt-4"
                  :model="dateUpdate"
                  title="Date"
                  @update:model="updateDate"
                ></date-picker>
              </v-col>
              <v-col md="4">
                <v-menu
                  ref="menuFrom"
                  v-model="fromTimeUpdateFix"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="fromUpdateFix"
                      label="From"
                      prepend-icon="mdi-clock-time-four-outline"
                      class="time-picker"
                      type="time"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="fromTimeUpdateFix"
                    v-model="fromUpdateFix"
                    format="24hr"
                    full-width
                    @click:minute="$refs.menuFrom.save(time)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col md="4">
                <v-menu
                  ref="menuTo"
                  v-model="toTimeUpdateFix"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="toUpdateFix"
                      label="To"
                      prepend-icon="mdi-clock-time-four-outline"
                      class="time-picker"
                      type="time"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="toTimeUpdateFix"
                    v-model="toUpdateFix"
                    format="24hr"
                    full-width
                    @click:minute="$refs.menuTo.save(time)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
          </div>
          <div class="d-flex align-center justify-space-between">
            <div>
              <v-btn @click="editFixType = false"> Cancel </v-btn>
            </div>
            <div>
              <v-btn
                @click="updateFix()"
                color="primary"
                :disabled="fromUpdateFix >= toUpdateFix"
              >
                Save
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <popup-confirm
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      :maxWidth="maxWidth"
      :width="width"
      confirmColor="error"
      ref="confirmDelete"
    >
      <v-card-title
        style="display: flex; flex-direction: column"
        slot="icon"
        class="pt-0"
      >
        <v-icon x-large color="error" class="mb-5" outline
          >mdi-close-circle</v-icon
        >
      </v-card-title>
      <v-card-title
        style="display: flex; flex-direction: column"
        slot="title"
        class="pt-0 mb-5"
      >
        <h2 class="text-center">Confirm delete</h2>
        <p class="text-center">Are you sure to delete free time?</p>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-confirm>
  </div>
</template>

<script>
import { teacher_information } from "@/api/teacher-information.js";
import dayjs from "dayjs";
import PopupConfirm from "@/components/Utils/PopupConfirm.vue";
import DatePicker from "@/components/Utils/DatePicker.vue";
const querystring = require("querystring");
export default {
  components: {
    "popup-confirm": PopupConfirm,
    "date-picker": DatePicker,
  },
  data() {
    return {
      isLoading: false,
      focus: "",
      type: "week",
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      teacherID: JSON.parse(localStorage.getItem("currentUser")).userInfo
        .teacherID,
      time: null,
      weekDay: "",
      weekDayPop: "",
      weekDays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      typeAddTime: null,
      addTimeDialog: false,
      addTimeAvailableDialog: false,
      editWeeklyType: false,
      editFixType: false,
      fromTime: "",
      fromTimePicker: false,
      toTime: "",
      toTimePicker: false,
      fromTimePop: "",
      fromTimePickerPop: false,
      toTimePop: "",
      toTimePickerPop: false,
      picker: "",
      weekDayUpdate: "",
      fromTimeUpdate: "",
      fromUpdate: "",
      toTimeUpdate: "",
      toUpdate: "",
      dateUpdate: "",
      fromTimeUpdateFix: "",
      fromUpdateFix: "",
      toTimeUpdateFix: "",
      toUpdateFix: "",
      checkPermanent: true,
      checkCover: false,
      dragEvent: null,
      dragStart: null,
      createEvent: null,
      createStart: null,
      extendOriginal: null,
      checkSuccess: false,
      code: "",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      listMon: [],
      listTue: [],
      listWed: [],
      listThu: [],
      listFri: [],
      listSat: [],
      listSun: [],
      recordID: "",
      width: 400,
      maxWidth: 1000,
    };
  },
  created() {},
  mounted() {
    // this.$refs.calendar.checkChange();
    this.getCalendar();
  },
  methods: {
    addTimePermanent() {
      this.checkPermanent = true;
      this.checkCover = false;
    },
    addTimeCover() {
      this.checkPermanent = false;
      this.checkCover = true;
    },
    async save() {
      const body = {
        teacherID: this.teacherID,
        fromTime: this.fromTime,
        toTime: this.toTime,
        type: this.checkPermanent ? "Weekly" : "Fix",
        dayOfWeek:
          this.weekDay == "Monday"
            ? "Mon"
            : this.weekDay == "Tuesday"
            ? "Tue"
            : this.weekDay == "Wednesday"
            ? "Wed"
            : this.weekDay == "Thursday"
            ? "Thu"
            : this.weekDay == "Friday"
            ? "Fri"
            : this.weekDay == "Saturday"
            ? "Sat"
            : this.weekDay == "Sunday"
            ? "Sun"
            : "",
        dayOfMonth: this.picker ? this.picker : "",
        note: "",
      };
      await teacher_information
        .registerFreeTime(querystring.stringify(body))
        .then((res) => {
          this.code = res.mess.code;
          if (res.mess.code == 200) {
            this.events = res;
            this.addTimeDialog = false;
            this.checkSuccess = true;
            setTimeout(() => {
              this.checkSuccess = false;
            }, 1000);
            this.getCalendar();
          }
        });
    },
    async savePop() {
      const body = {
        fromTime: this.fromTimePop,
        toTime: this.toTimePop,
        teacherID: this.teacherID,
        type: this.checkPermanent ? "Weekly" : "Fix",
        dayOfWeek:
          this.weekDayPop == "Monday"
            ? "Mon"
            : this.weekDayPop == "Tuesday"
            ? "Tue"
            : this.weekDayPop == "Wednesday"
            ? "Wed"
            : this.weekDayPop == "Thursday"
            ? "Thu"
            : this.weekDayPop == "Friday"
            ? "Fri"
            : this.weekDayPop == "Saturday"
            ? "Sat"
            : this.weekDayPop == "Sunday"
            ? "Sun"
            : "",
        dayOfMonth: this.picker ? this.picker : "",
        note: "",
      };
      await teacher_information
        .registerFreeTime(querystring.stringify(body))
        .then((res) => {
          this.code = res.mess.code;
          if (res.mess.code == 200) {
            this.events = res;
            this.addTimeAvailableDialog = false;
            this.checkSuccess = true;
            setTimeout(() => {
              this.checkSuccess = false;
            }, 1000);
            this.getCalendar();
          }
        });
    },
    back() {
      window.history.back();
    },
    viewDay(tms) {
      this.addTimeDialog = true;
      this.checkPermanent = true;
      this.checkCover = false;
      const mouse = this.toTimes(tms);

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start;

        this.dragTime = mouse - start;
      } else {
        this.createStart = this.roundTime(mouse);
        var current_day = new Date(this.createStart).getDay();
        switch (current_day) {
          case 0:
            current_day = "Sunday";
            break;
          case 1:
            current_day = "Monday";
            break;
          case 2:
            current_day = "Tuesday";
            break;
          case 3:
            current_day = "Wednesday";
            break;
          case 4:
            current_day = "Thursday";
            break;
          case 5:
            current_day = "Friday";
            break;
          case 6:
            current_day = "Saturday";
        }
        this.createEvent = {
          start: dayjs(this.createStart).format("HH:mm"),
          end: dayjs(this.createStart).format("HH:mm"),
          date: dayjs(mouse).format("YYYY-MM-DD"),
          dayOfWeek: current_day,
        };

        // this.events.push(this.createEvent);
      }
      this.fromTime = this.createEvent.start;
      this.toTime = this.createEvent.end;
      this.picker = this.createEvent.date;
      this.weekDay = this.createEvent.dayOfWeek;
    },
    roundTime(time, down = true) {
      const roundTo = 15; // minutes
      const roundDownTime = roundTo * 60 * 1000;

      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime));
    },
    toTimes(tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime();
    },
    getEventColor(event) {
      if (event.type == "Weekly") {
        return "blue";
      } else {
        return "green";
      }
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      if (
        this.year !=
        dayjs(this.$refs.calendar.lastStart.date).add(-1, "day").format("YYYY")
      ) {
        this.year = dayjs(this.$refs.calendar.lastStart.date)
          .add(-1, "day")
          .format("YYYY");
        this.getCalendar();
      }
      this.$refs.calendar.prev();
    },
    next() {
      if (
        this.year !=
        dayjs(this.$refs.calendar.lastStart.date).add(7, "day").format("YYYY")
      ) {
        this.year = dayjs(this.$refs.calendar.lastStart.date)
          .add(7, "day")
          .format("YYYY");
        this.getCalendar();
      }
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };
      this.weekDayUpdate =
        event.dayOfWeek == "Mon"
          ? "Monday"
          : event.dayOfWeek == "Tue"
          ? "Tuesday"
          : event.dayOfWeek == "Wed"
          ? "Wednesday"
          : event.dayOfWeek == "Thu"
          ? "Thursday"
          : event.dayOfWeek == "Fri"
          ? "Friday"
          : event.dayOfWeek == "Sat"
          ? "Saturday"
          : event.dayOfWeek == "Sun"
          ? "Sunday"
          : "";
      this.fromUpdate = this._dayjs(event.fromTime).format("HH:mm");
      this.toUpdate = this._dayjs(event.toTime).format("HH:mm");
      this.dateUpdate = this._dayjs(event.dayOfMonth).format("YYYY-MM-DD");
      this.fromUpdateFix = this._dayjs(event.fromTime).format("HH:mm");
      this.toUpdateFix = this._dayjs(event.toTime).format("HH:mm");
      this.recordID = event.recordID;
      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    async updateWeekly() {
      const body = {
        recordID: this.recordID,
        fromTime: this.fromUpdate,
        toTime: this.toUpdate,
        dayOfWeek:
          this.weekDayUpdate == "Monday"
            ? "Mon"
            : this.weekDayUpdate == "Tuesday"
            ? "Tue"
            : this.weekDayUpdate == "Wednesday"
            ? "Wed"
            : this.weekDayUpdate == "Thursday"
            ? "Thu"
            : this.weekDayUpdate == "Friday"
            ? "Fri"
            : this.weekDayUpdate == "Saturday"
            ? "Sat"
            : this.weekDayUpdate == "Sunday"
            ? "Sun"
            : "",
        dayOfMonth: "",
        note: "",
      };
      await teacher_information
        .updateFreeTime(querystring.stringify(body))
        .then((res) => {
          if (res) {
            this.getCalendar();
            this.editWeeklyType = false;
          }
        });
    },
    async updateFix() {
      const body = {
        recordID: this.recordID,
        fromTime: this.fromUpdateFix,
        toTime: this.toUpdateFix,
        dayOfWeek: "",
        dayOfMonth: this.dateUpdate,
        note: "",
      };
      await teacher_information
        .updateFreeTime(querystring.stringify(body))
        .then((res) => {
          if (res) {
            this.getCalendar();
            this.editFixType = false;
          }
        });
    },
    cancelDelete() {},
    async confirmDelete() {
      this.isLoading = true;
      await teacher_information.deleteFreeTime(this.recordID).then((res) => {
        if (res) {
          this.getCalendar();
          this.selectedOpen = false;
          this.isLoading = false;
        }
      });
    },
    intervalFormatter(locale) {
      return locale.time;
    },
    showDay(locale) {
      return locale.weekday == 0
        ? "Sun"
        : locale.weekday == 1
        ? "Mon"
        : locale.weekday == 2
        ? "Tue"
        : locale.weekday == 3
        ? "Wed"
        : locale.weekday == 4
        ? "Thu"
        : locale.weekday == 5
        ? "Fri"
        : "Sat";
    },
    // clickIconRight() {
    //   this.alo = this.$refs.calendar.title.slice(-4);
    // },
    async getCalendar() {
      this.events = [];
      this.list1 = [];
      this.list2 = [];
      this.list3 = [];
      this.list4 = [];
      this.list5 = [];
      this.list6 = [];
      this.list7 = [];
      this.listMon = [];
      this.listTue = [];
      this.listWed = [];
      this.listThu = [];
      this.listFri = [];
      this.listSat = [];
      this.listSun = [];
      var dayone = this.year - 1 + "-12-18";
      var daytwo = this.year - 1 + "-12-19";
      var daythree = this.year - 1 + "-12-20";
      var dayfour = this.year - 1 + "-12-21";
      var dayfive = this.year - 1 + "-12-22";
      var daysix = this.year - 1 + "-12-23";
      var dayseven = this.year - 1 + "-12-24";
      for (var j = 1; j <= 54; j++) {
        if (j) {
          dayone = dayjs(dayone).add(7, "day").format();
          daytwo = dayjs(daytwo).add(7, "day").format();
          daythree = dayjs(daythree).add(7, "day").format();
          dayfour = dayjs(dayfour).add(7, "day").format();
          dayfive = dayjs(dayfive).add(7, "day").format();
          daysix = dayjs(daysix).add(7, "day").format();
          dayseven = dayjs(dayseven).add(7, "day").format();
          this.list1.push({
            date: dayjs(dayone).format("YYYY-MM-DD"),
          });
          this.list2.push({
            date: dayjs(daytwo).format("YYYY-MM-DD"),
          });
          this.list3.push({
            date: dayjs(daythree).format("YYYY-MM-DD"),
          });
          this.list4.push({
            date: dayjs(dayfour).format("YYYY-MM-DD"),
          });
          this.list5.push({
            date: dayjs(dayfive).format("YYYY-MM-DD"),
          });
          this.list6.push({
            date: dayjs(daysix).format("YYYY-MM-DD"),
          });
          this.list7.push({
            date: dayjs(dayseven).format("YYYY-MM-DD"),
          });
        }
      }

      new Date(this.list1[0].date).getDay() == 6
        ? (this.listSat = this.list1)
        : new Date(this.list1[0].date).getDay() == 0
        ? (this.listSun = this.list1)
        : new Date(this.list1[0].date).getDay() == 1
        ? (this.listMon = this.list1)
        : new Date(this.list1[0].date).getDay() == 2
        ? (this.listTue = this.list1)
        : new Date(this.list1[0].date).getDay() == 3
        ? (this.listWed = this.list1)
        : new Date(this.list1[0].date).getDay() == 4
        ? (this.listThu = this.list1)
        : new Date(this.list1[0].date).getDay() == 5
        ? (this.listFri = this.list1)
        : null;

      new Date(this.list2[0].date).getDay() == 6
        ? (this.listSat = this.list2)
        : new Date(this.list2[0].date).getDay() == 0
        ? (this.listSun = this.list2)
        : new Date(this.list2[0].date).getDay() == 1
        ? (this.listMon = this.list2)
        : new Date(this.list2[0].date).getDay() == 2
        ? (this.listTue = this.list2)
        : new Date(this.list2[0].date).getDay() == 3
        ? (this.listWed = this.list2)
        : new Date(this.list2[0].date).getDay() == 4
        ? (this.listThu = this.list2)
        : new Date(this.list2[0].date).getDay() == 5
        ? (this.listFri = this.list2)
        : null;

      new Date(this.list3[0].date).getDay() == 6
        ? (this.listSat = this.list3)
        : new Date(this.list3[0].date).getDay() == 0
        ? (this.listSun = this.list3)
        : new Date(this.list3[0].date).getDay() == 1
        ? (this.listMon = this.list3)
        : new Date(this.list3[0].date).getDay() == 2
        ? (this.listTue = this.list3)
        : new Date(this.list3[0].date).getDay() == 3
        ? (this.listWed = this.list3)
        : new Date(this.list3[0].date).getDay() == 4
        ? (this.listThu = this.list3)
        : new Date(this.list3[0].date).getDay() == 5
        ? (this.listFri = this.list3)
        : null;

      new Date(this.list4[0].date).getDay() == 6
        ? (this.listSat = this.list4)
        : new Date(this.list4[0].date).getDay() == 0
        ? (this.listSun = this.list4)
        : new Date(this.list4[0].date).getDay() == 1
        ? (this.listMon = this.list4)
        : new Date(this.list4[0].date).getDay() == 2
        ? (this.listTue = this.list4)
        : new Date(this.list4[0].date).getDay() == 3
        ? (this.listWed = this.list4)
        : new Date(this.list4[0].date).getDay() == 4
        ? (this.listThu = this.list4)
        : new Date(this.list4[0].date).getDay() == 5
        ? (this.listFri = this.list4)
        : null;

      new Date(this.list5[0].date).getDay() == 6
        ? (this.listSat = this.list5)
        : new Date(this.list5[0].date).getDay() == 0
        ? (this.listSun = this.list5)
        : new Date(this.list5[0].date).getDay() == 1
        ? (this.listMon = this.list5)
        : new Date(this.list5[0].date).getDay() == 2
        ? (this.listTue = this.list5)
        : new Date(this.list5[0].date).getDay() == 3
        ? (this.listWed = this.list5)
        : new Date(this.list5[0].date).getDay() == 4
        ? (this.listThu = this.list5)
        : new Date(this.list5[0].date).getDay() == 5
        ? (this.listFri = this.list5)
        : null;

      new Date(this.list6[0].date).getDay() == 6
        ? (this.listSat = this.list6)
        : new Date(this.list6[0].date).getDay() == 0
        ? (this.listSun = this.list6)
        : new Date(this.list6[0].date).getDay() == 1
        ? (this.listMon = this.list6)
        : new Date(this.list6[0].date).getDay() == 2
        ? (this.listTue = this.list6)
        : new Date(this.list6[0].date).getDay() == 3
        ? (this.listWed = this.list6)
        : new Date(this.list6[0].date).getDay() == 4
        ? (this.listThu = this.list6)
        : new Date(this.list6[0].date).getDay() == 5
        ? (this.listFri = this.list6)
        : null;

      new Date(this.list7[0].date).getDay() == 6
        ? (this.listSat = this.list7)
        : new Date(this.list7[0].date).getDay() == 0
        ? (this.listSun = this.list7)
        : new Date(this.list7[0].date).getDay() == 1
        ? (this.listMon = this.list7)
        : new Date(this.list7[0].date).getDay() == 2
        ? (this.listTue = this.list7)
        : new Date(this.list7[0].date).getDay() == 3
        ? (this.listWed = this.list7)
        : new Date(this.list7[0].date).getDay() == 4
        ? (this.listThu = this.list7)
        : new Date(this.list7[0].date).getDay() == 5
        ? (this.listFri = this.list7)
        : null;

      this.isLoading = true;
      const body = {
        teacherID: this.teacherID,
      };
      await teacher_information
        .listTeacherFreeTime(querystring.stringify(body))
        .then((res) => {
          if (res) {
            res.teacherFreeTimeList.forEach((x) => {
              if (x.dayOfWeek == "Mon" && x.type == "Weekly") {
                this.listMon.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfWeek == "Tue" && x.type == "Weekly") {
                this.listTue.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfWeek == "Wed" && x.type == "Weekly") {
                this.listWed.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfWeek == "Thu" && x.type == "Weekly") {
                this.listThu.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfWeek == "Fri" && x.type == "Weekly") {
                this.listFri.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfWeek == "Sat" && x.type == "Weekly") {
                this.listSat.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfWeek == "Sun" && x.type == "Weekly") {
                this.listSun.forEach((y) => {
                  this.events.push({
                    crtdDate: x.crtdDate,
                    crtdUser: x.crtdUser,
                    dayOfMonth: x.dayOfMonth,
                    dayOfWeek: x.dayOfWeek,
                    fromTime: y.date + " " + x.fromTime,
                    lUpdDate: x.lUpdDate,
                    lUpdUser: x.lUpdUser,
                    note: x.note,
                    recordID: x.recordID,
                    teacherID: x.teacherID,
                    toTime: y.date + " " + x.toTime,
                    type: x.type,
                  });
                });
              }
              if (x.dayOfMonth != "" && x.type == "Fix") {
                this.events.push({
                  crtdDate: x.crtdDate,
                  crtdUser: x.crtdUser,
                  dayOfMonth: x.dayOfMonth,
                  dayOfWeek: x.dayOfWeek,
                  fromTime:
                    dayjs(x.dayOfMonth).format("YYYY-MM-DD") + " " + x.fromTime,
                  lUpdDate: x.lUpdDate,
                  lUpdUser: x.lUpdUser,
                  note: x.note,
                  recordID: x.recordID,
                  teacherID: x.teacherID,
                  toTime:
                    dayjs(x.dayOfMonth).format("YYYY-MM-DD") + " " + x.toTime,
                  type: x.type,
                });
              }
            });
          }
        });
      this.isLoading = false;
    },
    updatePicker(event) {
      this.picker = event;
    },
    updateDate(event) {
      this.dateUpdate = event;
    },
    _dayjs: dayjs,
  },
};
</script>
<style lang="scss" scoped>
header.v-sheet {
  border-bottom: 0;
}
.button-permanent-classes {
  border-radius: 1rem;
  background-color: lightgreen !important;
}
.button-cover {
  border-radius: 1rem;
  background-color: lightcoral !important;
}
.add-time-button-active {
  background-color: #e6edfa !important;
  color: #2f72ed;
  border-radius: 1.2rem;
  padding: 4px;
  text-align: center;
}
.add-time-button {
  background-color: white !important;
  border-radius: 1.2rem;
  padding: 4px;
  text-align: center;
}
.success {
  width: 300px;
  position: absolute;
  right: 0;
  top: 5%;
  z-index: 999;
}
.time-picker {
  background: white;
  ::-webkit-calendar-picker-indicator {
    display: none;
  }
}
</style>
