<template>
  <v-dialog v-model="referenceDialog" :max-width="maxWidth || 515" :height="height || 800">
    <v-card class="pa-5">
      <template v-if="loading">
        <div class="pb-3">
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
        </div>
      </template>
      <div class="d-flex flex-column">
        <div class="header d-flex">
          <div class="header-left mr-auto">
            <img
              :style="{ width: '17px', height: '17px', marginRight: '10px' }"
              :src="getIconType(typeOfReference)"
              alt=""
              srcset=""
            />
            <h1 class="d-inline-block">{{ TitleOfReference }}</h1>
          </div>
          <v-btn color="error" dark icon @click="closePopup"><v-icon>mdi-close</v-icon></v-btn>
        </div>
        <em class="blue_text mb-4">{{ authorNames }}</em>
        <template v-if="!isAudio"
          ><iframe
            :src="getIconView(referenceUrl)"
            :style="{ height: '400px', overflowY: 'scroll' }"
          ></iframe
        ></template>
        <template v-else><iframe :src="getIconView(referenceUrl)"></iframe></template>
        <div class="information d-flex mt-4">
          <div class="info-left mr-auto">
            <p>Upload date: {{ updateAt }}</p>
            <p>Categories: {{ categories }}</p>
          </div>
          <a :href="referenceUrl" target="_blank" class="white_text link"
            >Open in new tab
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="ml-2"
            >
              <g clip-path="url(#clip0_12263_107183)">
                <path
                  d="M14.4444 20H3.33331C2.44289 20 1.60584 19.6532 0.976279 19.0236C0.346722 18.394 0 17.557 0 16.6666V5.55555C0 4.66516 0.346761 3.82811 0.976318 3.19855C1.60587 2.569 2.44293 2.22224 3.33335 2.22224H7.77778C8.39147 2.22224 8.8889 2.71967 8.8889 3.33335C8.8889 3.94703 8.39147 4.44447 7.77778 4.44447H3.33331C3.03651 4.44447 2.75751 4.56006 2.54769 4.76988C2.33786 4.97971 2.22224 5.25874 2.22224 5.55555V16.6666C2.22224 16.9635 2.33782 17.2424 2.54769 17.4524C2.75751 17.6621 3.03651 17.7778 3.33331 17.7778H14.4444C14.7412 17.7778 15.0202 17.6622 15.23 17.4523C15.4399 17.2424 15.5555 16.9634 15.5555 16.6666V12.2222C15.5555 11.6085 16.0529 11.1111 16.6666 11.1111C17.2803 11.1111 17.7778 11.6086 17.7778 12.2222V16.6666C17.7778 17.557 17.431 18.394 16.8014 19.0237C16.1718 19.6532 15.3347 20 14.4444 20ZM7.77778 13.3333C7.4934 13.3333 7.20905 13.2248 6.99212 13.0079C6.55822 12.574 6.55822 11.8704 6.99212 11.4365L16.2064 2.22224H12.2222C11.6085 2.22224 11.1111 1.7248 11.1111 1.11112C11.1111 0.497435 11.6085 0 12.2222 0H18.8889C19.0425 0 19.1889 0.0312062 19.322 0.0876023C19.4463 0.140156 19.563 0.216308 19.665 0.316098C19.6651 0.316137 19.6651 0.316137 19.6651 0.316176C19.6659 0.316913 19.6666 0.317612 19.6673 0.318349C19.6675 0.318543 19.6678 0.318776 19.6679 0.31897C19.6685 0.319514 19.6691 0.320096 19.6697 0.320678C19.67 0.321066 19.6704 0.321416 19.6708 0.321804C19.6712 0.322231 19.6717 0.322696 19.672 0.323046C19.6728 0.323822 19.6737 0.324637 19.6744 0.325452C19.6752 0.326228 19.6761 0.327082 19.6768 0.327859C19.6773 0.328247 19.6777 0.328751 19.678 0.329101C19.6785 0.329489 19.6788 0.329838 19.6792 0.330226C19.6798 0.330808 19.6803 0.331352 19.6809 0.331973C19.6811 0.332128 19.6813 0.3324 19.6815 0.332594C19.6822 0.333331 19.683 0.334069 19.6837 0.334806C19.6837 0.334845 19.6837 0.334845 19.6837 0.334884C19.7835 0.437041 19.8597 0.553715 19.9122 0.677919C19.9686 0.811049 19.9998 0.957377 19.9998 1.11108V7.77774C19.9998 8.39143 19.5024 8.88886 18.8887 8.88886C18.275 8.88886 17.7776 8.39143 17.7776 7.77774V3.7936L8.56326 13.0079C8.34648 13.2249 8.06213 13.3333 7.77778 13.3333Z"
                  fill="#fff"
                />
              </g>
              <defs>
                <clipPath id="clip0_12263_107183">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </a>
        </div>
        <template>
          <div v-html="description" class="mt-4"></div>
        </template>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import dayjs from 'dayjs'
import { referencies } from '@/api/referencies'

export default {
  props: {
    height: String,
    maxWidth: String,
    referenceID: Number,
  },
  data() {
    return {
      loading: false,
      isImage: false,
      isAudio: false,
      referenceDialog: false,
      item: null,
      tagList: [],
      TitleOfReference: '',
      referenceUrl: '',
      typeOfReference: '',
      authorNames: '',
      categories: '',
      updateAt: '',
      description: '',
    }
  },
  created() {
    this.loading = true
    this.getTagList()
    if (this.referenceID !== 0) this.getReference()
  },
  watch: {
    referenceID: function () {
      this.getReference()
    },
    referenceDialog: function () {
      this.getReference()
    },
  },
  methods: {
    open(item) {
      this.referenceDialog = true
      this.item = item
    },
    closePopup() {
      this.referenceDialog = false
      this.TitleOfReference = ''
      this.referenceUrl = ''
      this.typeOfReference = ''
      this.authorNames = ''
      this.categories = ''
      this.description = ''
      this.updateAt = ''
      this.loading = false
    },
    async getTagList() {
      await referencies.getTaglist().then(res => (this.tagList = res))
    },
    async getReference() {
      await referencies.getReferenceByID(this.referenceID).then(res => {
        this.TitleOfReference = res.referenceName
        this.referenceUrl = res.referenceURL
        this.typeOfReference = res.referenceType
        this.authorNames = res.authorNames
        this.categories = this.tagList
          .filter(e => res.referenceTagIDs.includes(e.referenceTagID))
          .map(e => e.referenceTagName)
          .join(', ')
        this.description = res.referenceDescription
        this.updateAt = dayjs(res.updatedAt).format('DD/MM/YYYY')
        this.loading = false
      })
    },
    getIconType(type) {
      switch (type) {
        case 'video':
          this.isImage = false
          this.isAudio = false
          return require('../../assets/images/icon-type-video.svg')
        case 'image':
          this.isImage = true
          this.isAudio = false
          return require('../../assets/images/icon-type-image.svg')
        case 'pdf':
          this.isImage = false
          this.isAudio = false
          return require('../../assets/images/icon-type-pdf.svg')
        case 'word':
          this.isImage = false
          this.isAudio = false
          return require('../../assets/images/icon-type-word.svg')
        case 'excel':
          this.isImage = false
          this.isAudio = false
          return require('../../assets/images/icon-type-excel.svg')
        case 'audio':
          this.isImage = false
          this.isAudio = true
          return require('../../assets/images/icon-type-audio.svg')
        default:
          this.isImage = false
          this.isAudio = false
          return require('../../assets/images/icon-type-pp.png')
      }
    },
    getIconView(url) {
      if (url.indexOf('youtube') > 0) {
        return this.getVideoEmbedded(url)
      } else return this.getMediaEmbedded(url)
    },
    getMediaEmbedded(url) {
      const indexOfTail = url.lastIndexOf('/')
      const linkTail = url.slice(indexOfTail + 1, url.length)
      return url.replace(linkTail, 'preview')
    },
    getVideoEmbedded(link) {
      const keyStartIndex = link.indexOf('v=') + 2
      const keyEndIndex = link.indexOf('&') > 0 ? link.indexOf('&') : link.length
      const embedLink = 'https://www.youtube.com/embed/' + link.slice(keyStartIndex, keyEndIndex)
      return embedLink
    },
  },
}
</script>
<style lang="scss" scoped>
.blue_text {
  color: #5d88e4;
}
.link {
  background-color: #0b2585;
  padding: 8px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
}
.white_text {
  color: #fff;
}
</style>
