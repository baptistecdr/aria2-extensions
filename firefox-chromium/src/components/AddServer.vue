<template>
  <b-tab :title="current.name">
    <b-row>
      <b-col cols="6">
        <b-form-group
            id="fieldset-name"
            :invalid-feedback="invalidFeedback"
            :state="state(next.name)"
            label="Name"
            label-for="server-name">
          <b-form-input id="server-name" v-model="next.name" trim></b-form-input>
        </b-form-group>
      </b-col>
      <b-col cols="6">
        <b-form-group
            id="fieldset-host"
            :invalid-feedback="invalidFeedback"
            :state="state(next.host)"
            label="Host"
            label-for="server-host">
          <b-form-input id="server-host" v-model="next.host" trim></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6">
        <b-form-group
            id="fieldset-port"
            label="Port"
            label-for="server-port">
          <b-form-input type="number" id="server-port" v-model="next.port" min="0" max="49151"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col cols="6" align-self="center">
        <b-form-group
            id="fieldset-secure-connection"
            label="Secure connection"
            label-for="server-secure-connection">
          <b-form-checkbox id="server-secure-connection" v-model="next.secure"></b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <b-form-group
            id="fieldset-secret"
            label="Secret"
            description="Leave it blank if is not specified."
            label-for="server-secret">
          <b-form-input type="password" id="server-secret" v-model="next.secret"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <b-button variant="primary" class="mr-2" v-on:click="save" v-bind:disabled="!state(next.name) || !state(next.host)">
          Save
        </b-button>
        <b-button variant="danger" v-on:click="remove">Remove</b-button>
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
    return 'Please enter something.';
  }

  state(attr: string) {
    return attr.length > 0;
  }

  save() {
    localStorage.setItem(this.current.id, Server.toJSON(this.next));
    this.$emit("update", {});
  }

  remove() {
    localStorage.removeItem(this.current.id);
    this.$emit("update", {});
  }
}
</script>

<style scoped>

</style>
