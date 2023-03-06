import {LitElement, html} from 'lit-element';
import '@polymer/paper-input/paper-input.js';
import '@unicef-polymer/etools-dialog/etools-dialog.js';
import {getTranslation} from './utils/translate';

/**
 * @polymer
 * @customElement
 */
export class EtoolsUserProfileDialog extends LitElement {
  render() {
    // language=HTML
    return html`
      <style>
        [hidden] {
          display: none !important;
        }

        :host {
          --paper-dialog-scrollable: {
            width: 100%;
            overflow-x: hidden;
            max-height: 600px;
          }
        }

        .paper-label {
          font-size: 12px;
          color: var(--secondary-text-color);
          padding-top: 6px;
        }

        .input-label {
          min-height: 24px;
          padding-top: 4px;
          padding-bottom: 6px;
          min-width: 0;
          font-size: 16px;
        }

        .input-label[empty]::after {
          content: '—';
          color: var(--secondary-text-color);
        }

        .separator {
          padding: 0 8px;
        }

        paper-input {
          width: 100%;
        }

        paper-input[readonly],
        etools-dropdown-multi[readonly] {
          pointer-events: none;
          --paper-input-container-underline: {
            display: none;
          }
        }

        #profile-content {
          overflow: hidden;
          box-sizing: border-box;
        }

        .row-h {
          display: flex;
          flex-direction: row;
        }

        .flex-c {
          /* flex container */
          flex: 1;
        }

        .row-h + .row-h,
        .row-v + .row-v {
          margin-top: 20px;
        }

        .row-h:first-child + .row-v {
          margin-top: 0;
        }

        .col {
          display: flex;
          flex-direction: row;
          box-sizing: border-box;
        }

        .col:not(:first-child) {
          padding-inline-start: 24px;
        }

        .col-6 {
          flex: 0 0 50%;
          max-width: 50%;
        }

        .col-12 {
          flex: 0 0 100%;
          max-width: 100%;
        }

        etools-dialog::part(ed-title) {
          border-bottom: var(--epd-profile-dialog-border-b, none);
        }
        .flex-wrap {
          display: flex;
          flex-wrap: wrap;
        }
        .input-label.flex-wrap div {
          padding-bottom: 6px;
        }
      </style>

      <etools-dialog
        id="userProfileDialog"
        size="lg"
        ok-btn-text="${getTranslation(this.language, 'OK_BTN_TEXT')}"
        cancel-btn-text="${getTranslation(this.language, 'CANCEL_BTN_TEXT')}"
        dialog-title="${getTranslation(this.language, 'MY_PROFILE')}"
        ?hide-confirm-btn="${this.readonly}"
        @close="${this._closeUserProfileDialog}"
      >
        <div id="profile-content" part="epd-user-profile-dropdown-content">
          <!-- FIELDS HIDDEN AS REQUIRED BY BUSINESS SPECS - CH6215 -->
          <!-- <div class="row-h flex-c">
              <div class="col col-6">
                <etools-dropdown id="office" label="Office" placeholder="—" .selected="${this.profile.office}"
                                 .options="${this.offices}" auto-validate="" error-message="Please select an office">
                </etools-dropdown>
              </div>
              <div class="col col-6">
                <etools-dropdown id="section" label="Section" placeholder="—" .selected="${this.profile.section}"
                                 .options="${this.sections}" auto-validate="" error-message="Please select a section">
                </etools-dropdown>
              </div>
            </div>
            <div class="row-h flex-c">
              <div class="col col-6">
                <paper-input label="Job title" .value="${this.profile.job_title}" placeholder="—"></paper-input>
              </div>
              <div class="col col-6">
                <paper-input label="Phone number" .value="${this.profile.phone_number}" placeholder="—"></paper-input>
              </div>
            </div>
            <div class="row-h flex-c">
              <div class="col col-6">
                <paper-input id="supervisor" label="My supervisor" placeholder="—" .value="${this.profile.supervisor}"
                             readonly="">
                </paper-input>
              </div>
              <div class="col col-6">
                <etools-dropdown id="oic" label="My OIC" placeholder="—"
                .selected="${this.profile.oic}" .options="${this.users}"
                                 auto-validate="" error-message="Please select an OIC">
                </etools-dropdown>
              </div>
            </div> -->
          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-input
                id="name"
                label="${getTranslation(this.language, 'NAME')}"
                placeholder="&#8212;"
                .value="${this.profile.name}"
                readonly
              ></paper-input>
            </div>
          </div>
          <div class="row-h flex-c" ?hidden="${!this.showEmail}">
            <div class="col col-12">
              <paper-input
                id="email"
                label="${getTranslation(this.language, 'EMAIL')}"
                placeholder="&#8212;"
                .value="${this.profile.email}"
                readonly
              ></paper-input>
            </div>
          </div>
          <div class="row-h flex-c" ?hidden="${this.hideAvailableWorkspaces}">
            <div class="col col-12">
              <div>
                <label class="paper-label">${getTranslation(this.language, 'AVAILABLE_WORKSPACES')}</label>
                <div class="input-label flex-wrap" ?empty="${this._emptyArray(this.profile.countries_available)}">
                  ${(this.profile.countries_available || []).map(
                    (item, index) => html`
                      <div>
                        ${item.name}
                        <span class="separator">${this.getSeparator(this.profile.countries_available, index)}</span>
                      </div>
                    `
                  )}
                </div>
              </div>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-12">
              <div>
                <label class="paper-label">${getTranslation(this.language, 'MY_GROUPS')}</label>
                <div class="input-label flex-wrap" ?empty="${this._emptyArray(this.profile.groups)}">
                  ${(this.profile.groups || []).map(
                    (item, index) => html`
                      <div>
                        ${item.name}
                        <span class="separator">${this.getSeparator(this.profile.groups, index)}</span>
                      </div>
                    `
                  )}
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="row-h flex-c">
              <div class="col col-12">
                <etools-dropdown-multi id="supervisees" label="My supervisees" placeholder="—"
                                        .selectedValues="${this.profile.supervisees}" .options="${this.users}" readonly>
                </etools-dropdown-multi>
              </div>
            </div> -->
        </div>
      </etools-dialog>
    `;
  }

  static get properties() {
    return {
      profile: {type: Object},
      readonly: {type: Boolean},
      // offices: Array,
      // sections: Array,
      // users: Array,
      availableCountryIds: Array,
      availableGroups: Array,
      showEmail: {type: Boolean},
      hideAvailableWorkspaces: {type: Boolean},
      language: {type: String}
    };
  }

  set profile(val) {
    this._profile = val;
    this._mapIds(this.profile);
  }

  get profile() {
    return this._profile;
  }

  constructor() {
    super();

    this._profile = {};
    this.readonly = true;
    this.showEmail = false;
  }

  openUserProfileDialog() {
    this.shadowRoot.querySelector('#userProfileDialog').opened = true;
  }

  _closeUserProfileDialog(e) {
    if (e.detail.confirmed) {
      this.saveData();
    }
  }

  getSeparator(collection, index) {
    if (!collection) {
      return '';
    }
    if (index < collection.length - 1) {
      return '|';
    }
    return '';
  }

  _mapIds(profile) {
    if (profile === undefined) {
      return;
    }
    let availableCountryIds;
    let availableGroups;
    if (!this.profile.countries_available) {
      availableCountryIds = [];
    } else {
      availableCountryIds = this.profile.countries_available.map((x) => x['id']);
    }

    if (!this.profile.groups) {
      availableGroups = [];
    } else {
      availableGroups = this.profile.groups.map((x) => x['id']);
    }

    this.availableCountryIds = availableCountryIds;
    this.availableGroups = availableGroups;
  }

  _emptyArray(arr) {
    return !arr || !arr.length;
  }

  saveData() {
    this.dispatchEvent(
      new CustomEvent('save-profile', {
        detail: {profile: this.profile},
        bubbles: true,
        composed: true
      })
    );
  }
}

window.customElements.define('etools-user-profile-dialog', EtoolsUserProfileDialog);
