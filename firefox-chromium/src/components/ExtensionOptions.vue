<template>
  <b-tab :title="$i18n('extensionOptionsTitle')">
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
      <b-col cols="12" align-self="center">
        <b-form-group
            id="fieldset-capture-downloads"
            :label="$i18n('extensionOptionsCaptureDownloads')"
            label-for="server-capture-downloads">
          <b-form-checkbox id="server-capture-downloads" v-model="options.capture"></b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12" align-self="center">
        <b-form-group
            id="fieldset-capture-downloads-server"
            :label="$i18n('extensionOptionsServerToSendDownloads')"
            label-for="capture-downloads-server">
          <b-form-select v-model="selected" :options="optionsServers" :state="state"
                         :disabled="!options.capture"></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12" align-self="center">
        <b-form-group
            id="fieldset-capture-downloads-server"
            :label="$i18n('extensionOptionsExcludeProtocols')"
            :description="$i18n('extensionOptionsExcludeProtocolsDescription')"
            label-for="capture-downloads-server">
          <b-textarea v-model="excludedProtocols" :disabled="!options.capture" no-resize trim></b-textarea>
          <b-form-text>{{ $i18n('extensionOptionsExcludeProtocolsInformation') }}</b-form-text>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12" align-self="center">
        <b-form-group
            id="fieldset-capture-downloads-server"
            :label="$i18n('extensionOptionsExcludeSites')"
            :description="$i18n('extensionOptionsExcludeSitesDescription')"
            label-for="capture-downloads-server">
          <b-textarea v-model="excludedSites" :disabled="!options.capture" no-resize trim></b-textarea>
          <b-form-text>{{ $i18n('extensionOptionsExcludeSitesInformation') }}</b-form-text>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12" align-self="center">
        <b-form-group
            id="fieldset-capture-downloads-server"
            :label="$i18n('extensionOptionsExcludeFileTypes')"
            :description="$i18n('extensionOptionsExcludeFileTypesDescription')"
            label-for="capture-downloads-server">
          <b-textarea v-model="excludedFileTypes" :disabled="!options.capture" no-resize trim></b-textarea>
          <b-form-text>{{ $i18n('extensionOptionsExcludeFileTypesInformation') }}</b-form-text>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <b-button variant="primary" v-on:click="save" :disabled="state === false">
          {{ $i18n("serverOptionsSave") }}
        </b-button>
      </b-col>
    </b-row>
  </b-tab>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {IServer} from "@/models/server";
import {IOptions, Options} from "@/models/options";
import {Utils} from "@/utils";

@Component
export default class ExtensionOptions extends Vue {
  @Prop() servers!: IServer[];

  @Watch('servers')
  onPropertyChanged(value: IServer[]) {
    this.servers = value;
    if (this.options.server !== "") {
      const index = this.servers.findIndex(s => s.key === this.options.server);
      if (index === -1) {
        this.selected = null;
        this.options.capture = false;
        this.save(false);
      }
    }
  }

  selected: any = null;
  options: IOptions = Options.new()

  showSuccessAlert = false;
  showErrorAlert = false;

  async created() {
    this.options = await Utils.options();
    if (this.options.server !== "") {
      this.selected = this.servers.findIndex(s => s.key === this.options.server);
    }
  }

  get optionsServers() {
    return this.servers.map((server, i) => {
      return {
        value: i,
        text: server.name
      }
    });
  }

  get state() {
    return this.options.capture ? this.selected !== null : null;
  }

  get excludedProtocols(): string {
    return this.options.excludedProtocols.join(', ');
  }

  formatExcludedValue(value: string): string[] {
    return value.replace(/(\r\n|\n|\r)/gm, ",").split(/\s*,+\s*/).filter(s => s !== "");
  }

  set excludedProtocols(value: string) {
    this.options.excludedProtocols = this.formatExcludedValue(value);
  }

  get excludedSites(): string {
    return this.options.excludedSites.join(', ');
  }

  set excludedSites(value: string) {
    this.options.excludedSites = this.formatExcludedValue(value);
  }

  get excludedFileTypes(): string {
    return this.options.excludedFileTypes.join(', ');
  }

  set excludedFileTypes(value: string) {
    this.options.excludedFileTypes = this.formatExcludedValue(value);
  }

  async save(showAlert: boolean) {
    if (this.selected !== null) {
      this.options.server = this.servers[this.selected!].key;
    } else {
      this.options.server = "";
    }
    await browser.storage.sync.set(
        {
          "options": Options.toJSON(this.options)
        }
    )
    if (showAlert) {
      this.showSuccessAlert = true;
      this.showErrorAlert = false;
    }
  }
}
</script>

<style scoped>

</style>
