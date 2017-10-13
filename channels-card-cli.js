#!/usr/bin/env node

"use strict";

const program = require('commander');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const { execSync } = require('child_process');
const url = require('url');

program.version("0.1.1").parse(process.argv);

const cardName = path.basename(process.cwd());


const questions = [
  {
    type: "input",
    name: "name",
    message: "Card name:",
    default: cardName,
    validate: (input) => {
      return input.length > 1 && /^[a-z]+\-[a-z\-]+[a-z]$/.test(input);
    },
  }, {
    type: "input",
    name: "description",
    message: "Description:",
    default: ''
  }
];

function capitalize(value) {
  let result = '';
  let caps = true;
  for (let i = 0; i < value.length; i++) {
    if (value.charAt(i) === '-') {
      caps = true;
    } else if (caps) {
      result += value.charAt(i).toUpperCase();
      caps = false;
    } else {
      result += value.charAt(i);
      caps = false;
    }
  }
  return result;
}

inquirer.prompt(questions).then((answers) => {
  const cardName = answers.name;
  fs.writeFileSync('polymer.json', JSON.stringify({ "lint": { "rules": ["polymer-2"] } }, null, 2));
  fs.writeFileSync('index.html', "<!doctype html>\n<html>\n  <head>\n    <meta charset='utf- 8'>\n    <meta http-equiv='refresh' content='0;url=demo/' />\n    <title>card-sample-shared-toggle</title>\n  </head>\n  <body>\n    <!--\n        ELEMENT API DOCUMENTATION SUPPORT COMING SOON\n        Visit demo/index.html to see live examples of your element running.\n        This page will automatically redirect you there when run in the browser\n        with `polymer serve`.\n      -->\n  </body>\n</html>\n");
  const channelsComponent = {
    composerTag: cardName + '-composer',
    viewerTag: cardName + '-viewer',
    iconUrl: './icon.png'
  };
  fs.writeFileSync('channels-component.json', JSON.stringify(channelsComponent, null, 2));
  fs.createReadStream(path.join(__dirname, "./placeholder.png")).pipe(fs.createWriteStream('icon.png'));
  const bower = {
    "name": cardName,
    "description": answers[1],
    "main": cardName + ".html",
    "dependencies": {
      "polymer": "Polymer/polymer#^2.0.0",
      "paper-button": "PolymerElements/paper-button#^2.0.0"
    },
    "devDependencies": {
      "iron-demo-helpers": "PolymerElements/iron-demo-helpers#^2.0.0",
      "web-component-tester": "Polymer/web-component-tester#^6.0.0",
      "webcomponentsjs": "webcomponents/webcomponentsjs#^1.0.0",
      "channels-card": "^0.1.0"
    },
    "resolutions": {
      "polymer": "^2.0.0"
    },
    "ignore": [
      "**/.*",
      "node_modules",
      "bower_components",
      "test",
      "demo"
    ]
  };
  fs.writeFileSync('bower.json', JSON.stringify(bower, null, 2));
  fs.writeFileSync('.gitignore', "bower_components\n");
  const demoIndexContent = `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">
    <title>${cardName} demo</title>
    <script src="../../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="../../channels-card/channels-card-demo-helper.html">
    <link rel="import" href="../../iron-demo-helpers/demo-pages-shared-styles.html">
    <link rel="import" href="../${cardName}.html">
    <custom-style>
      <style is="custom-style" include="demo-pages-shared-styles">
      </style>
    </custom-style>
  </head>
  <body>
    <div class="vertical-section-container centered">
      <h3>${cardName} demo</h3>
      <channels-card-demo-helper composer-tag-name="${cardName}-composer" viewer-tag-name="${cardName}-viewer"></channels-card-demo-helper>
    </div>
  </body>

  </html>
`;
  if (!fs.existsSync('demo')) {
    fs.mkdirSync('demo');
  }
  const cardTitle = capitalize(cardName);
  fs.writeFileSync('demo/index.html', demoIndexContent);
  const cardContent = `
<link rel="import" href="../polymer/polymer-element.html">  
<dom-module id="${cardName}-composer">
  <template>
    <style>
    </style>
    <div>
      <!-- Replace this with your composer markup that lets the user who is going to post a card
      populate its contents -->
      <div id="contents" contentEditable placeholder="Enter card contents" on-input="_onContentChanged"></div>
    </div>
  </template>
  <script>
    class ${cardTitle}Composer extends Polymer.Element {
      static get is() { return '${cardName}-composer'; }
      static get properties() {
        return {
          // Following populated by container
          services: Object,             // .upload(file) => Promise<String>
          author: Object,               // .imageUrl, .handle, .name
          // Following populated by this composer and available to container
          stateReady: Boolean,
          recommendedImageUrl: String,
          recommendedTitle: String,
          recommendedText: String,        
          recommendedLinkUrl: String        
        };
      }
      getSharedState() {
        // Replace this with the appropriate code to return the state information that will be passed to the
        // viewer when the card is opened
        return {
          properties: {
            content: this.$.contents.textContent
          },
          collections: {}
        };       
      }
      _onContentChanged() {
        const isReady = this.$.contents.textContent.trim().length > 0;
        this.dispatchEvent(new CustomEvent('shared-state-changed', { bubbles: true, composed: true, detail: { } }));
        if (isReady !== this.ready) {
          this.set('stateReady', isReady);
          this.dispatchEvent(new CustomEvent('state-ready-changed', { bubbles: true, composed: true, detail: { ready: this.ready } }));
        }
      }
    }
    window.customElements.define(${cardTitle}Composer.is, ${cardTitle}Composer);
  </script>
</dom-module>

<dom-module id="${cardName}-viewer">
  <template>
    <div>
      <div>[[sharedState.properties.content]]</div>
    </div>
  </template>
  <script>
    class ${cardTitle}Viewer extends Polymer.Element {
      static get is() { return '${cardName}-viewer'; }
      static get properties() {
        return {
          // Following are populated by the container
          sharedState: Object,    // .properties .collections
          author: Object,         // .handle, .name, .imageUrl
          user: Object            // .handle, .name, .imageUrl
        };
      }
    }
    window.customElements.define(${cardTitle}Viewer.is, ${cardTitle}Viewer);
  </script>
</dom-module>
`
  fs.writeFileSync(cardName + '.html', cardContent);
  const bowerOutput = execSync('bower install');
  console.log("\n\nYour Channels card has been initialized.  Your next step is to edit " + cardName + ".html")
});
