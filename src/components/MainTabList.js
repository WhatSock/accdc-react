import React from "react";
import strap from "../AccDC/DC";

import "../css/accordion.css";
import "../css/banner.css";
import "../css/calendar.css";
import "../css/carousel.css";
import "../css/combobox.css";
import "../css/footnotes.css";
import "../css/menus.css";
import "../css/modal.css";
import "../css/popup.css";
import "../css/tabs.css";

// Import all React component TabPanels controlled by this Tablist
import Intro from "./Intro/IntroMain";
import Accordion from "./Accordion/AccordionMain";
import Banner from "./Banner/BannerMain";
import Calendar from "./Calendar/CalendarMain";
import Carousel from "./Carousel/CarouselMain";
import Combobox from "./Combobox/ComboboxMain";
import Footnotes from "./Footnotes/FootnotesMain";
import Menus from "./Menu/MenusMain";
import Modal from "./Modal/ModalMain";
import Popup from "./Popup/PopupMain";
import Tabs from "./Tabs/TabsMain";

class MainTabList extends React.Component {
  componentDidMount() {
    strap.setTabList(
      this,
      {
        Intro: <Intro />,
        Accordion: <Accordion />,
        Banner: <Banner />,
        Calendar: <Calendar />,
        Carousel: <Carousel />,
        Combobox: <Combobox />,
        Footnotes: <Footnotes />,
        Menus: <Menus />,
        Modal: <Modal />,
        Popup: <Popup />,
        Tabs: <Tabs />
      },
      {
        // callback: function(DC, isOpen) {
        // if (isOpen) window.AccDC.beep();
        // },

        overrides: {
          toggleClassName: "active"
        }
      }
    );
  }
  render() {
    return (
      <ul role="tablist" aria-level="1" className="contextual-menu">
        <li role="presentation">
          <a
            id="main-tab-intro"
            role="tab"
            href="#tab"
            className="accTab"
            data-insert="pgContent"
            data-controls="Intro"
            data-defaultopen="true"
          >
            <span>Bootstrap</span>
          </a>
        </li>
        <li role="presentation">
          <a
            id="main-tab-accordion"
            role="tab"
            href="#tab"
            className="accTab"
            data-insert="pgContent"
            data-controls="Accordion"
          >
            <span>Accordion</span>
          </a>
        </li>
        <li role="presentation">
          <a
            id="main-tab-banner"
            role="tab"
            href="#tab"
            className="accTab"
            data-insert="pgContent"
            data-controls="Banner"
          >
            <span>Banner</span>
          </a>
        </li>
        <li role="presentation">
          <a
            id="main-tab-calendar"
            role="tab"
            href="#tab"
            className="accTab"
            data-insert="pgContent"
            data-controls="Calendar"
          >
            <span>Calendar</span>
          </a>
        </li>
        <li role="presentation">
          <a
            id="main-tab-carousel"
            role="tab"
            href="#tab"
            className="accTab"
            data-insert="pgContent"
            data-controls="Carousel"
          >
            <span>Carousel</span>
          </a>
        </li>
        <li role="presentation">
          <a
            id="main-tab-combobox"
            role="tab"
            href="#tab"
            className="accTab"
            data-insert="pgContent"
            data-controls="Combobox"
          >
            <span>Combobox</span>
          </a>
        </li>
        <li role="presentation">
          <a
            id="main-tab-footnotes"
            role="tab"
            href="#tab"
            className="accTab"
            data-insert="pgContent"
            data-controls="Footnotes"
          >
            <span>Footnotes</span>
          </a>
        </li>
        <li role="presentation">
          <a
            id="main-tab-menu"
            role="tab"
            href="#tab"
            className="accTab"
            data-insert="pgContent"
            data-controls="Menus"
          >
            <span>Menus</span>
          </a>
        </li>
        <li role="presentation">
          <a
            id="main-tab-modal"
            role="tab"
            href="#tab"
            className="accTab"
            data-insert="pgContent"
            data-controls="Modal"
          >
            <span>Modal</span>
          </a>
        </li>
        <li role="presentation">
          <a
            id="main-tab-popup"
            role="tab"
            href="#tab"
            className="accTab"
            data-insert="pgContent"
            data-controls="Popup"
          >
            <span>Popup</span>
          </a>
        </li>
        <li role="presentation">
          <a
            id="main-tab-tabs"
            role="tab"
            href="#tab"
            className="accTab"
            data-insert="pgContent"
            data-controls="Tabs"
          >
            <span>Tabs</span>
          </a>
        </li>
        <li role="presentation">
          <a
            id="main-tab-unassigned"
            role="tab"
            href="#tab"
            className="accTab"
            data-insert="pgContent"
            data-controls=""
            aria-disabled="true"
          >
            <span>Unassigned</span>
          </a>
        </li>
      </ul>
    );
  }
}

export default MainTabList;
