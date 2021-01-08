<template>
  <b-row>
    <b-col cols="12">
      <b-form inline>
        <b-input-group size="sm">
          <b-textarea v-model="links" placeholder="URLs and/or magnets" rows="5" no-resize trim></b-textarea>
          <b-input-group-append>
            <b-button variant="primary" size="sm" v-on:click="addUrlsOrMagnets">Add</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form>
    </b-col>
    <b-col cols="12" class="mt-2">
      <b-form inline>
        <b-input-group size="sm">
          <b-form-file
              v-model="files"
              placeholder="Choose torrent and/or metalink files..."
              drop-placeholder="Choose torrent and/or metalink files..."
              accept="application/x-bittorrent, .torrent, application/metalink4+xml, application/metalink+xml, .meta4, .metalink"
              multiple="multiple"></b-form-file>
          <b-input-group-append>
            <b-button variant="primary" size="sm" class="btn-add" v-on:click="addFiles">Add</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Utils} from "@/utils";

@Component
export default class AddTask extends Vue {
  @Prop() aria2!: any;
  files: File[] = [];
  links: string = '';

  async addUrlsOrMagnets() {
    const splitUrls = this.links.split('\n');
    for (const url of splitUrls) {
      if (url.match(/\.torrent$|\.meta4$|\.metalink$/)) {
        const blob = await Utils.download(url);
        const b64 = await Utils.encodeFileToBase64(blob);
        this.aria2.call('aria2.addTorrent', b64);
      } else if (url.match(/\.meta4$|\.metalink$/)) {
        const blob = await Utils.download(url);
        const b64 = await Utils.encodeFileToBase64(blob);
        this.aria2.call('aria2.addMetalink', b64);
      } else {
        this.aria2.call('aria2.addUri', [url], {});
      }
    }
    this.links = "";
  }

  async addFiles() {
    for (const file of this.files) {
      if (file.name.match(/\.torrent$|\.meta4$|\.metalink$/)) {
        const b64 = await Utils.encodeFileToBase64(file);
        this.aria2.call('aria2.addTorrent', b64);
      } else if (file.name.match(/\.meta4$|\.metalink$/)) {
        const b64 = await Utils.encodeFileToBase64(file);
        this.aria2.call('aria2.addMetalink', b64);
      }
    }
    this.files = [];
  }
}
</script>

<style scoped>
.btn-add {
  height: 31px;
}
</style>
