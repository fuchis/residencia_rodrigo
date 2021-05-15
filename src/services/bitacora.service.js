const { Bitacora } = require('../models');
const helpers = require('../middlewares/helpers');
const bitacoraService = {};
const moment = require('moment');

bitacoraService.RegistrarEntrada = async (entrada) => {
    const nuevaEntradaBitacora = entrada;
    return Bitacora.create(nuevaEntradaBitacora);
    
};

bitacoraService.GenerarPDF = async() => {

    try{
        const fs = require('fs');
        const PDFDocument = require('../pdf/lib/pdfkit-tables');
        const doc = new PDFDocument();
        let  bitacora = await Bitacora.findAll({raw:true});
        let imgpath = (__dirname+'/../pdf/lib/tec.png');
        let rs = await fs.createWriteStream(__dirname+'/../pdf/bitacora.pdf');
        doc.pipe(rs);
        doc
            .image(imgpath, 50, 45, { width: 50 })
            .fillColor("#444444")
            .fontSize(20)
            .text("Bitacora del Sistema", 110, 57)
            .fontSize(10)
            .text("Instituto Tecnologico de merida", 400, 65, { alight: "right"})
            .text("Campus Poniente", 400, 80, { alight: "right"})
            .moveDown();

        const table = {
            headers: ["Id Bitacora", "Nombre", "Usuario", "Descripcion", "Fecha"],
            rows:[]
        };

        
        let mx;
        for(const registro of bitacora) {
            mx = moment(registro.Fecha);
            table.rows.push([registro.Id_Bitacora, registro.Nombre_Usuario, registro.Usuario, registro.Descripcion, mx.tz("America/Merida").format('DD/MM/YYYY hh:mm:ss')])
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

module.exports = bitacoraService;