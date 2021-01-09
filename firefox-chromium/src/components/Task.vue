<template>
  <b-row class="tasks mb-2">
    <b-col cols="9">
      <b-row>
        <b-col cols="12" align-self="left" class="text-left text-truncate font-weight-bold">
          {{ filename }}
        </b-col>
        <b-col cols="12" align-self="left" class="pl-4 text-left">
          {{ status }}, {{ completedLength }} / {{ totalLength }}
          <span v-if="this.isActive">, {{ $i18n('taskEta') }}: {{ eta }}</span>
        </b-col>
        <b-col cols="12" align-self="left" class="pl-4 text-left" v-if="this.isActive">
          {{ connections }} {{ $i18n('taskConnections') }},
          <b-icon-arrow-down></b-icon-arrow-down>
          {{ downloadSpeed }} -
          <b-icon-arrow-up></b-icon-arrow-up>
          {{ uploadSpeed }}
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="3" align-self="right" class="text-right">
      <b-button variant="primary" size="sm" class="btn-left" v-on:click="pause"
                v-if="this.isActive || this.isWaiting">
        <b-icon-pause></b-icon-pause>
      </b-button>
      <b-button variant="primary" size="sm" class="btn-left" v-on:click="unpause"
                v-else-if="this.isPaused">
        <b-icon-play></b-icon-play>
      </b-button>
      <b-button variant="danger" size="sm" class="btn-right" v-on:click="remove">
        <b-icon-trash></b-icon-trash>
      </b-button>
    </b-col>
    <b-col cols="12" align-self="left" class="pl-4">
      <b-progress :max="100" class="position-relative">
        <b-progress-bar :value="progress"
                        :style="progressLabelColor"
                        :label-html="`<span class='justify-content-center d-flex position-absolute w-100'>${progress} %</span>`"
                        :variant="progressVariant"></b-progress-bar>
      </b-progress>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import filesize from 'filesize';
import path from 'path';
import {BIconArrowDown, BIconArrowUp, BIconPlay, BIconTrash, BIconPause} from "bootstrap-vue";
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
  components: {BIconArrowUp, BIconArrowDown, BIconPlay, BIconPause, BIconTrash}
})
export default class Task extends Vue {
  @Prop() private info!: any;
  @Prop() private aria2!: any;

  get filename() {
    if (this.info.bittorrent && this.info.bittorrent.info) {
      return this.info.bittorrent.info.name;
    } else {
      return path.basename(this.info.files[0].path);
    }
  }

  get status(): string {
    const upperCaseStatus = this.info.status.charAt(0).toUpperCase() + this.info.status.slice(1);
    return this.$i18n(`taskStatus${upperCaseStatus}`);
  }

  get connections(): number {
    return this.info.connections;
  }

  get downloadSpeed(): string {
    return `${filesize(this.info.downloadSpeed)}/s`;
  }

  get uploadSpeed(): string {
    return `${filesize(this.info.uploadSpeed)}/s`;
  }

  get completedLength(): string {
    return filesize(this.info.completedLength);
  }

  get totalLength(): string {
    return filesize(this.info.totalLength);
  }

  get eta(): string {
    if (this.info.downloadSpeed !== '0') {
      const etaSeconds = (this.info.totalLength - this.info.completedLength) / this.info.downloadSpeed;
      return this.formatEta(etaSeconds.toString());
    }
    return "";
  }

  get progress(): number {
    return Math.round(this.info.completedLength * 100 / this.info.totalLength);
  }

  get progressLabelColor(): any {
    if (this.progress <= 55) {
      return {color: "inherit"};
    }
    return {color: "white"};
  }

  get progressVariant(): string {
    if (this.isComplete) {
      return "success";
    } else if (this.isActive) {
      return "primary";
    } else if (this.isWaiting || this.isPaused) {
      return "warning";
    } else {
      return "danger";
    }
  }

  get isActive(): boolean {
    return this.info.status === 'active';
  }

  get isComplete(): boolean {
    return this.info.status === 'complete';
  }

  get isError(): boolean {
    return this.info.status === 'error';
  }

  get isRemoved(): boolean {
    return this.info.status === 'removed';
  }

  get isWaiting(): boolean {
    return this.info.status === 'waiting';
  }

  get isPaused(): boolean {
    return this.info.status === 'paused';
  }

  unpause() {
    this.aria2.call('aria2.unpause', this.info.gid);
  }

  pause() {
    this.aria2.call('aria2.pause', this.info.gid);
  }

  remove() {
    if (this.isComplete || this.isError || this.isRemoved) {
      this.aria2.call('aria2.removeDownloadResult', this.info.gid);
    } else {
      this.aria2.call('aria2.remove', this.info.gid);
    }
  }

  formatTime(time:number): string {
    const str = time.toString();
    const pad = "00";
    return pad.substring(0, pad.length - str.length) + str;
  }

  formatEta(sec: string): string {
    let secNum = parseInt(sec, 10);
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - (hours * 3600)) / 60);
    let seconds = secNum - (hours * 3600) - (minutes * 60);
    return `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
  }
}
</script>

<style scoped>
.tasks {
  font-size: smaller;
}

.btn-left {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.btn-right {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
