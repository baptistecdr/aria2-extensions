<template>
  <b-container class="pt-2">
    <b-row>
      <b-col cols="12">
        <b-tabs content-class="p-3" lazy>
          <server-options v-for="server in servers" v-bind:key="server.key" :current="server"/>
          <extension-options :servers="servers"/>
          <template #tabs-end>
            <b-nav-item role="presentation" @click.prevent="add" href="#"><b>+</b></b-nav-item>
          </template>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {v4 as uuidv4} from 'uuid';

import {Component, Vue} from 'vue-property-decorator';
// eslint-disable-next-line no-unused-vars
import {IServer, Server} from "@/models/server";
import {Utils} from '@/utils';
import ServerOptions from "@/components/ServerOptions.vue";
import ExtensionOptions from "@/components/ExtensionOptions.vue";

@Component({
  components: {
    ExtensionOptions,
    ServerOptions
  }
})
export default class App extends Vue {
  private servers: IServer[] = [];

  async created() {
    this.servers = await Utils.servers();
    browser.storage.onChanged.addListener(async () => this.servers = await Utils.servers());
  }

  add() {
    const id = uuidv4();
    const server = Server.new(id);
    browser.storage.sync.set({
      [id]: Server.toJSON(server)
    });
  }
}
</script>
<style>
@media (prefers-color-scheme: dark) {
  body {
    color: #FFF !important;
    background-color: #202023 !important;
  }
  hr {
    background-color: #343638 !important;
  }

  .nav-tabs {
    border-color: #343638 !important;
  }

  .nav-link.active, .nav-link:hover, .nav-link:focus, .form-control, select {
    color: #FFF !important;
    background-color: #202023 !important;
    border-color: #343638 !important;
  }

  .form-control::placeholder, .form-control::-moz-placeholder, .form-control::placeholder, .text-muted {
    color: #909092 !important;
  }
}
</style>
