/* Świstak Bank - prosta autoryzacja (localStorage, tylko do celów demonstracyjnych) */
(function () {
    var KLUCZ_KONTA = "swistak_konta";
    var KLUCZ_SESJA = "swistak_sesja";

    function bezOgonkow(t) {
        var mapa = { "ą": "a", "ć": "c", "ę": "e", "ł": "l", "ń": "n", "ó": "o", "ś": "s", "ź": "z", "ż": "z" };
        return t.toLowerCase().replace(/[ąćęłńóśźż]/g, function (z) { return mapa[z]; });
    }

    function losujRachunek() {
        var s = "PL";
        for (var i = 0; i < 26; i++) s += Math.floor(Math.random() * 10);
        return s;
    }

    function wczytaj() {
        var konta = JSON.parse(localStorage.getItem(KLUCZ_KONTA) || "null");
        if (!konta) {
            konta = [
                { login: "admin", haslo: "admin123", imie: "Administrator", nazwisko: "", rola: "admin", rachunek: "PL00000000000000000000000001", saldo: 100000 },
                { login: "jan.nowak", haslo: "jan123", imie: "Jan", nazwisko: "Nowak", rola: "klient", rachunek: "PL61109010140000071219812874", saldo: 5000 }
            ];
            zapisz(konta);
        }
        return konta;
    }

    function zapisz(konta) {
        localStorage.setItem(KLUCZ_KONTA, JSON.stringify(konta));
    }

    window.Auth = {
        zaloguj: function (login, haslo) {
            var k = wczytaj().find(function (x) { return x.login === login.trim().toLowerCase() && x.haslo === haslo; });
            if (!k) return false;
            sessionStorage.setItem(KLUCZ_SESJA, k.login);
            return true;
        },
        zarejestruj: function (imie, nazwisko, haslo) {
            var login = bezOgonkow(imie.trim()) + "." + bezOgonkow(nazwisko.trim());
            var konta = wczytaj();
            if (konta.some(function (x) { return x.login === login; })) return null;
            konta.push({ login: login, haslo: haslo, imie: imie.trim(), nazwisko: nazwisko.trim(), rola: "klient", rachunek: losujRachunek(), saldo: 0 });
            zapisz(konta);
            return login;
        },
        biezacy: function () {
            var login = sessionStorage.getItem(KLUCZ_SESJA);
            if (!login) return null;
            return wczytaj().find(function (x) { return x.login === login; }) || null;
        },
        wymagajLogowania: function () {
            if (!this.biezacy()) window.location.href = "logowanie.html";
        },
        wyloguj: function () {
            sessionStorage.removeItem(KLUCZ_SESJA);
        }
    };
})();
