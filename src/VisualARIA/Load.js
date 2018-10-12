/*!
Visual ARIA Bookmarklet (CSS: 08/06/2018), JS last modified 08/10/2018
Copyright 2018 Bryan Garaventa
https://github.com/accdc/visual-aria
Part of the ARIA Role Conformance Matrices, distributed under the terms of the Open Source Initiative OSI - MIT License
*/
import $A from "../AccDC/Core/API";

export function vARIA() {
  // Visual ARIA

  (function() {
    // Set useOffline=true to disable the dynamic loader,
    // or reference an https:// path to ensure that both secure and non-secure sites can be accessed by Visual ARIA when useOffline=false.
    // When useOffline=true, the roles.css file must be manually added to provide visual feedback within the same document where roles.js is being processed.
    var useOffline = false,
      // Base path for dynamic loading of individual CSS files.
      basePath = "/visual-aria/public/",
      // Set millisecond interval for dynamically loading supporting CSS files and performing the naming calculation for widget roles
      msInterval = 2000;

    // Store global variable as namespace
    window.VisualARIA = {};

    // Visual ARIA

    if (!document.getElementById("ws-bm-aria-matrices-lnk")) {
      var s = document.createElement("span");
      s.className = "WS-BM-Loading-Msg";
      s.innerHTML =
        '<span role="alert" style="position: fixed; z-index:10000; color: white; background-color: black; border: inset thick gray; top: 40%; left: 35%; padding: 20px; font-size: 18pt;">Loading Visual ARIA, please wait.<br /><i>(Hold down Ctrl+Shift then Left-click any role for more details.)</i></span>';
      window.VisualARIA.VisualARIALoadingMsg = s;
      // document.body.appendChild(window.VisualARIA.VisualARIALoadingMsg);
    }

    window.top.VisualARIA.IsVisualARIALoaded = true;

    window.VisualARIA.toggleVisualARIA = function() {
      if (window.VisualARIA.VisualARIALoadingMsg) {
        window.VisualARIA.VisualARIALoadingMsg = null;
      }
      window.top.VisualARIA.IsVisualARIALoaded = window.top.VisualARIA
        .IsVisualARIALoaded
        ? false
        : true;
      window.VisualARIA.VisualARIAToggle.setAttribute(
        "aria-label",
        window.top.VisualARIA.IsVisualARIALoaded
          ? "Unload Visual ARIA"
          : "Load Visual ARIA"
      );
      window.VisualARIA.VisualARIAToggle.innerHTML = window.VisualARIA.getVisualARIAStatus().lng;
    };

    window.VisualARIA.getVisualARIAStatus = function() {
      return {
        lng: window.top.VisualARIA.IsVisualARIALoaded
          ? "Unload Visual ARIA"
          : "Load Visual ARIA",
        shrt: window.top.VisualARIA.IsVisualARIALoaded ? "X" : "O"
      };
    };

    document.WSBMInit = function WSBMInit(
      isTop,
      useOffline,
      basePath,
      msInterval,
      document,
      attrs,
      isNested,
      check,
      loaded
    ) {
      var loader = WSBMInit;
      var calcNames = $A.getAccName;
      var bind = function(obj, type, fn) {
          if (obj.attachEvent) {
            obj["e" + type + fn] = fn;

            obj[type + fn] = function() {
              obj["e" + type + fn](window.event);
            };

            obj.attachEvent("on" + type, obj[type + fn]);
          } else if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
          }

          return obj;
        },
        trim = function(str) {
          if (typeof str !== "string") return "";

          return str.replace(/^\s+|\s+$/g, "");
        },
        activeObj = null,
        activeDObj = null;

      attrs = "aria-disabled,aria-readonly,aria-haspopup,aria-orientation,aria-label,aria-labelledby,aria-describedby,aria-pressed,aria-checked,aria-valuemin,aria-valuemax,aria-valuenow,aria-valuetext,aria-controls,aria-autocomplete,aria-expanded,aria-owns,aria-activedescendant,aria-posinset,aria-setsize,aria-level,role,alt".split(
        ","
      );
      isNested = function(start, role) {
        while (start) {
          start = start.parentNode;

          if (start.getAttribute("role") == role) return "true";
        }

        return "false";
      };

      check = function(
        nodes,
        obj,
        frames,
        focused,
        pNode,
        focusHidden,
        isSelfRef,
        isDefTerm
      ) {
        if (!window.top.VisualARIA.IsVisualARIALoaded) {
          if (loader.cssLinks && loader.cssLinks.length) {
            for (var i = 0; i < loader.cssLinks.length; i++) {
              loader.cssLinks[i].parentNode.removeChild(loader.cssLinks[i]);
            }
            loader.cssLinks = [];
            loaded = {
              init: false,
              landmarks: false,
              structural: false,
              dialogs: false,
              liveRegions: false,
              simpleWidgets: false,
              comboboxListbox: false,
              menuMenubar: false,
              radiogroup: false,
              tablist: false,
              tree: false,
              treegridGridTable: false
            };
          }
        } else {
          if (loaded && loaded.init) {
            if (
              !loaded.comboboxListbox &&
              !document.getElementById("ws-visual-aria-7") &&
              document.querySelectorAll(
                '*[role="combobox"], *[role="listbox"], *[role="option"]'
              ).length
            ) {
              loaded.comboboxListbox = true;
              loadCSS("7combobox-listbox.css", "7");
            }

            if (
              !loaded.menuMenubar &&
              !document.getElementById("ws-visual-aria-8") &&
              document.querySelectorAll(
                '*[role="menu"], *[role="menubar"], *[role="menuitem"], *[role="menuitemradio"], *[role="menuitemcheckbox"]'
              ).length
            ) {
              loaded.menuMenubar = true;
              loadCSS("8menu-menubar.css", "8");
            }

            if (
              !loaded.radiogroup &&
              !document.getElementById("ws-visual-aria-9") &&
              document.querySelectorAll('*[role="radiogroup"], *[role="radio"]')
                .length
            ) {
              loaded.radiogroup = true;
              loadCSS("9radiogroup.css", "9");
            }

            if (
              !loaded.tablist &&
              !document.getElementById("ws-visual-aria-10") &&
              document.querySelectorAll(
                '*[role="tablist"], *[role="tab"], *[role="tabpanel"]'
              ).length
            ) {
              loaded.tablist = true;
              loadCSS("10tablist.css", "10");
            }

            if (
              !loaded.tree &&
              !document.getElementById("ws-visual-aria-11") &&
              document.querySelectorAll('*[role="tree"], *[role="treeitem"]')
                .length
            ) {
              loaded.tree = true;
              loadCSS("11tree.css", "11");
            }

            if (
              !loaded.treegridGridTable &&
              !document.getElementById("ws-visual-aria-12") &&
              document.querySelectorAll(
                '*[role="treegrid"], *[role="grid"], *[role="table"], *[role="rowgroup"], *[role="row"], *[role="columnheader"], *[role="rowheader"], *[role="gridcell"], *[role="cell"]'
              ).length
            ) {
              loaded.treegridGridTable = true;
              loadCSS("12treegrid-grid-table.css", "12");
            }
          }

          if (loaded && !loaded.init) {
            loaded.init = true;
            loadCSS("1roles.css", "1");
            loaded.landmarks = true;
            loadCSS("2landmarks.css", "2");
            loaded.structural = true;
            loadCSS("3structural.css", "3");
            loaded.dialogs = true;
            loadCSS("4dialogs.css", "4");
            loaded.liveRegions = true;
            loadCSS("5live-regions.css", "5");
            loaded.simpleWidgets = true;
            loadCSS("6simple-widgets.css", "6");
          }

          // BG:12/18/2017: Added the AREA and HR elements to check for improper usage of aria-owns as well.
          nodes = document.querySelectorAll(
            "input[aria-owns], img[aria-owns], area[aria-owns], hr[aria-owns]"
          );

          for (var i = 0; i < nodes.length; i++) {
            nodes[i].setAttribute("data-ws-bm-aria-owns-invalid", "true");
            nodes[i].parentNode.setAttribute(
              "data-ws-bm-aria-owns-invalid",
              nodes[i].nodeName.toUpperCase()
            );
          }

          nodes = document.querySelectorAll("input, *[role], img, progress");

          obj = {};

          isSelfRef = function(node, role, ids) {
            if (
              !node ||
              node.nodeType !== 1 ||
              !trim(role) ||
              !trim(ids) ||
              " application banner complementary contentinfo form main navigation region search article directory document list note table toolbar feed log status combobox grid listbox menu menubar radiogroup tablist tabpanel tree group treegrid ".indexOf(
                " " + role + " "
              ) === -1
            )
              return false;

            var isF = false,
              a = ids.split(" ");

            for (var i = 0; i < a.length; i++) {
              if (document.getElementById(a[i]) == node) isF = true;
            }

            if (isF) node.setAttribute("data-ws-bm-self-ref", "true");
            return isF;
          };

          isDefTerm = function(ids) {
            var isT = true,
              a = ids.split(" ");

            for (var i = 0; i < a.length; i++) {
              var o = document.getElementById(a[i]);

              if (o && o.nodeType === 1 && o.getAttribute("role") != "term") {
                o.setAttribute("data-ws-bm-dtr-missing", "true");
                isT = false;
              }
            }
            return isT;
          };

          for (var i = 0; i < nodes.length; i++) {
            for (var j = 0; j < attrs.length; j++)
              obj[attrs[j]] = nodes[i].getAttribute(attrs[j]) || null;
            obj["node-name"] = nodes[i].nodeName.toLowerCase();
            obj.tabindex = nodes[i].getAttribute("tabindex");
            obj["input-type"] =
              obj["node-name"] == "input"
                ? nodes[i].getAttribute("type")
                : null;

            if (obj.role == "radio")
              obj["role-nested"] = isNested(nodes[i], "radiogroup");
            else if (obj.role == "tab")
              obj["role-nested"] = isNested(nodes[i], "tablist");
            else if (obj.role == "treeitem")
              obj["role-nested"] = isNested(nodes[i], "tree");

            isSelfRef(nodes[i], obj.role, obj["aria-labelledby"]);

            if (obj.role == "definition" && obj["aria-labelledby"])
              isDefTerm(obj["aria-labelledby"]);

            if (
              " input img progress ".indexOf(" " + obj["node-name"] + " ") !==
              -1
            ) {
              if (pNode != nodes[i].parentNode) {
                pNode = nodes[i].parentNode;

                for (var a in obj) {
                  if (obj[a] || !isNaN(parseInt(obj[a])))
                    pNode.setAttribute("data-ws-bm-" + a, obj[a]);
                  else pNode.removeAttribute("data-ws-bm-" + a);
                }
              }
            }
          }

          focused = document.querySelectorAll("*[aria-describedby]:focus");

          if (focused.length) {
            var dbs = focused[0].getAttribute("aria-describedby").split(" ");

            for (var d = 0; d < dbs.length; d++) {
              var t = document.getElementById(dbs[d]);

              if (t && t.nodeType === 1)
                t.setAttribute("data-ws-bm-db-match", dbs[d]);
            }
          }

          focused = document.querySelectorAll("*[aria-activedescendant]:focus");
          var fO = null;

          if (focused.length)
            fO = document.getElementById(
              focused[0].getAttribute("aria-activedescendant")
            );

          if (
            (!focused.length ||
              !fO ||
              focused[0] != activeObj ||
              fO != activeDObj) &&
            (activeDObj &&
              activeDObj.nodeType === 1 &&
              activeDObj.getAttribute("data-ws-bm-ad-match"))
          ) {
            activeDObj.removeAttribute("data-ws-bm-ad-match");
            activeDObj.removeAttribute("data-ws-bm-ad-invalid");
            activeDObj = null;
          }

          if (fO && fO.nodeType === 1) {
            activeObj = focused[0];
            activeDObj = fO;
            var nn = fO.nodeName.toLowerCase(),
              href = fO.getAttribute("href"),
              rl = fO.getAttribute("role");

            if (!rl && nn == "a" && href) rl = "link";
            else if (!rl && nn == "button") rl = "button";
            fO.setAttribute("data-ws-bm-ad-match", rl);

            if (!rl) fO.setAttribute("data-ws-bm-ad-invalid", "true");
          }

          focusHidden = document.querySelectorAll('*[hidefocus="true"]');

          for (var h = 0; h < focusHidden.length; h++)
            focusHidden[h].removeAttribute("hidefocus");

          frames = document.querySelectorAll("frame, iframe");

          for (var f = 0; f < frames.length; f++) {
            try {
              if (
                frames[f].contentDocument &&
                frames[f].contentDocument.head &&
                !frames[f].contentDocument.WSBMInit
              ) {
                frames[f].contentDocument.WSBMInit = WSBMInit;
                frames[f].contentDocument.WSBMInit(
                  false,
                  useOffline,
                  basePath,
                  msInterval,
                  frames[f].contentDocument
                );
              }
            } catch (e) {}
          }

          var presentational = document.querySelectorAll(
            '*[role="presentation"], *[role="none"]'
          );

          for (var p = 0; p < presentational.length; p++) {
            var pO = presentational[p],
              oR = pO.getAttribute("role"),
              oN = pO.nodeName.toUpperCase(),
              aN =
                oR == "none"
                  ? "data-ws-role-none"
                  : "data-ws-role-presentation";

            if (
              " input textarea img progress ".indexOf(
                " " + oN.toLowerCase() + " "
              ) !== -1
            )
              pO.parentNode.setAttribute(aN, oN);
            else pO.setAttribute(aN, oN);
          }
        }

        setTimeout(check, msInterval);
      };

      var checkNames = function() {
        var accNames = document.querySelectorAll(
          'textarea, input, select, button, a[href], progress, *[role="button"], *[role="checkbox"], *[role="link"], *[role="searchbox"], *[role="scrollbar"], *[role="slider"], *[role="spinbutton"], *[role="switch"], *[role="textbox"], *[role="combobox"], *[role="option"], *[role="menuitem"], *[role="menuitemcheckbox"], *[role="menuitemradio"], *[role="radio"], *[role="tab"], *[role="treeitem"], h1, h2, h3, h4, h5, h6, *[role="heading"], ul[aria-labelledby], ol[aria-labelledby], *[role="list"][aria-labelledby], *[role="directory"][aria-labelledby], ul[aria-label], ol[aria-label], *[role="list"][aria-label], *[role="directory"][aria-label], table[aria-labelledby], *[role="table"][aria-labelledby], *[role="grid"][aria-labelledby], *[role="treegrid"][aria-labelledby], table[aria-label], *[role="table"][aria-label], *[role="grid"][aria-label], *[role="treegrid"][aria-label], *[role="row"][aria-labelledby], *[role="row"][aria-label], *[role="cell"], *[role="gridcell"], th, *[role="columnheader"], *[role="rowheader"], *[role="alertdialog"][aria-labelledby], dialog[aria-labelledby], *[role="dialog"][aria-labelledby], *[role="alertdialog"][aria-label], dialog[aria-label], *[role="dialog"][aria-label], header[aria-labelledby], *[role="banner"][aria-labelledby], aside[aria-labelledby], *[role="complementary"][aria-labelledby], footer[aria-labelledby], *[role="contentinfo"][aria-labelledby], header[aria-label], *[role="banner"][aria-label], aside[aria-label], *[role="complementary"][aria-label], footer[aria-label], *[role="contentinfo"][aria-label], form[aria-labelledby], *[role="form"][aria-labelledby], form[aria-label], *[role="form"][aria-label], main[aria-labelledby], *[role="main"][aria-labelledby], nav[aria-labelledby], *[role="navigation"][aria-labelledby], main[aria-label], *[role="main"][aria-label], nav[aria-label], *[role="navigation"][aria-label], section[aria-labelledby], section[aria-label], *[role="region"][aria-labelledby], *[role="search"][aria-labelledby], *[role="article"][aria-labelledby], *[role="definition"][aria-labelledby], *[role="document"][aria-labelledby], *[role="feed"][aria-labelledby], *[role="figure"][aria-labelledby], *[role="img"][aria-labelledby], *[role="math"][aria-labelledby], *[role="note"][aria-labelledby], *[role="application"][aria-labelledby], *[role="region"][aria-label], *[role="search"][aria-label], *[role="article"][aria-label], *[role="definition"][aria-label], *[role="document"][aria-label], *[role="feed"][aria-label], *[role="figure"][aria-label], *[role="img"][aria-label], *[role="math"][aria-label], *[role="note"][aria-label], *[role="application"][aria-label], *[role="log"][aria-labelledby], *[role="marquee"][aria-labelledby], *[role="status"][aria-labelledby], *[role="timer"][aria-labelledby], *[role="log"][aria-label], *[role="marquee"][aria-label], *[role="status"][aria-label], *[role="timer"][aria-label], *[role="toolbar"][aria-labelledby], *[role="group"][aria-labelledby], *[role="listbox"][aria-labelledby], *[role="menu"][aria-labelledby], *[role="menubar"][aria-labelledby], *[role="toolbar"][aria-label], *[role="group"][aria-label], *[role="listbox"][aria-label], *[role="menu"][aria-label], *[role="menubar"][aria-label], *[role="radiogroup"][aria-labelledby], *[role="tree"][aria-labelledby], *[role="tablist"][aria-labelledby], *[role="tabpanel"][aria-labelledby], *[role="radiogroup"][aria-label], *[role="tree"][aria-label], *[role="tablist"][aria-label], *[role="tabpanel"][aria-label]'
        );

        for (var aN = 0; aN < accNames.length; aN++) {
          calcNames(
            accNames[aN],
            function(node, props) {
              if (
                " input textarea img progress ".indexOf(
                  " " + node.nodeName.toLowerCase() + " "
                ) !== -1
              ) {
                node.parentNode.setAttribute(
                  "data-ws-bm-name-prop",
                  props.name
                );

                node.parentNode.setAttribute(
                  "data-ws-bm-desc-prop",
                  props.desc
                );
              } else {
                node.setAttribute("data-ws-bm-name-prop", props.name);

                node.setAttribute("data-ws-bm-desc-prop", props.desc);
              }
            },
            true
          );
        }

        setTimeout(checkNames, 5000);
      };

      setTimeout(checkNames, 5000);

      if (!useOffline) {
        loaded = {
          init: false,
          landmarks: false,
          structural: false,
          dialogs: false,
          liveRegions: false,
          simpleWidgets: false,
          comboboxListbox: false,
          menuMenubar: false,
          radiogroup: false,
          tablist: false,
          tree: false,
          treegridGridTable: false
        };

        var load = (function() {
          function _load() {
            return function(url, id) {
              return new Promise(function(resolve, reject) {
                var t = document.createElement("link");
                t.type = "text/css";
                t.rel = "stylesheet";
                t.id = id;
                t.onload = function() {
                  resolve(url);
                };
                t.onerror = function() {
                  // reject(url);
                };
                t.href = url;
                loader.cssLinks.push(t);
                document.head.appendChild(t);
              });
            };
          }
          return {
            css: _load()
          };
        })();

        var loadCSS = function(file, i) {
          if (!loader.cssLinks) loader.cssLinks = [];
          /*
        var l = document.createElement("link");
        l.type = "text/css";
        l.rel = "stylesheet";
        l.href = basePath + file;
        l.id = "ws-visual-aria-" + i;
        loader.cssLinks.push(l);
        document.head.appendChild(l);
*/
          Promise.all([load.css(basePath + file, "ws-visual-aria-" + i)]);
        };
      }

      check();

      bind(document.body, "mousedown", function(ev) {
        if (ev.shiftKey && ev.ctrlKey) {
          var targ = null;

          if (!ev) ev = window.event;

          if (ev.target) targ = ev.target;
          else if (ev.srcElement) targ = ev.srcElement;

          if (targ.nodeType == 3) targ = targ.parentNode;
          var getClosestRole = function(o) {
            while (o) {
              var r = o.getAttribute("role");

              if (
                r &&
                " rowgroup row columnheader rowheader menuitem menuitemcheckbox menuitemradio group ".indexOf(
                  " " + r + " "
                ) === -1
              ) {
                if (r == "option") r = "listbox";
                else if (r == "radio") r = "radiogroup";
                else if (r == "tab" || r == "tabpanel") r = "tablist";
                else if (r == "treeitem") r = "tree";
                return r;
              }
              o = o.parentNode;
            }
            return null;
          };
          var role = getClosestRole(targ),
            rmo = window.VisualARIAMatrices;

          if (role && rmo.nodeType === 1)
            rmo.href = "http://whatsock.com/training/matrices/#" + role;

          if (rmo.nodeType === 1) rmo.click();
        }
      });
    };

    setTimeout(function() {
      document.WSBMInit(true, useOffline, basePath, msInterval, document);
    }, 3000);

    if (!document.getElementById("ws-bm-aria-matrices-lnk")) {
      var m = document.createElement("span");
      m.innerHTML =
        '<span id="ws-bm-aria-matrices-lnk" style="text-align: center; position: fixed; top: 0; right: 0;padding: 3px; border: 1px solid #dedede; background: #f5f5f5; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#f9f9f9\', endColorstr=\'#f0f0f0\'); background: -webkit-gradient(linear, left top, left bottom, from(#f9f9f9), to(#f0f0f0)); background: -moz-linear-gradient(top,  #f9f9f9, #f0f0f0); border-color: #000; -webkit-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; -moz-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb;" onmouseenter="window.VisualARIA.VisualARIAMatrices.innerHTML=\'ARIA Role Matrices\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().lng;" onmouseleave="window.VisualARIA.VisualARIAMatrices.innerHTML=\'?\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().shrt;"><a id="ws-bm-aria-matrices-lnk-a" style="display: inline-block; text-decoration: none; font-size: 10pt; padding: 6px 9px; border: 1px solid #dedede; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; background: #525252; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#5e5e5e\', endColorstr=\'#434343\'); background: -webkit-gradient(linear, left top, left bottom, from(#5e5e5e), to(#434343)); background: -moz-linear-gradient(top,  #5e5e5e, #434343); border-color: #4c4c4c #313131 #1f1f1f; color: #fff; text-shadow: 0 1px 0 #2e2e2e; -webkit-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; -moz-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686;" target="ws_aria_role_matrices" onmouseover="this.href=\'http://whatsock.com/training/matrices/\';" onclick="this.href=\'http://whatsock.com/training/matrices/\';" onfocus="window.VisualARIA.VisualARIAMatrices.innerHTML=\'ARIA Role Matrices\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().lng;" onblur="window.VisualARIA.VisualARIAMatrices.innerHTML=\'?\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().shrt;" href="http://whatsock.com/training/matrices/" aria-label="ARIA Role Matrices">?</a><br /><a id="ws-bm-aria-matrices-toggle-a" style="display: inline-block; text-decoration: none; font-size: 10pt; padding: 6px 9px; border: 1px solid #dedede; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; background: #525252; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#5e5e5e\', endColorstr=\'#434343\'); background: -webkit-gradient(linear, left top, left bottom, from(#5e5e5e), to(#434343)); background: -moz-linear-gradient(top,  #5e5e5e, #434343); border-color: #4c4c4c #313131 #1f1f1f; color: #fff; text-shadow: 0 1px 0 #2e2e2e; -webkit-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; -moz-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686;" onclick="window.VisualARIA.toggleVisualARIA(); return false;" onfocus="window.VisualARIA.VisualARIAMatrices.innerHTML=\'ARIA Role Matrices\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().lng;" onblur="window.VisualARIA.VisualARIAMatrices.innerHTML=\'?\'; window.VisualARIA.VisualARIAToggle.innerHTML=window.VisualARIA.getVisualARIAStatus().shrt;" href="#" aria-label="Unload Visual ARIA">X</a> </span>';
      document.body.appendChild(m);
      window.VisualARIA.VisualARIAMatrices = document.getElementById(
        "ws-bm-aria-matrices-lnk-a"
      );
      window.VisualARIA.VisualARIAToggle = document.getElementById(
        "ws-bm-aria-matrices-toggle-a"
      );
      window.VisualARIA.toggleVisualARIA();
    }
  })();
}

export default vARIA();
