<template>
  <b-tabs content-class="mt-3" v-if="servers().length !== 0" lazy>
    <b-tab v-for="server in servers()" :title="server.name" v-bind:key="server.id">
      <server :config="server"/>
    </b-tab>
  </b-tabs>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
// eslint-disable-next-line no-unused-vars
import {IServer} from "@/models/server";
import {Utils} from "@/utils";
import Server from "@/components/Server.vue";

@Component({
  components: {Server},
})
export default class App extends Vue {
    servers(): IServer[] {
      return Utils.servers();
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
