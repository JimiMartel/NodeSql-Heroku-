const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

//AMAZON SERVER
const config = {
    user: 'iadmin123',
    password: 'admin123',
    server: 'mytestdb01.cuglot9utjln.us-east-1.rds.amazonaws.com',
    database: 'RestoredIMP2018a'
};

// LOCAL SERVER
// var config = {
//     user: 'sa',
//     password: 'sa',
//     server: 'DESKTOP-14C7PMG\\SQLEXPRESS', 
//     database: 'IMP2018',
// };

//HOME 
app.get('/', function(req, res) {
    res.render('home.ejs')
})

//IZVESTAJ
app.get('/izvestaj', function(req, res) {
    res.render('izvestaj.ejs');
});

//IZVESTAJ REZULTATI
app.post('/izvestaj', async function (req, res) {
    try {
        await sql.connect(config)
        
        let result1 = sql
            .query('exec spTeritorijeCombo')

        let result2 = sql
            .query('exec spNabavkaProdajaKategorijaArtiklaCombo 1')

        let result3 = sql
            .query('exec spKomercijalistiCombo')

        let result4 = sql
            .query('exec spOrganizacionaJedinicaComboSifraNazivSQL')

        let result5 = new sql.Request()
        .input('datumod', sql.VarChar, req.body.datumod)
        .input('datumdo', sql.VarChar, req.body.datumdo)
        .input('vrstaproizvoda', sql.Int, req.body.vrstaproizvoda)
        .input('vrstapartnera', sql.Int, req.body.vrstapartnera)
        .input('vrstaartikla', sql.Int, req.body.vrstaartikla)
        .input('teritorija', sql.Int, req.body.teritorija)
        .input('komercijalista', sql.Int, req.body.komercijalista)
        .input('vrstaizvestaja', sql.Int, req.body.vrstaizvestaja)
        .input('organizacionajedinica', sql.Int, req.body.organizacionajedinica)
        .input('kooperanti', sql.Int, req.body.kooperanti)
        .query('EXEC spProdajaArtikalaPoArtiklima @datumod, @datumdo, @vrstaproizvoda, @vrstapartnera, @vrstaartikla, @teritorija, @komercijalista, @vrstaizvestaja, @organizacionajedinica, @kooperanti');

        let body = req.body;

        Promise.all([result1, result2, result3, result4,result5]).then(values => {
            sql.close();
            req.sveTeritorije = values[0].recordset;
            req.vrsteArtikala = values[1].recordset;
            req.sviKomercijalisti = values[2].recordset;
            req.organizacioneJedinice = values[3].recordset;
            req.prodajaPoArtiklima = values[4].recordset;
            
            res.render( 'izvestaj.ejs', {
                sveTeritorije:req.sveTeritorije, 
                vrsteArtikala:req.vrsteArtikala,
                sviKomercijalisti: req.sviKomercijalisti,
                organizacioneJedinice: req.organizacioneJedinice,
                prodajaPoArtiklima: req.prodajaPoArtiklima,
                body: body});
        });

    } catch (err) {
        console.log(err);
    }
});

//IZVESTAJ API
app.get('/api/izvestaj', async function (req, res) {
    try {
        await sql.connect(config)
        let result1 = sql
            .query('exec spTeritorijeCombo')

        let result2 = sql
            .query('exec spNabavkaProdajaKategorijaArtiklaCombo 1')

        let result3 = sql
            .query('exec spKomercijalistiCombo')

        let result4 = sql
            .query('exec spOrganizacionaJedinicaComboSifraNazivSQL')
        
        let body = '';

        Promise.all([result1,result2, result3, result4]).then(values => {
            sql.close();
            req.sveTeritorije = values[0].recordset;
            req.vrsteArtikala = values[1].recordset;
            req.sviKomercijalisti = values[2].recordset;
            req.organizacioneJedinice = values[3].recordset;
            res.send({
                sveTeritorije:req.sveTeritorije, 
                vrsteArtikala:req.vrsteArtikala,
                sviKomercijalisti: req.sviKomercijalisti,
                organizacioneJedinice: req.organizacioneJedinice,
                body: body})
        });
    } catch (err) {
        console.log(err);
    }
});

//IZVESTAJ REZULTATI API
app.post('/api/izvestaj', async function (req, res) {
    try {
        await sql.connect(config)
        let result5 = new sql.Request()
        .input('datumod', sql.VarChar, req.body.datumod)
        .input('datumdo', sql.VarChar, req.body.datumdo)
        .input('vrstaproizvoda', sql.Int, req.body.vrstaproizvoda)
        .input('vrstapartnera', sql.Int, req.body.vrstapartnera)
        .input('vrstaartikla', sql.Int, req.body.vrstaartikla)
        .input('teritorija', sql.Int, req.body.teritorija)
        .input('komercijalista', sql.Int, req.body.komercijalista)
        .input('vrstaizvestaja', sql.Int, req.body.vrstaizvestaja)
        .input('organizacionajedinica', sql.Int, req.body.organizacionajedinica)
        .input('kooperanti', sql.Int, req.body.kooperanti)
        .query('EXEC spProdajaArtikalaPoArtiklima @datumod, @datumdo, @vrstaproizvoda, @vrstapartnera, @vrstaartikla, @teritorija, @komercijalista, @vrstaizvestaja, @organizacionajedinica, @kooperanti');

        let body = req.body;

        Promise.all([result5]).then(values => {
            sql.close();
            req.prodajaPoArtiklima = values[0].recordset;
            res.send({prodajaPoArtiklima: req.prodajaPoArtiklima, body: body});
        });

    } catch (err) {
        console.log(err);
    }
});

app.listen(process.env.PORT, function(){
    console.log("YelpCamp Server Has Started!");
});

// const server = app.listen(5000, function () {
//     console.log('The app is running!');
// });