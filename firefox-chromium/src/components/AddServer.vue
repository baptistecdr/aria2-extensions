<template>
  <b-tab :title="current.name">
    <b-row>
      <b-col cols="6">
        <b-form-group
            id="fieldset-name"
            :invalid-feedback="invalidFeedback"
            :state="state(next.name)"
            :label="$i18n('addServerName')"
            label-for="server-name">
          <b-form-input id="server-name" v-model="next.name" trim></b-form-input>
        </b-form-group>
      </b-col>
      <b-col cols="6">
        <b-form-group
            id="fieldset-host"
            :invalid-feedback="invalidFeedback"
            :state="state(next.host)"
            :label="$i18n('addServerHost')"
            label-for="server-host">
          <b-form-input id="server-host" v-model="next.host" trim></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6">
        <b-form-group
            id="fieldset-port"
            :label="$i18n('addServerPort')"
            label-for="server-port">
          <b-form-input type="number" id="server-port" v-model="next.port" min="0" max="49151"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col cols="6" align-self="center">
        <b-form-group
            id="fieldset-secure-connection"
            :label="$i18n('addServerSecureConnection')"
            label-for="server-secure-connection">
          <b-form-checkbox id="server-secure-connection" v-model="next.secure"></b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <b-form-group
            id="fieldset-secret"
            :label="$i18n('addServerSecret')"
            description="Leave it blank if is not specified."
            label-for="server-secret">
          <b-form-input type="password" id="server-secret" v-model="next.secret"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6" align-self="center">
        <b-form-group
            id="fieldset-capture-downloads"
            :label="$i18n('addServerCaptureDownloads')"
            label-for="server-capture-downloads">
          <b-form-checkbox id="server-capture-downloads" v-model="next.capture"></b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <b-button variant="primary" class="mr-2" v-on:click="save"
                  v-bind:disabled="!state(next.name) || !state(next.host)">
          {{ $i18n('addServerSave') }}
        </b-button>
        <b-button variant="danger" v-on:click="remove">{{ $i18n('addServerRemove') }}</b-button>
      </b-col>
    </b-row>
  </b-tab>
</template>

<script lang="ts">

import {Component, Prop, Vue} from "vue-property-decorator";
// eslint-disable-next-line no-unused-vars
import {IServer, Server} from "@/models/server";

@Component
export default class AddServer extends Vue {
  @Prop() private current!: IServer;

  private next: IServer = JSON.parse(JSON.stringify(this.current));

  get invalidFeedback(): string {
    return this.$i18n('addServerInvalidFeedback');
  }

  state(attr: string) {
    return attr.length > 0;
  }

  save() {
    localStorage.setItem(this.current.key, Server.toJSON(this.next));
    this.$emit("update", {});
  }

  remove() {
    localStorage.removeItem(this.current.key);
    this.$emit("update", {});
  }
}
</script>

<style scoped>

</style>
