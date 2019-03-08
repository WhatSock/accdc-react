/*!
Accessible Tabs Module 2.0 - Minimum requirement: AccDC4X V. 4.2018.0
Copyright 2010-2018 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

import $A from "../Core/API";

export function loadAccTabsModule() {
  if (!("setTabs" in $A))
    $A.extend({
      setTabs: function(tabs, overrides, tabList, callback) {
        var ariaOrientation = $A.getAttr(tabList, "aria-orientation"),
          RTI = null,
          autoStartId = false,
          wheel = [],
          imgLoader = null,
          imgTracker = {},
          overrides = overrides || {},
          tabList = tabList || document,
          updateDisabled = function(nodes) {
            $A.loop(
              nodes,
              function(i, o) {
                $A.data(
                  o,
                  "disabled",
                  $A.getAttr(o, "aria-disabled") === "true"
                );
              },
              "array"
            );
          };
        overrides.overrides = overrides.overrides || {};

        if (typeof tabs === "string") tabs = $A.query(tabs, tabList);

        $A.loop(
          tabs,
          function(i, o) {
            $A.setAttr(o, {
              "aria-posinset": i + 1,
              "aria-setsize": tabs.length,
              "aria-expanded": "false",
              "aria-selected": "false"
            });

            var ovrs = {
              id: o.id,
              role: "Tab",
              autoStart: $A.getAttr(o, "data-defaultopen") === "true",
              trigger: o,
              root: "#" + $A.getAttr(o, "data-insert"),
              exposeBounds: false,
              exposeHiddenClose: false,
              on: "activatetab",
              isTab: true,
              isToggle: false,
              allowMultiple: false,
              allowCascade: true,
              widgetType: "AccDCTabs",
              runDuring: function(dc) {
                $A.setAttr(dc.outerNode, {
                  role: "tabpanel",
                  tabindex: overrides.disableTabPanelFocus ? -1 : "0",
                  "aria-describedby": dc.containerId
                });
                $A.setAttr(dc.container, {
                  role: "region",
                  "aria-labelledby": $A.getAttr(dc.triggerObj, "id")
                });
              },
              runAfter: function(dc) {
                $A.setAttr(dc.triggerObj, "aria-controls", dc.outerNodeId);
                $A.loop(
                  tabs,
                  function(j, tab) {
                    $A.setAttr(tab, {
                      "aria-selected": tab === dc.triggerObj ? "true" : "false",
                      "aria-expanded": tab === dc.triggerObj ? "true" : "false"
                    });
                  },
                  "array"
                );

                if (callback && typeof callback === "function")
                  callback.apply(dc.triggerObj, [dc, dc.loaded]);

                if (dc.scrollIntoView) {
                  var contentY = dc.container.offsetTop;
                  window.scroll({
                    top: contentY,
                    behavior: "smooth"
                  });
                }
              },
              runAfterClose: function(dc) {
                $A.setAttr(dc.triggerObj, {
                  "aria-selected": "false",
                  "aria-expanded": "false",
                  "aria-controls": null
                });
                if (callback && typeof callback === "function")
                  callback.apply(dc.triggerObj, [dc, dc.loaded]);
              },
              click: function(ev, dc) {},
              tabs: tabs
            };

            if (ovrs.autoStart) autoStartId = i;
            var controls = $A.getAttr(o, "data-controls");

            if (
              controls &&
              overrides.tabPanels &&
              overrides.tabPanels[controls]
            ) {
              ovrs.React = {
                name: controls,
                component: overrides.tabPanels[controls],
                parent: overrides.ReactParent
              };
              ovrs.mode = 0;
            }

            $A.extend(ovrs, overrides);
            wheel.push(ovrs);
          },
          "array"
        );

        if (tabs.length) {
          updateDisabled(tabs);

          var orientation = 0;
          if (ariaOrientation === "horizontal") orientation = 1;
          else if (ariaOrientation === "vertical") orientation = 2;

          RTI = new $A.RovingTabIndex({
            container: tabList,
            nodes: tabs,
            orientation: orientation,
            autoLoop: true,
            onOpen: function(
              ev,
              tabNode,
              RTI,
              childRTI,
              wasTriggeredWithArrowKey
            ) {
              if (!$A.data(tabNode, "disabled")) {
                if (!wasTriggeredWithArrowKey) {
                  var dc = RTI.boundDC;
                  dc.scrollIntoView = (dc && $A.isTouch()) || false;
                  $A.trigger(tabNode, "activatetab");
                }
              }
            },
            onSpace: function(ev, tabNode, RTI, childRTI) {
              if (!$A.data(tabNode, "disabled")) {
                var dc = RTI.boundDC;
                $A.trigger(tabNode, "activatetab");
              }
            }
          });
        }

        $A(wheel, overrides.overrides);
      }
    });
}

export default loadAccTabsModule();
