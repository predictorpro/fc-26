/* Данные: флаги стран (упрощённые, без гербов), страны, лиги и клубы EA SPORTS FC 26.
   Список собран по открытым фанатским источникам, он не официальный. Его можно править руками:
   добавь или убери название в массиве clubs нужной лиги. Названия клубов — как в игре.
   Женские лиги помечены women:true, к названию клуба автоматически добавляется «(жен.)». */

(function () {
  function rect(x, y, w, h, f) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"/>'; }
  function H(cols) { var h = 20 / cols.length; return cols.map(function (c, i) { return rect(0, +(i * h).toFixed(3), 30, +(h + 0.05).toFixed(3), c); }).join(''); }
  function V(cols) { var w = 30 / cols.length; return cols.map(function (c, i) { return rect(+(i * w).toFixed(3), 0, +(w + 0.05).toFixed(3), 20, c); }).join(''); }
  function circ(cx, cy, r, f, extra) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"' + (extra || '') + '/>'; }
  function starPts(cx, cy, r, rot) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var a = ((rot === undefined ? -90 : rot) * Math.PI) / 180 + (i * Math.PI) / 5;
      var rr = i % 2 ? r * 0.4 : r;
      pts.push((cx + rr * Math.cos(a)).toFixed(2) + ',' + (cy + rr * Math.sin(a)).toFixed(2));
    }
    return pts.join(' ');
  }
  function star(cx, cy, r, f, rot) { return '<polygon points="' + starPts(cx, cy, r, rot) + '" fill="' + f + '"/>'; }
  function pentagram(cx, cy, r, stroke) {
    var o = [];
    for (var i = 0; i < 5; i++) { var a = (-90 + i * 72) * Math.PI / 180; o.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    var order = [0, 2, 4, 1, 3];
    return '<polygon points="' + order.map(function (k) { return o[k][0].toFixed(2) + ',' + o[k][1].toFixed(2); }).join(' ') +
      '" fill="none" stroke="' + stroke + '" stroke-width=".9" stroke-linejoin="miter"/>';
  }

  var F = {};
  F.eng = rect(0, 0, 30, 20, '#fff') + rect(12.5, 0, 5, 20, '#ce1124') + rect(0, 7.5, 30, 5, '#ce1124');
  F.sco = rect(0, 0, 30, 20, '#0065bd') + '<path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="3.2"/>';
  F.esp = rect(0, 0, 30, 20, '#aa151b') + rect(0, 5, 30, 10, '#f1bf00');
  F.ger = H(['#000', '#dd0000', '#ffce00']);
  F.ita = V(['#009246', '#fff', '#ce2b37']);
  F.fra = V(['#0055a4', '#fff', '#ef4135']);
  F.ned = H(['#ae1c28', '#fff', '#21468b']);
  F.por = rect(0, 0, 12, 20, '#006600') + rect(12, 0, 18, 20, '#ff0000') + circ(12, 10, 3.4, '#ffdf00', ' stroke="#fff" stroke-width=".6"');
  F.bel = V(['#000', '#fdda24', '#ef3340']);
  F.sui = rect(0, 0, 30, 20, '#d52b1e') + rect(12.5, 4, 5, 12, '#fff') + rect(8, 7.5, 14, 5, '#fff');
  F.aut = H(['#ed2939', '#fff', '#ed2939']);
  F.den = rect(0, 0, 30, 20, '#c8102e') + rect(9, 0, 3.4, 20, '#fff') + rect(0, 8.3, 30, 3.4, '#fff');
  F.nor = rect(0, 0, 30, 20, '#ba0c2f') + rect(8, 0, 5.4, 20, '#fff') + rect(0, 7.3, 30, 5.4, '#fff') + rect(9.2, 0, 3, 20, '#00205b') + rect(0, 8.5, 30, 3, '#00205b');
  F.swe = rect(0, 0, 30, 20, '#006aa7') + rect(9, 0, 4, 20, '#fecc00') + rect(0, 8, 30, 4, '#fecc00');
  F.pol = H(['#fff', '#dc143c']);
  F.rou = V(['#002b7f', '#fcd116', '#ce1126']);
  F.tur = rect(0, 0, 30, 20, '#e30a17') + circ(11.2, 10, 5, '#fff') + circ(12.6, 10, 4, '#e30a17') + star(16.8, 10, 2.3, '#fff', 0);
  F.sau = rect(0, 0, 30, 20, '#006c35') + rect(8, 5.5, 14, 2.2, '#fff') + rect(8, 12.8, 14, 1.1, '#fff');
  (function () {
    var s = '';
    for (var i = 0; i < 13; i++) s += rect(0, +(i * 20 / 13).toFixed(3), 30, +(20 / 13 + 0.05).toFixed(3), i % 2 ? '#fff' : '#b22234');
    s += rect(0, 0, 12, 10.77, '#3c3b6e');
    for (var r = 0; r < 4; r++) {
      var n = r % 2 ? 4 : 5, off = r % 2 ? 2.7 : 1.6;
      for (var c = 0; c < n; c++) s += circ(+(off + c * 2.2).toFixed(2), +(1.8 + r * 2.4).toFixed(2), 0.55, '#fff');
    }
    F.usa = s;
  })();
  F.mex = V(['#006847', '#fff', '#ce1126']) + circ(15, 10, 2.4, '#a67c37') + circ(15, 10, 1.4, '#6b8e23');
  F.arg = H(['#74acdf', '#fff', '#74acdf']) + circ(15, 10, 2.2, '#f6b40e');
  F.chi = rect(0, 0, 30, 10, '#fff') + rect(0, 10, 30, 10, '#d52b1e') + rect(0, 0, 10, 10, '#0039a6') + star(5, 5, 3, '#fff');
  F.aus = rect(0, 0, 30, 20, '#012169') +
    '<path d="M0 0L15 10M15 0L0 10" stroke="#fff" stroke-width="2"/><path d="M0 0L15 10M15 0L0 10" stroke="#c8102e" stroke-width=".8"/>' +
    rect(6, 0, 3, 10, '#fff') + rect(0, 3.5, 15, 3, '#fff') + rect(6.7, 0, 1.6, 10, '#c8102e') + rect(0, 4.2, 15, 1.6, '#c8102e') +
    star(7.5, 15.5, 2.6, '#fff') + star(22.5, 16.5, 1.5, '#fff') + star(18.5, 11.5, 1.5, '#fff') + star(22.5, 5, 1.5, '#fff') +
    star(26.5, 10.5, 1.5, '#fff') + star(23.8, 11.4, 0.9, '#fff');
  F.chn = rect(0, 0, 30, 20, '#ee1c25') + star(5, 5, 3, '#ffde00') + star(10, 2, 1, '#ffde00') + star(12, 4.4, 1, '#ffde00') + star(12, 7.4, 1, '#ffde00') + star(10, 9.6, 1, '#ffde00');
  F.ind = H(['#ff9933', '#fff', '#138808']) + circ(15, 10, 2.3, 'none', ' stroke="#000080" stroke-width=".6"');
  (function () {
    var s = rect(0, 0, 30, 20, '#fff');
    s += '<path d="M10.5 10a4.5 4.5 0 0 1 9 0z" fill="#cd2e3a"/><path d="M19.5 10a4.5 4.5 0 0 1-9 0z" fill="#0047a0"/>';
    [-36, 36, 144, 216].forEach(function (a) {
      s += '<g transform="rotate(' + a + ' 15 10)" fill="#000">' + rect(12.7, 1.6, 4.6, 0.8, '#000') + rect(12.7, 3, 4.6, 0.8, '#000') + rect(12.7, 4.4, 4.6, 0.8, '#000') + '</g>';
    });
    F.kor = s;
  })();
  F.mar = rect(0, 0, 30, 20, '#c1272d') + pentagram(15, 10.3, 4.4, '#006233');
  F.irl = V(['#169b62', '#fff', '#ff883e']);
  (function () {
    var s = '';
    for (var i = 0; i < 9; i++) s += rect(0, +(i * 20 / 9).toFixed(3), 30, +(20 / 9 + 0.05).toFixed(3), i % 2 ? '#fff' : '#0d5eaf');
    s += rect(0, 0, 11.12, 11.12, '#0d5eaf') + rect(4.5, 0, 2.1, 11.12, '#fff') + rect(0, 4.5, 11.12, 2.1, '#fff');
    F.gre = s;
  })();
  F.uae = rect(0, 0, 8, 20, '#ef3340') + rect(8, 0, 22, 6.7, '#00732f') + rect(8, 6.65, 22, 6.7, '#fff') + rect(8, 13.3, 22, 6.7, '#000');
  F.cyp = rect(0, 0, 30, 20, '#fff') + '<path d="M8 11c3-3 6-4 9-3s5 0 6 1-2 3-4 3-4 2-6 2-4 1-5 0z" fill="#d57800"/><path d="M10 14.6q5 3 10 0" stroke="#4e5b31" stroke-width=".8" fill="none"/>';
  F.ukr = H(['#0057b7', '#ffd700']);
  (function () {
    var s = H(['#ff0000', '#fff', '#171796']);
    s += rect(12.4, 6.4, 5.2, 7.2, '#fff');
    for (var r = 0; r < 5; r++) for (var c = 0; c < 4; c++) if ((r + c) % 2 === 0) s += rect(+(12.4 + c * 1.3).toFixed(2), +(6.4 + r * 1.44).toFixed(2), 1.3, 1.44, '#ff0000');
    s += '<rect x="12.4" y="6.4" width="5.2" height="7.2" fill="none" stroke="#171796" stroke-width=".4"/>';
    F.cro = s;
  })();
  F.hun = H(['#ce2939', '#fff', '#477050']);
  F.fin = rect(0, 0, 30, 20, '#fff') + rect(7, 0, 4.4, 20, '#003580') + rect(0, 7.8, 30, 4.4, '#003580');
  F.aze = H(['#00b5e2', '#ef3340', '#509e2f']) + circ(13.5, 10, 2.8, '#fff') + circ(14.4, 10, 2.3, '#ef3340') + star(17.6, 10, 1.3, '#fff', 0);
  F.cze = rect(0, 0, 30, 10, '#fff') + rect(0, 10, 30, 10, '#d7141a') + '<polygon points="0,0 15,10 0,20" fill="#11457e"/>';

  window.FLAGS = F;

  window.CLUB_NOTES = {
    "Atalanta": "в игре: Bergamo Calcio",
    "Inter": "в игре: Lombardia FC",
    "Lazio": "в игре: Latium",
    "Milan": "в игре: Milano FC",
    "Monza": "в игре: Brianza Calcio"
  };

  window.WORLD = [
    { id: "eng", name: "Англия", leagues: [
      { id: "pl", name: "Премьер-лига", clubs: ["Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton & Hove Albion", "Burnley", "Chelsea", "Crystal Palace", "Everton", "Fulham", "Leeds United", "Liverpool", "Manchester City", "Manchester United", "Newcastle United", "Nottingham Forest", "Sunderland", "Tottenham", "West Ham", "Wolverhampton"] },
      { id: "ch", name: "Чемпионшип", clubs: ["Birmingham City", "Blackburn Rovers", "Bristol City", "Charlton Athletic", "Coventry City", "Derby County", "Hull City", "Ipswich Town", "Leicester City", "Middlesbrough", "Millwall", "Norwich City", "Oxford United", "Portsmouth", "Preston North End", "Queens Park Rangers", "Sheffield United", "Sheffield Wednesday", "Southampton", "Stoke City", "Swansea City", "Watford", "West Bromwich Albion", "Wrexham"] },
      { id: "l1", name: "Лига Один", clubs: ["Barnsley", "Blackpool", "Bolton Wanderers", "Bradford City", "Burton Albion", "Cardiff City", "Doncaster Rovers", "Exeter City", "Huddersfield Town", "Leyton Orient", "Lincoln City", "Luton Town", "Mansfield Town", "Northampton Town", "Peterborough United", "Plymouth Argyle", "Port Vale", "Reading", "Rotherham United", "Stevenage", "Stockport County", "Wigan Athletic", "AFC Wimbledon", "Wycombe Wanderers"] },
      { id: "l2", name: "Лига Два", clubs: ["Accrington Stanley", "Barnet", "Barrow", "Bristol Rovers", "Bromley", "Cambridge United", "Cheltenham Town", "Chesterfield", "Colchester United", "Crawley Town", "Crewe Alexandra", "Fleetwood Town", "Gillingham", "Grimsby Town", "Harrogate Town", "Milton Keynes Dons", "Newport County", "Notts County", "Oldham Athletic", "Salford City", "Shrewsbury Town", "Swindon Town", "Tranmere Rovers", "Walsall"] },
      { id: "wsl", name: "Суперлига (жен.)", women: true, clubs: ["Arsenal", "Aston Villa", "Brighton & Hove Albion", "Chelsea", "Everton", "Leicester City", "Liverpool", "London City Lionesses", "Manchester City", "Manchester United", "Tottenham", "West Ham"] }
    ] },
    { id: "esp", name: "Испания", leagues: [
      { id: "ll", name: "Ла Лига", clubs: ["Alavés", "Athletic Bilbao", "Atlético Madrid", "Celta Vigo", "Elche", "Espanyol", "FC Barcelona", "Getafe", "Girona", "Levante", "Mallorca", "Osasuna", "Rayo Vallecano", "Real Betis", "Real Madrid", "Real Oviedo", "Real Sociedad", "Sevilla", "Valencia", "Villarreal"] },
      { id: "ll2", name: "Ла Лига 2", clubs: ["Albacete", "Almería", "Andorra", "Burgos", "Cádiz", "Castellón", "Ceuta", "Córdoba CF", "Cultural Leonesa", "Deportivo La Coruña", "Eibar", "Granada", "Huesca", "Las Palmas", "Leganés", "Málaga", "Mirandés", "Racing Santander", "Real Sociedad B", "Sporting de Gijón", "Valladolid", "Zaragoza"] },
      { id: "lf", name: "Лига F (жен.)", women: true, clubs: ["Alhama", "Athletic Bilbao", "Atlético Madrid", "Deportivo Abanca", "DUX Logroño", "Espanyol", "FC Barcelona", "Granada", "Levante", "Levante Las Planas", "Madrid CFF", "Real Madrid", "Real Sociedad", "Sevilla", "SD Eibar", "UDG Tenerife"] }
    ] },
    { id: "ger", name: "Германия", leagues: [
      { id: "bl", name: "Бундеслига", clubs: ["1. FC Heidenheim", "1. FC Köln", "1899 Hoffenheim", "Bayer Leverkusen", "Bayern Munich", "Borussia Dortmund", "Borussia Mönchengladbach", "Eintracht Frankfurt", "FC Augsburg", "FC St. Pauli", "Hamburger SV", "Mainz 05", "RB Leipzig", "SC Freiburg", "Union Berlin", "VfB Stuttgart", "VfL Wolfsburg", "Werder Bremen"] },
      { id: "bl2", name: "2. Бундеслига", clubs: ["1. FC Kaiserslautern", "1. FC Magdeburg", "1. FC Nürnberg", "Arminia Bielefeld", "Darmstadt 98", "Dynamo Dresden", "Eintracht Braunschweig", "Fortuna Düsseldorf", "Greuther Fürth", "Hannover 96", "Hertha BSC", "Holstein Kiel", "Karlsruher SC", "Preußen Münster", "SC Paderborn", "Schalke 04", "SV Elversberg", "VfL Bochum"] },
      { id: "l3", name: "3. Лига", clubs: ["1. FC Saarbrücken", "1. FC Schweinfurt", "Alemannia Aachen", "Energie Cottbus", "Erzgebirge Aue", "FC Ingolstadt 04", "FC Viktoria Köln", "Hansa Rostock", "Jahn Regensburg", "MSV Duisburg", "Rot-Weiss Essen", "SC Verl", "SSV Ulm", "SV Waldhof Mannheim", "TSG Hoffenheim II", "TSV 1860 München", "TSV Havelse", "VfB Stuttgart II", "VfL Osnabrück", "Wehen Wiesbaden"] },
      { id: "fbl", name: "Бундеслига (жен.)", women: true, clubs: ["1. FC Köln", "1. FC Nürnberg", "1899 Hoffenheim", "Bayer Leverkusen", "Bayern Munich", "Carl Zeiss Jena", "Eintracht Frankfurt", "Hamburger SV", "SC Freiburg", "RB Leipzig", "Rot-Weiss Essen", "Union Berlin", "VfL Wolfsburg", "Werder Bremen"] }
    ] },
    { id: "ita", name: "Италия", leagues: [
      { id: "sa", name: "Серия A", clubs: ["AS Roma", "Atalanta", "Bologna", "Cagliari", "Como", "Cremonese", "Fiorentina", "Genoa", "Hellas Verona", "Inter", "Juventus", "Lazio", "Lecce", "Milan", "Napoli", "Parma", "Pisa", "Sassuolo", "Torino", "Udinese"] },
      { id: "sb", name: "Серия B", clubs: ["Avellino", "Bari", "Carrarese", "Catanzaro", "Cesena", "Empoli", "Frosinone", "Juve Stabia", "Mantova", "Modena", "Monza", "Padova", "Palermo", "Pescara", "Reggiana", "Sampdoria", "Spezia", "Südtirol", "Venezia", "Virtus Entella"] },
      { id: "saf", name: "Серия A (жен.)", women: true, clubs: ["Como", "Fiorentina", "Genoa", "Inter", "Juventus", "Lazio", "Milan", "Napoli", "Parma", "AS Roma", "Sassuolo", "Ternana"] }
    ] },
    { id: "fra", name: "Франция", leagues: [
      { id: "l1", name: "Лига 1", clubs: ["Angers SCO", "AS Monaco", "Auxerre", "FC Lorient", "FC Nantes", "FC Metz", "Le Havre AC", "LOSC Lille", "OGC Nice", "Olympique de Marseille", "Olympique Lyonnais", "Paris FC", "Paris Saint-Germain", "Racing Club de Lens", "RC Strasbourg Alsace", "Stade Brestois 29", "Stade Rennais FC", "Toulouse FC"] },
      { id: "l2", name: "Лига 2", clubs: ["Amiens SC", "AS Saint-Étienne", "Beauleroix FC", "Clermont Foot", "Dunkerque", "En Avant Guingamp", "FC Annecy", "Grenoble Foot 38", "Laval", "Le Mans", "Montpellier HSC", "Nancy", "Pau FC", "Red Star FC", "Stade de Reims", "Rodez Aveyron", "SC Bastia", "Troyes"] },
      { id: "d1f", name: "Дивизион 1 (жен.)", women: true, clubs: ["AS Saint-Étienne", "Dijon", "Fleury", "Le Havre", "Montpellier HSC", "Nantes", "OL Lyonnes", "Olympique de Marseille", "Paris FC", "Paris Saint-Germain", "Racing Club de Lens", "Strasbourg"] }
    ] },
    { id: "ned", name: "Нидерланды", leagues: [
      { id: "ere", name: "Эредивизи", clubs: ["Ajax", "AZ", "Excelsior", "FC Utrecht", "FC Volendam", "Feyenoord", "Fortuna Sittard", "Go Ahead Eagles", "Groningen", "Heracles Almelo", "NAC Breda", "NEC Nijmegen", "PEC Zwolle", "PSV", "SC Heerenveen", "Sparta Rotterdam", "Telstar", "Twente"] }
    ] },
    { id: "por", name: "Португалия", leagues: [
      { id: "lp", name: "Лига Португалии", clubs: ["Alverca", "Arouca", "AVS", "Casa Pia", "CD Nacional", "Estoril", "Estrela Amadora", "Famalicão", "FC Porto", "Gil Vicente", "Moreirense", "Rio Ave", "Santa Clara", "SL Benfica", "Sporting", "Sporting de Braga", "Tondela", "Vitória de Guimarães"] }
    ] },
    { id: "tur", name: "Турция", leagues: [
      { id: "sl", name: "Суперлига", clubs: ["Alanyaspor", "Antalyaspor", "Beşiktaş Istanbul", "Eyüpspor", "Fatih Karagümrük", "Fenerbahçe Istanbul", "Galatasaray Istanbul", "Gazişehir Gaziantep FK", "Gençlerbirliği", "Göztepe", "Istanbul Başakşehir FK", "Kasımpaşa Istanbul", "Kayserispor", "Kocaelispor", "Konyaspor", "Rizespor", "Samsunspor", "Trabzonspor"] }
    ] },
    { id: "sau", name: "Саудовская Аравия", leagues: [
      { id: "spl", name: "Про-лига", clubs: ["Al Ahli", "Al-Fateh", "Al Fayha", "Al Hazem", "Al Hilal", "Al Ittihad", "Al Khaleej", "Al Kholood", "Al Najma", "Al Nassr", "Al Okhdood", "Al Qadsiah", "Al Riyadh SC", "Al Shabab", "Al Taawoun", "Damac", "Ettifaq FC", "Neom"] }
    ] },
    { id: "usa", name: "США", leagues: [
      { id: "mls", name: "MLS", clubs: ["Atlanta United", "Austin FC", "CF Montreal", "Charlotte FC", "Chicago Fire", "Colorado Rapids", "Columbus Crew SC", "D.C. United", "FC Cincinnati", "FC Dallas", "Houston Dynamo", "Inter Miami CF", "LA Galaxy", "Los Angeles FC", "Minnesota United FC", "Nashville SC", "New England Revolution", "New York City FC", "New York Red Bulls", "Orlando City", "Philadelphia Union", "Portland Timbers", "Real Salt Lake", "San Diego", "San Jose Earthquakes", "Seattle Sounders FC", "Sporting Kansas City", "St Louis City", "Toronto FC", "Vancouver Whitecaps FC"] },
      { id: "nwsl", name: "NWSL (жен.)", women: true, clubs: ["Angel City", "Bay FC", "Chicago Red Stars", "Houston Dash", "Kansas City Current", "NJ/NY Gotham", "North Carolina Courage", "Orlando Pride", "Portland Thorns", "Racing Louisville", "San Diego Wave", "Seattle Reign", "Utah Royals", "Washington Spirit"] }
    ] },
    { id: "mex", name: "Мексика", leagues: [
      { id: "mx", name: "Лига MX", clubs: ["America", "Atlas", "Atlético San Luis", "Cruz Azul", "Guadalajara", "FC Juárez", "León", "Mazatlán", "Monterrey", "Necaxa", "Pachuca", "Puebla", "Querétaro", "Santos Laguna", "Tijuana", "Toluca", "UANL", "UNAM"] }
    ] },
    { id: "arg", name: "Аргентина", leagues: [
      { id: "lpf", name: "Лига Профессионал", clubs: ["Aldosivi", "Atlético Tucumán", "Argentinos Jrs", "Barracas Central", "Banfield", "Belgrano", "Boca Juniors", "Central Córdoba", "Defensa y Justicia", "Deportivo Riestra", "Estudiantes", "Gimnasia", "Godoy Cruz", "Huracán", "Independiente", "Independiente Rivadavia", "Instituto Córdoba", "Lanús", "Newell's", "Platense", "Racing Club", "River Plate", "Rosario Central", "San Martín", "San Lorenzo", "Sarmiento", "Talleres", "Tigre", "Unión", "Vélez Sarsfield"] }
    ] },
    { id: "sco", name: "Шотландия", leagues: [
      { id: "prem", name: "Премьершип", clubs: ["Aberdeen", "Celtic", "Dundee", "Dundee United", "Falkirk", "Heart of Midlothian", "Hibernian", "Kilmarnock", "Livingston", "Motherwell", "Rangers", "St Mirren"] }
    ] },
    { id: "bel", name: "Бельгия", leagues: [
      { id: "pro", name: "Про-лига", clubs: ["Cercle Brugge", "Charleroi", "Club Brugge", "Dender EH", "Genk", "Gent", "La Louvière", "Leuven", "Mechelen", "Royal Antwerp FC", "R.S.C Anderlecht", "Sint-Truiden", "Standard Liège", "Union SG", "Westerlo", "Zulte Waregem"] }
    ] },
    { id: "aut", name: "Австрия", leagues: [
      { id: "bl", name: "Бундеслига", clubs: ["Blau-Weiß Linz", "FC Red Bull Salzburg", "FK Austria Wien", "Grazer AK", "LASK", "SCR Altach", "SK Rapid Wien", "SK Sturm Graz", "SV Ried", "TSV Hartberg", "Wolfsberger AC", "WSG Tirol"] }
    ] },
    { id: "sui", name: "Швейцария", leagues: [
      { id: "sl", name: "Суперлига", clubs: ["BSC Young Boys", "FC Basel", "FC Lausanne-Sport", "FC Lugano", "FC Luzern", "FC Sion", "FC St. Gallen", "FC Zürich", "Grasshopper", "Servette FC", "Thun", "Winterthur"] }
    ] },
    { id: "den", name: "Дания", leagues: [
      { id: "sl", name: "Суперлига", clubs: ["Aarhus", "Brøndby IF", "FC København", "FC Midtjylland", "FC Nordsjælland", "Fredericia", "OB Odense", "Randers FC", "Silkeborg IF", "SønderjyskE", "Vejle Boldklub", "Viborg FF"] }
    ] },
    { id: "nor", name: "Норвегия", leagues: [
      { id: "eli", name: "Элитсерия", clubs: ["Bodø/Glimt", "Bryne", "Fredrikstad", "Hamarkameratene", "Haugesund", "KFUM Oslo", "Kristiansund", "Molde", "Rosenborg", "Sandefjord", "Sarpsborg 08", "SK Brann", "Strømsgodset", "Tromsø", "Vålerenga", "Viking"] }
    ] },
    { id: "swe", name: "Швеция", leagues: [
      { id: "all", name: "Аллсвенскан", clubs: ["AIK", "BK Häcken", "Degerfors IF", "Djurgårdens IF", "GAIS", "Halmstads BK", "Hammarby IF", "IF Brommapojkarna", "IF Elfsborg", "IFK Göteborg", "IFK Norrköping", "IFK Värnamo", "IK Sirius", "Malmö FF", "Mjällby AI", "Östers IF"] }
    ] },
    { id: "pol", name: "Польша", leagues: [
      { id: "ek", name: "Экстракласса", clubs: ["Arka Gdynia", "Bruk-Bet Termalica", "Cracovia", "GKS Katowice", "Górnik Zabrze", "Jagiellonia Białystok", "Korona Kielce", "Lechia Gdańsk", "Lech Poznań", "Legia Warszawa", "Motor Lublin", "Piast Gliwice", "Pogoń Szczecin", "Radomiak Radom", "Raków Częstochowa", "Widzew Łódź", "Wisła Płock", "Zagłębie Lubin"] }
    ] },
    { id: "rou", name: "Румыния", leagues: [
      { id: "sl", name: "Суперлига", clubs: ["Argeș Pitești", "Botoșani", "Csíkszereda Ciuc", "CFR Cluj", "Dinamo București", "Farul Constanța", "FCSB", "Hermannstadt", "Metaloglobus București", "Oțelul Galați", "Petrolul", "Rapid București", "Unirea Slobozia", "Universitatea Cluj", "Universitatea Craiova", "UTA Arad"] }
    ] },
    { id: "irl", name: "Ирландия", leagues: [
      { id: "pd", name: "Премьер-дивизион", clubs: ["Bohemians", "Cork City", "Derry City", "Drogheda", "Galway United", "Shamrock Rovers", "Sligo Rovers", "Shelbourne", "St Patrick's Athletic", "Waterford"] }
    ] },
    { id: "kor", name: "Южная Корея", leagues: [
      { id: "k1", name: "К-Лига 1", clubs: ["Daegu FC", "Daejeon Hana Citizen", "FC Anyang", "FC Seoul", "Gangwon FC", "Gimcheon Sangmu", "Gwangju FC", "Jeonbuk Hyundai Motors", "Jeju United", "Pohang Steelers", "Suwon FC", "Ulsan Hyundai"] },
      { id: "k2", name: "К-Лига 2", clubs: ["Ansan Greeners", "Bucheon FC 1995", "Busan IPark", "Cheonan City", "Chungbuk Cheongju", "Chungnam Asan", "Gimpo FC", "Gyeongnam FC", "Jeonnam Dragons", "Seongnam FC", "Seoul E-Land"] }
    ] },
    { id: "chn", name: "Китай", leagues: [
      { id: "csl", name: "Суперлига", clubs: ["Beijing Sinobo Guoan", "Changchun Yatai", "Chengdu Rongcheng", "Dalian Yingbo", "Henan Jianye", "Meizhou Hakka", "Qingdao Hainiu", "Qingdao West Coast", "Shandong Luneng Taishan", "Shanghai Greenland Shenhua", "Shanghai Port", "Shenzhen Peng City", "Tianjin TEDA", "Yunnan Yukun", "Wuhan Three Towns", "Zhejiang"] }
    ] },
    { id: "ind", name: "Индия", leagues: [
      { id: "isl", name: "Индийская суперлига", clubs: ["ATK Mohun Bagan", "Bengaluru", "Chennaiyin", "East Bengal", "Goa", "Hyderabad", "Jamshedpur", "Kerala Blasters", "Mohammedan", "Mumbai City", "NorthEast United", "Odisha", "RoundGlass Punjab", "United Tigers"] }
    ] },
    { id: "aus", name: "Австралия", leagues: [
      { id: "al", name: "А-Лига", clubs: ["Adelaide United", "Auckland FC", "Brisbane Roar", "Central Coast Mariners", "Macarthur FC", "Melbourne City", "Melbourne Victory", "Newcastle Jets", "Perth Glory", "Sydney FC", "Western Sydney Wanderers", "Wellington Phoenix", "Western United"] }
    ] },
    { id: "mar", name: "Марокко", leagues: [
      { id: "bp", name: "Ботола Про", clubs: ["Chabab Mohammedia", "CR Khemis", "FAR Rabat", "FUS Rabat", "Hassania Agadir", "Ittihad Tanger", "MAS Fes", "MAT Tetouan", "MCO Oujda", "Olympic Club de Safi", "Raja Casablanca", "RSB Berkane", "Salmi", "Union Touarga Sport", "Wydad Casablanca", "Youssoufia Berrechid"] }
    ] },
    { id: "gre", name: "Греция", leagues: [{ id: "cl", name: "Клубы", clubs: ["AEK Athens", "Olympiacos FC", "Panathinaikos", "PAOK"] }] },
    { id: "cze", name: "Чехия", leagues: [{ id: "cl", name: "Клубы", clubs: ["Slavia Praha", "Sparta Praha", "Viktoria Plzeň"] }] },
    { id: "cro", name: "Хорватия", leagues: [{ id: "cl", name: "Клубы", clubs: ["Dinamo Zagreb", "Hajduk Split"] }] },
    { id: "ukr", name: "Украина", leagues: [{ id: "cl", name: "Клубы", clubs: ["Dinamo Kiev", "Shakhtar Donetsk"] }] },
    { id: "hun", name: "Венгрия", leagues: [{ id: "cl", name: "Клубы", clubs: ["Ferencvárosi TC"] }] },
    { id: "fin", name: "Финляндия", leagues: [{ id: "cl", name: "Клубы", clubs: ["HJK Helsinki"] }] },
    { id: "cyp", name: "Кипр", leagues: [{ id: "cl", name: "Клубы", clubs: ["APOEL FC"] }] },
    { id: "aze", name: "Азербайджан", leagues: [{ id: "cl", name: "Клубы", clubs: ["Qarabağ FK"] }] },
    { id: "uae", name: "ОАЭ", leagues: [{ id: "cl", name: "Клубы", clubs: ["Al Ain FC"] }] },
    { id: "chi", name: "Чили", leagues: [{ id: "cl", name: "Клубы", clubs: ["Universidad Católica"] }] }
  ];
})();
