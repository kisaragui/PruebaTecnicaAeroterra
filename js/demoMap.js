$(function() {
  $('select').formSelect();
});

/* ----------------------------mapa y controles ---------------------*/

var mapa = L.map('mapa').setView([-34.6025114,-58.3823437], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapa);

var controlZoom = L.control.zoom(); 


let boton = document.getElementById('envioDatos');
boton.addEventListener("click", agregarPunto); 

// funcion que agrega el punto de interes, con los datos validos y la informacion.
function agregarPunto() {
	let data = validarForm();
	 punto =  new L.marker([data.coordenadas.lon, data.coordenadas.lat],{draggable: true}).addTo(mapa);
	let info = mostrarInfoDelPunto(data);
	punto.bindPopup(info).openPopup();
};


// funcion para validar los campos del formulario.
function validarForm(){
	let descripcion, direccion, telefono, coordenadas, categoria;
	var array = Array();
	descripcion = document.getElementById("descripcion");
	direccion = document.getElementById("direccion");
	telefono = document.getElementById("telefono");
	coordenadas = document.getElementById("coordenadas");
	categoria = document.getElementById("categoria");
	form = [descripcion, direccion, telefono, coordenadas, categoria];
	for (let [i,f] of form.entries()){
		if (f.value == "" || f.value.length == 0){
			let mensaje = `El campo ${f.id} es obligatorio, no puede estar vacio.`;
			array.push(mensaje);
		}else if (i ==3){
		 	let val1, val2, c;
			c = convertirCoordenadas(coordenadas.value);
			val1 = c.lon > -180.0 && c.lon < 180.0? true: false;
			val2 = c.lat > -90.0 && c.lat < 90.0? true: false;
			if (val1 && val2){
				var coords = c;	
			}else {
				let mensaje = "La longitud y latitud no son validas. ";
				array.push(mensaje);
				var coords = null;
			};	
		} if(i == 4 && array.length > 0){
			alert(array.join("\n"));
		};
		const {descripcion, direccion, telefono, categoria} = f;
	};
	var datos = {
			descripcion: descripcion.value, 
			direccion: direccion.value,
			telefono: telefono.value,
			coordenadas: coords,
			categoria: categoria.options[categoria.selectedIndex].text,
			};	
	console.log(datos);
	return datos;
};


// Funcion para convertir y separar las coordenadas de latitud y longitud
function convertirCoordenadas(cors){
	let separador, lot, lat, coordenadas;
	separador = cors.split(",");
	lon = parseFloat(separador[0]);
	lat = parseFloat(separador[1]);
	coordenadas = {lon, lat};
	return coordenadas;
};

// funcion para mostrar la informacion del punto
function mostrarInfoDelPunto (form){
	let info = `<div class="informacion">
	<p><b>Descripción:</b> ${form.descripcion}</p> 
	<p><b>Dirección:</b> ${form.direccion}</p>
	<p><b>Número telefónico:</b> ${form.telefono}</p>
	<p><b>Coordenadas:</b> ${form.coordenadas.lon}, ${form.coordenadas.lat} </p>
	<p><b>Categoría:</b> ${form.categoria}</p>
	</div>
	`;
	return info;
};