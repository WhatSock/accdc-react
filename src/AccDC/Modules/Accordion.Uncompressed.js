/*!
Accessible Accordion Module 3.0 - Minimum requirement: AccDC4X V. 4.2018.0
Copyright 2010-2018 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

import $A from "../Core/API";

export function loadAccAccordionModule() {
  if (!("setAccordion" in $A))
    $A.extend({
      setAccordion: function(selector, overrides, context, callback, config) {
        var context = context || document,
          overrides = overrides || {},
          config = config || {},
          group = [];

        $A.query(selector, context, function(i, o) {
          var insertId = $A.getAttr(o, "data-insert");

          var ovrs = {
              id: o.id,
              role: "Accordion",
              autoStart: $A.getAttr(o, "data-defaultopen") === "true",
              trigger: o,
              root: $A(context).getEl(insertId),
              append: true,
              exposeBounds: true,
              on: {
                activateaccordion: function(ev, dc) {
                  dc.open();
                },
                click: function(ev, dc) {
                  $A.trigger(this, "activateaccordion");
                  ev.stopPropagation();
                  ev.preventDefault();
                },
                keydown: function(ev, dc) {
                  var k = ev.which || ev.keyCode;
                  if (k === 13 || k === 32) {
                    $A.trigger(this, "activateaccordion");
                    ev.stopPropagation();
                    ev.preventDefault();
                  }
                }
              },
              allowCascade: true,
              widgetType: "AccDCAccordion",

              runDuring: function(dc) {
                if (!dc.triggerObj.id) dc.triggerObj.id = $A.genId();
                dc.setAttr("aria-labelledby", dc.triggerObj.id);
                $A.setAttr(dc.triggerObj, "aria-controls", dc.outerNodeId);
              },

              runAfter: function(dc) {
                $A.setAttr(dc.triggerObj, {
                  "aria-expanded": "true"
                });

                if (callback && typeof callback === "function")
                  callback.apply(dc.triggerObj, [dc, dc.loaded]);
              },

              runAfterClose: function(dc) {
                $A.setAttr(dc.triggerObj, {
                  "aria-expanded": "false"
                });
                $A.remAttr(dc.triggerObj, "aria-controls");

                if (callback && typeof callback === "function")
                  callback.apply(dc.triggerObj, [dc, dc.loaded]);
              },

              click: function(ev, dc) {}
            },
            namedRegion = $A.getAttr(o, "data-controls");

          if (
            namedRegion &&
            overrides.regions &&
            overrides.regions[namedRegion]
          ) {
            ovrs.React = {
              name: namedRegion,
              component: overrides.regions[namedRegion],
              parent: overrides.ReactParent
            };
          }

          $A.extend(ovrs, overrides);
          group.push(ovrs);

          $A.setAttr(o, {
            "aria-expanded": "false"
          });

          if (!$A.isFocusable(o))
            $A.setAttr(o, {
              tabindex: "0"
            });
        });

        if (config.allowMultiple) {
          config.isToggle = true;
        } else if (!config.allowMultiple && !config.isToggle) {
          config.isTab = true;
        }

        $A(group, config);
      }
    });
}

export default loadAccAccordionModule();
