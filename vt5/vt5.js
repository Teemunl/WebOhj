"use strict";
// seuraavat estävät jshintin narinat jqueryn ja leafletin objekteista
/* jshint jquery: true */
/* globals L */
function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    let r, g, b;
    let h = step / numOfSteps;
    let i = ~~(h * 6);
    let f = h * 6 - i;
    let q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    let c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}
console.log(data);

// Käytetty kartta
let map;
// Joukkueet aakkosjärjestyksessä ja sitä vastaava lista elementti
let lsJoukkueet = { size: 0 };
// Rastit käänteisessä järjestyksessä ja sitä vastaava lista elementti
let lsRastit = { size: 0 };
// Rastiympyrän säde
let r = 150;
// Elementti, jota raahataan
let raahattava;
// Edellinen ympyrä
let edelYmpyra;
// Markkeri, jota siirretään kartalla
let marker;

// kirjoita tänne oma ohjelmakoodisi
window.onload = function() {
    luoKartta();
    luoKentat();
    rastitKartalle(data.rastit);
};

/**
 * Hakee maanmittauslaitoksen API:sta kartan ja luo kartan sivulle
 */
function luoKartta() {
  map = new L.map("map", {
    crs: L.TileLayer.MML.get3067Proj(),
  }).setView([62.2333, 25.7333], 11);
  L.tileLayer
    .mml_wmts({
      layer: "maastokartta",
      key: "85d72993-5628-4759-8982-e441728bd950",
    }).addTo(map);
}

/**
 * Luo kentät sivun alaosaan, ja käsittelijät eri tapahtumille
 */
function luoKentat() {

  // Laatikko listaelementeille
  $("<div id='flex'></div>").insertAfter("#map");

  // Joukkue laatikko
  $(
    "<div class='container' id='joukkueet'><h2>Joukkueet</h2><ul></ul></div>"
  ).appendTo($("#flex"));
  let div = $("#joukkueet").get(0);  //hakee joukkue divin
  div.addEventListener("drop", sijoitus);  //asettaa drop listenerin

  div.addEventListener("dragover", raahaaPaalle);  //asettaa dragover listenerin

  let parent = $("#joukkueet").children().eq(1);
  // lajittelee joukkueet aakkosjärjestykseen
  let lajiteltu = data.joukkueet.sort(function (a, b) { 
    return compare(a.nimi, b.nimi);
  });

  // Lista elementit joukkueista aakkosjärjestyksessä
  for (let i = 0; i < lajiteltu.length; i++) {
    let color = rainbow(lajiteltu.length, i);
    let koordinaatit = haeKoordinaatit(lajiteltu[i]);

    let li = $(
      "<li>" +
        lajiteltu[i].nimi.trim() +
        " (" +
        laskeMatka(koordinaatit) +
        " km)</li>"
    );
    li.attr("draggable", "true");
    li.attr("id", "joukkue" + i);
    li.css("backgroundColor", color);

    // Kuuntelija raahauksen aloitukselle
    li.get(0).addEventListener("dragstart", raahaus);
    li.appendTo(parent);

    // Objekti, mikä linkittää lista elementin joukkueeseen ja muihin tietoihin
    lsJoukkueet["joukkue" + i] = {
      lista: li.get(0),
      joukkue: lajiteltu[i],
      koordinaatit: koordinaatit,
    };
    lsJoukkueet.size++;
  }

  // Kartta container
  $("<div class='container' id='kartalla'><h2>Kartalla</h2><ul></ul></div>").appendTo($("#flex"));

  let drop = document.getElementById("kartalla");
  drop.addEventListener("drop", kartallaSijoitus);
  drop.addEventListener("dragover", raahaaPaalle);

  // Rasti container
  $("<div class='container' id='rastit'><h2>Rastit</h2><ul></ul></div>").appendTo($("#flex"));
  div = $("#rastit").get(0);
  div.addEventListener("drop", sijoitus);
  div.addEventListener("dragover", raahaaPaalle);

  parent = $("#rastit").children().eq(1);
  lajiteltu = data.rastit.sort(function (a, b) {
    return compare(b.koodi, a.koodi);
  });

  // Listat rasteista käänteisessä aakkosjärjestyksessä
  for (let i = 0; i < lajiteltu.length; i++) {
    let li = $("<li>" + lajiteltu[i].koodi + "</li>");
    let color = rainbow(lajiteltu.length, i);
    li.css("backgroundColor", color);
    li.attr("draggable", "true");
    li.attr("id", "rasti" + i);

    // Kuuntelija raahauksen aloitukselle
    li.get(0).addEventListener("dragstart", raahaus);
    li.appendTo(parent);
   // Objekti, mikä linkittää lista elementin rastiin
    lsRastit["rasti" + i] = {
      lista: li.get(0),
      rasti: lajiteltu[i],
    };
    lsRastit.size++;
  }
}

/**
 * Piirtää annetussa taulukossa olevat rastit kartalle ja keskittää karttaikkunan niihin
 * @param {*} rastit taulukko
 */
function rastitKartalle(rastit) {
  let minLat = rastit[0].lat;
  let maxLat = rastit[0].lat;
  let minLon = rastit[0].lon;
  let maxLon = rastit[0].lon;

  for (let i = 0; i < rastit.length; i++) {
    let lat = rastit[i].lat;
    let lon = rastit[i].lon;

    let circle = L.circle([lat, lon], {
      color: "red",
      radius: r,
      fillOpacity: 0,
    }).addTo(map);

    // Objekti, mikä pitää sisällään rastin id:n kartalla
    let popup = L.popup({
      autoPan: false,
      closeButton: false,
      autoClose: false,
      closeOnClick: false,
      className: "rastiNum",
      maxWidth: "1em",
      maxHeight: "1em",
      offset: [0, 9],
    })
      .setContent("<p>" + rastit[i].koodi + "</p>")
      .setLatLng(circle.getLatLng());
    circle.bindPopup(popup);
    popup.openOn(circle).bringToBack();

    // Poistaa rastin elementiltä marginin, jonka Leaflet laittaa sille itsestään
    $(".leaflet-popup-content p").css("margin", "0");

    lsRastit["rasti" + i].ympyra = circle;

    // Kuuntelija rastin klikkaukselle
    circle.on("click", rastiKlikkaus);
    
    // Haetaan pienin ja suurin koordinaatti, joka rasteista löytyy
    if (lat < minLat) {
      minLat = lat;
    }
    if (lat > maxLat) {
      maxLat = lat;
    }
    if (lon < minLon) {
      minLon = lon;
    }
    if (lon > maxLon) {
      maxLon = lon;
    }
  }

  // Keskitetään rastit kartalle
  map.fitBounds([
    [minLat, minLon],
    [maxLat, maxLon],
  ]);
}

/**
 * Piirtää joukkueen kulkeman reitin kartalle
 * @param {*} objekti joka sisältää joukkueen tiedot
 * @param {*} rgb värikoodi muodossa "rgb(0, 0, 0)", joka viivalle laitetaan
 */
function piirraReitti(objekti) {
  if (objekti.polyline === undefined || objekti.polyline === "") {
    let hex = rgbHexaksi(objekti.lista.style.backgroundColor);
    let polyline = L.polyline(objekti.koordinaatit, {
      color: hex,
    }).addTo(map);

    // Lisätään referenssi polylineen, jotta se voidaan poistaa myöhemmin.
    objekti["polyline"] = polyline;
  }
}

/**
 * Laskee annettujen koordinaattien välisen matkan
 * @param {*} coord koordinaatit taulukossa
 */
function laskeMatka(coord) {
  let matka = 0;
  for (let i = 0, j = 1; j < coord.length; i++, j++) {
    matka += map.distance(
      [coord[i].lat, coord[i].lon],
      [coord[j].lat, coord[j].lon]
    );
  }
  return (matka / 1000).toFixed(1); // Pyöristys yhteen desimaaliin
}

/**
 * Päivittää näytöllä oleviin joukkue elementteihin joukkueen kulkeman matkan
 */
function paivitaMatkat() {
  for (let i = 0; i < lsJoukkueet.size; i++) {
    let joukkue = lsJoukkueet["joukkue" + i];
    $(joukkue.lista).text(
      joukkue.joukkue.nimi.trim() +
        " (" +
        laskeMatka(joukkue.koordinaatit) +
        " km)"
    );
    if (joukkue.polyline !== undefined) {
      joukkue.polyline.remove();
      joukkue.polyline = "";
      piirraReitti(joukkue);
    }
  }
}

/**
 * Hakee joukkueen keräämien validien rastien koordinaatit
 * @param {*} joukkue jonka rasteja haetaan
 */
function haeKoordinaatit(joukkue) {
  let rastiId = [];
  for (let i = 0; i < data.rastit.length; i++) {
    rastiId.push(data.rastit[i].id);
  }

  let rastit = joukkue.rastit;
  let koordinaatit = [];
  for (let i = 0; i < rastit.length; i++) {
    let j = -1;
    try {
      let id = parseInt(rastit[i].rasti);
      j = rastiId.indexOf(id);
    } catch (e) {
      //
    }
    if (j > -1) {
      koordinaatit.push(data.rastit[j]);
    }
  }

  return koordinaatit;
}

/**
 * Funktio merkkijonojen lajitteluun aakkosjärjestykseen
 * @param {*} a ensimmäinen merkkijono
 * @param {*} b toinen merkkijono
 */
function compare(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a.toLowerCase().charAt(i) > b.toLowerCase().charAt(i)) {
      return 1; // Jos a suurempi kuin b
    }
    if (a.toLowerCase().charAt(i) < b.toLowerCase().charAt(i)) {
      return -1; // Jos b suurempi kuin a
    }
  }
  return 0; // yhtäsuuret
}

/**
 * Listaelementin raahauksen käsittelijä
 * @param {*} e event
 */
function raahaus(e) {
  raahattava = e.target;
  e.dataTransfer.setData("text/plain", e.target.getAttribute("id"));
}

/**
 * Käsittelijä listaelementin sijoitukselle "kartalla" laatikkoon
 * @param {*} e event
 */
function kartallaSijoitus(e) {
  e.preventDefault();
  let data = e.dataTransfer.getData("text");

  // Katsotaan pudotettiinko elementti UL elementin sisälle
  if (e.target.tagName === "UL") {
    // UL elementin vanhemman perusteella määritetään sijainti, johon sijoitetaan
    let sijainti = $(e.target.parentNode).offset();

    $(raahattava).css("left", e.pageX - sijainti.left + "px");
    $(raahattava).css("top", e.pageY - sijainti.top + "px");
    e.target.appendChild(document.getElementById(data));
  } else {
    return;
  }

  let objekti = lsJoukkueet[raahattava.id];
  if (raahattava.id.startsWith("joukkue")) {
    piirraReitti(objekti);
  } 
}

/**
 * Käsittelijä listaelementtien sijoittamiselle "joukkueet", tai "rastit"
 * laatikkoon
 * @param {*} e event
 */
function sijoitus(e) {
  e.preventDefault();
  let data = e.dataTransfer.getData("text");

  if (raahattava.id.startsWith("joukkue")) {
    if (e.target.tagName === "LI" &&
      e.target.parentNode.parentNode.id === "joukkueet"
    ) {
      e.target.parentNode.insertBefore(document.getElementById(data), e.target);
      lsJoukkueet[raahattava.id].polyline.remove();
      lsJoukkueet[raahattava.id].polyline = "";
    } else if (e.target.parentNode.id === "joukkueet") {
      e.target.appendChild(document.getElementById(data));
      lsJoukkueet[raahattava.id].polyline.remove();
      lsJoukkueet[raahattava.id].polyline = "";
    }
  }
  if (raahattava.id.startsWith("rasti")) {
    if ( e.target.tagName === "LI" &&
      e.target.parentNode.parentNode.id === "rastit"
    ) {
      e.target.parentNode.insertBefore(document.getElementById(data), e.target);
    } else if (e.target.parentNode.id === "rastit") {
      e.target.appendChild(document.getElementById(data));
    }
  }
}

/**
 * Kuuntelija listaelementin raahaamiselle laatikoiden päälle
 * @param {*} e event
 */
function raahaaPaalle(e) {
  e.preventDefault();
  let id = raahattava.id.replace(/\d/g, "");
  switch (id) {
    case "joukkue":
      if (
        e.target.parentNode.id === "kartalla" ||
        e.target.parentNode.parentNode.id === "joukkueet" ||
        e.target.parentNode.id === "joukkueet"
      ) {
        e.dataTransfer.dropEffect = "move";
        break;
      }
      e.dataTransfer.dropEffect = "none";
      break;
    case "rasti":
      if (
        e.target.parentNode.id === "kartalla" ||
        e.target.parentNode.parentNode.id === "rastit" ||
        e.target.parentNode.id === "rastit"
      ) {
        e.dataTransfer.dropEffect = "move";
        break;
      }
      e.dataTransfer.dropEffect = "none";
      break;
  }
}

/**
 * Kuuntelija kartan ympyrän klikkaukselle
 * @param {*} e event
 */
function rastiKlikkaus(e) {
  if (marker === undefined) {
    marker = L.marker(e.target.getLatLng(), {
      draggable: true,
    }).addTo(map);
    marker.on("dragend", markerRaahaus);
  } else {
    marker.setLatLng(e.target.getLatLng());
  }

  if (edelYmpyra !== undefined) {
    edelYmpyra.options.fillOpacity = "0";
    edelYmpyra.setStyle();
  }

  e.target.options.fillOpacity = "1.0";
  e.target.setStyle();

  edelYmpyra = e.target; 
  //Nämä kaksi pakottavat rastin nimen ympyrän sisään
  e.target.getPopup().setLatLng(e.target.getLatLng());
  $(".leaflet-popup-content p").css("margin", "0");

}

/**
 * Kuuntelija kartan markkerin raahaamiselle
 * @param {*} ev event
 */
function markerRaahaus(ev) {
  edelYmpyra.setLatLng(ev.target.getLatLng());
  ev.target.remove();

  edelYmpyra.options.fillOpacity = "0";
  edelYmpyra.setStyle();

  let latLng = edelYmpyra.getLatLng();
  for (let i = 0; i < lsRastit.size; i++) {
    if (lsRastit["rasti" + i].ympyra === edelYmpyra) {
      lsRastit["rasti" + i].rasti.lat = latLng.lat.toString();
      lsRastit["rasti" + i].rasti.lon = latLng.lng.toString();
      break;
    }
  }

  paivitaMatkat();

  marker = undefined;
  edelYmpyra = undefined;
}



/**
 * Muuttaa string muodossa olevan desimaaliluvun hexaksi
 * @param {*} destring string muotoinen desimaaliluku
 */
function hexaksi(destring) {
  let hex = parseInt(destring).toString(16);
  if (hex.length == 1) {
    return "0" + hex;
  } else {
    return hex;
  }
}

/**
 * Muuttaa "rgb(0, 0, 0)" muodossa olevan merkkijono värimallin
 * hexadesimaali muotoiseksi merkkijonoksi
 * @param {*} rgb "rgb(0, 0, 0)" muotoinen merkkijono
 */
function rgbHexaksi(rgb) {
  rgb = rgb
    .replace(/[^\d ]/g, "")
    .trim()
    .split(" ");
  return "#" + hexaksi(rgb[0]) + hexaksi(rgb[1]) + hexaksi(rgb[2]);
}
