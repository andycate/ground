window.onload = function() {
    console.log('loaded!');
    window.setInterval(function() {
        console.log('requesting data');
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", '/sensors', false ); // false is synchronous
        try {
            xmlHttp.send( null );
            var res = JSON.parse(xmlHttp.responseText);
            console.log(res);
            for (var key of Object.keys(res)) {
                console.log(key + " -> " + res[key])
                document.getElementById(key).innerHTML = key + ' - ' + res[key] + ' PSI';
            }
            document.getElementById('status').style.backgroundColor='Green';
        } catch(err) {
            document.getElementById('status').style.backgroundColor='Red';
        }
    }, 1000);
}
