export class Tabla {
    constructor(options = {}) {

        this.table = document.createElement("table");
        this.head = document.createElement("thead");
        this.body = document.createElement("tbody");
        this.table.appendChild(this.head);
        this.table.appendChild(this.body);

        this.options = options;

        const {ignore, columns, id} = this.options;
        this.ignorar = (param) => ignore ? columns.includes(param) : !columns.includes(param);
        this.id = id;

        this.columns = [];
        this.rows = {};
    }

    createTabla(datos) {
        if (Array.isArray(datos)){
            this.establecerColumnas(datos);
            this.createCabecera(datos);
            this.createCuerpo(datos);
            return this.table;
        }
    }

    establecerColumnas (datos) {
        this.columns = [];
        for (const key in datos[0]) {
            if (!this.ignorar(key)) {
                this.columns.push(key);
            }
        }
    }

    createCabecera(datos) {
        this.head.innerHTML = "";
        const headRow = document.createElement("tr");

        if(datos && datos.length > 0){
            for (const column of this.columns) {
                
                const th = document.createElement("th");
                th.classList.add(column);
                th.textContent = column;
                headRow.appendChild(th);
            }
        }
        this.head.appendChild(headRow);
    }

    createCuerpo(datos) {
        this.body.innerHTML = "";
        if(datos && datos.length > 0){
            datos.forEach((dato) => {                
                const tr = this.crearFila(dato);
                this.rows[dato[this.id]] = tr;
                this.body.appendChild(tr);
            });
        }
    }

    actualizarDato(dato) {
        this.rows[dato[this.id]] = this.crearFila(dato);
    }

    crearFila(dato) {
        const tr = document.createElement("tr");
        tr.dataset.id = dato[this.id];
        for (const column of this.columns) {
            const td = document.createElement("td");
            td.classList.add(column);
            td.textContent = dato[column];
            tr.appendChild(td);
        }
        return tr;
    }
}
