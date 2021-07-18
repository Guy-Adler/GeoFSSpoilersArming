// ==UserScript==
// @name GeoFS Spoilers Arming
// @description This is a recreation of the extension by Harry Xue, which allows the user to arm the spoilers before landing in GeoFS.
// @namespace https://github.com/Guy-Adler/GeoFSSpoilersArming
// @version 1.0.1
// @author Guy Adler, Harry Xue
// @icon https://raw.githubusercontent.com/Guy-Adler/GeoFSSpoilersArming/main/spoilersArmIcon.png
// @match https://www.geo-fs.com/geofs.php
// @run-at document-end
// @grant none
// ==/UserScript==

(function (init) {
	// Checks if the game completed loading
	var timer = setInterval(function () {
		if (window.geofs && geofs.aircraft && geofs.aircraft.instance && geofs.aircraft.instance.object3d) {
			clearInterval(timer);
			init();
		}
	}, 100);
})(function() {
    'ues strict';

    window.enabled = undefined;

    // remove default keybinds to make it so the new keybind for spoilers arming works
    function removeEvents() {
        // Remove all current keybinds, to change one of them:
        $(document).off('keydown');
    
    
        // don't break the game:
        $(document).on("keydown", ".geofs-stopKeyboardPropagation", function(a) {
            a.stopImmediatePropagation()
        });
        $(document).on("keydown", ".address-input", function(a) {
            a.stopImmediatePropagation()
        });
    }
    removeEvents();

    // add the spoilers arming to the controls
    controls.spoilersArming = false;
    controls.setters.spoilersArming = {
        label: 'Spoiler Arming',
        set: function() {
            if (enabled) {
                if (!geofs.aircraft.instance.groundContact) {
                        controls.spoilersArming = !controls.spoilersArming;
                } else {
                    controls.spoilersArming = false;
                }
            }
        }
    }

    // add the keybind for the spoilers arming
    var keydownTrigger = controls.keyDown;
	controls.keyDown = function (event) {
        if (typeof enabled !== 'undefined') {
            if (event.which === geofs.preferences.keyboard.keys['Airbrake toggle (on/off)'].keycode) {
                if (event.shiftKey) {
                    enabled = true;
                    controls.setters.spoilersArming.set();
                 } else {
                    enabled = false;
                    controls.spoilersArming = false;
                    controls.setters.setAirbrakes.set();
                 }
             } else {
                 keydownTrigger(event);
             }
        } else {
            keydownTrigger(event);
        }
    };


    instruments.definitions.spoilersArming = {
		overlay: {
			url: 'https://raw.githubusercontent.com/Guy-Adler/GeoFSSpoilersArming/main/spoilersArm.png',
			alignment: { x: 'right', y: 'bottom' },
			size: { x: 100, y: 21 },
			position: { x: 20, y: 195 },
			anchor: { x: 100, y: 0 },
			rescale: true,
			rescalePosition: true,
			animations: [{
				type: 'show',
				value: 'spoilersArmed'
            }]
		}
	};

    var oldInit = instruments.init;
	instruments.init = function (instrumentList) {
        aircraftWithBadlyImplementedSpoilers = ["2871", "2865", "2870", "2769", "2772"]
		if (typeof instrumentList.spoilers !== 'undefined' || aircraftWithBadlyImplementedSpoilers.includes(geofs.aircraft.instance.aircraftRecord.id)) {
            enabled = true;
            instrumentList.spoilersArming = instrumentList.spoilers;
		} else {
            enabled = undefined;
        }


		oldInit(instrumentList);
	};

    function spoilersArming() {
        geofs.aircraft.instance.animationValue.spoilersArmed = controls.spoilersArming; // update the animation
        if (controls.spoilersArming) {
            if (geofs.aircraft.instance.groundContact) {
                if (controls.airbrakes.position === 0 && enabled) {
                    controls.spoilersArming = false;
                    controls.setters.setAirbrakes.set();
                }
            }
        }
    }

    instruments.init(geofs.aircraft.instance.setup.instruments);
    $(document).on("keydown", controls.keyDown);  // reapply the keybinds
	geofs.api.addFrameCallback(spoilersArming, 'spoilersArming');
});
