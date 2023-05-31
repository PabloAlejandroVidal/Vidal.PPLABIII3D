export class DatosManager {
    constructor(key) {
        this.arrayDatos = [];
        this.datos = {};
        this.newId = 1;
        this.dataKey = key;
    }

    actualizarDatos() {
        this.arrayDatos = Object.values(this.datos);
    }

    cargararDatos(datos) {
        datos.forEach((dato) => {
            this.agregarDato(dato);
        });
    }

    agregarDato(dato) {
        if(dato[this.dataKey]){
            const id = dato[this.dataKey];
            if(this.validarId(id)){
                this.datos[id] = dato;
            }
        }else{
            const id = this.newId;
            dato[this.dataKey] = id;
            this.datos[id] = dato;
            this.newId++;
        }
        this.actualizarDatos();
    }

    actualizarDato(dato) {
        const id = dato[this.dataKey];
        this.datos[id] = dato;
        this.actualizarDatos();
    }

    validarId(id) {
        if(this.newId > id){
            return false;
        }
        this.newId = id + 1;
        return true;
    }

    eliminarDato(id) {
        delete this.datos[parseInt(id)];
        this.actualizarDatos();
    }


    
    obtenerDatoPorValor(campo, valor){
        for (const key in this.datos) {
            if (this.datos[key][campo] === valor){
                return this.datos[key];
            }
        }
    }
}
