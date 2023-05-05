<template>
  <input
    style="display: none"
    type="file"
    multiple
    :name="uploadFieldName"
    :value="fileUpload"
    @change="save"
    accept="image/*"
    id="input-file"
  />
</template>

<script>
// swap as you need
//import { upload } from "@/_services/UploadFile/file-upload.fake.service"; // fake service
// import { service } from "@/_services/Account/Setting/account-setting.service.js";
import { MAX_SIZE_IMAGE_UPLOAD } from "@/api/constant.js";
// import { _alert } from "@/_helpers/function";
export default {
  props: {},
  data() {
    return {
      uploadError: null,
      currentStatus: 0,
      uploadFieldName: "file",
      fileUpload: "",
    };
  },
  methods: {
    async save() {
      //   let store = this.$store;
      // upload data to the server

      const fileInput = document.querySelector("#input-file");
      let formData = new FormData();
      let listFile = [...fileInput.files];
      //   let img;
      //   let file;
      //   let failCount = 0;
      //   let _URL = window.URL || window.webkitURL;
      listFile.forEach((x, i) => {
        if (x.size > MAX_SIZE_IMAGE_UPLOAD) {
          listFile.splice(i, 1);
          this.$store.commit("alert/display", {
            message: this.$t("IMAGE_CAPACITY_NOT_BIGGER_THAN") + " 5MB",
            error: true,
            success: false,
          });
          //   failCount++;
        }
      });
      let promises = listFile.map((x) => {
        formData = new FormData();
        formData.append("file", x);
        // return service.updateAvatar(formData);
      });
      //   let index = -1;
      for (const promise of promises) {
        await promise
          .then((x) => {
            if (x.responseCode == 1) {
              //   _alert(x, this.$t("FAIL"), false);
              return false;
            }
            // index++;
            // _alert(x, this.$t("UPLOAD_SUCCESS"), false);
          })
          .catch((err) => {
            this.uploadError = err.response;
          });
      }
      if (document.getElementById("input-file"))
        document.getElementById("input-file").value = "";
      this.$emit("completed");
    },
  },
};
</script>
