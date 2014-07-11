chBackbone
===================

**What is it?**

The chBackbone Project is a powerful dashboard called ForSight Explorer that is based on the Crimson Hexagon API.  It uses data recieved from the API to analyze and display monitor and post details.  

**Requirements**

  - NodeJS

**Installation**


    git clone git@github.com:Cezary23/chbackbone.git
    cd chbackbone
    npm install

**Configuration**

In order to use ForSight Explorer, you must have access to the Crimson Hexagon API.  

  1.)  Rename config.js.example -> config.js
  2.)  Change `user` and `pass` values
  3.)  Optional:  Change the start and end parameters
  4.)  Save!

**Usage**

Open up a (non-cygwin) terminal and navigate to your chbackbone directory.  Then type:

    node bin/www

You can minimize the terminal, or keep it open to look at the useful output.  Chbackbone will now be available at http://localhost:3002.

