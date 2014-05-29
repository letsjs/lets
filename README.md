# Lets

Lets is an easy-to-use yet flexible remote task automatisation tool.
Think of it as a JavaScript-clone of [Capistrano][capistrano], with a touch of
[Dandelion][dandelion], and some inspiration from Grunt. The aim of this
project is to make it more convenient for anyone to automate those tasks that
really should be done automatically. Like deployment.


## Current status

Lets is currently under early and heavy development. It's possible it will work.
It's also possible something will get terribly and irreversibly messed up.
*Use at your own discretion*. With that said, I'm thankful for any help
with real-life testing and evaluation I can get.


## Getting started

Short version:

* `npm install lets-cli -g`
* `npm install lets`

Long version:

**Step one: install node**  
First of all, you'll need node.js and npm installed on your local machine (or
the machine where these scripts are going to be initated).
[Go and get it][node] if you don't have it installed already!

**Step two: install the CLI**  
Secondly you'll want to use Lets from the command-line (yes, you do).
Install [lets-cli][lets-cli] globally:

```bash
npm install lets-cli -g
```

**Step three: install Lets in your project**  
Finally you have to install `Lets` itself locally in your project. This is
similar to how Grunt works too, if you've used Grunt.

```bash
npm install lets
```

**Step four: use plugins**  
Now you are ready to go! What's left to do is to configure what tasks to run by
putting a **Letsfile.js** in the root of your project.
I will probably create a collection of Letsfile.js examples and maybe even a
scaffolding-script when i have time. For now you can have a look at the example
for [lets-git-pull][lets-git-pull] to get an idea of how things work.

A plugin is simply a way of speeding up your configuration by collecting a
bunch of tasks in a package. You can find currently available plugins in the
[list of Lets plugins](#plugins) below.


## Usage

*Extensive documentation on methods, options, tasks, events and flows coming
soon.*


## Plugins

Currently there are a handfull official (e.i. maintained by me) plugins. My
hopes are that there will soon be a plugin for any conceivable way of deploying
or executing remote tasks.

### Official plugins:

* [lets-cli][lets-cli] – Command-line interface
* [lets-ssh][lets-ssh] – Plugin for connecting over SSH
* [lets-ftp][lets-ftp] – Plugin for connecting over FTP
* [lets-copy][lets-copy] – Deployment by syncing files over FTP (like Dandelion)
* [lets-git-pull][lets-git-pull] – Deployment by pulling files from a git repo
  (like Capistrano)
* [lets-git-push][lets-git-push] – Deployment by git-pushing files to a server
(e.g. Heroku)

Missing something? Feel free to create a plugin yourself! I'm for example aware
of a lack of support for other vcs's than git.

### Contributed plugins:

None at the moment :( But soon you'll find a list of plugins maintained by
others here.


## Writing a plugin

*Coming soon*


## Contribution

So you wanna help out? Great! I can always do with more hands to help. If you
think something needs to be improved, just create an issue. Do so even if you
intend to fix it yourself to ensure that no one else is already working on it
and that we agree on how it should be done (unless it's the tinyest little
silly fix, like a typo). Fork from the develop-branch, create a feature-branch,
and pull-request back to develop.


## TODO

A LOT. 


[lets-cli]: https://github.com/letsjs/lets-cli
[lets-ssh]: https://github.com/letsjs/lets-ssh
[lets-ftp]: https://github.com/letsjs/lets-ftp
[lets-copy]: https://github.com/letsjs/lets-copy
[lets-git-pull]: https://github.com/letsjs/lets-git-pull
[lets-git-push]: https://github.com/letsjs/lets-git-push
[node]: http://nodejs.org/
[capistrano]: http://capistranorb.com/
[dandelion]: https://github.com/scttnlsn/dandelion
