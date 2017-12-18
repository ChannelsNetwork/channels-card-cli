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
  }, {
    type: "input",
    name: "royalty",
    message: "What royalty do you want to charge publishers (as % of card revenue)?",
    default: "5",
    validate: (input) => {
      return /^[0-9]+$/.test(input) && Number(input) >= 0 && Number(input) <= 99;
    }
  }, {
    type: "input",
    name: "address",
    message: "To what account should royalties be paid?  (Use the Account Address on your Channels Account page.)",
    default: "",
    validate: (input) => {
      return input.length === 0 || /^[0-9a-zA-Z]{25,30}\=$/.test(input);
    }
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
  if (answers.address) {
    channelsComponent.developerAddress = answers.address;
    channelsComponent.royalty = (Number(answers.royalty) / 100).toFixed(2);
  }
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
      "channels-card": "^0.1.3"
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
          author: Object                // .imageUrl, .handle, .name
        };
      }   
      
      connectedCallback() {
        super.connectedCallback();
        // initialize your composer here
      }

      get isReady() {
        return true;  // return false until the user has provided minimum acceptable configuration
      }

      // When your "ready" state changes, use the following, where "rs" is your new ready state.
      // It should match what is returned by isReady()
      // this.dispatchEvent(new CustomEvent('state-ready-change', { bubbles: true, composed: true, detail: { ready: rs } }));

      // This will be called after you are ready to provide the default information used
      // to display the card in a feed.
      get summary() {
        // Replace this with something that returns the default imageUrl, title, and text
        // to be used when displaying this card in the feed.  To get an imageUrl, you can
        // use this.services.upload(file).then(...)
        return {
          imageURL: null,  // replace this with a URL to use for the card
          title: null,     // replace this with the default title for this card
          text: null       // replace this with the default subtitle for the card
        };       
      }

      // The information you will provide as "sharedState" to the viewer when a card is opened.
      // This MUST be in the form of an object containing a "properties" map and a 
      // "collections" map, where the collections map contains named arrays.
      get sharedState() {
        let sharedProperties = {
          message: "hello world!",
          property2: {subprop1: 100, subprop2: "abc"}
        };
        let sharedCollections = {};
        sharedCollections.examples = [];
        sharedCollections.examples.push({
          id: '1',
          field1: 'f1',
          field2: {a: 1, b: true, c: "abc"}
        });
        return {
          properties: sharedProperties,
          collections: sharedCollections
        }
      }

      // To make your card searchable, you need to provide text representing all of the content
      // on the card.  The text in your summary is automatically searchable so you don't need to
      // add it here.  Don't worry about formatting (although you should avoid markup tags if any).  
      // This text is used for search indexing only.
      get searchText() {
        return null;
      }
    }
    window.customElements.define(${cardTitle}Composer.is, ${cardTitle}Composer);
  </script>
</dom-module>

<dom-module id="${cardName}-viewer">
  <template>
    <div>
      <div>[[sharedState.properties.message]]</div>
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

      connectedCallback() {
        super.connectedCallback();
        // initialize your viewer here using properties and/or collections
        // in this.sharedState
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
