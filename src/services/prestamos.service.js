const { Prestamos } = require('../models');
const helpers = require('../middlewares/helpers');
const prestamosService = {};
const bitacoraService = {};
const moment = require('moment');

bitacoraService.RegistrarEntrada = async (entrada) => {
    const nuevaEntradaPrestamos = entrada;
    return Prestamos.create(nuevaEntradaPrestamos);
    
 };

prestamosService.GenerarPDF = async() => {

    try{
        const fs = require('fs');
        const PDFDocument = require('../pdf/lib/pdfkit-tables');
        const doc = new PDFDocument();
        let query = `SELECT DISTINCT Id_Prestamo, Usuario_Id, Nombre_Usuario, Nombre, Apellido, Equipo_Id, Nombre_Equipo,  Estado_Equipo, Fecha FROM
            (SELECT Id_Prestamo, Estado as Estado_Equipo, Id_Usuario as Usuario_Id, Id_Equipo as Equipo_Id, Fecha FROM prestamos) prestamos,
            (SELECT * FROM usuarios) usuarios,
            (SELECT Nombre as Nombre_Equipo, Id_Equipo FROM equipos) equipos
            WHERE prestamos.Usuario_Id = usuarios.Id_Usuario AND prestamos.Equipo_Id = equipos.Id_Equipo;`
        let prestamos = await db.sequelize.query(query, {raw:true, type: db.sequelize.QueryTypes.SELECT});

        let imgpath = (__dirname+'/../pdf/lib/tec.png');
        let rs = await fs.createWriteStream(__dirname+'/../pdf/historial.pdf');
        doc.pipe(rs);
        doc
            .image(imgpath, 50, 45, { width: 50 })
            .fillColor("#444444")
            .fontSize(20)
            .text("Historial del Sistema", 110, 57)
            .fontSize(10)
            .text("Instituto Tecnologico de merida", 400, 65, { alight: "right"})
            .text("Campus Poniente", 400, 80, { alight: "right"})
            .moveDown();

        const table = {
            headers: ["Id Prestamo","Id Usuario","Nombre Usuario","Nombre","Apellido","Id Equipo","Nombre Equipo","Estado equipo","Fecha"],
            rows:[]
        };

        
        let mx;
        for(const registro of prestamos) {
            mx = moment(registro.Fecha);
            console.log(registro)
            table.rows.push([registro.Id_prestamo, mx.tz("America/Merida").format('DD/MM/YYYY hh:mm:ss')])
        }

        doc.moveDown().table(table, 10, 125, { width: 590 });
        doc.end();
        
        const path = require('path')

        let archivo = path.resolve('src/pdf/');

        return archivo;
        
    }catch(error){
        console.log(error)
    }
}

module.exports = prestamosService;