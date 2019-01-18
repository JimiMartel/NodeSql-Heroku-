const datumOdElement = document.querySelector('.input__1--1');
const datumDoElement = document.querySelector('.input__1--2');
const vrstaPartneraElements = document.querySelectorAll('.form__section--2-1 .form__section--2__input');
const vrstaProizvodaElements = document.querySelectorAll('.form__section--2-2 .form__section--2__input');
const kooperantiElements = document.querySelectorAll('.form__section--2-3 .form__section--2__input');
const vrstaArtikalaElement = document.querySelector('.input__3-1');
const sveTeritorijeElement = document.querySelector('.input__3-2');
const komercijalistaElement = document.querySelector('.input__3-3');
const orgJedinicaElement = document.querySelector('.input__3-4');
const vrstaIzvestajaElements = document.querySelectorAll('.form__section--4 .form__section--4__input');

const resultElement = document.querySelector('.result');
const tableElement = document.querySelector('#table tbody');
const formElement = document.getElementById('form');

const searchElement = document.getElementById('search-input');
//const submitbBtnElement = document.querySelector('#submit-btn');

const loaderElement = document.querySelector('.lds-spinner');


getInitialFormQueries();

function getInitialFormQueries() {
    //fetch('http://localhost:5000/api/izvestaj')
    fetch('http://https://evening-lake-40421.herokuapp.com/api/izvestaj')
    .then(data => data.json())
    .then(data => {

        let vrsteArtikala = data.vrsteArtikala;
        let sveTeritorije = data.sveTeritorije;
        let sviKomercijalisti = data.sviKomercijalisti;
        let organizacioneJedinice = data.organizacioneJedinice;
    
        //VRSTE ARTIKALA
        let pattern = ``;
        for(let i = 0; i < vrsteArtikala.length; i++){
            let element = vrsteArtikala[i];
            pattern += `<option value="${element.IDKategorija}" class="form__section--3__option option__3-1--${i+1}">-- SVE VRSTE</option>`
        }
        vrstaArtikalaElement.innerHTML = pattern;
        
        //SVE TERITORIJE
        pattern = ``;
        for(let i = 0; i < sveTeritorije.length; i++){
            let element = sveTeritorije[i];
            pattern += `<option value="${element.IDOpstina}" class="form__section--3__option option__3-2--${i+1}">${element.NazivOpstine}</option>`
        }
        sveTeritorijeElement.innerHTML = pattern;
    
        //SVI KOMERCIJALISTI
        pattern = ``;
        for(let i = 0; i < sviKomercijalisti.length; i++){
            let element = sviKomercijalisti[i];
            pattern += `<option value="${element.IDRadnik}" class="form__section--3__option option__3-3--${i+1}">${i == 0 ? element.ImeRadnika : element.ImeRadnika + ' ' + element.PrezimeRadnika}</option>`
        }
        komercijalistaElement.innerHTML = pattern;
    
        //ORGANIZACIONE JEDINICE
        pattern = ``;
        for(let i = 0; i < organizacioneJedinice.length; i++){
            let element = organizacioneJedinice[i];
            pattern += `<option value="${element.IDOrganizacionaJedinica}" class="form__section--3__option option__3-4--${i+1}">${element.SIFRA} - ${element.MESTO}</option>`
        }
        orgJedinicaElement.innerHTML = pattern;
    });
}

 function postData(event){
     event.preventDefault();
     resultElement.style.display = 'none';
     loaderElement.style.display = 'inline-block';
     let vrstaproizvoda, vrstapartnera, kooperanti, vrstaizvestaja;

    //VRSTA PROIZVODA
    for (let i = 0; i < vrstaProizvodaElements.length; i++){
        if (vrstaProizvodaElements[i].checked){
            vrstaproizvoda = vrstaProizvodaElements[i].value;
            break;
        }
    }

    //VRSTA PARTNERA
    for (let i = 0; i < vrstaPartneraElements.length; i++){
        if (vrstaPartneraElements[i].checked){
            vrstapartnera = vrstaPartneraElements[i].value;
            break;
        }
    }

    //KOOPERANTI
    for (let i = 0; i < kooperantiElements.length; i++){
        if (kooperantiElements[i].checked){
            kooperanti = kooperantiElements[i].value;
            break;
        }
    }

    //VRSTA IZVESTAJA
    for (let i = 0; i < vrstaIzvestajaElements.length; i++){
        if (vrstaIzvestajaElements[i].checked){
            vrstaizvestaja = vrstaIzvestajaElements[i].value;
            break;
        }
    }

    let datumod = datumOdElement.value;
    let datumdo = datumDoElement.value;
    let vrstaartikla = vrstaArtikalaElement.value;
    let teritorija = sveTeritorijeElement.value;
    let komercijalista = komercijalistaElement.value;
    let organizacionajedinica = orgJedinicaElement.value;

    //fetch('http://localhost:5000/api/izvestaj', {
    fetch('https://evening-lake-40421.herokuapp.com/api/izvestaj', {
        method: 'POST',
        headers : {'Content-Type': 'application/json'},
        body:JSON.stringify({
                            datumod:datumod,
                            datumdo:datumdo,
                            vrstaproizvoda:vrstaproizvoda,
                            vrstapartnera:vrstapartnera,
                            vrstaartikla:vrstaartikla,
                            teritorija:teritorija,
                            komercijalista:komercijalista,
                            vrstaizvestaja:vrstaizvestaja,
                            organizacionajedinica:organizacionajedinica,
                            kooperanti:kooperanti,
                            })
    }).then(res=>res.json())
    .then(res => {
        let data = res.prodajaPoArtiklima;
        let pattern = ``;
        for(let i = 0; i < data.length; i++) {
            let element = data[i];
            pattern += `<tr>
                            <td>${element.SifraArtikal}</td>
                            <td>${element.NazivArtikla}</td>
                            <td>${element.Kolicina}</td>
                            <td>${element.KolicinaKoeficijent}</td>
                            <td>${element.PPC}</td>
                            <td>${element.ProdajnaVrednost}</td>
                            <td>${element.RabatIznos}</td>
                            <td>${element.RabatProcenat}</td>
                            <td>${element.RabatAkcijaIznos}</td>
                            <td>${element.NetoVrednost}</td>
                            <td>${element.IznosPDV}</td>
                            <td>${element.ValutaUkupno}</td>
                            <td>${element.Kupac}</td>
                        </tr>`;
        }

        loaderElement.style.display = 'none';
        resultElement.style.display = 'block';
        tableElement.innerHTML = pattern;
    });
}

function searchResults() {
    let filter, tr, td1, td2, txtValue1, txtValue2;
    filter = searchElement.value.toUpperCase();
    tr = tableElement.getElementsByTagName("tr");
    
    // Loop through all table rows, and hide those who don't match the search query
    for (let i = 0; i < tr.length; i++) {
        td1 = tr[i].getElementsByTagName("td")[0];
        td2 = tr[i].getElementsByTagName("td")[1];
        if (td1 || td2) {
        txtValue1 = td1.textContent || td1.innerText;
        txtValue2 = td2.textContent || td2.innerText;
        if (txtValue1.toUpperCase().includes(filter) || txtValue2.toUpperCase().includes(filter)) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
        } 
    }
}

searchElement.addEventListener('input', searchResults);
formElement.addEventListener('submit', postData);

