<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5 d-flex justify-space-between">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">Create news</div>
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="my-10"
    ></v-progress-linear>
    <v-row no-gutters class="pb-10" v-if="!isLoading">
      <v-col md="12">
        <div class="pa-6 pt-0 pl-10">
          <h3 class="mb-2">Upload news cover</h3>
          <div class="">
            <v-card
              height="280"
              :class="!image ? 'pt-5' : ''"
              elevation="0"
              style="border: 1px dashed #dadbe6"
            >
              <v-card-title class="justify-center mb-2" v-if="image">
                <img :src="image" />
              </v-card-title>
              <v-card-title class="justify-center" v-if="!image">
                <img src="@/assets/images/Vector.png" class="imageContent" />
              </v-card-title>
              <v-card-title class="justify-center pt-0" v-if="!image">
                <p>Upload news cover</p>
              </v-card-title>
              <v-card-subtitle class="text-center" style="color: black">
                <p>
                  <span>
                    <input
                      type="file"
                      @change="
                        fileInput = $event
                        onFileChange($event)
                      "
                      accept="image/*"
                      id="file-input"
                    />
                  </span>
                  <span v-if="checkImage == true" style="color: red"> Image more than 500 Kb </span>
                </p>
                <p v-if="!image">(JPG, PNG, Max size 500 Kb)</p>
              </v-card-subtitle>
            </v-card>
            <div>
              <v-text-field label="Title" outlined v-model="title" class="mt-3"></v-text-field>
              <vue-editor id="editor" v-model="editor"> </vue-editor>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-footer fixed absolute height="60" color="#fff" class="pl-10 pr-10" v-if="!isLoading">
      <div class="d-flex justify-end" style="width: 100%">
        <div>
          <v-btn
            class="mr-3"
            @click="
              dialog = true
              status = 'DRAFT'
              createNew()
            "
            :disabled="image && title && editor && checkImage == false ? false : true"
            >Save as Draft</v-btn
          >
          <v-btn
            color="primary"
            @click="
              dialog = true
              status = 'PUBLIC'
              createNew()
            "
            :disabled="image && title && editor && checkImage == false ? false : true"
            >Public news</v-btn
          >
        </div>
      </div>
    </v-footer>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent width="350">
        <v-card class="mx-auto pa-10">
          <div class="text-center">
            <v-btn
              elevation="0"
              height="36"
              class="pl-4 pr-4 mr-3 mb-5"
              :loading="dialog"
              style="background: white"
            >
            </v-btn>
          </div>
          <div class="text-center">
            <b style="font-size: 1.5rem">Creating!</b><br />
            <span>Please wait...</span>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { center_managerment } from '@/api/center-management.js'
import { news } from '@/api/news.js'
import { VueEditor } from 'vue2-editor'
// const querystring = require("querystring");

export default {
  components: {
    'vue-editor': VueEditor,
  },
  data() {
    return {
      isLoading: false,
      centerList: JSON.parse(localStorage.getItem('currentUser')).locationPermissions,
      centerId: this.$route.params.centerId,
      centerDetail: null,
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      title: '',
      editor: '',
      status: '',
      fileInput: '',
      image: '',
      uploadFieldName: 'file',
      fileUpload: '',
      MAX_SIZE_IMAGE: 500,
      checkImage: false,
      dialog: false,
    }
  },
  methods: {
    async imgAdd(file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData()
      formData.append('objFile', file)

      await news
        .addAImage()
        .then(result => {
          console.log(result)
          resetUploader()
        })
        .catch(err => {
          console.log(err)
        })
    },
    createNew() {
      var imagefile = document.querySelector('#file-input')

      var formData = new FormData()
      console.log(this.imagefile)
      formData.append('files', imagefile.files[0] ? imagefile.files[0] : null)
      formData.append('Status', this.status)
      formData.append('ContentText', this.editor)
      formData.append('Title', this.title)

      // let formData = new FormData();
      // let file = this.fileInput.target.files[0];
      // formData.append("files", file);

      // let body = {
      //   Title: this.title,
      //   Status: this.status,
      //   ContentText: this.editor,
      // };

      center_managerment.CreateNew(formData).then(res => {
        if (res.mess.message == 'Success') {
          this.dialog = true
          setTimeout(() => {
            this.$router.push({ name: 'center-management-view-news' })
          }, 1000)
          this.dialog = false
        }
      })
    },
    onFileChange(e) {
      var size_image = e.target.files[0].size / 1024
      if (size_image > this.MAX_SIZE_IMAGE) {
        this.checkImage = true
      } else {
        this.checkImage = false
      }
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.createImage(files[0])
    },
    createImage(file) {
      var reader = new FileReader()
      var vm = this

      reader.onload = e => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    changeUrl(url) {
      let urlChange = url
      urlChange = urlChange.split('<img src="data:image/png;base64,')
      urlChange = urlChange[0].split('">')[0]
      let s = url.replace(
        'data:image/png;base64,' + urlChange,
        'https://file.hstatic.net/1000304519/article/cach-chup-milky-way-2-696x464_93410cf9690b4d859f8e241c4606ad6e_grande.jpg'
      )
      return s
    },

    back() {
      window.history.back()
    },
  },
  watch: {
    editor: function (e) {
      console.log(this.changeUrl(e))
      this.editor = this.changeUrl(e)
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
  img {
    width: 100%;
    max-height: 220px;
    object-fit: contain;
  }
  .imageContent {
    width: 78px;
    height: 56px;
  }
  footer {
    box-shadow: 0px -2px 9px rgba(184, 184, 184, 0.1);
  }
}
</style>
