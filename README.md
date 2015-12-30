## ViinyDragger is a viiny plugin

#### How to install?
Npm:
```sh
npm install viiny-dragger
```

Bower:
```sh
bower install viiny-dragger
```


### Pull Requests
* [Fork] the project, clone your fork, and configure the remotes:

```sh
# Clone your fork of the repo into the current directory
git clone https://github.com/<your-username>/viiny-dragger.git
# Navigate to the newly cloned directory
cd viiny-dragger
# Assign the original repo to a remote called "upstream"
git remote add upstream https://github.com/giraysam/viiny-dragger.git
```

* If you cloned a while ago, get the latest changes from upstream:

```sh
git checkout master
git pull upstream master
```

* Create a new topic branch (off the main project development branch) to contain your feature, change, or fix:
```sh
git checkout -b <topic-branch-name>
```

* Commit your changes in logical chunks. Please adhere to these [git commit message guidelines] or your code is unlikely be merged into the main project.
Use Git's [interactive rebase] feature to tidy up your commits before making them public.

* Locally merge (or rebase) the upstream master branch into your topic branch:
```sh
git pull [--rebase] upstream master
```

* Push your topic branch up to your fork:

```sh
git push origin <topic-branch-name>
```

* [Open a Pull Request] with a clear title and description against the master branch.

[Fork]: <https://help.github.com/articles/fork-a-repo/>
[git commit message guidelines]: <http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html>
[interactive rebase]: <https://help.github.com/articles/about-git-rebase/>
[Open a Pull Request]: <https://help.github.com/articles/using-pull-requests/>
