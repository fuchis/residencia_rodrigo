const dateTimeService = {};


dateTimeService.getTimeIsoFormat = async () => {
    let date_ob = new Date();
    let dia = ("0" + date_ob.getDate()).slice(-2);
    let mes = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let anio = date_ob.getFullYear();
    let horas = date_ob.getHours();
    let minutos = date_ob.getMinutes();
    let segundos = date_ob.getSeconds();
    let fecha = `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`
    return fecha;

}

dateTimeService.test = 12;


module.exports = dateTimeService;