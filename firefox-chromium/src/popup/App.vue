<template>
  <b-tabs content-class="pt-3" v-if="servers.length !== 0" lazy>
    <b-tab v-for="server in servers" :title="server.name" v-bind:key="server.key">
      <server :config="server" :options="options"/>
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
import {IOptions, Options} from "@/models/options";

@Component({
  components: {Server},
})
export default class App extends Vue {
  private servers: IServer[] = [];
  private options: IOptions = Options.new();

  async mounted() {
    this.servers = await Utils.servers();
    this.options = await Utils.options();
  }
}
</script>

<style>
body {
  width: 416px;
  margin: 15px;
}

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

  .form-control::-moz-placeholder, .form-control::placeholder, textarea::placeholder {
    color: #B1B1B3 !important;
  }

  .custom-file-label {
    background-color: #4A4A4F !important;
    border-color: #38383D !important;
    color: #B1B1B3 !important;
  }

  .custom-file-label:focus {
    background-color: #4A4A4F !important;
    border-color: #0A84FF !important;
    color: #B1B1B3 !important;
  }

  .progress {
    background-color: #F2F2F2 !important;
    color: black;
  }
}
.custom-file-input {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-top-left-radius: 1px;
  border-bottom-left-radius: 1px;
}
.custom-file-label {
  font-size: small !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-top-left-radius: 1px;
  border-bottom-left-radius: 1px;
}
.form-file-text {
  opacity: 0.8;
}
</style>
