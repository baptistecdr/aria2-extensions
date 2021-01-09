<template>
  <b-container class="p-2">
    <b-row>
      <b-col cols="12">
        <b-tabs content-class="m-3" lazy>
          <add-server v-for="server in servers()" v-bind:key="server.key" :current="server" v-on:update="onUpdate"/>
          <template #tabs-end>
            <b-nav-item role="presentation" @click.prevent="add" href="#"><b>+</b></b-nav-item>
          </template>
          <template #empty>
            <div class="text-center text-muted" v-html="$i18n('optionsNoServers')">
            </div>
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
import AddServer from "@/components/AddServer.vue";


@Component({
  components: {
    AddServer
  }
})
export default class App extends Vue {
  servers(): IServer[] {
    return Utils.servers();
  }

  add() {
    const id = uuidv4();
    const server = Server.new(id);
    localStorage.setItem(id, Server.toJSON(server));
    this.onUpdate();
  }

  onUpdate() {
    this.$forceUpdate();
    browser.runtime.sendMessage({
      settings: 'Updated'
    });
  }
}
</script>

<style>
</style>
