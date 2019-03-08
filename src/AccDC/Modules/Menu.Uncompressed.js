/*!
Accessible Menu Module 3.0 - Minimum requirement: AccDC4X V. 4.2018.0
Copyright 2010-2018 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
	*/

import $A from "../Core/API";

export function loadAccMenuModule() {
  if (!("setMenu" in $A))
    $A.extend({
      setMenu: function(menuMap, context, overrides, disableAutoFocus) {
        $A.on("body", "focusin.AccDCMenu", function(ev) {
          if ($A.setMenu.current && $A.setMenu.current.top.loaded) {
            var dc = $A.setMenu.current.top;
            var containsFocus = $A.isFocusWithin(dc.container);
            if (!containsFocus) {
              dc.close();
            }
          }
        });

        var menuTriggers = [],
          hasPopup = function(o) {
            return ["true", "menu"].indexOf($A.getAttr(o, "aria-haspopup")) !==
              -1
              ? true
              : false;
          },
          isMenu = function(o) {
            return ["menu", "menubar"].indexOf(
              ($A.getAttr(o, "role") || "").toLowerCase()
            ) !== -1
              ? true
              : false;
          },
          isMenuItem = function(o) {
            return ["menuitem", "menuitemcheckbox", "menuitemradio"].indexOf(
              ($A.getAttr(o, "role") || "").toLowerCase()
            ) !== -1
              ? true
              : false;
          },
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
          },
          menuItems = [],
          AccDCObjects = [],
          menuNode = isMenu(context)
            ? context
            : $A.query('*[role="menu"], *[role="menubar"]', context)[0],
          ariaOrientation = $A.getAttr(menuNode, "aria-orientation"),
          menuRole = $A.getAttr(menuNode, "role");

        if (menuNode) {
          $A.query('*[role^="menuitem"]', menuNode, function(i, o) {
            if (isMenuItem(o)) {
              menuItems.push(o);
            }
          });
        }

        $A.loop(
          menuMap,
          function(o, config) {
            var mapMenuFrom = function(context, AccDCObjects, menuComponent) {
                if (menuComponent) {
                  AccDCObjects.push({
                    id: o.id,
                    role: "Menu",
                    widgetType: "AccDCMenu",
                    autoCloseWidget: true,
                    // root: 'body',
                    // append: true,
                    triggerObj: o,
                    trigger: o,
                    on: {
                      activatemenu: function(ev, dc) {
                        if (dc.loaded) dc.close();
                        else dc.open();
                        ev.stopPropagation();
                        ev.preventDefault();
                      },
                      click: function(ev, dc) {
                        $A.trigger(o, "activatemenu");
                        ev.stopPropagation();
                        ev.preventDefault();
                      }
                    },
                    handler: config.handler,
                    React: {
                      name: config.menuName,
                      component: menuComponent,
                      parent: config.ReactParent
                    },
                    isTab: true,
                    isToggle: true,
                    allowMultiple: false,
                    exposeBounds: false,
                    allowCascade: true,
                    forceFocus: false,
                    click: function(ev, dc) {
                      // ev.stopPropagation();
                    },
                    mouseLeave: function(ev, dc) {
                      if (!$A.isTouch()) {
                        dc.close();
                      }
                    },
                    runBefore: function(dc) {
                      if (dc !== dc.top) {
                        dc.root = dc.append = null;
                      }
                    },
                    //                runDuring: function(dc) {
                    // Remains as an option if Forms/Applications mode is not properly being handled by mainstream screen readers.
                    // $A.setAttr(dc.outerNode, "role", "application");
                    //                },
                    runAfter: function(dc) {
                      dc.isSubMenu =
                        hasPopup(dc.triggerObj) && isMenuItem(dc.triggerObj);

                      if (dc.isSubMenu) {
                        $A.setAttr(dc.triggerObj, {
                          "aria-expanded": "true",
                          tabindex: -1
                        });
                      }

                      if (dc === dc.top) {
                        $A.setMenu.current = dc;
                      }
                    },
                    runBeforeClose: function(dc) {
                      if (dc.isSubMenu)
                        $A.setAttr(dc.triggerObj, {
                          "aria-expanded": "false",
                          tabindex: 0
                        });
                      $A.loop(
                        dc.children,
                        function(z, cdc) {
                          cdc.close();
                        },
                        "array"
                      );
                    },
                    runAfterClose: function(dc) {
                      if (dc === dc.top) {
                        $A.setMenu.current = null;
                      }
                    },
                    runBeforeDestroy: function(dc) {
                      $A.off("body", ".AccDCMenu");
                    },
                    exposeHiddenClose: true,
                    displayHiddenClose: true,
                    tabOut: function(ev, dc) {
                      if (!$A.isTouch()) {
                        dc.top.close();
                        return true;
                      }
                    }
                  });
                }
              },
              buildMenuFrom = function(context) {
                mapMenuFrom(context, AccDCObjects, config.menuComponent);
              };

            buildMenuFrom(context);

            $A.data(o, "isMenuTrigger", true);
            menuTriggers.push(o);
          },
          "map"
        );

        if (AccDCObjects.length) {
          var siblings = $A(AccDCObjects, overrides);
          var parentDC = $A.lastLoaded;
          $A.loop(
            siblings,
            function(i, dc) {
              if (isMenuItem(dc.triggerObj) && hasPopup(dc.triggerObj)) {
                dc.top = (parentDC && parentDC.top) || dc.top;
                dc.parent = parentDC || null;
              }
            },
            "array"
          );
          if (parentDC) parentDC.children = siblings;
        }

        if (menuNode) {
          if (menuItems.length) {
            $A.loop(
              menuItems,
              function(i, o) {
                $A.setAttr(o, {
                  "aria-posinset": i + 1,
                  "aria-setsize": menuItems.length
                });

                if (!$A.data(o, "isMenuTrigger")) {
                  var lDC = $A.lastLoaded;
                  $A.on(o, {
                    activatemenuitem: function(ev) {
                      if (lDC && lDC.widgetType === "AccDCMenu") {
                        if (!$A.data(o, "disabled")) {
                          if (typeof lDC.handler === "function")
                            lDC.handler.apply(o, [ev, o, lDC]);
                          if (typeof $A.setMenu.globalOnClick === "function")
                            $A.setMenu.globalOnClick.apply(o, [ev, o, lDC]);
                        }
                        lDC.top.close();
                      }
                    },
                    click: function(ev) {
                      $A.trigger(o, "activatemenuitem");
                      // ev.stopPropagation();
                      ev.preventDefault();
                    },
                    keydown: function(ev) {
                      var k = ev.which || ev.keyCode;
                      if (k === 13) {
                        $A.trigger(o, "activatemenuitem");
                        ev.preventDefault();
                      }
                    }
                  });
                }
              },
              "array"
            );

            updateDisabled(menuItems);

            var orientation = (function() {
              if (ariaOrientation === "horizontal") return 1;
              else if (ariaOrientation === "vertical") return 2;
              else if (menuRole === "menubar") return 1;
              else if (menuRole === "menu") return 2;
            })();

            var openMenu = function(
              ev,
              triggerNode,
              RTI,
              childRTI,
              abortForArrows
            ) {
              $A.trigger(triggerNode, "activatemenu");
              if (!abortForArrows && !$A.data(triggerNode, "isMenuTrigger")) {
                var pDC = RTI.dc && RTI.dc.parent;
                if (pDC && pDC.widgetType === "AccDCMenu") pDC.top.close();
              }
            };

            var RTI = new $A.RovingTabIndex({
              container: menuNode,
              nodes: menuItems,
              orientation: orientation,
              autoLoop: true,
              dc: $A.lastLoaded,
              onOpen: function(
                ev,
                triggerNode,
                RTI,
                childRTI,
                wasTriggeredWithArrowKey
              ) {
                openMenu.apply(this, arguments);
              },
              onClose: function(
                ev,
                focusedNode,
                RTI,
                parentRTI,
                parentTriggeringElement,
                wasTriggeredWithArrowKey
              ) {
                var pDC = RTI.dc && RTI.dc.parent;
                if (
                  wasTriggeredWithArrowKey &&
                  pDC &&
                  pDC.widgetType === "AccDCMenu"
                ) {
                  RTI.dc.close();
                } else if (
                  !wasTriggeredWithArrowKey &&
                  (ev.which || ev.keyCode) === 27 &&
                  RTI.dc
                ) {
                  RTI.dc.close();
                }
              }
            });

            if (!disableAutoFocus) RTI.focus();
          }
        }
      }
    });
}

export default loadAccMenuModule();
