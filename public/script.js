let close = document.getElementById('close');
let menu = document.getElementById('menu');
let ul = document.getElementById('ul');










let element2 = document.querySelector('#osm-map');
let latlong = document.querySelector('.latlong');
let map2 = L.map(element2);
//create-report map
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map2);


let currentLatitude = undefined;
let currentLongtitude = undefined;
const ktmlat = 27.70;
const ktmlag = 85.31;
let target= L.latLng(`${ktmlat}`,`${ktmlag}`);
map2.setView(target, 14);

let marker;
function onMapClick(e) {
    target = e.latlng;
    map2.setView(target, 100);
    marker = L.marker(target,{ draggable: true });
    marker.addTo(map2); 
    latlong.value = target
}

map2.once('click', onMapClick);


//navbar

function showMenu(){
    menu.addEventListener('click',()=>{
        ul.style.top = '0'
    })
    close.style.display= 'block';
}
function hideMenu(){
    close.addEventListener('click',()=>{
        ul.style.top = '-400';
        close.style.display= 'none';
    })
    
}




