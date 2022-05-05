"use strict";
//@ts-check 
// Joukkueen sarja on viite data.sarjat-taulukossa lueteltuihin sarjoihin
// Joukkueen leimaamat rastit ovat viitteitä data.rastit-taulukossa lueteltuihin rasteihin
// voit vapaasti luoda data-rakenteen pohjalta omia aputietorakenteita

// Kirjoita tästä eteenpäin oma ohjelmakoodisi

// Seuraavilla voit tutkia selaimen konsolissa käytössäsi olevaa tietorakennetta. 

console.log(data);
function tulostaJoukkueet(data) {
    let aakkosjarjestys = [];     
    for (let i = 0; i < data.joukkueet.length; i++){
        let joukkue = data.joukkueet[i].nimi;
        let sarja = data.joukkueet[i].sarja.nimi;
        let tiedot = {
                nimi: joukkue,
                sarja: sarja
                };
        aakkosjarjestys.push(tiedot);
    }
    aakkosjarjestys.sort(compare);
    for (let tiedot of aakkosjarjestys) {
        console.log(tiedot.nimi + " " + tiedot.sarja);
    }
}
 

function compare(a, b) {
    var nameA = a.nimi.toUpperCase();
    var nameB = b.nimi.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
  
    // names must be equal
    return 0;
}
/**
 * Lisää uuden joukkueen dataan
 * asettaa samalla joukkueen sarjaksi parametrina tuodun sarjan
 * Jos jokin parametri puuttuu, funktio ei tee mitään
 * Parametrit ovat kaikki objecteja.
 * @param {Object} data
 * @param {Object} joukkue
 * @param {Object} sarja
 */
 function lisaaJoukkue(data, joukkue, sarja) {
    let ret = data.joukkueet;
        let obj = {
                    nimi: joukkue.nimi,
                    jasenet: joukkue.jasenet,
                    leimaustapa: joukkue.leimaustapa,
                    rastit: joukkue.rastit,
                    sarja: sarja,
                    id: joukkue.id
                };
                ret.push(obj);
        }
function muutaSarjanNimi(data, vanhanimi, uusinimi) {
    for (let s of data.sarjat){
        if(s.nimi == vanhanimi){
            s.nimi = uusinimi;
        }
    }

}
function tulostaKokonaislukuRastit(data){
    let ret = [];
    for (let i = 0; i <  data.rastit.length; i++){
        let koodi = data.rastit[i].koodi;
        if (koodi%1 ===0 ){
            ret = ret.concat(koodi);
        }
    }
    ret.sort(compareNumbers);
    console.log(ret.join(";"));
}
function compareNumbers(a, b) {
  return a - b;
}


let mallij = { 
    "nimi": "Mallijoukkue",
    "jasenet": [
      "Lammi Tohtonen",
      "Matti Meikäläinen"
    ],
    "leimaustapa": [0,2],
    "rastit": [],
    "sarja": undefined,//tämä asetetaan funktiossa oikeaksi
    "id": 99999
};
// etsi oikea sarja...
lisaaJoukkue(data, mallij,data.sarjat[2]);
muutaSarjanNimi(data, "8h", "10h");

tulostaJoukkueet(data);
tulostaKokonaislukuRastit(data);

console.log("TASO 3");
function poistaJoukkue(data,joukkue) {
    for (let i = 0; i < data.joukkueet.length; i++){
         let joukkueNimi = data.joukkueet[i].nimi;
         if (joukkueNimi == joukkue){
            data.joukkueet.splice(i, 1);
         }

     }
 }  
/**
 * Vaihtaa pyydetyn rastileimauksen sijalle uuden rastin
 * @param {Object} joukkue
 * @param {number} rastinIdx - rastin paikka joukkue.rastit-taulukossa
 * @param {Object} uusirasti
 * @param {string} Aika - Rastileimauksen aika. Jos tätä ei anneta, käytetään samaa aikaa kuin vanhassa korvattavassa leimauksessa
 */
 function vaihdaRasti(joukkue, rastinIdx, uusirasti, aika) {
        let joukkueObj = etsiJoukkue(joukkue);
        let rastiObj = etsiRasti(uusirasti);
        if (!isNaN(joukkueObj)||!isNaN( rastiObj)){
            joukkueObj.nimi = "rastiObj";
            joukkueObj.rastit[rastinIdx].rasti = rastiObj;
            if (aika != "") {
                joukkueObj.rastit[rastinIdx].Aika = aika;
            }
        }
}      

function etsiJoukkue(joukkuenimi){
    for (let i = 0; i < data.joukkueet.length; i++){
        if ( data.joukkueet[i].nimi == joukkuenimi){
           return data.joukkueet[i];
        }
    }
    return NaN;
}
function etsiRasti(rasti){
    for (let i = 0; i < data.rastit.length; i++){
        if (data.rastit[i].koodi == rasti){
           return data.rastit[i];
        }

    }
    return NaN;
}
poistaJoukkue(data,"Vara 1");
poistaJoukkue(data,"Vara 2");
poistaJoukkue(data,"Vapaat");
vaihdaRasti("Dynamic Duo", 74, "32","");
tulostaJoukkueet(data);
console.log(data);