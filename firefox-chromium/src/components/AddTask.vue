<template>
  <b-row>
    <b-col cols="12">
      <b-form inline>
        <b-input-group size="sm">
          <b-textarea v-model="urls" :placeholder="$i18n('addTaskAddUriPlaceholder')" rows="5" no-resize
                      trim></b-textarea>
          <b-input-group-append>
            <b-button variant="primary" size="sm" v-on:click="addUrlsOrMagnets">{{ $i18n('addTaskAdd') }}</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form>
    </b-col>
    <b-col cols="12" class="mt-2">
      <b-form inline>
        <b-input-group size="sm">
          <b-form-file
              v-model="files"
              :placeholder="$i18n('addTaskAddFilesPlaceholder')"
              :drop-placeholder="$i18n('addTaskAddFilesDropPlaceholder')"
              accept="application/x-bittorrent, .torrent, application/metalink4+xml, application/metalink+xml, .meta4, .metalink"
              multiple="multiple"></b-form-file>
          <b-input-group-append>
            <b-button variant="primary" size="sm" class="btn-add" v-on:click="addFiles">{{
                $i18n('addTaskAdd')
              }}
            </b-button>
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
  urls: string = '';

  async addUrlsOrMagnets() {
    let splitUrls = this.urls.split('\n');
    for (const url of splitUrls) {
      try {
        await Utils.captureUrl(this.aria2, url, '', '');
        await Utils.showNotification(this.$i18n('addUrlSuccess', this.aria2.name));
      } catch {
        await Utils.showNotification(this.$i18n('addUrlError', this.aria2.name));
      }
    }
    this.urls = "";
  }

  async addFiles() {
    for (const file of this.files) {
      try {
        if (file.name.match(/\.torrent$/)) {
          const b64 = await Utils.encodeFileToBase64(file);
          await this.aria2.call('aria2.addTorrent', b64);
        } else if (file.name.match(/\.meta4$|\.metalink$/)) {
          const b64 = await Utils.encodeFileToBase64(file);
          await this.aria2.call('aria2.addMetalink', b64);
        }
        await Utils.showNotification(this.$i18n('addFileSuccess', this.aria2.name));
      } catch {
        await Utils.showNotification(this.$i18n('addFileError', this.aria2.name));
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
