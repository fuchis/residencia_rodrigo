class HomeController {

    async index(req, res, next) {
        return res.render('index');
    }
}

module.exports = new HomeController();