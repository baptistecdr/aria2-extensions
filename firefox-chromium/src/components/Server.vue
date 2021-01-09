<template>
  <b-container>
    <b-row>
      <b-col cols="7" align-self="left" class="text-left stats">
        <b-icon-arrow-down></b-icon-arrow-down>
        {{ downloadSpeed }} -
        <b-icon-arrow-up></b-icon-arrow-up>
        {{ uploadSpeed }}
      </b-col>
      <b-col cols="5" align-self="right" class="text-right">
        <b-button variant="primary" size="sm" class="btn-left" v-on:click="togglePage">{{ addButtonLabel }}</b-button>
        <b-button variant="danger" size="sm" class="btn-right" v-on:click="purgeDownloadResult">{{ $i18n("serverPurge") }}</b-button>
      </b-col>
    </b-row>
    <hr class="mt-2 mb-2">
    <span v-if="showAddForm">
      <add-task :aria2="aria2"/>
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
import {BIconArrowUp, BIconArrowDown} from "bootstrap-vue";
import Task from "./Task.vue";
// @ts-ignore
import Aria2 from 'aria2';
import filesize from 'filesize';
import AddTask from "./AddTask.vue";
// eslint-disable-next-line no-unused-vars
import {IServer} from "@/models/server";

@Component({
  components: {
    AddTask, Task, BIconArrowUp, BIconArrowDown
  }
})
export default class Server extends Vue {
  @Prop() private config!: IServer;

  private aria2: any = null;
  private downloadSpeed: string = "0 B/s";
  private uploadSpeed: string = "0 B/s";
  private numWaiting: number = 0;
  private numStopped: number = 0;
  private tasks: any[] = [];
  private showAddForm: boolean = false;

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

  togglePage() {
    this.showAddForm = !this.showAddForm;
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

.btn-right {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
