<template>
  <b-tab :title="current.name">
    <b-row>
      <b-col cols="12">
        <b-alert v-model="showSuccessAlert" variant="success" dismissible>
          {{ $i18n("serverOptionsSuccess") }}
        </b-alert>
        <b-alert v-model="showErrorAlert" variant="danger" dismissible>
          {{ $i18n("serverOptionsError") }}
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6">
        <b-form-group
            id="fieldset-name"
            :invalid-feedback="invalidFeedback"
            :state="state(next.name)"
            :label="$i18n('serverOptionsName')"
            label-for="server-name">
          <b-form-input id="server-name" v-model="next.name" trim></b-form-input>
        </b-form-group>
      </b-col>
      <b-col cols="6">
        <b-form-group
            id="fieldset-host"
            :invalid-feedback="invalidFeedback"
            :state="state(next.host)"
            :label="$i18n('serverOptionsHost')"
            label-for="server-host">
          <b-form-input id="server-host" v-model="next.host" trim></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6">
        <b-form-group
            id="fieldset-port"
            :label="$i18n('serverOptionsPort')"
            label-for="server-port">
          <b-form-input type="number" id="server-port" v-model="next.port" min="0" max="49151"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col cols="6" align-self="center">
        <b-form-group
            id="fieldset-secure-connection"
            :label="$i18n('serverOptionsSecureConnection')"
            label-for="server-secure-connection">
          <b-form-checkbox id="server-secure-connection" v-model="next.secure"></b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <b-form-group
            id="fieldset-secret"
            :label="$i18n('serverOptionsSecret')"
            :description="$i18n('serverOptionsSecretDescription')"
            label-for="server-secret">
          <b-form-input type="password" id="server-secret" v-model="next.secret"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <b-button variant="primary" class="mr-2" v-on:click="save"
                  v-bind:disabled="!state(next.name) || !state(next.host)">
          {{ $i18n('serverOptionsSave') }}
        </b-button>
        <b-button variant="danger" v-on:click="remove">{{ $i18n('serverOptionsRemove') }}</b-button>
      </b-col>
    </b-row>
  </b-tab>
</template>

<script lang="ts">

import {Component, Prop, Vue} from "vue-property-decorator";
import {IServer, Server} from "@/models/server";

@Component
export default class ServerOptions extends Vue {
  @Prop() private current!: IServer;

  private next: IServer = JSON.parse(JSON.stringify(this.current));
  private showSuccessAlert = false;
  private showErrorAlert = false;

  get invalidFeedback(): string {
    return this.$i18n('serverOptionsInvalidFeedback');
  }

  state(attr: string) {
    return attr.length > 0;
  }

  async save() {
    try {
      await browser.storage.sync.set({
        [this.current.key]: Server.toJSON(this.next)
      });
      this.showSuccessAlert = true;
      this.showErrorAlert = false;
    } catch {
      this.showSuccessAlert = false;
      this.showErrorAlert = true;
    }
  }

  remove() {
    browser.storage.sync.remove(this.current.key);
  }
}
</script>

<style scoped>
@media (prefers-color-scheme: dark) {
  .text-muted {
    color: #B1B1B3 !important;
  }
}
</style>
