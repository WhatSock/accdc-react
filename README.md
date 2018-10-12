# bootstrap-react
BETA release of AccDC 4X + React for building advanced accessible ARIA widgets within the React IDE

Quick Overview
-----

AccDC 4X is a combination of two APIs that integrate with the React IDE to provide advanced development processes for creating Accessible Rich Internet Applications.

The $A API is the first of these, which is only instantiated once, and all related properties and methods map back to the same object, even when $A objects are chained together. As such, changing one core function or property within $A, also called AccDC, will change how all related features map back into this object. This makes it possible to override key functions so that they map into other libraries and frameworks if desired.

The DC API is the second, and these properties and methods refer to custom objects that are created by AccDC for the purpose of managing complex dynamic behaviors and functionality. None of these exist until they are explicitly created, after which they are completely independent Dynamic Content (DC) objects that can be individually configured and rendered for any purpose.

To understand the background and purpose of this project, please read the GitHub discussion at
https://github.com/WhatSock/accdc/issues/10

React Component Integration
-----

DC objects are designed to integrate with React components, so that dynamic behaviors can be directly applied to React components to create advanced functionality.

When a React component is converted into a DC object, the DC object properties and methods automatically become available within the React component's lifecycle methods using this.props.DC.

Turning a React component into a DC object is simple, which can be accomplished by doing the following.

```
var DC = $A(<ReactComponentObject />).toDC();
```

DC objects can then be chained using DC API methods to perform various dynamic behaviors. These are fully documented within the Help folder.

Future Updates
-----

AccDC 4X is still a work in progress, and includes some experimental features that may be tweaked in the future if bugs are discovered. If you would like to assist with this, please file any issues or recommendations at: https://github.com/whatsock/bootstrap-react

To be notified of future enhancements to this project, including new accessible widget modules and importable accessible components, simply star this project.

Eventually this project will include all of the accessible widgets that are part of the AccDC TSG at https://github.com/whatsock/tsg
however these will be smaller, faster, and represent the forerunners that will eventually replace all of the TSG modules as they presently exist. This will make them more scalable, easier to integrate within variable environments using modern processes, and provide dynamic processing features that don't exist anywhere else.

At present, this archive includes all of the following accessible design pattern widget types: Accordions, Calendar/Date Pickers, Carousels, editable and readonly Comboboxes, dynamic Footnotes, horizontal and vertical Menus, infinitely nestable Modals, overlay Popups, and nestable Tabs.

In the near future, all of the following will be added as well: Grids, Listboxes, Radios, Sliders, Toggles, Tooltips, Trees, and others.

Additionally, experimentation is under way for migrating many of these accessible design patterns into compartmentalized React components that can be imported directly and configured using only their props when rendered, which will be added to this archive in the future as they become available.

Getting Started
-----

If you are unfamiliar with React, none of what this project looks like will make much sense, so please read the following resource before trying to figure it out.
https://reactjs.org/tutorial/tutorial.html
Specifically, make sure you have Node.JS installed.
https://nodejs.org/en/

Next, simply download or clone this project, then do the following to run the code locally.

Within the root folder, you will notice some Batch files. First, double click the bat file InstallDependancies.bat to load the latest versions of the code dependencies that are used by AccDC 4X. You can also CD into the folder within a command prompt and execute this file directly by typing ".\InstallDependancies.bat", which will give you status messages about the installation progress.

Second, just activate the batch file "RunWebServer.bat" by clicking it, or by running the command "npm start" from within the command prompt for the project root directory.

To close the development server, set focus to the NPM window, then press Ctrl+C.


Distributed under the terms of the Open Source Initiative OSI - MIT License.

Developed and maintained by: Bryan Garaventa https://www.linkedin.com/in/bgaraventa
Or on Twitter at https://twitter.com/bryanegaraventa

Includes contributions by:

* Danny Allen (dannya.com) / Wonderscore Ltd (wonderscore.co.uk) https://www.linkedin.com/in/danny-allen-49690451/
* Laurence Lewis: https://www.linkedin.com/in/laurence-lewis-77520365/ 
* All visual design by Angela Ricci (web designer and web front-end developer). You can check her work at her personal site http://gericci.me/ Or you can follow her on Twitter at https://twitter.com/gericci

Related projects:
-----

* WhatSock Organization: https://github.com/whatsock
* Visual ARIA: https://github.com/accdc/visual-aria
