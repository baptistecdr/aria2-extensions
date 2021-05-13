<template>
  <b-container>
    <b-row>
      <b-col cols="6" align-self="baseline" class="text-left stats">
        <b-icon-arrow-down></b-icon-arrow-down>
        {{ downloadSpeed }} -
        <b-icon-arrow-up></b-icon-arrow-up>
        {{ uploadSpeed }}
      </b-col>
      <b-col cols="6" align-self="baseline" class="text-right">
        <b-button  :disabled="showOptionsServer" variant="primary" size="sm" class="btn-left" v-on:click="toggleViewAdd()">{{ addButtonLabel }}</b-button>
        <b-button variant="danger" size="sm" :class="captureDownloadsOnThisServer() ? 'btn-middle' : 'btn-right'"
                  v-on:click="purgeDownloadResult">{{
            $i18n("serverPurge")
          }}
        </b-button>
        <b-button v-if="captureDownloadsOnThisServer()" variant="secondary" size="sm" class="btn-right"
                  v-on:click="toggleViewOptions()">
          <b-icon-gear v-if="!showOptionsServer"></b-icon-gear>
          <b-icon-caret-left v-else></b-icon-caret-left>
        </b-button>
      </b-col>
    </b-row>
    <hr class="mt-2 mb-2">
    <span v-if="showAddForm">
      <add-task :aria2="aria2"/>
    </span>
    <span v-else-if="showOptionsServer">
      <b-row>
        <b-col cols="12">
          <b-form-checkbox id="server-capture-downloads" v-model="options.capture" v-on:change="saveOptions()">{{
              $i18n('extensionOptionsCaptureDownloads')
            }}</b-form-checkbox>
        </b-col>
      </b-row>
    </span>
    <span v-else>
      <b-row v-if="tasks.length === 0">
        <b-col cols="12" class="font-italic">
          {{ $i18n('serverNoTasks') }}
        </b-col>
      </b-row>
      <task v-for="task in this.tasks" :gid="task.gid"
            v-bind:key="task.gid"
            :info="task"
            :aria2="aria2"/>
    </span>
  </b-container>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {BIconArrowUp, BIconArrowDown, BIconGear, BIconCaretLeft} from "bootstrap-vue";
import Task from "./Task.vue";
// @ts-ignore
import Aria2 from 'aria2';
import filesize from 'filesize';
import AddTask from "./AddTask.vue";
import {IServer} from "@/models/server";
import {IOptions, Options} from "@/models/options";

@Component({
  components: {
    AddTask, Task, BIconArrowUp, BIconArrowDown, BIconGear, BIconCaretLeft
  }
})
export default class Server extends Vue {
  @Prop() private options!: IOptions;
  @Prop() private config!: IServer;

  private aria2: any = null;
  private downloadSpeed: string = "0 B/s";
  private uploadSpeed: string = "0 B/s";
  private numWaiting: number = 0;
  private numStopped: number = 0;
  private tasks: any[] = [];
  private showAddForm: boolean = false;
  private showOptionsServer: boolean = false;

  get addButtonLabel(): string {
    if (this.showAddForm) {
      return this.$i18n("serverCancel");
    }
    return this.$i18n("serverAdd");
  }

  async created() {
    this.aria2 = new Aria2(this.config);
    await this.getGlobalStat();
    setInterval(this.getGlobalStat, 1000);
    setInterval(this.getTasks, 1000);
  }

  toggleViewAdd() {
    this.showAddForm = !this.showAddForm;
  }

  toggleViewOptions() {
    this.showOptionsServer = !this.showOptionsServer;
  }

  captureDownloadsOnThisServer(): boolean {
    return this.options.server === this.config.key;
  }

  async getGlobalStat() {
    const res = await this.aria2.call('getGlobalStat', [], {});
    this.downloadSpeed = `${filesize(res.downloadSpeed)}/s`;
    this.uploadSpeed = `${filesize(res.uploadSpeed)}/s`;
    this.numWaiting = parseInt(res.numWaiting);
    this.numStopped = parseInt(res.numStopped);
  }

  async purgeDownloadResult() {
    await this.aria2.call('purgeDownloadResult');
  }

  async getTasks() {
    const res = await this.aria2.multicall(
        [
          ['tellActive'],
          ['tellWaiting', 0, this.numWaiting],
          ['tellStopped', 0, this.numStopped],
        ]
    );
    this.tasks = [];
    for (const categories of res) {
      for (const tasks of categories) {
        for (const task of tasks) {
          this.tasks.push(task);
        }
      }
    }
  }
  async saveOptions() {
    await browser.storage.sync.set(
        {
          "options": Options.toJSON(this.options)
        }
    )
  }
}
</script>

<style scoped>
.stats {
  font-size: smaller;
}

.btn-left {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.btn-middle {
  border-radius: 0;
}

.btn-right {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
