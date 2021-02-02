<template>
  <b-tabs content-class="pt-3" v-if="servers.length !== 0" lazy>
    <b-tab v-for="server in servers" :title="server.name" v-bind:key="server.key">
      <server :config="server"/>
    </b-tab>
  </b-tabs>
  <div class="text-center" v-else>
    {{ $i18n("popupNoServerFound1") }}<br>
    {{ $i18n("popupNoServerFound2") }}
  </div>
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
@media (prefers-color-scheme: dark) {
  body {
    color: #FFF !important;
    background-color: #4A4A4F !important;
  }

  hr {
    background-color: #343638 !important;
  }

  .nav-tabs {
    border-color: #343638 !important;
  }

  .nav-link.active, .nav-link:hover, .nav-link:focus, .form-control {
    color: #FFF !important;
    background-color: #4A4A4F !important;
    border-color: #343638 !important;
  }

  .form-control::-moz-placeholder {
    color: #B1B1B3 !important;
  }

  .form-control::placeholder {
    color: #B1B1B3 !important;
  }
}

body {
  width: 500px;
  height: 100%;
  padding: 15px;
}
</style>
