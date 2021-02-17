import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-dropdown/iron-dropdown.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import './user-profile-dialog.js';
import isEmpty from 'lodash-es/isEmpty';
import toArray from 'lodash-es/toArray';

/**
 * `etools-profile-dropdown`
 * User profile dropdown for header toolbar.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class EtoolsProfileDropdown extends PolymerElement {
  static get template() {
    // language=HTML
    return html`
      <style include="paper-material-styles">
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
          background: var(--primary-background-color, #FFFFFF);
        }

        :host([opened]) #profile,
        #accountProfile, #powerSettings {
          color: var(--dark-scondary-text-color, rgba(0, 0, 0, 0.54));
        }

        #profile {
          color: var(--header-secondary-text-color, rgba(255, 255, 255, 0.7));
        }

        #user-dropdown {
          z-index: 100;
          background: var(--primary-background-color, #FFFFFF);
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
          padding: 0 16px 0 8px;
          cursor: pointer;
          white-space: nowrap;
        }

        #user-dropdown .item:hover {
          background: var(--medium-theme-background-color, #EEEEEE);
        }
      </style>

      <paper-icon-button id="profile" icon="social:person" role="button"
                         on-click="_toggleMenu"></paper-icon-button>
      <iron-dropdown id="userDropdown" horizontal-align="right" vertical-align="top" vertical-offset="60"
                     opened="{{opened}}">
        <div id="user-dropdown" class="paper-material" elevation="5" slot="dropdown-content">
          <div class="item" on-click="_openUserProfileDialog">
            <paper-icon-button id="accountProfile" icon="account-circle"></paper-icon-button>
            Profile
          </div>
          <div class="item" on-click="_logout">
            <paper-icon-button id="powerSettings" icon="power-settings-new"></paper-icon-button>
            Sign out
          </div>
        </div>
      </iron-dropdown>
    `;
  }

  static get is() {
    return 'etools-profile-dropdown';
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
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
        type: Array,
        notify: true
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
        type: Array,
        notify: true
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
        type: Object,
        notify: true
      },

      /**
       *
       *  Profile object should be according to api endpoint
       *  `/users/myprofile/`
       *  and all modifications should be POSTed to the same endpoint
       */
      profile: {
        type: Object,
        notify: true
      },

      showEmail: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },

      _loadingProfileMsgActive: Boolean
    };
  }

  static get observers() {
    return [
      // '_dataLoaded(sections, offices, users, profile)'
      '_dataLoaded(profile)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.userProfileDialog = document.createElement('etools-user-profile-dialog');
    this.userProfileDialog.addEventListener('save-profile', this._dispatchSaveProfileEvent.bind(this));
    this.userProfileDialog.setAttribute('id', 'userProfileDialog');
    document.querySelector('body').appendChild(this.userProfileDialog);
  }

  _dispatchSaveProfileEvent(ev) {
    this.dispatchEvent(new CustomEvent('save-profile', {
      detail: ev.detail,
      bubbles: true,
      composed: true
    }));
  }

  _dataLoaded() {
    if (!this.userProfileDialog) {//Fixes timing issue
      return;
    }
    // if (this._allHaveValues('users', 'profile', 'offices', 'sections')) {
    if (this._allHaveValues('profile')) {
      this.userProfileDialog.profile = this.profile;
      // this.userProfileDialog.offices = this.offices;
      // this.userProfileDialog.users = this.users;
      // this.userProfileDialog.sections = this.sections;
      if (this._loadingProfileMsgActive) {
        this.set('_loadingProfileMsgActive', false);
        this.dispatchEvent(new CustomEvent('global-loading', {bubbles: true, composed: true}));
      }
    }
  }

  _setDialogProfileData() {
    if (!this.profile) {
      return;
    }
    this.userProfileDialog.profile = JSON.parse(JSON.stringify(this.profile));
    this.userProfileDialog.showEmail = this.showEmail;
  }

  _allHaveValues() {
    let args = toArray(arguments);
    return args.reduce((hasVal, prop) => {
      return !isEmpty(this[prop]) && hasVal;
    }, true);
  }

  _logout() {
    this.dispatchEvent(new CustomEvent('sign-out', {bubbles: true, composed: true}));
    this.set('opened', false);
  }

  _openUserProfileDialog() {
    this._setDialogProfileData();
    this.userProfileDialog.openUserProfileDialog();
    // if (this._allHaveValues('users', 'profile', 'offices', 'sections')) {
    if (!this._allHaveValues('profile')) {
      this.dispatchEvent(new CustomEvent('global-loading', {
        detail: {active: true, message: 'Loading profile...'},
        bubbles: true,
        composed: true
      }));
      this.set('_loadingProfileMsgActive', true);
    }
    this.set('opened', false);
  }

  _toggleMenu() {
    this.set('opened', !this.opened);
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

window.customElements.define(EtoolsProfileDropdown.is, EtoolsProfileDropdown);
