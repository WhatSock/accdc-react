/*!
Accessible Modal Module 2.0 - Minimum requirement: AccDC4X V. 4.2018.0
Copyright 2010-2018 Bryan Garaventa (WhatSock.com)
Refactoring Contributions Copyright 2018 Danny Allen (dannya.com) / Wonderscore Ltd (wonderscore.co.uk)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

import $A from "../Core/API";

export function loadAccModalModule() {
  if (!("setModal" in $A))
    $A.extend({
      setModal: function(overrides) {
        if (!$A.setModal.openModals) $A.setModal.openModals = [];
        $A.on("body", "focusin.AccDCModal", function(ev) {
          if ($A.setModal.openModals.length) {
            var dc = $A.setModal.openModals[$A.setModal.openModals.length - 1];
            var containsFocus = $A.isFocusWithin(dc.container);
            if (!containsFocus) {
              $A(dc.tabDirection ? dc.firstFocus : dc.lastFocus).focus();
            }
          }
        });

        overrides.overrides = overrides.overrides || {};
        var id = overrides.overrides.id || overrides.id || $A.genId();

        var config = {
          id: id,
          role: "Dialog",
          root: "body",
          append: true,
          allowCascade: true,
          widgetType: "AccDCModal",
          exposeHiddenClose: true,
          displayHiddenClose: true,
          tabOut: function(ev, dc) {
            if (!$A.isTouch()) {
              return true;
            }
          },
          runDuring: function(dc) {
            $A.query("body > *", function() {
              $A.setAttr(this, "aria-hidden", "true");
            });
            $A.addClass(
              dc.container,
              overrides.containerClassName || "container"
            );
            if (overrides.ariaAlertDialog) {
              $A.setAttr(dc.outerNode, {
                role: "alertdialog",
                "aria-label": overrides.ariaLabel || "Modal",
                "aria-describedby": overrides.ariaDescribedBy || dc.containerId,
                "aria-modal": "true"
              });
            } else if (overrides.ariaDialog) {
              $A.setAttr(dc.outerNode, {
                role: "dialog",
                "aria-label": overrides.ariaLabel || "Modal",
                "aria-describedby": overrides.ariaDescribedBy || dc.containerId,
                "aria-modal": "true"
              });
            } else {
              dc.exposeBounds = true;
            }
            dc.modalIndex = $A.setModal.openModals.length + 1;
          },
          runAfter: function(dc) {
            $A.setModal.openModals.push(dc);
            dc.firstFocus = $A.query('*[data-first="true"]', dc.container)[0];
            dc.lastFocus = $A.query('*[data-last="true"]', dc.container)[0];
            $A($A.query("*[data-focusfirst]", dc.container)[0]).focus();
          },
          runAfterClose: function(dc) {
            var i = $A.setModal.openModals.indexOf(dc);
            $A.setModal.openModals.splice(i, 1);
            if ($A.setModal.openModals.length) {
              $A.setModal.openModals[$A.setModal.openModals.length - 1].remAttr(
                "aria-hidden"
              );
            } else {
              $A.query("body > *", function(i, o) {
                $A.remAttr(o, "aria-hidden");
              });
            }
          },
          runBeforeDestroy: function(dc) {
            $A.off("body", ".AccDCModal");
          },
          reposition: function(callbackFn) {
            if (!$A.setModal.openModals.length) {
              return false;
            }

            if (
              $A.setModal.openModals[$A.setModal.openModals.length - 1].autoFix
            )
              $A.setModal.openModals[
                $A.setModal.openModals.length - 1
              ].applyFix();
            else if (
              $A.setModal.openModals[$A.setModal.openModals.length - 1]
                .autoPosition
            )
              $A.setModal.openModals[
                $A.setModal.openModals.length - 1
              ].setPosition();

            // Run custom specified function?
            if (typeof callbackFn === "function") {
              callbackFn(
                $A.setModal.openModals[$A.setModal.openModals.length - 1]
              );
            }

            return true;
          },
          keyDown: function(ev, dc) {
            var k = ev.which || ev.keyCode;

            // If Escape is pressed, close the modal
            if (k === 27) {
              dc.close();
              ev.stopPropagation();
              ev.preventDefault();
            }

            // Track forward / reverse tab direction for looping
            if (k === 9) {
              dc.tabDirection = ev.shiftKey ? 0 : 1;
            }
          },
          click: function(ev, dc) {},
          onCreated: function(dc) {
            id = dc.id;
          }
        };

        $A.extend(config, overrides);

        $A([config], overrides.overrides || {}, true);

        // Return the new modal AccDC Object ID
        return id;
      }
    });
}

export default loadAccModalModule();
