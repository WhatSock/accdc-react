/*
AccDC 4X BETA - 4.2018.0.3 + React
Copyright 2010-2018 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

import React from "react";
import ReactDOM from "react-dom";

// AccDC leverages the following import dependancies

// https://www.npmjs.com/package/react-html-parser
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";

// https://www.npmjs.com/package/bean
import bean from "bean";

// https://www.npmjs.com/package/current-device
import device from "current-device";

// https://github.com/bitinn/node-fetch
import fetch from "node-fetch";

export function $AccDC() {
  return (
    window.AccDC ||
    (function() {
      var accDCVersion = "4.2018.0.3",
        $A = function(dc, dcA, dcI, onReady, disableAsync) {
          if (!arguments.length && this === $A) {
            return $A;
          } else if ($A.isChain(dc) && arguments.length === 1) {
            return dc;
          } else if (typeof dc === "function" && arguments.length === 1) {
            if ($A.documentLoaded) {
              dc();
            } else {
              window.addEventListener("load", function() {
                dc();
              });
            }
            return $A;
          } else if (
            dc &&
            $A.isArray(dc) &&
            dc.length &&
            dc[0] &&
            typeof dc[0] === "object" &&
            dc[0].id &&
            !dc[0].nodeType
          ) {
            disableAsync = onReady;
            onReady = dcI;
            dcI = dcA;
            dcA = dc;
            dc = null;
          } else if (
            ((dc && $A.isDC(dc)) || $A.reg.has(dc)) &&
            (dcA &&
              $A.isArray(dcA) &&
              dcA.length &&
              dcA[0] &&
              typeof dcA[0] === "object" &&
              dcA[0].id &&
              !dcA[0].nodeType)
          ) {
            if ($A.reg.has(dc)) dc = $A.reg.get(dc);
          } else if (dc || (this && this !== $A)) {
            if (this && typeof this === "string") {
              dcI = dcA;
              dcA = dc;
              dc = this;
            } else if (dc && $A.reg.has(dc)) {
              return $A.reg.get(dc);
            } else if (dc && typeof dc === "string") {
              dcI = dcA;
              dcA =
                this === window ||
                (typeof this === "object" && "querySelectorAll" in this)
                  ? this
                  : document;
            }
            if (typeof dc === "string") {
              var t = dc;
              if ($A.isHTML(t)) t = $A.toNode(t);
              else t = $A.query(t, dcA, dcI)[0];
              if (t) dc = t;
            }
            return $A._clone(dc);
          }

          $A.lastCreated = [];

          var fn = function() {
            var w = GenAccDC(dcA, dcI, dc);
            if (
              $A._lastCreatedCallback &&
              typeof $A._lastCreatedCallback === "function"
            )
              $A._lastCreatedCallback.call($A, w);
            $A._lastCreatedCallback = null;
            return w;
          };

          if (onReady && !$A.documentLoaded) {
            window.addEventListener("load", function() {
              fn();
            });
          } else return fn();
        },
        nowI = 0,
        now = function() {
          return new Date().getTime() + nowI++;
        };

      $A.isArray = function(v) {
        return (
          v &&
          typeof v === "object" &&
          typeof v.length === "number" &&
          typeof v.splice === "function" &&
          !v.propertyIsEnumerable("length")
        );
      };
      // extend derived from jQuery core for cross platform compatibility
      $A.extend = function() {
        var options,
          name,
          src,
          copy,
          copyIsArray,
          clone,
          target = arguments[0] || {},
          i = 1,
          length = arguments.length,
          deep = false;
        if (typeof target === "boolean") {
          deep = target;
          target = arguments[1] || {};
          i = 2;
        }
        if (typeof target !== "object" && typeof target !== "function") {
          target = {};
        }
        if (length === i) {
          target = $A;
          --i;
        }
        for (; i < length; i++) {
          if ((options = arguments[i]) !== null) {
            for (name in options) {
              src = target[name];
              copy = options[name];
              if (target === copy) {
                continue;
              }
              if (
                deep &&
                copy &&
                ($A.isPlainObject(copy) || (copyIsArray = $A.isArray(copy)))
              ) {
                if (copyIsArray) {
                  copyIsArray = false;
                  clone = src && $A.isArray(src) ? src : [];
                } else {
                  clone = src && $A.isPlainObject(src) ? src : {};
                }
                target[name] = $A.extend(deep, clone, copy);
              } else if (copy !== undefined) {
                target[name] = copy;
              }
            }
          }
        }
        return target;
      };
      // isPlainObject derived from jQuery core for cross platform compatibility
      $A.isPlainObject = function(obj) {
        var hasOwn = Object.prototype.hasOwnProperty;
        if (
          !obj ||
          typeof obj !== "object" ||
          obj.nodeType ||
          "setInterval" in obj
        ) {
          return false;
        }
        if (
          obj.constructor &&
          !hasOwn.call(obj, "constructor") &&
          !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")
        ) {
          return false;
        }
        var key;
        for (key in obj) {
        }
        return key === undefined || hasOwn.call(obj, key);
      };

      $A.extend({
        beep: function() {
          var snd = new Audio(
            "data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
          );
          snd.play();
        },

        setGlobal: function(o, retroactive) {
          if (o && typeof o === "object") {
            $A.extend(true, $A.fn.globalDC, o);
            if (retroactive) $A.mergeGlobal();
          }
        },

        mergeGlobal: function() {
          $A.find("*", function(dc) {
            $A.extend(true, dc, $A.fn.globalDC);
          });
        },

        reg: new Map(),

        fn: {
          globalDC: {},
          debug: false
        },

        _version: accDCVersion,

        lastCreated: [],
        _lastCreatedCallback: false,
        lastCreatedCallback: function(fn) {
          if (typeof fn === "function") $A._lastCreatedCallback = fn;
        },

        _boundAccDCRefObjects: new Map(),
        _boundObjectIds: new Map(),

        setIdFor: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          var id = $A.getIdFor(o);
          if (!id) {
            id = $A.genId();
            $A._boundObjectIds.set(o, id);
            $A._boundAccDCRefObjects.set(id, o);
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = id;
            return this;
          } else return id;
        },

        remIdFor: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          var id = $A.getIdFor(o);
          if (id) {
            $A._boundAccDCRefObjects.delete(id);
            $A._boundObjectIds.delete(o);
            if (this.isClonedAccDCObject) {
              this.currentObject = true;
              return this;
            } else return true;
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = false;
            return this;
          } else return false;
        },

        getIdFor: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          var r = $A._boundObjectIds.get(o);
          return r;
        },

        getObjFromId: function(id) {
          if (this.isClonedAccDCObject) {
            id = this.currentObject;
          }
          var r = $A._boundAccDCRefObjects.get(id);
          return r;
        },

        _boundObjects: new Map(),

        bindObjects: function(o, dc) {
          if (this.isClonedAccDCObject) {
            dc = o;
            o = this.currentObject;
          }
          $A._boundObjects.set(o, dc);
          $A._boundObjects.set(dc, o);
          if (this.isClonedAccDCObject) {
            this.currentObject = o;
            return this;
          } else return o;
        },

        unbindObjects: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          $A._boundObjects.delete($A._boundObjects.get(o));
          $A._boundObjects.delete(o);
          if (this.isClonedAccDCObject) {
            this.currentObject = o;
            return this;
          } else return o;
        },

        getBoundObject: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          var r = $A._boundObjects.get(o);
          return r;
        },

        hasBoundObject: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          var r = $A._boundObjects.has(o);
          return r;
        },

        toDC: function(o, sett) {
          if (this.isClonedAccDCObject) {
            sett = o;
            o = this.currentObject;
          }
          o = $A._stringToNode(o);
          o = $A._checkStoredNodes(o, true);
          if (!sett && o && typeof o === "object" && o.nodeType !== 1) {
            sett = o;
            o = null;
          }
          var isDOMNode = o && o.nodeType === 1 ? true : false,
            hasParent =
              isDOMNode && o.parentNode && o.parentNode.nodeType === 1
                ? true
                : false,
            id = isDOMNode && o.id ? o.id : $A.genId();
          if (isDOMNode && o.id !== id) o.id = id;
          var init = {
            id: id,
            fn: {
              isMorphedAccDCObject: true
            },
            autoStart: hasParent
          };
          if ($A.isReact(o)) {
            $A.extend(init, {
              React: {
                component: o
              }
            });
          } else if (isDOMNode && o !== document.body) {
            init.source = o;
          }
          var DC = null;
          $A.extend(
            init,
            {
              onCreated: function(dc) {
                DC = dc;
              }
            },
            sett || {}
          );
          $A([init]);
          return DC;
        },

        _storeNodes: function(f, elementOnly) {
          if (f.nodeType === 11) {
            var nl = [];
            $A.loop(
              f.childNodes,
              function(i, o) {
                if (o.nodeType === 1) nl.push(o);
              },
              "array"
            );
            $A.data(f, "StoredNodeList", nl);
            if (elementOnly) return nl[0];
          }
          return f;
        },

        toNode: function(s, elementOnly) {
          if (this.isClonedAccDCObject) {
            elementOnly = s;
            s = this.currentObject;
          }
          if (typeof s === "string") {
            try {
              s = $A._storeNodes(
                document.createRange().createContextualFragment(s),
                elementOnly
              );
            } catch (e) {
              var f = document.createDocumentFragment();
              $A.insertHTML(s, f);
              s = $A._storeNodes(f, elementOnly);
            }
          } else {
            s = $A._checkStoredNodes(s, elementOnly);
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = s;
            return this;
          } else return s;
        },

        toReact: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          if (
            ReactDOM &&
            ReactHtmlParser &&
            o &&
            !$A.isReact(o) &&
            (typeof o === "string" || o.nodeType)
          ) {
            if (o && o.nodeType === 11) {
              o = $A._checkStoredNodes(o, true);
            }
            o = ReactHtmlParser(
              o && typeof o === "object" && o.nodeType && o.outerHTML
                ? o.outerHTML
                : o && typeof o === "object" && o.nodeType === 3 && o.data
                  ? o.data
                  : o
            );
          }
          if (!$A.isReact(o)) {
            o = null;
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = o;
            return this;
          } else return o;
        },

        _clone: function(o) {
          if ($A.isChain(o)) return o;
          var f = function(o) {
            this.isClonedAccDCObject = true;
            this.currentObject = o;
          };
          f.prototype = $A;
          return new f(o);
        },

        return: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          return o;
        },

        getNode: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          if ($A.isReact(o)) {
            try {
              o = ReactDOM.findDOMNode(o);
            } catch (e) {}
          }
          return o;
        },

        getDC: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          if ($A.isDC(o)) {
            return o;
          } else if ($A.isReact(o) && o.props && o.props.DC) {
            return o.props.DC;
          } else if ($A.reg.has(o)) {
            return $A.reg.get(o);
          }
          return null;
        },

        isReact: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          try {
            if (
              o &&
              typeof o === "object" &&
              !o.nodeType &&
              !o.appendChild &&
              ((React && React.isValidElement(o)) ||
                (ReactDOM && ReactDOM.findDOMNode(o)))
            )
              return true;
          } catch (e) {}
          return false;
        },

        isChain: function(o) {
          return o && typeof o === "object" && o.isClonedAccDCObject
            ? true
            : false;
        },

        isDC: function(o) {
          return o && typeof o === "object" && o.fn && o.fn.isAccDCObject
            ? true
            : false;
        },

        hasDC: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          return (
            $A.isDC(o) ||
            ($A.isReact(o) && $A.isDC(o.props && o.props.DC)) ||
            $A.reg.has(o)
          );
        },

        _isMorphedDC: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          return o &&
            typeof o === "object" &&
            o.fn &&
            o.fn.isAccDCObject &&
            o.fn.isMorphedAccDCObject
            ? true
            : false;
        },

        isHTML: function(s) {
          if (this.isClonedAccDCObject) {
            s = this.currentObject;
          }
          if (!s || typeof s !== "string") {
            return false;
          }
          var r = stringAnnounce.iterate(s, /<|>/g) > 1;
          return r;
        },

        _stringToNode: function(o, retArray, context) {
          if (typeof o === "string") {
            if ($A.isHTML(o)) {
              o = $A.toNode(o);
              return retArray ? [o] : o;
            } else {
              context = context || document;
              var r = $A.query(o, context);
              if (!r.length) {
                r.push($A.toTextNode(o));
              }
              return retArray ? r : r[0];
            }
          } else if (typeof o === "number") {
            o = $A.toTextNode(o.toString());
            return retArray ? [o] : o;
          }
          return retArray && !$A.isArray(o) ? [o] : o;
        },

        _checkStoredNodes: function(f, rNode) {
          if ($A.isChain(f)) {
            return $A._checkStoredNodes(f.return(), rNode);
          } else if (f && f.nodeType === 11) {
            var nl = $A.data(f, "StoredNodeList");
            if (nl && nl.length) {
              if (rNode) return nl[0];
              else return nl;
            }
          } else if ($A.isReact(f)) {
            return $A.getNode(f);
          }
          return f;
        },

        _isMap: function(o) {
          try {
            Map.prototype.has.call(o);
            return true;
          } catch (e) {
            return false;
          }
        },

        loop: function(o, fn, type) {
          if (this.isClonedAccDCObject) {
            type = fn;
            fn = o;
            o = this.currentObject;
          }
          if (typeof fn !== "function") {
            if (this.isClonedAccDCObject) {
              this.currentObject = o;
              return this;
            } else return o;
          }
          if (!$A.isArray(o) && type === "array") o = [o];
          if (
            (!type || type === "map") &&
            $A._isMap(o) &&
            typeof o.forEach === "function"
          ) {
            o.forEach(function(v, k) {
              fn.call(v, k, v);
            });
          } else if ((!type || type === "array") && $A.isArray(o)) {
            for (var i = 0; i < o.length; i++) {
              fn.call(o[i], i, o[i]);
            }
          } else if (
            (!type || type === "object") &&
            o &&
            typeof o === "object"
          ) {
            for (var n in o) {
              fn.call(o[n], n, o[n]);
            }
          } else if ((!type || type === "string") && typeof o === "string") {
            for (var i = 0; i < o.length; i++) {
              fn.call(o.charAt(i), i, o.charAt(i));
            }
          } else if (o && o.nodeType === 1) {
            fn.call(o, 0, o);
          } else if (o && type === "other") fn.call(o, 0, o);
          if (this.isClonedAccDCObject) {
            this.currentObject = o;
            return this;
          } else return o;
        },

        isArray: function(v) {
          if (this.isClonedAccDCObject) {
            v = this.currentObject;
          }
          var o =
            typeof v === "object" &&
            typeof v.length === "number" &&
            !v.propertyIsEnumerable("length");
          return o;
        },

        inArray: function(searchFor, inStack) {
          if (this.isClonedAccDCObject) {
            inStack = searchFor;
            searchFor = this.currentObject;
          }
          if (!searchFor || !inStack) return -1;
          if (inStack.indexOf) {
            var r = inStack.indexOf(searchFor);
            return r;
          }
          for (var i = 0; i < inStack.length; i++) {
            if (inStack[i] === searchFor) {
              return i;
            }
          }
          return -1;
        },

        device: device,

        isTouch: function() {
          return ["mobile", "tablet"].indexOf($A.device.type) >= 0;
        },

        isIE: function() {
          return !window.ActiveXObject && "ActiveXObject" in window
            ? true
            : false;
        },

        trim: function(s) {
          if (this.isClonedAccDCObject) {
            s = this.currentObject;
          }
          if (typeof s === "string") s = s.replace(/^\s+|\s+$/g, "");
          return s;
        },

        query: function(sel, con, call) {
          if (this.isClonedAccDCObject) {
            call = con;
            con = this.currentObject;
          }

          if ($A.isReact(con)) {
            con = $A.getNode(con);
          } else if (con && typeof con === "function") {
            call = con;
            con = null;
          }

          if (!con) con = document;
          var r = [],
            isA = true;

          if (!sel) {
            if (this.isClonedAccDCObject) {
              this.currentObject = r;
              return this;
            } else return r;
          } else if (typeof sel === "string" && con.querySelectorAll) {
            try {
              r = con.querySelectorAll(sel);
            } catch (e) {
              r = [];
            }
          } else if (sel && sel.nodeType === 1) {
            r.push(sel);
          } else if (
            (!sel.nodeType && $A.isArray(sel)) ||
            typeof sel === "object"
          ) {
            r = sel;
            if (!$A.isArray(r)) isA = false;
          }

          if (call && typeof call === "function") {
            if (isA) {
              for (var i = 0; i < r.length; i++) {
                call.apply(r[i], [i, r[i]]);
              }
            } else if (r && typeof r === "object") {
              for (var n in r) {
                call.apply(r[n], [n, r[n]]);
              }
            }
          }

          if (this.isClonedAccDCObject) {
            this.currentObject = r;
            return this;
          } else return r;
        },

        getText: function(n) {
          if (this.isClonedAccDCObject) {
            n = this.currentObject;
          }
          if (!n) return this.isClonedAccDCObject ? this : "";
          var s = "";
          if (n && n.nodeType === 1) s = n.innerText || n.textContent || "";
          if (this.isClonedAccDCObject) {
            this.currentObject = s;
            return this;
          } else return s;
        },

        find: function(id, fn) {
          var ids = [],
            dcs = [];
          if (typeof id === "string") ids = id.split(",");
          $A.loop(
            $A.reg,
            function(k, v) {
              if (
                (ids.length === 1 && ids[0] === "*") ||
                (ids.length && $A.inArray(k, ids) !== -1) ||
                k === id ||
                (typeof id === "function" && id(k))
              ) {
                fn.call(v, v);
                dcs.push(v);
              }
            },
            "map"
          );
          return dcs;
        },

        fetch: fetch,

        get: function(o) {
          /* Syntax of array, may include multiple fetch objects to chain them in succession
[
{
url: "resourcePath",
data: {returnType: "html", selector: "#myWidget"},
success: function(content, promise){},
error: function(error, promise){}
}
]
*/

          var config = {
              // AccDC related properties
              returnType: "html", // Options: "html", "text", "xml", "json"
              selector: "", // Sets a CSS query selector to return the first matching node within the newly loaded html or xml.

              // These properties are part of the Fetch Standard
              method: "GET",
              headers: {}, // request headers. format is the identical to that accepted by the Headers constructor
              body: null, // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
              cache: "default", // The cache mode you want to use for the request: default, no-store, reload, no-cache, force-cache, or only-if-cached.
              redirect: "follow", // The redirect mode to use: follow (automatically follow redirects), error (abort with an error if a redirect occurs), or manual (handle redirects manually). In Chrome the default is follow (before Chrome 47 it defaulted to manual).
              keepalive: false // The keepalive option can be used to allow the request to outlive the page. Fetch with the keepalive flag is a replacement for the Navigator.sendBeacon() API.
              // mode: 'no-cors', // The mode you want to use for the request, e.g., cors, no-cors, or same-origin.
              // credentials: 'omit', // The request credentials you want to use for the request: omit, same-origin, or include. To automatically send cookies for the current domain, this option must be provided. Starting with Chrome 50, this property also takes a FederatedCredential instance or a PasswordCredential instance.
              // referrer: 'client', // A USVString specifying no-referrer, client, or a URL. The default is client.
              // referrerPolicy: 'no-referrer', // Specifies the value of the referer HTTP header. May be one of no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, unsafe-url.
              // signal: null, // An AbortSignal object instance; allows you to communicate with a fetch request and abort it if desired via an AbortController.
              // integrity: null, // Contains the subresource integrity value of the request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=).
            },
            i = 0,
            load = function(url, data, success, error) {
              var options = config;
              $A.extend(options, data || {});
              $A
                .fetch(url, options)
                .then(function(response) {
                  if (response.status >= 200 && response.status < 300) {
                    // text or html or xml
                    if (
                      ["html", "text", "xml"].indexOf(
                        options.returnType.toLowerCase()
                      ) >= 0
                    )
                      response.text().then(function(content) {
                        if (
                          typeof content === "string" &&
                          options.returnType.toLowerCase() === "xml"
                        )
                          content = $A.toXML(content);
                        else if (
                          typeof content === "string" &&
                          options.returnType.toLowerCase() === "html"
                        )
                          content = $A.toNode(content);
                        if (options.selector)
                          content = $A.query(options.selector, content)[0];
                        if (typeof success === "function")
                          success.call(this, content, response);
                        i++;
                        if (o[i])
                          load(o[i].url, o[i].data, o[i].success, o[i].error);
                      });
                    // json
                    else if (options.returnType.toLowerCase() === "json")
                      response.json().then(function(json) {
                        if (typeof success === "function")
                          success.call(this, json, response);
                        i++;
                        if (o[i])
                          load(o[i].url, o[i].data, o[i].success, o[i].error);
                      });
                  } else if (typeof error === "function") {
                    error.call(this, response.statusText, response);
                  }
                })
                .catch(function(errorMsg) {
                  if (typeof error === "function")
                    error.call(this, errorMsg, this);
                });
            };

          if (!$A.isArray(o)) o = [o];

          load(o[i].url, o[i].data, o[i].success, o[i].error);
        },

        toXML: function(data) {
          if (!data) data = "";
          var doc;
          if (window.DOMParser) {
            var parser = new DOMParser();
            doc = parser.parseFromString(data, "text/xml");
          } else {
            doc = new window.ActiveXObject("Microsoft.XMLDOM");
            doc.async = "false";
            doc.loadXML(data);
          }
          return doc;
        },

        getScript: function(source, callback, disableAsync) {
          if (typeof callback === "boolean") {
            disableAsync = callback;
            callback = null;
          }
          var urls = $A.isArray(source) ? source : [source],
            Cache = new $A.ScriptCache({
              tag: "script",
              async: disableAsync ? false : true,
              scripts: urls
            });
          $A.loop(
            urls,
            function(i, u) {
              Cache[u].onLoad(() => {
                if (callback && typeof callback === "function")
                  callback.apply(window, [source, $A]);
              });
            },
            "array"
          );
        },

        _parseURLWithSelector: function(u) {
          var ss = u.split(/\s+/);
          return {
            url: ss[0],
            selector: u.substring(ss[0].length)
          };
        },

        load: function(target, context, data, cb, errorCB) {
          if (this.isClonedAccDCObject) {
            errorCB = cb;
            cb = data;
            data = context;
            context = this.currentObject;
          }
          if (typeof data === "function") {
            errorCB = cb;
            cb = data;
            data = null;
          }
          var config = {
            returnType: "html"
          };
          $A.extend(config, data || {});
          $A.get({
            url: target,
            data: config,
            success: function(node, promise) {
              $A.insert(node, context);
              if (typeof cb === "function") cb.call(this, node, promise);
            },
            error: function(errorMsg, promise) {
              if (typeof errorCB === "function")
                errorCB.call(this, errorMsg, promise);
            }
          });
          if (this.isClonedAccDCObject) {
            this.currentObject = context;
            return this;
          } else return context;
        },

        listener: bean,

        on: function(ta, e, fn, save) {
          if (this.isClonedAccDCObject) {
            save = fn;
            fn = e;
            e = ta;
            ta = this.currentObject;
          }
          if (fn && typeof fn !== "function") {
            save = fn;
            fn = null;
          }
          if (!ta || !e) return this.isClonedAccDCObject ? this : ta;
          var events = e;
          ta = $A._stringToNode(ta, true);
          var obj = $A._checkStoredNodes(ta);
          if (!$A.isArray(obj)) obj = [obj];
          if (typeof events === "string") events = events.split(/\s+/);
          $A.loop(
            obj,
            function(i, o) {
              if (typeof o === "object" && o.nodeType === 1) {
                if (save) $A.data(o, "SavedEventParameters", save);
                $A.loop(
                  events,
                  function(j, p) {
                    if (typeof j === "string" && typeof p === "function") {
                      j = j.split(/\s+/);
                      $A.loop(
                        j,
                        function(k, q) {
                          $A.listener.on(o, q, function(ev) {
                            p.call(
                              o,
                              ev,
                              $A.data(o, "DC"),
                              $A.data(o, "SavedEventParameters")
                            );
                          });
                        },
                        "array"
                      );
                    } else if (
                      typeof p === "string" &&
                      typeof fn === "function"
                    )
                      $A.listener.on(o, p, function(ev) {
                        fn.call(
                          o,
                          ev,
                          $A.data(o, "DC"),
                          $A.data(o, "SavedEventParameters")
                        );
                      });
                  },
                  $A.isArray(events) ? "array" : "object"
                );
              }
            },
            "array"
          );
          if (this.isClonedAccDCObject) {
            this.currentObject = ta;
            return this;
          } else return ta;
        },

        off: function(ta, e) {
          if (this.isClonedAccDCObject) {
            e = ta;
            ta = this.currentObject;
          }
          if (!ta) return this.isClonedAccDCObject ? this : ta;
          var events = e;
          ta = $A._stringToNode(ta);
          var obj = $A._checkStoredNodes(ta);
          if (!$A.isArray(obj)) obj = [obj];
          if (typeof events === "string") events = events.split(/\s+/);
          $A.loop(
            obj,
            function(i, o) {
              if (typeof o === "object" && o.nodeType === 1) {
                $A.removeData(o, "SavedEventParameters");
                if (!e) {
                  $A.listener.off(o);
                } else {
                  $A.loop(
                    events,
                    function(j, p) {
                      if (typeof p === "string") $A.listener.off(o, p);
                    },
                    $A.isArray(events) ? "array" : "object"
                  );
                }
              }
            },
            "array"
          );
          if (this.isClonedAccDCObject) {
            this.currentObject = ta;
            return this;
          } else return ta;
        },

        trigger: function(ta, e) {
          if (this.isClonedAccDCObject) {
            e = ta;
            ta = this.currentObject;
          }
          if (!ta || !e) return this.isClonedAccDCObject ? this : ta;
          var events = e;
          ta = $A._stringToNode(ta);
          var obj = $A._checkStoredNodes(ta);
          if (!$A.isArray(obj)) obj = [obj];
          if (typeof events === "string") events = events.split(/\s+/);
          $A.loop(
            obj,
            function(i, o) {
              if (typeof o === "object" && o.nodeType === 1) {
                $A.loop(
                  events,
                  function(j, p) {
                    if (typeof p === "string") $A.listener.fire(o, p);
                  },
                  $A.isArray(events) ? "array" : "object"
                );
              }
            },
            "array"
          );
          if (this.isClonedAccDCObject) {
            this.currentObject = ta;
            return this;
          } else return ta;
        },

        _widgetTypes: [],
        _regWidgets: new Map(),
        _dataMap: new Map(),

        data: function(obj, key, val) {
          if (this.isClonedAccDCObject) {
            val = key;
            key = obj;
            obj = this.currentObject;
          }
          if (!obj) return this.isClonedAccDCObject ? this : obj;
          if (obj && key && !val) {
            if ($A._dataMap.has(obj) && $A._dataMap.get(obj).has(key)) {
              var r = $A._dataMap.get(obj).get(key);
              if (this.isClonedAccDCObject) {
                this.currentObject = r;
                return this;
              } else return r;
            }
            if (this.isClonedAccDCObject) {
              this.currentObject = null;
              return this;
            } else return null;
          } else if (obj && key && val) {
            if (!$A._dataMap.has(obj)) $A._dataMap.set(obj, new Map());
            $A._dataMap.get(obj).set(key, val);
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        removeData: function(obj, key) {
          if (this.isClonedAccDCObject) {
            key = obj;
            obj = this.currentObject;
          }
          if (obj && key) {
            if ($A._dataMap.has(obj) && $A._dataMap.get(obj).has(key))
              $A._dataMap.get(obj).delete(key);
          } else if (obj) {
            if ($A._dataMap.has(obj)) $A._dataMap.delete(obj);
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        insert: function(obj, root, fn) {
          if (this.isClonedAccDCObject) {
            fn = root;
            root = this.currentObject;
          }
          root = $A._stringToNode(root);
          if (!root) return this.isClonedAccDCObject ? this : obj;
          if ($A.isReact(obj)) {
            obj = $A.mount(obj, root, fn);
          } else if (root && root.nodeType && root.appendChild) {
            if (typeof obj === "string") {
              $A.insertHTML(obj, root);
              obj = $A.firstChild(root);
            } else if (typeof obj === "number") {
              $A.insertHTML(obj.toString(), root);
            } else if (obj && obj.nodeType) {
              $A.empty(root);
              root.appendChild(obj);
            }
            if (fn && typeof fn === "function") fn.apply(obj, [obj]);
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        insertWithin: function(root, obj, fn) {
          if (this.isClonedAccDCObject) {
            fn = obj;
            obj = this.currentObject;
          }
          obj = $A.insert(obj, root, fn);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        before: function(obj, existingNode, fn) {
          if (this.isClonedAccDCObject) {
            fn = existingNode;
            existingNode = obj;
            obj = this.currentObject;
          }
          obj = $A._insertBefore(obj, existingNode, fn);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        _insertBefore: function(obj, existingNode, fn) {
          if (this.isClonedAccDCObject) {
            fn = existingNode;
            existingNode = obj;
            obj = this.currentObject;
          }
          existingNode = $A._stringToNode(existingNode);
          if (!existingNode || !obj)
            return this.isClonedAccDCObject ? this : obj;
          if (typeof obj === "string") obj = $A._stringToNode(obj);
          existingNode.parentNode.insertBefore(obj, existingNode);
          if (fn && typeof fn === "function") fn.apply(obj, [obj]);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        after: function(obj, existingNode, fn) {
          if (this.isClonedAccDCObject) {
            fn = existingNode;
            existingNode = obj;
            obj = this.currentObject;
          }
          obj = $A._insertAfter(obj, existingNode, fn);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        _insertAfter: function(obj, existingNode, fn) {
          if (this.isClonedAccDCObject) {
            fn = existingNode;
            existingNode = obj;
            obj = this.currentObject;
          }
          existingNode = $A._stringToNode(existingNode);
          if (!existingNode) return this.isClonedAccDCObject ? this : obj;
          if (typeof obj === "string") obj = $A._stringToNode(obj);
          var ns = $A.nextSibling(existingNode);
          if (ns) ns.parentNode.insertBefore(obj, ns);
          else existingNode.parentNode.appendChild(obj);
          if (fn && typeof fn === "function") fn.apply(obj, [obj]);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        prepend: function(obj, root, fn) {
          if (this.isClonedAccDCObject) {
            fn = root;
            root = this.currentObject;
          }
          root = $A._stringToNode(root);
          if (!root) return this.isClonedAccDCObject ? this : obj;
          if (root.nodeType && root.appendChild) {
            if (typeof obj === "string") obj = $A._stringToNode(obj);
            var fc = $A.firstChild(root);
            if (fc) $A._insertBefore(obj, fc);
            else root.appendChild(obj);
          }
          if (fn && typeof fn === "function") fn.apply(obj, [obj]);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        prependTo: function(root, obj, fn) {
          if (this.isClonedAccDCObject) {
            fn = obj;
            obj = this.currentObject;
          }
          obj = $A.prepend(obj, root, fn);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        append: function(obj, root, fn) {
          if (this.isClonedAccDCObject) {
            fn = root;
            root = this.currentObject;
          }
          root = $A._stringToNode(root);
          if (!root) return this.isClonedAccDCObject ? this : obj;
          if (root && root.nodeType && root.appendChild) {
            if (typeof obj === "string") obj = $A._stringToNode(obj);
            root.appendChild(obj);
          }
          if (fn && typeof fn === "function") fn.apply(obj, [obj]);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        appendTo: function(root, obj, fn) {
          if (this.isClonedAccDCObject) {
            fn = obj;
            obj = this.currentObject;
          }
          obj = $A.append(obj, root, fn);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        insertHTML: function(obj, root, pos, fn) {
          if (this.isClonedAccDCObject) {
            fn = pos;
            pos = root;
            root = this.currentObject;
          }
          if (typeof pos === "function") {
            fn = pos;
            pos = null;
          }
          root = $A._stringToNode(root);
          if (!root) return this.isClonedAccDCObject ? this : null;
          if (root && root.nodeType && root.appendChild) {
            if (typeof obj === "number") obj = obj.toString();
            if (typeof obj === "string") {
              var locale = {
                prepend: "afterbegin",
                append: "beforeend",
                before: "beforebegin",
                after: "afterend"
              };
              if (locale[pos]) root.insertAdjacentHTML(locale[pos], obj);
              else root.innerHTML = obj;
            }
          }
          if (fn && typeof fn === "function") fn.apply(root, [root]);
          if (this.isClonedAccDCObject) {
            this.currentObject = root;
            return this;
          } else return root;
        },

        _deleteNode: function(o) {
          if (document.createRange) {
            try {
              var range = document.createRange();
              range.selectNode(o);
              range.deleteContents();
            } catch (e) {}
          } else {
            try {
              if (o && o.parentNode) o.parentNode.removeChild(o);
            } catch (e) {}
          }
        },

        extractNodes: function(o, noFrag) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          try {
            var range = document.createRange();
            range.selectNodeContents(o);
            o = range.extractContents();
          } catch (e) {
            var f = document.createDocumentFragment();
            if ($A.firstChild(o)) {
              var node = $A.firstChild(o);
              while (node) {
                f.appendChild(o.removeChild(node));
                node = $A.firstChild(o);
              }
            }
            o = f;
          }
          o = $A._storeNodes(o, noFrag);
          if (this.isClonedAccDCObject) {
            this.currentObject = o;
            return this;
          } else return o;
        },

        empty: function(obj, removeParent) {
          if (this.isClonedAccDCObject) {
            removeParent = obj;
            obj = this.currentObject;
          }
          if (obj && obj.getElementsByTagName) {
            var items = obj.getElementsByTagName("*");
            for (var i = items.length; i--; ) {
              $A.remove(items[i], true);
            }
            $A.insertHTML("", obj);
          }
          if (removeParent) {
            $A.remove(obj);
            obj = null;
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        _cleanAll: function(obj, includeParent) {
          if (obj && obj.getElementsByTagName) {
            var items = obj.getElementsByTagName("*");
            for (var i = items.length; i--; ) {
              $A._clean(items[i]);
            }
            if (includeParent) $A._clean(obj);
          }
        },

        _clean: function(obj, sD) {
          if ($A.data(obj, "DC-ON")) {
            var dc = $A.data(obj, "DC");
            if ($A.isDC(dc) && dc.loaded) {
              dc.fn.bypass = true;
              dc.close();
              dc.fn.bypass = false;
            }
          }
          if (!sD && $A.data(obj, "onRemoveSet"))
            $A.trigger(obj, "accdcremovenode");
          $A.removeData(obj);
          $A.listener.off(obj);
        },

        onRemove: function(obj, fn, save) {
          if (this.isClonedAccDCObject) {
            save = fn;
            fn = obj;
            obj = this.currentObject;
          }
          if (save) $A.data(obj, "onRemoveParameters", save);
          $A.on(obj, "accdcremovenode", function(ev, dc) {
            if (typeof fn === "function")
              fn.call(this, ev, dc, $A.data(obj, "onRemoveParameters"));
          });
          $A.data(obj, "onRemoveSet", true);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        remove: function(obj, skipDelete) {
          if (this.isClonedAccDCObject) {
            skipDelete = obj;
            obj = this.currentObject;
          }

          if (obj && obj.nodeType === 11) {
            var o = $A._checkStoredNodes(obj);
            if (o && o.length) {
              for (var i = o.length; i--; ) {
                $A.remove(o[i]);
              }
            }
            $A._clean(obj);
            obj = null;
          } else if (obj && obj.nodeType) {
            $A._clean(obj, skipDelete);
            if (!skipDelete) {
              $A._deleteNode(obj);
              obj = null;
            }
          }

          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        destroy: function(id, p) {
          var r = null;
          if ($A.isDC(id)) r = id;
          else r = $A.reg.get(id);
          if (!$A.isDC(id)) return false;
          var a = r.outerNode,
            c = r.container;
          if (p && r.loaded) {
            $A._insertBefore($A.extractNodes(c), a);
          }
          if (r.loaded) {
            r.fn.bypass = true;
            r.close();
            r.fn.bypass = false;
          }
          r.runBeforeDestroy(r);
          $A.removeData(r.id);
          r.id = r.outerNode = r.accDCObj = r.container = a = c = null;
          if (r.widgetType && r.autoCloseWidget) {
            var wtI = $A._widgetTypes.indexOf(r.id);
            if (wtI !== -1) {
              $A._widgetTypes.splice(wtI, 1);
            }
          }
          if (r.widgetType && r.autoCloseSameWidget) {
            var wtA = $A._regWidgets.get(r.widgetType),
              wtI = wtA.indexOf(r.id);
            if (wtI !== -1) {
              wtA.splice(wtI, 1);
              $A._regWidgets.set(r.widgetType, wtA);
            }
          }
          var iv = r.indexVal,
            wh = r.siblings;
          wh.splice(iv, 1);
          for (var i = 0; i < wh.length; i++) {
            wh[i].indexVal = i;
            wh[i].siblings = wh;
          }

          if (r.parent && r.parent.children && r.parent.children.length) {
            var pc = -1,
              cn = r.parent.children;
            for (var i = 0; i < cn.length; i++) {
              if (cn[i].id === id) pc = i;
            }
            if (pc >= 0) r.parent.children.splice(pc, 1);
          }
          $A.reg.delete(id);
          return true;
        },

        mount: function(obj, root, fn) {
          if (this.isClonedAccDCObject) {
            fn = root;
            root = this.currentObject;
          }
          if (root) {
            if (ReactDOM && ReactHtmlParser) {
              if (typeof obj === "string" || obj.nodeType)
                obj = $A.toReact(obj);
              if (typeof root === "string") {
                root = $A(root).return();
              }
              if ($A.hasDC(obj)) {
                var dc = $A.getDC(obj);
                dc.root = root;
                dc.mount();
                if (typeof fn === "function") fn.apply(obj, [obj, root]);
              } else if (root && root.nodeType && root.appendChild) {
                $A._cleanAll(root);
                ReactDOM.render(obj, root, function() {
                  $A.data(root, "HasReactComponent", true);
                  if (typeof fn === "function") fn.apply(this, arguments);
                });
              }
            }
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        mountWithin: function(root, obj, fn) {
          if (this.isClonedAccDCObject) {
            fn = obj;
            obj = this.currentObject;
          }
          obj = $A.mount(obj, root, fn);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        unmount: function(obj, fn) {
          if (this.isClonedAccDCObject) {
            fn = obj;
            obj = this.currentObject;
          }
          if (!obj) return this.isClonedAccDCObject ? this : obj;
          var o = obj;
          if ($A.isReact(o)) {
            var dc = $A.getDC(o);
            if (dc) o = dc;
            else {
              try {
                o = $A.getNode(o).parentNode;
              } catch (e) {}
            }
          }
          if ($A.isDC(o)) {
            o.unmount();
          } else if (o && o.nodeType && o.appendChild) {
            $A._cleanAll(o);
            ReactDOM.unmountComponentAtNode(o);
            $A.data(o, "HasReactComponent", false);
            if (fn && typeof fn === "function") fn.apply(obj, [o]);
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        getEl: function(e, mode, context, fn) {
          if (mode && typeof mode === "function") {
            fn = mode;
            mode = null;
          } else if (context && typeof context === "function") {
            fn = context;
            context = null;
          }
          if (
            mode &&
            typeof mode !== "number" &&
            typeof mode === "object" &&
            mode.querySelectorAll
          ) {
            context = mode;
            mode = null;
          }
          if (this.isClonedAccDCObject) {
            context = this.currentObject;
          }
          context = context || document;

          if (typeof e !== "string") {
            if (this.isClonedAccDCObject) {
              this.currentObject = null;
              return this;
            } else return null;
          }

          // Get first match if CSS selector is used
          // E.G #container *.myClassName
          // or h1
          if (mode === 1) {
            var r = $A.query(e, context)[0];
            if (typeof fn === "function") fn.call(r, r);
            if (this.isClonedAccDCObject) {
              this.currentObject = r;
              return this;
            } else return r;
          }

          // Pull DOM node from external html file plus CSS selector seperated by single space
          // E.G ./menu.html #settings-id
          // Or ./menu.html .menuClass
          else if (mode === 2) {
            var obj = $A._parseURLWithSelector(e);
            $A.get({
              url: obj.url,
              data: {
                returnType: "html",
                selector: obj.selector
              },
              success: function(node) {
                if (context && context.nodeType === 1 && context.appendChild)
                  $A.insert(node, context, fn);
                else if (typeof fn === "function") fn.call(node, node);
              }
            });
            if (this.isClonedAccDCObject) {
              this.currentObject = context;
              return this;
            } else return context;
          }

          // Or get the node matching the referenced ID.
          // document.getElementById cannot be used because it doesn't always work correctly in React
          var r = $A.query("#" + e, context)[0];
          if (typeof fn === "function") fn.call(r, r);

          if (this.isClonedAccDCObject) {
            this.currentObject = r;
            return this;
          } else return r;
        },

        createEl: function(t) {
          var o = document.createElement(t);
          if (arguments.length === 1 || !o || o.nodeType !== 1) return o;
          if (arguments[1]) $A.setAttr(o, arguments[1]);
          if (arguments[2]) $A.css(o, arguments[2]);
          if (arguments[3]) $A.addClass(o, arguments[3]);
          if (arguments[4]) $A.insert(arguments[4], o);
          return o;
        },

        createText: function(s) {
          if (s && typeof s === "object" && s.nodeType === 3) return s;
          else if (typeof s !== "string") s = "";
          return document.createTextNode(s);
        },

        getAttr: function(e, n) {
          if (this.isClonedAccDCObject) {
            n = e;
            e = this.currentObject;
          }
          if (!e || !n) return null;
          e = $A._stringToNode(e);
          var E = $A._checkStoredNodes(e, true);
          var r = null;
          if (E && E.nodeType === 1 && E.getAttribute) r = E.getAttribute(n);
          return r;
        },

        remAttr: function(e, n) {
          if (this.isClonedAccDCObject) {
            n = e;
            e = this.currentObject;
          }
          if (!e || !n) return this.isClonedAccDCObject ? this : e;
          e = $A._stringToNode(e);
          var E = $A._checkStoredNodes(e);
          var o = $A.isArray(E) ? E : [E];
          for (var x = 0; x < o.length; x++) {
            if (o[x] && o[x].nodeType === 1 && o[x].removeAttribute) {
              var a = $A.isArray(n) ? n : [n];
              for (var i = 0; i < a.length; i++) {
                o[x].removeAttribute(a[i]);
              }
            }
          }

          if (this.isClonedAccDCObject) {
            this.currentObject = e;
            return this;
          } else return e;
        },

        setAttr: function(e, name, value) {
          if (this.isClonedAccDCObject) {
            value = name;
            name = e;
            e = this.currentObject;
          }
          if (!e || !name) return this.isClonedAccDCObject ? this : e;
          e = $A._stringToNode(e);
          var E = $A._checkStoredNodes(e);
          var o = $A.isArray(E) ? E : [E];
          for (var x = 0; x < o.length; x++) {
            if (o[x] && o[x].nodeType === 1 && o[x].setAttribute) {
              if (typeof name === "string") {
                if (value === null) o[x].removeAttribute(name);
                else o[x].setAttribute(name, value);
              } else if (typeof name === "object") {
                for (var n in name) {
                  if (name[n] === null) o[x].removeAttribute(n);
                  else o[x].setAttribute(n, name[n]);
                }
              }
            }
          }

          if (this.isClonedAccDCObject) {
            this.currentObject = e;
            return this;
          } else return e;
        },

        prevSibling: function(e, t) {
          if (this.isClonedAccDCObject) {
            t = e;
            e = this.currentObject;
          }
          if (!e) return this.isClonedAccDCObject ? this : e;
          e = $A._stringToNode(e);
          e = $A._checkStoredNodes(e, true);
          e = e ? e.previousSibling : null;
          while (e) {
            if (
              e.nodeType === 1 &&
              (!t || (t && typeof t === "function" && t(e)))
            )
              break;
            e = e.previousSibling;
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = e;
            return this;
          } else return e;
        },

        nextSibling: function(e, t) {
          if (this.isClonedAccDCObject) {
            t = e;
            e = this.currentObject;
          }
          if (!e) return this.isClonedAccDCObject ? this : e;
          e = $A._stringToNode(e);
          e = $A._checkStoredNodes(e, true);
          e = e ? e.nextSibling : null;
          while (e) {
            if (
              e.nodeType === 1 &&
              (!t || (t && typeof t === "function" && t(e)))
            )
              break;
            e = e.nextSibling;
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = e;
            return this;
          } else return e;
        },

        firstChild: function(e, t) {
          if (this.isClonedAccDCObject) {
            t = e;
            e = this.currentObject;
          }
          if (!e) return this.isClonedAccDCObject ? this : e;
          e = $A._stringToNode(e);
          e = $A._checkStoredNodes(e, true);
          e = e ? e.firstChild : null;
          while (e) {
            if (
              e.nodeType === 1 &&
              (!t || (t && typeof t === "function" && t(e)))
            )
              break;
            e = e.nextSibling;
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = e;
            return this;
          } else return e;
        },

        lastChild: function(e, t) {
          if (this.isClonedAccDCObject) {
            t = e;
            e = this.currentObject;
          }
          if (!e) return this.isClonedAccDCObject ? this : e;
          e = $A._stringToNode(e);
          e = $A._checkStoredNodes(e, true);
          e = e ? e.lastChild : null;
          while (e) {
            if (
              e.nodeType === 1 &&
              (!t || (t && typeof t === "function" && t(e)))
            )
              break;
            e = e.previousSibling;
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = e;
            return this;
          } else return e;
        },

        closestParent: function(node, fn) {
          if (this.isClonedAccDCObject) {
            fn = node;
            node = this.currentObject;
          }
          while (node && node.nodeType === 1) {
            node = node.parentNode;
            if (
              (!fn && node.nodeType === 1) ||
              (typeof fn === "function" && fn(node))
            ) {
              if (this.isClonedAccDCObject) {
                this.currentObject = node;
                return this;
              } else return node;
            }
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = null;
            return this;
          } else return null;
        },

        _getStyleObject: function(node) {
          var style = {};
          if (document.defaultView && document.defaultView.getComputedStyle) {
            style = document.defaultView.getComputedStyle(node, "");
          } else if (node.currentStyle) {
            style = node.currentStyle;
          }
          return style;
        },

        css: function(ob, p, v) {
          if (this.isClonedAccDCObject) {
            v = p;
            p = ob;
            ob = this.currentObject;
          }
          if (!ob || !p) return this.isClonedAccDCObject ? this : ob;
          ob = $A._stringToNode(ob);
          var obj = $A._checkStoredNodes(ob);
          if (!$A.isArray(obj)) obj = [obj];
          if (
            obj &&
            obj[0] &&
            obj.length === 1 &&
            obj[0].nodeType === 1 &&
            typeof p === "string" &&
            typeof v !== "string" &&
            typeof v !== "number" &&
            !v
          ) {
            return $A._getStyleObject(obj[0])[p];
          }
          var isNumProp = function(n) {
            if (!n) return false;
            var list = ["top", "left", "bottom", "right", "width", "height"];
            for (var l = 0; l < list.length; l++) {
              if (list[l].substr(list[l].length - n.length) === n) return true;
            }
            return false;
          };
          var setProp = function(o, prop, val) {
            val = isNumProp(prop) && typeof val === "number" ? val + "px" : val;
            try {
              if (!(val || typeof val === "number") && o.style.removeProperty) {
                o.style.removeProperty(prop);
              } else {
                prop = $A._camelize(prop);
                o.style[prop] = val;
              }
            } catch (e) {}
          };
          for (var z = 0; z < obj.length; z++) {
            if (obj[z] && obj[z].nodeType === 1) {
              if (typeof p === "string") setProp(obj[z], p, v);
              else if (typeof p === "object")
                $A.loop(
                  p,
                  function(n, v) {
                    setProp(obj[z], n, v);
                  },
                  "object"
                );
            }
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = ob;
            return this;
          } else return ob;
        },

        hasClass: function(O, cn) {
          if (this.isClonedAccDCObject) {
            cn = O;
            O = this.currentObject;
          }
          var t = $A._stringToNode(O);
          var o = $A._checkStoredNodes(t, true);
          if (
            !o ||
            o.nodeType !== 1 ||
            !o.className ||
            !cn ||
            typeof cn !== "string"
          )
            return false;
          var names = cn.split(/\s+/),
            i = 0,
            n = 0;
          try {
            var cL = o.classList;
            for (n = 0; n < names.length; n++) {
              if (cL.contains(names[n])) i += 1;
            }
          } catch (e) {
            var oClasses = o.className ? o.className.split(/\s+/) : [];
            for (n = 0; n < names.length; n++) {
              if (oClasses.indexOf(names[n]) !== -1) i += 1;
            }
          }
          return i === names.length;
        },

        addClass: function(obj, cn) {
          if (this.isClonedAccDCObject) {
            cn = obj;
            obj = this.currentObject;
          }
          if (!obj || !cn || typeof cn !== "string")
            return this.isClonedAccDCObject ? this : obj;
          obj = $A._stringToNode(obj);
          var o = $A._checkStoredNodes(obj);
          if (!$A.isArray(o)) o = [o];
          var names = cn.split(/\s+/);
          for (var x = 0; x < o.length; x++) {
            var n = 0;
            try {
              var cL = o[x].classList;
              for (n = 0; n < names.length; n++) cL.add(names[n]);
            } catch (e) {
              if (o[x] && o[x].nodeType === 1 && !$A.hasClass(o[x], cn)) {
                var oClasses = o[x].className
                  ? o[x].className.split(/\s+/)
                  : [];
                for (n = 0; n < names.length; n++) {
                  if (oClasses.indexOf(names[n]) === -1)
                    oClasses.push(names[n]);
                }
                o[x].className = oClasses.join(" ");
              }
            }
          }

          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        remClass: function(obj, cn) {
          if (this.isClonedAccDCObject) {
            cn = obj;
            obj = this.currentObject;
          }
          if (!obj || !obj.className || !cn || typeof cn !== "string")
            return this.isClonedAccDCObject ? this : obj;
          obj = $A._stringToNode(obj);
          var o = $A._checkStoredNodes(obj);
          if (!$A.isArray(o)) o = [o];
          var names = cn.split(/\s+/);

          for (var x = 0; x < o.length; x++) {
            var n = 0;
            try {
              var cL = o[x].classList;
              for (n = 0; n < names.length; n++) cL.remove(names[n]);
            } catch (e) {
              if (o[x] && o[x].nodeType === 1 && $A.hasClass(o[x], cn)) {
                var oClasses = o[x].className
                    ? o[x].className.split(/\s+/)
                    : [],
                  nc = [];
                for (n = 0; n < oClasses.length; n++) {
                  if (names.indexOf(oClasses[n]) === -1) nc.push(oClasses[n]);
                }
                o[x].className = nc.join(" ");
              }
            }
          }

          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        toggleClass: function(obj, cn, isTrue, fn) {
          if (this.isClonedAccDCObject) {
            fn = isTrue;
            isTrue = cn;
            cn = obj;
            obj = this.currentObject;
          }
          if (typeof isTrue === "function") {
            fn = isTrue;
            isTrue = null;
          }
          if (!obj || !cn || typeof cn !== "string")
            return this.isClonedAccDCObject ? this : obj;
          obj = $A._stringToNode(obj);
          var O = $A._checkStoredNodes(obj);
          if (!$A.isArray(O)) O = [O];
          for (var x = 0; x < O.length; x++) {
            var o = O[x];
            if (typeof isTrue !== "boolean") isTrue = !$A.hasClass(o, cn);
            try {
              o.classList.toggle(cn, isTrue);
            } catch (e) {
              if (isTrue) $A.addClass(o, cn);
              else $A.remClass(o, cn);
            }
            if (typeof fn === "function") fn.apply(o, [isTrue]);
          }
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        setOffScreen: function(obj) {
          if (this.isClonedAccDCObject) {
            obj = this.currentObject;
          }
          $A.css(obj, $A.sraCSS);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        clearOffScreen: function(obj) {
          if (this.isClonedAccDCObject) {
            obj = this.currentObject;
          }
          $A.css(obj, $A.sraCSSClear);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        sraCSS: {
          position: "absolute",
          clip: "rect(1px 1px 1px 1px)",
          clip: "rect(1px, 1px, 1px, 1px)",
          clipPath: "inset(50%)",
          padding: 0,
          border: 0,
          height: "1px",
          width: "1px",
          overflow: "hidden",
          whiteSpace: "nowrap"
        },

        sraCSSClear: {
          position: "",
          clip: "auto",
          clipPath: "none",
          padding: "",
          height: "",
          width: "",
          overflow: "",
          whiteSpace: "normal"
        },

        _calcPosition: function(dc, objArg, posVal) {
          var obj = objArg || dc.posAnchor;
          if (obj && typeof obj === "string") obj = $A.query(obj)[0];
          else if (!obj) obj = dc.triggerObj;
          if (!obj) return;
          var autoPosition = posVal || dc.autoPosition,
            pos = {},
            aPos = {
              height: $A.elementHeight(dc.outerNode),
              width: $A.elementWidth(dc.outerNode)
            },
            oPos = $A._offset(obj),
            position = $A.css(dc.outerNode, "position");
          if (position === "absolute" && $A.css(obj, "position") !== "fixed")
            oPos = $A._offset(obj, true);
          if (autoPosition === 1) {
            pos.left = oPos.left;
            pos.top = oPos.top - aPos.height;
          } else if (autoPosition === 2) {
            pos.left = oPos.right;
            pos.top = oPos.top - aPos.height;
          } else if (autoPosition === 3) {
            pos.left = oPos.right;
            pos.top = oPos.top;
          } else if (autoPosition === 4) {
            pos.left = oPos.right;
            pos.top = oPos.bottom;
          } else if (autoPosition === 5) {
            pos.left = oPos.left;
            pos.top = oPos.bottom;
          } else if (autoPosition === 6) {
            pos.left = oPos.left - aPos.width;
            pos.top = oPos.bottom;
          } else if (autoPosition === 7) {
            pos.left = oPos.left - aPos.width;
            pos.top = oPos.top;
          } else if (autoPosition === 8) {
            pos.left = oPos.left - aPos.width;
            pos.top = oPos.top - aPos.height;
          } else if (autoPosition === 9) {
            pos.left = oPos.left;
            pos.top = oPos.top;
          } else if (autoPosition === 10) {
            pos.left = oPos.right - aPos.width;
            pos.top = oPos.top - aPos.height;
          } else if (autoPosition === 11) {
            pos.left = oPos.right - aPos.width;
            pos.top = oPos.top;
          } else if (autoPosition === 12) {
            pos.left = oPos.right - aPos.width;
            pos.top = oPos.bottom;
          }
          if (
            typeof dc.offsetTop === "number" &&
            (dc.offsetTop < 0 || dc.offsetTop > 0)
          )
            pos.top += dc.offsetTop;
          if (
            typeof dc.offsetLeft === "number" &&
            (dc.offsetLeft < 0 || dc.offsetLeft > 0)
          )
            pos.left += dc.offsetLeft;
          $A.css(dc.outerNode, pos);
        },

        _getWindow: function() {
          return {
            width:
              window.document.documentElement.clientWidth ||
              window.document.body.clientWidth,
            height:
              window.document.documentElement.clientHeight ||
              window.document.body.clientHeight
          };
        },

        _getAbsolutePos: function(obj) {
          if (!obj) return this.isClonedAccDCObject ? this : obj;
          var curleft = 0;
          var curtop = 0;
          do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
          } while ((obj = obj.offsetParent));
          return {
            left: curleft,
            top: curtop
          };
        },

        _offset: function(c, forceAbsolute, forceRelative, returnTopLeftOnly) {
          if (this.isClonedAccDCObject) {
            returnTopLeftOnly = forceRelative;
            forceRelative = forceAbsolute;
            forceAbsolute = c;
            c = this.currentObject;
          }
          if (!c || c.nodeType !== 1) return c;
          var r = {},
            position = $A.css(c, "position");
          if (forceAbsolute || position === "absolute")
            r = $A._getAbsolutePos(c);
          else if (forceRelative || position === "relative") {
            r.top = c.offsetTop;
            r.left = c.offsetLeft;
            r.height = $A.elementHeight(c);
            r.width = $A.elementWidth(c);
            r.right = r.left + r.width;
            r.bottom = r.top + r.height;
          } else {
            var br = c.getBoundingClientRect();
            r = {
              top: br.top,
              left: br.left,
              right: br.right,
              bottom: br.bottom,
              height: br.height,
              width: br.width
            };
          }
          if (returnTopLeftOnly) {
            // Ensure only top and left properties are returned if returnTopLeftOnly = true
            r = {
              top: r.top,
              left: r.left
            };
          }
          return r;
        },

        _camelize: function(cssPropStr) {
          if (typeof cssPropStr !== "string") cssPropStr = "";
          var i, c, a, s;
          a = cssPropStr.split("-");
          s = a[0];
          for (i = 1; i < a.length; i++) {
            c = a[i].charAt(0);
            s += a[i].replace(c, c.toUpperCase());
          }
          return s;
        },

        _getComputedStyle: function(e, p, i) {
          if (!e) return e;
          var s,
            v = "undefined",
            dv = document.defaultView;
          if (dv && dv.getComputedStyle) {
            if (e === document) e = document.body;
            s = dv.getComputedStyle(e, "");
            if (s) v = s.getPropertyValue(p);
          } else if (e.currentStyle) v = e.currentStyle[$A._camelize(p)];
          else return null;
          return i ? parseInt(v, 10) || 0 : v;
        },

        _num: function() {
          for (var i = 0; i < arguments.length; i++) {
            if (isNaN(arguments[i]) || typeof arguments[i] !== "number")
              return false;
          }
          return true;
        },

        _def: function() {
          for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "undefined") return false;
          }
          return true;
        },

        _str: function() {
          for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] !== "string") return false;
          }
          return true;
        },

        elementHeight: function(e, h) {
          var css,
            pt = 0,
            pb = 0,
            bt = 0,
            bb = 0;
          if (!e) return 0;
          if ($A._num(h)) {
            if (h < 0) h = 0;
            else h = Math.round(h);
          } else h = -1;
          css = $A._def(e.style);
          if (css && $A._def(e.offsetHeight) && $A._str(e.style.height)) {
            if (h >= 0) {
              if (document.compatMode === "CSS1Compat") {
                pt = $A._getComputedStyle(e, "padding-top", 1);
                if (pt !== null) {
                  pb = $A._getComputedStyle(e, "padding-bottom", 1);
                  bt = $A._getComputedStyle(e, "border-top-width", 1);
                  bb = $A._getComputedStyle(e, "border-bottom-width", 1);
                } else if ($A._def(e.offsetHeight, e.style.height)) {
                  e.style.height = h + "px";
                  pt = e.offsetHeight - h;
                }
              }
              h -= pt + pb + bt + bb;
              if (isNaN(h) || h < 0) return;
              else e.style.height = h + "px";
            }
            h = e.offsetHeight;
          } else if (css && $A._def(e.style.pixelHeight)) {
            if (h >= 0) e.style.pixelHeight = h;
            h = e.style.pixelHeight;
          }
          return h;
        },

        elementWidth: function(e, w) {
          var css,
            pl = 0,
            pr = 0,
            bl = 0,
            br = 0;
          if (!e) return 0;
          if ($A._num(w)) {
            if (w < 0) w = 0;
            else w = Math.round(w);
          } else w = -1;
          css = $A._def(e.style);
          if (css && $A._def(e.offsetWidth) && $A._str(e.style.width)) {
            if (w >= 0) {
              if (document.compatMode === "CSS1Compat") {
                pl = $A._getComputedStyle(e, "padding-left", 1);
                if (pl !== null) {
                  pr = $A._getComputedStyle(e, "padding-right", 1);
                  bl = $A._getComputedStyle(e, "border-left-width", 1);
                  br = $A._getComputedStyle(e, "border-right-width", 1);
                } else if ($A._def(e.offsetWidth, e.style.width)) {
                  e.style.width = w + "px";
                  pl = e.offsetWidth - w;
                }
              }
              w -= pl + pr + bl + br;
              if (isNaN(w) || w < 0) return;
              else e.style.width = w + "px";
            }
            w = e.offsetWidth;
          } else if (css && $A._def(e.style.pixelWidth)) {
            if (w >= 0) e.style.pixelWidth = w;
            w = e.style.pixelWidth;
          }
          return w;
        },

        _top: function(e, iY) {
          var css = $A._def(e.style);
          if (css && $A._str(e.style.top)) {
            if ($A._num(iY)) e.style.top = iY + "px";
            else {
              iY = parseInt(e.style.top, 10);
              if (isNaN(iY)) iY = $A._getComputedStyle(e, "top", 1);
              if (isNaN(iY)) iY = 0;
            }
          } else if (css && $A._def(e.style.pixelTop)) {
            if ($A._num(iY)) e.style.pixelTop = iY;
            else iY = e.style.pixelTop;
          }
          return iY;
        },

        _left: function(e, iX) {
          var css = $A._def(e.style);
          if (css && $A._str(e.style.left)) {
            if ($A._num(iX)) e.style.left = iX + "px";
            else {
              iX = parseInt(e.style.left, 10);
              if (isNaN(iX)) iX = $A._getComputedStyle(e, "left", 1);
              if (isNaN(iX)) iX = 0;
            }
          } else if (css && $A._def(e.style.pixelLeft)) {
            if ($A._num(iX)) e.style.pixelLeft = iX;
            else iX = e.style.pixelLeft;
          }
          return iX;
        },

        _pointerPosition: function(e) {
          var posx = 0,
            posy = 0;
          if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
          } else if (e.clientX || e.clientY) {
            posx =
              e.clientX +
              document.body.scrollLeft +
              document.documentElement.scrollLeft;
            posy =
              e.clientY +
              document.body.scrollTop +
              document.documentElement.scrollTop;
          }
          return {
            x: posx,
            y: posy
          };
        },

        addIdRef: function(obj, attr, ids) {
          if (this.isClonedAccDCObject) {
            ids = attr;
            attr = obj;
            obj = this.currentObject;
          }
          if (!obj || !attr || !ids || typeof ids !== "string")
            return this.isClonedAccDCObject ? this : obj;
          var t = $A._stringToNode(obj);
          var o = $A._checkStoredNodes(t, true);
          $A.loop(
            o,
            function(i, o) {
              var ds = ($A.getAttr(o, attr) || "").split(/\s+/);
              $A.loop(ids.split(/\s+/), function(z, d) {
                if ($A.inArray(d, ds) === -1) ds.push(d);
              });
              $A.setAttr(o, attr, ds.join(" "));
            },
            "array"
          );
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        remIdRef: function(obj, attr, ids) {
          if (this.isClonedAccDCObject) {
            ids = attr;
            attr = obj;
            obj = this.currentObject;
          }
          if (!obj || !attr || !ids || typeof ids !== "string")
            return this.isClonedAccDCObject ? this : obj;
          var t = $A._stringToNode(obj);
          var o = $A._checkStoredNodes(t, true);
          var ds = (ids || "").split(/\s+/);
          $A.loop(
            o,
            function(i, o) {
              var n = [],
                nds = ($A.getAttr(o, attr) || "").split(/\s+/);
              $A.loop(nds, function(z, d) {
                if ($A.inArray(d, ds) === -1) n.push(d);
              });
              $A.setAttr(o, attr, n.join(" "));
            },
            "array"
          );
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        RovingTabIndex: function(options) {
          /*
options = {
container: DOM node container element for child nodes,
nodes: DOMNodeArray,
// Orientation: horizontal=1, vertical=2, or both=0 [default]
orientation: Number between 0 and 2,
// Starting index to be focusable when first opened, 0 = first node
startIndex: Number equal to or greater than 0,
// Store parent object for nested structures like submenus and trees,  
parent: ParentInstance of RovingTabIndex if nested,
triggeringElement: The focusable DOM node that triggered this collection if applicable,
// Control auto looping.
autoLoop: true or false,
// Set breakpoints for navigating grids intuitively
breakPoint: {
// Default is 0 for both, meaning there is no breakpoint
horizontal: number greater than 0,
vertical: number greater than 0,
// Set hard stop at breakpoints, defaults to false, meaning no hard stop.
horizontalStop: true or false,
verticalStop: true or false
},
}
*/

          var that = this;
          that.typed = "";
          that.lastTyped = "";
          that.nodes = options.nodes;
          that.container = options.container || false;
          that.orientation =
            options.orientation &&
            options.orientation >= 0 &&
            options.orientation <= 2
              ? options.orientation
              : 0;
          that.index =
            options.startIndex && options.startIndex >= 0
              ? options.startIndex
              : 0;
          that.parent =
            options.parent &&
            options.parent.nodes &&
            options.parent.nodes.length
              ? options.parent
              : false;
          that.children = new Map();
          that.triggeringElement =
            options.triggeringElement &&
            options.triggeringElement.nodeType === 1
              ? options.triggeringElement
              : false;
          that.autoLoop = options.autoLoop || false;

          var handlers = [
            "Click",
            "Enter",
            "Open",
            "Close",
            "Bounds",
            "Space",
            "CtrlSpace",
            "Focus",
            "CtrlEnd",
            "CtrlHome",
            "Esc",
            "Delete",
            "CtrlPageUp",
            "AltPageUp",
            "PageUp",
            "CtrlPageDown",
            "AltPageDown",
            "PageDown"
          ];
          $A.loop(
            handlers,
            function(i, n) {
              that["handle" + n] = options["on" + n];
            },
            "array"
          );

          if (that.parent && that.triggeringElement)
            that.parent.children.set(that.triggeringElement, that);
          that.dc = options.dc || false;
          if (
            options.breakPoint &&
            (options.breakPoint.horizontal > 1 ||
              options.breakPoint.vertical > 1)
          ) {
            that.breakPoint = {
              horizontal:
                options.breakPoint.horizontal > 1
                  ? options.breakPoint.horizontal
                  : 0,
              vertical:
                options.breakPoint.vertical > 1
                  ? options.breakPoint.vertical
                  : 0,
              horizontalStop: options.breakPoint.horizontalStop ? true : false,
              verticalStop: options.breakPoint.verticalStop ? true : false
            };
          } else that.breakPoint = false;

          that.activate = function(o) {
            var i = 0;
            if (typeof o === "number") i = that.nodes[o] ? o : 0;
            else i = $A.inArray(o, that.nodes) || 0;
            if (that.nodes[i]) {
              that.index = i;
              $A.setAttr(that.nodes, {
                tabindex: -1
              });
              $A.setAttr(that.nodes[i], {
                tabindex: "0"
              });
            }
            return that;
          };

          that.setFocus = function(ev, instance, isClick) {
            instance = instance || that;
            var l = this;
            instance.activate(l);
            if (!isClick) l.focus();
            return instance;
          };

          that.focus = function(i) {
            var inst = that;
            if (typeof i !== "number") {
              i = $A.data(i, "RTI-Index") || 0;
              inst = $A.data(i, "RTI") || that;
            } else i = i || 0;
            if (inst.nodes.length && inst.nodes[i]) {
              inst.activate(i);
              inst.nodes[inst.index].focus();
            }
            return inst;
          };

          that.off = that.unbind = function() {
            $A.off(that.nodes, ".RovingTabIndex");
            return that;
          };

          that.on = that.bind = function() {
            var grid = [],
              oI = 0,
              gI = 0,
              max = 0,
              keyReset = null,
              map = new Map();

            // Prevent duplicate bindings
            that.off();

            $A.loop(
              that.nodes,
              function(i, o) {
                $A.data(o, "RTI", that);
                $A.data(o, "RTI-Index", i);
                $A.data(o, "AccName", $A.getAccName(o).name.toLowerCase());

                if (that.breakPoint) {
                  if (!grid[gI]) grid[gI] = [];
                  grid[gI].push(o);

                  map.set(o, {
                    i: i,
                    x: oI,
                    y: gI
                  });
                  max = gI;
                  if (that.breakPoint.horizontal === oI) {
                    oI = 0;
                    gI++;
                  } else oI++;
                }

                var pressed = {},
                  changePressed = function(ev) {
                    pressed.alt = ev.altKey;
                    pressed.ctrl = ev.ctrlKey;
                    pressed.shift = ev.shiftKey;
                  };

                $A.on(o, {
                  click: function(ev, dc) {
                    that.boundDC = dc;

                    var child = that.children.get(o);
                    that.index = i;
                    that.setFocus.apply(that.nodes[that.index], [ev, that]);

                    if (
                      that.handleClick &&
                      typeof that.handleClick === "function"
                    )
                      that.handleClick.apply(o, [ev, o, that, child]);

                    if (
                      that.handleOpen &&
                      typeof that.handleOpen === "function"
                    )
                      that.handleOpen.apply(o, [ev, o, that, child, false]);

                    ev.stopPropagation();
                    ev.preventDefault();
                  },
                  keydown: function(ev, dc) {
                    changePressed(ev);
                    var k = ev.which || ev.keyCode,
                      oMap = map.get(o),
                      child = null;
                    that.boundDC = dc;

                    // 37 left, 38 up, 39 right, 40 down, 35 end, 36 home
                    if (
                      k >= 35 &&
                      k <= 40 &&
                      !pressed.alt &&
                      !pressed.ctrl &&
                      !pressed.shift
                    ) {
                      var x = that.index,
                        pass = false;

                      if (
                        (k === 39 && that.orientation === 2) ||
                        (k === 40 && that.orientation === 1)
                      ) {
                        child = that.children.get(o);
                        if (
                          that.handleOpen &&
                          typeof that.handleOpen === "function"
                        )
                          that.handleOpen.apply(o, [ev, o, that, child, true]);
                        pass = true;
                      } else if (
                        (k === 37 && that.orientation === 2) ||
                        (k === 38 && that.orientation === 1)
                      ) {
                        if (
                          that.handleClose &&
                          typeof that.handleClose === "function"
                        )
                          that.handleClose.apply(o, [
                            ev,
                            o,
                            that,
                            that.parent,
                            that.triggeringElement,
                            true
                          ]);
                        pass = true;
                      } else if (
                        (k === 37 &&
                          (that.orientation === 0 || that.orientation === 1)) ||
                        (k === 38 &&
                          (that.orientation === 0 || that.orientation === 2))
                      ) {
                        if (that.breakPoint) {
                          if (
                            that.breakPoint.horizontal &&
                            (k === 37 &&
                              (that.orientation === 0 ||
                                that.orientation === 1))
                          ) {
                            if (
                              oMap.x > 0 ||
                              (oMap.x === 0 &&
                                oMap.y > 0 &&
                                !that.breakPoint.horizontalStop)
                            )
                              that.index--;
                            else if (
                              oMap.x === 0 &&
                              oMap.y === 0 &&
                              that.handleBounds &&
                              typeof that.handleBounds === "function"
                            )
                              that.handleBounds.apply(o, [ev, o, that, k]);
                          } else if (
                            that.breakPoint.vertical &&
                            (k === 38 &&
                              (that.orientation === 0 ||
                                that.orientation === 2))
                          ) {
                            if (oMap.y > 0)
                              that.index = map[grid[oMap.y - 1][oMap.x]].i;
                            else if (
                              oMap.y === 0 &&
                              that.handleBounds &&
                              typeof that.handleBounds === "function"
                            )
                              that.handleBounds.apply(o, [ev, o, that, k]);
                          }
                        } else
                          that.index =
                            that.index === 0
                              ? that.autoLoop
                                ? that.nodes.length - 1
                                : x
                              : that.index - 1;
                      } else if (
                        (k === 39 &&
                          (that.orientation === 0 || that.orientation === 1)) ||
                        (k === 40 &&
                          (that.orientation === 0 || that.orientation === 2))
                      ) {
                        if (that.breakPoint) {
                          if (
                            that.breakPoint.horizontal &&
                            (k === 39 &&
                              (that.orientation === 0 ||
                                that.orientation === 1))
                          ) {
                            if (
                              oMap.x < that.breakPoint.horizontal ||
                              (oMap.x === that.breakPoint.horizontal &&
                                oMap.y < max &&
                                !that.breakPoint.horizontalStop)
                            )
                              that.index++;
                            else if (
                              oMap.x === that.breakPoint.horizontal &&
                              oMap.y === max &&
                              that.handleBounds &&
                              typeof that.handleBounds === "function"
                            )
                              that.handleBounds.apply(o, [ev, o, that, k]);
                          } else if (
                            that.breakPoint.vertical &&
                            (k === 40 &&
                              (that.orientation === 0 ||
                                that.orientation === 2))
                          ) {
                            if (oMap.y < max)
                              that.index = map[grid[oMap.y + 1][oMap.x]].i;
                            else if (
                              oMap.y === max &&
                              that.handleBounds &&
                              typeof that.handleBounds === "function"
                            )
                              that.handleBounds.apply(o, [ev, o, that, k]);
                          }
                        } else
                          that.index =
                            that.index === that.nodes.length - 1
                              ? that.autoLoop
                                ? 0
                                : x
                              : that.index + 1;
                      } else if (k === 35) {
                        if (
                          that.breakPoint &&
                          that.breakPoint.horizontal > 0 &&
                          oMap.x < that.breakPoint.horizontal
                        )
                          that.index =
                            map[grid[oMap.y][that.breakPoint.horizontal]].i;
                        else that.index = that.nodes.length - 1;
                      } else if (k === 36) {
                        if (
                          that.breakPoint &&
                          that.breakPoint.horizontal > 0 &&
                          oMap.x > 0
                        )
                          that.index = map[grid[oMap.y][0]].i;
                        else that.index = 0;
                      }

                      if (!pass && that.index !== x)
                        that.setFocus.apply(that.nodes[that.index], [ev, that]);

                      ev.stopPropagation();
                      ev.preventDefault();
                    } else if (
                      (k === 35 || k === 36) &&
                      !pressed.alt &&
                      pressed.ctrl &&
                      !pressed.shift
                    ) {
                      if (k === 35) {
                        if (
                          that.handleCtrlEnd &&
                          typeof that.handleCtrlEnd === "function"
                        ) {
                          that.handleCtrlEnd.apply(o, [ev, o, that]);
                        }
                      } else if (k === 36) {
                        if (
                          that.handleCtrlHome &&
                          typeof that.handleCtrlHome === "function"
                        ) {
                          that.handleCtrlHome.apply(o, [ev, o, that]);
                        }
                      }
                      ev.stopPropagation();
                      ev.preventDefault();
                    } else if (
                      k === 27 &&
                      !pressed.alt &&
                      !pressed.ctrl &&
                      !pressed.shift
                    ) {
                      if (
                        that.handleEsc &&
                        typeof that.handleEsc === "function"
                      ) {
                        that.handleEsc.apply(o, [
                          ev,
                          o,
                          that,
                          that.parent,
                          that.triggeringElement
                        ]);
                        ev.stopPropagation();
                        ev.preventDefault();
                      }
                      if (
                        that.handleClose &&
                        typeof that.handleClose === "function"
                      ) {
                        that.handleClose.apply(o, [
                          ev,
                          o,
                          that,
                          that.parent,
                          that.triggeringElement,
                          false
                        ]);
                        ev.stopPropagation();
                        ev.preventDefault();
                      }
                    } else if (
                      k === 46 &&
                      !pressed.alt &&
                      !pressed.ctrl &&
                      !pressed.shift
                    ) {
                      if (
                        that.handleDelete &&
                        typeof that.handleDelete === "function"
                      ) {
                        that.handleDelete.apply(o, [ev, o, that]);
                        ev.stopPropagation();
                        ev.preventDefault();
                      }
                    } else if (k === 33 || k === 34) {
                      if (k === 33) {
                        if (!pressed.alt && pressed.ctrl && !pressed.shift) {
                          if (
                            that.handleCtrlPageUp &&
                            typeof that.handleCtrlPageUp === "function"
                          ) {
                            that.handleCtrlPageUp.apply(o, [ev, o, that]);
                            ev.stopPropagation();
                            ev.preventDefault();
                          }
                        } else if (
                          pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          if (
                            that.handleAltPageUp &&
                            typeof that.handleAltPageUp === "function"
                          ) {
                            that.handleAltPageUp.apply(o, [ev, o, that]);
                            ev.stopPropagation();
                            ev.preventDefault();
                          }
                        } else if (
                          !pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          if (
                            that.handlePageUp &&
                            typeof that.handlePageUp === "function"
                          ) {
                            that.handlePageUp.apply(o, [ev, o, that]);
                            ev.stopPropagation();
                            ev.preventDefault();
                          }
                        }
                      } else if (k === 34) {
                        if (!pressed.alt && pressed.ctrl && !pressed.shift) {
                          if (
                            that.handleCtrlPageDown &&
                            typeof that.handleCtrlPageDown === "function"
                          ) {
                            that.handleCtrlPageDown.apply(o, [ev, o, that]);
                            ev.stopPropagation();
                            ev.preventDefault();
                          }
                        } else if (
                          pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          if (
                            that.handleAltPageDown &&
                            typeof that.handleAltPageDown === "function"
                          ) {
                            that.handleAltPageDown.apply(o, [ev, o, that]);
                            ev.stopPropagation();
                            ev.preventDefault();
                          }
                        } else if (
                          !pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          if (
                            that.handlePageDown &&
                            typeof that.handlePageDown === "function"
                          ) {
                            that.handlePageDown.apply(o, [ev, o, that]);
                            ev.stopPropagation();
                            ev.preventDefault();
                          }
                        }
                      }
                    } else if ((k === 13 || k === 32) && !pressed.alt) {
                      if (k === 13) {
                        child = that.children.get(o);

                        if (
                          that.handleEnter &&
                          typeof that.handleEnter === "function"
                        )
                          that.handleEnter.apply(o, [ev, o, that, child]);
                        if (
                          that.handleOpen &&
                          typeof that.handleOpen === "function"
                        )
                          that.handleOpen.apply(o, [ev, o, that, child, false]);

                        ev.stopPropagation();
                        ev.preventDefault();
                      } else if (k === 32) {
                        if (!pressed.ctrl) {
                          if (
                            that.handleSpace &&
                            typeof that.handleSpace === "function"
                          ) {
                            that.handleSpace.apply(o, [ev, o, that, child]);
                            ev.stopPropagation();
                            ev.preventDefault();
                          }
                        } else {
                          if (
                            that.handleCtrlSpace &&
                            typeof that.handleCtrlSpace === "function"
                          ) {
                            that.handleCtrlSpace.apply(o, [ev, o, that, child]);
                            ev.stopPropagation();
                            ev.preventDefault();
                          }
                        }
                      }
                    } else if (
                      ((k >= 48 && k <= 57) || (k >= 65 && k <= 90)) &&
                      !pressed.alt &&
                      !pressed.ctrl &&
                      !pressed.shift
                    ) {
                      if (that.keyReset) clearTimeout(that.keyReset);
                      that.keyReset = setTimeout(function() {
                        that.typed = "";
                      }, 1000);

                      var move = function() {
                        if (that.lastTyped === k)
                          that.typed = String.fromCharCode(k);
                        else that.typed += String.fromCharCode(k);

                        var b = 0,
                          i = (that.index += 1),
                          e = that.nodes.length - 1,
                          f = false;

                        for (i; i <= e; i++) {
                          var name = $A.data(that.nodes[i], "AccName") || "";
                          if (name.indexOf(that.typed.toLowerCase()) === 0) {
                            f = true;
                            that.focus(i);
                            break;
                          }
                        }

                        if (!f) {
                          for (b; b < that.index; b++) {
                            var name = $A.data(that.nodes[b], "AccName") || "";
                            if (name.indexOf(that.typed.toLowerCase()) === 0) {
                              that.focus(b);
                              break;
                            }
                          }
                        }
                      };

                      move();
                      that.lastTyped = k;

                      ev.stopPropagation();
                      ev.preventDefault();
                    }
                  },
                  keyup: function(ev, dc) {
                    changePressed(ev);
                  },
                  focus: function(ev, dc) {
                    that.boundDC = dc;

                    if (
                      that.handleFocus &&
                      typeof that.handleFocus === "function"
                    )
                      that.handleFocus.apply(o, [ev, o, that]);
                  }
                });

                $A.setAttr(o, {
                  tabindex: i === that.index ? 0 : -1
                });
              },
              "array"
            );
          };

          that.on();

          return that;
        },

        /*
AccName Prototype 2.17, compute the Name and Description property values for a DOM node
https://github.com/whatsock/w3c-alternative-text-computation
*/
        getAccName: function(node, fnc, preventVisualARIASelfCSSRef) {
          var props = { name: "", desc: "" };
          if (!node || node.nodeType !== 1) {
            return props;
          }
          var rootNode = node;

          // Track nodes to prevent duplicate node reference parsing.
          var nodes = [];
          // Track aria-owns references to prevent duplicate parsing.
          var owns = [];

          // Recursively process a DOM node to compute an accessible name in accordance with the spec
          var walk = function(
            refNode,
            stop,
            skip,
            nodesToIgnoreValues,
            skipAbort,
            ownedBy
          ) {
            var fullResult = {
              name: "",
              title: ""
            };

            /*
  ARIA Role Exception Rule Set 1.1
  The following Role Exception Rule Set is based on the following ARIA Working Group discussion involving all relevant browser venders.
  https://lists.w3.org/Archives/Public/public-aria/2017Jun/0057.html
  */
            var isException = function(node, refNode) {
              if (
                !refNode ||
                !node ||
                refNode.nodeType !== 1 ||
                node.nodeType !== 1
              ) {
                return false;
              }

              var inList = function(node, list) {
                var role = getRole(node);
                var tag = node.nodeName.toLowerCase();
                return (
                  (role && list.roles.indexOf(role) >= 0) ||
                  (!role && list.tags.indexOf(tag) >= 0)
                );
              };

              // The list3 overrides must be checked first.
              if (inList(node, list3)) {
                if (
                  node === refNode &&
                  !(node.id && ownedBy[node.id] && ownedBy[node.id].node)
                ) {
                  return !isFocusable(node);
                } else {
                  // Note: the inParent checker needs to be present to allow for embedded roles matching list3 when the referenced parent is referenced using aria-labelledby, aria-describedby, or aria-owns.
                  return !(
                    (inParent(node, ownedBy.top) &&
                      node.nodeName.toLowerCase() !== "select") ||
                    inList(refNode, list1)
                  );
                }
              }
              // Otherwise process list2 to identify roles to ignore processing name from content.
              else if (
                inList(node, list2) ||
                (node === rootNode && !inList(node, list1))
              ) {
                return true;
              } else {
                return false;
              }
            };

            var inParent = function(node, parent) {
              var trackNodes = [];
              while (node) {
                if (
                  node.id &&
                  ownedBy[node.id] &&
                  ownedBy[node.id].node &&
                  trackNodes.indexOf(node) === -1
                ) {
                  trackNodes.push(node);
                  node = ownedBy[node.id].node;
                } else {
                  node = node.parentNode;
                }
                if (node && node === parent) {
                  return true;
                } else if (
                  !node ||
                  node === ownedBy.top ||
                  node === document.body
                ) {
                  return false;
                }
              }
              return false;
            };

            // Placeholder for storing CSS before and after pseudo element text values for the top level node
            var cssOP = {
              before: "",
              after: ""
            };

            if (ownedBy.ref) {
              if (isParentHidden(refNode, document.body, true, true)) {
                // If referenced via aria-labelledby or aria-describedby, do not return a name or description if a parent node is hidden.
                return fullResult;
              } else if (isHidden(refNode, document.body)) {
                // Otherwise, if aria-labelledby or aria-describedby reference a node that is explicitly hidden, then process all children regardless of their individual hidden states.
                var ignoreHidden = true;
              }
            }

            if (nodes.indexOf(refNode) === -1) {
              // Store the before and after pseudo element 'content' values for the top level DOM node
              // Note: If the pseudo element includes block level styling, a space will be added, otherwise inline is asumed and no spacing is added.
              cssOP = getCSSText(refNode, null);

              // Enabled in Visual ARIA to prevent self referencing by Visual ARIA tooltips
              if (preventVisualARIASelfCSSRef) {
                if (
                  cssOP.before.indexOf(" [ARIA] ") !== -1 ||
                  cssOP.before.indexOf(" aria-") !== -1 ||
                  cssOP.before.indexOf(" accName: ") !== -1
                )
                  cssOP.before = "";
                if (
                  cssOP.after.indexOf(" [ARIA] ") !== -1 ||
                  cssOP.after.indexOf(" aria-") !== -1 ||
                  cssOP.after.indexOf(" accDescription: ") !== -1
                )
                  cssOP.after = "";
              }
            }

            // Recursively apply the same naming computation to all nodes within the referenced structure
            var walkDOM = function(node, fn, refNode) {
              var res = {
                name: "",
                title: ""
              };
              if (!node) {
                return res;
              }
              var nodeIsBlock =
                node && node.nodeType === 1 && isBlockLevelElement(node)
                  ? true
                  : false;
              var fResult = fn(node) || {};
              if (fResult.name && fResult.name.length) {
                res.name += fResult.name;
              }
              if (!isException(node, ownedBy.top, ownedBy)) {
                node = node.firstChild;
                while (node) {
                  res.name += walkDOM(node, fn, refNode).name;
                  node = node.nextSibling;
                }
              }
              res.name += fResult.owns || "";
              if (rootNode === node && !trim(res.name) && trim(fResult.title)) {
                res.name = addSpacing(fResult.title);
              } else if (refNode === node && rootNode === node) {
                res.title = addSpacing(fResult.title);
              }
              if (trim(fResult.desc)) {
                res.title = addSpacing(fResult.desc);
              }
              if (nodeIsBlock || fResult.isWidget) {
                res.name = addSpacing(res.name);
              }
              return res;
            };

            fullResult = walkDOM(
              refNode,
              function(node) {
                var i = 0;
                var element = null;
                var ids = [];
                var parts = [];
                var result = {
                  name: "",
                  title: "",
                  owns: ""
                };
                var isEmbeddedNode =
                  node &&
                  node.nodeType === 1 &&
                  nodesToIgnoreValues &&
                  nodesToIgnoreValues.length &&
                  nodesToIgnoreValues.indexOf(node) !== -1 &&
                  node === rootNode &&
                  node !== refNode
                    ? true
                    : false;

                if (
                  (skip ||
                    !node ||
                    nodes.indexOf(node) !== -1 ||
                    (!ignoreHidden && isHidden(node, ownedBy.top))) &&
                  !skipAbort &&
                  !isEmbeddedNode
                ) {
                  // Abort if algorithm step is already completed, or if node is a hidden child of refNode, or if this node has already been processed, or skip abort if aria-labelledby self references same node.
                  return result;
                }

                if (nodes.indexOf(node) === -1) {
                  nodes.push(node);
                }

                // Store name for the current node.
                var name = "";
                // Store name from aria-owns references if detected.
                var ariaO = "";
                // Placeholder for storing CSS before and after pseudo element text values for the current node container element
                var cssO = {
                  before: "",
                  after: ""
                };

                var parent = refNode === node ? node : node.parentNode;
                if (nodes.indexOf(parent) === -1) {
                  nodes.push(parent);
                  // Store the before and after pseudo element 'content' values for the current node container element
                  // Note: If the pseudo element includes block level styling, a space will be added, otherwise inline is asumed and no spacing is added.
                  cssO = getCSSText(parent, refNode);

                  // Enabled in Visual ARIA to prevent self referencing by Visual ARIA tooltips
                  if (preventVisualARIASelfCSSRef) {
                    if (
                      cssO.before.indexOf(" [ARIA] ") !== -1 ||
                      cssO.before.indexOf(" aria-") !== -1 ||
                      cssO.before.indexOf(" accName: ") !== -1
                    )
                      cssO.before = "";
                    if (
                      cssO.after.indexOf(" [ARIA] ") !== -1 ||
                      cssO.after.indexOf(" aria-") !== -1 ||
                      cssO.after.indexOf(" accDescription: ") !== -1
                    )
                      cssO.after = "";
                  }
                }

                // Process standard DOM element node
                if (node.nodeType === 1) {
                  var aLabelledby = node.getAttribute("aria-labelledby") || "";
                  var aDescribedby =
                    node.getAttribute("aria-describedby") || "";
                  var aLabel = node.getAttribute("aria-label") || "";
                  var nTitle = node.getAttribute("title") || "";
                  var nTag = node.nodeName.toLowerCase();
                  var nRole = getRole(node);

                  var isNativeFormField = nativeFormFields.indexOf(nTag) !== -1;
                  var isNativeButton = ["input"].indexOf(nTag) !== -1;
                  var isRangeWidgetRole =
                    rangeWidgetRoles.indexOf(nRole) !== -1;
                  var isEditWidgetRole = editWidgetRoles.indexOf(nRole) !== -1;
                  var isSelectWidgetRole =
                    selectWidgetRoles.indexOf(nRole) !== -1;
                  var isSimulatedFormField =
                    isRangeWidgetRole ||
                    isEditWidgetRole ||
                    isSelectWidgetRole ||
                    nRole === "combobox";
                  var isWidgetRole =
                    (isSimulatedFormField ||
                      otherWidgetRoles.indexOf(nRole) !== -1) &&
                    nRole !== "link";
                  result.isWidget = isNativeFormField || isWidgetRole;

                  var hasName = false;
                  var aOwns = node.getAttribute("aria-owns") || "";
                  var isSeparatChildFormField =
                    !isEmbeddedNode &&
                    ((node !== refNode &&
                      (isNativeFormField || isSimulatedFormField)) ||
                      (node.id &&
                        ownedBy[node.id] &&
                        ownedBy[node.id].target &&
                        ownedBy[node.id].target === node))
                      ? true
                      : false;

                  if (!stop && node === refNode) {
                    // Check for non-empty value of aria-labelledby if current node equals reference node, follow each ID ref, then stop and process no deeper.
                    if (aLabelledby) {
                      ids = aLabelledby.split(/\s+/);
                      parts = [];
                      for (i = 0; i < ids.length; i++) {
                        element = document.getElementById(ids[i]);
                        // Also prevent the current form field from having its value included in the naming computation if nested as a child of label
                        parts.push(
                          walk(
                            element,
                            true,
                            skip,
                            [node],
                            element === refNode,
                            {
                              ref: ownedBy,
                              top: element
                            }
                          ).name
                        );
                      }
                      // Check for blank value, since whitespace chars alone are not valid as a name
                      name = trim(parts.join(" "));

                      if (trim(name)) {
                        hasName = true;
                        // Abort further recursion if name is valid.
                        skip = true;
                      }
                    }

                    // Check for non-empty value of aria-describedby if current node equals reference node, follow each ID ref, then stop and process no deeper.
                    if (aDescribedby) {
                      var desc = "";
                      ids = aDescribedby.split(/\s+/);
                      parts = [];
                      for (i = 0; i < ids.length; i++) {
                        element = document.getElementById(ids[i]);
                        // Also prevent the current form field from having its value included in the naming computation if nested as a child of label
                        parts.push(
                          walk(element, true, false, [node], false, {
                            ref: ownedBy,
                            top: element
                          }).name
                        );
                      }
                      // Check for blank value, since whitespace chars alone are not valid as a name
                      desc = trim(parts.join(" "));

                      if (trim(desc)) {
                        result.desc = desc;
                      }
                    }
                  }

                  // Otherwise, if the current node is a nested widget control within the parent ref obj, then add only its value and process no deeper within the branch.
                  if (isSeparatChildFormField) {
                    // Prevent the referencing node from having its value included in the case of form control labels that contain the element with focus.
                    if (
                      !(
                        nodesToIgnoreValues &&
                        nodesToIgnoreValues.length &&
                        nodesToIgnoreValues.indexOf(node) !== -1
                      )
                    ) {
                      if (isRangeWidgetRole) {
                        // For range widgets, append aria-valuetext if non-empty, or aria-valuenow if non-empty, or node.value if applicable.
                        name = getObjectValue(nRole, node, true);
                      } else if (
                        isEditWidgetRole ||
                        (nRole === "combobox" && isNativeFormField)
                      ) {
                        // For simulated edit widgets, append text from content if applicable, or node.value if applicable.
                        name = getObjectValue(nRole, node, false, true);
                      } else if (isSelectWidgetRole) {
                        // For simulated select widgets, append same naming computation algorithm for all child nodes including aria-selected="true" separated by a space when multiple.
                        // Also filter nodes so that only valid child roles of relevant parent role that include aria-selected="true" are included.
                        name = getObjectValue(nRole, node, false, false, true);
                      } else if (
                        isNativeFormField &&
                        ["input", "textarea"].indexOf(nTag) !== -1 &&
                        (!isWidgetRole || isEditWidgetRole)
                      ) {
                        // For native edit fields, append node.value when applicable.
                        name = getObjectValue(
                          nRole,
                          node,
                          false,
                          false,
                          false,
                          true
                        );
                      } else if (
                        isNativeFormField &&
                        nTag === "select" &&
                        (!isWidgetRole || nRole === "combobox")
                      ) {
                        // For native select fields, get text from content for all options with selected attribute separated by a space when multiple, but don't process if another widget role is present unless it matches role="combobox".
                        // Reference: https://github.com/WhatSock/w3c-alternative-text-computation/issues/7
                        name = getObjectValue(
                          nRole,
                          node,
                          false,
                          false,
                          true,
                          true
                        );
                      }

                      // Check for blank value, since whitespace chars alone are not valid as a name
                      name = trim(name);
                    }

                    if (trim(name)) {
                      hasName = true;
                    }
                  }

                  // Otherwise, if current node has a non-empty aria-label then set as name and process no deeper within the branch.
                  if (!hasName && trim(aLabel) && !isSeparatChildFormField) {
                    name = aLabel;

                    // Check for blank value, since whitespace chars alone are not valid as a name
                    if (trim(name)) {
                      hasName = true;
                      if (node === refNode) {
                        // If name is non-empty and both the current and refObject nodes match, then don't process any deeper within the branch.
                        skip = true;
                      }
                    }
                  }

                  // Otherwise, if name is still empty and the current node matches the ref node and is a standard form field with a non-empty associated label element, process label with same naming computation algorithm.
                  if (!hasName && node === refNode && isNativeFormField) {
                    // Logic modified to match issue
                    // https://github.com/WhatSock/w3c-alternative-text-computation/issues/12 */
                    var labels = document.querySelectorAll("label");
                    var implicitLabel = getParent(node, "label") || false;
                    var explicitLabel =
                      node.id &&
                      document.querySelectorAll('label[for="' + node.id + '"]')
                        .length
                        ? document.querySelector('label[for="' + node.id + '"]')
                        : false;
                    var implicitI = 0;
                    var explicitI = 0;
                    for (i = 0; i < labels.length; i++) {
                      if (labels[i] === implicitLabel) {
                        implicitI = i;
                      } else if (labels[i] === explicitLabel) {
                        explicitI = i;
                      }
                    }
                    var isImplicitFirst =
                      implicitLabel &&
                      implicitLabel.nodeType === 1 &&
                      explicitLabel &&
                      explicitLabel.nodeType === 1 &&
                      implicitI < explicitI
                        ? true
                        : false;

                    if (explicitLabel) {
                      var eLblName = trim(
                        walk(explicitLabel, true, skip, [node], false, {
                          ref: ownedBy,
                          top: explicitLabel
                        }).name
                      );
                    }
                    if (implicitLabel && implicitLabel !== explicitLabel) {
                      var iLblName = trim(
                        walk(implicitLabel, true, skip, [node], false, {
                          ref: ownedBy,
                          top: implicitLabel
                        }).name
                      );
                    }

                    if (iLblName && eLblName && isImplicitFirst) {
                      name = iLblName + " " + eLblName;
                    } else if (eLblName && iLblName) {
                      name = eLblName + " " + iLblName;
                    } else if (eLblName) {
                      name = eLblName;
                    } else if (iLblName) {
                      name = iLblName;
                    }

                    if (trim(name)) {
                      hasName = true;
                    }
                  }

                  // Process native form field buttons in accordance with the HTML AAM
                  // https://w3c.github.io/html-aam/#accessible-name-and-description-computation
                  var btnType =
                    (isNativeButton && node.getAttribute("type")) || false;
                  var btnValue =
                    (btnType && trim(node.getAttribute("value"))) || false;

                  var rolePresentation =
                    !hasName &&
                    nRole &&
                    presentationRoles.indexOf(nRole) !== -1 &&
                    !isFocusable(node) &&
                    !hasGlobalAttr(node)
                      ? true
                      : false;
                  var nAlt = rolePresentation
                    ? ""
                    : trim(node.getAttribute("alt"));

                  // Otherwise, if name is still empty and current node is a standard non-presentational img or image button with a non-empty alt attribute, set alt attribute value as the accessible name.
                  if (
                    !hasName &&
                    !rolePresentation &&
                    (nTag === "img" || btnType === "image") &&
                    nAlt
                  ) {
                    // Check for blank value, since whitespace chars alone are not valid as a name
                    name = trim(nAlt);
                    if (trim(name)) {
                      hasName = true;
                    }
                  }

                  if (
                    !hasName &&
                    node === refNode &&
                    btnType &&
                    ["button", "image", "submit", "reset"].indexOf(btnType) !==
                      -1
                  ) {
                    if (btnValue) {
                      name = btnValue;
                    } else {
                      switch (btnType) {
                        case "submit":
                        case "image":
                          name = "Submit Query";
                          break;
                        case "reset":
                          name = "Reset";
                          break;
                        default:
                          name = "";
                      }
                    }
                    if (trim(name)) {
                      hasName = true;
                    }
                  }

                  if (
                    hasName &&
                    node === refNode &&
                    btnType &&
                    ["button", "submit", "reset"].indexOf(btnType) !== -1 &&
                    btnValue &&
                    btnValue !== name &&
                    !result.desc
                  ) {
                    result.desc = btnValue;
                  }

                  // Otherwise, if current node is the same as rootNode and is non-presentational and includes a non-empty title attribute and is not a separate embedded form field, store title attribute value as the accessible name if name is still empty, or the description if not.
                  if (
                    node === rootNode &&
                    !rolePresentation &&
                    trim(nTitle) &&
                    !isSeparatChildFormField
                  ) {
                    result.title = trim(nTitle);
                  }

                  // Check for non-empty value of aria-owns, follow each ID ref, then process with same naming computation.
                  // Also abort aria-owns processing if contained on an element that does not support child elements.
                  if (aOwns && !isNativeFormField && nTag !== "img") {
                    ids = aOwns.split(/\s+/);
                    parts = [];
                    for (i = 0; i < ids.length; i++) {
                      element = document.getElementById(ids[i]);
                      // Abort processing if the referenced node has already been traversed
                      if (element && owns.indexOf(ids[i]) === -1) {
                        owns.push(ids[i]);
                        var oBy = { ref: ownedBy, top: ownedBy.top };
                        oBy[ids[i]] = {
                          refNode: refNode,
                          node: node,
                          target: element
                        };
                        if (!isParentHidden(element, document.body, true)) {
                          parts.push(
                            walk(element, true, skip, [], false, oBy).name
                          );
                        }
                      }
                    }
                    // Join without adding whitespace since this is already handled by parsing individual nodes within the algorithm steps.
                    ariaO = parts.join("");
                  }
                }

                // Otherwise, process text node
                else if (node.nodeType === 3) {
                  name = node.data;
                }

                // Prepend and append the current CSS pseudo element text, plus normalize all whitespace such as newline characters and others into flat spaces.
                name = cssO.before + name.replace(/\s+/g, " ") + cssO.after;

                if (
                  name.length &&
                  !hasParentLabelOrHidden(
                    node,
                    ownedBy.top,
                    ownedBy,
                    ignoreHidden
                  )
                ) {
                  result.name = name;
                }

                result.owns = ariaO;

                return result;
              },
              refNode
            );

            // Prepend and append the refObj CSS pseudo element text, plus normalize whitespace chars into flat spaces.
            fullResult.name =
              cssOP.before + fullResult.name.replace(/\s+/g, " ") + cssOP.after;

            return fullResult;
          };

          var getRole = function(node) {
            var role =
              node && node.getAttribute ? node.getAttribute("role") : "";
            if (!trim(role)) {
              return "";
            }
            var inList = function(list) {
              return trim(role).length > 0 && list.roles.indexOf(role) >= 0;
            };
            var roles = role.split(/\s+/);
            for (var i = 0; i < roles.length; i++) {
              role = roles[i];
              if (
                inList(list1) ||
                inList(list2) ||
                inList(list3) ||
                presentationRoles.indexOf(role) !== -1
              ) {
                return role;
              }
            }
            return "";
          };

          var isFocusable = function(node) {
            var nodeName = node.nodeName.toLowerCase();
            if (node.getAttribute("tabindex")) {
              return true;
            }
            if (nodeName === "a" && node.getAttribute("href")) {
              return true;
            }
            if (
              ["button", "input", "select", "textarea"].indexOf(nodeName) !==
                -1 &&
              node.getAttribute("type") !== "hidden"
            ) {
              return true;
            }
            return false;
          };

          // ARIA Role Exception Rule Set 1.1
          // The following Role Exception Rule Set is based on the following ARIA Working Group discussion involving all relevant browser venders.
          // https://lists.w3.org/Archives/Public/public-aria/2017Jun/0057.html

          // Always include name from content when the referenced node matches list1, as well as when child nodes match those within list3
          // Note: gridcell was added to list1 to account for focusable gridcells that match the ARIA 1.0 paradigm for interactive grids.
          var list1 = {
            roles: [
              "button",
              "checkbox",
              "link",
              "option",
              "radio",
              "switch",
              "tab",
              "treeitem",
              "menuitem",
              "menuitemcheckbox",
              "menuitemradio",
              "cell",
              "gridcell",
              "columnheader",
              "rowheader",
              "tooltip",
              "heading"
            ],
            tags: [
              "a",
              "button",
              "summary",
              "input",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "menuitem",
              "option",
              "td",
              "th"
            ]
          };
          // Never include name from content when current node matches list2
          var list2 = {
            roles: [
              "application",
              "alert",
              "log",
              "marquee",
              "timer",
              "alertdialog",
              "dialog",
              "banner",
              "complementary",
              "form",
              "main",
              "navigation",
              "region",
              "search",
              "article",
              "document",
              "feed",
              "figure",
              "img",
              "math",
              "toolbar",
              "menu",
              "menubar",
              "grid",
              "listbox",
              "radiogroup",
              "textbox",
              "searchbox",
              "spinbutton",
              "scrollbar",
              "slider",
              "tablist",
              "tabpanel",
              "tree",
              "treegrid",
              "separator"
            ],
            tags: [
              "article",
              "aside",
              "body",
              "select",
              "datalist",
              "optgroup",
              "dialog",
              "figure",
              "footer",
              "form",
              "header",
              "hr",
              "img",
              "textarea",
              "input",
              "main",
              "math",
              "menu",
              "nav",
              "section"
            ]
          };
          // As an override of list2, conditionally include name from content if current node is focusable, or if the current node matches list3 while the referenced parent node matches list1.
          var list3 = {
            roles: [
              "term",
              "definition",
              "directory",
              "list",
              "group",
              "note",
              "status",
              "table",
              "rowgroup",
              "row",
              "contentinfo"
            ],
            tags: [
              "dl",
              "ul",
              "ol",
              "dd",
              "details",
              "output",
              "table",
              "thead",
              "tbody",
              "tfoot",
              "tr"
            ]
          };

          var nativeFormFields = ["button", "input", "select", "textarea"];
          var rangeWidgetRoles = ["scrollbar", "slider", "spinbutton"];
          var editWidgetRoles = ["searchbox", "textbox"];
          var selectWidgetRoles = [
            "grid",
            "listbox",
            "tablist",
            "tree",
            "treegrid"
          ];
          var otherWidgetRoles = [
            "button",
            "checkbox",
            "link",
            "switch",
            "option",
            "menu",
            "menubar",
            "menuitem",
            "menuitemcheckbox",
            "menuitemradio",
            "radio",
            "tab",
            "treeitem",
            "gridcell"
          ];
          var presentationRoles = ["presentation", "none"];

          var hasGlobalAttr = function(node) {
            var globalPropsAndStates = [
              "busy",
              "controls",
              "current",
              "describedby",
              "details",
              "disabled",
              "dropeffect",
              "errormessage",
              "flowto",
              "grabbed",
              "haspopup",
              "invalid",
              "keyshortcuts",
              "live",
              "owns",
              "roledescription"
            ];
            for (var i = 0; i < globalPropsAndStates.length; i++) {
              var a = trim(
                node.getAttribute("aria-" + globalPropsAndStates[i])
              );
              if (a) {
                return true;
              }
            }
            return false;
          };

          var isHidden = function(node, refNode) {
            var hidden = function(node) {
              if (node.nodeType !== 1 || node === refNode) {
                return false;
              }
              if (node.getAttribute("aria-hidden") === "true") {
                return true;
              }
              if (node.getAttribute("hidden")) {
                return true;
              }
              var style = getStyleObject(node);
              if (
                style["display"] === "none" ||
                style["visibility"] === "hidden"
              ) {
                return true;
              }
              return false;
            };
            return hidden(node);
          };

          var isParentHidden = function(node, refNode, skipOwned, skipCurrent) {
            while (node && node !== refNode) {
              if (
                !skipCurrent &&
                node.nodeType === 1 &&
                isHidden(node, refNode)
              ) {
                return true;
              } else skipCurrent = false;
              node = node.parentNode;
            }
            return false;
          };

          var getStyleObject = function(node) {
            var style = {};
            if (document.defaultView && document.defaultView.getComputedStyle) {
              style = document.defaultView.getComputedStyle(node, "");
            } else if (node.currentStyle) {
              style = node.currentStyle;
            }
            return style;
          };

          var cleanCSSText = function(node, text) {
            var s = text;
            if (s.indexOf("attr(") !== -1) {
              var m = s.match(/attr\((.|\n|\r\n)*?\)/g);
              for (var i = 0; i < m.length; i++) {
                var b = m[i].slice(5, -1);
                b = node.getAttribute(b) || "";
                s = s.replace(m[i], b);
              }
            }
            return s || text;
          };

          var isBlockLevelElement = function(node, cssObj) {
            var styleObject = cssObj || getStyleObject(node);
            for (var prop in blockStyles) {
              var values = blockStyles[prop];
              for (var i = 0; i < values.length; i++) {
                if (
                  styleObject[prop] &&
                  ((values[i].indexOf("!") === 0 &&
                    [values[i].slice(1), "inherit", "initial", "unset"].indexOf(
                      styleObject[prop]
                    ) === -1) ||
                    styleObject[prop].indexOf(values[i]) !== -1)
                ) {
                  return true;
                }
              }
            }
            if (
              !cssObj &&
              node.nodeName &&
              blockElements.indexOf(node.nodeName.toLowerCase()) !== -1
            ) {
              return true;
            }
            return false;
          };

          // CSS Block Styles indexed from:
          // https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
          var blockStyles = {
            display: ["block", "grid", "table", "flow-root", "flex"],
            position: ["absolute", "fixed"],
            float: ["left", "right", "inline"],
            clear: ["left", "right", "both", "inline"],
            overflow: ["hidden", "scroll", "auto"],
            "column-count": ["!auto"],
            "column-width": ["!auto"],
            "column-span": ["all"],
            contain: ["layout", "content", "strict"]
          };

          // HTML5 Block Elements indexed from:
          // https://github.com/webmodules/block-elements
          // Note: 'br' was added to this array because it impacts visual display and should thus add a space .
          // Reference issue: https://github.com/w3c/accname/issues/4
          // Note: Added in 1.13, td, th, tr, and legend
          var blockElements = [
            "address",
            "article",
            "aside",
            "blockquote",
            "br",
            "canvas",
            "dd",
            "div",
            "dl",
            "dt",
            "fieldset",
            "figcaption",
            "figure",
            "footer",
            "form",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "header",
            "hgroup",
            "hr",
            "legend",
            "li",
            "main",
            "nav",
            "noscript",
            "ol",
            "output",
            "p",
            "pre",
            "section",
            "table",
            "td",
            "tfoot",
            "th",
            "tr",
            "ul",
            "video"
          ];

          var getObjectValue = function(
            role,
            node,
            isRange,
            isEdit,
            isSelect,
            isNative
          ) {
            var val = "";
            var bypass = false;

            if (isRange && !isNative) {
              val =
                node.getAttribute("aria-valuetext") ||
                node.getAttribute("aria-valuenow") ||
                "";
            } else if (isEdit && !isNative) {
              val = getText(node) || "";
            } else if (isSelect && !isNative) {
              var childRoles = [];
              if (role === "grid" || role === "treegrid") {
                childRoles = ["gridcell", "rowheader", "columnheader"];
              } else if (role === "listbox") {
                childRoles = ["option"];
              } else if (role === "tablist") {
                childRoles = ["tab"];
              } else if (role === "tree") {
                childRoles = ["treeitem"];
              }
              val = joinSelectedParts(
                node,
                node.querySelectorAll('*[aria-selected="true"]'),
                false,
                childRoles
              );
              bypass = true;
            }
            val = trim(val);
            if (!val && (isRange || isEdit) && node.value) {
              val = node.value;
            }
            if (!bypass && !val && isNative) {
              if (isSelect) {
                val = joinSelectedParts(
                  node,
                  node.querySelectorAll("option[selected]"),
                  true
                );
              } else {
                val = node.value;
              }
            }

            return val;
          };

          var addSpacing = function(s) {
            return trim(s).length ? " " + s + " " : " ";
          };

          var joinSelectedParts = function(node, nOA, isNative, childRoles) {
            if (!nOA || !nOA.length) {
              return "";
            }
            var parts = [];
            for (var i = 0; i < nOA.length; i++) {
              var role = getRole(nOA[i]);
              var isValidChildRole =
                !childRoles || childRoles.indexOf(role) !== -1;
              if (isValidChildRole) {
                parts.push(
                  isNative
                    ? getText(nOA[i])
                    : walk(nOA[i], true, false, [], false, { top: nOA[i] }).name
                );
              }
            }
            return parts.join(" ");
          };

          var getPseudoElStyleObj = function(node, position) {
            var styleObj = {};
            for (var prop in blockStyles) {
              styleObj[prop] = document.defaultView
                .getComputedStyle(node, position)
                .getPropertyValue(prop);
            }
            styleObj["content"] = document.defaultView
              .getComputedStyle(node, position)
              .getPropertyValue("content")
              .replace(/^"|\\|"$/g, "");
            return styleObj;
          };

          var getText = function(node, position) {
            if (!position && node.nodeType === 1) {
              return node.innerText || node.textContent || "";
            }
            var styles = getPseudoElStyleObj(node, position);
            var text = styles["content"];
            if (!text || text === "none") {
              return "";
            }
            if (isBlockLevelElement({}, styles)) {
              if (position === ":before") {
                text += " ";
              } else if (position === ":after") {
                text = " " + text;
              }
            }
            return text;
          };

          var getCSSText = function(node, refNode) {
            if (
              (node && node.nodeType !== 1) ||
              node === refNode ||
              ["input", "select", "textarea", "img", "iframe"].indexOf(
                node.nodeName.toLowerCase()
              ) !== -1
            ) {
              return { before: "", after: "" };
            }
            if (document.defaultView && document.defaultView.getComputedStyle) {
              return {
                before: cleanCSSText(node, getText(node, ":before")),
                after: cleanCSSText(node, getText(node, ":after"))
              };
            } else {
              return { before: "", after: "" };
            }
          };

          var getParent = function(node, nTag) {
            while (node) {
              node = node.parentNode;
              if (
                node &&
                node.nodeName &&
                node.nodeName.toLowerCase() === nTag
              ) {
                return node;
              }
            }
            return {};
          };

          var hasParentLabelOrHidden = function(
            node,
            refNode,
            ownedBy,
            ignoreHidden
          ) {
            var trackNodes = [];
            while (node && node !== refNode) {
              if (
                node.id &&
                ownedBy &&
                ownedBy[node.id] &&
                ownedBy[node.id].node &&
                trackNodes.indexOf(node) === -1
              ) {
                trackNodes.push(node);
                node = ownedBy[node.id].node;
              } else {
                node = node.parentNode;
              }
              if (node && node.getAttribute) {
                if (
                  trim(node.getAttribute("aria-label")) ||
                  (!ignoreHidden && isHidden(node, refNode))
                ) {
                  return true;
                }
              }
            }
            return false;
          };

          var trim = function(str) {
            if (typeof str !== "string") {
              return "";
            }
            return str.replace(/^\s+|\s+$/g, "");
          };

          if (isParentHidden(node, document.body, true)) {
            return props;
          }

          // Compute accessible Name and Description properties value for node
          var accProps = walk(node, false, false, [], false, { top: node });

          var accName = trim(accProps.name.replace(/\s+/g, " "));
          var accDesc = trim(accProps.title.replace(/\s+/g, " "));

          if (accName === accDesc) {
            // If both Name and Description properties match, then clear the Description property value.
            accDesc = "";
          }

          props.name = accName;
          props.desc = accDesc;

          // Clear track variables
          nodes = [];
          owns = [];

          if (fnc && typeof fnc === "function") {
            return fnc.apply(node, [node, props]);
          } else {
            return props;
          }
        },

        genId: function(obj) {
          if (this.isClonedAccDCObject) {
            obj = this.currentObject;
          }
          var id = "AccDC" + now();
          if (obj && typeof obj === "string") {
            obj = $A._stringToNode(obj);
            obj = $A._checkStoredNodes(obj, true);
          }
          if (obj && obj.nodeType === 1) {
            obj.id = id;
            if (this.isClonedAccDCObject) {
              this.currentObject = obj;
              return this;
            } else return obj;
          }
          return id;
        },

        announce: function(str, noRepeat, aggr) {
          if (this.isClonedAccDCObject) {
            aggr = noRepeat;
            noRepeat = str;
            str = this.currentObject;
          }
          if (!str) return this.isClonedAccDCObject ? this : str;
          var s = $A._checkStoredNodes(str, true);
          announceString.apply(s, [s, noRepeat, aggr]);
          if (this.isClonedAccDCObject) {
            this.currentObject = str;
            return this;
          } else return str;
        },

        focus: function(obj) {
          if (this.isClonedAccDCObject) {
            obj = this.currentObject;
          }
          if (!obj || obj.nodeType !== 1)
            return this.isClonedAccDCObject ? this : obj;
          $A._setFocus(obj);
          if (this.isClonedAccDCObject) {
            this.currentObject = obj;
            return this;
          } else return obj;
        },

        isFocusWithin: function(o) {
          if (this.isClonedAccDCObject) {
            o = this.currentObject;
          }
          if (o && o.nodeType === 1 && o.appendChild) {
            return $A.query("*:focus", o).length > 0;
          }
          return false;
        },

        isFocusable: function(node, usingFocus) {
          if (this.isClonedAccDCObject) {
            usingFocus = node;
            node = this.currentObject;
          }
          var nodeName = node.nodeName.toLowerCase(),
            tabI = parseInt($A.getAttr(node, "tabindex"), 10);
          if (
            (usingFocus && typeof tabI === "number") ||
            (!usingFocus && typeof tabI === "number" && tabI >= 0)
          ) {
            return true;
          }
          if (nodeName === "a" && $A.getAttr(node, "href")) {
            return true;
          }
          if (
            ["button", "input", "select", "textarea"].indexOf(nodeName) !==
              -1 &&
            $A.getAttr(node, "type") !== "hidden"
          ) {
            return true;
          }
          return false;
        },

        _setFocus: function(o) {
          if (o && o.nodeType === 1) {
            if (!$A.isFocusable(o)) $A.setAttr(o, "tabindex", -1);
            o.focus();
          }
          return o;
        }
      });

      $A.extend({
        // Variable method names for alternative usage
        getElement: $A["getEl"],
        createElement: $A["createEl"],
        getAttribute: $A["getAttr"],
        removeAttribute: $A["remAttr"],
        setAttribute: $A["setAttr"],
        previousSibling: $A["prevSibling"],
        previous: $A["prevSibling"],
        next: $A["nextSibling"],
        first: $A["firstChild"],
        last: $A["lastChild"],
        parent: $A["closestParent"],
        removeClass: $A["remClass"],
        getOffset: $A["_offset"],
        addIdReference: $A["addIdRef"],
        removeIdReference: $A["remIdRef"],
        generateId: $A["genId"],
        toTextNode: $A["createText"],

        // Deprecated but here for backwards compadibility
        bind: $A["on"],
        unbind: $A["off"]
      });

      (function(global) {
        var counter = 0;
        var scriptMap = new Map();
        $A.ScriptCache = function(config) {
          var scripts = new Map();
          $A.loop(
            config.scripts,
            function(i, url) {
              scripts[url] = url;
            },
            "array"
          );
          const Cache = {};

          Cache._onLoad = function(key) {
            return cb => {
              var stored = scriptMap.get(key);
              if (stored) {
                stored.promise.then(() => {
                  stored.error ? cb(stored.error) : cb(null, stored);
                });
              } else {
              }
            };
          };

          Cache._scriptTag = (key, src) => {
            if (!scriptMap.has(key)) {
              var tag = $A.createEl(config.tag);

              var promise = new Promise((resolve, reject) => {
                tag.async = config.async || false; // Default: Load in order
                const cbName = `loaderCB${counter++}${Date.now()}`;
                var cb;

                var handleResult = state => {
                  return evt => {
                    var stored = scriptMap.get(key);
                    if (state === "loaded") {
                      stored.resolved = true;
                      resolve(src);
                      // stored.handlers.loop(h => h.call(null, stored))
                      // stored.handlers = []
                    } else if (state === "error") {
                      stored.errored = true;
                      // stored.handlers.loop(h => h.call(null, stored))
                      // stored.handlers = [];
                      reject(evt);
                    }

                    cleanup();
                  };
                };

                const cleanup = () => {
                  if (global[cbName] && typeof global[cbName] === "function") {
                    global[cbName] = null;
                  }
                };

                tag.onload = handleResult("loaded");
                tag.onerror = handleResult("error");
                tag.onreadystatechange = () => {
                  handleResult(tag.readyState);
                };

                // Pick off callback, if there is one
                if (src.match(/callback=CALLBACK_NAME/)) {
                  src = src.replace(/(callback=)[^&]+/, `$1${cbName}`);
                  cb = window[cbName] = tag.onload;
                } else {
                  tag.addEventListener("load", tag.onload);
                }
                tag.addEventListener("error", tag.onerror);

                if (config.tag === "script") {
                  tag.type = "text/javascript";
                  tag.src = src;
                } else if (config.tag === "link") {
                  tag.type = "text/css";
                  tag.rel = "stylesheet";
                  tag.href = src;
                } else if (config.tag === "img") {
                  tag.src = src;
                  tag.alt = "";
                }

                (config.context || document.head || document.body).appendChild(
                  tag
                );
                return tag;
              });
              var initialState = {
                loaded: false,
                error: false,
                promise: promise,
                tag
              };
              scriptMap.set(key, initialState);
            }
            return scriptMap.get(key);
          };

          Object.keys(scripts).loop(function(key) {
            const script = scripts[key];
            Cache[key] = {
              tag: Cache._scriptTag(key, script),
              onLoad: Cache._onLoad(key)
            };
          });

          return Cache;
        };
      })(window);

      var announceString = function(strm, noRep, aggr, loop) {
        var str = strm;
        if (!arguments.length || typeof str === "boolean") {
          loop = aggr;
          aggr = noRep;
          noRep = str;
          strm = this;
          str = strm;
        }
        if (typeof str === "number") {
          str = str.toString();
        } else if (str && str.nodeType) {
          str = $A.getText(str);
        }
        if (str && typeof str === "string") {
          var uA = function() {
            if (stringAnnounce.loaded) {
              if (
                !stringAnnounce.liveRendered &&
                !aggr &&
                stringAnnounce.placeHolder
              ) {
                stringAnnounce.liveRendered = true;
                document.body.appendChild(stringAnnounce.placeHolder);
              }
              if (
                !stringAnnounce.alertRendered &&
                aggr &&
                stringAnnounce.placeHolder2
              ) {
                stringAnnounce.alertRendered = true;
                document.body.appendChild(stringAnnounce.placeHolder2);
              }
            }
            if (!loop && $A.inArray(str, stringAnnounce.alertMsgs) === -1)
              stringAnnounce.alertMsgs.push(str);
            if (stringAnnounce.alertMsgs.length === 1 || loop) {
              var timeLength =
                stringAnnounce.baseDelay +
                stringAnnounce.iterate(
                  stringAnnounce.alertMsgs[0],
                  /\s|,|\.|:|;|!|\(|\)|\/|\?|@|#|\$|%|\^|&|\*|\\|-|_|\+|=/g
                ) *
                  stringAnnounce.charMultiplier;
              if (
                !(
                  noRep &&
                  stringAnnounce.lastMsg === stringAnnounce.alertMsgs[0]
                )
              ) {
                stringAnnounce.lastMsg = stringAnnounce.alertMsgs[0];
                if (aggr)
                  $A.insertHTML(
                    stringAnnounce.alertMsgs[0],
                    stringAnnounce.placeHolder2
                  );
                else
                  $A.insertHTML(
                    stringAnnounce.alertMsgs[0],
                    stringAnnounce.placeHolder
                  );
              }
              stringAnnounce.alertTO = setTimeout(function() {
                $A.insertHTML("", stringAnnounce.placeHolder);
                $A.insertHTML("", stringAnnounce.placeHolder2);
                stringAnnounce.alertMsgs.shift();
                if (stringAnnounce.alertMsgs.length >= 1)
                  announceString(
                    stringAnnounce.alertMsgs[0],
                    noRep,
                    aggr,
                    true
                  );
              }, timeLength);
            }
          };
          if (!$A.documentLoaded)
            window.addEventListener("load", function() {
              uA();
            });
          else uA();
        }
        return strm;
      };

      String.prototype.announce = announceString;

      var stringAnnounce = {
        alertMsgs: [],
        clear: function() {
          if (this.alertTO) clearTimeout(this.alertTO);
          this.alertMsgs = [];
        },
        baseDelay: 500,
        charMultiplier: 1,
        lastMsg: "",
        iterate: function(str, regExp) {
          var iCount = 0;
          str.replace(regExp, function() {
            iCount++;
          });
          return iCount;
        },
        loaded: false,
        liveRendered: false,
        alertRendered: false
      };

      window.addEventListener("load", function() {
        $A.documentLoaded = true;
        if (!stringAnnounce.placeHolder) {
          stringAnnounce.placeHolder = $A.createEl(
            "div",
            {
              "aria-live": "polite"
            },
            $A.sraCSS
          );
          stringAnnounce.placeHolder2 = $A.createEl(
            "div",
            {
              role: "alert"
            },
            $A.sraCSS
          );
        }
        stringAnnounce.loaded = true;
      });

      var GenAccDC = function(AccDCObjects, gImport, parentDC) {
        var wheel = [],
          getScript = function(DC, u, f, isLink) {
            var dc = wheel[DC.indexVal];
            var urls = $A.isArray(u) ? u : [u],
              Cache = new $A.ScriptCache({
                tag: isLink ? "link" : "script",
                async: false,
                context: isLink ? dc.outerNode : null,
                scripts: urls
              });
            $A.loop(
              urls,
              function(i, u) {
                Cache[u].onLoad(() => {
                  if (f && typeof f === "function") f.apply(dc, [dc, u]);
                });
              },
              "array"
            );
            return dc;
          },
          changeTabs = function(DC, isClose) {
            var dc = wheel[DC.indexVal];
            if ((dc.isTab || dc.isToggle) && dc.toggleClassName) {
              if (isClose && (dc.trigger || dc.triggerObj)) {
                $A.query(dc.trigger || dc.triggerObj, function(i, o) {
                  $A.remClass(o, dc.toggleClassName);
                });
              } else if (dc.trigger || dc.triggerObj) {
                $A.query(dc.trigger || dc.triggerObj, function(i, o) {
                  $A.toggleClass(
                    o,
                    dc.toggleClassName,
                    this === dc.triggerObj ? dc.loaded : false
                  );
                });
              }
            }
            return dc;
          },
          parseScripts = function(DC, type) {
            var dc = wheel[DC.indexVal],
              ranJSOnce = "ranJSOnce" + type,
              runJSOnce = "runJSOnce" + type,
              runOnce = "runOnce" + type,
              runJS = "runJS" + type,
              run = "run" + type;
            if (!dc[ranJSOnce]) {
              dc[ranJSOnce] = true;
              if (dc.reverseJSOrder) {
                dc[runOnce].apply(dc, [dc]);
                if (dc.allowCascade) {
                  if (dc.fn.proto[runOnce])
                    dc.fn.proto[runOnce].apply(dc, [dc]);
                  if ($A.fn.globalDC[runOnce])
                    $A.fn.globalDC[runOnce].apply(dc, [dc]);
                }
                dc.reverseJSOrderPass = true;
              }
              if (dc[runJSOnce].length) {
                getScript(dc, dc[runJSOnce]);
              }
              if (dc.allowCascade) {
                if (dc.fn.proto[runJSOnce] && dc.fn.proto[runJSOnce].length) {
                  getScript(dc, dc.fn.proto[runJSOnce]);
                }
                if (
                  $A.fn.globalDC[runJSOnce] &&
                  $A.fn.globalDC[runJSOnce].length
                ) {
                  getScript(dc, $A.fn.globalDC[runJSOnce]);
                }
              }
              if (!dc.reverseJSOrder && !dc.reverseJSOrderPass) {
                dc[runOnce].apply(dc, [dc]);
                if (dc.allowCascade) {
                  if (dc.fn.proto[runOnce])
                    dc.fn.proto[runOnce].apply(dc, [dc]);
                  if ($A.fn.globalDC[runOnce])
                    $A.fn.globalDC[runOnce].apply(dc, [dc]);
                }
              } else dc.reverseJSOrderPass = false;
            }
            if (dc.reverseJSOrder) {
              dc[run].apply(dc, [dc]);
              if (dc.allowCascade) {
                if (dc.fn.proto[run]) dc.fn.proto[run].apply(dc, [dc]);
                if ($A.fn.globalDC[run]) $A.fn.globalDC[run].apply(dc, [dc]);
              }
              dc.reverseJSOrderPass = true;
            }
            if (dc[runJS].length) {
              getScript(dc, dc[runJS]);
            }
            if (dc.allowCascade) {
              if (dc.fn.proto[runJS] && dc.fn.proto[runJS].length) {
                getScript(dc, dc.fn.proto[runJS]);
              }
              if ($A.fn.globalDC[runJS] && $A.fn.globalDC[runJS].length) {
                getScript(dc, $A.fn.globalDC[runJS]);
              }
            }
            if (!dc.reverseJSOrder && !dc.reverseJSOrderPass) {
              dc[run].apply(dc, [dc]);
              if (dc.allowCascade) {
                if (dc.fn.proto[run]) dc.fn.proto[run].apply(dc, [dc]);
                if ($A.fn.globalDC[run]) $A.fn.globalDC[run].apply(dc, [dc]);
              }
            } else dc.reverseJSOrderPass = false;
            return dc;
          },
          loadAccDCObj = function(DC) {
            var dc = wheel[DC.indexVal];
            if (
              (dc.loaded && !dc.allowReopen && !dc.isToggle) ||
              dc.fn.override ||
              dc.lock ||
              dc.loading ||
              dc.closing
            ) {
              return dc;
            } else if (dc.loaded && (dc.allowReopen || dc.isToggle)) {
              dc.fn.bypass = true;
              closeAccDCObj(dc);
              dc.fn.bypass = false;
              if (dc.isToggle) return dc;
            }
            var w = 0,
              wt = null,
              wtA = [];
            if (dc.widgetType && $A._widgetTypes.length) {
              for (w = 0; w < $A._widgetTypes.length; w++) {
                wt = $A.reg.get($A._widgetTypes[w]);
                if (
                  wt &&
                  wt.autoCloseWidget &&
                  wt.loaded &&
                  wt.widgetType !== dc.widgetType
                ) {
                  wt.fn.bypass = true;
                  wt.close();
                  wt.fn.bypass = false;
                }
              }
            }
            if (
              dc.widgetType &&
              dc.autoCloseSameWidget &&
              $A._regWidgets.has(dc.widgetType)
            ) {
              wtA = $A._regWidgets.get(dc.widgetType);
              for (w = 0; w < wtA.length; w++) {
                wt = $A.reg.get(wtA[w]);
                if (wt && wt.loaded) {
                  wt.fn.bypass = true;
                  wt.close();
                  wt.fn.bypass = false;
                }
              }
            }
            dc.cancel = false;

            dc.fn.baseId = $A.genId();
            dc.outerNodeId = dc.fn.baseId;
            dc.closeId = dc.fn.baseId + "CL";
            dc.sraStartId = dc.fn.baseId + "ST";
            dc.containerId = dc.fn.baseId + "CO";

            dc.fn.sraStart = $A.createEl(
              "div",
              {
                id: dc.sraStartId,
                tabindex: -1,
                // Sets the Description property so that screen readers are likely to announce the main container when focus is first set, however this requires a valid role be present
                "aria-describedby": dc.containerId,
                role: "status"
              },
              {
                "outline-style": "none"
              }
            );
            $A.setOffScreen(dc.fn.sraStart);
            dc.fn.closeLink = $A.createEl(
              "a",
              {
                id: dc.closeId,
                href: "#close"
              },
              $A.sraCSS,
              dc.closeClassName
            );

            if (!dc.sourceOnly) {
              dc.container = $A.createEl("div", {
                id: dc.containerId
              });
              dc.outerNode = dc.accDCObj = $A.createEl("div", {
                id: dc.outerNodeId
              });
              dc.outerNode.appendChild(dc.container);
            }

            parseScripts(dc, "Before");

            if (dc.cancel) {
              dc.cancel = dc.loading = false;
              return dc;
            }

            dc.loading = true;

            if (
              ReactDOM &&
              ReactHtmlParser &&
              dc.source &&
              dc.RenderUsingReact &&
              !dc.mode
            ) {
              var rC = $A.toReact(dc.source);
              if (rC) {
                dc.React.component = rC;
                if (!$A._isMorphedDC(dc)) dc.source = "";
              }
            }

            if (ReactDOM && dc.React.component) {
              parseRemaining(dc);
            } else {
              switch (dc.mode) {
                case 1:
                  $A.load(
                    dc.source || dc.fetch.url,
                    dc.container,
                    dc.fetch.data,
                    function(content, promise) {
                      dc.fetch.success(content, promise, dc);
                      parseRemaining(dc);
                    },
                    function(errorMsg, promise) {
                      dc.fetch.error(errorMsg, promise, dc);
                    }
                  );
                  break;
                case 2:
                  $A.get({
                    url: dc.source || dc.fetch.url,
                    data: dc.fetch.data,
                    success: function(content, promise) {
                      dc.fetch.success(content, promise, dc);
                      if (dc.sourceOnly) {
                        dc.outerNode = dc.container = $A.toNode(
                          dc.content,
                          true
                        );
                      } else {
                        $A.insert(dc.content, dc.container);
                      }
                      parseRemaining(dc);
                    },
                    error: function(errorMsg, promise) {
                      dc.fetch.error(errorMsg, promise, dc);
                    }
                  });
                  break;
                default:
                  if (!$A._isMorphedDC(dc)) {
                    if (dc.sourceOnly) {
                      dc.outerNode = dc.container = $A.toNode(dc.source, true);
                      parseRemaining(dc);
                    } else {
                      $A.insert(dc.source, dc.container, function() {
                        parseRemaining(dc);
                      });
                    }
                  } else {
                    parseRemaining(dc);
                  }
              }
            }

            return dc;
          },
          parseRemaining = function(DC) {
            var dc = wheel[DC.indexVal];

            if (dc.outerNode && dc.container) {
              if (dc.exposeBounds) {
                dc.setAttr({
                  role: "region",
                  "aria-label": dc.role
                });
              }
              if (dc.displayInline)
                $A.css([dc.outerNode, dc.container], "display", "inline");
              if (dc.cssObj) $A.css(dc.outerNode, dc.cssObj);
              if (dc.autoFix) setAutoFix(dc);
            }

            dc.runDuring.apply(dc, [dc]);
            if (dc.allowCascade) {
              if (dc.fn.proto.runDuring) dc.fn.proto.runDuring.apply(dc, [dc]);
              if ($A.fn.globalDC.runDuring)
                $A.fn.globalDC.runDuring.apply(dc, [dc]);
            }
            if (dc.cancel) {
              dc.cancel = dc.loading = false;
              return dc;
            }

            for (var w = 0; w < dc.siblings.length; w++) {
              var sb = dc.siblings[w];
              if (sb.loaded && !sb.allowMultiple) {
                sb.fn.bypass = true;
                sb.close();
                sb.fn.bypass = false;
              }
            }

            if (dc.outerNode && dc.container) {
              if ($A._isMorphedDC(dc)) {
                dc.fn.isMorphedAccDCObject = false;
                if (
                  dc.source &&
                  dc.source.nodeType === 1 &&
                  dc.source.parentNode &&
                  dc.source.parentNode.nodeType === 1 &&
                  !dc.root &&
                  !dc.triggerObj &&
                  !dc.targetObj
                ) {
                  dc.before = dc.prepend = dc.append = dc.after = false;
                  if ($A.next(dc.source)) {
                    dc.root = $A.next(dc.source);
                    dc.before = true;
                  } else if ($A.previous(dc.source)) {
                    dc.root = $A.previous(dc.source);
                    dc.after = true;
                  } else if (dc.source.parentNode) {
                    dc.root = dc.source.parentNode;
                  }
                  $A.before(dc.outerNode, dc.source);
                  if (dc.React.component) {
                    $A.remove(dc.source);
                    dc.source = "";
                  } else {
                    $A.insert(dc.source, dc.container);
                    dc.source = dc.container.innerHTML;
                  }
                }
              } else if (dc.root) {
                if ($A.isChain(dc.root)) dc.root = dc.root.return();

                if (dc.before) {
                  if (typeof dc.before === "function")
                    dc.before.apply(dc, [dc.outerNode, dc.root]);
                  else $A.before(dc.outerNode, dc.root);
                } else if (dc.prepend) {
                  if (typeof dc.prepend === "function")
                    dc.prepend.apply(dc, [dc.outerNode, dc.root]);
                  else {
                    try {
                      $A.prepend(dc.outerNode, dc.root);
                    } catch (e) {
                      $A.before(dc.outerNode, dc.root);
                    }
                  }
                } else if (dc.append) {
                  if (typeof dc.append === "function")
                    dc.append.apply(dc, [dc.outerNode, dc.root]);
                  else {
                    try {
                      $A.append(dc.outerNode, dc.root);
                    } catch (e) {
                      $A.after(dc.outerNode, dc.root);
                    }
                  }
                } else if (dc.after) {
                  if (typeof dc.after === "function")
                    dc.after.apply(dc, [dc.outerNode, dc.root]);
                  else $A.after(dc.outerNode, dc.root);
                } else {
                  $A.insert(dc.outerNode, dc.root);
                }
              } else if (dc.targetObj)
                $A._insertAfter(dc.outerNode, dc.targetObj);
              else if (dc.triggerObj)
                $A._insertAfter(dc.outerNode, dc.triggerObj);
            }

            var complete = function() {
              if (dc.className) dc.addClass(dc.className);
              if (dc.forceFocus) $A.prepend(dc.fn.sraStart, dc.outerNode);
              if (dc.exposeHiddenClose) {
                $A.insertHTML(dc.hiddenCloseName, dc.fn.closeLink);
                $A.on(dc.fn.closeLink, {
                  click: function(ev) {
                    dc.close();
                    ev.preventDefault();
                    ev.stopPropagation();
                  }
                });
                if (dc.displayHiddenClose)
                  $A.on(dc.fn.closeLink, {
                    focus: function(ev) {
                      var disableC = dc.tabOut(ev, dc) ? true : false;
                      if (!disableC) {
                        $A.clearOffScreen(this);
                      }
                    },
                    blur: function(ev) {
                      $A.setOffScreen(this);
                    }
                  });
                else $A.setAttr(dc.fn.closeLink, "tabindex", "-1");
                dc.outerNode.appendChild(dc.fn.closeLink);
              }
              var events = {
                  mouseOver: function(ev) {
                    dc.mouseOver.apply(this, [ev, dc]);
                  },
                  mouseOut: function(ev) {
                    dc.mouseOut.apply(this, [ev, dc]);
                  },
                  resize: function(ev) {
                    dc.resize.apply(this, [ev, dc]);
                  },
                  scroll: function(ev) {
                    dc.scroll.apply(this, [ev, dc]);
                  },
                  click: function(ev) {
                    dc.click.apply(this, [ev, dc]);
                  },
                  dblClick: function(ev) {
                    dc.dblClick.apply(this, [ev, dc]);
                  },
                  mouseDown: function(ev) {
                    dc.mouseDown.apply(this, [ev, dc]);
                  },
                  mouseUp: function(ev) {
                    dc.mouseUp.apply(this, [ev, dc]);
                  },
                  mouseMove: function(ev) {
                    dc.mouseMove.apply(this, [ev, dc]);
                  },
                  mouseEnter: function(ev) {
                    dc.mouseEnter.apply(this, [ev, dc]);
                  },
                  mouseLeave: function(ev) {
                    dc.mouseLeave.apply(this, [ev, dc]);
                  },
                  keyDown: function(ev) {
                    dc.keyDown.apply(this, [ev, dc]);
                  },
                  keyPress: function(ev) {
                    dc.keyPress.apply(this, [ev, dc]);
                  },
                  keyUp: function(ev) {
                    dc.keyUp.apply(this, [ev, dc]);
                  },
                  error: function(ev) {
                    dc.error.apply(this, [ev, dc]);
                  },
                  focusIn: function(ev) {
                    dc.focusIn.apply(this, [ev, dc]);
                  },
                  focusOut: function(ev) {
                    dc.focusOut.apply(this, [ev, dc]);
                  }
                },
                toBind = {};
              for (var ev in events) {
                if (dc[ev] && typeof dc[ev] === "function")
                  toBind[ev.toLowerCase()] = events[ev];
              }
              $A.on(dc.outerNode, toBind);
              if (dc.importCSS) {
                getScript(dc, dc.importCSS, null, true);
              }
              if (dc.autoPosition > 0 && !dc.root && !dc.autoFix) {
                $A._calcPosition(dc);
              }
              var forceFocus = dc.forceFocus;
              dc.loading = false;
              dc.loaded = true;
              if (dc.isTab || dc.isToggle) changeTabs(dc);
              if (dc.timeoutVal)
                dc.timer = setTimeout(function() {
                  dc.timeout(dc);
                }, dc.timeoutVal);
              parseScripts(dc, "After");
              if (dc.autoFix) sizeAutoFix(dc);
              if (forceFocus) $A._setFocus(dc.fn.sraStart);
              if ($A.bootstrap) $A.bootstrap(dc.container);
              if (dc.announce) $A.announce(dc.container);
              if (
                ReactDOM &&
                dc.React.component &&
                dc.React.component.forceUpdate
              ) {
                dc.React.component.forceUpdate();
              }
            };

            $A.lastLoaded = dc;
            if (ReactDOM && dc.React.component) {
              ReactDOM.render(dc.React.component, dc.container, function() {
                $A.data(dc.container, "HasReactComponent", true);
                complete();
              });
            } else {
              complete();
            }
            return dc;
          },
          closeAccDCObj = function(DC) {
            var dc = wheel[DC.indexVal];
            dc.runBeforeClose.apply(dc, [dc]);
            if (dc.allowCascade) {
              if (dc.fn.proto.runBeforeClose)
                dc.fn.proto.runBeforeClose.apply(dc, [dc]);
              if ($A.fn.globalDC.runBeforeClose)
                $A.fn.globalDC.runBeforeClose.apply(dc, [dc]);
            }
            if (!dc.loaded || dc.lock) return dc;
            dc.closing = true;
            if (ReactDOM && $A.data(dc.container, "HasReactComponent")) {
              $A.unmount(dc.container);
            }
            $A.empty(dc.outerNode, true);
            if (dc.fn.containsFocus && !dc.fn.bypass) dc.fn.toggleFocus = true;
            dc.fn.override = true;
            if (dc.returnFocus && dc.triggerObj && !dc.fn.bypass) {
              $A._setFocus(dc.triggerObj);
            }
            dc.loaded = dc.fn.override = false;
            if (dc.isTab || dc.isToggle) changeTabs(dc, true);
            dc.fn.triggerObj = dc.triggerObj;
            dc.closing = false;
            dc.runAfterClose.apply(dc, [dc]);
            if (dc.allowCascade) {
              if (dc.fn.proto.runAfterClose)
                dc.fn.proto.runAfterClose.apply(dc, [dc]);
              if ($A.fn.globalDC.runAfterClose) {
                $A.fn.globalDC.runAfterClose.apply(dc, [dc]);
              }
            }
            return dc;
          },
          unsetTrigger = function(DC) {
            var dc = wheel[DC.indexVal];
            $A.query(dc.fn.trigger, function() {
              $A.off(this, dc.fn.bind);
              if (dc.isTab || dc.isToggle) $A.remove($A.data(this, "sra"));
            });
            dc.fn.trigger = dc.fn.bind = "";
            return dc;
          },
          setTrigger = function(DC) {
            var dc = wheel[DC.indexVal];
            unsetTrigger(dc);
            setBindings(dc);
            return dc;
          },
          setAutoFix = function(DC) {
            var dc = wheel[DC.indexVal];
            if (!dc.loading && !dc.loaded) return dc;
            var cs = {
              position: "fixed",
              right: "",
              bottom: "",
              top: "",
              left: ""
            };
            switch (dc.autoFix) {
              case 1:
                cs.top = 0;
                cs.left = "40%";
                break;
              case 2:
                cs.top = 0;
                cs.right = 0;
                break;
              case 3:
                cs.top = "40%";
                cs.right = 0;
                break;
              case 4:
                cs.bottom = 0;
                cs.right = 0;
                break;
              case 5:
                cs.bottom = 0;
                cs.left = "40%";
                break;
              case 6:
                cs.bottom = 0;
                cs.left = 0;
                break;
              case 7:
                cs.top = "40%";
                cs.left = 0;
                break;
              case 8:
                cs.top = 0;
                cs.left = 0;
                break;
              case 9:
                cs.top = "40%";
                cs.left = "40%";
                break;
              default:
                cs = dc.cssObj;
            }
            $A.css(dc.outerNode, cs);
            return dc;
          },
          sizeAutoFix = function(DC) {
            var dc = wheel[DC.indexVal];
            if (!dc.loading && !dc.loaded) return dc;
            var win = $A._getWindow();
            var bodyW = win.width,
              bodyH = win.height,
              aW = $A.elementWidth(dc.outerNode),
              aH = $A.elementHeight(dc.outerNode);
            var npw = 50;
            if (bodyW > aW) npw = parseInt(aW / bodyW * 100 / 2, 10);
            var nph = 50;
            if (bodyH > aH) nph = parseInt(aH / bodyH * 100 / 2, 10);
            switch (dc.autoFix) {
              case 1:
              case 5:
                $A.css(dc.outerNode, "left", 50 - npw + "%");
                break;
              case 3:
              case 7:
                $A.css(dc.outerNode, "top", 50 - nph + "%");
                break;
              case 9:
                $A.css(dc.outerNode, {
                  left: 50 - npw + "%",
                  top: 50 - nph + "%"
                });
                break;
              default:
            }
            if (
              dc.offsetTop < 0 ||
              dc.offsetTop > 0 ||
              dc.offsetLeft < 0 ||
              dc.offsetLeft > 0
            ) {
              var cs = $A._offset(dc.outerNode);
              cs.top += dc.offsetTop;
              cs.left += dc.offsetLeft;
              $A.css(dc.outerNode, cs);
            }
            return dc;
          },
          setBindings = function(dc) {
            dc.fn.toggleFocus = dc.fn.containsFocus = false;
            dc.trigger = dc.trigger || dc.triggerObj;
            dc.fn.trigger = dc.trigger;
            dc.fn.bind = dc.on;
            var cFocus = {},
              isOnClick = false;
            if (dc.on && typeof dc.on === "string") {
              var cF = dc.on.split(/\s+/);
              for (var i = 0; i < cF.length; i++) cFocus[cF[i]] = i;
            }
            $A.loop(
              cFocus,
              function(k, v) {
                if ($A.inArray("focus", k) === 0) dc.fn.containsFocus = true;
                else if ($A.inArray("click", k) >= 0) isOnClick = true;
              },
              "object"
            );
            if (!$A.data(dc.id, "DC-ON")) {
              $A.data(dc.id, "DC", dc);
              $A.data(dc.id, "DC-ON", true);
            }
            if (dc.trigger)
              $A.query(dc.trigger, function(i, o) {
                if (!$A.data(o, "DC-ON")) {
                  $A.data(o, "DC", dc);
                  $A.data(o, "DC-ON", true);
                }
                if (dc.on && typeof dc.on === "string") {
                  if (
                    !dc.suppressClickSupport &&
                    isOnClick &&
                    !$A.isFocusable(o)
                  ) {
                    $A.setAttr(o, "tabindex", 0);
                    $A.on(o, {
                      keydown: function(ev) {
                        var k = ev.which || ev.keyCode;
                        if (k === 13) {
                          dc.triggerObj = o;
                          dc.open();
                          ev.preventDefault();
                          ev.stopPropagation();
                        }
                      }
                    });
                  }
                  $A.on(o, dc.on, function(ev) {
                    dc.triggerObj = o;
                    dc.open();
                    ev.preventDefault();
                    ev.stopPropagation();
                  });
                } else if (dc.on && typeof dc.on === "object") {
                  $A.loop(
                    dc.on,
                    function(e, fn) {
                      $A.on(o, e, function(ev, dcO) {
                        dcO.triggerObj = o;
                        fn.call(o, ev, dcO);
                      });
                    },
                    "object"
                  );
                }
              });
            return dc;
          },
          AccDCInit = function(dc) {
            if ($A.reg.has(dc.id)) {
              $A.destroy(dc.id);
            }
            var f = function() {};
            f.prototype = dc;
            var nDC = new f();
            nDC.props.DC = nDC.DC = nDC;
            setBindings(nDC);
            if (React && nDC.React.component) {
              nDC.React.component = React.cloneElement(nDC.React.component, {
                DC: nDC
              });
              if (
                nDC.React.parent &&
                nDC.React.parent.props &&
                $A.isDC(nDC.React.parent.props.DC)
              ) {
                var pDC = nDC.React.parent.props.DC;
                nDC.parent = pDC;
                if (pDC.children.indexOf(nDC) === -1) {
                  pDC.children.push(nDC);
                }
              }
            }
            $A.lastCreated.push(nDC);
            if (nDC.widgetType && nDC.autoCloseWidget) {
              $A._widgetTypes.push(nDC.id);
            }
            if (nDC.widgetType && nDC.autoCloseSameWidget) {
              if (!$A._regWidgets.has(nDC.widgetType))
                $A._regWidgets.set(nDC.widgetType, []);
              $A._regWidgets.get(nDC.widgetType).push(nDC.id);
            }
            $A.reg.set(nDC.id, nDC);
            return nDC;
          },
          autoStart = [],
          svs = [
            "runJSOnceBefore",
            "runOnceBefore",
            "runJSBefore",
            "runBefore",
            "runDuring",
            "runJSOnceAfter",
            "runOnceAfter",
            "runJSAfter",
            "runAfter",
            "runBeforeClose",
            "runAfterClose"
          ];

        var a = 0,
          s = 0;

        for (a = 0; a < AccDCObjects.length; a++) {
          var dc = {
              id: "",
              role: "",
              loaded: false,

              fn: {
                isAccDCObject: true
              },
              props: {},

              setOffScreen: function() {
                var dc = this;
                $A.setOffScreen(dc.outerNode);
                return dc;
              },

              clearOffScreen: function() {
                var dc = this;
                $A.clearOffScreen(dc.outerNode);
                return dc;
              },

              getOffset: function(
                forceAbsolute,
                forceRelative,
                returnTopLeftOnly
              ) {
                var dc = this;
                return $A.getOffset(
                  dc.outerNode,
                  forceAbsolute,
                  forceRelative,
                  returnTopLeftOnly
                );
              },

              trigger: "",
              setTrigger: function(dc) {
                var dc = dc || this;
                if (!dc.trigger || !dc.on) {
                  return dc;
                }
                return setTrigger(dc);
              },
              unsetTrigger: function(dc) {
                var dc = dc || this;
                if (!dc.fn.trigger || !dc.fn.bind) return dc;
                return unsetTrigger(dc);
              },
              targetObj: null,

              hiddenCloseName: "Close",
              exposeHiddenClose: false,
              displayHiddenClose: true,
              exposeBounds: false,

              React: {
                component: null
              },

              query: function(sel, con, call) {
                var dc = this;
                call = con;
                con = dc.container;
                return $A.query(sel, con, call);
              },

              getNode: function() {
                var dc = this,
                  o = dc.React.component;
                if ($A.isReact(o)) {
                  try {
                    return ReactDOM.findDOMNode(o);
                  } catch (e) {}
                }
                return null;
              },

              source: "",
              sourceOnly: false,

              on: "",
              displayInline: false,

              widgetType: "",
              autoCloseWidget: false,
              autoCloseSameWidget: false,

              allowCascade: false,
              reverseJSOrder: false,
              runJSOnceBefore: [],
              runOnceBefore: function(dc) {},
              runJSBefore: [],
              runBefore: function(dc) {},
              runDuring: function(dc) {},
              runJSOnceAfter: [],
              runOnceAfter: function(dc) {},
              runJSAfter: [],
              runAfter: function(dc) {},
              runBeforeClose: function(dc) {},
              runAfterClose: function(dc) {},
              runBeforeDestroy: function(dc) {},

              destroy: function(p) {
                var dc = this;
                setTimeout(function() {
                  $A.destroy(dc, p);
                }, 1);
                return true;
              },

              getAttr: function(n) {
                var dc = this;
                return $A.getAttr(dc.outerNode, n);
              },
              remAttr: function(n) {
                var dc = this;
                $A.remAttr(dc.outerNode, n);
                return dc;
              },
              setAttr: function(n, v) {
                var dc = this;
                $A.setAttr(dc.outerNode, n, v);
                return dc;
              },

              hasClass: function(cn) {
                var dc = this;
                return $A.hasClass(dc.outerNode, cn);
              },

              addClass: function(cn) {
                var dc = this;
                $A.addClass(dc.outerNode, cn);
                return dc;
              },

              remClass: function(cn) {
                var dc = this;
                $A.remClass(dc.outerNode, cn);
                return dc;
              },

              toggleClass: function(cn, isTrue, fn) {
                var dc = this;
                $A.toggleClass(dc.outerNode, cn, isTrue, fn);
                return dc;
              },

              focus: function() {
                var dc = this;
                if (dc.loaded) $A._setFocus(dc.outerNode);
                return dc;
              },

              allowMultiple: true,
              allowReopen: false,
              isToggle: false,
              toggleClassName: "",
              forceFocus: false,
              returnFocus: true,

              root: "",
              before: false,
              prepend: false,
              append: false,
              after: false,

              isTab: false,
              autoStart: false,
              lock: false,
              mode: 0,

              announce: false,
              speak: function(alert) {
                var dc = this;
                $A.announce(dc.container, false, alert);
                return dc;
              },

              load: function(url, data, sCb) {
                var dc = this;
                if (typeof data === "function") {
                  sCb = data;
                  data = null;
                }
                $A.load(url, dc.container, data, sCb);
                return dc;
              },

              fetch: {
                url: "",
                data: {
                  returnType: "html"
                },
                success: function(content, promise, dc) {},
                error: function(errorMsg, promise, dc) {}
              },

              isFocusWithin: function(dc) {
                var dc = dc || this;
                return $A.isFocusWithin(dc.container);
              },

              open: function(dc) {
                var dc = dc || this;
                if (dc.fn.toggleFocus) {
                  dc.fn.toggleFocus = false;
                } else {
                  loadAccDCObj(dc);
                }
                return dc;
              },

              setProps: function(conf) {
                var dc = this;
                $A.extend(true, dc.props, conf || {});
                dc.props.DC = dc;
                return dc;
              },

              insert: function(node) {
                var dc = this;
                $A.insert(node, dc.container);
                return dc;
              },

              prependWithin: function(node) {
                var dc = this;
                $A.prepend(node, dc.container);
                return dc;
              },

              appendWithin: function(node) {
                var dc = this;
                $A.append(node, dc.container);
                return dc;
              },

              openWithin: function(node, conf) {
                var dc = this;
                dc.before = dc.prepend = dc.append = dc.after = false;
                $A.extend(
                  dc,
                  {
                    root: node
                  },
                  conf || {}
                );
                dc.reopen();
                return dc;
              },

              insertBefore: function(node, conf) {
                var dc = this;
                dc.before = dc.prepend = dc.append = dc.after = false;
                $A.extend(
                  dc,
                  {
                    root: node,
                    before: true
                  },
                  conf || {}
                );
                dc.reopen();
                return dc;
              },

              prependTo: function(node, conf) {
                var dc = this;
                dc.before = dc.prepend = dc.append = dc.after = false;
                $A.extend(
                  dc,
                  {
                    root: node,
                    prepend: true
                  },
                  conf || {}
                );
                dc.reopen();
                return dc;
              },

              appendTo: function(node, conf) {
                var dc = this;
                dc.before = dc.prepend = dc.append = dc.after = false;
                $A.extend(
                  dc,
                  {
                    root: node,
                    append: true
                  },
                  conf || {}
                );
                dc.reopen();
                return dc;
              },

              insertAfter: function(node, conf) {
                var dc = this;
                dc.before = dc.prepend = dc.append = dc.after = false;
                $A.extend(
                  dc,
                  {
                    root: node,
                    after: true
                  },
                  conf || {}
                );
                dc.reopen();
                return dc;
              },

              reopen: function(dc) {
                var dc = dc || this;
                dc.close().open();
                return dc;
              },

              close: function(dc) {
                var dc = dc || this;
                return closeAccDCObj(dc);
              },

              /*
// Index of events plus returned arguments when set withinDC objects
mouseOver: function(ev, dc){ },
mouseOut: function(ev, dc){ },
resize: function(ev, dc){ },
scroll: function(ev, dc){ },
click: function(ev, dc){ },
dblClick: function(ev, dc){ },
mouseDown: function(ev, dc){ },
mouseUp: function(ev, dc){ },
mouseMove: function(ev, dc){ },
mouseEnter: function(ev, dc){ },
mouseLeave: function(ev, dc){ },
keyDown: function(ev, dc){ },
keyPress: function(ev, dc){ },
keyUp: function(ev, dc){ },
error: function(ev, dc){ },
focusIn: function(ev, dc){ },
focusOut: function(ev, dc){ },
*/

              tabOut: function(ev, dc) {},
              timeoutVal: 0,
              timeout: function(dc) {},

              className: "",
              closeClassName: "CloseDC",
              cssObj: {},
              importCSS: "",
              css: function(prop, val, mergeCSS) {
                var dc = this;
                if (typeof val === "boolean") {
                  mergeCSS = val;
                  val = null;
                }
                if (
                  typeof prop === "string" &&
                  typeof val !== "string" &&
                  typeof val !== "number"
                ) {
                  return $A.css(dc.outerNode, prop);
                } else if (prop && typeof prop === "string" && mergeCSS) {
                  dc.cssObj[prop] = val;
                } else if (prop && typeof prop === "object" && mergeCSS) {
                  $A.extend(dc.cssObj, prop);
                }
                $A.css(dc.outerNode, prop, val);
                return dc;
              },

              map: function(o, extend) {
                var dc = this;
                if (!o) o = {};

                var inList = function(DC, dcA) {
                  for (var i = 0; i < dcA.length; i++) {
                    if (dcA[i].id === DC.id) {
                      return true;
                    }
                  }
                  return false;
                };

                if ($A.isDC(o.parent)) {
                  dc.parent = o.parent;
                }

                if ($A.isArray(o.children)) {
                  if (!extend) dc.children = [];
                  for (var i = 0; i < o.children.length; i++) {
                    if ($A.isDC(o.children[i])) {
                      o.children[i].parent = dc;
                      if (!inList(o.children[i], dc.children))
                        dc.children.push(o.children[i]);
                    }
                  }
                }

                if ($A.isArray(o.siblings)) {
                  if (!extend) dc.siblings = [dc];
                  for (var i = 0; i < o.siblings.length; i++) {
                    if ($A.isDC(o.siblings[i])) {
                      if (!inList(o.siblings[i], dc.siblings))
                        dc.siblings.push(o.siblings[i]);
                    }
                  }
                }

                dc.top = dc;
                var p = dc.parent;
                while (
                  $A.isDC(p) &&
                  (!dc.widgetType || dc.widgetType === p.widgetType)
                ) {
                  dc.top = p;
                  p = p.parent;
                }

                if (dc.parent && !extend) dc.parent.children = [];
                $A.loop(
                  dc.siblings,
                  function(x, DC) {
                    if ($A.isDC(DC)) {
                      DC.parent = dc.parent;
                      DC.siblings = dc.siblings;
                      if (dc.parent && !inList(DC, dc.parent.children))
                        dc.parent.children.push(DC);
                    }
                  },
                  "array"
                );

                var setTop = function(a) {
                  for (var i = 0; i < a.length; i++) {
                    if ($A.isDC(a[i]) && a[i].children.length) {
                      $A.loop(
                        a[i].children,
                        function(x, DC) {
                          if ($A.isDC(DC)) {
                            setTop(DC.siblings);
                          }
                        },
                        "array"
                      );
                    }
                    if ($A.isDC(a[i])) a[i].top = dc.top;
                  }
                };
                setTop(dc.siblings);

                return dc;
              },

              children: [],
              siblings: [],
              parent: null,
              top: null,

              autoPosition: 0,
              offsetTop: 0,
              offsetLeft: 0,
              posAnchor: null,

              setPosition: function(obj, posVal, save) {
                var dc = this;
                if (typeof obj === "number") {
                  save = posVal;
                  posVal = obj;
                  obj = null;
                }
                if (save) {
                  dc.posAnchor = obj || dc.posAnchor;
                  dc.autoPosition = posVal || dc.autoPosition;
                }
                $A._calcPosition(dc, obj, posVal);
                return dc;
              },

              setFix: function(posVal, save) {
                var dc = this;
                if (save) {
                  dc.autoFix = posVal || dc.autoFix;
                }
                setAutoFix(dc);
                if (posVal > 0) sizeAutoFix(dc);
                return dc;
              }
            },
            aO = AccDCObjects[a],
            gImport = gImport || {},
            gO = {},
            iO = {};

          $A.extend(dc, {
            mount: dc["open"],
            unmount: dc["close"],
            mountWithin: dc["openWithin"],
            insertWithin: dc["openWithin"],
            getAttribute: dc["getAttr"],
            removeAttribute: dc["remAttr"],
            setAttribute: dc["setAttr"],
            removeClass: dc["remClass"]
          });

          if (typeof aO.allowCascade !== "boolean") {
            if (typeof gImport.allowCascade === "boolean")
              aO.allowCascade = gImport.allowCascade;
            else if (typeof $A.fn.globalDC.allowCascade === "boolean")
              aO.allowCascade = $A.fn.globalDC.allowCascade;
            else aO.allowCascade = false;
          }

          if (aO.allowCascade) {
            for (s = 0; s < svs.length; s++) {
              gO[svs[s]] = $A.fn.globalDC[svs[s]];
              iO[svs[s]] = gImport[svs[s]];
            }
          }

          $A.extend(true, dc, $A.fn.globalDC);

          $A.extend(true, dc, gImport);

          $A.extend(true, dc, aO);

          if (dc.allowCascade) {
            for (s = 0; s < svs.length; s++) {
              $A.fn.globalDC[svs[s]] = gO[svs[s]];
            }
            dc.fn.proto = iO;
          }

          if (dc.id) {
            dc.indexVal = wheel.length;
            wheel[dc.indexVal] = AccDCInit(dc);
            var DC = wheel[dc.indexVal];

            if ($A.isDC(DC)) {
              if (DC.autoStart) autoStart.push(DC);

              if (DC.isStatic) DC.root = DC.isStatic;

              if ($A.isDC(parentDC)) {
                var chk = -1,
                  p = parentDC,
                  c = DC;
                for (var i = 0; i < p.children.length; i++) {
                  if (c.id === p.children[i].id) chk = i;
                }
                if (chk >= 0) p.children.slice(chk, 1, c);
                else p.children.push(c);
                c.parent = p;
                var t = c;
                while (t.parent) t = t.parent;
                c.top = t;
              } else DC.top = DC;

              if (DC.onCreated && typeof DC.onCreated === "function") {
                DC.onCreated.apply(DC, [DC]);
              }
            }
          }
        }

        for (a = 0; a < wheel.length; a++) wheel[a].siblings = wheel;

        for (s = 0; s < autoStart.length; s++) {
          var dc = autoStart[s];
          if (!dc.triggerObj && dc.trigger) {
            dc.triggerObj = $A.query(dc.trigger)[0] || null;
          }
          if (dc.triggerObj) {
            if (!$A.data(dc.triggerObj, "DC-ON")) {
              $A.data(dc.triggerObj, "DC", dc);
              $A.data(dc.triggerObj, "DC-ON", true);
            }
          }
          dc.open();
        }

        return wheel;
      };

      if (window.InitAccDC && window.InitAccDC.length) {
        $A.getScript(window.InitAccDC, true);
      }

      window[window.AccDCNamespace ? window.AccDCNamespace : "$A"] = $A;

      return (window.AccDC = $A);
    })()
  );
}

export default $AccDC();
