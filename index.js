let mqtt = require('./lib/index');

let client = mqtt();
client.connect("localhost", "9003");

client.sub("p1/gps").on("value", (res) => {
    console.log(res);
});

client.sub("p1/temp").on("value", (res, err) => {
    console.log(res);
});
