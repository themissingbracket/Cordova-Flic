/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('resume', this.onAppResume, false);
        document.getElementById('myBtn1').addEventListener('click', this.grabButton);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        var config = {
            appId: 'dbcce1f9-c4b9-41c1-89fb-2f36c8577706',
            appSecret: 'f17c4448-093b-4ba8-951a-bb40113b1900',
            appName: 'your app name',
            reloadOnFlicEvent: true
        }

        console.log('Starting Flic Manager');

        function successInit(result) {
            console.log('Flic init succeeded');
            document.querySelector('#deviceready').setAttribute('style', 'display:block;');
           
            Flic.onButtonClick(app.onFlicButtonPressed, function(errorMessage){
                console.log(errorMessage)
            })
            app.renderKnownButtons()
        }

        function errorInit(message) {
            console.log('Flic init failed: ' + message);
        }

        try {
            Flic.init(config, successInit, errorInit);
        } catch (e) {
            console.log('Flic exception: ' + e.message);
        }
    },
    onAppResume: function() {
        console.log('App resume');
        app.renderKnownButtons();
    },
    onFlicButtonPressed: function(result) {
        console.log(result.event); // (String) singleClick or doubleClick or hold
        console.log(result.button.buttonId); // (String)
        console.log(result.button.color); // (String) green
        console.log(result.wasQueued); // (Boolean) If the event was locally queued in the button because it was disconnected. After the connection is completed, the event will be sent with this parameter set to true.
        console.log(result.timeDiff); // (Number) If the event was queued, the timeDiff will be the number of seconds since the event happened.

        var button = document.querySelector('#' + app.escapeId(result.button.buttonId));
        if(button) {
            button.classList.remove('shake'); 
            setTimeout(function(){
                button.classList.add('shake')
            }, 20)
        } else {
            console.log('button not found')
        }
    },

    renderKnownButtons: function() {
        Flic.getKnownButtons(function(buttons) {
            console.log('Flic getKnownButtons succeeded');
            console.log('Flic known buttons: ' + JSON.stringify(buttons));
            var buttonsCont = document.querySelector('#buttons');
            buttonsCont.innerHTML = '';
            for (var i = 0; i < buttons.length; i += 1) {
                var button = buttons[i];
                var element = document.createElement('div');
                element.classList.add('btn')
                if (button.colorHex) {
                    element.style.borderColor = '#' + button.colorHex;
                } else {
                    element.style.borderColor = button.color;
                } 
                element.innerHTML = 'Button status: ' + button.status;
                element.id = app.escapeId(button.buttonId);
                buttonsCont.appendChild(element);
            }
        },
        function(message) {
            console.log('Flic getKnownButtons failed: ' + message);
        });
    },

    grabButton: function() {
        Flic.grabButton(function(button) {
            console.log('Flic grabButton succeeded');
            console.log('Flic grabbed button: ' + JSON.stringify(button));
            app.renderKnownButtons()
        },
        function(message) {
            console.log('Flic grabButton failed: ' + message);
        });
    },

    escapeId: function(id) {
        return id ? id.replace(/[^a-zA-Z]/g, '') : null
    }
};

app.initialize();
