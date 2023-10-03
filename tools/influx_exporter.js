const Influx = require('influx');

const influxLocal = new Influx.InfluxDB({
    host: '127.0.0.1',
    port: 8086,
    protocol: 'http',
    requestTimeout: 20000,
    failoverTimeout: 40000,
});

const influxRemote = new Influx.InfluxDB({
    host: '127.0.0.1',
    port: 8086,
    protocol: 'http',
    requestTimeout: 20000,
    failoverTimeout: 40000,
});

const localDatabaseName = 'justin_is_a_poop_head';
const remoteDatabaseName = '2021_10_31_capfill';

async function uploadMeasurement(m) {
    console.log('transferring measurement ' + m);
    let lastTime = 0;
    while(true) {
        console.log('selecting ' + m);
        const query = await influxLocal.queryRaw(`select value from "${m}" where time > ${lastTime}000000 order by time limit 10000`, {
            database: localDatabaseName,
            precision: 'ms'
        });
        const values = query.results[0].series[0].values;
        lastTime = values[values.length-1][0];
        console.log('transforming ' + m + ' of length: ' + values.length);
        let transformed = [];
        for(let i of values) {
            transformed.push({
                fields: {
                    value: i[1]
                },
                timestamp: i[0],
            });
        }
        console.log('writing ' + m);
        await influxRemote.writeMeasurement(m, transformed, {
            database: remoteDatabaseName,
            precision: 'ms'
        });
        if(values.length < 10000) {
            break;
        }
    }
    console.log('done writing ' + m);
    console.log('-----------------------');
}

(async () => {
    const measurements = await influxLocal.getMeasurements(localDatabaseName);
    const modMeas = measurements.slice(measurements.indexOf("syslog")+1);
    for(let m of modMeas) {
        await uploadMeasurement(m);
    }
})();



