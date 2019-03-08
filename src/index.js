import React from "react";

// Initialize window.AccDC for use within the global React project
import $A from "./AccDC/Core/API";
import "./VisualARIA/Load";

import "./css/global.css";
import MainTabList from "./components/MainTabList";

import IntroContent from "./components/Intro/IntroMain";

$A("#AccDCCurrentVerS1").insert(window.AccDC._version);
$A("#currentYear").insert(new Date().getFullYear());

$A("#BootstrapHomeTabList").mount(<MainTabList />);
$A("#pgContent").mount(<IntroContent />);

$A("#skipLink").on("click", function(ev) {
  $A('ul[role="tablist"].contextual-menu').focus();
  ev.preventDefault();
});

$A(".topLink a").on("click", function(ev) {
  $A("h1").focus();
  ev.preventDefault();
});
