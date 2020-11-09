window.onload = function() {
    console.log('loaded!');
    var timeSinceLastUpdate = 0;
    var timeout = 1000;
    var lastResponse = '';
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
                var end = 'PSI';
                if(key === 'battery') {
                    end='Volts'
                } else if(key === 'wattage') {
                    end='Watts'
                }
                document.getElementById(key).innerHTML = key + ' | ' + (Math.round(res[key]*10)/10).toString().substring(0, 5) + ' ' + end;
            }
            if(xmlHttp.responseText !== lastResponse) {
                timeSinceLastUpdate = 0;
                document.getElementById('status').style.backgroundColor='Green';
            } else {

            }
            lastResponse = xmlHttp.responseText;
        } catch(err) {
            console.error(err);
            document.getElementById('status').style.backgroundColor='Red';
        }
    }, 100);
    window.setInterval(function(){
        timeSinceLastUpdate += 100;
        if(timeSinceLastUpdate > timeout) {
            document.getElementById('status').style.backgroundColor='Orange';
        }
    }, 100);
}
