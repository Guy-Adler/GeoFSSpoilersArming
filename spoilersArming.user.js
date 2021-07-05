// ==UserScript==
// @name GeoFS Spoilers Arming
// @description This is a recreation of the extension by Harry Xue, which allows the user to arm the spoilers before landing in GeoFS.
// @namespace https://github.com/Guy-Adler/GeoFSSpoilersArming
// @version 1.0.0
// @author Guy Adler, Harry Xue
// @icon https://raw.githubusercontent.com/Guy-Adler/GeoFSSpoilersArming/main/spoilersArmIcon.png
// @match https://www.geo-fs.com/geofs.php
// @run-at document-end
// @grant none
// ==/UserScript==

!function(e){var o=setInterval(function(){window.geofs&&geofs.aircraft&&geofs.aircraft.instance&&geofs.aircraft.instance.object3d&&(clearInterval(o),function(){window.enabled=void 0,$(document).off("keydown"),$(document).on("keydown",".geofs-stopKeyboardPropagation",function(e){e.stopImmediatePropagation()}),$(document).on("keydown",".address-input",function(e){e.stopImmediatePropagation()}),controls.spoilersArming=!1,controls.setters.spoilersArming={label:"Spoiler Arming",set:function(){enabled&&(geofs.aircraft.instance.groundContact?controls.spoilersArming=!1:controls.spoilersArming=!controls.spoilersArming)}};var e=controls.keyDown;controls.keyDown=function(o){"undefined"!=typeof enabled&&o.which===geofs.preferences.keyboard.keys["Airbrake toggle (on/off)"].keycode?o.shiftKey?(enabled=!0,controls.setters.spoilersArming.set()):(enabled=!1,controls.spoilersArming=!1,controls.setters.setAirbrakes.set()):e(o)},instruments.definitions.spoilersArming={overlay:{url:"https://raw.githubusercontent.com/Guy-Adler/GeoFSSpoilersArming/main/spoilersArm.png",alignment:{x:"right",y:"bottom"},size:{x:100,y:21},position:{x:20,y:195},anchor:{x:100,y:0},rescale:!0,rescalePosition:!0,animations:[{type:"show",value:"spoilersArmed"}]}};var o=instruments.init;instruments.init=function(e){void 0!==e.spoilers?(enabled=!0,e.spoilersArming=e.spoilers):enabled=void 0,o(e)},instruments.init(geofs.aircraft.instance.setup.instruments),$(document).on("keydown",controls.keyDown),geofs.api.addFrameCallback(function(){geofs.aircraft.instance.animationValue.spoilersArmed=controls.spoilersArming,controls.spoilersArming&&geofs.aircraft.instance.groundContact&&0===controls.airbrakes.position&&enabled&&(controls.spoilersArming=!1,controls.setters.setAirbrakes.set())},"spoilersArming")}())},100)}();
