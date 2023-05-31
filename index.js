import {Tabla} from "./tabla.js";
import {DatosManager} from "./datosManager.js";
import {Superheroe} from "./superheroe.js";

const lista = "Personas02";
const datosManager = new DatosManager("id");
datosManager.cargararDatos(JSON.parse(localStorage.getItem(lista)) || []);
// localStorage.setItem(lista, JSON.stringify([]));

const tabla = new Tabla({ignore: true, columns: ["id"], id: "id"});

const $form = document.getElementById("form");

tabla.table.setAttribute("id", "tabla-registros");


const guardarDatos = () =>{
	localStorage.setItem(lista, JSON.stringify(datosManager.arrayDatos));
}

const mostrarTabla = () =>{
	tabla.createTabla(datosManager.arrayDatos);
	var td = tabla.table.querySelectorAll("td.Sexo");
	for (const elemento of td) {
		if(elemento.textContent === "Hombre"){
			elemento.classList.add('sexo-hombre');
		}else{
			elemento.classList.add('sexo-mujer');
		}
	}
	const section  = document.querySelector("#table-section");
	section.appendChild(tabla.table);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const overlay = document.getElementById("overlay");
async function actualizarDatos () {
	overlay.style.display = "block";
	await sleep(2000);
	guardarDatos();
	mostrarTabla();
	overlay.style.display = "none";
}

const agregarBotones = (botones) =>{
	const divBotones = document.getElementById("botones-form");
	const fragmentBotones = document.createDocumentFragment();
	
	botones.forEach(boton => {
		fragmentBotones.appendChild(boton.Boton);
	});

	divBotones.innerHTML = "";
	divBotones.appendChild(fragmentBotones);
};

const desactivarInputs = (opcion) => {
  const formulario = document.querySelector("#form");
  const inputs = formulario.querySelectorAll("input");
  const selects = formulario.querySelectorAll("select")
  inputs.forEach((input) => {
    input.disabled = opcion;
  });
  selects.forEach((select) => {
    select.disabled = opcion;
  });
};

const cargarForm = (form, dato) =>{
	const {txtId, txtNombre, txtAlias, rdoEditorial, rngFuerza, slcArma} = form;
	txtId.value = dato["id"];
	txtNombre.value = dato["Nombre"];
	txtAlias.value = dato["Alias"];
	rdoEditorial.value = dato["Editorial"];
	rngFuerza.value = dato["Fuerza"];
	slcArma.value = dato["Arma"];
}

const crearBoton = (name, valor, tipo) =>{
	const button = document.createElement("button");
	button.name = name;
	button.type = tipo;
	button.textContent = valor;
	button.classList.add("boton-form");
	return button;
}

const botones = {
  Agregar: { Boton: crearBoton("Agregar", "Agregar", "submit") },
  Modificar: { Boton: crearBoton("Modificar", "Modificar", "submit") },
  Eliminar: { Boton: crearBoton("Eliminar", "Eliminar", "submit") },
  Guardar: { Boton: crearBoton("Guardar", "Guardar", "submit") },
  Cancelar: { Boton: crearBoton("Cancelar", "Cancelar", "button") },
  Blanquear: { Boton: crearBoton("Blanquear", "Blanquear", "button") }
}

botones.Agregar.Boton.classList.add("guardar");
botones.Guardar.Boton.classList.add("guardar");

botones.Agregar.Accion = (form) =>{
	const {txtNombre, txtAlias, rdoEditorial, rngFuerza, slcArma} = form;
	const nuevoSuperheroe = new Superheroe(null, txtNombre.value, rngFuerza.value, txtAlias.value, rdoEditorial.value,  slcArma.value);
	datosManager.agregarDato(nuevoSuperheroe);
	actualizarDatos();
	form.reset();
	agregarBotones([botones.Agregar, botones.Blanquear]);
};

botones.Modificar.Accion = () =>{
  desactivarInputs(false);
  agregarBotones([botones.Guardar, botones.Cancelar, botones.Blanquear]);
};

botones.Eliminar.Accion = (form) =>{
	const {txtNombre, txtId} = form.elements;
	const confirmacion = confirm("¿Estás seguro de que deseas eliminar a " + txtNombre.value + "?");
	if(confirmacion){
		datosManager.eliminarDato(txtId.value);
		actualizarDatos();
		desactivarInputs(false);
		form.reset();
		agregarBotones([botones.Agregar, botones.Blanquear]);
	}
};

botones.Guardar.Accion = (form) =>{
	const {txtId, txtNombre, txtAlias, rdoEditorial, rngFuerza, slcArma} = form;
	const nuevoSuperheroe = new Superheroe(txtId.value, txtNombre.value, rngFuerza.value, txtAlias.value, rdoEditorial.value, slcArma.value);

	const confirmacion = confirm("¿Estás seguro de que deseas actualizar a " + txtNombre.value + "?");
	if (confirmacion){
		datosManager.actualizarDato(nuevoSuperheroe);
		actualizarDatos();
		form.reset();
		agregarBotones([botones.Agregar, botones.Blanquear]);
	}
};

botones.Blanquear.Boton.addEventListener("click", (e) =>{
  e.currentTarget.form.reset();
});

botones.Cancelar.Boton.addEventListener("click", (e) =>{
  desactivarInputs(false);
  e.currentTarget.form.reset();
  agregarBotones([botones.Agregar, botones.Blanquear]);
});

tabla.body.addEventListener("click", (e) =>{
	const selectedRowId = e.target.parentElement.dataset.id;
	const selectedHeroe = datosManager.datos[parseInt(selectedRowId)];

	if (e.target.tagName == "TD"){
		$form.txtId.value = selectedHeroe["id"];
		$form.txtNombre.value = selectedHeroe["nombre"];
		$form.txtAlias.value = selectedHeroe["alias"];
		$form.rdoEditorial.value = selectedHeroe["editorial"];
		$form.rngFuerza.value = selectedHeroe["fuerza"];
		$form.slcArma.value = selectedHeroe["arma"];

		desactivarInputs(true);
		agregarBotones([botones.Modificar, botones.Eliminar, botones.Cancelar]);
	}
});

$form.addEventListener("submit", (e) =>{
  e.preventDefault();
  botones[e.submitter.name].Accion($form);
});

window.addEventListener("DOMContentLoaded", () => {
	agregarBotones([botones.Agregar, botones.Blanquear]);
	mostrarTabla();
});