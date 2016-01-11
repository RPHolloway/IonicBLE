//// Ionic Starter App
//
//// angular.module is a global place for creating, registering and retrieving Angular modules
//// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
//// the 2nd parameter is an array of 'requires'
////angular.module('starter', ['ionic'])
////
////.run(function($ionicPlatform) {
////  $ionicPlatform.ready(function() {
////    if(window.cordova && window.cordova.plugins.Keyboard) {
////      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
////      // for form inputs)
////      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
////
////      // Don't remove this line unless you know what you are doing. It stops the viewport
////      // from snapping when text inputs are focused. Ionic handles this internally for
////      // a much nicer keyboard experience.
////      cordova.plugins.Keyboard.disableScroll(true);
////    }
////    if(window.StatusBar) {
////      StatusBar.styleDefault();
////    }
////  });
////})
//
///*
//    SimpleSerial index.js
//    Created 7 May 2013
//    Modified 9 May 2013
//    by Tom Igoe
//*/
//
//
//var app = {
//    macAddress: "AA:BB:CC:DD:EE:FF",  // get your mac address from bluetoothSerial.list
//    chars: "",
//
///*
//    Application constructor
// */
//    initialize: function() {
//        this.bindEvents();
//        console.log("Starting SimpleSerial app");
//    },
///*
//    bind any events that are required on startup to listeners:
//*/
//    bindEvents: function() {
//        document.addEventListener('deviceready', this.onDeviceReady, false);
//        connectButton.addEventListener('touchend', app.manageConnection, false);
//    },
//
///*
//    this runs when the device is ready for user interaction:
//*/
//    onDeviceReady: function() {
//        // check to see if Bluetooth is turned on.
//        // this function is called only
//        //if isEnabled(), below, returns success:
//        var listPorts = function() {
//            // list the available BT ports:
//            bluetoothSerial.list(
//                function(results) {
//                    app.display(JSON.stringify(results));
//                },
//                function(error) {
//                    app.display(JSON.stringify(error));
//                }
//            );
//        }
//
//        // if isEnabled returns failure, this function is called:
//        var notEnabled = function() {
//            app.display("Bluetooth is not enabled.")
//        }
//
//         // check if Bluetooth is on:
//        bluetoothSerial.isEnabled(
//            listPorts,
//            notEnabled
//        );
//    },
///*
//    Connects if not connected, and disconnects if connected:
//*/
//    manageConnection: function() {
//
//        // connect() will get called only if isConnected() (below)
//        // returns failure. In other words, if not connected, then connect:
//        var connect = function () {
//            // if not connected, do this:
//            // clear the screen and display an attempt to connect
//            app.clear();
//            app.display("Attempting to connect. " +
//                "Make sure the serial port is open on the target device.");
//            // attempt to connect:
//            bluetoothSerial.connect(
//                app.macAddress,  // device to connect to
//                app.openPort,    // start listening if you succeed
//                app.showError    // show the error if you fail
//            );
//        };
//
//        // disconnect() will get called only if isConnected() (below)
//        // returns success  In other words, if  connected, then disconnect:
//        var disconnect = function () {
//            app.display("attempting to disconnect");
//            // if connected, do this:
//            bluetoothSerial.disconnect(
//                app.closePort,     // stop listening to the port
//                app.showError      // show the error if you fail
//            );
//        };
//
//        // here's the real action of the manageConnection function:
//        bluetoothSerial.isConnected(disconnect, connect);
//    },
///*
//    subscribes to a Bluetooth serial listener for newline
//    and changes the button:
//*/
//    openPort: function() {
//        // if you get a good Bluetooth serial connection:
//        app.display("Connected to: " + app.macAddress);
//        // change the button's name:
//        connectButton.innerHTML = "Disconnect";
//        // set up a listener to listen for newlines
//        // and display any new data that's come in since
//        // the last newline:
//        bluetoothSerial.subscribe('\n', function (data) {
//            app.clear();
//            app.display(data);
//        });
//    },
//
///*
//    unsubscribes from any Bluetooth serial listener and changes the button:
//*/
//    closePort: function() {
//        // if you get a good Bluetooth serial connection:
//        app.display("Disconnected from: " + app.macAddress);
//        // change the button's name:
//        connectButton.innerHTML = "Connect";
//        // unsubscribe from listening:
//        bluetoothSerial.unsubscribe(
//                function (data) {
//                    app.display(data);
//                },
//                app.showError
//        );
//    },
///*
//    appends @error to the message div:
//*/
//    showError: function(error) {
//        app.display(error);
//    },
//
///*
//    appends @message to the message div:
//*/
//    display: function(message) {
//        var display = document.getElementById("message"), // the message div
//            lineBreak = document.createElement("br"),     // a line break
//            label = document.createTextNode(message);     // create the label
//
//        display.appendChild(lineBreak);          // add a line break
//        display.appendChild(label);              // add the message node
//    },
///*
//    clears the message div:
//*/
//    clear: function() {
//        var display = document.getElementById("message");
//        display.innerHTML = "";
//    }
//};      // end of app

// (c) 2014 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global mainPage, deviceList, refreshButton */
/* global detailPage, resultDiv, messageInput, sendButton, disconnectButton */
/* global ble  */
/* jshint browser: true , devel: true*/
'use strict';

// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

// this is Nordic's UART service
var bluefruit = {
    serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
};

var app = {
    initialize: function() {
        this.bindEvents();
        detailPage.hidden = true;
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
        sendButton.addEventListener('click', this.sendData, false);
        disconnectButton.addEventListener('touchstart', this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
    },
    onDeviceReady: function() {
        app.refreshDeviceList();
    },
    refreshDeviceList: function() {
        deviceList.innerHTML = ''; // empties the list
        if (cordova.platformId === 'android') { // Android filtering is broken
            ble.scan([], 5, app.onDiscoverDevice, app.onError);
        } else {
            ble.scan([bluefruit.serviceUUID], 5, app.onDiscoverDevice, app.onError);
        }
    },
    onDiscoverDevice: function(device) {
        var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                device.id;

        listItem.dataset.deviceId = device.id;
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);
    },
    connect: function(e) {
        var deviceId = e.target.dataset.deviceId,
            onConnect = function(peripheral) {
                app.determineWriteType(peripheral);

                // subscribe for incoming data
                ble.startNotification(deviceId, bluefruit.serviceUUID, bluefruit.rxCharacteristic, app.onData, app.onError);
                sendButton.dataset.deviceId = deviceId;
                disconnectButton.dataset.deviceId = deviceId;
                resultDiv.innerHTML = "";
                app.showDetailPage();
            };

        ble.connect(deviceId, onConnect, app.onError);
    },
    determineWriteType: function(peripheral) {
        // Adafruit nRF8001 breakout uses WriteWithoutResponse for the TX characteristic
        // Newer Bluefruit devices use Write Request for the TX characteristic

        var characteristic = peripheral.characteristics.filter(function(element) {
            if (element.characteristic.toLowerCase() === bluefruit.txCharacteristic) {
                return element;
            }
        })[0];

        if (characteristic.properties.indexOf('WriteWithoutResponse') > -1) {
            app.writeWithoutResponse = true;
        } else {
            app.writeWithoutResponse = false;
        }

    },
    onData: function(data) { // data received from Arduino
        console.log(data);
        resultDiv.innerHTML = resultDiv.innerHTML + "Received: " + bytesToString(data) + "<br/>";
        resultDiv.scrollTop = resultDiv.scrollHeight;
    },
    sendData: function(event) { // send data to Arduino

        var success = function() {
            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Sent: " + messageInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            alert("Failed writing data to the bluefruit le");
        };

        var data = stringToBytes(messageInput.value);
        var deviceId = event.target.dataset.deviceId;

        if (app.writeWithoutResponse) {
            ble.writeWithoutResponse(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                data, success, failure
            );
        } else {
            ble.write(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                data, success, failure
            );
        }

    },
    disconnect: function(event) {
        var deviceId = event.target.dataset.deviceId;
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },
    showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },
    onError: function(reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
    }
};