"use strict";
//@ts-check 
// data-muuttuja vk1
//

console.log(data);

window.onload = function () {
	let div = document.getElementById("tupa");
	div.tapa = "sarja";
	listaaJoukkueet(data, false, div.tapa);
	luoRastiLomake();
	lisaaJoukkueLomake();
};

/**
 * Muokkaa parametrina olevan joukkueen
 * @param data - tietorakenne
 * @param paivitys - päivitetäänkö lista vai luodaanko ensimmäisen kerran
 * @param tapa - lajitteluperuste
 */
const listaaJoukkueet = (data, paivitys, tapa) => {
	let div = document.getElementById("tupa");
	let taulukko = div.getElementsByTagName("table")[0];
	let muokkaa = document.getElementsByName("muokkaa")[0];
	muokkaa.disabled = true;
	muokkaa.style.visibility = "hidden";
	let lisaa = document.getElementsByName("joukkue")[0];
	lisaa.style.visibility = "visible";
	lisaa.disabled = true;
	muokkaa.insertAdjacentElement("beforebegin", lisaa);
	// Tuhoaa taulukosta joukkueiden tiedot sisältävät rivit, mikäli listausta päivitetään
	if (paivitys) {
		let rivi = taulukko.getElementsByTagName('tr');
		console.log(rivi);
		let riveja = rivi.length;
		for (let i = riveja - 1; i > 0; i--) {
			taulukko.removeChild(rivi[i]);
		}
	} else {
		let pisteetTH = taulukko.getElementsByTagName("tr")[0].appendChild(document.createElement("th"));
		let pisteet = pisteetTH.appendChild(document.createElement("a"));
		pisteet.textContent = "Pisteet";
		pisteet.setAttribute("href", "");
		pisteet.addEventListener("click", function (event) {
			event.preventDefault();
			listaaJoukkueet(data, true, "pisteet"); // Muokkaa lajittelua pisteiden mukaan
			div.tapa = "pisteet";
		});

		let otsikot = div.querySelectorAll("tr th");
		let joukkueNimi = otsikot[1];
		joukkueNimi.textContent = "";
		let nimi = joukkueNimi.appendChild(document.createElement("a"));
		nimi.textContent = "Joukkue";
		nimi.setAttribute("href", "");
		nimi.addEventListener("click", function (event) {
			event.preventDefault();
			listaaJoukkueet(data, true, "nimi"); // Muokkaa lajittelua nimen mukaan
			div.tapa = "nimi";
		});

		let joukkueSarja = otsikot[0];
		joukkueSarja.textContent = "";
		let sarja = joukkueSarja.appendChild(document.createElement("a"));
		sarja.textContent = "Sarja";
		sarja.setAttribute("href", "");
		sarja.addEventListener("click", function (event) {
			event.preventDefault();
			listaaJoukkueet(data, true, "sarja"); // Muokkaa lajittelua sarjan mukaan
			div.tapa = "sarja";
		});
	}

	let joukkueet = [];
	let sarja = "";
	let pisteet = 0;
	let nimi = "";
	let id = "";
	let jasenet = [];

	for (let i of data["joukkueet"]) {
		nimi = i["nimi"];
		jasenet = i["jasenet"];
		id = i["id"];
		pisteet = joukkueenPisteet(i);
		for (let s of data["sarjat"]) {
			if (s["id"] === i["sarja"]) {
				sarja = s["nimi"];
			}
		}
		let joukkue = {
			"sarja": sarja,
			"nimi": nimi,
			"pisteet": pisteet,
			"jasenet": jasenet,
			"id": id
		};
		joukkueet = joukkueet.concat(joukkue);
	}
	joukkueet = jarjesta(joukkueet, tapa);

	for (let j of joukkueet) {
		let tr = document.createElement("tr");
		let tdSarja = document.createElement("td");
		let txtSarja = document.createTextNode(j.sarja);
		tdSarja.appendChild(txtSarja);

		let tdNimi = document.createElement("td");
		let aNimi = document.createElement("a");
		aNimi.setAttribute("href", "#joukkuelomake");
		let txtNimi = document.createTextNode(j.nimi);
		tdNimi.appendChild(aNimi);

		aNimi.appendChild(txtNimi);
		aNimi.addEventListener("click", function (event) {
			muokkaaJoukkueLomake(j);
			addNew();
		}, false);

		tdNimi.appendChild(document.createElement('br'));
		tdNimi.appendChild(document.createTextNode(j["jasenet"].join(", ")));

		let tdPisteet = document.createElement("td");
		let txtPisteet = document.createTextNode(j.pisteet);
		tdPisteet.appendChild(txtPisteet);

		tr.appendChild(tdSarja);
		tr.appendChild(tdNimi);
		tr.appendChild(tdPisteet);

		taulukko.appendChild(tr);
	}
};
/**
 * Muokkaa parametrina olevan joukkueen
 * @param joukkueet - tietorakenteen sisältämät joukkueet
 * @param tapa - lajitteluperuste
 */
const jarjesta = (joukkueet, tapa) => {
	switch (tapa) {
		case "sarja":
			joukkueet.sort((a, b) => {
				if (a["sarja"] < b["sarja"])     return -1;
				if (a["sarja"] > b["sarja"])     return 1;
				if (a["pisteet"] > b["pisteet"]) return -1;
				if (a["pisteet"] < b["pisteet"]) return 1;
				if (a["nimi"].toUpperCase() < b["nimi"].toUpperCase())return -1;
				if (a["nimi"].toUpperCase() > b["nimi"].toUpperCase())return 1;
			});
			return joukkueet;
		case "nimi":
			joukkueet.sort((a, b) => (a["nimi"].toUpperCase() > b["nimi"].toUpperCase()) ? 1 : -1);
			return joukkueet;
		case "pisteet":
			joukkueet.sort((a, b) => (a["pisteet"] < b["pisteet"]) ? 1 : -1);
			return joukkueet;
	}


}

/**
 * Lasketaan joukkueen pisteet
 * @param joukkue - joukkue jonka pisteet lasketaan
 */
const joukkueenPisteet = (joukkue) => {
	let lahtoaika = new Date(data["alkuaika"]);
	let loppuaika = new Date(data["loppuaika"]);
	let pisteet = 0;
	let rastit = [];

	for (let r of joukkue["rastit"]) {
		for (let i of data["rastit"]) {
			if (i["id"] == r["rasti"]) {
				try {
					let aika = new Date(r["aika"]);
					if (!isNaN(parseInt(i["koodi"])) && !rastit.includes(i["koodi"]) && aika > lahtoaika && aika < loppuaika) {
						if (!isNaN(i["koodi"][0])) {
							pisteet += parseInt(i["koodi"][0]);
							rastit.push(i["koodi"]);
						}
					}
				} catch (e) {}
			}
		}
	}
	return pisteet;
};
/**
 * Hakee joukkueen rastit
 * @param joukkue - joukkue jonka rastit haetaan
 */
const joukkueenRastit = (joukkue) => {
	let lahtoaika = new Date(data["alkuaika"]);
	let loppuaika = new Date(data["loppuaika"]);
	let rastit = [];
	for (let j of data["joukkueet"]) {
		if (j["id"] == joukkue["id"]) {
			for (let r of j["rastit"]) {
				for (let i of data["rastit"]) {
					if (i["id"] == r["rasti"]) {
						try {
							let aika = new Date(r["aika"]);
							if (!isNaN(parseInt(i["koodi"])) && !rastit.includes(i["koodi"]) && aika > lahtoaika && aika < loppuaika) {
								if (!isNaN(i["koodi"][0])) {
									rastit.push(i["koodi"]);
								}
							}
						} catch (e) {}
					}
				}
			}
		}
	}


	return rastit;
};
/**
 * Muokkaa parametrina olevan joukkueen
 * @param joukkue - muokattava joukkue
 * @param data - data
 */
const muokkaaJoukkueLomake = (joukkue) => {
                let lomake = document.getElementById("joukkuelomake")[0];
	let lomakkeenTiedot = Array.from(document.querySelectorAll("p label input"));
	//Hakee joukkueen rastit käyttäen joukkkueenrastit funktiota
	let rastit = joukkueenRastit(joukkue);
	let rastitFieldissa = document.createElement("fieldset");
	rastitFieldissa.id = 'rastitFieldissa';
	rastitFieldissa.appendChild(document.createTextNode("Joukkueen rastit: "));
	rastitFieldissa.appendChild(document.createTextNode(rastit));
	lomake.appendChild(rastitFieldissa);



	for (let i = 0; i <= joukkue["jasenet"].length + 1; i++) {
		if (i == 0) {
			lomakkeenTiedot[i].value = joukkue["nimi"];
		} else if (i < lomakkeenTiedot.length) {
			lomakkeenTiedot[i].value = joukkue["jasenet"][i - 1];
		} else {
			let p = document.createElement("p");
			let label = document.createElement("label");
			label.textContent = "Jäsen " + i;
			let input = document.createElement("input");
			input.setAttribute("type", "text");
			input.addEventListener("input", addNew);
			lomakkeenTiedot = lomakkeenTiedot.concat(input);
			p.appendChild(label).appendChild(input);
			let fieldset = document.getElementsByTagName("fieldset")[2];
			fieldset.appendChild(p);
			lomakkeenTiedot[i].value = joukkue["jasenet"][i - 1];
		}
		if (i !== 0 && !joukkue["jasenet"][i - 1]) {
			lomakkeenTiedot[i].value = "";
		}
	}
	lomakkeenTiedot.slice(2);
	let muokkaa = document.getElementsByName("muokkaa")[0];
	muokkaa.disabled = false;
	let lisaa = document.getElementsByName("joukkue")[0];
	lisaa.style.visibility = "hidden";
	lisaa.insertAdjacentElement("beforebegin", muokkaa);
	muokkaa.joukkue = joukkue;
	muokkaa.style.visibility = "visible";
            };

/**
 * Muokkaa parametrina olevan joukkueen
 * @param joukkue - muokattava joukkue
 */
const muokkaaJoukkuetta = (e) => {
	e.preventDefault();
	let joukkue = e.target.joukkue;
	let lomake = document.getElementById("joukkuelomake")[0];
	let lomakkeenTiedot = lomake.getElementsByTagName("input");
	let nimi = lomakkeenTiedot[0].value;
	let jasenet = [];
	for (let i = lomakkeenTiedot.length - 1; i > -1; i--) {
		if (i !== 0 && lomakkeenTiedot[i].value.trim() !== "") {
			jasenet = jasenet.concat(lomakkeenTiedot[i].value);
		}
		if (i > 2) {
			lomakkeenTiedot[i].parentNode.remove();

		}
	}
	for (let j of data["joukkueet"]) {
		if (joukkue["id"] == j["id"]) {
			j["nimi"] = nimi;
			j["jasenet"] = jasenet;
		}
	}
	lomake.parentNode.reset();
	document.getElementById('rastitFieldissa').remove();

	let tapa = document.getElementById("tupa").tapa;

	listaaJoukkueet(data, true, tapa);
};


/**
 * Luo lomakkeen, minkä avulla voi luoda uuden joukkueen
 */
const lisaaJoukkueLomake = () => {
	let lomake = document.getElementById("joukkuelomake")[0];
	let fieldset = document.createElement("fieldset");
	let legend = document.createElement("legend");
	fieldset.appendChild(legend);
	legend.textContent = "Jäsenet";
	let p1 = document.createElement("p");
	let label1 = document.createElement("label");
	let input1 = document.createElement("input");
	label1.textContent = "Jasen 1";
	label1.appendChild(input1);
	p1.appendChild(label1);
	label1.appendChild(input1);

	let p2 = document.createElement("p");
	let label2 = document.createElement("label");
	let input2 = document.createElement("input");
	label2.textContent = "Jasen 2";
	label2.appendChild(input2);
	p2.appendChild(label2);
	label2.appendChild(input2);



	fieldset.appendChild(p1);
	fieldset.appendChild(p2);


	lomake.childNodes[5].insertAdjacentElement("beforebegin", fieldset);

	let lomakkeenTiedot = fieldset.getElementsByTagName("input");
	lomakkeenTiedot[0].addEventListener("input", addNew);

	let muokkaa = document.getElementsByName("muokkaa")[0];
	muokkaa.style.visibility = "hidden";
	muokkaa.addEventListener("click", muokkaaJoukkuetta, true);
	let lisaa = document.getElementsByName("joukkue")[0];
	lisaa.disabled = true;
	lisaa.addEventListener("click", function (event) {
		event.preventDefault();
		lisaaJoukkue();
	}, false);
};


// luo uusia inputkenttiä lomakkeeseen jos näkyvillä olevat eivät tule riittämään
const addNew = (e) => {
	let lomake = document.getElementById("joukkuelomake")[0];
	let fieldset = document.getElementsByTagName("fieldset")[2];
	let lomakkeenTiedot = fieldset.getElementsByTagName("input");
	let lisaa = document.getElementsByName("joukkue")[0];

	let tyhja = false; // oletuksena ei ole löydetty tyhjää
	let jasenet = [];
	let nimi = lomake.querySelector("p label input");
	nimi.addEventListener("input", addNew);
	// käydään läpi kaikki input-kentät viimeisestä ensimmäiseen
	for (let i = lomakkeenTiedot.length - 1; i > 0; i--) {
		let input = lomakkeenTiedot[i];

		// jos on tyhjä ja on jo aiemmin löydetty tyhjä niin poistetaan
		if (input.value.trim() == "" && tyhja) {
			lomakkeenTiedot[i].parentNode.remove();
		}

		// onko tyhjä?
		if (input.value.trim() == "") {
			tyhja = true;
		}
	}
	// jos ei ollut tyhjiä kenttiä joten lisätään yksi
	if (!tyhja) {
		let p = document.createElement("p");
		let label = document.createElement("label");
		label.textContent = "Jäsen";
		let input = document.createElement("input");
		input.setAttribute("type", "text");
		p.appendChild(label).appendChild(input);
		fieldset.appendChild(p);
	}

	// tehdään kenttiin numerointi
	for (let i = 0; i < lomakkeenTiedot.length; i++) {
		lomakkeenTiedot[i].addEventListener("input", addNew);
		let label = lomakkeenTiedot[i].parentNode;
		label.firstChild.nodeValue = "Jäsen " + (i + 1);
		if (lomakkeenTiedot[i].value.trim() !== "") {
			jasenet = jasenet.concat(lomakkeenTiedot[i].value);
		}
	}
	if (jasenet.length >= 2 && nimi.value.length > 0) {
		lisaa.disabled = false;
	}

	if (jasenet.length < 2 || nimi.value.length == 0) {
		lisaa.disabled = true;
	}
};


//Lisää joukkueen lomakkeen tietojen mukaan
function lisaaJoukkue() {
	let lomake = document.getElementById("joukkuelomake")[0];
	let joukkue = {
		"nimi": "",
		"jasenet": [],
		"rastit": [],
		"leimaustapa": [0],
		"sarja": 32233232
	};
	let maxId = Number.MIN_SAFE_INTEGER;
	for (let j of data["joukkueet"]) {
		if (j["id"] >= parseInt(maxId)) {
			maxId = j["id"];
		}
	}
	joukkue["id"] = maxId + 1;
	joukkue["nimi"] = lomake.querySelector("p label input").value;
	let lomakkeenTiedot = lomake.getElementsByTagName("input");
	for (let i = lomakkeenTiedot.length - 1; i > -1; i--) {
		if (i !== 0 && lomakkeenTiedot[i].value.trim() !== "") {
			joukkue["jasenet"] = joukkue["jasenet"].concat((lomakkeenTiedot[i].value));
		}
		if (i > 2) {
			lomakkeenTiedot[i].parentNode.remove();
		}
	}
	data["joukkueet"] = data["joukkueet"].concat(joukkue);
	let tapa = document.getElementById("tupa").tapa;
	listaaJoukkueet(data, true, tapa);
	lomake.parentNode.reset();
	document.getElementsByName("joukkue")[0].disabled = true;
}

//Luo rastin lisäys lomakkeen
const luoRastiLomake = () => {
	let lomake = document.getElementsByTagName("form")[0];
	let fieldset = lomake.appendChild(document.createElement("fieldset"));
	let legend = document.createElement("legend");
	legend.textContent = "Rastin tiedot";
	fieldset.appendChild(legend);

	let lat = document.createElement("label");
	let input1 = document.createElement("input");
	let span1 = document.createElement("span");
	input1.setAttribute("type", "text");
	input1.setAttribute("value", "");
	span1.textContent = "Lat";
	lat.appendChild(span1);
	lat.appendChild(input1);
	fieldset.appendChild(lat);

	let lon = document.createElement("label");
	let input2 = document.createElement("input");
	let span2 = document.createElement("span");
	input2.setAttribute("type", "text");
	input2.setAttribute("value", "");
	span2.textContent = "Lon";
	lon.appendChild(span2);
	lon.appendChild(input2);
	fieldset.appendChild(lon);

	let koodi = document.createElement("label");
	let input3 = document.createElement("input");
	let span3 = document.createElement("span");
	input3.setAttribute("type", "text");
	input3.setAttribute("value", "");
	span3.textContent = "Koodi";
	koodi.appendChild(span3);
	koodi.appendChild(input3);
	fieldset.appendChild(koodi);

	let lisaaNappi = document.createElement("button");
	lisaaNappi.textContent = "Lisää rasti";
	lisaaNappi.setAttribute("id", "rasti");
	lisaaNappi.addEventListener("click", (event) => {
		lisaaRasti(input1, input2, input3);
		event.preventDefault();
	}, false);
	fieldset.appendChild(lisaaNappi);
};

/**
 * Lisätään joukkue tietorakenteeseen oikeaan sarjaan
 * @param input1 - leveyssuunta
 * @param input2 - pituussuunta
 * @param input3 - rastin koodi
 */
const lisaaRasti = (input1, input2, input3) => {
	if (input1.value == "" || input2.value == "" || input3.value == "") {
		return;
	}
	let maxId = Number.MIN_SAFE_INTEGER;
	for (let r of data["rastit"]) {
		if (r["id"] >= parseInt(maxId)) {
			maxId = r["id"];
		}
	}
	let lat = input1.value;
	let lon = input2.value;
	let koodi = input3.value;
	let rasti = {
		"id": maxId + 1,
		"koodi": koodi,
		"lat": lat,
		"lon": lon
	};
	data["rastit"] = data["rastit"].concat(rasti);
	input1.value = "";
	input2.value = "";
	input3.value = "";
	data["rastit"].sort((a, b) => (a["koodi"].toUpperCase() > b["koodi"].toUpperCase()) ? 1 : -1);
	for (let s of data["rastit"]) {
		console.log(s["koodi"].padEnd(10), s["lat"].padEnd(10), s["lon"]);
	}
};