"use strict";
let mqtt = require('mqtt');
let inherits = require('inherits');
let EventEmitter = require('events').EventEmitter;


function MQTTConnection(config) {
    if (!(this instanceof MQTTConnection)) {
        return new MQTTConnection(config);
    }
    this.config = config || {};
}

MQTTConnection.prototype.connect = function (hostname, port) {
    this.config["hostname"] = hostname || "localhost";
    this.config["port"] = port || 9003;
    this.config["client"] = mqtt.connect(`ws://${this.config["hostname"]}:${this.config["port"]}`);
}

MQTTConnection.prototype.sub = function (topic) {
    let that = this;
    that.config.client.subscribe(topic, (err) => {
        if (err) throw err
    });
    return new RequestData(topic, that.config.client)
}

function RequestData(topic, client) {
    this.client = client;
    this.topic = topic;
    EventEmitter.call(this)
    this._load()

}
inherits(RequestData, EventEmitter)

RequestData.prototype._load = function () {
    let that = this;
    that.client.on("message", (t, p) => {
        if (t === that.topic) {
            that.emit("value", {topic: t, payload: p.toString()}, null)
        }
    });
}

module.exports = MQTTConnection;