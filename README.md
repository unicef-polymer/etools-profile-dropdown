# \<etools-profile-dropdown\>

## Install

`$ npm i --save @unicef-polymer/etools-profile-dropdown`

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Description

User profile dropdown for header toolbar.
Custom element for etools apps.

Labels can be localized by setting the `translations` property.
It has the following format:

```
{
  availableWorkspaces,
  email,
  name,
  okBtnText,
  myProfile,
  profile,
  signOut,
  myGroups
}
```

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

## Styling

| Custom property/part                                              | Description                       | Default |
| ----------------------------------------------------------------- | --------------------------------- | ------- |
| `etools-profile-dropdown::part(epd-user-profile-dropdown-conten)` | profile content shadow part       | `{}`    |
| `--epd-profile-dialog-border-b`                                   | user-profile-dialog border-bottom | `none`  |

## Circle CI

Package will be automatically published after tag push (`git tag 1.2.3` , `git push --tags`). Tag name must correspond to SemVer (Semantic Versioning) rules.  
Examples:

| Version match      | Result   |
| ------------------ | -------- |
| `1.2.3`            | match    |
| `1.2.3-pre`        | match    |
| `1.2.3+build`      | match    |
| `1.2.3-pre+build`  | match    |
| `v1.2.3-pre+build` | match    |
| `1.2`              | no match |

You can see more details [here](https://rgxdb.com/r/40OZ1HN5)
