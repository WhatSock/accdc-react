import React from "react";

import $A from "./Core/API";
import "./Modules/Accordion.Uncompressed";
import "./Modules/Banner.Uncompressed";
import "./Modules/Calendar.Uncompressed";
import "./Modules/Carousel.Uncompressed";
import "./Modules/Combobox.Uncompressed";
import "./Modules/Footnotes.Uncompressed";
import "./Modules/Menu.Uncompressed";
import "./Modules/Modal.Uncompressed";
import "./Modules/Popup.Uncompressed";
import "./Modules/Tabs.Uncompressed";

// Accessible Accordions
export function setAccordion(ReactComponent, regions, config) {
  if (!("configureAccessibleAccordions" in $A))
    $A.extend({
      configureAccessibleAccordions: function(
        selector,
        context,
        regions,
        config,
        cb,
        ReactComponent
      ) {
        context = context || document;
        config = config || {};
        config.overrides = config.overrides || {};
        var track = {};

        $A.query(selector, context, function(i, o) {
          var g = $A.getAttr(o, "data-accordiongroup");
          if (g) {
            if (!track[g]) track[g] = [];
            track[g].push(o);
          }
        });

        var options = {
          isToggle: true,
          allowMultiple: true,
          ReactParent: ReactComponent,
          regions: regions
        };

        $A.extend(options, config);

        $A.loop(
          track,
          function(name, group) {
            $A.setAccordion(
              group,
              options,
              context,
              cb || null,
              config.overrides
            );
          },
          "object"
        );
      }
    });

  $A.configureAccessibleAccordions(
    "button[data-accordiongroup][data-controls], a[data-accordiongroup][data-controls]",
    $A(ReactComponent).getNode(),
    regions,
    config,
    config && config.callback
      ? config.callback
      : function(dc, isOpen) {
          //$A.beep();
          // alert(isOpen);
        },
    ReactComponent
  );
}

// Accessible Banners
export function setBanner(ReactComponent, banners, config) {
  if (!("configureAccessibleBanners" in $A))
    $A.extend({
      configureAccessibleBanners: function(
        context,
        banners,
        config,
        ReactComponent
      ) {
        $A.query("div.accBanner[data-controls]", context, function(i, o) {
          var p = $A.getAttr(o, "data-controls");

          var options = {
            id: o.id,
            role: $A.getAttr(o, "data-role") || "Banner",
            React: {
              name: p,
              component: banners[p],
              parent: ReactComponent
            },
            root: o,
            prepend: true,
            hiddenCloseName: "Close Banner",
            className: "banner"
          };
          $A.extend(options, config);

          $A.setBanner(options);
        });
      }
    });

  $A.configureAccessibleBanners(
    $A(ReactComponent).getNode(),
    banners,
    config || {},
    ReactComponent
  );
}

// Accessible Calendar Date Pickers
export function setCalendar(ReactComponent, config) {
  if (!("configureAccessibleCalendars" in $A))
    $A.extend({
      configureAccessibleCalendars: function(context, config, ReactComponent) {
        $A.query('*[data-widget="calendar"][data-controls]', context, function(
          i,
          o
        ) {
          var targ = $A.query("#" + $A.getAttr(o, "data-controls"))[0];
          $A.extend(true, config, {
            React: {
              parent: ReactComponent
            },
            RenderUsingReact: true,
            root: "body",
            append: true
          });
          $A.setCalendar(o.id, o, targ, false, config.callback, config);
        });
      }
    });

  $A.configureAccessibleCalendars(
    $A(ReactComponent).getNode(),
    config || {},
    ReactComponent
  );
}

// Accessible Carousels
export function setCarousel(containerId, slides, config) {
  if (!("configureAccessibleCarousel" in $A))
    $A.extend({
      configureAccessibleCarousel: function(containerId, slides, config) {
        if (typeof containerId === "string")
          containerId = $A.getEl(containerId);
        $A.extend(config, {
          slides: slides
        });
        return $A.setCarousel(containerId, config);
      }
    });

  return $A.configureAccessibleCarousel(containerId, slides, config || {});
}

// Accessible Comboboxes
export function setCombobox(ReactComponent, config) {
  if (!("configureAccessibleCombobox" in $A))
    $A.extend({
      configureAccessibleCombobox: function(context, config, ReactComponent) {
        config.overrides = config.overrides || {};
        $A.extend(config, {
          input: $A.query(config.input, context)[0],
          select: $A.query(config.select, context)[0],
          childNode: $A.query(config.childNode, context)[0]
        });
        $A.extend(config.overrides, {
          React: {
            parent: ReactComponent
          }
        });
        return new $A.setCombobox(config);
      }
    });

  return $A.configureAccessibleCombobox(
    $A(ReactComponent).getNode(),
    config || {},
    ReactComponent
  );
}

// Accessible Footnotes
export function setFootnotes(ReactComponent, config) {
  if (!("configureAccessibleFootnotes" in $A))
    $A.extend({
      configureAccessibleFootnotes: function(context, config) {
        var options = {
          selector: "span.accFootnote",
          context: context,
          fnChar: "&#8224;",
          fnText: "Footnote",
          backText: "Back to Footnote"
        };
        $A.extend(options, config.overrides || {});
        $A.setFootnotes(options);
      }
    });

  $A.configureAccessibleFootnotes($A(ReactComponent).getNode(), config || {});
}

// Accessible Menus
export function setMenu(ReactComponent, menus, config) {
  if (!("configureAccessibleMenu" in $A))
    $A.extend({
      configureAccessibleMenu: function(
        context,
        menus,
        config,
        ReactComponent
      ) {
        config = config || {};
        config.overrides = config.overrides || {};
        var siblingComponents = [];
        $A.loop(
          menus,
          function(n, o) {
            siblingComponents.push(o);
          },
          "object"
        );
        var menuTriggers = $A.query(
            'a[href][data-controls][aria-haspopup="true"], button[data-controls][aria-haspopup="true"]',
            context
          ),
          menuMap = new Map();
        $A.loop(
          menuTriggers,
          function(i, o) {
            var menu = $A.getAttr(o, "data-controls");
            menuMap.set(o, {
              handler: config.overrides.onClick,
              componentName: menu,
              menuComponent: menus[menu],
              ReactParent: ReactComponent,
              menuTriggers: menuTriggers
            });
          },
          "array"
        );
        if (typeof config.overrides.globalOnClick === "function")
          $A.setMenu.globalOnClick = config.overrides.globalOnClick;
        $A.setMenu(
          menuMap,
          context,
          config.overrides ||
            {
              // AccDC API overrides to be applied to all menu objects.
            },
          config.disableAutoFocus ? true : false
        );
      }
    });

  $A.configureAccessibleMenu(
    $A(ReactComponent).getNode(),
    menus,
    config || {},
    ReactComponent
  );
}

// Accessible Modals
export function setModal(ReactComponent, modals, config) {
  if (!("configureAccessibleModals" in $A))
    $A.extend({
      configureAccessibleModals: function(
        context,
        modals,
        config,
        ReactComponent
      ) {
        $A.loop(
          modals,
          function(n, m) {
            let o = $A.query(
              'button[data-popup="dialog"][data-controls="' +
                n +
                '"], a[href][data-popup="dialog"][data-controls="' +
                n +
                '"]',
              context
            )[0];
            if (!config.overrides) config.overrides = {};
            let options = {
              id: config.overrides.id || o.id || null,
              React: {
                name: n,
                component: m,
                parent: ReactComponent
              },
              forceFocus: false,
              trigger: o || null,
              on: o ? "click" : "",
              ariaDialog: true,
              hiddenCloseName: "Close Dialog"
            };
            $A.extend(options, config);
            $A.setModal(options);
          },
          "object"
        );
      }
    });

  $A.configureAccessibleModals(
    $A(ReactComponent).getNode(),
    modals,
    config || {},
    ReactComponent
  );
}

// Accessible Popups
export function setPopup(ReactComponent, popups, config) {
  if (!("configureAccessiblePopups" in $A))
    $A.extend({
      configureAccessiblePopups: function(
        context,
        popups,
        config,
        ReactComponent
      ) {
        $A.loop(
          popups,
          function(n, m) {
            let o = $A.query(
              'button[data-popup="popup"][data-controls="' +
                n +
                '"], a[href][data-popup="popup"][data-controls="' +
                n +
                '"]',
              context
            )[0];
            if (!config.overrides) config.overrides = {};
            let options = {
              id: config.overrides.id || o.id || null,
              React: {
                name: n,
                component: m,
                parent: ReactComponent
              },
              trigger: o || null,
              on: o ? "click" : "",
              hiddenCloseName: "Close Popup"
            };
            $A.extend(options, config);
            $A.setPopup(options);
          },
          "object"
        );
      }
    });

  $A.configureAccessiblePopups(
    $A(ReactComponent).getNode(),
    popups,
    config || {},
    ReactComponent
  );
}

// Configure Accessible Tabs
export function setTabList(ReactComponent, panels, config) {
  if (!("configureAccessibleTabs" in $A))
    $A.extend({
      configureAccessibleTabs: function(
        context,
        tabPanels,
        config,
        ReactComponent
      ) {
        $A.extend(config, {
          tabPanels: tabPanels,
          ReactParent: ReactComponent
        });

        var role = $A.getAttr(context, "role");

        if (role && role === "tablist") var tabLists = [context];
        else var tabLists = $A.query('*[role="tablist"]', context);

        $A.loop(
          tabLists,
          function(i, tabList) {
            let tabs = $A.query('*[role="tab"][data-controls]', tabList);

            $A.setTabs(
              tabs,
              config,
              tabList,
              config.callback ||
                function(dc) {
                  // $A.beep();
                }
            );
          },
          "array"
        );
      }
    });

  $A.configureAccessibleTabs(
    $A(ReactComponent).getNode(),
    panels,
    config || {},
    ReactComponent
  );
}

export default {
  setAccordion: setAccordion,
  setBanner: setBanner,
  setCalendar: setCalendar,
  setCarousel: setCarousel,
  setCombobox: setCombobox,
  setFootnotes: setFootnotes,
  setMenu: setMenu,
  setModal: setModal,
  setPopup: setPopup,
  setTabList: setTabList
};
