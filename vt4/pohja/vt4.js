"use strict";
//@ts-check 
window.onload = function() {
    luoPalkit(5);
    luoPinguVasen();
    luoPinguOikea();
    luoPolloVasenYla();
    luoPolloVasenAla();
    luoPolloOikeaYla();
    luoPolloOikeaAla();
};


/* Funktio, joka luo palkkeja sille annetun lukumäärän mukaan */

function luoPalkit(lkm) {
    for (let i=0; i<lkm; i++) {
      let z = 1 + i;
      luoPalkki(z,250*i);
    }
  }
/* Luo palkin ja asettaa sen body-elementin sisälle. index = palkin paikka, delay = animaation aika  */
function luoPalkki(index,delay) {
    let kohde = document.querySelector('body');
    let p = document.createElement('p');
    let img = document.createElement('img');
    p.style.animationDelay = delay.toString()+ "ms";
    p.appendChild(img);
    img.src = "palkki.svg";
    img.setAttribute('class','imgPalkki');
    img.setAttribute('alt','imgPalkki');
    p.setAttribute('class','pPalkki');
    p.style.zIndex = index;
    kohde.appendChild(p);
  }

/* Luo pöllön jakamalla sen 4 osaan ja asettaa sen body-elementin sisälle */
function luoPolloVasenYla(){
    let kohde = document.querySelector('body');
    let p = document.createElement('p');
	let canvas1 =  document.createElement('canvas');
	let ctx1 = canvas1.getContext('2d');
	ctx1.canvas.width  = window.innerWidth;
	ctx1.canvas.height = window.innerHeight;
	let img1 = document.createElement('img');
	img1.src = "http://appro.mit.jyu.fi/tiea2120/vt/vt4/owl.png";
	img1.onload = function() {
		ctx1.drawImage(img1, // kuva
		0,	//rajaus sx
		0, // rajaus sy
		img1.width/2, //lähdekuvan leveys
		img1.height/2, //lähdekuvan pituus
		(ctx1.canvas.width/2)-(img1.width/2), //x-koordinaatti
		(ctx1.canvas.height/2)-(img1.height/2),  // y-koordinaatti
		img1.height/2,
		img1.width/2);
	};
    img1.setAttribute('class','PolloVasenYla');
    img1.setAttribute('alt','imgPolloVasenYla');
    p.setAttribute('class','pPolloVasenYla');
    canvas1.appendChild(img1);
    p.appendChild(canvas1);
    kohde.appendChild(p);
}
function luoPolloOikeaAla(){
    let kohde = document.querySelector('body');
    let p = document.createElement('p');
    let canvas2 = document.createElement('canvas');
    let ctx2 = canvas2.getContext('2d');
    ctx2.canvas.width  = window.innerWidth;
    ctx2.canvas.height = window.innerHeight;
    let img2 = document.createElement('img');
    img2.src = "http://appro.mit.jyu.fi/tiea2120/vt/vt4/owl.png";
    img2.onload = function() {
        ctx2.drawImage(img2, // kuva
        img2.width/2, //rajaus sx
        img2.height/2, // rajaus sy
        img2.width/2, //lähdekuvan leveys
        img2.height/2, //lähdekuvan pituus
        ctx2.canvas.width/2, //x-koordinaatti
        ctx2.canvas.height/2,  // y-koordinaatti
        img2.height/2,
        img2.width/2);
    };
    img2.setAttribute('class','PolloOikeaAla');
    img2.setAttribute('alt','imgPolloOikeaAla');
    p.setAttribute('class','pPolloOikeaAla');
    canvas2.appendChild(img2);
    p.appendChild(canvas2);
    kohde.appendChild(p);     
}
function luoPolloVasenAla(){
    let kohde = document.querySelector('body');
    let p = document.createElement('p');
    let canvas3 = document.createElement('canvas');
    let ctx3 = canvas3.getContext('2d');
    ctx3.canvas.width  = window.innerWidth;
    ctx3.canvas.height = window.innerHeight;
    let img3 = document.createElement('img');
    img3.src = "http://appro.mit.jyu.fi/tiea2120/vt/vt4/owl.png";
    img3.onload = function() {
        ctx3.drawImage(img3, // kuva
        0, 					//rajaus sx
        img3.height/2, // rajaus sy
        img3.width/2, //lähdekuvan leveys
        img3.height/2, //lähdekuvan pituus
        (ctx3.canvas.width/2)-(img3.width/2), //x-koordinaatti
        ctx3.canvas.height/2,  // y-koordinaatti
        img3.height/2,
        img3.width/2);
    };
    img3.setAttribute('class','PolloVasenAla');
    img3.setAttribute('alt','imgPolloVasenAla');
    p.setAttribute('class','pPolloVasenAla');
    canvas3.appendChild(img3);
    p.appendChild(canvas3);
    kohde.appendChild(p);     
}
function luoPolloOikeaYla(){
    let kohde = document.querySelector('body');
    let p = document.createElement('p');
    let canvas4 = document.createElement('canvas');
    let ctx4 = canvas4.getContext('2d');
    ctx4.canvas.width  = window.innerWidth;
    ctx4.canvas.height = window.innerHeight;
    let img4 = document.createElement('img');
    img4.src = "http://appro.mit.jyu.fi/tiea2120/vt/vt4/owl.png";
    img4.onload = function() {
        ctx4.drawImage(img4, // kuva
        img4.width/2, //rajaus sx
        0, 				// rajaus sy
        img4.width/2, //lähdekuvan leveys
        img4.height/2, //lähdekuvan pituus
        (ctx4.canvas.width/2), //x-koordinaatti
        (ctx4.canvas.height/2)-(img4.height/2),  // y-koordinaatti
        img4.height/2,
        img4.width/2);
    };
    img4.setAttribute('class','PolloOikeaYla');
    img4.setAttribute('alt','imgPolloOikeaYla');
    p.setAttribute('class','pPolloOikeaYla');
    canvas4.appendChild(img4);
    p.appendChild(canvas4);
    kohde.appendChild(p);
}

/*Luo vasemman pingviinin */
function luoPinguVasen() {
    let kohde = document.querySelector('body');
    let p = document.createElement('p');
    let img = document.createElement('img');
    p.appendChild(img);
    img.src = "https://appro.mit.jyu.fi/tiea2120/vt/vt4/penguin.png";
    img.setAttribute('class','imgPinguVasen');
    img.setAttribute('alt','imgPinguVasen');
    p.setAttribute('class','pPinguVasen');
    p.style.zIndex = 0;
    kohde.appendChild(p);
  }
/*Luo oikean pingviinin */
function luoPinguOikea() {
    let kohde = document.querySelector('body');
    let p = document.createElement('p');
    let img = document.createElement('img');
    p.appendChild(img);
    img.src = "https://appro.mit.jyu.fi/tiea2120/vt/vt4/penguin.png";
    img.setAttribute('class','imgPinguOikea');
    img.setAttribute('alt','imgPinguOikea');
    p.setAttribute('class','pPinguOikea');
    p.style.zIndex = 0;
    kohde.appendChild(p);
  }
  