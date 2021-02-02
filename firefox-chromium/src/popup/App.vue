<template>
  <b-tabs content-class="pt-3" v-if="servers.length !== 0" lazy>
    <b-tab v-for="server in servers" :title="server.name" v-bind:key="server.key">
      <server :config="server"/>
    </b-tab>
  </b-tabs>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {IServer} from "@/models/server";
import {Utils} from "@/utils";
import Server from "@/components/Server.vue";

@Component({
  components: {Server},
})
export default class App extends Vue {
  private servers: IServer[] = [];

  async mounted() {
    this.servers = await Utils.servers();
  }
}
</script>

<style>
body {
  width: 500px;
  height: 100%;
  padding: 15px;
}
</style>
