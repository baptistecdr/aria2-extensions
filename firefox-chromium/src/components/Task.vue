<template>
  <b-row class="tasks mb-2">
    <b-col cols="9">
      <b-row>
        <b-col cols="12" align-self="start" class="text-left text-truncate font-weight-bold">
          {{ filename }}
        </b-col>
        <b-col cols="12" align-self="start" class="pl-4 text-left">
          {{ status }}, {{ completedLength }} / {{ totalLength }}<span v-if="this.isActive">, {{
            $i18n('taskEta')
          }}: {{ eta }}</span>
        </b-col>
        <b-col cols="12" align-self="start" class="pl-4 text-left" v-if="this.isActive">
          {{ connections }} {{ $i18n('taskConnections') }},
          <b-icon-arrow-down></b-icon-arrow-down>
          {{ downloadSpeed }} -
          <b-icon-arrow-up></b-icon-arrow-up>
          {{ uploadSpeed }}
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="3" align-self="start" class="text-right">
      <b-button variant="primary" size="sm" class="btn-left" v-on:click="pause"
                v-if="this.isActive || this.isWaiting">
        <b-icon-pause></b-icon-pause>
      </b-button>
      <b-button variant="primary" size="sm" class="btn-left" v-on:click="unpause"
                v-else-if="this.isPaused">
        <b-icon-play></b-icon-play>
      </b-button>
      <b-button variant="danger" size="sm" :class="isActive || isPaused || isWaiting ? 'btn-right' : ''"
                v-on:click="remove">
        <b-icon-trash></b-icon-trash>
      </b-button>
    </b-col>
    <b-col cols="12" align-self="start" class="pl-4">
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
import path from 'path';
import {BIconArrowDown, BIconArrowUp, BIconPlay, BIconTrash, BIconPause} from "bootstrap-vue";
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Duration, DurationOptions} from "luxon";
import {ToISOTimeDurationOptions} from "luxon/src/duration";
import {filesize} from "filesize";

@Component({
  components: {BIconArrowUp, BIconArrowDown, BIconPlay, BIconPause, BIconTrash}
})
export default class Task extends Vue {
  @Prop() private info!: any;
  @Prop() private aria2!: any;
  private fileSizeBase = {base: 2}

  get filename() {
    if (this.info.bittorrent && this.info.bittorrent.info) {
      return this.info.bittorrent.info.name;
    } else {
      return path.basename(this.info.files[0].path || this.$i18n('taskNoFilename'));
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
    return `${filesize(this.info.downloadSpeed, this.fileSizeBase)}/s`;
  }

  get uploadSpeed(): string {
    return `${filesize(this.info.uploadSpeed, this.fileSizeBase)}/s`;
  }

  get completedLength(): string {
    return filesize(this.info.completedLength, this.fileSizeBase);
  }

  get totalLength(): string {
    return filesize(this.info.totalLength, this.fileSizeBase);
  }

  get eta(): string {
    if (this.info.downloadSpeed !== '0') {
      const etaSeconds = (this.info.totalLength - this.info.completedLength) / this.info.downloadSpeed;
      return this.formatEta(etaSeconds);
    }
    return "∞";
  }

  get progress(): number {
    return Math.round(this.info.completedLength * 100 / this.info.totalLength) || 0;
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

  formatEta(seconds: number): string {
    const milliseconds = seconds * 1000;
    const duration = Duration.fromMillis(milliseconds, {
      locale: browser.i18n.getUILanguage(),
    } as DurationOptions)
    return duration.toISOTime({
      suppressMilliseconds: true,
    } as ToISOTimeDurationOptions).replace(/\.\d{0,3}/, "");
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
