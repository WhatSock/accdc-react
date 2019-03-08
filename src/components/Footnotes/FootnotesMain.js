import React from "react";
import strap from "../../AccDC/DC";

/* Directions for Accessible Footnotes

1. Import AccDC/DC.

2. At the beginning of each footnote definition at the end of the page, add an empty span element, and ensure each span has a unique ID.

3. Surround all words or phrases within the body that are meant to be footnotes with a span element, and ensure that each of these spans includes className="accFootnote", plus a data-footnote attribute that references the ID of the relevant footnote as set in step 2. Multiple footnotes that reference the same ID is supported.

4. Exicute setFootnotes() to set all footnotes as configured.
*/

class FootnotesMain extends React.Component {
  componentDidMount() {
    strap.setFootnotes(this, {
      /* Optional overrides
overrides: {
selector: 'span.accFootnote',
fnChar: '&#8224;',
fnText: 'Footnote',
backText: 'Back to Footnote'
}
*/
    });
  }
  render() {
    return (
      <div id="pg-fn">
        <div className="hd">
          <h3>Accessible Footnotes</h3>
        </div>
        <div className="intro highlight">
          <p>
            Footnotes provide a means for linking key phrases in body content
            with noted references in the footer.
          </p>
        </div>
        <div className="intro tal content demo-block">
          <p>
            {" "}
            Some say that the Azores are the legendary peaks of{" "}
            <span className="accFootnote" data-footnote="f1">
              Atlantis
            </span>{" "}
            after it was swallowed by the sea, which is easy to believe,
            especially after visiting Furnas; bells ringing from church
            steeples, storm driven thunder clouds over head, old manor homes
            with their windows sparkling in the sunlight, wind-swept mountain
            ridges over crystalline lakes, its haunting beauty is unparalleled.
          </p>
          <p>
            {" "}
            "Going home" is a concept with entirely different significance for
            those who have been uprooted from their home and now live elsewhere.
            TO me going home is returning to the paradisiacal island of{" "}
            <span className="accFootnote" data-footnote="f2">
              Sao Miguel
            </span>
            , where at every corner is a discovery and a memory. The valley of
            Furnas, with the exception of a few road upgrades and Wi-Fi, has
            remained the same as I always remembered. Furnas is a magical
            village where volcanic fumaroles, effervescent springs, and geysers
            are part of the natural landscape. Everywhere the scents of baking
            bread and fresh fruit mingle with the scent of the ever breathing
            volcano.
          </p>
          <p>
            {" "}
            The valley of{" "}
            <span className="accFootnote" data-footnote="f3">
              Furnas
            </span>{" "}
            nestles within Sao Miguel's volcanic crater, venting hot mineral
            springs where fresh corn is cooked in burlap sacks immersed in
            boiling fumaroles; where botanical gardens are home to black and
            white swans, and exotic plants and fauna from around the world. The
            botanical gardens of the Hotel Terra Nostra are world renowned for
            its age and the variety of species there, but to me it is what I
            imagined the Garden of Eden to be.
          </p>
          <p>
            {" "}
            The sounds are as magical as the sights. Countless little birds call
            the tree tops home, and delight visitors with their constant
            singing; various creeks murmur in tune with the rustling foliage.
            The main feature of the gardens is the swimming pool fed by a
            natural hot ferrous spring; it is large enough to often be confused
            by tourists as a small lake. Swimming in the pool is a mystical
            experience; the water is warm and constantly pouring into the pool.
            Due to the minerals, one becomes noticeably more buoyant and time
            ceases to have its normal meaning. On cold days, the mist hovers and
            iridescent dragon flies are easily mistaken for fairies.
          </p>
          <p>
            {" "}
            AS a child, this park was my playground. I played in its caves,
            climbed its trees, swam for daily eternities and could not conceive
            that anyone could ever be alive and not have such a garden to visit.
            As an adult returning as often as I can, this park gives the
            constant assurance that, although I live elsewhere, I still belong
            to the{" "}
            <span className="accFootnote" data-footnote="f4">
              Azores
            </span>
            . Furnas is a paradise where the soft clopping of hooves on cobbled
            streets, the babbling of the brook beneath the mill at twilight, and
            the smell of fresh baked bread and wild blackberries filling the
            crisp morning air, call to my heart with a ceaseless whisper to come
            home.{" "}
          </p>
          <p>
            <i> (From the travel log of Ana Cristina Wallenstein-Garaventa)</i>
          </p>
        </div>
        <div id="footnotesDil" className="intro" />
        <div id="footnotes" className="intro tal">
          <p>
            <span className="footnote" id="f1" />
            Atlantis (in Greek, "island of Atlas") is a legendary island first
            mentioned in Plato's dialogues Timaeus and Critias, written about
            360 BC. According to Plato, Atlantis was a naval power lying "in
            front of the Pillars of Hercules" that conquered many parts of
            Western Europe and Africa 9,000 years before the time of Solon, or
            approximately 9600 BC. After a failed attempt to invade Athens,
            Atlantis sank into the ocean "in a single day and night of
            misfortune".
            <a href="http://en.wikipedia.org/wiki/Atlantis" target="_blank">
              Atlantis - Wikipedia, the free encyclopedia
            </a>
          </p>
          <p>
            <span className="footnote" id="f2" />
            S??o Miguel Island (Portuguese for Saint Michael), nicknamed "The
            Green Island", is the largest and most populous island in the
            Portuguese Azores archipelago. The island covers 759 km2 (293 sq mi)
            and has around 140,000 inhabitants, 45,000 of these people located
            in the largest city in the archipelago: Ponta Delgada.
            <a
              href="http://en.wikipedia.org/wiki/S%C3%A3o_Miguel_Island"
              target="_blank"
            >
              S??o Miguel Island - Wikipedia, the free encyclopedia
            </a>
          </p>
          <p>
            <span className="footnote" id="f3" />
            Furnas is a civil parish in the municipality of Povoa????o on the
            island of S??o Miguel in the Azores. The population in 2001 was
            1,541, its density is 44.76/km?? and the area is 34.43 km??. The
            parish is one of the largest in the island and in the Azores. It is
            located east of Lagoa and Ponta Delgada, west of Povoa????o and
            southeast of Ribeira Grande.
            <a href="http://en.wikipedia.org/wiki/Furnas" target="_blank">
              Furnas - Wikipedia, the free encyclopedia
            </a>
          </p>
          <p>
            <span className="footnote" id="f4" />
            The Archipelago of the Azores is composed of nine volcanic islands
            situated in the middle of the North Atlantic Ocean, and is located
            about 1,500 km (930 mi) west from Lisbon and about 3,900 km (2,400
            mi) east from the east coast of North America. The islands, and
            their economic exclusion zone, form the Autonomous Region of the
            Azores, one of the two autonomous regions of Portugal. Its main
            industries are: agriculture, dairy farming (for cheese and butter
            products primarily), minor livestock ranching, fishing and tourism,
            which is becoming the major service activity in the region; added to
            which, the government of the Azores employs a large percentage of
            the population directly or indirectly in many aspects of the service
            and tertiary sectors.
            <a href="http://en.wikipedia.org/wiki/Azores" target="_blank">
              Azores - Wikipedia, the free encyclopedia
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default FootnotesMain;
