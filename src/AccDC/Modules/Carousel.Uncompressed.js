/*!
Accessible Carousel Module 3.0 - Minimum requirement: AccDC4X V. 4.2018.0
Copyright 2010-2018 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

import $A from "../Core/API";

export function loadAccCarouselModule() {
  if (!("setCarousel" in $A))
    $A.extend({
      setCarousel: function(container, config) {
        var animate = function(ele, ele2, targ, targ2, config) {
            if (!ele || !ele2) return;
            var start = {},
              start2 = {},
              disp = {},
              disp2 = {},
              uTotalTime = config.duration || 0;

            for (var t in targ) {
              start[t] = parseInt($A.css(ele, t), 10);
              disp[t] = targ[t] - start[t];
            }

            for (var t in targ2) {
              start2[t] = parseInt($A.css(ele2, t), 10);
              disp2[t] = targ2[t] - start2[t];
            }
            var freq = Math.PI / (2 * uTotalTime),
              startTime = new Date().getTime(),
              tmr = setInterval(function() {
                var elapsedTime = new Date().getTime() - startTime;

                if (elapsedTime < uTotalTime) {
                  var f = Math.abs(Math.sin(elapsedTime * freq)),
                    nw = {},
                    nw2 = {};

                  for (var s in start) {
                    nw[s] = Math.round(f * disp[s] + start[s]);
                    $A.css(ele, s, nw[s]);
                  }

                  for (var s in start2) {
                    nw2[s] = Math.round(f * disp2[s] + start2[s]);
                    $A.css(ele2, s, nw2[s]);
                  }

                  if (config.step) config.step.apply(ele, [nw, nw2]);
                } else {
                  clearInterval(tmr);

                  for (var t in targ) $A.css(ele, t, targ[t]);

                  for (var t in targ2) $A.css(ele2, t, targ2[t]);

                  if (config.complete)
                    config.complete.apply(ele, [targ, targ2]);
                }
              }, 10);
          },
          buffer = $A.createEl("div", null, {
            position: "relative",
            overflow: "hidden",
            width: "100%",
            height: "100%"
          }),
          sett = {
            role: "Slide",
            slides: [],
            autoStart: [0, 0],
            direction: "lr",
            cycle: true,
            stopRotation: false,
            forward: true,
            timer: 5000,
            animDelay: 2000,
            hiddenMsg: "Press Escape to stop carousel rotation.",
            render: function(container, buffer) {
              $A(container).insert(buffer);
            },
            onComplete: function(DC) {},
            handleBoundNodes: function(node) {},
            onStopStateChange: function(isStopped, isPaused) {}
          };
        $A.extend(sett, config || {});
        sett.render.call(sett, container, buffer);

        if (!container.id) container.id = $A.genId();
        var dcId = container.id,
          bId = $A.genId(),
          boundIds = {},
          boundNodes = [];

        // Variables
        var inc = null,
          msgNode = null,
          dirFlag = 0,
          firstLoaded = false,
          loading = false,
          stop = false,
          pause = false,
          objs = [],
          maxLength = 0,
          groups = {},
          indexes = {},
          track = {},
          old = null,
          cur = null;

        $A.loop(
          sett.slides,
          function(i, s) {
            var group = s.props.slideProps.group || "Carousel",
              name = s.props.slideProps.name || "",
              desc = s.props.slideProps.description || "",
              boundId = s.props.slideProps.id || null;

            if (!track[group]) {
              track[group] = [];
              indexes[maxLength] = group;
              groups[group] = maxLength;
              maxLength++;
            }

            var x = track[group].length;

            track[group].push({
              component: s,
              boundId: boundId,
              name: name,
              description: desc,
              id: dcId + "-" + groups[group] + "-" + x,
              index: x,
              group: group,
              groupIndex: groups[group]
            });
          },
          "array"
        );

        $A.loop(
          track,
          function(group, slides) {
            $A.loop(
              slides,
              function(i, o) {
                var boundNode = [];
                $A.loop(
                  o.boundId,
                  function(i, id) {
                    var c = $A.getEl(id);
                    if (c) {
                      boundIds[id] = o.id;
                      $A.setAttr(c, "aria-current", "false");
                      boundNode.push(c);
                      boundNodes.push(c);
                    }
                  },
                  "array"
                );
                objs.push({
                  id: o.id,
                  boundId: o.boundId,
                  boundNodes: boundNode,
                  slideVal: o.index,
                  slideMax: slides.length,
                  groupVal: o.groupIndex,
                  groupMax: maxLength,
                  name: o.name,
                  description: o.description,
                  React: {
                    component: o.component
                  }
                });
              },
              "array"
            );
          },
          "object"
        );

        var DC = {
          enableAuto: function(v) {
            stop = v ? false : true;
            if (stop) {
              clearTimeout(inc);
              if (msgNode) {
                $A.remove(msgNode);
                msgNode = null;
              }
            } else DC.setInc();
            if (typeof sett.onStopStateChange === "function")
              sett.onStopStateChange.apply(DC, [stop, pause]);
          },

          pauseRotation: function(v) {
            pause = v ? true : false;
            if (pause) clearTimeout(inc);
            else DC.setInc();
            if (typeof sett.onStopStateChange === "function")
              sett.onStopStateChange.apply(DC, [stop, pause]);
          },

          pSlide: function(isAuto) {
            if (loading) return;

            var g = cur.groupVal,
              s = cur.slideVal;
            if (g < 1 && s < 1 && !sett.cycle) return false;
            else if (s < 1) {
              g = g > 0 ? g - 1 : cur.groupMax - 1;
              s = track[indexes[g]].length - 1;
            } else s--;

            var ndc = $A.reg.get(track[indexes[g]][s].id);
            dirFlag = 0;
            if (ndc) {
              ndc.autoLoad = isAuto;
              ndc.open();
            }
          },

          nSlide: function(isAuto) {
            if (loading) return;

            var g = cur.groupVal,
              s = cur.slideVal;

            if (g >= cur.groupMax - 1 && s >= cur.slideMax - 1 && !sett.cycle)
              return false;
            else if (s >= cur.slideMax - 1) {
              g = g < cur.groupMax - 1 ? g + 1 : 0;
              s = 0;
            } else s++;

            var ndc = $A.reg.get(track[indexes[g]][s].id);
            dirFlag = 1;
            if (ndc) {
              ndc.autoLoad = isAuto;
              ndc.open();
            }
          },

          pGroup: function() {
            if (loading) return;

            var g = cur.groupVal;

            if (g < 1 && !sett.cycle) return false;
            g = g > 0 ? g - 1 : cur.groupMax - 1;

            var ndc = $A.reg.get(track[indexes[g]][0].id);
            dirFlag = 0;
            if (ndc) ndc.open();
          },

          nGroup: function() {
            if (loading) return;

            var g = cur.groupVal;

            if (g >= cur.groupMax - 1 && !sett.cycle) return false;
            g = g < cur.groupMax - 1 ? g + 1 : 0;

            var ndc = $A.reg.get(track[indexes[g]][0].id);
            dirFlag = 1;
            if (ndc) ndc.open();
          },

          setInc: function() {
            clearTimeout(inc);
            if (
              sett.timer > 0 &&
              buffer &&
              buffer.nodeType === 1 &&
              buffer.parentNode
            )
              inc = setTimeout(function() {
                if (stop || pause) return;
                if (sett.forward) DC.nSlide(true);
                else DC.pSlide(true);
              }, sett.timer);
          },

          bound: new Map()
        };

        $A(buffer).onRemove(function(ev) {
          clearTimeout(inc);
          if (msgNode) $A.remove(msgNode);
          msgNode = null;
          $A.loop(
            DC.objects,
            function(i, dc) {
              dc.destroy();
            },
            "array"
          );
          DC.objects = [];
        });

        DC.objects = $A(objs, {
          role: sett.role,
          allowMultiple: true,
          exposeBounds: false,
          root: buffer,
          append: true,
          cssObj: {
            position: "absolute"
          },
          runBefore: function(dc) {
            dc.cssObj.height = buffer.clientHeight;
            dc.cssObj.width = buffer.clientWidth;
            if (firstLoaded) {
              if (sett.direction === "lr") {
                dc.cssObj.left = !dirFlag
                  ? buffer.offsetLeft + buffer.clientLeft - buffer.clientWidth
                  : buffer.offsetLeft + buffer.clientLeft + buffer.clientWidth;
                dc.cssObj.top = buffer.offsetTop + buffer.clientTop;
              } else if (sett.direction === "tb") {
                dc.cssObj.top = !dirFlag
                  ? buffer.offsetTop + buffer.clientTop - buffer.clientHeight
                  : buffer.offsetTop + buffer.clientTop + buffer.clientHeight;
                dc.cssObj.left = buffer.offsetLeft + buffer.clientLeft;
              }
            } else {
              dc.cssObj.top = buffer.offsetTop + buffer.clientTop;
              dc.cssObj.left = buffer.offsetLeft + buffer.clientLeft;
            }
          },
          runBeforeDestroy: function(dc) {
            clearTimeout(inc);
            $A.unbind(window, "." + bId);
            $A.unbind("body", "." + bId);
          },
          runAfter: function(dc) {
            if (!dc.autoLoad) {
              $A.announce(dc.name);
              $A.announce(dc.description);
            } else dc.autoLoad = false;

            $A.setAttr(boundNodes, {
              "aria-current": "false",
              "aria-controls": ""
            });
            $A.loop(
              dc.boundNodes,
              function(i, n) {
                $A.setAttr(n, {
                  "aria-current": "true",
                  "aria-controls": dc.containerId
                });
              },
              "array"
            );

            if (cur) old = cur;
            cur = dc;

            if (firstLoaded) {
              var o = {
                left: buffer.offsetLeft + buffer.clientLeft,
                top: buffer.offsetTop + buffer.clientTop
              };

              if (sett.direction === "lr")
                o.left = !dirFlag
                  ? o.left + buffer.offsetWidth
                  : o.left - buffer.offsetWidth;
              else if (sett.direction === "tb")
                o.top = !dirFlag
                  ? o.top + buffer.offsetHeight
                  : o.top - buffer.offsetHeight;

              loading = true;
              $A.setAttr(old.outerNode, "aria-hidden", "true");
              $A.setAttr(dc.outerNode, "aria-hidden", "false");
              animate(
                dc.outerNode,
                old.outerNode,
                {
                  top: buffer.offsetTop + buffer.clientTop,
                  left: buffer.offsetLeft + buffer.clientLeft
                },
                o,
                {
                  duration: sett.animDelay,
                  complete: function() {
                    if (dc && old && old.loaded) {
                      old.close();
                      loading = false;

                      if (typeof sett.onComplete === "function")
                        sett.onComplete.apply(dc, [dc]);
                      DC.setInc();
                    }
                  }
                }
              );
            } else {
              firstLoaded = true;
              DC.setInc();

              if (typeof sett.onComplete === "function")
                sett.onComplete.apply(dc, [dc]);
            }

            $A.loop(
              dc.boundNodes,
              function(i, n) {
                if (typeof sett.handleBoundNodes === "function")
                  sett.handleBoundNodes.apply(n, [n]);
              },
              "array"
            );
          },
          click: function(ev, dc) {}
        });

        $A.on(window, "resize." + bId, function(ev) {
          cur.css({
            top: buffer.offsetTop + buffer.clientTop,
            left: buffer.offsetLeft + buffer.clientLeft
          });
        });

        if (sett.timer > 0) {
          $A.on("body", "keydown." + bId, function(ev) {
            var k = ev.which || ev.keyCode;

            if (k === 27) {
              DC.enableAuto(false);
              ev.preventDefault();
            }
          });

          if (sett.hiddenMsg && !$A.isTouch()) {
            msgNode = $A("<div>" + sett.hiddenMsg + "</div>")
              .setOffScreen()
              .before(container)
              .announce()
              .return();
          }
        }

        if (sett.stopRotation) DC.enableAuto(false);

        var openAtCoords = function(coords) {
          var dc = $A.reg.get(track[indexes[coords[0]]][coords[1]].id);
          if (dc) {
            if (!firstLoaded) dc.autoLoad = true;
            dc.open();
          }
        };

        openAtCoords(sett.autoStart);

        var controls = {
          load: function(id) {
            if (boundIds[id] && $A.reg.has(boundIds[id])) {
              $A.reg.get(boundIds[id]).open();
            }
          },

          bind: function(o, coords) {
            if (o && coords) DC.bound.set(o, coords);
          },

          open: function(coords) {
            if (DC.bound.has(coords)) coords = DC.bound.get(coords);
            openAtCoords(coords);
          },

          destroy: function() {
            $A.remove(buffer);
          },

          previousGroup: function() {
            DC.pGroup();
          },

          nextGroup: function() {
            DC.nGroup();
          },

          previousSlide: function() {
            DC.pSlide();
          },

          nextSlide: function() {
            DC.nSlide();
          },

          enable: function(v) {
            DC.enableAuto(v);
          },

          pause: function(v) {
            DC.pauseRotation(v);
          },

          state: function(fn) {
            if (typeof fn === "function") fn.call(this, stop, pause);
            else return stop || pause;
          }
        };

        return controls;
      }
    });
}

export default loadAccCarouselModule();
