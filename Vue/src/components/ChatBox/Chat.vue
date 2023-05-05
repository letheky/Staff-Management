<template>
  <!-- <v-app> -->
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="3" class="chat-list border">
        <v-app-bar flat color="rgba(0,0,0,0)">
          <v-text-field
            label="Search class"
            v-model="searchClass"
            append-icon="mdi-magnify"
            outlined
            dense
          ></v-text-field>
        </v-app-bar>
        <v-divider></v-divider>
        <v-list class="chat-list-section" two-line color="rgba(0,0,0,0)">
          <v-list-item-group mandatory v-model="selectedClass">
            <template v-for="(item, index) in filteredClass">
              <v-list-item
                :key="item.conferenceId"
                @click="viewDetailClass(item.classID)"
              >
                <template>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.classCode"
                    ></v-list-item-title>

                    <v-list-item-subtitle
                      v-text="item.conferenceName"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-chip v-if="item.newClassMsgCount" color="error" small
                    >{{ item.newClassMsgCount }}
                  </v-chip>
                </template>
              </v-list-item>

              <v-divider
                v-if="index < filteredClass.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col cols="12" sm="3" offset-sm="3" class="box-section chat-list">
        <v-app-bar flat color="rgba(0,0,0,0)">
          <v-text-field
            :label="'Search in ' + searchInClass"
            v-model="searchPerson"
            append-icon="mdi-magnify"
            outlined
            dense
          ></v-text-field>
        </v-app-bar>
        <v-divider></v-divider>
        <div class="d-flex justify-center">
          <v-list class="person-list-section" two-line color="rgba(0,0,0,0)">
            <v-list-item-group mandatory v-model="selectedPerson">
              <template v-for="item in filteredPerson">
                <v-list-item
                  :key="item.title"
                  @click="
                    viewChat(
                      item.userID,
                      item.classID,
                      item.userName,
                      item.conferenceId
                    )
                  "
                >
                  <v-badge
                    bordered
                    bottom
                    color="green"
                    dot
                    offset-x="22"
                    offset-y="26"
                  >
                    <v-list-item-avatar>
                      <v-img v-if="item.avatar" :src="item.avatar"></v-img>
                      <v-img
                        v-else
                        src="@/assets/images/ImageProfile.jpg"
                      ></v-img>
                    </v-list-item-avatar>
                  </v-badge>
                  <template>
                    <v-list-item-content>
                      <div class="d-flex">
                        <v-list-item-title
                          v-text="item.userName"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-if="item.lastMsgTime != today"
                          class="d-flex justify-end"
                          v-text="item.lastMsgTime"
                        ></v-list-item-subtitle>
                        <v-list-item-subtitle
                          v-else
                          class="d-flex justify-end"
                          v-text="lastMsgTimeToday"
                        ></v-list-item-subtitle>
                      </div>
                      <div class="d-flex align-center pt-2">
                        <v-list-item-subtitle
                          class="font-weight-bold"
                          style="color: black"
                          v-if="item.newUserMsgCount"
                          v-text="item.lastMsgContent"
                        ></v-list-item-subtitle>
                        <v-list-item-subtitle
                          v-else
                          v-text="item.lastMsgContent"
                        ></v-list-item-subtitle>
                        <v-chip v-if="item.newUserMsgCount" color="error" small
                          >{{ item.newUserMsgCount }}
                        </v-chip>
                      </div>
                    </v-list-item-content>
                  </template>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
          <div style="position: fixed; bottom: 2%">
            <v-btn color="secondary">Message many people</v-btn>
          </div>
        </div>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        offset-sm="6"
        class="chat-list border border-left"
      >
        <v-app-bar
          v-if="userChat"
          class="d-flex align-center chat-section"
          color="rgba(0,0,0,0)"
          flat
        >
          <v-badge
            bordered
            bottom
            color="green"
            dot
            offset-x="11"
            offset-y="13"
          >
            <v-avatar size="40" elevation="10">
              <img src="@/assets/images/ImageProfile.jpg" />
            </v-avatar>
          </v-badge>
          <v-toolbar-title class="ml-2">
            {{ userChat }}
          </v-toolbar-title>
        </v-app-bar>
        <v-divider v-if="userChat"></v-divider>
        <div class="chat-box-section" ref="messagesContainer">
          <template v-if="isLoading">
            <div>
              <v-progress-linear
                indeterminate
                color="primary"
              ></v-progress-linear>
            </div>
          </template>
          <div
            v-if="chatList.length"
            v-observe-visibility="handleScrolledToTop"
          ></div>
          <div
            class="chat-section"
            v-for="(item, index) in sortedArray(chatList)"
            :key="index"
          >
            <v-app-bar
              color="rgba(0,0,0,0)"
              flat
              class="mb-16"
              v-if="item.senderID == userID"
            >
              <v-spacer></v-spacer>
              <v-menu v-if="!item.error">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    height="18"
                    width="18"
                    class="d-flex align-self-end mr-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    @click="$refs.confirmDelete.open(item.messageID)"
                  >
                    <v-list-item-title> Delete </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="editMessage(item.messageID, item.messageContent)"
                  >
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <div v-if="item.error">
                <v-card class="error-section mt-1 mr-2" color="blue" dark>
                  <v-list-item>
                    <v-list-item-content>
                      <div>{{ item.messageContent }}</div>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
                <p style="color: red">
                  Message was not sent, please try again.
                </p>
              </div>
              <div v-else>
                <v-card
                  v-if="clickedMessage != item.messageID || !isUpdated"
                  class="mt-10 mr-2"
                  color="blue"
                  dark
                >
                  <v-list-item three-line>
                    <v-list-item-content style="display: block; margin: auto">
                      <div class="mb-4">{{ item.messageContent }}</div>
                      <v-list-item-subtitle
                        v-if="
                          _dayjs(item.messageTime).format('MM/DD/YYYY') != today
                        "
                        >{{
                          _dayjs(item.messageTime).format("DD/MM/YYYY")
                        }}</v-list-item-subtitle
                      >
                      <v-list-item-subtitle v-else>{{
                        _dayjs(item.messageTime).format("HH:mm")
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
                <v-card v-else class="mt-10 mr-2">
                  <v-list-item three-line>
                    <v-list-item-content style="display: block; margin: auto">
                      <v-text-field
                        v-model="messageContent"
                        outlined
                        dense
                        hide-details
                      ></v-text-field>
                      <div class="d-flex justify-space-between pt-2">
                        <v-btn color="primary" @click="cancel()" outlined
                          >Cancel</v-btn
                        >
                        <v-btn color="primary" @click="save()">Save</v-btn>
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </div>
              <v-badge
                bordered
                bottom
                color="green"
                dot
                offset-x="10"
                offset-y="10"
              >
                <v-avatar class="mt-n5" size="30" elevation="10">
                  <img :src="'data:image/jpeg;base64,' + userPhoto" />
                </v-avatar>
              </v-badge>
            </v-app-bar>
            <v-app-bar color="rgba(0,0,0,0)" flat class="mb-16" v-else>
              <v-badge
                bordered
                bottom
                color="green"
                dot
                offset-x="16"
                offset-y="9"
              >
                <v-avatar class="mt-n5 mr-2" size="30" elevation="10">
                  <img src="@/assets/images/ImageProfile.jpg" />
                </v-avatar>
              </v-badge>
              <v-card class="mt-10" max-width="350px">
                <v-list-item three-line>
                  <v-list-item-content style="display: block; margin: auto">
                    <div class="mb-4">{{ item.messageContent }}</div>
                    <v-list-item-subtitle
                      v-if="
                        _dayjs(item.messageTime).format('MM/DD/YYYY') != today
                      "
                      >{{
                        _dayjs(item.messageTime).format("DD/MM/YYYY")
                      }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle v-else>{{
                      _dayjs(item.messageTime).format("HH:mm")
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-app-bar>
          </div>
        </div>
        <div class="message-chat" v-if="userChat">
          <v-form v-model="valid" @submit.prevent="sendMessage">
            <v-app-bar color="rgba(0,0,0,0)" flat>
              <v-text-field
                v-model="message"
                append-icon="mdi-paperclip"
                append-outer-icon="mdi-send"
                filled
                clear-icon="mdi-close-circle"
                clearable
                placeholder="Write a message"
                type="text"
                @click:append-outer="sendMessage"
                @click:append="uploadImage"
                @click:clear="clearMessage"
              ></v-text-field>

              <input
                type="file"
                style="display: none"
                ref="image"
                id="file-input"
                accept="image/*"
                @change="onFileChange($event)"
              />
            </v-app-bar>
          </v-form>
        </div>
      </v-col>
    </v-row>
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
        <v-icon x-large color="error" class="mb-5">mdi-close-circle</v-icon>
      </v-card-title>
      <v-card-title
        style="display: flex; flex-direction: column"
        slot="title"
        class="pt-0 mb-5"
      >
        <h3 class="text-center">Confirm delete</h3>
        <p class="text-center">Are you sure to delete message?</p>
      </v-card-title>
      <v-card-actions> </v-card-actions>
    </popup-confirm>
  </v-container>
  <!-- </v-app> -->
</template>
<script>
import dayjs from "dayjs";
import { class_managerment } from "@/api/class-management.js";
import PopupConfirm from "@/components/Utils/PopupConfirm.vue";
export default {
  components: {
    "popup-confirm": PopupConfirm,
  },
  data: () => ({
    selectedClass: [],
    selectedPerson: [],
    classes: [],
    lists: [],
    chatList: [],
    chatListUpdated: [],
    message: "",
    iconIndex: 0,
    userChat: "",
    userID: JSON.parse(localStorage.getItem("currentUser")).userInfo.userID,
    userPhoto: JSON.parse(localStorage.getItem("currentUser")).userInfo.photo,
    userChatID: "",
    classChatID: "",
    conferenceChatID: "",
    today: "",
    lastMsgTimeToday: "",
    minValue: "",
    listMessageID: [],
    searchClass: "",
    searchPerson: "",
    searchInClass: "",
    isLoading: false,
    messageID: "",
    senderID: "",
    valid: true,
    checkImage: false,
    MAX_SIZE_IMAGE: 500,
    image: "",
    maxWidth: 1000,
    width: 400,
    clickedMessage: "",
    isUpdated: false,
    newestMessageID: "",
    listIdDelete: [],
    maxValue: "",
    isSent: false,
    messageContent: "",
    functionRole: JSON.parse(localStorage.getItem("functionRole")),
    chatPermission: process.env.VUE_APP_ENV_FUNCTION_CHAT,
    chatManagementPermission: process.env.VUE_APP_ENV_FUNCTION_CHAT_MANAGEMENT,
  }),
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
    filteredClass: function () {
      return this.classes.filter((item) => {
        return item.classCode.match(this.searchClass);
      });
    },
    filteredPerson: function () {
      return this.lists.filter((item) => {
        return item.userName.match(this.searchPerson);
      });
    },
  },
  created() {
    this.init();
  },
  methods: {
    sortedArray: function (arr) {
      return arr.slice().sort(function (a, b) {
        return a.messageID - b.messageID;
      });
    },
    async init() {
      this.today =
        this.checkTime(new Date().getMonth() + 1) +
        "/" +
        this.checkTime(new Date().getDate()) +
        "/" +
        this.checkTime(new Date().getFullYear());
      this.nowTime = this._dayjs(new Date()).format("MM/DD/YYYY HH:mm");
      if (
        this.functionRole.filter(
          (x) =>
            (x.functionID == this.chatManagementPermission &&
              x.cModify == true) ||
            (x.functionID == this.chatManagementPermission && x.cFull == true)
        ).length == 1
      ) {
        await class_managerment.adminGetAllClassesOfTeacher().then((res) => {
          if (res) {
            this.classes = res;
          }
        });
      } else if (
        this.functionRole.filter(
          (x) =>
            (x.functionID == this.chatPermission && x.cModify == true) ||
            (x.functionID == this.chatPermission && x.cFull == true)
        )
      ) {
        await class_managerment.staffGetAllClassesOfTeacher().then((res) => {
          if (res) {
            this.classes = res;
          }
        });
      }
    },
    async viewDetailClass(classID) {
      await class_managerment.getHumanFromClass(classID).then((res) => {
        if (res) {
          this.lists = [];
          this.listIdDelete = [];
          res.forEach((x) => {
            this.lists.push({
              classCode: x.classCode,
              classID: x.classID,
              conferenceId: x.conferenceId,
              conferenceName: x.conferenceName,
              lastMsgContent: x.lastMsgContent,
              lastMsgTime: this._dayjs(x.lastMsgTime).format("MM/DD/YYYY"),
              lastMsgType: x.lastMsgType,
              newClassMsgCount: x.newClassMsgCount,
              newUserMsgCount: x.newUserMsgCount,
              userID: x.userID,
              userName: x.userName,
            });
            if (this._dayjs(x.lastMsgTime).format("MM/DD/YYYY") == this.today) {
              this.lastMsgTimeToday = this._dayjs(x.lastMsgTime).format(
                "HH:mm"
              );
            }
            this.searchInClass = x.classCode;
          });
          this.userChat = "";
          this.chatList = [];
        }
      });
    },
    async resetClass(classID) {
      await class_managerment.getHumanFromClass(classID).then((res) => {
        if (res) {
          this.lists = [];
          this.listIdDelete = [];
          res.forEach((x) => {
            this.lists.push({
              classCode: x.classCode,
              classID: x.classID,
              conferenceId: x.conferenceId,
              conferenceName: x.conferenceName,
              lastMsgContent: x.lastMsgContent,
              lastMsgTime: this._dayjs(x.lastMsgTime).format("MM/DD/YYYY"),
              lastMsgType: x.lastMsgType,
              newClassMsgCount: x.newClassMsgCount,
              newUserMsgCount: x.newUserMsgCount,
              userID: x.userID,
              userName: x.userName,
            });
            if (this._dayjs(x.lastMsgTime).format("MM/DD/YYYY") == this.today) {
              this.lastMsgTimeToday = this._dayjs(x.lastMsgTime).format(
                "HH:mm"
              );
            }
            this.searchInClass = x.classCode;
          });
        }
      });
    },
    async viewChat(userID, classID, userName, conferenceID) {
      this.userChat = userName;
      this.userChatID = userID;
      this.classChatID = classID;
      this.conferenceChatID = conferenceID;
      this.chatList = [];
      this.chatListUpdated = [];
      this.listMessageID = [];
      this.listIdDelete = [];
      this.messageID = "";
      const body = {
        userID: userID,
        classID: classID,
        lastMsgID: 0,
        msgCount: 10,
      };
      await class_managerment.getChatInfo(body).then((res) => {
        if (res) {
          res.messages.forEach((x) => {
            this.listMessageID.push(x.messageID);
            this.chatList.push({
              messageID: x.messageID,
              conferenceID: x.conferenceID,
              messageContent: x.messageContent,
              messageType: x.messageType,
              senderID: x.senderID,
              messageTime: this._dayjs(x.messageTime).format(
                "MM/DD/YYYY HH:mm"
              ),
              error: false,
            });
            this.senderID = x.senderID;
            this.messageID = Math.max.apply(Math, this.listMessageID);
          });
          this.minValue = Math.min.apply(Math, this.listMessageID);
        }
      });
      this.$nextTick(() => this.scrollToEnd());
    },
    handleScrolledToTop(isVisible) {
      if (isVisible) {
        this.isLoading = true;
        const body = {
          userID: this.userChatID,
          classID: this.classChatID,
          lastMsgID: this.minValue,
          msgCount: 10,
        };
        class_managerment.getChatInfo(body).then((res) => {
          if (res.messages.length > 1) {
            res.messages.forEach((x) => {
              this.listMessageID.push(x.messageID);
              this.chatList.push(x);
            });
            this.minValue = Math.min.apply(Math, this.listMessageID);
            this.isLoading = false;
          } else {
            this.isLoading = false;
          }
        });
      }
    },
    scrollToEnd: function () {
      var content = this.$refs.messagesContainer;
      content.scrollTop = content.scrollHeight;
    },
    sendMessage() {
      // this.resetIcon();
      // this.clearMessage();
      var imagefile = document.querySelector("#file-input");
      var formData = new FormData();
      formData.append("files", imagefile.files[0] ? imagefile.files[0] : null);
      if (this.valid) {
        this.newestMessageID = "";
        this.isSent = true;
        const body = {
          toUserID: this.userChatID,
          classID: this.classChatID,
          conferenceID: this.conferenceChatID,
          msgContent: this.message,
          msgType: "TEXT",
        };
        class_managerment
          .adminChat(body)
          .then((res) => {
            if (res.message.messages == "Ok") {
              this.newestMessageID = res.messageID;
              this.resetClass(this.classChatID);
              this.chatList.push({
                conferenceID: this.conferenceChatID,
                messageContent: this.message,
                messageType: "TEXT",
                senderID: this.senderID,
                messageTime: this.nowTime,
                messageID: this.newestMessageID,
                error: false,
              });
              this.listMessageID.push(this.messageID + 1);
              this.messageID = Math.max.apply(Math, this.listMessageID);
              this.$nextTick(() => this.scrollToEnd());
              this.message = "";
            }
          })
          .catch((error) => {
            console.log(error);
            this.chatList.push({
              conferenceID: this.conferenceChatID,
              messageContent: this.message,
              messageType: "TEXT",
              senderID: this.senderID,
              messageTime: this.nowTime,
              messageID: this.newestMessageID,
              error: true,
            });
            this.$nextTick(() => this.scrollToEnd());
            this.nowTime = "";
            this.message = "";
          });
      }
    },
    uploadImage() {
      this.$refs.image.click();
    },
    onFileChange(e) {
      var size_image = e.target.files[0].size / 1024;
      if (size_image > this.MAX_SIZE_IMAGE) {
        this.checkImage = true;
      } else {
        this.checkImage = false;
      }
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file) {
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.message = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    editMessage(messageID, messageContent) {
      this.clickedMessage = messageID;
      this.messageContent = messageContent;
      this.isUpdated = true;
    },
    cancel() {
      this.isUpdated = false;
    },
    save() {
      this.isUpdated = false;
      this.chatListUpdated = this.chatList
        .slice()
        .reverse()
        .filter((x) => x.messageID == this.clickedMessage);
      const body = {
        msgID: this.clickedMessage,
        newMsgContent: this.messageContent,
      };
      class_managerment.updateMessage(body).then((res) => {
        if (res.message == "Ok") {
          this.chatListUpdated.filter((x) => {
            x.messageContent = this.messageContent;
          });
          this.chatListUpdated = this.chatList
            .slice()
            .reverse()
            .filter((x) => x.messageID == this.clickedMessage);
        }
      });
    },
    cancelDelete() {},
    confirmDelete(messageID) {
      this.chatList.forEach((x) => {
        this.listIdDelete.push(x.messageID);
      });
      this.maxValue = Math.max.apply(Math, this.listIdDelete);
      if (
        messageID < this.maxValue ||
        (messageID == this.maxValue && !this.isSent)
      ) {
        class_managerment.deleteMessage(messageID).then((res) => {
          if (res.message == "Ok") {
            this.listIdDelete = [];
            this.chatList = this.chatList.filter(
              (x) => x.messageID != messageID
            );
          }
        });
      } else if (messageID == this.maxValue && this.isSent) {
        class_managerment.deleteMessage(this.newestMessageID).then((res) => {
          if (res.message == "Ok") {
            this.isSent = false;
            this.listIdDelete = [];
            this.chatList = this.chatList.filter(
              (x) => x.messageID != this.newestMessageID
            );
          }
        });
      }
    },
    clearMessage() {
      this.message = "";
    },
    resetIcon() {
      this.iconIndex = 0;
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    _dayjs: dayjs,
  },
};
</script>
<style lang="scss" scoped>
.border {
  border-right: 1px solid grey;
  height: 100vh;
}
.border-left {
  border-left: 1px solid grey;
}
header.v-sheet {
  border-color: #fff !important;
}
.chat-section {
  background: #fff !important;
}
.box-section {
  background: #f5f5f8;
}
.chat-list {
  position: fixed;
  .chat-list-section {
    background-color: #f5f5f5;
    height: 100vh;
    width: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .person-list-section {
    background-color: #f5f5f5;
    height: 60vh;
    width: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .chat-box-section {
    height: 60vh;
    width: 100%;
    overflow-y: scroll;
    .error-section {
      opacity: 0.5;
      max-width: 350px;
    }
  }
  .message-chat {
    position: fixed;
    bottom: 0%;
    width: 50%;
  }
}
@media (min-width: 1600px) {
  .chat-list {
    position: fixed;
    .chat-box-section {
      height: 70vh;
      width: 100%;
      overflow-y: scroll;
    }
    .person-list-section {
      height: 70vh;
      width: 100%;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>
