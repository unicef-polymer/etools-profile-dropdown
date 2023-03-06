import {LitElement, html} from 'lit-element';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-dropdown/iron-dropdown.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './user-profile-dialog.js';
import {getTranslation} from './utils/translate.js';

/**
 * `etools-profile-dropdown`
 * User profile dropdown for header toolbar.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class EtoolsProfileDropdown extends LitElement {
  render() {
    // language=HTML
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 60px;
          height: 60px;
        }

        :host([opened]) {
          background: var(--primary-background-color, #ffffff);
        }

        :host([opened]) #profile,
        #accountProfile,
        #powerSettings {
          color: var(--dark-scondary-text-color, rgba(0, 0, 0, 0.54));
        }

        #profile {
          color: var(--header-secondary-text-color, rgba(255, 255, 255, 0.7));
        }

        #user-dropdown {
          z-index: 100;
          background: var(--primary-background-color, #ffffff);
          padding: 8px 0;
          right: 0;
        }

        #user-dropdown .item {
          height: 48px;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.87);
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0;
          padding-inline: 8px 16px;
          cursor: pointer;
          white-space: nowrap;
        }

        #user-dropdown .item:hover {
          background: var(--medium-theme-background-color, #eeeeee);
        }

        .elevation,
        :host(.elevation) {
          display: block;
          position: relative;
        }

        .elevation[elevation='5'],
        :host(.elevation[elevation='5']) {
          box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12),
            0 8px 10px -5px rgba(0, 0, 0, 0.4);
        }
      </style>

      <paper-icon-button
        id="profile"
        icon="social:person"
        role="button"
        @click="${this._toggleMenu}"
      ></paper-icon-button>
      <iron-dropdown
        id="userDropdown"
        horizontal-align="right"
        vertical-align="top"
        vertical-offset="60"
        .opened="${this.opened}"
        @opened-changed="${({detail}) => {
          this.opened = detail.value;
        }}"
      >
        <div id="user-dropdown" class="elevation" elevation="5" slot="dropdown-content">
          <div class="item" @click="${this._openUserProfileDialog}">
            <paper-icon-button id="accountProfile" icon="account-circle"></paper-icon-button>
            ${getTranslation(this.language, 'PROFILE')}
          </div>
          <div class="item" @click="${this._logout}">
            <paper-icon-button id="powerSettings" icon="power-settings-new"></paper-icon-button>
            ${getTranslation(this.language, 'SIGN_OUT')}
          </div>
        </div>
      </iron-dropdown>
    `;
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        reflect: true
      },
      userProfileDialog: Object,
      /**
       *
       * Expected structure of array elements :
       *
       *      el = {
       *        label: 'element label',
       *        value: '234'
       *      }
       * @type (ArrayBuffer|ArrayBufferView)
       */
      sections: {
        type: Array
      },

      /**
       *
       * Expected structure of array elements :
       *
       *      el = {
       *        label: 'element label',
       *        value: '234'
       *      }
       * @type (ArrayBuffer|ArrayBufferView)
       */
      offices: {
        type: Array
      },

      /**
       *
       * Expected structure of array elements :
       *
       *      user = {
       *        label: user.full_name,
       *        value: user.id
       *      }
       * @type (ArrayBuffer|ArrayBufferView)
       */
      users: {
        type: Object
      },

      /**
       *
       *  Profile object should be according to api endpoint
       *  `/users/myprofile/`
       *  and all modifications should be POSTed to the same endpoint
       */
      profile: {
        type: Object
      },

      showEmail: {type: Boolean, attribute: 'show-email', reflect: true},

      hideAvailableWorkspaces: {
        type: Boolean,
        attribute: 'hide-available-workspaces',
        reflect: true
      },

      _loadingProfileMsgActive: Boolean,
      language: {type: String}
    };
  }

  set profile(val) {
    this._profile = val;
    this._dataLoaded(this.profile);
  }

  get profile() {
    return this._profile;
  }

  constructor() {
    super();

    this.opened = false;
    this.readonly = true;
    this.showEmail = false;
    if (!this.language) {
      this.language = 'en';
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.userProfileDialog = document.createElement('etools-user-profile-dialog');
    this.userProfileDialog.addEventListener('save-profile', this._dispatchSaveProfileEvent.bind(this));
    this.userProfileDialog.setAttribute('id', 'userProfileDialog');
    this.userProfileDialog.language = this.language;
    document.querySelector('body').appendChild(this.userProfileDialog);
  }

  _dispatchSaveProfileEvent(ev) {
    this.dispatchEvent(
      new CustomEvent('save-profile', {
        detail: ev.detail,
        bubbles: true,
        composed: true
      })
    );
  }

  _dataLoaded() {
    if (!this.userProfileDialog) {
      // Fixes timing issue
      return;
    }
    // if (this._allHaveValues('users', 'profile', 'offices', 'sections')) {
    if (this._allHaveValues('profile')) {
      this.userProfileDialog.profile = this.profile;
      this.userProfileDialog.language = this.language;
      // this.userProfileDialog.offices = this.offices;
      // this.userProfileDialog.users = this.users;
      // this.userProfileDialog.sections = this.sections;
      if (this._loadingProfileMsgActive) {
        this._loadingProfileMsgActive = false;
        this.dispatchEvent(new CustomEvent('global-loading', {bubbles: true, composed: true}));
      }
    }
  }

  _setDialogProfileData() {
    if (!this.profile) {
      return;
    }
    this.userProfileDialog.profile = JSON.parse(JSON.stringify(this.profile));
    this.userProfileDialog.language = this.language;
    this.userProfileDialog.showEmail = this.showEmail;
    this.userProfileDialog.hideAvailableWorkspaces = this.hideAvailableWorkspaces;
  }

  _allHaveValues(...args) {
    return args.reduce((hasVal, prop) => {
      return !this._isEmpty(this[prop]) && hasVal;
    }, true);
  }

  _isEmpty(value) {
    if (value == null) {
      return true;
    }
    for (var key in value) {
      if (hasOwnProperty.call(value, key)) {
        return false;
      }
    }
    return true;
  }

  _logout() {
    this.dispatchEvent(new CustomEvent('sign-out', {bubbles: true, composed: true}));
    this.opened = false;
  }

  _openUserProfileDialog() {
    this._setDialogProfileData();
    this.userProfileDialog.openUserProfileDialog();
    // if (this._allHaveValues('users', 'profile', 'offices', 'sections')) {
    if (!this._allHaveValues('profile')) {
      this.dispatchEvent(
        new CustomEvent('global-loading', {
          detail: {active: true, message: 'Loading profile...'},
          bubbles: true,
          composed: true
        })
      );
      this._loadingProfileMsgActive = true;
    }
    this.opened = false;
  }

  _toggleMenu() {
    this.opened = !this.opened;
  }

  _isInPath(path, prop, value) {
    path = path || [];
    for (let i = 0; i < path.length; i++) {
      if (path[i][prop] === value) {
        return true;
      }
    }
    return false;
  }
}

window.customElements.define('etools-profile-dropdown', EtoolsProfileDropdown);
