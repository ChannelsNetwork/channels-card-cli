# channels-card-cli

## TLDR

To create your own Channels card:

* Install tools:
```text
npm install -g bower polymer-cli channels-card-cli
```
* Create a GitHub repository (lowercase with hyphens such as **`janes-simple-card`**) and clone it locally
* From the root of your new project, scaffold your card:
```text
channels-card init
```
* Edit your components file (such as **`janes-simple-card.html`**)
* Test your component by running a local server:
```text
polymer serve
```
* Then load a test page for your component by opening a browser using the URL returned after 'reusable components', such as **http://127.0.0.1:8000/components/test-component/janes-simple-card/**.
* Iterate until the composer and viewer works and looks as you want it.
* Commit and push to GitHub
* Create a new GitHub release for your project
* Open Channels client, create a channel, and load your card, such as **`JaneDoe/janes-simple-card`**

## Introduction

[Channels](https://channels.cc) is a new marketplace for digital content.  Anyone is free to post content that they will be paid for, or for which they are willing to pay users to read.  Content is bought and sold in "cards".  Each card is based on a card design that is optimized for presenting content of a specific type.

## Concepts

Before you create your own card, you should be sure to understand a few basics.  Channels is deeply dependent on [web components](https://www.webcomponents.org/) which are supported on every major browser.  Web components are like little web pages that fit inside their own custom tag on a web page.  Each Channels "card" is built on top of a project that defines two new web components:  one for composing cards, and one for displaying those cards.  While we call this latter component a "viewer" it can, in fact, be a fully interactive collaborative "applet" shared by all readers.

We choose to implement our own cards using [Polymer](https://www.polymer-project.org/), a technology to simplify and enhance web components.  But Polymer is not mandatory for Channels.  You can implement a new card is pure HTML and Javascript if you prefer.  This introduction, however, will help you create your card using components that are built on top of Polymer.

## Creating your own Card:  Instructions

If you would first like to see an example of a card, visit the [card-hello-world](https://github.com/ChannelsNetwork/card-hello-world) project.  This is a trivial, but fully functional card design.

### Step 1:  Install Dependencies

In order to create your own card here, we start with some tools you will need.  If you don't already have Node installed, do that first:  [install Node](https://nodejs.org/en/download/)

You will also need to have a [GitHub](https://github.com/) account and your favorite git client installed such as [git-scm](https://git-scm.com/downloads).

You can use any text editor and the command line to do all of your card development.  But we prefer to use a IDE such as [Visual Studio Code](https://code.visualstudio.com/).

Now you are ready to install the other dependencies.  (Note that you may need to use `sudo` on some machines.)

```text
npm install -g bower polymer-cli channels-card-cli
```

### Step 2: Create a Repository

Each Channels card is maintained in a separate GitHub repository.

Go to github.com, sign in, and click "New Repository".  In the "Repository name", we recommend a globally unique name that will be the prefix of the web component tags you will create.  Tag names must be globally unique, so choose something distinctive.  You name should be lower-case containing at least one hyphen.  For example, 'sallys-first-card'.

Your repository **must be public** so that all Channels clients will be able to access it when loading your card.

You can leave .gitignore as **None**.  We'll populate that later.  Choose the license you want controlling how others can use your card.  And check the box to **create a README file**.

Click **Create repository** and then copy the URL for your repository and paste it into your git client to clone your repository to your machine.

### Step 3: Scaffold your Card

We provide a command-line tool (installed as **channel-card-cli** above) to help you scaffold your card.

Open a shell and **cd** to the root folder of your local copy of the git repository for your card.

```text
channels-card init
```

This will ask you for a name and description of your card.  The name will typically match the name of your GitHub repository, such as **sallys-first-card**.

You will also be asked for a royalty percentage and your Channels address.  You can omit these if you do not wish to collect a royalty when others use your card.  But if you'd like to get paid, you first set the royalty rate (a percentage of the revenue earned by the publisher using a card based on your card design).  If in doubt, we recommend 5%.  To get paid, you'll need your Channels account address.  You can find that on the Account page when you are signed into Channels.  (Make sure that you create an identity for your Channels account and that you include an email address so that if you ever lose your account, you'll be able to recover it, and not lose any money that you've made.  Without it, we have no way to help you recover your earnings.)

When you are finished this step, the scaffolding will take several seconds to populate your directory with files and folders needed for your card.  Your card is almost ready to use!  Skip the next couple of steps if you want to try the card as it is defined by default.

The most important file in your card project is the one that defines the card components and its name will match your project name, such as `sallys-first-card.html`.  This is where your components are defined using HTML and Javascript.  In addition, there is a `channels-component.json` file that tells the Channels client how to use your card, including the tag names to use for composer and viewer.  The `bower.json` file describes your project, especially its dependencies on other components.  Most of the remaining files and folders are for documentation and to support development.

**Important note:** Your dependencies (libraries, etc.) are declared in `bower.json`.  Channels will take care of ensuring that these dependencies are available in the browser when your components are loaded.  So you do not need to "pack" these dependencies into a single file as you might do in some classical web development.  Your card is loaded like any other dependency of the client and will be hosted in a `bower_components` folder with your dependencies appearing in other folders at the same level as yours.

### Step 4: Adding Dependencies

In the world of web components, it is common to take advantage of other components and Javascript libraries, rather than reinventing the wheel.  There are a huge range of these available.  You can use HTML imports and script tags in your component definitions.  But for each you need to declare those dependencies so that Channels can ensure that they are present at runtime.

For example, suppose that you would like to use Polymer's paper-input web component in your composer.  You will add a bower dependency for it first:

```text
bower install --save PolymerElements/paper-input
```

Then you will add an import directive at the top of your card definition:

```html
<link type="import" href="../paper-input/paper-input.html">
```

Or suppose that you like to use JQuery.  You can add a dependency on that library:

```text
bower install --save jquery
```

And then you will add a script tag inside your component definition.  **Note:** Do not place script tags inside your **template** tag.  Place it just above or below the script tag containing your component code.

```html
<script src="../jquery/dist/jquery.min.js"></script>
```

### Step 5: Customize your Composer

In your component definitions file (such as `sallys-first-card.html`), you will see import directives at the top, followed by two web component definitions contained in `<dom-module>` tags.  The first is for your composer.  The second is for your viewer.  Let's look at your composer first.

The definition contains a `<template>` tag and a `<script>` tag.

The template is the HTML markup determining how the component appears in the webpage.  The script determines how it will behave.  The scaffolding created a composer that just contains a "Send" button (using a Polymer paper-button component to make it look pretty -- you could use a `<button>` tag if you prefer).  You can add any additional markup you want to determine how your composer looks and how it works.

The script has two parts.  There is a `class` definition followed by a call to register that class with the browser as a new component using `window.customElements.define`.  `customElements` is a standard part of the window object in newer browsers.  This tells the browser what to do when it finds a tag in a web page with the name specified here.  You'll see that the scaffolding has named your component based on your project name followed by `-composer`.  That's why it is important that your project name is unique.  Otherwise, it may "collide" with another Channels card created by someone else with the same name.

#### Composer API

To work properly with Channels, your composer component must conform to certain conventions.  The scaffolding initializes your composer so that it should be easy for you to remember.

First, Channels will provide assistance to your composer via two properties that you declare.

**services** is a javascript object containing methods you may need.  Currently, the only method on this object is **upload** which you can use to upload a file to the Channels server.  You pass it a [file object](https://developer.mozilla.org/en-US/docs/Web/API/File) and it returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that will eventually return a URL to that file in the cloud.

**author** is a javascript object containing three properties about the user who is composing the card:  **imageUrl**, **name**, **handle**, and **address**.

Second, your composer must implement certain methods.

**get isReady()** is a property accessor that returns a boolean to indicate whether the composer has received enough information from the user to consider the composing step complete.

**get sharedState()** is a property access that returns an object containing the information that will be passed to the viewer component when the resulting card is being shown to a consumer.  This object must conform to a specific structure.  It must contain a **properties** member which is a map of serializable javascript values (string, boolean, number, object).  It must also contain a **collections** member which is a map of serializable javascript arrays, where each array contains serializable javascript objects.

**get summary()** is a property accessor that returns a javascript object containing three members.  **imageURL** is the URL of an image that the composer suggests should be used at the top of the resulting card when it appears in a feed.  **title** is a string suggested as the title for the card.  And **text** is a string suggested as the subtitle for the card.  All are optional.  The user composing the card will have an opportunity to change any of these.

Third, your composer must fire an event whenever its "ready" state changes.  This is done by invoking code like this:

```javascript
this.dispatchEvent(new CustomEvent('state-ready-change', { bubbles: true, composed: true, detail: { ready: newReadyValue } }));
```

### Step 6:  Customize your Viewer

The second component in your definition is the viewer.  It is another web component definition similar to the composer.  But its job is to display the card that was composed to consumers viewing the card.  For more sophisticated cards, the viewer is really like a full application, since it can allow viewers to interact with the card, and even collaborate with other channel participants through that card.

Polymer enables "data binding" to make it easy to use information stored in a property within your markup so that you don't have to write extra code to manipulate the DOM elements in your markup.  For example, suppose that the composer includes a property called "message".  The viewer can then expect that there is a `sharedData.properties.message` string in its properties.  It could display that message in the viewer with markup that looks like:

```html
<div>[[sharedData.properties.message]]</div>
```

Read more about data binding at [Polymer](https://www.polymer-project.org/2.0/docs/devguide/data-binding).

#### Viewer API

Your viewer component is instantiated each time a consumer opens the card.  The component will be given information using properties.

**sharedState** is a javascript object containing **properties** and **collections** maps that correspond to those that provided when the card was composed.

**author** is a javascript object describing the user who composed this card including **imageUrl**, **name**, **handle**, and **address**.

**user** is a javascript object describing the user who is viewing this card including **imageUrl**, **name**, **handle**, and **address**.  Note that these users may not have registered an identity, and therefore only the **address** member may be populated.

### Step 7:  Test your Card

You are able to test your card in a local test page separate from Channels.  To do this, you use Polymer's tools to serve up your files locally:

```text
polymer serve
```

This will start a new web server on your machine for serving up your files.  It will return two URLs.  Of these you will use the second one called 'reusable components', such as **http://127.0.0.1:8000/components/test-component/sallys-simple-card/**.

Loading this URL in your browser will show you a test page that contains your card -- without running Channels itself.  The page acts as the Channels network.  You will first see your composer.  When you take the action that will send the card, the page will then show three viewers representing three separate conceptual users.

You can now develop your composer and viewer iteratively until they work the way you want them to.  Each time you make a change to your card definition files, just refresh your browser.

### Step 8:  Commit your Changes

Once you are satisfied with your card, save all changes, commit them to your local repository, and push the changes to GitHub.

### Step 9:  Load your Card

Open a Channels client, create a new channel for testing, and at the bottom, click on the button to choose the composer.  Then click on the button to load a new card.  In the dialog enter the owner/repo name (such as **`JaneDoe/janes-simple-card`**) or the URL from GitHub (such as **`https://github.com/JaneDoe/janes-simple-card`**).  They are equivalent.

Your composer should now show up at the bottom of the channel.  Use it and send a card into the channel.  Check out the viewer.  Open a second client and use a share code to view the same channel, so that you can see your viewer and test that it responds correctly to various events.

### Step 10:  Release

When your card works to your satisfaction, go to the GitHub repository and create a release.  For example, you might set the release version to **1.0.0**.  If and when you make changes bump the last digit for bug fixes and the second last digit when there are feature changes.  Avoid changing the first digit in most cases.

<!-- ## Interactive Cards

Since web components can do just about anything, this enables a wide range of possibilities for what can appear in a channel.  It isn't just messages or photos anymore.  Now the cards in the channel could show live data, or be a calculator, or even support collaboration between the participants.

Before we get to collaboration, there is first interactivity.  The composer establishes some data to be presented in cards for each participant.  But that data may be presented in a variety of ways, and the viewer can be interactive.  For example, the data fed from the composer could be numerical, and the viewer might present it in graphical form.  The viewer could allow a participant to zoom, pivot, etc.

But cards get really exciting when they become collaborative.  Imagine, for example, a card that contains a checklist.  The composer initializes the list then sends out the card.  All participants can see that same checklist.  And when anyone makes a change to the list, everyone sees that change.  Suddenly, you have realtime collaboration within the channel between the participants.  Also, since the Channels server maintains a history for the channel, some person who arrives later will still receive this card, along with all changes to it, so that that card will also appear in the new participant's channel.

This works because Channels delivers messages between participants, and each card is able to ask the client to deliver messages that will be received by its counterparts on other cards.  These so-called "card-to-card" messages can contain anything -- JSON-encoded data or even binary data.  It is up to each card implementor to decide if and how it will use this capability.

The library here is designed to simplify cards that, if they do use collaboration, do so using a "shared state" model.  This means that there is no centralized concept of state for the card.  Instead, each card maintains its own copy of the state, and a "mutation" protocol is used to guarantee that all cards will remain in sync.  When a new participant joins (or rejoins), then the card-to-card messages stored by the Channels server can be used to re-synchronize the new card's state.

Most card developers don't need to worry about that.  Instead, they can use the API exposed by the PolymerChannelsCardViewer base class.  This allows state information to be automatically synchronized between cards.  This state information consists of properties (any serializable Javascript variable), arrays (allowing cards to contribute and manipulate shared arrays), and text blocks (allowing collaborative editing of text where mutations are based on "diff").

### Shared Properties

Let's suppose that the composer send the following state information to the channel:

```json
{
  "message": "hello world",
  "count": 0,
  "color": "black"
}
```

The viewer could display this using data binding:

```html
<div>
   <div>{{data.message}}</div>
   <div class$="{{data.color}}">{{data.count}}</div>
</div>
```

The message, color, and count are data-bound to affect the display of the card.  If the composer sends different data, the corresponding card viewer will show different information.

Now, let's make this card interactive:

```html
<div>
   <div on-click="onMessageClick">{{data.message}}</div>
   <div class$="{{data.color}}">{{data.count}}</div>
</div>

...

<script>
  onMessageClick() {
    this.stateController.updateProperty('color', this.data.color === 'red' ? 'blue' : 'red');
    this.stateController.incrementProperty('count', 1);
  }
</script>
```

In the viewer, when any participant clicks on the message in their card, that card will ask its stateController (a member of the base class) to update the color value, and to increment the count value.  The stateController takes care of updating the local data (so that data-binding will cause the local display to be updated) and will send a card-to-card "mutation" message so that other cards will handle that message and update their data accordingly.

What if two participants click on the message in their cards?  For the color property, each one will toggle the current color, and so if there are two clicks anywhere, the count will return to red. But notice how we're using `incrementProperty` for the count property.  If two participants each click on the card, the count will be incremented twice.  And even if they click at the same time, the mutation protocol ensures that both stay in perfect synchronization.

### Shared Arrays

Suppose that you have a card where you want to display a table of things.  That's easy if the table of data was provided by the composer.  The viewer might look like this:

```html
<div>{{data.title}}</div>
<div style="display:table;" items="{{data.items}}">
  <template is="dom-repeat">
    <div style="display:table-row;">
      <div style="display:table-cell;">{{item.date}}</div>
      <div style="display:table-cell;">{{item.by}}</div>
      <div style="display:table-cell;">{{item.message}}</div>
    </div>
  </template>
</div>
```

This uses Polymer's `dom-repeat` template that will create repeating structured based on a data-bound array (stored in data.items sent by the composer).

Now let's make this interactive.  We want any participant to be able to add new rows to the table:

```html
<div>{{data.title}}</div>
<div style="display:table;">
  <template is="dom-repeat" items="{{data.items}}">
    <div style="display:table-row;">
      <div style="display:table-cell;">{{item.date}}</div>
      <div style="display:table-cell;">{{item.by}}</div>
      <div style="display:table-cell;">{{item.message}}</div>
    </div>
  </template>
</div>
<input id="inputText" type="text"> <button on-click="onAddClick">Add</button>

...

<script>
  onAddClick() {
    const item = {
      date: Date.now().toString(),
      by: this.channel.me.details.name,
      message: this.$.inputText.value
    };
    this.stateController.arrayInsert('items', item);
    this.$.inputText.value = '';
  }
</script>
```

We've added a textbox and button.  When the user clicks the button, the `onAddClick` method creates a new item and asks the stateController to insert it into the `items` array in the shared data.  Because the repeating template is data-bound to that array, the local viewer will be updated accordingly, and a message is sent to other cards causing their data to be updated and their views to be updated to match.

The mutation protocol ensures that all array mutations are synchronized.  So even if two or three participants all add records at the same time, the protocol ensures that all tables will resolve to having records in the same order -- even when there are race conditions.  So the card developers doesn't have to worry about cards getting out of sync.

As a side note, you'll notice that the **by** field of the new item is populated using `this.channel.me.details.name`.  This uses the API provided by the channel object that is passed to the viewer card when it is created.  In this case, `this.channel.me` is an object representing the current participant.  So in this example, the participant's name is being added into the **by** field.

## Shared Text

The stateController also handles cases where cards may be sharing blocks of text that are editable by all participants concurrently.  Even this collaborative editing is supported.  The protocol uses a "diff" concept to send mutations based on changes to the text to other cards, and so can merge together changes to the same text by different users at the same time -- as long as those changes are not at the place in the text.  If there are conflicting changes, then the protocol resolves them using "best effort".

To use shared text, one has to be careful with data binding and updates.  When changing a text property, the viewer should call, for example, `this.updateText('mytext', updatedFullText)`.  The stateController will compare `updatedFullText` with the value currently in `this.data.mytext` and will send a mutation based on the difference.  For this reason, it is important that if using a text input control in the UI, it not be data-bound to the same text, or things won't work correctly.

Instead, the textbox can be initialized based on the value in, for example, `this.data.mytext` and then the viewer should implement a method called `updateText(path, newValue, updater)`.  The path, in this example will be 'mytext', and the newValue will be what has been set (either locally or remotely).  If the user is maintaining a cursor/caret while editing, the updater is a function that accepts an offset into the text where the caret is currently, and will return a new offset where it should be moved following this change.  This method on the viewer will be called anytime a change is made to the text -- locally or remotely. -->