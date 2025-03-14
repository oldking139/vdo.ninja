/*
*  Copyright (c) 2022 Steve Seguin. All Rights Reserved.
*
*  Use of this source code is governed by the APGLv3 open-source license
*  that can be found in the LICENSE file in the root of the source
*  tree. Alternative licencing options can be made available on request.
*
*/
/*jshint esversion: 6 */


var formSubmitting = true;
var activatedPreview = false;

var screensharesupport = true;



var Callbacks = [];
var CtrlPressed = false; // global
var AltPressed = false;
var KeyPressedTimeout = 0;
var PPTKeyPressed = false;

var translation = false;

var miscTranslations = {
	"start" : "START",
	"new-display-name":"Enter a new Display Name for this stream",
	"submit-error-report": "Press OK to submit any error logs to VDO.Ninja. Error logs may contain private information.",
	"director-redirect-1": "The director wishes to redirect you to the URL: ",
	"director-redirect-2": "\n\nPress OK to be redirected.",
	"add-a-label": "Add a label",
	"audio-processing-disabled": "Audio processing is disabled with this guest. Can't mute or change volume",
	"not-the-director": "<font color='red'>You are not the director of this room. You will have limited to no control. See <a target='_blank' href='https://docs.vdo.ninja/director-settings/codirector'>&codirector</a> on how to become a co-director.</font>",
	"room-is-claimed": "The room is already claimed by someone else.\n\nOnly the first person to join a room is the assigned director.\n\nRefresh after the first director leaves to claim.",
	"room-is-claimed-codirector": "The room is already claimed by someone else.\n\nTrying to join as a co-director...",
	"streamid-already-published": "The stream ID you are publishing to is already in use.\n\nPlease try with a different invite link or refresh to retry again.\n\nYou will now be disconnected.",
	"director": "Director",
	"unknown-user": "Unknown User",
	"room-test-not-good": "The room name 'test' is very commonly used and may not be secure.\n\nAre you sure you wish to proceed?",
	"load-previous-session":"Would you like to load your previous session's settings?",
	"enter-password" : "Please enter the password below: \n\n(Note: Passwords are case-sensitive and you will not be alerted if it is incorrect.)",
	"enter-password-2" : "Please enter the password below: \n\n(Note: Passwords are case-sensitive.)",
	"enter-director-password": "Please enter the director's password:\n\n(Note: Passwords are case-sensitive and you will not be alerted if it is incorrect.)",
	"password-incorrect" : "The password was incorrect.\n\nRefresh and try again.",
	"enter-display-name" : "Please enter your display name:",
	"enter-new-display-name" :"Enter a new Display Name for this stream",
	"what-bitrate":"What bitrate would you like to record at? (kbps)\n(note: This feature is experimental, so have backup recordings going)",
	"enter-website": "Enter a website URL to share",
	"press-ok-to-record": "Press OK to start recording. Press again to stop and download.\n\nWarning: Keep this browser tab active to continue recording.\n\nYou can change the default video bitrate if desired below (kbps)",
	"no-streamID-provided": "No streamID was provided; one will be generated randomily.\n\nStream ID: ",
	"alphanumeric-only": "Info: Only AlphaNumeric characters should be used for the stream ID.\n\nThe offending characters have been replaced by an underscore",
	"stream-id-too-long": "The Stream ID should be less than 45 alPhaNuMeric characters long.\n\nWe will trim it to length.",
	"share-with-trusted":"Share only with those you trust",
	"pass-recommended" : "A password is recommended",
	"insecure-room-name" : "Insecure room name.",
	"allowed-chars" : "Allowed chars",
	"transfer" : "transfer",
	"armed" : "armed",
	"transfer-guest-to-room" : "Transfer guests to room:\n\n(Please note: rooms must share the same password)",
	"transfer-guest-to-url" :"Transfer guests to new website URL.\n\n(Guests will be prompted to accept)",
	"change-url" : "change URL",
	"mute-in-scene" : "mute in scene",
	"unmute-guest": "un-mute guest",
	"undeafen" : "un-deafen",
	"deafen" : "deafen guest",
	"unblind" : "un-blind",
	"blind" : "blind guest",
	"unmute" : "un-mute",
	"mute-guest" : "mute guest",
	"unhide" : "unhide guest",
	"hide-guest": "hide guest",
	"confirm-disconnect-users": "Are you sure you wish to disconnect these users?",
	"confirm-disconnect-user": "Are you sure you wish to disconnect this user?",
	"enter-new-codirector-password": "Enter a co-director password to use",
	"control-room-co-director": "Control Room: Co-Director",
	"signal-meter": "Video packet loss indicator of video preview; green is good, red is bad. Flame implies CPU is overloaded. May not reflect the packet loss seen by scenes or other guests.",
	"waiting-for-the-stream": "Waiting for the stream. Tip: Adding &cleanoutput to the URL will hide this spinner, or click to retry, which will also hide it.",
	"main-director": "Main Director",
	"share-a-screen": "Share a screen",
	"stop-screen-sharing": "Stop screen sharing",
	"you-have-been-transferred": "You've been transferred to a different room",
	"you-are-no-longer-a-co-director": "You are no longer a co-director as you were transferred.",
	"transferred": "Transferred",
	"room-changed": "Your room has changed",
	"headphones-tip": "<i>Tip:</i> Use headphones to avoid audio echo issues.",
	"camera-tip-c922": "<i>Tip:</i> To achieve 60-fps with a C922 webcam, low-light compensation needs to be turned off, exposure set to auto, and 720p used.",
	"camera-tip-camlink": "<i>Tip:</i> A Cam Link may glitch green/purple if accessed elsewhere while already in use.",
	"samsung-a-series": "Samsung A-series phones may have issues with Chrome; if so, try Firefox Mobile instead or switch video codecs.",
	"screen-permissions-denied": "Permission to capture denied. Ensure your browser has screen record system permissions\n\n1.On your Mac, choose Apple menu  > System Preferences, click Security & Privacy , then click Privacy.\n2.Select Screen Recording.\n3.Select the checkbox next to your browser to allow it to record your screen.",
	"change-audio-output-device": "Audio could not be captured. Please make sure you have an audio output device available.\n\nSome gaming headsets (ie: Corsair) may need to be set to 2-channel output to work, as surround sound drivers may cause problems.",
	"prompt-access-request": " is trying to view your stream. Allow them?",
	"confirm-reload-user": "Are you sure you wish to reload this user's browser?",
	"webrtc-is-blocked": "WebRTC is blocked or not supported by your browser.\n\nWithout WebRTC, this service will not function.",
	"not-clean-session": "Video effects or canvas rendering failed.\n\nCheck to ensure any remotely hosted images are cross-origin allowed."
};

// function log(msg){ // uncomment to enable logging.
	// console.log(msg);
// }
// function warnlog(msg, url=false, lineNumber=false){
	// onsole.warn(msg);
	// if (lineNumber){
		// console.warn(lineNumber);
	// }
// }
// function errorlog(msg, url=false, lineNumber=false){
	// console.error(msg);
	// if (lineNumber){
		// console.error(lineNumber);
	// }
// }

if (typeof session === 'undefined') { // make sure to init the WebRTC if not exists.
	var session = WebRTC.Media;
	session.streamID = session.generateStreamID();
	errorlog("Serious error: WebRTC session didn't load in time");
}

(function(w) {
	w.URLSearchParams = w.URLSearchParams || function(searchString) {
		var self = this;
		searchString = searchString.replace("??", "?");
		self.searchString = searchString;
		self.get = function(name) {
			var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(self.searchString);
			if (results == null) {
				return null;
			} else {
				return decodeURI(results[1]) || 0;
			}
		};
	};

})(window);

var urlEdited = window.location.search.replace(/\?\?/g, "?");
urlEdited = urlEdited.replace(/\?/g, "&");
urlEdited = urlEdited.replace(/\&/, "?");

if (urlEdited !== window.location.search){
	warnlog(window.location.search + " changed to " + urlEdited);
	window.history.pushState({path: urlEdited.toString()}, '', urlEdited.toString());
}
var urlParams = new URLSearchParams(urlEdited);

var isIFrame = false;
if ( parent && (window.location !== window.parent.location )) {
	isIFrame = true;
}

function mapToAll(targets, callback, parentElement = document) { // js helper
	if (!targets) {
		return;
	}
	if (!parentElement) {
		return;
	}
	const target = parentElement.querySelectorAll(targets);
	for (let i = 0; i < target.length; i++) {
		callback(target[i]);
	}
}

function changeParam(url, paramName, paramValue) {
	paramName = paramName.replace("?", "");
	var qind = url.indexOf('?');
	url = url.replace("?", "&");
	var params = url.substring(qind + 1).split('&');
	var query = '';
	var match = false;
	for (var i = 0; i < params.length; i++) {
		var tokens = params[i].split('=');
		var name = tokens[0];
		var value = "";
		if (tokens.length > 1 && tokens[1] !== '') {
			value = tokens[1];
		}

		if (name == paramName) {
			if (match) {
				continue;
			} // already matched the first time.
			match = true;
			value = paramValue;
		}
		if (value !== "") {
			value = '=' + value;
		}

		if (query == '') {
			query = "?" + name + value;
		} else {
			query = query + '&' + name + value;
		}
	}
	return url.substring(0, qind) + query;
}

function saveRoom(ele){
	//this.title = "Quick load settings stored locally";
	session.sticky = true;
	ele.parentNode.removeChild(ele);
	setStorage("permission", "yes");
	setStorage("settings", encodeURI(window.location.href), 999);
}

function updateURL(param, force = false, cleanUrl = false) {
	param = param.replace("?", "");
	var para = param.split('=');
	if (cleanUrl) {
		if (history.pushState) {
			var href = new URL(cleanUrl);
			if (para.length == 1) {
				href = changeParam(cleanUrl, para[0], "");
			} else {
				href = changeParam(cleanUrl, para[0], para[1]);
			}
			log("--" + href.toString());
			window.history.pushState({path: href.toString()}, '', href.toString());
		}
	} else if (!(urlParams.has(para[0]))) { // don't need to replace as it doesn't exist.
		if (history.pushState) {
			var href = window.location.href;
			href = href.replace("??", "?");
			var arr = href.split('?');
			var newurl;
			if (arr.length > 1 && arr[1] !== '') {
				newurl = href + '&' + param;
			} else {
				newurl = href + '?' + param;
			}

			window.history.pushState({path: newurl.toString()}, '', newurl.toString());
		}
	} else if (force) {
		if (history.pushState) {
			var href = new URL(window.location.href);
			if (para.length == 1) {
				href = changeParam(window.location.href, para[0], "");
			} else {
				href = changeParam(window.location.href, para[0], para[1]);
			}
			log("---" + href.toString());
			window.history.pushState({path: href.toString()}, '', href.toString());
		}
	}
	if (session.sticky) {
		setStorage("settings", encodeURI(window.location.href), 999);
	}
	urlParams = new URLSearchParams(window.location.search);
}

/* function changeGuestSettings(ele){
	var eles = ele.querySelectorAll('[data-param]');
	var UUID = ele.dataset.UUID;
	var settings = {};
	for (var i = 0;i< eles.length; i++){
		if (eles[i].tagName.toLowerCase() == "input"){
			if (eles[i].checked===true){
				settings[eles[i].dataset.param] = true;
			} else if (eles[i].checked===false){
				settings[eles[i].dataset.param] = false;
			} else {
				settings[eles[i].dataset.param] = eles[i].value;
			}
		}
	}
	warnlog(settings);
	
	if (!settings.changepassword){
		delete settings.password;
	}
	
	delete settings.changepassword;
	
	if (!settings.changeroom){
		// send Migration message
		delete settings.roomid;
	} 
	delete settings.roomid;
	delete settings.changeroom;
	
	warnlog(UUID);
	var msg = {};
	msg.changeParams = settings;
	session.sendRequest(msg, UUID);
	closeModal();
} */

// proper room migration needs to happen; in sync.
// updateMixer after settings changed
// password needs to be special cased
// room shouldn't be sent

function applyNewParams(changeParams){
	for (var key in changeParams){
		session[key] = changeParams[key];
		log(key);
	}
	log(changeParams);
	updateMixer();
}

function submitDebugLog(msg){
	try {
		appendDebugLog({"connection_type": session.stats.network_type});
		if (navigator.userAgent){
			var _, userAgent = navigator.userAgent;
			appendDebugLog({"userAgent": userAgent});
		}
		if (navigator.platform){
			appendDebugLog({"userAgent": navigator.platform});
		}
	} catch(e){}
	window.focus();
	var res = confirm(miscTranslations["submit-error-report"]);
	if (res){
		var request = new XMLHttpRequest();
		request.open('POST', "https://reports.vdo.ninja/");  //  php, well, whatever.
		request.send(JSON.stringify(errorReport));
		errorReport = [];
		if (document.getElementById("reportbutton")){
			getById("reportbutton").style.visibility = "hidden";
		}
	}
}

function detectGPUSupport() {
	try {
		const gl = document.createElement('canvas').getContext('webgl');

		if (!gl) {
			return false;
		}
		const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
		if (debugInfo){
			return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
		}
	} catch(e){}
    return false;
}

function isOperaGX(){
	return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/75') >= 0;
}

function isSamsungASeries(){
	return navigator.userAgent.includes("; SM-A") || false;
}

function getChromeVersion() {
	var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
	return raw ? parseInt(raw[2], 10) : false;
}

function safariVersion() {
	var ver = 0;
	try {
		ver = navigator.appVersion.split("Version/");
		if (ver.length > 1) {
			ver = ver[1].split(" Safari");
		}
		if (ver.length > 1) {
			ver = ver[0].split(".");
		}
		if (ver.length > 1) {
			ver = parseInt(ver[0]);
		} else {
			ver = 0;
		}
	} catch (e) {
		return 0;
	}
	return ver;
}

try{
	var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);  // used by main.js also
	var iPad = (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
	var macOS = navigator.userAgent.indexOf('Mac OS X') != -1;
	macOS = macOS && !(iOS || iPad);
	var Firefox = navigator.userAgent.indexOf("Firefox")>=0;
	var Android = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
	var ChromeVersion = getChromeVersion();
	var OperaGx = isOperaGX();
	var SafariVersion = safariVersion();
	var SamsungASeries = isSamsungASeries();
} catch(e){errorlog(e);}

var gpgpuSupport = detectGPUSupport();
log(gpgpuSupport);




function isAlphaNumeric(str) {
	var code, i, len;
	for (i = 0, len = str.length; i < len; i++) {
		code = str.charCodeAt(i);
		if (!(code > 47 && code < 58) && // numeric (0-9)
			!(code > 64 && code < 91) && // upper alpha (A-Z)
			!(code > 96 && code < 123)) { // lower alpha (a-z)
			return false;
		}
	}
	return true;
}

function convertStringToArrayBufferView(str){
	var bytes = new Uint8Array(str.length);
	for (var iii = 0; iii < str.length; iii++){
		bytes[iii] = str.charCodeAt(iii);
	}
	return bytes;
}

function toHexString(byteArray){
	return Array.prototype.map.call(byteArray, function(byte){
		return ('0' + (byte & 0xFF).toString(16)).slice(-2);
	}).join('');
}
function toByteArray(hexString){
	var result = [];
	for (var i = 0; i < hexString.length; i += 2){
		result.push(parseInt(hexString.substr(i, 2), 16));
	}
	return new Uint8Array(result);
}

function playAllVideos(){
	for (var i in session.rpcs){
		try{
			if (session.rpcs[i].videoElement){
				if (session.rpcs[i].videoElement.paused){
					session.rpcs[i].videoElement.play().then(_ => {
						log("playing 3");
					}).catch(warnlog);
				}
			}
		}catch(e){}
	}
}

var videoElements =  Array.from(document.querySelectorAll("video"));
var audioElements =  Array.from(document.querySelectorAll("audio"));
var mediaStreamCounter = 0;


function createMediaStream(){
	mediaStreamCounter+=1;
	return new MediaStream();
}

function deleteOldMedia(){
	warnlog("CHECKING FOR OLD MEDIA");
	var i = videoElements.length;
	while (i--) {
		//if ((videoElements[i].id == "videosource") || (videoElements[i].id == "previewWebcam")){continue;} // exclude this one, for safety reasons. (Also, iOS safari blanks the video if streams are detached and moved between video elements)
		if (videoElements[i].isConnected === false){
			if ((videoElements[i].srcObject==null) || (videoElements[i].srcObject &&  videoElements[i].srcObject.active === false)){
				if (videoElements[i].dataset && videoElements[i].dataset.UUID){
					if (videoElements[i].dataset.UUID in session.rpcs){continue;} // still active, so lets not delete it.
				}
				videoElements[i].pause();
				videoElements[i].removeAttribute("id");
				videoElements[i].removeAttribute('src'); // empty source
				videoElements[i].load();
				videoElements[i].remove();
				videoElements[i] = null;
				videoElements.splice(i, 1);
			}
		}
	}
	i = audioElements.length;
	while (i--) {
		if (audioElements[i].isConnected === false){
			if ((audioElements[i].srcObject==null) || (audioElements[i].srcObject &&  audioElements[i].srcObject.active === false)){
				if (audioElements[i].dataset && audioElements[i].dataset.UUID){
					if (audioElements[i].dataset.UUID in session.rpcs){continue;} // still active, so lets not delete it.
				}
				audioElements[i].pause();
				audioElements[i].id = null;
				audioElements[i].removeAttribute('src'); // empty source
				audioElements[i].load();
				audioElements[i].remove();
				audioElements[i] = null;
				audioElements.splice(i, 1);
			}
		}
	}
}

function createAudioElement(){
	try{
		deleteOldMedia();
	} catch(e){errorlog(e);}
	var a = document.createElement("audio");
	audioElements.push(a);
	return a;
}

function compare_deltas( a, b ) {
  var aa = a.delta || 0;
  var bb = b.delta || 0;
  if ( aa > bb ){
    return 1;
  }
  if ( aa < bb ){
    return -1;
  }
  return 0;
}

function createVideoElement(){
	try{
		deleteOldMedia();
	} catch(e){errorlog(e);}
	var v = document.createElement("video");
	videoElements.push(v);
	return v;
}

function getTimezone(){
	if (session.tz!==false){
		return session.tz;
	}
    const stdTimezoneOffset = () => {
        var jan = new Date(0, 1);
        var jul = new Date(6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }
    var today = new Date();
    const isDstObserved = (today) => {
        return today.getTimezoneOffset() < stdTimezoneOffset();
    }
    if (isDstObserved(today)) {
        return today.getTimezoneOffset()+60;
    } else {
        return today.getTimezoneOffset();
    }
}

function promptUser(eleId, UUID=null){
	if (session.beepToNotify){
		playtone();
	}
	if (document.getElementById("modalBackdrop")){
		getById("promptModal").innerHTML = ''; // Delete modal
		getById("promptModal").remove();
		getById("modalBackdrop").innerHTML = ''; // Delete modal
		getById("modalBackdrop").remove();
	}
	
	zindex = 30 + document.querySelectorAll('#promptModal').length;
	modalTemplate =
	`<div id="promptModal" style="z-index:${zindex + 2}">	
		<div class="promptModalInner">
			<span class='modalClose' onclick="closeModal()">×</span>
			<span id='promptModalMessage'></span>
		</div>
	</div>
	<div id="modalBackdrop" style="z-index:${zindex + 1}"></div>`;
	document.body.insertAdjacentHTML("beforeend", modalTemplate); // Insert modal at body end
	
	getById("promptModalMessage").innerHTML = getById(eleId).innerHTML;
	if (UUID){
		getById("promptModalMessage").dataset.UUID = UUID;
	}
	
	document.getElementById("modalBackdrop").addEventListener("click", closeModal);

	getById("promptModal").addEventListener("click", function(e) {
		e.stopPropagation();
		return false;
	});
}

async function delay(ms) {
	return await new Promise((resolve, reject) => {
		setTimeout(resolve, ms);
	});
}

var Prompts = {};
async function promptAlt(inputText, block=false, asterix=false, value=false){
	var result = null;
	if (session.beepToNotify){
		playtone();
	}
	await new Promise((resolve, reject) => {
		var promptID = "pid_"+Math.random().toString(36).substr(2, 9);
		Prompts[promptID] = {};
		Prompts[promptID].resolve = resolve;
		Prompts[promptID].reject = reject;
		
		var zindex = 30 + document.querySelectorAll('.promptModal').length;
		
		if (block){
			var backdropClass = "opaqueBackdrop";
		} else {
			var backdropClass = "modalBackdrop";
		}
	
		inputText = "<font style='font-size:1.2em'>"+inputText.replace("\n","</font><br /><font>")+"</font>";
		inputText = inputText.replace(/\n/g,"<br />");
		var type = "text";
		if (asterix){
			type = "password";
		}
		
		
		modalTemplate =
			`<div id="modal_${promptID}" class="promptModal" style="z-index:${zindex + 2}">	
				<div class="promptModalInner">
					<span id="close_${promptID}" class='modalClose' data-pid="${promptID}">×</span>
					<span class='promptModalMessage'>${inputText}</span>
					<input id="input_${promptID}" autocorrect="off" autocapitalize="none" data-pid="${promptID}"  type="${type}" class="largeTextEntry" />
					<button id="submit_${promptID}" data-pid="${promptID}" style="width:120px; background-color: #fff; position: relative;border: 1px solid #999; margin: 0 0 0 55px;" data-translate='ok'>✔ OK</button>
					<button id="cancel_${promptID}" data-pid="${promptID}" style="width:120px; background-color: #fff; position: relative;border: 1px solid #999; margin: 0;" data-translate='cancel'>❌ Cancel</button>
				</div>
			</div>
			<div id="modalBackdrop_${promptID}" class="${backdropClass}" style="z-index:${zindex + 1}"></div>`;


		document.body.insertAdjacentHTML("beforeend", modalTemplate); // Insert modal at body end
		
		document.getElementById("input_"+promptID).focus();
		
		if (value!==false){
			document.getElementById("input_"+promptID).value = value;
		}
		
		document.getElementById("input_"+promptID).addEventListener("keyup", function(event) {
			if (event.key === "Enter") {
				var pid = event.target.dataset.pid;
				result = document.getElementById("input_"+pid).value;
				document.getElementById("modal_"+pid).remove();
				document.getElementById("modalBackdrop_"+pid).remove();
				Prompts[pid].resolve();
			}
		});

		document.getElementById("submit_"+promptID).addEventListener("click", function(event){
			var pid = event.target.dataset.pid;
			result = document.getElementById("input_"+pid).value;
			document.getElementById("modal_"+pid).remove();
			document.getElementById("modalBackdrop_"+pid).remove();
			Prompts[pid].resolve();
		});

		document.getElementById("cancel_"+promptID).addEventListener("click", function(event){
			var pid = event.target.dataset.pid;
			document.getElementById("modal_"+pid).remove();
			document.getElementById("modalBackdrop_"+pid).remove();
			Prompts[pid].resolve();
		});

		document.getElementById("close_"+promptID).addEventListener("click", function(event){
			var pid = event.target.dataset.pid;
			document.getElementById("modal_"+pid).remove();
			document.getElementById("modalBackdrop_"+pid).remove();
			Prompts[pid].resolve();
		});

		getById("modal_"+promptID).addEventListener("click", function(e) {
			e.stopPropagation();
			return false;
		});
		return;
	});
	return result;
}

async function promptTransfer(value=null, bcmode = null, updateurl = null){
	var result = {room:null};
	if (session.beepToNotify){
		playtone();
	}
	await new Promise((resolve, reject) => {
		var promptID = "pid_"+Math.random().toString(36).substr(2, 9);
		Prompts[promptID] = {};
		Prompts[promptID].resolve = resolve;
		Prompts[promptID].reject = reject;
		
		var zindex = 30 + document.querySelectorAll('.promptModal').length;
		var backdropClass = "modalBackdrop";
	
		var inputText = "<font style='font-size:1.2em'>"+(miscTranslations["transfer-guest-to-room"].replace("\n","</font><br /><font>"))+"</font>";
		inputText = inputText.replace(/\n/g,"<br />");
		
		modalTemplate =
			`<div id="modal_${promptID}" class="promptModal" style="z-index:${zindex + 2}">	
				<div class="promptModalInner">
					<span id="close_${promptID}" class='modalClose' data-pid="${promptID}">×</span>
					<span class='promptModalMessage'>${inputText}</span>
					<input id="input_${promptID}" data-pid="${promptID}"  type="text" autocorrect="off" autocapitalize="none" class="largeTextEntry" />
					<span class='promptModalLabel'><input id="private_${promptID}" data-pid="${promptID}"  type="checkbox" title="Note: this won't work fully if using obfuscated links" /> Allow the guest to rejoin the transfer room on their own</span>
					<span class='promptModalLabel'><input id="broadcast_${promptID}" data-pid="${promptID}"  type="checkbox" /> Guest will arrive in the new room in <i>broadcast</i> mode</span>
					<button id="submit_${promptID}" data-pid="${promptID}" style="width:120px; background-color: #fff; position: relative;border: 1px solid #999; margin: 0 0 0 55px;" data-translate='ok'>✔ OK</button>
					<button id="cancel_${promptID}" data-pid="${promptID}" style="width:120px; background-color: #fff; position: relative;border: 1px solid #999; margin: 0;" data-translate='cancel'>❌ Cancel</button>
				</div>
			</div>
			<div id="modalBackdrop_${promptID}" class="${backdropClass}" style="z-index:${zindex + 1}"></div>`;


		document.body.insertAdjacentHTML("beforeend", modalTemplate); // Insert modal at body end
		
		document.getElementById("input_"+promptID).focus();
		
		if (value!==null){
			document.getElementById("input_"+promptID).value = value;
		}
		
		if (bcmode!==null){
			document.getElementById("broadcast_"+promptID).checked = bcmode;
		}
		
		if (updateurl!==null){
			document.getElementById("private_"+promptID).checked = updateurl;
		}
		
		document.getElementById("input_"+promptID).addEventListener("keyup", function(event) {
			if (event.key === "Enter") {
				var pid = event.target.dataset.pid;
				var room = document.getElementById("input_"+pid).value;
				var updateurl = document.getElementById("private_"+pid).checked;
				var broadcast = document.getElementById("broadcast_"+pid).checked;
				document.getElementById("modal_"+pid).remove();
				document.getElementById("modalBackdrop_"+pid).remove();
				Prompts[pid].resolve();
				result = {roomid:room, updateurl:updateurl, broadcast:broadcast};
			}
		});

		document.getElementById("submit_"+promptID).addEventListener("click", function(event){
			var pid = event.target.dataset.pid;
			var room = document.getElementById("input_"+pid).value;
			var updateurl = document.getElementById("private_"+pid).checked;
			var broadcast = document.getElementById("broadcast_"+pid).checked;
			
			document.getElementById("modal_"+pid).remove();
			document.getElementById("modalBackdrop_"+pid).remove();
			Prompts[pid].resolve();
			result = {roomid:room, updateurl:updateurl, broadcast:broadcast};
		});

		document.getElementById("cancel_"+promptID).addEventListener("click", function(event){
			var pid = event.target.dataset.pid;
			document.getElementById("modal_"+pid).remove();
			document.getElementById("modalBackdrop_"+pid).remove();
			Prompts[pid].resolve();
		});

		document.getElementById("close_"+promptID).addEventListener("click", function(event){
			var pid = event.target.dataset.pid;
			document.getElementById("modal_"+pid).remove();
			document.getElementById("modalBackdrop_"+pid).remove();
			Prompts[pid].resolve();
		});

		getById("modal_"+promptID).addEventListener("click", function(e) {
			e.stopPropagation();
			return false;
		});
		return;
	});
	return result;
}

function youveBeenTransferred(){
	getChatMessage( miscTranslations["you-have-been-transferred"], label = false, director = false, overlay = true); // "you-have-been-transferred"
	getById("head2").innerHTML =  '<span data-translate="transferred-to-room">'+miscTranslations["room-changed"]+'</span>'; // 
	if (session.director){
		getById("head4").innerHTML = miscTranslations["you-are-no-longer-a-co-director"]; //"You are no longer a co-director as you were transferred."; //
	} 
	
	if (session.label){
		document.title = session.label + " - " + miscTranslations["transferred"];
	} else {
		document.title = miscTranslations["transferred"];
	}
}

async function confirmAlt(inputText, block=false){
	var result = null;
	if (session.beepToNotify){
		playtone();
	}
	await new Promise((resolve, reject) => {
		var promptID = "pid_"+Math.random().toString(36).substr(2, 9);
		Prompts[promptID] = {};
		Prompts[promptID].resolve = resolve;
		Prompts[promptID].reject = reject;
	
		var zindex = 30 + document.querySelectorAll('.promptModal').length;
		
		if (block){
			var backdropClass = "opaqueBackdrop";
		} else {
			var backdropClass = "modalBackdrop";
		}
		
		inputText = "<font style='font-size:1.2em'>"+inputText.replace("\n","</font><br /><font>")+"</font>";
		inputText = inputText.replace(/\n/g,"<br />");

		modalTemplate =
			`<div id="modal_${promptID}" class="promptModal" style="z-index:${zindex + 2}">	
				<div class="promptModalInner">
					<span id="close_${promptID}" class='modalClose' data-pid="${promptID}">×</span>
					<span class='promptModalMessage' style='margin: 0 0 15px 0;'>${inputText}</span>
					<button id="submit_${promptID}" data-pid="${promptID}" style="width:120px; background-color: #fff; position: relative;border: 1px solid #999; margin: 0 0 0 55px;" data-translate='ok'>✔ OK</button>
					<button id="cancel_${promptID}" data-pid="${promptID}" style="width:120px; background-color: #fff; position: relative;border: 1px solid #999; margin: 0;" data-translate='cancel'>❌ Cancel</button>
				</div>
			</div>
			<div id="modalBackdrop_${promptID}" class="${backdropClass}" style="z-index:${zindex + 1}"></div>`;


		document.body.insertAdjacentHTML("beforeend", modalTemplate); // Insert modal at body end

		document.getElementById("submit_"+promptID).focus();
		
		document.getElementById("submit_"+promptID).addEventListener("click", function(event){
			var pid = event.target.dataset.pid;
			result = true;
			document.getElementById("modalBackdrop_"+pid).remove();
			document.getElementById("modal_"+pid).remove();
			Prompts[pid].resolve();
		});

		document.getElementById("cancel_"+promptID).addEventListener("click", function(event){
			var pid = event.target.dataset.pid;
			document.getElementById("modalBackdrop_"+pid).remove();
			document.getElementById("modal_"+pid).remove();
			Prompts[pid].resolve();
		});

		document.getElementById("close_"+promptID).addEventListener("click", function(event){
			var pid = event.target.dataset.pid;
			document.getElementById("modalBackdrop_"+pid).remove();
			document.getElementById("modal_"+pid).remove();
			Prompts[pid].resolve();
		});

		getById("modal_"+promptID).addEventListener("click", function(e) {
			e.stopPropagation();
			return false;
		});
		return;
	});
	return result;
}

var modalTimeout=null;
function warnUser(message, timeout=false){
	// Allows for multiple alerts to stack better.
	// Every modal and backdrop has an increasing z-index
	// to block the previous modal
	if (document.getElementById("modalBackdrop")){
		getById("alertModal").innerHTML = ''; // Delete modal
		getById("alertModal").remove();
		getById("modalBackdrop").innerHTML = ''; // Delete modal
		getById("modalBackdrop").remove();
	}
	
	zindex = 31 + document.querySelectorAll('.alertModal').length;
	try{
		message = message.replace(/\n/g,"<br />");
	} catch(e){
		errorlog(message);
	}
	modalTemplate =
	`<div class="alertModal" id="alertModal"  style="z-index:${zindex + 2}">	
		<div class="alertModalInner">
			<span class='modalClose' onclick="closeModal()">×</span>
			<span class='alertModalMessage'>${message}</span>
		</div>
	</div>
	<div id="modalBackdrop" style="z-index:${zindex + 1}"></div>`;
	document.body.insertAdjacentHTML("beforeend", modalTemplate); // Insert modal at body end
	
	document.getElementById("modalBackdrop").addEventListener("click", closeModal);
	
	clearTimeout(modalTimeout);
	if (timeout){
		modalTimeout = setTimeout(closeModal, timeout);
	}
	getById("alertModal").addEventListener("click", function(e) {
		e.stopPropagation();
		return false;
	});
	
}
function closeModal(){
	clearTimeout(modalTimeout);
	getById("modalBackdrop").innerHTML = ''; // Delete modal
	getById("modalBackdrop").remove();
	getById("alertModal").innerHTML = ''; // Delete modal
	getById("alertModal").remove();
	getById("promptModal").innerHTML = ''; // Delete modal
	getById("promptModal").remove();
}

var sanitizeStreamID = function(streamID) {
	streamID = streamID.trim();

	if (streamID.length < 1) {
		streamID = session.generateStreamID(8);
		if (!(session.cleanOutput)) {
			warnUser(miscTranslations["no-streamID-provided"] + streamID);
		}
	}
	var streamID_sanitized = streamID.replace(/[\W]+/g, "_");
	if (streamID !== streamID_sanitized) {
		if (!(session.cleanOutput)) {
			warnUser(miscTranslations["alphanumeric-only"]);
		}
	}
	if (streamID_sanitized.length > 44) {
		streamID_sanitized = streamID_sanitized.substring(0, 50);
		if (!(session.cleanOutput)) {
			warnUser(miscTranslations["stream-id-too-long"]);
		}
	}
	return streamID_sanitized;
};

var checkStrength = function(string) {
	var matcher = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,30}$/;
	if (string.match(matcher)) {
		return true;
	} else if (string.length > 20) {
		return true;
	} else {
		return false;
	}
};

var checkStrengthRoom = function() {
	var result1 = checkStrength(getById('videoname1').value);
	var result2 = getById('passwordRoom').value.length;
	var target = getById('securityLevelRoom');
	target.style.display = "block";
	if (result1) {
		if (result2) {
			target.innerHTML = "<font style='color:green'>"+miscTranslations["share-with-trusted"]+"</font>";
		} else {
			target.innerHTML = "<font style='color:#e67202;'>"+miscTranslations["pass-recommended"]+"</font>";
		}
	} else {
		target.innerHTML = "<font style='color:red'>"+miscTranslations["insecure-room-name"]+"</font> "+miscTranslations["allowed-chars"]+": <i>A-Z, a-z, 0-9, _</i>";
	}
};

var emojiShortCodes ={":joy:":"😂",":heart:":"❤️",":heart_eyes:":"😍",":sob:":"😭",":blush:":"😊",":unamused:":"😒",":two_hearts:":"💕",":weary:":"😩",":ok_hand:":"👌",":pensive:":"😔",":smirk:":"😏",":grin:":"😁",":wink:":"😉",":thumbsup:":"👍",":pray:":"🙏",":relieved:":"😌",":notes:":"🎶",":flushed:":"😳",":raised_hands:":"🙌",":see_no_evil:":"🙈",":cry:":"😢",":sunglasses:":"😎",":v:":"✌️",":eyes:":"👀",":sweat_smile:":"😅",":sparkles:":"✨",":sleeping:":"😴",":smile:":"😄",":purple_heart:":"💜",":broken_heart:":"💔",":blue_heart:":"💙",":confused:":"😕",":disappointed:":"😞",":yum:":"😋",":neutral_face:":"😐",":sleepy:":"😪",":clap:":"👏",":cupid:":"💘",":heartpulse:":"💗",":kiss:":"💋",":point_right:":"👉",":scream:":"😱",":fire:":"🔥",":rage:":"😡",":smiley:":"😃",":tada:":"🎉",":tired_face:":"😫",":camera:":"📷",":rose:":"🌹",":muscle:":"💪",":skull:":"💀",":sunny:":"☀️",":yellow_heart:":"💛",":triumph:":"😤",":laughing:":"😆",":sweat:":"😓",":point_left:":"👈",":grinning:":"😀",":mask:":"😷",":green_heart:":"💚",":wave:":"👋",":persevere:":"😣",":heartbeat:":"💓",":crown:":"👑",":innocent:":"😇",":headphones:":"🎧",":confounded:":"😖",":angry:":"😠",":grimacing:":"😬",":star2:":"🌟",":gun:":"🔫",":raising_hand:":"🙋",":thumbsdown:":"👎",":dancer:":"💃",":musical_note:":"🎵",":no_mouth:":"😶",":dizzy:":"💫",":fist:":"✊",":point_down:":"👇",":no_good:":"🙅",":boom:":"💥",":tongue:":"👅",":poop:":"💩",":cold_sweat:":"😰",":gem:":"💎",":ok_woman:":"🙆",":pizza:":"🍕",":joy_cat:":"😹",":leaves:":"🍃",":sweat_drops:":"💦",":penguin:":"🐧",":zzz:":"💤",":walking:":"🚶",":airplane:":"✈️",":balloon:":"🎈",":star:":"⭐",":ribbon:":"🎀",":worried:":"😟",":underage:":"🔞",":fearful:":"😨",":hibiscus:":"🌺",":microphone:":"🎤",":open_hands:":"👐",":ghost:":"👻",":palm_tree:":"🌴",":nail_care:":"💅",":alien:":"👽",":bow:":"🙇",":cloud:":"☁",":soccer:":"⚽",":angel:":"👼",":dancers:":"👯",":snowflake:":"❄️",":point_up:":"☝️",":rainbow:":"🌈",":gift_heart:":"💝",":gift:":"🎁",":beers:":"🍻",":anguished:":"😧",":earth_africa:":"🌍",":movie_camera:":"🎥",":anchor:":"⚓",":zap:":"⚡",":runner:":"🏃",":sunflower:":"🌻",":bouquet:":"💐",":dog:":"🐶",":moneybag:":"💰",":herb:":"🌿",":couple:":"👫",":fallen_leaf:":"🍂",":tulip:":"🌷",":birthday:":"🎂",":cat:":"🐱",":coffee:":"☕",":dizzy_face:":"😵",":point_up_2:":"👆",":open_mouth:":"😮",":hushed:":"😯",":basketball:":"🏀",":ring:":"💍",":astonished:":"😲",":hear_no_evil:":"🙉",":dash:":"💨",":cactus:":"🌵",":hotsprings:":"♨️",":telephone:":"☎️",":maple_leaf:":"🍁",":princess:":"👸",":massage:":"💆",":love_letter:":"💌",":trophy:":"🏆",":blossom:":"🌼",":lips:":"👄",":fries:":"🍟",":doughnut:":"🍩",":frowning:":"😦",":ocean:":"🌊",":bomb:":"💣",":cyclone:":"🌀",":rocket:":"🚀",":umbrella:":"☔",":couplekiss:":"💏",":lollipop:":"🍭",":clapper:":"🎬",":pig:":"🐷",":smiling_imp:":"😈",":imp:":"👿",":bee:":"🐝",":kissing_cat:":"😽",":anger:":"💢",":santa:":"🎅",":earth_asia:":"🌏",":football:":"🏈",":guitar:":"🎸",":panda_face:":"🐼",":strawberry:":"🍓",":smirk_cat:":"😼",":banana:":"🍌",":watermelon:":"🍉",":snowman:":"⛄",":smile_cat:":"😸",":eggplant:":"🍆",":crystal_ball:":"🔮",":calling:":"📲",":iphone:":"📱",":partly_sunny:":"⛅",":warning:":"⚠️",":scream_cat:":"🙀",":baby:":"👶",":feet:":"🐾",":footprints:":"👣",":beer:":"🍺",":wine_glass:":"🍷",":video_camera:":"📹",":rabbit:":"🐰",":smoking:":"🚬",":peach:":"🍑",":snake:":"🐍",":turtle:":"🐢",":cherries:":"🍒",":kissing:":"😗",":frog:":"🐸",":milky_way:":"🌌",":closed_book:":"📕",":candy:":"🍬",":hamburger:":"🍔",":bear:":"🐻",":tiger:":"🐯",":icecream:":"🍦",":pineapple:":"🍍",":ear_of_rice:":"🌾",":syringe:":"💉",":tv:":"📺",":pill:":"💊",":octopus:":"🐙",":grapes:":"🍇",":smiley_cat:":"😺",":cd:":"💿",":cocktail:":"🍸",":cake:":"🍰",":video_game:":"🎮",":lipstick:":"💄",":whale:":"🐳",":cookie:":"🍪",":dolphin:":"🐬",":loud_sound:":"🔊",":man:":"👨",":monkey:":"🐒",":books:":"📚",":guardsman:":"💂",":loudspeaker:":"📢",":scissors:":"✂️",":girl:":"👧",":mortar_board:":"🎓",":baseball:":"⚾️",":woman:":"👩",":fireworks:":"🎆",":stars:":"🌠",":mushroom:":"🍄",":pouting_cat:":"😾",":left_luggage:":"🛅",":high_heel:":"👠",":dart:":"🎯",":swimmer:":"🏊",":key:":"🔑",":bikini:":"👙",":family:":"👪",":pencil2:":"✏",":elephant:":"🐘",":droplet:":"💧",":seedling:":"🌱",":apple:":"🍎",":dollar:":"💵",":book:":"📖",":haircut:":"💇",":computer:":"💻",":bulb:":"💡",":boy:":"👦",":tangerine:":"🍊",":sunrise:":"🌅",":poultry_leg:":"🍗",":shaved_ice:":"🍧",":bird:":"🐦",":eyeglasses:":"👓",":goat:":"🐐",":older_woman:":"👵",":new_moon:":"🌑",":customs:":"🛃",":house:":"🏠",":full_moon:":"🌕",":lemon:":"🍋",":baby_bottle:":"🍼",":spaghetti:":"🍝",":wind_chime:":"🎐",":fish_cake:":"🍥",":nose:":"👃",":pig_nose:":"🐽",":fish:":"🐟",":koala:":"🐨",":ear:":"👂",":shower:":"🚿",":bug:":"🐛",":ramen:":"🍜",":tophat:":"🎩",":fuelpump:":"⛽",":horse:":"🐴",":watch:":"⌚",":monkey_face:":"🐵",":baby_symbol:":"🚼",":sparkler:":"🎇",":corn:":"🌽",":tennis:":"🎾",":battery:":"🔋",":wolf:":"🐺",":moyai:":"🗿",":cow:":"🐮",":mega:":"📣",":older_man:":"👴",":dress:":"👗",":link:":"🔗",":chicken:":"🐔",":whale2:":"🐋",":bento:":"🍱",":pushpin:":"📌",":dragon:":"🐉",":hamster:":"🐹",":golf:":"⛳",":surfer:":"🏄",":mouse:":"🐭",":blue_car:":"🚙",":bread:":"🍞",":cop:":"👮",":tea:":"🍵",":bike:":"🚲",":rice:":"🍚",":radio:":"📻",":baby_chick:":"🐤",":sheep:":"🐑",":lock:":"🔒",":green_apple:":"🍏",":racehorse:":"🐎",":fried_shrimp:":"🍤",":volcano:":"🌋",":rooster:":"🐓",":inbox_tray:":"📥",":wedding:":"💒",":sushi:":"🍣",":ice_cream:":"🍨",":tomato:":"🍅",":rabbit2:":"🐇",":beetle:":"🐞",":bath:":"🛀",":no_entry:":"⛔",":crocodile:":"🐊",":dog2:":"🐕",":cat2:":"🐈",":hammer:":"🔨",":meat_on_bone:":"🍖",":shell:":"🐚",":poodle:":"🐩",":stew:":"🍲",":jeans:":"👖",":honey_pot:":"🍯",":unlock:":"🔓",":black_nib:":"✒",":snowboarder:":"🏂",":white_flower:":"💮",":necktie:":"👔",":womens:":"🚺",":ant:":"🐜",":city_sunset:":"🌇",":dragon_face:":"🐲",":snail:":"🐌",":dvd:":"📀",":shirt:":"👕",":game_die:":"🎲",":dolls:":"🎎",":8ball:":"🎱",":bus:":"🚌",":custard:":"🍮",":camel:":"🐫",":curry:":"🍛",":hospital:":"🏥",":bell:":"🔔",":pear:":"🍐",":door:":"🚪",":saxophone:":"🎷",":church:":"⛪",":bicyclist:":"🚴",":dango:":"🍡",":office:":"🏢",":rowboat:":"🚣",":womans_hat:":"👒",":mans_shoe:":"👞",":love_hotel:":"🏩",":mount_fuji:":"🗻",":handbag:":"👜",":hourglass:":"⌛",":trumpet:":"🎺",":school:":"🏫",":cow2:":"🐄",":toilet:":"🚽",":pig2:":"🐖",":violin:":"🎻",":credit_card:":"💳",":ferris_wheel:":"🎡",":bowling:":"🎳",":barber:":"💈",":purse:":"👛",":rat:":"🐀",":date:":"📅",":ram:":"🐏",":tokyo_tower:":"🗼",":kimono:":"👘",":ship:":"🚢",":mag_right:":"🔎",":mag:":"🔍",":fire_engine:":"🚒",":police_car:":"🚓",":black_joker:":"🃏",":package:":"📦",":calendar:":"📆",":horse_racing:":"🏇",":tiger2:":"🐅",":boot:":"👢",":ambulance:":"🚑",":boar:":"🐗",":pound:":"💷",":ox:":"🐂",":rice_ball:":"🍙",":sandal:":"👡",":tent:":"⛺",":seat:":"💺",":taxi:":"🚕",":briefcase:":"💼",":newspaper:":"📰",":circus_tent:":"🎪",":mens:":"🚹",":flashlight:":"🔦",":foggy:":"🌁",":bamboo:":"🎍",":ticket:":"🎫",":helicopter:":"🚁",":minidisc:":"💽",":oncoming_bus:":"🚍",":melon:":"🍈",":notebook:":"📓",":no_bell:":"🔕",":oden:":"🍢",":flags:":"🎏",":blowfish:":"🐡",":sweet_potato:":"🍠",":ski:":"🎿",":construction:":"🚧",":satellite:":"📡",":euro:":"💶",":ledger:":"📒",":leopard:":"🐆",":truck:":"🚚",":sake:":"🍶",":railway_car:":"🚃",":speedboat:":"🚤",":vhs:":"📼",":yen:":"💴",":mute:":"🔇",":wheelchair:":"♿",":paperclip:":"📎",":atm:":"🏧",":telescope:":"🔭",":rice_scene:":"🎑",":blue_book:":"📘",":postbox:":"📮",":e-mail:":"📧",":mouse2:":"🐁",":nut_and_bolt:":"🔩",":hotel:":"🏨",":wc:":"🚾",":green_book:":"📗",":tractor:":"🚜",":fountain:":"⛲",":metro:":"🚇",":clipboard:":"📋",":no_smoking:":"🚭",":slot_machine:":"🎰",":bathtub:":"🛁",":scroll:":"📜",":station:":"🚉",":rice_cracker:":"🍘",":bank:":"🏦",":wrench:":"🔧",":bar_chart:":"📊",":minibus:":"🚐",":tram:":"🚊",":microscope:":"🔬",":bookmark:":"🔖",":pouch:":"👝",":fax:":"📠",":sound:":"🔉",":chart:":"💹",":floppy_disk:":"💾",":post_office:":"🏣",":speaker:":"🔈",":japan:":"🗾",":mahjong:":"🀄",":orange_book:":"📙",":restroom:":"🚻",":train:":"🚋",":trolleybus:":"🚎",":postal_horn:":"📯",":factory:":"🏭",":train2:":"🚆",":pager:":"📟",":outbox_tray:":"📤",":mailbox:":"📫",":light_rail:":"🚈",":busstop:":"🚏",":file_folder:":"📁",":card_index:":"📇",":monorail:":"🚝",":no_bicycles:":"🚳",":hugging:":"🤗",":thinking:":"🤔",":nerd:":"🤓",":zipper_mouth:":"🤐",":rolling_eyes:":"🙄",":upside_down:":"🙃",":slight_smile:":"🙂",":writing_hand:":"✍",":eye:":"👁",":man_in_suit:":"🕴",":golfer:":"🏌",":golfer_woman:":"🏌‍♀",":anger_right:":"🗯",":coffin:":"⚰",":gear:":"⚙",":alembic:":"⚗",":scales:":"⚖",":keyboard:":"⌨",":shield:":"🛡",":bed:":"🛏",":ballot_box:":"🗳",":compression:":"🗜",":wastebasket:":"🗑",":file_cabinet:":"🗄",":trackball:":"🖲",":printer:":"🖨",":joystick:":"🕹",":hole:":"🕳",":candle:":"🕯",":prayer_beads:":"📿",":amphora:":"🏺",":label:":"🏷",":film_frames:":"🎞",":level_slider:":"🎚",":thermometer:":"🌡",":motorway:":"🛣",":synagogue:":"🕍",":mosque:":"🕌",":kaaba:":"🕋",":stadium:":"🏟",":desert:":"🏜",":cityscape:":"🏙",":camping:":"🏕",":rosette:":"🏵",":volleyball:":"🏐",":medal:":"🏅",":popcorn:":"🍿",":champagne:":"🍾",":hot_pepper:":"🌶",":burrito:":"🌯",":taco:":"🌮",":hotdog:":"🌭",":shamrock:":"☘",":comet:":"☄",":turkey:":"🦃",":scorpion:":"🦂",":lion_face:":"🦁",":crab:":"🦀",":spider_web:":"🕸",":spider:":"🕷",":chipmunk:":"🐿",":fog:":"🌫",":chains:":"⛓",":pick:":"⛏",":stopwatch:":"⏱",":ferry:":"⛴",":mountain:":"⛰",":ice_skate:":"⛸",":skier:":"⛷",":sad:":"😥",":egg:":"🥚",":drum:":"🥁"};

function convertShortcodes(string){
	if (string.split(":").length>2){
		for (var i in emojiShortCodes) {
			if (string.includes(i)) {
				string = string.replaceAll(i, emojiShortCodes[i]);
			}
		}
	}
	return string;
}

var sanitizeChat = function(string) {
	var temp = document.createElement('div');
	temp.innerText = string;
	temp.innerText = temp.innerHTML;
	temp = temp.textContent || temp.innerText || "";
	temp = temp.substring(0, Math.min(temp.length, 500));
	return temp.trim();
};

var sanitizeString = function(str) {
	str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
	return str.trim();
};

var sanitizeLabel = function(string) {
	let temp = document.createElement("div");
	temp.innerText = string;
	temp.innerText = temp.innerHTML;
	temp = temp.textContent || temp.innerText || "";
	temp = temp.substring(0, Math.min(temp.length, 50));
	return temp.trim();
};

var sanitizeRoomName = function(roomid) {
	roomid = roomid.trim();
	if (roomid === "") {
		return roomid;
	} else if (roomid === false) {
		return roomid;
	}

	var sanitized = roomid.replace(/[\W]+/g, "_");
	if (roomid.replace(/ /g, "_") !== sanitized) {
		if (!(session.cleanOutput)) {
			warnUser("Info: Only AlphaNumeric characters should be used for the room name.\n\nThe offending characters have been replaced by an underscore");
		}
	}
	if (sanitized.length > 30) {
		sanitized = sanitized.substring(0, 30);
		if (!(session.cleanOutput)) {
			warnUser("The Room name should be less than 31 alPhaNuMeric characters long.\n\nWe will trim it to length.");
		}
	}
	return sanitized;
};

var sanitizePassword = function(passwrd) {
	if (passwrd === "") {
		return passwrd;
	} else if (passwrd === false) {
		return passwrd;
	} else if (passwrd === null) {
		return passwrd;
	}
	passwrd = passwrd.trim();
	if (passwrd.length < 1) {
		if (!(session.cleanOutput)) {
			warnUser("The password provided was blank.");
		}
	}
	var sanitized = encodeURIComponent(passwrd);//.replace(/[\W]+/g, "_");
	//if (sanitized !== passwrd) {
	//	if (!(session.cleanOutput)) {
	//		warnUser("Info: Only AlphaNumeric characters should be used in the password.\n\nThe offending characters have been replaced by an underscore");
	//	}
	//}
	return sanitized;
};

function checkConnection() {
	if (session.ws === null) {
		return;
	}
	if (!session.cleanOutput){
		if (document.getElementById("qos")) { // true or false; null might cause problems?
			getById("logoname").style.display = "unset";
			if ((session.ws) && (session.ws.readyState === WebSocket.OPEN)) {
				getById("qos").style.color = "white";
			} else {
				getById("qos").style.color = "red";
			}
		}
	}
}


function obsSceneChanged(event){
	log(event.detail.name);
	window.obsstudio.getCurrentScene(function(scene) {
		log("OBS SCENE");
		log(scene);
	});
}
function obsStreamingStarted(event){
	session.obsState.streaming = true;
	session.obsStateSync();
}
function obsStreamingStopped(event){
	session.obsState.streaming = false;
	session.obsStateSync();
}
function obsRecordingStarted(event){
	session.obsState.recording = true;
	session.obsStateSync();
}
function obsRecordingStopped(event){
	session.obsState.recording = false;
	session.obsStateSync();
}
function obsSourceActiveChanged(event){
	warnlog("obsSourceActiveChanged");
	warnlog( event.detail);
	
	try {
		if (typeof event==="boolean"){var sourceActive = event;}
		else if (typeof event.detail === "boolean"){var sourceActive = event.detail;}
		else if (typeof event.detail.active === "boolean"){var sourceActive = event.detail.active;}
		else {var sourceActive = event.detail.active;}
		
		if (typeof sourceActive === "undefined"){return;} // Just fail.
		
		if (session.obsState.sourceActive!==sourceActive){ // only move forward if there is a change; the event likes to double fire you see.
			session.obsState.sourceActive = sourceActive;
			session.obsStateSync();
		}
		
	} catch (e){errorlog(e);}
}

function obsSourceVisibleChanged(event){ // accounts for visible in VDO.Ninja scene AND visible in OBS scene
	warnlog("obsSourceVisibleChanged");
	warnlog(event.detail);
	try {
		if (typeof event==="boolean"){var visibility = event;}
		else if (typeof event.detail === "boolean"){var visibility = event.detail;}
		else if (typeof event.detail.visible === "boolean"){var visibility = event.detail.visible;}
		else {var visibility = event.detail.visible;}
		
		if (typeof visibility === "undefined"){ // fall back
			if (typeof document.visibilityState !== "undefined"){
				visibility = document.visibilityState==="visible"; // modern
			} else if (typeof document.hidden !== "undefined"){
				visibility = !document.hidden; // legacy
			} else {
				return; // ... unknown input? fail.
			}
		}
		
		if (session.obsState.visibility!==visibility){ // only move forward if there is a change; the event likes to double fire you see.
			session.obsState.visibility = visibility;
			session.obsStateSync();
		}
		
	} catch (e){errorlog(e);}
}



function manageSceneState(data, UUID){
	if (session.disableOBS){return;}
	var processNeeded = false
	try{
		if ("sceneDisplay" in data){ 
			processNeeded=true;
			session.pcs[UUID].sceneDisplay = data.sceneDisplay;
		}
		if ("sceneMute" in data){ 
			processNeeded=true;
			session.pcs[UUID].sceneMute = data.sceneMute;
		}
		if ("obsSourceActive" in data){  
			processNeeded=true;
			session.pcs[UUID].obsSourceActive = data.obsSourceActive;
		}
		if ("obsVisibility" in data){
			processNeeded=true;
			session.pcs[UUID].obsVisibility = data.obsVisibility;
			session.optimizeBitrate(UUID); // &optimize flag; sets video bitrate to target value if this flag == HIDDEN (if optimize=0, disables both audio and video)
		}
		if ("obsStreaming" in data){  
			processNeeded=true;
			session.pcs[UUID].obsStreaming = data.obsStreaming;
		}
		if ("obsRecording" in data){   
			processNeeded=true;
			session.pcs[UUID].obsRecording = data.obsRecording; 
		}
	} catch(e){} // just in case the client has disconnected.
	
	if (processNeeded){
		applySceneState();
	}
}

function compare_vids( a, b ) {
  var aa = a.order || 0;
  var bb = b.order || 0;
  if ( aa < bb ){
    return 1;
  }
  if ( aa > bb ){
    return -1;
  }
  return 0;
}

function applySceneState(){
	if (session.disableOBS){return;}
	if (session.cleanOutput===false){
		if (document.getElementById("videosource")){
			var visibility = false;
			var ondeck = false;
			var recording = false;
			for (var uid in session.pcs){
				
				if (session.pcs[uid].obsSourceActive!==false && session.pcs[uid].obsVisibility && (session.pcs[uid].sceneDisplay!==false)){
					visibility=true;
				} else if (session.pcs[uid].obsVisibility && (session.pcs[uid].sceneDisplay!==false)){
					ondeck=true;
				}
				if ((session.pcs[uid].obsRecording || session.pcs[uid].obsStreaming) && (session.pcs[uid].obsSourceActive!==false && session.pcs[uid].obsVisibility && (session.pcs[uid].sceneDisplay!==false))){ // the scene that is recording must be visible also.
					recording=true;
				}
			}
			
			if (recording){
				getById("obsState").classList.remove("ondeck");
				getById("obsState").classList.add("recording");  // TODO: this needs to check all peers to make sure it's valid
				getById("obsState").innerHTML = "ON AIR";
			} else if (ondeck && !visibility){
				getById("obsState").classList.remove("recording");
				getById("obsState").classList.add("ondeck");  // TODO: this needs to check all peers to make sure it's valid
				getById("obsState").innerHTML = "STAND BY";
			} else {
				getById("obsState").classList.remove("recording");
				getById("obsState").classList.remove("ondeck");
				getById("obsState").innerHTML = "ACTIVE";
			}

			if (visibility){ // BASIC TALLY LIGHT (on deck disabled)
				getById("obsState").classList.add("onair"); // LIVE
			} else {
				getById("obsState").classList.remove("onair");
				
			}
		}
	}
}

window.onpopstate = function() {
	if (session.firstPlayTriggered) {
		window.location.reload(true); // deprecated, but it seems to work, so w/e
	}
};

var miniPerformerX = null;
var miniPerformerY = null;
function makeMiniDraggableElement(elmnt) {
	
	if (session.disableMouseEvents){return;}
	
	try {
		elmnt.dragElement = false;
		elmnt.style.bottom = "auto";
		elmnt.style.cursor = "grab";
		
		elmnt.stashonmouseup = null;
		elmnt.stashonmousemove = null;
		
	} catch (e) {
		errorlog(e);
		return;
	}

	var pos1 = 0;
	var pos2 = 0;
	var pos3 = 0;
	var pos4 = 0;
	
	var timestamp = false;
	
	function elementDrag(e) { // ON DRAG
		timestamp = false;
		if (session.infocus){return;}
		try {
			e = e || window.event;
			
			if (e.type !== "touchmove"){
				if (("buttons" in e) && (e.buttons!==1)){
					closeDragElement(e);
					return;
				}
				e.preventDefault();
			} 
			e.stopPropagation();
			
			elmnt.dragElement = true;
			
			if (e.type === "touchmove"){
				pos1 = pos3 - e.touches[0].clientX;
				pos2 = pos4 - e.touches[0].clientY;
				pos3 = e.touches[0].clientX;
				pos4 = e.touches[0].clientY;
			} else {
				pos1 = pos3 - e.clientX;
				pos2 = pos4 - e.clientY;
				pos3 = e.clientX;
				pos4 = e.clientY;
			}

			var topDrag = (elmnt.offsetTop - pos2 );
			if (topDrag > (-3 + (window.innerHeight - elmnt.clientHeight))){
				topDrag = (-3 + (window.innerHeight - elmnt.clientHeight));
			}
			
			miniPerformerY = topDrag;
			miniPerformerX = elmnt.offsetLeft - pos1;
			
			if (miniPerformerY > window.innerHeight-elmnt.clientHeight){
				miniPerformerY = window.innerHeight-elmnt.clientHeight;
			}
			if (miniPerformerX > window.innerWidth-elmnt.clientWidth){
				miniPerformerX = window.innerWidth-elmnt.clientWidth;
			}
			
			miniPerformerX = 100 * miniPerformerX/window.innerWidth;
			miniPerformerY = 100 * miniPerformerY/window.innerHeight;
			
			if (miniPerformerY<0){
				miniPerformerY=0;
			} else if (miniPerformerY>100){
				miniPerformerY=100;
			}
			if (miniPerformerX<0){
				miniPerformerX=0;
			} else if (miniPerformerX>100){
				miniPerformerX=100;
			}
			
			elmnt.style.right = "unset";
			elmnt.style.top = miniPerformerY + "%";
			elmnt.style.left = miniPerformerX + "%";
			
			
		} catch(e){errorlog(e);}
	}

	
	function closeDragElement(e) {	 // TOUCH END
		e = e || window.event;
		
		if (e.type !== "touchend"){
			if (e.button !== 0){return;}
			document.onmouseup = elmnt.stashonmouseup;
			document.onmousemove = elmnt.stashonmousemove;
			elmnt.onmouseleave=null;

		}
		
		
		if (session.infocus){return;}
		e.preventDefault();
		
		if (timestamp && (Date.now()- timestamp>500)){ // long hold, so this is a drag
			e.stopPropagation();
			if (e.type === "touchend"){
				if (session.infocus === true){
					session.infocus = false;
				} else {
					session.infocus = true;
					log("session: myself");
				}
				setTimeout(()=>updateMixer(),10);
			}
		} else if (timestamp && (e.type !== "touchend")){
			if (session.infocus === true){
				session.infocus = false;
			} else {
				session.infocus = true;
				log("session: myself");
			}
			setTimeout(()=>updateMixer(),10);
		} 
	}
	
	function dragMouseDown(e) { ////// TOUCH START

		if (event.ctrlKey || event.metaKey) {return;}
		
		timestamp = Date.now();
		
		e = e || window.event;
		if (session.infocus){return;}
		
		e.preventDefault();
		if (e.type === "touchstart"){
			pos3 = e.touches[0].clientX;
			pos4 = e.touches[0].clientY;
			
			elmnt.ontouchend = closeDragElement;
			elmnt.ontouchmove = elementDrag;
		} else {
			if (e.button !== 0){return;}
			pos3 = e.clientX;
			pos4 = e.clientY;
			elmnt.stashonmouseup = document.onmouseup; // I don't want to interfere with other drag events.
			elmnt.stashonmousemove = document.onmousemove;

			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;
			elmnt.onmouseleave = function(event){
				closeDragElement(event);
			};
		}
		
	}
	
	elmnt.onmousedown = dragMouseDown;
	elmnt.ontouchstart = dragMouseDown;
}
				
function makeDraggableElement(elmnt, absolute=false) {
	
	if (session.disableMouseEvents){return;}
	
	try {
		elmnt.dragElement = false;
		elmnt.style.bottom = "auto";
		elmnt.style.cursor = "grab";
		elmnt.stashonmouseup = null;
		elmnt.stashonmousemove = null;
	} catch (e) {
		errorlog(e);
		return;
	}
	var pos1 = 0;
	var pos2 = 0;
	var pos3 = 0;
	var pos4 = 0;
	var timestamp = false;
	
	
	var enterEventCount = 0;
	var leaveEventCount = 0;


	function dragMouseDown(e) {
		timestamp = Date.now();
		
		e = e || window.event;
		e.preventDefault();
		
		pos3 = e.clientX;
		pos4 = e.clientY;
		//elmnt.stashonmouseup = document.onmouseup; // I don't want to interfere with other drag events.
		//elmnt.stashonmousemove = document.onmousemove;
		//elmnt.stashonclick = document.onclick;

		document.onmouseup = function(event){closeDragElement(event, elmnt);};
		
		document.onmousemove = function(event){elementDrag(elmnt,event);};
		
		if ("stopDragTimeout" in elmnt){clearTimeout(elmnt.stopDragTimeout);}
		
		elmnt.onmouseleave = function(event){
			leaveEventCount+=1;
		//	console.log("LEFT MOUSE");
		//	console.log(event);
			elmnt.stopDragTimeout = setTimeout(function(ele,evt1){
				//	console.log("CLOSING AFTER TIMER");
					closeDragElement(evt1, ele);}
				,100, elmnt, event);
		};
		elmnt.onmouseenter = function(event){
			enterEventCount+=1;
			//console.log("ENTER MOUSE");
		//	console.log(event);
			if (enterEventCount>=leaveEventCount){
				if ("stopDragTimeout" in elmnt){clearTimeout(elmnt.stopDragTimeout);}
			} else {
				if (("stopDragTimeout" in elmnt) && (elmnt.stopDragTimeout)){
					clearTimeout(elmnt.stopDragTimeout);
					elmnt.stopDragTimeout = setTimeout(function(ele,evt1){
						
						closeDragElement(evt1, ele);}
					,100, elmnt, event);
				}
			}
		};
		
		//document.onclick = function(event){closeDragElement(event);};
	}
	function elementDrag(ele,e) {
		
		e = e || window.event;
		if (("buttons" in e) && (e.buttons!==1)){return;}
		
		e.preventDefault();
		
		ele.dragElement = true;
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;

		var topDrag = (ele.offsetTop - pos2 );
		if (absolute){
			if (topDrag > (-3 + (window.innerHeight - ele.clientHeight))){
				topDrag = (-3 + (window.innerHeight - ele.clientHeight));
			}
		} else {
			if (topDrag > -3){
				topDrag = -3;
			}
		}
		ele.style.top = topDrag + "px";
		ele.style.left = (ele.offsetLeft - pos1) + "px";
		
	}
	function closeDragElement(event=false, ele=false) {
		document.onmouseup = null;
		document.onmousemove = null
		ele.onmouseleave = null;
		ele.onmouseenter = null;
		enterEventCount = 0;
		leaveEventCount = 0;
		updateMixer();
		//document.onclick = elmnt.stashonclick;
	}
	
	elmnt.onmousedown = dragMouseDown;
}

function removeStorage(cname){
	localStorage.removeItem(cname);
}

function setStorage(cname, cvalue, hours=9999){ // not actually a cookie
	var now = new Date();
	var item = {
		value: cvalue,
		expiry: now.getTime() + (hours * 60 * 60 * 1000),
	};
	try{
		localStorage.setItem(cname, JSON.stringify(item));
	}catch(e){errorlog(e);}
}

function getStorage(cname) {
	try {
		var itemStr = localStorage.getItem(cname);
	} catch(e){
		errorlog(e);
		return;
	}
	if (!itemStr) {
		return "";
	}
	var item = JSON.parse(itemStr);
	var now = new Date();
	if (now.getTime() > item.expiry) {
		localStorage.removeItem(cname);
		return "";
	}
	return item.value;
}

function play(streamid=null, UUID=false){  // play whatever is in the URL params; or filter by a streamID option
	log("play stream: "+session.view);
	if (session.view===""){
		log("Setting view to null disables all playback");
	} else if (session.view !== false){
		var viewlist = session.view.split(",");
		var played = false;
		for (var j in viewlist){
			if (viewlist[j]==""){
				played=true;
			// view={blank} implies do not play anything. Useful for setting a default bitrate I guess
			} else if (streamid===null){ // play what is in the view list ; not a group room probably
				session.watchStream(viewlist[j]);
				played=true;
			} else if (streamid === viewlist[j]){ // plays if the group room list matches the explicit list
				session.watchStream(viewlist[j]);
				played=true;
			} 
		}
		if (!played){
			if (session.scene!==false){
				if (!session.permaid){
					if (!session.queue){ // I don't want to deal with queues.
						if (session.exclude===false || (!session.exclude.includes(streamid))){
							if (UUID){
								if (session.directorList.indexOf(UUID)>=0){
									warnlog("stream ID added to badStreamList: "+streamid);
									session.badStreamList.push(streamid);
									session.watchStream(streamid);
								}
							}
						}
					}
				}
			}
		}
		
	} else if (session.exclude !== false){
		if (session.exclude.includes(streamid)){
			// we don't play it at all. (if explicity listed as VIDEO, then OKay.)
		} else {
			session.watchStream(streamid); // I suppose we do play it.
		}
	} else if (streamid){	
		session.watchStream(streamid);
	}
}

function nextQueue(){
	if (!session.queue){return;}
	if (!session.director){return;}
	if (session.queueList.length==0){
		getById("queuebutton").classList.add("float2");
		getById("queuebutton").classList.add("red");
		getById("queuebutton").classList.remove("float");
		setTimeout(function(){
			getById("queuebutton").classList.add("float");
			getById("queuebutton").classList.remove("float2");
			getById("queuebutton").classList.remove("red");
		},50);
		return;
	}
	var nextStream = session.queueList.shift();
	
	
	getById("queuebutton").classList.add("float2");
	getById("queuebutton").classList.remove("float");
	setTimeout(function(){
		getById("queuebutton").classList.add("float");
		getById("queuebutton").classList.remove("float2");
	},200);

	updateQueue();
	
	session.watchStream(nextStream);
	log("next stream loading: "+nextStream);
}

function updateQueue(adding=false){
	if (!session.queue){return;}
	if (!session.director){return;}
	if (session.queueList.length) {
		if (session.queueList.length>10){
			getById("queueNotification").innerHTML = "‼";
		} else {
			getById("queueNotification").innerHTML = session.queueList.length;
		}
		getById("queueNotification").classList.add("queueNotification");
	} else {
		getById("queueNotification").innerHTML = "";
		getById("queueNotification").classList.remove("queueNotification");
	}
	
	if (adding){
		if (session.beepToNotify){
			playtone();
			showNotification("someone joined the queue", "queue length: "+session.queueList.length);
		}
		getById("queuebutton").classList.remove("shake");
		setTimeout(function(){getById("queuebutton").classList.add("shake");},10);
	}
}

function hideStreamLowBandwidth(bandwidth, UUID){
	if (!session.lowBitrateCutoff){return;}
	
	if (bandwidth<session.lowBitrateCutoff){
		if (!session.rpcs[UUID].bandwidthMuted){
			session.rpcs[UUID].bandwidthMuted = true;
			updateMixer();
		}
	} else if (session.rpcs[UUID].bandwidthMuted){
		session.rpcs[UUID].bandwidthMuted = false;
		if (session.rpcs[UUID].videoElement){
			session.rpcs[UUID].videoElement.muted = checkMuteState(UUID);
		}
		updateMixer();
	}
}

function setupIncomingScreenTracking(v, UUID){  // SCREEN  element.
		
	if (session.directorList.indexOf(UUID)>=0){
		v.muted=false;
	}
	
	v.onpause = (event) => { // prevent things from pausing; human or other
		if (!((event.ctrlKey) || (event.metaKey) )){
			warnlog("Video paused; force it to play again");
			//return;
			//session.audioCtx.resume();
			//log("ctx resume");
			
			event.currentTarget.play().then(_ => {
				log("playing 4");
			}).catch(error => {
				warnlog("didnt play 1");
			});
			if (Firefox){
				unPauseVideo(v);
			}
		}
		return true;
	}
	
	v.onplay = function(){
		try {
			var bigPlayButton = document.getElementById("bigPlayButton");
			if (bigPlayButton){
				bigPlayButton.parentNode.removeChild(bigPlayButton);
			}
		} catch(e){}
		if (session.pip){
			if (v.readyState >= 3){
				if (!(v.pip)){
					v.pip=true;
					toggleSystemPip(v, true);
				}
			}
		}
		
	}
	
	if (session.pip){
		v.onloadedmetadata = function(){
			if (!v.paused){
				if (!(v.pip)){
					v.pip=true;
					toggleSystemPip(v, true);
				}
			}
		}
	}
	
	v.addEventListener('resize', (e) => { // if the aspect ratio changes, then we might want to update the mixer.  If audio only, then this doesn't matter.
		log("resize event");
		var aspectRatio = parseFloat(e.target.videoWidth/e.target.videoHeight);
		if (!aspectRatio){return;} // if Audio only, then we don't want to set or update any aspect ratio.
		
		if (v.dataset.aspectRatio){
			if (aspectRatio != v.dataset.aspectRatio){
				v.dataset.aspectRatio = aspectRatio;
				setTimeout(function(){updateMixer();},1);  // We don't want to run this on the first resize?  just subsequent ones.
			}
		} else {
			log("ASPECT RATIO CHANGED");
			v.dataset.aspectRatio = aspectRatio;
			setTimeout(function(){updateMixer();},1);
		}
	});
	
	v.volume = 1.0; // play audio automatically
	v.autoplay = true;
	v.controls = session.showControls || false;
	v.classList.add("tile");
	v.setAttribute("playsinline","");
	v.controlTimer = null;
	
	v.dataset.menu = "context-menu-video";
	if (!session.cleanOutput){
		v.classList.add("task"); // this adds the right-click menu
	}
	
	changeAudioOutputDevice(v);  // if enabled, changes to desired output audio device.
	
	if (document.getElementById("mainmenu")){
		var m = getById("mainmenu");
		m.remove();
	}
	
	if (session.director){
		v.controls = true;
		var container = getById("screenContainer_"+UUID);	
		//v.container = container;
		v.disablePictureInPicture = false
		v.setAttribute("controls","controls")
		container.appendChild(v);
		pokeIframeAPI("control-box-video-updated", v.id, UUID);
		session.requestRateLimit(session.directorViewBitrate,UUID); /// limit resolution for director
		v.title = "Hold CTRL or CMD (⌘) while clicking the video to open detailed stats";
		if (session.beepToNotify) {
			playtone();
		}
		
	} else if (session.scene!==false){
		v.controls = session.showControls || false;
		
		if (session.view){ // specific video to be played
			v.style.display="block";
		} else if (session.scene==="0"){ // auto plays, right?
			v.style.display="block";
		} else {  // group scene I guess; needs to be added manually
			v.style.display="none";
			v.mutedStateScene = true;
		}
		
		setTimeout(function(){updateMixer();},1);
	} else if (session.roomid!==false){
		if (session.cleanOutput){
			v.controls = session.showControls || false;
		} else if (session.studioSoftware) {
			v.controls = session.showControls || false;
		} else {
			v.controls = true;
		}
		//if ((session.roomid==="") && (session.bitrate)){
			// let's keep the default bitrates, since this isn't a real room and bitrates are specified.
		//} //else if (session.novideo !== false){
		//	if (session.novideo.includes(session.rpcs[UUID].streamID)){ // no video will have muted the video already anyways.
		//		session.requestRateLimit(0,UUID, false);//  optimizing audio here doesn't later get turned back on.  let the automixer disable audio instead
		//	}
		//} //else {
		//	session.requestRateLimit(0,UUID, false);////  optimizing audio here doesn't later get turned back on.  let the automixer disable audio instead
		//}
		setTimeout(function(){updateMixer();},1);
	} else {
		v.style.display="block";
		setTimeout(function(){updateMixer();},1);
	}
	
	
	v.addEventListener('click', function(e) { // show stats of video if double clicked
		log("clicked");
		try {
			var uid = e.currentTarget.dataset.UUID;
			if ((e.ctrlKey)||(e.metaKey)){
				e.preventDefault();
				
				if ("stats" in session.rpcs[uid]){
				
					var [menu, innerMenu] = statsMenuCreator();
					
					printViewStats(innerMenu, uid );
					
					menu.interval = setInterval(printViewStats, session.statsInterval, innerMenu, uid);
					
					
				}
				e.stopPropagation();
				return false;
			} else if ("prePausedBandwidth" in session.rpcs[uid]){
				unPauseVideo(e.currentTarget);
			}
		} catch(e){errorlog(e);}
	});
	
	if (session.statsMenu){
		if ("stats" in session.rpcs[UUID]){
			
			if (getById("menuStatsBox")){
				clearInterval(getById("menuStatsBox").interval);
				getById("menuStatsBox").remove();
			}
					
			var [menu, innerMenu] = statsMenuCreator();
			
			printViewStats(innerMenu, UUID );
			
			menu.interval = setInterval(printViewStats, session.statsInterval, innerMenu, UUID);
			
		}
	}
	
	
	v.touchTimeOut = null;
	v.touchLastTap = 0;
	v.touchCount = 0;
	v.addEventListener('touchend', function(event) {
		
		if (session.disableMouseEvents){return;}
		
		log("touched");
		
		document.ontouchup = null;
		document.onmouseup = null;
		document.onmousemove = null;
		document.ontouchmove = null;
		
		var currentTime = new Date().getTime();
		var tapLength = currentTime - v.touchLastTap;
		clearTimeout(v.touchTimeOut);
		if (tapLength < 500 && tapLength > 0) {
			///
			log("double touched");
			v.touchCount+=1;
			event.preventDefault();
			if (v.touchCount<5){
				v.touchLastTap = currentTime;
				return false;
			}
			v.touchLastTap = 0;
			v.touchCount=0;
	
			log("double touched");
			var uid = event.currentTarget.dataset.UUID;
			if ("stats" in session.rpcs[uid]){
				
				var [menu, innerMenu] = statsMenuCreator();
				
				printViewStats(innerMenu, uid );
				
				menu.interval = setInterval(printViewStats, session.statsInterval, innerMenu, uid);
			}
			event.stopPropagation();
			return false;
			//////
		} else {
			v.touchCount=1;
			v.touchTimeOut = setTimeout(function(vv) {
				clearTimeout(vv.touchTimeOut);
				vv.touchLastTap = 0;
				vv.touchCount=0;
			}, 5000, v);
			v.touchLastTap = currentTime;
		}
		
	});
	
	if (v.controls == false){
		v.addEventListener("click", function () {
			if (v.paused){
				log("PLAYING MANUALLY?");
				v.play().then(_ => {
				  log("playing 5");
				}).catch(warnlog);
			}
		});
		if (session.nocursor==false){ // we do not want to show the controls. This is because MacOS + OBS does not work; so electron app needs this.
			if (!(session.cleanOutput)){
				if (session.studioSoftware) {
				} else if (session.showControls === false) { // explicitly disabled; default null.
				} else if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
				} else {
					if (v.controlTimer){
						clearInterval(v.controlTimer);
					}
					v.controlTimer = setTimeout(showControlBar.bind(null,v),1000);
					//v.controlTimer = setTimeout(function (){v.controls=true;},3000); // 3 seconds before I enable the controls automatically. This way it doesn't auto appear during loading.  3s enough, right?
				}
			}
		}
	}
	
	//if (session.fadein){
	v.addEventListener('animationend', function(e) {
		v.classList.remove("fadein"); // allows the video to fade in.
		if (v.holder){
			v.holder.classList.remove("fadein");
		}
	});
	//	v.classList.add("fadein"); // allows the video to fade in.
	//	if (v.holder){
	//		v.holder.classList.add("fadein");
	//	}
	//}

	applyMuteState(UUID);; // TODO; needs to be specific to screen video
	v.usermuted = false;
	
	v.addEventListener('volumechange',function(e){
		var muteState = checkMuteState(UUID);
		if (this.muted && (this.muted !== muteState)){
			this.usermuted = true;
		} else if (!this.muted){
			this.usermuted = false;
		}
	});
	
	if (session.screenShareStartPaused){ // we know this is a screen share already
		pauseVideo(v, false);
	}
	
	if (session.director){
		var pie = "";
		if (session.customWSS){
			if (session.customWSS!==true){
				pie = "&pie="+session.customWSS;
			}
		}
		
		var codecGroupFlag="";
		if (session.codecGroupFlag){
			codecGroupFlag = session.codecGroupFlag;
		}
	
		var passAdd2="";
		if (session.password){
			if (session.defaultPassword===false){
				passAdd2="&password="+session.password;
			}
		}

		if (session.customWSS && ("isScene" in msg) && (msg.isScene!==false)){
			// this is a scene, so lets not show it.
		} else {
			var soloLink = soloLinkGenerator(session.rpcs[UUID].streamID+":s");
			createControlBoxScreenshare(UUID, soloLink, session.rpcs[UUID].streamID);
		}
			
	}
	
	if (session.autorecord || session.autorecordremote){
		log("AUTO RECORD START");
		setTimeout(function(UUID, v){
			if (session.director){
				recordVideo(document.querySelector("[data-action-type='recorder-local'][data--u-u-i-d='"+UUID+"']"), null, session.recordLocal)
			} else if (v.stopWriter || v.recording){
				
			} else if (v.startWriter){
				v.startWriter();
			} else {
				recordLocalVideo(null, session.recordLocal, v)
			}
		},2000, UUID, v);
	}
	
	setTimeout(processStats, 100, UUID);
}

function setupIncomingVideoTracking(v, UUID){  // video element.
		
	if (session.directorList.indexOf(UUID)>=0){
		v.muted=false;
	}
	
	v.onpause = (event) => { // prevent things from pausing; human or other
		if (!((event.ctrlKey) || (event.metaKey) )){
			warnlog("Video paused; force it to play again");
			//return;
			//session.audioCtx.resume();
			//log("ctx resume");
			
			event.currentTarget.play().then(_ => {
				log("playing 6");
			}).catch(error => {
				warnlog("didnt play 1");
			});
			
			unPauseVideo(v);
		}
		return true;
	}
	
	/* v.onerror = function(event){
		errorlog(event);
		try{
			warnlog("Vidieo element threw an error; going to reconnect it");
			session.rpcs[UUID].videoElement.stop();
			session.rpcs[UUID].videoElement.srcObject = null;
			session.rpcs[UUID].videoElement.srcObject = session.rpcs[UUID].streamSrc;  // replaecd with  updateIncomingVideoElement these days
			session.rpcs[UUID].videoElement.play();
			setTimeout(function(){updateMixer();},1);
		}  catch(e){errorlog(e);}
	} */
	
	v.onplay = function(){
		try {
			var bigPlayButton = document.getElementById("bigPlayButton");
			if (bigPlayButton){
				bigPlayButton.parentNode.removeChild(bigPlayButton);
			}
		} catch(e){}
		if (session.pip){
			if (v.readyState >= 3){
				if (!(v.pip)){
					v.pip=true;
					toggleSystemPip(v, true);
				}
			}
		}
		
	}
	
	if (session.pip){
		v.onloadedmetadata = function(){
			if (!v.paused){
				if (!(v.pip)){
					v.pip=true;
					toggleSystemPip(v, true);
				}
			}
		}
	}

	v.addEventListener('resize', (e) => {
		log("resize event");
		var aspectRatio = parseFloat(e.target.videoWidth/e.target.videoHeight);
		if (!aspectRatio){return;} // if Audio only, then we don't want to set or update any aspect ratio.
		
		if (v.dataset.aspectRatio){
			if (aspectRatio != v.dataset.aspectRatio){
				v.dataset.aspectRatio = aspectRatio;
				setTimeout(function(){updateMixer();},1);  // We don't want to run this on the first resize?  just subsequent ones.
			}
		} else {
			log("ASPECT RATIO CHANGED");
			v.dataset.aspectRatio = aspectRatio;
			setTimeout(function(){updateMixer();},1);
		}
	});
	
	v.volume = 1.0; // play audio automatically
	v.autoplay = true;
	v.controls = session.showControls || false;
	v.classList.add("tile");
	v.setAttribute("playsinline","");
	v.controlTimer = null;
	
	v.dataset.menu = "context-menu-video";
	if (!session.cleanOutput){
		v.classList.add("task"); // this adds the right-click menu
	}
	
	changeAudioOutputDevice(v);  // if enabled, changes to desired output audio device.
	
	if (document.getElementById("mainmenu")){
		var m = getById("mainmenu");
		m.remove();
	}
	
	if (session.director){
		v.controls = true;
		var container = getById("videoContainer_"+UUID);
		//v.container = container;
		v.disablePictureInPicture = false
		v.setAttribute("controls","controls")
		container.appendChild(v);
		pokeIframeAPI("control-box-video-updated", v.id, UUID);
		container.classList.add("hasMedia");
		session.requestRateLimit(session.directorViewBitrate,UUID); /// limit resolution for director
		v.title = "Hold CTRL or CMD (⌘) while clicking the video to open detailed stats";
		if (session.beepToNotify) {
			playtone();
		}
		
	} else if (session.scene!==false){
		v.controls = session.showControls || false;
		
		if (session.view){ // specific video to be played
			v.style.display="block";
		} else if (session.scene==="0"){ // auto plays, right?
			v.style.display="block";
		} else if ((session.scene!==false) && session.autoadd && session.rpcs[UUID].streamID && session.autoadd.includes(session.rpcs[UUID].streamID)){ /// session.autoadd
			v.style.display="block"; // auto added because manually added.
		} else {  // group scene I guess; needs to be added manually
			v.style.display="none";
			session.rpcs[UUID].mutedStateScene = true;
		}
		
	} else if (session.roomid!==false){
		if (session.cleanOutput){
			v.controls = session.showControls || false;
		} else if (session.studioSoftware) {
			v.controls = session.showControls || false;
		} else {
			v.controls = true;
		}
		
	} else {
		v.style.display="block";
	}
	
	
	v.addEventListener('click', function(e) { // show stats of video if double clicked
		log("clicked");
		try {
			var uid = e.currentTarget.dataset.UUID;
			if ((e.ctrlKey)||(e.metaKey)){
				e.preventDefault();
				if ("stats" in session.rpcs[uid]){
				
					var [menu, innerMenu] = statsMenuCreator();
					
					printViewStats(innerMenu, uid );
					
					menu.interval = setInterval(printViewStats, session.statsInterval, innerMenu, uid);
					
					
				}
				e.stopPropagation();
				return false;
			} else if ("prePausedBandwidth" in session.rpcs[uid]){
				unPauseVideo(e.currentTarget);
			}
		} catch(e){errorlog(e);}
	});
	
	if (session.statsMenu){
		if ("stats" in session.rpcs[UUID]){
			
			if (getById("menuStatsBox")){
				clearInterval(getById("menuStatsBox").interval);
				getById("menuStatsBox").remove();
			}
					
			var [menu, innerMenu] = statsMenuCreator();
			
			printViewStats(innerMenu, UUID );
			
			menu.interval = setInterval(printViewStats, session.statsInterval, innerMenu, UUID);
			
		}
	}
	
	
	v.touchTimeOut = null;
	v.touchLastTap = 0;
	v.touchCount = 0;
	v.addEventListener('touchend', function(event) {
		
		if (session.disableMouseEvents){return;}
		
		log("touched");
		
		document.ontouchup = null;
		document.onmouseup = null;
		document.onmousemove = null;
		document.ontouchmove = null;
		
		var currentTime = new Date().getTime();
		var tapLength = currentTime - v.touchLastTap;
		clearTimeout(v.touchTimeOut);
		if (tapLength < 500 && tapLength > 0) {
			///
			log("double touched");
			v.touchCount+=1;
			event.preventDefault();
			if (v.touchCount<5){
				v.touchLastTap = currentTime;
				return false;
			}
			v.touchLastTap = 0;
			v.touchCount=0;
	
			log("double touched");
			var uid = event.currentTarget.dataset.UUID;
			if ("stats" in session.rpcs[uid]){
				
				var [menu, innerMenu] = statsMenuCreator();
				
				printViewStats(innerMenu, uid );
				
				menu.interval = setInterval(printViewStats, session.statsInterval, innerMenu, uid);
			}
			event.stopPropagation();
			return false;
			//////
		} else {
			v.touchCount=1;
			v.touchTimeOut = setTimeout(function(vv) {
				clearTimeout(vv.touchTimeOut);
				vv.touchLastTap = 0;
				vv.touchCount=0;
			}, 5000, v);
			v.touchLastTap = currentTime;
		}
		
	});
	
	
	if (session.rpcs[UUID].stats.info && ("remote" in session.rpcs[UUID].stats.info) && session.rpcs[UUID].stats.info.remote){
		v.addEventListener("wheel", session.remoteFocusZoomRequest);  //  just remote focus
	}

	if (v.controls == false){
		v.addEventListener("click", function () {
			if (v.paused){
				log("PLAYING MANUALLY?");
				v.play().then(_ => {
				  log("playing 7");
				}).catch(warnlog);
			}
		});
		if (session.nocursor==false){ // we do not want to show the controls. This is because MacOS + OBS does not work; so electron app needs this.
			if (!(session.cleanOutput)){
				if (session.studioSoftware) {
				} else if (session.showControls === false) { // explicitly disabled; default null.
				} else if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
				} else {
					if (v.controlTimer){
						clearInterval(v.controlTimer);
					}
					v.controlTimer = setTimeout(showControlBar.bind(null,v),1000);
					//v.controlTimer = setTimeout(function (){v.controls=true;},3000); // 3 seconds before I enable the controls automatically. This way it doesn't auto appear during loading.  3s enough, right?
				}
			}
		}
	}
	
		//if (session.fadein){
	v.addEventListener('animationend', function(e) {
		v.classList.remove("fadein"); // allows the video to fade in.
		if (v.holder){
			v.holder.classList.remove("fadein");
		}
	});
		//v.classList.add("fadein"); // allows the video to fade in.
			//	if (v.holder){
			////		v.holder.classList.add("fadein");
			//	}
			//}

	applyMuteState(UUID);;
	v.usermuted = false;
	
	if (session.screenShareStartPaused && session.rpcs[UUID].screenShareState){
		pauseVideo(v, false);
	}
	
	v.addEventListener('volumechange',function(e){
		var muteState = checkMuteState(UUID);
		if (this.muted && (this.muted !== muteState)){
			this.usermuted = true;
		} else if (!this.muted){
			this.usermuted = false;
		}
	});
	
	if (session.autorecord || session.autorecordremote){
		log("AUTO RECORD START");
		setTimeout(function(UUID, v){
			if (session.director){
				recordVideo(document.querySelector("[data-action-type='recorder-local'][data--u-u-i-d='"+UUID+"']"), null, session.recordLocal)
			} else if (v.stopWriter || v.recording){
				
			} else if (v.startWriter){
				v.startWriter();
			} else {
				recordLocalVideo(null, session.recordLocal, v)
			}
		},2000, UUID, v);
	}
	
	setTimeout(processStats, 100, UUID);
}

function mediaSourceUpdated(UUID, streamID, videoTrack, audioTrack){
	pokeIframeAPI("new-track-added", {video:videoTrack, audio:audioTrack}, UUID, streamID); //  videoTrack is whether video. audio will be false I guess.
}

function showControlBar(vel){
	try {
		vel.controls=true;
	} catch(e){errorlog(e);}
}

function createRichVideoElement(UUID){ // this function is used to check and generate a rich video element if needed
	if (!session.rpcs[UUID].videoElement){
		log("video element is being created and any media tracks added");
		session.rpcs[UUID].videoElement = createVideoElement();
		session.rpcs[UUID].videoElement.dataset.UUID = UUID;
		session.rpcs[UUID].videoElement.id = "videosource_"+UUID; // could be set to UUID in the future
		
		if (session.rpcs[UUID].streamID){
			session.rpcs[UUID].videoElement.dataset.sid = session.rpcs[UUID].streamID;
		}
		setupIncomingVideoTracking(session.rpcs[UUID].videoElement, UUID);
		pokeIframeAPI("video-element-created", "videosource_"+UUID, UUID);
	}
	return session.rpcs[UUID].videoElement;
}

function updateVolume(update=false){
	if (session.audioGain!==false){
		if (update){
			if (session.roomid){
				var pswd = session.password || "";
				generateHash(session.streamID + session.roomid + pswd + session.salt, 6).then(function(hash) { 
					setStorage("micVolume_"+hash, session.audioGain, hours=6);
				});
			}
		}
		if (session.audioGain === 0){
			getById("header").classList.add('orange');
			getById("head7").classList.remove('hidden');
		} else {
			getById("header").classList.remove('orange');
			getById("head7").classList.add('hidden');
		}
		
	} else {
		var pswd = session.password || "";
		generateHash(session.streamID + session.roomid + pswd + session.salt, 6).then(function(hash) {
			var volume = getStorage("micVolume_"+hash);
			if (volume !== ""){
				if (parseInt(volume) === 0){
					getById("header").classList.add('orange');
					getById("head7").classList.remove('hidden');
				} else if (parseInt(volume)){
					getById("header").classList.remove('orange');
					getById("head7").classList.add('hidden');
				} else {
					return;
				}
				session.audioGain = parseInt(volume);
				var vol = parseFloat(session.audioGain/100) || 0;
				for (var waid in session.webAudios){ // TODO:  EXCLUDE CURRENT TRACK IF ALREADY EXISTS ... if (trackid === wa.id){..
					log("Adjusting Gain; only track 0 in all likely hood, unless more than track 0 support is added.");
					session.webAudios[waid].gainNode.gain.setValueAtTime(vol, session.webAudios[waid].audioContext.currentTime);
				}
			}
		});
	}
}

function switchModes(state=null){
	if (state===null){
		session.switchMode = !session.switchMode;
	} else {
		session.switchMode = state;
	}
	if (session.switchMode){
		updateMixer();
	} else {
		document.getElementById("gridlayout").innerHTML = "";
		if (!document.querySelector("#guestFeeds")){
			document.getElementById("gridlayout").appendChild(session.guestFeeds);
		}
		for (var UUID in session.rpcs){
			if (document.getElementById("videoContainer_"+UUID) && session.rpcs[UUID].videoElement){
				session.rpcs[UUID].videoElement.style = "";
				session.rpcs[UUID].videoElement.alreadyAdded = false;
				document.getElementById("videoContainer_"+UUID).prepend(session.rpcs[UUID].videoElement);
				
				if (session.signalMeter){
					if (session.rpcs[UUID].signalMeter){
						document.getElementById("videoContainer_"+UUID).appendChild(session.rpcs[UUID].signalMeter);
					}
				}
				
				if (session.rpcs[UUID].voiceMeter){
					document.getElementById("videoContainer_"+UUID).appendChild(session.rpcs[UUID].voiceMeter);
				}
				if (session.rpcs[UUID].remoteMuteElement){
					document.getElementById("videoContainer_"+UUID).appendChild(session.rpcs[UUID].remoteMuteElement);
				}
				
			}
		}
	}
}

var updateMixerTimer = null;
var updateMixerActive = false;
//var cleanupTimeout = null;
function updateMixer(e=false){
	if (session.windowed){return;}
	
	clearInterval(updateMixerTimer);
	if (updateMixerActive){
		if (session.mobile){
			updateMixerTimer = setTimeout(function(){updateMixer();},200);
		} else {
			updateMixerTimer = setTimeout(function(){updateMixer();},50);
		}
		return;
	}
	updateMixerActive=true;
	log("updating mixer");
	try{
		updateMixerRun(e);
	//	clearInterval(cleanupTimeout);
	//	cleanupTimeout = setTimeout(function(){deleteOldMedia();},60000);
	
	} catch(e){}
	
	if (session.mobile){
		setTimeout(function(){updateMixerActive=false;},500);
	} else {
		setTimeout(function(){updateMixerActive=false;},100);
	}
}

function updateMixerRun(e=false){  // this is the main auto-mixing code.  It's a giant function that runs when there are changes to screensize, video track statuses, etc.
	try { 
		if (getById("subControlButtons").dragElement){
			if (parseInt(getById("subControlButtons").style.top) > 0){
				getById("subControlButtons").style.top = "0px";
			} else if (parseInt(getById("subControlButtons").style.top) < parseInt(50 - window.innerHeight) ){
				getById("subControlButtons").style.top =  parseInt( 50 - window.innerHeight)+"px";
			}
			if (parseInt(getById("subControlButtons").style.left) < 0){
				getById("subControlButtons").style.left = "0px";
			} else if (parseInt(getById("subControlButtons").style.left) > parseInt( window.innerWidth - getById("subControlButtons").offsetWidth) ){
				getById("subControlButtons").style.left =  parseInt( window.innerWidth -getById("subControlButtons").offsetWidth )+"px";
			}
		}
		if (session.switchMode){}
		else if (session.director){return;}
		else if (session.manual === true){return;}
		var header = getById("header");
		
		var hi = header.offsetHeight ;
		var w = window.innerWidth;
		var h = window.innerHeight - hi;
		
		if ( window.innerHeight<=700 ){
			if (document.getElementById("controlButtons")){
				var h = window.innerHeight - hi - document.getElementById("controlButtons").offsetHeight;
			} else {
				var h = window.innerHeight - hi;
			}
		}
		
		var arW = 16.0;
		var arH = 9.0;
		
		if (session.aspectratio){
			if (session.aspectratio==1){
				arW = 9.0;
				arH = 16.0;
			} else if (session.aspectratio==2){
				arW = 12.0; // square root; cause why not.
				arH = 12.0;
			} else if (session.aspectratio==3){
				arW = 12.0; // square root; cause why not.
				arH = 9.0;
			}
		}
		
		var soloVideo = false;
		if (session.infocus===true){
			soloVideo = true;
		} else if (session.infocus && (session.infocus!==true) && (session.infocus in session.rpcs)){ // if the infocus stream is connected
			if (session.group.length){
				try {
					if (session.group.some(item => session.rpcs[session.infocus].group.includes(item))){
						soloVideo = session.infocus;
					}
				} catch(e){errorlog(e);}
			} else {
				soloVideo = session.infocus;
			}
		}
		
		var ww = w/arW;
		var hh = h/arH;
		
		var mediaPool = [];
		var mediaPool_invisible = [];
		
		
		if (session.iframeEle && (session.iframeEle.style.display!="none")){  // local feed
			if (session.order!==false){
				session.iframeEle.order=session.order;
			} else {
				session.iframeEle.order=0;
			}
			if (session.activeSpeaker && (!session.activelySpeaking)){
				mediaPool_invisible.push(session.iframeEle);
			} else {
				mediaPool.push(session.iframeEle);
			}
		}

		if (session.videoElement && (session.videoElement.src || session.videoElement.srcObject)){ // I, myself, exist
			if (session.videoElement.style.display!="none"){  // local feed
				if (session.minipreview && (soloVideo!==true)){
					
					/* session.videoElement.onclick = function(){
						if (soloVideo === true){
							soloVideo = false;
						} else {
							soloVideo = true;
							log("session: myself");
						}
						setTimeout(()=>updateMixer(),10);
					}; */
					
				} else {
					if (session.order!==false){
						session.videoElement.order=session.order;
					} else {
						session.videoElement.order=0;
					}
					if (session.activeSpeaker && (!session.activelySpeaking)){
						//mediaPool_invisible.push(session.videoElement);
					//} else if (session.videoElement.srcObject && (session.videoElement.srcObject.getTracks().length === 0)){
						// do not show a video element if its completely empty.
					} else if (session.videoElement.srcObject && (session.videoElement.srcObject.getVideoTracks().length === 0)){
						// do not show a video element if its completely empty.
						
					} else if (soloVideo && soloVideo!==true){
						//
					} else {
						mediaPool.push(session.videoElement);
					}
				}
			}
		}
		
		if (session.screenShareElement){ // I, myself, exist
			if (!session.screenShareElementHidden){ 
				if (session.order!==false){
					session.screenShareElement.order=session.order;
				} else {
					session.screenShareElement.order=0;
				}
				
				if (soloVideo!==false){
					session.screenShareElement.style.display="none";
				} else if (session.activeSpeaker && (!session.activelySpeaking)){
					session.screenShareElement.style.display="none";
				} else {
					mediaPool.push(session.screenShareElement);
				}
			}
		}

		if ((soloVideo) && (soloVideo in session.rpcs)){ // remote guest being full screened; infocus == UUID
			mediaPool = []; // remove myself from fullscreen
			for (var j in session.rpcs){
				
				if (session.group.length){
					try {
						if (!(session.group.some(item => session.rpcs[j].group.includes(item)))){
							continue;
						}
					} catch(e){errorlog(e);}
				}
				
				if (j != soloVideo){ // this remote guest is NOT in focus
					try {
						if (session.rpcs[j].videoElement && session.rpcs[j].videoElement.style.display!="none" ){  // Add it if not hidden
						
							if (document.pictureInPictureElement && document.pictureInPictureElement.id && (document.pictureInPictureElement.id == session.rpcs[j].videoElement.id)){
								var bitratePIP = parseInt(session.zoomedBitrate/4);
								//warnUser("GOOD");
								session.requestRateLimit(bitratePIP, j);
							} else {
								session.requestRateLimit(0, j); // disable the video of non-fullscreen videos
							}
							if (session.rpcs[j].videoElement.srcObject && session.rpcs[j].videoElement.srcObject.getAudioTracks().length){
							//	mediaPool_invisible.push(session.rpcs[j].videoElement);
							}
						} else if (session.rpcs[j].videoElement){
							session.requestRateLimit(0, j, true); // disable the video of non-fullscreen videos
						}
					} catch(e){errorlog(e);}
				} else {  // remote guest is in-focus video
					////////
					try {
						if (session.rpcs[j].iframeEle){
							if (session.rpcs[j].videoElement && (session.rpcs[j].videoElement.srcObject.getAudioTracks().length)){
								//mediaPool_invisible.push(session.rpcs[j].videoElement);
							}
							session.requestRateLimit(0, j);
							mediaPool.push(session.rpcs[j].iframeEle);
							continue;
						} else if (session.rpcs[j].videoElement){
						
							if (session.rpcs[j].order!==false){
								session.rpcs[j].videoElement.order=session.rpcs[j].order;
							} else {
								session.rpcs[j].videoElement.order=0;
							}
							///////////
							//if (session.activeSpeaker && (!session.rpcs[j].defaultSpeaker)){ // not the active speaker
								//mediaPool_invisible.push(session.rpcs[j].videoElement);
							//	session.requestRateLimit(0, j); // keep audio good, but disable video
							//} else {
								mediaPool.push(session.rpcs[j].videoElement); // active speaker
								session.rpcs[j].videoElement.style.visibility = "visible";
								if ((session.rpcs[j].targetBandwidth!==-1) && (session.rpcs[j].targetBandwidth<session.zoomedBitrate)){
									session.requestRateLimit(session.zoomedBitrate, j); // 1.2mbps is decent, no? in-focus, so higher bitrate
								}
							//}
						}
					} catch(e){errorlog(e);}
				}
			}
		} else if ((soloVideo) && (soloVideo === true)){  // well, fullscreen myself. "true" represents me. UUID would be for others.
			// already added myself to this as fullscreen
			for (var j in session.rpcs){
				if (session.group.length){
					try {
						if (!(session.group.some(item => session.rpcs[j].group.includes(item)))){
							continue;
						}
					} catch(e){errorlog(e);}
				}
				try {
					if (session.rpcs[j].videoElement && (session.rpcs[j].videoElement.style.display!="none")){  // Add it if not hidden
						if (document.pictureInPictureElement && document.pictureInPictureElement.id && (document.pictureInPictureElement.id == session.rpcs[j].videoElement.id)){
							var bitratePIP = parseInt(session.zoomedBitrate/4);
							session.requestRateLimit(bitratePIP, j);
							//warnUser("GOOD");
						} else {
							session.requestRateLimit(0, j); // disable the video of non-fullscreen videos
						}
					//	mediaPool_invisible.push(session.rpcs[j].videoElement);
					} else if (session.rpcs[j].videoElement){
						session.requestRateLimit(0, j, true); // other videos are disabled when previewing yourself, but audio retained
					}
				} catch(e){errorlog(e);}
			}
		} else {
			var roomQuality = 0;
			var screenShareTotal = 0;
			
			for (var i in session.rpcs){
				if (session.rpcs[i]===null){continue;}
				if (session.group.length){
					try {
						if (!(session.group.some(item => session.rpcs[i].group.includes(item)))){
							continue;
						}
					} catch(e){errorlog(e);}
				}
				if (session.rpcs[i].videoElement){ // remote feeds
					if (session.rpcs[i].videoElement.style.display!="none"){
						if (session.rpcs[i].videoElement.srcObject && session.rpcs[i].videoElement.srcObject.getVideoTracks().length){ // only count videos with actual video tracks; audio-only excluded
							if (session.rpcs[i].videoMuted){
								// it's video muted
							//	mediaPool_invisible.push(session.rpcs[i].videoElement); // skipped later on
							} else if (session.rpcs[i].directorVideoMuted){
								// it's muted by the director, so likely disabled.
							//	mediaPool_invisible.push(session.rpcs[i].videoElement);  // skipped later on
							} else if (session.rpcs[i].virtualHangup){
								
							} else if (session.rpcs[i].bandwidthMuted){
							
							} else if (session.rpcs[i].videoElement.style.opacity==="0"){
							//	mediaPool_invisible.push(session.rpcs[i].videoElement);  // skipped later on
							} else {
								roomQuality+=1;
								if (session.rpcs[i].screenShareState){
									screenShareTotal+=1;
								}
							}
						}
					}
				}
			}
			
			if (session.broadcast !==false){
				if (roomQuality>0){
					if (session.nopreview!==false){
						mediaPool = []; // we don't want to show our self-preview if in broadcast mode and there is a director.
					}
				}
			}
			
			if (roomQuality === 0){roomQuality=1;}
			
			var totalRoomBitrate = session.totalRoomBitrate;
			if ((session.controlRoomBitrate!==false) && (session.controlRoomBitrate!==true)){
				totalRoomBitrate = Math.min(session.controlRoomBitrate, totalRoomBitrate);
			}
			
			var roomBitrate = totalRoomBitrate;
			var sceneBitrate = false;
			var screenShareBitrate = false;
			
			if (session.screenShareBitrate!==false){
				screenShareBitrate = session.screenShareBitrate;
				if ((roomQuality-screenShareTotal)>0){
					roomBitrate = parseInt(totalRoomBitrate/(roomQuality-screenShareTotal));
					if (session.totalSceneBitrate){
						sceneBitrate = parseInt(session.totalSceneBitrate/(roomQuality-screenShareTotal));
						if (session.bitrate!==false){
							sceneBitrate = Math.min(session.bitrate, sceneBitrate);
						}
					}
				}
			} else if (screenShareTotal){
				try {
					if ((session.roomid!==false) && (session.scene===false)){
						if ((roomQuality-screenShareTotal)<=0){
							roomBitrate = totalRoomBitrate;
							screenShareBitrate = totalRoomBitrate;
						} else {
							screenShareBitrate = totalRoomBitrate/(1.5*screenShareTotal);
							roomBitrate = parseInt((totalRoomBitrate - screenShareBitrate) /(roomQuality-screenShareTotal));
						}
					} else if (session.totalSceneBitrate!==false){
						if ((roomQuality-screenShareTotal)<=0){
							sceneBitrate = session.totalSceneBitrate;
							if (session.bitrate!==false){
								sceneBitrate = Math.min(session.bitrate, sceneBitrate);
							}
							screenShareBitrate = sceneBitrate;
						} else {
							screenShareBitrate = parseInt(totalRoomBitrate/(1.5*screenShareTotal));
							sceneBitrate = parseInt((totalRoomBitrate - screenShareBitrate)/(roomQuality-screenShareTotal));
							if (session.bitrate!==false){
								sceneBitrate = Math.min(session.bitrate, sceneBitrate);
								screenShareBitrate = Math.min(session.bitrate, screenShareBitrate);
							}
						}
					} else {
						screenShareBitrate = false;
					}
				} catch(e){errorlog(e);}
			} else {
				roomBitrate = parseInt(totalRoomBitrate/roomQuality);
				if (session.totalSceneBitrate){
					sceneBitrate = parseInt(session.totalSceneBitrate/roomQuality);
					if (session.bitrate!==false){
						sceneBitrate = Math.min(session.bitrate, sceneBitrate);
					}
				}
			}
			
			if (session.minimumRoomBitrate){
				if (session.totalRoomBitrate && (roomBitrate<session.minimumRoomBitrate)){
					roomBitrate = session.minimumRoomBitrate;
					if (roomBitrate>session.totalRoomBitrate){
						roomBitrate = session.totalRoomBitrate;
					}
				}
				if (session.totalSceneBitrate && (sceneBitrate<session.minimumRoomBitrate)){
					sceneBitrate = session.minimumRoomBitrate;
					if (sceneBitrate>session.totalSceneBitrate){
						sceneBitrate = session.totalSceneBitrate;
					}
				}
				
				
			}
			
			var i = null;
			var countOrder = 0;
			try{
				var RPCSkeys = Object.keys(session.rpcs); // default sorting type: time added; //RPCSkeys.sort();
			} catch(e){return;}
			
			for (var keyIndex = 0; keyIndex<RPCSkeys.length; keyIndex++){
				i = RPCSkeys[keyIndex];
				if (session.rpcs[i]===null){continue;}
				session.rpcs[i].mutedStateMixer = false;
				if (session.group.length){  // The MAIN and LAST group filter.
					try {
						if (!(session.group.some(item => session.rpcs[i].group.includes(item)))){
							if (session.scene!==false){
								if (session.groupAudio){
									session.requestRateLimit(session.hiddenSceneViewBitrate, i, false);
								} else {
									session.requestRateLimit(session.hiddenSceneViewBitrate, i, true);  // hidden. I dont want it to be super low, for video quality reasons.
									session.rpcs[i].mutedStateMixer = true;
								}
								if (!session.hiddenSceneViewBitrate){ 
									session.rpcs[i].videoElement.classList.add("nogb");
								}
							} else {
								if (session.groupAudio){
									session.requestRateLimit(0, i, false);
								} else {
									session.requestRateLimit(0, i, true); // w/e   This is not in OBS, so we just set it as low as possible.  Shoudln't exist really unless loading?
									session.rpcs[i].mutedStateMixer = true;
								}
							}
							applyMuteState(i);
							continue;
						}
					} catch(e){} 
				}
				applyMuteState(i);
				
				if (session.rpcs[i].iframeEle){
					if (session.rpcs[i].iframeEle.style.display=="none"){
						// pass
					} else if (session.rpcs[i].iframeEle.style.opacity==="0"){
						// pass
					} else {
						session.rpcs[i].iframeEle.style.visibility = "visible";
							
						if (session.rpcs[i].order!==false){
							session.rpcs[i].iframeEle.order=session.rpcs[i].order;
						} else {
							session.rpcs[i].iframeEle.order=0;
						}
						try{
							if (session.activeSpeaker && (!session.rpcs[i].defaultSpeaker)){
								mediaPool_invisible.push(session.rpcs[i].iframeEle);  // TODO: this needs validation; will the iframe be maintained if activer speaker is going? do we even want this? 
								
							/* } else if (session.rpcs[i].iframeEle.dataset.meshcast){ //////// MESH CAST ONLY LOGIC
								if (session.rpcs[i].iframeEle.contentDocument && session.rpcs[i].iframeEle.contentDocument.querySelectorAll("video").length){
									if (session.rpcs[i].iframeVideo){
										mediaPool.push(session.rpcs[i].iframeVideo);
									} else if (session.rpcs[i].iframeEle.contentDocument.querySelectorAll("video").length){
										session.rpcs[i].iframeVideo = session.rpcs[i].iframeEle.contentDocument.querySelectorAll("video")[0];
										session.rpcs[i].iframeVideo.id="meshcast_"+i;
										//errorlog("THIS IS GOOD");
										mediaPool.push(session.rpcs[i].iframeVideo);
									} else {
										//errorlog("No video yet");
									}
								} else { // this is a problem is not on the same domain.
									if (!document.getElementById("iframe_"+i)){
										if (document.getElementById("hiddenElements")){
											document.getElementById("hiddenElements").append(session.rpcs[i].iframeEle);
										} else {
											document.body.append(session.rpcs[i].iframeEle);
										}
										if (session.rpcs[i].iframeVideo){
											mediaPool.push(session.rpcs[i].iframeVideo);
										} else if (session.rpcs[i].iframeEle.contentDocument.querySelectorAll("video").length){
											session.rpcs[i].iframeVideo = session.rpcs[i].iframeEle.contentDocument.querySelectorAll("video")[0];
											session.rpcs[i].iframeVideo.id="meshcast_"+i;
											mediaPool.push(session.rpcs[i].iframeVideo);
										} else {
											//errorlog("No video yet");
										}
											
									} else {
										if (session.rpcs[i].iframeVideo){
											mediaPool.push(session.rpcs[i].iframeVideo);
										} else {
											//errorlog("Does not support contentDocument or something");
										}
									}
								} */
							} else {  ///////// MESH CAST LOGIC ENDS HERE
								//errorlog("not meshcast");
								mediaPool.push(session.rpcs[i].iframeEle);
							}
						} catch(e){errorlog(e);}
					}
				}
				
				if (session.rpcs[i].imageElement){
					if (session.rpcs[i].videoElement && (session.rpcs[i].videoElement.srcObject.getAudioTracks().length)){ // is there audio?
					//	mediaPool_invisible.push(session.rpcs[i].videoElement); // include audio as hidden track; 
					}
				
					if (session.rpcs[i].videoMuted || session.rpcs[i].directorVideoMuted || session.rpcs[i].virtualHangup || session.rpcs[i].bandwidthMuted){
						continue;
					}
					
					if (session.rpcs[i].videoElement.style.display=="none"){ // currently this is considered the state of scenes.  pertty dumb on my part.
						continue;
					}
				
					if (session.rpcs[i].order!==false){
						session.rpcs[i].imageElement.order=session.rpcs[i].order;
					} else {
						session.rpcs[i].imageElement.order=0;
					}
					if (session.activeSpeaker && (!session.rpcs[i].defaultSpeaker)){
						// mediaPool_invisible.push(session.rpcs[i].imageElement);
					} else {
						mediaPool.push(session.rpcs[i].imageElement);
					}
					
					continue;
				}
				
				if (session.rpcs[i].videoElement){ // remote feeds
					//session.rpcs[i].targetBandwidth = -1;
					if (session.rpcs[i].videoElement.style.opacity==="0"){
						continue;
					}
					try{
						session.rpcs[i].videoElement.style.visibility = "visible";
					} catch(e){errorlog(e);}
					
					if (session.rpcs[i].virtualHangup || session.rpcs[i].bandwidthMuted){
						continue;
					}
					
					if (session.style && (session.style >= 2)){
						if (session.rpcs[i].videoElement.srcObject && ((session.rpcs[i].videoElement.srcObject.getVideoTracks().length==0) || (session.rpcs[i].videoMuted))){
							
							if (session.rpcs[i].videoElement.style.display=="none"){ // currently this is considered the state of scenes.  pertty dumb on my part.
								continue;
							}
							
							if (createStyleCanvas(i)){
								applyStyleEffect(i);
							}
							
							if (session.rpcs[i].order!==false){
								session.rpcs[i].canvas.order=session.rpcs[i].order;
							} else {
								session.rpcs[i].canvas.order=0;
							}
							if (session.activeSpeaker && (!session.rpcs[i].defaultSpeaker)){
							//	mediaPool_invisible.push(session.rpcs[i].canvas);
							} else {
								mediaPool.push(session.rpcs[i].canvas);
							}
							
							continue;
						}
					} else if (session.style==1){
						if (session.rpcs[i].videoElement.srcObject && ((session.rpcs[i].videoElement.srcObject.getVideoTracks().length==0) || session.rpcs[i].videoMuted)){
							//if (session.style==1){ //  avatars and waveforms might be better done elsewhere? as a canvas effect even?
							continue;
							//}
						}
					} else if (session.rpcs[i].videoElement.srcObject && ((session.rpcs[i].videoElement.srcObject.getVideoTracks().length==0) || session.rpcs[i].videoMuted)){
						if (session.rpcs[i].screenShareState){
							continue;
						}
					}
					//} else if (!session.directorList.indexOf(i)>=0){  // director is never audio-only.  Video if need, yes, but not visualized-audio.
					//	if (session.rpcs[i].videoElement.srcObject && ((session.rpcs[i].videoElement.srcObject.getVideoTracks().length==0) || (session.rpcs[i].videoMuted)) && !session.rpcs[i].directorVideoMuted){
					//		continue;
					//	}
					//} 
					
					session.rpcs[i].opacityMuted = "1";
					if (session.rpcs[i].opacityDisconnect=="1"){
						if (session.rpcs[i].videoElement){
							session.rpcs[i].videoElement.style.opacity = "1";
						}
					}
					if (session.rpcs[i].videoMuted){
						if (session.rpcs[i].videoElement.srcObject.getAudioTracks().length==0){ // if no audio track, no point in removing the video track, since it will just stall out then.
							continue; // easiest is to just not show anything if no video and no audio track.
						}
						if (session.rpcs[i].videoElement.srcObject){
							session.rpcs[i].videoElement.srcObject.getVideoTracks().forEach(track=>{
								session.rpcs[i].videoElement.srcObject.removeTrack(track);
								session.rpcs[i].videoElement.load();
							});
						}
						//continue;  // currently disabling this, since we want to show it.
					} else if (session.rpcs[i].virtualHangup || session.rpcs[i].bandwidthMuted || session.rpcs[i].directorVideoMuted){
						continue
					}
					
					
					if (session.scene!==false){
						if (session.sceneType === 3){ // order
							countOrder+=1;
							if (session.order === false){
								if (countOrder==1){
									session.rpcs[i].videoElement.style.display="block";
								} else {
									session.rpcs[i].videoElement.style.display="none";
								}
							} else if (session.order === countOrder){
								session.rpcs[i].videoElement.style.display="block";
							} else {
								session.rpcs[i].videoElement.style.display="none";
							}
						}
					}
					
					if (session.rpcs[i].videoElement.style.display=="none"){  // Video is disabled; run at lowest 
						if (session.scene!==false){
							session.requestRateLimit(session.hiddenSceneViewBitrate, i, true);  // hidden. I dont want it to be super low, for video quality reasons.
							if (!session.hiddenSceneViewBitrate){ 
								session.rpcs[i].videoElement.classList.add("nogb");
							}
						} else {
							session.requestRateLimit(0, i, true); // w/e   This is not in OBS, so we just set it as low as possible.  Shoudln't exist really unless loading?
						}
					} else if (session.scene!==false){  // max
						if (sceneBitrate!==false){
							if ((screenShareBitrate!==false) && session.rpcs[i].screenShareState){
								session.requestRateLimit(screenShareBitrate, i); // well, screw that. Setting it to room quality.
							} else {
								session.requestRateLimit(sceneBitrate, i); // well, screw that. Setting it to room quality.
							}
						} else {
							session.requestRateLimit(-1, i);  // unlock.
						}
						if (session.rpcs[i].order!==false){
							session.rpcs[i].videoElement.order=session.rpcs[i].order;
						} else {
							session.rpcs[i].videoElement.order=0;
						}
						if (session.activeSpeaker && (!session.rpcs[i].defaultSpeaker)){
							if (!(session.rpcs[i].videoElement in mediaPool_invisible)){
							//	mediaPool_invisible.push(session.rpcs[i].videoElement);
							} else {
								errorlog("THIS SHOULD NOT HAPPEN; 650");
							}
						} else {
							mediaPool.push(session.rpcs[i].videoElement);
						}
					} else if (session.roomid!==false){  // guests should see video at low bitrate, ie: 100kbps (not 35kbps like if disabled)
						if (session.rpcs[i].order!==false){
							session.rpcs[i].videoElement.order=session.rpcs[i].order;
						} else {
							session.rpcs[i].videoElement.order=0;
						}
						if (session.activeSpeaker && (!session.rpcs[i].defaultSpeaker)){
							if (!(session.rpcs[i].videoElement in mediaPool_invisible)){
						//		mediaPool_invisible.push(session.rpcs[i].videoElement);
							} else {
								errorlog("THIS SHOULD NOT HAPPEN; 665");
							}
						} else {
							mediaPool.push(session.rpcs[i].videoElement);
						}
						if ((session.roomid==="") && (session.bitrate)){
							// we will let the URL specified bitrate hold, since this isn't a real room.
							session.requestRateLimit(-1, i);
						} else {
							if ((screenShareBitrate!==false) && session.rpcs[i].screenShareState){
								session.requestRateLimit(screenShareBitrate, i); // well, screw that. Setting it to room quality.
							} else {
								session.requestRateLimit(roomBitrate, i); // well, screw that. Setting it to room quality.
							}
						}
					} else {  // view=xx,yy  or whatever.  This should be highest quality.
						if (session.rpcs[i].order!==false){
							session.rpcs[i].videoElement.order=session.rpcs[i].order;
						} else {
							session.rpcs[i].videoElement.order=0;
						}
						if (session.activeSpeaker && (!session.rpcs[i].defaultSpeaker)){
							if (!(session.rpcs[i].videoElement in mediaPool_invisible)){
						//		mediaPool_invisible.push(session.rpcs[i].videoElement);
							} else {
								errorlog("THIS SHOULD NOT HAPPEN; 684");
							}
						} else {
							mediaPool.push(session.rpcs[i].videoElement);
						}
						if (sceneBitrate){
							session.requestRateLimit(sceneBitrate, i);
						} else {
							session.requestRateLimit(-1, i);
						}
					}
				}
			}
		}

			
		if (session.broadcastIFrame && session.broadcastIFrame.src){
			if (!mediaPool.length){
				mediaPool.push(session.broadcastIFrame);
			}
		}
			
		if (document.fullscreenElement) {
			log("FULL SCREEN: "+document.fullscreenElement.id);
			for (var i=0;i<mediaPool.length;i++){ // if its your local camera, it shouldn't be a problem.
				if (mediaPool[i].id == document.fullscreenElement.id){ // make sure the element is suppose to be seen.
					//return; // This is FULL SCREEN, (we will keep it if it is full screen
				} else if (mediaPool[i].dataset && mediaPool[i].dataset.UUID && mediaPool[i].tagName && mediaPool[i].tagName == "VIDEO"){
					session.requestRateLimit(session.hiddenSceneViewBitrate, mediaPool[i].dataset.UUID, null); // null implies don't change the current audio setting
					mediaPool_invisible.push(mediaPool[i]); // move visible elements to the invisible list, since something is full screen
					mediaPool.splice(i,1);
				}
			}
		}
		
		var sssid = false;
		var sscount = 0;
		var mpl = session.slots || mediaPool.length;
		var playarea = getById("gridlayout");
		var skip = false;
		
		if (playarea.querySelector("#guestFeeds")){
			if (document.getElementById("deleteme")){
				document.getElementById("deleteme").remove();
			}
			session.guestFeeds = playarea.querySelector("#guestFeeds");
			playarea.innerHTML = "";
			skip = true;
		} else {
			for (var m=0;m<mediaPool.length;m++){
				mediaPool[m].alreadyAdded=false;
			}
		}
		
		mediaPool.sort(compare_vids);
		
		if (mpl>1){
			var BB = 0;
			var rw = 1;
			var rh = 1;
			var NW;
			var NH;
			var current;
			for (NW=1; NW <= mpl; NW++){
				NH = Math.ceil(mpl/NW);
				var www = ww/NW;
				var hhh = hh/NH;
				if (www>hhh){
					current = hhh * hhh * (mpl/(NW*NH));
				} else {
					current = www * www * (mpl/(NW*NH));
				}
				
				if (current>=BB){
					BB = current;
					rw = NW;
					rh = NH;
				}
				
				if (mediaPool[NW-1]){
					//if (mediaPool[NW-1].tagName == "VIDEO"){
					if (mediaPool[NW-1].dataset.UUID){
						if (mediaPool[NW-1].dataset.UUID in session.rpcs){
							if (session.rpcs[mediaPool[NW-1].dataset.UUID].screenShareState){
								sscount+=1;
								sssid = mediaPool[NW-1].dataset.sid;
							}
						}
					} else if (("id" in mediaPool[NW-1]) && (mediaPool[NW-1].id == "screensharesource")){
						sscount+=1;
						sssid = mediaPool[NW-1].dataset.sid;
					}
				}
			}
		} else { var rw=1; var rh=1;}
		if (sscount>1){
			sssid = false; // lets not maximize if more than one screen share.
		}
	} catch(e){
		errorlog(e);
		sssid = false
	}
	
	
	var customLayout=false;
	if (sssid && !session.layout){
		customLayout = {};
		
		if (mediaPool.length>8){
			customLayout[sssid] = {"x":0,"y":20,"w":80,"h":80, "c": false};
		} else if (mediaPool.length>=7){
			customLayout[sssid] = {"x":0,"y":25,"w":75,"h":75, "c": false};
		} else if (mediaPool.length==5){
			customLayout[sssid] = {"x":0,"y":0,"w":75,"h":100, "c": false};
		} else if (mediaPool.length>5){
			customLayout[sssid] = {"x":0,"y":33.333,"w":66.667,"h":66.667, "c": false};
		} else {
			customLayout[sssid] = {"x":0,"y":0,"w":66.667,"h":100, "c": false};
		}
		var posCount = 0;
		for (var i = 0; i<mediaPool.length; i++){
			if (mediaPool[i].dataset.sid === sssid){continue;}
			if (mediaPool.length==2){
				customLayout[mediaPool[i].dataset.sid] = {"x":66.667,"y":33.333,"w":33.333,"h":33.333, "c":true};
			} else if (mediaPool.length==3){
				customLayout[mediaPool[i].dataset.sid] = {"x":66.667,"y":posCount*33.333+16.667,"w":33.333,"h":33.333, "c":true};
			} else if (mediaPool.length==4){
				customLayout[mediaPool[i].dataset.sid] = {"x":66.667,"y":posCount*33.333,"w":33.333,"h":33.333, "c":true};
			} else if (mediaPool.length==5){
				customLayout[mediaPool[i].dataset.sid] = {"x":75,"y":(posCount)*25,"w":25,"h":25, "c":true};
			} else if (mediaPool.length==6){
				if (posCount==0){
					customLayout[mediaPool[i].dataset.sid] = {"x":0,"y":0,"w":33.333,"h":33.333, "c":true};
				} else if (posCount==1){
					customLayout[mediaPool[i].dataset.sid] = {"x":33.333,"y":0,"w":33.333,"h":33.333, "c":true};
				} else {
					customLayout[mediaPool[i].dataset.sid] = {"x":66.667,"y":(posCount-2)*33.333,"w":33.333,"h":33.333, "c":true};
				}
			} else if (mediaPool.length>8){
				if (posCount==0){
					customLayout[mediaPool[i].dataset.sid] = {"x":0,"y":0,"w":20,"h":20, "c":true};
				} else if (posCount==1){
					customLayout[mediaPool[i].dataset.sid] = {"x":20,"y":0,"w":20,"h":20, "c":true};
				} else if (posCount==2){
					customLayout[mediaPool[i].dataset.sid] = {"x":40,"y":0,"w":20,"h":20, "c":true};
				} else if (posCount==3){
					customLayout[mediaPool[i].dataset.sid] = {"x":60,"y":0,"w":20,"h":20, "c":true};
				} else {
					customLayout[mediaPool[i].dataset.sid] = {"x":80,"y":(posCount-4)*20,"w":20,"h":20, "c":true};
				}
			} else if (mediaPool.length>=7){
				if (posCount==0){
					customLayout[mediaPool[i].dataset.sid] = {"x":0,"y":0,"w":25,"h":25, "c":true};
				} else if (posCount==1){
					customLayout[mediaPool[i].dataset.sid] = {"x":25,"y":0,"w":25,"h":25, "c":true};
				} else if (posCount==2){
					customLayout[mediaPool[i].dataset.sid] = {"x":50,"y":0,"w":25,"h":25, "c":true};
				} else {
					customLayout[mediaPool[i].dataset.sid] = {"x":75,"y":(posCount-3)*25,"w":25,"h":25, "c":true};
				}
			} else {
				customLayout[mediaPool[i].dataset.sid] = {"x":66.667,"y":posCount*33.333,"w":33.333,"h":33.333, "c":true};
			} 
			posCount+=1;
		}
	}
	
	try {
		if (!skip){
			var childNodes = playarea.childNodes;

			for (var n=0;n<childNodes.length;n++){
				if (childNodes[n].querySelector("video")){
					var vidtemp = childNodes[n].querySelector("video");
					var matched = false;
					for (var m=0;m<mediaPool.length;m++){
						if (vidtemp.id === mediaPool[m].id){
							vidtemp.alreadyAdded=true;
							mediaPool[m] = vidtemp;
							matched=true;
							childNodes[n].matched = true;
							break;
						}
					}
					
					if (!matched){
						vidtemp.isInvisible = false;
					}
				} else if (childNodes[n].querySelector("iframe")){
					var iftemp = childNodes[n].querySelector("iframe");
					for (var m=0;m<mediaPool.length;m++){
						if ((mediaPool[m].tagName.toLowerCase()==="iframe") && (mediaPool[m].src) && (iftemp.src === mediaPool[m].src)){
							iftemp.alreadyAdded=true;
							iftemp.id = mediaPool[m].id;
							if (session.directorList.indexOf(iftemp.dataset.UUID)==-1){
								iftemp.dataset.UUID = mediaPool[m].dataset.UUID;
								iftemp.dataset.sid = mediaPool[m].dataset.sid;
							}
							mediaPool[m] = iftemp;
							childNodes[n].matched = true;
							break;
						}
					}
				}
			}
			
			for (var n=0;n<childNodes.length;n++){
				if (!childNodes[n].matched){
					playarea.removeChild(childNodes[n]);
					n--;
				} else {
					childNodes[n].matched=null;
				}
			}	
		}
	} catch(e){errorlog(e);}
	
	
	if (session.videoElement && (session.videoElement.src || session.videoElement.srcObject)){ // fileshare or stream
		if ("playlist" in session.videoElement){
			playarea.appendChild(session.videoElement); // fileshare.
		} else if (session.videoElement.style.display!="none"){
			if (session.videoElement.srcObject && session.videoElement.srcObject.getVideoTracks().length){
				if (session.minipreview){
					var container = null;
					if (mpl===0 && session.minipreview===2){
						if (soloVideo!==true){
							mediaPool.push(session.videoElement);
							mpl = 1;
						}
					} else if (session.minipreview===3){
						if (soloVideo!==true){
							container = document.createElement("div");
							session.videoElement.container = container;
							container.style.top="-500px";
							container.style.left="-500px";
							container.style.width="1px";
							container.style.height="1px";
							//container.style.display = "flex";
							container.style.zIndex = "0";
							container.style.margin = "0";
							container.style.position="absolute";
							container.style.cursor = "pointer";
							container.style.border = "0";
							container.appendChild(session.videoElement);
							playarea.appendChild(container);
							
							/* var togglePreview = document.createElement("div");
							togglePreview.innerHTML = '<i class="las la la-eye-slash" style="color: white;float: right;position: relative;width: 0;height: 0;overflow: visible;right: 27px; top: 5px;font-size: 22px;"></i>';
							togglePreview.onclick = function(event){
								event.preventDefault();
								event.stopPropagation();
								container.querySelector("video").classList.toggle("hidden");
								return false;
							};
							playarea.appendChild(togglePreview); */
							
						}
					} else if (soloVideo!==true){
						if (document.getElementById("minipreview")){
							container = document.getElementById("minipreview");
						} else {
							container = document.createElement("div");
							var togglePreview = document.createElement("div");
	
							togglePreview.className = "togglePreview";
							try {
								container.style.top = "calc("+hi+"px + 2vh)";
								container.style.maxHeight = parseInt(getById("gridlayout").offsetHeight)+"px";
								togglePreview.style.top = "calc("+hi+"px + 2vh)";
								togglePreview.style.maxHeight = parseInt(getById("gridlayout").offsetHeight)+"px";
							} catch(e){
								container.style.top = hi+"px";
								togglePreview.style.top = hi+"px";
							}
							//
							if (miniPerformerY !== null){
								container.style.top = miniPerformerY + "%";
							}
							if (miniPerformerX !== null){
								container.style.left = miniPerformerX + "%";
							} else {
								container.style.right = "2vw";
								togglePreview.style.right = "2vw";
							}
							
							container.appendChild(session.videoElement);
							session.videoElement.container = container;
							playarea.appendChild(container);
							
							togglePreview.innerHTML = '<i class="las la la-eye-slash"></i><i class="las la la-eye"></i>';
							
							if (!session.previewToggleState){
								container.classList.toggle("hidden");
								togglePreview.classList.toggle("blinded");
							}
							playarea.appendChild(togglePreview);
							togglePreview.onclick = function(event){
								event.preventDefault();
								event.stopPropagation();
								container.classList.toggle("hidden");
								togglePreview.classList.toggle("blinded");
								session.previewToggleState!=session.previewToggleState;
								return false;
							};
							
							makeMiniDraggableElement(container);
							container.id = "minipreview";
						}
						
						container.style.width = "18%";
						//container.style.display = "flex";
						container.style.zIndex = "3";
						container.style.margin = "0";
						container.style.position ="absolute";
						container.style.cursor = "pointer";
						container.style.border = "2px #BBB solid";
						container.style.height = "block";
						
						applyMirror(session.mirrorExclude);
						
						
					} else if (soloVideo===true){
						if (document.getElementById("minipreview")){
							container = document.getElementById("minipreview");
							container.style.height = "100%";
							//container.style.transform = "block";
							//container.style.transformOrigin = "unset";
						}
					}
					if (session.ruleOfThirds){
						if (container && (container.id == "minipreview") && !container.svg){
							var svg = document.createElement("div");
							svg.innerHTML = '<svg viewBox="0 0 800 600"  preserveAspectRatio="none" style="width:100%;height:100%;"><g>\
							\
								  <line stroke-width="2" stroke-dasharray="5,5" stroke="#FFF1" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_1" y2="200" x2="799" y1="200" x1="1" fill="none"/>\
								  <line stroke="#FFF5" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_3" y2="616" x2="266" y1="1" x1="266" stroke-dasharray="5,5" stroke-width="2" fill="none"/>\
								  <line stroke-width="2" stroke-dasharray="5,5" stroke="#FFF1" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_4" y2="200" x2="799" y1="200" x1="1" fill="none"/>\
								  <line stroke="#FFF5" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_5" y2="616" x2="534" y1="1" x1="534" stroke-dasharray="5,5" stroke-width="2" fill="none"/>\
								   <line stroke-width="2" stroke-dasharray="5,5" stroke="#FFF1" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_1" y2="400" x2="799" y1="400" x1="1" fill="none"/>\
								   <line stroke-width="2" stroke-dasharray="5,5" stroke="#FFF1" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_4" y2="400" x2="799" y1="400" x1="1" fill="none"/>\
								 </g></svg>';
							svg.style.width = "100%";
							svg.style.height = "100%";
							svg.style.position= "absolute";
							svg.style.left = "0";
							svg.style.top = "0";
							container.svg = svg;
							container.appendChild(svg);
						}
						
					}
					container = null; // clear reference
				}
			} else if (session.streamSrc && !session.videoElement.srcObject){
				warnlog("THIS SHOULD NOT HAPPEN; 2067");
			}
		}
	}
	
	try{
		
		if (session.slots){
			var slotArray = [];
			mediaPool.forEach(vid=>{
				if (vid.slotBlank){
					vid.slotBlank=false;
					vid.slot=0;
				}
				
				if (("slot" in vid) && vid.slot){
					if (!slotArray.includes(parseInt(vid.slot))){
						slotArray.push(parseInt(vid.slot));
					} else {
						vid.slot=0;
						//mediaPool_invisible.push(vid);
						//var index = mediaPool.indexOf(vid);
						//if (index > -1) {
						//    mediaPool.splice(index, 1);
						//}
					}
				}
			})
			var slotCounter = 1;
			mediaPool.reverse()
			var j = mediaPool.length;
			while (j--){
				if (!("slot" in mediaPool[j]) || ( mediaPool[j].slot=="0") || !mediaPool[j].slot){
					while (slotArray.includes(slotCounter)){
						slotCounter+=1;
					}
					slotArray.push(slotCounter);
					mediaPool[j].slot = slotCounter;
					mediaPool[j].slotBlank = true;
				}
				if (!("slot" in  mediaPool[j]) || !parseInt(mediaPool[j].slot) || (mediaPool[j].slot=="0") || !mediaPool[j].slot || (session.slots<parseInt( mediaPool[j].slot))){
					mediaPool_invisible.push( mediaPool[j]);
					mediaPool.splice(j, 1);
				}
			}
			mediaPool.reverse()
		}
		
		mediaPool_invisible.forEach(vid=>{
			if (vid){
				try {
					vid.style.width = "0px";
					vid.style.height = "0px";
					vid.style.top = "0px";
					vid.style.left = "0px";
					vid.isInvisible = true;
					if (vid.alreadyAdded && vid.alreadyAdded==true){
						vid.alreadyAdded=false;
						return;
					} else if (vid.dataset.doNotMove){
						return;
					}
					playarea.appendChild(vid);
				} catch(e){errorlog(e);}
			}
		});
	} catch(e){errorlog(e);}
	
	var i=0;
	var offset = 0;
	
	var layout = false;
	if (customLayout || session.layout){
		layout = session.layout || customLayout;
				// if (null in layout){
					// for (var L=0;L<layout[null].length;L++){
						// var img = document.createElement('img');
						// img.src = layout[null][L].backgroundMedia
						// mediaPool.push(img);
					// }
				// }
	}
	
	mediaPool.forEach(vid=>{
		try {
			if (!vid || !("id" in vid)){
				errorlog(vid);
				return;
			}
			
			if (session.slots){
				if (("slot" in vid) && parseInt(vid.slot)){
					i = parseInt(vid.slot) - 1;
					if(i<0){return;}
				} else {
					return;
				}
			}
			
			var offsetx=0;
			if (i!==0){
				if (Math.ceil((i+0.01)/rw)==rh){
					if (mpl%rw){
						offsetx = Math.max(((rw - mpl%rw)*(window.innerWidth/rw))/2,0);
					}
				}
			}
			
			var cover = session.cover
			var borderOffset = session.border || 0;
			var videoMargin = session.videoMargin || 0;
			var borderRadius = session.borderRadius || 0;
			var borderColor = session.borderColor || "#000";
			var fadein = session.fadein || false;
			var backgroundMedia = session.defaultMedia || false;
			var animated = session.animatedMoves || 0;
			if (!borderOffset){
				borderColor = "#0000";
			}
			
			if (layout){
				if (!(vid.dataset.sid && (vid.dataset.sid in layout))){
					vid.isInvisible = true;
					if (vid.container){
						vid.container.style.display = "none";
					}
					if (vid.dataset.UUID){
						session.requestRateLimit(session.hiddenSceneViewBitrate, vid.dataset.UUID, false); // it's added already, so we know it needs sound.  But lets d
					}
					return;
				}
				if ("borderThickness" in layout[vid.dataset.sid]){
					borderOffset = layout[vid.dataset.sid].borderThickness || 0;
				}
				if ("animated" in layout[vid.dataset.sid]){
					animated = layout[vid.dataset.sid].animated || 0;
					if (animated===true){
						animated = session.animatedMoves || 50;
					}
				}
				if ("margin" in layout[vid.dataset.sid]){
					videoMargin = layout[vid.dataset.sid].margin || 0;
				}
				if ("rounded" in layout[vid.dataset.sid]){
					borderRadius = layout[vid.dataset.sid].rounded || 0;
				}
				if (layout[vid.dataset.sid].borderColor){
					borderColor = layout[vid.dataset.sid].borderColor;
				}
				if (layout[vid.dataset.sid].fadeIn){
					fadein = layout[vid.dataset.sid].fadeIn;
				}
				if ("backgroundMedia" in layout[vid.dataset.sid]){
					backgroundMedia = layout[vid.dataset.sid].backgroundMedia || false;
				}
			}
			
			var skipAnimation = false;
			if (vid.isInvisible){
				vid.isInvisible = false;
				skipAnimation = true;
				if (fadein){
					vid.classList.add("fadein");
					if (vid.holder){
						vid.holder.classList.add("fadein");
					}
				}
			}
			
			offsety = Math.max((h- Math.ceil(mpl/rw)*Math.ceil(h/rh))/2,0);
			
			if (vid.container){
				var container = vid.container;
				if (container.move){
					clearInterval(container.move);
					container.move = null;
				}
			} else {
				var container = document.createElement("div");
				vid.container = container;
			}
			container.style.position = "absolute";
			container.style.display = "block";
			
			// ANIMATED  - CONTAINER ; width/height/z-index/cover///////////////
			if (layout){
				var left = (window.innerWidth/100*layout[vid.dataset.sid].x) || 0;
				var top = (window.innerHeight/100*layout[vid.dataset.sid].y) || 0;
				var width = (window.innerWidth/100*layout[vid.dataset.sid].w) || 0;
				var height = (window.innerHeight/100*layout[vid.dataset.sid].h) || 0;
				if (layout[vid.dataset.sid].cover || layout[vid.dataset.sid].c){  // this should be true/false
					vid.style.objectFit = "cover";
					cover = true;
				} else {
					vid.style.objectFit = "contain"; // this should fall back to sessio.cover if no layout supplied
					cover = false;
				}
				container.style.zIndex = layout[vid.dataset.sid].zIndex || layout[vid.dataset.sid].z || 0;
				
			} else { 
				var left = Math.max(offsetx+Math.floor(((i%rw)+0)*w/rw),0); 
				var top = Math.max(offsety+Math.floor((Math.floor(i/rw)+0)*h/rh + hi),0);
				var width = Math.ceil(w/rw);
				var height = Math.ceil(h/rh);
				container.style.zIndex = 0;
			}
			
			if (cover){
				vid.style.objectFit = "cover";
			} else {
				vid.style.objectFit = "contain";
			}
				
			if (animated && !skipAnimation){
				container.tleft = left; 
				container.ttop = top;
				container.twidth = width;
				container.theight = height;
				
				container.move = setInterval(function(CCC){
					
					try{
						if (!CCC){return;}
						var ww = (parseInt(CCC.style.width) - CCC.twidth);
						var hh = (parseInt(CCC.style.height) - CCC.theight);
						var tt = (parseInt(CCC.style.top) - CCC.ttop);
						var ll = (parseInt(CCC.style.left) - CCC.tleft);
						
						if (Number.isNaN(ww)){
							CCC.style.width = CCC.twidth;
							CCC.style.height = CCC.theight;
							CCC.style.top = CCC.ttop;
							CCC.style.left = CCC.tleft;
							clearInterval(CCC.move);
							return;
						} else if (Number.isNaN(hh)){
							CCC.style.width = CCC.twidth;
							CCC.style.height = CCC.theight;
							CCC.style.top = CCC.ttop;
							CCC.style.left = CCC.tleft;
							clearInterval(CCC.move);
							return;
						} else if (Number.isNaN(tt)){
							CCC.style.width = CCC.twidth;
							CCC.style.height = CCC.theight;
							CCC.style.top = CCC.ttop;
							CCC.style.left = CCC.tleft;
							clearInterval(CCC.move);
							return;
						} else if (Number.isNaN(ll)){
							CCC.style.width = CCC.twidth;
							CCC.style.height = CCC.theight;
							CCC.style.top = CCC.ttop;
							CCC.style.left = CCC.tleft;
							clearInterval(CCC.move);
							return;
						}
						
						var speed = (150 / (201 - animated)) || 1.5;
						
						var skipRest = true;

						if (ww <=2 && (ww >=-2)){
							CCC.style.width = CCC.twidth+"px";
						} else {
							skipRest=false;
							CCC.style.width = parseInt((parseInt(CCC.style.width) - ww/speed))+"px";
						}

						if (hh <=2 && (hh >=-2)){
							CCC.style.height = CCC.theight+"px";
						} else {
							skipRest=false;
							CCC.style.height = parseInt((parseInt(CCC.style.height) - hh/speed))+"px";
						}

						if (tt <=2 && (tt >=-2)){
							CCC.style.top = CCC.ttop+"px";
						} else {
							skipRest=false;
							CCC.style.top = parseInt((parseInt(CCC.style.top) - tt/speed))+"px";
						}

						if (ll <=2 && (ll >=-2)){
							CCC.style.left = CCC.tleft+"px";
						} else {
							skipRest=false;
							CCC.style.left = parseInt((parseInt(CCC.style.left) - ll/speed))+"px";
						}

						if (skipRest){
							clearInterval(CCC.move);
							return;
						}
					} catch(e){errorlog(e);}
				}, 20, container);
			} else if (layout){ //////////////////  NOT ANIMATED - CONTAINER ; width/height/z-index/cover///////////////
				
				container.style.left = left+"px";
				container.style.top  = top+"px";
				container.style.width = width+"px";
				container.style.height = height+"px";
				
			} else {
				
				container.style.left = offsetx+Math.floor(((i%rw)+0)*w/rw)+"px";
				container.style.top  = offsety+Math.floor((Math.floor(i/rw)+0)*h/rh + hi)+"px";
				container.style.width = Math.ceil(w/rw)+"px";
				container.style.height = Math.ceil(h/rh)+"px";
				
			}
			 
			//try {
			if (vid.alreadyAdded && vid.alreadyAdded==true){
				if (!container.holder){
					var holder = document.createElement("div");
					container.holder = holder;
					holder.className = "holder";
					holder.dataset.holder = true;
					container.appendChild(holder);
					holder.appendChild(vid);
				}  else {
					var holder = container.holder;
				}
			} else if (vid.dataset.doNotMove){
				vid.style.position = "absolute";
				vid.style.left = left+"px";
				vid.style.top = top+"px";
				vid.style.width = width+"px";
				vid.style.height = height+"px";
				vid.style.display = "flex";
				i+=1;
				return;
			} else {
				playarea.appendChild(container);
				if (!container.holder){
					var holder = document.createElement("div");
					container.holder = holder;
					holder.className = "holder";
					holder.dataset.holder = true;
					holder.appendChild(vid);
					container.appendChild(holder);
				} else {
					var holder = container.holder;
					holder.prepend(vid);
				}
				
				vid.style.maxWidth = "100%";
				vid.style.maxHeight = "100%";
			}
			
			if (layout){
				var wrw = (window.innerWidth/100*layout[vid.dataset.sid].w)  || 0;
				var hrh = (window.innerHeight/100*layout[vid.dataset.sid].h)  || 0;
			} else {
				var wrw = (w/rw);
				var hrh = (h/rh);
			}
			
			vid.style.borderRadius = borderRadius+"px";
			holder.style.borderRadius = borderRadius+"px";
			
			holder.style.borderColor = borderColor;
			vid.style.borderColor = borderColor;
			holder.style.backgroundColor = borderColor;
			holder.style.borderWidth = borderOffset+"px";
			
			
			
			if (backgroundMedia){
				holder.style.backgroundImage = "url("+backgroundMedia+")";
				if (cover){
					holder.style.backgroundSize = "cover";
				} else {
					holder.style.backgroundSize = "contain";
				}
				holder.style.backgroundPosition = "center";
				holder.style.backgroundRepeat = "no-repeat";
			} else if (holder.style.backgroundImage){
				holder.style.backgroundImage = "block";
			}
			
			if (session.dynamicScale){
				if (vid.dataset.UUID){
					if (wrw && hrh){
						if (session.devicePixelRatio){
							session.requestResolution(vid.dataset.UUID, wrw * session.devicePixelRatio, hrh * session.devicePixelRatio);
						} else if (window.devicePixelRatio && parseInt(window.devicePixelRatio) > 1 ){
							session.requestResolution(vid.dataset.UUID, wrw*window.devicePixelRatio, hrh*window.devicePixelRatio);
						} else {
							session.requestResolution(vid.dataset.UUID, wrw, hrh);
						}
					}
				}
			}
			if (("rotated" in vid) && (vid.rotated!==false)){
				if (vid.rotated==90){
					vid.style.transform = "rotate(90deg)";
				} else if (vid.rotated==270){
					vid.style.transform = "rotate(270deg)";
				} else if (vid.rotated==180){
					vid.style.transform = "rotate(180deg)";
				} else if (!vid.rotated){
					vid.style.transform = "rotate(0deg)";
				}
			} 
			
			vid.style.width = "100%";
			vid.style.height = "100%";
			holder.style.position = "absolute";
			

			if (vid.classList.contains("paused")){
				if (holder.paused){
					holder.paused.className = "playButton";
				} else {
					var paused = document.createElement("span");
					paused.id = "paused_"+vid.dataset.UUID;
					paused.className = "playButton";
					paused.dataset.UUID = vid.dataset.UUID;
					paused.onclick = function(){unPauseVideo(vid);};
					holder.paused = paused;
					holder.appendChild(paused);
				}
			} else if (holder.paused){
				holder.paused.className = "hidden";
			}
			
			if ((vid.videoWidth && vid.videoHeight) || (vid.width && vid.height)){
				if (("rotated" in vid) && ((vid.rotated==90) || (vid.rotated==270))){
					if (vid.videoWidth && vid.videoHeight){
						var vvw = parseInt(vid.videoHeight);
						var vvh = parseInt(vid.videoWidth);
					} else {
						var vvw = parseInt(vid.height);
						var vvh = parseInt(vid.width);
					}
					
					vid.style.objectFit = "cover"; //contain;
					vid.style.overflow = "unset"; //contain;
					vid.style.maxWidth = "unset";
					vid.style.maxHeight = "unset";
				} else {
					if (vid.videoWidth && vid.videoHeight){
						var vvw = parseInt(vid.videoWidth);
						var vvh = parseInt(vid.videoHeight);
					} else {
						var vvw = parseInt(vid.width);
						var vvh = parseInt(vid.height);
					}
				}
				
				
				var asw = wrw/vvw;  // (window.innerWidth/ N)  /  vid.videoHeight;
				var ash = hrh/vvh;
				
				
				if (asw < ash){
					var hsw = wrw   - videoMargin*2;
					var hsh = hsw/(vvw/vvh) + borderOffset*2 - borderOffset*2/(vvw/vvh);
					var hsl = videoMargin;
					var hst = (hrh - hsh - videoMargin - borderOffset)/2 + videoMargin;
					
				} else {
					var hsh = hrh - videoMargin*2 ;;
					var hsw = hsh*vvw/vvh + borderOffset*2 - borderOffset*2*(vvw/vvh);
					var hsl = (wrw - hsw - videoMargin - borderOffset)/2;
					var hst = videoMargin;
				}
				
				holder.style.left = Math.floor(hsl )+ "px"; // this needs to be replaced with padding.  This means testing with rotation = 90
				holder.style.top = Math.floor(hst)+ "px";
				holder.style.width = Math.ceil(hsw) + 'px';
				holder.style.height = Math.ceil(hsh) + 'px';
				//holder.style.padding = videoMargin + "px";
				
				if (("rotated" in vid) && ((vid.rotated==90) || (vid.rotated==270))){
					vid.style.width = Math.ceil(wrw - borderOffset*2) + "px";
					vid.style.height = Math.ceil(hsw - borderOffset*2) + "px";
					
					
					if (ChromeVersion && ChromeVersion<77){
						if (!animated && (parseInt(container.style.width)>parseInt(holder.style.height))){
							vid.style.position = "relative";
							vid.style.objectFit = "contain"; //contain;
						} else if (animated && (container.twidth && (parseInt(container.twidth)>parseInt(holder.style.height)))){
							vid.style.position = "relative";
							vid.style.objectFit = "contain"; //contain;
						} 
					} else {
						vid.style.position = "relative";
					}
					vid.style.left =  0;
					if (cover){
						holder.style.left = borderOffset + "px";
						holder.style.top = borderOffset + "px";
						holder.style.height = "calc(100% - "+(videoMargin+borderOffset)+"px)";
						holder.style.width = "calc(100% - "+(videoMargin+borderOffset)+"px)";
						
						vid.style.width = (height - (borderOffset + videoMargin)*2) + "px";
						vid.style.height = (width - (borderOffset + videoMargin)*2) + "px";
						
						vid.style.left =  0;
						vid.style.top =   0;
					}
				} else if (cover){
					holder.style.left = borderOffset + videoMargin + "px";
					holder.style.top = borderOffset + videoMargin +"px";
					holder.style.height = "calc(100% - "+(videoMargin*2+borderOffset)+"px)";
					holder.style.width = "calc(100% - "+(videoMargin*2+borderOffset)+"px)";
					vid.style.width = "100%";
					vid.style.height = "100%";
					vid.style.left =  0;
					vid.style.top =   0;
				}
				
			} else {
				holder.style.left = (videoMargin) + "px";
				holder.style.top = (videoMargin) + "px";
				holder.style.height = "calc(100% - "+(videoMargin*2)+"px)";
				holder.style.width = "calc(100% - "+(videoMargin*2)+"px)";
			}
			
			if (vid.dataset.UUID && session.rpcs[vid.dataset.UUID] && ("label" in session.rpcs[vid.dataset.UUID]) && (session.rpcs[vid.dataset.UUID].label !== false) && (session.showlabels===true)){  // remote source
				
				if (container && container.move && container.twidth && container.theight && animated){
					var vidwidth = container.twidth;
					var vidheight = container.theight ;
				} else {
					var vidwidth = vid.offsetWidth;
					var vidheight = vid.offsetHeight;
				}
				
				var fontsize = (vidwidth + vidheight)*0.03;
				if ((vidwidth/16)>=(vidheight/9)){
					var voar = (vidwidth/16)/(vidheight/9);
				} else {
					var voar = (vidheight/9)/(vidwidth/16);
				}
				voar = Math.pow(voar,0.5);
				fontsize = fontsize/voar;
				// creates a video label holder inside the recently created label holder
				if (holder.label){
					var label = holder.label;
				} else {
					var label = document.createElement("span");
					holder.label = label;
					if (session.labelstyle){
						label.className = 'video-label '+session.labelstyle;
					} else {
						label.className = 'video-label';
					}
					holder.appendChild(label);
				}
				if (fontsize){
					if (session.labelsize){
						fontsize = fontsize*session.labelsize/100;
					}
					label.style.fontSize = parseInt(fontsize)+"px";
				}
				label.innerText = session.rpcs[vid.dataset.UUID].label;
				
			} else if ((session.showlabels===true) &&  (vid.id === "videosource") && (session.label)){  // local source
				// creates a label holder that's the same size of the vid element.
				
				if (container && container.move && container.twidth && container.theight && animated){
					var vidwidth = container.twidth;
					var vidheight = container.theight ;
				} else {
					var vidwidth = vid.offsetWidth;
					var vidheight = vid.offsetHeight;
				}
				
				var fontsize = (vidwidth + vidheight)*0.03;
				if ((vidwidth/16)>=(vidheight/9)){
					var voar = (vidwidth/16)/(vidheight/9);
				} else {
					var voar = (vidheight/9)/(vidwidth/16);
				}
				voar = Math.pow(voar,0.5);
				fontsize = fontsize/voar;
				
				if (holder.label){
					var label = holder.label;
				} else {
					var label = document.createElement("span");
					holder.label = label;
					if (session.labelstyle){
						label.className = 'video-label '+session.labelstyle;
					} else {
						label.className = 'video-label';
					}
					holder.appendChild(label);
				}
				if (fontsize){
					if (session.labelsize){
						fontsize = fontsize*session.labelsize/100;
					}
					label.style.fontSize = parseInt(fontsize)+"px";
				}
				
				label.innerText = sanitizeLabel(session.label);//.replace(/[\W]+/g,"_").replace(/_+/g, ' ');
				holder.appendChild(label);
			}
			
			if (vid.dataset.UUID && session.rpcs[vid.dataset.UUID]){
				if (session.rpcs[vid.dataset.UUID].voiceMeter){
					holder.appendChild(session.rpcs[vid.dataset.UUID].voiceMeter);
				}
				if (session.rpcs[vid.dataset.UUID].remoteMuteElement){
					holder.appendChild(session.rpcs[vid.dataset.UUID].remoteMuteElement);
				}
			}
			
			if (session.signalMeter){
				if (vid.dataset.UUID && !session.rpcs[vid.dataset.UUID].signalMeter){
					session.rpcs[vid.dataset.UUID].signalMeter = getById("signalMeterTemplate").cloneNode(true);
					session.rpcs[vid.dataset.UUID].signalMeter.classList.remove("hidden");
					session.rpcs[vid.dataset.UUID].signalMeter.id = "signalMeter_" + vid.dataset.UUID;
					session.rpcs[vid.dataset.UUID].signalMeter.dataset.level = 0;
					session.rpcs[vid.dataset.UUID].signalMeter.title = miscTranslations["signal-meter"];
					holder.appendChild(session.rpcs[vid.dataset.UUID].signalMeter);
					holder.signalMeter = session.rpcs[vid.dataset.UUID].signalMeter;
				} else if (vid.dataset.UUID && session.rpcs[vid.dataset.UUID].signalMeter){
					if (!holder.signalMeter){
						holder.appendChild(session.rpcs[vid.dataset.UUID].signalMeter);
						holder.signalMeter = session.rpcs[vid.dataset.UUID].signalMeter;
					}
				}
			}
			
			if (session.ruleOfThirds){
				if (vid.id == "videosource"){
					if (!holder.svg){
						var svg = document.createElement("div");
						svg.innerHTML = '<svg viewBox="0 0 800 600"  preserveAspectRatio="none" style="width:100%;height:100%;"><g>\
						\
							  <line stroke-width="2" stroke-dasharray="5,5" stroke="#FFF1" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_1" y2="200" x2="799" y1="200" x1="1" fill="none"/>\
							  <line stroke="#FFF5" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_3" y2="616" x2="266" y1="1" x1="266" stroke-dasharray="5,5" stroke-width="2" fill="none"/>\
							  <line stroke-width="2" stroke-dasharray="5,5" stroke="#FFF1" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_4" y2="200" x2="799" y1="200" x1="1" fill="none"/>\
							  <line stroke="#FFF5" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_5" y2="616" x2="534" y1="1" x1="534" stroke-dasharray="5,5" stroke-width="2" fill="none"/>\
							   <line stroke-width="2" stroke-dasharray="5,5" stroke="#FFF1" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_1" y2="400" x2="799" y1="400" x1="1" fill="none"/>\
							   <line stroke-width="2" stroke-dasharray="5,5" stroke="#FFF1" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_4" y2="400" x2="799" y1="400" x1="1" fill="none"/>\
							 </g></svg>';
						svg.style.width = "100%";
						svg.style.height = "100%";
						svg.style.position= "absolute";
						svg.style.left = "0";
						svg.style.top = "0";
						holder.svg = svg;
						holder.appendChild(svg);
					}
				}
			}
			
			try {
				if (!(session.cleanOutput && session.cleanish==false)){
					if (session.firstPlayTriggered===false){ // don't play unless needed; might cause clicking or who knows what else.
						warnlog("VIDEO IS NOT PLAYING");
						if (vid.tagName.toLowerCase()=="video"){ // we don't want to try playing an Iframe or Canvas.
							var playPromise = vid.play();
							if (playPromise !== undefined){
								playPromise.then(_ => {
									// playing
									session.firstPlayTriggered=true; // global tracking. "user gesture obtained", so no longer needed if playing.
								}).catch((err)=>{
									
									var bigPlayButton = document.getElementById("bigPlayButton");
									if (bigPlayButton){
										bigPlayButton.innerHTML = '<span class="playButton"></span>';
										bigPlayButton.style.display="block";
									}
								});
							} else {
								session.firstPlayTriggered=true; // well, I don't know if it's playing, and so whatever. fail gracefully.
							}
						}
					}
				}
			} catch(e) {
				var bigPlayButton = document.getElementById("bigPlayButton");
				if (bigPlayButton){
					bigPlayButton.parentNode.removeChild(bigPlayButton);
				}
						
			}
			
			if (vid.tagName.toLowerCase()=="iframe"){ // I need to add this back in at some point.
				i+=1;
				return;
			}
			
			if (!session.cleanOutput && !session.nocursor){
				if ((session.roomid!==false) && (session.scene===false)){
					if (!((vid.id === "videosource") && (session.minipreview))){
						
						if (!holder.button){
							var button = document.createElement("div");
							holder.button = button;
							holder.appendChild(button);
						} else {
							var button = holder.button;
						}
						
						button.id = "button_"+vid.id;
						button.dataset.button = true;
						if (soloVideo){
							button.innerHTML = "<img src='./media/sd.svg' style='user-select: none;background-color:#0007;width:4vh' aria-hidden='true' />";
							button.title = "Show all active videos togethers";
							button.style.visibility = "visible";
						} else if (mpl>1){
							button.innerHTML = "<img src='./media/hd.svg' style='user-select: none;background-color:#0007;width:4vh' aria-hidden='true' />";
							button.title = "Enlarge video and increase its clarity";
							button.style.visibility = "visible";
						} else {
							button.style.visibility = "hidden";
						}
						button.style.transition = "opacity 0.3s"
						button.style.width ="4vh";
						button.style.height = "4vh";
						button.style.maxWidth ="30px";
						button.style.maxHeight = "30px";
						button.style.minWidth ="15px";
						button.style.minHeight = "15px";
						button.style.position = "absolute";
						button.style.display="none";
						//button.style.opacity="10%";
						button.style.zIndex="6";
						button.style.right = "4vh";//(Math.ceil(w/rw) -30 - 30 + offsetx+Math.floor(((i%rw)+0)*w/rw))+"px";
						button.style.top  = "4vh";//(  offsety + 30 + Math.floor((Math.floor(i/rw)+0)*h/rh + hi))+"px";
						button.style.color = "white";
						button.style.cursor = "pointer";
						
						if (vid.id == "videosource"){
							button.onclick = function(event){
								if (session.infocus === true){
									session.infocus = false;
								} else {
									session.infocus = true;
								}
								setTimeout(()=>updateMixer(),10);
							};
							
						} else {
							button.dataset.UUID = vid.dataset.UUID;
							button.onclick = function(event){
								var target =  event.currentTarget;
								if (session.infocus === target.dataset.UUID){
									//target.childNodes[0].className = 'las la-arrows-alt';
									session.infocus = false;
								} else {
									//target.childNodes[0].className = 'las la-compress';
									session.infocus = target.dataset.UUID;
									//log("session:"+target.dataset.UUID);
								}
								setTimeout(()=>updateMixer(),10);
							};
							
						}
						vid.onclick = function(event){
							if (session.disableMouseEvents){return;}
							button.style.display="block";
							container.style.backgroundColor= "#4444";
							button.style.opacity="100%";
						};
						button.onmouseenter = function(event){
							if (session.disableMouseEvents){return;}
							button.style.display="block";
							container.style.backgroundColor= "#4444";
							setTimeout(function(button){button.style.opacity="100%";},0,button);
							
						};
						container.onmouseenter = function(event){
							if (session.disableMouseEvents){return;}
							button.style.display="block";
							container.style.backgroundColor= "#4444";
							setTimeout(function(button){button.style.opacity="100%";},0,button);
						};
						container.onmouseleave = function(event){
							if (session.disableMouseEvents){return;}
							button.style.display="none";
							container.style.backgroundColor= null;
							button.style.opacity="10%";
						};
					} else if ((vid.id === "videosource") && session.minipreview && soloVideo==true){
						
						if (!holder.button){
							var button = document.createElement("div");
							holder.button = button;
							holder.appendChild(button);
						} else {
							var button = holder.button;
						}
						
						button.id = "button_videosource";
						button.dataset.button = true;
						if (soloVideo){
							button.innerHTML = "<img src='./media/sd.svg' style='background-color:#0007;width:4vh' aria-hidden='true' />";
							button.title = "Show all active videos togethers";
							button.style.display="unset";
						} else {
							button.style.visibility = "hidden";
							button.style.display="none";
						}
						button.style.transition = "opacity 0.3s"
						button.style.width ="4vh";
						button.style.height = "4vh";
						button.style.maxWidth ="30px";
						button.style.maxHeight = "30px";
						button.style.minWidth ="15px";
						button.style.minHeight = "15px";
						button.style.position = "absolute";
						button.style.zIndex="6";
						button.style.right = "4vh";//(Math.ceil(w/rw) -30 - 30 + offsetx+Math.floor(((i%rw)+0)*w/rw))+"px";
						button.style.top  = "4vh";//(  offsety + 30 + Math.floor((Math.floor(i/rw)+0)*h/rh + hi))+"px";
						button.style.color = "white";
						button.style.cursor = "pointer";
						
						button.onclick = function(event){
							event.stopPropagation();
							event.preventDefault();
							if (!session.infocus){return;}
							
							if (session.infocus === true){
								session.infocus = false;
								setTimeout(()=>updateMixer(),10);
							}
							
						};
						
					}
				}
			}
			i+=1;
		} catch(err){errorlog(err);}
	});
	updateUserList()
}


var translationBacklog = [];

function miniTranslate(ele, ident = false, direct=false) {
	
	if (!translation){
		translationBacklog.push([ele,ident]);
		log('Translation backlogged');
		if (!direct || !ident){
			return;
		}
	}
	
	if (ident){
		if (direct){
			if (ele.querySelector('[data-translate]')){
				ele.querySelector('[data-translate]').innerHTML = direct;
				ele.querySelector('[data-translate]').dataset.translate = ident;
			} else {
				ele.innerHTML = direct;
			}
			return;
		} else if (ident in translation.innerHTML){
			if (ele.querySelector('[data-translate]')){
				ele.querySelector('[data-translate]').innerHTML = translation.innerHTML[ident];
				ele.querySelector('[data-translate]').dataset.translate = ident;
			} else {
				ele.innerHTML = translation.innerHTML[ident];
			}
			return;
		} else {
			warnlog(ident + ": not found in translation file");
		}
	}
	
	var allItems = ele.querySelectorAll('[data-translate]');
	allItems.forEach(function(ele) {
		if (ele.dataset.translate in translation.innerHTML) {
			ele.innerHTML = translation.innerHTML[ele.dataset.translate];
		} else if (ele.dataset.translate in translation.miscellaneous) {
			ele.innerHTML = translation.miscellaneous[ele.dataset.translate];
		}
	});
	var allTitles = ele.querySelectorAll('[title]');
	allTitles.forEach(function(ele) {
		var key = ele.title.replace(/[\W]+/g, "-").toLowerCase();
		if (key in translation.titles) {
			ele.title = translation.titles[key];
		}
	});
	var allPlaceholders = ele.querySelectorAll('[placeholder]');
	allPlaceholders.forEach(function(ele) {
		var key = ele.placeholder.replace(/[\W]+/g, "-").toLowerCase();
		if (key in translation.placeholders) {
			ele.placeholder = translation.placeholders[key];
		}
	});
	
	//Object.keys(miscTranslations).forEach(key => {
	//	if (key in translation.miscellaneous) {
	//		miscTranslations[key] = translation.miscellaneous[key];
	//	}
	//});
	///
}

var controlBarTimeout = null;
function showControl(e){
	if (controlBarTimeout){
		clearTimeout(controlBarTimeout);
	}
	getById("controlButtons").classList.remove("fadeout");
	controlBarTimeout = setTimeout(function(){
		getById("controlButtons").classList.add("fadeout");
	}, 5000);
}

function changeLg(lang) {
	log("changeLg: "+lang);
	fetch("./translations/" + lang + '.json').then(function(response) {
		try{
			if (response.status !== 200) {
				logerror('Language translation file not found.' + response.status);
				getById("mainmenu").style.opacity = 1;
				return;
			}
			response.json().then(function(data) {
				translation = data; // translation.innerHTML[ele.dataset.translate]
				var trans = data.innerHTML;
				var allItems = document.querySelectorAll('[data-translate]');
				allItems.forEach(function(ele) {
					if (ele.dataset.translate in trans) {
						ele.innerHTML = trans[ele.dataset.translate];
					}
				});
				trans = data.titles;
				var allTitles = document.querySelectorAll('[title]');
				allTitles.forEach(function(ele) {
					var key = ele.title.replace(/[\W]+/g, "-").toLowerCase();
					if (key in trans) {
						ele.title = trans[key];
					}
				});
				trans = data.placeholders;
				var allPlaceholders = document.querySelectorAll('[placeholder]');
				allPlaceholders.forEach(function(ele) {
					var key = ele.placeholder.replace(/[\W]+/g, "-").toLowerCase();
					if (key in trans) {
						ele.placeholder = trans[key];
					}
				});
				if ("miscellaneous" in data){
					trans = data.miscellaneous;
					Object.keys(miscTranslations).forEach(key => {
						if (key in trans) {
							miscTranslations[key] = trans[key];
						}
					});
				}
				if (translationBacklog.length){
					for (var i=0;i<translationBacklog.length;i++){
						try{
							miniTranslate(translationBacklog[i][0], translationBacklog[i][1]);
						}catch(e){}
					}
					translationBacklog=[];
				}
				
				getById("mainmenu").style.opacity = 1;
			});
		} catch(e){
			getById("mainmenu").style.opacity = 1;
		}
	}).catch(function(err) {
		errorlog(err);
	});
}

var loadedQRCode = false;
function loadQR(){
	if (loadedQRCode==false){
		loadedQRCode=true;
		var script = document.createElement('script');
		script.src = "./thirdparty/qrcode.min.js"; // dynamically load this only if its needed. Keeps loading time down.
		document.head.appendChild(script);
	}
}

var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
eventer(messageEvent, function(e) { // this listens for child IFRAMES.
	try {
		if (e.origin == "https://www.youtube.com"){
			processYoutubeEvent(e);
		} else if ((e.data) && (typeof e.data == "object") && ("action" in e.data)) {
			if (e.data.action == "screen-share-ended") { 
				if (session.screenShareElement) {
					if (e.source == session.screenShareElement.contentWindow) { // reject messages send from other iframes
						warnlog(e);
						postMessageIframe(session.screenShareElement, {"close": true});
						session.screenShareElement.parentNode.removeChild(session.screenShareElement);
						session.screenShareElement = false;
					
						updateMixer();
						getById("screenshare2button").classList.add("float");
						getById("screenshare2button").classList.remove("float2");
					}
				}
			} else if (e.data.action == "video-loaded") {
				// TODO: if (e.source == session...iframeEle.contentWindow) {
				warnlog(e);
				toggleSpeakerMute(true);
				updateMixer(); // harmless to let run.
			}
		} 
	} catch(e){errorlog(e);}
});


function requestKeyframeScene(ele) {
	var UUID = ele.dataset.UUID;
	if (ele.dataset.value == 1) {
	} else {
		ele.dataset.value = 1;
		ele.classList.add("pressed");
		session.requestKeyframe(UUID, true);
		setTimeout(function(el){
			el.dataset.value = 0;
			el.classList.remove("pressed");
		}, 1000, ele)
	}
}

function pokeIframeAPI(action, value = null, UUID = null) {
	if (!isIFrame){return;}
	log("poke iframe");
	try {
		var data = {};

		data.action = action;

		if (value !== null) {
			data.value = value;
		}
		if (UUID !== null) {
			data.UUID = UUID;
		}
		
		var SID = null;
		if (UUID && (UUID in session.rpcs)){
			if (session.rpcs[UUID].streamID){
				SID = session.rpcs[UUID].streamID;
			}
		}
		if (!SID){
			if (UUID && (UUID in session.pcs)){
				if (session.pcs[UUID].streamID){
					SID = session.pcs[UUID].streamID;
				}
			}
		}
		if (UUID){
			data.streamID = SID;
		}
		
		if (isIFrame) {
			parent.postMessage(data, "*");
		}
	} catch (e) {
		errorlog(e);
	}
}

async function jumptoroom2() {

	var arr = window.location.href.split('?');
	
	var roomname = getById("videoname1").value;
	roomname = sanitizeRoomName(roomname);
	if (roomname.length) {

		var pass = getById("passwordRoom").value;
		pass = sanitizePassword(pass);
		
		var passStr = "";
		if (pass && pass.length) {
			passStr = "&password=" + pass;
		}
		
		if (arr.length > 1 && arr[1] !== '') {
			window.location += "&room=" + roomname + passStr + "&host";
		} else {
			window.location += "?room=" + roomname + passStr + "&host";
		}
	} else {
		getById("videoname1").focus();
		getById("videoname1").classList.remove("shake");
		setTimeout(function(){getById("videoname1").classList.add("shake");},10);
	}
}


async function jumptoroom(event = null) {

	if (event) {
		if (event.which !== 13) {
			return;
		}
	}

	var arr = window.location.href.split('?');
	var roomname = getById("joinroomID").value;
	roomname = sanitizeRoomName(roomname);
	if (roomname.length) {

		var passStr = "";
		window.focus();
		var pass = await promptAlt("Enter a password if provided, otherwise just click Cancel", false, true); //sanitizePassword(session.password);
		if (pass && pass.length) {
			session.password = sanitizePassword(pass);
			passStr = "&password=" + session.password;
		} else {
			session.password = false;
		}

		if (arr.length > 1 && arr[1] !== '') {
			window.location += "&room=" + roomname + passStr;
		} else {
			window.location += "?room=" + roomname + passStr;
		}
	} else {
		getById("joinroomID").focus();
		getById("joinroomID").classList.remove("shake");
		setTimeout(function(){getById("joinroomID").classList.add("shake");},10);
	}
}

function sleep(ms = 0) {
	return new Promise(r => setTimeout(r, ms)); // LOLz!
}


async function changeAvatarImage(ev, ele, set=false){
	log("changeAvatarImage() triggered");
	
	if (session.avatar && session.avatar.timer){
		clearInterval(session.avatar.timer);
	}
	
	if (ele.files && ele.files.length) {
		session.avatar = document.querySelector('img');
		session.avatar.ready=false;
		session.avatar.onload = () => {
			URL.revokeObjectURL(session.avatar.src);  // no longer needed, free memory
			session.avatar.ready=true;
			getById("noAvatarSelected3").classList.remove("selected");
			getById("noAvatarSelected").classList.remove("selected");
			getById("defaultAvatar1").classList.add("selected");
			getById("defaultAvatar2").classList.add("selected");
			
			var tracks = session.streamSrc.getVideoTracks();
			if (!tracks.length || session.videoMuted){
				updateRenderOutpipe();
			}
			
		}
		
		session.avatar.src = URL.createObjectURL(ele.files[0]); // set src to blob url
		return;
	} else if (ele.tagName.toLowerCase() == "img"){
		session.avatar = ele
		session.avatar.ready=true;
		getById("noAvatarSelected3").classList.remove("selected");
		getById("noAvatarSelected").classList.remove("selected");
		getById("defaultAvatar1").classList.add("selected");
		getById("defaultAvatar2").classList.add("selected");
	} else {
		session.avatar = false;
		
		var tracks = session.streamSrc.getVideoTracks();
		if (!tracks.length || session.videoMuted){
			var msg = {};
			msg.videoMuted = true;
			session.sendMessage(msg);
			if (document.getElementById("videosource")){
				document.getElementById("videosource").load();
			} else if (document.getElementById('previewWebcam')) {
				document.getElementById("previewWebcam").load();
			}
		}
		
		getById("noAvatarSelected3").classList.add("selected");
		getById("noAvatarSelected").classList.add("selected");
		getById("defaultAvatar1").classList.remove("selected");
		getById("defaultAvatar2").classList.remove("selected");
	}
	
	var tracks = session.streamSrc.getVideoTracks();
	if (!tracks.length || session.videoMuted){
		updateRenderOutpipe();
	}
	
}

function setAvatarImage(tracks){
	if (session.avatar && session.avatar.ready){
		if (session.avatar && session.avatar.timer){
			clearInterval(session.avatar.timer);
		}
		setupCanvas();
		
		var width = 512;
		var height = 288;
		
		var maxW = 1280;
		var maxH = 720;
		if (session.quality == 0){
			maxW = 1920;
			maxH = 1080;
		} else if (session.quality == 2){
			maxW = 640;
			maxH = 360;
		}
		
		if (session.width){
			maxW = session.width;
		}
		if (session.height){
			maxH = session.height;
		}
		
		if (session.avatar.naturalHeight && session.avatar.naturalHeight>maxH){
			height = parseInt(session.avatar.naturalHeight/session.avatar.naturalWidth*maxW);
			height = maxH;
		} else if (session.avatar.naturalWidth && session.avatar.naturalWidth>maxW){
			width = maxW;
			height = parseInt(session.avatar.naturalWidth/session.avatar.naturalHeight*maxH);
		} else {
			width = session.avatar.naturalWidth;
			height = session.avatar.naturalHeight;
		}
		
		session.canvas.width = width;
		session.canvas.height = height;
		session.canvasSource.width = width;
		session.canvasSource.height = height;
		
		session.avatar.timer = setInterval(function(){
			log("drawing");
			session.canvasCtx.drawImage(session.avatar, 0, 0, session.canvas.width, session.canvas.height);
		},500);
		
		applyMirror(true);
		
		session.avatar.tracks = session.canvas.captureStream().getVideoTracks();
		return session.avatar.tracks;
	}
	applyMirror(session.mirrorExclude);
	return tracks;
}

//////////  Canvas Effects  ///////////////

function drawFrameMirrored(mirror=true, flip=false) {
	session.canvasCtx.save();
	if (flip){
		if (mirror){
			session.canvasCtx.scale(-1, -1);
			session.canvasCtx.drawImage(session.canvasSource, 0, 0, session.canvas.width * -1, session.canvas.height* -1);
		} else {
			session.canvasCtx.scale(1, -1);
			session.canvasCtx.drawImage(session.canvasSource, 0, 0, session.canvas.width, session.canvas.height* -1);
		}
	} else if (mirror){
		session.canvasCtx.scale(-1, 1);
		session.canvasCtx.drawImage(session.canvasSource, 0, 0, session.canvas.width * -1, session.canvas.height);
	} else {
		session.canvasCtx.drawImage(session.canvasSource, 0, 0, session.canvas.width, session.canvas.height);
	}
	session.canvasCtx.restore();
}

function setupCanvas() {
	log("SETUP CANVAS");
	if (session.canvas === null) {
		session.canvas = document.createElement("canvas");
		session.canvas.width = 512;
		session.canvas.height = 288;
		session.canvasCtx = session.canvas.getContext('2d', {alpha: session.alpha, desynchronized: true});
		//session.canvasCtx.width=288;
		//session.canvasCtx.height=720;
		session.canvasCtx.fillStyle = "blue";
		session.canvasCtx.fillRect(0, 0, 512, 288);
		session.canvasSource = createVideoElement();
		session.canvasSource.width=512;
		session.canvasSource.height=288;
		session.canvasSource.autoplay = true;
		session.canvasSource.srcObject = createMediaStream();
		session.canvasSource.id = "effectsVideoSource";
		
		if (iOS || iPad){
			session.canvasSource.style.position = "absolute";
			session.canvasSource.style.left = "0";
			session.canvasSource.style.top ="0";
			session.canvasSource.controls = session.showControls || false;
			session.canvasSource.style.maxWidth = "1px";
			session.canvasSource.style.maxHeight = "1px";
			session.canvasSource.setAttribute("playsinline","");
			document.body.appendChild(session.canvasSource);
			//session.canvasSource.play();
		}
	} else {
		session.canvasSource.srcObject.getVideoTracks().forEach(function(trk) {
			session.canvasSource.srcObject.removeTrack(trk);
		});
	}
}

function applyEffects(track) { // video only please. do not touch audio.  Run update Render Outpipe () instead of this directly.
	log("applyEffects()");
	
	if (session.effects == "0" || !session.effects) { // auto align face
		return track;
	} else if (session.effects == "1") { // auto align face
		setupCanvas();
		session.canvasSource.srcObject.addTrack(track);
		session.canvasSource.width = track.getSettings().width || 1280;
		session.canvasSource.height = track.getSettings().height || 720;
		session.canvas.width = track.getSettings().width || 1280;
		session.canvas.height = track.getSettings().height || 720;
		
		setTimeout(function(){drawFace();},10);
	} else if (session.effects == "2") {  // mirror video at a canvas level
		setupCanvas();
		
		session.canvasSource.srcObject.addTrack(track);
		
		session.canvasSource.width = track.getSettings().width || 1280;
		session.canvasSource.height = track.getSettings().height || 720;
		session.canvas.width = track.getSettings().width || 1280;
		session.canvas.height = track.getSettings().height || 720;
		
		var drawRate = parseInt(1000 / track.getSettings().frameRate) + 1;
		if (session.canvasInterval !== null) {
			clearInterval(session.canvasInterval);
		}
		session.canvasInterval = setInterval(function() {
			drawFrameMirrored(true, false);
		}, drawRate);
	} else if (session.effects == "-1") {  // mirror and flip video at a canvas level
		setupCanvas();
		
		session.canvasSource.srcObject.addTrack(track);
		
		session.canvasSource.width = track.getSettings().width || 1280;
		session.canvasSource.height = track.getSettings().height || 720;
		session.canvas.width = track.getSettings().width || 1280;
		session.canvas.height = track.getSettings().height || 720;
		
		var drawRate = parseInt(1000 / track.getSettings().frameRate) + 1;
		if (session.canvasInterval !== null) {
			clearInterval(session.canvasInterval);
		}
		session.canvasInterval = setInterval(function() {
			drawFrameMirrored(false, true);
		}, drawRate);
	} else if (session.effects == "-2") {  // mirror and flip video at a canvas level
		setupCanvas();
		
		session.canvasSource.srcObject.addTrack(track);
		
		session.canvasSource.width = track.getSettings().width || 1280;
		session.canvasSource.height = track.getSettings().height || 720;
		session.canvas.width = track.getSettings().width || 1280;
		session.canvas.height = track.getSettings().height || 720;
		
		var drawRate = parseInt(1000 / track.getSettings().frameRate) + 1;
		if (session.canvasInterval !== null) {
			clearInterval(session.canvasInterval);
		}
		session.canvasInterval = setInterval(function() {
			drawFrameMirrored(true, true);
		}, drawRate);
	} else if ((session.effects == "3") || (session.effects == "4") || (session.effects == "5")){   // blur & greenscreen (low and high)
		setupCanvas();
		
		session.canvasSource.srcObject.addTrack(track);
		
		session.canvasSource.width = track.getSettings().width || 1280;
		session.canvasSource.height = track.getSettings().height || 720;
		session.canvas.width = track.getSettings().width || 1280;
		session.canvas.height = track.getSettings().height || 720;
		TFLiteWorker();
	} else if (session.effects == "6"){
		setupCanvas();
		
		session.canvasSource.srcObject.addTrack(track);
		
		session.canvasSource.width = track.getSettings().width || 1280;
		session.canvasSource.height = track.getSettings().height || 720;
		session.canvas.width = track.getSettings().width || 1280;
		session.canvas.height = track.getSettings().height || 720;
		
		if (session.canvasSource.readyState >= 3){
			mainMeshMask();
		} else {
			session.canvasSource.onloadeddata = mainMeshMask;
		}
	} else {
		if (session.canvasource){
			session.canvasSource.srcObject.getVideoTracks().forEach(function(trk) {
				session.canvasSource.srcObject.removeTrack(trk);
			});
		} else {
			session.canvasSource = createVideoElement();
			session.canvasSource.srcObject = createMediaStream();
		}
		
		session.canvasSource.width=512;
		session.canvasSource.height=288;
		session.canvasSource.autoplay = true;
		session.canvasSource.id = "effectsVideoSource";
		session.canvasSource.srcObject.addTrack(track);
		session.canvasSource.width = track.getSettings().width || 1280;
		session.canvasSource.height = track.getSettings().height || 720;
		
		if (iOS || iPad){
			session.canvasSource.style.position = "absolute";
			session.canvasSource.style.left = "0";
			session.canvasSource.style.top = "0";
			session.canvasSource.style.maxWidth = "1px";
			session.canvasSource.style.maxHeight = "1px";
			session.canvasSource.controls = session.showControls || false;
			
			session.canvasSource.setAttribute("playsinline","");
			document.body.appendChild(session.canvasSource);
			//session.canvasSource.play();
		}
		
		try {
			JEELIZFACEFILTER.destroy();
		} catch(e){}
		if (session.canvasWebGL){
			session.canvasWebGL.remove()
			session.canvasWebGL=null;
		}
		session.canvasWebGL = document.createElement("canvas");
		session.canvasWebGL.width = track.getSettings().width || 1280;
		session.canvasWebGL.height = track.getSettings().height || 720;
		session.canvasWebGL.id = "effectsCanvasTarget";
		session.canvasWebGL.style.position="fixed";
		session.canvasWebGL.style.top= "-9999px";
		session.canvasWebGL.style.left= "-9999px";
		
		document.body.appendChild(session.canvasWebGL);
		loadEffect(session.effects);
		return session.canvasWebGL.captureStream().getVideoTracks()[0];
	}
	try {
		return session.canvas.captureStream().getVideoTracks()[0];
	} catch(e){
		if (!session.cleanOutput){
			warnUser(miscTranslations["not-clean-session"]);
		}
	}
}

function dataURItoArraybuffer(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
	  ia[i] = byteString.charCodeAt(i);
  }
  return ab;
}


var makeImagesActive = null; 
async function makeImages(startup=false){
	if (makeImagesActive===true){return;}
	if (!session.videoElement){return;}
	if (session.videoMuted){return;}
	
	if (session.videoElement.srcObject){
		//
	} else if (session.videoElement.src){
		//
	} else {
		errorlog("No video element; can't make images for webp mode");
		return;
	}
	
	if (makeImagesActive===null){
		makeImagesActive=true;
		session.webPcanvas = document.createElement("canvas");
		session.webPcanvas.makeImagesTimeout = null;
		session.webPcanvas.nowTime = new Date().getTime();
		
		var width = 480;
		var height = 270;
		var timeout = 100;
		
		if (session.webPquality===0){
			width = 1920;
			height = 1080;
			timeout = 33;
		} else if (session.webPquality===1){
			width = 1280;
			height = 720;
			timeout = 33;
		} else if (session.webPquality===2){
			width = 640;
			height = 360;
			timeout = 33;
		} else if (session.webPquality===3){
			width = 480;
			height = 270;
			timeout = 33;
		} else if (session.webPquality===4){
			width = 480;
			height = 270;
			timeout = 67;
		} else {
			width = 480;
			height = 270;
			timeout = 200;
		}
		session.webPcanvas.width = width;
		session.webPcanvas.height = height;
		session.webPcanvas.timeout = timeout;
		session.webPcanvasCtx = session.webPcanvas.getContext('2d', {alpha: false, desynchronized: true});
		session.webPcanvasCtx.fillStyle = "black";
		session.webPcanvasCtx.fillRect(0, 0, width, height);
	} else {
		clearTimeout(session.webPcanvas.makeImagesTimeout);
		makeImagesActive=true;
	}
	
	
	if (session.streamSrc.getVideoTracks().length===0){
		makeImagesActive=false;
		
		var exit = true;
		for (var i in session.pcs){
			if (session.pcs[i].allowBroadcast){ // just for safety, to avoid a race condition, double check that it's still not active.
				exit = false;
			}
		}
		if (exit){
			makeImagesActive=false;
			return;
		}
		
		session.webPcanvas.makeImagesTimeout = setTimeout(function(){makeImages();},timeout*3);
		return;
	}
	
	if (startup){
		var exit = true;
		for (var i in session.pcs){
			if (session.pcs[i].allowBroadcast){ // just for safety, to avoid a race condition, double check that it's still not active.
				exit = false;
			}
		}
		if (exit){
			makeImagesActive=false;
			return;
		}
	}
	
	try{
		var broadcasting = false;
		var arrayBuffer = false;
		for (var i in session.pcs){
			try{
				if (session.pcs[i].allowBroadcast){ // only publish to those seeking this stream
					broadcasting = true;
					if (!session.pcs[i].sendChannel.bufferedAmount){
						if (!arrayBuffer){
							session.webPcanvasCtx.drawImage(session.videoElement, 0, 0, session.webPcanvas.width, session.webPcanvas.height);
							arrayBuffer = dataURItoArraybuffer(session.webPcanvas.toDataURL("image/webp",0.6));
						}
						session.pcs[i].sendChannel.send(arrayBuffer);
					} 
				}
			} catch(e){}
		}
	} catch(e){
		errorlog(e);
		makeImagesActive=false;
		return;
	}
	makeImagesActive=false;
	if (broadcasting){  // wait a bit of time, now that we sent a frame out.
		session.webPcanvas.lastTime = session.webPcanvas.nowTime;
		session.webPcanvas.nowTime = new Date().getTime();
		var time  = session.webPcanvas.timeout - (session.webPcanvas.nowTime - session.webPcanvas.lastTime);
		if (time <= 0 ){
			session.webPcanvas.makeImagesTimeout = setTimeout(function(){makeImages();},0);
		} else {
			session.webPcanvas.makeImagesTimeout = setTimeout(function(){makeImages();},time);
		}
		
	} else { // just double check that we shoulnd't be broadcasting.
		for (var i in session.pcs){
			if (session.pcs[i].allowBroadcast){ 
				session.webPcanvas.makeImagesTimeout = setTimeout(function(){makeImages();},0);
				return;
			}
		}
		log("Stopping webP broadcast.");
	}
}

var updateUserListTimeout=null
var updateUserListActive = false;
function updateUserList(){
	if ((session.showList!==true) && (session.cleanOutput || (session.scene!==false) || !session.roomid || session.director || (session.showList===false))){return;}
	clearInterval(updateUserListTimeout);
	updateUserListTimeout = setTimeout(function(){
		if (updateUserListActive){return;}
		updateUserListActive=true;
		try {
			var added = false;
			getById("userList").innerHTML = "";
			
			for (var UUID in session.rpcs){
				if (session.rpcs[UUID].videoElement && session.rpcs[UUID].streamSrc && session.rpcs[UUID].streamSrc.getTracks().length){
					if (document.body.contains(session.rpcs[UUID].videoElement)){
						continue;
					}
				} else {
					continue;
				}
				if ((session.rpcs[UUID].videoMuted || (!session.rpcs[UUID].imageElement && !session.rpcs[UUID].canvas)) || ( session.infocus && session.infocus!==UUID )){
					
					if (session.directorList.indexOf(UUID)>=0){
						if (!session.rpcs[UUID].streamSrc){ // director not active yet, so we won't bother showing it.
							continue;
						}
					}
					
					var insert = document.createElement("div");
					if (session.rpcs[UUID].label){
						insert.innerText = session.rpcs[UUID].label + "";
					} else if (session.directorList.indexOf(UUID)>=0){
						insert.innerText = miscTranslations["director"];
					} else {
						insert.innerText = miscTranslations["unknown-user"];
					}
					getById("userList").appendChild(insert);
					
					if (session.rpcs[UUID].remoteMuteState || !(session.rpcs[UUID].streamSrc)){
						var muteInsert = document.createElement("div");
						muteInsert.className = "video-mute-state-userlist";
						muteInsert.innerHTML = '<i class="las la-microphone-slash"></i>';
						insert.appendChild(muteInsert);
					} else if (session.rpcs[UUID].voiceMeter){
						insert.appendChild(session.rpcs[UUID].voiceMeter);
					}
					//getById("userList").innerHTML += "<br />";
					added=true;
				}
			}
			
			if (!added){
				getById("connectUsers").style.display = "none";
			} else {
				getById("connectUsers").style.display = "block";
			}
		} catch(e){}
		updateUserListActive=false;
	},200);
}


function resetCanvas(){
	log("resetCanvas();");
	session.streamSrc.getVideoTracks().forEach((track) => {
		session.canvasSource.width = track.getSettings().width || 1280;
		session.canvasSource.height = track.getSettings().height || 720;
	});
}

var LaunchTFWorkerCallback = false;
function TFLiteWorker(){
	if (session.tfliteModule==false){
		LaunchTFWorkerCallback=true
		return;
	}
	if (TFLITELOADING){LaunchTFWorkerCallback=true;return;}
	LaunchTFWorkerCallback=false;
	log("TFLiteWorker() called");
	
	if (!session.tfliteModule.img){
		if (session.selectImageTFLITE_contents.querySelector("img")){
			session.tfliteModule.img = session.selectImageTFLITE_contents.querySelector("img");
			session.tfliteModule.img.classList.add("selectedTFImage");
		} else if (session.defaultBackgroundImages && session.defaultBackgroundImages.length){
			session.tfliteModule.img = document.createElement("img");
			session.tfliteModule.img.onload = function(){
				URL.revokeObjectURL(session.tfliteModule.img.src);  // no longer needed, free memory
			}
			session.tfliteModule.img.src = session.defaultBackgroundImages[0];
			session.tfliteModule.img.classList.add("selectedTFImage");
		} else {
			session.tfliteModule.img = document.createElement("img");
			session.tfliteModule.img.onload = function(){
				URL.revokeObjectURL(session.tfliteModule.img.src);  // no longer needed, free memory
			}
			session.tfliteModule.img.src = "./media/bg_sample.webp"; 
		}
	}
	
	if (session.tfliteModule.looping){return;}
	
	const segmentationWidth = 256;
	const segmentationHeight = 144;
	const segmentationPixelCount = segmentationWidth * segmentationHeight;
	const inputMemoryOffset  = session.tfliteModule._getInputMemoryOffset() / 4;
	const outputMemoryOffset = session.tfliteModule._getOutputMemoryOffset() / 4;
	const segmentationMask = new ImageData(segmentationWidth, segmentationHeight);
	const segmentationMaskCanvas = document.createElement('canvas');
	segmentationMaskCanvas.width = segmentationWidth;
	segmentationMaskCanvas.height = segmentationHeight;
	const segmentationMaskCtx = segmentationMaskCanvas.getContext('2d');
	session.tfliteModule.nowTime = new Date().getTime();
	session.tfliteModule.offsetTime = 0;
	
	function process(){
		clearTimeout(session.tfliteModule.timeout);
		
		if (!(session.effects=="3" || session.effects=="4" || session.effects=="5")){
			session.tfliteModule.looping=false;
			return;
		}
		if (session.tfliteModule.activelyProcessing){return;}
		
		session.tfliteModule.activelyProcessing=true;
		
		if (session.mobile){
			if (screenWidth !== window.innerWidth){
				screenWidth = window.innerWidth;
				setTimeout(function(){
					updateRenderOutpipe();
				},200);
				session.tfliteModule.looping=false;
				session.tfliteModule.activelyProcessing=false;
				return;
			}
		}
		
		try{
			segmentationMaskCtx.drawImage(
				session.canvasSource,
				0,
				0,
				session.canvasSource.width,
				session.canvasSource.height,
				0,
				0,
				segmentationWidth,
				segmentationHeight
			)
			
			const imageData = segmentationMaskCtx.getImageData(
				0,
				0,
				segmentationWidth,
				segmentationHeight
			);
			
			for (let i = 0; i < segmentationPixelCount; i++) {
				session.tfliteModule.HEAPF32[inputMemoryOffset + i * 3] = imageData.data[i * 4] / 255;
				session.tfliteModule.HEAPF32[inputMemoryOffset + i * 3 + 1] = imageData.data[i * 4 + 1] / 255;
				session.tfliteModule.HEAPF32[inputMemoryOffset + i * 3 + 2] = imageData.data[i * 4 + 2] / 255;
			}
			
			session.tfliteModule._runInference();
			
			for (let i = 0; i < segmentationPixelCount; i++) {
			  const background = session.tfliteModule.HEAPF32[outputMemoryOffset + i * 2];
			  const person = session.tfliteModule.HEAPF32[outputMemoryOffset + i * 2 + 1];
			  const shift = Math.max(background, person);
			  const backgroundExp = Math.exp(background - shift);
			  const personExp = Math.exp(person - shift);
			  segmentationMask.data[i * 4 + 3] = (255 * personExp) / (backgroundExp + personExp); // softmax
			}
			segmentationMaskCtx.putImageData(segmentationMask, 0, 0);
			
			session.canvasCtx.globalCompositeOperation = 'copy';
			
			if (session.mobile && (session.roomid !==false)){
				session.canvasCtx.filter = 'none';
			} else {
				session.canvasCtx.filter = 'blur(4px)';
			}
			session.canvasCtx.drawImage(  
			  segmentationMaskCanvas,
			  0,
			  0,
			  segmentationWidth,
			  segmentationHeight,
			  0,
			  0,
			  session.canvasSource.width,
			  session.canvasSource.height
			)
			
			session.canvasCtx.globalCompositeOperation = 'source-in';
			session.canvasCtx.filter = 'none';
			session.canvasCtx.drawImage(session.canvasSource, 0, 0);
			
			session.canvasCtx.globalCompositeOperation = 'destination-over';
			if (session.effects=="4"){ // greenscreen 
				session.canvasCtx.filter = 'none';
				session.canvasCtx.fillStyle = "#0F0";
				session.canvasCtx.fillRect(0, 0, session.canvas.width, session.canvas.height);
			} else if (session.effects=="5"){ 
				session.canvasCtx.filter = 'none';
				if (session.tfliteModule.img.complete){
					try {
						session.canvasCtx.drawImage(session.tfliteModule.img, 0, 0, session.canvas.width, session.canvas.height);
					} catch(e){}
				}
			} else if (session.effects=="3"){ // BLUR 
			    if (session.effectValue){
					session.canvasCtx.filter = 'blur('+(parseInt(session.effectValue)*2)+'px)';
				} else {
					session.canvasCtx.filter = 'blur(4px)'; // Does not work on Safari
				}
				session.canvasCtx.drawImage(session.canvasSource, 0, 0);
			} else {
				session.tfliteModule.activelyProcessing=false;
				session.tfliteModule.looping=false;
				return;
			}
		} catch (e){
				errorlog(e);
				session.tfliteModule.activelyProcessing=false;
				session.tfliteModule.looping=false;
				return;
		}
		
		session.tfliteModule.lastTime = session.tfliteModule.nowTime;
		session.tfliteModule.nowTime = new Date().getTime();
		var time  = 33 - (session.tfliteModule.nowTime - session.tfliteModule.lastTime);
		time = time + session.tfliteModule.offsetTime;
		session.tfliteModule.activelyProcessing=false;
		if (time <= 0 ){
			session.tfliteModule.timeout = setTimeout(function(){process();},0);
			session.tfliteModule.offsetTime = 0;
		} else {
			session.tfliteModule.timeout = setTimeout(function(){process();},time);
			session.tfliteModule.offsetTime = time;
		}
	}
	
	function processiOS(){
		clearTimeout(session.tfliteModule.timeout);
		if (!(session.effects=="3" || session.effects=="4" || session.effects=="5")){
			session.tfliteModule.looping=false;
			return;
		}
		if (session.tfliteModule.activelyProcessing){return;}
		session.tfliteModule.activelyProcessing=true;
		
		if (screenWidth !== window.innerWidth){
			screenWidth = window.innerWidth;
			setTimeout(function(){
				updateRenderOutpipe();
			},200);
			session.tfliteModule.looping=false;
			session.tfliteModule.activelyProcessing=false;
			return;
		}
		
		try{
			segmentationMaskCtx.drawImage(
				session.canvasSource,
				0,
				0,
				session.canvasSource.width,
				session.canvasSource.height,
				0,
				0,
				segmentationWidth,
				segmentationHeight
			)
			
			var imageData = segmentationMaskCtx.getImageData(
				0,
				0,
				segmentationWidth,
				segmentationHeight
			);
			
			for (let i = 0; i < segmentationPixelCount; i++) {
				session.tfliteModule.HEAPF32[inputMemoryOffset + i * 3] = imageData.data[i * 4] / 255;
				session.tfliteModule.HEAPF32[inputMemoryOffset + i * 3 + 1] = imageData.data[i * 4 + 1] / 255;
				session.tfliteModule.HEAPF32[inputMemoryOffset + i * 3 + 2] = imageData.data[i * 4 + 2] / 255;
			}
			
			session.tfliteModule._runInference();
			
			for (let i = 0; i < segmentationPixelCount; i++) {
			  const background = session.tfliteModule.HEAPF32[outputMemoryOffset + i * 2];
			  const person = session.tfliteModule.HEAPF32[outputMemoryOffset + i * 2 + 1];
			  const shift = Math.max(background, person);
			  const backgroundExp = Math.exp(background - shift);
			  const personExp = Math.exp(person - shift);
			  segmentationMask.data[i * 4 + 3] = 255 - (255 * personExp) / (backgroundExp + personExp); // softmax
			}
			
			segmentationMaskCtx.putImageData(segmentationMask, 0, 0);
			
			session.canvasCtx.globalCompositeOperation = 'copy';
			session.canvasCtx.drawImage(session.canvasSource, 0, 0);
			
			session.canvasCtx.globalCompositeOperation = 'destination-out';
			session.canvasCtx.drawImage(  
			  segmentationMaskCanvas,
			  0,
			  0,
			  segmentationWidth,
			  segmentationHeight,
			  0,
			  0,
			  session.canvasSource.width,
			  session.canvasSource.height
			);
			
			session.canvasCtx.globalCompositeOperation = 'destination-over';
			
			if (session.effects=="4"){ // greenscreen 
				session.canvasCtx.fillStyle = "#0F0";
				session.canvasCtx.fillRect(0, 0, session.canvas.width, session.canvas.height);
			} else if (session.effects=="5"){ 
				if (session.tfliteModule.img.complete){
					try {
						session.canvasCtx.drawImage(session.tfliteModule.img, 0, 0, session.canvas.width, session.canvas.height);
					} catch(e){}
				}
			} else if (session.effects=="3"){ // BLUR
			
				const width = canvasBG.width;
				const height = canvasBG.height;
				ctxBG.drawImage(session.canvasSource, 0, 0, width, height);
				imageData = ctxBG.getImageData(0, 0, width, height);
		
				const { data } = imageData;
				
				// THE BELOW BLUR CODE polyfil is by David Enke
				// MIT License: Copyright (c) 2019
				// https://github.com/steveseguin/context-filter-polyfill/blob/master/src/filters/blur.filter.ts
				const wm = width - 1;
				const hm = height - 1;
				const rad1 = amount + 1;
				const r = [];
				const g = [];
				const b = [];
				//const a = [];

				const vmin = [];
				const vmax = [];

				let iterations = 3; // 1 - 3
				let p, p1, p2;
				while (iterations-- > 0) {
					let yw = 0;
					let yi = 0;

					for (let y = 0; y < height; y++) {
					  let rsum = data[yw] * rad1;
					  let gsum = data[yw + 1] * rad1;
					  let bsum = data[yw + 2] * rad1;

					  for (let i = 1; i <= amount; i++) {
						p = yw + (((i > wm ? wm : i)) << 2);
						rsum += data[p++];
						gsum += data[p++];
						bsum += data[p++];
					  }

					  for (let x = 0; x < width; x++) {
						r[yi] = rsum;
						g[yi] = gsum;
						b[yi] = bsum;

						if (y === 0) {
						  vmin[x] = ((p = x + rad1) < wm ? p : wm) << 2;
						  vmax[x] = ((p = x - amount) > 0 ? p << 2 : 0);
						}

						p1 = yw + vmin[x];
						p2 = yw + vmax[x];

						rsum += data[p1++] - data[p2++];
						gsum += data[p1++] - data[p2++];
						bsum += data[p1++] - data[p2++];

						yi++;
					  }
					  yw += (width << 2);
					}

					for (let x = 0; x < width; x++) {
					  let yp = x;
					  let rsum = r[yp] * rad1;
					  let gsum = g[yp] * rad1;
					  let bsum = b[yp] * rad1;

					  for (let i = 1; i <= amount; i++) {
						yp += (i > hm ? 0 : width);
						rsum += r[yp];
						gsum += g[yp];
						bsum += b[yp];
					  }

					  yi = x << 2;

					  for (let y = 0; y < height; y++) {
					    data[yi] = ((rsum * mulSum) >>> shgSum);
					    data[yi + 1] = ((gsum * mulSum) >>> shgSum);
					    data[yi + 2] = ((bsum * mulSum) >>> shgSum);

						if (x === 0) {
						  vmin[y] = ((p = y + rad1) < hm ? p : hm) * width;
						  vmax[y] = ((p = y - amount) > 0 ? p * width : 0);
						}

						p1 = x + vmin[y];
						p2 = x + vmax[y];

						rsum += r[p1] - r[p2];
						gsum += g[p1] - g[p2];
						bsum += b[p1] - b[p2];
						yi += width << 2;
					  }
					}
				}
				//////////////  END OF BLUR CODE - MIT LICENCED.
				ctxBG.putImageData(imageData, 0, 0);
				session.canvasCtx.drawImage(canvasBG, 0, 0, width, height, 0, 0, session.canvas.width, session.canvas.height);
			} else {
				session.tfliteModule.activelyProcessing=false;
				session.tfliteModule.looping=false;
				return;
			}
		} catch (e){
				session.tfliteModule.activelyProcessing=false;
				session.tfliteModule.looping=false;
				errorlog(e);
				return;
		}
		
		session.tfliteModule.lastTime = session.tfliteModule.nowTime;
		session.tfliteModule.nowTime = new Date().getTime();
		var time  = 33 - (session.tfliteModule.nowTime - session.tfliteModule.lastTime);
		time = time + session.tfliteModule.offsetTime;
		session.tfliteModule.activelyProcessing=false;
		if (time <= 0 ){
			session.tfliteModule.timeout = setTimeout(function(){processiOS();},0);
			session.tfliteModule.offsetTime = 0;
		} else {
			session.tfliteModule.timeout = setTimeout(function(){processiOS();},time);
			session.tfliteModule.offsetTime = time;
		}
	}
	session.tfliteModule.looping=true;
	
	var screenWidth = window.innerWidth;
	
	if (iOS || iPad || SafariVersion){
		var canvasBG = document.createElement("canvas");
		var ctxBG = canvasBG.getContext("2d", {alpha: false});
		var amount = 1.0;
		var mulTable = [1, 57, 41, 21, 203, 34, 97, 73, 227, 91, 149, 62, 105, 45, 39, 137, 241, 107, 3, 173, 39, 71, 65, 238, 219, 101, 187, 87, 81, 151, 141, 133, 249, 117, 221, 209, 197, 187, 177, 169, 5, 153, 73, 139, 133, 127, 243, 233, 223, 107, 103, 99, 191, 23, 177, 171, 165, 159, 77, 149, 9, 139, 135, 131, 253, 245, 119, 231, 224, 109, 211, 103, 25, 195, 189, 23, 45, 175, 171, 83, 81, 79, 155, 151, 147, 9, 141, 137, 67, 131, 129, 251, 123, 30, 235, 115, 113, 221, 217, 53, 13, 51, 50, 49, 193, 189, 185, 91, 179, 175, 43, 169, 83, 163, 5, 79, 155, 19, 75, 147, 145, 143, 35, 69, 17, 67, 33, 65, 255, 251, 247, 243, 239, 59, 29, 229, 113, 111, 219, 27, 213, 105, 207, 51, 201, 199, 49, 193, 191, 47, 93, 183, 181, 179, 11, 87, 43, 85, 167, 165, 163, 161, 159, 157, 155, 77, 19, 75, 37, 73, 145, 143, 141, 35, 138, 137, 135, 67, 33, 131, 129, 255, 63, 250, 247, 61, 121, 239, 237, 117, 29, 229, 227, 225, 111, 55, 109, 216, 213, 211, 209, 207, 205, 203, 201, 199, 197, 195, 193, 48, 190, 47, 93, 185, 183, 181, 179, 178, 176, 175, 173, 171, 85, 21, 167, 165, 41, 163, 161, 5, 79, 157, 78, 154, 153, 19, 75, 149, 74, 147, 73, 144, 143, 71, 141, 140, 139, 137, 17, 135, 134, 133, 66, 131, 65, 129, 1];
		var mulSum = mulTable[amount];
		var shgTable = [0, 9, 10, 10, 14, 12, 14, 14, 16, 15, 16, 15, 16, 15, 15, 17, 18, 17, 12, 18, 16, 17, 17, 19, 19, 18, 19, 18, 18, 19, 19, 19, 20, 19, 20, 20, 20, 20, 20, 20, 15, 20, 19, 20, 20, 20, 21, 21, 21, 20, 20, 20, 21, 18, 21, 21, 21, 21, 20, 21, 17, 21, 21, 21, 22, 22, 21, 22, 22, 21, 22, 21, 19, 22, 22, 19, 20, 22, 22, 21, 21, 21, 22, 22, 22, 18, 22, 22, 21, 22, 22, 23, 22, 20, 23, 22, 22, 23, 23, 21, 19, 21, 21, 21, 23, 23, 23, 22, 23, 23, 21, 23, 22, 23, 18, 22, 23, 20, 22, 23, 23, 23, 21, 22, 20, 22, 21, 22, 24, 24, 24, 24, 24, 22, 21, 24, 23, 23, 24, 21, 24, 23, 24, 22, 24, 24, 22, 24, 24, 22, 23, 24, 24, 24, 20, 23, 22, 23, 24, 24, 24, 24, 24, 24, 24, 23, 21, 23, 22, 23, 24, 24, 24, 22, 24, 24, 24, 23, 22, 24, 24, 25, 23, 25, 25, 23, 24, 25, 25, 24, 22, 25, 25, 25, 24, 23, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 23, 25, 23, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 24, 22, 25, 25, 23, 25, 25, 20, 24, 25, 24, 25, 25, 22, 24, 25, 24, 25, 24, 25, 25, 24, 25, 25, 25, 25, 22, 25, 25, 25, 24, 25, 24, 25, 18];
		var shgSum = shgTable[amount];
		
		log("session.canvas: "+session.canvas.width+"x"+session.canvas.height);
		canvasBG.width = parseInt(session.canvas.width/12);;
		canvasBG.height = parseInt(session.canvas.height/12);;
		ctxBG.width = canvasBG.width;
		ctxBG.height = canvasBG.height;
		processiOS();
		
	} else {
		process();
	}
}


function mainMeshMask() {
	if ((session.TFJSModel === null) || (session.TFJSModel === true)){
		setTimeout(function(){mainMeshMask();},1000);
		return;
	}
	function heatMapColorforValue(value){
		var h = parseInt((1.0 - value) * 240);
		if (h<0){h=0;}
		if (h>240){h=240;}
		return "hsl(" + h + ", 100%, 50%)";
	}
	async function process(){
		if (session.TFJSModel.activelyProcessing){return;}
		session.TFJSModel.activelyProcessing = true;
		
		clearTimeout(session.TFJSModel.timeout);
		
		if (session.effects!="6"){
			//session.TFJSModel.looping=false;
			session.TFJSModel.activelyProcessing = false;
			return;
		}
		
		const predictions = await session.TFJSModel.estimateFaces({
			input: session.canvasSource
		});
		
		var output = [];
		if (predictions.length > 0) {
			for (let j = 0; j < predictions.length; j++) {
			  const fp = predictions[j].annotations;
			  session.canvasCtx.fillStyle = "#000000";
			  session.canvasCtx.fillRect(0, 0, session.canvas.width, session.canvas.height);
			  const keypoints = predictions[j].scaledMesh
			  for (let i = 0; i < keypoints.length; i++) {
				var [x,y,z] = keypoints[i];
				x=parseInt(x);
				y=parseInt(y);
				z=parseInt(z);
				if (session.pushEffectsData){
					output.push(x);
					output.push(y);
				}
				session.canvasCtx.fillStyle = heatMapColorforValue((z+40)/60);
				session.canvasCtx.fillRect(x, y, 5, 5);
			  }
			}
		}
		
		if (session.pushEffectsData){
			//output = FastIntegerCompression.compress(output);
			//log(output);
			if (isIFrame){
				 parent.postMessage({
					"effectsData": output,
					"eID": session.pushEffectsData
				}, "*");
			} else {
				for (var i in session.pcs){
					if (!session.pcs[i].sendChannel.bufferedAmount){ // don't overload things.
						session.sendMessage({"effectsData":  output, "eID":session.effects},i);
					}
				}
			}
		}
	  
	    if (document.hidden) {
			session.TFJSModel.lastTime = session.TFJSModel.nowTime || new Date().getTime();
			session.TFJSModel.nowTime = new Date().getTime();
			var time  = 33 - (session.TFJSModel.nowTime - session.TFJSModel.lastTime);
			if (time <= 0 ){
				session.TFJSModel.timeout = setTimeout(function(){process();},0);
			} else {
				session.TFJSModel.timeout = setTimeout(function(){process();},time);
			}
			session.TFJSModel.activelyProcessing = false;
		} else {
			session.TFJSModel.timeout = setTimeout(function(){process();},33);
			session.TFJSModel.activelyProcessing = false;
			window.requestAnimationFrame(process);
		}
		
	}
	process();
}
var faceAlignment=false;;
function drawFace() {
	if (faceAlignment!==false){return;}
	faceAlignment = (function() {
		if (!(session.canvasSource && session.canvasSource.srcObject.getVideoTracks().length)){
			setTimeout(function(){drawFace();},1000);// TODO: this needs a way to prevent the function loading twice 
			return;
		}
		
		var timers = {};
		timers.activelyProcessing=false;
		timers.activelyProcessingDraw = false;
		var vid = session.canvasSource;

		var canvas = session.canvas;
		var ctx = session.canvasCtx;

		var canvas_tmp = document.createElement("canvas");
		var ctx_tmp = canvas_tmp.getContext('2d');


		
		var zoom = 30;
		
		var lastFace = {};
		var yoffset = 0;
		
		
		lastFace.x = vid.videoWidth / 2;
		lastFace.y = vid.videoHeight / 2;
		lastFace.w = vid.videoWidth;
		lastFace.h = vid.videoHeight;
		
		canvas.height = vid.videoHeight;
		canvas.width = vid.videoWidth;
		canvas_tmp.height = vid.videoHeight;
		canvas_tmp.width = vid.videoWidth;

		var image = new Image();
		
		function processImg(){
			try {
				faceDetector.detect(this).then(faces => {
					if (faces.length === 0) {
						log("NO FACES");
					} else {
						log("faces!");
						for (let face of faces) {
							lastFace.x = face.boundingBox.x;
							lastFace.y = face.boundingBox.y;
							lastFace.w = face.boundingBox.width;
							lastFace.h = face.boundingBox.height;
						}
					}
					setTimeout(function(){draw();},0);
				}).catch((e) => {
					console.error("Boo, Face Detection failed: " + e);
				});
				
				if (document.hidden){
					timers.lastTime = timers.nowTime || new Date().getTime();
					timers.nowTime = new Date().getTime();
					var time  = 33 - (timers.nowTime - timers.lastTime);
					timers.activelyProcessing = false;
					if (time <= 0 ){
						timers.timeout = setTimeout(function(){detect();},0);
					} else {
						timers.timeout = setTimeout(function(){detect();},time);
					}
				} else {
					timers.timeout = setTimeout(function(){detect();},33);
					timers.activelyProcessing = false;
					window.requestAnimationFrame(detect);
				}
			}catch(e){errorlog(e);}
		}
		
		function detect(){ 
			if (session.effects !== "1"){return;}
			if (timers.activelyProcessing){return;}
			clearTimeout(timers.timeout);
			timers.activelyProcessing = true;
			
			if (!vid.videoWidth){
				timers.timeout = setTimeout(function(){detect();},300);
				timers.activelyProcessing = false;
				return
			}
			
			ctx_tmp.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight);
			image.onload = processImg;
			image.src = canvas_tmp.toDataURL();
		}
		
		function draw() {
			if (session.effects !== "1"){return;}
			if (timers.activelyProcessingDraw){return;}
			clearTimeout(timers.timeoutDraw);
			timers.activelyProcessingDraw = true;
			
			if (!vid.videoWidth){
				timers.timeoutDraw = setTimeout(function(){draw();},1000);
				timers.activelyProcessingDraw = false;
				//console.log(vid.videoWidth);
				return
			}
			
			canvas.height = vid.videoHeight;
			canvas.width = vid.videoWidth;

			try {
				ctx.drawImage(vid, parseInt(lastFace.x),  parseInt(lastFace.y),  parseInt(lastFace.w),  parseInt(lastFace.h), 0, 0, vid.videoWidth, vid.videoHeight);
			}catch(e){}

			if (document.hidden){
				timers.lastTimeDraw = timers.nowTimeDraw || new Date().getTime();
				timers.nowTimeDraw = new Date().getTime();
				var time  = 33 - (timers.nowTimeDraw - timers.lastTimeDraw);
				if (time <= 0 ){
					timers.timeoutDraw = setTimeout(function(){draw();},0);
				} else {
					timers.timeoutDraw = setTimeout(function(){draw();},time);
				}
				timers.activelyProcessingDraw = false;
			} else {
				timers.timeoutDraw = setTimeout(function(){draw();},33);
				timers.activelyProcessingDraw = false;
				window.requestAnimationFrame(draw);
			}
		}
		
		if (window.FaceDetector == undefined) {
			//console.error('Face Detection not supported');
			var faceDetector = false;
		} else {
			var faceDetector = new FaceDetector();
			setTimeout(function(){detect();},10);
			setTimeout(function(){draw();},10);
		}
	})();
}
////////  END CANVAS EFFECTS  ///////////////////


function getNativeOutputResolution(){
	var tracks = session.videoElement.srcObject.getVideoTracks();
	if (tracks.length && tracks[0].getSettings){
		return tracks[0].getSettings();
	} else {
		return false;
	}
}

function toggleSceneStats(button){
	
	var UUID = button.dataset.UUID;
	
	var state = parseInt(button.dataset.value);
	if (state){
		button.dataset.value = 0;
		button.classList.remove("pressed");
		session.rpcs[UUID].allowGraphs = false;
	} else {
		button.dataset.value = 1;
		button.classList.add("pressed");
		session.rpcs[UUID].allowGraphs = true;
	}
	
	if (!state){
		getById("container_" + UUID).querySelectorAll('[data-no-scenes]').forEach(ele=>{
			ele.classList.remove("hidden");
			if (ele.dataset.message){
				ele.innerHTML = "Requesting data ..";
			}
		});
		
		if (getById("container_" + UUID).querySelector('[data-action-type="stats-graphs-bitrate"]')){
			getById("container_" + UUID).querySelector('[data-action-type="stats-graphs-bitrate"]').classList.remove("hidden");
		}
		if (getById("container_" + UUID).querySelector('[data-action-type="stats-graphs-details"]')){
			getById("container_" + UUID).querySelector('[data-action-type="stats-graphs-details"]').classList.remove("hidden");
		}
		session.sendRequest({'requestStatsContinuous':true, }, UUID);
	} else {
		session.sendRequest({'requestStatsContinuous':false, }, UUID);
		if (getById("container_" + UUID).querySelector('[data-action-type="stats-graphs-bitrate"]')){
			getById("container_" + UUID).querySelector('[data-action-type="stats-graphs-bitrate"]').classList.add("hidden");
		}
		if (getById("container_" + UUID).querySelector('[data-action-type="stats-graphs-details"]')){
			getById("container_" + UUID).querySelector('[data-action-type="stats-graphs-details"]').classList.add("hidden");
		}
	}	
}
function getColor(value) {
  var hue = ((value) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
}

function plotData(info, UUID, uuid) { // type = "bitrate" or "nacks"
	log("plot data");

	var container = getById("container_" + UUID).querySelector('[data-action-type="stats-graphs-bitrate"]');
	
	if (!container){
		log("container not found");
		return;
	}
	var canvas = getById("container_" + UUID).querySelector('canvas[data-uid="'+uuid+'"]');
	var canvasNew = false
	if (!canvas){
		canvasNew = true;
		canvas = document.createElement("canvas");
		canvas.height = 50;
		canvas.width = 124;
		canvas.className = "canvasStats";
		canvas.history_nacks = [];
		canvas.history_bitrate = [];
		canvas.target = 4000;
		if (info.scene){
			canvas.title = "Scene: "+info.scene+". Red/orange implies packet loss. Y-axis is 0 to 4000-kbps.";
		} else if (info.label){
			canvas.title = "Label: "+info.label+". Red/orange implies packet loss. Y-axis is 0 to 4000-kbps.";
		} else {
			canvas.title = "Red/orange implies packet loss. Y-axis is 0 to 4000-kbps.";
		}
		
		canvas.dataset.uid = uuid;
		container.appendChild(canvas);
	}
	
	selfDestructElement(UUID, uuid);
	
	var context = canvas.getContext("2d");

	var bitrate = 0;
	if ("video_bitrate_kbps" in info){
		bitrate = info.video_bitrate_kbps;
	}
	if (isNaN(bitrate)) {
		bitrate = 0;
	}
	
	if (bitrate<0){bitrate = 0;}
	
	var nacks = 0;
	if ("nacks_per_second" in info){
		nacks = info.nacks_per_second;
	}
	if (isNaN(nacks)) {
		nacks = 0;
	}
	if (nacks<0){nacks = 0;}

	var height = context.canvas.height;
	var width = context.canvas.width;
	
	canvas.history_nacks.push(nacks);
	canvas.history_bitrate.push(bitrate);

	canvas.history_nacks = canvas.history_nacks.slice(-125);
	canvas.history_bitrate = canvas.history_bitrate.slice(-125);
	
	var maxBitrate = Math.max(...canvas.history_bitrate);
	
	var target = canvas.target || 4000;
	if (target && (maxBitrate > target)){
		
		canvas.target = maxBitrate*1.5; // set it higher than it needs to be, so it doens't jump around a lot
		var yScale = height / canvas.target;
		context.clearRect(0, 0, width, height);
		var x = width - 1;
		var w = 1;
		
		for (var i = 0; i<canvas.history_bitrate.length;i++){
			
			var nacks = canvas.history_nacks[i];
			var bitrate = canvas.history_bitrate[i];
			
			var val = (10-nacks)/10;
			if (val>1){val=1;}
			else if (val<0){val=0;}
			var color = getColor(val);
			var y = height - bitrate * yScale;
			context.fillStyle = color;
			context.fillRect(x, y, w, height);
			context.fillStyle = "#DDD5";
			context.fillRect(x, y-2, w, 4);
			
			if (y-5>0){
				context.fillStyle = "#FFF3";
				context.fillRect(x, y+2, w, 1);
			}

			var imageData = context.getImageData(1, 0, width - 1, height);
			context.putImageData(imageData, 0, 0);
			context.clearRect(width - 1, 0, 1, height);
		}
		
		for (var tt = 2500; tt<canvas.target;tt+=2500){
			var y = parseInt(height - tt * yScale);
			context.fillStyle = "#0555";
			context.fillRect(0, y, width, 1);
		}
		log("finished plotting a new y-axis");
		return;
	}
	//if (info.available_outgoing_bitrate_kbps){
		// limit target, but requires a history
	//}
	var val = (10-nacks)/10;
	if (val>1){val=1;}
	else if (val<0){val=0;}
	var color = getColor(val);

	var yScale = height / target;

	var x = width - 1;
	var y = height - bitrate * yScale;
	var w = 1;
	
	context.fillStyle = color;
	context.fillRect(x, y, w, height);
	context.fillStyle = "#DDD5";
	context.fillRect(x, y-2, w, 4);
	
	if (y-5>0){
		context.fillStyle = "#FFF3";
		context.fillRect(x, y+2, w, 1);
	}
	
	context.fillStyle = "#0555";
	if (canvasNew){
		for (var tt = 2500; tt<target;tt+=2500){
			var y = parseInt(height - tt * yScale);
			context.fillRect(0, y, width, 1);
		}
	} else {
		for (var tt = 2500; tt<target;tt+=2500){
			var y = parseInt(height - tt * yScale);
			context.fillRect(x, y, 1, 1);
		}
	}
	
	var imageData = context.getImageData(1, 0, width - 1, height);
	context.putImageData(imageData, 0, 0);
	context.clearRect(width - 1, 0, 1, height);
	
	log("finished plotting");
}

function selfDestructElement(UUID, uid){
	getById("container_" + UUID).querySelectorAll('[data-uid="'+uid+'"]').forEach(ele=>{
		ele.classList.remove("greyout");
		clearTimeout(ele.selfFadeout);
		ele.selfFadeout = setTimeout(function(ele){
			ele.classList.add("greyout");
		}, 4000, ele);
		
		clearTimeout(ele.selfDestruct);
		ele.selfDestruct = setTimeout(function(ele){
			ele.remove();
		}, 10000, ele);
	});
}

function remoteStats(msg, UUID){
	log(msg);
	
	if (isIFrame){
		parent.postMessage({"remoteStats": msg.remoteStats , "streamID": session.rpcs[UUID].streamID, "UUID": UUID}, "*");
	} 
	
	if (!(session.rpcs[UUID].allowGraphs || session.allowGraphs)){return;}
	
	if (session.director){
		//var output = "";
		var size = 0;
		for (var key in msg.remoteStats) {
			if (msg.remoteStats.hasOwnProperty(key)){
				size++;
			}
		}
		
		if (!size){
			getById("container_" + UUID).querySelectorAll('[data-no-scenes]').forEach(ele=>{
				ele.classList.remove("hidden"); 
				if (ele.dataset.message){
					ele.innerHTML = "No scenes active";
				}
			});
			
			log("zero size");
			return;
		}
		getById("container_" + UUID).querySelectorAll('[data-no-scenes]').forEach(ele=>{
			ele.classList.add("hidden");
		});
		
		for (var uuid in msg.remoteStats){
			var container = getById("container_" + UUID).querySelector('[data-action-type="stats-graphs-details-container"][data-uid="'+uuid+'"]');
			if (!container){
				container = getById("container_" + UUID).querySelector('[data-action-type="stats-graphs-details-container"]').cloneNode(true);
				container.dataset.uid = uuid;
				container.classList.remove("hidden");
				getById("container_" + UUID).querySelector('[data-action-type="stats-graphs-details"]').appendChild(container);
			}
			plotData(msg.remoteStats[uuid], UUID, uuid);
			if (("video_bitrate_kbps" in msg.remoteStats[uuid]) && (msg.remoteStats[uuid].video_bitrate_kbps!=="video_bitrate_kbps")){
				var span = container.querySelector('[data-bitrate]');
				if (span){
					span.classList.remove("hidden");
					span.innerHTML = "video bitrate: "+parseInt(msg.remoteStats[uuid].video_bitrate_kbps) + " (kbps)";
				}
			}
			var span = container.querySelector('[data-scene-name]');
			if (span && ("label" in msg.remoteStats[uuid]) && msg.remoteStats[uuid].label){
				span.classList.remove("hidden");
				span.innerHTML = "stats for viewer: " + msg.remoteStats[uuid].label;
			} else if (span && ("scene" in msg.remoteStats[uuid]) && (msg.remoteStats[uuid].scene !==false)){
				span.classList.remove("hidden");
				span.innerHTML = "stats for scene: " + msg.remoteStats[uuid].scene;
			} else if (uuid==="meshcast"){
				span.classList.remove("hidden");
				span.innerHTML = "stats for meshcast ingest";
				span.title = "You can use &label=xxxx to give your view links a unique label";
			} else {
				span.classList.remove("hidden");
				span.innerHTML = "stats for some viewer";
				span.title = "You can use &label=xxxx to give your view links a unique label";
			}
			if ("resolution" in msg.remoteStats[uuid]){
				var span = container.querySelector('[data-resolution]');
				if (span){
					span.classList.remove("hidden");
					span.innerHTML = msg.remoteStats[uuid].resolution;
				}
			}
			
			if ("video_encoder" in msg.remoteStats[uuid]){
				var span = container.querySelector('[data-video-codec]');
				if (span){
					span.classList.remove("hidden");
					span.innerHTML = "video codec: "+msg.remoteStats[uuid].video_encoder;
				}
			}
		}
	};
}

function processStats(UUID){
			
	// for (pc in session.pcs){session.pcs[pc].getStats().then(function(stats) {stats.forEach(stat=>{if (stat.id.includes("RTCIce")){console.log(stat)}})})};
	
	if (!session.rpcs || !(UUID in session.rpcs)){
		return;
	}
	
	try {
		if (session.rpcs[UUID].videoElement.paused){
			log("trying to play");
			session.rpcs[UUID].videoElement.play().then(_ => {
				log("playing 8");
				session.firstPlayTriggered=true;
			}).catch(warnlog);
		}
	} catch (e){};
	
	if (session.rpcs[UUID].mc){
		processMeshcastStats(UUID);
	}
	
	try {
		session.rpcs[UUID].getStats().then(function(stats){
			if (!(UUID in session.rpcs)){return;}
			
			setTimeout(processStats, session.statsInterval, UUID);
			
			if (!session.rpcs[UUID].stats['Peer-to-Peer Connection']){
				session.rpcs[UUID].stats['Peer-to-Peer Connection'] = {};
			}
				
			stats.forEach(stat=>{
				
				if ((stat.type == "candidate-pair") && (stat.nominated==true)){
					
					session.rpcs[UUID].stats['Peer-to-Peer Connection']._local_ice_id = stat.localCandidateId;
					session.rpcs[UUID].stats['Peer-to-Peer Connection']._remote_ice_id = stat.remoteCandidateId;
					session.rpcs[UUID].stats['Peer-to-Peer Connection'].Round_Trip_Time_ms = stat.currentRoundTripTime*1000;
					
				} else if ((stat.type=="track") && (stat.remoteSource==true)){
					
					
					if (stat.id in session.rpcs[UUID].stats){
						session.rpcs[UUID].stats[stat.id]._trackID = stat.trackIdentifier;
						session.rpcs[UUID].stats[stat.id].Buffer_Delay_in_ms = parseInt(1000*(parseFloat(stat.jitterBufferDelay) - session.rpcs[UUID].stats[stat.id]._jitter_delay)/(parseInt(stat.jitterBufferEmittedCount) - session.rpcs[UUID].stats[stat.id]._jitter_count)) || 0;
						session.rpcs[UUID].stats[stat.id]._jitter_delay = parseFloat(stat.jitterBufferDelay) || 0;
						session.rpcs[UUID].stats[stat.id]._jitter_count = parseInt(stat.jitterBufferEmittedCount) || 0;
						if ("frameWidth" in stat){
							if ("frameHeight" in stat){
								session.rpcs[UUID].stats[stat.id].Resolution = stat.frameWidth+" x "+stat.frameHeight;
								session.rpcs[UUID].stats[stat.id]._frameWidth = stat.frameWidth;
								session.rpcs[UUID].stats[stat.id]._frameHeight = stat.frameHeight;
							}
						}
					} else {
						var media = {};
						media._jitter_delay = parseFloat(stat.jitterBufferDelay) || 0;
						media._jitter_count = parseInt(stat.jitterBufferEmittedCount) || 0;
						media.Buffer_Delay_in_ms = 0;
						media._trackID = stat.trackIdentifier;
						session.rpcs[UUID].stats[stat.id] = media;
					}
					
					
				} else if (stat.type=="remote-candidate"){
					
					if (("_remote_ice_id" in  session.rpcs[UUID].stats['Peer-to-Peer Connection']) && (session.rpcs[UUID].stats['Peer-to-Peer Connection']._remote_ice_id != stat.id )){return;} // not matched to nominated one
					
					if ("candidateType" in stat){
						session.rpcs[UUID].stats['Peer-to-Peer Connection'].remote_candidateType = stat.candidateType;
						if (stat.candidateType === "relay"){
							if ("relayProtocol" in stat){
								session.rpcs[UUID].stats['Peer-to-Peer Connection'].remote_relayProtocol = stat.relayProtocol;
							}
							if ("ip" in stat){session.rpcs[UUID].stats['Peer-to-Peer Connection'].remote_relay_IP = stat.ip;}
						} else {
							try {
								delete session.rpcs[UUID].stats['Peer-to-Peer Connection'].local_relayIP;
								delete session.rpcs[UUID].stats['Peer-to-Peer Connection'].local_relayProtocol;
							} catch(e){}
						}
						
					}
					
					if ("networkType" in stat){
						session.rpcs[UUID].stats['Peer-to-Peer Connection'].remote_networkType = stat.networkType;
					}
					
					
				} else if (stat.type=="local-candidate"){
					
					if (("_local_ice_id" in  session.rpcs[UUID].stats['Peer-to-Peer Connection']) && (session.rpcs[UUID].stats['Peer-to-Peer Connection']._local_ice_id != stat.id )){return;} // not matched to nominated one
					
					if ("candidateType" in stat){
						session.rpcs[UUID].stats['Peer-to-Peer Connection'].local_candidateType = stat.candidateType;
						if (stat.candidateType === "relay"){
							if ("relayProtocol" in stat){
								session.rpcs[UUID].stats['Peer-to-Peer Connection'].local_relayProtocol = stat.relayProtocol;
							}
							if ("ip" in stat){session.rpcs[UUID].stats['Peer-to-Peer Connection'].local_relayIP = stat.ip;}
						} else {
							try {
								delete session.rpcs[UUID].stats['Peer-to-Peer Connection'].local_relayIP;
								delete session.rpcs[UUID].stats['Peer-to-Peer Connection'].local_relayProtocol;
							} catch(e){}
						}
					}
					
					if ("networkType" in stat){
						session.rpcs[UUID].stats['Peer-to-Peer Connection'].remote_networkType = stat.networkType;
					}
					
				
				} else if (stat.type == "transport"){
					if ("bytesReceived" in stat) {
						if ("_bytesReceived" in session.rpcs[UUID].stats['Peer-to-Peer Connection']){
							if (session.rpcs[UUID].stats['Peer-to-Peer Connection']._timestamp){
								if (stat.timestamp){
									session.rpcs[UUID].stats['Peer-to-Peer Connection'].total_recv_bitrate_kbps = parseInt(8*(stat.bytesReceived - session.rpcs[UUID].stats['Peer-to-Peer Connection']._bytesReceived)/(stat.timestamp - session.rpcs[UUID].stats['Peer-to-Peer Connection']._timestamp));
									hideStreamLowBandwidth(session.rpcs[UUID].stats['Peer-to-Peer Connection'].total_recv_bitrate_kbps, UUID);
								}
							}
						}
						session.rpcs[UUID].stats['Peer-to-Peer Connection']._bytesReceived = stat.bytesReceived;
					}
					if ("timestamp" in stat) {
						session.rpcs[UUID].stats['Peer-to-Peer Connection']._timestamp = stat.timestamp;
						if (!session.rpcs[UUID].stats['Peer-to-Peer Connection']._timestampStart){
							session.rpcs[UUID].stats['Peer-to-Peer Connection']._timestampStart = stat.timestamp;
						} else {
							session.rpcs[UUID].stats['Peer-to-Peer Connection'].time_active_minutes = parseInt((stat.timestamp - session.rpcs[UUID].stats['Peer-to-Peer Connection']._timestampStart)/600)/100;
						}
					}
				 
				} else if ((stat.type=="inbound-rtp") && ("trackId" in stat)){
					
					session.rpcs[UUID].stats[stat.trackId] = session.rpcs[UUID].stats[stat.trackId] || {};
					session.rpcs[UUID].stats[stat.trackId].Bitrate_in_kbps =  parseInt(8*(stat.bytesReceived - session.rpcs[UUID].stats[stat.trackId]._last_bytes)/( stat.timestamp - session.rpcs[UUID].stats[stat.trackId]._last_time));
					session.rpcs[UUID].stats[stat.trackId]._last_bytes = stat.bytesReceived || session.rpcs[UUID].stats[stat.trackId]._last_bytes;
					session.rpcs[UUID].stats[stat.trackId]._last_time = stat.timestamp || session.rpcs[UUID].stats[stat.trackId]._last_time;

					
					session.rpcs[UUID].stats._codecId = stat.codecId;
					session.rpcs[UUID].stats._codecIdTrackId = stat.trackId;
					
					if (stat.mediaType=="video"){
						session.rpcs[UUID].stats[stat.trackId].type = "Video Track"
						session.rpcs[UUID].stats[stat.trackId]._type = "video";
						if ((session.obsfix) && ("codec" in session.rpcs[UUID].stats) && (session.rpcs[UUID].stats.codec=="video/VP8")){
							session.rpcs[UUID].stats[stat.trackId].pliDelta = (stat.pliCount - session.rpcs[UUID].stats[stat.trackId].keyFramesRequested_pli) || 0;
							session.rpcs[UUID].stats[stat.trackId].nackTrigger = (stat.nackCount - session.rpcs[UUID].stats[stat.trackId].streamErrors_nackCount + session.rpcs[UUID].stats[stat.trackId].nackTrigger) || 0;
							
							log("OBS PLI FIX MODE ON");
							if ((session.rpcs[UUID].stats[stat.trackId].pliDelta===0) && (session.rpcs[UUID].stats[stat.trackId].nackTrigger >= session.obsfix)){ // heavy packet loss with no pliCount?
								session.requestKeyframe(UUID);
								session.rpcs[UUID].stats[stat.trackId].nackTrigger = 0;
								log("TRYING KEYFRAME");
							} else if (session.rpcs[UUID].stats[stat.trackId].pliDelta>0){
								session.rpcs[UUID].stats[stat.trackId].nackTrigger = 0;
							}
						} else if ((session.obsfix) && ("codec" in session.rpcs[UUID].stats) && (session.rpcs[UUID].stats.codec=="video/VP9")){
							session.rpcs[UUID].stats[stat.trackId].pliDelta = (stat.pliCount - session.rpcs[UUID].stats[stat.trackId].keyFramesRequested_pli) || 0;
							session.rpcs[UUID].stats[stat.trackId].nackTrigger = (stat.nackCount - session.rpcs[UUID].stats[stat.trackId].streamErrors_nackCount + session.rpcs[UUID].stats[stat.trackId].nackTrigger) || 0;
							
							log("OBS PLI FIX MODE ON");
							if ((session.rpcs[UUID].stats[stat.trackId].pliDelta===0) && (session.rpcs[UUID].stats[stat.trackId].nackTrigger >= (session.obsfix*4) )){ // heavy packet loss with no pliCount? well, VP9 will trigger hopefully not as often.
								session.requestKeyframe(UUID);
								session.rpcs[UUID].stats[stat.trackId].nackTrigger = 0;
								log("TRYING KEYFRAME");
							} else if (session.rpcs[UUID].stats[stat.trackId].pliDelta>0){
								session.rpcs[UUID].stats[stat.trackId].nackTrigger = 0;
							}
						}
						
						session.rpcs[UUID].stats[stat.trackId].keyFramesRequested_pli = stat.pliCount || 0;
						session.rpcs[UUID].stats[stat.trackId].streamErrors_nackCount = stat.nackCount || 0;
						
						//warnlog(stat);
						
						if ("framesPerSecond" in stat){
							session.rpcs[UUID].stats[stat.trackId].FPS = parseInt(stat.framesPerSecond);
						} else if (("framesDecoded" in stat) && (stat.timestamp)){
							
							var lastFramesDecoded = 0;
							var lastTimestamp = 0;
							try{
								lastFramesDecoded = session.rpcs[UUID].stats[stat.trackId]._framesDecoded;
								lastTimestamp = session.rpcs[UUID].stats[stat.trackId]._timestamp;
							} catch(e){}
							session.rpcs[UUID].stats[stat.trackId].FPS = parseInt(10*(stat.framesDecoded - lastFramesDecoded)/(stat.timestamp/1000 - lastTimestamp))/10;
							
							//session.rpcs[UUID].stats[stat.trackId].FPS = parseInt((stat.framesDecoded - lastFramesDecoded)/(stat.timestamp/1000 - lastTimestamp));
							session.rpcs[UUID].stats[stat.trackId]._framesDecoded = stat.framesDecoded;
							session.rpcs[UUID].stats[stat.trackId]._timestamp = stat.timestamp/1000;
							
						}
					
					
					} else if (stat.mediaType=="audio"){
						//log("AUDIO LEVEL: "+stat.audioLevel);
						session.rpcs[UUID].stats[stat.trackId].type = "Audio Track";
						session.rpcs[UUID].stats[stat.trackId]._type = "audio";
						if ("audioLevel" in stat){
							session.rpcs[UUID].stats[stat.trackId].audio_level = parseInt(parseFloat(stat.audioLevel)*10000)/10000.0;
						}
					}
					
					if ("packetsLost" in stat && "packetsReceived" in stat){
						
						if (!("_packetsLost" in session.rpcs[UUID].stats[stat.trackId])){
							session.rpcs[UUID].stats[stat.trackId]._packetsLost = stat.packetsLost;
						}
						if (!("_packetsReceived" in session.rpcs[UUID].stats[stat.trackId])){
							session.rpcs[UUID].stats[stat.trackId]._packetsReceived = stat.packetsReceived;
						}
						
						if (!("packetLoss_in_percentage" in session.rpcs[UUID].stats[stat.trackId])){
							session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage = 0;
						}
						
						session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage = session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage*0.35 + 0.65*((stat.packetsLost-session.rpcs[UUID].stats[stat.trackId]._packetsLost)*100.0)/((stat.packetsReceived-session.rpcs[UUID].stats[stat.trackId]._packetsReceived)+(stat.packetsLost-session.rpcs[UUID].stats[stat.trackId]._packetsLost)) || 0;
						
						if (session.rpcs[UUID].signalMeter && (session.rpcs[UUID].stats[stat.trackId]._type==="video")){
							if (session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage<0.01){
								if (session.rpcs[UUID].stats[stat.trackId].Bitrate_in_kbps==0){
									session.rpcs[UUID].signalMeter.dataset.level = 0;
								} else {
									session.rpcs[UUID].signalMeter.dataset.level = 5;
								}
							} else if (session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage<0.3){
								session.rpcs[UUID].signalMeter.dataset.level = 4;
							} else if (session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage<1.0){
								session.rpcs[UUID].signalMeter.dataset.level = 3;
							} else if (session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage<3.5){
								session.rpcs[UUID].signalMeter.dataset.level = 2;
							} else {
								session.rpcs[UUID].signalMeter.dataset.level = 1;
							} 
						}
							
						session.rpcs[UUID].stats[stat.trackId]._packetsReceived = stat.packetsReceived;
						session.rpcs[UUID].stats[stat.trackId]._packetsLost = stat.packetsLost; 
					}
					
				} else if (("_codecId" in session.rpcs[UUID].stats) && (stat.id == session.rpcs[UUID].stats._codecId)){
					
					if ("mimeType" in stat){
						if (session.rpcs[UUID].stats[session.rpcs[UUID].stats._codecIdTrackId]){
							session.rpcs[UUID].stats[session.rpcs[UUID].stats._codecIdTrackId].codec = stat.mimeType;
						} else {
							session.rpcs[UUID].stats[session.rpcs[UUID].stats._codecIdTrackId] = {};
							session.rpcs[UUID].stats[session.rpcs[UUID].stats._codecIdTrackId].codec = stat.mimeType;
						}
					}
					if ("frameHeight" in stat){
						if ("frameWidth" in stat){
							session.rpcs[UUID].stats.Resolution = parseInt(stat.frameWidth)+" x "+parseInt(stat.frameHeight);
						}
					}
					
					
				}
			});
			if (session.buffer!==false){
				playoutdelay(UUID);
			}
			setTimeout(function(){
				session.directorSpeakerMute();
				session.directorDisplayMute();
			},0);
		});
	} catch (e){errorlog(e);}
};

function playoutdelay(UUID){  // applies a delay to all videos
	try {
		var target_buffer = session.buffer || 0;
		target_buffer = parseFloat(target_buffer);
		
		if (session.buffer!==false){
			
			// if buffer is set, then session.sync will be set; at least to 0.
			
			var receivers = getReceivers2(UUID).reverse(); //session.rpcs[UUID].getReceivers().reverse();
			var video_delay = 0;
			receivers.forEach(function(receiver){
				try {
					for (var tid in session.rpcs[UUID].stats){
					
						if ((typeof( session.rpcs[UUID].stats[tid])=="object") && ("_trackID" in session.rpcs[UUID].stats[tid]) && (session.rpcs[UUID].stats[tid]._trackID===receiver.track.id) && ("Buffer_Delay_in_ms" in session.rpcs[UUID].stats[tid])){
							
							var sync_offset = 0.0;
							
							if (session.rpcs[UUID].stats[tid]._sync_offset){
								sync_offset = session.rpcs[UUID].stats[tid]._sync_offset;
							} else {
								session.rpcs[UUID].stats[tid]._sync_offset = 0;
							}
							
							sync_offset += target_buffer - session.rpcs[UUID].stats[tid].Buffer_Delay_in_ms;                   //  target_Butt
							
							if (sync_offset>target_buffer){
								sync_offset=target_buffer;
							}
							
							if (session.rpcs[UUID].stats[tid]._type=="audio"){
								if (receiver.track.id in session.rpcs[UUID].delayNode){
									log("updating audio delay");
									var audio_delay = video_delay - session.rpcs[UUID].stats[tid].Buffer_Delay_in_ms + session.sync; // video is typically showing greater delay than video
									if (audio_delay<0){audio_delay=0;}
									log("audio_delay : "+audio_delay);
									log("audioCtx : "+ session.audioCtx.currentTime);
									session.rpcs[UUID].delayNode[receiver.track.id].delayTime.setValueAtTime(parseFloat(audio_delay/1000.0), session.audioCtx.currentTime+1);
									session.rpcs[UUID].stats[tid].Audio_Sync_Delay_ms = audio_delay;
									
								}
							} else if (session.rpcs[UUID].stats[tid]._type=="video"){
								//log("THIS SHOULD BE BEFORE AUDIO - video track"+session.rpcs[UUID].stats[tid].type);
								video_delay = session.rpcs[UUID].stats[tid].Buffer_Delay_in_ms;
								if(sync_offset<0){sync_offset=0;}
								session.rpcs[UUID].stats[tid]._sync_offset = sync_offset;
								receiver.playoutDelayHint = parseFloat(sync_offset/1000);	  // only the video we are going to do the playout delay for; doesn't work well with audio.
							}
						}
					}
				} catch (e){errorlog(e);}
			});	
		}
	} catch (e){
		errorlog("device does not support playout delay");
	}
};

function printViewStats(menu, UUID) { // Stats for viewing a remote video
	if (!session.rpcs[UUID]){
		menu.innerHTML = "<br /><br /><br />Remote Publisher Disconnected";
		return;
	}

	var statsObj = session.rpcs[UUID].stats;
	var streamID = session.rpcs[UUID].streamID;
	var scrollLeft = menu.scrollLeft;
	var scrollTop = menu.scrollTop;
	menu.innerHTML = "StreamID: <b>" + streamID + "</b><br />";
	menu.innerHTML += printValues(statsObj);
	menu.scrollTop = scrollTop;
	menu.scrollLeft = scrollLeft;
}


function plotDataSimple(canvas, bitrate, nacks=0) {
	canvas.height = 50;
	canvas.width = 124;
	canvas.className = "canvasStats";
	var context = canvas.getContext("2d");
	if (isNaN(bitrate)) {
		bitrate = 0;
	}
	if (isNaN(nacks)) {
		nacks = 0;
	}
	var height = context.canvas.height;
	var width = context.canvas.width;

	var val = (10-nacks)/10;
	if (val>1){val=1;}
	else if (val<0){val=0;}

	var yScale = height / 4000;
	var x = width - 1;
	var y = height - bitrate * yScale;
	var w = 1;
	
	context.fillStyle = getColor(val);;
	context.fillRect(x, y, w, height);
	context.fillStyle = "#FFFFFF55";
	context.fillRect(x, y-2, w, 4);
	
	if (y-5>0){
		context.fillStyle = "#FFFFFF44";
		context.fillRect(x, y+2, w, 1);
	}

	context.putImageData(context.getImageData(1, 0, width - 1, height), 0, 0);
	context.clearRect(width - 1, 0, 1, height);
}

function printValues(obj) { // see: printViewStats
	var out = "";
	for (var key in obj) {
		if (typeof obj[key] === "object") {
			if (obj[key] != null) {
				var tmp = key;
				tmp = sanitizeChat((tmp));
				out += "<li><h2 title='" + tmp + "'>" + tmp + "</h2></li>"
				out += printValues(obj[key]);
			}
		} else {
			if (key.startsWith("_")) {
				// if it starts with _, we don't want to show it.
			} else {
				try {
					var unit = '';

					var value = obj[key];

					var stat = sanitizeChat(key);

					if (typeof obj[key] == "string") {
						value = sanitizeChat((value));
					}

				
					if (key == 'useragent') {
						value = "<span style='cursor: pointer;' onclick='copyFunction(this.innerText,event);' title='Copy this user-agent to the clipboard' style='cursor:pointer'>"+value+"</span>"
					}

					if (key == 'Bitrate_in_kbps') {
						var unit = " kbps";
						stat = "Bitrate";
					}
					else if (key == 'type') {
						var unit = "";
						stat = 'Type';

						if (value == "Audio Track") {
							value = "🔊 " + value;
							//out += "<button onclick='disableTrack()'></button>";
						}

						if (value == "Video Track") {
							value = "📺 " + value;
						}

					}
					else if (key == 'packetLoss_in_percentage') {
						var unit = " %";
						stat = 'Packet Loss 📶';
						value = parseInt(parseFloat(value) * 10000) / 10000.0;
					}
					else if (key == 'local_relayIP') {
						value = "<a href='https://whatismyipaddress.com/ip/" + value + "' target='_blank'>" + value + "</a>";
					}
					else if (key == 'remote_relay_IP') {
						value = "<a href='https://whatismyipaddress.com/ip/" + value + "' target='_blank'>" + value + "</a>";
					}
					else if (key == 'local_candidateType') {
						if (value == "relay") {
							value = "💸 relay server";
						}
					}
					else if (key == 'remote_candidateType') {
						if (value == "relay") {
							value = "💸 relay server";
						}
					}
					else if (key == 'height_url') {
						if (value == false) {
							continue;
						}
					}
					else if (key == 'width_url') {
						if (value == false) {
							continue;
						}
					}
					else if (key == 'height_url') {
						if (value == false) {
							continue;
						}
					}
					else if (key == 'version') {
						stat = "VDO.Ninja Version";
					} else if (key == 'platform') {
						stat = "Platform (OS)";
					}
					else if (key == 'aec_url') {
						stat = "Echo-Cancellation";
					}
					else if (key == 'agc_url') {
						stat = "Auto-Gain (agc)";
					}
					else if (key == 'denoise_url') {
						stat = "De-noising ";
					}
					else if (key == 'audio_level') {
						stat = "Audio Level";
					}
					else if (key == 'Buffer_Delay_in_ms') {
						var unit = " ms";
						stat = 'Buffer Delay';
					}
					else if (value === null) {
						value = "null";
					}
					else if (key == "stereo_url") {
						stat = "Pro-Audio<br />(Stereo-mode)";
						if (value == 3) {
							value = "3 (outbound hi-fi)<br />Use Headphones";
						} else if (value == 1) {
							value = "1 (in & out hi-fi)<br />Use Headphones";
						} else if (value == 2) {
							value = "3 (inbound hi-fi)";
						} else if (value == 4) {
							value = "3 (multichannel)<br />Use Headphones";
						} else if (value == 5) {
							value = "5 (auto-mode)<br />Use Headphones";
						}
					}
					else if (value === false) {
						continue
					} 
					else if (value === "false") {
						continue
					}
					out += "<li><span>" + stat + "</span><span>" + value + unit + "</span></li>";
				} catch (e) {
					warnlog(e);
				}
			}
		}
	}
	return out;
}

function processMeshcastStats(UUID){
	try {
		session.rpcs[UUID].mc.getStats().then(function(stats){
			if (!(UUID in session.rpcs)){return;}
			
			if (!session.rpcs[UUID].stats['Meshcast Connection']){
				session.rpcs[UUID].stats['Meshcast Connection'] = {};
			}
				
			stats.forEach(stat=>{
				
				if ((stat.type == "candidate-pair") && (stat.nominated==true)){
					
					session.rpcs[UUID].stats['Meshcast Connection']._local_ice_id = stat.localCandidateId;
					session.rpcs[UUID].stats['Meshcast Connection']._remote_ice_id = stat.remoteCandidateId;
					session.rpcs[UUID].stats['Meshcast Connection'].Round_Trip_Time_ms = stat.currentRoundTripTime*1000;
					
				} else if ((stat.type=="track") && (stat.remoteSource==true)){
					
					
					if (stat.id in session.rpcs[UUID].stats){
						session.rpcs[UUID].stats[stat.id]._trackID = stat.trackIdentifier;
						session.rpcs[UUID].stats[stat.id].Buffer_Delay_in_ms = parseInt(1000*(parseFloat(stat.jitterBufferDelay) - session.rpcs[UUID].stats[stat.id]._jitter_delay)/(parseInt(stat.jitterBufferEmittedCount) - session.rpcs[UUID].stats[stat.id]._jitter_count)) || 0;
						session.rpcs[UUID].stats[stat.id]._jitter_delay = parseFloat(stat.jitterBufferDelay) || 0;
						session.rpcs[UUID].stats[stat.id]._jitter_count = parseInt(stat.jitterBufferEmittedCount) || 0;
						if ("frameWidth" in stat){
							if ("frameHeight" in stat){
								session.rpcs[UUID].stats[stat.id].Resolution = stat.frameWidth+" x "+stat.frameHeight;
								session.rpcs[UUID].stats[stat.id]._frameWidth = stat.frameWidth;
								session.rpcs[UUID].stats[stat.id]._frameHeight = stat.frameHeight;
							}
						}
					} else {
						var media = {};
						media._jitter_delay = parseFloat(stat.jitterBufferDelay) || 0;
						media._jitter_count = parseInt(stat.jitterBufferEmittedCount) || 0;
						media.Buffer_Delay_in_ms = 0;
						media._trackID = stat.trackIdentifier;
						session.rpcs[UUID].stats[stat.id] = media;
					}
			
				} else if (stat.type=="remote-candidate"){
					
					if (("_remote_ice_id" in  session.rpcs[UUID].stats['Meshcast Connection']) && (session.rpcs[UUID].stats['Meshcast Connection']._remote_ice_id != stat.id )){return;} // not matched to nominated one
					
					if ("candidateType" in stat){
						session.rpcs[UUID].stats['Meshcast Connection'].remote_candidateType = stat.candidateType;
						if (stat.candidateType === "relay"){
							if ("relayProtocol" in stat){
								session.rpcs[UUID].stats['Meshcast Connection'].remote_relayProtocol = stat.relayProtocol;
							}
							if ("ip" in stat){session.rpcs[UUID].stats['Meshcast Connection'].remote_relay_IP = stat.ip;}
						} else {
							try {
								delete session.rpcs[UUID].stats['Meshcast Connection'].local_relayIP;
								delete session.rpcs[UUID].stats['Meshcast Connection'].local_relayProtocol;
							} catch(e){}
						}
						
					}
					
					if ("networkType" in stat){
						session.rpcs[UUID].stats['Meshcast Connection'].remote_networkType = stat.networkType;
					}
					
					
				} else if (stat.type=="local-candidate"){
					
					if (("_local_ice_id" in  session.rpcs[UUID].stats['Meshcast Connection']) && (session.rpcs[UUID].stats['Meshcast Connection']._local_ice_id != stat.id )){return;} // not matched to nominated one
					
					if ("candidateType" in stat){
						session.rpcs[UUID].stats['Meshcast Connection'].local_candidateType = stat.candidateType;
						if (stat.candidateType === "relay"){
							if ("relayProtocol" in stat){
								session.rpcs[UUID].stats['Meshcast Connection'].local_relayProtocol = stat.relayProtocol;
							}
							if ("ip" in stat){session.rpcs[UUID].stats['Meshcast Connection'].local_relayIP = stat.ip;}
						} else {
							try {
								delete session.rpcs[UUID].stats['Meshcast Connection'].local_relayIP;
								delete session.rpcs[UUID].stats['Meshcast Connection'].local_relayProtocol;
							} catch(e){}
						}
					}
					
					if ("networkType" in stat){
						session.rpcs[UUID].stats['Meshcast Connection'].remote_networkType = stat.networkType;
					}
					
				
				} else if (stat.type == "transport"){
					if ("bytesReceived" in stat) {
						if ("_bytesReceived" in session.rpcs[UUID].stats['Meshcast Connection']){
							if (session.rpcs[UUID].stats['Meshcast Connection']._timestamp){
								if (stat.timestamp){
									session.rpcs[UUID].stats['Meshcast Connection'].total_recv_bitrate_kbps = parseInt(8*(stat.bytesReceived - session.rpcs[UUID].stats['Meshcast Connection']._bytesReceived)/(stat.timestamp - session.rpcs[UUID].stats['Meshcast Connection']._timestamp));
								}
							}
						}
						session.rpcs[UUID].stats['Meshcast Connection']._bytesReceived = stat.bytesReceived;
					}
					if ("timestamp" in stat) {
						session.rpcs[UUID].stats['Meshcast Connection']._timestamp = stat.timestamp;
						if (!session.rpcs[UUID].stats['Meshcast Connection']._timestampStart){
							session.rpcs[UUID].stats['Meshcast Connection']._timestampStart = stat.timestamp;
						} else {
							session.rpcs[UUID].stats['Meshcast Connection'].time_active_minutes = parseInt((stat.timestamp - session.rpcs[UUID].stats['Meshcast Connection']._timestampStart)/600)/100;
						}
					}
				 
				} else if ((stat.type=="inbound-rtp") && ("trackId" in stat)){
					
					session.rpcs[UUID].stats[stat.trackId] = session.rpcs[UUID].stats[stat.trackId] || {};
					session.rpcs[UUID].stats[stat.trackId].Bitrate_in_kbps =  parseInt(8*(stat.bytesReceived - session.rpcs[UUID].stats[stat.trackId]._last_bytes)/( stat.timestamp - session.rpcs[UUID].stats[stat.trackId]._last_time));
					session.rpcs[UUID].stats[stat.trackId]._last_bytes = stat.bytesReceived || session.rpcs[UUID].stats[stat.trackId]._last_bytes;
					session.rpcs[UUID].stats[stat.trackId]._last_time = stat.timestamp || session.rpcs[UUID].stats[stat.trackId]._last_time;

					
					session.rpcs[UUID].stats._codecId = stat.codecId;
					session.rpcs[UUID].stats._codecIdTrackId = stat.trackId;
					
					if (stat.mediaType=="video"){
						session.rpcs[UUID].stats[stat.trackId].type = "Video Track"
						session.rpcs[UUID].stats[stat.trackId]._type = "video";
						if ((session.obsfix) && ("codec" in session.rpcs[UUID].stats) && (session.rpcs[UUID].stats.codec=="video/VP8")){
							session.rpcs[UUID].stats[stat.trackId].pliDelta = (stat.pliCount - session.rpcs[UUID].stats[stat.trackId].keyFramesRequested_pli) || 0;
							session.rpcs[UUID].stats[stat.trackId].nackTrigger = (stat.nackCount - session.rpcs[UUID].stats[stat.trackId].streamErrors_nackCount + session.rpcs[UUID].stats[stat.trackId].nackTrigger) || 0;
							
							log("OBS PLI FIX MODE ON");
							if ((session.rpcs[UUID].stats[stat.trackId].pliDelta===0) && (session.rpcs[UUID].stats[stat.trackId].nackTrigger >= session.obsfix)){ // heavy packet loss with no pliCount?
								session.requestKeyframe(UUID);
								session.rpcs[UUID].stats[stat.trackId].nackTrigger = 0;
								log("TRYING KEYFRAME");
							} else if (session.rpcs[UUID].stats[stat.trackId].pliDelta>0){
								session.rpcs[UUID].stats[stat.trackId].nackTrigger = 0;
							}
						} else if ((session.obsfix) && ("codec" in session.rpcs[UUID].stats) && (session.rpcs[UUID].stats.codec=="video/VP9")){
							session.rpcs[UUID].stats[stat.trackId].pliDelta = (stat.pliCount - session.rpcs[UUID].stats[stat.trackId].keyFramesRequested_pli) || 0;
							session.rpcs[UUID].stats[stat.trackId].nackTrigger = (stat.nackCount - session.rpcs[UUID].stats[stat.trackId].streamErrors_nackCount + session.rpcs[UUID].stats[stat.trackId].nackTrigger) || 0;
							
							log("OBS PLI FIX MODE ON");
							if ((session.rpcs[UUID].stats[stat.trackId].pliDelta===0) && (session.rpcs[UUID].stats[stat.trackId].nackTrigger >= (session.obsfix*4) )){ // heavy packet loss with no pliCount? well, VP9 will trigger hopefully not as often.
								session.requestKeyframe(UUID);
								session.rpcs[UUID].stats[stat.trackId].nackTrigger = 0;
								log("TRYING KEYFRAME");
							} else if (session.rpcs[UUID].stats[stat.trackId].pliDelta>0){
								session.rpcs[UUID].stats[stat.trackId].nackTrigger = 0;
							}
						}
						
						session.rpcs[UUID].stats[stat.trackId].keyFramesRequested_pli = stat.pliCount || 0;
						session.rpcs[UUID].stats[stat.trackId].streamErrors_nackCount = stat.nackCount || 0;
						
						//warnlog(stat);
						
						if ("framesPerSecond" in stat){
							session.rpcs[UUID].stats[stat.trackId].FPS = parseInt(stat.framesPerSecond);
						} else if (("framesDecoded" in stat) && (stat.timestamp)){
							
							var lastFramesDecoded = 0;
							var lastTimestamp = 0;
							try{
								lastFramesDecoded = session.rpcs[UUID].stats[stat.trackId]._framesDecoded;
								lastTimestamp = session.rpcs[UUID].stats[stat.trackId]._timestamp;
							} catch(e){}
							session.rpcs[UUID].stats[stat.trackId].FPS = parseInt(10*(stat.framesDecoded - lastFramesDecoded)/(stat.timestamp/1000 - lastTimestamp))/10;
							
							//session.rpcs[UUID].stats[stat.trackId].FPS = parseInt((stat.framesDecoded - lastFramesDecoded)/(stat.timestamp/1000 - lastTimestamp));
							session.rpcs[UUID].stats[stat.trackId]._framesDecoded = stat.framesDecoded;
							session.rpcs[UUID].stats[stat.trackId]._timestamp = stat.timestamp/1000;
							
						}
					
					
					} else if (stat.mediaType=="audio"){
						//log("AUDIO LEVEL: "+stat.audioLevel);
						session.rpcs[UUID].stats[stat.trackId].type = "Audio Track";
						session.rpcs[UUID].stats[stat.trackId]._type = "audio";
						if ("audioLevel" in stat){
							session.rpcs[UUID].stats[stat.trackId].audio_level = parseInt(parseFloat(stat.audioLevel)*10000)/10000.0;
						}
					}
					
					if ("packetsLost" in stat && "packetsReceived" in stat){
						
						if (!("_packetsLost" in session.rpcs[UUID].stats[stat.trackId])){
							session.rpcs[UUID].stats[stat.trackId]._packetsLost = stat.packetsLost;
						}
						if (!("_packetsReceived" in session.rpcs[UUID].stats[stat.trackId])){
							session.rpcs[UUID].stats[stat.trackId]._packetsReceived = stat.packetsReceived;
						}
						
						if (!("packetLoss_in_percentage" in session.rpcs[UUID].stats[stat.trackId])){
							session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage = 0;
						}
						
						session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage = session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage*0.35 + 0.65*((stat.packetsLost-session.rpcs[UUID].stats[stat.trackId]._packetsLost)*100.0)/((stat.packetsReceived-session.rpcs[UUID].stats[stat.trackId]._packetsReceived)+(stat.packetsLost-session.rpcs[UUID].stats[stat.trackId]._packetsLost)) || 0;
						
						if (session.rpcs[UUID].signalMeter && (session.rpcs[UUID].stats[stat.trackId]._type==="video")){
							if (session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage<0.01){
								if (session.rpcs[UUID].stats[stat.trackId].Bitrate_in_kbps==0){
									session.rpcs[UUID].signalMeter.dataset.level = 0;
								} else {
									session.rpcs[UUID].signalMeter.dataset.level = 5;
								}
							} else if (session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage<0.3){
								session.rpcs[UUID].signalMeter.dataset.level = 4;
							} else if (session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage<1.0){
								session.rpcs[UUID].signalMeter.dataset.level = 3;
							} else if (session.rpcs[UUID].stats[stat.trackId].packetLoss_in_percentage<3.5){
								session.rpcs[UUID].signalMeter.dataset.level = 2;
							} else {
								session.rpcs[UUID].signalMeter.dataset.level = 1;
							} 
						}
							
						session.rpcs[UUID].stats[stat.trackId]._packetsReceived = stat.packetsReceived;
						session.rpcs[UUID].stats[stat.trackId]._packetsLost = stat.packetsLost; 
					}
					
				} else if (("_codecId" in session.rpcs[UUID].stats) && (stat.id == session.rpcs[UUID].stats._codecId)){
					
					if ("mimeType" in stat){
						if (session.rpcs[UUID].stats[session.rpcs[UUID].stats._codecIdTrackId]){
							session.rpcs[UUID].stats[session.rpcs[UUID].stats._codecIdTrackId].codec = stat.mimeType;
						} else {
							session.rpcs[UUID].stats[session.rpcs[UUID].stats._codecIdTrackId] = {};
							session.rpcs[UUID].stats[session.rpcs[UUID].stats._codecIdTrackId].codec = stat.mimeType;
						}
					}
					if ("frameHeight" in stat){
						if ("frameWidth" in stat){
							session.rpcs[UUID].stats.Resolution = parseInt(stat.frameWidth)+" x "+parseInt(stat.frameHeight);
						}
					}
					
				}
			});
		});
	} catch (e){errorlog(e);}
}
		

function printMyStats(menu) { // see: setupStatsMenu
	var scrollLeft = getById("menuStatsBox").scrollLeft;
	var scrollTop = getById("menuStatsBox").scrollTop;
	menu.innerHTML = ""; 
	
	session.stats.outbound_connections = Object.keys(session.pcs).length;
	session.stats.inbound_connections = Object.keys(session.rpcs).length;
	
	try {
		var obscam = false;
		if (document.querySelector("select#videoSource3")){
			var videoSelect = document.querySelector("select#videoSource3").options;
			if (videoSelect.length){
				log(videoSelect[videoSelect.selectedIndex].text);
				if (videoSelect[videoSelect.selectedIndex].text.startsWith("OBS-Camera")) { // OBS Virtualcam
					obscam = true;
				} else if (videoSelect[videoSelect.selectedIndex].text.startsWith("OBS Virtual Camera")) { // OBS Virtualcam
					obscam = true;
				} 
			}
		}
		
		if (session.streamSrc && session.streamSrc){
			session.streamSrc.getVideoTracks().forEach(function(track) {
				session.currentCameraConstraints = track.getSettings();
				
				if (obscam && (parseInt(session.currentCameraConstraints.frameRate) == 30)) {
					session.stats.video_settings =(session.currentCameraConstraints.width || 0) + "x" + (session.currentCameraConstraints.height || 0);
				} else {
					var framerateFPS = session.currentCameraConstraints.frameRate;
					if (framerateFPS){
						session.stats.video_settings = (session.currentCameraConstraints.width || 0) + "x" + (session.currentCameraConstraints.height || 0) + " @ " + (parseInt(framerateFPS * 100) / 100.0) + "fps";
					} else {
						session.stats.video_settings = (session.currentCameraConstraints.width || 0) + "x" + (session.currentCameraConstraints.height || 0);
					}
				}
			});
		}
	} catch(e){errorlog(e);}

	function printViewValues(obj) { 
		
		if (!(document.getElementById("menuStatsBox"))){
			return;
		}
		
		for (var key in obj) {
			if (typeof obj[key] === "object") {
				try{
					var tmp = key;
					tmp = sanitizeChat((tmp));
					menu.innerHTML += "<li><h2 title='" + tmp + "'>" + tmp + "</h2></li>"
				} catch(e){}
				printViewValues(obj[key]);
				menu.innerHTML += "<hr />";
			} else {

				if (key.startsWith("_")){continue;}
				
				var stat = sanitizeChat(key);
				var value = obj[key];
				if (typeof value == "string") {
					value = sanitizeChat((value));
				}
				
				if (value === false){continue;}
				
				if (key == 'useragent') {
					value = "<span style='cursor: pointer;' onclick='copyFunction(this.innerText,event);' title='Copy this user-agent to the clipboard' style='cursor:pointer'>"+value+"</span>"
				}

				if (key == 'local_relayIP') {
					value = "<a href='https://whatismyipaddress.com/ip/" + value + "' target='_blank'>" + value + "</a>";
				}
				if (key == 'remote_relay_IP') {
					value = "<a href='https://whatismyipaddress.com/ip/" + value + "' target='_blank'>" + value + "</a>";
				}
				if (key == 'local_candidateType') {
					if (value == "relay") {
						value = "💸 relay server";
					}
				}
				if (key == 'remote_candidateType') {
					if (value == "relay") {
						value = "💸 relay server";
					}
				}

				menu.innerHTML += "<li><span>" + stat + "</span><span>" + value + "</span></li>";
			}
		}
	}
	printViewValues(session.stats);
	menu.innerHTML += "<button onclick='session.forcePLI(null,event);' data-translate='send-keyframe-to-viewer'>Send Keyframe to Viewers</button>";
	
	if (session.mc && session.mc.stats){
		printViewValues(session.mc.stats);
		menu.innerHTML += "<hr>";
	}
	for (var uuid in session.pcs) {
		printViewValues(session.pcs[uuid].stats);
		menu.innerHTML += "<hr>";
	}
	if ((iOS) || (iPad)){
		menu.innerHTML += "<br /><div style='height:100px'></div>";
	}
	try {
		getById("menuStatsBox").scrollLeft = scrollLeft;
		getById("menuStatsBox").scrollTop = scrollTop;
	} catch (e) {}
}


function publisherMeshcastStats(){
	
}

function updateLocalStats(){
	
	var totalBitrate = 0;
	var totalBitrate2 = 0;
	var cpuLimited = false;
	var conLimited = 0;
	var totalVideo = 0;
	var totalAudio = 0;
	var totalScenes = 0;
	var meshcastActive = false;
	
	if (session.mc && session.mc.getSenders && session.mc.stats){
		try {
			var atot = 0;
			var senders = session.mc.getSenders(); // for any connected peer, update the video they have if connected with a video already.
			senders.forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
				if (sender.track && sender.track.kind == "video" && sender.track.enabled) {
					meshcastActive = true;
				} else if (sender.track && sender.track.kind == "audio" && sender.track.enabled && !session.muted) {
					meshcastActive = true;
				}
			});
			//totalAudio += atot;
			
			if ("video_bitrate_kbps" in session.mc.stats){
				totalBitrate+=session.mc.stats.video_bitrate_kbps || 0;
			}
			if ("audio_bitrate_kbps" in session.mc.stats){
				totalBitrate+=session.mc.stats.audio_bitrate_kbps || 0;
			}
			if ("total_sending_bitrate_kbps" in session.mc.stats){
				totalBitrate2+=session.mc.stats.total_sending_bitrate_kbps || 0;
			}
			
			if ("quality_limitation_reason" in session.mc.stats){
				if (session.mc.stats.quality_limitation_reason == "cpu"){
					cpuLimited=true;
				}
			}
			
			setTimeout(function(){

				if (!session.mc){return;}
				session.mc.getStats().then(function(stats) {
					if ("audio_bitrate_kbps" in session.mc.stats){
						session.mc.stats.audio_bitrate_kbps=0;
					}
					stats.forEach(stat => {
						if (stat.type == "transport"){
							if ("bytesSent" in stat) {
								if ("_bytesSent" in session.mc.stats){
									if (session.mc.stats._timestamp){
										if (stat.timestamp){
											session.mc.stats.total_sending_bitrate_kbps = parseInt(8*(stat.bytesSent - session.mc.stats._bytesSent)/(stat.timestamp - session.mc.stats._timestamp));
										}
									}
								}
								session.mc.stats._bytesSent = stat.bytesSent;
							}
							if ("timestamp" in stat) {
								session.mc.stats._timestamp = stat.timestamp;
							}
						} else if (stat.type == "outbound-rtp") {
							if (stat.kind == "video") {
								
								if ("framesPerSecond" in stat) {
									session.mc.stats.resolution = stat.frameWidth + " x " + stat.frameHeight + " @ " + stat.framesPerSecond;
								}
								if ("encoderImplementation" in stat) {
									session.mc.stats.video_encoder = stat.encoderImplementation;
									if (stat.encoderImplementation=="ExternalEncoder"){
										session.mc.stats._hardwareEncoder = true; // I won't set this to false again, just because once I know it has one, I just need to assume it could always be used unexpectednly
										session.mc.encoder = true;
										
									} else {
										session.mc.encoder = false; // this may not be actually accurate, but lets assume so.
									}
								}
								if ("qualityLimitationReason" in stat) {
									if (session.mc.stats.quality_limitation_reason){
										if (session.mc.stats.quality_limitation_reason !== stat.qualityLimitationReason){
											try{
												var miniInfo = {};
												miniInfo.qlr = stat.qualityLimitationReason;
												if ("_hardwareEncoder" in session.mc.stats){
													miniInfo.hw_enc = session.mc.stats._hardwareEncoder;
												} else {
													miniInfo.hw_enc = null;
												}
												session.sendMessage({"miniInfo":miniInfo});
											} catch(e){warnlog(e);}
										}
									}
									session.mc.stats.quality_limitation_reason = stat.qualityLimitationReason;
								}
								
								if ("bytesSent" in stat) {
									if ("_bytesSentVideo" in session.mc.stats){
										if (session.mc.stats._timestamp1){
												session.mc.stats.video_bitrate_kbps = parseInt(8*(stat.bytesSent - session.mc.stats._bytesSentVideo)/(stat.timestamp - session.mc.stats._timestamp1));
											if (stat.timestamp){
											}
										}
									}
									session.mc.stats._bytesSentVideo = stat.bytesSent;
								}
								
								if ("nackCount" in stat) {
									if ("_nackCount" in session.mc.stats){
										if (session.mc.stats._timestamp1){
											if (stat.timestamp){
												session.mc.stats.nacks_per_second = parseInt(10000*(stat.nackCount - session.mc.stats._nackCount)/(stat.timestamp - session.mc.stats._timestamp1))/10;
											}
										}
									}
								}
								if ("retransmittedBytesSent" in stat) {
									if ("_retransmittedBytesSent" in session.mc.stats){
										if (session.mc.stats._timestamp1){
											if (stat.timestamp){
												session.mc.stats.retransmitted_kbps = parseInt(8*(stat.retransmittedBytesSent - session.mc.stats._retransmittedBytesSent)/(stat.timestamp - session.mc.stats._timestamp1));
											}
										}
									}
								}
								
								if ("nackCount" in stat) {
									session.mc.stats._nackCount = stat.nackCount;
								}
								
								if ("retransmittedBytesSent" in stat) {
									session.mc.stats._retransmittedBytesSent = stat.retransmittedBytesSent;
									
								}
								
								if ("timestamp" in stat) {
									session.mc.stats._timestamp1 = stat.timestamp;
								}
								
								if ("pliCount" in stat) {
									session.mc.stats.total_pli_count = stat.pliCount;
								}
								if ("keyFramesEncoded" in stat) {
									session.mc.stats.total_key_frames_encoded = stat.keyFramesEncoded;
								}
								
								
							} else if (stat.kind == "audio") {
								if ("bytesSent" in stat) {
									if (session.mc.stats._bytesSentAudio){
										if (session.mc.stats._timestamp2){
											if (stat.timestamp){
												if ("audio_bitrate_kbps" in session.mc.stats){
													session.mc.stats.audio_bitrate_kbps += parseInt(8*(stat.bytesSent - session.mc.stats._bytesSentAudio)/(stat.timestamp - session.mc.stats._timestamp2));
												} else {
													session.mc.stats.audio_bitrate_kbps=0;
												}
											}
										}
									}
								}
								if ("timestamp" in stat) {
									session.mc.stats._timestamp2 = stat.timestamp;
								}
								
								if ("bytesSent" in stat) {
									session.mc.stats._bytesSentAudio = stat.bytesSent;
									
								}
							}
						} else if (stat.type == "remote-candidate") {
							
							if ("candidateType" in stat) {
								session.mc.stats.remote_candidateType = stat.candidateType;
								if (stat.candidateType === "relay"){
									if ("ip" in stat) {
										session.mc.stats.remote_relay_IP = stat.ip;
									}
									if ("relayProtocol" in stat) {
										session.mc.stats.remote_relayProtocol = stat.relayProtocol;	
									}									
								} else {
									try {
										delete session.mc.stats.remote_relay_IP;
										delete session.mc.stats.remote_relayProtocol;
									} catch(e){}
								}
							}
						} else if (stat.type == "local-candidate") {
							if ("candidateType" in stat) {
								session.mc.stats.local_candidateType = stat.candidateType;
								
								if (stat.candidateType === "relay"){
									if ("ip" in stat) {
										session.mc.stats.local_relayIP = stat.ip;
									}
									if ("relayProtocol" in stat) {
										session.mc.stats.local_relayProtocol = stat.relayProtocol;								
									}
								} else {
									try {
										delete session.mc.stats.local_relayIP;
										delete session.mc.stats.local_relayProtocol;
									} catch(e){}
								}
								
							}
						} else if ((stat.type == "candidate-pair" ) && (stat.nominated)) {
									
							if ("availableOutgoingBitrate" in stat){
								session.mc.stats.available_outgoing_bitrate_kbps = parseInt(stat.availableOutgoingBitrate/1024);
								if (session.maxBandwidth!==false){
									session.limitMaxBandwidth(session.mc.stats.available_outgoing_bitrate_kbps, session.mc, true);
								}
							}
							if ("totalRoundTripTime" in stat){
								if ("responsesReceived" in stat){
									session.mc.stats.average_roundTripTime_ms = parseInt((stat.totalRoundTripTime/stat.responsesReceived)*1000);
								}
							}
						}
						return;
					});
					return;
				});
			}, 0);
		} catch(e){errorlog(e);}
	}
	
	for (var uuid in session.pcs) {
		var atot = 0;
		var senders = getSenders2(uuid); // for any connected peer, update the video they have if connected with a video already.
		senders.forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
			if (sender.track && sender.track.kind == "video" && sender.track.enabled) {
				totalVideo+=1
			} else if (sender.track && sender.track.kind == "audio" && sender.track.enabled && !session.muted) {
				atot=1;
			}
		});
		totalAudio += atot;
		
		if ("scene" in session.pcs[uuid]){
			if (session.pcs[uuid].scene!==false){
				totalScenes+=1;
			}
		}
		
		if ("video_bitrate_kbps" in session.pcs[uuid].stats){
			totalBitrate+=session.pcs[uuid].stats.video_bitrate_kbps || 0;
		}
		if ("audio_bitrate_kbps" in session.pcs[uuid].stats){
			totalBitrate+=session.pcs[uuid].stats.audio_bitrate_kbps || 0;
		}
		if ("total_sending_bitrate_kbps" in session.pcs[uuid].stats){
			totalBitrate2+=session.pcs[uuid].stats.total_sending_bitrate_kbps || 0;
		}
		
		if ("quality_limitation_reason" in session.pcs[uuid].stats){
			if (session.pcs[uuid].stats.quality_limitation_reason == "cpu"){
				cpuLimited=true;
			}
		}
		
		if (uuid in session.rpcs){
			if (session.pcs[uuid].stats.label){
				session.pcs[uuid].stats.label = session.rpcs[uuid].label;
			}
			if (session.pcs[uuid].stats.streamID){
				session.pcs[uuid].stats.streamID = session.rpcs[uuid].streamID;
			}
		}
		
		setTimeout(function(UUID) {
			if (!( session.pcs[UUID])){return;}
			session.pcs[UUID].getStats().then(function(stats) {
				if (!(UUID in session.pcs)){return;}
				
				if ("audio_bitrate_kbps" in session.pcs[UUID].stats){
					session.pcs[UUID].stats.audio_bitrate_kbps=0;
				}
				stats.forEach(stat => {
					if (stat.type == "transport"){
						if ("bytesSent" in stat) {
							if ("_bytesSent" in session.pcs[UUID].stats){
								if (session.pcs[UUID].stats._timestamp){
									if (stat.timestamp){
										session.pcs[UUID].stats.total_sending_bitrate_kbps = parseInt(8*(stat.bytesSent - session.pcs[UUID].stats._bytesSent)/(stat.timestamp - session.pcs[UUID].stats._timestamp));
									}
								}
							}
							session.pcs[UUID].stats._bytesSent = stat.bytesSent;
						}
						if ("timestamp" in stat) {
							session.pcs[UUID].stats._timestamp = stat.timestamp;
						}
					} else if (stat.type == "outbound-rtp") {
						if (stat.kind == "video") {
							
							if ("framesPerSecond" in stat) {
								session.pcs[UUID].stats.resolution = stat.frameWidth + " x " + stat.frameHeight + " @ " + stat.framesPerSecond;
							}
							if ("encoderImplementation" in stat) {
								session.pcs[UUID].stats.video_encoder = stat.encoderImplementation;
								if (stat.encoderImplementation=="ExternalEncoder"){
									session.pcs[UUID].stats._hardwareEncoder = true; // I won't set this to false again, just because once I know it has one, I just need to assume it could always be used unexpectednly
									session.pcs[UUID].encoder = true;
									
								} else {
									session.pcs[UUID].encoder = false; // this may not be actually accurate, but lets assume so.
								}
							}
							if ("qualityLimitationReason" in stat) {
								if (session.pcs[UUID].stats.quality_limitation_reason){
									if (session.pcs[UUID].stats.quality_limitation_reason !== stat.qualityLimitationReason){
										try{
											var miniInfo = {};
											miniInfo.qlr = stat.qualityLimitationReason;
											if ("_hardwareEncoder" in session.pcs[UUID].stats){
												miniInfo.hw_enc = session.pcs[UUID].stats._hardwareEncoder;
											} else {
												miniInfo.hw_enc = null;
											}
											session.sendMessage({"miniInfo":miniInfo}, UUID);
										} catch(e){warnlog(e);}
									}
								}
								session.pcs[UUID].stats.quality_limitation_reason = stat.qualityLimitationReason;
							}
							
							if ("bytesSent" in stat) {
								if ("_bytesSentVideo" in session.pcs[UUID].stats){
									if (session.pcs[UUID].stats._timestamp1){
											session.pcs[UUID].stats.video_bitrate_kbps = parseInt(8*(stat.bytesSent - session.pcs[UUID].stats._bytesSentVideo)/(stat.timestamp - session.pcs[UUID].stats._timestamp1));
										if (stat.timestamp){
										}
									}
								}
								session.pcs[UUID].stats._bytesSentVideo = stat.bytesSent;
							}
							
							if ("nackCount" in stat) {
								if ("_nackCount" in session.pcs[UUID].stats){
									if (session.pcs[UUID].stats._timestamp1){
										if (stat.timestamp){
											session.pcs[UUID].stats.nacks_per_second = parseInt(10000*(stat.nackCount - session.pcs[UUID].stats._nackCount)/(stat.timestamp - session.pcs[UUID].stats._timestamp1))/10;
										}
									}
								}
							}
							if ("retransmittedBytesSent" in stat) {
								if ("_retransmittedBytesSent" in session.pcs[UUID].stats){
									if (session.pcs[UUID].stats._timestamp1){
										if (stat.timestamp){
											session.pcs[UUID].stats.retransmitted_kbps = parseInt(8*(stat.retransmittedBytesSent - session.pcs[UUID].stats._retransmittedBytesSent)/(stat.timestamp - session.pcs[UUID].stats._timestamp1));
										}
									}
								}
							}
							
							if ("nackCount" in stat) {
								session.pcs[UUID].stats._nackCount = stat.nackCount;
							}
							
							if ("retransmittedBytesSent" in stat) {
								session.pcs[UUID].stats._retransmittedBytesSent = stat.retransmittedBytesSent;
								
							}
							
							if ("timestamp" in stat) {
								session.pcs[UUID].stats._timestamp1 = stat.timestamp;
							}
							
							if ("pliCount" in stat) {
								session.pcs[UUID].stats.total_pli_count = stat.pliCount;
							}
							if ("keyFramesEncoded" in stat) {
								session.pcs[UUID].stats.total_key_frames_encoded = stat.keyFramesEncoded;
							}
							
							
						} else if (stat.kind == "audio") {
							if ("bytesSent" in stat) {
								if (session.pcs[UUID].stats._bytesSentAudio){
									if (session.pcs[UUID].stats._timestamp2){
										if (stat.timestamp){
											if ("audio_bitrate_kbps" in session.pcs[UUID].stats){
												session.pcs[UUID].stats.audio_bitrate_kbps += parseInt(8*(stat.bytesSent - session.pcs[UUID].stats._bytesSentAudio)/(stat.timestamp - session.pcs[UUID].stats._timestamp2));
											} else {
												session.pcs[UUID].stats.audio_bitrate_kbps=0;
											}
										}
									}
								}
							}
							if ("timestamp" in stat) {
								session.pcs[UUID].stats._timestamp2 = stat.timestamp;
							}
							
							if ("bytesSent" in stat) {
								session.pcs[UUID].stats._bytesSentAudio = stat.bytesSent;
								
							}
						}
					} else if (stat.type == "remote-candidate") {
						if ("relayProtocol" in stat) {
							
						}
						if ("candidateType" in stat) {
							session.pcs[UUID].stats.remote_candidateType = stat.candidateType;
							if (stat.candidateType === "relay"){
								if ("ip" in stat) {
									session.pcs[UUID].stats.remote_relay_IP = stat.ip;
								}
								if ("relayProtocol" in stat) {
									session.pcs[UUID].stats.remote_relayProtocol = stat.relayProtocol;								
								}
							} else {
								try {
									delete session.pcs[UUID].stats.remote_relay_IP;
									delete session.pcs[UUID].stats.remote_relayProtocol;
								} catch(e){}
							}
						}
					} else if (stat.type == "local-candidate") {
						if ("candidateType" in stat) {
							session.pcs[UUID].stats.local_candidateType = stat.candidateType;
							
							if (stat.candidateType === "relay"){
								if ("ip" in stat) {
									session.pcs[UUID].stats.local_relayIP = stat.ip;
								}
								if ("relayProtocol" in stat) {
									session.pcs[UUID].stats.local_relayProtocol = stat.relayProtocol;								
								}
							} else {
								try {
									delete session.pcs[UUID].stats.local_relayIP;
									delete session.pcs[UUID].stats.local_relayProtocol;
								} catch(e){}
							}
							
						}
					} else if ((stat.type == "candidate-pair" ) && (stat.nominated)) {
								
						if ("availableOutgoingBitrate" in stat){
							session.pcs[UUID].stats.available_outgoing_bitrate_kbps = parseInt(stat.availableOutgoingBitrate/1024);
							if (session.maxBandwidth!==false){
								session.limitMaxBandwidth(session.pcs[UUID].stats.available_outgoing_bitrate_kbps, session.pcs[UUID], false);
							}
						}
						if ("totalRoundTripTime" in stat){
							if ("responsesReceived" in stat){
								session.pcs[UUID].stats.average_roundTripTime_ms = parseInt((stat.totalRoundTripTime/stat.responsesReceived)*1000);
							}
						}
					}
					return;
				});
				return;
			});
		}, 0, uuid);
	}
	
	try{
		var headerStats = "<span title='Number of outbound connections'>🔗 ";
		headerStats += Object.keys(session.pcs).length || 0;
		if (meshcastActive){
			if (totalAudio){
				headerStats += "</span>, <span title='Number of outbound audio streams'>👂 "+totalAudio;
			}
			if (totalVideo){
				headerStats += "</span>, <span title='Number of outbound video streams'>👀 "+totalVideo;
			}
			headerStats += "</span>, <span title='Publishing to a Meshcast broadcasting server''>📡Broadcast";
		} else {
			headerStats += "</span>, <span title='Number of outbound audio streams'>👂 "+totalAudio;
			headerStats += "</span>, <span title='Number of outbound video streams'>👀 "+totalVideo;
		}
		if (session.roomid){
			headerStats += "</span>, <span title='Number of scenes.'>🎬 "+totalScenes+"</span>";
		}
	} catch(e){}
	
	if (Firefox){
		// does not support the current stats system
	} else if (totalBitrate2>1000){
		headerStats += ", <span title='Total upload bitrate'>🔼 "+(Math.round(totalBitrate2/10.24)/100) + "<small>-mbps</small></span>";
	} else{
		headerStats += ", <span title='Total upload bitrate'>🔼 "+totalBitrate2 + "<small>-kbps</small></span>";
	}
	if (cpuLimited){
		headerStats += ", <span style='color: #e69a0f;' title='Your CPU is maxed out; this can cause audio, sync, and quality issues.'>🔥 CPU Overloaded</span>";
	}
	
	if (session.cpuLimited!==cpuLimited){
		session.cpuLimited = cpuLimited;
		var miniInfo = {}
		miniInfo.cpu = cpuLimited;
		for (var uuid in session.pcs) {
			//if (session.directorList.indexOf(uuid)>=0){
			session.sendMessage({"miniInfo":miniInfo}, uuid); // lets send it to everyone.
			//}
		}
	}
	
	try{
		if (Object.keys(session.pcs).length){
			getById("head5").classList.remove("hidden");
		}
	} catch(e){}
	getById("head5").innerHTML = headerStats;
	getById("head5").onclick = function(){
		var [menu, innerMenu] = statsMenuCreator();
		menu.interval = setInterval(printMyStats,3000, innerMenu);
		printMyStats(innerMenu);
	}
}


function updateStats(obsvc = false) {
	if (document.getElementById('previewWebcam')) {
		var ele = document.getElementById('previewWebcam');
		var wcs = "webcamstats";
	} else if  (document.getElementById('videosource')) {
		var ele = document.getElementById('videosource');
		var wcs = "webcamstats3";
	} else {
		return;
	}
	
	try {
		getById(wcs).innerHTML = ""; 
		ele.srcObject.getVideoTracks().forEach(
			function(track) {
				if ((obsvc) && (parseInt(track.getSettings().frameRate) == 30)) {
					getById(wcs).innerHTML = "Video Settings: " + (track.getSettings().width || 0) + "x" + (track.getSettings().height || 0) + " @ up to 60fps";
				} else {
					var framerateFPS = track.getSettings().frameRate;
					if (framerateFPS){
						getById(wcs).innerHTML = "Current Video Settings: " + (track.getSettings().width || 0) + "x" + (track.getSettings().height || 0) + "@" + (parseInt(framerateFPS * 100) / 100.0) + "fps";
					} else {
						getById(wcs).innerHTML = "Current Video Settings: " + (track.getSettings().width || 0) + "x" + (track.getSettings().height || 0);
					}
				}
			}
		);

	} catch (e) {
		errorlog(e);
	}
}

function toggleControlBar() {
	if (getById("controlButtons").style.display != 'none') {
		// Dont hardcode style here. Copy it over to data-style before changing to none;
		getById("controlButtons").dataset.style = getById("controlButtons").style.display;
		getById("controlButtons").style.display = 'none';
	} else {
		// Copy the style over from the data-style attribute.
		getById("controlButtons").style.display = getById("controlButtons").dataset.style;
	};
}




function toggleMute(apply = false, event=false) { // TODO: I need to have this be MUTE, toggle, with volume not touched.

	var mouseUp = null;
	var touchEnd = null;
	var timeStart = Date.now();
	if (event){
		mouseUp = document.onmouseup;
		touchEnd = document.ontouchend;
		document.onmouseup = function(){
			document.onmouseup = mouseUp;
			document.ontouchend = touchEnd;
			if (Date.now() - timeStart < 500){
				return;
			} else {
				toggleMute();
			}
		}
		document.ontouchend = function(){
			document.onmouseup = mouseUp;
			document.ontouchend = touchEnd;
			if (Date.now() - timeStart < 300){
				return;
			} else {
				toggleMute();
			}
		}
	}

	if (session.director) {
		if (!session.directorEnabledPPT) {
			log("Director doesn't have PPT enabled yet");
			// director has not enabled PTT yet.
			return;
		}
	}

	if (apply) {
		session.muted = !session.muted;  // we flip here as we are going to flip again in a second.
	}
	//try{var ptt = getById("press2talk");} catch(e){var ptt=false;}
	

	if (session.muted == false) {
		session.muted = true;
		getById("mutetoggle").className = "las la-microphone-slash my-float toggleSize";
		if (!(session.cleanOutput)){
			getById("mutebutton").classList.remove("float"); 
			getById("mutebutton").classList.add("float2"); 
			getById("mutebutton").classList.add("red"); 
			getById("mutebutton").classList.add("puslate"); 
			getById("header").classList.add('red');
			
			if (session.localMuteElement){
				session.localMuteElement.style.display = "block";
			}
			
		}
		if (session.streamSrc) {
			session.streamSrc.getAudioTracks().forEach((track) => {
				track.enabled = false;
			});
		}
		//if (ptt){
		//	ptt.innerHTML = "<span data-translate='Push-to-Mute'>🔇 Push to Talk</span>";
		//}

	} else {
		session.muted = false;
		getById("mutetoggle").className = "las la-microphone my-float toggleSize";
		if (!(session.cleanOutput)){
			
			getById("mutebutton").classList.add("float"); 
			getById("mutebutton").classList.remove("float2"); 
			getById("mutebutton").classList.remove("red"); 
			getById("mutebutton").classList.remove("puslate"); 
			
			getById("header").classList.remove('red');
			
			if (session.localMuteElement){
				session.localMuteElement.style.display = "none";
			}
			
		}
		if (session.streamSrc) {
			session.streamSrc.getAudioTracks().forEach((track) => {
				track.enabled = true;
			});
		}
		//if (ptt){
		//	ptt.innerHTML = "<span data-translate='Push-to-Mute'>🔴 Push to Mute</span>";
		//}
	}
	postMessageIframe(document.getElementById("screensharesource"), {"mic":!session.muted});

	if (!apply) { // only if they are changing states do we bother to spam.
		data = {};
		data.muteState = session.muted;
		session.sendMessage(data);
		log("SEND MUTE STATE TO PEERS");
		pokeIframeAPI('mic-mute-state', session.muted);
	}
}

function postMessageIframe(iFrameEle, message){ // iframes seem to only have the contentWindow work on the last placed iframe object, so this checks the dom first. 
	if (iFrameEle){
		try{
			if (iFrameEle.id && document.getElementById(iFrameEle.id)){
				document.getElementById(iFrameEle.id).contentWindow.postMessage(message, '*');
			} else {
				iFrameEle.contentWindow.postMessage(message, '*');
			}
		} catch(e){errorlog(e);}
	}
}

function toggleSpeakerMute(apply = false) { // TODO: I need to have this be MUTE, toggle, with volume not touched.

	if (CtrlPressed) {
		resetupAudioOut();
	}

	if (apply) {
		session.speakerMuted = !session.speakerMuted;
	}
	if (session.speakerMuted == false) { // mute output
		session.speakerMuted = true;
		getById("mutespeakertoggle").className = "las la-volume-mute my-float toggleSize";
		if (!(session.cleanOutput)){
			getById("mutespeakerbutton").className = "float2 red";
		}
		var sounds = document.getElementsByTagName("video");
		
		if (iOS || iPad){
			for (var i = 0; i < sounds.length; ++i) {
				sounds[i].muted = !sounds[i].muted;
				sounds[i].muted = session.speakerMuted;
			}
		} else {
			for (var i = 0; i < sounds.length; ++i) {
				sounds[i].muted = session.speakerMuted;
			}
		}

	} else {
		session.speakerMuted = false;  // unmute output

		getById("mutespeakertoggle").className = "las la-volume-up my-float toggleSize";
		if (!(session.cleanOutput)){
			getById("mutespeakerbutton").className = "float";
		}
		var sounds = document.getElementsByTagName("video");
		
		if (iOS || iPad){ // attempting to fix an iOS bug
			for (var i = 0; i < sounds.length; ++i) {
				sounds[i].muted = !sounds[i].muted;
				if (sounds[i].id === "videosource") { // don't unmute ourselves. feedback galore if so.
					sounds[i].muted = true;
					continue;
				} else if (sounds[i].id === "previewWebcam") {
					sounds[i].muted = true;
					continue;
				} else if (sounds[i].id === "screenshare") {
					sounds[i].muted = true;
					continue;
				} else {
					sounds[i].muted = session.speakerMuted;
				}
			}
		} else {
			for (var i = 0; i < sounds.length; ++i) {

				if (sounds[i].id === "videosource") { // don't unmute ourselves. feedback galore if so.
					continue;
				} else if (sounds[i].id === "previewWebcam") {
					continue;
				} else if (sounds[i].id === "screenshare") {
					continue;
				} else {
					sounds[i].muted = session.speakerMuted;
				}
			}
		}
		
	}

	for (var UUID in session.rpcs) {
		applyMuteState(UUID);
		postMessageIframe(session.rpcs[UUID].iframeEle, {"mute":session.speakerMuted}); 
	}
	
	pokeIframeAPI("audio-mute-state", session.speakerMuted);
	
	
	if ((iOS) || (iPad)) {
		resetupAudioOut();
	}
}

function toggleFileshare(UUID=false, event = null){
	if (UUID===false){
		var string = 'Share a file with the group<br /><input id="fileselector3" onchange="session.shareFile(this, false, event);" type="file" title="Transfer any file to the group"/><div id="activeShares"></div>';
	} else if (session.directorList.indexOf(UUID)>=0){
		var string = 'The director requested you share a file with them.<br /><input id="fileselector3" onchange="session.shareFile(this, `'+UUID+'`, event);" type="file" title="Transfer a file to the director"/><div id="activeShares"></div>';
	} else {
		var string = 'Someone has requested you share a file with them.<br /><input id="fileselector3" onchange="session.shareFile(this, `'+UUID+'`, event);" type="file" title="Transfer a file to person"/><div id="activeShares"></div>';
	}
	warnUser(string);
	if (session.hostedFiles){
		if (session.hostedFiles.length){
			getById("activeShares").innerHTML += "<div><u>Files being shared:</u></div>";
		}
		for (var i=0;i<session.hostedFiles.length;i++){
			//	id: session.hostedFiles[i].id,
			//	name: session.hostedFiles[i].name,
			//	size: session.hostedFiles[i].size
			getById("activeShares").innerHTML += "<div><b>"+session.hostedFiles[i].name + "</b> (" + Math.ceil(session.hostedFiles[i].size/(1024*1024/10))/10 + "-MB)</div>";
		}
	}
	if (session.hostedTransfers){
		getById("activeShares").innerHTML += "<div><i>"+session.hostedTransfers.length + " file transfers in progress.</i></div>";
	}
}

function toggleChat(event = null) { // TODO: I need to have this be MUTE, toggle, with volume not touched.
	if (session.chat == false) {
		setTimeout(function() {
			document.addEventListener("click", toggleChat);
		}, 10);

		getById("chatModule").addEventListener("click", function(e) {
			e.stopPropagation();
			return false;
		});
		session.chat = true;
		getById("chattoggle").className = "las la-comment-dots my-float toggleSize";
		getById("chatbutton").className = "float2";
		getById("chatModule").style.display = "block";
		getById("chatInput").focus(); // give it keyboard focus
	} else {
		session.chat = false;
		getById("chattoggle").className = "las la-comment-alt my-float toggleSize";
		getById("chatbutton").className = "float";
		getById("chatModule").style.display = "none";

		document.removeEventListener("click", toggleChat);
		getById("chatModule").removeEventListener("click", function(e) {
			e.stopPropagation();
			return false;
		});
	}
	if (getById("chatNotification").value) {
		getById("chatNotification").value = 0;
	}
	getById("chatNotification").classList.remove("notification");
}

function directorAdvanced(ele) {
	var target = document.createElement("div");
	target.style = "position:absolute;float:left;width:270px;height:222px;background-color:#7E7E7E;";

	var closeButton = document.createElement("button");
	closeButton.innerHTML = "<i class='las la-times'></i> close";
	closeButton.style.left = "5px";
	closeButton.style.position = "relative";
	closeButton.onclick = function() {
		target.parentNode.removeChild(target);
	};
	target.appendChild(closeButton);

	var someButton = document.createElement("button");
	someButton.innerHTML = "<i class='las la-reply'></i> some action ";
	someButton.style.left = "5px";
	someButton.style.position = "relative";
	someButton.onclick = function() {
		var actionMsg = {};
		session.sendRequest(actionMsg, ele.dataset.UUID);
	};
	target.appendChild(someButton);

	ele.parentNode.appendChild(target);
}

function directorSendMessage(ele) {
	var target = document.createElement("div");
	target.style = "position:absolute;float:left;width:270px;height:222px;background-color:#7E7E7E;";
	target.style.zIndex = "2";

	var inputField = document.createElement("textarea");
	inputField.placeholder = "Enter your message here";
	inputField.style.width = "255px";
	inputField.style.height = "170px";
	inputField.style.margin = "5px 10px 5px 10px";
	inputField.style.padding = "5px";
	

	var sendButton = document.createElement("button");
	sendButton.innerHTML = "<i class='las la-reply'></i> <span data-translate='send-message'>send message<s/pan> ";
	miniTranslate(sendButton);
	sendButton.style.left = "5px";
	sendButton.style.position = "relative";
	sendButton.onclick = function() {
		var chatMsg = {};
		chatMsg.chat = inputField.value;
		if (sendButton.parentNode.overlay) {
			chatMsg.overlay = sendButton.parentNode.overlay;
		}
		session.sendRequest(chatMsg, ele.dataset.UUID);
		inputField.value = "";
		//target.parentNode.removeChild(target);
	};


	var closeButton = document.createElement("button");
	closeButton.innerHTML = "<i class='las la-times'></i> <span data-translate='close'>close</span>";
	miniTranslate(closeButton);
	closeButton.style.left = "5px";
	closeButton.style.position = "relative";
	closeButton.onclick = function() {
		inputField.value = "";
		target.parentNode.removeChild(target);
	};

	var overlayMsg = document.createElement("span");

	overlayMsg.style.left = "16px";
	overlayMsg.style.top = "6px";
	overlayMsg.style.position = "relative";
	overlayMsg.innerHTML = "<i class='las la-bell' style='font-size:170%; color:#FFF; cursor:pointer;'></i>";
	target.overlay = true;

	overlayMsg.onclick = function(e) {
		log(e.target.parentNode.parentNode);
		if (e.target.parentNode.parentNode.overlay === true) {
			e.target.parentNode.parentNode.overlay = false;
			e.target.parentNode.innerHTML = "<i class='las la-bell-slash' style='font-size:170%; color:#DDD; cursor:pointer;'></i>";
		} else {
			e.target.parentNode.parentNode.overlay = true;
			e.target.parentNode.innerHTML = "<i class='las la-bell' style='font-size:170%; color:#FFF; cursor:pointer;'></i>";
		}
	}


	inputField.addEventListener("keydown", function(e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			sendButton.click();
		} else if (e.keyCode == 27) {
			e.preventDefault();
			inputField.value = "";
			target.parentNode.removeChild(target);
		}
	});
	target.appendChild(closeButton);
	target.appendChild(sendButton);
	target.appendChild(overlayMsg);
	target.appendChild(inputField);
	ele.parentNode.appendChild(target);
	inputField.focus();
	inputField.select();
	
}

function toggleAutoVideoMute(){ // for iOS devices, that tab out.
	// document.visibilityState
	if (!session.videoMuted && (session.permaid!==false)){
		var msg = {};
		msg.videoMuted = (document.visibilityState === 'hidden') || false;
		//try {
		session.sendMessage(msg);
		//} catch(e){errorlog(e);}
		pokeIframeAPI('video-mute-state', document.visibilityState);
	}
}

function toggleVideoMute(apply = false) { // TODO: I need to have this be MUTE, toggle, with volume not touched.
	if (apply) {
		session.videoMuted = !session.videoMuted;
	}
	if (session.videoMuted == false) {
		session.videoMuted = true;
		getById("mutevideotoggle").className = "las la-video-slash my-float toggleSize";
		if (!(session.cleanOutput)){
			getById("mutevideobutton").className = "float2 red";
			getById("header").classList.add("red2");
		}
		if (session.streamSrc) {
			session.streamSrc.getVideoTracks().forEach((track) => {
				track.enabled = false;
			});
		}

	} else {
		session.videoMuted = false;

		getById("mutevideotoggle").className = "las la-video my-float toggleSize";
		if (!(session.cleanOutput)){
			getById("mutevideobutton").className = "float";
			getById("header").classList.remove("red2");
		}
		if (session.streamSrc) {
			session.streamSrc.getVideoTracks().forEach((track) => {
			//	try {
			//		if (document.querySelector("select#videoSource3").value == "ZZZ"){
			//			return;
			//		}
			//	} catch(e){}
				track.enabled = true;
			});
		}
	}
	
	if (session.avatar && session.avatar.ready && !apply){ 
		updateRenderOutpipe();
		if (session.videoMuted){
			var msg = {};
			msg.videoMuted = false;
			session.sendMessage(msg);
		}
	} else if (!apply) {
		var msg = {};
		msg.videoMuted = session.videoMuted;
		session.sendMessage(msg);
		if (!session.videoMuted){makeImages();}
	}
	 
	pokeIframeAPI("video-mute-state",session.videoMuted);
}

var toggleSettingsState = false;
function toggleSettings(forceShow = false) { // TODO: I need to have this be MUTE, toggle, with volume not touched.

	getById("multiselect-trigger3").dataset.state = "0";
	getById("multiselect-trigger3").classList.add('closed');
	getById("multiselect-trigger3").classList.remove('open');
	getById("chevarrow2").classList.add('bottom');

	if (toggleSettingsState == true) {
		if (forceShow == true) {
			enumerateDevices().then(gotDevices2);
			return;
		}
	} // don't close if already open
	if (getById("popupSelector").style.display == "none") {

		updateConstraintSliders();

		setTimeout(function() {
			document.addEventListener("click", toggleSettings);
		}, 10);

		getById("popupSelector").addEventListener("click", function(e) {
			e.stopPropagation();
			return false;
		});

		if (navigator.userAgent.indexOf('Chrome') != -1) {
			try {
				navigator.permissions.query({
					name: "camera"
				}).then(function(promise) {
					if (promise && promise.state) {
						if (promise.state == "prompt") {
							navigator.mediaDevices.getUserMedia({
								video: true
								, audio: false
							}).then(function(stream) {
								enumerateDevices().then(gotDevices2).then(function() {
									stream.getTracks().forEach(function(track) {
										//stream.removeTrack(track);
										track.stop(); // clean up?
									});
								});

							}).catch(function(err) {
								enumerateDevices().then(gotDevices2).then(function() {});
							});
						} else {
							enumerateDevices().then(gotDevices2).then(function() {});
						}
						// console.log(promise.state); //"granted", "prompt" or "rejected"
					} else {
						enumerateDevices().then(gotDevices2).then(function() {});
					}
				});
			} catch (e) {
				enumerateDevices().then(gotDevices2).then(function() {});
			}
		} else {
			enumerateDevices().then(gotDevices2).then(function() {});
		}

		getById("popupSelector").style.display = "inline-block"
		getById("settingsbutton").classList.add("float2");
		getById("settingsbutton").classList.remove("float");
		
		loadTFLITEImages() // only triggers if effects==5 is true
		
		setTimeout(function() {
			getById("popupSelector").style.right = "0px";
		}, 1);
		toggleSettingsState = true;
	} else {
		document.removeEventListener("click", toggleSettings);
		getById("popupSelector").removeEventListener("click", function(e) {
			e.stopPropagation();
			return false;
		});

		getById("popupSelector").style.right = "-400px";

		getById("settingsbutton").classList.add("float");
		getById("settingsbutton").classList.remove("float2");
		setTimeout(function() {
			getById("popupSelector").style.display = "none";
		}, 200);
		toggleSettingsState = false;
		document.getElementById('videoSettings3').style.display = "none";
	}
}

function hangup() { // TODO: I need to have this be MUTE, toggle, with volume not touched.
	if (session.hostedTransfers.length){
		confirmAlt("There are still file transfer in progress\nAre you sure you wish to exit?").then(res=>{
			if (res){
				getById("main").innerHTML = "<font style='font-size:500%;text-align:center;margin:auto;'>👋</font>";
				setTimeout(function() {
					session.hangup();
				}, 0);
			}
		});
	} else {
		getById("main").innerHTML = "<font style='font-size:500%;text-align:center;margin:auto;'>👋</font>";
		setTimeout(function() {
			session.hangup();
		}, 0);
	}
}

function hangup2() {
	session.hangupDirector();
	getById("miniPerformer").innerHTML = "";
	getById("press2talk").dataset.enabled = false;
	getById("screensharebutton").classList.add("hidden");
	getById("settingsbutton").classList.add("hidden");
	getById("mutebutton").classList.add("hidden");
	getById("hangupbutton2").classList.add("hidden");
	//getById("chatbutton").classList.remove("hidden");
	getById("controlButtons").style.display = "inherit";
	//getById("mutespeakerbutton").classList.add("hidden");
	getById("mutevideobutton").classList.add("hidden");
	getById("screenshare2button").classList.add("hidden");
	
	getById("screensharebutton").classList.add("float");
	getById("screensharebutton").classList.remove("float2");
	
	if (session.showDirector == false) {
		getById("miniPerformer").innerHTML = '<button id="press2talk" onmousedown="event.preventDefault(); event.stopPropagation();" style="width:auto;margin-left:5px;height:45px;border-radius: 38px;" class="float" onclick="press2talk(true);" title="You can also enable the director`s Video Output afterwards by clicking the Setting`s button"><i class="las la-headset"></i><span data-translate="push-to-talk-enable"> enable director`s microphone or video<br />(only guests can see this feed)</span></button>';
		miniTranslate(getById("miniPerformer"));
	} else {
		getById("miniPerformer").innerHTML = '<button id="press2talk" onmousedown="event.preventDefault(); event.stopPropagation();" style="width:auto;margin-left:5px;height:45px;border-radius: 38px;" class="float" onclick="press2talk(true);" title="You can also enable the director`s Video Output afterwards by clicking the Setting`s button"><i class="las la-headset"></i><span data-translate="push-to-talk-enable-2"> enable director`s microphone or video</span></button>';
	}
	getById("miniPerformer").className = "";
	
	pokeIframeAPI("hungup",true);
}

function hangupComplete() {
	getById("main").innerHTML = "<font style='font-size:500%;text-align:center;margin:auto;'>👋</font>";
	pokeIframeAPI("hungup",true); // don't use Hangup, as that's an action.  
}

function reloadRequested() {
	pokeIframeAPI("reloading",true);
	window.removeEventListener("beforeunload", confirmUnload); // clear the confirm on reload
	location.reload(); // the main reload function call
}
function confirmUnload(event){
	if (!session.noExitPrompt && !session.cleanOutput && (session.permaid!==false || session.director)){
		(event || window.event).returnValue = "Are you sure you want to exit?"; //Gecko + IE
		return "Are you sure you want to exit?";   
	} else {
		//setTimeout(function(){session.hangup();},0);
		return undefined; // ADDED OCT 29th; get rid of popup. Just close the socket connection if the user is refreshing the page.  It's one or the other.
	}
}

function raisehand() {
	if (session.directorUUID == false) { // fine
		log("no director in room yet");
		return;
	}

	var data = {};
	

	log(data);
	if (getById("raisehandbutton").dataset.raised == "0") {
		getById("raisehandbutton").dataset.raised = "1";
		getById("raisehandbutton").classList.add("raisedHand");
		data.chat = "Raised hand";
		log("hand raised");
	} else {
		log("hand lowered");
		getById("raisehandbutton").dataset.raised = "0";
		getById("raisehandbutton").classList.remove("raisedHand");
		data.chat = "Lowered hand";
	}
	for (var i=0;i<session.directorList.length;i++){
		data.UUID = session.directorList[i];
		session.sendMessage(data, data.UUID);
	}
	
	try {
		pokeIframeAPI("hand",true);
	} catch(e){}
}

function lowerhand() {
	log("hand lowered");
	getById("raisehandbutton").dataset.raised = "0";
	getById("raisehandbutton").classList.remove("raisedHand");
	pokeIframeAPI("hand",false);
}


var previousRoom = "";
var stillNeedRoom = true;
var transferCancelled = false;
var armedTransfer = false;
var transferSettings = {};

async function directMigrate(ele, event, room=false) { // everyone in the room will hangup this guest also?  I like that idea.  What about the STREAM ID?  I suppose we don't kick out if the viewID matches.
	log("directMigrate");
	if (room){
		var migrateRoom = room;
	} else if (event === false) {
		if (previousRoom === null) { // user cancelled in previous callback
			ele.innerHTML = '<i class="las la-paper-plane"></i> <span data-translate="forward-to-room">transfer</span>';
			miniTranslate(ele);
			ele.style.backgroundColor = null;
			return;
		}
		if (transferCancelled === true) {
			ele.innerHTML = '<i class="las la-paper-plane"></i> <span data-translate="forward-to-room">transfer</span>';
			miniTranslate(ele);
			ele.style.backgroundColor = null;
			return;
		}
		var migrateRoom = previousRoom
	} else if ((event.ctrlKey) || (event.metaKey)) {
		ele.innerHTML = '<i class="las la-check"></i> <span data-translate="forward-to-room">armed</span>';
		miniTranslate(ele);
		ele.style.backgroundColor = "#BF3F3F";
		transferCancelled = false;
		//armedTransfer=true;
		Callbacks.push([directMigrate, ele, stillNeedRoom]);
		stillNeedRoom = false;
		log("Migrate queued");
		return;
   // } else if (armedTransfer){
		//migrateRoom = sanitizeRoomName(previousRoom);
	} else {
		if (armedTransfer!==false && previousRoom!==""){
			var migrateRoom = sanitizeRoomName(previousRoom);
		} else {
			var broadcastMode = null;
			if ("broadcast" in transferSettings){
				broadcastMode = transferSettings.broadcast;
			} else if (session.rpcs[ele.dataset.UUID] && session.rpcs[ele.dataset.UUID].stats.info && ("broadcast_mode" in session.rpcs[ele.dataset.UUID].stats.info)){
				broadcastMode = session.rpcs[ele.dataset.UUID].stats.info.broadcast_mode;
			}
			
			var updateurl = null;
			if ("updateurl" in transferSettings){
				updateurl = transferSettings.updateurl;
			} 
			window.focus();
			
			
			var response = await promptTransfer(previousRoom, broadcastMode, updateurl);
			var migrateRoom = response.roomid;
			if (migrateRoom !== null){
				transferSettings = response;
			}
		}
		stillNeedRoom = true;
		if (migrateRoom === null) { // user cancelled
			ele.innerHTML = '<i class="las la-paper-plane"></i> <span data-translate="forward-to-room">transfer</span>';
			miniTranslate(ele);
			ele.style.backgroundColor = null;
			transferCancelled = true;
			return;
		}
		try {
			migrateRoom = sanitizeRoomName(migrateRoom);
			previousRoom = migrateRoom;
		} catch (e) {}

	}
	ele.innerHTML = '<i class="las la-paper-plane"></i> <span data-translate="forward-to-room">transfer</span>';
	miniTranslate(ele);
	ele.style.backgroundColor = null;

	if (migrateRoom) {
		previousRoom = migrateRoom;
		session.directMigrateIssue(migrateRoom, transferSettings, ele.dataset.UUID);
	}
}


var stillNeedHangupTarget = 1;
function directHangup(ele, event) { // everyone in the room will hangup this guest?  I like that idea.
	if (event == false) {
		if (stillNeedHangupTarget === 1) {
			window.focus();
			var confirmHangup = confirm(miscTranslations["confirm-disconnect-users"]);
			stillNeedHangupTarget = confirmHangup;
		} else {
			confirmHangup = stillNeedHangupTarget;
		}
	} else if (event===true) {
		var confirmHangup = true;
	} else if ((event.ctrlKey) || (event.metaKey)) {
		ele.innerHTML = '<i class="las la-skull-crossbones"></i> <span data-translate="disconnect-guest" >ARMED</span>';
		miniTranslate(ele);
		ele.style.backgroundColor = "#BF3F3F";
		stillNeedHangupTarget = 1;
		Callbacks.push([directHangup, ele, false]);
		log("Hangup queued");
		return;
	} else {
		window.focus();
		var confirmHangup = confirm(miscTranslations["confirm-disconnect-user"]);
	}

	if (confirmHangup) {
		var msg = {};
		msg.hangup = true;
		log(msg);
		log(ele.dataset.UUID);
		session.sendRequest(msg, ele.dataset.UUID);
		pokeIframeAPI("hungup", "directing", ele.dataset.UUID);
		//session.anysend(msg); // send to everyone in the room, so they know if they are on air or not.
	} else {
		ele.innerHTML = '<i class="las la-sign-out-alt"></i><span data-translate="disconnect-guest"> Hangup</span>';
		miniTranslate(ele);
		ele.style.backgroundColor = null;
	}
	
	
}

function directEnable(ele, event,  director=false) { // A directing room only is controlled by the Director, with the exception of MUTE.
	var scene = ele.dataset.scene;
	if (!((event.ctrlKey) || (event.metaKey))) {
		if (ele.dataset.value == 1) {
			ele.dataset.value = 0;
			ele.classList.remove("pressed");
			if (ele.children[1]){
				ele.children[1].innerHTML = "Add to Scene "+scene;
			}
			if (director){
				if (getById("container_director").querySelectorAll('[data-action-type="addToScene"][data-value="1"]').length==0){
					getById("container_director").style.backgroundColor = null;
				}
			} else {
				if (getById("container_" + ele.dataset.UUID).querySelectorAll('[data-action-type="addToScene"][data-value="1"]').length==0){
					getById("container_" + ele.dataset.UUID).style.backgroundColor = null;
				}
			}
		} else {
			ele.dataset.value = 1;
			ele.classList.add("pressed");
			if (ele.children[1]){
				ele.children[1].innerHTML = "Remove";
			}
			if (director){
				getById("container_director").style.backgroundColor = "#649166";
			} else {
				getById("container_" + ele.dataset.UUID).style.backgroundColor = "#649166";
			}
		}
	}
	
	var msg = {};
	
	scene = scene+"";
	
	msg.scene = scene;
	msg.action = "display";
	msg.value = ele.dataset.value;
	msg.target = ele.dataset.sid;
	
	try {
		if (msg.value==1){
			pokeIframeAPI("add-to-scene", scene, ele.dataset.UUID);
		} else {
			pokeIframeAPI("remove-from-scene", scene, ele.dataset.UUID);
		}
	} catch(e){}

	for (var uuid in session.pcs){
		if (session.pcs[uuid].stats.info && ("version" in session.pcs[uuid].stats.info) &&  (session.pcs[uuid].stats.info.version < 17.2)){
			msg.request = "sendroom"; 
			session.sendMsg(msg);
			return;
		}
	}
	
	for (var uuid in session.pcs){
		if (session.pcs[uuid].scene===scene){
			session.sendMessage(msg, uuid);
		}
	}
	syncDirectorState(ele);
}

function syncDirectorState(ele){
	//if (session.director){ // assumed director, since this is a directEnable sub-function
	var msg = {};
	msg.directorState = getDetailedState(ele.dataset.sid); 
	for (var uuid in session.pcs){
		if (session.pcs[uuid].coDirector){
			session.sendMessage(msg, uuid);
		}
	}
	for (var i in session.directorList){
		var uuid = session.directorList[i];
		if (session.rpcs[uuid]){
			session.sendRequest(msg, uuid);
		}
	}
}

function getDetailedState(sid=false){
	var streamList = {};
	
	for (var UUID in session.rpcs){
		if (session.rpcs[UUID].streamID){
			if (sid && (sid!==session.rpcs[UUID].streamID)){continue;}
			var item = {};
			item.streamID = session.rpcs[UUID].streamID;
			item.label = session.rpcs[UUID].label;
			item.group = session.rpcs[UUID].group;
			item.iframeSrc = session.rpcs[UUID].iframeSrc;
			//item.slot = session.rpcs[UUID].slot;
			item.director = session.rpcs[UUID].director;
			try {
				if (document.getElementById("guestFeeds")){
					var lock = parseInt(document.getElementById("position_"+UUID).dataset.locked);
					if (lock){
						item.position = lock; // probably should make a universal function to do this, for all lock requesting
					} else if (document.getElementById('container_'+UUID)){
						var child = document.getElementById('container_'+UUID);
						var parent = child.parentNode;
						if (parent.id == "guestFeeds"){
							item.position = Array.prototype.indexOf.call(parent.children, child) + 1;
						}
					}
				}
				
				var scenes = getById("container_" + UUID).querySelectorAll('[data-action-type="addToScene"][data-scene][data--u-u-i-d="'+UUID+'"]');
				var sceneState = {};
				for (var i=0;i<scenes.length;i++){
					if (parseInt(scenes[i].dataset.value)){
						sceneState[scenes[i].dataset.scene] = true;
					} else {
						sceneState[scenes[i].dataset.scene] = false;
					}
				}
				item.scenes = sceneState;
				
				var others = getById("container_" + UUID).querySelectorAll('[data-action-type][data--u-u-i-d="'+UUID+'"]');
				var otherState = {};
				for (var i=0;i<others.length;i++){
					log(others[i].dataset.actionType + " " +others[i].dataset.value);
					if ("scene" in others[i].dataset){continue;}
					if ("toggle-group" == others[i].dataset.actionType){continue;}
					if ("value" in others[i].dataset){
						otherState[others[i].dataset.actionType] = others[i].dataset.value;
					}
				}
				item.others = otherState;
				
			} catch(e){}
			streamList[session.rpcs[UUID].streamID] = item;
		}
	}
	
	if (sid && (sid!==session.streamID)){return streamList;}
	
	streamList[session.streamID] = {}; 
	var sceneState = {};
	
	try {
		var scenes = getById("container_director").querySelectorAll('[data-action-type="addToScene"][data-scene]');
		for (var i=0;i<scenes.length;i++){
			if (parseInt(scenes[i].dataset.value)){
				sceneState[scenes[i].dataset.scene] = true;
			} else {
				sceneState[scenes[i].dataset.scene] = false;
			}
		}
	} catch(e){}
	streamList[session.streamID].label = session.label;
	streamList[session.streamID].group = session.group;
	//streamList[session.streamID].slot = session.slot;
	streamList[session.streamID].scenes = sceneState;
	streamList[session.streamID].streamID = session.streamID;
	streamList[session.streamID].iframeSrc = session.iframeSrc;
	streamList[session.streamID].director = session.director;
	streamList[session.streamID].localstream = true;
	return streamList;
}

function syncOtherState(sid){
	if (!session.syncState){return;}
	if (!session.syncState[sid]){return;}
	var others = session.syncState[sid].others;
	for (var other in others){
		if (other == "toggle-group"){continue;}
		var ele = document.querySelector('[data-sid="'+sid+'"][data-action-type="'+other+'"]');
		if (ele){
			if (others[other]){
				ele.dataset.value = others[other];
				if (ele.nodeName.toLowerCase() == "input"){
					ele.value = parseInt(others[other]);
				} else if (parseInt(others[other])){
					ele.classList.add("pressed");
				} else {
					ele.classList.remove("pressed");
				}
			}
		}
	}
	
	var groups = session.syncState[sid].group;
	var elements = document.querySelectorAll('[data-action-type="toggle-group"][data-sid="'+sid+'"]');
		if (elements.length){
		var UUID = elements[0].dataset.UUID;
		if (UUID){
			session.rpcs[UUID].group = groups;
		}
		for (var i=0;i<elements.length;i++){
			elements[i].classList.remove("pressed");
			for (var g=0;g<session.rpcs[UUID].group.length;g++){
				if (elements[i].dataset.value === session.rpcs[UUID].group[g]){
					elements[i].classList.add("pressed");
				}
			}
		}
	}
}

function syncSceneState(sid){
	if (!session.syncState){return;}
	if (!session.syncState[sid]){return;}
	var scenes = session.syncState[sid].scenes;
	for (var scene in scenes){
		try {
			var ele = document.querySelector('[data-sid="'+sid+'"][data-action-type="addToScene"][data-scene="'+scene+'"]');
			if (ele){
				if (scenes[scene]){
					ele.dataset.value = 1;
					ele.classList.add("pressed");
					if (ele.children[1]){
						ele.children[1].innerHTML = "Remove";
					}
				} else {
					ele.dataset.value = 0;
					ele.classList.remove("pressed");
					if (ele.children[1]){
						ele.children[1].innerHTML = "Add to Scene "+scene;
					}
				}
			}
		} catch(e){}
	}
}



function issueLayout(layout=false, scene=false) { // A directing room only is controlled by the Director, with the exception of MUTE.
	log("issueLayout() called");
	var msg = {};
	msg.action = "layout";
	msg.value = layout;
	
	try {
		pokeIframeAPI("layout", {layout:layout, scene:scene});
	} catch(e){}
	
	/* session.layout = {
		"stevetestA": {
			x:0,
			y:0,
			w:40,
			h:40,
			z:0,
			c:false
			
		},
		"stevetestB": {
			x:50,
			y:50,
			w:40,
			h:40,
			z:1,
			c:true
		}
	}; */
	scene = scene+"";
	for (var uuid in session.pcs){
		if (session.pcs[uuid].scene===scene){
			session.sendMessage(msg, uuid);
		}
	}
}

var previousURL = "";
var stillNeedURL = true;
var reloadCancelled = false;
var armedReload = false;

async function directPageReload(ele, event) {
	log("URL Page reload");
	if (event === false) {
		if (previousURL === null) { // user cancelled in previous callback
			ele.innerHTML = '<i class="las la-sync"></i> <span data-translate="change-url">change URL</span>';
			miniTranslate(ele)
			ele.style.backgroundColor = null;
			return;
		}
		if (reloadCancelled === true) {
			ele.innerHTML = '<i class="las la-sync"></i> <span data-translate="change-url">change URL</span>';
			miniTranslate(ele)
			ele.style.backgroundColor = null;
			return;
		}
		reloadURL = previousURL
	} else if ((event.ctrlKey) || (event.metaKey)) {
		ele.innerHTML = '<i class="las la-check"></i> <span data-translate="button-armed">armed</span>';
		miniTranslate(ele)
		ele.style.backgroundColor = "#BF3F3F";
		reloadCancelled = false;
		armedReload=true;
		Callbacks.push([directPageReload, ele, stillNeedURL]);
		stillNeedURL = false;
		log("URL update queued");
		return;
	} else if (armedReload){
		reloadURL = previousURL;
	} else {
		window.focus();
		var reloadURL = await promptAlt(miscTranslations["transfer-guest-to-url"], false, false, previousURL);
		stillNeedURL = true;
		if (reloadURL === null) { // user cancelled
			ele.innerHTML = '<i class="las la-sync"></i> <span data-translate="change-url">change URL</span>';
			miniTranslate(ele)
			ele.style.backgroundColor = null;
			reloadCancelled = true;
			return;
		}
		try {
			previousURL = reloadURL;
		} catch (e) {}

	}
	ele.innerHTML = '<i class="las la-sync"></i> <span data-translate="change-url">change URL</span>';
	miniTranslate(ele)
	ele.style.backgroundColor = null;

	if (reloadURL) {
		previousURL = reloadURL;

		var msg = {};
		msg.changeURL = reloadURL;
		if (ele.dataset.UUID in session.rpcs){
			session.rpcs[ele.dataset.UUID].receiveChannel.send(JSON.stringify(msg));
		}
	}
}



async function directTimer(ele,  event=false) { // A directing room only is controlled by the Director, with the exception of MUTE.
	log("directTimer");
	if (!ele.dataset.UUID){return;}
	var msg = {};
	ele.classList.remove("blue");
	ele.classList.remove("red2");
	if (!event || (!((event.ctrlKey) || (event.metaKey)))) {
		if (ele.dataset.value == 0 || ele.dataset.value == 2) {
			var getTime = await promptAlt("Time in seconds to count down", false, false, parseInt(getById("overlayClockContainer").dataset.initial));
			if (!getTime){return;}
			getById("overlayClockContainer").dataset.initial = parseInt(getTime) || 600;
			ele.dataset.value = 1;
			ele.classList.add("pressed");
			ele.classList.remove("red2");
			msg.setClock = getTime;
			msg.showClock = true;
			msg.startClock = true;
			ele.innerHTML = '<i class="las la-clock"></i><span data-translate="create-timer"> Remove Timer</span>';
		} else if (ele.dataset.value == 3) {
			ele.dataset.value = 1;
			msg.resumeClock = true;
			ele.classList.add("red2");
		} else {
			ele.dataset.value = 2;
			ele.classList.remove("pressed");
			msg.stopClock = true;
			msg.hideClock = true;
			ele.innerHTML = '<i class="las la-clock"></i><span data-translate="create-timer"> Create Timer</span>';
		}
		//miniTranslate(ele);
	} else if (event.ctrlKey || event.metaKey){
		if (ele.dataset.value == 1) {
			ele.dataset.value = 3;
			msg.pauseClock = true;
			ele.classList.add("blue");
		} else if (ele.dataset.value == 3) {
			ele.dataset.value = 1;
			msg.resumeClock = true;
			ele.classList.add("red2");
		}
	}
	session.sendRequest(msg, ele.dataset.UUID);
}

function updateRemoteTimerButton(UUID, currentTime) {
	var elements = document.querySelectorAll('[data-action-type="create-timer"][data--u-u-i-d="' + UUID + '"]');
	if (elements[0]){
		if (elements[0].dataset.value != 2) {
			var time = parseInt(currentTime) || 0;
			elements[0].classList.add("pressed");
			elements[0].dataset.value = 1;
			if (time<0) {
				time = time * -1;
				var minutes = Math.floor(time / 60);
				var seconds = time - minutes * 60;
				elements[0].classList.add("red2");
				elements[0].innerHTML = '<i class="las la-clock"></i> -' + (minutes) + "m : " + zpadTime(seconds) + "s";
			} else {
				var minutes = Math.floor(time / 60);
				var seconds = time - minutes * 60;
				elements[0].classList.remove("red2");
				elements[0].innerHTML = '<i class="las la-clock"></i> ' + (minutes) + "m : " + zpadTime(seconds) + "s";
			}
		} else {
			elements[0].classList.remove("pressed");
			elements[0].classList.remove("red2");
			elements[0].innerHTML = '<i class="las la-clock"></i><span data-translate="create-timer"> Create Timer</span>';
		}
	}
}


function directMute(ele,  event=false) { // A directing room only is controlled by the Director, with the exception of MUTE.
	log("mute");
	if (!event || (!((event.ctrlKey) || (event.metaKey)))) {
		if (ele.dataset.value == 1) {
			ele.dataset.value = 0;
			ele.classList.remove("pressed");
			ele.innerHTML = '<i class="las la-microphone-slash"></i> <span data-translate="mute-scene" >mute in scene</span>';
		} else {
			ele.dataset.value = 1;
			ele.classList.add("pressed");
			ele.innerHTML = '<i class="las la-microphone-slash"></i> <span data-translate="unmute" >un-mute</span>';
		}
		miniTranslate(ele);
	}
	var msg = {};
	msg.scene = true; 
	msg.action = "mute";
	msg.value = !ele.dataset.value;
	msg.target = ele.dataset.sid;
	
	for (var uuid in session.pcs){
		if (session.pcs[uuid].stats.info && ("version" in session.pcs[uuid].stats.info) && (session.pcs[uuid].stats.info.version < 17.2)){
			msg.request = "sendroom"; 
			session.sendMsg(msg);
			return;
		}
	}

	for (var uuid in session.pcs){
		if (session.pcs[uuid].scene!==false){ // send to all scenes (but scene = 0)
			session.sendMessage(msg, uuid);
		}
	}
	
	syncDirectorState(ele);
}

function requestFileUpload(ele){
	ele.classList.add("pressed");
	ele.disabled = true;
	ele.innerHTML = '<i class="las la-file-upload"></i><span data-translate="request-upload"> Requesting..</span>';
	setTimeout(function(ele){
		try{
			ele.innerHTML = '<i class="las la-file-upload"></i><span data-translate="request-upload"> Request File</span>';
			ele.classList.remove("pressed");
			ele.disabled = false
		} catch(e){}
	},15000, ele);
	var msg = {};
	msg.requestUpload = true; // toggleFileshare
	msg.UUID = ele.dataset.UUID;
	session.sendRequest(msg, ele.dataset.UUID);
}

function remoteSpeakerMute(ele,  event=false){
	log("speaker mute");
	if (!event || (!((event.ctrlKey) || (event.metaKey)))) {
		if (ele.dataset.value == 1) {
			ele.dataset.value = 0;
			ele.classList.remove("pressed");
			ele.innerHTML = '<i class="las la-volume-off"></i> <span data-translate="toggle-remote-speaker">deafen guest</span>';
		} else {
			ele.dataset.value = 1;
			ele.classList.add("pressed");
			ele.innerHTML = '<i class="las la-volume-off"></i> <span data-translate="undeafen">un-deafen</span>';
		}
		miniTranslate(ele);
	}

	var msg = {};
	if (ele.dataset.value == 1) {
		msg.speakerMute = false
	} else {
		msg.speakerMute = true;
	}
	msg.UUID = ele.dataset.UUID;
	session.sendRequest(msg, ele.dataset.UUID);
	syncDirectorState(ele);
}

function updateRemoteSpeakerMute(UUID) {
	var ele = document.querySelectorAll('[data-action-type="toggle-remote-speaker"][data--u-u-i-d="' + UUID + '"]');
	if (ele[0]) {
		ele[0].classList.add("pressed");
		ele[0].dataset.value = 1;
		ele[0].innerHTML = '<i class="las la-volume-off"></i> <span data-translate="undeafen">un-deafen</span>';
		miniTranslate(ele[0]);
	}
}

function updateRemoteDisplayMute(UUID, blind=true) {
	var ele = document.querySelectorAll('[data-action-type="toggle-remote-display"][data--u-u-i-d="' + UUID + '"]');
	if (ele[0]) {
		if (blind){
			ele[0].classList.add("pressed");
			ele[0].dataset.value = 1;
			ele[0].innerHTML = '<i class="las la-eye-slash"></i> <span data-translate="unblind">un-blind</span>';
			miniTranslate(ele[0]);
		} else {
			ele[0].classList.remove("pressed");
			ele[0].dataset.value = 0;
			ele[0].innerHTML = '<i class="las la-eye"></i> <span data-translate="blind">blind</span>';
			miniTranslate(ele[0]);
		}
	}
}

function blindAllGuests(ele, event=false){
	if (!session.director){
		if (!session.cleanOutput){warnUser("Only a director can mute other guests");}
		return;
	} // only a director can use this button.
	
	log("blind all display mute");
	if (!event ||  (!((event.ctrlKey) || (event.metaKey)))) {
		if (ele.dataset.value == 1) {
			ele.dataset.value = 0;
			ele.classList.remove("pressed");
			ele.classList.remove("red");
			ele.innerHTML = '<i class="toggleSize las la-eye my-float"></i>';
		} else {
			ele.dataset.value = 1;
			ele.classList.add("pressed");
			ele.classList.add("red");
			ele.innerHTML = '<i class="toggleSize las la-eye-slash my-float"></i>';
		}
	}

	var msg = {};
	if (ele.dataset.value == 0) {
		msg.displayMute = false;
		session.directorBlindAllGuests = false;
	} else {
		msg.displayMute = true;
		session.directorBlindAllGuests= true;
	}
	for (var UUID in session.rpcs){ // doesn't include scenes, as they don't publiish and this is rpcs
		if (session.directorList.indexOf(UUID)>=0){continue;} // don't try to mute other directors
		try {
			session.sendRequest(msg, UUID);
			updateRemoteDisplayMute(UUID, msg.displayMute);
		} catch(e){errorlog(e);}
	}
	syncDirectorState(ele);
}

function remoteDisplayMute(ele, event=false) {
	log("display mute");
	if (!event ||  (!((event.ctrlKey) || (event.metaKey)))) {
		if (ele.dataset.value == 1) {
			ele.dataset.value = 0;
			ele.classList.remove("pressed");
			ele.innerHTML = '<i class="las la-eye-slash"></i> <span data-translate="toggle-remote-display">blind guest</span>';
		} else {
			ele.dataset.value = 1;
			ele.classList.add("pressed");
			ele.innerHTML = '<i class="las la-eye-slash"></i> <span data-translate="unblind">un-blind</span>';
		}
		miniTranslate(ele);
	}

	var msg = {};
	if (ele.dataset.value == 0) {
		msg.displayMute = false;
	} else {
		msg.displayMute = true;
	}
	msg.UUID = ele.dataset.UUID;
	session.sendRequest(msg, ele.dataset.UUID);
	syncDirectorState(ele);
}

function remoteLowerhands(UUID) {
	var msg = {};
	msg.lowerhand = true;
	msg.UUID = UUID;
	session.sendRequest(msg, UUID);

	try{
		getById("hands_"+UUID).style.display="none";
		session.rpcs[UUID].remoteRaisedHandElement.style.display = "none";
	} catch(e){}
}


function remoteMute(ele,  event=false) {
	log("mute");
	var val = parseInt(ele.dataset.value) || 0;
	if (!event || (!((event.ctrlKey) || (event.metaKey)))) {
		if (val == 1){
			ele.dataset.value = 0;
			ele.classList.remove("pressed");
			ele.innerHTML = '<i class="las la-microphone-slash" style="color:#900"></i>	<span data-translate="mute-guest" >mute guest</span>';
		} else {
			ele.dataset.value = 1;
			ele.classList.add("pressed");
			ele.innerHTML = '<i class="las la-microphone-slash" style="color:#900"></i>	<span data-translate="unmute-guest" >un-mute guest</span>';
		}
		miniTranslate(ele);
	}

	try {
		session.rpcs[ele.dataset.UUID].directorMutedState = ele.dataset.mute;
		var volume = session.rpcs[ele.dataset.UUID].directorVolumeState;
	} catch (e) {
		errorlog(e);
		var volume = 100;
	}

	var msg = {};
	if (val == 1) {
		msg.volume = volume;
	} else {
		msg.volume = 0;
	}
	msg.UUID = ele.dataset.UUID;
	session.sendRequest(msg, ele.dataset.UUID);
	syncDirectorState(ele);
}

function toggleQualityGear3(){
	toggle(document.getElementById('videoSettings3'), inline=false);
	if (getById("gear_webcam3").style.display === "inline-block") {
		
		var videoSelect = document.querySelector("select#videoSource3").options;
		var obscam = false;
		log(videoSelect[videoSelect.selectedIndex].text);
		if (videoSelect[videoSelect.selectedIndex].text.startsWith("OBS-Camera")) { // OBS Virtualcam
			obscam = true;
		} else if (videoSelect[videoSelect.selectedIndex].text.startsWith("OBS Virtual Camera")) { // OBS Virtualcam
			obscam = true;
		} 
		
		updateStats(obscam);
	}
}

function remoteMuteVideo(ele,  event=false) {
	log("video mute");
	
	if (!event ||  ((event.ctrlKey) || (event.metaKey))) {
		ele.children[1].innerHTML = miscTranslations["armed"]
		ele.style.backgroundColor = "#BF3F3F";
		Callbacks.push([remoteMuteVideo, ele, false]);
		log("video queued");
		return;
	} else {
		if (ele.dataset.value == 1) {
			ele.dataset.value = 0;
			ele.classList.remove("pressed");
			ele.innerHTML = '<i class="las la-video-slash"></i> <span data-translate="hide-guest" >hide guest</span>';
		} else {
			ele.dataset.value = 1;
			ele.classList.add("pressed");
			ele.innerHTML = '<i class="las la-video-slash"></i> <span data-translate="unhide-guest" >un-hide</span>';
		}
		miniTranslate(ele);
		ele.style.backgroundColor = null;
	}

	var msg = {};
	if (ele.dataset.value == 0) {
		msg.directVideoMuted = false;
	} else {
		msg.directVideoMuted = true;
	}
	
	for (var i in session.pcs){
		msg.target = ele.dataset.UUID;
		
		if (i === msg.target){
			msg.target = true;
		}
		try{
			session.pcs[i].sendChannel.send(JSON.stringify(msg));
		} catch(e){}
		
	}
	syncDirectorState(ele);
}

function updateDirectorVideoMute(UUID) {
	var ele = document.querySelectorAll('[data-action-type="hide-guest"][data--u-u-i-d="' + UUID + '"]');
	if (ele[0]) {
		ele[0].dataset.value = 1;
		ele[0].classList.add("pressed");
		ele[0].innerHTML = '<i class="las la-video-slash"></i> <span data-translate="unhide-guest" >un-hide</span>';
		miniTranslate(ele[0]);
	}
}

function directVolume(ele) { // NOT USED ANYMORE
	log("volume");
	var msg = {};
	msg.scene = true;
	msg.action = "volume";
	msg.target = ele.dataset.sid; // i want to focus on the STREAM ID, not the UUID...
	msg.value = ele.value;
	
	for (var uuid in session.pcs){
		if (session.pcs[uuid].stats.info  && ("version" in session.pcs[uuid].stats.info) &&  (session.pcs[uuid].stats.info.version < 17.2)){
			msg.request = "sendroom"; 
			session.sendMsg(msg);
			return;
		}
	}

	for (var uuid in session.pcs){
		if (session.pcs[uuid].scene!==false){ // send to all scenes (but scene = 0)
			session.sendMessage(msg, uuid);
		}
	}
	
	syncDirectorState(ele);
}

function applyMuteState(UUID){ // this is the mute state of PLAYBACK audio; not the microphone or outbound.
	if (!(UUID in session.rpcs)){return "UUID not found";}
	var muteOutcome = session.rpcs[UUID].mutedState || session.rpcs[UUID].mutedStateMixer || session.rpcs[UUID].mutedStateScene || session.speakerMuted || session.rpcs[UUID].bandwidthMuted;
	if (session.rpcs[UUID].videoElement){
		if (session.rpcs[UUID].videoElement && session.rpcs[UUID].videoElement.usermuted===true){return "usermuted true";}
		session.rpcs[UUID].videoElement.muted = muteOutcome;
	}
	// session.scene
	return muteOutcome;
}

function checkMuteState(UUID){ // this is the mute state of PLAYBACK audio; not the microphone or outbound.
	if (!(UUID in session.rpcs)){return false;}
	var muteOutcome = session.rpcs[UUID].mutedState || session.rpcs[UUID].mutedStateMixer || session.rpcs[UUID].mutedStateScene || session.speakerMuted  || session.rpcs[UUID].bandwidthMuted;
	return muteOutcome;
}

function remoteVolumeUI(ele){
	ele.nextSibling.innerHTML = ele.value + "%";
}

function remoteVolume(ele) { // A directing room only is controlled by the Director, with the exception of MUTE.
	log("volume");
	var msg = {};
	var muted = session.rpcs[ele.dataset.UUID].directorMutedState;
	ele.dataset.value = ele.value;
	if (muted == true) { // 1 is a string, not an int, so == and not ===. this happens in a few places :/  
		session.rpcs[ele.dataset.UUID].directorVolumeState = ele.value;
	} else {
		session.rpcs[ele.dataset.UUID].directorVolumeState = ele.value;
		msg.volume = ele.value;
		msg.UUID = ele.dataset.UUID;
		session.sendRequest(msg, ele.dataset.UUID);
	}
	syncDirectorState(ele);
}

function clearDirectorSettings(){ // make sure to wipe the director's room settings if creating a new room.
	removeStorage("directorCustomize");
	removeStorage("directorWebsiteShare");
}

function saveDirectorSettings(){
	var settings = {};
	
	if (getById("customizeLinks").classList.contains("hidden")){
		settings.customizeLinks = true;
	} 
	
	var customizeLinks1 = getById("customizeLinks1").querySelectorAll("input");
	settings.customizeLinks1 = {};
	for (var i=0;i<customizeLinks1.length;i++){
		settings.customizeLinks1[customizeLinks1[i].dataset.param] = customizeLinks1[i].checked;
	}
	
	var customizeLinks3 = getById("customizeLinks3").querySelectorAll("input");
	settings.customizeLinks3 = {};
	for (var i=0;i<customizeLinks3.length;i++){
		settings.customizeLinks3[customizeLinks3[i].dataset.param] = customizeLinks3[i].checked;
	}
	
	var directorLinks1 = getById("directorLinks1").querySelectorAll("input");
	settings.directorLinks1 = {};
	for (var i=0;i<directorLinks1.length;i++){
		settings.directorLinks1[directorLinks1[i].dataset.param] = directorLinks1[i].checked;
	}
	
	var directorLinks2 = getById("directorLinks2").querySelectorAll("input");
	settings.directorLinks2 = {};
	for (var i=0;i<directorLinks2.length;i++){
		settings.directorLinks2[directorLinks2[i].dataset.param] = directorLinks2[i].checked;
	}
	setStorage("directorCustomize", settings);
}

function loadDirectorSettings(){
	var settings = getStorage("directorCustomize");
	log("LOAD DIRECTOR SETTING");
	warnlog(settings);
	if (settings.customizeLinks){
		try{
			hideDirectorinvites(getById("directorLinksButton"), false);
		} catch(e){errorlog(e);}
	} 
	
	if (settings.customizeLinks1){
		var customizeLinks1 = getById("customizeLinks1");
		Object.keys(settings.customizeLinks1).forEach((key, index) => {
			try {
				if (customizeLinks1.querySelector('[data-param="'+key+'"]').checked != settings.customizeLinks1[key]){
					customizeLinks1.querySelector('[data-param="'+key+'"]').checked = settings.customizeLinks1[key];
					customizeLinks1.querySelector('[data-param="'+key+'"]').onchange();
				}
			} catch(e){errorlog(e);}
		});
	}
	
	if (settings.customizeLinks3){
		var customizeLinks3 = getById("customizeLinks3");
		Object.keys(settings.customizeLinks3).forEach((key, index) => {
			try {
				if (customizeLinks3.querySelector('[data-param="'+key+'"]').checked == settings.customizeLinks3[key]){
					customizeLinks3.querySelector('[data-param="'+key+'"]').checked = settings.customizeLinks3[key];
					customizeLinks3.querySelector('[data-param="'+key+'"]').onchange();
				}
			} catch(e){errorlog(e);}
		});
	}
	
	if (settings.directorLinks1){
		var directorLinks1 = getById("directorLinks1");
		Object.keys(settings.directorLinks1).forEach((key, index) => {
			try {
				if (directorLinks1.querySelector('[data-param="'+key+'"]').checked == settings.directorLinks1[key]){
					directorLinks1.querySelector('[data-param="'+key+'"]').checked = settings.directorLinks1[key];
					directorLinks1.querySelector('[data-param="'+key+'"]').onchange();
				}
			} catch(e){errorlog(e);}
		});
	}
	
	if (settings.directorLinks2){
		var directorLinks2 = getById("directorLinks2");
		Object.keys(settings.directorLinks2).forEach((key, index) => {
			try {
				if (directorLinks2.querySelector('[data-param="'+key+'"]').checked == settings.directorLinks2[key]){
					directorLinks2.querySelector('[data-param="'+key+'"]').checked = settings.directorLinks2[key];
					directorLinks2.querySelector('[data-param="'+key+'"]').onchange();
				}
			} catch(e){errorlog(e);}
		});
	}
}



function sendChat(chatmessage = "hi", UUID=false) { // A directing room only is controlled by the Director, with the exception of MUTE.
	log("Chat message");
	var msg = {};
	msg.chat = chatmessage;
	
	session.sendPeers(msg, UUID);
}

var activatedStream = false;

function publishScreen() {
	if (activatedStream == true) {
		return;
	}
	activatedStream = true;
	setTimeout(function() {
		activatedStream = false;
	}, 1000);

	formSubmitting = false;

	var quality = parseInt(getById("webcamquality2").elements.namedItem("resolution2").value) || 0;
	
	session.quality_ss = quality;

	if (session.quality !== false) {
		quality = session.quality; // override the user's setting
	}
	
	if (session.screensharequality !== false){
		quality = session.screensharequality;
	}

	var video = {}
	
	if (quality == -1) {
		// unlocked capture resolution
	} else if (quality == 0) {
		
		video.width = {
			ideal: 1920
		};
		video.height = {
			ideal: 1080
		};
	} else if (quality == 1) {
		video.width = {
			ideal: 1280
		};
		video.height = {
			ideal: 720
		};
	} else if (quality == 2) {
		video.width = {
			ideal: 640
		};
		video.height = {
			ideal: 360
		};
	} else if (quality >= 3) { // lowest
		video.width = {
			ideal: 320
		};
		video.height = {
			ideal: 180
		};
	} else {
		video.width = {
			min: 640
		};
		video.height = {
			min: 360
		};
	}

	if (session.width) {
		video.width = {
			ideal: session.width
		};
	}
	if (session.height) {
		video.height = {
			ideal: session.height
		};
	}

	var constraints = {
		audio: {
			echoCancellation: false,
			autoGainControl: false,
			noiseSuppression: false
		}, 
		video: video
	};

	if (session.noiseSuppression === true) {
		constraints.audio.noiseSuppression = true;; // the defaults for screen publishing should be off.
	}
	if (session.autoGainControl === true) {
		constraints.audio.autoGainControl = true; // the defaults for screen publishing should be off.
	}
	if (session.echoCancellation === true) {
		constraints.audio.echoCancellation = true; // the defaults for screen publishing should be off.
	}

	try {
		let supportedConstraints = navigator.mediaDevices.getSupportedConstraints(); // cursor hidding isn't supported by most browsers anyways.
		if (supportedConstraints.cursor) {
			constraints.video.cursor = "never";
		}
	} catch(e){
		warnlog("navigator.mediaDevices.getSupportedConstraints() not supported");
	}

	//if (session.nocursor) { // we assume no cursor on screen share anyways. maybe make a different flag for screenshare cursor
	//	constraints.video.cursor = {
	//		exact: "none"
	//	}; // Not sure this does anything, but whatever.
	//}

	if (session.framerate !== false) {
		constraints.video.frameRate = session.framerate;
	} else if (session.maxframerate != false){
		constraints.video.frameRate = {
			ideal: session.maxframerate,
			max: session.maxframerate
		};
	} else {
		constraints.video.frameRate = {
			ideal: 60
		};
	}

	var audioSelect = getById('audioSourceScreenshare');
	var outputSelect = getById('outputSourceScreenshare');

	try {
		session.sink = outputSelect.options[outputSelect.selectedIndex].value; // will probably fail on Safari.
		log("Session Sink: " + session.sink);
		saveSettings();
	} catch (e){errorlog(e);}

	publishScreen2(constraints, audioSelect).then((res) => {
		if (res == false) {
			return;
		} // no screen selected
		log("streamID is: " + session.streamID);

		if (session.transcript) {
			setTimeout(function() {
				setupClosedCaptions();
			}, 1000);
		}
		//session.screenShareState=true;
		if (!(session.cleanOutput)) {			
			getById("mutebutton").classList.remove("hidden");
			getById("mutespeakerbutton").classList.remove("hidden");
			//getById("mutespeakerbutton").className="float";
			getById("chatbutton").className = "float";
			getById("mutevideobutton").className = "float";
			getById("hangupbutton").className = "float";
			if (session.showSettings) {
				getById("settingsbutton").className = "float";
			}
			if (session.raisehands) {
				getById("raisehandbutton").className = "float";
			}
			if (session.recordLocal !== false) {
				getById("recordLocalbutton").className = "float";
			}
			if (session.screensharebutton) {
				getById("screensharebutton").className = "float2";
			}
			getById("controlButtons").style.display = "flex";
			getById("helpbutton").style.display = "inherit";
			getById("reportbutton").style.display = "";
		} else if (session.cleanish && session.recordLocal!==false){
			getById("recordLocalbutton").className = "float";
			getById("mutebutton").classList.add("hidden");
			getById("mutespeakerbutton").classList.add("hidden");
			getById("chatbutton").classList.add("hidden");
			getById("mutevideobutton").classList.add("hidden");
			getById("hangupbutton").classList.add("hidden");
			getById("hangupbutton2").classList.add("hidden");
			getById("controlButtons").style.display = "flex";
			getById("settingsbutton").classList.add("hidden");
			getById("screenshare2button").classList.add("hidden");
			getById("screensharebutton").classList.add("hidden");
			getById("queuebutton").classList.add("hidden");
		} else {
			getById("controlButtons").style.display = "none";
		}

		if (session.chatbutton === true) {
			getById("chatbutton").classList.remove("hidden");
			getById("controlButtons").style.display = "inherit";
		} else if (session.chatbutton === false) {
			getById("chatbutton").classList.add("hidden");
		}

		getById("head1").className = 'hidden'; 
		getById("head2").className = 'hidden';
	}).catch(() => {});
}

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.documentElement.clientHeight
  );
}

function updateForceRotate(){
	if (session.orientation){
		try {
			var track = false;
			if (session.streamSrc){
				var tracks = session.streamSrc.getVideoTracks();
				if (tracks.length){
					track = tracks[0];
				}
			}
			if (!track){
				return;
			}
			
			const capabilities = track.getCapabilities();
			const settings = track.getSettings();
			session.currentCameraConstraints = settings;
			if ("width" in settings){
				if ("height" in settings){
					if (settings.width < settings.height){
						if (session.orientation=="landscape"){
							if (capabilities.facingMode == "environment"){
								session.forceRotate=270;
							} else {
								session.forceRotate=90;
							}
						} else {
							//if (!session.forceRotate){return;}
							session.forceRotate = 0;
						}
					} else if (settings.width > settings.height){
						if (session.orientation=="portrait"){
							if (capabilities.facingMode == "environment"){
								session.forceRotate=90;
							} else {
								session.forceRotate=270;
							}
						} else {
							//if (!session.forceRotate){return;}
							session.forceRotate = 0;
						}
					} else {
					//	if (!session.forceRotate){return;}
						session.forceRotate = 0;
					}
				} else {
					return;
				}
			} else {
				return;
			}
			
			var msg = {};
			if (session.forceRotate!==false){
				if (session.rotate){
					msg.rotate_video = session.forceRotate + parseInt(session.rotate); 
				} else {
					msg.rotate_video = session.forceRotate;
				}
			} else {
				msg.rotate_video = session.rotate;
			}
			
			if (msg.rotate_video && (msg.rotate_video>=360)){
				msg.rotate_video-=360;
			}
			session.sendMessage(msg);
			
		} catch(e){errorlog(e);}
		updateForceRotatedCSS()
		applyMirror(session.mirrorExclude);
	}
}

function updateForceRotatedCSS(){
	if (session.forceRotate==270){
		document.body.setAttribute( "style", "transform: rotate(270deg);position: absolute;top: "+(getWidth()/4)+"px;left: -"+ (getHeight()/4) + "px;height: 95vw;width: 95vh;");
	} else if (session.forceRotate==90){
		document.body.setAttribute( "style", "transform: rotate(90deg);position: absolute;top: "+(getWidth()/4)+"px;left: -"+ (getHeight()/4) + "px;height: 95vw;width: 95vh;");
	} else {
		document.body.setAttribute( "style", "");
	}
	
	if (session.forceRotate==270){
		document.body.setAttribute( "style", "transform: rotate(270deg);position: absolute;top: "+(getWidth()/4)+"px;left: -"+ (getHeight()/4) + "px;height: 95vw;width: 95vh;");
	} else if (session.forceRotate==90){
		document.body.setAttribute( "style", "transform: rotate(90deg);position: absolute;top: "+(getWidth()/4)+"px;left: -"+ (getHeight()/4) + "px;height: 95vw;width: 95vh;");
	} else {
		document.body.setAttribute( "style", "");
	}
}

function joinDataMode(){ // join the room, but without publishing anything. 
	session.connect();
	if (session.roomid){
		getById("head3").classList.add('hidden');
		getById("head3a").classList.add('hidden');
		joinRoom(session.roomid);
	}
}

function publishWebcam(btn = false) {
	
	if (btn) {
		if (btn.dataset.ready == "false") {
			warnlog("Clicked too quickly; button not enabled yet");
			return;
		}
		
		if (getById("passwordBasicInput").value.length){
			session.password = getById("passwordBasicInput").value;
			session.password = sanitizePassword(session.password);
			if (session.password.length==0){
				session.password = false;
			} else {
				session.defaultPassword = false;
				if (urlParams.has('pass')) {
					updateURL("pass=" + session.password);
				} else if (urlParams.has('pw')) {
					updateURL("pw=" + session.password);
				} else if (urlParams.has('p')) {
					updateURL("p=" + session.password);
				} else {
					updateURL("password=" + session.password);
				}
			}
		}
	}

	if (activatedStream == true) {
		return;
	}
	activatedStream = true;
	log("PRESSED PUBLISH WEBCAM!!");

	var ele = getById("previewWebcam");

	formSubmitting = false;
	window.scrollTo(0, 0); // iOS has a nasty habit of overriding the CSS when changing camaera selections, so this addresses that.

	getById("head2").className = 'hidden';

	if (session.roomid !== false) {
		if ((session.roomid === "") && ((!(session.view)) || (session.view === ""))) {
			//	no room, no viewing, viewing disabled
			session.manual = true;
			window.onresize = updateMixer;
			window.onorientationchange = function(){setTimeout(function(){
				updateForceRotate();
				updateMixer();
			}, 200);};
			
			if (!(session.cleanOutput)) {
				var showReshare = getStorage("showReshare");
				if (showReshare){
					generateHash(session.streamID + session.salt + "bca321", 4).then(function(hash) { // million to one error. 
						if (showReshare === hash){
							getById("head3").classList.remove('hidden');
							getById("head3a").classList.remove('hidden');
						}
					}).catch(errorlog);
				}
			}
			
		} else {
			log("ROOM ID ENABLED");
			log("Update Mixer Event on REsize SET");
			window.onresize = updateMixer;
			window.onorientationchange = function(){setTimeout(function(){
				updateForceRotate();
				updateMixer();
			}, 200);};
			getById("main").style.overflow = "hidden";
			//session.cbr=0; // we're just going to override it

			if (session.stereo == 5) {
				if (session.roomid === "") {
					session.stereo = 1;
				} else {
					session.stereo = 3;
				}
			}
			joinRoom(session.roomid);
			if (session.roomid !== "") {
				if (!(session.cleanOutput)) {
					getById("head2").className = '';
				}
			}
			getById("head3").classList.add('hidden');
			getById("head3a").classList.add('hidden');
		}

	} else {
		getById("head3").classList.remove('hidden');
		getById("head3a").classList.remove('hidden');
		getById("logoname").style.display = 'none';
		generateHash(session.streamID  + session.salt + "bca321", 4).then(function(hash) { // million to one error. 
			setStorage("showReshare", hash, 24*30)
		}).catch(errorlog);
	}
	
	log("streamID is: " + session.streamID);
	getById("head1").className = 'hidden';


	if (!(session.cleanOutput)) {
		getById("mutebutton").classList.remove("hidden");
		getById("mutespeakerbutton").classList.remove("hidden");
		//getById("mutespeakerbutton").className="float";
		getById("chatbutton").className = "float";
		getById("mutevideobutton").className = "float";
		getById("hangupbutton").className = "float";
		if (session.showSettings) {
			getById("settingsbutton").className = "float";
		}
		if (session.raisehands) {
			getById("raisehandbutton").className = "float";
		}
		if (session.recordLocal !== false) {
			getById("recordLocalbutton").className = "float";
		}
		if (session.screensharebutton) {
			if (session.roomid) {
				if (session.screensharetype===3){
					getById("screenshare3button").className = "float";
					getById("screensharebutton").className = "float hidden";
					getById("screenshare2button").className = "float hidden";
				} else if (session.screensharetype===1){
					getById("screensharebutton").className = "float";
					getById("screenshare3button").className = "float hidden";
					getById("screenshare2button").className = "float hidden";
				} else {
					getById("screenshare2button").className = "float";
					getById("screensharebutton").className = "float hidden";
					getById("screenshare3button").className = "float hidden";
				}
			} else {
				getById("screensharebutton").className = "float";
				getById("screenshare2button").className = "float hidden";
				getById("screenshare3button").className = "float hidden";
			}
		}
		getById("controlButtons").style.display = "flex";
		getById("helpbutton").style.display = "inherit";
		getById("reportbutton").style.display = "";
	} else if (session.cleanish && session.recordLocal!==false){
		getById("recordLocalbutton").className = "float";
		getById("mutebutton").classList.add("hidden");
		getById("mutespeakerbutton").classList.add("hidden");
		getById("chatbutton").classList.add("hidden");
		getById("mutevideobutton").classList.add("hidden");
		getById("hangupbutton").classList.add("hidden");
		getById("hangupbutton2").classList.add("hidden");
		getById("controlButtons").style.display = "flex";
		getById("settingsbutton").classList.add("hidden");
		getById("screenshare2button").classList.add("hidden");
		getById("screensharebutton").classList.add("hidden");
		getById("queuebutton").classList.add("hidden");
	} else {
		getById("controlButtons").style.display = "none";
	}
	
	if (session.chatbutton === true) {
		getById("chatbutton").classList.remove("hidden");
		getById("controlButtons").style.display = "inherit";
	} else if (session.chatbutton === false) {
		getById("chatbutton").classList.add("hidden");
	}
	
	updatePushId() 
	
	if (session.dataMode){ // skip the media stuff.
		errorlog("this shoulnd't happen..");
		session.postPublish();
		return;
	}
	
	if (!session.streamSrc){
		checkBasicStreamsExist(); // create srcObject + videoElement
	}
	session.publishStream(ele); // calls session.postPublish at the end.
}

function createYoutubeLink(vidid){
	return "https://www.youtube.com/embed/"+vidid+"?modestbranding=1&playsinline=1&enablejsapi=1";
}
function parseURL4Iframe(iframeURL){
	if (iframeURL==""){
		iframeURL="./";
	}
	if (iframeURL === session.iframeSrc){return iframeURL;}
	
	if (iframeURL.startsWith("http://")){
		try {
			iframeURL = "https://"+ iframeURL.split("http://")[1];
		} catch(e){errorlog(e);}
	}
	
	if (iframeURL.startsWith("https://") || iframeURL.startsWith("http://")){
		var domain = (new URL(iframeURL));
		domain = domain.hostname;
		
		if (domain == "youtu.be"){
			iframeURL  = iframeURL.replace("youtu.be/","youtube.com/watch?v=");
		}
		
		if ((domain == "youtu.be") || (domain=="www.youtube.com") || (domain=="youtube.com")){
			var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
			var match = iframeURL.match(regExp);
			var vidid = (match&&match[7].length==11)? match[7] : false;
			
			// https://www.youtube.com/live_chat?v=<your video ID>&embed_domain=<your blog domain>
			if (iframeURL.includes("/live_chat")){
				if (!iframeURL.includes("&embed_domain=")){
					iframeURL += "&embed_domain="+location.hostname;
				}
			}
			
			if (vidid){
				//specialResult = {};
				//specialResult.originalSrc = iframeURL;
				//specialResult.parsedSrc = "https://www.youtube.com/embed/"+vidid+"?autoplay=1&modestbranding=1&playsinline=1&enablejsapi=1";
				//specialResult.handler = "youtube";
				//specialResult.vid = vidid;
				//iframeURL = specialResult;
				iframeURL = createYoutubeLink(vidid);
			} else { // see if there is a playlist link here or not.
			
				// https://youtube.com/playlist?list=PLWodc2tCfAH1l_LDvEyxEqFf42hOBKqQM
				iframeURL  = iframeURL.replace("playlist?list=","embed/videoseries?list=");
				
				var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(videoseries\?))\??list?=?([^#&?]*).*/;
				var match = iframeURL.match(regExp);
				var plid = (match&&match[7].length==34)? match[7] : false;
				if (plid){
					iframeURL = 'https://www.youtube.com/embed/videoseries?list='+plid+"&autoplay=1&modestbranding=1&playsinline=1&enablejsapi=1";
				}
				
			}
		} else if (domain=="www.twitch.tv"){
			if (iframeURL.includes("twitch.tv/popout/")){
				// this is a twitch live chat window
				iframeURL = iframeURL.replace("/popout/","/embed/");
				iframeURL = iframeURL.replace("?popout=","?parent="+location.hostname);
				iframeURL = iframeURL.replace("?popout","?parent="+location.hostname);
				if (iframeURL.includes("darkpopout=")){
					iframeURL = iframeURL.replace("?darkpopout=","?darkpopout=&parent="+location.hostname);
				} else {
					iframeURL = iframeURL.replace("?darkpopout","?darkpopout&parent="+location.hostname);
				}
			} else {
				var vidid = iframeURL.split('/').pop().split('#')[0].split('?')[0];
				if (vidid){
					iframeURL = "https://player.twitch.tv/?channel="+vidid+"&parent="+location.hostname;
				} 
			}
		} else if (domain=="twitch.tv"){
			if (iframeURL.includes("twitch.tv/popout/")){
				// this is a twitch live chat window
				iframeURL = iframeURL.replace("/popout/","/embed/");
				iframeURL = iframeURL.replace("?popout=","?parent="+location.hostname);
				iframeURL = iframeURL.replace("?popout","?parent="+location.hostname);
				if (iframeURL.includes("darkpopout=")){
					iframeURL = iframeURL.replace("?darkpopout=","?darkpopout=&parent="+location.hostname);
				} else {
					iframeURL = iframeURL.replace("?darkpopout","?darkpopout&parent="+location.hostname);
				}
			} else {
				var vidid = iframeURL.split('/').pop().split('#')[0].split('?')[0];
				if (vidid){
					iframeURL = "https://player.twitch.tv/?channel="+vidid+"&parent="+location.hostname;
				} 
			}
		} else if ((domain=="www.vimeo.com") || (domain=="vimeo.com")){
			iframeURL = iframeURL.replace("//vimeo.com/","//player.vimeo.com/video/");
			iframeURL = iframeURL.replace("//www.vimeo.com/","//player.vimeo.com/video/");
		}
	}
	return iframeURL;
}

function soloLinkGenerator(streamID, scene=true){
	
	var codecGroupFlag="";
	if (session.codecGroupFlag){
		codecGroupFlag = session.codecGroupFlag;
	}
	if (session.bitrateGroupFlag){
		codecGroupFlag += session.bitrateGroupFlag;
	}
	
	var pie = "";
	if (session.customWSS){
		if (session.customWSS!==true){
			pie = "&pie="+session.customWSS;
		}
	}

	var passAdd2="";
	if (session.password){
		if (session.defaultPassword===false){
			passAdd2="&password="+session.password;
		}
	}
	
	if (scene){
		return "https://"+location.host+location.pathname+"?view="+streamID+"&scene"+codecGroupFlag+"&room="+session.roomid+passAdd2+pie;
	} else {
		return "https://"+location.host+location.pathname+"?view="+streamID+codecGroupFlag+passAdd2+pie;
	}
}

function YoutubeAPI(iframe, func, args) { // playVideo, pauseVideo, stopVideo
	if (!(iframe && iframe.contentWindow)){return;}
	try {
		iframe.contentWindow.postMessage(JSON.stringify({
			"event": "command",
			"func": func,
			"args": args || [],
			"id": iframe.id || "unknown"
		}), "*");
	} catch(e){}
}

function YoutubeListen(iframe_id){
	var iframe = document.getElementById(iframe_id);
	if (!iframe){return;}
	if (iframe.loadedYoutubeListen){return;}
	try {
		iframe.contentWindow.postMessage(JSON.stringify({"event":"listening","id":iframe_id}),'*'); // 
	} catch(e){	}
	setTimeout(function(iframe_id){YoutubeListen(iframe_id);},1000,iframe_id);
}

function processYoutubeEvent(e){
	if (!(e.type && (e.type === "message"))){return;}
	try {
		var data = JSON.parse(e.data);
		if ("id" in data){
			var iframe = document.getElementById(data.id);
			if (!iframe){return;}
			if (!iframe.loadedYoutubeListen){
				iframe.loadedYoutubeListen = true;
			}
		}
		if (!("mediaReferenceTime" in data.info)){
			return;
		}
	} catch(e){return;}

	log(e);
	
	if (iframe.id=="iframe_source"){
		
		if (!session.iframeEle.sendOnNewConnect){
			session.iframeEle.sendOnNewConnect = {};
			session.iframeEle.sendOnNewConnect.ifs = {};
			session.iframeEle.sendOnNewConnect.ifs.t = null;
			session.iframeEle.sendOnNewConnect.ifs.v = null;
			session.iframeEle.sendOnNewConnect.ifs.s = null;
			session.iframeEle.sendOnNewConnect.ifs.r = null;
		}
		
		try {
			var msg = {}; 
			msg.ifs = {}
			
			try{
				msg.ifs.t = parseFloat(data.info.mediaReferenceTime+0.01) || 0;
				session.iframeEle.sendOnNewConnect.ifs.t = msg.ifs.t;
			} catch(e){return;}
			
			if ("playerState" in data.info){
				msg.ifs.s = parseInt(data.info.playerState);
				
				if (msg.ifs.s == -1){
					msg.ifs.s = 0;
				}
				if (msg.ifs.s == 2){
					if (session.iframeEle.sendOnNewConnect.ifs.s==3){
						delete(msg.ifs.s);
					} else {
						msg.ifs.s = 3;
					}
				}
				if (msg.ifs.s && (session.iframeEle.sendOnNewConnect.ifs.s != msg.ifs.s)){
					session.iframeEle.sendOnNewConnect.ifs.s = msg.ifs.s;
				} else {
					//delete(msg.ifs.s);
				}
				
				if ("videoData" in data.info){
					if (session.iframeEle.sendOnNewConnect.ifs.v != data.info.videoData.video_id){
						session.iframeEle.sendOnNewConnect.ifs.v = data.info.videoData.video_id;
						msg.ifs.v = data.info.videoData.video_id;
						
						var vidSrc = createYoutubeLink(msg.ifs.v);
						if (vidSrc!==session.iframeSrc){
							session.iframeSrc = vidSrc;
							var data = {}
							data.iframeSrc = session.iframeSrc;
							if (parseInt(msg.ifs.t)>1){
								data.iframeSrc += "&start="+parseInt(Math.ceil(msg.ifs.t))+""; 
							}
							
							for (var UUID in session.pcs){
								if (session.pcs[UUID].allowIframe===true){
									session.sendMessage(data, UUID);
								}
							}
							return;
						}
					}
				}
				// we will still be sending the msg data if available.
			} else if ("videoData" in data.info){
				if (session.iframeEle.sendOnNewConnect.ifs.v != data.info.videoData.video_id){
					msg.ifs.v = data.info.videoData.video_id;
					session.iframeEle.sendOnNewConnect.ifs.v = msg.ifs.v;
					var vidSrc = createYoutubeLink(msg.ifs.v);
					if (vidSrc!==session.iframeSrc){
						session.iframeSrc = vidSrc;
						var data = {}
						data.iframeSrc = session.iframeSrc;
						if (parseInt(msg.ifs.t)>1){
							data.iframeSrc += "&start="+parseInt(Math.ceil(msg.ifs.t))+""; 
						}
						if (session.iframeEle.sendOnNewConnect.ifs.s == "1"){
							data.iframeSrc += "&autoplay=1"; 
						} else {
							data.iframeSrc += "&autoplay=0"; 
						}
						for (var UUID in session.pcs){
							if (session.pcs[UUID].allowIframe===true){
								session.sendMessage(data, UUID);
							}
						}
						return;
					}
				}
			} else {
				if ("playbackRate" in data.info){
					msg.ifs.r = parseFloat(data.info.playbackRate);
					if (session.iframeEle.sendOnNewConnect.ifs.r != msg.ifs.r){
						session.iframeEle.sendOnNewConnect.ifs.r = msg.ifs.r;
					} else {
						delete(msg.ifs.r);
					}
				}
				if (session.iframeEle.sendOnNewConnect.ifs.s == 1){
					if ("t" in msg.ifs){
						delete(msg.ifs.t);
					}
				}
			}
			
			if (Object.keys(msg.ifs).length == 0){return;}
			
			for (var UUID in session.pcs){
				if (session.pcs[UUID].allowIframe){
					session.sendMessage(msg);
				}
			}
		} catch(e){return;}
	} else {
		try{
			var UUID = iframe.dataset.UUID;
			var msg = {}; 
			msg.ifs = {}
			if ("t" in msg.ifs){
				msg.ifs.t = parseFloat(data.info.mediaReferenceTime+0.01) || 0; 
				/* if (!iframe.sendOnNewConnect){
					iframe.sendOnNewConnect = msg;
				} else {
					iframe.sendOnNewConnect.ifs.t = msg.ifs.t;
				} */
			}
			
			if ("playerState" in data.info){ 
				msg.ifs.s = parseInt(data.info.playerState);
			}
			if ("videoData" in data.info){
				msg.ifs.v = data.info.videoData.video_id;
			} 
			if (("playbackRate" in data.info) && (data.info.playbackRate!==1)){
				msg.ifs.r = parseFloat(data.info.playbackRate);
			}
			// TODO: the viewers don't have a way to tell the director if they reload what the time is at.
			session.sendRequest(msg, UUID); // send to the iframe's owner only. let them be the controller for others.
		} catch(e){return;}
	}
}

function processIframeSyncFeedback(ifs, UUID){ // remote iframe feedback from the remote viewers
	// YoutubeAPI("iframe_source", "seekTo", [700]);
	// YoutubeAPI("iframe_source", "volume", [100]);
	
	warnlog(ifs);
	return;
	
	
	if (!session.iframeEle.sendOnNewConnect){
		session.iframeEle.sendOnNewConnect = {};
		session.iframeEle.sendOnNewConnect.ifs = {};
		session.iframeEle.sendOnNewConnect.ifs.t = null;
		session.iframeEle.sendOnNewConnect.ifs.v = null;
		session.iframeEle.sendOnNewConnect.ifs.s = null;
		session.iframeEle.sendOnNewConnect.ifs.r = null;
	}
	
	if ("t" in ifs){
		if (Math.abs(session.iframeEle.sendOnNewConnect.ifs.t-ifs.t)>=1){
			//session.iframeEle.sendOnNewConnect.ifs.t = ifs.t;
		} else {
			delete(ifs.t);
		}
	}
	if ("v" in ifs){
		if (session.iframeEle.sendOnNewConnect.ifs.v != ifs.v){
			//session.iframeEle.sendOnNewConnect.ifs.v = ifs.v;
		} else {
			delete(ifs.v);
		}
	}
	if ("s" in ifs){
		
		if (ifs.s == -1){
			ifs.s = 0;
		}
		if (session.iframeEle.sendOnNewConnect.ifs.s == -1){
			session.iframeEle.sendOnNewConnect.ifs.s = 0;
		}
		
		if (ifs.s == 2){
			ifs.s = 3;
		}
		if (session.iframeEle.sendOnNewConnect.ifs.s == 2){
			session.iframeEle.sendOnNewConnect.ifs.s = 3;
		}
		
		if (session.iframeEle.sendOnNewConnect.ifs.s != ifs.s){
			//session.iframeEle.sendOnNewConnect.ifs.s = ifs.s;
		} else {
			delete(ifs.s);
		}
	}
	if ("r" in ifs){
		if (session.iframeEle.sendOnNewConnect.ifs.r != ifs.r){
			//session.iframeEle.sendOnNewConnect.ifs.r = ifs.r;
		} else {
			delete(ifs.r);
		}
	}
	
	
	if (session.iframeEle){
		if (ifs.v){ // I need to have this change videos .
			var vidSrc = createYoutubeLink(ifs.v);
			if (vidSrc!==session.iframeSrc){
				session.iframeSrc = vidSrc;
				session.iframeEle.src = vidSrc;
			}
		} else if ("t" in ifs){
			YoutubeAPI(session.iframeEle, "seekTo", [parseFloat(ifs.t)]);
		} else if (ifs.r){ /// setPlaybackRate
			YoutubeAPI(session.iframeEle, "setPlaybackRate", [parseFloat(ifs.r)]);
		} else if ("s" in ifs){ /// setPlaybackState
			 if (ifs.s == -1) {  YoutubeAPI(session.iframeEle, "stopVideo");  }
			 else if (ifs.s == 0) {  YoutubeAPI(session.iframeEle, "stopVideo"); } // player stops.
			 else if (ifs.s == 1) {  YoutubeAPI(session.iframeEle, "playVideo");  } //Video is playing
			 else if (ifs.s == 2) {  YoutubeAPI(session.iframeEle, "pauseVideo"); }  //Video is paused
			 else if (ifs.s == 3) {  YoutubeAPI(session.iframeEle, "pauseVideo");  } //video is buffering 
			 else if (ifs.s == 5) { } //Video is cued.
		}
	} else if (session.iframeSrc){
		if (ifs.v){
			var vidSrc = createYoutubeLink(ifs.v);
			if (vidSrc!==session.iframeSrc){
				session.iframeSrc = vidSrc;
				var data = {}
				data.iframeSrc = session.iframeSrc;
				if (ifs.t && (parseInt(ifs.t)>1)){
					data.iframeSrc += "&start="+parseInt(Math.ceil(ifs.t)); 
				}
				if (ifs.s == "1"){
					data.iframeSrc += "&autoplay=1"; 
				} else {
					data.iframeSrc += "&autoplay=0"; 
				}
				for (var uuid in session.pcs){
					if (uuid == UUID){continue;}
					if (session.pcs[uuid].allowIframe===true){
						session.sendMessage(data, uuid);
					}
				}
				return;
			}
		}
		// we're going to forward the message directly to the other viewers instead
		if ("s" in ifs){ /// setPlaybackState
			var msg = {}; 
			msg.ifs = ifs;
			for (var uuid in session.pcs){
				if (uuid == UUID){continue;}
				if (session.pcs[uuid].allowIframe){
					session.sendMessage(msg, uuid);
				}
			}
		}
	}
}

function processIframeSyncUpdates(ifs, UUID){ // playback updates from remote guest.
	// YoutubeAPI("iframe_source", "seekTo", [700]);
	// YoutubeAPI("iframe_source", "volume", [100]);
	if (ifs.v && ("s" in ifs)){
		//
	} else if ("s" in ifs){
		if ("t" in ifs){
			YoutubeAPI(session.rpcs[UUID].iframeEle, "seekTo", [parseFloat(ifs.t)]);
		}
		YoutubeAPI(session.rpcs[UUID].iframeEle, "playVideo");
	} else if ("t" in ifs){
		YoutubeAPI(session.rpcs[UUID].iframeEle, "seekTo", [parseFloat(ifs.t)]);
	}
	if (ifs.r){ /// setPlaybackRate
		YoutubeAPI(session.rpcs[UUID].iframeEle, "setPlaybackRate", [parseFloat(ifs.r)]);
	}
	if ("s" in ifs){ /// setPlaybackState
		 if (ifs.s == -1) {  YoutubeAPI(session.rpcs[UUID].iframeEle, "stopVideo");  }
		 else if (ifs.s == 0) {  YoutubeAPI(session.rpcs[UUID].iframeEle, "stopVideo"); } // player stops.
		 else if (ifs.s == 1) {  YoutubeAPI(session.rpcs[UUID].iframeEle, "playVideo");  } //Video is playing
		 else if (ifs.s == 2) {  YoutubeAPI(session.rpcs[UUID].iframeEle, "pauseVideo"); }  //Video is paused
		 else if (ifs.s == 3) {  YoutubeAPI(session.rpcs[UUID].iframeEle, "pauseVideo");  } //video is buffering 
		 else if (ifs.s == 5) { } //Video is cued.
	}
}

function updatePushId(){
	if (session.doNotSeed){return;}
	
	if (urlParams.has('push')){
		updateURL("push="+session.streamID);
	} else if (urlParams.has('id')){
		updateURL("id="+session.streamID);
	} else if (urlParams.has('permaid')){
		updateURL("permaid="+session.streamID);
	} else {
		updateURL("push="+session.streamID);
	}
}

session.publishIFrame = function(iframeURL){
	
	if (session.transcript){
		setTimeout(function(){setupClosedCaptions();},1000);
	}
	
	session.iframeSrc = parseURL4Iframe(iframeURL);
	
	var iframe = document.createElement("iframe");
	iframe.allow = "autoplay;camera;microphone;fullscreen;picture-in-picture;display-capture;midi;";
	iframe.src = session.iframeSrc;
	iframe.id = "iframe_source";
	iframe.loadedYoutubeListen = false;
	session.iframeEle = iframe;
	
	var container = document.createElement("div");
	iframe.container = container;
	container.id = "container_iframe";
	container.appendChild(iframe);
	getById("gridlayout").appendChild(container);
	
	if (session.iframeSrc.startsWith("https://www.youtube.com/")){ // special handler.
		setTimeout(function(iframe_id){YoutubeListen(iframe_id);}, 1000, iframe.id);
	} 
	
	if (session.cover){
		container.style.setProperty('height', '100%', 'important');
	}
	
	if (session.roomid!==false){
		if ((session.roomid==="") && ((!(session.view)) || (session.view===""))){
			
		} else {
			log("ROOMID EANBLED");
			getById("head3").classList.add('hidden');
			getById("head3a").classList.add('hidden');
			joinRoom(session.roomid);
		}
		
	} else {
		getById("head3").classList.remove('hidden');
		getById("head3a").classList.remove('hidden');
		getById("logoname").style.display = 'none';
	}
	getById("head1").className = 'hidden';
	
	updatePushId()
	
	getById("head1").className = 'hidden';
	getById("head2").className = 'hidden';

	if (!(session.cleanOutput)){
		getById("chatbutton").className="float";
		getById("hangupbutton").className="float";
		getById("controlButtons").style.display="flex";
		getById("helpbutton").style.display = "inherit";
		getById("reportbutton").style.display = "";
	} else {
		getById("controlButtons").style.display="none";
	}
	
	if (session.chatbutton === false) {
		getById("chatbutton").classList.add("hidden");
	}
	
	if (session.director){
		//
	} else if (session.scene!==false){
		updateMixer();
	} else if (session.roomid!==false){
		if (session.roomid===""){
			if (!(session.view) || (session.view==="")){
				session.windowed = true;
				
				getById("mutespeakerbutton").classList.add("hidden");
				container.style.width="100%";
				container.style.height="100%";
				container.style.alignItems = "center";
				container.style.maxWidth= "100%";
				container.style.maxHeight= "100%";
				container.style.verticalAlign= "middle";
				container.style.margin= "auto";
				container.style.backgroundColor = "#666";
				container.style.border = "2px solid";
				
			} else {
				session.windowed = false;
				window.onresize = updateMixer;
				updateMixer();
			}
		} else {
			window.onresize = updateMixer;
			session.windowed = false;
			updateMixer();
		}
	} else {
		window.onresize = updateMixer;
		container.style.maxHeight= "1280px";
		container.style.maxWidth= "720px";
		container.style.verticalAlign= "middle";
		container.style.height="100%";
		container.style.width= "100%";
		container.style.margin= "auto";
		container.style.alignItems = "center";
		container.style.backgroundColor = "#666";
	}
	
	session.seeding=true;
	
	updateReshareLink();
	pokeIframeAPI('started-iframe-share');
	session.seedStream();
	
	return container;
} // publishIframe

function outboundAudioPipeline() { // this function isn't letting me change the audio source
	if (session.disableWebAudio) {
		//if (session.mobile){return session.streamSrc;} // iOS devices can't remap video tracks, else KABOOM. Might as well do this for android also.
		
		var newStream = createMediaStream();
		session.streamSrc.getAudioTracks().forEach(function(track) { // this seems to fix a bug with macbooks. 
			newStream.addTrack(track, session.streamSrc);
		});
		if (session.videoElement.srcObject){
			session.videoElement.srcObject.getVideoTracks().forEach(function(track) { // this seems to fix a bug with macbooks. 
				newStream.addTrack(track, session.videoElement.srcObject);
			});
		} else {
			session.streamSrc.getVideoTracks().forEach(function(track) { // this seems to fix a bug with macbooks. 
				newStream.addTrack(track, session.streamSrc);
			});
		}
		return newStream;
	}
	
	try {
		log("Web Audio");
		var tracks = session.streamSrc.getAudioTracks();
		if (tracks.length) {
			for (var waid in session.webAudios) { // TODO:  EXCLUDE CURRENT TRACK IF ALREADY EXISTS ... if (track.id === wa.id){..
				session.webAudios[waid].stop();
				delete session.webAudios[waid];
			}

			var webAudio = {};
			webAudio.micDelay = false;
			webAudio.compressor = false;
			webAudio.analyser = false;
			webAudio.gainNode = false;
			webAudio.splitter = false;
			webAudio.subGainNodes = false;

			webAudio.lowEQ = false;
			webAudio.midEQ = false;
			webAudio.highEQ = false;
			webAudio.lowcut1 = false;
			webAudio.lowcut2 = false;
			webAudio.lowcut3 = false;

			webAudio.id = tracks[0].id; // first track is used.

			if (session.audioLatency !== false) { // session.audioLatency could be useful for fixing clicking issues?
				var audioContext = new AudioContext({
					latencyHint: session.audioLatency / 1000.0 //, // needs to be in seconds, but VDON user input is via milliseconds
					// sampleRate: 48000 // not sure this is a great idea, but might as well add this here, versus later on since it is needed anyways.
				});
			} else {
				var audioContext = new AudioContext();
			}

			webAudio.audioContext = audioContext;
			webAudio.destination = audioContext.createMediaStreamDestination();
			
			
			if (tracks.length>1){ // tries to 
				try {
					webAudio.mediaStreamSource = createMediaStream();
					var maxChannelCount = 2;
					if (session.stereo===false){
						maxChannelCount = 1;
					}
					
					webAudio.subGainNodes = {};//
					
					var merger = audioContext.createChannelMerger(maxChannelCount);
					for (var i=0;i<tracks.length;i++){
						try {
							var tempStream = createMediaStream();
							tempStream.addTrack(tracks[i]);
							trackStream = audioContext.createMediaStreamSource(tempStream);
							
							webAudio.subGainNodes[tracks[i].id] = audioContext.createGain();
							trackStream.connect(webAudio.subGainNodes[tracks[i].id]);
							
							if (maxChannelCount==2){
								var splitter = audioContext.createChannelSplitter(2);
								webAudio.subGainNodes[tracks[i].id].connect(splitter);
								splitter.connect(merger, 0, 0);
								try{
									splitter.connect(merger, 1, 1);
								} catch(e){
									errorlog(e);
									try {
										splitter.connect(merger, 0, 1); // hack.
									} catch(e){errorlog(e);}
								}
							} else {
								webAudio.subGainNodes[tracks[i].id].connect(merger, 0, 0);
							}
						} catch(e){errorlog(e);}
					}
					
					webAudio.gainNode = audioGainNode(merger, audioContext);
				} catch(e){
					webAudio.mediaStreamSource = audioContext.createMediaStreamSource(session.streamSrc);
					webAudio.gainNode = audioGainNode(webAudio.mediaStreamSource, audioContext);
				}
			} else {
				webAudio.mediaStreamSource = audioContext.createMediaStreamSource(session.streamSrc); // clone to fix iOS issue
				webAudio.gainNode = audioGainNode(webAudio.mediaStreamSource, audioContext);
			}

			var anonNode = webAudio.gainNode;
			
			if (session.micDelay) {
				webAudio.micDelay = micDelayNode(anonNode, audioContext);
				anonNode = webAudio.micDelay;
			}

			if (session.audioInputChannels == 1) {
				webAudio.splitter = audioContext.createChannelSplitter(6);
				anonNode.connect(webAudio.splitter);

				webAudio.merger = audioContext.createChannelMerger(6);
				webAudio.splitter.connect(webAudio.merger, 0, 0);
				webAudio.splitter.connect(webAudio.merger, 0, 1);
				webAudio.splitter.connect(webAudio.merger, 0, 2);
				webAudio.splitter.connect(webAudio.merger, 0, 3);
				webAudio.splitter.connect(webAudio.merger, 0, 4);
				webAudio.splitter.connect(webAudio.merger, 0, 5);
				anonNode = webAudio.merger;
			}


			if (session.lowcut) { // https://webaudioapi.com/samples/frequency-response/ for a tool to help set values
				webAudio.lowcut1 = audioContext.createBiquadFilter();
				webAudio.lowcut1.type = "highpass";
				webAudio.lowcut1.frequency.value = session.lowcut;

				webAudio.lowcut2 = audioContext.createBiquadFilter();
				webAudio.lowcut2.type = "highpass";
				webAudio.lowcut2.frequency.value = session.lowcut;

				webAudio.lowcut3 = audioContext.createBiquadFilter();
				webAudio.lowcut3.type = "highpass";
				webAudio.lowcut3.frequency.value = session.lowcut;

				anonNode.connect(webAudio.lowcut1);
				webAudio.lowcut1.connect(webAudio.lowcut2);
				webAudio.lowcut2.connect(webAudio.lowcut3);
				anonNode = webAudio.lowcut3;
			}


			if (session.equalizer) { // https://webaudioapi.com/samples/frequency-response/ for a tool to help set values
				webAudio.lowEQ = audioContext.createBiquadFilter();
				webAudio.lowEQ.type = "lowshelf";
				webAudio.lowEQ.frequency.value = 100;
				webAudio.lowEQ.gain.value = 0;

				webAudio.midEQ = audioContext.createBiquadFilter();
				webAudio.midEQ.type = "peaking";
				webAudio.midEQ.frequency.value = 1000;
				webAudio.midEQ.Q.value = 0.5;
				webAudio.midEQ.gain.value = 0;

				webAudio.highEQ = audioContext.createBiquadFilter();
				webAudio.highEQ.type = "highshelf";
				webAudio.highEQ.frequency.value = 10000;
				webAudio.highEQ.gain.value = 0;

				anonNode.connect(webAudio.lowEQ);
				webAudio.lowEQ.connect(webAudio.midEQ);
				webAudio.midEQ.connect(webAudio.highEQ);
				anonNode = webAudio.highEQ;
			}

			if (session.compressor === 1) {
				webAudio.compressor = audioCompressor(anonNode, audioContext);
				anonNode = webAudio.compressor;
			} else if (session.compressor === 2) {
				webAudio.compressor = audioLimiter(anonNode, audioContext);
				anonNode = webAudio.compressor;
			}

			webAudio.analyser = audioMeter(anonNode, audioContext);
			webAudio.analyser.connect(webAudio.destination);

			webAudio.stop = function() {
				try {
					clearInterval(webAudio.analyser.interval);
				} catch(e){}
				
				for (var node in webAudio){
					try {
						webAudio[node].disconnect();
					} catch(e){}
				}
				try {
					webAudio.mediaStreamSource.context.close();
				} catch(e){}
				
				
			}

			webAudio.mediaStreamSource.onended = function() {
				webAudio.stop();
			};

			session.webAudios[webAudio.id] = webAudio;
			if (session.videoElement.srcObject){
				session.videoElement.srcObject.getVideoTracks().forEach(function(track) {
					if (webAudio.id != track.id) {
						webAudio.destination.stream.addTrack(track, session.videoElement.srcObject);
					}
				});
			} else {
				session.streamSrc.getVideoTracks().forEach(function(track) {
					if (webAudio.id != track.id) {
						webAudio.destination.stream.addTrack(track, session.streamSrc);
					}
				});
			}
			
			try {
				if (webAudio.audioContext.state == "suspended"){
					webAudio.audioContext.resume();
				}
			} catch(e){warnlog("session.audioCtx.resume(); failed");}
			
			return webAudio.destination.stream;
		} else {
			
			//if (session.mobile){return session.streamSrc;} // this avoids issues on mobile? <- caused problems
			// there are no audio tracks, given this case. so, skip /* session.streamSrc.getAudioTracks().forEach(function(track) { // this seems to fix a bug with macbooks. 
			//	newStream.addTrack(track, session.streamSrc);
			//}); */
			
			if (session.videoElement.srcObject){
				return session.videoElement.srcObject;
			}
			
			var newStream = createMediaStream();
			session.streamSrc.getVideoTracks().forEach(function(track) { // this seems to fix a bug with macbooks. 
				newStream.addTrack(track, session.streamSrc);
			});
			return newStream;
		}
	} catch (e) {
		errorlog(e);
		return session.streamSrc;
	}
}

function changeLowCut(freq, deviceid=null) {
	
	log("LOW EQ");

	for (var webAudio in session.webAudios) {
		if (!session.webAudios[webAudio].lowcut1) {
			errorlog("EQ not setup");
			return;
		}
		if (!session.webAudios[webAudio].lowcut2) {
			errorlog("EQ not setup");
			return;
		}
		if (!session.webAudios[webAudio].lowcut3) {
			errorlog("EQ not setup");
			return;
		}
		session.webAudios[webAudio].lowcut1.frequency.setValueAtTime(freq, session.webAudios[webAudio].audioContext.currentTime);
		session.webAudios[webAudio].lowcut2.frequency.setValueAtTime(freq, session.webAudios[webAudio].audioContext.currentTime);
		session.webAudios[webAudio].lowcut3.frequency.setValueAtTime(freq, session.webAudios[webAudio].audioContext.currentTime);
	}

}

function changeLowEQ(lowEQ, deviceid=null) {
	
	log("LOW EQ");

	for (var webAudio in session.webAudios) {
		if (!session.webAudios[webAudio].lowEQ) {
			errorlog("EQ not setup");
			return;
		}
		session.webAudios[webAudio].lowEQ.gain.setValueAtTime(lowEQ, session.webAudios[webAudio].audioContext.currentTime);
	}

}

function changeMidEQ(midEQ, deviceid=null) {

	for (var webAudio in session.webAudios) {
		if (!session.webAudios[webAudio].midEQ) {
			errorlog("EQ not setup");
			return;
		}
		session.webAudios[webAudio].midEQ.gain.setValueAtTime(midEQ, session.webAudios[webAudio].audioContext.currentTime);
	}

}

function changeHighEQ(highEQ, deviceid=null) {
	
	for (var webAudio in session.webAudios) {
		if (!session.webAudios[webAudio].highEQ) {
			errorlog("EQ not setup");
			return;
		}
		session.webAudios[webAudio].highEQ.gain.setValueAtTime(highEQ, session.webAudios[webAudio].audioContext.currentTime);
	}

}

function changeSubGain(gain, deviceid=null) {
	if (gain !== false) {
		gain = parseFloat(gain / 100.0) || 0;
	} else {
		gain = 1.0;
	}
	for (var webAudio in session.webAudios) {
		try{
			if (!session.webAudios[webAudio].subGainNodes) {
				errorlog("EQ not setup");
				return;
			}
			if (deviceid in session.webAudios[webAudio].subGainNodes){
				session.webAudios[webAudio].subGainNodes[deviceid].gain.setValueAtTime(gain, session.webAudios[webAudio].audioContext.currentTime);
			} else {
				errorlog("NOT FOUND:" + deviceid);
			}
			break;
		} catch(e){errorlog(e);}
		
	}
}

function changeMainGain(gain, deviceid=null) {
	for (var webAudio in session.webAudios) {
		if (!session.webAudios[webAudio].gainNode){
			return;
		}
		if (gain !== false) {
			gain = parseFloat(gain / 100.0) || 0;
		} else {
			gain = 1.0;
		}
		session.webAudios[webAudio].gainNode.gain.setValueAtTime(gain, session.webAudios[webAudio].audioContext.currentTime);
	}
}


function micDelayNode(mediaStreamSource, audioContext) {
	
	if (session.micDelay !== false) {
		var delay = parseFloat(session.micDelay/1000) || 0;
		var delayNode = audioContext.createDelay(delay);
	} else {
		var delayNode = audioContext.createDelay();
		var delay = 0;
	}
	delayNode.delayTime.value = delay;
	mediaStreamSource.connect(delayNode);
	return delayNode;
}

function audioGainNode(mediaStreamSource, audioContext) {
	var gainNode = audioContext.createGain();
	if (session.audioGain !== false) {
		var gain = parseFloat(session.audioGain / 100.0) || 0;
	} else {
		var gain = 1.0;
	}
	gainNode.gain.value = gain;
	mediaStreamSource.connect(gainNode);
	return gainNode;
}

function audioMeter(mediaStreamSource, audioContext) {
	var analyser = audioContext.createAnalyser();
	mediaStreamSource.connect(analyser);
	analyser.fftSize = 256;
	analyser.smoothingTimeConstant = 0.05;

	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);
	var timer = null;

	function draw() {
		
		analyser.getByteFrequencyData(dataArray);
		var total = 0;
		for (var i = 0; i < dataArray.length; i++) {
			total += dataArray[i];
		}
		total = total / 100;
		if (session.quietOthers && (session.quietOthers==2)){
			if (total>10){
				if (session.muted_activeSpeaker==false){
					session.muted_activeSpeaker=true;
					session.speakerMuted=true;
					clearTimeout(timer);
					toggleSpeakerMute(true);  // okay, sicne this is quietOthers
				}
			} else if (session.muted_activeSpeaker==true){
				session.speakerMuted=false;
				session.muted_activeSpeaker=false;
				session.activelySpeaking=false;
				clearTimeout(timer);
				timer = setTimeout(function(){toggleSpeakerMute(true);},250);  // okay, sicne this is quietOthers
			}
		}
		if (document.getElementById("meter1")) {
			if (total == 0) {
				getById("meter1").style.width = "1px";
				getById("meter2").style.width = "0px";
			} else if (total <= 1) {
				getById("meter1").style.width = "1px";
				getById("meter2").style.width = "0px";
			} else if (total <= 150) {
				getById("meter1").style.width = total + "px";
				getById("meter2").style.width = "0px";
			} else if (total > 150) {
				if (total > 200) {
					total = 200;
				}
				getById("meter1").style.width = "150px";
				getById("meter2").style.width = (total - 150) + "px";
			}
		} else if (session.cleanOutput){
			return;
		} else if (document.getElementById("mutetoggle")) {
			if (total > 200) {
				total = 200;
			}
			total = parseInt(total);
			document.getElementById("mutetoggle").style.color = "rgb(" + (255 - total) + ",255," + (255 - total) + ")";
		} else {
			clearInterval(analyser.interval);
			warnlog("METERS  NOT FOUND");
			return;
		}
	};
	
	analyser.interval = setInterval(function() {
		draw();
	}, 100);
	return analyser;
}



function audioCompressor(mediaStreamSource, audioContext) {
	var compressor = audioContext.createDynamicsCompressor();
	compressor.threshold.value = -50;
	compressor.knee.value = 40;
	compressor.ratio.value = 12;
	compressor.attack.value = 0;
	compressor.release.value = 0.25;
	mediaStreamSource.connect(compressor);
	return compressor;
}

function audioLimiter(mediaStreamSource, audioContext) {
	var compressor = audioContext.createDynamicsCompressor();
	compressor.threshold.value = -5;
	compressor.knee.value = 0;
	compressor.ratio.value = 20.0; // 1 to 20
	compressor.attack.value = 0.001;
	compressor.release.value = 0.1;
	mediaStreamSource.connect(compressor);
	return compressor;
}


function activeSpeaker(border=false) {
	var lastActiveSpeaker = null;
	
	var someoneElseIfSpeaking = false;
	var anyoneIsSpeaking = false;
	var defaultSpeaker = false;
	
	for (var UUID in session.rpcs) {
		
		if (session.rpcs[UUID].stats._Audio_Loudness_average) {
			//console.log(session.rpcs[UUID].stats._Audio_Loudness_average);
			if (session.rpcs[UUID].stats.Audio_Loudness && (session.rpcs[UUID].stats.Audio_Loudness>10)){
				session.rpcs[UUID].stats._Audio_Loudness_average = parseFloat(session.rpcs[UUID].stats.Audio_Loudness*0.07 + session.rpcs[UUID].stats._Audio_Loudness_average*0.93);
			} else {
				session.rpcs[UUID].stats._Audio_Loudness_average = parseFloat(session.rpcs[UUID].stats._Audio_Loudness_average*0.975);
			}
		} else {
			session.rpcs[UUID].stats._Audio_Loudness_average = 1;
		}
		if (session.rpcs[UUID].stats._Audio_Loudness_average > 13) {
			
			if (border) {
				if (session.rpcs[UUID].videoElement) {
					session.rpcs[UUID].videoElement.style.border = "green solid 1px";
					session.rpcs[UUID].videoElement.style.padding = "0";
				}
			} else if (!session.rpcs[UUID].activelySpeaking){
				
				session.rpcs[UUID].activelySpeaking = true;
				lastActiveSpeaker = UUID;
				session.rpcs[UUID].stats._Audio_Loudness_average+=50;
			}
			
		} else if (session.rpcs[UUID].stats._Audio_Loudness_average > 6) {
			//
		} else {
			if (border){
				if (session.rpcs[UUID].videoElement) {
					session.rpcs[UUID].videoElement.style.border = "";
					session.rpcs[UUID].videoElement.style.padding = "1px";
				}
			} else if (session.rpcs[UUID].activelySpeaking) {
				session.rpcs[UUID].activelySpeaking=false;
				lastActiveSpeaker = UUID;
			}
		}
		if ((session.rpcs[UUID].stats.Audio_Loudness > 13) || ((session.rpcs[UUID].stats.Audio_Loudness > 5) && (session.rpcs[UUID].stats._Audio_Loudness_average>3)) || (session.rpcs[UUID].stats._Audio_Loudness_average>6)){
			someoneElseIfSpeaking = true;
		}
		
		if (session.rpcs[UUID].activelySpeaking){
			anyoneIsSpeaking=true;
		}
		if (session.rpcs[UUID].defaultSpeaker){
			defaultSpeaker=true;
		}
	}
	
	var loudest=null;
	var loudestActive=null;
	var changed = false;
	if (session.activeSpeaker===1){
		if (!anyoneIsSpeaking){
			if (defaultSpeaker){
				// already good to go.
			} else if (lastActiveSpeaker){
				session.rpcs[lastActiveSpeaker].defaultSpeaker=true;
				changed=true;
			} else if (session.scene===false || (session.nopreview===false && session.minipreview!==1)){
				// we don't need to care.
			} else {
				for (var UUID in session.rpcs) {
					if (session.rpcs[UUID].videoElement && session.rpcs[UUID].videoElement.srcObject && session.rpcs[UUID].videoElement.srcObject.getVideoTracks().length){
						session.rpcs[UUID].defaultSpeaker=true;
						changed=true;
						break
					}
				}
			}
		} else {
			for (var UUID in session.rpcs) {
				if (!("_Audio_Loudness_average" in session.rpcs[UUID].stats)){ // never could have been loudest, since no loudness value.
					continue;
				}
				if (!loudest){
					loudest = UUID;
				} else if (session.rpcs[UUID].stats._Audio_Loudness_average > session.rpcs[loudest].stats._Audio_Loudness_average){
					loudest = UUID;
				}
				
				
				if (session.rpcs[UUID].activelySpeaking){
					if (!loudestActive){
						loudestActive = UUID;
					} else if (session.rpcs[UUID].stats._Audio_Loudness_average > session.rpcs[loudestActive].stats._Audio_Loudness_average){
						if (session.rpcs[loudestActive].defaultSpeaker){
							session.rpcs[loudestActive].defaultSpeaker=false;
							changed=true
						}
						loudestActive = UUID; 
					} else if (session.rpcs[UUID].defaultSpeaker){
						session.rpcs[UUID].defaultSpeaker=false;
						changed=true;
					}
				} else if (session.rpcs[UUID].defaultSpeaker){
					session.rpcs[UUID].defaultSpeaker=false;
					changed=true
				}
				
			}
			
			if (loudestActive && !session.rpcs[loudestActive].defaultSpeaker){
				session.rpcs[loudestActive].defaultSpeaker = true;
				changed = true;
			} 
		}
	} else if (session.activeSpeaker===2){
		
		if (!anyoneIsSpeaking){
			if (defaultSpeaker){
				// already good to go.
			} else if (lastActiveSpeaker){
				session.rpcs[lastActiveSpeaker].defaultSpeaker=true;
				changed=true;
			} else if (session.scene===false || (session.nopreview===false && session.minipreview!==1)){
				// we don't need to care.
			} else {
				for (var UUID in session.rpcs) {
					if (session.rpcs[UUID].videoElement && session.rpcs[UUID].videoElement.srcObject && session.rpcs[UUID].videoElement.srcObject.getVideoTracks().length){
						session.rpcs[UUID].defaultSpeaker=true;
						changed=true;
						break
					}
				}
			}
		} else {
			for (var UUID in session.rpcs) {
				if (session.rpcs[UUID].activelySpeaking && !session.rpcs[UUID].defaultSpeaker){
					session.rpcs[UUID].defaultSpeaker = true;
					changed = true;
				} else if (!session.rpcs[UUID].activelySpeaking && session.rpcs[UUID].defaultSpeaker){
					session.rpcs[UUID].defaultSpeaker = false;
					changed=true
				} 
			}
		}
	}
	if (session.quietOthers && (session.quietOthers===1)){
		if (someoneElseIfSpeaking){
			if (session.muted_activeSpeaker==false){
				session.muted_activeSpeaker=true;
				session.muted=true;
				toggleMute(true);
			}
		} else if (session.muted_activeSpeaker==true){
			session.muted=false;
			session.muted_activeSpeaker=false;
			toggleMute(true);
		}
	} else if (session.quietOthers && (session.quietOthers===3)){ // purely for fun. It's the opposite of a noise-gate I guess.
		if (someoneElseIfSpeaking){
			if (session.muted_activeSpeaker==false){
				session.muted_activeSpeaker=true;
				session.speakerMuted=true;
				toggleSpeakerMute(true);  // okay, sicne this is quietOthers
			}
		} else if (session.muted_activeSpeaker==true){
			session.speakerMuted=false;
			session.muted_activeSpeaker=false;
			toggleSpeakerMute(true);  // okay, sicne this is quietOthers
		}
	}
	
	if (changed) {
		setTimeout(function(){updateMixer();},0);
	}
}



function randomizeArray(unshuffled) {

	var arr = unshuffled.map((a) => ({
		sort: Math.random(), value: a
	})).sort((a, b) => a.sort - b.sort).map((a) => a.value); // shuffle once

	for (var i = arr.length - 1; i > 0; i--) { // shuffle twice
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
	return arr
}

function joinRoom(roomname) {
	if (roomname.length) {
		roomname = sanitizeRoomName(roomname);
		log("Join room: " + roomname);
		updateVolume(false); // chance of a race condition, but unlikely and not a big deal if so.
		session.joinRoom(roomname).then(function(response) { // callback from server; we've joined the room. Just the listing is returned

			if (session.joiningRoom === "seedPlz") { // allow us to seed, now that we have joined the room.
				session.joiningRoom = false; // joined
				session.seedStream();
			} else {
				session.joiningRoom = false; // no seeding callback
			}
			
			if (!session.cleanOutput){
				if (session.roomhost){
					if (session.defaultPassword===false){
						if (session.password === false){
							var invite = "https://"+location.host+location.pathname+"?room="+session.roomid+"&password=false";
							warnUser("You can invite others with:\n\n<a target='_blank' title='Copy this link to the clipboard' style='cursor:pointer' onclick='copyFunction(this.innerText,event);' href='"+invite+"'>"+invite+"</a>");
						} else {
							generateHash(session.password + session.salt, 4).then(function(hash) {
								var invite = "https://"+location.host+location.pathname+"?room="+session.roomid+"&hash="+hash;
								warnUser("You can invite others with:\n\n<a target='_blank' title='Copy this link to the clipboard' style='cursor:pointer' onclick='copyFunction(this.innerText,event)' href='"+invite+"'>"+invite+"</a>");
							});
						}
					} else {
						var invite = "https://"+location.host+location.pathname+"?room="+session.roomid;
						warnUser("You can invite others with:\n\n<a target='_blank' title='Copy this link to the clipboard' style='cursor:pointer' onclick='copyFunction(this.innerText,event)' href='"+invite+"'>"+invite+"</a>");
					}
					
				}
			}

			log("Members in Room");
			log(response);

			if (session.randomize === true) {
				response = randomizeArray(response);
				log("Randomized List of Viewers");
				log(response);
				for (var i in response) {
					if ("UUID" in response[i]) {
						if ("streamID" in response[i]) {
							if (response[i].UUID in session.rpcs) {
								log("RTC already connected"); /// lets just say instead of Stream, we have 
							} else {
								log(response[i].streamID);
								var streamID = session.desaltStreamID(response[i].streamID);
								if (session.queue){
									if (session.directorList.indexOf(response[i].UUID)>=0){
										warnlog("PLAYING DIRECTOR");
										play(streamID, response[i].UUID);
									} else if (session.view && (session.view === streamID)){
										play(streamID, response[i].UUID);
									} else if (session.view_set && session.view_set.includes(streamID)){
										play(streamID, response[i].UUID);
									} else if (session.queueList.length<5000){
										if ((!(streamID in session.watchTimeoutList)) && (!session.queueList.includes(streamID))){
											session.queueList.push(streamID);
										}
									}
								} else {
									log("STREAM ID DESALTED 3: " + streamID);
									setTimeout(function(sid) {
										play(sid);
									}, (Math.floor(Math.random() * 100)), streamID); // add some furtherchance with up to 100ms added latency			
								}	
							}
						}
					}
				}
			} else {
				for (var i in response) {
					if ("UUID" in response[i]) {
						if ("streamID" in response[i]) {
							if (response[i].UUID in session.rpcs) {
								log("RTC already connected"); /// lets just say instead of Stream, we have 
							} else {
								log(response[i].streamID);
								var streamID = session.desaltStreamID(response[i].streamID);
								if (session.queue){
									if (session.directorList.indexOf(response[i].UUID)>=0){
										play(streamID, response[i].UUID);
									} else if (session.view && (session.view === streamID)){
										play(streamID,response[i].UUID);
									} else if (session.view_set && session.view_set.includes(streamID)){
										play(streamID, response[i].UUID);
									} else if (session.queueList.length<5000){
										if ((!(streamID in session.watchTimeoutList)) && (!session.queueList.includes(streamID))){
											session.queueList.push(streamID);
										}
									}
								} else {
									log("STREAM ID DESALTED 3: " + streamID);
									play(streamID, response[i].UUID); // play handles the group room mechanics here
								}
							}
						}
					}
				}
			}
			updateQueue();
			pokeIframeAPI("joined-room-complete");
		}, function(error) {
			return {};
		});
	} else {
		log("Room name not long enough or contained all bad characaters");
	}
}

function createRoom(roomname = false) {

	if (roomname == false) {
		roomname = getById("videoname1").value;
		roomname = sanitizeRoomName(roomname);
		
		clearDirectorSettings();
		
		if (roomname.length != 0) {
			if (urlParams.has('dir')){
				updateURL("dir=" + roomname, true, false); // make the link reloadable.
			} else {
				updateURL("director=" + roomname, true, false); // make the link reloadable.
			}
		}
	}
	if (roomname.length == 0) {
		//if (!(session.cleanOutput)) {
		//	warnUser("Please enter a room name before continuing");
		//}
		 
		getById("videoname1").focus();
		getById("videoname1").classList.remove("shake");
		setTimeout(function(){getById("videoname1").classList.add("shake");},10);
	
		return;
	}
	log(roomname);
	session.roomid = roomname;

	getById("dirroomid").innerHTML = decodeURIComponent(session.roomid);
	getById("roomid").innerHTML = session.roomid;

	var passwordRoom = getById("passwordRoom").value;
	passwordRoom = sanitizePassword(passwordRoom);
	if (passwordRoom.length) {
		session.password = passwordRoom;
		session.defaultPassword = false;

		if (urlParams.has('pass')) {
			updateURL("pass=" + session.password);
		} else if (urlParams.has('pw')) {
			updateURL("pw=" + session.password);
		} else if (urlParams.has('p')) {
			updateURL("p=" + session.password);
		} else {
			updateURL("password=" + session.password);
		}
	}

	var passAdd = "";
	var passAdd2 = "";

	if ((session.defaultPassword === false) && (session.password)) {
		passAdd2 = "&password=" + session.password;
		return generateHash(session.password + session.salt, 4).then(function(hash) {
			passAdd = "&hash=" + hash;
			createRoomCallback(passAdd, passAdd2);
		}).catch(errorlog);
	} else {
		createRoomCallback(passAdd, passAdd2);
	}
	
	pokeIframeAPI("create-room", roomname);
}

function hideDirectorinvites(ele, skip=true) {

	if (getById("directorLinks2").style.display == "none") {
		ele.innerHTML = '<i class="las la-caret-down"></i><span data-translate="hide-the-links"> LINKS (GUEST INVITES & SCENES)</span>';
		getById("directorLinks2").style.display = "inline-block";
		getById("customizeLinks").classList.remove("hidden");
	} else {
		ele.innerHTML = '<i class="las la-caret-right"></i><span data-translate="hide-the-links"> LINKS (GUEST INVITES & SCENES)</span>'
		getById("directorLinks2").style.display = "none";
		getById("help_directors_room").style.display = "none";
		getById("roomnotes2").style.display = "none";
		getById("customizeLinks").classList.add("hidden");
	}
	if (getById("directorLinks1").style.display == "none") {
		getById("directorLinks1").style.display = "inline-block";
		getById("customizeLinks").classList.remove("hidden");
	} else {
		getById("directorLinks1").style.display = "none";
		getById("help_directors_room").style.display = "none";
		getById("roomnotes2").style.display = "none";
		getById("customizeLinks").classList.add("hidden");

	}
	if (skip){
		saveDirectorSettings();
	}
}

function toggleCoDirector_changeurl(ele){
	session.codirector_changeURL = ele.checked; // doesn't do anything yet though.
}

function toggleCoDirector_transfer(ele){
	session.codirector_transfer = ele.checked;
}

async function toggleCoDirector(ele){
	//session.coDirectorAllowed = ele.checked;
	if (!ele.checked){
		getById("codirectorSettings").style.display = "none";
		return;
	}
	if (!session.directorPassword){
		session.directorPassword = await promptAlt(miscTranslations["enter-new-codirector-password"], false);
		if (!session.directorPassword){
			session.directorPassword=false;
			ele.checked=false;
			return;
		}
		session.directorPassword = sanitizePassword(session.directorPassword)
	}
	updateURL("codirector="+session.directorPassword, true, false);
	getById("coDirectorEnableSpan").style.display = "none";
	
	await generateHash(session.directorPassword + session.salt + "abc123", 12).then(function(hash) { // million to one error. 
		log("dir room hash is " + hash);
		session.directorHash = hash;
		return;
	}).catch(errorlog);
	
	if (session.codirector_transfer){
		getById("codirectorSettings_transfer").checked = true;
	} else {
		getById("codirectorSettings_transfer").checked = false;
	}
	if (session.codirector_changeURL){
		getById("codirectorSettings_changeurl").checked = true;
	} else {
		getById(codirectorSettings_changeurl).checked = false;
	}
	
	getById("codirectorSettings_invite").value = "https://"+location.host+location.pathname+"?dir="+session.roomid+"&codirector="+session.directorPassword;
	if (session.password!==session.sitePassword){
		if (session.password===false){
			getById("codirectorSettings_invite").value += "&password=false";
		} else{
			getById("codirectorSettings_invite").value += "&password";
		}
	}
	
	getById("codirectorSettings").style.display = "block";
}
function createRoomCallback(passAdd, passAdd2) {

	var gridlayout = getById("gridlayout");
	gridlayout.classList.add("directorsgrid");

	var broadcastFlag = getById("broadcastFlag");
	try {
		if (broadcastFlag.checked) {
			broadcastFlag = true;
		} else {
			broadcastFlag = false;
		}
	} catch (e) {
		broadcastFlag = false;
	}

	var broadcastString = "";
	if (broadcastFlag) {
		broadcastString = "&broadcast";
		getById("broadcastSlider").checked = true;
	}
	
	var pie = "";
	if (session.customWSS){
		if (session.customWSS!==true){ // to be deprecated, as piesocket is no longer free. 
			pie = "&pie="+session.customWSS; // you can still deploy your own wss for free tho
		}
	}
	
	var queue = "";
	if (session.queue){
		queue = "&queue";
		getById("directorLinks2").style.opacity = "0.2";
		getById("directorLinks2").style.pointerEvents = "none";
		getById("directorLinks2").style.cursor = "not-allowed";
	}

	var showdirectorFlag = getById("showdirectorFlag");
	try {
		if (showdirectorFlag.checked) {
			showdirectorFlag = true;
		} else {
			showdirectorFlag = false;
		}
	} catch (e) {
		showdirectorFlag = false;
	}

	if (showdirectorFlag) {
		updateURL("showdirector", true, false);
		session.showDirector = session.showDirector || true;
		//getById("broadcastSlider").checked=true;
	}


	var codecGroupFlag = getById("codecGroupFlag");

	if (codecGroupFlag.value) {
		if (codecGroupFlag.value === "vp9") {
			codecGroupFlag = "&codec=vp9";
			getById("codech264toggle").disabled=true;
		} else if (codecGroupFlag.value === "h264") {
			codecGroupFlag = "&codec=h264";
			getById("codech264toggle").checked=true;
		} else if (codecGroupFlag.value === "vp8") {
			codecGroupFlag = "&codec=vp8";
			getById("codech264toggle").disabled=true;
		} else if (codecGroupFlag.value === "av1") {
			codecGroupFlag = "&codec=av1";
			getById("codech264toggle").disabled=true;
		} else {
			codecGroupFlag = "";
		}
	} else {
		codecGroupFlag = "";
	}
	if (codecGroupFlag) {
		session.codecGroupFlag = codecGroupFlag;
	}
	
	if (session.bitrateGroupFlag){
		codecGroupFlag += session.bitrateGroupFlag;
	}
	
	
	formSubmitting = false;

	var m = getById("mainmenu");
	m.remove();

	getById("head1").className = 'hidden';
	getById("head2").className = 'hidden';
	getById("head4").className = '';

	try {
		if (session.label === false) {
			document.title = "Control Room";
		}
	} catch (e) {
		errorlog(e);
	};

	session.director = true;
	screensharesupport = false;
	
	if (session.meterStyle ===false){
		session.meterStyle = 1; // director specific style
	}
	if (session.signalMeter===null){
		session.signalMeter = true;
	}
	
	if (session.directorPassword){
		getById("coDirectorEnable").checked = true;
		getById("coDirectorEnableSpan").style.display = "none";
		
		getById("codirectorSettings_invite").value = "https://"+location.host+location.pathname+"?dir="+session.roomid+"&codirector="+session.directorPassword;
		if (session.password!==session.sitePassword){
			if (session.password==false){
				getById("codirectorSettings_invite").value += "&password=false";
			} else{
				getById("codirectorSettings_invite").value += "&password";
			}
		} 
	
		if (session.codirector_transfer){
			getById("codirectorSettings_transfer").checked = true;
		} else {
			getById("codirectorSettings_transfer").checked = false;
		}
		if (session.codirector_changeURL){
			getById("codirectorSettings_changeurl").checked = true;
		} else {
			getById("codirectorSettings_changeurl").checked = false;
		}
		getById("codirectorSettings").style.display = "block";
	}
	
	
	window.onresize = updateMixer;
	window.onorientationchange = function(){setTimeout(function(){
			updateForceRotate();
			updateMixer();
		}, 200);};
	getById("reshare").parentNode.removeChild(getById("reshare"));


	//getById("mutespeakerbutton").style.display = null;
	if (session.speakerMuted_default===false){
		//session.speakerMuted = false; // the director will start with audio playback muted.
		toggleSpeakerMute(true); // let it be what it is.
	} else {
		session.speakerMuted = true; // the director will start with audio playback muted.
		toggleSpeakerMute(true); // okay since only run on start
	}

	if (session.cleanDirector == false && session.cleanOutput==false) {

		getById("roomHeader").style.display = "";
		//getById("directorLinks").style.display = "";
		getById("directorLinks1").style.display = "inline-block";
		getById("directorLinks2").style.display = "inline-block";
		

		getById("director_block_1").dataset.raw = "https://" + location.host + location.pathname + "?room=" + session.roomid + broadcastString + passAdd + pie + queue;
		getById("director_block_1").href = "https://" + location.host + location.pathname + "?room=" + session.roomid + broadcastString + passAdd + pie + queue;
		getById("director_block_1").innerText = "https://" + location.host + location.pathname + "?room=" + session.roomid + broadcastString + passAdd + pie + queue;


		getById("director_block_3").dataset.raw = "https://" + location.host + location.pathname + "?scene&room=" + session.roomid + codecGroupFlag + passAdd2 + pie; 
		getById("director_block_3").href = "https://" + location.host + location.pathname + "?scene&room=" + session.roomid + codecGroupFlag + passAdd2 + pie;
		getById("director_block_3").innerText = "https://" + location.host + location.pathname + "?scene&room=" + session.roomid + codecGroupFlag + passAdd2 + pie;
		
		getById("calendarButton").style.display = "inline-block";

	} else {
		getById("guestFeeds").innerHTML = '';
	}
	getById("guestFeeds").style.display = "";

	if (!(session.cleanOutput)) {
		if (session.queue){
			getById("queuebutton").classList.remove("hidden");
		}
		getById("chatbutton").classList.remove("hidden");
		getById("controlButtons").style.display = "inherit";
		getById("mutespeakerbutton").classList.remove("hidden");
		getById("websitesharebutton").classList.remove("hidden");
		//getById("screensharebutton").classList.remove("hidden");
		
		if (session.totalRoomBitrate){
			getById("roomsettingsbutton").classList.remove("hidden");
		}
		
		if (session.showDirector == false) {
			getById("miniPerformer").innerHTML = '<button id="press2talk" onmousedown="event.preventDefault(); event.stopPropagation();" style="width:auto;margin-left:5px;height:45px;border-radius: 38px;" class="float" onclick="press2talk(true);" title="You can also enable the director`s Video Output afterwards by clicking the Setting`s button"><i class="las la-headset"></i><span data-translate="push-to-talk-enable"> enable director`s microphone or video<br />(only guests can see this feed)</span></button>';
			miniTranslate(getById("miniPerformer"));
			getById("grabDirectorSoloLink").dataset.raw = "https://" + location.host + location.pathname + "?scn&sd&r=" + session.roomid + "&v="+session.streamID + passAdd2 + pie;
			getById("grabDirectorSoloLink").href = "https://" + location.host + location.pathname + "?scn&sd&r=" + session.roomid + "&v="+session.streamID  + passAdd2 + pie;
			getById("grabDirectorSoloLink").innerText = "https://" + location.host + location.pathname + "?scn&sd&r=" + session.roomid + "&v="+session.streamID  + passAdd2 + pie;
			getById("grabDirectorSoloLinkParent").classList.remove("hidden");
		} else {
			getById("miniPerformer").innerHTML = '<button id="press2talk" onmousedown="event.preventDefault(); event.stopPropagation();" style="width:auto;margin-left:5px;height:45px;border-radius: 38px;" class="float" onclick="press2talk(true);" title="You can also enable the director`s Video Output afterwards by clicking the Setting`s button"><i class="las la-headset"></i><span data-translate="push-to-talk-enable-2"> enable director`s microphone or video</span></button>';
		}
		getById("miniPerformer").className = "";
		
		var tabindex = 26;
		if (session.rooms && session.rooms.length > 0){
			var container = getById("rooms");
			container.innerHTML += 'Arm Transfer: ';
			session.rooms.forEach(function (r) {
				if(session.roomid == r) return; //don't include self
				container.innerHTML += '<button id="roomselect_' + r + '" onmousedown="event.preventDefault(); event.stopPropagation();" class="float btnArmTransferRoom" onclick="handleRoomSelect(\'' + r + '\');" title="Arm/disarm transfer to this room" tabindex="' + tabindex + '"><i class="las la-paper-plane"></i>' + r + '</button>';
				tabindex++;
			});
		}
		
	} else {
		getById("miniPerformer").style.display = "none";
		getById("controlButtons").style.display = "none";
	}

	if (session.chatbutton === true) {
		getById("chatbutton").classList.remove("hidden");
		getById("controlButtons").style.display = "inherit";
	} else if (session.chatbutton === false) {
		getById("chatbutton").classList.add("hidden");
	}

	clearInterval(session.updateLocalStatsInterval);
	session.updateLocalStatsInterval = setInterval(function(){updateLocalStats();},3000);

	var directorWebsiteShare = getStorage("directorWebsiteShare"); // {"website":session.iframeSrc, "roomid":session.roomid}

	if (typeof directorWebsiteShare === 'object' && directorWebsiteShare !== null && "website" in directorWebsiteShare){
		if (directorWebsiteShare.website == false){
			clearDirectorSettings();
		} else if (directorWebsiteShare.roomid && (directorWebsiteShare.roomid==session.roomid)){
			session.iframeSrc = directorWebsiteShare.website;
			session.defaultIframeSrc = directorWebsiteShare.website;
			
			getById("websitesharebutton").classList.add("hidden");
			getById("websitesharebutton2").classList.remove("hidden");
		}
	}
	
	if (session.showDirector){
		getById("highlightDirectorSpan").style.display = "none";
		getById("highlightDirectorSpan").remove();
	} else {
		getById("highlightDirector").dataset.sid = session.streamID;
	}
	
	setTimeout(function(){loadDirectorSettings();},100); 
	
	joinRoom(session.roomid); 
	
	if (session.autostart){
		setTimeout(function(){press2talk(true);},400);
	} else {
		session.seeding=true;
		session.seedStream();
	}
} // createRoomCallback

function handleRoomSelect(room) {
	var elems = document.querySelectorAll(".btnArmTransferRoom");
	[].forEach.call(elems, function(el) {
		el.classList.remove("selected");
	});
	if (previousRoom == room) {
		previousRoom = "";
		armedTransfer = false;
		stillNeedRoom = true;
	} else {
		previousRoom = room;
		stillNeedRoom = false;
		armedTransfer = true;
		getById("roomselect_" + room).classList.add('selected');
	}
}

function getDirectorSettings(scene=false){
	var settings = {};
	
	var eles = document.querySelectorAll('[data-action-type="solo-video"]');
	settings.soloVideo = false;
	for (var i=0;i<eles.length;i++) {
		if (parseInt(eles[i].dataset.value)==1){
			warnlog(eles[i]);
			if (eles[i].dataset.sid){
				settings.soloVideo = eles[i].dataset.sid; // who is solo, if someone is solo
			}
		}
	}
	if (scene){
		var eles = document.querySelectorAll('[data-action-type="addToScene"][data-scene="'+scene+'"'); 
		settings.scene = {};
		for (var i=0;i<eles.length;i++) {
			if (parseInt(eles[i].dataset.value)==1){
				if (eles[i].dataset.sid){
					
					var msg = {};
					msg.scene = scene;
					msg.action = "display";
					msg.value = eles[i].dataset.value;
					msg.target = eles[i].dataset.sid;
					
					settings.scene[eles[i].dataset.sid]=msg;
				}
			}
		}
	}
	
	settings.showDirector = session.showDirector;
	
	settings.mute = {};
	var eles = document.querySelectorAll('[data-action-type="mute-scene"]');
	for (var i=0;i<eles.length;i++) {
		if (parseInt(eles[i].dataset.value)==1){ // if muted
			if (eles[i].dataset.sid){
				var msg = {};
				msg.action = "mute";
				msg.scene = true;
				msg.value = eles[i].dataset.value;
				msg.target = eles[i].dataset.sid;
				settings.mute[eles[i].dataset.sid]=msg;
			}
		}
	}
	return settings;
}

function requestInfocus(ele) {
	try{
		var sid = ele.dataset.sid;
	} catch(e){
		warnlog("no stream ID found; requestinfocus");
		var sid = false;
		if (ele.id === "highlightDirector"){
			if (session.streamID){
				sid = session.streamID;
			}
		}
	}

	if (ele.dataset.value == 1) {
		ele.dataset.value = 0;
		ele.classList.remove("pressed");
		var actionMsg = {};
		actionMsg.infocus = false;
		session.sendMessage(actionMsg);
	} else {
		var actionMsg = {};
		actionMsg.infocus = sid;
		session.sendMessage(actionMsg);
		
		var eles = document.querySelectorAll('[data-action-type="solo-video"]');
		for (var i=0;i<eles.length;i++) {
			log(eles);
			eles[i].classList.remove("pressed");
			eles[i].dataset.value = 0;
		}
		ele.dataset.value = 1;
		ele.classList.add("pressed");
		if (ele.id!=="highlightDirector"){
			getById("highlightDirector").checked=false;
		}
	}
	syncDirectorState(ele);
}



function requestAudioSettings(ele) {
	var UUID = ele.dataset.UUID;
	if (ele.dataset.value == 1) {
		ele.dataset.value = 0;
		ele.classList.remove("pressed");
		getById("advanced_audio_director_" + UUID).innerHTML = "";
		getById("advanced_audio_director_" + UUID).className = "hidden";
	} else {
		ele.dataset.value = 1;
		ele.classList.add("pressed");
		getById("advanced_audio_director_" + UUID).innerHTML = "";
		var actionMsg = {};
		actionMsg.getAudioSettings = true;
		session.sendRequest(actionMsg, UUID);
	}
}

function requestVideoSettings(ele) {
	var UUID = ele.dataset.UUID;
	if (ele.dataset.value == 1) {
		ele.dataset.value = 0;
		ele.classList.remove("pressed");
		getById("advanced_video_director_" + UUID).innerHTML = "";
		getById("advanced_video_director_" + UUID).className = "hidden";
	} else {
		ele.dataset.value = 1;
		ele.classList.add("pressed");
		getById("advanced_video_director_" + UUID).innerHTML = "";
		var actionMsg = {};
		actionMsg.getVideoSettings = true;
		session.sendRequest(actionMsg, UUID);
	}
}



async function createDirectorOnlyBox() {
	
	var soloLink = soloLinkGenerator(session.streamID);
			
	if (document.getElementById("deleteme")) {
		getById("deleteme").parentNode.removeChild(getById("deleteme"));
	}
	var controls = getById("controls_directors_blank").cloneNode(true);
	controls.style.display = "block";
	controls.id = "controls_director";
	
	var container = document.createElement("div");
	container.id = "container_director"; // needed to delete on user disconnect
	container.className = "vidcon directorMargins";
	
	var buttons = "";
	if (session.slotmode){ // no UUID for the director, so can't target the slots bar... um. so I added data-director as a check.
		buttons += "<div draggable='true' title='Drag to swap layout positions' ondragstart='dragSlot(event)' ondrop='dropSlot(event)' ondragover='allowDropSlot(event)' data-slot='"+biggestSlot+"' data-director='true' class='slotsbar'>slot: "+biggestSlot+"</div>";
	}
	buttons += "<div title='Does not impact scene order.' class='shift'><i class='las la-angle-left' onclick='shiftPC(this,-1, true);'></i><i class='las la-angle-right' onclick='shiftPC(this,1, true)';></i></div>\
		<div class='streamID' style='user-select: none;'>ID: <span style='user-select: text;'>" + session.streamID + "</span>\
			<i class='las la-copy' data-sid='" + session.streamID + "'  onclick='copyFunction(this.dataset.sid,event)' title='Copy this Stream ID to the clipboard' style='cursor:pointer'></i>\
			<span id='label_director' class='addALabel' title='Click here to edit the label for this stream. Changes will propagate to all viewers of this stream' data-translate='add-a-label'>"+miscTranslations["add-a-label"]+"</span>\
		</div>\
		<div id='videoContainer_director'></div>";
	
	container.innerHTML = buttons;
	
	if (session.hidesololinks==false){ // won't be updating the solo link to a view-only one ever, since director is always expected to be in a room
		controls.innerHTML += "<div style='padding:5px;word-wrap: break-word; overflow:hidden; white-space: nowrap; overflow: hidden; font-size:0.7em; text-overflow: ellipsis;' title='A direct solo view of the video/audio stream with nothing else'> \
				<a class='soloLink advanced' data-sololink='true' data-drag='1' draggable='true' onclick='copyFunction(this,event)' \
				value='" + soloLink + "' href='" + soloLink + "'/>" + sanitizeChat(soloLink) + "</a>\
				<button class='pull-right' style='width:100%;background-color:#ecfaff;' onclick='copyFunction(this.previousElementSibling,event)'><i class='las la-user'></i> copy solo view link</button>\
			</div>\
			<div style='text-align: center;margin:0px 10px 10px 10px;display:block;'><h3>This is you, the director.<br />You are also a performer.</h3></div>";
	}
	
	controls.querySelectorAll('[data-action-type]').forEach((ele) => { // give action buttons some self-reference
		ele.dataset.sid = session.streamID;
	});
	
	container.appendChild(controls);
	
	getById("guestFeeds").appendChild(container);
	
	Object.keys(session.sceneList).forEach((scene, index) => {
		if (session.showDirector){
			if (document.getElementById("container_director")){
				if (!(getById("container_director").querySelectorAll('[data-scene="'+scene+'"]').length)){
					var newScene = document.createElement("div");
					newScene.innerHTML = '<button style="margin: 0 5px 10px 5px;" data-sid="'+session.streamID+'" data-action-type="addToScene" data-scene="'+scene+'"   title="Add to Scene '+scene+'" onclick="directEnable(this, event);"><span ><i class="las la-plus-square" style="color:#060"></i> Scene: '+scene+'</span></button>';
					newScene.classList.add("customScene");
					getById("container_director").appendChild(newScene);
				}
			}
		}
	});
	
	
	var labelID = document.getElementById("label_director");
	
	labelID.onclick = async function(ee){
		var oldlabel = ee.target.innerText;
		if (session.label===false){
			oldlabel = "";
		}
		window.focus();
		var newlabel = await promptAlt(miscTranslations["enter-new-display-name"], false, false, oldlabel); 
		if (newlabel!==null){
			if (newlabel == ""){
				newlabel = false;
				ee.target.innerText = miscTranslations["add-a-label"];
				ee.target.classList.add("addALabel");
			} else {
				ee.target.innerText = newlabel;
				ee.target.classList.remove("addALabel");
			}
			session.label = newlabel;
			var data = {};
			data.changeLabel = true;
			data.value = session.label;
			session.sendMessage(data);
		}
	}
	labelID.style.float = "left";
	labelID.style.top = "2px";
	labelID.style.marginLeft = "5px";
	labelID.style.position  = "relative";
	labelID.style.cursor="pointer";
	if (session.label){
		labelID.innerText = session.label;
	}
	pokeIframeAPI("control-box", true, true);
}

function shiftPC(ele, shift, director=false){
	if (director){
		var target = document.getElementById("container_director");
	} else {
		var target = document.getElementById("container_"+ele.dataset.UUID);
	}
	target.shifted = true;
	if (shift==1){
		if (target.nextSibling){
			target.parentNode.insertBefore(target.nextSibling, target);
		}
	} else {
		if (target.previousSibling){
			target.parentNode.insertBefore(target, target.previousSibling);
		}
	}
	updateLockedElements();
}

function updateLockedElements(){
	var eles = getById("guestFeeds").children;
	for (var i=0;i<eles.length;i++){
		try {
			var UUID = eles[i].UUID;
			var lock = document.getElementById("position_"+UUID).dataset.locked;
			if (parseInt(lock)){
				lockPosition(document.getElementById("position_"+UUID),true);
			}
		} catch(e){errorlog(e);}
	}
}

function lockPosition(ele, apply=false){
	var UUID = ele.dataset.UUID;
	if (apply){
		if (ele.dataset.locked && parseInt(ele.dataset.locked)){
			if (getById("guestFeeds")){
				var currentPosition = Array.prototype.indexOf.call(getById("guestFeeds").children, document.getElementById("container_"+UUID))+1;
				ele.innerHTML = "<b>#"+ele.dataset.locked+"</b>";
				ele.parentNode.classList.add("locked");
				
				while (currentPosition>parseInt(ele.dataset.locked)){
					var node = document.getElementById("container_"+UUID);
					parent = node.parentNode,
					prev = node.previousSibling,
					oldChild = parent.removeChild(node);
					parent.insertBefore( oldChild, prev );
					currentPosition = Array.prototype.indexOf.call(getById("guestFeeds").children, document.getElementById("container_"+UUID))+1;
				}
				
				while ((currentPosition<parseInt(ele.dataset.locked)) && (getById("guestFeeds").children.length>currentPosition)){
					var node = document.getElementById("container_"+UUID);
					parent = node.parentNode,
					next = node.nextSibling,
					oldChild = parent.removeChild(node);
					parent.insertBefore(node, next.nextSibling);
					currentPosition = Array.prototype.indexOf.call(getById("guestFeeds").children, document.getElementById("container_"+UUID))+1;
				}
			}
		} else {
			ele.dataset.locked = 0;
			ele.innerHTML = "<i class='las la-lock-open'></i>";
			ele.parentNode.classList.remove("locked");
		}
	} else {
		if (ele.dataset.locked && parseInt(ele.dataset.locked)){
			ele.dataset.locked = 0;
			ele.innerHTML = "<i class='las la-lock-open'></i>";
			ele.parentNode.classList.remove("locked");
		} else {
			if (getById("guestFeeds")){
				ele.dataset.locked = Array.prototype.indexOf.call(getById("guestFeeds").children, document.getElementById("container_"+UUID))+1;
				ele.innerHTML = "<b>#"+ele.dataset.locked+"</b>";
				ele.parentNode.classList.add("locked");
			}
		}
	}
}

function allowDropSlot(event) {
	log("allow drop");
	event.preventDefault();
}

function dragSlot(event) {
	log("drag");
	event.dataTransfer.setDragImage( getById('dragImage'), 24, 24);
	event.dataTransfer.setData("text", event.target.dataset.UUID);
	
	var eles = document.querySelectorAll(".slotsbar");
	for (var i=0;i<eles.length;i++){
		if (eles[i].dataset.UUID == event.target.dataset.UUID){continue;}
		eles[i].style.boxShadow = "0px 0px 8px 2px #FFF";
	}
}

function dropSlot(event) {
	log("drop");
	event.preventDefault();
	var UUID = event.dataTransfer.getData("text");
	var origThing = document.querySelector("[data--u-u-i-d='"+UUID+"'][data-slot]");
	if (origThing && ("slot" in event.target.dataset)){
		swapNodes(event.target, origThing);
		pokeIframeAPI("slot-updated", origThing.dataset.slot, UUID); // need to support self-director
		pokeIframeAPI("slot-updated", event.target.dataset.slot, event.target.dataset.UUID); // need to support self-director
	}
}

function dragenterSlot(event) {
	event.preventDefault();
	if ( event.target.classList.contains("slotsbar") ) {
		event.target.style.border = "3px dotted black";
	} 
}

function dragendSlot(event) {
	var eles = document.querySelectorAll(".slotsbar");
	for (var i=0;i<eles.length;i++){
		eles[i].style.boxShadow =  "unset";
	}
}

function dragleaveSlot(event) {
	event.preventDefault();
	if (event.target.classList.contains("slotsbar")){
		event.target.style.border = "";
	} 
}

async function changeSlot(ele){
	var picker = document.getElementById("slotPicker");
	var slot = 0;
	if (picker){
		picker.querySelectorAll("div[data-slot]").forEach(choice=>{
			choice.onclick = function(){setSlot(ele, parseInt(this.dataset.slot));};
		});
		picker.classList.remove("hidden");
	} else {
		slot = await promptAlt("Which slot to change to?");
		setSlot(ele,slot);
	}
	
}

function setSlot(ele,slot){
	getById("slotPicker").classList.add("hidden");
	if (slot!==null){
		var slots = document.querySelectorAll("div.slotsbar[data--u-u-i-d][data-slot]");
		for (var i=0;i<slots.length;i++){
			if (parseInt(slots[i].dataset.slot)==slot){
				slots[i].dataset.slot = 0;
				slots[i].querySelector("button").innerText = "unset";
				warnlog("Slot already existed; setting old one to 0 (unset)");
				pokeIframeAPI("slot-updated", slots[i].dataset.slot, slots[i].dataset.UUID);
			}
		}
		ele.parentNode.dataset.slot = (parseInt(slot) || 0);
		if (parseInt(slot)){
			ele.innerText = 'slot: '+slot;
		} else {
			ele.innerText = 'unset';
		}
		pokeIframeAPI("slot-updated", ele.parentNode.dataset.slot, ele.parentNode.dataset.UUID);
	}
}

function swapNodes(n1, n2) {
	log("swapping nodes");
	var p1 = n1.parentNode;
	var p2 = n2.parentNode;
	var i1, i2;

	if ( !p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1) ) return;

	for (var i = 0; i < p1.children.length; i++) {
		if (p1.children[i].isEqualNode(n1)) {
			i1 = i;
		}
	}
	for (var i = 0; i < p2.children.length; i++) {
		if (p2.children[i].isEqualNode(n2)) {
			i2 = i;
		}
	}

	if ( p1.isEqualNode(p2) && i1 < i2 ) {
		i2++;
	}
	p1.insertBefore(n2, p1.children[i1]);
	p2.insertBefore(n1, p2.children[i2]);
}

function createControlBox(UUID, soloLink, streamID) {
	if (document.getElementById("deleteme")) {
		getById("deleteme").parentNode.removeChild(getById("deleteme"));
	}
	var controls = getById("controls_blank").cloneNode(true);
	controls.style.display = "block";
	controls.id = "controls_" + UUID;

	var container = document.createElement("div");
	container.id = "container_" + UUID; // needed to delete on user disconnect
	container.UUID = UUID;
	container.className = "vidcon directorMargins";
	
	if (session.orderby){
		try {
			var added = false;
			for (var i=0;i<getById("guestFeeds").children.length;i++){
				if (getById("guestFeeds").children[i].UUID && !getById("guestFeeds").children[i].shifted){
					if (getById("guestFeeds").children[i].UUID in session.rpcs){
						if (session.rpcs[getById("guestFeeds").children[i].UUID].streamID.toLowerCase() > streamID.toLowerCase()){
							getById("guestFeeds").insertBefore(container, getById("guestFeeds").children[i]);
							added = true;
							break;
						}
					}
				}
			
			}
			if (!added){
				getById("guestFeeds").appendChild(container);
			}
		} catch(e){
			getById("guestFeeds").appendChild(container);
		}
	} else {
		getById("guestFeeds").appendChild(container);
	}

	if (!session.rpcs[UUID].voiceMeter) {
		if (session.meterStyle==1){ // director specific style
			session.rpcs[UUID].voiceMeter = getById("voiceMeterTemplate2").cloneNode(true);
		} else {
			session.rpcs[UUID].voiceMeter = getById("voiceMeterTemplate").cloneNode(true);
			session.rpcs[UUID].voiceMeter.style.opacity = 0; 
			if (session.meterStyle==2){
				session.rpcs[UUID].voiceMeter.classList.add("video-meter-2");
				session.rpcs[UUID].voiceMeter.classList.remove("video-meter");
			} else {
				session.rpcs[UUID].voiceMeter.classList.add("video-meter-director");
			}
		}
		session.rpcs[UUID].voiceMeter.id = "voiceMeter_" + UUID;
		session.rpcs[UUID].voiceMeter.dataset.level = 0;
		session.rpcs[UUID].voiceMeter.classList.remove("hidden");
	}

	session.rpcs[UUID].remoteMuteElement = getById("muteStateTemplate").cloneNode(true);
	session.rpcs[UUID].remoteMuteElement.id = "";
	session.rpcs[UUID].remoteMuteElement.style.top = "5px";
	session.rpcs[UUID].remoteMuteElement.style.right = "7px";
	
	session.rpcs[UUID].remoteVideoMuteElement = getById("videoMuteStateTemplate").cloneNode(true);
	session.rpcs[UUID].remoteVideoMuteElement.id = "";
	session.rpcs[UUID].remoteVideoMuteElement.style.top = "5px";
	session.rpcs[UUID].remoteVideoMuteElement.style.right = "28px";
	
	session.rpcs[UUID].remoteRaisedHandElement = getById("raisedHandTemplate").cloneNode(true);
	session.rpcs[UUID].remoteRaisedHandElement.id = "";
	session.rpcs[UUID].remoteRaisedHandElement.style.top = "5px";
	session.rpcs[UUID].remoteRaisedHandElement.style.right = "49px";


	var videoContainer = document.createElement("div");
	videoContainer.id = "videoContainer_" + UUID; // needed to delete on user disconnect
	videoContainer.style.margin = "0";
	videoContainer.style.position = "relative";
	videoContainer.style.minHeight = "30px";
	
	var iframeDetails = document.createElement("div");
	iframeDetails.id = "iframeDetails_" + UUID; // needed to delete on user disconnect
	iframeDetails.className = "iframeDetails hidden";

	controls.innerHTML += "<div style='margin:10px;' id='advanced_audio_director_" + UUID + "' class='hidden'></div>";
	controls.innerHTML += "<div style='margin:10px;' id='advanced_video_director_" + UUID + "' class='hidden'></div>";

	var handsID = "hands_" + UUID;

	controls.innerHTML += "<div>";
	
	if (session.hidesololinks==false){
		controls.innerHTML += "<div class='soloButton' title='A direct solo view of the video/audio stream with nothing else. Its audio can be remotely controlled from here'> \
				<a class='soloLink advanced' data-sololink='true' data-drag='1' draggable='true' onclick='copyFunction(this,event)' \
				value='" + soloLink + "' href='" + soloLink + "'/>" + sanitizeChat(soloLink) + "</a>\
				<button class='pull-right' style='width:100%;background-color:#ecfaff;' onclick='copyFunction(this.previousElementSibling,event)'><i class='las la-user'></i> copy solo view link</button>\
			</div>";
	}
	
	controls.innerHTML += "<button data-action-type=\"hand-raised\" id='" + handsID + "' class='lowerRaisedHand' data-value='0' title=\"This guest raised their hand. Click this to clear notification.\" onclick=\"remoteLowerhands('" + UUID + "');\">\
			<i class=\"las la-hand-paper\"></i>\
			<span data-translate=\"user-raised-hand\">Lower Raised Hand</span>\
		</button>\
		</div>";

	controls.querySelectorAll('[data-action-type]').forEach((ele) => { // give action buttons some self-reference
		ele.dataset.UUID = UUID;
		ele.dataset.sid = streamID;
	});
	
	var buttons = "";
	if (session.slotmode){
		var slots = document.querySelectorAll("div.slotsbar[data--u-u-i-d][data-slot]");
		var biggestSlot=0;
		for (var i=0;i<slots.length;i++){
			if (parseInt(slots[i].dataset.slot)>biggestSlot){
				biggestSlot = parseInt(slots[i].dataset.slot);
			}
		}
		biggestSlot+=1;
		buttons += "<div draggable='true' title='Drag to swap layout positions' ondragend='dragendSlot(event)' ondragstart='dragSlot(event)' ondrop='dropSlot(event)' ondragover='allowDropSlot(event)' data-slot='"+biggestSlot+"' data--u-u-i-d='"+UUID+"' class='slotsbar'><button onclick='changeSlot(this);'>slot: "+biggestSlot+"</button></div>";
	}
	buttons += "<div title='Does not impact scene order.' class='shift'><i class='las la-angle-left' data--u-u-i-d='"+UUID+"' onclick='shiftPC(this,-1);'></i><span onclick='lockPosition(this);' style='cursor:pointer;' data-locked='0' data--u-u-i-d='"+UUID+"' id='position_"+UUID+"'><i class='las la-lock-open'></i></span><i class='las la-angle-right' data--u-u-i-d='"+UUID+"' onclick='shiftPC(this,1);'></i></div><div class='streamID' style='user-select: none;'>ID: <span style='user-select: text;'>" + streamID + "</span>\
	<i class='las la-copy' data-sid='" + streamID + "' onclick='copyFunction(this.dataset.sid,event)' title='Copy this Stream ID to the clipboard' style='cursor:pointer'></i>\
	<span id='label_" + UUID + "' class='addALabel' title='Click here to edit the label for this stream. Changes will propagate to all viewers of this stream'></span>\
	</div>";

	container.innerHTML = buttons;
	updateLockedElements();
	
	container.appendChild(videoContainer);
	
	
	if (session.signalMeter){
		if (!session.rpcs[UUID].signalMeter){
			session.rpcs[UUID].signalMeter = getById("signalMeterTemplate").cloneNode(true);
			session.rpcs[UUID].signalMeter.id = "signalMeter_" + UUID;
			session.rpcs[UUID].signalMeter.dataset.level = 0;
			session.rpcs[UUID].signalMeter.classList.remove("hidden");
			session.rpcs[UUID].signalMeter.dataset.UUID = UUID;
			session.rpcs[UUID].signalMeter.title = miscTranslations["signal-meter"];
			
			if (session.rpcs[UUID].stats.info && session.rpcs[UUID].stats.info.cpuLimited){ // was quality_limitation_reason
				session.rpcs[UUID].signalMeter.dataset.cpu = "1";
			} 
			session.rpcs[UUID].signalMeter.addEventListener('click', function(e) { // show stats of video if double clicked
				log("clicked signal meter");
				try {
					e.preventDefault();
					var uid = e.currentTarget.dataset.UUID;
					if ("stats" in session.rpcs[uid]){
						
						var [menu, innerMenu] = statsMenuCreator();
						
						printViewStats(innerMenu, uid );
						
						menu.interval = setInterval(printViewStats, session.statsInterval, innerMenu, uid);
						
					}
					e.stopPropagation();
					return false;
					
				} catch(e){errorlog(e);}
			});
		}
		videoContainer.appendChild(session.rpcs[UUID].signalMeter);
		
		////////
		if (!session.rpcs[UUID].batteryMeter){
			session.rpcs[UUID].batteryMeter = getById("batteryMeterTemplate").cloneNode(true);
			session.rpcs[UUID].batteryMeter.id = "batteryMeter_" + UUID;
			if (session.rpcs[UUID].stats.info && (session.rpcs[UUID].stats.info.power_level!==null)){
				var level = session.rpcs[UUID].batteryMeter.querySelector(".battery-level");
				if (level){
					var value = session.rpcs[UUID].stats.info.power_level;
					if (value > 100){value = 100;}
					else if (value < 0){ value = 0;}
					level.style.height = parseInt(value)+"%";
					if (value<10){
						session.rpcs[UUID].batteryMeter.classList.add("alert");
					} else if (value<25){
						session.rpcs[UUID].batteryMeter.classList.add("warn");
					}
					if (value<100){
						session.rpcs[UUID].batteryMeter.classList.remove("hidden");
					}
					session.rpcs[UUID].batteryMeter.title = value+"% battery remaining";
				}
			}
			if (session.rpcs[UUID].stats.info && ("plugged_in" in session.rpcs[UUID].stats.info) && (session.rpcs[UUID].stats.info.plugged_in===false)){
				session.rpcs[UUID].batteryMeter.dataset.plugged = "0";
				session.rpcs[UUID].batteryMeter.classList.remove("hidden");
			} else {
				session.rpcs[UUID].batteryMeter.dataset.plugged = "1";
			}
		}
		videoContainer.appendChild(session.rpcs[UUID].batteryMeter);
	}
	
	videoContainer.appendChild(session.rpcs[UUID].voiceMeter);
	videoContainer.appendChild(session.rpcs[UUID].remoteMuteElement);
	videoContainer.appendChild(session.rpcs[UUID].remoteVideoMuteElement);
	videoContainer.appendChild(session.rpcs[UUID].remoteRaisedHandElement);
	videoContainer.appendChild(iframeDetails);
	container.appendChild(controls);
	
	initSceneList(UUID);
	syncSceneState(streamID);
	syncOtherState(streamID);
	
	pokeIframeAPI("control-box", true, UUID);
	if (session.slotmode){
		pokeIframeAPI("slot-updated", biggestSlot, UUID); // need to support self-director
	}
}

function cycleCameras(){
	if (session.screenShareState) {
		warnUser("Stop the screen-share first.");
		return;
	}
	var videoSelect = document.querySelector("select#videoSource3").options;
	// don't show flip option if only one camera.
	// don't show if not a mobile device
	// don't show if AD=0
	
	
	var matched = false;
	var maxIndex = parseInt(getById("flipcamerabutton").dataset.maxIndex) || parseInt(videoSelect.length);
	if (maxIndex > parseInt(videoSelect.length)){
		maxIndex = parseInt(videoSelect.length);
	}
	
	for(var i = 0; i < maxIndex; i++){
       var selOption = videoSelect[i];
       if (selOption.selected) {
           matched=true;
       } else if (matched){
		   if (getById("flipcamerabutton").classList.contains("flip")){
				getById("flipcamerabutton").classList.remove("flip");
				getById("flipcamerabutton").classList.add("flip2");
			} else {
				getById("flipcamerabutton").classList.remove("flip2");
				getById("flipcamerabutton").classList.add("flip");
			}
		   document.querySelector("select#videoSource3").value = selOption.value;
		   activatedPreview = false;
		   grabVideo(session.quality, "videosource", "select#videoSource3");
		   return;
	   }
    }
	for(var i = 0; i < maxIndex; i++){
       var selOption = videoSelect[i];
       if (selOption.selected) {
           return; // do nothing; the camera that is selected is the only camera available it seems.
       } else {
		   if (getById("flipcamerabutton").classList.contains("flip")){
				getById("flipcamerabutton").classList.remove("flip");
				getById("flipcamerabutton").classList.add("flip2");
			} else {
				getById("flipcamerabutton").classList.remove("flip2");
				getById("flipcamerabutton").classList.add("flip");
			}
		   document.querySelector("select#videoSource3").value = selOption.value;
		   activatedPreview = false;
		   grabVideo(session.quality, "videosource", "select#videoSource3");
		   return;
	   }
    }
}

function press2talk(clean = false) {
	var ele = getById("press2talk");
	ele.style.minWidth = "127px";
	ele.style.padding = "7px";
	getById("settingsbutton").classList.remove("hidden");
	
	if (!document.getElementById("controls_director") && session.showDirector){createDirectorOnlyBox();}
	
	if (session.taintedSession){
		var msg = {};
		msg.virtualHangup = false; 
		session.sendMessage(msg);
	}
	
	if (session.videoDevice || (session.audioDevice && session.audioDevice!==1)){
		if ((session.videoDevice === 1) && (session.audioDevice===false || session.audioDevice==1)){
			session.publishDirector(clean, true);
			session.muted = false;
			toggleMute(true);
			return;
		} else {
			enumerateDevices().then(function(deviceInfos) {
				var vdevice = false;
				var adevice = true;
				if (session.audioDevice==0){ 
					adevice=false;
				}
				if (session.videoDevice && (session.videoDevice!=1)){
					for (let i = 0; i !== deviceInfos.length; ++i) {
						var deviceInfo = deviceInfos[i];
						if ((deviceInfo.kind === 'videoinput') && (deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase().includes(session.videoDevice))) {
							vdevice = {deviceId: {exact: deviceInfo.deviceId}};
							break;
						} else if (deviceInfo.deviceId === session.videoDevice){
							vdevice = {deviceId: {exact: deviceInfo.deviceId}};
							break;
						}
					}
				}
				if (session.audioDevice && (session.audioDevice!=1)){
					for (let i = 0; i !== deviceInfos.length; ++i) {
						var deviceInfo = deviceInfos[i];
						if ((deviceInfo.kind === 'audioinput') && (deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase().includes(session.audioDevice))) {
							adevice = {deviceId: {exact: deviceInfo.deviceId}};
							break;
						} else if (deviceInfo.deviceId === session.audioDevice){
							adevice = {deviceId: {exact: deviceInfo.deviceId}};
							break;
						}
					}
				}
				session.publishDirector(clean, vdevice, adevice);
				session.muted = false;
				toggleMute(true);
			});
			return;
		}
	} else if (session.audioDevice===0){
		session.publishDirector(clean,false,false);
		return;
	}
	session.publishDirector(clean);
	session.muted = false;
	toggleMute(true);
	
}

function addToGoogleCalendar(){
	var title = "Live Stream";
	//var dates = "20180512T230000Z/20180513T030000Z";
	var linkout = getById("director_block_1").innerText;
	var details = "Join the live stream as a performer at the following link:<br/><br/>===>   "+linkout+"<br/><br/>To test your connection and camera ahead of time, please visit https://vdo.ninja/speedtest<br/><br/>Do not share the details of this invite with others, unless explicitly told to.";
	details = details.split(' ').join('+');
	details = details.split('&').join('%26');
	var linkToOpen = "https://calendar.google.com/calendar/r/eventedit?text="+title+"&details="+details;
	//https://calendar.google.com/calendar/r/eventedit?text=My+Custom+Event&dates=20180512T230000Z/20180513T030000Z&details=For+details,+link+here:+https://example.com/tickets-43251101208&location=Garage+Boston+-+20+Linden+Street+-+Allston,+MA+02134
	
	window.open(linkToOpen);
	
}

function addToOutlookCalendar(){
	var title = "Live Stream";
	var linkout = getById("director_block_1").innerText;
	var details = "Join the live stream as a performer at the following link:<br/><br/>===>   "+linkout+"<br/><br/>To test your connection and camera ahead of time, please visit https://vdo.ninja/speedtest<br/><br/>Do not share the details of this invite with others, unless explicitly told to.";
	details = details.split(' ').join('%20');
	details = details.split('&').join('%26');
	
	
	var linkToOpen = "https://outlook.live.com/owa/?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&subject="+title+"&body="+details;
	//https://calendar.google.com/calendar/r/eventedit?text=My+Custom+Event&dates=20180512T230000Z/20180513T030000Z&details=For+details,+link+here:+https://example.com/tickets-43251101208&location=Garage+Boston+-+20+Linden+Street+-+Allston,+MA+02134
	
	window.open(linkToOpen);
}

function addToYahooCalendar(){
	var title = "Live Stream";
	var linkout = getById("director_block_1").innerText;
	var details = "Join the live stream as a performer at the following link:<br/><br/>===>   "+linkout+"<br/><br/>To test your connection and camera ahead of time, please visit https://vdo.ninja/speedtest<br/><br/>Do not share the details of this invite with others, unless explicitly told to.";
	details = details.split(' ').join('%20');
	details = details.split('&').join('%26');
	var linkToOpen = "https://calendar.yahoo.com?v60&title="+title+"&desc="+details;
	//https://calendar.google.com/calendar/r/eventedit?text=My+Custom+Event&dates=20180512T230000Z/20180513T030000Z&details=For+details,+link+here:+https://example.com/tickets-43251101208&location=Garage+Boston+-+20+Linden+Street+-+Allston,+MA+02134
	
	window.open(linkToOpen);
}

function toggle(ele, tog = false, inline = true) {
	var x = ele;
	if (x.style.display === "none") {
		if (inline) {
			x.style.display = "inline-block";
		} else {
			x.style.display = "block";
		}
	} else {
		x.style.display = "none";
	}
	if (tog) {
		if (tog.dataset.saved) {
			tog.innerHTML = tog.dataset.saved;
			delete(tog.dataset.saved);
		} else {
			tog.dataset.saved = tog.innerHTML;
			tog.innerHTML = "Hide This";
		}
	}
}

function toggleByDataset(filter) {
	var elements = document.querySelectorAll('[data-cluster="'+filter+'"]'); // ie:  .cluster1
	for (var i = 0; i < elements.length; i++) {
	  elements[i].classList.toggle('hidden');
	}
}


// var SelectedAudioOutputDevices = []; // session.sink
var SelectedAudioInputDevices = []; // ..
var SelectedVideoInputDevices = []; // ..

function enumerateDevices() {

	log("enumerated start");

	if (typeof navigator.enumerateDevices === "function") {
		log("enumerated failed 1");
		return navigator.enumerateDevices();
	} else if (typeof navigator.mediaDevices === "object" && typeof navigator.mediaDevices.enumerateDevices === "function") {
		return navigator.mediaDevices.enumerateDevices();
	} else {
		return new Promise((resolve, reject) => {
			try {
				if (window.MediaStreamTrack == null || window.MediaStreamTrack.getSources == null) {
					throw new Error();
				}
				window.MediaStreamTrack.getSources((devices) => {
					resolve(devices
						.filter(device => {
							return device.kind.toLowerCase() === "video" || device.kind.toLowerCase() === "videoinput";
						})
						.map(device => {
							return {
								deviceId: device.deviceId != null ? device.deviceId : ""
								, groupId: device.groupId
								, kind: "videoinput"
								, label: device.label
								, toJSON: /* istanbul ignore next */ function() {
									return this;
								}
							};
						}));
				});
			} catch (e) {
				errorlog(e);
			}
		});
	}
}

function requestOutputAudioStream() {
	try {
		//warnlog("GET USER MEDIA");
		return navigator.mediaDevices.getUserMedia({
			audio: true
			, video: false
		}).then(function(stream1) { // Apple needs thi to happen before I can access EnumerateDevices. 
			log("get media sources; request audio stream");
			return enumerateDevices().then(function(deviceInfos) {
				stream1.getTracks().forEach(function(track) { // We don't want to keep it without audio; so we are going to try to add audio now.
					track.stop(); // I need to do this after the enumeration step, else it breaks firefox's labels
				});
				const audioOutputSelect =  getById('outputSourceScreenshare');
				audioOutputSelect.remove(0);
				audioOutputSelect.removeAttribute("onclick");

				for (let i = 0; i !== deviceInfos.length; ++i) {
					const deviceInfo = deviceInfos[i];
					if (deviceInfo == null) {
						continue;
					}
					const option = document.createElement('option');
					option.value = deviceInfo.deviceId;
					if (deviceInfo.kind === 'audiooutput') {
						const option = document.createElement('option');
						if (audioOutputSelect.length === 0) {
							option.dataset.default = true;
						} else {
							option.dataset.default = false;
						}
						option.value = deviceInfo.deviceId || "default";
						if (option.value == session.sink) {
							option.selected = "true";
						}
						option.text = deviceInfo.label || `Speaker ${audioOutputSelect.length + 1}`;
						audioOutputSelect.appendChild(option);
					} else {
						log('Some other kind of source/device: ', deviceInfo);
					}
				}
			});
		});
	} catch (e) {
		if (!(session.cleanOutput)) {
			if (window.isSecureContext) {
				warnUser("An error has occured when trying to access the default audio device. The reason is not known.");
			} else if ((iOS) || (iPad)) {
				warnUser("iOS version 13.4 and up is generally recommended; older than iOS 11 is not supported.");
			} else {
				warnUser("Error acessing the default audio device.\n\nThe website may be loaded in an insecure context.\n\nPlease see: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia");
			}
		}
	}
}


function requestAudioStream() {
	try {
		//warnlog("GET USER MEDIA");
		return navigator.mediaDevices.getUserMedia({
			audio: true
			, video: false
		}).then(function(stream1) { // Apple needs thi to happen before I can access EnumerateDevices. 
			log("get media sources; request audio stream");
			return enumerateDevices().then(function(deviceInfos) {
				stream1.getTracks().forEach(function(track) { // We don't want to keep it without audio; so we are going to try to add audio now.
					track.stop(); // I need to do this after the enumeration step, else it breaks firefox's labels
				});
				log("updating audio");
				const audioInputSelect =  getById('audioSourceScreenshare');
				audioInputSelect.remove(1);
				audioInputSelect.removeAttribute("onchange");


				for (let i = 0; i !== deviceInfos.length; ++i) {
					const deviceInfo = deviceInfos[i];
					if (deviceInfo == null) {
						continue;
					}
					const option = document.createElement('option');
					option.value = deviceInfo.deviceId;
					if (deviceInfo.kind === 'audioinput') {
						option.text = deviceInfo.label || `Microphone ${audioInputSelect.length + 1}`;
						audioInputSelect.appendChild(option);
					} else {
						log('Some other kind of source/device: ', deviceInfo);
					}
				}
				audioInputSelect.style.minHeight = ((audioInputSelect.childElementCount + 1) * 1.15 * 16) + 'px';
				audioInputSelect.style.minWidth = "342px";
			});
		});
	} catch (e) {
		if (!(session.cleanOutput)) {
			if (window.isSecureContext) {
				warnUser("An error has occured when trying to access the default audio device. The reason is not known.");
			} else if ((iOS) || (iPad)) {
				warnUser("iOS version 13.4 and up is generally recommended; older than iOS 11 is not supported.");
			} else {
				warnUser("Error acessing the default audio device.\n\nThe website may be loaded in an insecure context.\n\nPlease see: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia");
			}
		}
	}
}

function saveSettings(){
	if (session.store){
		try {
			var tmp = {};
			tmp.SelectedAudioInputDevices = SelectedAudioInputDevices;
			if (session.sink && (session.sink!="default")){
				tmp.SelectedAudioOutputDevices = [session.sink];
			}
			tmp.SelectedVideoInputDevices = SelectedVideoInputDevices;
			setStorage("session_store", JSON.stringify(tmp));
			log("Saving settings");
		} catch(e){errorlog(e);}
	}
}

function loadSettings(){
	if (session.store){
		try {
			session.store = getStorage("session_store");
			if (session.store){
				session.store = JSON.parse(session.store);
			} else {
				session.store = {};
			}
			log("Loading saved settings");
			log(session.store);
			
			if (session.store && session.store.SelectedAudioOutputDevices){
				session.sink = session.store.SelectedAudioOutputDevices;
			}
			if (session.store && session.store.SelectedAudioInputDevices){
				SelectedAudioInputDevices = session.store.SelectedAudioInputDevices;
			}	
			if (session.store && session.store.SelectedVideoInputDevices){
				SelectedVideoInputDevices = session.store.SelectedVideoInputDevices;
			}
		} catch(e){}
	}
}

function gotDevices(deviceInfos) { // https://github.com/webrtc/samples/blob/gh-pages/src/content/devices/input-output/js/main.js#L19

	log("got devices!");
	log(deviceInfos);
	try {
		const audioInputSelect = getById('audioSource');

		audioInputSelect.innerHTML = "";

		var option = document.createElement('input');
		option.type = "checkbox";
		option.value = "ZZZ";
		option.name = "multiselect1";
		option.id = "multiselect1";
		option.style.display = "none";
		option.checked = true;


		var label = document.createElement('label');
		label.for = option.name;
		label.innerHTML = '<span data-translate="no-audio"> No Audio</span>';

		var listele = document.createElement('li');
		listele.appendChild(option);
		listele.appendChild(label);
		audioInputSelect.appendChild(listele);


		option.onchange = function(event) { // make sure to clear 'no audio option' if anything else is selected
			if (!(getById("multiselect1").checked)) {
				getById("multiselect1").checked = true;

				if (SelectedAudioInputDevices.indexOf(event.currentTarget.value) > -1) {} else {
					SelectedAudioInputDevices.push(event.currentTarget.value);
				}

				log("CHECKED 1");
			} else {
				var list = document.querySelectorAll("#audioSource>li>input");
				for (var i = 0; i < list.length; i++) {
					if (list[i].id !== "multiselect1") {
						list[i].checked = false;
					}
				}

				while (SelectedAudioInputDevices.indexOf(event.currentTarget.value) > -1) {
					SelectedAudioInputDevices.splice(SelectedAudioInputDevices.indexOf(event.currentTarget.value), 1);
				}
			}
			saveSettings();
		};

		getById('multiselect-trigger').dataset.state = '0';
		getById('multiselect-trigger').classList.add('closed');
		getById('multiselect-trigger').classList.remove('open');
		getById('chevarrow1').classList.add('bottom');

		const videoSelect = getById('videoSourceSelect');
		const audioOutputSelect =  getById('outputSource');
		const selectors = [videoSelect];

		const values = selectors.map(select => select.value);
		selectors.forEach(select => {
			while (select.firstChild) {
				select.removeChild(select.firstChild);
			}
		});


		function comp(a, b) {
			if (a.kind === 'audioinput') {
				return 0;
			} else if (a.kind === 'audiooutput') {
				return 0;
			}
			const labelA = a.label.toUpperCase();
			const labelB = b.label.toUpperCase();
			if (labelA > labelB) {
				return 1;
			} else if (labelA < labelB) {
				return -1;
			}
			return 0;
		}
		//deviceInfos.sort(comp); // I like this idea, but it messes with the defaults.  I just don't know what it will do.

		// This is to hide NDI from default device. NDI Tools fucks up.
		var tmp = [];
		for (let i = 0; i !== deviceInfos.length; ++i) {
			deviceInfo = deviceInfos[i];
			if (!((deviceInfo.kind === 'videoinput') && (deviceInfo.label.toLowerCase().startsWith("ndi") || deviceInfo.label.toLowerCase().startsWith("newtek")))) {
				tmp.push(deviceInfo);
			}
		}

		for (let i = 0; i !== deviceInfos.length; ++i) {
			deviceInfo = deviceInfos[i];
			if ((deviceInfo.kind === 'videoinput') && (deviceInfo.label.toLowerCase().startsWith("ndi") || deviceInfo.label.toLowerCase().startsWith("newtek"))) {
				tmp.push(deviceInfo);
				log("V DEVICE FOUND = " + deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase());
			}
		}
		deviceInfos = tmp;

		if ((session.audioDevice) && (session.audioDevice !== 1)) { // this sorts according to users's manual selection
			var tmp = [];
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if ((deviceInfo.kind === 'audioinput') && (deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase().includes(session.audioDevice))) {
					tmp.push(deviceInfo);
					log("A DEVICE FOUND = " + deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase());
				} else if (deviceInfo.deviceId === session.audioDevice){
					tmp.push(deviceInfo);
					log("EXACT A DEVICE FOUND");
				}
			}
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if (!((deviceInfo.kind === 'audioinput') && (deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase().includes(session.audioDevice)))) {
					if (deviceInfo.deviceId !== session.audioDevice){
						tmp.push(deviceInfo);
					}
				}
			}

			deviceInfos = tmp;
		} else if (session.store && session.store.SelectedAudioInputDevices){
			var matched = [];
			var notmatch = [];
			for (let i = 0; i < deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if (session.store.SelectedAudioInputDevices.includes(deviceInfo.deviceId)){
					matched.push(deviceInfo);
					log("EXACT V DEVICE FOUND -- from saved session");
				} else {
					notmatch.push(deviceInfo);
				}
			}
			
			deviceInfos = matched.concat(notmatch);
			delete session.store.SelectedAudioInputDevices;
		}
		
		
		if (session.sink) { // this sorts according to users's manual selection
			var matched = [];
			var notmatch = [];
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if ((deviceInfo.kind === 'audiooutput') && (deviceInfo.deviceId === session.sink)){
					matched.push(deviceInfo);
				} else {
					notmatch.push(deviceInfo);
				}
			}
			deviceInfos = matched.concat(notmatch);
		}
		
		if ((session.videoDevice) && (session.videoDevice !== 1)){ // this sorts according to users's manual selection
			var tmp = [];
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if ((deviceInfo.kind === 'videoinput') && (deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase().includes(session.videoDevice))) {
					tmp.push(deviceInfo);
					log("V DEVICE FOUND = " + deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase());
				} else if (deviceInfo.deviceId === session.videoDevice){
					tmp.push(deviceInfo);
					log("EXACT V DEVICE FOUND");
				}
			}
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if (!((deviceInfo.kind === 'videoinput') && (deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase().includes(session.videoDevice)))) {
					if (deviceInfo.deviceId !== session.videoDevice){
						tmp.push(deviceInfo);
					}
				}
			}
			deviceInfos = tmp;
			log("VDECICE:" + session.videoDevice);
			log(deviceInfos);
		} else if ((session.videoDevice===false) && session.facingMode){
			var tmp = [];
			if (session.facingMode=="environment"){
				for (let i = 0; i !== deviceInfos.length; ++i) {
					deviceInfo = deviceInfos[i];
					if ((deviceInfo.kind === 'videoinput') && (deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase().includes("back"))) {
						tmp.push(deviceInfo);
						log("V DEVICE FOUND = " + deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase());
					} else if ((deviceInfo.kind === 'videoinput') && (deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase().includes("rear"))) {
						tmp.push(deviceInfo);
						log("V DEVICE FOUND = " + deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase());
					}
				}
			} else if (session.facingMode=="user"){
				for (let i = 0; i !== deviceInfos.length; ++i) {
					deviceInfo = deviceInfos[i];
					if ((deviceInfo.kind === 'videoinput') && (deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase().includes("front"))) {
						tmp.push(deviceInfo);
						log("V DEVICE FOUND = " + deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase());
					}
				}
			}
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if (!((deviceInfo.kind === 'videoinput') && (deviceInfo.label.replace(/[\W]+/g, "_").toLowerCase().includes(session.videoDevice)))) {
					if (deviceInfo.deviceId !== session.videoDevice){
						tmp.push(deviceInfo);
					}
				}
			}
			deviceInfos = tmp;
			log("VDECICE:" + session.videoDevice);
			log(deviceInfos);
		} else if (session.store && session.store.SelectedVideoInputDevices){
			var matched = [];
			var notmatch = [];
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if (session.store.SelectedVideoInputDevices.includes(deviceInfo.deviceId)){
					matched.push(deviceInfo);
					log("EXACT V DEVICE FOUND -- from saved session");
				} else {
					notmatch.push(deviceInfo);
				}
			}
			deviceInfos = matched.concat(notmatch);
			delete session.store.SelectedVideoInputDevices;
		}
		
		var counter = 1;
		for (let i = 0; i !== deviceInfos.length; ++i) {
			const deviceInfo = deviceInfos[i];
			if (deviceInfo == null) {
				continue;
			}

			if (deviceInfo.kind === 'audioinput') {
				option = document.createElement('input');
				option.type = "checkbox";
				counter++;
				listele = document.createElement('li');
				if (counter == 2) {
					option.checked = true;
					listele.style.display = "block";
					option.style.display = "none";
					getById("multiselect1").checked = false;
					try{
						getById("multiselect1").parentNode.style.display = "none";
					} catch(e){}
				} else {
					listele.style.display = "none";
				}

				
				option.value = deviceInfo.deviceId || "default";
				option.name = "multiselect" + counter;
				option.id = "multiselect" + counter;
				option.label = deviceInfo.label;
				
				label = document.createElement('label');
				label.for = option.name;

				label.innerHTML = " " + (deviceInfo.label || ("microphone " + ((audioInputSelect.length || 0) + 1)));

				listele.appendChild(option);
				listele.appendChild(label);
				audioInputSelect.appendChild(listele);

				option.onchange = function(event) { // make sure to clear 'no audio option' if anything else is selected
					getById("multiselect1").checked = false;
					log("UNCHECKED");
					if (!(CtrlPressed)) {
						document.querySelectorAll("#audioSource input[type='checkbox']").forEach(function(item) {
							if (event.currentTarget.id !== item.id) {
								item.checked = false;

								while (SelectedAudioInputDevices.indexOf(item.value) > -1) {
									SelectedAudioInputDevices.splice(SelectedAudioInputDevices.indexOf(item.value), 1);
								}

							} else {
								item.checked = true;
								if (SelectedAudioInputDevices.indexOf(event.currentTarget.value) > -1) {} else {
									SelectedAudioInputDevices.push(event.currentTarget.value);
								}
								if (session.mobile && (!(iOS || iPad)) && (event.currentTarget.label === "USB audio") && !session.cleanOutput){
									warnUser("Notice: USB audio devices may not work on all mobile devices.\n\nConsider using FireFox mobile instead, as it tends to work with USB audio devices more often.");
								}
							}
						});
					}
					saveSettings();
				};

			} else if (deviceInfo.kind === 'videoinput') {
				option = document.createElement('option');
				option.value = deviceInfo.deviceId || "default";
				option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
				videoSelect.appendChild(option);
			} else if (deviceInfo.kind === 'audiooutput') {
				option = document.createElement('option');
				if (audioOutputSelect.length === 0) {
					option.dataset.default = true;
				} else {
					option.dataset.default = false;
				}
				option.value = deviceInfo.deviceId || "default";
				if (option.value == session.sink) {
					option.selected = "true";
				}
				option.text = deviceInfo.label || `Speaker ${audioOutputSelect.length + 1}`;
				audioOutputSelect.appendChild(option);
			} else {
				log('Some other kind of source/device: ', deviceInfo);
			}
		}

		if (audioOutputSelect.childNodes.length == 0) {
			option = document.createElement('option');
			option.value = "default";
			option.text = "System Default";
			audioOutputSelect.appendChild(option);
		}

		option = document.createElement('option');
		option.text = "Disable Video";
		option.value = "ZZZ";
		videoSelect.appendChild(option); // NO AUDIO OPTION

		selectors.forEach((select, selectorIndex) => {
			if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
				select.value = values[selectorIndex];
			}
		});

	} catch (e) {
		errorlog(e);
	}
}


function getUserMediaVideoParams(resolutionFallbackLevel, isSafariBrowser) {
	switch (resolutionFallbackLevel) {
		case -1:
			return {};
		case 0:
			if (isSafariBrowser) {
				return {
					width: {
						min: 360
						, ideal: 1920
						, max: 1920
					}
					, height: {
						min: 360
						, ideal: 1080
						, max: 1080
					}
				};
			} else {
				return {
					width: {
						min: 720
						, ideal: 1920
						, max: 1920
					}
					, height: {
						min: 720
						, ideal: 1080
						, max: 1920
					}
				};
			}
		case 1:
			if (isSafariBrowser) {
				return {
					width: {
						min: 360
						, ideal: 1280
						, max: 1280
					}
					, height: {
						min: 360
						, ideal: 720
						, max: 720
					}
				};
			} else {
				return {
					width: {
						min: 720
						, ideal: 1280
						, max: 1280
					}
					, height: {
						min: 720
						, ideal: 720
						, max: 1280
					}
				};
			}
		case 2:
			if (isSafariBrowser) {
				return {
					width: {
						min: 640
					}
					, height: {
						min: 360
					}
				};
			} else {
				return {
					width: {
						min: 240
						, ideal: 640
						, max: 1280
					}
					, height: {
						min: 240
						, ideal: 360
						, max: 1280
					}
				};
			}
		case 3:
			if (isSafariBrowser) {
				return {
					width: {
						min: 360
						, ideal: 1280
						, max: 1440
					}
				};
			} else {
				return {
					width: {
						min: 360
						, ideal: 1280
						, max: 1440
					}
				};
			}
		case 4:
			if (isSafariBrowser) {
				return {
					height: {
						min: 360
						, ideal: 720
						, max: 960
					}
				};
			} else {
				return {
					height: {
						ideal: 720
						, max: 960
					}
				};
			}
		case 5:
			if (isSafariBrowser) {
				return {
					width: {
						min: 360
						, ideal: 640
						, max: 1440
					}
					, height: {
						min: 360
						, ideal: 360
						, max: 720
					}
				};
			} else {
				return {
					width: {
						ideal: 640
						, max: 1920
					}
					, height: {
						ideal: 360
						, max: 1920
					}
				}; // same as default, but I didn't want to mess with framerates until I gave it all a try first
			}
		case 6:
			if (isSafariBrowser) {
				return {}; // iphone users probably don't need to wait any longer, so let them just get to it
			} else {
				return {
					width: {
						min: 360
						, ideal: 640
						, max: 3840
					}
					, height: {
						min: 360
						, ideal: 360
						, max: 2160
					}
				};

			}
		case 7:
			return { // If the camera is recording in low-light, it may have a low framerate. It coudl also be recording at a very high resolution.
				width: {
					min: 360
					, ideal: 640
				}
				, height: {
					min: 360
					, ideal: 360
				}
			, };

		case 8:
			return {
				width: {
					min: 360
				}
				, height: {
					min: 360
				}
				, frameRate: 10
			}; // same as default, but I didn't want to mess with framerates until I gave it all a try first
		case 9:
			return {
				frameRate: 0
			}; // Some Samsung Devices report they can only support a framerate of 0.
		case 10:
			return {}
		default:
			return {};
	}
}

function addScreenDevices(device) {
	if (device.kind == "audio") {
		const audioInputSelect =  getById('audioSource3');
		const listele = document.createElement('li');
		listele.style.display = "block";

		const option = document.createElement('input');
		option.type = "checkbox";
		option.checked = true;

		if (getById('multiselect-trigger3').dataset.state == 0) {
			option.style.display = "none";
		}

		option.value = device.id;
		option.name = device.label;
		option.dataset.type = "screen";
		option.label = device.label;

		const label = document.createElement('label');
		label.for = option.name;
		label.innerHTML = " " + device.label;
		listele.appendChild(option);
		listele.appendChild(label);

		option.onchange = function(event) { // make sure to clear 'no audio option' if anything else is selected
			log("change 4644");
			if (!(CtrlPressed)) {
				document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function(item) {
					if (event.currentTarget.value !== item.value) { // this shoulnd't happen, but if it does.

						item.checked = false;

						if (item.dataset.type == "screen") {
							item.parentElement.parentElement.removeChild(item.parentElement);
						}

						while (SelectedAudioInputDevices.indexOf(item.value) > -1) {
							SelectedAudioInputDevices.splice(SelectedAudioInputDevices.indexOf(item.value), 1);
						}

						activatedPreview = false;
						grabAudio("#audioSource3"); // exclude item.id

					} else {
						if (SelectedAudioInputDevices.indexOf(item.value) > -1) {} else {
							SelectedAudioInputDevices.push(item.value);
						}

						item.checked = true;
						activatedPreview = false;
						grabAudio("#audioSource3", item.value); // exclude item.id.   we will reconnect, even if already connected, as a way to 'reset' a device if it isn't working.
					}
				});
			}
			saveSettings();
			event.stopPropagation();
			return false;
		};
		audioInputSelect.appendChild(listele);
		getById("audioSourceNoAudio2").checked = false;

	} else if (device.kind == "video") {
		const videoSelect =  getById('videoSource3');
		//const selectors = [ videoSelect];
		//const values = selectors.map(select => select.value);
		const option = document.createElement('option');
		option.value = device.id;
		option.text = device.label;
		option.selected = "true";
		option.label = device.label;
		videoSelect.appendChild(option);
	}
}

var gotDevices2AlreadyRan = false;
function gotDevices2(deviceInfos) {
	gotDevices2AlreadyRan=true;
	log("got devices!");
	log(deviceInfos);
	getById("multiselect-trigger3").dataset.state = "0";
	getById("multiselect-trigger3").classList.add('closed');
	getById("multiselect-trigger3").classList.remove('open');
	getById("chevarrow2").classList.add('bottom');

	var knownTrack = false;

	try {
		const audioInputSelect =  getById('audioSource3');
		const videoSelect =  getById('videoSource3');
		const audioOutputSelect =  getById('outputSource3');
		const selectors = [videoSelect];

		[audioInputSelect].forEach(select => {
			while (select.firstChild) {
				select.removeChild(select.firstChild);
			}
		});

		const values = selectors.map(select => select.value);
		selectors.forEach(select => {
			while (select.firstChild) {
				select.removeChild(select.firstChild);
			}
		});

		[audioOutputSelect].forEach(select => {
			while (select.firstChild) {
				select.removeChild(select.firstChild);
			}
		});

		var counter = 0;
		for (let i = 0; i !== deviceInfos.length; ++i) {
			const deviceInfo = deviceInfos[i];
			if (deviceInfo == null) {
				continue;
			}

			if (deviceInfo.kind === 'audioinput') {
				var option = document.createElement('input');
				option.type = "checkbox";
				counter++;
				var listele = document.createElement('li');
				listele.style.display = "none";

				try {
					session.streamSrc.getAudioTracks().forEach(function(track) {
						if (deviceInfo.label == track.label) {
							option.checked = true;
							listele.style.display = "inherit";
						}
					});
				} catch (e) {
					errorlog(e);
				}

				option.style.display = "none"
				option.value = deviceInfo.deviceId || "default";
				option.name = "multiselecta" + counter;
				option.id = "multiselecta" + counter;
				option.dataset.label = deviceInfo.label || ("microphone " + ((audioInputSelect.length || 0) + 1));

				var label = document.createElement('label');
				label.for = option.name;

				label.innerHTML = " " + (deviceInfo.label || ("microphone " + ((audioInputSelect.length || 0) + 1)));

				listele.appendChild(option);
				listele.appendChild(label);
				audioInputSelect.appendChild(listele);

				option.onchange = function(event) { // make sure to clear 'no audio option' if anything else is selected
					log("change 4768");
					if (!(CtrlPressed)) {
						document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function(item) {
							if (event.currentTarget.value !== item.value) {
								item.checked = false;
								if (item.dataset.type == "screen") {
									item.parentElement.parentElement.removeChild(item.parentElement);
								}
								while (SelectedAudioInputDevices.indexOf(item.value) > -1) {
									SelectedAudioInputDevices.splice(SelectedAudioInputDevices.indexOf(item.value), 1);
								}
							} else {
								item.checked = true;
								if (SelectedAudioInputDevices.indexOf(event.currentTarget.value) > -1) {} else {
									SelectedAudioInputDevices.push(event.currentTarget.value);
								}
							}
						});
					} else {

						if (SelectedAudioInputDevices.indexOf(event.currentTarget.value) > -1) {} else {
							SelectedAudioInputDevices.push(event.currentTarget.value);
						}

						getById("audioSourceNoAudio2").checked = false;
					}
					saveSettings();
				};

			} else if (deviceInfo.kind === 'videoinput') {
				var option = document.createElement('option');
				option.value = deviceInfo.deviceId || "default";
				option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
				try {
					if (!knownTrack){
						if (session.canvasSource){
							session.canvasSource.srcObject.getVideoTracks().forEach(function(track) {
								if (option.text == track.label) {
									option.selected = "true";
									knownTrack = true;
								}
							});
						}
					}
					if (!knownTrack){
						session.streamSrc.getVideoTracks().forEach(function(track) {
							if (option.text == track.label) {
								option.selected = "true";
								knownTrack = true;
							}
						});
					}
				} catch (e) {
					errorlog(e);
				}
				videoSelect.appendChild(option);

			} else if (deviceInfo.kind === 'audiooutput') {
				var option = document.createElement('option');
				if (audioOutputSelect.length === 0) {
					option.dataset.default = true;
				} else {
					option.dataset.default = false;
				}
				option.value = deviceInfo.deviceId || "default";
				if (option.value == session.sink) {
					option.selected = "true";
				}
				option.text = deviceInfo.label || `Speaker ${audioOutputSelect.length + 1}`;
				audioOutputSelect.appendChild(option);

			} else {
				log('Some other kind of source/device: ', deviceInfo);
			}
		}

		if (audioOutputSelect.childNodes.length == 0) {
			var option = document.createElement('option');
			option.value = "default";
			option.text = "System Default";
			audioOutputSelect.appendChild(option);
		}
		
		if (videoSelect.childNodes.length <= 1) {
			getById("flipcamerabutton").style.display = "none"; // don't show the camera cycle button
			getById("flipcamerabutton").dataset.maxndex = videoSelect.childNodes.length;
		} else {
			getById("flipcamerabutton").style.display = "unset";
			getById("flipcamerabutton").dataset.maxIndex = videoSelect.childNodes.length;
		}

		////////////

		session.streamSrc.getAudioTracks().forEach(function(track) { // add active ScreenShare audio tracks to the list
			log("Checking for screenshare audio");
			var matched = false;
			for (var i = 0; i !== deviceInfos.length; ++i) {
				var deviceInfo = deviceInfos[i];
				if (deviceInfo == null) {
					continue;
				}
				log("---");
				if (track.label == deviceInfo.label) {
					matched = true;
					continue;
				}
			}
			if (matched == false) { // Not a gUM device
				var listele = document.createElement('li');
				listele.style.display = "block";
				var option = document.createElement('input');
				option.type = "checkbox";
				option.value = track.id;
				option.checked = true;
				option.style.display = "none";
				option.name = track.label;
				option.label = track.label;
				option.dataset.type = "screen";
				var label = document.createElement('label');
				label.for = option.name;
				label.innerHTML = " " + track.label;
				listele.appendChild(option);
				listele.appendChild(label);
				option.onchange = function(event) { // make sure to clear 'no audio option' if anything else is selected
					log("change 4873");
					var trackid = null;
					if (!(CtrlPressed)) {

						document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function(item) {
							if (event.currentTarget.value !== item.value) { // this shoulnd't happen, but if it does.
								item.checked = false;
								if (item.dataset.type == "screen") {
									item.parentElement.parentElement.removeChild(item.parentElement);
								}
							} else {
								event.currentTarget.checked = true;
								trackid = item.value;
							}
						});
					} else {
						//getById("audioSourceNoAudio2").checked=false;
						if (event.currentTarget.dataset.type == "screen") {
							event.currentTarget.parentElement.parentElement.removeChild(event.currentTarget.parentElement);
						}
					}
					activatedPreview = false;
					grabAudio("#audioSource3", trackid); // exclude item.id. 
					event.stopPropagation();
					return false;
				};
				audioInputSelect.appendChild(listele);
			}
		});
		/////////// no video option
		var optionss = false;
		if (screensharesupport) {
			optionss = document.createElement('option');
			optionss.text = "Screen Share (replace camera)";
			optionss.value = "XXX";
			videoSelect.appendChild(optionss); // NO AUDIO OPTION
		}

		var option = document.createElement('option'); // no video
		option.text = "Disable Video";
		option.value = "ZZZ";
		videoSelect.appendChild(option);
		
		if (session.streamSrc.getVideoTracks().length == 0) {
			option.selected = "true"; 
		} else if (knownTrack == false) {
			var option = document.createElement('option'); // no video
			option.text = session.streamSrc.getVideoTracks()[0].label;
			option.value = "YYY";
			videoSelect.appendChild(option);
			option.selected = "true";
		}
		
		if (optionss) {
			optionss.lastSelected = videoSelect.selectedIndex;
		}
		
		
		// enumerateDevices().then(gotDevices2).then(function() {
						// errolog("!!!!!!!!!!!!!!!!");
						// session.screenShareState = false;
						// pokeIframeAPI("screen-share-ended");
						// getById("screensharebutton").classList.add("float");
						// getById("screensharebutton").classList.remove("float2");
					// }).catch(function(e){
						// errorlog("SOMETHING BAD");
							// errorlog(e);
					// })
		
		videoSelect.onchange = function(event) {
			try {
				if (event.target.options[event.target.options.selectedIndex].value === "XXX") {
					
					videoSelect.selectedIndex = event.target.options[event.target.options.selectedIndex].lastSelected;
					if (session.screenShareState == false) {
						toggleScreenShare();
					} else {
						toggleScreenShare(true);
					}
					return;
				}
			} catch (e) {}
			activatedPreview = false;
			grabVideo(session.quality, "videosource", "select#videoSource3");
			
			if (!(getById('audioSource3').querySelectorAll("input[data-type='screen']").length)){
				if (session.screenShareState){
					session.screenShareState = false;
					pokeIframeAPI("screen-share-ended");
					var data = {};
					data.screenShareState = session.screenShareState;
					session.sendMessage(data);
				}
				getById("screensharebutton").classList.add("float");
				getById("screensharebutton").classList.remove("float2");
			}
			
		};
		
		/////////////  /// NO AUDIO appended option
		
		
		var option = document.createElement('input');
		option.type = "checkbox";
		option.value = "ZZZ";
		option.style.display = "none"
		option.id = "audioSourceNoAudio2";

		var label = document.createElement('label');
		label.for = option.name;
		label.innerHTML = " No Audio";
		var listele = document.createElement('li');

		if (session.streamSrc.getAudioTracks().length == 0) {
			option.checked = true;
		} else {
			listele.style.display = "none";
			option.checked = false;
		}
		option.onchange = function(event) { // make sure to clear 'no audio option' if anything else is selected
			log("change 4938");
			if (!(CtrlPressed)) {
				document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function(item) {
					if (event.currentTarget.value !== item.value) {
						item.checked = false;
						if (item.dataset.type == "screen") {
							item.parentElement.parentElement.removeChild(item.parentElement);
						}

						while (SelectedAudioInputDevices.indexOf(item.value) > -1) {
							SelectedAudioInputDevices.splice(SelectedAudioInputDevices.indexOf(item.value), 1);
						}
					} else {
						item.checked = true;
						if (SelectedAudioInputDevices.indexOf(event.currentTarget.value) > -1) {
							//
						} else {
							SelectedAudioInputDevices.push(event.currentTarget.value);
						}
					}
				});
			} else {
				document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function(item) {
					if (event.currentTarget.value === item.value) {
						event.currentTarget.checked = true;
						if (SelectedAudioInputDevices.indexOf(event.currentTarget.value) > -1) {} else {
							SelectedAudioInputDevices.push(event.currentTarget.value);
						}
					} else {
						item.checked = false;
						if (item.dataset.type == "screen") {
							item.parentElement.parentElement.removeChild(item.parentElement);
						}
						while (SelectedAudioInputDevices.indexOf(item.value) > -1) {
							SelectedAudioInputDevices.splice(SelectedAudioInputDevices.indexOf(item.value), 1);
						}
					}

				});
			}
			saveSettings();
		};
		listele.appendChild(option);
		listele.appendChild(label);
		audioInputSelect.appendChild(listele);

		////////////


		//selectors.forEach((select, selectorIndex) => {
		//	if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
		//		select.value = values[selectorIndex];
		//	}
		//});

		audioInputSelect.onchange = function() {
			log("Audio OPTION HAS CHANGED? 2");
			activatedPreview = false;
			setTimeout(function(){
				grabAudio("#audioSource3");
			},10)
		};
		
		getById("refreshVideoButton").onclick = function() {
			refreshVideoDevice();
		};

		audioOutputSelect.onchange = function() {

			if ((iOS) || (iPad)) {
				return;
			}

			try {
				var outputSelect = getById('outputSource3');
				session.sink = outputSelect.options[outputSelect.selectedIndex].value;
				saveSettings();
			} catch (e) {
				errorlog(e);
			}
			if (!session.sink){return;}
			
			try {
				if (document.getElementById("videosource")){
					getById("videosource").setSinkId(session.sink).then(() => {
						log("New Output Device:" + session.sink);
					}).catch(error => {
						errorlog(error);
					});
				}
			
				for (UUID in session.rpcs) {
					try{
						if (session.rpcs[UUID].videoElement){
							session.rpcs[UUID].videoElement.setSinkId(session.sink).then(() => {
								log("New Output Device for: " + UUID);
							}).catch(error => {
								errorlog(error);
							});
						}
					} catch(e){warnlog(e);}
				}
			} catch (e) {
				errorlog(e);
			}
		}

	} catch (e) {
		errorlog(e);
	}
}

function refreshVideoDevice(){
	if (session.screenShareState) {
		log("can't refresh a screenshare");
		return;
	}
	log("video source changed");
	activatedPreview = false;
	grabVideo(session.quality, "videosource", "select#videoSource3");
}

function gotDevicesRemote(deviceInfos, UUID) { 
	
	try {
		if (document.getElementById("remoteVideoSelect_"+UUID)){
			var videoSelect = document.getElementById("remoteVideoSelect_"+UUID);
			var length = videoSelect.options.length;
			for (i = length-1; i >= 0; i--) {
			  videoSelect.options[i] = null;
			}
		} else {
			var videoSelect = document.createElement("select");
			videoSelect.id = "remoteVideoSelect_"+UUID;
			videoSelect.style = "max-width:170px;font-size: 70% !important; margin: 5px 5px 5px 0; padding:2px;";
			videoSelect.onchange = function(){
				getById("requestVideoDevice_"+UUID).innerHTML = '<i class="las la-video"></i> request';
				getById("requestVideoDevice_"+UUID).title = "This will ask the remote guest for permission to change";
			}
			
			var buttonGO = document.createElement("button");
			buttonGO.innerHTML = '<i class="las la-video"></i> request';
			buttonGO.style = "padding: 5px;";
			buttonGO.title = "This will ask the remote guest for permission to change";
			buttonGO.id = "requestVideoDevice_"+UUID;
			buttonGO.onclick = function(){
				var data = {}
				data.changeCamera = videoSelect.value;
				data.UUID = UUID;
				session.sendRequest(data, UUID); // Viewer is requesting the PUBLISHER
			};
			
			getById("advanced_video_director_" + UUID).appendChild(videoSelect);
			getById("advanced_video_director_" + UUID).appendChild(buttonGO);
		}
		
		if (document.getElementById("remoteAudioSelect_"+UUID)){
			var audioSelect = document.getElementById("remoteAudioSelect_"+UUID);
			var length = audioSelect.options.length;
			for (i = length-1; i >= 0; i--) {
			  audioSelect.options[i] = null;
			}
		} else {
			var audioSelect = document.createElement("select");
			audioSelect.id = "remoteAudioSelect_"+UUID;
			audioSelect.style = "max-width:170px;font-size: 70% !important; margin: 5px 5px 5px 0; padding:2px;";
			var buttonGO = document.createElement("button");
			buttonGO.innerHTML = '<i class="las la-microphone-alt"></i> request';
			buttonGO.style = "padding: 5px;";
			buttonGO.title = "This will ask the remote guest for permission to change";
			buttonGO.onclick = function(){
				var data = {}
				data.changeMicrophone = audioSelect.value;
				data.UUID = UUID;
				session.sendRequest(data, UUID); // Viewer is requesting the PUBLISHER
			}
			var audioSelectDiv = document.createElement("div");
			getById("advanced_audio_director_" + UUID).appendChild(audioSelectDiv);
			audioSelectDiv.appendChild(audioSelect);
			audioSelectDiv.appendChild(buttonGO);
			
		}
		
		if (document.getElementById("remoteAudioOutputSelect_"+UUID)){
			var audioOutputSelect = document.getElementById("remoteAudioOutputSelect_"+UUID);
			var length = audioOutputSelect.options.length;
			for (i = length-1; i >= 0; i--) {
			  audioOutputSelect.options[i] = null;
			}
		} else {
			var audioOutputSelect = document.createElement("select");
			audioOutputSelect.id = "remoteAudioOutputSelect_"+UUID;
			audioOutputSelect.style = "max-width:170px;font-size: 70% !important; margin: 5px 5px 5px 0; padding:2px;";
			var buttonGO = document.createElement("button");
			buttonGO.innerHTML = '<i class="las la-headphones"></i> request';
			buttonGO.style = "padding: 5px;";
			buttonGO.title = "This will ask the remote guest for permission to change";
			buttonGO.onclick = function(){
				var data = {}
				data.changeSpeaker = audioOutputSelect.value;
				data.UUID = UUID;
				session.sendRequest(data, UUID); // Viewer is requesting the PUBLISHER
			}
			getById("advanced_audio_director_" + UUID).appendChild(audioOutputSelect);
			getById("advanced_audio_director_" + UUID).appendChild(buttonGO);
			getById("advanced_audio_director_" + UUID).appendChild(buttonGO);
		}
		
		var matched = false;
		for (let i = 0; i !== deviceInfos.length; ++i) {
			const deviceInfo = deviceInfos[i];
			if (deviceInfo == null) {
				continue;
			}
			if (deviceInfo.kind === 'videoinput'){
				const option = document.createElement('option');
				option.value = deviceInfo.deviceId || "default";
				option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
				if (getById("remoteVideoLabel_"+UUID).innerText == option.text){
					option.selected = "true";
					matched = true;
				}
				videoSelect.appendChild(option);

			} else if (deviceInfo.kind === 'audioinput'){
				const option = document.createElement('option');
				option.value = deviceInfo.deviceId || "default";
				option.text = deviceInfo.label || `microphone ${audioSelect.length + 1}`;
				if (getById("remoteAudioLabel_"+UUID).innerText == option.text){
					option.selected = "true";
				}
				audioSelect.appendChild(option);
				
			} else if (deviceInfo.kind === 'audiooutput'){
				const option = document.createElement('option');
				option.value = deviceInfo.deviceId || "default";
				option.text = deviceInfo.label || `microphone ${audioOutputSelect.length + 1}`;
				if (getById("remoteAudioOutputSelect_"+UUID).innerText == option.text){
					option.selected = "true";
				}
				audioOutputSelect.appendChild(option);
			}
		}
		
		
		if (!matched){
			getById("requestVideoDevice_"+UUID).innerHTML = '<i class="las la-video"></i> request';
			getById("requestVideoDevice_"+UUID).title = "This will ask the remote guest for permission to change";
		} else {
			getById("requestVideoDevice_"+UUID).innerHTML = '<i class="las la-video"></i> refresh';
			getById("requestVideoDevice_"+UUID).title = "This will reconnect the guest's active video source.";
		}
			
		
	} catch(e){errorlog(e);}
	
	pokeIframeAPI("remote-devices-info", deviceInfos, UUID);
}

var timeoutTone = false;
function playtone(screen = false, tonename="testtone") {
	if (timeoutTone){return;}
	setTimeout(function(){
		timeoutTone = false;
	},500);
	timeoutTone = true;

	if ((iOS) || (iPad)) {
		//	try{
		//		session.audioContext.resume();
		//	} catch(e){errorlog(e);}
		var toneEle = document.getElementById(tonename);
		if (toneEle) {
			toneEle.mute
			toneEle.play();
		}
		return;
	}

	if (screen) {
		try{
			var outputSelect = getById('outputSourceScreenshare');
			if (outputSelect){
				session.sink = outputSelect.options[outputSelect.selectedIndex].value;
				saveSettings();
			}
		} catch(e){errorlog(e);}
	}

	var toneEle = document.getElementById(tonename);
	if (toneEle) {
		if (session.sink) {
			try {
				toneEle.setSinkId(session.sink).then(() => { // TODO: iOS doens't support sink. Needs to bypass if IOS
					log("changing audio sink:" + session.sink);
					toneEle.play();
				}).catch(error => {
					errorlog(error);
				});
			} catch (e) {
				warnlog(e); // firefox?
				toneEle.play();
			}
		} else {
			toneEle.play();
		}
	}
}

function showNotification(title, body="") {
	if (!Notification){return;}
    if (Notification.permission !== 'granted') {
		Notification.requestPermission();
    } else {
		let icon = '/media/old_icon.png'; //this is a large image may take more time to show notifiction, replace with small size icon

		let notification = new Notification(title, { body, icon });

		notification.onclick = () => {
			  notification.close();
			  window.parent.focus();
		}

    }
}

async function getAudioOnly(selector, trackid = null, override = false) {
	var audioSelect = document.querySelector(selector).querySelectorAll("input");
	var audioList = [];
	var streams = [];
	log("getAudioOnly()");
	for (var i = 0; i < audioSelect.length; i++) {
		if (audioSelect[i].value == "ZZZ") {
			continue;
		} else if (trackid == audioSelect[i].value) { // skip already excluded
			continue;
		} else if ("screen" == audioSelect[i].dataset.type) { // skip already excluded ---------- !!!!!!  DOES THIS MAKE SENSE? TODO: CHECK
			continue;
		} else if (audioSelect[i].checked) {
			log(audioSelect[i]);
			audioList.push(audioSelect[i]);
		}
	}
	for (var i = 0; i < audioList.length; i++) {

		if ((session.echoCancellation !== false) && (session.autoGainControl !== false) && (session.noiseSuppression !== false)) {
			var constraint = {
				audio: {
					deviceId: {
						exact: audioList[i].value
					}
				}
			};
		} else { // Just trying to avoid problems with some systems that don't support these features
			var constraint = {
				audio: {
					deviceId: {
						exact: audioList[i].value
					}
				}
			};
			if (session.echoCancellation === false) {
				constraint.audio.echoCancellation = false;
			} else {
				constraint.audio.echoCancellation = true;
			}
			if (session.autoGainControl === false) {
				constraint.audio.autoGainControl = false;
			} else {
				constraint.audio.autoGainControl = true;
			}
			if (session.noiseSuppression === false) {
				constraint.audio.noiseSuppression = false;
			} else {
				constraint.audio.noiseSuppression = true;
			}
		}
		constraint.video = false;
		if (override !== false) {
			if (override.audio && override.audio.deviceId){
				if (audioList[i].value == override.audio.deviceId){
					constraint = override;
				} else {
					// not the device we want to hack.
				}
			} else {
				constraint = override;
			}
			//errorlog(audioList[i]);
			//errorlog(override);
			//try {
			//	if (override.audio && override.audio.deviceId && override.audio.deviceId.exact && override.audio.deviceId.exact == audioList[i].value) {
			//		constraint = override;
			//	}
			//} catch (e) {}
		}

		if (session.audioInputChannels) {
			if (constraint.audio === true) {
				constraint.audio = {};
				constraint.audio.channelCount = session.audioInputChannels;
			} else if (constraint.audio) {
				constraint.audio.channelCount = session.audioInputChannels;
			}
		}
		log("CONSTRAINT");
		log(constraint);
		var stream = await navigator.mediaDevices.getUserMedia(constraint).then(function(stream2) {
			
			pokeIframeAPI("local-microphone-event");
			
			return stream2;
		}).catch(function(err) {
			warnlog(err);
			if (!(session.cleanOutput)) {
				if (override !== false) {
					if (err.name) {
						if (err.constraint) {
							warnUser(err['name'] + ": " + err['constraint']);
						}
					}
				}
			}
		}); // More error reporting maybe?
		if (stream) {
			streams.push(stream);
		}
	}

	return streams;
}

function applyMirror(mirror) { // true unmirrors as its already mirrored
	if (!session.videoElement){return;}
	try {
		var transFlip = "";
		var transNorm = "";
		if (document.getElementById('videosource') && (session.windowed)) {
			transFlip = " translate(0, 50%)";
			transNorm = " translate(0, -50%)";
		}

		if (session.mirrored == 2) {
			mirror = true;
		} else if (session.mirrored === 0) {
			mirror = true;
		}
		
		if (!session.videoElement.style){
			session.videoElement.style = "";
		}
		
		if (mirror) {
			if (session.mirrored && session.flipped) {
				session.videoElement.style.transform = "scaleX(-1) scaleY(-1)" + transFlip;
				session.videoElement.classList.add("mirrorControl");
			} else if (session.mirrored) {
				session.videoElement.style.transform = "scaleX(-1)" + transNorm;
				session.videoElement.classList.add("mirrorControl");
			} else if (session.flipped) {
				session.videoElement.style.transform = "scaleY(-1) scaleX(1)" + transFlip;
				session.videoElement.classList.remove("mirrorControl");
			} else {
				session.videoElement.style.transform = "scaleX(1)" + transNorm;
				session.videoElement.classList.remove("mirrorControl");
			}
		} else {
			if (session.mirrored && session.flipped) {
				session.videoElement.style.transform = "scaleX(1) scaleY(-1)" + transFlip;
				session.videoElement.classList.remove("mirrorControl");
			} else if (session.mirrored) {
				session.videoElement.style.transform = "scaleX(1)" + transNorm;
				session.videoElement.classList.remove("mirrorControl");
			} else if (session.flipped) {
				session.videoElement.style.transform = "scaleY(-1) scaleX(-1)" + transFlip;
				session.videoElement.classList.add("mirrorControl");
			} else {
				session.videoElement.style.transform = "scaleX(-1)" + transNorm;
				session.videoElement.classList.add("mirrorControl");
			}
		}
		
		var rotate = 0;
		if (session.forceRotate!==false){
			if (session.rotate){
				rotate = (session.forceRotate * -1) + parseInt(session.rotate);
			} else {
				rotate = session.forceRotate * -1;
			}
			if (session.forceRotate){
				rotate+=180;
			}	
		} else {
			rotate = session.rotate;
		}
		
		if (rotate && (rotate>=360)){
			rotate-=360;
		}
		
		session.videoElement.rotated = rotate;
		
		if (document.getElementById("previewWebcam") || document.getElementById('videosource')){
			var eleName = document.getElementById("previewWebcam") || document.getElementById('videosource');
			if (rotate){
				if (eleName.style.transform){
					eleName.style.transform += " rotate("+rotate+"deg)";
				} else {
					eleName.style.transform = "rotate("+rotate+"deg)";
				}
				eleName.classList.add("rotate");
			} else {
				eleName.classList.remove("rotate");
			}
		} else if (document.getElementById("container")){
			if (rotate==0){
				document.getElementById("container").classList.remove("rotate");
				document.getElementById("container").style.transform = "unset";
				document.getElementById("container").style.transformOrigin = "unset";
			} else {
				document.getElementById("container").style.transform = "rotate("+rotate+"deg)";
			}
		} else if (document.getElementById("minipreview")){
			var eleName = document.getElementById("minipreview");
			if (rotate==90 ){
				eleName.style.transform = "rotate(90deg)";
				eleName.style.transformOrigin = "50% 100%";
				eleName.style.height = eleName.style.width;
				eleName.style.width = "unset";
			} else if (session.videoElement.rotated==270){
				eleName.style.transform = "rotate(270deg)";
				eleName.style.transformOrigin = "50% 100%";
				eleName.style.width = "unset";
				eleName.style.height = eleName.style.width;
			} else if (session.videoElement.rotated==180){
				eleName.style.transform = "rotate(180deg)";
				eleName.style.transformOrigin = "unset";
			} else {
				eleName.classList.remove("rotate");
				eleName.style.transform = "unset";
				eleName.style.transformOrigin = "unset";
			}
		} 
		// if not one of these, then it's going to be handled by the automixer automatically for us.
		
	} catch(e){errorlog(e);}
}


function applyMirrorGuest(mirror, videoElement) { // true unmirrors as its already mirrored
	try {
		if (mirror) {
			videoElement.style.transform = "scaleX(-1)";
			videoElement.classList.add("mirrorControl");
		} else {
			videoElement.style.transform = "scaleX(1)";
			videoElement.classList.remove("mirrorControl");
		}
	} catch(e){errorlog(e);}
}

function cleanupMediaTracks() {
	getUserMediaRequestID += 1;
	try {
		if (session.streamSrc) {
			session.streamSrc.getTracks().forEach(function(track) {
				session.streamSrc.removeTrack(track);
				track.stop();
				log("stopping old track");
			});
		}
		if (session.videoElement && session.videoElement.srcObject) {
			session.videoElement.srcObject.getTracks().forEach(function(track) {
				session.videoElement.srcObject.removeTrack(track);
				track.stop();
				log("stopping old track");
			});
		} else {
			session.videoElement.srcObject = createMediaStream();
		}
		activatedPreview = false;
	} catch (e) {
		errorlog(e);
	}
}

///  Detect system changes; handle change or use for debugging
var lastAudioDevice = null;
var lastVideoDevice = null;
var lastPlaybackDevice = null;

var audioReconnectTimeout = null;
var videoReconnectTimeout = null;
var grabDevicesTimeout = null;
var playbackReconnectTimeout = null;

function reconnectDevices(event) { ///  TODO: Perhaps change this to only if there is a DISCONNECT; rather than ON NEW DEVICE?

	try {
		if (session.audioCtx.state == "suspended"){
			session.audioCtx.resume();
		}
	} catch(e){warnlog("session.audioCtx.resume(); failed");}

	if ((iOS) || (iPad)) {
		//	try{
		//		session.audioContext.resume();
		//	} catch(e){errorlog(e);}
		// resetupAudioOut();
		return;
	}
	warnlog("A media device has changed");

	if (document.getElementById("previewWebcam")) {
		var outputSelect = document.getElementById("outputSource");
		if (!outputSelect) {
			errorlog("resetup audio failed");
			return;
		}
		try {
			session.sink = outputSelect.options[outputSelect.selectedIndex].value;
			saveSettings();
		} catch (e) {
			warnlog(e);
		}
		if (session.sink){
			try {
				getById("previewWebcam").setSinkId(session.sink).then(() => {}).catch(error => {
					warnlog(error);
				});
			} catch(e){errorlog(e);}
		}
		return;
	}


	if (session.streamSrc === null) {
		return;
	}
	if (document.getElementById("videosource") === null) {
		return;
	}

	try {
		session.streamSrc.getTracks().forEach(function(track) {

			if (track.readyState == "ended") {
				if (track.kind == "audio") {
					lastAudioDevice = track.label;
				} else if (track.kind == "video") {
					lastVideoDevice = track.label;
				}
				session.streamSrc.removeTrack(track);
				log("remove ended old track");
			}
		});
		if (session.videoElement.srcObject){
			session.videoElement.srcObject.getTracks().forEach(function(track) {
				if (track.readyState == "ended") {
					session.videoElement.srcObject.removeTrack(track);
					log("remove ended old track");
				}
			});
		}
	} catch (e) {
		errorlog(e);
	}

	clearTimeout(audioReconnectTimeout);
	audioReconnectTimeout = null;
	if (lastAudioDevice) {
		audioReconnectTimeout = setTimeout(function() { // only reconnect same audio device.  If reconnected, clear the disconnected flag.
			enumerateDevices().then(gotDevices2).then(function() {
				// TODO: check to see if any audio is connected?
				var streamConnected = false;
				var audioSelect =  getById("audioSource3").querySelectorAll("input");
				for (var i = 0; i < audioSelect.length; i++) {
					if (audioSelect[i].value == "ZZZ") {
						continue;
					} else if (audioSelect[i].checked) {
						log("checked");
						streamConnected = true;
						break;
					}
				}

				if (!streamConnected) {
					for (var i = 0; i < audioSelect.length; i++) {
						if (audioSelect[i].value == "ZZZ") {
							continue;
						}
						
						if (lastAudioDevice == audioSelect[i].dataset.label) { // if the last disconnected device matches.
							audioSelect[i].checked = true;
							streamConnected = true;
							lastAudioDevice = null;
							warnlog("DISCONNECTED AUDIO DEVICE RECONNECTED");
							//for (var j=0; j<audioSelect.length;j++){
							//	if (audioSelect[j].value == "ZZZ"){audioSelect[j].checked=false;break;}
							//}
							break;
						}
					}
				}
				// see what previous state was.  We don't want to add a track if it's set to no audio.
				// 
				//	if (!streamConnected){ // don't add a new audio track if one already exists.
				//	var audioSelect = document.querySelector("#audioSource3").querySelectorAll("input"); 
				//		audioSelect[0].checked=true;
				//	}

				activatedPreview = false;
				grabAudio("#audioSource3");
				setTimeout(function() {
					enumerateDevices().then(gotDevices2).then(function() {});
				}, 1000);
			});
		}, 2000);
	}

	clearTimeout(videoReconnectTimeout); // only reconnect same video device.
	videoReconnectTimeout = null;
	if (lastVideoDevice) {
		videoReconnectTimeout = setTimeout(function() {
			enumerateDevices().then(gotDevices2).then(function() {
				var streamConnected = false;
				var videoSelect = getById("videoSource3");
				errorlog(videoSelect.value);

				if (videoSelect.value == "ZZZ") {
					for (var i = 0; i < videoSelect.options.length; i++) {
						try {
							if (videoSelect.options[i].innerHTML == lastVideoDevice) {
								videoSelect.options[i].selected = "true";
								streamConnected = true;
								lastVideoDevice = null;
								break;
							}
						} catch (e) {
							errorlog(e);
						}
					}
				}

				if (streamConnected) {
					//videoSelect.options[0].selected = "true";
					activatedPreview = false;
					grabVideo(session.quality, "videosource", "select#videoSource3");
					setTimeout(function() {
						enumerateDevices().then(gotDevices2).then(function() {});
					}, 1000);
				}

			});
		}, 2000);
	}

	//	clearTimeout(grabDevicesTimeout);  // I just don't want to have this fired more than once, if multiple devices get plugged in.
	//	if ((!audioReconnectTimeout) && (!videoReconnectTimeout)){ 
	//		grabDevicesTimeout = setTimeout(function(){enumerateDevices().then(gotDevices2).then(function(){});},500);
	//	}


	// enumerate devices -> check if session.sink still exists -> if not, select default default (track past last sink) -> if last disconnected devices comes back, reconnect it.

	// lastPlaybackDevice
	//if (session.sink){ //  Let Chrome handle the audio automatically, since not manually specified.
	clearTimeout(playbackReconnectTimeout);
	playbackReconnectTimeout = setTimeout(function() {
		enumerateDevices().then(gotDevices2).then(function() {
			resetupAudioOut();
		});
	}, 500);

}

function resetupAudioOut() {
	if (iOS || iPad) {
		for (var UUID in session.rpcs) {
			if (session.rpcs[UUID].videoElement){
				try{
					session.rpcs[UUID].videoElement.pause().then(() => {
						setTimeout(function(uuid) {
							log("win");
							try{
								session.rpcs[uuid].videoElement.play().then(() => {
									log("toggle pause/play");
								});
							} catch(e){errorlog(e);}
						}, 0, UUID);
					}).catch(errorlog);
				} catch(e){warnlog(e);}
			}
		}
		return;
	}

	var outputSelect = document.getElementById("outputSource3");
	if (!outputSelect) {
		errorlog("resetup audio failed");
		return;
	}
	log("Resetting Audio Output");
	var sinkSet = false;
	for (var i = 0; i < outputSelect.options.length; i++) {
		if (outputSelect.options[i].value == session.sink) {
			outputSelect.options[i].selected = "true";
			sinkSet = true;
		}
	}
	if (sinkSet == false) {
		if (outputSelect.options[0]) {
			outputSelect.options[0].selected = "true";
			sinkSet = outputSelect.value;
		}
	} else {
		sinkSet = session.sink;
	}
	if (sinkSet) {
		if (session.videoElement){
			try {
				session.videoElement.setSinkId(sinkSet).then(() => {}).catch(error => {
					errorlog(error);
				});
			} catch(e){warnlog("can't use setsink");}
		}
		for (UUID in session.rpcs) {
			try{
				if (session.rpcs[UUID].videoElement){
					session.rpcs[UUID].videoElement.setSinkId(sinkSet).then(() => {
						log("New Output Device for: " + UUID);
					}).catch(error => {
						errorlog(error);
					});
				}
			} catch(e){warnlog(e);}
		}
	}
}

function obfuscateURL(input) {
	if (input.startsWith("https://obs.ninja/")) {
		input = input.replace('https://obs.ninja/', 'obs.ninja/');
	} else if (input.startsWith("http://obs.ninja/")) {
		input = input.replace('http://obs.ninja/', 'obs.ninja/');
	} else if (input.startsWith("obs.ninja/")) {
		input = input.replace('obs.ninja/', 'obs.ninja/');
	} else if (input.startsWith("https://vdo.ninja/")) {
		input = input.replace('https://vdo.ninja/', 'vdo.ninja/');
	} else if (input.startsWith("http://vdo.ninja/")) {
		input = input.replace('http://vdo.ninja/', 'vdo.ninja/');
	} else if (input.startsWith("vdo.ninja/")) {
		input = input.replace('vdo.ninja/', 'vdo.ninja/');
	}

	input = input.replace('&view=', '&v=');
	input = input.replace('&view&', '&v&');
	input = input.replace('?view&', '?v&');
	input = input.replace('?view=', '?v=');

	input = input.replace('&videobitrate=', '&vb=');
	input = input.replace('?videobitrate=', '?vb=');
	input = input.replace('&bitrate=', '&vb=');
	input = input.replace('?bitrate=', '?vb=');

	input = input.replace('?audiodevice=', '?ad=');
	input = input.replace('&audiodevice=', '&ad=');

	input = input.replace('?label=', '?l=');
	input = input.replace('&label=', '&l=');

	input = input.replace('?stereo=', '?s=');
	input = input.replace('&stereo=', '&s=');
	input = input.replace('&stereo&', '&s&');
	input = input.replace('?stereo&', '?s&');

	input = input.replace('?webcam&', '?wc&');
	input = input.replace('&webcam&', '&wc&');

	input = input.replace('?remote=', '?rm=');
	input = input.replace('&remote=', '&rm=');

	input = input.replace('?password=', '?p=');
	input = input.replace('&password=', '&p=');

	input = input.replace('&maxvideobitrate=', '&mvb=');
	input = input.replace('?maxvideobitrate=', '?mvb=');

	input = input.replace('&maxbitrate=', '&mvb=');
	input = input.replace('?maxbitrate=', '?mvb=');

	input = input.replace('&height=', '&h=');
	input = input.replace('?height=', '?h=');

	input = input.replace('&width=', '&w=');
	input = input.replace('?width=', '?w=');

	input = input.replace('&quality=', '&q=');
	input = input.replace('?quality=', '?q=');

	input = input.replace('&cleanoutput=', '&clean=');
	input = input.replace('?cleanoutput=', '?clean=');

	input = input.replace('&maxviewers=', '&clean=');
	input = input.replace('?maxviewers=', '?clean=');

	input = input.replace('&framerate=', '&fr=');
	input = input.replace('?framerate=', '?fr=');

	input = input.replace('&fps=', '&fr=');
	input = input.replace('?fps=', '?fr=');

	input = input.replace('&permaid=', '&push=');
	input = input.replace('?permaid=', '?push=');

	input = input.replace('&roomid=', '&r=');
	input = input.replace('?roomid=', '?r=');

	input = input.replace('&room=', '&r=');
	input = input.replace('?room=', '?r=');

	log(input);
	var key = "OBSNINJAFORLIFE";
	var encrypted = CryptoJS.AES.encrypt(input, key);
	var output = "https://invite.cam/" + encrypted.toString();
	return output;
}


var beforeScreenShare = null; // video
var screenShareAudioTrack = null;
async function toggleScreenShare(reload = false) { ////////////////////////////

	var quality = session.quality_ss || 0;
	
	if (session.quality !== false){
		quality = session.quality;
	}
	if (session.screensharequality!==false){
		quality = session.screensharequality;
	}

	if (reload) { // quality = 0, audio = true, videoOnEnd = false) {
		await grabScreen(quality, true, true).then(res => {  
			if (res != false) {
				session.screenShareState = true;
				var data = {};
				data.screenShareState = session.screenShareState;
				session.sendMessage(data);
				
				getById("screensharebutton").classList.add("float2");
				getById("screensharebutton").classList.remove("float");
				enumerateDevices().then(gotDevices2).then(function() {});
				
				pokeIframeAPI("screen-share-state", true);
			}

		});
		return;
	}
	if (session.screenShareState == false) { // adding a screen

		await grabScreen(quality, true, true).then(res => {
			if (res != false) {
				session.screenShareState = true;
				var data = {};
				data.screenShareState = session.screenShareState;
				session.sendMessage(data);
				
				getById("screensharebutton").classList.add("float2");
				getById("screensharebutton").classList.remove("float");
				enumerateDevices().then(gotDevices2).then(function() {});
				
				//if (session.videoElement.readyState!==4){
				session.videoElement.play().then(() => {
					log("start play doublecheck");
				});
				//}
				updateMixer();
				pokeIframeAPI("screen-share-state", true);
			}
		});

	} else { // removing a screen  . session.screenShareState already true true  /////////////////////////////////

		session.screenShareState = false;
		pokeIframeAPI("screen-share-state", false);
		
		var data = {};
		data.screenShareState = session.screenShareState;
		session.sendMessage(data);
		
		if (screenShareAudioTrack){
			session.videoElement.srcObject.getAudioTracks().forEach(function(track) { // previous video track; saving it. Must remove the track at some point.
				if (screenShareAudioTrack.id == track.id) { // since there are more than one audio track, lets see if we can remove JUST the audio track for the screen share.
					session.videoElement.srcObject.removeTrack(track);
					track.stop();
				}
			});
			
			session.streamSrc.getAudioTracks().forEach(function(track) { // previous video track; saving it. Must remove the track at some point.
				if (screenShareAudioTrack.id == track.id) { // since there are more than one audio track, lets see if we can remove JUST the audio track for the screen share.
					session.streamSrc.removeTrack(track);
					track.stop();
				}
			});
			
			session.videoElement.srcObject = outboundAudioPipeline(); // updateREnderOoutput is just for video if videoElement is already activated.
			screenShareAudioTrack=null;
			senderAudioUpdate();
		}
		
		var addedAlready = false;
		session.streamSrc.getVideoTracks().forEach(function(track) {
			if (beforeScreenShare && (track.id == beforeScreenShare.id)){
				addedAlready=true;
			} else {
				session.streamSrc.removeTrack(track);
				track.stop();
			}
		});
		
		
		session.videoElement.srcObject.getVideoTracks().forEach(function(track) {
			if (beforeScreenShare && (track.id == beforeScreenShare.id)){
				addedAlready=true;
			} else {
				session.videoElement.srcObject.removeTrack(track);
				track.stop();
			}
		});
		
		getById("screensharebutton").classList.add("float"); // disable the button after we know the tracks are disabled
		getById("screensharebutton").classList.remove("float2");
		
		if (beforeScreenShare){
			if (addedAlready==false){
				session.streamSrc.addTrack(beforeScreenShare); // add back in the video track we had before we started screen sharing.  It should be NULL if we changed the video track else where (such as via the settings). #TODO:
			}
		}
		
		beforeScreenShare = null;
		updateRenderOutpipe(); // this syncs the video 
		
		toggleSettings(forceShow = true);
		updateMixer();
	}
}
var ipcRenderer = false;
var ElectronDesktopCapture = false;
if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {  // this enables Screen Capture in Electron
	try {
		if (!ipcRenderer){
			ipcRenderer = require('electron').ipcRenderer;
		}
		window.navigator.mediaDevices.getDisplayMedia = (constraints=false) => {
		  return new Promise(async (resolve, reject) => {
			try {
				
				if (session.autostart){
				    if (parseInt(session.screenshare)+"" === session.screenshare){
					    var sscid = parseInt(session.screenshare)-1;
					    if (sscid<0){sscid=0;}
						//ipcRenderer.sendSync('prompt', {title, val});
						const sources = await ipcRenderer.sendSync('getSources',{types: ['screen']});
						
						///
						var new_constraints = {
							audio: false,
							video: {
							  mandatory: {
								chromeMediaSource: 'desktop',
								chromeMediaSourceId: sources[sscid].id
							  }
							}
						};
						try {
							if (constraints.video.width.ideal){
								new_constraints.video.mandatory.maxWidth = constraints.video.width.ideal;
							}
						} catch(e){}
						try {
							if (constraints.video.height.ideal){
								new_constraints.video.mandatory.maxHeight = constraints.video.height.ideal;
							}
						} catch(e){}
						try {
							if (constraints.video.frameRate.ideal){
								new_constraints.video.mandatory.maxFrameRate = constraints.video.frameRate.ideal;
							}
						} catch(e){}
						///
						const stream = await window.navigator.mediaDevices.getUserMedia(new_constraints);
						resolve(stream);
				    } else if (session.screenshare!==true){
						var sscid=null;
						const sources = await ipcRenderer.sendSync('getSources',{types: ['window']});
						for (var i=0; i<sources.length;i++){
							if (sources[i].name.startsWith(session.screenshare)){  // check if anythign starts with
								sscid=i;
								break;
							}
						}
						if (sscid===null){
							sscid = 0; // grab first window if nothing.
							for (var i=0; i<sources.length;i++){
								if (sources[i].name.includes(session.screenshare)){ // check if something includes the string; fallback
									sscid=i;
									break;
								}
							}
						}
						///
						var new_constraints = {
							audio: false,
							video: {
							  mandatory: {
								chromeMediaSource: 'desktop',
								chromeMediaSourceId: sources[sscid].id
							  }
							}
						};
						try {
							if (constraints.video.width.ideal){
								new_constraints.video.mandatory.maxWidth = constraints.video.width.ideal;
							}
						} catch(e){}
						try {
							if (constraints.video.height.ideal){
								new_constraints.video.mandatory.maxHeight = constraints.video.height.ideal;
							}
						} catch(e){}
						try {
							if (constraints.video.frameRate.ideal){
								new_constraints.video.mandatory.maxFrameRate = constraints.video.frameRate.ideal;
							}
						} catch(e){}
						///
						const stream = await window.navigator.mediaDevices.getUserMedia(new_constraints);
						resolve(stream);
				    } else {
						var sscid = 0;
						const sources = await ipcRenderer.sendSync('getSources',{types: ['screen']});
						///
						var new_constraints = {
							audio: false,
							video: {
							  mandatory: {
								chromeMediaSource: 'desktop',
								chromeMediaSourceId: sources[sscid].id
							  }
							}
						};
						try {
							if (constraints.video.width.ideal){
								new_constraints.video.mandatory.maxWidth = constraints.video.width.ideal;
							}
						} catch(e){}
						try {
							if (constraints.video.height.ideal){
								new_constraints.video.mandatory.maxHeight = constraints.video.height.ideal;
							}
						} catch(e){}
						try {
							if (constraints.video.frameRate.ideal){
								new_constraints.video.mandatory.maxFrameRate = constraints.video.frameRate.ideal;
							}
						} catch(e){}
						warnlog(new_constraints);
						///
						const stream = await window.navigator.mediaDevices.getUserMedia(new_constraints);
						resolve(stream);
				    }
			  } else {
				  const sources = await ipcRenderer.sendSync('getSources',{types: ['screen', 'window']});
				  const selectionElem = document.createElement('div');
				  selectionElem.classList = 'desktop-capturer-selection';
				  
				  if (session.screenshareVideoOnly){
					   selectionElem.innerHTML = `
						<div class="desktop-capturer-selection__scroller">
						  <ul class="desktop-capturer-selection__list">
							${sources.map(({id, name, thumbnail, display_id, appIcon}) => `
							  <li class="desktop-capturer-selection__item">
								<button class="desktop-capturer-click desktop-capturer-selection__btn" data-id="${id}" title="${name}">
								  <img class="desktop-capturer-selection__thumbnail" src="${thumbnail.toDataURL()}" />
								  <span class="desktop-capturer-selection__name">${name}</span>
								</button>
							  </li>
							`).join('')}
							<button id="cancelscreenshare" style="margin: 10px; background-color: #F88; width: 100px;"><i class="las la-window-close" style="font-size:40px;"></i><br />Cancel</button>
						  </ul>
						</div>
					  `;
				  } else {
					  selectionElem.innerHTML = `
						<div class="desktop-capturer-selection__scroller">
						  <ul class="desktop-capturer-selection__list">
							${sources.map(({id, name, thumbnail, display_id, appIcon}) => `
							  <li class="desktop-capturer-selection__item">
								<button class="desktop-capturer-click desktop-capturer-selection__btn" data-id="${id}" title="${name}">
								  <img class="desktop-capturer-selection__thumbnail" src="${thumbnail.toDataURL()}" />
								  <span class="desktop-capturer-selection__name">${name}</span>
								</button>
							  </li>
							`).join('')}
							<div id="alsoCaptureAudioParent1" style="text-align: center;margin: auto 5px;font-size: 120%;"><i class="las la-music" style="font-size:40px;"></i><br />Include Desktop Audio<br /><input id="alsoCaptureAudio" style="width:20px;height:20px;margin-top: 10px;" type="checkbox" checked></div>
							<div id="alsoCaptureAudioParent2" style="text-align: center;margin: auto 5px;font-size: 120%;display:none;"><i class="las la-music" style="font-size:40px;"></i><br />Audio capture not <br />supported on macOS</div>
							<button id="captureDesktopAudio" class="desktop-capturer-click" style="margin: 10px;"><i class="las la-music" style="font-size:40px;"></i><br />Capture ONLY<br />Desktop Audio</button>
							<button id="cancelscreenshare" style="margin: 10px; background-color: #F88; width: 100px;"><i class="las la-window-close" style="font-size:40px;"></i><br />Cancel</button>
						  </ul>
						</div>
					  `;
				  }
				  document.body.appendChild(selectionElem);
				  
				  if (macOS){
					  getById("captureDesktopAudio").style.display = "none";
					  getById("alsoCaptureAudio").checked = false;
					  getById("alsoCaptureAudioParent1").style.display = "none";
					  getById("alsoCaptureAudioParent2").style.display = "inline-block";
				  }
				  
				  document.getElementById('cancelscreenshare').addEventListener('click', async () => {
					   selectionElem.remove();
					   reject(null);
				  });
				  document.querySelectorAll('.desktop-capturer-click').forEach(button => {
					  button.addEventListener('click', async () => {
						try {
							if (button.id == "captureDesktopAudio"){
								var new_constraints = {
									audio: {
										mandatory: {
										  chromeMediaSource: 'desktop'
										}
									  },
									video: {
									  mandatory: {
										chromeMediaSource: 'desktop',
									  }
								    }
								}
								new_constraints.video.mandatory.maxFrameRate = 1;
								warnlog(new_constraints);
								const stream = await window.navigator.mediaDevices.getUserMedia(new_constraints);
								if (stream.getVideoTracks().length){
									var track = stream.getVideoTracks()[0];
									stream.removeTrack(stream.getVideoTracks()[0]);
									track.stop();
								}
								resolve(stream);
								selectionElem.remove();
							} else {
								var audioStream = false; 
								if (getById("alsoCaptureAudio").checked){
									var new_constraints = {
										audio: {
											mandatory: {
											  chromeMediaSource: 'desktop'
											}
										  },
										video: {
										  mandatory: {
											chromeMediaSource: 'desktop',
										  }
										}
									}
									new_constraints.video.mandatory.maxFrameRate = 1;
									warnlog(new_constraints);
									audioStream = await window.navigator.mediaDevices.getUserMedia(new_constraints);
									if (audioStream.getVideoTracks().length){
										var track = audioStream.getVideoTracks()[0];
										audioStream.removeTrack(audioStream.getVideoTracks()[0]);
										track.stop();
									}								
								}
								
								const id = button.getAttribute('data-id');
								const source = sources.find(source => source.id === id);
								if (!source) {
									throw new Error(`Source with id ${id} does not exist`);
								}
								var new_constraints = {
									audio: false,
									video: {
									  mandatory: {
										chromeMediaSource: 'desktop',
										chromeMediaSourceId: source.id
									  }
									}
								};
								try {
									if (constraints.video.width.ideal){
										new_constraints.video.mandatory.maxWidth = constraints.video.width.ideal;
									}
								} catch(e){}
								try {
									if (constraints.video.height.ideal){
										new_constraints.video.mandatory.maxHeight = constraints.video.height.ideal;
									}
								} catch(e){}
								try {
									if (constraints.video.frameRate.ideal){
										new_constraints.video.mandatory.maxFrameRate = constraints.video.frameRate.ideal;
									}
								} catch(e){}
								warnlog(new_constraints);
								const stream = await window.navigator.mediaDevices.getUserMedia(new_constraints);
								
								if (audioStream && audioStream.getAudioTracks().length){
									stream.addTrack(audioStream.getAudioTracks()[0]);
								}
								
								resolve(stream);
								selectionElem.remove();
							}
						} catch (err) {
						  errorlog('Error selecting desktop capture source:', err);
						  reject(err);
						}
					  })
					});
				}
			} catch (err) {
			  errorlog('Error displaying desktop capture sources:', err);
			  reject(err);
			}
		  })
		}
		ElectronDesktopCapture = true;
	} catch(e){
		warnlog("Couldn't load electron's screen capture. Elevate the app's permission to allow it (right-click?)");
	}
}

async function grabScreen(quality = 0, audio = true, videoOnEnd = false) {
	if (!navigator.mediaDevices.getDisplayMedia) {
		if (!(session.cleanOutput)) {
			setTimeout(function() {
				if (iOS || iPad){
					warnUser("Sorry, but your iOS browser does not support screen-sharing.\n\nPlease see <a href='https://docs.vdo.ninja/guides/screen-share-your-iphone-ipad' target='_blank'>this guide</a> for an alternative method to do so.");
				} else if (session.mobile){
					warnUser("Sorry, your browser does not support screen-sharing.\n\nThe <a href='https://docs.vdo.ninja/getting-started/native-mobile-app-versions#android-download-link' target='_blank'>Android native app</a> should support it though.");
				} else {
					warnUser("Sorry, your browser does not support screen-sharing.\n\nPlease use the desktop versions of Firefox or Chrome instead.");
				}
			}, 1);
		}
		return false;
	}
	
	if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
		if (!ElectronDesktopCapture){
			if (!(session.cleanOutput)) {
				warnUser("Enable Elevated Privileges to allow screen-sharing. (right click this window to see that option)");
			}
			return false;
		}
	}
	
    var video = {}
	
	if (quality == -1) {
		// unlocked capture resolution
	} else if (quality == 0) {
		video.width = {
			ideal: 1920
		};
		video.height = {
			ideal: 1080
		};
	} else if (quality == 1) {
		video.width = {
			ideal: 1280
		};
		video.height = {
			ideal: 720
		};
	} else if (quality == 2) {
		video.width = {
			ideal: 640
		};
		video.height = {
			ideal: 360
		};
	} else if (quality >= 3) { // lowest
		video.width = {
			ideal: 320
		};
		video.height = {
			ideal: 180
		};
	}

	if (session.width) {
		video.width = {
			ideal: session.width
		};
	}
	if (session.height) {
		video.height = {
			ideal: session.height
		};
	}
	
	var constraints = { // this part is a bit annoying. Do I use the same settings?  I can add custom setting controls here later
		audio: {
			echoCancellation: false, // For screen sharing, we want it off by default.
			autoGainControl: false,
			noiseSuppression: false
		}, 
		video: video
		//,cursor: {exact: "none"}
	};
	
	if (session.screensharecursor){
		constraints.video.cursor = ["always", "motion"];
	} else {
		try {
			let supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
			if (supportedConstraints.cursor) {
				constraints.video.cursor = "never";
			}
		} catch(e){
			warnlog("navigator.mediaDevices.getSupportedConstraints() not supported");
		}
	}

	if (session.echoCancellation === true) {
		constraints.audio.echoCancellation = true;
	}
	if (session.autoGainControl === true) {
		constraints.audio.autoGainControl = true;
	}
	if (session.noiseSuppression === true) {
		constraints.audio.noiseSuppression = true;
	}
	if (audio == false) {
		constraints.audio = false;
	}

	if (session.framerate) {
		constraints.video.frameRate = session.framerate;
	} else if (session.maxframerate !== false){ // not limiting screen share's fps with quality=2 due to gaming centric nature
		constraints.video.frameRate = {
			ideal: session.maxframerate,
			max: session.maxframerate
		};
	}
	
	if (session.screenshareVideoOnly){
		constraints.audio = false;
	}

	if ((constraints.video!==false) && (Object.keys(constraints.video).length==0)){
		constraints.video = true;
	}

	return navigator.mediaDevices.getDisplayMedia(constraints).then(function(stream) {
		log("adding video tracks 2245");

		var eleName = "videosource";
		try {
			if (session.streamSrc) {
				session.streamSrc.getVideoTracks().forEach(function(track) {
					//track.stop();
					beforeScreenShare = track;
					session.streamSrc.removeTrack(track);
					log("stopping video track");
				});
				if (session.videoElement.srcObject){
					session.videoElement.srcObject.getVideoTracks().forEach(function(track) {
						//track.stop();
						session.videoElement.srcObject.removeTrack(track);
						log("stopping video track 2");
					});
				} else {
					checkBasicStreamsExist();
				}
			} else {
				checkBasicStreamsExist(); // create srcObject + videoElement
			}
		} catch (e) {
			warnlog(e);
		}
		
		try {
			stream.getVideoTracks()[0].onended = function(e) { // if screen share stops, 
				warnlog(e);

				session.streamSrc.getVideoTracks().forEach(function(track) {
					session.streamSrc.removeTrack(track);
					track.stop();
					log("stopping video track 3");
					
					if (beforeScreenShare && (beforeScreenShare.id == track.id)){
						beforeScreenShare.stop();
						beforeScreenShare=null;
					}
				});
				
				if (session.videoElement.srcObject){
					session.videoElement.srcObject.getVideoTracks().forEach(function(track) {
						session.videoElement.srcObject.removeTrack(track); 
						track.stop();
						log("stopping video track 4");
					});
				} else {
					//session.videoElement.srcObject = createMediaStream();
					session.videoElement.srcObject = outboundAudioPipeline();
				}
				
				if (screenShareAudioTrack){
					session.streamSrc.getAudioTracks().forEach(function(track) { // previous video track; saving it. Must remove the track at some point.
						if (screenShareAudioTrack.id == track.id) { // since there are more than one audio track, lets see if we can remove JUST the audio track for the screen share.
							session.streamSrc.removeTrack(track);
							track.stop();
						}
					});
					screenShareAudioTrack=null;
					senderAudioUpdate();
				}

				session.screenShareState = false;
				pokeIframeAPI("screen-share-ended");
				var data = {};
				data.screenShareState = session.screenShareState;
				session.sendMessage(data);

				getById("screensharebutton").classList.add("float");
				getById("screensharebutton").classList.remove("float2");

				if (videoOnEnd == true) {
					if (beforeScreenShare) {
						session.streamSrc.addTrack(beforeScreenShare); // updateRenderOutpipe
						beforeScreenShare = null;
					}
					
					updateRenderOutpipe();
						
					toggleSettings(forceShow = true);
					//grabVideo(eleName='videosource', selector="select#videoSource3"); 

				} //else {
				//	grabScreen(); // don't ask again.
				//}
				
				updateMixer();
			};
		} catch (e) {
			log("No Video selected; screensharing?");
		}

		stream.getTracks().forEach(function(track) {
			addScreenDevices(track);
			session.streamSrc.addTrack(track, stream); // Lets not add the audio to this preview; echo can be annoying
		});
		updateRenderOutpipe();
		
		if (stream.getAudioTracks().length){
			screenShareAudioTrack = stream.getAudioTracks()[0];
			senderAudioUpdate();
		}
		
		session.applySoloChat(); // mute streams that should be muted if a director
		session.applyIsolatedChat();
		
		applyMirror(true);
		
		
		pokeIframeAPI('local-screen-capture-event'); 
		
		return true;
	}).catch(function(err) {
		errorlog(err);
		errorlog(err.name);
		if ((err.name == "NotAllowedError") || (err.name == "PermissionDeniedError")) {
			// User Stopped it.
			if (macOS){
				warnUser(miscTranslations["screen-permissions-denied"]);
			}
		} else {
			if (audio == true) {
				if (err.name == "NotReadableError"){
					if (!(session.cleanOutput)){
						warnUser(miscTranslations["change-audio-output-device"]);
					}
					return false;
				} else {
					setTimeout(function() {
						grabScreen(quality, false);
					}, 1);
				}
			}
			if (!(session.cleanOutput)) {
				setTimeout(function(e) {
					errorlog(e);
				}, 1, err); // TypeError: Failed to execute 'getDisplayMedia' on 'MediaDevices': Audio capture is not supported
			}
		}
		return false;
	});
}

function toggleRoomSettings(){
	
	toggle(getById('roomSettings'));
	if (getById('roomSettings').style.display=="none"){
		getById("modalBackdrop").innerHTML = ''; // Delete modal
		getById("modalBackdrop").remove();
	} else {
		getById("modalBackdrop").innerHTML = ''; // Delete modal
		getById("modalBackdrop").remove();
		zindex = 25;
		getById('roomSettings').style.zIndex = 25;
		var modalTemplate = `<div id="modalBackdrop" style="z-index:24"></div>`;
		document.body.insertAdjacentHTML("beforeend", modalTemplate); // Insert modal at body end
		document.getElementById("modalBackdrop").addEventListener("click", toggleRoomSettings);
		document.getElementById('trbSettingInput').value = session.totalRoomBitrate;
		document.getElementById('trbSettingInputFeedback').innerHTML = session.totalRoomBitrate;
	}
}

function changeTRB(ele){
	session.totalRoomBitrate = parseInt(ele.value);
	var msg = {};
	msg.directorSettings={};
	msg.directorSettings.totalRoomBitrate=session.totalRoomBitrate;
	session.sendMessage(msg);
	pokeIframeAPI('total-room-bitrate', session.totalRoomBitrate); 
}

function sendMediaDevices(UUID){
	enumerateDevices().then(function(deviceInfos){
		var data = {};
		data.UUID = UUID;
		data.mediaDevices = deviceInfos;
		session.sendMessage(data, data.UUID);
	});
}

function changeVideoDevice(index, quality=0){
	enumerateDevices().then(gotDevices2).then(function() {
		activatedPreview=false;
		document.getElementById("videoSource3").selectedIndex = index+"";
		grabVideo(quality, "videosource", "#videoSource3");
	});
}

function changeAudioDevice(index){
	enumerateDevices().then(gotDevices2).then(function() {
		activatedPreview=false;
		var audioSelect = document.getElementById("audioSource3").querySelectorAll("input");
		for (var i = 0; i < audioSelect.length; i++) {
			audioSelect[i].checked = false;
		}
		audioSelect[index-1].checked = true;
		grabAudio("#audioSource3");
	});
}

function changeVideoDeviceById(deviceID, UUID=false){
	enumerateDevices().then(gotDevices2).then(function() {
		var opts = document.getElementById("videoSource3").options;
		var index = false
		for (var opt, j = 0; opt = opts[j]; j++) {
			if (opt.value == deviceID) {
				index = j;
				break;
			}
		}
		if (index!==false){
			if (document.getElementById("videoSource3").selectedIndex === j){ //  this is just refreshing the device.
				activatedPreview=false;
				grabVideo(0, "videosource", "#videoSource3", callback=UUID);
			} else if (UUID && !session.consent){
				window.focus();
				confirmAlt("Allow the director to change your video device to:\n\n"+opts[index].text+" ?").then(res=>{
					if (res){
						document.getElementById("videoSource3").selectedIndex = j;
						activatedPreview=false;
						grabVideo(0, "videosource", "#videoSource3", callback=UUID);
					} else {
						 try {
							var data = {};
							data.UUID = UUID;
							data.rejected = "changeCamera";
							session.sendMessage(data, data.UUID);
						} catch(e){}
					}
				});
			} else {
				document.getElementById("videoSource3").selectedIndex = j;
				activatedPreview=false;
				grabVideo(0, "videosource", "#videoSource3", callback=UUID);
			}
		}
	});
}

function changeAudioDeviceById(deviceID, UUID=false){
	if (UUID && !session.consent){
		window.focus();
		confirmAlt("Allow the director to change your audio mic source").then(res=>{
			if (res){
				enumerateDevices().then(gotDevices2).then(function() {
					var audioSelect = document.getElementById("audioSource3").querySelectorAll("input");
					for (var i = 0; i < audioSelect.length; i++) {
						if (audioSelect[i].value == deviceID){
							audioSelect[i].checked=true;
						} else {
							audioSelect[i].checked = false;
						}
					}
					activatedPreview=false;
					grabAudio("#audioSource3", callback=UUID);
				});
			} else {
				 try {
					var data = {};
					data.UUID = UUID;
					data.rejected = "changeMicrophone";
					session.sendMessage(data, data.UUID);
				} catch(e){}
			}
		});
	} else {
		enumerateDevices().then(gotDevices2).then(function() {
			var audioSelect = document.getElementById("audioSource3").querySelectorAll("input");
			for (var i = 0; i < audioSelect.length; i++) {
				if (audioSelect[i].value == deviceID){
					audioSelect[i].checked=true;
				} else {
					audioSelect[i].checked = false;
				}
			}
			activatedPreview=false;
			grabAudio("#audioSource3", callback=UUID);
		});
	}
}

function changeAudioOutputDeviceById(deviceID, UUID=false){
	warnlog(deviceID);
	if (document.getElementById("outputSource3")){
		enumerateDevices().then(gotDevices2).then(function() {
			var index = false
			if (document.getElementById("outputSource3")){
				var opts = document.getElementById("outputSource3").options;
				for (var opt, j = 0; opt = opts[j]; j++) {
					if (opt.value == deviceID) {
						index = j;
						break;
					}
				}
				
			}
			if (UUID && !session.consent){
				window.focus();
				confirmAlt("Allow the director to change your audio's speaker to:\n\n"+opts[index].text+" ?").then(res=>{
					if (res){
						if (index!==false){
							document.getElementById("outputSource3").selectedIndex = index;
						}
						session.sink = deviceID;
						saveSettings();
						resetupAudioOut();
						var data = {};
						data.UUID = UUID;
						sendMediaDevices(data.UUID); 
						session.sendMessage(data, data.UUID);
					} else {
						 try {
							var data = {};
							data.UUID = UUID;
							data.rejected = "changeSpeaker";
							session.sendMessage(data, data.UUID);
						} catch(e){}
					}
				});
			} else {
				if (index!==false){
					document.getElementById("outputSource3").selectedIndex = index;
				}
				session.sink = deviceID;
				saveSettings();
				resetupAudioOut();
			}
		});
	} else {
		session.sink = deviceID;
		saveSettings();
		resetupAudioOut(true);
	}
}

function checkBasicStreamsExist(){
	if (!session.streamSrc) {
		session.streamSrc = createMediaStream();
	}
	if (!session.videoElement) { 
		if (document.getElementById("videosource")) {
			session.videoElement = document.getElementById("videosource");
		} else if (document.getElementById("previewWebcam")) {
			session.videoElement = document.getElementById("previewWebcam");
		} else {
			session.videoElement = createVideoElement();
		}
	}
	session.videoElement.srcObject = outboundAudioPipeline();
	toggleMute(true);
}

var getUserMediaRequestID = 0;
var grabVideoUserMediaTimeout = null;
var grabVideoTimer = null;

async function grabVideo(quality = 0, eleName = 'previewWebcam', selector = "select#videoSourceSelect", callback = false) {
	if (activatedPreview == true) {
		log("activated preview return 2");
		return;
	}
	
	if (session.miconly){return;}
	
	activatedPreview = true;
	log("Grabbing video: " + quality);
	if (grabVideoTimer) {
		clearTimeout(grabVideoTimer);
	}
	log("element:" + eleName);

	var wasDisabled = true;
	try {
		if (session.streamSrc) {
			
			if (session.canvasWebGL){
				session.canvasWebGL.remove()
				session.canvasWebGL=null;
			}
			
			if (session.canvasSource){
				session.canvasSource.srcObject.getTracks().forEach(function(trk) {
					session.canvasSource.srcObject.removeTrack(trk);
					trk.stop();
					wasDisabled=false;
				});
			}
			
			session.streamSrc.getVideoTracks().forEach(function(track) {
				session.streamSrc.removeTrack(track);
				track.stop();
				wasDisabled=false;
			});
			
			if (session.videoElement.srcObject) {
				session.videoElement.srcObject.getVideoTracks().forEach(function(track) {
					session.videoElement.srcObject.removeTrack(track);
					track.stop();
					session.videoElement.load();
					wasDisabled=false;
				});
			} else {
				checkBasicStreamsExist();
			}
			
		} else {
			checkBasicStreamsExist();
			//session.videoElement.srcObject = outboundAudioPipeline(); // not sure I see the point of this being here
			log("CREATE NEW STREAM");
		}
	} catch (e) {
		errorlog(e);
	}

	session.videoElement.controls = session.showControls || false;
	
	log("selector: " + selector);
	var videoSelect = document.querySelector(selector);  // document.querySelector("videoSource3").value == "ZZZ"
	log(videoSelect);
	var mirror = false;
	getById("cameraTip1").classList.add("hidden");

	if (!videoSelect || videoSelect.value == "ZZZ") { // if there is no video, or if manually set to audio ready, then do this step.
		warnlog("ZZZ SET - so no VIDEO");
		SelectedVideoInputDevices = [];
		saveSettings();
		
		if (session.avatar && session.avatar.ready){
			updateRenderOutpipe();
		}
		
		if ((eleName == "previewWebcam") && document.getElementById("previewWebcam")){
			if (session.autostart) {
				publishWebcam(); // no need to mirror as there is no video...
				return;
			} else {
				log("4462");
				updateStats();
				if (document.getElementById("gowebcam")) {
					document.getElementById("gowebcam").dataset.ready = "true";
					if (document.getElementById("gowebcam").dataset.audioready == "true"){
						document.getElementById("gowebcam").disabled = false;
						document.getElementById("gowebcam").innerHTML = miscTranslations["start"];
					}
				}
			}
		} else { // If they disabled the video but not in preview mode; but actualy live. We will want to remove the stream from the publishing
			// we don't want to do this otherwise, as we are "replacing" the track in other cases.
			// this does cause a problem, as previous bitrate settings & resolutions might not be applied if switched back....  must test
			
			if (session.avatar && session.avatar.ready){
				updateRenderOutpipe();
				return;
			}
			
			
			if (session.mc && session.mc.getSenders){
				session.mc.getSenders().forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
					if (sender.track && sender.track.kind == "video") {
						session.mc.canvasStream.getVideoTracks().forEach(trk=>{
							sender.replaceTrack(trk); // replace may not be supported by all browsers.  eek.
						});
					}
				});
			}
			
			for (UUID in session.pcs) {
				if ("realUUID" in session.pcs[UUID]){continue;} // do not apply to screen shares.
				// for any connected peer, update the video they have if connected with a video already.
				var senders = getSenders2(UUID);
				senders.forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
					if (sender.track && sender.track.kind == "video") {
						sender.track.enabled = false;
						getById("mutevideobutton").classList.add("hidden"); // hide the mute button, so they can't unmute while no video.
						//session.pcs[UUID].removeTrack(sender);  // replace may not be supported by all browsers.  eek.
						//errorlog("DELETED SENDER");
					}
				});
			}
			
			var msg = {};
			msg.videoMuted = true;
			session.sendMessage(msg);
		}
		return;
	} else {
		
		if (videoSelect && videoSelect.value){
			SelectedVideoInputDevices = [videoSelect.value];
			saveSettings();
		}
		
		if (session.avatar && session.avatar.timer){
			clearInterval(session.avatar.timer);
		}
		
		var sq = 0;
		if (session.quality === false) {
			sq = session.quality_wb;
		} else if (session.quality > 2) { // 1080, 720, and 360p 
			sq = 2; // hacking my own code. TODO: ugly, so I need to revisit this. 
		} else {
			sq = session.quality;
		}

		if (session.director && (quality !== false)){ // URL-based quality won't matter if DIRECTOR; 
			// quality = quality; 
		} else if ((quality === false) || (quality < sq)) {
			quality = sq; // override the user's setting
		}

		if ((iOS || iPad) && SafariVersion<15) { // iOS will not work correctly at 1080p; likely a h264 codec issue. 
			if (quality == 0) {
				quality = 1;
			}
		}

		var constraints = {
			audio: false,
			video: getUserMediaVideoParams(quality, (iOS || iPad))
		};

		log("Quality selected:" + quality);

		if (session.facingMode){
			constraints.video.facingMode = { exact: session.facingMode }; // user or environment
		} else if ((iOS) || (iPad)) {
			constraints.video.deviceId = {
				exact: videoSelect.value
			}; // iPhone 6s compatible ? Needs to be exact for iPhone 6s

		} else if (Firefox){ // is firefox. 
			constraints.video.deviceId = {
				exact: videoSelect.value
			}; // Firefox is a dick. Needs it to be exact.

		} else if (videoSelect.options[videoSelect.selectedIndex].text.includes("NDI Video")) { // NDI does not like "EXACT"
			constraints.video.deviceId = videoSelect.value; // NDI is fucked up
		} else {
			constraints.video.deviceId = {
				exact: videoSelect.value
			}; //  Default. Should work for Logitech, etc.  
		}

		if (session.width) {
			constraints.video.width = {
				exact: session.width
			}; // manually specified - so must be exact
		}
		if (session.height) {
			constraints.video.height = {
				exact: session.height
			};
		}
		if (session.framerate) {
			constraints.video.frameRate = {
				exact: session.framerate
			};
		} else if (session.maxframerate != false){
			constraints.video.frameRate = {
				ideal: session.maxframerate,
				max: session.maxframerate
			};
		}
		if (session.ptz){
			if (constraints.video && constraints.video!==true){
				if (ChromeVersion && ChromeVersion>80){
					constraints.video.pan=true;
					constraints.video.tilt=true;
					constraints.video.zoom=true;
				}
			}
		}
		
		if (session.forceAspectRatio){
			if (constraints.video && constraints.video!==true){
				constraints.video.aspectRatio = { ideal: parseFloat(session.forceAspectRatio)};
			}
		}
		
		var obscam = false;
		var mirrorcheck = false;
		log(videoSelect.options[videoSelect.selectedIndex].text);
		if (videoSelect.options[videoSelect.selectedIndex].text.startsWith("OBS-Camera")) { // OBS Virtualcam
			mirror = true;
			obscam = true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.startsWith("OBS Virtual Camera")) { // OBS Virtualcam
			mirror = true;
			obscam = true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.startsWith("Streamlabs ")) { // OBS Virtualcam
			mirror = true;
			obscam = true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.startsWith("Dummy video device")) { // Linuxv
			mirror = true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.startsWith("vMix Video")) { // vMix 
			mirror = true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.startsWith("screen-capture-recorder")) { // screen-capture-recorder
			mirror = true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.includes(" back")) { // Android
			mirror = true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.includes(" rear")) { // Android
			mirror = true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.includes("NDI Video")) { // NDI Virtualcam 
			mirror = true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.startsWith("Back Camera")) { // iPhone and iOS
			mirror = true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.toLowerCase().includes("c922")) {
			if ((session.quality!==2) && !session.cleanOutput){
				getById("cameraTipContext1").innerHTML = miscTranslations["camera-tip-c922"];
				getById("cameraTip1").classList.remove("hidden");
			}
		} else if (videoSelect.options[videoSelect.selectedIndex].text.toLowerCase().includes("cam link")) {
			if (!session.cleanOutput){
				getById("cameraTipContext1").innerHTML = miscTranslations["camera-tip-camlink"];
				getById("cameraTip1").classList.remove("hidden");
			}
			
		} else if (session.mobile){
			mirrorcheck = true;
			mirror = false;
		} else {
			mirror = false;
		}
		
		if (SamsungASeries && ChromeVersion){
			if (!session.cleanOutput){
				getById("cameraTipContext1").innerHTML = miscTranslations["samsung-a-series"];
				getById("cameraTip1").classList.remove("hidden");
			}
		}
		
		session.mirrorExclude = mirror;

		if (constraints.video && (constraints.video!==true) && (Object.keys(constraints.video).length==0)){
			constraints.video = true;
		}
	
		log(constraints);
		clearTimeout(grabVideoUserMediaTimeout);
		getUserMediaRequestID += 1;
		var gumMediaID = getUserMediaRequestID;
		grabVideoUserMediaTimeout = setTimeout(function(gumID, callback2) {
			if (getUserMediaRequestID !== gumID) {return;} // cancel
			navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
				if (getUserMediaRequestID !== gumID) {
					warnlog("GET USER MEDIA CALL HAS EXPIRED");
					stream.getTracks().forEach(function(track) {
						stream.removeTrack(track);
						track.stop();
						log("stopping old track");
					});
					return;
				}
				log("adding video tracks 2412");
				
				//checkBasicStreamsExist();
				
				stream.getVideoTracks().forEach(function(track) {
					
					try{
						if (mirrorcheck){
							const capabilities = track.getCapabilities();
							if ("facingMode" in capabilities){
								if (capabilities.facingMode == "environment"){
									session.mirrorExclude = true;
								}
							}
						}
					} catch(e){}
						
					session.streamSrc.addTrack(track); // tracks previously removed.
					
					try{
						track.onended = function(e) {  // hurrah!
							warnlog(e);
							refreshVideoDevice();
						}
					} catch(e){errorlog(e);}
					
					if (session.mobile){
						if (!(iPad || iOS)){
							try{
								updateSavedVideoSettings(track);
							} catch(e){errorlog(e);}
						}
					}
					
				});
				
				updateRenderOutpipe();  
				// senderAudioUpdate
				
				if (wasDisabled && !session.videoMuted){
					var msg = {};
					msg.videoMuted = session.videoMuted;
					session.sendMessage(msg);
				}
				
				applyMirror(session.mirrorExclude);
				
				session.videoElement.play().then(() => {
					log("start play doublecheck");
				});
				
				if ((eleName == "previewWebcam") && document.getElementById("previewWebcam")){
					if (session.autostart) {
						publishWebcam();
					} else {
						log("4620");
						if (document.getElementById("gear_webcam")) {
							updateStats(obscam);
						}
						if (document.getElementById("gowebcam")) {
							document.getElementById("gowebcam").dataset.ready = "true";
							if (document.getElementById("gowebcam").dataset.audioready == "true"){
								document.getElementById("gowebcam").disabled = false;
								document.getElementById("gowebcam").innerHTML = miscTranslations["start"];
							}
						}
					}
				} else if (getById("gear_webcam3").style.display === "inline-block") {
					updateStats(obscam);
				}

				// Once crbug.com/711524 is fixed, we won't need to wait anymore. This is
				// currently needed because capabilities can only be retrieved after the
				// device starts streaming. This happens after and asynchronously w.r.t.
				// getUserMedia() returns.
				if (grabVideoTimer) {
					clearTimeout(grabVideoTimer);
					if ((eleName == "previewWebcam") && document.getElementById("previewWebcam")){
						session.videoElement.controls = true;
					}
				}
				if (getById("popupSelector_constraints_video")) {
					getById("popupSelector_constraints_video").innerHTML = "";
				}
				if (getById("popupSelector_constraints_audio")) {
					getById("popupSelector_constraints_audio").innerHTML = "";
				}
				if (getById("popupSelector_constraints_loading")) {
					getById("popupSelector_constraints_loading").style.display = "";
				}
				
				if (iOS || iPad){ // TEMPORARY: iOS 15.3 beta fix
					toggleSpeakerMute(true);
				}
				if (!((eleName == "previewWebcam") || document.getElementById("previewWebcam"))){
					updateMixer(); // not with the preview, but after.
				}
				
				pokeIframeAPI('local-camera-event'); 

				grabVideoTimer = setTimeout(function(callback3, gumid) {
					
					if (getUserMediaRequestID !== gumid) { // new camera selected in this time.
						return;
					}
					makeImages(true); 
					
					if (getById("popupSelector_constraints_loading")) {
						getById("popupSelector_constraints_loading").style.display = "none";
					}
					if ((eleName == "previewWebcam") && document.getElementById("previewWebcam")){
						session.videoElement.controls = true;
						try {
							var track0 = session.streamSrc.getVideoTracks();
							if (track0.length) {
								track0 = track0[0];
								if (track0.getCapabilities) {
									session.cameraConstraints = track0.getCapabilities();
								} else {
									session.cameraConstraints = {};
								}
								log(session.cameraConstraints);
								if (track0.getSettings) {
									session.currentCameraConstraints = track0.getSettings();
								} else {
									session.currentCameraConstraints = {};
								}
								log(session.currentCameraConstraints);
							}
						} catch (e) {
							errorlog(e);
						}
					} else {
						updateConstraintSliders();
					}
					if (callback3){
						try {
							var data = {};
							data.UUID = callback3;
							data.videoOptions = listVideoSettingsPrep();
							sendMediaDevices(data.UUID);
							session.sendMessage(data, data.UUID);
						} catch(e){}
					}
					
					session.setResolution(); // this will reset scaling for all viewers of this stream. I also call it when aspect ratio, width, or height is changed via applyConstraints
					
					updateForceRotate();
					
					if (iOS || iPad){  // TEMPORARY: iOS 15.3 beta fix
						toggleSpeakerMute(true);
					}
					
					dragElement(session.videoElement);
				}, 1000, callback2, gumID); // focus
				
				log("DONE - found stream");
			}).catch(function(e) {
				
				
				if (getUserMediaRequestID !== gumID) {
					warnlog("the previously selected camera attempted failed, but not a big deal, since its now void");
					return;
				}
					
				warnlog(e);
				if (e.name === "OverconstrainedError") {
					warnlog(e.message);
					log("Resolution or framerate didn't work");
				} else if (e.name === "NotReadableError") {
					if (quality <= 10) {
						activatedPreview = false;
						grabVideo(quality + 1, eleName, selector);
					} else if (session.facingMode){
						session.facingMode = false;
						activatedPreview = false;
						grabVideo(false, eleName, selector); // restart.
					} else {
						if (!(session.cleanOutput)) {
							if (iOS) {
								warnUser("An error occured. Closing existing tabs in Safari may solve this issue.");
							} else {
								warnUser("Error: Could not start video source.\n\nTypically this means the Camera is already be in use elsewhere. Most webcams can only be accessed by one program at a time.\n\nTry a different camera or perhaps try re-plugging in the device.");
							}
						}
						activatedPreview = true;
						if (getById('gowebcam')) {
							getById('gowebcam').innerHTML = "Problem with Camera";
						}

					}
					return;
				} else if (e.name === "NavigatorUserMediaError") {
					if (getById('gowebcam')) {
						getById('gowebcam').innerHTML = "Problem with Camera";
					}
					if (!(session.cleanOutput)) {
						warnUser("Unknown error: 'NavigatorUserMediaError'");
					}
					return;
				} else if (e.name === "timedOut") {
					activatedPreview = true;
					if (getById('gowebcam')) {
						getById('gowebcam').innerHTML = "Problem with Camera";
					}
					if (!(session.cleanOutput)) {
						warnUser(e.message);
					}
					return;
				} else {
					errorlog("An unknown camera error occured");
				}

				if (quality <= 10) {
					activatedPreview = false;
					grabVideo(quality + 1, eleName, selector);
				} else if (session.facingMode){
					session.facingMode = false;
					activatedPreview = false;
					grabVideo(false, eleName, selector); // restart.
				} else {
					errorlog("********Camera failed to work");
					activatedPreview = true;
					if (getById('gowebcam')) {
						getById('gowebcam').innerHTML = "Problem with Camera";
					}
					if (!(session.cleanOutput)) {
						if (session.width || session.height || session.framerate) {
							warnUser("<i class='las la-exclamation-circle'></i> Camera failed to load.\n\nPlease ensure your camera supports the resolution and framerate that has been manually specified. Perhaps use &quality=0 instead.");
						} else {
							warnUser("<i class='las la-exclamation-circle'></i> Camera failed to load.\n\nPlease make sure it is not already in use by another application.\n\nPlease make sure you have accepted the camera permissions.");
						}
					}
				}
			});
		}, 100, gumMediaID, callback);
	}
}

function updateRenderOutpipe(){ // video only.
	log("updateRenderOutpipe()");
	
	if (session.canvasWebGL){
		session.canvasWebGL.remove()
		session.canvasWebGL=null;
	}
	
	if (session.canvasSource){ 
		session.canvasSource.srcObject.getTracks().forEach(function(trk) {
			session.canvasSource.srcObject.removeTrack(trk);
			//trk.stop();
		});
	}
	
	if (session.videoElement.srcObject) {
		session.videoElement.srcObject.getVideoTracks().forEach(function(track) {
			session.videoElement.srcObject.removeTrack(track);
			//track.stop();
			//session.videoElement.load();
		});
	} else if (session.streamSrc){
		session.videoElement.srcObject = outboundAudioPipeline();
	}
	
	if (session.streamSrc){
		var tracks = session.streamSrc.getVideoTracks();
		if (!tracks.length || session.videoMuted){
			tracks = setAvatarImage(tracks); 
			if (tracks.length){
				tracks.forEach(function(track) {
					session.videoElement.srcObject.addTrack(track);
					if (session.avatar && session.avatar.tracks){
						var msg = {};
						msg.videoMuted = false;
						session.sendMessage(msg);
						
						
					} else {
						toggleVideoMute(true);
					}
					pushOutVideoTrack(track)
				});
			} else {
				var msg = {};
				msg.videoMuted = true;
				session.sendMessage(msg);
				session.videoElement.load();
			}
		} else if (tracks.length){
			applyMirror(session.mirrorExclude);
			tracks.forEach(function(track) {
				track = applyEffects(track); // updates with the correct track session.streamSrc
				session.videoElement.srcObject.addTrack(track);
				toggleVideoMute(true);
				pushOutVideoTrack(track)
			});
		}
	}
}

function pushOutVideoTrack(track){
	if (session.mc && session.mc.getSenders){ // should only be 0 or 1 video sender, ever.
		//var added = false;
		session.mc.getSenders().forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
			if (sender.track && sender.track.kind == "video") {
				sender.replaceTrack(track); // replace may not be supported by all browsers.  eek.
				//sender.track.enabled = true;
				//added = true;
			}
		})
	} else {
		meshcast();
	}
	
	for (UUID in session.pcs) {
		var videoAdded = false;
		try {
			if ("realUUID" in session.pcs[UUID]){continue;}
			if ((session.pcs[UUID].guest == true) && (session.roombitrate === 0)) {
				log("room rate restriction detected. No videos will be published to other guests");
			} else if (session.pcs[UUID].allowVideo == true) { // allow 

				// for any connected peer, update the video they have if connected with a video already.
				var added = false;
				var senders = getSenders2(UUID);
				senders.forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
					if (added) {
						return;
					}
					if (sender.track && sender.track.kind == "video") {
						sender.replaceTrack(track); // replace may not be supported by all browsers.  eek.
						log("Track replaced");
						log(track);
						sender.track.enabled = true;
						added = true;
					}
				});
				if (added == false) {
					videoAdded = true;
					session.pcs[UUID].addTrack(track, session.videoElement.srcObject); // can't replace, so adding
					setTimeout(function(uuid){session.optimizeBitrate(uuid);},session.rampUpTime, UUID); // 3 seconds lets us ramp up the quality a bit and figure out the total bandwidth quicker
				}
			}
		} catch (e) {
			errorlog(e);
		}
		
		if (iOS || iPad){  ///////// THIS IS A FIX FOR iOS 15.4.  When a video is loaded (view/push), the bitrate from iOS devices is stuck low, and resolution needs toggle to fix.
			// videoAdded value needs to be deleted from above also
			if (SafariVersion && (SafariVersion<=13)){
				//
			} else if (videoAdded){
				setTimeout(function(uuid){
					session.setScale(uuid, null);
				}, 2000, UUID);
				setTimeout(function(uuid){
					var scale = 100;session.setScale
					if (session.pcs[uuid].scale){
						scale = session.pcs[uuid].scale;
					}
					session.setScale(uuid, scale);
				},5000, UUID);
			}
		}
	}
	
	session.refreshScale(); 
}


async function grabAudio(selector = "#audioSource", trackid = null, override = false, callback = false) { // trackid is the excluded track
	if (activatedPreview == true) {
		log("activated preview return 2");
		return;
	}
	activatedPreview = true;
	log("TRACK EXCLUDED:" + trackid);

	try {
		if (session.videoElement.srcObject) {
			var audioSelect = document.querySelector(selector).querySelectorAll("input");
			
			var audioExcludeList = [];
			for (var i = 0; i < audioSelect.length; i++) {
				try {
					if ("screen" == audioSelect[i].dataset.type) { // skip already excluded ---------- !!!!!!  DOES THIS MAKE SENSE? TODO: CHECK
						if (audioSelect[i].checked) {
							audioExcludeList.push(audioSelect[i]);
						}
					}
				} catch (e) {
					errorlog(e);
				}
			}

			session.videoElement.srcObject.getAudioTracks().forEach(function(track) { // TODO: Confirm that I even need this?
				for (var i = 0; i < audioExcludeList.length; i++) {
					try {
						if (audioExcludeList[i].label == track.label) {
							warnlog("DONE");
							return;
						}
					} catch (e) {}
				}
				if (trackid && (track.id == trackid)) {
					warnlog("SKIPPED EXCLUDED TRACK?");
					return;
				}
				session.videoElement.srcObject.removeTrack(track);
				track.stop();
			});

			session.streamSrc.getAudioTracks().forEach(function(track) {
				for (var i = 0; i < audioExcludeList.length; i++) {
					try {
						if (audioExcludeList[i].label == track.label) {
							warnlog("EXCLUDING TRACK; PROBABLY SCREEN SHARE");
							return;
						}
					} catch (e) {}
				}
				if (trackid && (track.id == trackid)) {
					warnlog("SKIPPED EXCLUDED TRACK?");
					return;
				}
				session.streamSrc.removeTrack(track);
				track.stop();
			});
			
		} else { // if no stream exists
			checkBasicStreamsExist();
		}
	} catch (e) {
		errorlog(e);
	}

	var streams = await getAudioOnly(selector, trackid, override); // Get audio streams
	
	try {
		for (var i = 0; i < streams.length; i++) {
			streams[i].getAudioTracks().forEach(function(track) {
				session.streamSrc.addTrack(track); // add video track to the preview video
			});
		}
	} catch(e){errorlog(e);}
	
	senderAudioUpdate(callback);
}
	
function senderAudioUpdate(callback=false){
	try {
		
		checkBasicStreamsExist();
		
		// toggleMute(true); // checkBasicStreamsExist contains toggle
		
		if (session.videoElement.srcObject.getAudioTracks()) {
			var tracks = session.videoElement.srcObject.getAudioTracks();
			
			if (session.mc && session.mc.getSenders && tracks.length){
				session.mc.getSenders().forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
					if (sender.track && sender.track.kind == "audio") {
						tracks.forEach(trk=>{
							sender.replaceTrack(trk);
						})
					}
				});
			} else if (tracks.length){
				meshcast();
			}
				
			
			for (UUID in session.pcs) {
				if ("realUUID" in session.pcs[UUID]){continue;} // do not process the screen share audio
				if (session.pcs[UUID].allowAudio == true) {
					var senders = getSenders2(UUID);
					senders.forEach((sender) => {
						var good = false;
						if (sender.track && sender.track.id && (sender.track.kind == "audio")) {
							tracks.forEach(function(track) {
								if (track.id == sender.track.id) {
									good = true;
								}
							});
						} else { // video or something else; ignore it.
							return;
						}
						if (good) {
							return;
						}
						sender.track.enabled = false;
						//session.pcs[UUID].removeTrack(sender); //  Apparently removeTrack causes renogiation; also kills send/recv.
					});

					if (tracks.length) {
						tracks.forEach(function(track) {
							var matched = false;
							var senders = getSenders2(UUID);
							senders.forEach((sender) => {
								if (sender.track && sender.track.id && (sender.track.kind == "audio")) {
									warnlog(sender.track.id + " " + track.id);
									if (sender.track.id == track.id) {
										warnlog("MATCHED 1");
										matched = true;
									}
								}
							});
							if (matched) {
								return;
							}
							var added = false;
							var senders = getSenders2(UUID);
							senders.forEach((sender) => {
								if (added) {
									return;
								}
								if (sender.track && (sender.track.kind == "audio") && (sender.track.enabled == false)) {
									sender.replaceTrack(track);
									sender.track.enabled = true;
									added = true;
									warnlog("ADDED 2");
								}
							});
							if (added) {
								return;
							}
							var sender = session.pcs[UUID].addTrack(track, session.videoElement.srcObject);
						});
					} else {
						var senders = getSenders2(UUID);
						senders.forEach((sender) => {
							if (sender.track && sender.track.kind == "audio") {
								sender.track.enabled = false; // (trying this instead)
								//session.pcs[UUID].removeTrack(sender); //  Apparently removeTrack causes renogiation; also kills send/recv.
							}
						});
					}
				}
			}
			session.applySoloChat(); // mute streams that should be muted if a director
			session.applyIsolatedChat();
		}
		
		try {
			if (toggleSettingsState){
				updateConstraintSliders();
			}
		} catch(e){}
		
		if (callback){
			try{
				var data = {};
				data.UUID = callback;
				data.audioOptions = listAudioSettingsPrep();
				sendMediaDevices(data.UUID); 
				session.sendMessage(data, data.UUID);
			} catch(e){}
		}
	} catch (e) {
		errorlog(e);
	}
	if (document.getElementById("gowebcam")) {
		document.getElementById("gowebcam").dataset.audioready = true;
		if (document.getElementById("gowebcam").dataset.ready && (document.getElementById("gowebcam").dataset.ready=="true")){
			document.getElementById("gowebcam").disabled = false;
			document.getElementById("gowebcam").innerHTML = miscTranslations["start"];
		}
	}
}


// WEBCAM
session.publishDirector =  async function(clean, vdevice=false, adevice=true){ //  stream is used to generated an SDP ; true,false,false
	log("DIRECTOR STREAM SETUP");
	
	if (getById("press2talk").dataset.enabled == true){log("already enabled");return;}
	getById("press2talk").dataset.enabled = true;
	
	if (session.videoElement){
		var v = session.videoElement;
	} else {
		var v = createVideoElement();
		session.videoElement = v;
	}
	
	if (session.streamID){
		session.videoElement.dataset.sid = session.streamID;
	}
	v.id = "videosource"; // could be set to UUID in the future
	v.muted = true;
	v.autoplay = true;
	v.controls = session.showControls || false;
	v.setAttribute("playsinline","");
								
	checkBasicStreamsExist();
	
	var quality = 1;
	var framerate = 30;
	
	if (session.quality!==false){
		quality = parseInt(session.quality) || 0;
		if (quality>2){quality=2;} else if (quality<0){quality = 0;}
	}
	
	if (session.showDirector){
		if (quality<2){
			framerate = 60;
		}
	}
	
	if (session.framerate!==false){
		framerate = parseInt(session.framerate) || 30;
	}
	
	if (session.maxframerate){
		if (framerate > session.maxframerate){
			framerate = session.maxframerate || framerate;
		}
	}
	
	if (vdevice){
		if (vdevice===true){
			vdevice = {};
		}
		if (quality===-1){
			//vdevice.width = {ideal:3840};			//{deviceId: {exact: deviceInfo.deviceId}};
			//vdevice.height = {ideal:2160};
			vdevice.framerate = {ideal:framerate};
		} else if (quality===0){
			vdevice.width = {ideal:1920};			//{deviceId: {exact: deviceInfo.deviceId}};
			vdevice.height = {ideal:1080};
			vdevice.framerate = {ideal:framerate};
		} else if (quality===1){
			vdevice.width = {ideal:1280};			//{deviceId: {exact: deviceInfo.deviceId}};
			vdevice.height = {ideal:720};
			vdevice.framerate = {ideal:framerate};
		} else if (quality===2){
			vdevice.width = {ideal:640};			//{deviceId: {exact: deviceInfo.deviceId}};
			vdevice.height = {ideal:360};
			vdevice.framerate = {ideal:framerate};
		}
		if (session.framerate){
			vdevice.framerate.ideal = parseInt(session.framerate) || 30;
		}
		if (session.maxframerate){
			vdevice.framerate.max = parseInt(session.maxframerate) || 60;
		}
		if (session.width){
			vdevice.width = {exact: session.width};			//{deviceId: {exact: deviceInfo.deviceId}};
		}
		if (session.height){
			vdevice.height = {exact: session.height};			//{deviceId: {exact: deviceInfo.deviceId}};
		}
	}
	
	var constraints = {audio: adevice, video: vdevice};
	
	if (session.forceAspectRatio){
		if (constraints.video && constraints.video!==true){
			constraints.video.aspectRatio = { ideal: parseFloat(session.forceAspectRatio)};
		}
	}
	
	
	if (session.audioInputChannels){
		if (constraints.audio === true){
			constraints.audio = {};
			constraints.audio.channelCount = session.audioInputChannels;
		} else if (constraints.audio){
			constraints.audio.channelCount = session.audioInputChannels;
		}
	}
	
	//if (session.echoCancellation===false){
	if (constraints.audio === true){
		constraints.audio = {};
	}
	if (constraints.audio){
		if (session.echoCancellation===false || session.autoGainControl===false || session.noiseSuppression===false){
			if (session.echoCancellation===false){
				constraints.audio.echoCancellation=false;
			} else {
				constraints.audio.echoCancellation=true;
			}
			if (session.autoGainControl===false){
				constraints.audio.autoGainControl=false;
			} else {
				constraints.audio.autoGainControl=true;
			}
			if (session.noiseSuppression===false){
				constraints.audio.noiseSuppression=false;
			} else {
				constraints.audio.noiseSuppression=true;
			}
		}
	}

	if (constraints.audio ===false && constraints.video ===false){
		for (UUID in session.pcs){
			try {
				session.initialPublish(UUID); // Start publishing!
			} catch(e){errorlog(e);}
		}
		try{
			createDirectorCam(session.videoElement, clean);
		} catch(e){errorlog(e);}
	} else {
		getUserMediaRequestID+=1;
		var gumID = getUserMediaRequestID;
		navigator.mediaDevices.getUserMedia(constraints).then(function(stream){ // very simple.
			if (getUserMediaRequestID !== gumID) {
				warnlog("GET USER MEDIA CALL HAS EXPIRED 2");
				stream.getTracks().forEach(function(track) {
					stream.removeTrack(track);
					track.stop();
					log("stopping old track");
				});
				return;
			}
			
			 // create srcObject + videoElement
			session.streamSrc = stream;
			checkBasicStreamsExist();
			
			// v.srcObject = outboundAudioPipeline(); // not blank, so now we worry
			//session.videoElement.srcObject = outboundAudioPipeline();
			updateRenderOutpipe();
			meshcast();
			//toggleMute(true); // createDirectorCam does this for us in a second. 
			
			for (UUID in session.pcs){
				try {
					session.initialPublish(UUID); // Start publishing!
				} catch(e){errorlog(e);}
			}
			try{
				createDirectorCam(session.videoElement, clean);
			} catch(e){errorlog(e);}
		});
	}
	
	changeAudioOutputDevice(session.videoElement);
	
	try {
		getById("webcamquality3").elements.namedItem("resolution").value = quality;
		getById("gear_webcam3").style.display = "inline-block";
		getById("webcamquality3").onchange = function(event) {
			if (parseInt(getById("webcamquality3").elements.namedItem("resolution").value) == 2) {
				if (session.maxframerate===false){
					session.maxframerate = 30;
					session.maxframerate_q2 = true;
				} 
			} else if (session.maxframerate_q2){
				session.maxframerate = false;
				session.maxframerate_q2 = false;
			}
			activatedPreview = false;
			session.quality_wb = parseInt(getById("webcamquality3").elements.namedItem("resolution").value);
			grabVideo(session.quality_wb, "videosource", "select#videoSource3");
		};
	} catch (e) {}
	
	v.onpause = (event) => { // prevent things from pausing; human or other
		if (!((event.ctrlKey) || (event.metaKey) )){
			log("Video paused; auto playing");
			event.currentTarget.play().then(_ => {
				log("playing 9");
			}).catch(warnlog);
		}
	};
	
	v.addEventListener('click', function(e) { // show stats of video if double clicked
		log("click");
		try {
			if ((e.ctrlKey)||(e.metaKey)){
				e.preventDefault();
				
				////////////////////////	
				
				var [menu, innerMenu] = statsMenuCreator();
				
				//////////////////////////////////
				
				menu.interval = setInterval(printMyStats,3000, innerMenu);
				printMyStats(innerMenu);
				e.stopPropagation();
				
				return false;
			}
		} catch(e){errorlog(e);}
	});
	
	pokeIframeAPI('director-share', true);  // director has started publishing; even if no audio/video.
	
	if (session.directorEnabledPPT){
		return;
	}
	
	if (session.videoMutedFlag){
		session.videoMuted = true;
		toggleVideoMute(true);
	}
	
	session.directorEnabledPPT = true;
	
	if (session.seeding){
		return;
	}
	
	if (session.autorecord || session.autorecordlocal){
		log("AUTO RECORD START");
		setTimeout(function(v){
			if (session.director){
				recordVideo(document.querySelector("[data-action-type='recorder-local'][data-sid='"+session.streamID+"']"), null, session.recordLocal)
			} else if (v.stopWriter || v.recording){
				
			} else if (v.startWriter){
				v.startWriter();
			} else {
				recordLocalVideo(null, session.recordLocal, v)
			}
		},2000, v);
	}
	
	session.seeding=true;
	session.seedStream(); 
}; // publishdirector

function createDirectorCam(vid) {
	try{
		getById("press2talk").outerHTML = "";
	} catch(e){}
	
	if (document.getElementById("videoContainer_director")){
		getById("videoContainer_director").appendChild(vid);
	} else {
		getById("miniPerformer").appendChild(vid);
	}
	vid.title = "This is the preview of the Director's audio and video output.";
	vid.id = "videosource";
	session.muted = false;
	toggleMute(true);
	
	getById("mutebutton").classList.remove("hidden");
	getById("screensharebutton").classList.remove("hidden");
	getById("hangupbutton2").classList.remove("hidden");
	
	toggleSettings();
	
	updatePushId()
	
}

function statsMenuCreator(){
	if (getById("menuStatsBox")){
		clearInterval(getById("menuStatsBox").interval);
		getById("menuStatsBox").remove();
	}
	
	var menu = document.createElement("div");
	menu.id = "menuStatsBox";
	menu.className = "debugStats remotestats";
	getById('main').appendChild(menu);
	
	menu.style.left = parseInt(Math.random()*10)+15+"px"
	menu.style.top = parseInt(Math.random()*10)+"px"
	
	menu.innerHTML="<h1 data-translate='statistics'>Statistics</h1>";
	var menuCloseBtn = document.createElement("button");
	menuCloseBtn.className="close";
	menuCloseBtn.innerHTML="×";
	menu.appendChild(menuCloseBtn);
	
	var innerMenu = document.createElement("div");
	menu.appendChild(innerMenu);
	
	menuCloseBtn.addEventListener('click', function(eve) {
		clearInterval(menu.interval);
		eve.currentTarget.parentNode.remove();
		eve.preventDefault();
		eve.stopPropagation();
	});
	return [menu, innerMenu];
}


// WEBCAM
session.publishStream = function(v){ //  stream is used to generated an SDP
	log("STREAM SETUP");
	
	if (session.transcript){
		setTimeout(function(){setupClosedCaptions();},1000);
	}
	
	session.streamSrc.oninactive = function streamoninactive() {
		warnlog('Stream inactive');
		if (session.videoElement.recording){
			session.videoElement.recorder.stop();
		}
	};
	
	if (session.streamSrc.getVideoTracks().length==0){
		warnlog("NO VIDEO TRACK INCLUDED");
	}

	if (session.streamSrc.getAudioTracks().length==0){
		warnlog("NO AUDIO TRACK INCLUDED");
	} 
	
	
	var container = document.createElement("div");
	//v.container = container;
	container.id = "container";
	
	
	if (session.cleanOutput){
		container.style.height = "100%";
		v.style.maxWidth = "100%";
		v.style.boxShadow = "none";
	}
	
	if (session.cover){
		container.style.setProperty('height', '100%', 'important');
	}
	
	container.className = "vidcon";
	getById("gridlayout").appendChild(container);
	
	v.className = "tile"; //"tile task"; TODO: get working  (will add task later on instead)
	
	
	v.muted = true;
	v.autoplay = true;
	if (session.mobile){
		v.controls = true;
	} else {
		v.controls = session.showControls || false;
	}
	v.setAttribute("playsinline","");
	v.id = "videosource"; // could be set to UUID in the future
	v.oncanplay = null;
	
	session.videoElement = v;
	container.appendChild(v);
	
	//session.videoElement.srcObject = outboundAudioPipeline(session.streamSrc);
	toggleMute(true);
	
	if (session.nopreview){
		v.style.display="none";
		container.style.display="none";
	}
	try{
		changeAudioOutputDevice(v);
	}catch(e){errorlog(e);}
	
	
	if (((session.roomid===false || session.roomid==="") && (session.quality===false)) || session.forceMediaSettings){
		try {
			if ((session.quality_wb!==false) && (session.quality===false)){
				getById("webcamquality3").elements.namedItem("resolution").value = session.quality_wb;
			} else if (session.quality!==false){
				getById("webcamquality3").elements.namedItem("resolution").value = session.quality;
			}
			getById("gear_webcam3").style.display = "inline-block";
			getById("webcamquality3").onchange = function(event) {
				if (parseInt(getById("webcamquality3").elements.namedItem("resolution").value) == 2) {
					if (session.maxframerate===false){
						session.maxframerate = 30;
						session.maxframerate_q2 = true;
					} 
				} else if (session.maxframerate_q2){
					session.maxframerate = false;
					session.maxframerate_q2 = false;
				}
				activatedPreview = false;
				session.quality_wb = parseInt(getById("webcamquality3").elements.namedItem("resolution").value);
				grabVideo(session.quality_wb, "videosource", "select#videoSource3");
			};
		} catch (e) {errorlog(e);}
	}
	
	
	
	var bigPlayButton = document.getElementById("bigPlayButton");
	if (bigPlayButton){
		bigPlayButton.parentNode.removeChild(bigPlayButton);
	}
	
	if (session.streamID){
		session.videoElement.dataset.sid = session.streamID;
	}
	
	if (session.director){ // the director doesn't load a webcam by default anyways.
		// audio is not mucked with
	} else if (session.scene!==false){ // it's a scene, and there are no previews in a scene.
		setTimeout(function(){updateMixer();},10);
	} else if (session.roomid!==false){
		if (session.roomid===""){
			if (!(session.view) || (session.view==="")){
				if (session.fullscreen){
					session.windowed = false;
				} else {
					v.className = "myVideo"; //"myVideo task"; TODO: get working
					session.windowed = true;
				}
				getById("mutespeakerbutton").classList.add("hidden");
				
				applyMirror(session.mirrorExclude);
				
				container.style.width="100%";
				//container.style.height="100%";
				
				container.style.alignItems = "center";
				container.backgroundColor = "#666";
				
				setTimeout(function (){dragElement(v);},1000);
				play();
			} else {
				session.windowed = false;
				applyMirror(session.mirrorExclude);
				play();
				setTimeout(function(){updateMixer();},10);
			}
		} else {
			//session.cbr=0; // we're just going to override it
			if (session.stereo==5){ // not a scene or director, so we will assume its a guest. changing to stereo=3
				session.stereo=3;
			}
			session.windowed = false;
			applyMirror(session.mirrorExclude);
			setTimeout(function(){updateMixer();},10);
		}
	} else {
		
		if (session.fullscreen){
			session.windowed = false;
		} else {
			v.className = "myVideo"; //"myVideo task"; TODO: get working
			session.windowed = true;
		}
		getById("mutespeakerbutton").classList.add("hidden");
		
		applyMirror(session.mirrorExclude);
		
		container.style.width="100%";
		//container.style.height="100%";
		//container.style.display = "flex";
		
		container.style.alignItems = "center";
		container.backgroundColor = "#666";
		
		setTimeout(function (){dragElement(v);},1000);

	}
	
	v.onpause = (event) => { // prevent things from pausing; human or other
		if (!((event.ctrlKey) || (event.metaKey) )){
			log("Video paused; auto playing");
			event.currentTarget.play().then(_ => {
				log("playing 10");
			}).catch(warnlog);
		}
	};
	
	v.addEventListener('click', function(e) {
		log("click");
		try {
			if ((e.ctrlKey)||(e.metaKey)){
				e.preventDefault();
				
				var [menu, innerMenu] = statsMenuCreator();
				
				menu.interval = setInterval(printMyStats,3000, innerMenu);
				
				printMyStats(innerMenu);
				e.stopPropagation();
				return false;
			}
		} catch(e){errorlog(e);}
	});
	
	v.touchTimeOut = null;
	v.touchLastTap = 0;
	v.touchCount = 0;
	v.addEventListener('touchend', function(event) {
		if (session.disableMouseEvents){return;}
		log("touched");
		
		document.ontouchup = null;
		document.onmouseup = null;
		document.onmousemove = null;
		document.ontouchmove = null;
		
		var currentTime = new Date().getTime();
		var tapLength = currentTime - v.touchLastTap;
		clearTimeout(v.touchTimeOut);
		if (tapLength < 500 && tapLength > 0) {
			///
			log("double touched");
			v.touchCount+=1;
			event.preventDefault();
			if (v.touchCount<5){
				v.touchLastTap = currentTime;
				return false;
			}
			v.touchLastTap = 0;
			v.touchCount=0;
			
			var [menu, innerMenu] = statsMenuCreator();
			
			menu.interval = setInterval(printMyStats,3000, innerMenu);
			
			printMyStats(innerMenu);
			event.stopPropagation();
			return false;
			//////
		} else {
			v.touchCount=1;
			v.touchLastTap = currentTime;
			
			v.touchTimeOut = setTimeout(function(vv) {
				clearTimeout(vv.touchTimeOut);
				vv.touchLastTap = 0;
				vv.touchCount=0;
			}, 5000, v);
			
		}
		
	});
		
	updateReshareLink();
	pokeIframeAPI('started-camera'); // depreciated
	pokeIframeAPI('camera-share', true); 
	
	if (session.videoMutedFlag){
		session.videoMuted = true;
		toggleVideoMute(true);
	}
	
	if (!gotDevices2AlreadyRan){
		enumerateDevices().then(gotDevices2); // this is needed for iOS; was previous set to timeout at 100ms, but would be useful everywhere I think
	}
	
	v.dataset.menu = "context-menu-video";
	if (!session.cleanOutput){
		v.classList.add("task"); // this adds the right-click menu
	}
	
	session.postPublish();
	
	if (session.autorecord || session.autorecordlocal){
		log("AUTO RECORD START");
		setTimeout(function(v){
			if (session.director){
				recordVideo(document.querySelector("[data-action-type='recorder-local'][data-sid='"+session.streamID+"']"), null, session.recordLocal)
			} else if (v.stopWriter || v.recording){
				
			} else if (v.startWriter){
				v.startWriter();
			} else {
				recordLocalVideo(null, session.recordLocal, v)
			}
		},2000, v);
	}
	
}; // publishStream

session.postPublish = function(){
	if (session.welcomeMessage){
		getChatMessage(session.welcomeMessage, false, true, true);
	}
	clearInterval(session.updateLocalStatsInterval);
	session.updateLocalStatsInterval = setInterval(function(){updateLocalStats();},3000);	
	
	session.seeding=true;			
	session.seedStream();
}


async function publishScreen2(constraints, audioList=[], audio=true){ // webcam stream is used to generated an SDP
	log("SCREEN SHARE SETUP");
	if (!navigator.mediaDevices.getDisplayMedia){
		setTimeout(function(){
			if (iOS || iPad){
				warnUser("Sorry, but your iOS browser does not support screen-sharing.\n\nPlease see <a href='https://docs.vdo.ninja/guides/screen-share-your-iphone-ipad' target='_blank'>this guide</a> for an alternative method to do so.");
			} else if (session.mobile){
				warnUser("Sorry, your browser does not support screen-sharing.\n\nThe <a href='https://docs.vdo.ninja/getting-started/native-mobile-app-versions#android-download-link' target='_blank'>Android native app</a> should support it though.");
			} else {
				warnUser("Sorry, your browser does not support screen-sharing.\n\nPlease use the desktop versions of Firefox or Chrome instead.");
			}
		},1);
		return false;
	}
	if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
		if (!ElectronDesktopCapture){
			if (!(session.cleanOutput && session.cleanish==false)){
				warnUser("Enable Elevated Privileges to allow screen-sharing. (right click this window to see that option)");
			}
		return false;
		}
	}
	
	var streams = [];
	for (var i=1; i<audioList.length;i++){  // mic sources; not screen .
		if (audioList[i].selected){
			var constraint = {video:false, audio: {deviceId: {exact: audioList[i].value}}};
			
			if (session.echoCancellation===false){  // default should be ON.  we won't even add it since deviceID is specified and Browser defaults to on already
				constraint.audio.echoCancellation=false;
			} else {
				constraint.audio.echoCancellation=true;
			}
			if (session.autoGainControl===false){
				constraint.audio.autoGainControl=false;
			} else {
				constraint.audio.autoGainControl=true;
			}
			if (session.noiseSuppression===false){
				constraint.audio.noiseSuppression=false;
			} else {
				constraint.audio.noiseSuppression=true;
			}
			getUserMediaRequestID+=1;
			var gumID = getUserMediaRequestID;
			await navigator.mediaDevices.getUserMedia(constraint).then((stream)=>{
				if (getUserMediaRequestID !== gumID) {
					warnlog("GET USER MEDIA CALL HAS EXPIRED 3");
					stream.getTracks().forEach(function(track) {
						stream.removeTrack(track);
						track.stop();
						log("stopping old track");
					});
					return;
				}
				streams.push(stream);
			}).catch(errorlog);
		}
	}
	
	if (session.audioDevice === 0 ){
		constraints.audio = false;
	}
	
	if (session.screenshareVideoOnly){
		constraints.audio = false;
	}
	
	if ((constraints.video!==false) && (Object.keys(constraints.video).length==0)){
		constraints.video = true;
	}
	
	
	log(constraints);
	getUserMediaRequestID+=1;
	var gumID = getUserMediaRequestID;
	return navigator.mediaDevices.getDisplayMedia(constraints).then(function (stream){
		if (getUserMediaRequestID !== gumID) {
			warnlog("GET USER MEDIA CALL HAS EXPIRED 3");
			stream.getTracks().forEach(function(track) {
				stream.removeTrack(track);
				track.stop();
				log("stopping old track");
			});
			return;
		}
		 /// RETURN stream for preview? rather than jumping right in.
		session.screenShareState=true;
		var data = {};
		data.screenShareState = session.screenShareState;
		session.sendMessage(data);
		
		try {
			stream.getVideoTracks()[0].onended = function () {
				toggleScreenShare();
				/* session.screenShareState=false;
				pokeIframeAPI("screen-share-ended");
				var data = {};
				data.screenShareState = session.screenShareState;
				session.sendMessage(data);*/
				
			};
		} catch(e){log("No Video selected; screensharing?");}
		
		 // OR, jump right in, and let user change from there
		if (session.roomid!==false){
			if ((session.roomid==="") && ((!(session.view)) || (session.view===""))){
				
			} else {
				getById("head3").classList.add('hidden');
				getById("head3a").classList.add('hidden');
				log("ROOMID EANBLED");
				log("Update Mixer Event on REsize SET");
				window.onresize = updateMixer;
				window.onorientationchange = function(){setTimeout(function(){
					updateForceRotate();
					updateMixer();
				}, 200);};
				joinRoom(session.roomid);
			}
			
		} else {
			getById("head3").classList.remove('hidden');
			getById("head3a").classList.remove('hidden');
			getById("logoname").style.display = 'none';
		}
		
		updatePushId()
		
		if (stream.getAudioTracks().length){
			screenShareAudioTrack = stream.getAudioTracks()[0];
		}

		log("adding tracks");
		for (var i=0; i<streams.length;i++){
			streams[i].getAudioTracks().forEach((track)=>{
				stream.addTrack(track);
			});
		}
		streams = null;
		if (session.audioDevice !== 0){
			if (stream.getAudioTracks().length==0){
				if (!(session.cleanOutput)){
					if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1){
						// Electron has no audio.
					} else {
						setTimeout(function(){warnUser("No Audio Source was detected.\n\nIf you were wanting to capture an Application's Audio, please see:\nhttps://docs.vdo.ninja/help/guides-and-how-tos#audio for some guides.");},300);
					}
				}
			}
		}
		
		
		
		try {
			session.streamSrc = stream;
		} catch (e){errorlog(e);}
		toggleMute(true);
		
		var v = createVideoElement();
		session.videoElement = v;
		
		
		if (session.streamID){
			session.videoElement.dataset.sid = session.streamID;
		}


		var container = document.createElement("div");
		//v.container = container;
		container.id = "container_screen";
		container.style.height = "100%";
		
		
		if (session.cleanOutput){
			
			v.style.maxWidth = "100%";
			v.style.boxShadow = "none";
		}

		container.className = "vidcon";
		getById("gridlayout").appendChild(container);
		
		if (session.nopreview){
			v.style.display="none";
			container.style.display="none";
		}
		
		//if (session.cover){
		//	container.style.setProperty('height', '100%', 'important');
		//}
		
		container.appendChild(v);
		
		
		v.className = "tile";
		
		changeAudioOutputDevice(v);
		
		if (session.director){
		} else if (session.scene!==false){
			setTimeout(function(){updateMixer();},1);
		} else if (session.roomid!==false){
			if (session.roomid===""){
				if (!(session.view) || (session.view==="")){
					
					getById("mutespeakerbutton").classList.add("hidden");
					
					if (session.fullscreen){
						session.windowed = false;
						if (session.mirrored && session.flipped){
							v.style.transform = " scaleX(-1) scaleY(-1)";
							v.classList.add("mirrorControl");
						} else if (session.mirrored){
							v.style.transform = "scaleX(-1)";
							v.classList.add("mirrorControl");
						} else if (session.flipped){
							v.style.transform = "scaleY(-1)";
							v.classList.remove("mirrorControl");
						} else {
							v.style.transform = "";
							v.classList.remove("mirrorControl");
						}
					} else {
						v.className = "myVideo";
						session.windowed = true;
						if (session.mirrored && session.flipped){
							v.style.transform = " scaleX(-1) scaleY(-1) translate(0, 50%)";
							v.classList.add("mirrorControl");
						} else if (session.mirrored){
							v.style.transform = "scaleX(-1) translate(0, -50%)";
							v.classList.add("mirrorControl");
						} else if (session.flipped){
							v.style.transform = "scaleY(-1) translate(0, 50%)";
							v.classList.remove("mirrorControl");
						} else {
							v.style.transform = " translate(0, -50%)";
							v.classList.remove("mirrorControl");
						}
					}
					
					container.style.width="100%";
					//container.style.height="100%";
					container.style.alignItems = "center";
					container.backgroundColor = "#666";
					
					setTimeout(function (){dragElement(v);},1000);
					play();
				} else {
					play();
					setTimeout(function(){updateMixer();},1);
				}
			} else {
				setTimeout(function(){updateMixer();},1);
			}
		} else {
			
			getById("mutespeakerbutton").classList.add("hidden");
			if (session.fullscreen){
				session.windowed = false;
				if (session.mirrored && session.flipped){
					v.style.transform = " scaleX(-1) scaleY(-1)";
					v.classList.add("mirrorControl");
				} else if (session.mirrored){
					v.style.transform = "scaleX(-1)";
					v.classList.add("mirrorControl");
				} else if (session.flipped){
					v.style.transform = "scaleY(-1)";
					v.classList.remove("mirrorControl");
				} else {
					v.style.transform = "";
					v.classList.remove("mirrorControl");
				}
			} else {
				v.className = "myVideo";
				session.windowed = true;
				if (session.mirrored && session.flipped){
					v.style.transform = " scaleX(-1) scaleY(-1) translate(0, 50%)";
					v.classList.add("mirrorControl");
				} else if (session.mirrored){
					v.style.transform = "scaleX(-1) translate(0, -50%)";
					v.classList.add("mirrorControl");
				} else if (session.flipped){
					v.style.transform = "scaleY(-1) translate(0, 50%)";
					v.classList.remove("mirrorControl");
				} else {
					v.style.transform = " translate(0, -50%)";
					v.classList.remove("mirrorControl");
				}
			}
			
			container.style.width="100%";
			//container.style.height="100%";
			container.style.alignItems = "center";
			container.backgroundColor = "#666";
		}

		v.autoplay = true;
		v.controls = session.showControls || false;
		v.setAttribute("playsinline","");
		v.muted = true;
		v.id = "videosource";
		
		v.dataset.menu = "context-menu-video";
		if (!session.cleanOutput){
			v.classList.add("task"); // this adds the right-click menu
		}
		
		//if (!v.srcObject || v.srcObject.id !== stream.id) {
		//	v.srcObject = stream;
		v.srcObject = outboundAudioPipeline();
		//}
		
		v.onpause = (event) => { // prevent things from pausing; human or other
			if (!((event.ctrlKey) || (event.metaKey) )){
				log("Video paused; auto playing");
				event.currentTarget.play().then(_ => {
					log("playing 11");
				}).catch(warnlog);
			}
		};
		
		v.addEventListener('click', function(e) { // show stats of video if double clicked
			log("click");
			try {
				if ((e.ctrlKey)||(e.metaKey)){
					e.preventDefault();
			
					var [menu, innerMenu] = statsMenuCreator();
					
					menu.interval = setInterval(printMyStats,3000, innerMenu);
					
					printMyStats(innerMenu);
					e.stopPropagation();
					return false;
				}
			} catch(e){errorlog(e);}
		});
		
		updateReshareLink();
		
		if (session.videoMutedFlag){
			session.videoMuted = true;
			toggleVideoMute(true);
		}
		
		clearInterval(session.updateLocalStatsInterval);
		session.updateLocalStatsInterval = setInterval(function(){updateLocalStats();},3000);
		
		session.seeding=true;
		session.seedStream();
		
		pokeIframeAPI('started-screenshare'); // depreciated
		pokeIframeAPI('screen-share', true); 
		
		if (session.autorecord || session.autorecordlocal){
			log("AUTO RECORD START");
			setTimeout(function(v){
				if (session.director){
					recordVideo(document.querySelector("[data-action-type='recorder-local'][data-sid='"+session.streamID+"']"), null, session.recordLocal)
				} else if (v.stopWriter || v.recording){
					
				} else if (v.startWriter){
					v.startWriter();
				} else {
					recordLocalVideo(null, session.recordLocal, v)
				}
			},2000, v);
		}
		
		return true;
	}).catch(function(err){
		errorlog(err);
		errorlog(err.name);
		if ((err.name == "NotAllowedError") || (err.name == "PermissionDeniedError")){
			// User Stopped it.  (is this next part needed??)
			session.screenShareState=false;
			pokeIframeAPI("screen-share-ended");
			var data = {};
			data.screenShareState = session.screenShareState;
			session.sendMessage(data);
			
			if (macOS){
				warnUser(miscTranslations["screen-permissions-denied"]);
			}
			return false;
		} else {
			if (audio==true){
				if (err.name == "NotReadableError"){
					if (!(session.cleanOutput)){
						warnUser(miscTranslations["change-audio-output-device"]);
					}
					return false;
				} else {
					constraints.audio=false;
					if (!(session.cleanOutput)){
						setTimeout(function(){warnUser(err);},1); // TypeError: Failed to execute 'getDisplayMedia' on 'MediaDevices': Audio capture is not supported
					}
					return publishScreen2(constraints, audioList, false);
				}
			} else {
				if (!(session.cleanOutput)){
					setTimeout(function(){warnUser(err);},1); // TypeError: Failed to execute 'getDisplayMedia' on 'MediaDevices': Audio capture is not supported
				}
				return false;
			}
		}
	});
}; // publishStream2

var transferList = [];
var msgTransferList = [];

function cancelFile(ele){
	var idx = ele.dataset.tid;
	try{
		transferList[idx].dc.close();
	} catch(e){}
	transferList[idx].status = 5;
	updateDownloadLink(idx);
}

function requestFile(ele){
	var idx = ele.dataset.tid;
	transferList[idx].status = 1;
	
	var fid = ele.dataset.fid;
	var UUID = ele.dataset.uuid;
	var msg = {};
	msg.requestFile = fid;
	msg.UUID = UUID;
	session.sendRequest(msg, msg.UUID);
	
	updateDownloadLink(idx);
	pokeIframeAPI('request-file', fid, UUID); 
}

function clearDownloadFile(ele){
	var idx = ele.dataset.tid;
	transferList[idx].status = 6;
	updateDownloadLink(idx);
}

function addDownloadLink(fileList, UUID, pc){
	if (session.nodownloads){return;} // downloads are blocked
	log(fileList);
	if (!fileList || !fileList.length){return;}
	for (var i = 0; i< fileList.length; i++){
		fileList[i].UUID = UUID;
		fileList[i].completed = 0;
		fileList[i].status = 0;
		fileList[i].time = Date.now();
		fileList[i].pc = pc[UUID];
		transferList.push(fileList[i]);
	}
	
	if (session.chatbutton===false){return;} // messages can still appear as overlays 
	
	updateMessages();
	
	if (session.beepToNotify) {
		playtone();
	}

	if (session.chat == false) {
		getById("chattoggle").className = "las la-comments my-float toggleSize puslate";
		getById("chatbutton").className = "float";

		if (getById("chatNotification").value) {
			getById("chatNotification").value = getById("chatNotification").value + 1;
		} else {
			getById("chatNotification").value = 1;
		}
		getById("chatNotification").classList.add("notification");
	}
	
	//if (session.broadcastChannel !== false) {
	//	session.broadcastChannel.postMessage(data); /* send */
	//}
}

function updateDownloadLink(idx){
	idx = parseInt(idx);
	var elements = document.querySelectorAll('[data-tid="'+idx+'"]');
	if (elements[0]) {
		if (transferList[idx].status === 0){
			elements[0].innerHTML = "Download it here";
		} else if (transferList[idx].status === 1){
			elements[0].innerHTML = "Requested";
			//elements[0].onclick='cancelFile(this);'
		} else if (transferList[idx].status === 2){
			elements[0].innerHTML = "Downloading: "+parseInt(transferList[idx].completed*100)+"%";
			elements[0].onclick = function(){cancelFile(this);}
		} else if (transferList[idx].status === 3){
			elements[0].innerHTML = "Completed";
			elements[0].onclick = null;
			elements[0].disabled = true;
		} else if (transferList[idx].status === 4){
			elements[0].innerHTML = "No longer available";
			elements[0].onclick  = null;
			elements[0].disabled = true;
		} else if (transferList[idx].status === 5){
			elements[0].innerHTML = "Cancelled";
			elements[0].onclick  = null;
			elements[0].disabled = true;
		} else if (transferList[idx].status === 6){
			getById("transfer_"+idx).style.display = "none";
			//delete(transferList[idx]);
		}
	}
}

function showDownloadLinks(){
	if (session.nodownloads){return;} // downloads are blocked
	msgTransferList=[];
	if (!transferList || !transferList.length){return;}
	for (var i = 0; i< transferList.length; i++){
		fileShareMessage(transferList[i], i);
	}
}

function fileShareMessage(fileinfo, idx){

	fileinfo.name = sanitizeChat(fileinfo.name); // keep it clean.
	
	var label = false;
	if (fileinfo.pc){
		if (fileinfo.pc.label) {
			label = sanitizeLabel(fileinfo.pc.label);
		}
	}
	var data = {};
	data.idx = idx;
	if (fileinfo.status === 0){
		data.msg = " has a shared a file with you:<br /><i>"+fileinfo.name+"</i><br />Do you trust them? <button title='file size: "+fileinfo.size+" bytes' data-button-type='download' data-fid='"+fileinfo.id+"' data-tid='"+idx+"' onclick='requestFile(this);'>Download it here</button><button data-button-type='clear' data-fid='"+fileinfo.id+"' data-tid='"+idx+"' style='margin:10px 0 10px 2px;' onclick='clearDownloadFile(this);'>Clear</button>";
	} else if (fileinfo.status === 1){
		data.msg = " has a shared a file with you:<br /><i>"+fileinfo.name+"</i><br /><button title='file size: "+fileinfo.size+" bytes' data-button-type='download' data-fid='"+fileinfo.id+"' data-tid='"+idx+"'>Requested</button>";
	} else if (fileinfo.status === 2){
		data.msg = " has a shared a file with you:<br /><i>"+fileinfo.name+"</i><br /><button title='file size: "+fileinfo.size+" bytes' data-button-type='download' data-fid='"+fileinfo.id+"' data-tid='"+idx+"' onclick='cancelFile(this);'>Downloading: "+parseInt(transferList[idx].completed*100)+"%</button>";
	} else if (fileinfo.status === 3){
		data.msg = " has a shared a file with you:<br /><i>"+fileinfo.name+"</i><br /><button disabled title='file size: "+fileinfo.size+" bytes' data-button-type='download' data-fid='"+fileinfo.id+"' data-tid='"+idx+"' >Completed</button>";
	} else if (fileinfo.status === 4){
		data.msg = " has a shared a file with you:<br /><i>"+fileinfo.name+"</i><br /><button title='file size: "+fileinfo.size+" bytes' data-button-type='download' data-fid='"+fileinfo.id+"' data-tid='"+idx+"' disabled >No longer available</button>";
	} else if (fileinfo.status === 5){
		data.msg = " has a shared a file with you:<br /><i>"+fileinfo.name+"</i><br /><button title='file size: "+fileinfo.size+" bytes' data-button-type='download' data-fid='"+fileinfo.id+"' data-tid='"+idx+"' disabled >Cancelled</button>";
	} else if (fileinfo.status === 6){
		return;
	}
	
	var director=false; // add back in later.
	if (session.directorList.indexOf(fileinfo.UUID)>=0){
		director=true;
	}
	if (label) {
		data.label = label;
		if (director) {
			data.label = "<b><i>" + data.label + "</i></b>";
		} else {
			data.label = "<b>" + data.label + "</b>";
		}
	} else if (director) {
		data.label = "<b><i>Director</i></b>";
	} else {
		data.label = "Someone";
	}
	data.type = "action";
	msgTransferList.push(data);
}

session.shareFile = function(ele, UUID=false, event=false){ // webcam stream is used to generated an SDP
	if (session.hostedFiles===false){return;} // disabled

	for (var i = 0; i < ele.files.length; i++){ // changing from a FileList to an Array. Arrays are easier to modify later on
		ele.files[i].id = session.generateStreamID(8); // can't be too short, else can be brute forced
		ele.files[i].state = 1;
		ele.files[i].restricted = UUID;
		session.hostedFiles.push(ele.files[i]);
	}
	log(session.hostedFiles);
	//for (var in rpcs and pcs .... goes here
	if (UUID===false){
		for (UUID in session.pcs){
			session.provideFileList(UUID);
		}
		for (UUID in session.rpcs){
			if (UUID in session.pcs){continue;}
			session.provideFileList(UUID);
		}
	} else {
		session.provideFileList(UUID);
	}
	pokeIframeAPI('file-share', true); 
	closeModal();
}
	

session.hostFile = function(ele, event){ // webcam stream is used to generated an SDP
	log("FILE TRANSFER SETUP");
	session.hostedFiles = [];
	for (var i = 0; i < ele.files.length; i++){ // changing from a FileList to an Array. Arrays are easier to modify later on
		ele.files[i].id = session.generateStreamID(8); // can't be too short, else can be brute forced
		ele.files[i].state = 1;
		session.hostedFiles.push(ele.files[i]);
	}
	log(session.hostedFiles);
	
	var container = document.createElement("div");
	container.id = "container_host";
	getById("gridlayout").appendChild(container);
	
	if (session.cover){
		container.style.setProperty('height', '100%', 'important');
	}
	
	if (session.roomid!==false){
		if ((session.roomid==="") && ((!(session.view)) || (session.view===""))){
			
		} else {
			log("ROOMID EANBLED");
			//log("Update Mixer Event on REsize SET");
			//window.addEventListener("resize", updateMixer);// TODO FIX
			//window.addEventListener("orientationchange", updateMixer);// TODO FIX
			getById("head3").classList.add('hidden');
			getById("head3a").classList.add('hidden');
			joinRoom(session.roomid);
		}
		
	} else {
		getById("head3").classList.remove('hidden');
		getById("head3a").classList.remove('hidden');
		getById("logoname").style.display = 'none';
	}
	getById("head1").className = 'hidden';
	
	updatePushId()
	
	getById("head1").className = 'hidden';
	getById("head2").className = 'hidden';

	if (!(session.cleanOutput)){
		getById("chatbutton").className="float";
		getById("hangupbutton").className="float";
		getById("controlButtons").style.display="flex";
		getById("helpbutton").style.display = "inherit";
		getById("reportbutton").style.display = "";
	} else {
		getById("controlButtons").style.display="none";
	}
	
	
	updateReshareLink();
	
	pokeIframeAPI('file-share', true); 
	pokeIframeAPI('started-fileshare'); // deprecated
	
	clearInterval(session.updateLocalStatsInterval);
	session.updateLocalStatsInterval = setInterval(function(){updateLocalStats();},3000);
	
	session.seeding=true;
	session.seedStream();
}

function updateReshareLink(){
	
	try{
		var m = getById("mainmenu");
		m.remove();
	} catch (e){}
	
	var added = "";
	if (session.defaultPassword===false){
		if (session.password!==false){
			added="&pw="+session.password;
		} else {
			added="&pw=false";
		}
	}
	
	var pie = "";
	if (session.customWSS){
		if (session.customWSS!==true){
			pie = "&pie="+session.customWSS;
		}
	}
	
	var shareLink = "https://"+location.host+location.pathname+"?view="+session.streamID+added+pie;
	if (document.getElementById("reshare")){
		document.getElementById("reshare").href = shareLink;
		document.getElementById("reshare").text = shareLink;
		document.getElementById("reshare").style.width = ((document.getElementById("reshare").text.length + 1)*1.15 * 8) + 'px';
	}
	pokeIframeAPI('share-link', shareLink); 
}

session.publishFile = function(ele, event){ // webcam stream is used to generated an SDP
	log("FILE STREAM SETUP");

	if (session.transcript){
		setTimeout(function(){setupClosedCaptions();},1000);
	}

	var files = [];
	for (var i = 0; i < ele.files.length; i++){ // changing from a FileList to an Array. Arrays are easier to modify later on
		files.push(ele.files[i]);
	}
	log(files);
	//var type = file.type;

	var fileURL = URL.createObjectURL(files[0]);
	var container = document.createElement("div");
	container.id = "container";
	
	// transform: scaleX(-1) translate(0px, -50%);
	
	if (session.cover){
		container.style.setProperty('height', '100%', 'important');
	}
	
	container.className = "vidcon";
	var v = createVideoElement();
	
	if (session.cleanOutput){
		container.style.height = "100%";
		v.style.maxWidth = "100%";
		v.style.boxShadow = "none";
	}
	
	if (session.streamID){
		v.dataset.sid = session.streamID;
	}
	
	getById("gridlayout").appendChild(container);
	
	
	if (session.roomid!==false){
		if ((session.roomid==="") && ((!(session.view)) || (session.view===""))){
			
		} else {
			log("ROOMID EANBLED");
			log("Update Mixer Event on REsize SET");
			//window.addEventListener("resize", updateMixer);// TODO FIX
			//window.addEventListener("orientationchange", updateMixer);// TODO FIX
			getById("head3").classList.add('hidden');
			getById("head3a").classList.add('hidden');
			joinRoom(session.roomid);
		}
		
	} else {
		getById("head3").classList.remove('hidden');
		getById("head3a").classList.remove('hidden');
		getById("logoname").style.display = 'none';
	}
	getById("head1").className = 'hidden';
	
	updatePushId()
	
	getById("head1").className = 'hidden';
	getById("head2").className = 'hidden';

	if (!(session.cleanOutput)){
		getById("chatbutton").className="float";
		getById("hangupbutton").className="float";
		getById("controlButtons").style.display="flex";
		getById("helpbutton").style.display = "inherit";
		getById("reportbutton").style.display = "";
	} else {
		getById("controlButtons").style.display="none";
	}
	
	var bigPlayButton = document.getElementById("bigPlayButton");
	if (bigPlayButton){
		bigPlayButton.parentNode.removeChild(bigPlayButton);
	}
	
	v.autoplay = false;
	v.controls = true;
	v.muted = false;
	
	if (files.length ==1){  // we don't want to do the complex logic if there is just one video
		v.loop = true;
	} else {
		v.loop = false;  // triggers the complex track/rtc logic.
	}
	
	v.setAttribute("playsinline","");
	v.src = fileURL;
	
	
	
	try {
		if (Firefox){
			session.streamSrc = v.mozCaptureStream();
		} else {
			session.streamSrc = v.captureStream(); // gaaaaaaaaaaaahhhhhhhh!
		}
		toggleMute(true);
	} catch (e){
		errorlog(e);
		return;
	}
	
	v.id = "videosource"; // could be set to UUID in the future
	v.playlist = files;
	v.addEventListener('ended',myHandler,false);  // only fires if the video doesn't loop.
	
	
	function myHandler(e) {
		log("MY HANDLER TRIGGERED");
		var vid = getById("videosource");
		log(vid.playlist);
		vid.playlist.unshift(vid.playlist.pop());
		vid.src = URL.createObjectURL(vid.playlist[0]);
		vid.onloadeddata = function(){
			
			if (Firefox){
				session.streamSrc = vid.mozCaptureStream();
			} else {
				session.streamSrc = vid.captureStream(); // gaaaaaaaaaaaahhhhhhhh!
			}
			
			toggleMute(true);
			session.streamSrc.getTracks().forEach(function(track){ // I'm making an exception I guess -- reversing the role?
				for (UUID in session.pcs){
					if ("realUUID" in session.pcs[UUID]){continue;}
					var senders = getSenders2(UUID);
					log(track);
					if (track.kind == "video"){
						try {
							if ((session.pcs[UUID].guest==true) && (session.roombitrate===0)) {
								log("room rate restriction detected. No videos will be published to other guests");
							} else if (session.pcs[UUID].allowVideo==true){  // allow
								 // for any connected peer, update the video they have if connected with a video already.
								var added=false;
								senders.forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
									if (added) {
										return;
									}
									if (sender.track && sender.track.kind == "video"){
										sender.replaceTrack(track);  // replace may not be supported by all browsers.  eek.
										added=true;
									}
									
								});
								if (added==false){
									session.pcs[UUID].addTrack(track, session.streamSrc);
									setTimeout(function(uuid){session.optimizeBitrate(uuid);},session.rampUpTime, UUID); // 3 seconds lets us ramp up the quality a bit and figure out the total bandwidth quicker
								}
							}
						} catch (e){
							errorlog(e);
						}
						
					} else {
						session.pcs[UUID].addTrack(track, session.streamSrc);
					}
				}
			});
			session.refreshScale();
		}
		
		session.applySoloChat(); // mute streams that should be muted if a director
		session.applyIsolatedChat();
			
		vid.load();
		vid.play().then(_ => {
			log("playing 2");
		}).catch(warnlog);
	}
	
	// no preview doesn't work, so just stop it from doing its thing.
	
	v.className = "tile clean fileshare";
	session.videoElement = v;
	container.appendChild(v);
	changeAudioOutputDevice(v);
	
	session.mirrorExclude=true;
	
	if (session.director){
	} else if (session.scene!==false){
		
	} else if (session.roomid!==false){
		if (session.roomid===""){
			if (!(session.view) || (session.view==="")){
				if (session.fullscreen){
					session.windowed = false;
				} else {
					v.className = "myVideo clean fileshare";
					session.windowed = true;
				} 
				getById("mutespeakerbutton").classList.add("hidden");
				container.style.width="100%";
				container.style.alignItems = "center";
				container.backgroundColor = "#666";
				play();
			} else {
				session.windowed = false;
				play();
			}
		} else {
			//session.cbr=0; // we're just going to override it
			if (session.stereo==5){
				session.stereo=3;
			}
			session.windowed = false;
		}
		applyMirror(session.mirrorExclude);
	} else {
		if (session.fullscreen){
			session.windowed = false;
		} else {
			v.className = "myVideo clean fileshare";
			session.windowed = true;
		}
		getById("mutespeakerbutton").classList.add("hidden");
		container.style.width="100%";
		container.style.alignItems = "center";
		container.backgroundColor = "#666";
		applyMirror(session.mirrorExclude);
	}
	
	
	v.addEventListener('click', function(e){
		log("click");
		try {
			if ((e.ctrlKey)||(e.metaKey)){
				e.preventDefault();
				
				var [menu, innerMenu] = statsMenuCreator();
				
				menu.interval = setInterval(printMyStats,3000, innerMenu);
				
				printMyStats(innerMenu);
				e.stopPropagation();
				return false;
			}
		} catch(e){errorlog(e);}
	});
	
	v.touchTimeOut = null;
	v.touchLastTap = 0;
	v.touchCount = 0;
	v.addEventListener('touchend', function(event) {
		if (session.disableMouseEvents){return;}
		log("touched");
		
		document.ontouchup = null;
		document.onmouseup = null;
		document.onmousemove = null;
		document.ontouchmove = null;
		
		var currentTime = new Date().getTime();
		var tapLength = currentTime - v.touchLastTap;
		clearTimeout(v.touchTimeOut);
		if (tapLength < 500 && tapLength > 0) {
			///
			log("double touched");
			v.touchCount+=1;
			event.preventDefault();
			if (v.touchCount<5){
				v.touchLastTap = currentTime;
				return false;
			}
			v.touchLastTap = 0;
			v.touchCount=0;
			
			var [menu, innerMenu] = statsMenuCreator();
			
			menu.interval = setInterval(printMyStats,3000, innerMenu);
			
			printMyStats(innerMenu);
			event.stopPropagation();
			return false;
			//////
		} else {
			v.touchCount=1;
			v.touchTimeOut = setTimeout(function(vv) {
				clearTimeout(vv.touchTimeOut);
				vv.touchLastTap = 0;
				vv.touchCount=0;
			}, 5000, v);
			v.touchLastTap = currentTime;
		}
		
	});
		
	
	
	updateReshareLink();
	pokeIframeAPI('started-fileshare'); // depreciated
	pokeIframeAPI('file-share', true); 
	
	clearInterval(session.updateLocalStatsInterval);
	session.updateLocalStatsInterval = setInterval(function(){updateLocalStats();},3000);
	
	session.seeding=true;
	
	if (session.videoMutedFlag){
		session.videoMuted = true;
		toggleVideoMute(true);
	}
	
	session.seedStream();
}; // publishFile


function tryAgain(event) { // audio or video agnostic track reconnect ------------not actually in use,.  maybe out of date
	log("TRY AGAIN TRIGGERED");
	warnlog(event);
}


function enterPressedClick(event, ele) {
	if (event.keyCode === 13) {
		event.preventDefault();
		ele.click();
	}
}

function enterPressed(event, callback) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		event.preventDefault();
		callback();
	}
}


function dragElement(elmnt) {
	if (session.disableMouseEvents){return;}
	var millis = Date.now();
	try {
		var input = getById("zoomSlider");
		var stream = elmnt.srcObject;
		try {
			var track0 = stream.getVideoTracks();
		} catch (e) {
			return;
		}

		if (!(track0.length)) {
			return;
		}

		track0 = track0[0];
		if (track0.getCapabilities) {
			var capabilities = track0.getCapabilities();
			var settings = track0.getSettings();

			// Check whether zoom is supported or not. 
			if (!('zoom' in capabilities)) {
				log('Zoom is not supported by ' + track0.label);
				return;
			}

			// Map zoom to a slider element.
			input.min = capabilities.zoom.min;
			input.max = capabilities.zoom.max;
			input.step = capabilities.zoom.step;
			input.value = settings.zoom;
		}
	} catch (e) {
		errorlog(e);
		return;
	}

	log("drag on");
	elmnt.onmousedown = dragMouseDown;
	elmnt.onclick = onvideoclick;
	elmnt.ontouchstart = dragMouseDown;

	var pos0 = 1;

	function onvideoclick(e) {
		log(e);
		log("onvideoclick");
		e = e || window.event;
		e.preventDefault();
		return false;
	}

	function dragMouseDown(e) {
		log(e);
		log("dragMouseDown");

		//closeDragElement(null);

		//elmnt.controls = session.showControls || false;
		e = e || window.event;
		e.preventDefault();

		pos0 = input.value;
		if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
			var touch = e.touches[0] || e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			pos3 = touch.clientX;
			pos4 = touch.clientY;
		} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
			pos3 = e.clientX;
			pos4 = e.clientY;
		}
		document.ontouchup = closeDragElement;
		document.onmouseup = closeDragElement;

		document.ontouchmove = elementDrag;
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:

		if (Date.now() - millis < 100) {
			return;
		}
		millis = Date.now();

		if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
			var touch = e.touches[0] || e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			pos1 = touch.clientX;
			pos2 = touch.clientY;
		} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
			pos1 = e.clientX;
			pos2 = e.clientY;
		}

		var zoom = parseFloat((pos4 - pos2) * 2 / elmnt.offsetHeight);

		if (zoom > 1) {
			zoom = 1.0;
		} else if (zoom < -1) {
			zoom = -1.0;
		}
		input.value = zoom * (input.max - input.min) + input.min;
		if (input.value != pos0) {
			
			updateCameraConstraints("zoom", input.value, false, false);
			
		}
	}

	function closeDragElement(e) {
		log(e);
		log("closeDragElement");
		//if (e!==null){
		//	elmnt.controls=true;
		//}
		/* stop moving when mouse button is released:*/
		document.ontouchup = null;
		document.onmouseup = null;
		document.onmousemove = null;
		document.ontouchmove = null;
	}
}

function previewIframe(iframeSrc) { // this is pretty important if you want to avoid camera permission popup problems.  You can also call it automatically via: <body onload=>loadIframe();"> , but don't call it before the page loads.

	var iframe = document.createElement("iframe");
	iframe.allow = "autoplay;camera;microphone;fullscreen;picture-in-picture;display-capture;midi;";
	iframe.style.width = "100%";
	iframe.style.height = "100%";
	iframe.style.border = "10px dashed rgb(64 65 62)";

	iframeSrc = parseURL4Iframe(iframeSrc);
	
	/* if (typeof iframeSrc == "object"){ // special handler.
		iframeSrc = iframeSrc.parsedSrc;
	}  */

	iframe.src = iframeSrc;
	getById("previewIframe").innerHTML = "";
	getById("previewIframe").style.width = "640px";
	getById("previewIframe").style.height = "360px";
	getById("previewIframe").style.margin = "auto";
	getById("previewIframe").appendChild(iframe);
}

function loadIframe(iframesrc,  UUID) { // this is pretty important if you want to avoid camera permission popup problems.  You can also call it automatically via: <body onload=>loadIframe();"> , but don't call it before the page loads.
	/* if (document.getElementById("mainmenu")) {
		var m = getById("mainmenu");
		m.remove();
	} */
	var iframeID = "iframe_"+UUID;

	var iframe = document.createElement("iframe");
	iframe.allow = "autoplay;camera;microphone;fullscreen;picture-in-picture;display-capture;midi;";
	iframe.style.width = "100%";
	iframe.style.height = "100%";
	iframe.style.border = "10px dashed rgb(64 65 62)";
	iframe.id = iframeID;
	iframe.dataset.UUID = UUID;
	iframe.loadedYoutubeListen = false;
	
	if (session.director){
		//
	} else if (session.scene!==false){
		if (session.view){ // specific video to be played
			iframe.style.display="block";
		} else if (session.scene==="0"){
			iframe.style.display="block";
		} else {  // group scene I guess; needs to be added manually
			iframe.style.display="none";
		}
	} else if (session.roomid!==false){
		//
	} else {
		iframe.style.display="block";
	}
	if (iframesrc == "") {
		iframesrc = "./";
		iframe.style.border = "0";
	}
	
	// trusted domains
	if (iframesrc.startsWith("https://vdo.ninja/")){
		iframe.style.border = "0";
	} else if (iframesrc.startsWith("https://obs.ninja/")){
		iframe.style.border = "0";
	} else if (iframesrc.startsWith("https://vmix.ninja/")){
		iframe.style.border = "0";
	} else if (iframesrc.startsWith("https://backup.vdo.ninja/")){
		iframe.style.border = "0";
	} else if (iframesrc.startsWith("https://backup.obs.ninja/")){
		iframe.style.border = "0";
	} else if (iframesrc.startsWith("https://www.youtube.com/")){
		iframe.style.border = "0";
		setTimeout(function(iframe_id){YoutubeListen(iframe_id);}, 1000, iframeID); // create stats feedback for the director; syncing.
	} else if (iframesrc.startsWith("https://player.twitch.tv/")){
		iframe.style.border = "0";
	} else if (iframesrc.startsWith("https://twitch.tv/")){
		iframe.style.border = "0";
	} else if (iframesrc.startsWith("https://www.twitch.tv/")){
		iframe.style.border = "0";
	} else if (iframesrc.startsWith("https://vimeo.com/")){
		iframe.style.border = "0";
	} else if (iframesrc.startsWith("https://player.vimeo.com/")){	
		iframe.style.border = "0";
	} else if (iframesrc.startsWith("https://meshcast.io/")){
		//iframesrc = iframesrc.replace("//meshcast.io/", "//meshcast.vdo.ninja/");
		iframe.style.border = "0";
		// iframe.dataset.meshcast = true; // TODO: this was a bit of a fail
		if (document.domain==="backup.vdo.ninja"){
			document.domain = 'vdo.ninja';
		} else if (document.domain==="isolated.vdo.ninja"){
			document.domain = 'vdo.ninja';
		}
	} else if (iframesrc.startsWith("https://s10.fun/")){
		iframe.style.border = "0";
	} else if (iframesrc.startsWith("https://play.rozy.tv/")){
		iframe.style.border = "0";
	}
	
	iframe.src = iframesrc;
	
	pokeIframeAPI('iframe-loaded', iframesrc); 
	return iframe
}

function dropDownButtonAction(ele) {
	var ele = getById("dropButton");
	if (ele) {
		ele.parentNode.removeChild(ele);
		//getById('container-5').classList.remove('hidden');
		//getById('container-8').classList.remove('hidden');
		//getById('container-6').classList.remove('hidden');
		document.querySelectorAll("div.column.card").forEach(child=>{
			child.classList.remove('hidden');
		});
	}
}

function updateConstraintSliders() {
	log("updateConstraintSliders");
	if (session.roomid !== false && session.roomid !== "" && session.director !== true && session.forceMediaSettings == false) {
		if (session.controlRoomBitrate !== false) {
			listCameraSettings();
		}
		if (session.effects!==false){
			//if ((iOS) || (iPad)){
			//} else {
			getById("effectsDiv3").style.display = "block";
			getById("effectSelector3").value = session.effects || "0";
			//}
		}
	} else {
		listAudioSettings();
		listCameraSettings();
		
		//if ((iOS) || (iPad)){
	//	} else {
			if (session.effects!==false){
				getById("effectsDiv3").style.display = "block";
				try{
					getById("effectSelector3").value = session.effects || "0";
				} catch(E){}
			}
		//}	
	}
	//checkIfPIP();  //  this doesn't actually work on iOS still, so whatever.
}

function checkIfPIP() {
	try {
		if (session.videoElement && ((session.videoElement.webkitSupportsPresentationMode && typeof session.videoElement.webkitSetPresentationMode === "function") || (document.pictureInPictureEnabled || !videoElement.disablePictureInPicture))) {
			// Toggle PiP when the user clicks the button.

			getById("pIpStartButton").addEventListener("click", function(event) {
				//	if ( (document.pictureInPictureEnabled || !videoElement.disablePictureInPicture)){
				//session.videoElement.requestPictureInPicture();
				//	} else {
				session.videoElement.webkitSetPresentationMode(session.videoElement.webkitPresentationMode === "picture-in-picture" ? "inline" : "picture-in-picture");
				//	}
			});
			getById("pIpStartButton").style.display = "inline-block";
		}
	} catch (e) {
		errorlog(e);
	}
}

function togglePictureInPicture(videoElement) {
  if (document.pictureInPictureElement) {
	  if (document.pictureInPictureElement.id == videoElement.id){
		  document.exitPictureInPicture();
		  pokeIframeAPI('picture-in-picture', false); 
	  } else {
		  document.exitPictureInPicture();
		  pokeIframeAPI('picture-in-picture', false); 
		  videoElement.requestPictureInPicture();
		  pokeIframeAPI('picture-in-picture', true); 
	  }
  } else if (document.pictureInPictureEnabled) {
      videoElement.requestPictureInPicture();
	  pokeIframeAPI('picture-in-picture', true); 
  }
  
}

function listAudioSettingsPrep() {
	try {
		var tracks = session.streamSrc.getAudioTracks();
		if (!tracks.length) {
			warnlog("session.streamSrc contains no audio tracks");
			//return;
		}
	} catch (e) {
		warnlog(e);
		return;
	}

	var data = [];

	for (var i = 0; i < tracks.length; i += 1) {
		track0 = tracks[i];
		var trackSet = {};

		if (track0.getCapabilities) {
			trackSet.audioConstraints = track0.getCapabilities();
		} else if (Firefox){ // let's pretend like Firefox doesn't actually suck
			trackSet.audioConstraints = {
				"autoGainControl": [
					true,
					false
				],
		//		"channelCount": {
		//			"max": 2,
		//			"min": 1
		//		},
		//		"deviceId": "default",
				"echoCancellation": [
					true,
					false
				],
		//		"groupId": "a3cbdec54a9b6ed473fd950415626f7e76f9d1b90f8c768faab572175a355a17",
		//		"latency": {
		//			"max": 0.01,
		//			"min": 0.01
		//		},
				"noiseSuppression": [
					true,
					false
				],
			//	"sampleRate": {
			//		"max": 48000,
			//		"min": 48000
			//	},
			//	"sampleSize": {
			//		"max": 16,
			//		"min": 16
			///	}
			};
		}

		if (track0.getSettings) {
			trackSet.currentAudioConstraints = track0.getSettings();
		}

		trackSet.trackLabel = "unknown or none";
		if (track0.label) {
			trackSet.trackLabel = track0.label;
		}
		if (track0.id) {
			trackSet.deviceID = track0.id;
		}
		if (i == 0) {
			trackSet.equalizer = session.equalizer; // only supporting the first track at the moment.
			
			for (var waid in session.webAudios) { // TODO:  EXCLUDE CURRENT TRACK IF ALREADY EXISTS ... if (track.id === wa.id){..
				try{
					trackSet.lowEQ = session.webAudios[waid].lowEQ.gain.value;
					trackSet.midEQ = session.webAudios[waid].midEQ.gain.value;
					trackSet.highEQ = session.webAudios[waid].highEQ.gain.value;
				} catch(e){}
				break;
			}
			
		} else {
			trackSet.equalizer = false;
		}

		if (i == 0) {
			trackSet.lowcut = session.lowcut; // only supporting the first track at the moment.
			if (session.lowcut){
				for (var waid in session.webAudios) { // TODO:  EXCLUDE CURRENT TRACK IF ALREADY EXISTS ... if (track.id === wa.id){..
					try{
						trackSet.lowcut = session.webAudios[waid].lowcut1.frequency.value;
					} catch(e){}
					break;
				}
			}
		} else {
			trackSet.lowcut = false;
		}
		
		trackSet.subGain = false;
		for (var waid in session.webAudios) { // TODO:  EXCLUDE CURRENT TRACK IF ALREADY EXISTS ... if (track.id === wa.id){..
			try{
				if (session.webAudios[waid].subGainNodes && (track0.id in session.webAudios[waid].subGainNodes)){
					trackSet.subGain = session.webAudios[waid].subGainNodes[track0.id].gain.value;
				}
				break;
			} catch(e){}
		}

		data.push(trackSet);
	}
	pokeIframeAPI('listing-audio-settings', data); 
	return data;
}

function listVideoSettingsPrep() {
	try {
		var track0 = session.streamSrc.getVideoTracks();
		if (track0.length) {
			track0 = track0[0];
			if (track0.getCapabilities) {
				session.cameraConstraints = track0.getCapabilities();
			}
			log(session.cameraConstraints);
		}
	} catch (e) {
		warnlog(e);
		return;
	}

	try {
		if (track0.getSettings) {
			session.currentCameraConstraints = track0.getSettings();
		}
	} catch (e) {
		warnlog(e);
		return;
	}
	var msg = {};
	msg.trackLabel = "unknown or none";
	if (track0.label) {
		msg.trackLabel = track0.label;
	}
	msg.currentCameraConstraints = session.currentCameraConstraints;
	msg.cameraConstraints = session.cameraConstraints;
	
	pokeIframeAPI('listing-video-settings', msg); 
	return msg;
}


var Final_transcript = "";
var Interim_transcript = "";
var Recognition = null;

if ("webkitSpeechRecognition" in window) {
	var SpeechRecognition = webkitSpeechRecognition;
} else if ("SpeechRecognition" in window) {
	var SpeechRecognition = window.SpeechRecognition;
} else {
	var SpeechRecognition = false;
}

var TranscriptionCounter = 0;
var retriesRecognition = 0;
var activeRecognition=false;
var timeoutRecognition = null;
function setupClosedCaptions() {
	
	if (activeRecognition){return;}
	activeRecognition=true;
	
	log("CLOSED CAPTIONING SETUP");
	
	if (SpeechRecognition) {
		Recognition = new SpeechRecognition();

		Recognition.lang = session.transcript;

		Recognition.continuous = true;
		Recognition.interimResults = true;
		Recognition.maxAlternatives = 0;

		Recognition.onstart = function() {
			log("started transcription: "+Date.now());
			clearTimeout(timeoutRecognition);
			timeoutRecognition = setTimeout(function(){
				retriesRecognition=0;
			},10000);
		};
		Recognition.onerror = function(event) {
			if (retriesRecognition<=3){
				console.error(event);
			}
			errorlog(event);
		};
		Recognition.onend = function(e) {
			warnlog(e);
			log("Stopped transcription "+Date.now());
			clearTimeout(timeoutRecognition);
			timeoutRecognition = setTimeout(function() {
				Recognition.start();
			}, parseInt(500*retriesRecognition*retriesRecognition)); // restart it if it fails.
			retriesRecognition+=1;
			if (retriesRecognition==3){
				console.error("Captioning service is having a problem connecting");
			}
		};

		Recognition.onresult = function(event) {

			Interim_transcript = '';
			if (typeof(event.results) == 'undefined') {
				log(event);
				return;
			}
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					Final_transcript += event.results[i][0].transcript;
				} else {
					Interim_transcript += event.results[i][0].transcript;
				}
			}

			if (Final_transcript.length > 0) {
				log("FINAL:" + Final_transcript);
				try {
					var data = {};
					data.isFinal = true;
					data.transcript = Final_transcript;
					data.counter = TranscriptionCounter;
					session.sendMessage(data);
					TranscriptionCounter += 1;
					Final_transcript = "";
					Interim_transcript = "";
					pokeIframeAPI('transcription-text', Final_transcript); 
				} catch (e) {
					errorlog(e);
				}

			} else {
				try {
					var data = {};
					data.isFinal = false;
					data.transcript = Interim_transcript;
					data.counter = TranscriptionCounter;
					session.sendMessage(data);
				} catch (e) {
					errorlog(e);
					Interim_transcript = "";
				}
			}
		};

		Recognition.start();
	}
}


async function requestVideoRecord(ele) {
	var UUID = ele.dataset.UUID
	if (ele.classList.contains("pressed")) {
		var msg = {};
		msg.requestVideoRecord = false;
		msg.UUID = UUID;
		session.sendRequest(msg, msg.UUID);
		ele.classList.remove("pressed");
	} else {
		var msg = {};
		msg.requestVideoRecord = true;
		msg.UUID = UUID;
		window.focus();
		var bitrate = await promptAlt(miscTranslations["what-bitrate"], false, false, 6000);
		if (bitrate) {
			msg.value = bitrate;
			session.sendRequest(msg, msg.UUID);
			ele.classList.add("pressed");
		}
	}
	pokeIframeAPI('request-video-record', msg.requestVideoRecord, UUID); 
}

function changeOrderDirector(value) {
	if (session.order==false){
		session.order=0;
	}
	session.order += parseInt(value) || 0;
	
	var elements = document.querySelectorAll('[data-action-type="order-value-director"]');
	//log(elements);
	if (elements[0]){
		elements[0].innerText = parseInt(session.order) || 0;
	}
	
	var data = {};
	data = {};
	data.order = session.order;
	session.sendPeers(data);
	pokeIframeAPI('director-order', data.order); 
}



function changeOrder(value, UUID) {
	var msg = {};
	msg.changeOrder = value;
	msg.UUID = UUID;
	session.sendRequest(msg, msg.UUID);
	pokeIframeAPI('change-order', value, UUID); 
}

function requestVideoHack(keyname, value, UUID, ctrl=false) {
	var msg = {};
	msg.requestVideoHack = true;
	msg.keyname = keyname;
	msg.value = value;
	msg.UUID = UUID;
	msg.ctrl = ctrl;
	session.sendRequest(msg, msg.UUID);
	pokeIframeAPI('request-video-setting', {value:value, keyname:keyname, ctrl:ctrl}, UUID); 
}

function requestAudioHack(keyname, value, UUID, deviceID = "default") { // updateCameraConstraints
	var msg = {};
	msg.requestAudioHack = true;
	msg.keyname = keyname;
	msg.value = value;
	msg.UUID = UUID;
	msg.deviceID = deviceID;
	session.sendRequest(msg, msg.UUID);
	pokeIframeAPI('request-audio-setting', {value:value, keyname:keyname, deviceID:deviceID}, UUID); 
}

function requestChangeEQ(keyname, value, UUID, track = 0) { // updateCameraConstraints
	var msg = {};
	msg.requestChangeEQ = true;
	msg.keyname = keyname;
	msg.value = value;
	msg.UUID = UUID;
	msg.track = track; // pointless atm
	session.sendRequest(msg, msg.UUID);
	pokeIframeAPI('request-change-eq', {value:value, keyname:keyname, track:track}, UUID); 
}

function requestChangeSubGain(value, UUID, deviceID) { // updateCameraConstraints
	var msg = {};
	msg.requestChangeSubGain = true;
	msg.value = value;
	msg.UUID = UUID;
	msg.deviceID = deviceID; // pointless atm
	log(msg);
	session.sendRequest(msg, msg.UUID);
	pokeIframeAPI('request-sub-gain', {value:value, deviceID:deviceID}, UUID); 
}

function requestChangeLowcut(value, UUID, track = 0) { // updateCameraConstraints
	var msg = {};
	msg.requestChangeLowcut = true;
	msg.value = value;
	msg.UUID = UUID;
	msg.track = track; // pointless atm
	session.sendRequest(msg, msg.UUID);
	pokeIframeAPI('request-low-cut', value, UUID); 
}

function toggleSystemPip(vid) {
  if (vid.webkitSupportsPresentationMode && (typeof vid.webkitSetPresentationMode === "function")) {
	vid.webkitSetPresentationMode(
		vid.webkitPresentationMode === "picture-in-picture"
			? "inline"
			: "picture-in-picture"
	);
  } else {
		if (document.pictureInPictureElemen) {
			document.exitPictureInPicture();
			vid.requestPictureInPicture();
		} else {
			vid.requestPictureInPicture();
		}
  }
}

function updateDirectorsAudio(dataN, UUID) {
	var audioEle = document.createElement("div");
	getById("advanced_audio_director_" + UUID).innerHTML = "";
	getById("advanced_audio_director_" + UUID).className = "";

	//log(dataN);
	if (!dataN.length) {
		return;
	}
	
	for (var n = 0; n < dataN.length; n += 1) {
		var data = dataN[n];

		if (dataN.length==1) {
			if (data.trackLabel) {
				var label = document.createElement("span");
				label.innerText = data.trackLabel;
				label.style.marginBottom = "10px";
				label.style.display = "block";
				label.id = "remoteAudioLabel_"+UUID;
				audioEle.appendChild(label);
			}
		} 
		//if (n !== 0) {
			//var label = document.createElement("span");
			//label.innerText = "Coming Soon";
			//audioEle.appendChild(label);
		//	continue; // remove to more than one audio device (assuming other fixes are applied)
		//}


		if (data.lowcut!==false && n==0) {
			var label = document.createElement("label");
			var i = "Low_Cut";
			label.id = "label_" + i;
			label.htmlFor = "constraints_" + i;
			
			var input = document.createElement("input");
			input.min = 50;
			input.max = 150;
			input.value = data.lowcut;
			
			input.title = "Previously was: "+input.value;

			input.type = "range";
			input.dataset.keyname = i;
			input.dataset.labelname =  "low cut:";
			label.innerText = input.dataset.labelname;
			
			
			var manualInput = document.createElement("input");
			manualInput.type = "number";
			manualInput.dataset.keyname = i;
			manualInput.value = parseFloat(input.value);
			manualInput.className = "manualInput";
			
			
			input.dataset.track = n;
			input.dataset.UUID = UUID;
			input.id = "constraints_" + i;
			input.style = "display:block; width:100%;";
			input.name = "constraints_" + i;
			input.style.margin = "10px 0";
			
			manualInput.onchange = function(e) {
				getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				requestChangeLowcut(parseInt(e.target.value), e.target.dataset.UUID, parseInt(e.target.dataset.track));
			};

			input.onchange = function(e) {
				//e.target.title = e.target.value;
				getById("label_" + e.target.dataset.keyname).innerText = e.target.dataset.labelname + " " + e.target.value;
				requestChangeLowcut(parseInt(e.target.value), e.target.dataset.UUID, parseInt(e.target.dataset.track));
			};

			audioEle.appendChild(label);
			audioEle.appendChild(manualInput);
			audioEle.appendChild(input);
		}

		if (data.equalizer && n==0) {
			var label = document.createElement("label");
			var i = "Low_EQ";
			//label.id = "label_" + i;
			label.htmlFor = "constraints_" + i;
			

			var input = document.createElement("input");
			input.min = -50;
			input.max = 50;
			input.value = data.lowEQ;
			input.title = "Previously was: "+input.value;
			input.type = "range";
			input.dataset.keyname = i;
			input.dataset.labelname = "low EQ:"
			
			label.innerText = input.dataset.labelname;

			var manualInput = document.createElement("input");
			manualInput.type = "number";
			manualInput.dataset.keyname = i;
			manualInput.value = parseFloat(input.value);
			manualInput.className = "manualInput";
			manualInput.id = "label_" + i;
			
			input.dataset.track = n;
			input.dataset.UUID = UUID;
			input.id = "constraints_" + i;
			input.style = "display:block; width:100%;";
			input.name = "constraints_" + i;
			input.style.margin = "10px 0";
			
			manualInput.onchange = function(e) {
				getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				requestChangeEQ("low", parseInt(e.target.value), e.target.dataset.UUID, parseInt(e.target.dataset.track));
			};

			input.onchange = function(e) {
				getById("label_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				requestChangeEQ("low", parseInt(e.target.value), e.target.dataset.UUID, parseInt(e.target.dataset.track));
			};

			audioEle.appendChild(label);
			audioEle.appendChild(manualInput);
			audioEle.appendChild(input);

			var label = document.createElement("label");
			var i = "Mid_EQ";
			//label.id = "label_" + i;
			label.htmlFor = "constraints_" + i;
			
			

			var input = document.createElement("input");
			input.min = -50;
			input.max = 50;
			input.value = data.midEQ;
			input.title = "Previously was: "+input.value;
			input.type = "range";
			input.dataset.keyname = i;
			input.dataset.labelname = "mid EQ:";
			
			label.innerText = input.dataset.labelname;
			
			var manualInput = document.createElement("input");
			manualInput.type = "number";
			manualInput.dataset.keyname = i;
			manualInput.value = parseFloat(input.value);
			manualInput.className = "manualInput";
			manualInput.id = "label_" + i;
			
			input.dataset.track = n;
			input.dataset.UUID = UUID;
			input.id = "constraints_" + i;
			input.style = "display:block; width:100%;";
			input.name = "constraints_" + i;
			input.style.margin = "10px 0";

			manualInput.onchange = function(e) {
				getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				requestChangeEQ("mid", parseInt(e.target.value), e.target.dataset.UUID, parseInt(e.target.dataset.track));
			};

			input.onchange = function(e) {
				getById("label_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				requestChangeEQ("mid", parseInt(e.target.value), e.target.dataset.UUID, parseInt(e.target.dataset.track));
			};

			audioEle.appendChild(label);
			audioEle.appendChild(manualInput);
			audioEle.appendChild(input);


			var label = document.createElement("label");
			var i = "High_EQ";
			//label.id = "label_" + i;
			label.htmlFor = "constraints_" + i;
			

			var input = document.createElement("input");
			input.min = -50;
			input.max = 50;
			input.value = data.highEQ;
			input.title = "Previously was: "+input.value;
			input.type = "range";
			input.dataset.keyname = i;
			input.dataset.labelname = "high EQ:";
			
			label.innerText = input.dataset.labelname;
			
			var manualInput = document.createElement("input");
			manualInput.type = "number";
			manualInput.dataset.keyname = i;
			manualInput.value = parseFloat(input.value);
			manualInput.className = "manualInput";
			manualInput.id = "label_" + i;
			
			input.dataset.track = n;
			input.dataset.UUID = UUID;
			input.id = "constraints_" + i;
			input.style = "display:block; width:100%;";
			input.name = "constraints_" + i;
			input.style.margin = "10px 0";
			
			manualInput.onchange = function(e) {
				getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				requestChangeEQ("high", parseInt(e.target.value), e.target.dataset.UUID, parseInt(e.target.dataset.track));
			};

			input.onchange = function(e) {
				getById("label_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				requestChangeEQ("high", parseInt(e.target.value), e.target.dataset.UUID, parseInt(e.target.dataset.track));
			};

			audioEle.appendChild(label);
			audioEle.appendChild(manualInput);
			audioEle.appendChild(input);
		}
		
		
		if (dataN.length>1){ 
			if (data.trackLabel) {
				var label = document.createElement("span");
				label.innerText = data.trackLabel;
				label.style.margin = "20px 0 10px 0";
				label.style.display = "block";
				label.id = "remoteAudioLabel_"+UUID+"_"+n;
				audioEle.appendChild(label);
			}
		}
		
		
		for (var i in data.audioConstraints) {
			try {
				log(i);
				log(data.audioConstraints[i]);
				if ((typeof data.audioConstraints[i] === 'object') && (data.audioConstraints[i] !== null) && ("max" in data.audioConstraints[i]) && ("min" in data.audioConstraints[i])) {
					if (i === "aspectRatio") {
						continue;
					} else if (i === "width") {
						continue;
					} else if (i === "height") {
						continue;
					} else if (i === "frameRate") {
						continue;
					} else if (i === "latency") {
					//	continue;
					} else if (i === "sampleRate") {
						continue;
					} else if (i === "channelCount") {
						continue;
					}
					
					if (!("deviceID" in data.audioConstraints[i])){continue;} // not going to support older versions.

					var label = document.createElement("label");
					//label.id = "label_" + i + "_"+n;
					label.htmlFor = "constraints_" + i + "_"+n;
					label.innerText = i + ":";

					var input = document.createElement("input");
					input.min = data.audioConstraints[i].min;
					input.max = data.audioConstraints[i].max;
					

					if (parseFloat(input.min) == parseFloat(input.max)) {
						continue;
					}
					
					var manualInput = document.createElement("input");
					manualInput.type = "number";
					manualInput.dataset.keyname = i;
					manualInput.value = parseFloat(input.value);
					manualInput.className = "manualInput";
					manualInput.id = "label_" + i + "_"+n;

					if (i in data.currentAudioConstraints) {
						input.value = data.currentAudioConstraints[i];
						manualInput.value = parseFloat(input.value);
						//label.innerText = i + ": " + data.currentAudioConstraints[i];
						label.title = "Previously was:  " + data.currentAudioConstraints[i];
						input.title = "Previously was:  " + data.currentAudioConstraints[i];
					} else {
						label.innerText = i;
					}
					
					if ((i === "height") || (i === "width")){
						input.title = "Hold CTRL (or cmd) to lock width and height together when changing them";
						input.min = 16;
					}
					
					if ("step" in data.audioConstraints[i]) {
						input.step = data.audioConstraints[i].step;
						manualInput.step = data.audioConstraints[i].step;
					}
					input.type = "range";
					input.dataset.keyname = i;
					input.dataset.track = n;
					input.dataset.deviceID = data.deviceID;
					input.dataset.UUID = UUID;
					input.id = "constraints_" + i + "_"+n;
					input.style = "display:block; width:100%;";
					input.name = "constraints_" + i + "_"+n;

					manualInput.onchange = function(e) {
						getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
						requestAudioHack(e.target.dataset.keyname, e.target.value, e.target.dataset.UUID, e.target.dataset.deviceID);
					};

					input.onchange = function(e) {
						//e.target.title = e.target.value;
						getById("label_" + e.target.dataset.keyname+"_"+e.target.dataset.track ).value = parseFloat(e.target.value);
						//updateAudioConstraints(e.target.dataset.keyname, e.target.value);
						requestAudioHack(e.target.dataset.keyname, e.target.value, e.target.dataset.UUID, e.target.dataset.deviceID);
					};

					audioEle.appendChild(label);
					audioEle.appendChild(manualInput);
					audioEle.appendChild(input);
				} else if ((typeof data.audioConstraints[i] === 'object') && (data.audioConstraints[i] !== null)) {
					if (i == "resizeMode") {
						continue;
					}

					var div = document.createElement("div");
					var label = document.createElement("label");
					label.id = "label_" + i + "_"+n;
					label.htmlFor = "constraints_" + i + "_"+n;
					label.innerText = i + ":";
					label.style = "display:inline-block; padding:0;margin: 5px 0px 9px;";
					var input = document.createElement("select");
					var c = document.createElement("option");
					

					if (data.audioConstraints[i].length > 1) {
						for (var opts in data.audioConstraints[i]) {
							log(opts);
							var opt = new Option(data.audioConstraints[i][opts], data.audioConstraints[i][opts]);
							input.options.add(opt);
							if (i in data.currentAudioConstraints) {
								if (data.audioConstraints[i][opts] == data.currentAudioConstraints[i]) {
									opt.selected = "true";
								}
							}
						}
					} else if (i.toLowerCase == "torch") {
						var opt = new Option("Off", false);
						input.options.add(opt);
						opt = new Option("On", true);
						input.options.add(opt);
					} else {
						continue;
					}

					input.id = "constraints_" + i + "_"+n;
					input.className = "constraintCameraInput";
					input.name = "constraints_" + i + "_"+n;
					input.style = "display:inline; padding:2px; margin:0 10px;";
					input.dataset.keyname = i;
					input.dataset.track = n;
					input.dataset.deviceID = data.deviceID;
					input.dataset.UUID = UUID;
					input.onchange = function(e) {
						//getById("label_"+e.target.dataset.keyname).innerText =e.target.dataset.keyname+": "+e.target.value;
						//updateAudioConstraints(e.target.dataset.keyname, e.target.value);
						requestAudioHack(e.target.dataset.keyname, e.target.value, e.target.dataset.UUID, e.target.dataset.deviceID);
						log(e.target.dataset.keyname, e.target.value);
					};
					audioEle.appendChild(div);
					div.appendChild(label);
					div.appendChild(input);
				} else if (typeof data.audioConstraints[i] === 'boolean') {

					var div = document.createElement("div");
					var label = document.createElement("label");
					label.id = "label_" + i + "_"+n;
					label.htmlFor = "constraints_" + i + "_"+n;
					label.innerText = i + ":";
					label.style = "display:inline-block; padding:0;margin: 5px 0px 9px;";
					label.dataset.keyname = i + "_"+n;
					var input = document.createElement("select");
					var c = document.createElement("option");

					var opt = new Option("Off", false);
					input.options.add(opt);
					opt = new Option("On", true);
					input.options.add(opt);

					input.dataset.deviceID = data.deviceID;
					input.id = "constraints_" + i + "_"+n;
					input.className = "constraintCameraInput";
					input.name = "constraints_" + i + "_"+n;
					input.style = "display:inline; padding:2px; margin:0 10px;";
					input.dataset.keyname = i;
					input.dataset.track = n;
					input.dataset.UUID = UUID;
					input.onchange = function(e) {
						//getById("label_"+e.target.dataset.keyname).innerText =e.target.dataset.keyname+": "+e.target.value;
						//updateAudioConstraints(e.target.dataset.keyname, e.target.value);
						requestAudioHack(e.target.dataset.keyname, e.target.value, e.target.dataset.UUID, e.target.dataset.deviceID);
						log(e.target.dataset.keyname, e.target.value);
					};
					audioEle.appendChild(div);
					div.appendChild(label);
					div.appendChild(input);
				}
			} catch (e) {
				errorlog(e);
			}
		}
		
		
		if (data.subGain!==false) {
			var label = document.createElement("label");
			var i = "Gain";
			
			label.htmlFor = "constraints_" + i + "_" + n;

			var input = document.createElement("input");
			input.min = 0;
			input.max = 200;
			input.value = data.subGain*100;
			input.title = "Previously was: "+parseInt(input.value);
			input.type = "range";
			input.dataset.keyname = i + "_" + n;
			input.dataset.labelname = "Gain:"
			label.innerText = input.dataset.labelname;
			
			var manualInput = document.createElement("input");
			manualInput.type = "number";
			manualInput.dataset.keyname = i + "_" + n;
			manualInput.value = parseFloat(input.value);
			manualInput.className = "manualInput";
			manualInput.id = "label_" + i + "_" + n;
			
			
			input.dataset.track = data.deviceID;
			input.dataset.UUID = UUID;
			input.id = "constraints_" + i + "_" + n;
			input.style = "display:block; width:100%;";
			input.name = "constraints_" + i + "_" + n;
			input.style.margin = "10px 0";
			
			manualInput.onchange = function(e) {
				getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				requestChangeSubGain(parseInt(e.target.value), e.target.dataset.UUID, e.target.dataset.track);
			};

			input.onchange = function(e) {
				getById("label_" + e.target.dataset.keyname).innerText = e.target.dataset.labelname + " " + e.target.value;
				requestChangeSubGain(parseInt(e.target.value), e.target.dataset.UUID, e.target.dataset.track);
			};

			audioEle.appendChild(label);
			audioEle.appendChild(manualInput);
			audioEle.appendChild(input);
		}
		
		getById("advanced_audio_director_" + UUID).appendChild(audioEle);
	}
}

function updateDirectorsVideo(data, UUID) {
	var videoEle = document.createElement("div");
	if (data.trackLabel) { 
		var label = document.createElement("span");
		label.innerText = data.trackLabel;
		label.style.marginBottom = "10px";
		label.style.display = "block";
		label.id = "remoteVideoLabel_"+UUID;
		videoEle.appendChild(label);
	}
	
	for (var i in data.cameraConstraints) {
		try {
			log(i);
			log(data.cameraConstraints[i]);
			if ((typeof data.cameraConstraints[i] === 'object') && (data.cameraConstraints[i] !== null) && ("max" in data.cameraConstraints[i]) && ("min" in data.cameraConstraints[i])) {
				if (i === "aspectRatio") {
				//	continue;
				} else if (i === "width") {
				//	continue;
				} else if (i === "height") {
				//	continue;
				} else if (i === "frameRate") {
				//	continue;
				} else if (i === "latency") {
				//	continue;
				} else if (i === "sampleRate") {
					continue;
				} else if (i === "channelCount") {
					continue;
				}

				var label = document.createElement("label");
				//label.id = "label_" + i;
				label.htmlFor = "constraints_" + i;
				label.innerText = i + ":";

				var input = document.createElement("input");
				
				
				
				if (i === "aspectRatio") {
					input.max = 5;
					input.min = 0.2
				} else {
					input.min = data.cameraConstraints[i].min;
					input.max = data.cameraConstraints[i].max;
				}

				if (parseFloat(input.min) == parseFloat(input.max)) {
					continue;
				}

				if (i in data.currentCameraConstraints) {
					input.value = data.currentCameraConstraints[i];
					label.title = "Previously was:  " + data.currentCameraConstraints[i];
					input.title = "Previously was:  " + data.currentCameraConstraints[i];
				} 
				
				input.type = "range";
				input.dataset.keyname = i;
				input.id = "constraints_" + i;
				input.style = "display:block; width:100%;margin: 10px 0;";
				input.name = "constraints_" + i;

				if ((i === "height") || (i === "width")){
					input.title = "Hold CTRL (or cmd) to lock width and height together when changing them";
					input.min = 16;
				}
				
				var manualInput = document.createElement("input");
				manualInput.type = "number";
				manualInput.value = parseFloat(input.value);
				manualInput.className = "manualInput";
				manualInput.id = "label_" + i;
				manualInput.dataset.keyname = i;
				
				if ("step" in data.cameraConstraints[i]) {
					manualInput.step = data.cameraConstraints[i].step;
					input.step = data.cameraConstraints[i].step;
				}

				manualInput.onchange = function(e) {
					getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
					requestVideoHack(e.target.dataset.keyname, e.target.value, UUID, false); 
				};

				input.onchange = function(e) {
					getById("label_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
					//updateVideoConstraints(e.target.dataset.keyname, e.target.value);
					if (CtrlPressed){
						requestVideoHack(e.target.dataset.keyname, e.target.value, UUID, true); 
					} else {
						requestVideoHack(e.target.dataset.keyname, e.target.value, UUID, false); 
					}
				};

				videoEle.appendChild(label);
				videoEle.appendChild(manualInput);
				videoEle.appendChild(input);
			} else if ((typeof data.cameraConstraints[i] === 'object') && (data.cameraConstraints[i] !== null)) {
				if (i == "resizeMode") {
					continue;
				}

				var div = document.createElement("div");
				var label = document.createElement("label");
				label.id = "label_" + i;
				label.htmlFor = "constraints_" + i;
				label.innerText = i + ":";
				label.style = "display:inline-block; padding:0;margin: 5px 0px 9px;";
				label.dataset.keyname = i;
				var input = document.createElement("select");
				var c = document.createElement("option");

				if (data.cameraConstraints[i].length > 1) {
					for (var opts in data.cameraConstraints[i]) {
						log(opts);
						var opt = new Option(data.cameraConstraints[i][opts], data.cameraConstraints[i][opts]);
						input.options.add(opt);
						if (i in data.currentCameraConstraints) {
							if (data.cameraConstraints[i][opts] == data.currentCameraConstraints[i]) {
								opt.selected = "true";
							}
						}
					}
				} else if (i.toLowerCase == "torch") {
					var opt = new Option("Off", false);
					input.options.add(opt);
					opt = new Option("On", true);
					input.options.add(opt);
				} else {
					continue;
				}

				input.id = "constraints_" + i;
				input.className = "constraintCameraInput";
				input.name = "constraints_" + i;
				input.style = "display:inline; padding:2px; margin:0 10px;";
				input.dataset.keyname = i;
				input.onchange = function(e) {
					//getById("label_"+e.target.dataset.keyname).innerText =e.target.dataset.keyname+": "+e.target.value;
					//updateVideoConstraints(e.target.dataset.keyname, e.target.value);
					if (CtrlPressed){
						requestVideoHack(e.target.dataset.keyname, e.target.value, UUID, true);
					} else {
						requestVideoHack(e.target.dataset.keyname, e.target.value, UUID, false);
					}
					log(e.target.dataset.keyname, e.target.value);
				};
				videoEle.appendChild(div);
				div.appendChild(label);
				div.appendChild(input);
			} else if (typeof data.cameraConstraints[i] === 'boolean') {

				var div = document.createElement("div");
				var label = document.createElement("label");
				label.id = "label_" + i;
				label.htmlFor = "constraints_" + i;
				label.innerText = i + ":";
				label.style = "display:inline-block; padding:0;margin: 5px 0px 9px;";
				label.dataset.keyname = i;
				var input = document.createElement("select");
				var c = document.createElement("option");

				var opt = new Option("Off", false);
				input.options.add(opt);
				opt = new Option("On", true);
				input.options.add(opt);

				input.id = "constraints_" + i;
				input.className = "constraintCameraInput";
				input.name = "constraints_" + i;
				input.style = "display:inline; padding:2px; margin:0 10px;";
				input.dataset.keyname = i;
				input.onchange = function(e) {
					//getById("label_"+e.target.dataset.keyname).innerText =e.target.dataset.keyname+": "+e.target.value;
					//updateVideoConstraints(e.target.dataset.keyname, e.target.value);
					if (CtrlPressed){
						requestVideoHack(e.target.dataset.keyname, e.target.value, UUID, true);
					} else {
						requestVideoHack(e.target.dataset.keyname, e.target.value, UUID, false);
					}
					log(e.target.dataset.keyname, e.target.value);
				};
				videoEle.appendChild(div);
				div.appendChild(label);
				div.appendChild(input);
			}
		} catch (e) {
			errorlog(e);
		}
	}

	getById("advanced_video_director_" + UUID).innerHTML = "";
	getById("advanced_video_director_" + UUID).appendChild(videoEle);
	getById("advanced_video_director_" + UUID).className = "";
}

///////

function listAudioSettings() {
	getById("popupSelector_constraints_audio").innerHTML = "";
	
	var tracks = session.streamSrc.getAudioTracks();
	if (!tracks.length){
		warnlog("session.streamSrc contains no audio tracks");
		return
	}
	
	for (var ii = 0; ii< tracks.length; ii++){
		track0 = tracks[ii];
		if (track0.getCapabilities) {
			session.audioConstraints = track0.getCapabilities();
		} else if (Firefox){ // let's pretend like Firefox doesn't actually suck
			session.audioConstraints = {
				"autoGainControl": [
					true,
					false
				],
		//		"channelCount": {
		//			"max": 2,
		//			"min": 1
		//		},
		//		"deviceId": "default",
				"echoCancellation": [
					true,
					false
				],
		//		"groupId": "a3cbdec54a9b6ed473fd950415626f7e76f9d1b90f8c768faab572175a355a17",
		//		"latency": {
		//			"max": 0.01,
		//			"min": 0.01
		//		},
				"noiseSuppression": [
					true,
					false
				],
			//	"sampleRate": {
			//		"max": 48000,
			//		"min": 48000
			//	},
			//	"sampleSize": {
			//		"max": 16,
			//		"min": 16
			///	}
			};
		}

		try {
			if (track0.getSettings) {
				session.currentAudioConstraints = track0.getSettings();
			}
		} catch (e) {
			errorlog(e);
		}
		//////

		if (session.lowcut && ii==0) {  // ii==0 implies only track0 is supported by the web audio pipeline currently (or everything after the mixer node)
			if (getById("popupSelector_constraints_audio").style.display == "none") {
				getById("advancedOptionsAudio").style.display = "inline-block";
			}

			var label = document.createElement("label");
			var i = "Low_Cut";
			label.htmlFor = "constraints_" + i;
			label.innerText = "Low Cut:";

			var input = document.createElement("input");
			input.min = 50;
			input.max = 400;
			
			input.dataset.deviceid = track0.id; // pointless

			input.type = "range"; 
			input.dataset.keyname = i;
			input.dataset.labelname = label.innerHTML;
			input.id = "constraints_" + i;
			input.style = "display:block; width:100%;";
			input.name = "constraints_" + i;
			
			for (var webAudio in session.webAudios) {
				if (session.webAudios[webAudio].lowcut1.frequency) {
					input.value = session.webAudios[webAudio].lowcut1.frequency.value;
					label.innerHTML += " " + session.webAudios[webAudio].lowcut1.frequency.value;
					input.title = input.value;
					break;
				}
			}
			
			var manualInput = document.createElement("input");
			manualInput.type = "number";
			manualInput.dataset.keyname = i;
			manualInput.dataset.labelname = label.innerHTML;
			manualInput.value = parseFloat(input.value);
			manualInput.className = "manualInput";
			manualInput.id = "label_" + i;
			
			manualInput.onchange = function(e) {
				getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				changeLowCut(e.target.value, e.target.dataset.deviceid);
				e.target.title = e.target.value;
			};

			input.onchange = function(e) {
				getById("label_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				changeLowCut(e.target.value, e.target.dataset.deviceid);
				e.target.title = e.target.value;
			};

			getById("popupSelector_constraints_audio").appendChild(label);
			getById("popupSelector_constraints_audio").appendChild(manualInput);
			getById("popupSelector_constraints_audio").appendChild(input);
		}

		if (session.equalizer && ii==0) { // ii==0 implies only track0 is supported by the web audio pipeline currently (or everything after the mixer node)
			if (getById("popupSelector_constraints_audio").style.display == "none") {
				getById("advancedOptionsAudio").style.display = "inline-block";
			}

			var label = document.createElement("label");
			var i = "Low_EQ";
			//label.id = "label_" + i;
			label.htmlFor = "constraints_" + i;
			label.innerHTML = "Low EQ:";

			var input = document.createElement("input");
			input.min = -50;
			input.max = 50;
			
			input.dataset.deviceid = track0.id;  // pointless

			input.type = "range";
			input.dataset.keyname = i;
			input.dataset.labelname = label.innerHTML;
			input.id = "constraints_" + i;
			input.style = "display:block; width:100%;";
			input.name = "constraints_" + i;

			for (var webAudio in session.webAudios) {
				if (session.webAudios[webAudio].lowEQ.gain) {
					input.value = session.webAudios[webAudio].lowEQ.gain.value;
					label.innerHTML += " " + session.webAudios[webAudio].lowEQ.gain.value;
					input.title = input.value;
				}
			}
			
			var manualInput = document.createElement("input");
			manualInput.type = "number";
			manualInput.dataset.keyname = i;
			manualInput.dataset.labelname = label.innerHTML;
			manualInput.value = parseFloat(input.value);
			manualInput.className = "manualInput";
			manualInput.id = "label_" + i;
			
			manualInput.onchange = function(e) {
				getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				changeLowEQ(e.target.value, e.target.dataset.deviceid);
				e.target.title = e.target.value;
			};

			input.onchange = function(e) {
				getById("label_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				changeLowEQ(e.target.value, e.target.dataset.deviceid);
				e.target.title = e.target.value;
			};

			getById("popupSelector_constraints_audio").appendChild(label);
			getById("popupSelector_constraints_audio").appendChild(manualInput);
			getById("popupSelector_constraints_audio").appendChild(input);
			//
			if (getById("popupSelector_constraints_audio").style.display == "none") {
				getById("advancedOptionsAudio").style.display = "inline-block";
			}

			var label = document.createElement("label");
			var i = "Mid_EQ";
			//label.id = "label_" + i;
			label.htmlFor = "constraints_" + i;
			label.innerHTML = "Mid EQ:";

			var input = document.createElement("input");
			input.min = -50;
			input.max = 50;
			
			input.dataset.deviceid = track0.id;   // pointless

			input.type = "range";
			input.dataset.keyname = i;
			input.dataset.labelname = label.innerHTML;
			input.id = "constraints_" + i;
			input.style = "display:block; width:100%;";
			input.name = "constraints_" + i;


			for (var webAudio in session.webAudios) {
				if (session.webAudios[webAudio].midEQ.gain) {
					input.value = session.webAudios[webAudio].midEQ.gain.value;
					label.innerHTML += " " + session.webAudios[webAudio].midEQ.gain.value;
					input.title = input.value;
				}
			}
			
			var manualInput = document.createElement("input");
			manualInput.type = "number";
			manualInput.dataset.keyname = i;
			manualInput.dataset.labelname = label.innerHTML;
			manualInput.value = parseFloat(input.value);
			manualInput.className = "manualInput";
			manualInput.id = "label_" + i;
			
			manualInput.onchange = function(e) {
				getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				changeMidEQ(e.target.value, e.target.dataset.deviceid);
				e.target.title = e.target.value;
			};

			input.onchange = function(e) {
				getById("label_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				changeMidEQ(e.target.value, e.target.dataset.deviceid);
				e.target.title = e.target.value;
			};

			getById("popupSelector_constraints_audio").appendChild(label);
			getById("popupSelector_constraints_audio").appendChild(manualInput);
			getById("popupSelector_constraints_audio").appendChild(input);
			//
			if (getById("popupSelector_constraints_audio").style.display == "none") {
				getById("advancedOptionsAudio").style.display = "inline-block";
			}

			var label = document.createElement("label");
			var i = "High_EQ";
			//label.id = "label_" + i;
			label.htmlFor = "constraints_" + i;
			label.innerHTML = "High EQ:";

			var input = document.createElement("input");
			input.min = -50;
			input.max = 50;

			input.dataset.deviceid = track0.id;   // pointless

			input.type = "range";
			input.dataset.keyname = i;
			input.dataset.labelname = label.innerHTML;
			input.id = "constraints_" + i;
			input.style = "display:block; width:100%;";
			input.name = "constraints_" + i;

			for (var webAudio in session.webAudios) {
				if (session.webAudios[webAudio].highEQ.gain) {
					input.value = session.webAudios[webAudio].highEQ.gain.value;
					label.innerHTML += " " + session.webAudios[webAudio].highEQ.gain.value;
					input.title = input.value;
				}
			}
			
			var manualInput = document.createElement("input");
			manualInput.type = "number";
			manualInput.dataset.keyname = i;
			manualInput.dataset.labelname = label.innerHTML;
			manualInput.value = parseFloat(input.value);
			manualInput.className = "manualInput";
			manualInput.id = "label_" + i;
			
			manualInput.onchange = function(e) {
				getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				changeHighEQ(e.target.value, e.target.dataset.deviceid);
				e.target.title = e.target.value;
			};

			input.onchange = function(e) {
				getById("label_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
				changeHighEQ(e.target.value,  e.target.dataset.deviceid);
				e.target.title = e.target.value;
			};

			getById("popupSelector_constraints_audio").appendChild(label);
			getById("popupSelector_constraints_audio").appendChild(manualInput);
			getById("popupSelector_constraints_audio").appendChild(input);
		}
		////////
		if (tracks.length>1){
			
			var label = document.createElement("h4");
			label.innerHTML = track0.label;
			label.style = "text-shadow: 0 0 10px #fff3;"
			getById("popupSelector_constraints_audio").appendChild(label);
			
		}
		
		for (var i in session.audioConstraints) {
			try {
				log(i);
				log(session.audioConstraints[i]);
				
				
				if ((typeof session.audioConstraints[i] === 'object') && (session.audioConstraints[i] !== null) && ("max" in session.audioConstraints[i]) && ("min" in session.audioConstraints[i])) {
					if (i === "aspectRatio") {
						continue;
					} else if (i === "width") {
						continue;
					} else if (i === "height") {
						continue;
					} else if (i === "frameRate") {
						continue;
					} else if (i === "latency") {
					//	continue;
					} else if (i === "sampleRate") {
						continue;
					} else if (i === "channelCount") {
						continue;
					}

					var label = document.createElement("label");
					//label.id = "label_" + i + "_"+ii;
					label.htmlFor = "constraints_" + i + "_"+ii;
					label.innerHTML = i + ":";


					var input = document.createElement("input");
					input.min = session.audioConstraints[i].min;
					input.max = session.audioConstraints[i].max;
					
					input.dataset.deviceid = track0.id;

					if (parseFloat(input.min) == parseFloat(input.max)) {
						continue;
					}

					if (getById("popupSelector_constraints_audio").style.display == "none") {
						getById("advancedOptionsAudio").style.display = "inline-block";
					}

					if (i in session.currentAudioConstraints) {
						input.value = session.currentAudioConstraints[i];
						label.title = "Previously was:  " + session.currentAudioConstraints[i];
						input.title = "Previously was:  " + session.currentAudioConstraints[i];
					}
					
					if ((i === "height") || (i === "width")){
						input.title = "Hold CTRL (or cmd) to lock width and height together when changing them";
						input.min = 16;
					}
					
					
					input.type = "range";
					input.dataset.keyname = i;
					input.dataset.track = ii;
					
					input.id = "constraints_" + i + "_"+ii;
					input.style = "display:block; width:100%;";
					input.name = "constraints_" + i + "_"+ii;
					
					var manualInput = document.createElement("input");
					manualInput.type = "number";
					manualInput.dataset.keyname = i;
					manualInput.dataset.track = ii;
					manualInput.dataset.deviceid = track0.id;
					manualInput.value = parseFloat(input.value);
					manualInput.className = "manualInput";
					manualInput.id = "label_" + i + "_"+ii;
					
					if ("step" in session.audioConstraints[i]) {
						input.step = session.audioConstraints[i].step;
						manualInput.step = session.audioConstraints[i].step;
					}
					
					manualInput.onchange = function(e) {
						try {
							getById("constraints_" + e.target.dataset.keyname+"_"+ e.target.dataset.track).value = parseFloat(e.target.value);
							applyAudioHack(e.target.dataset.keyname, e.target.value, e.target.dataset.deviceid);
							e.target.title = e.target.value;
						}catch(e){errorlog(e);}
					};

					input.onchange = function(e) {
						try {
							getById("label_" + e.target.dataset.keyname+"_"+ e.target.dataset.track).value = parseFloat(e.target.value);
							applyAudioHack(e.target.dataset.keyname, e.target.value, e.target.dataset.deviceid);
							e.target.title = e.target.value;
						}catch(e){errorlog(e);}
					};

					getById("popupSelector_constraints_audio").appendChild(label);
					getById("popupSelector_constraints_audio").appendChild(manualInput);
					getById("popupSelector_constraints_audio").appendChild(input);
				} else if ((typeof session.audioConstraints[i] === 'object') && (session.audioConstraints[i] !== null)) {
					if (i == "resizeMode") {
						continue;
					}

					var div = document.createElement("div");
					var label = document.createElement("label");
					label.id = "label_" + i + "_"+ii;
					label.htmlFor = "constraints_" + i + "_"+ii;
					label.innerHTML = i + ":";
					label.style = "display:inline-block; padding:0;margin: 15px 0px 29px;";
					label.dataset.keyname = i;
					
					var input = document.createElement("select");
					var c = document.createElement("option");
					
					if (session.audioConstraints[i].length > 1) {
						for (var opts in session.audioConstraints[i]) {
							log(opts);
							var opt = new Option(session.audioConstraints[i][opts], session.audioConstraints[i][opts]);
							input.options.add(opt);

							if (i in session.currentAudioConstraints) {
								if (session.audioConstraints[i][opts] == session.currentAudioConstraints[i]) {
									opt.selected = "true";
								}
							}

						}
					} else if (i.toLowerCase == "torch") {
						var opt = new Option("Off", false);
						input.options.add(opt);
						opt = new Option("On", true);
						input.options.add(opt);
					} else {
						continue;
					}

					if (getById("popupSelector_constraints_audio").style.display == "none") {
						getById("advancedOptionsAudio").style.display = "inline-block";
					}

					input.id = "constraints_" + i + "_"+ii;
					input.className = "constraintCameraInput";
					input.name = "constraints_" + i + "_"+ii;
					input.dataset.deviceid = track0.id;
					input.style = "display:inline; padding:2px; margin:0 10px;";
					input.dataset.keyname = i;
					input.onchange = function(e) {
						applyAudioHack(e.target.dataset.keyname, e.target.value, e.target.dataset.deviceid);
						log(e.target.dataset.keyname, e.target.value);
					};
					getById("popupSelector_constraints_audio").appendChild(div);
					div.appendChild(label);
					div.appendChild(input);
				} else if (typeof session.audioConstraints[i] === 'boolean') {

					var div = document.createElement("div");
					var label = document.createElement("label");
					label.id = "label_" + i + "_"+ii;
					label.htmlFor = "constraints_" + i + "_"+ii;
					label.innerHTML = i + ":";
					label.style = "display:inline-block; padding:0;margin: 15px 0px 29px;";
					label.dataset.keyname = i;
					var input = document.createElement("select");
					var c = document.createElement("option");
					
					
					input.dataset.deviceid = track0.id;
					

					var opt = new Option("Off", false);
					input.options.add(opt);
					opt = new Option("On", true);
					input.options.add(opt);

					if (getById("popupSelector_constraints_audio").style.display == "none") {
						getById("advancedOptionsAudio").style.display = "inline-block";
					}

					input.id = "constraints_" + i + "_"+ii;
					input.className = "constraintCameraInput";
					input.name = "constraints_" + i + "_"+ii;
					input.style = "display:inline; padding:2px; margin:0 10px;";
					input.dataset.keyname = i;
					input.onchange = function(e) {
						//getById("label_"+e.target.dataset.keyname).innerHTML =e.target.dataset.keyname+": "+e.target.value;
						//updateAudioConstraints(e.target.dataset.keyname, e.target.value);
						applyAudioHack(e.target.dataset.keyname, e.target.value, e.target.dataset.deviceid);
						log(e.target.dataset.keyname, e.target.value);
					};
					getById("popupSelector_constraints_audio").appendChild(div);
					div.appendChild(label);
					div.appendChild(input);
				}
			} catch (e) {
				errorlog(e);
			}
		}
		if (tracks.length>1){
			for (var webAudio in session.webAudios) {
				if (session.webAudios[webAudio].subGainNodes && (track0.id in session.webAudios[webAudio].subGainNodes)) {
			
					if (getById("popupSelector_constraints_audio").style.display == "none") {
						getById("advancedOptionsAudio").style.display = "inline-block";
					}

					var label = document.createElement("label");
					var i = "Gain";
					//label.id = "label_" + i + "_" + track0.id;
					label.htmlFor = "constraints_" + i + "_" + track0.id;
					label.innerText = "Gain:";

					var input = document.createElement("input");
					input.min = 0;
					input.max = 200;
					
					input.dataset.deviceid = track0.id; // pointless

					input.type = "range";
					input.dataset.keyname = i;
					input.dataset.labelname = label.innerHTML;
					input.id = "constraints_" + i+ "_" + track0.id;
					input.style = "display:block; width:100%;";
					input.name = "constraints_" + i + "_" + track0.id;
					
					input.value = session.webAudios[webAudio].subGainNodes[track0.id].gain.value * 100;
					label.innerHTML += " " + parseInt(session.webAudios[webAudio].subGainNodes[track0.id].gain.value * 100);
					input.title = parseInt(input.value);
					
					var manualInput = document.createElement("input");
					manualInput.type = "number";
					manualInput.dataset.keyname = i;
					manualInput.dataset.deviceid = track0.id;
					manualInput.dataset.labelname = label.innerHTML;
					manualInput.value = parseFloat(input.value);
					manualInput.className = "manualInput";
					manualInput.id = "label_" + i + "_" + track0.id;
					
					manualInput.onchange = function(e) {
						getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
						changeSubGain(e.target.value, e.target.dataset.deviceid);
						e.target.title = e.target.value;
					};
					
					input.onchange = function(e) {
						getById("label_" + e.target.dataset.keyname).caluse = parseFloat(e.target.value);
						changeSubGain(e.target.value, e.target.dataset.deviceid);
						e.target.title = e.target.value;
					};

					getById("popupSelector_constraints_audio").appendChild(label);
					getById("popupSelector_constraints_audio").appendChild(manualInput);
					getById("popupSelector_constraints_audio").appendChild(input);
					break;
				}
			}
		} else {
			for (var webAudio in session.webAudios) {
				if (session.webAudios[webAudio].gainNode) {
			
					if (getById("popupSelector_constraints_audio").style.display == "none") {
						getById("advancedOptionsAudio").style.display = "inline-block";
					}

					var label = document.createElement("label");
					var i = "Gain";
					//label.id = "label_" + i;
					label.htmlFor = "constraints_" + i;
					label.innerText = "Gain:";

					var input = document.createElement("input");
					input.min = 0;
					input.max = 200;
					
					input.dataset.deviceid = track0.id; // pointless

					input.type = "range";
					input.dataset.keyname = i;
					input.dataset.labelname = label.innerHTML;
					input.id = "constraints_" + i;
					input.style = "display:block; width:100%;";
					input.name = "constraints_" + i;
					
					input.value = session.webAudios[webAudio].gainNode.gain.value * 100;
					//label.innerHTML += " " + parseInt(session.webAudios[webAudio].gainNode.gain.value * 100);
					input.title = parseInt(input.value);
					
					var manualInput = document.createElement("input");
					manualInput.type = "number";
					manualInput.dataset.keyname = i;
					manualInput.dataset.deviceid = track0.id;
					manualInput.dataset.labelname = label.innerHTML;
					manualInput.value = parseFloat(input.value);
					manualInput.className = "manualInput";
					manualInput.id = "label_" + i;
					
					manualInput.onchange = function(e) {
						getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
						changeMainGain(e.target.value, e.target.dataset.deviceid);
						e.target.title = e.target.value;
					};
					
					input.onchange = function(e) {
						getById("label_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
						changeMainGain(e.target.value, e.target.dataset.deviceid);
						e.target.title = e.target.value;
					};

					getById("popupSelector_constraints_audio").appendChild(label);
					getById("popupSelector_constraints_audio").appendChild(manualInput);
					getById("popupSelector_constraints_audio").appendChild(input);
					break;
				}
			}
		}
	}
}


function applyAudioHack(constraint, value = null, deviceid="default") {
	if (value == parseFloat(value)) {
		value = parseFloat(value);
		value = {
			exact: value
		};
	} else if (value == "true") {
		value = true;
	} else if (value == "false") {
		value = false;
	}
	////////////////
	try {
		var tracks = session.streamSrc.getAudioTracks();
		if (tracks.length) {
			var track0 = tracks[0];
			for (var ii = 0;ii<tracks.length;ii++){
				if (tracks[ii].id == deviceid){
					track0 = tracks[ii];
					break;
				}
			}
			
			if (track0.getCapabilities) {
				session.audioConstraints = track0.getCapabilities();
			} else if (Firefox){ // let's pretend like Firefox doesn't actually suck
				session.audioConstraints = {
					"autoGainControl": [
						true,
						false
					],
			//		"channelCount": {
			//			"max": 2,
			//			"min": 1
			//		},
					"deviceId": deviceid,
					"echoCancellation": [
						true,
						false
					],
			//		"groupId": "a3cbdec54a9b6ed473fd950415626f7e76f9d1b90f8c768faab572175a355a17",
			//		"latency": {
			//			"max": 0.01,
			//			"min": 0.01
			//		},
					"noiseSuppression": [
						true,
						false
					],
				//	"sampleRate": {
				//		"max": 48000,
				//		"min": 48000
				//	},
				//	"sampleSize": {
				//		"max": 16,
				//		"min": 16
				///	}
				};
			}
			log(session.audioConstraints);
		} else {
			warnlog("session.streamSrc contains no audio tracks");
			return;
		}
	} catch (e) {
		warnlog("session.streamSrc contains no audio tracks");
		errorlog(e);
		return;
	}
	try {
		if (track0.getSettings) {
			session.currentAudioConstraints = track0.getSettings();
		}
	} catch (e) {
		errorlog(e);
	}
	////////
	
	var new_constraints = Object.assign(session.currentAudioConstraints, {
		[constraint]: value
	}, );
	new_constraints = {
		audio: new_constraints
		, video: false
	};
	log("new constraints");
	log(new_constraints);
	activatedPreview = false;
	enumerateDevices().then(gotDevices2).then(function() {
		grabAudio("#audioSource3", null, new_constraints);
	});

}

function updateAudioConstraints(constraint, value = null) { // this is what it SHOULD be, but this doesn't work yet.

	// this is probably not used any more?
	var track0 = session.streamSrc.getAudioTracks();
	track0 = track0[0];
	if (value == parseFloat(value)) {
		value = parseFloat(value);
	} else if (value == "true") {
		value = true;
	} else if (value == "false") {
		value = false;
	}
	log({
		advanced: [{
			[constraint]: value
		}]
	});
	track0.applyConstraints({
		advanced: [{
			[constraint]: value
		}]
	});
	return;

}

function listCameraSettings() {
	getById("popupSelector_constraints_video").innerHTML = "";

	if (session.controlRoomBitrate===true){
		session.controlRoomBitrate = session.totalRoomBitrate;
	}

	if (session.roomid && (session.view !== "") && (session.controlRoomBitrate!==false)) {
		log("LISTING OPTION FOR BITRATE CONTROL");
		var i = "room video bitrate (kbps)";
		var label = document.createElement("label");
		
		label.htmlFor = "constraints_" + i;
		label.innerHTML = i + ":";
		label.title = "If you're on a slow network, you can improve frame rate and audio quality by reducing the amount of video data that others send you";

		var input = document.createElement("input");
		input.min = 0;
		input.max = parseInt(session.totalRoomBitrate);

		if (getById("popupSelector_constraints_video").style.display == "none") {
			getById("advancedOptionsCamera").style.display = "inline-block";
		}

		input.value = session.controlRoomBitrate;
		label.innerHTML = i + ": ";

		var manualInput = document.createElement("input");
		manualInput.type = "number";
		manualInput.value = parseFloat(input.value);
		manualInput.className = "manualInput";
		manualInput.id = "label_" + i;

		input.type = "range";
		input.dataset.keyname = i;
		input.id = "constraints_" + i;
		input.style = "display:block; width:100%;";
		input.name = "constraints_" + i;
		input.title = "If you're on a slow network, you can improve frame rate and audio quality by reducing the amount of video data that others send you";

		manualInput.onchange = function(e) {
			getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
			if (e.target.value > session.totalRoomBitrate) {
				return;
			} else {
				session.controlRoomBitrate = parseInt(e.target.value);
			}
			updateMixer();
		};

		input.onchange = function(e) {
			getById("label_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
			if (e.target.value > session.totalRoomBitrate) {
				return;
			} else {
				session.controlRoomBitrate = parseInt(e.target.value);
			}
			updateMixer();
		};
		getById("popupSelector_constraints_video").appendChild(label);
		getById("popupSelector_constraints_video").appendChild(manualInput);
		getById("popupSelector_constraints_video").appendChild(input);
	}
	try {
		var track0 = session.streamSrc.getVideoTracks();
		if (track0.length) {
			track0 = track0[0];
			if (track0.getCapabilities) {
				session.cameraConstraints = track0.getCapabilities();
			} else {
				session.cameraConstraints = {};
			}
			log(session.cameraConstraints);
		}
	} catch (e) {
		errorlog(e);
		return;
	}

	try {
		if (track0.getSettings) {
			session.currentCameraConstraints = track0.getSettings();
		} else {
			session.currentCameraConstraints = {};
		}
	} catch (e) {
		errorlog(e);
	}
	
	for (var i in session.cameraConstraints) {
		try {
			log(i);
			log(session.cameraConstraints[i]);
			if ((typeof session.cameraConstraints[i] === 'object') && (session.cameraConstraints[i] !== null) && ("max" in session.cameraConstraints[i]) && ("min" in session.cameraConstraints[i])) {
				if (i === "aspectRatio") {
					//continue;
				} else if (i === "frameRate") {
					//continue;
				}

				var label = document.createElement("label");
				label.htmlFor = "constraints_" + i;
				label.innerHTML = i + ":";

				var input = document.createElement("input");
				input.min = parseFloat(session.cameraConstraints[i].min);
				
				if (i === "aspectRatio") {
					input.max = 5;
					input.min = 0.2
				} else {
					input.min = parseFloat(session.cameraConstraints[i].min);
					input.max = parseFloat(session.cameraConstraints[i].max);
				}

				if (parseFloat(input.min) == parseFloat(input.max)) {
					continue;
				}
				

				if (getById("popupSelector_constraints_video").style.display == "none") {
					getById("advancedOptionsCamera").style.display = "inline-block";
				} 
				
				var manualInput = document.createElement("input");
				manualInput.type = "number";
				manualInput.dataset.keyname = i;
				manualInput.value = parseFloat(input.value);
				manualInput.className = "manualInput";
				manualInput.id = "label_" + i;
				
				if ("step" in session.cameraConstraints[i]) {
					input.step = session.cameraConstraints[i].step;
					manualInput.step = session.cameraConstraints[i].step;
				}

				if (i in session.currentCameraConstraints) {
					input.value = parseFloat(session.currentCameraConstraints[i]);
					//label.innerHTML = i + ": " + session.currentCameraConstraints[i];
					manualInput.value = parseFloat(session.currentCameraConstraints[i]);
					label.title = "Previously was:  " + session.currentCameraConstraints[i];
					input.title = "Previously was:  " + session.currentCameraConstraints[i];
				} else {
					label.innerHTML = i;
				}
				if ((i === "height") || (i === "width")){
					input.title = "Hold CTRL (or cmd) to lock width and height together when changing them";
					input.min = 16;
				}
				
				input.type = "range";
				input.dataset.keyname = i;
				input.id = "constraints_" + i;
				input.style = "display:block; width:100%;";
				input.name = "constraints_" + i;
				
				// on manualInput.change = .. update the input field! gotta riprocate
				
				manualInput.onchange = function(e) {
					getById("constraints_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
					updateCameraConstraints(e.target.dataset.keyname, e.target.value, false, false); 
				};

				input.onchange = function(e) {
					getById("label_" + e.target.dataset.keyname).value = parseFloat(e.target.value);
					if (CtrlPressed){
						updateCameraConstraints(e.target.dataset.keyname, e.target.value, true, false); 
					} else {
						updateCameraConstraints(e.target.dataset.keyname, e.target.value, false, false); 
					}
				};

				getById("popupSelector_constraints_video").appendChild(label);
				getById("popupSelector_constraints_video").appendChild(manualInput);
				getById("popupSelector_constraints_video").appendChild(input);
			} else if ((typeof session.cameraConstraints[i] === 'object') && (session.cameraConstraints[i] !== null)) {
				if (i == "resizeMode") {
					continue;
				}

				var div = document.createElement("div");
				var label = document.createElement("label");
				label.id = "label_" + i;
				label.htmlFor = "constraints_" + i;
				label.innerHTML = i + ":";
				label.style = "display:inline-block; padding:0;margin: 15px 0px 29px;";
				label.dataset.keyname = i;
				var input = document.createElement("select");

				if (session.cameraConstraints[i].length > 1) {
					var included = false;
					for (var opts in session.cameraConstraints[i]) {
						log(opts);
						var opt = new Option(session.cameraConstraints[i][opts], session.cameraConstraints[i][opts]);
						input.options.add(opt);
						if (i in session.currentCameraConstraints) {
							if (session.cameraConstraints[i][opts] == session.currentCameraConstraints[i]) {  
								opt.selected = "true";
								included = true;
							}
						}
					}
					if (!included){
						if (i in session.currentCameraConstraints) {
							var opt = new Option(session.currentCameraConstraints[i], session.currentCameraConstraints[i]);
							input.options.add(opt);
							opt.selected = "true";
						}
					}
				} else if (i.toLowerCase == "torch") {
					warnlog("TORCH");
					var opt = new Option("Off", false);
					input.options.add(opt);
					opt = new Option("On", true);
					input.options.add(opt);
					try{
						if (session.currentCameraConstraints[i]){
							opt.selected = "selected";
						}
					} catch(e){}
				} else if (session.cameraConstraints[i].length && ("continuous" == session.cameraConstraints[i][0])){
					var opt = new Option("continuous", "continuous");
					input.options.add(opt);
					if (i in session.currentCameraConstraints) {
						if ("continuous" == session.currentCameraConstraints[i]) {
							opt.selected = "true";
							var opt = new Option("manual", "manual");
							input.options.add(opt);
							var opt = new Option("none", "none");
							input.options.add(opt);
						} else {
							var opt = new Option(session.currentCameraConstraints[i], session.currentCameraConstraints[i]);
							input.options.add(opt);
							opt.selected = "true";
							if (session.currentCameraConstraints[i]=="none"){
								var opt = new Option("manual", "manual");
								input.options.add(opt);
							} else {
								var opt = new Option("none", "none");
								input.options.add(opt);
							}
						}
					} else {
						opt.selected = "true";
						var opt = new Option("manual", "manual");
						input.options.add(opt);
						var opt = new Option("none", "none");
						input.options.add(opt);
					}
				} else if (session.cameraConstraints[i].length && ("manual" == session.cameraConstraints[i][0])){
					var opt = new Option("manual", "manual");
					input.options.add(opt);
					if (i in session.currentCameraConstraints) {
						if ("manual" == session.currentCameraConstraints[i]) {
							opt.selected = "true";
							var opt = new Option("continuous", "continuous");
							input.options.add(opt);
							var opt = new Option("none", "none");
							input.options.add(opt);
						} else {
							var opt = new Option(session.currentCameraConstraints[i], session.currentCameraConstraints[i]);
							input.options.add(opt);
							opt.selected = "true";
							if (session.currentCameraConstraints[i]=="none"){
								var opt = new Option("continuous", "continuous");
								input.options.add(opt);
							} else {
								var opt = new Option("none", "none");
								input.options.add(opt);
							}
						}
					} else {
						opt.selected = "true";
						var opt = new Option("continuous", "continuous");
						input.options.add(opt);
						var opt = new Option("none", "none");
						input.options.add(opt);
					}
				} else {
					continue;
				}

				if (getById("popupSelector_constraints_video").style.display == "none") {
					getById("advancedOptionsCamera").style.display = "inline-block";
				}

				input.id = "constraints_" + i;
				input.className = "constraintCameraInput";
				input.name = "constraints_" + i;
				input.style = "display:inline; padding:2px; margin:0 10px;";
				input.dataset.keyname = i;
				input.onchange = function(e) {
					//getById("label_"+e.target.dataset.keyname).innerHTML =e.target.dataset.keyname+": "+e.target.value;
					if (CtrlPressed){
						updateCameraConstraints(e.target.dataset.keyname, e.target.value, true, false);
					} else {
						updateCameraConstraints(e.target.dataset.keyname, e.target.value, false, false);
					}
					log(e.target.dataset.keyname + " " + e.target.value);
				};
				getById("popupSelector_constraints_video").appendChild(div);
				div.appendChild(label);
				div.appendChild(input);
			} else if (typeof session.cameraConstraints[i] === 'boolean') {

				var div = document.createElement("div");
				var label = document.createElement("label");
				label.id = "label_" + i;
				label.htmlFor = "constraints_" + i;
				label.innerHTML = i + ":";
				label.style = "display:inline-block; padding:0;margin: 15px 0px 29px;";
				label.dataset.keyname = i;
				var input = document.createElement("select");

				var opt = new Option("Off", "false");
				input.options.add(opt);
				
				opt = new Option("On", "true");
				input.options.add(opt);
				if (session.currentCameraConstraints[i]){
					opt.selected = "true";
				}
				
				if (getById("popupSelector_constraints_video").style.display == "none") {
					getById("advancedOptionsCamera").style.display = "inline-block";
				}

				input.id = "constraints_" + i;
				input.className = "constraintCameraInput";
				input.name = "constraints_" + i;
				input.style = "display:inline; padding:2px; margin:0 10px;";
				input.dataset.keyname = i;
				input.onchange = function(e) {
					//getById("label_"+e.target.dataset.keyname).innerHTML =e.target.dataset.keyname+": "+e.target.value;
					if (CtrlPressed){
						updateCameraConstraints(e.target.dataset.keyname, e.target.value, true, false);
					} else {
						updateCameraConstraints(e.target.dataset.keyname, e.target.value, false, false);
					}
					log(e.target.dataset.keyname  + " " + e.target.value);
				};
				getById("popupSelector_constraints_video").appendChild(div);
				div.appendChild(label);
				div.appendChild(input);
			}
		} catch (e) {
			errorlog(e);
		}
	}
	
	if (session.currentCameraConstraints.deviceId){
		if (getStorage("camera_"+session.currentCameraConstraints.deviceId)){
			var button = document.createElement("button");
			button.innerHTML = "Reset video settings to default";
			button.style.display = "block";
			button.style.padding = "20px";
			button.style.margin = "32px 20px 20px 20px";
			button.dataset.deviceId = session.currentCameraConstraints.deviceId;
			button.onclick = function(){
				var deviceId = this.dataset.deviceId;
				var cameraSettings = getStorage("camera_"+deviceId);
				var constraints = {};
				if (cameraSettings['default']){
					if (cameraSettings['current']){
						for (var i in cameraSettings['default']){ 
							if (i == "groupId"){
								continue;
							} else if (i === "aspectRatio") { // do not load from storage; causes issues
								continue;
							} else if (i === "width") {
							//	continue;
							} else if (i === "height") {
							//	continue;
							} else if (i === "frameRate") { // if I include any of these, it will complain about mixing types and fail
								continue;
							}
							
							if (i in cameraSettings['current']){
								if (cameraSettings['current'][i] != cameraSettings['default'][i]){
									if (i in session.cameraConstraints){
										if ("min" in session.cameraConstraints[i]){
											if (session.cameraConstraints[i].min>cameraSettings['default'][i]){
												continue;
											}
										}
										if ("max" in session.cameraConstraints[i]){
											 if (session.cameraConstraints[i].max<cameraSettings['default'][i]){
												continue;
											}
										}
										errorlog(session.cameraConstraints[i]);
									}
									constraints[i]=cameraSettings['default'][i];
									errorlog(i +  " " + cameraSettings['default'][i]);
									warnlog("DIFF: ");
									
								}
							}
						}
					}
				}
				warnlog(constraints);
				if (Object.keys(constraints).length){
					track0.applyConstraints({
						advanced: [constraints]
					}).then(() => {
						//errorlog("deviceId:"+deviceId); // .. --  listCameraSettings
						removeStorage("camera_"+deviceId);
						listCameraSettings(); 
						
						if ((constraint == "width") || (constraint == "height") || (constraint ==  "aspectRatio")){
							session.setResolution(); // this will reset scaling for all viewers of this stream
						}
					  })
					  .catch(e => {
						errorlog("Failed to reset to defaults");
						errorlog(e);
					  });
				}
				
			};
			
			getById("popupSelector_constraints_video").appendChild(button);
		}
	}
}

function updateSavedVideoSettings(track0){ // just applies any saved settings. This then assumes there are already default settings saved, as saved won't be there without the default also.
	if (track0.getSettings) {
		session.currentCameraConstraints = track0.getSettings();
		if ("deviceId" in session.currentCameraConstraints){
			var deviceId = session.currentCameraConstraints.deviceId;
			if (getStorage("camera_"+deviceId)){
				var cameraSettings = getStorage("camera_"+deviceId);
				var constraints = {};
				if (cameraSettings['current']){
					for (var i in session.currentCameraConstraints){
						if (i in cameraSettings['current']){
							if (cameraSettings['current'][i] != session.currentCameraConstraints[i]){
								if (i == "groupId"){continue;}
								constraints[i]=cameraSettings['current'][i];
								warnlog("DIFF: "+i);
							}
						}
					}
				}
				
				warnlog(constraints);
				if (Object.keys(constraints).length){
					track0.applyConstraints({ 
						advanced: [constraints] // ignore
					}).then(() => {
						warnlog("video settings updated for deviceId:"+deviceId);
						//removeStorage("camera_"+deviceId);
						//listCameraSettings();
					}).catch(e => {
						errorlog("Failed to reset to defaults");
					});
				}
			}
		}
	}
	
}

function updateCameraConstraints(constraint, value = null, ctrl=false, UUID=false) {
	var track0 = session.streamSrc.getVideoTracks();
	track0 = track0[0]; // shoud only be one video track anyways.
	if (value == parseFloat(value)) {
		value = parseFloat(value);
	} else if (value == "true") {
		value = true;
	} else if (value == "false") {
		value = false;
	}
	log({
		advanced: [{
			[constraint]: value
		}]
	});
	
	try {
		if (track0.getSettings){
			var cameraSettings = {};
			session.currentCameraConstraints = track0.getSettings();
			if (session.currentCameraConstraints.deviceId){
				if (!getStorage("camera_"+session.currentCameraConstraints.deviceId)){
					cameraSettings['default'] = JSON.parse(JSON.stringify(session.currentCameraConstraints));
					log(cameraSettings['default']);
				} else {
					cameraSettings = getStorage("camera_"+session.currentCameraConstraints.deviceId);
				}
			}
		}
	} catch(e){errorlog(e);}
	
	
	if (!ctrl && (constraint=="width") && ("height" in session.currentCameraConstraints)){
		var constraits = {"width": value, "height":session.currentCameraConstraints.height};
	} else if (!ctrl && (constraint=="height") && ("width" in session.currentCameraConstraints)){
		var constraits = {"height": value, "width":session.currentCameraConstraints.width};
	} else {
		var constraits = {[constraint]: value};
	}
	
	track0.applyConstraints({
		advanced: [constraits]
	}).then(() => {
		//setTimeout(function(){
			if (track0.getSettings){ // -- updateCameraConstraints
				if (session.currentCameraConstraints.deviceId){
					cameraSettings['current'] = track0.getSettings(); // this won't let failed settings be stored.
					//cameraSettings['current'][constraint] = value; // setting value is a problem, as it will allow for failed settings to be stored.
					setStorage("camera_"+session.currentCameraConstraints.deviceId, cameraSettings);
					if (toggleSettingsState == true) {
						listCameraSettings();
					}
				}
			}
			
			if (UUID){
				var data = {};
				data.UUID = UUID;
				data.videoOptions = listVideoSettingsPrep();
				sendMediaDevices(data.UUID);
				session.sendMessage(data, data.UUID);
			}
			if ((constraint == "width") || (constraint == "height") || (constraint ==  "aspectRatio")){
				session.setResolution(); // this will reset scaling for all viewers of this stream
			}
		//},500, track0);
	}).catch(e => {
		errorlog("coulnd't save defaults"); // this doesn't get triggered when a setting fails for some reason.
	});
	
	return;

}

function setupWebcamSelection(stream = null) {
	log("setup webcam");

	if (stream) {
		log(getById("previewWebcam"));
		session.streamSrc = stream;
		getById("previewWebcam").srcObject = outboundAudioPipeline();
		//toggleMute(true); // it's a PREVIEW
	} else {
		warnlog("THIS IS NO STREAM??");
	}

	if (!session.videoElement) {
		session.videoElement = getById("previewWebcam");
	}

	try {
		return enumerateDevices().then(gotDevices).then(function() {
			
			if (getById("webcamquality").elements && parseInt(getById("webcamquality").elements.namedItem("resolution").value) == 3) {
				if (session.maxframerate===false){
					session.maxframerate = 30;
					session.maxframerate_q2 = true;
				} 
			} else if (session.maxframerate_q2){
				session.maxframerate = false;
				session.maxframerate_q2 = false;
			}

			var audioSelect =  getById('audioSource');
			var videoSelect =  getById('videoSourceSelect');
			var outputSelect = getById('outputSource'); 

			audioSelect.onchange = function() {

				if (document.getElementById("gowebcam")) {
					document.getElementById("gowebcam").disabled = true;
					document.getElementById("gowebcam").dataset.audioready = "false";
					document.getElementById("gowebcam").style.backgroundColor = "#DDDDDD";
					document.getElementById("gowebcam").style.fontWeight = "normal";
					document.getElementById("gowebcam").innerHTML = "Waiting for mic to load";
					miniTranslate(document.getElementById("gowebcam"), "waiting-for-mic-to-load");
				}
				activatedPreview = false;
				grabAudio();
			};
			videoSelect.onchange = function() {

				if (document.getElementById("gowebcam")) {
					document.getElementById("gowebcam").disabled = true;
					document.getElementById("gowebcam").dataset.ready = "false";
					document.getElementById("gowebcam").style.backgroundColor = "#DDDDDD";
					document.getElementById("gowebcam").style.fontWeight = "normal";
					document.getElementById("gowebcam").innerHTML = "Waiting for Camera to load";
					miniTranslate(document.getElementById("gowebcam"), "waiting-for-camera-to-load");
				}
				warnlog("video source changed");

				activatedPreview = false;
				if (session.quality !== false) {
					grabVideo(session.quality);
				} else {
					session.quality_wb = parseInt(getById("webcamquality").elements.namedItem("resolution").value);
					grabVideo(session.quality_wb);
				}
			};

			outputSelect.onchange = function() {

				if ((iOS) || (iPad)) {
					return;
				}
				try{
					session.sink = outputSelect.options[outputSelect.selectedIndex].value;
					saveSettings();
				} catch(e){errorlog(e);}
				
				if (!session.sink){return;}
				
				try{
					getById("previewWebcam").setSinkId(session.sink).then(() => {
						log("New Output Device:" + session.sink);
					}).catch(error => {
						errorlog("6597");
						errorlog(error);
						//setTimeout(function(){warnUser("Failed to change audio output destination.");},1);
					});
				} catch(e){errorlog(e);}
			}

			getById("webcamquality").onchange = function() {
				
				if (document.getElementById("gowebcam")) {
					document.getElementById("gowebcam").disabled = true;
					document.getElementById("gowebcam").dataset.ready = "false";
					document.getElementById("gowebcam").style.backgroundColor = "#DDDDDD";
					document.getElementById("gowebcam").style.fontWeight = "normal";
					document.getElementById("gowebcam").innerHTML = "Waiting for Camera to load";
					miniTranslate(document.getElementById("gowebcam"), "waiting-for-camera-to-load");
				}

				if (parseInt(getById("webcamquality").elements.namedItem("resolution").value) == 2) {
					if (session.maxframerate===false){
						session.maxframerate = 30;
						session.maxframerate_q2 = true;
					} 
				} else if (session.maxframerate_q2){
					session.maxframerate = false;
					session.maxframerate_q2 = false;
				}

				activatedPreview = false;
				session.quality_wb = parseInt(getById("webcamquality").elements.namedItem("resolution").value);
				grabVideo(session.quality_wb);
			};
			
			if (session.safemode){
				if (document.getElementById("gowebcam")){
					document.getElementById("gowebcam").disabled = false;
					document.getElementById("gowebcam").innerHTML = miscTranslations["start"];
					document.getElementById("gowebcam").dataset.audioready = "true";
					document.getElementById("gowebcam").dataset.ready = "true";
					setTimeout(function(){updateForceRotate();},1000);
					return;
				}
			}

			if (session.audioDevice!==0){ // change from Auto to Selected Audio Device
				log("SETTING AUDIO DEVICE!!");
				activatedPreview = false; 
				grabAudio();
			} else if (document.getElementById("gowebcam")){
				document.getElementById("gowebcam").dataset.audioready = "true";
			}

			if (session.videoDevice === 0) {
				if (session.autostart) {
					publishWebcam(); // no need to mirror as there is no video...
					return;
				} else {
					if (document.getElementById("gowebcam")) {
						document.getElementById("gowebcam").dataset.ready = "true";
						if (document.getElementById("gowebcam").dataset.audioready == "true"){
							document.getElementById("gowebcam").disabled = false;
							document.getElementById("gowebcam").innerHTML = miscTranslations["start"];
						}
					}
					return;
				}
			} else {
				log("GRabbing video: " + session.quality);
				activatedPreview = false;
				if (session.quality !== false) {
					grabVideo(session.quality);
				} else {
					session.quality_wb = parseInt(getById("webcamquality").elements.namedItem("resolution").value);
					grabVideo(session.quality_wb);
				}
			}

			if ((iOS) || (iPad)) {
				return;
			}
			try {
				if (outputSelect.selectedIndex >= 0) {
					session.sink = outputSelect.options[outputSelect.selectedIndex].value;
					saveSettings();
				}
			} catch(e){errorlog(e);}
			
			if (document.getElementById("previewWebcam") && document.getElementById("previewWebcam").setSinkId) {
				if (session.sink) {
					getById("previewWebcam").setSinkId(session.sink).then(() => {}).catch(error => {
						warnlog("couldn't set sink: "+session.sink);
					});
				}
			}

		}).catch(e => {
			errorlog(e);
		});
	} catch (e) {
		errorlog(e);
	}
}

Promise.wait = function(ms) {
	return new Promise(function(resolve) {
		setTimeout(resolve, ms);
	});
};

Promise.prototype.timeout = function(ms) {
	return Promise.race([
		this, Promise.wait(ms).then(function() {
			if (iOS || iPad){
				var errormsg = new Error("Time Out\nDid you accept camera permissions in time? Please do so first.\n\nIf using an iPhone or iPad, try fully closing your browser and open it again; Safari sometimes jams up the camera.");
				errormsg.name = "timedOut";
				errormsg.message = "Time Out\nDid you accept camera permissions in time? Please do so first.\n\nIf using an iPhone or iPad, try fully closing your browser and open it again; Safari sometimes jams up the camera."
				throw errormsg;
			} else if (session.mobile){
				var errormsg = new Error("Time Out\nDid you accept camera permissions in time? Please do so first.\n\nMake sure no other application is using the camera already and that you are using a compatible browser. If issues persist, maybe try the official native mobile app.");
				errormsg.name = "timedOut";
				errormsg.message = "Time Out\nDid you accept camera permissions in time? Please do so first.\n\nMake sure no other application is using the camera already and that you are using a compatible browser. If issues persist, maybe try the official native mobile app."
				throw errormsg;
			} else {
				var errormsg = new Error("Time Out\nDid you accept camera permissions in time? Please do so first.\n\nOtherwise, do you have NDI Tools installed? Maybe try uninstalling it.\n\nPlease also ensure your camera and audio device are correctly connected and not already in use. You may also need to refresh the page.");
				errormsg.name = "timedOut";
				errormsg.message = "Time Out\nDid you accept camera permissions in time? Please do so first.\n\nOtherwise, do you have NDI Tools installed? Maybe try uninstalling it.\n\nPlease also ensure your camera and audio device are correctly connected and not already in use. You may also need to refresh the page."
				throw errormsg;
			}
		})
	])
};


async function shareWebsite(autostart=false, evt=false){
	if (session.iframeSrc){
		
		if (evt && (evt.ctrlKey || evt.metaKey)){
			if (getById("websitesharebutton2").classList.contains("green")){
				var actionMsg = {};
				actionMsg.infocus = false;
				
				for (var UUID in session.pcs){
					if (session.pcs[UUID].allowIframe===true){
						session.sendMessage(actionMsg, UUID);
					}
				}
				
				getById("websitesharebutton2").classList.remove("green");
				getById("websitesharebutton2").title =  "Hold CTRL (or CMD) and click to spotlight this shared website"
			} else {
				if (session.streamID){
					var actionMsg = {};
					actionMsg.infocus = session.streamID;
					
					for (var UUID in session.pcs){
						if (session.pcs[UUID].allowIframe===true){
							session.sendMessage(actionMsg, UUID);
						}
					}
					
					getById("websitesharebutton2").classList.add("green");
					getById("websitesharebutton2").title = "Video is currently spotlighted";
				}
			}
			return;
		}
		getById("websitesharebutton2").classList.remove("green");
		session.iframeSrc = false;
		
		if (session.director){
			clearDirectorSettings();
			//setStorage("directorWebsiteShare", {"website":session.iframeSrc, "roomid":session.roomid});
		}
		getById("websitesharebutton2").classList.add("hidden");
		getById("websitesharebutton").classList.remove("hidden");
		
		var data = {};
		data.iframeSrc = false;
		for (var UUID in session.pcs){
			if (session.pcs[UUID].allowIframe===true){
				session.sendMessage(data, UUID);
			}
		}
		getById("websitesharebutton2").title = "Hold CTRL (or CMD) and click to spotlight this shared website"
		return
	}
	getById("websitesharebutton2").classList.remove("green");
	
	if (autostart===false){
		window.focus();
		var iframeURL = await promptAlt(miscTranslations["enter-website"], false, false, session.defaultIframeSrc);
	} else {
		var iframeURL = autostart;
	}
	if (!iframeURL){
		return;
	}
	if (iframeURL == session.iframeSrc){return;}
	session.defaultIframeSrc = iframeURL;
	
	warnlog(iframeURL);
	
	session.iframeSrc = parseURL4Iframe(iframeURL);
	
	if (session.director){
		setStorage("directorWebsiteShare", {"website":session.iframeSrc, "roomid":session.roomid});
	}
	
	getById("websitesharebutton2").classList.remove("hidden");
	getById("websitesharebutton").classList.add("hidden");
	
	var data = {};
	data.iframeSrc = session.iframeSrc;
	for (var UUID in session.pcs){
		if (session.pcs[UUID].allowIframe===true){
			session.sendMessage(data, UUID);
		}
	}
}
function screenshareTypeDecider(sstype=1){
	if (session.screensharetype){
		sstype = session.screensharetype;
	}
	
	if (sstype==1){
		toggleScreenShare();
	} else if (sstype==2){
		createIframePopup();
	} else if (sstype==3){
		createSecondStream();
	}
}


function createIframePopup() {

	if (session.screenShareElement) {
		postMessageIframe(session.screenShareElement, {"close": true});
		session.screenShareElement.parentNode.removeChild(session.screenShareElement);
		session.screenShareElement = false;
		updateMixer();
		getById("screenshare2button").classList.add("float");
		getById("screenshare2button").classList.remove("float2");
		return;
	}
	
	if ((session.queue && !session.transferred) || (session.screenShareState && !session.queue && session.transferred)){ // if (session.queue || session.transferred){
		//getById("screenshare2button").classList.add("hidden");
		//getById("screensharebutton").classList.remove("hidden");
		toggleScreenShare();
		return;
	} // can't secondary-screen share if in a queue.
	
	if (session.screenshareid) {
		var iFrameID = session.screenshareid;
	} else {
		var iFrameID = session.streamID.substring(0, 12) + "_" + session.generateStreamID(5);
	}

	if (session.exclude) {
		session.exclude.push(iFrameID);
	} else {
		session.exclude = [];
		session.exclude.push(iFrameID);
	}

	var iframe = document.createElement("iframe");
	iframe.allow = "autoplay;camera;microphone;fullscreen;picture-in-picture;display-capture;midi;";
	
	var extras = "";
	if (session.password){
		extras += "&password=" + session.password; // encodeURIComponent(
	}
	
	if (session.privacy){
		extras += "&privacy"; 
	}
	
	if (session.meshcast){
		extras += "&meshcast"; 
	}
	if (session.meshcastBitrate){
		extras += "&mcb="+session.meshcastBitrate; 
	}
	if (session.meshcastScreenShareBitrate){
		extras += "&mcssbitrate="+session.meshcastScreenShareBitrate;
	}
	
	if (session.meshcastScreenShareCodec){
		extras += "&mccodec="+session.meshcastScreenShareCodec; 
	} else if (session.meshcastCodec){
		extras += "&mccodec="+session.meshcastCodec; 
	}
	
	if (session.screensharequality!==false){
		extras += "&q="+session.screensharequality; // &quality works here, since only thing we are doing
	} else if (session.quality!==false){
		extras += "&q="+session.quality;
	} else if (session.quality_ss!==false){
		extras += "&q="+session.quality_ss;
	} else {
		extras += "&q=0";
	}
	
	if (session.screenShareLabel!==false){
		if (session.screenShareLabel){
			extras += "&label="+encodeURIComponent(session.screenShareLabel);
		} else if (session.label){
			extras += "&label="+encodeURIComponent(session.label);
		}
	}
	
	if (session.screensharefps!==false){
		extras += "&maxframerate="+parseInt(session.screensharefps*100)/100.0;
	} 
	if (session.screenshareAEC!==false){
		extras += "&aec=1";
	} 
	if (session.screenshareDenoise!==false){
		extras += "&denoise=1";
	} 
	if (session.screenshareAutogain!==false){
		extras += "&autogain=1";
	}
	if (session.screenshareStereo!==false){
		extras += "&stereo="+session.screenshareStereo;
	}
	
	/* if (session.noScaling){ // session.screenShareState=true already bypasses the optimization logic
		extras += "&noScaling");
	}
	 */
	 
	if (session.muted){
		iframe.src = "./?audiodevice=1&screenshare&transparent&cleanish&noheader&autostart&view&muted&room=" + session.roomid + "&push=" + iFrameID + extras;
	} else {
		iframe.src = "./?audiodevice=1&screenshare&transparent&cleanish&noheader&autostart&view&room=" + session.roomid + "&push=" + iFrameID + extras;
	}
	
	iframe.style.width = "100%";
	iframe.style.height = "100%";
	iframe.style.overflow = "hidden";
	iframe.id = "screensharesource";
	iframe.dataset.sid = "#screensharesource";
	iframe.style.zIndex = "0";


	session.screenShareElement = iframe;
	session.screenShareElement.dataset.doNotMove = true;


	document.getElementById("main").appendChild(iframe);
	
	if (session.screenShareElementHidden){
		session.screenShareElement.style.display = "none";
	}

	updateMixer();
	
	getById("screenshare2button").classList.add("float2");
	getById("screenshare2button").classList.remove("float");

	return; // ignore the rest.
}

function previewWebcam() {

	if (session.taintedSession === null) {
		log("STILL WAITING ON HASH TO VALIDATE");
		setTimeout(function() {
			previewWebcam();
		}, 1000);
		return;
	} else if (session.taintedSession === true) {
		warnlog("HASH FAILED; PASSWORD NOT VALID");
		return;
	} else {
		log("NOT TAINTED");
	}

	if (activatedPreview == true) {
		log("activeated preview return 1");
		return;
	}
	activatedPreview = true;

	if (session.audioDevice === 0) { // OFF
		var constraint = {
			audio: false
		};
	} else if ((session.echoCancellation !== false) && (session.autoGainControl !== false) && (session.noiseSuppression !== false)) { // AUTO
		var constraint = {
			audio: true
		};
	} else { // Disable Echo Cancellation and stuff for the PREVIEW (DEFAULT CAM/MIC)
		var constraint = {
			audio: {}
		};
		if (session.echoCancellation !== false) { // if not disabled, we assume it's on
			constraint.audio.echoCancellation = true;
		} else {
			constraint.audio.echoCancellation = false;
			if (!session.cleanoutput){
				getById("headphoneTip1").classList.remove("hidden");
				getById("headphoneTipContext1").innerHTML = miscTranslations["headphones-tip"];
			}
		}
		if (session.autoGainControl !== false) {
			constraint.audio.autoGainControl = true;
		} else {
			constraint.audio.autoGainControl = false;
		}
		if (session.noiseSuppression !== false) {
			constraint.audio.noiseSuppression = true;
		} else {
			constraint.audio.noiseSuppression = false;
		}
	}

	if (session.videoDevice === 0) {
		constraint.video = false;
	} else {
		constraint.video = true;
	}

	if ((constraint.video === false) && (constraint.audio === false)){
		if (session.autostart) {
			publishWebcam(); // no need to mirror as there is no video...
			return;
		} else {
			getById("getPermissions").style.display = "none";
			if (document.getElementById("gowebcam")) {
				document.getElementById("gowebcam").dataset.ready = "true";
				document.getElementById("gowebcam").dataset.audioready = "true";
				document.getElementById("gowebcam").disabled = false;
				document.getElementById("gowebcam").innerHTML = miscTranslations["start"];
			}
		}
		return;
	}

	enumerateDevices().then(function(devices) {
		log("enumeratated");
		log(devices);
		var vtrue = false;
		var atrue = false;
		devices.forEach(function(device) {
			if (device.kind === 'audioinput') {
				atrue = true;
			} else if (device.kind === 'videoinput') {
				vtrue = true;
			}
		});
		if (atrue === false) {
			constraint.audio = false;
		}
		if (vtrue === false) {
			constraint.video = false;
		}
		setTimeout(function(constraint) {
			requestBasicPermissions(constraint);
		}, 0, constraint);
	}).catch((error) => {
		log("enumeratated failed. Seeking permissions.");
		setTimeout(function(constraint) {
			requestBasicPermissions(constraint);
		}, 0, constraint);
	});
	
}

function requestBasicPermissions(constraint = {video: true, audio: true}) {
	if (session.taintedSession === null) {
		log("STILL WAITING ON HASH TO VALIDATE");
		setTimeout(function(constraint) {
			requestBasicPermissions(constraint);
		}, 1000, constraint);
		return;
	} else if (session.taintedSession === true) {
		warnlog("HASH FAILED; PASSWORD NOT VALID");
		return;
	} else {
		log("NOT TAINTED 1");
	}
	setTimeout(function() {
		getById("getPermissions").style.display = "none";
		getById("gowebcam").style.display = "";
	}, 0);
	log("REQUESTING BASIC PERMISSIONS");

	try {
		var timerBasicCheck = null;
		if (!(session.cleanOutput)) {
			log("Setting Timer for getUserMedia");
			timerBasicCheck = setTimeout(function() {
				if (!(session.cleanOutput)) {
					if (session.mobile){
						warnUser("Notice: Camera timed out\n\nDid you accept the camera permissions?\n\nThis error may also appear if you are in a phone call or another app is already using the camera or microphone.");
					} else {
						warnUser("Camera Access Request Timed Out\nDid you accept camera permissions? Please do so first.\n\nOtherwise, do you have NDI Tools installed? Maybe try uninstalling NDI tools.\n\nPlease also ensure that your camera and audio devices are correctly connected and not already in use. You may also need to refresh the page.");
					}
				}
			}, 10000);
		}

		if (session.audioInputChannels) {
			if (constraint.audio === true) {
				constraint.audio = {};
				constraint.audio.channelCount = session.audioInputChannels;
			} else if (constraint.audio) {
				constraint.audio.channelCount = session.audioInputChannels;
			}
		}

		log("CONSTRAINT");
		log(constraint);
		
		if (session.safemode){
			constraint = {video:true, audio:true};
		}
		getUserMediaRequestID +=1 ;
		var gumID = getUserMediaRequestID;
					
		navigator.mediaDevices.getUserMedia(constraint).then(function(stream) { // Apple needs thi to happen before I can access EnumerateDevices. 
			
			log("got first stream");
			clearTimeout(timerBasicCheck);
			if (getUserMediaRequestID !== gumID) {
				warnlog("GET USER MEDIA CALL HAS EXPIRED 3");
				stream.getTracks().forEach(function(track) {
					stream.removeTrack(track);
					track.stop();
					log("stopping old track");
				});
				return;
			}
			closeModal();
			setupWebcamSelection(stream);
		}).catch(function(err) {
			clearTimeout(timerBasicCheck);
			warnlog("some error with GetUSERMEDIA");
			errorlog(err); /* handle the error */
			if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
				//required track is missing 
			} else if (err.name == "NotReadableError" || err.name == "TrackStartError") {
				//webcam or mic are already in use 
			} else if (err.name == "OverconstrainedError" || err.name == "ConstraintNotSatisfiedError") {
				//constraints can not be satisfied by avb. devices 
			} else if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
				//permission denied in browser 
				if (!(session.cleanOutput)) {
					setTimeout(function() {
						if (window.obsstudio){
							warnUser("Permissions denied.\n\nTo access the camera or microphone from within OBS, please refer to:\n<a href='https://docs.vdo.ninja/guides/share-webcam-from-inside-obs'>docs.vdo.ninja/guides/share-webcam-from-inside-obs</a>.");
						} else {
							warnUser("Permissions denied. Please ensure you have allowed the mic/camera permissions.");
						}
					}, 1);
				}
				return;
			} else if (err.name == "TypeError" || err.name == "TypeError") {
				//empty constraints object 
			} else {
				//permission denied in browser 
				if (!(session.cleanOutput)) {
					setTimeout(function() {
						warnUser(err);
					}, 1);
				}
			}
			errorlog("trying to list webcam again");
			setupWebcamSelection();
		});
	} catch (e) {
		errorlog(e);
		if (!(session.cleanOutput)) {
			if (window.isSecureContext) {
				warnUser("An error has occured when trying to access the webcam or microphone. The reason is not known.");
			} else if ((iOS) || (iPad)) {
				warnUser("iOS version 13.4 and up is generally recommended; older than iOS 11 is not supported.");
			} else {
				warnUser("Error acessing camera or microphone.\n\nThe website may be loaded in an insecure context.\n\nPlease see: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia");
			}
		}
	}
}


function copyFunction(copyText, evt = false) {
	if (evt){
		if ("buttons" in evt) {
			if (evt.buttons !== 0){return;}
		} else if ("which" in evt){
			if (evt.which !== 0){return;}
		}
		popupMessage(evt);
		evt.preventDefault();
		evt.stopPropagation();
	}

	try {
		copyText.select();
		copyText.setSelectionRange(0, 99999);
		document.execCommand("copy");
	} catch (e) {
		var dummy = document.createElement('input');
		document.body.appendChild(dummy);
		dummy.value = copyText;
		dummy.select();
		document.execCommand('copy');
		document.body.removeChild(dummy);
	}
	return false;
}

function generateQRPage() {
	var pass = sanitizePassword(getById("invite_password").value);
	if (pass.length) {
		return generateHash(pass + session.salt, 4).then(function(hash) {
			generateQRPageCallback(hash);
		}).catch(errorlog);
	} else {
		generateQRPageCallback("");
	}
}

async function updateLinkWelcome(arg, input) {
	if (input.checked){
		var response = await promptAlt("Enter the message you'd like the guests to see");
		response = encodeURIComponent(response);
		var param = input.dataset.param.split("=")[0];
		input.dataset.param = param + "=" + response;
	} 
	updateLink(arg, input);
}


function updateLinkWebP(arg, input) {
	if (input.checked){
		if (!((getById("director_block_" + arg).dataset.raw.includes("&broadcast")) || (getById("director_block_" + arg).dataset.raw.includes("?broadcast")))){
			getById("broadcastSlider").checked=true;
			updateLink(arg, getById("broadcastSlider"));
		}
	}
	updateLink(arg, input);
}

function updateLink(arg, input) {
	log("updateLink");
	log(input.dataset.param);
	if (input.checked) {

		getById("director_block_" + arg).dataset.raw += input.dataset.param;

		var string = getById("director_block_" + arg).dataset.raw;

		if ((arg==1) && (getById("obfuscate_director_" + arg).checked)) {
			string = obfuscateURL(string);
		}

		getById("director_block_" + arg).href = string;
		getById("director_block_" + arg).innerText = string;
	} else {
		var string = getById("director_block_" + arg).dataset.raw + "&";
		string = string.replace(input.dataset.param + "&", "&");
		string = string.substring(0, string.length - 1);
		getById("director_block_" + arg).dataset.raw = string;

		if ((arg==1) && (getById("obfuscate_director_" + arg).checked)) {
			string = obfuscateURL(string);
		}

		getById("director_block_" + arg).href = string;
		getById("director_block_" + arg).innerText = string;
	}
	saveDirectorSettings();
}

function changeURL(changeURL){
	window.focus();
	confirmAlt(miscTranslations["director-redirect-1"]+changeURL+miscTranslations["director-redirect-2"]).then(res=>{
		if (res){
			hangup();
			window.location.href = changeURL;
		};
	});
}

function updateLinkInverse(arg, input) {
	log("updateLinkInverse");
	log(input.dataset.param);
	if (!(input.checked)) {

		getById("director_block_" + arg).dataset.raw += input.dataset.param;

		var string = getById("director_block_" + arg).dataset.raw;

		if ((arg==1) && (getById("obfuscate_director_" + arg).checked)) {
			string = obfuscateURL(string);
		}


		getById("director_block_" + arg).href = string;
		getById("director_block_" + arg).innerText = string;
	} else {
		var string = getById("director_block_" + arg).dataset.raw + "&";
		string = string.replace(input.dataset.param + "&", "&");
		string = string.substring(0, string.length - 1);
		getById("director_block_" + arg).dataset.raw = string;

		if ((arg==1) && (getById("obfuscate_director_" + arg).checked)) {
			string = obfuscateURL(string);
		}

		getById("director_block_" + arg).href = string;
		getById("director_block_" + arg).innerText = string;
	}
}

function updateLinkScene(arg, input) {
	log("updateLinkScene");
	var string = getById("director_block_" + arg).dataset.raw;

	if (input.checked) {
		string = changeParam(string, "scene", "0");
	} else {
		string = changeParam(string, "scene", "1");
	}
	getById("director_block_" + arg).dataset.raw = string;

	if ((arg==1) && (getById("obfuscate_director_" + arg).checked)) {
		string = obfuscateURL(string);
	}

	getById("director_block_" + arg).href = string;
	getById("director_block_" + arg).innerText = string;
}

function resetGen() {
	getById("gencontent").style.display = "block";
	getById("gencontent2").style.display = "none";
	getById("gencontent2").className = ""; //container-inner
	getById("gencontent").className = "container-inner"; //
	getById("gencontent2").innerHTML = "";
	getById("videoname4").focus();
}

function generateQRPageCallback(hash) {
	try {
		var title = getById("videoname4").value;
		if (title.length) {
			title = title.replace(/[\W]+/g, "_").replace(/_+/g, '_'); // but not what others might get. TODO: allow for non-alphanumeric characters; santitize, then URL encode instead, 
			title = "&label=" + title;
		}
		var sid = session.generateStreamID();

		var viewstr = "";
		var sendstr = "";

		if (getById("invite_bitrate").checked) {
			viewstr += "&bitrate=20000";
		}
		if (getById("invite_vp9").checked) {
			viewstr += "&codec=vp9";
		}
		if (getById("invite_stereo").checked) {
			viewstr += "&stereo";
			sendstr += "&stereo";
		}
		if (getById("invite_automic").checked) {
			sendstr += "&audiodevice=1";
		}
		if (getById("invite_automic").checked) {
			sendstr += "&audiodevice=1";
		}
		if (getById("invite_effects").checked) {
			sendstr += "&effects";
		}

		if (getById("invite_remotecontrol").checked) { //
			var remote_gen_id = session.generateStreamID();
			sendstr += "&remote=" + remote_gen_id; // security
			viewstr += "&remote=" + remote_gen_id;
		}

		if (getById("invite_joinroom").value.trim().length) {
			sendstr += "&room=" + getById("invite_joinroom").value.trim();
			viewstr += "&scene&room=" + getById("invite_joinroom").value.trim();
		}

		if (getById("invite_password").value.trim().length) {
			sendstr += "&hash=" + hash;
			viewstr += "&password=" + sanitizePassword(getById("invite_password").value.trim());
		}


		if (getById("invite_group_chat_type").value) { //  0 is default
			if (getById("invite_group_chat_type").value == 1) { // no video
				sendstr += "&novideo";
			} else if (getById("invite_group_chat_type").value == 2) { // no view or audio
				sendstr += "&view";
			}
		}

		if (getById("invite_quality").value) {
			if (getById("invite_quality").value == 0) {
				sendstr += "&quality=0";
			} else if (getById("invite_quality").value == 1) {
				sendstr += "&quality=1";
			} else if (getById("invite_quality").value == 2) {
				sendstr += "&quality=2";
			}
		}
		
		var pie = "";
		if (session.customWSS){
			if (session.customWSS!==true){
				pie = "&pie="+session.customWSS;
			}
		}

		sendstr = 'https://' + location.host + location.pathname + '?push=' + sid + sendstr + title + pie;

		if (getById("invite_obfuscate").checked) {
			sendstr = obfuscateURL(sendstr);
		}

		viewstr = 'https://' + location.host + location.pathname + '?view=' + sid + viewstr + title + pie;
		getById("gencontent").style.display = "none";
		getById("gencontent").className = ""; //
		getById("gencontent2").style.display = "block";
		getById("gencontent2").className = "container-inner"; //
		getById("gencontent2").innerHTML = '<br /><div id="qrcode" style="background-color:white;display:inline-block;color:black;max-width:380px;padding:35px 40px 40px 40px;">\
		<h2 style="margin:0 0 8px 0;color:black"  data-translate="invite-link">Guest Invite Link:</h2>\
		<a class="task grabLinks" title="Click to copy guest invite link to clipboard" onclick="copyFunction(this,event)"   \
		style="word-break: break-all;cursor:copy;background-color:#CFC;border: 2px solid black;width:300px;padding:8px;margin:0px;color:#000;"  href="' + sendstr + '" >' + sendstr + ' <i class="las la-paperclip" style="cursor:pointer"></i></a><br /><br /></div>\
			<br /><br />and don\'t forget the<h2 style="color:black">OBS Browser Source Link:</h2><a class="task grabLinks" title="Click to copy or just Drag the link directly into OBS" data-drag="1"  onclick="copyFunction(this,event)"  style="word-break: break-all;margin:0px;cursor:grab;background-color:#FCC;width:380px;padding:10px;border:2px solid black;margin:5px;color:#000;" href="' + viewstr + '" >' + viewstr + ' <i class="las la-paperclip" style="cursor:pointer"></i></a> \
			<br /><br />\
		<span data-translate="please-note-invite-ingestion-link">This invite link and OBS ingestion link are reusable. Only one person may use a specific invite at a time.</span><br /><br /><button onclick="resetGen();" style="font-size:1.2em;paddding:5px;"><i class="las la-redo-alt"></i> Create Another Invite Link</button>';
		var qrcode = new QRCode(getById("qrcode"), {
			width: 300
			, height: 300
			, colorDark: "#000000"
			, colorLight: "#FFFFFF"
			, useSVG: false
		});
		qrcode.makeCode(sendstr);
		setTimeout(function() {
			getById("qrcode").title = "";
			if (getById("qrcode").getElementsByTagName('img').length) {
				getById("qrcode").getElementsByTagName('img')[0].style.cursor = "none";
			}
		}, 100); // i really hate the title overlay that the qrcode function makes

	} catch (e) {
		errorlog(e);
	}
}


function initSceneList(UUID){
	Object.keys(session.sceneList).forEach((scene, index) => {
		if (getById("container_" + UUID).querySelectorAll('[data-scene="'+scene+'"]').length){return;} // already exists.
		var newScene = document.createElement("div");
		newScene.innerHTML = '<button style="margin: 0 5px 10px 5px;" data-sid="'+session.rpcs[UUID].streamID+'" data--u-u-i-d="'+UUID+'" data-action-type="addToScene" data-scene="'+scene+'"   title="Add to Scene '+scene+'" onclick="directEnable(this, event);"><span ><i class="las la-plus-square" style="color:#060"></i> Scene: '+scene+'</span></button>';
		newScene.classList.add("customScene");
		getById("container_" + UUID).appendChild(newScene);
	});
}

function updateSceneList(scene){
	if (!session.director){return;}
	if (scene in session.sceneList){return;}
	if ((parseInt(scene)+"")===scene){
		if ((parseInt(scene)>=0) && (parseInt(scene)<=8)){
			return;
		}
	}
	session.sceneList[scene] = true;
	for (var UUID in session.rpcs){
		var newScene = document.createElement("div");
		newScene.innerHTML = '<button style="margin: 0 5px 10px 5px;" data-sid="'+session.rpcs[UUID].streamID+'" data--u-u-i-d="'+UUID+'" data-action-type="addToScene" data-scene="'+scene+'"  title="Add to Scene '+scene+'" onclick="directEnable(this, event);"><span ><i class="las la-plus-square" style="color:#060"></i> Scene: '+scene+'</span></button>';
		newScene.classList.add("customScene");
		getById("container_" + UUID).appendChild(newScene);
	}
	
	if (session.showDirector){
		if (document.getElementById("container_director")){
			var newScene = document.createElement("div");
			newScene.innerHTML = '<button style="margin: 0 5px 10px 5px;" data-sid="'+session.streamID+'" data-action-type="addToScene" data-scene="'+scene+'"  title="Add to Scene '+scene+'" onclick="directEnable(this, event);"><span ><i class="las la-plus-square" style="color:#060"></i> Scene: '+scene+'</span></button>';
			newScene.classList.add("customScene");
			getById("container_director").appendChild(newScene);
		}
	}
}

var vis = (function() {
	var stateKey, eventKey, keys = {
		hidden: "visibilitychange"
		, webkitHidden: "webkitvisibilitychange"
		, mozHidden: "mozvisibilitychange"
		, msHidden: "msvisibilitychange"
	};
	for (stateKey in keys) {
		if (stateKey in document) {
			eventKey = keys[stateKey];
			break;
		}
	}
	return function(c) {
		if (c) {
			document.addEventListener(eventKey, c);
			//document.addEventListener("blur", c);
			//document.addEventListener("focus", c);
		}
		return !document[stateKey];
	};
})();

function unPauseVideo(videoEle, update=true){
	try {
		if (!videoEle){return;}
		else if (!(videoEle.dataset.UUID in session.rpcs)){return;}
		else if (!("prePausedBandwidth" in session.rpcs[videoEle.dataset.UUID])){return;} // not paused
		session.rpcs[videoEle.dataset.UUID].manualBandwidth = session.rpcs[videoEle.dataset.UUID].prePausedBandwidth;
		session.rpcs[videoEle.dataset.UUID].manualAudioBandwidth = false;
		delete(session.rpcs[videoEle.dataset.UUID].prePausedBandwidth);
		videoEle.classList.remove("paused");
		videoEle.classList.remove("partialFadeout");
		if (update){
			updateMixer();
		}
	}catch(e){errorlog(e);}
}

function pauseVideo(videoEle, update=true){
	if (!videoEle){return;}
	else if (!(videoEle.dataset.UUID in session.rpcs)){return;}
	session.rpcs[videoEle.dataset.UUID].prePausedBandwidth = session.rpcs[videoEle.dataset.UUID].manualBandwidth;
	session.rpcs[videoEle.dataset.UUID].manualBandwidth = 0;
	session.rpcs[videoEle.dataset.UUID].manualAudioBandwidth = 0;
	session.requestRateLimit(0, videoEle.dataset.UUID, true);
	videoEle.classList.add("paused");
	videoEle.classList.add("partialFadeout");
	if (update){
		updateMixer();
	}
}

(function rightclickmenuthing() { // right click menu
	"use strict";

	function clickInsideElement(e, className) {
		var el = e.srcElement || e.target;

		if (el.classList.contains(className)) {
			return el;
		} else {
			while (el = el.parentNode) {
				if (el.classList && el.classList.contains(className)) {
					return el;
				}
			}
		}

		return false;
	}

	function getPosition(event2) {
		var posx = 0;
		var posy = 0;

		if (!event2) var event = window.event;

		if (event2.pageX || event2.pageY) {
			posx = event2.pageX;
			posy = event2.pageY;
		} else if (event2.clientX || event2.clientY) {
			posx = event2.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = event2.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		return {
			x: posx
			, y: posy
		};
	}
	
	var taskItemInContext;
	var clickCoordsX;
	var clickCoordsY;
	var menu = getById("context-menu");
	var menuState = 0;
	var menuWidth;
	var menuHeight;
	var windowWidth;
	var windowHeight;

	function contextListener() {
		document.addEventListener("contextmenu", function(e) {
			
			if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1){
				 if (e && (!e.ctrlKey && !e.metaKey)){return;}
			} else if (e && (e.ctrlKey || e.metaKey)){return;} // allow for development ease
				 
			taskItemInContext = clickInsideElement(e, "task");
			if (taskItemInContext) {
				e.preventDefault();
				e.stopPropagation();
				if (taskItemInContext.dataset && taskItemInContext.dataset.menu){
					toggleMenuOn(taskItemInContext.dataset.menu, taskItemInContext); 
				} else {
					toggleMenuOn();
				}
				positionMenu(e);
				return false;
			} else {
				taskItemInContext = null;
				toggleMenuOff();
			}
		});
	}

	function menuClickListener(e) {
		var clickeElIsLink = clickInsideElement(e, "context-menu__link");
		if (clickeElIsLink) {
			e.preventDefault();
			e.stopPropagation();
			menuItemListener(clickeElIsLink);
			return false;
		} else {
			var button = e.which || e.button;
			if (button === 1) {
				toggleMenuOff();
			}
		}
	}

	function toggleMenuOn(menutype=false, ele=false) {
		if (menutype){
			menu = getById(menutype);
			menuItemSyncState(menu);
			if (menuState !== 1) {
				menuState = 1;
				menu.classList.add("context-menu--active");
				document.addEventListener("click", menuClickListener);
			}
		} else {
			menu = getById("context-menu");
			menuItemSyncState(menu);
			if (menuState !== 1) {
				menuState = 1;
				menu.classList.add("context-menu--active");
				document.addEventListener("click", menuClickListener);
			}
		}
		if (ele && ele.classOptions){
			menu.classList.add(ele.classOptions);
		}
		
	}

	function toggleMenuOff() {
		if (menuState !== 0) {
			menuState = 0;
			menu.classList.remove("context-menu--active");
			document.removeEventListener("click", menuClickListener);
		}
	}
	
	function positionMenu(e) {
		var clickCoords = getPosition(e);
		clickCoordsX = clickCoords.x;
		clickCoordsY = clickCoords.y;

		menuWidth = menu.offsetWidth + 4;
		menuHeight = menu.offsetHeight + 4;

		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;

		if ((windowWidth - clickCoordsX) < menuWidth) {
			menu.style.left = windowWidth - menuWidth + "px";
		} else {
			menu.style.left = clickCoordsX + "px";
		}

		if ((windowHeight - clickCoordsY) < menuHeight) {
			menu.style.top = windowHeight - menuHeight + "px";
		} else {
			menu.style.top = clickCoordsY + "px";
		}
	}

	async function menuItemListener(link) {
		if (link.getAttribute("data-action") === "Open") {
			window.open(taskItemInContext.href);
		} else if (link.getAttribute("data-action") === "Copy") {
			copyFunction(taskItemInContext.href);
		} else if (link.getAttribute("data-action") === "Mirror") {
			if ((taskItemInContext.id == "videosource") || (taskItemInContext.id == "previewWebcam")){
				session.mirrored = !session.mirrored;
				applyMirror(false, taskItemInContext); 
				log("session.mirrored");
			} else {
				if ("mirror" in taskItemInContext){
					taskItemInContext.mirror = !taskItemInContext.mirror;
					applyMirrorGuest(taskItemInContext.mirror, taskItemInContext); 
				} else {
					taskItemInContext.mirror = true;
					applyMirrorGuest(taskItemInContext.mirror, taskItemInContext); 
				}
			}
		} else if (link.getAttribute("data-action") === "FullWindow") { 
			if ((taskItemInContext.id == "videosource") || (taskItemInContext.id == "previewWebcam")){
				session.infocus=true;
			} else {
				session.infocus = taskItemInContext.dataset.UUID;
			}
			updateMixer();
		} else if (link.getAttribute("data-action") === "ShrinkWindow") { 
			session.infocus=false;
			updateMixer();
		} else if (link.getAttribute("data-action") === "Pause") {
			pauseVideo(taskItemInContext);
		} else if (link.getAttribute("data-action") === "UnPause") {
			unPauseVideo(taskItemInContext);
		} else if (link.getAttribute("data-action") === "PiP") {
			togglePictureInPicture(taskItemInContext);
		} else if (link.getAttribute("data-action") === "Record") {
			if (taskItemInContext.stopWriter || taskItemInContext.recording){
				
			} else if (taskItemInContext.startWriter){
				taskItemInContext.startWriter();
			} else {
				recordLocalVideo(null, 4000, taskItemInContext)
			}
		} else if (link.getAttribute("data-action") === "StopRecording") {
			if (taskItemInContext.stopWriter){
				taskItemInContext.stopWriter();
			} else if (taskItemInContext.recording){
				recordLocalVideo("stop", null, taskItemInContext); 
			}
		} else if (link.getAttribute("data-action") === "Cast") {
			//copyFunction(taskItemInContext.href);
		} else if (link.getAttribute("data-action") === "Controls") {
			taskItemInContext.controls = true;
		} else if (link.getAttribute("data-action") === "HideControls") {
			taskItemInContext.controls = false;
		} else if (link.getAttribute("data-action") === "Edit") {
			//copyFunction(taskItemInContext.href);
			var response = await promptAlt("Please note, manual edits to the URL may conflict with the toggles", false, false, taskItemInContext.href);
			if (response){
				taskItemInContext.href = response;
				taskItemInContext.dataset.raw = response;
				taskItemInContext.innerHTML = response;
				
			}
		} else if (link.getAttribute("data-action") === "ShowStats"){
			if ((taskItemInContext.id == "videosource") || (taskItemInContext.id == "previewWebcam")){
				var [menu, innerMenu] = statsMenuCreator();
				menu.interval = setInterval(printMyStats,3000, innerMenu);
				printMyStats(innerMenu);
			} else if (taskItemInContext.dataset.UUID && (taskItemInContext.dataset.UUID in session.rpcs)){
				var [menu, innerMenu] = statsMenuCreator();
				printViewStats(innerMenu, taskItemInContext.dataset.UUID );
				menu.interval = setInterval(printViewStats, session.statsInterval, innerMenu, taskItemInContext.dataset.UUID);
			}
		} else if (link.getAttribute("data-action") === "RemoteHangup") {
			if (session.rpcs[taskItemInContext.dataset.UUID] && session.rpcs[taskItemInContext.dataset.UUID].stats.info && ("remote" in session.rpcs[taskItemInContext.dataset.UUID].stats.info) && session.rpcs[taskItemInContext.dataset.UUID].stats.info.remote){
				var confirmHangup = confirm(miscTranslations["confirm-disconnect-user"]);
				if (confirmHangup) {
					var msg = {};
					msg.hangup = true;
					msg.remote = session.remote;
					session.sendRequest(msg, taskItemInContext.dataset.UUID);
					pokeIframeAPI("hungup", "remote", taskItemInContext.dataset.UUID);
				}
			}
		} else if (link.getAttribute("data-action") === "RemoteReload") {
			if (session.rpcs[taskItemInContext.dataset.UUID] && session.rpcs[taskItemInContext.dataset.UUID].stats.info && ("remote" in session.rpcs[taskItemInContext.dataset.UUID].stats.info) && session.rpcs[taskItemInContext.dataset.UUID].stats.info.remote){
				var confirmReload = confirm(miscTranslations["confirm-reload-user"]);
				if (confirmReload) {
					var msg = {};
					msg.reload = true;
					msg.remote = session.remote;
					session.sendRequest(msg, taskItemInContext.dataset.UUID);
					pokeIframeAPI("reload", "remote", taskItemInContext.dataset.UUID);
				}
			}
		}
		log("Task ID - " + taskItemInContext + ", Task action - " + link.getAttribute("data-action"));
		toggleMenuOff();
	}
	
	function menuItemSyncState(menu) {
		var items = menu.querySelectorAll("[data-action]");
		for (var i=0;i<items.length;i++){
			if (items[i].getAttribute("data-action") === "FullWindow") {
				if ((taskItemInContext.id == "videosource") || (taskItemInContext.id == "previewWebcam")){
					if (session.infocus===true){
						items[i].parentNode.classList.add("hidden");
					} else {
						items[i].parentNode.classList.remove("hidden");
					}
				} else if (taskItemInContext.dataset.UUID === session.infocus){
					items[i].parentNode.classList.add("hidden");
				} else {
					items[i].parentNode.classList.remove("hidden");
				}
			} else if (items[i].getAttribute("data-action") === "ShrinkWindow") {
				if ((taskItemInContext.id == "videosource") || (taskItemInContext.id == "previewWebcam")){
					if (session.infocus===true){
						items[i].parentNode.classList.remove("hidden");
					} else {
						items[i].parentNode.classList.add("hidden");
					}
				} else if (taskItemInContext.dataset.UUID === session.infocus){
					items[i].parentNode.classList.remove("hidden");
				} else {
					items[i].parentNode.classList.add("hidden");
				}
			} else if (items[i].getAttribute("data-action") === "Pause") {
				if (taskItemInContext.dataset.UUID && (taskItemInContext.dataset.UUID in session.rpcs)){
					log("as1");
					if ("prePausedBandwidth" in session.rpcs[taskItemInContext.dataset.UUID]){
						items[i].parentNode.classList.add("hidden");
						log("as2");
					} else {
						items[i].parentNode.classList.remove("hidden");
						log("as3");
					}
				} else {
					items[i].parentNode.classList.add("hidden");
					log("as4");
				}
			} else if (items[i].getAttribute("data-action") === "UnPause") {
				if (taskItemInContext.dataset.UUID && (taskItemInContext.dataset.UUID in session.rpcs)){
					if ("prePausedBandwidth" in session.rpcs[taskItemInContext.dataset.UUID]){
						items[i].parentNode.classList.remove("hidden");
					} else {
						items[i].parentNode.classList.add("hidden");
					}
				} else {
					items[i].parentNode.classList.add("hidden");
				}
			} else if (items[i].getAttribute("data-action") === "Record") {
				if (taskItemInContext.stopWriter || taskItemInContext.recording){
					items[i].parentNode.classList.add("hidden");
				} else {
					items[i].parentNode.classList.remove("hidden");
				}
			} else if (items[i].getAttribute("data-action") === "StopRecording") {
				if (taskItemInContext.stopWriter || taskItemInContext.recording){
					items[i].parentNode.classList.remove("hidden");
				} else {
					items[i].parentNode.classList.add("hidden");
				}
			} else if (items[i].getAttribute("data-action") === "Controls") {
				if (taskItemInContext.controls){
					items[i].parentNode.classList.add("hidden");
				} else {
					items[i].parentNode.classList.remove("hidden");
				}
			} else if (items[i].getAttribute("data-action") === "HideControls") {
				if (taskItemInContext.controls){
					items[i].parentNode.classList.remove("hidden");
				} else {
					items[i].parentNode.classList.remove("hidden");
				}
			} else if (items[i].getAttribute("data-action") === "RemoteHangup") {
				if ((taskItemInContext.id == "videosource") || (taskItemInContext.id == "previewWebcam")){
					items[i].parentNode.classList.add("hidden");
				} else if (session.rpcs[taskItemInContext.dataset.UUID] && session.rpcs[taskItemInContext.dataset.UUID].stats.info && ("remote" in session.rpcs[taskItemInContext.dataset.UUID].stats.info) && session.rpcs[taskItemInContext.dataset.UUID].stats.info.remote){
					items[i].parentNode.classList.remove("hidden");
				} else {
					items[i].parentNode.classList.add("hidden");
				}
			} else if (items[i].getAttribute("data-action") === "RemoteReload") {
				if ((taskItemInContext.id == "videosource") || (taskItemInContext.id == "previewWebcam")){
					items[i].parentNode.classList.add("hidden");
				} else if (session.rpcs[taskItemInContext.dataset.UUID] && session.rpcs[taskItemInContext.dataset.UUID].stats.info && ("remote" in session.rpcs[taskItemInContext.dataset.UUID].stats.info) && session.rpcs[taskItemInContext.dataset.UUID].stats.info.remote){
					items[i].parentNode.classList.remove("hidden");
				} else {
					items[i].parentNode.classList.add("hidden");
				}
			} else if (items[i].getAttribute("data-action") === "TipRightClick") {
				if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1){
					items[i].parentNode.classList.add("hidden");
				} else {
					items[i].parentNode.classList.remove("hidden");
				}
			}
		}
	}
	contextListener();

})();

function popupMessage(e, message = "Copied to Clipboard") { // right click menu

	//if (session.cleanOutput){return;}
	
	var posx = 0;
	var posy = 0;

	if (!e) var e = window.event;

	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	posx += 10;


	var menu =  getById("messagePopup");
	menu.innerHTML = "<center>" + message + "</center>";
	var menuState = 0;
	var menuWidth;
	var menuHeight;
	var menuPosition;
	var menuPositionX;
	var menuPositionY;

	var windowWidth;
	var windowHeight;

	if (menuState !== 1) {
		menuState = 1;
		menu.classList.add("context-menu--active");
	}

	menuWidth = menu.offsetWidth + 4;
	menuHeight = menu.offsetHeight + 4;

	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;

	if ((windowWidth - posx) < menuWidth) {
		menu.style.left = windowWidth - menuWidth + "px";
	} else {
		menu.style.left = posx + "px";
	}

	if ((windowHeight - posy) < menuHeight) {
		menu.style.top = windowHeight - menuHeight + "px";
	} else {
		menu.style.top = posy + "px";
	}

	
	function toggleMenuOff() {
		if (menuState !== 0) {
			menuState = 0;
			menu.classList.remove("context-menu--active");
		}
	}
	menu.classList.remove("fadeout");
	
	setTimeout(function() {
		menu.classList.add("fadeout");
	}, 500);
	
	setTimeout(function() {
		toggleMenuOff();
	}, 1500);
}

function timeSince(date) {

	var seconds = Math.floor((new Date() - date) / 1000);

	var interval = seconds / 31536000;

	if (interval > 1) {
		return Math.floor(interval) + " years";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + " months";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return Math.floor(interval) + " days";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + " hours";
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + " minutes";
	}
	return "Seconds ago";
}

var messageList = []
function sendChatMessage(chatMsg = false) { // filtered + visual
	var data = {};
	if (chatMsg === false) {
		var msg = document.getElementById('chatInput').value;
	} else {
		var msg = chatMsg;
	}
	//msg = sanitizeChat(msg);
	if (msg == "") {
		return;
	}
	
	msg = convertShortcodes(msg);
	
	var label = "";
	if (session.label){
		if (session.director){
			label = "<b><i><span class='chat_name'>" + session.label + "</span>:</i></b> ";
		} else {
			label = "<b><span class='chat_name'>" + session.label + "</span>:</b> ";
		}
	} else if (session.director){
		label = "<b><i><span class='chat_name'>Director</span>:</i></b> ";
	}
	
	if (msg.trim()==="/list"){
		var listMsg = null;
		for (var UUID in session.rpcs){
			if (session.rpcs[UUID].label){
				listMsg = UUID+": "+session.rpcs[UUID].label
			} else if (session.directorList.indexOf(UUID)>=0){
				listMsg = UUID+": Director";
			} else {
				listMsg = UUID+": Unknown User";
			}
			var data = {};
			data.msg = listMsg;
			data.label = false;
			data.type = "alert";
			data.time = Date.now();
			messageList.push(data);
		}
		for (var UUID in session.pcs){
			if (UUID in session.rpcs){continue;}
			if (session.pcs[UUID].label){
				listMsg = UUID+"; "+session.pcs[UUID].label
			} else if (session.directorList.indexOf(UUID)>=0){
				listMsg = UUID+"; Director";
			} else {
				listMsg = UUID+"; Unknown User";
			}
			var data = {};
			data.msg = listMsg;
			data.label = false;
			data.type = "alert";
			data.time = Date.now();
			messageList.push(data);
		}
		if (listMsg===null){
			data.msg = "No other users are connected to you";
			data.label = false;
			data.type = "alert";
			data.time = Date.now();
			messageList.push(data);
		}
	} else if (msg.startsWith("\/msg ")){
		var msg = msg.split("\/msg ")[1];
		msg = msg.split(" ");
		uid = msg.shift().toLowerCase();
		msg = msg.join(" ");
		if (msg == ""){return;}
		var sent = false;
		for (var UUID in session.rpcs){
			if (UUID.startsWith(uid)){
				sendChat(msg, UUID); // send message to peers
				var data = {};
				data.time = Date.now();
				data.msg = sanitizeChat(msg); // this is what the other person should see
				data.label = label;
				data.type = "sent";
				messageList.push(data);
				sent=true;
			} else if (session.rpcs[UUID].label && session.rpcs[UUID].label.toLowerCase().startsWith(uid)){
				sendChat(msg, UUID); // send message to peers
				var data = {};
				data.time = Date.now();
				data.msg = sanitizeChat(msg); // this is what the other person should see
				data.label = label;
				data.type = "sent";
				messageList.push(data);
				sent=true;
			} else if ((session.directorList.indexOf(UUID)>=0) && "director".startsWith(uid)){
				sendChat(msg, UUID); // send message to peers
				var data = {};
				data.time = Date.now();
				data.msg = sanitizeChat(msg); // this is what the other person should see
				data.label = label;
				data.type = "sent";
				messageList.push(data);
				sent=true;
			}
		}
		for (var UUID in session.pcs){
			if (UUID in session.rpcs){continue;}
			if (UUID.startsWith(uid)){
				sendChat(msg, UUID); // send message to peers
				var data = {};
				data.time = Date.now();
				data.msg = sanitizeChat(msg); // this is what the other person should see
				data.label = label;
				data.type = "sent";
				messageList.push(data);
				sent=true;
			} else if (session.pcs[UUID].label && session.pcs[UUID].label.toLowerCase().startsWith(uid)){
				sendChat(msg, UUID); // send message to peers
				var data = {};
				data.time = Date.now();
				data.msg = sanitizeChat(msg); // this is what the other person should see
				data.label = label;
				data.type = "sent";
				messageList.push(data);
				sent=true;
			} else if ((session.directorList.indexOf(UUID)>=0) && "director".startsWith(uid)){
				sendChat(msg, UUID); // send message to peers
				var data = {};
				data.time = Date.now();
				data.msg = sanitizeChat(msg); // this is what the other person should see
				data.label = label;
				data.type = "sent";
				messageList.push(data);
				sent=true;
			}
		}
		if (sent == false){
			var data = {};
			data.msg = "No user found. Message not sent.";
			data.label = false;
			data.type = "alert";
			data.time = Date.now();
			messageList.push(data);
			updateMessages();
			return;
		}
	} else if (msg.startsWith("\/")){
		data.msg = "Unknown command. Try '/list' or '/msg username message'.";
		data.label = false;
		data.type = "alert";
		data.time = Date.now();
		messageList.push(data);
		updateMessages();
		return;
	} else if (session.directorChat===true){
		if (session.directorList.length){
			for (var i = 0;i<session.directorList.length;i++){
				sendChat(msg, session.directorList[i]); // send message to peers
			}
			var data = {};
			data.time = Date.now();
			data.msg = sanitizeChat(msg); // this is what the other person should see
			data.label = label;
			data.type = "sent";
			messageList.push(data);
		}
	} else {
		sendChat(msg); // send message to peers
		data.time = Date.now();
		data.msg = sanitizeChat(msg); // this is what the other person should see
		data.label = label;
		data.type = "sent";
		messageList.push(data);
	}
	document.getElementById('chatInput').value = "";
	
	messageList = messageList.slice(-100);
	if (session.broadcastChannel !== false) {
		log(session.broadcastChannel);
		session.broadcastChannel.postMessage(data);
	}
	updateMessages();
}

function toggleQualityDirector(bitrate, UUID, ele = null) { // ele is specific to the button in the director's room
	var eles = ele.parentNode.childNodes;
	for (var i=0;i<eles.length;i++) {
		eles[i].className = "";
	}
	ele.classList.add("pressed");
	session.requestRateLimit(bitrate, UUID);
}

var clockOverlayTimer = null;
function zpadTime(number) {
    var output = '' + number;
    while (output.length < 2) {
        output = '0' + output;
    }
    return output;
}
function showClock(){
	getById("overlayClockContainer").classList.remove("hidden");
}
function hideClock(){
	getById("overlayClockContainer").classList.add("hidden");
}
function setClock(initial=false){
	if (initial!==false){
		initial = parseInt(initial);
		getById("overlayClockContainer").dataset.initial = initial;
	} else {
		initial = parseInt(getById("overlayClockContainer").dataset.initial);
	}
	//getById("overlayClock").dataset.current = initial;
	
	var minutes = Math.floor(initial/60);
	var seconds = initial%60;
	getById("overlayClock").innerHTML = zpadTime(minutes)+":"+zpadTime(seconds);
	getById("overlayClock").style.backgroundColor = "#0009";
}
function stopClock(){
	clearInterval(clockOverlayTimer);
	setClock();
}
function pauseClock(){
	clearInterval(clockOverlayTimer);
	var current = Date.now() - parseInt(getById("overlayClockContainer").dataset.timestamp);
	current = parseInt(getById("overlayClockContainer").dataset.initial) - parseInt(Math.round(current/1000));
	getById("overlayClockContainer").dataset.initial = current;
	getById("overlayClock").style.backgroundColor = "#00F9";
}
function resumeClock(){
	startClock();
}
function startClock(){
	clearInterval(clockOverlayTimer);
	getById("overlayClockContainer").dataset.timestamp = Date.now();
	getById("overlayClock").style.backgroundColor = "#0009";
	stepClock();
	clockOverlayTimer = setInterval(function(){
		stepClock();
	},999);
}
function stepClock(){
	var current = Date.now() - parseInt(getById("overlayClockContainer").dataset.timestamp);
	current = parseInt(getById("overlayClockContainer").dataset.initial) - parseInt(Math.round(current/1000));
	//getById("overlayClockContainer").dataset.current = current;
	if (session.directorList.length) {
		var msg = {};
		msg.timer = current;
		for (var i = 0;i<session.directorList.length;i++){
			msg.UUID = session.directorList[i];
			session.sendMessage(msg, msg.UUID);
		}
	}
	if (current<0) {
		if (current%2){
			getById("overlayClock").style.backgroundColor = "#F009";
		} else {
			getById("overlayClock").style.backgroundColor = "#0009";
		}
		getById("overlayClock").innerHTML = "00:00";
	} else {
		var minutes = Math.floor(current/60);
		var seconds = current%60;
		getById("overlayClock").innerHTML = zpadTime(minutes)+":"+zpadTime(seconds);
	}
}

function createPopoutChat() {
	if (session.broadcastChannelID===false){
		session.broadcastChannelID = session.generateStreamID(8);
	}
	log(session.broadcastChannelID);
	window.open('./popout.html?id=' + session.broadcastChannelID, 'popup', 'width=600,height=480,toolbar=no,menubar=no,resizable=yes');
	session.broadcastChannel = new BroadcastChannel(session.broadcastChannelID);
	session.broadcastChannel.onmessage = function(e) {
		if ("loaded" in e.data) {
			session.broadcastChannel.postMessage({
				messageList: messageList
			});
		} else if ("msg" in e.data) {
			sendChatMessage(e.data.msg);
		}
	}
	return false;
}

function getChatMessage(msg, label = false, director = false, overlay = false) {

	msg = sanitizeChat(msg); // keep it clean.
	if (msg == "") {
		return;
	}

	if (label) {
		label = sanitizeLabel(label);
	}

	data = {};
	data.time = Date.now();
	data.msg = msg;
	if (label) {
		data.label = label;
		if (director) {
			data.label = "<b><i><span class='chat_director chat_name'>" + data.label + "</span>:</i></b> ";
		} else {
			data.label = "<b><span class='chat_name'>" + data.label + "</span>:</b> ";
		}
		label = "<span class='chat_name'>"+label+"</span>:"; // label+":";
	} else if (director) {
		data.label = "<b><i><span class='chat_director chat_name'>Director</span>:</i></b> ";
		label = "<span class='chat_director chat_name'>Director</span>:";
	} else {
		if (session.director){
			data.label = "<span class='chat_name'>Someone</span>: ";
		} else {
			data.label = "";
		}
		label = "";
	}
	data.type = "recv";
	
	if (overlay) {
		if (!(session.cleanOutput && session.cleanish==false)){
			var textOverlay = getById("overlayMsgs");
			if (textOverlay) {
				var spanOverlay = document.createElement("span");
				spanOverlay.innerHTML = "<b><i>" + label + "</i></b> " + msg + "<br />";
				textOverlay.appendChild(spanOverlay);
				textOverlay.style.display = "block";
				var showtime = msg.length * 200 + 3000;
				if (showtime > 8000) {
					showtime = 8000;
				}
				setTimeout(function(ele) {
					ele.parentNode.removeChild(ele);
				}, showtime, spanOverlay);
			}
		}
	}
	
	if (isIFrame) {
		parent.postMessage({
			"gotChat": data
		}, "*");
	}

	if (session.chatbutton===false){return;} // messages can still appear as overlays ^
	
	messageList.push(data);
	messageList = messageList.slice(-100);

	if (session.beepToNotify) {
		playtone();
		showNotification("new message", msg);
	}
	updateMessages();

	if (session.chat == false) {
		getById("chattoggle").className = "las la-comments my-float toggleSize puslate";
		getById("chatbutton").className = "float";

		if (getById("chatNotification").value) {
			getById("chatNotification").value = getById("chatNotification").value + 1;
		} else {
			getById("chatNotification").value = 1;
		}
		getById("chatNotification").classList.add("notification");

	}

	
	if (session.broadcastChannel !== false) {
		session.broadcastChannel.postMessage(data); /* send */
	}

}

function updateClosedCaptions(msg, label, UUID) {
	msg.counter = parseInt(msg.counter);
	var temp = document.createElement('div');
	temp.innerText = msg.transcript;
	temp.innerText = temp.innerHTML;
	var transcript = temp.textContent || temp.innerText || "";

	if (transcript == "") {
		return;
	}

	transcript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
	//transcript = transcript.substr(-1, 5000); // keep it from being too long


	if (label && (!(session.view && !session.view_set))) {
		label = sanitizeLabel(label);
		label = "<b>" + label + ":</b> ";
	} else {
		label = "";
	}

	var textOverlay = getById("overlayMsgs");
	if (textOverlay) {
		if (document.getElementById(UUID + "_" + msg.counter)) {
			var spanOverlay = document.getElementById(UUID + "_" + msg.counter);
		} else {
			var spanOverlay = document.createElement("span");
			spanOverlay.id = UUID + "_" + msg.counter;
			textOverlay.appendChild(spanOverlay);
			textOverlay.style.height = "unset";
			textOverlay.style.textAlign = "left";
			textOverlay.style.display = "block";
			textOverlay.style.position = "fixed";
			textOverlay.style.bottom = "0";
			
		}
		spanOverlay.innerHTML = label + transcript + "<br />";
		spanOverlay.style.fontSize = (parseInt(session.labelsize || 100) / 100.0 * 4.5) + "vh";
		spanOverlay.style.lineHeight = (parseInt(session.labelsize || 100) / 100 * 6) + "vh";
		spanOverlay.style.margin = (parseInt(session.labelsize || 100) / 100.0 * 0.75) + "vh";

		if (msg.isFinal) {
			var showtime = 3000;
			clearTimeout(spanOverlay.timeout);
			spanOverlay.timeout = setTimeout(function(ele) {
				ele.parentNode.removeChild(ele);
			}, showtime, spanOverlay);
		} else {
			clearTimeout(spanOverlay.timeout);
			spanOverlay.timeout = setTimeout(function(ele) {
				ele.parentNode.removeChild(ele);
			}, 30000, spanOverlay);
		}

	}
}

var chatUpdateTimeout = null;
function updateMessages(){
	if (session.chatbutton===false){return;}
	document.getElementById("chatBody").innerHTML = "";
	for (var i in messageList) {

		var time = timeSince(messageList[i].time) || "";
		var msg = document.createElement("div");
		
		if (messageList[i].type == "sent") {
			msg.innerHTML = messageList[i].msg + " <i><small> <small>- " + time + "</small></small></i>";
			msg.classList.add("outMessage");
		} else if ((messageList[i].type == "recv") || (messageList[i].type == "action")) {
			var label = "";
			if (messageList[i].label) {
				label = messageList[i].label;
			}
			msg.innerHTML = label + messageList[i].msg + " <i><small> <small>- " + time + "</small></small></i>";
			msg.classList.add("inMessage");
		} else if (messageList[i].type == "alert") {
			msg.innerHTML = messageList[i].msg + " <i><small> <small>- " + time + "</small></small></i>";
			msg.classList.add("inMessage");
		} else {
			msg.innerHTML = messageList[i].msg;
			msg.classList.add("outMessage");
		}

		document.getElementById("chatBody").appendChild(msg);
	}
	showDownloadLinks();
	for (var i in msgTransferList) {
		var time = timeSince(msgTransferList[i].time) || "";
		var msg = document.createElement("div");
		if ("idx" in msgTransferList[i]){
			msg.id = "transfer_"+msgTransferList[i].idx;
		}
		if (msgTransferList[i].type == "sent") {
			msg.innerHTML = msgTransferList[i].msg + " <i><small> <small>- " + time + "</small></small></i>";
			msg.classList.add("outMessage");
		} else if ((msgTransferList[i].type == "recv") || (msgTransferList[i].type == "action")) {
			var label = "";
			if (msgTransferList[i].label) {
				label = msgTransferList[i].label;
			}
			msg.innerHTML = label + msgTransferList[i].msg + " <i><small> <small>- " + time + "</small></small></i>";
			msg.classList.add("inMessage");
		} else if (msgTransferList[i].type == "alert") {
			msg.innerHTML = msgTransferList[i].msg + " <i><small> <small>- " + time + "</small></small></i>";
			msg.classList.add("inMessage");
		} else {
			msg.innerHTML = msgTransferList[i].msg;
			msg.classList.add("outMessage");
		}
		document.getElementById("chatBody").appendChild(msg);
	}
	if (chatUpdateTimeout) {
		clearInterval(chatUpdateTimeout);
	}
	document.getElementById("chatBody").scrollTop = document.getElementById("chatBody").scrollHeight;
	chatUpdateTimeout = setTimeout(function() {
		updateMessages();
	}, 60000);
}

function EnterButtonChat(event) {
	// Number 13 is the "Enter" key on the keyboard
	var key = event.which || event.keyCode;
	if (key === 13) {
		// Cancel the default action, if needed
		event.preventDefault();
		// Trigger the button element with a click
		sendChatMessage();
	}
}

function showCustomizer(arg, ele) {
	//getById("directorLinksButton").innerHTML='<i class="las la-caret-right"></i><span data-translate="hide-the-links"> LINKS (GUEST INVITES & SCENES)</span>'
	getById("showCustomizerButton1").style.backgroundColor = "";
	getById("showCustomizerButton2").style.backgroundColor = "";
	getById("showCustomizerButton3").style.backgroundColor = "";
	getById("showCustomizerButton4").style.backgroundColor = "";
	getById("showCustomizerButton1").style.boxShadow = "";
	getById("showCustomizerButton2").style.boxShadow = "";
	getById("showCustomizerButton3").style.boxShadow = "";
	getById("showCustomizerButton4").style.boxShadow = "";


	if (getById("customizeLinks" + arg).style.display != "none") {
		getById("customizeLinks").style.display = "none";
		getById("customizeLinks" + arg).style.display = "none";
	} else {
		//directorLinks").style.display="none";
		getById("showCustomizerButton" + arg).style.backgroundColor = "#1e0000";
		getById("showCustomizerButton" + arg).style.boxShadow = "inset 0px 0px 1px #b90000";
		getById("customizeLinks1").style.display = "none";
		getById("customizeLinks3").style.display = "none";
		getById("customizeLinks").style.display = "block";
		getById("customizeLinks" + arg).style.display = "block";
	}
}

var PPTHotkey = getStorage("PPTHotkey") || false;
if (PPTHotkey){
	var key = "";
	if (PPTHotkey.ctrl){
		key += "Control";
	}
	if (PPTHotkey.meta){
		if (key){
			key += " + ";
		}
		key += "Meta";
	}
	if (PPTHotkey.alt){
		if (key){
			key += " + ";
		}
		key += "Alt";
	}
	
	if (PPTHotkey.key=="Control"){
		//
	} else if (PPTHotkey.key=="Alt"){
		//
	} else if (PPTHotkey.key=="Meta"){
		//
	} else if (PPTHotkey.key !== false){
		if (key){
			key += " + ";
		}
		if (PPTHotkey.key === " "){
			key += "Space"
		} else {
			key += PPTHotkey.key;
		}
	} else if (key && (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1)){
		getById("pptHotKey").title = "Note: Global hot-keys can't simply be Control, Alt, or Meta keys.";
	}
	getById("pptHotKey").value = key;
	
	try {
		if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
			if (!ipcRenderer){
				ipcRenderer = require('electron').ipcRenderer;
			}
			ipcRenderer.send('PPTHotkey', PPTHotkey);
		}
	} catch(e){}
}

function setHotKey(keyinput=true){
	if (!keyinput){ // clears if false
		getById("pptHotKey").value = "";
		PPTHotkey = false;
		removeStorage("PPTHotkey");
		
		try {
			if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
				if (!ipcRenderer){
					ipcRenderer = require('electron').ipcRenderer;
				}
				ipcRenderer.send('PPTHotkey', PPTHotkey);
			}
		} catch(e){}
		
		return;
	}
	
	PPTHotkey = {
		ctrl:false,
		alt: false,
		meta: false,
		key: false
	};
	
	log(event);
	var key = "";
	if (event.ctrlKey){
		key += "Control";
		PPTHotkey.ctrl = true;
	}
	if (event.metaKey){
		if (key){
			key += " + ";
		}
		key += "Meta";
		PPTHotkey.meta = true;
	}
	if (event.altKey){
		if (key){
			key += " + ";
		}
		key += "Alt";
		PPTHotkey.alt = true;
	}
	
	if (event.key=="Control"){
		//
	} else if (event.key=="Alt"){
		//
	} else if (event.key=="Meta"){
		//
	} else if (event.key || (event.key === " " || (event.key===0))){
		if (key){
			key += " + ";
		}
		if (event.key === " "){
			key += "Space"
		} else {
			key += event.key;
		}
		PPTHotkey.key = event.key;
	}
	setStorage("PPTHotkey", PPTHotkey, 99999);
	event.target.value = key;
	
	try {
		if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
			if (!ipcRenderer){
				ipcRenderer = require('electron').ipcRenderer;
			}
			ipcRenderer.send('PPTHotkey', PPTHotkey);
			log("sending IPC PPTHotkey value");
		}
	} catch(e){}
	
	event.preventDefault();
	event.stopPropagation();
	return false;
}

var defaultRecordingBitrate = false;
async function recordVideo(target, event = null, videoKbps = false) { // event.currentTarget,this.parentNode.parentNode.dataset.UUID

	var UUID = target.dataset.UUID;
	var video = session.rpcs[UUID].videoElement;
	
	if (video.stopWriter){
		video.stopWriter();
		updateLocalRecordButton(UUID, -1);
		return;
	} else if (video.startWriter){
		await video.startWriter();
		updateLocalRecordButton(UUID, 0);
		return;
	}
	
	
	var audioKbps = false;

	if (event === null) {
		if (defaultRecordingBitrate === null) {
			updateLocalRecordButton(UUID, -1);
			return;
		}
	} else if ((event.ctrlKey) || (event.metaKey)) {
		updateLocalRecordButton(UUID, -3);
		Callbacks.push([recordVideo, target, null, false]);
		log("Record Video queued");
		defaultRecordingBitrate = false;
		return;
	} else {
		defaultRecordingBitrate = false;
	}

	log("Record Video Clicked");
	if ("recording" in video) {
		log("ALREADY RECORDING!");
		updateLocalRecordButton(UUID, -2);
		video.recorder.stop();
		session.requestRateLimit(35, UUID); // 100kbps
		if (session.audiobitrate===false){
			session.requestAudioRateLimit(-1,UUID);
		}
		
		var elements = document.querySelectorAll('[data-action-type="change-quality2"][data--u-u-i-d="' + UUID + '"]');
		if (elements[0]) {
			elements[0].classList.add("pressed");
		}
		var elements = document.querySelectorAll('[data-action-type="change-quality1"][data--u-u-i-d="' + UUID + '"]');
		if (elements[0]) {
			elements[0].classList.remove("pressed");
		}
		var elements = document.querySelectorAll('[data-action-type="change-quality3"][data--u-u-i-d="' + UUID + '"]');
		if (elements[0]) {
			elements[0].classList.remove("pressed");
		}
		return;
	} else {
		updateLocalRecordButton(UUID, 0);
		//target.style.backgroundColor = "#FCC";
		//target.innerHTML = "<i style='font-size:110%;' class='las la-file-download'></i> <span data-translate='Download'>Download</span>";
		video.recording = true;
	}

	video.recorder = {};

	if (videoKbps == false) {
		if (defaultRecordingBitrate == false) {
			videoKbps = 4000; // 4mbps recording bitrate
			window.focus();
			videoKbps = await promptAlt(miscTranslations["press-ok-to-record"], false, false, videoKbps);
			if (videoKbps === null) {
				//target.style.backgroundColor = null;
				//target.innerHTML = '<i class="las la-circle"></i><span data-translate="record"> record local</span>';
				updateLocalRecordButton(UUID, -1);
				target.style.backgroundColor = "";
				delete(video.recorder);
				delete(video.recording);
				defaultRecordingBitrate = null;
				return;
			}
			videoKbps = parseInt(videoKbps);
			defaultRecordingBitrate = videoKbps;
		} else {
			videoKbps = defaultRecordingBitrate;
		}
	}

	if (videoKbps <= 0) {
		audioKbps = videoKbps * (-1);
		videoKbps = false;
		if (session.audiobitrate===false){
			if ((audioKbps>0) && (audioKbps>=128)){
				session.requestAudioRateLimit(128,UUID); // no point going higher
			} else if (audioKbps==0){
				session.requestAudioRateLimit(256,UUID); // PCM
			} else {
				session.requestAudioRateLimit(parseInt(audioKbps),UUID); // exact? sure. why not.
			}
		}
	} else if (videoKbps < 50) { // this just makes sure you can't set 0 on the record bitrate.
		videoKbps = 50;
		session.requestRateLimit(parseInt(videoKbps * 0.8), UUID); // 3200kbps transfer bitrate. Less than the recording bitrate, to avoid waste.
	} else {
		session.requestRateLimit(parseInt(videoKbps * 0.8), UUID); // 3200kbps transfer bitrate. Less than the recording bitrate, to avoid waste.
		
		if (videoKbps>4000){
			if (session.audiobitrate===false){
				if (session.pcm){
					session.requestAudioRateLimit(256,UUID);
				} else {
					session.requestAudioRateLimit(128,UUID);
				}
			}
		} else if (videoKbps>2500){
			if (session.audiobitrate===false){
				if (session.pcm){
					session.requestAudioRateLimit(256,UUID);
				} else {
					session.requestAudioRateLimit(80,UUID);
				}
			}
		}
		
	}

	var timestamp = Date.now();
	var filename = "";
	if (session.rpcs[UUID].label || session.rpcs[UUID].streamID) {
		filename = session.rpcs[UUID].label || session.rpcs[UUID].streamID;
		filename = filename.replace(/[\W]+/g, "_");
		filename = filename.substring(0, 200);
	}

	filename += "_" + timestamp.toString();

	var cancell = false;
	if (typeof video.srcObject === "undefined" || !video.srcObject) {
		return;
	}

	video.recorder.stop = function(restart = false, notify = false) {
		if (!video.recording) {
			errorlog("ALREADY STOPPED");
			updateLocalRecordButton(UUID, -1);
			return;
		}
		
		if (notify){
			if (!session.cleanOutput){
				warnUser("A local recording has stopped unexpectedly.");
			}
			if (session.beepToNotify){
				playtone();
				
			}
			target.classList.remove("shake");
			setTimeout(function(target){target.classList.add("shake");},10, target);
		}
		
		video.recording = false;
		updateLocalRecordButton(UUID, -2);
		try {
			if (video.recorder.mediaRecorder.state !== "inactive") {
				video.recorder.mediaRecorder.stop();
			}
		} catch (e) {
			errorlog(e);
		}

		session.requestRateLimit(35, UUID); // 100kbps
		if (session.audiobitrate===false){
			session.requestAudioRateLimit(-1,UUID);
		}
		var elements = document.querySelectorAll('[data-action-type="change-quality2"][data--u-u-i-d="' + UUID + '"]');
		if (elements[0]) {
			elements[0].classList.add("pressed");
		}
		var elements = document.querySelectorAll('[data-action-type="change-quality1"][data--u-u-i-d="' + UUID + '"]');
		if (elements[0]) {
			elements[0].classList.remove("pressed");
		}
		var elements = document.querySelectorAll('[data-action-type="change-quality3"][data--u-u-i-d="' + UUID + '"]');
		if (elements[0]) {
			elements[0].classList.remove("pressed");
		}

		cancell = true;
		// log('Recorded Blobs: ', recordedBlobs);
		// download();
		setTimeout((writer1,UUID1,video1) => {
			try{
				writer1.close();
			} catch(e){}
			updateLocalRecordButton(UUID1, -1);
			delete(video1.recorder);
			delete(video1.recording);
		}, 1200, writer, UUID, video);
	};
	
	const {readable, writable} = new TransformStream({
		transform: (chunk, ctrl) => chunk.arrayBuffer().then(b => ctrl.enqueue(new Uint8Array(b)))
	});
	var writer = writable.getWriter();
	readable.pipeTo(streamSaver.createWriteStream(filename.toString() + '.webm',  video.recorder.stop));
	video.recorder.writer = writer;
	pokeIframeAPI("recording-started");

	let options = {};

	if (videoKbps) {
		var tryCodec = false;
		if (session.recordingVideoCodec){
			tryCodec = session.recordingVideoCodec;
		}
		if (tryCodec && MediaRecorder.isTypeSupported('video/webm;codecs='+tryCodec)) {
			if (!session.cleanOutput){
				warnUser("The browser 'says' it supports "+tryCodec);
			}
			options.mimeType = 'video/webm;codecs='+tryCodec;
			if (session.pcm){
				if (MediaRecorder.isTypeSupported('video/webm;codecs="'+tryCodec+', pcm"')){
					options.mimeType = 'video/webm;codecs="'+tryCodec+', pcm"';
				} else {
					options.mimeType = "video/webm;codecs=pcm";
				}
			}
		} else {
			if (session.pcm){
				if (MediaRecorder.isTypeSupported("video/webm;codecs=pcm")) {
					options.mimeType = "video/webm;codecs=pcm";
				} else {
					options.mimeType = "video/webm";
				}
			} else {
				options.mimeType = "video/webm";
			}
		}
		if (videoKbps < 1000) {
			options.videoBitsPerSecond = parseInt(videoKbps * 1024); // 100 kbps audio
		} else {
			options.bitsPerSecond = parseInt(videoKbps * 1024); // 100 to 132 kbps audio
		}
		video.recorder.mediaRecorder = new MediaRecorder(video.srcObject, options);
	} else {
		options.mimeType = 'audio/webm';
		if (audioKbps == 0) {
			if (MediaRecorder.isTypeSupported("audio/webm;codecs=pcm")) {
				options.mimeType = "audio/webm;codecs=pcm";
			}
		} else {
			options.bitsPerSecond = parseInt(audioKbps * 1024);
		}
		var stream = createMediaStream();
		video.srcObject.getAudioTracks().forEach((track) => {
			stream.addTrack(track, video.srcObject);
		});
		video.recorder.mediaRecorder = new MediaRecorder(stream, options);
	}
	log(options);

	function download() {
		const blob = new Blob(recordedBlobs, {
			type: "video/webm"
		});
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = filename + ".webm";
		document.body.appendChild(a);
		a.click();
		setTimeout(function(uu,aa){
			document.body.removeChild(aa);
			window.URL.revokeObjectURL(uu);
		}, 100, url,a);
	}

	function handleDataAvailable(event) {
		if (event.data && event.data.size > 0) {
			//recordedBlobs.push(event.data);
			try{
				writer.write(event.data); ////////////
				if (video.recording) {
					updateLocalRecordButton(UUID, (parseInt((Date.now() - timestamp) / 1000) || 0));
				}
			} catch(e){warnlog("Stream recording error or ended");}
		}
	}

	video.recorder.mediaRecorder.ondataavailable = handleDataAvailable;

	video.recorder.mediaRecorder.onerror = function(event) {
		errorlog(event);
		video.recorder.stop();
		session.requestRateLimit(35, UUID);
		if (!(session.cleanOutput)) {
			setTimeout(function() {
				warnUser("an error occured with the media recorder; stopping recording");
			}, 1);
		}
	};

	video.srcObject.ended = function(event) {
		video.recorder.stop();
		session.requestRateLimit(35, UUID);
		if (!(session.cleanOutput)) {
			setTimeout(function() {
				warnUser("stream ended! stopping recording");
			}, 1);
		}
	};


	setTimeout(function(v) {
		v.recorder.mediaRecorder.start(1000);
	}, 500, video); // 100ms chunks

	return;
}

function updateRemoteRecordButton(UUID, recorder) {
	var elements = document.querySelectorAll('[data-action-type="recorder-remote"][data--u-u-i-d="' + UUID + '"]');
	if (elements[0]) {
		var time = parseInt(recorder) || 0;
		if (time == -4) {
			if (!session.cleanOutput){
				warnUser("A remote recording has stopped unexpectedly.\n\nDid a user cancel the file downlaod?");
			}
			if (session.beepToNotify){
				playtone();
			}
			elements[0].classList.add("pressed");
			elements[0].classList.remove("shake");
			elements[0].innerHTML = '<i class="las la-stop-circle"></i> stopping...';
			setTimeout(function(ele){ele.classList.add("shake");},10,elements[0]);
		} else if (time == -3) {
			elements[0].classList.remove("pressed");
			elements[0].disabled = true;
			elements[0].innerHTML = '<i class="lab la-apple"></i> Not Supported';
			if (!(session.cleanOutput)) {
				setTimeout(function() {
					warnUser('The remote browser does not support recording.\n\nPerhaps try local recording instead.');
				}, 0);
			}
		} else if (time == -5) {
			if (!(session.cleanOutput)) {
				setTimeout(function() {
					warnUser('The remote browser has only experimental support for media recording.\n\nAlso, when this download stops, the remote user may be asked to download the file for it to save.');
				}, 0);
			}
		} else if (time == -2) {
			elements[0].classList.add("pressed");
			elements[0].innerHTML = '<i class="las la-stop-circle"></i> stopping...';
		} else if (time == -1) {
			elements[0].classList.remove("pressed");
			elements[0].innerHTML = '<i class="las la-circle"></i> <span data-translate="record-remote"> Record Remote</span>';
		} else {
			var minutes = Math.floor(time / 60);
			var seconds = time - minutes * 60;
			elements[0].classList.add("pressed");
			elements[0].innerHTML = '<i class="las la-stop-circle"></i> ' + (minutes) + "m : " + zpadTime(seconds) + "s";
		}
	}
}

function updateLocalRecordButton(UUID, recorder) {
	var elements = document.querySelectorAll('[data-action-type="recorder-local"][data--u-u-i-d="' + UUID + '"]');
	if (elements[0]) {
		var time = parseInt(recorder) || 0;

		//target.innerHTML = '<i class="las la-check"></i> <span data-translate="record"> ARMED</span>';
		//
		if (time == -3) {
			elements[0].classList.add("pressed");
			elements[0].innerHTML = '<i class="las la-check"></i> <span data-translate="record"> ARMED</span>';
			elements[0].style.backgroundColor = "#BF3F3F";
		} else if (time == -2) {
			elements[0].classList.add("pressed");
			elements[0].innerHTML = '<i class="las la-stop-circle"></i> stopping...';
			elements[0].style.backgroundColor = "";
		} else if (time == -1) {
			elements[0].classList.remove("pressed");
			elements[0].innerHTML = '<i class="las la-circle"></i> <span data-translate="record-local"> Record Local</span>';
			elements[0].style.backgroundColor = "";
		} else {
			var minutes = Math.floor(time / 60);
			var seconds = time - minutes * 60;
			elements[0].classList.add("pressed");
			elements[0].innerHTML = '<i class="las la-stop-circle"></i> ' + (minutes) + "m : " + zpadTime(seconds) + "s";
			elements[0].style.backgroundColor = "";
		}
	}
}

function recordLocalVideoToggle() {
	if (!session.videoElement){return;}
	log("recordLocalVideoToggle()");
	
	var ele = getById("recordLocalbutton");
	if (ele.dataset.state == "0") {
		ele.dataset.state = "1";
		ele.style.backgroundColor = "red";
		ele.innerHTML = '<i class="toggleSize my-float las la-square" ></i>';
		if ("recording" in session.videoElement) {

		} else {
			recordLocalVideo("start");
		}
		
		if (session.director){
			var elements = document.querySelectorAll('[data-action-type="recorder-local"][data-sid="' + session.streamID + '"]');
			if (elements[0]) {
				elements[0].classList.add("pressed");
				elements[0].innerHTML = '<i class="las la-stop-circle"></i><span data-translate="record-local"> Record</span>';
			}
		}
		
	} else {
		if ("recording" in session.videoElement) {
			recordLocalVideo("stop");
		}
		ele.dataset.state = "0";
		ele.style.backgroundColor = "";
		ele.innerHTML = '<i class="toggleSize my-float las la-dot-circle" ></i>';
		
		if (session.director){
			var elements = document.querySelectorAll('[data-action-type="recorder-local"][data-sid="' + session.streamID + '"]');
			if (elements[0]) {
				elements[0].classList.remove("pressed");
				elements[0].innerHTML = '<i class="las la-circle"></i><span data-translate="record-local"> Record</span>';
			}
		}
	}
}

function setupSensorData(pollrate = 30) {
	session.sensors = {};
	session.sensors.data = {};
	session.sensors.data.sensors = true;

	if (window.Accelerometer) {
		session.sensors.data.acc = {};
		session.sensors.Accelerometer = new Accelerometer({
			frequency: pollrate
		});
		session.sensors.Accelerometer.addEventListener('reading', e => {
			session.sensors.data.acc.x = session.sensors.Accelerometer.x;
			session.sensors.data.acc.y = session.sensors.Accelerometer.y;
			session.sensors.data.acc.z = session.sensors.Accelerometer.z;
			session.sensors.data.acc.t = parseInt(Math.round(session.sensors.Accelerometer.timestamp));
		});
		session.sensors.Accelerometer.start();
	}
	if (window.Gyroscope) {
		session.sensors.data.gyro = {};
		session.sensors.Gyroscope = new Gyroscope({
			frequency: pollrate
		});
		session.sensors.Gyroscope.addEventListener('reading', e => {
			session.sensors.data.gyro.x = session.sensors.Gyroscope.x;
			session.sensors.data.gyro.y = session.sensors.Gyroscope.y;
			session.sensors.data.gyro.z = session.sensors.Gyroscope.z;
			session.sensors.data.gyro.t = parseInt(Math.round(session.sensors.Gyroscope.timestamp));
		});
		session.sensors.Gyroscope.start();
	}
	if (window.Magnetometer) {
		session.sensors.data.mag = {};
		session.sensors.Magnetometer = new Magnetometer({
			frequency: pollrate
		});
		session.sensors.Magnetometer.addEventListener('reading', e => {
			session.sensors.data.mag.x = session.sensors.Magnetometer.x;
			session.sensors.data.mag.y = session.sensors.Magnetometer.y;
			session.sensors.data.mag.z = session.sensors.Magnetometer.z;
			session.sensors.data.mag.t = parseInt(Math.round(session.sensors.Magnetometer.timestamp));

		});
		session.sensors.Magnetometer.start();
		session.sensors.deviceorientation = false;
	} else {
		try{
			window.addEventListener('deviceorientation', e => {
				session.sensors.data.ori = {};
				try{
					session.sensors.data.ori.d = e.absolute;
				} catch(event){}
				session.sensors.data.ori.a = e.alpha;
				session.sensors.data.ori.b = e.beta;
				session.sensors.data.ori.g = e.gamma;
				session.sensors.data.ori.t = parseInt(Math.round(e.timestamp)) || Date.now();
			});
			session.sensors.deviceorientation = true;
		} catch(e){
			session.sensors.deviceorientation = false;
		}
	}
	if (window.LinearAccelerationSensor) {
		session.sensors.data.lin = {};
		session.sensors.LinearAccelerationSensor = new LinearAccelerationSensor({
			frequency: pollrate
		});
		session.sensors.LinearAccelerationSensor.addEventListener('reading', e => {
			session.sensors.data.lin.x = session.sensors.LinearAccelerationSensor.x;
			session.sensors.data.lin.y = session.sensors.LinearAccelerationSensor.y;
			session.sensors.data.lin.z = session.sensors.LinearAccelerationSensor.z;
			session.sensors.data.lin.t = parseInt(Math.round(session.sensors.LinearAccelerationSensor.timestamp));
		});
		session.sensors.LinearAccelerationSensor.start();
	}
	setInterval(function() {
		session.sendMessage(session.sensors.data);
	}, parseInt(1000 / pollrate));
}


function recordLocalVideo(action = null, videoKbps = 6000, remote=false) { // event.currentTarget,this.parentNode.parentNode.dataset.UUID
	var audioKbps = false;
	if (remote){
		var video = remote;
		if (remote.id === "videosource"){
			remote = false;
		}
	} else {
		var video = session.videoElement;
	}
	log(video.id);
	
	if ("recording" in video) {
		if (action == "stop") {
			log("Stopping RECORDING!");
			video.recorder.stop();
			delete(video.recorder);
			delete(video.recording);
			return;
		} else if (action == "start") {
			log("ALREADY RECORDING!");
			if (remote){
				getById("recordLocalbutton").dataset.state = "1";
				getById("recordLocalbutton").style.backgroundColor = "red";
				getById("recordLocalbutton").innerHTML = '<i class="toggleSize my-float las la-square" ></i>';
			}
			return;
		} else {
			log("STOPPING RECORDING by default toggle!");
			video.recorder.stop();
			return;
		}
		return;
	} else if (action == "start") {
		if (!MediaRecorder) {
			var msg = {};
			msg.recorder = -3;
			for (var i = 0;i<session.directorList.length;i++){
				msg.UUID = session.directorList[i];
				session.sendMessage(msg, msg.UUID);
			}
			return;
		} else if (SafariVersion || (iPad || iOS)){
			var msg = {};
			msg.recorder = -5;
			for (var i = 0;i<session.directorList.length;i++){
				msg.UUID = session.directorList[i];
				session.sendMessage(msg, msg.UUID);
			}
		}
		video.recording = true;
		if (remote){
			getById("recordLocalbutton").dataset.state = "1";
			getById("recordLocalbutton").style.backgroundColor = "red";
			getById("recordLocalbutton").innerHTML = '<i class="toggleSize my-float las la-square" ></i>';
		}
	} else if (action == "stop") {
		return;
	} else {
		if (!remote){
			getById("recordLocalbutton").dataset.state = "1";
			getById("recordLocalbutton").style.backgroundColor = "red";
			getById("recordLocalbutton").innerHTML = '<i class="toggleSize my-float las la-square" ></i>';
		}
		video.recording = true;
	}

	video.recorder = {};

	if (session.recordLocal !== false) {
		videoKbps = session.recordLocal;
	}

	if (videoKbps <= 0) {
		audioKbps = videoKbps * (-1);
		videoKbps = false;
	} else if (videoKbps < 50) { // this just makes sure you can't set 0 on the record bitrate.
		videoKbps = 50;
	}

	if (typeof video.srcObject === "undefined" || !video.srcObject) {
		return;
	}
	
	var timestamp = Date.now();
	var filename = "";
	if (session.label || session.streamID) {
		filename = session.label || session.streamID;
		filename = filename.replace(/[\W]+/g, "_");
		filename = filename.substring(0, 200);
	}

	filename += "_" + timestamp.toString();

	video.recorder.stop = function(restart = false, notify=false) {
		if (!remote){
			if (restart){
				if (getById("recordLocalbutton").dataset.state == 2) {
					getById("recordLocalbutton").dataset.state = "0";
					getById("recordLocalbutton").style.backgroundColor = "";
					getById("recordLocalbutton").innerHTML = '<i class="toggleSize my-float las la-exclamation" ></i>';
					restart = false;
					warnUser("Media Recording Stopped due to an error.");
				} else {
					getById("recordLocalbutton").innerHTML = '<i class="toggleSize my-float las la-spinner" ></i>';
					getById("recordLocalbutton").dataset.state = "2";
				}
			} else {
				getById("recordLocalbutton").dataset.state = "0";
				getById("recordLocalbutton").style.backgroundColor = "";
				getById("recordLocalbutton").innerHTML = '<i class="toggleSize my-float las la-dot-circle" ></i>';
				if (notify){
					if (!session.cleanOutput){
						warnUser("A recording has stopped unexpectedly.");
					}
					if (session.beepToNotify){
						playtone();
						
					}
					getById("recordLocalbutton").classList.remove("shake");
					setTimeout(function(){getById("recordLocalbutton").classList.add("shake");},10);
				}
			}
		}
		if (!video.recording) {
			errorlog("ALREADY STOPPED");
			return;
		}
		video.recording = false;
		try {
			if (video.recorder.mediaRecorder.state !== "inactive") {
				video.recorder.mediaRecorder.stop();
			}
		} catch (e) {
			errorlog(e);
		}
		
		setTimeout(() => {
			writer.close();
			pokeIframeAPI("recording-stopped");
			if (!remote){
				try {
					if (session.directorUUID) {
						var msg = {};
						msg.recorder = -1;
						for (var i = 0;i<session.directorList.length;i++){
							msg.UUID = session.directorList[i];
							session.sendMessage(msg, msg.UUID);
						}
					}
				} catch (e) {
					errorlog(e);
				}
			}
			delete(video.recorder);
			delete(video.recording);
			if (!remote){
				if (restart) {
					setTimeout(function() {
						recordLocalVideo("start", videoKbps);
					}, 0);
				}
			}

		}, 500);
		if (!remote){
			try {
				if (session.directorUUID) {
					var msg = {};
					if (notify){
						msg.recorder = -4; // user aborted
					} else {
						msg.recorder = -2; 
					}
					for (var i = 0;i<session.directorList.length;i++){
						msg.UUID = session.directorList[i];
						session.sendMessage(msg, msg.UUID);
					}
				}
			} catch (e) {
				errorlog(e);
			}
		}
	};
	
	
	const {readable, writable} = new TransformStream({
		transform: (chunk, ctrl) => chunk.arrayBuffer().then(b => ctrl.enqueue(new Uint8Array(b)))
	});
	var writer = writable.getWriter();
	readable.pipeTo(streamSaver.createWriteStream(filename.toString() + '.webm',  video.recorder.stop));
	video.recorder.writer = writer;
	pokeIframeAPI("recording-started");
	
	let options = {};
	
	if (videoKbps) {
		var tryCodec = false;
		if (session.recordingVideoCodec){
			tryCodec = session.recordingVideoCodec;
		}
		if (tryCodec && MediaRecorder.isTypeSupported('video/webm;codecs='+tryCodec)) {
			if (!session.cleanOutput){
				warnUser("The browser 'says' it supports "+tryCodec);
			}
			options.mimeType = 'video/webm;codecs='+tryCodec;
			if (session.pcm){
				if (MediaRecorder.isTypeSupported('video/webm;codecs="'+tryCodec+', pcm"')){
					options.mimeType = 'video/webm;codecs="'+tryCodec+', pcm"';
				} else {
					options.mimeType = "video/webm;codecs=pcm";
				}
			}
		} else {
			if (session.pcm){
				if (MediaRecorder.isTypeSupported("video/webm;codecs=pcm")) {
					options.mimeType = "video/webm;codecs=pcm";
				} else {
					options.mimeType = "video/webm";
				}
			} else {
				options.mimeType = "video/webm";
			}
		}
		if (videoKbps < 1000) {
			options.videoBitsPerSecond = parseInt(videoKbps * 1024); // 100 kbps audio
		} else {
			options.bitsPerSecond = parseInt(videoKbps * 1024); // 100 to 132 kbps audio
		}
		try {
			video.recorder.mediaRecorder = new MediaRecorder(video.srcObject, options);
		} catch(e){
			warnlog(e);
			try {
				video.recorder.mediaRecorder = new MediaRecorder(video.srcObject);
			} catch(e){
				errorlog(e);
				errorlog("Failing the recording");
				var msg = {};
				msg.recorder = -3;
				for (var i = 0;i<session.directorList.length;i++){
					msg.UUID = session.directorList[i];
					session.sendMessage(msg, msg.UUID);
				}
				return;
			}
		}
		log(video.recorder.mediaRecorder);
		
	} else {
		options.mimeType = "audio/webm";
		if (audioKbps == 0) {
			if (MediaRecorder.isTypeSupported("audio/webm;codecs=pcm")) {
				options.mimeType = "audio/webm;codecs=pcm";
			}
		} else {
			options.bitsPerSecond = parseInt(audioKbps * 1024);
		}
		var stream = createMediaStream();
		video.srcObject.getAudioTracks().forEach((track) => {
			stream.addTrack(track, video.srcObject);
		});
		video.recorder.mediaRecorder = new MediaRecorder(stream, options);  
	}
	log(options);

	function handleDataAvailable(event) {
		if (event.data && event.data.size > 0) {
			writer.write(event.data);
			if (session.directorList.length) {
				if (video.recording) {
					var msg = {};
					msg.recorder = parseInt((Date.now() - timestamp) / 1000) || 0;
					for (var i =0;i<session.directorList.length;i++){
						msg.UUID = session.directorList[i];
						session.sendMessage(msg, msg.UUID);
					}
				}
			}
		}
	}

	video.recorder.mediaRecorder.ondataavailable = handleDataAvailable;

	video.recorder.mediaRecorder.onerror = function(event) {
		errorlog(event);
		video.recorder.stop(true);
	};

	video.srcObject.ended = function(event) {
		video.recorder.stop();
	};

	video.recorder.mediaRecorder.start(1000); // 100ms chunks

	if (session.directorList.length) {
		var msg = {};
		
		msg.recorder = 0;
		for (var i =0;i<session.directorList.length;i++){
			msg.UUID = session.directorList[i];
			session.sendMessage(msg, msg.UUID);
		}
	}
	return;
}


function changeAudioOutputDevice(ele) {
	try {
		if (session.sink){
			if ((iOS) || (iPad)){return;} // iOS devices do not support this.
			
			if (typeof ele.sinkId !== 'undefined'){
				navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(function (stream){
					ele.setSinkId(session.sink).then(() => {
						log("New Output Device:"+session.sink);
					}).catch(warnlog);
					stream.getTracks().forEach(track => {
						track.stop();
					});
				}).catch(function canplayspecificaudio(){errorlog("Can't play out to specific audio device without mic permissions allowed");});
			} else {
				warnlog("Your browser does not support alternative audio sources.");
			}
		}
	} catch(e){warnlog(e);}
}


function updateIncomingVideoElement(UUID, video=true, audio=true){
	
	if (!session.rpcs[UUID].videoElement){return;}
	if (!session.rpcs[UUID].streamSrc){return;}
	
	if (!session.rpcs[UUID].videoElement.srcObject) {
		session.rpcs[UUID].videoElement.srcObject = createMediaStream();
	}
	
	if (video){
		var tracks = session.rpcs[UUID].videoElement.srcObject.getVideoTracks(); // add video track
		session.rpcs[UUID].streamSrc.getVideoTracks().forEach((trk)=>{
			var added = false;
			tracks.forEach(trk2 =>{
				if (trk2.id == trk.id){
					added=true;
				}
			});
			if (!added){
				session.rpcs[UUID].videoElement.srcObject.getVideoTracks().forEach((trk2)=>{ // make sure only one video track is added at a time.
					session.rpcs[UUID].videoElement.srcObject.removeTrack(trk2);
				});
				
				if (trk.muted && (trk.kind=="video") && session.director){
					trk.onunmute = function(e){
						if (!session.rpcs[UUID]){return;} 
						this.onunmute = null;
						warnlog("ON UN-MUTE");
						updateIncomingVideoElement(UUID, true, false);
					};
				} else {
					if (session.rpcs[UUID].videoElement.controls){
						session.rpcs[UUID].videoElement.controls = session.showControls || false;
						setTimeout(function(ele){
							if (ele){
								ele.controls=true;
							}
						},500, session.rpcs[UUID].videoElement);
					}
					session.rpcs[UUID].videoElement.srcObject.addTrack(trk); 
				}
			}
		});
	}
	
	if (audio){
		if (session.audioEffects===true){
			var tracks = session.rpcs[UUID].streamSrc.getAudioTracks();
			if (tracks.length){
				var track = tracks[0];
				track = addAudioPipeline(UUID, track)
				
				var added = false;
				var tracks2 = session.rpcs[UUID].videoElement.srcObject.getAudioTracks();
				tracks2.forEach(trk2 =>{
					if (trk2.label && (trk2.label == "MediaStreamAudioDestinationNode")){ // an old morphed node; delete it.
						session.rpcs[UUID].videoElement.srcObject.removeTrack(trk2);
					} else if (track.id == trk2.id){ // maybe it didn't morph; already added either way
						added = true;
					} else if ((trk2.id == tracks[0].id) && (track.id != tracks[0].id)){ // remove original audio track that is now morphed
						session.rpcs[UUID].videoElement.srcObject.removeTrack(trk2);
					}
				});
				if (!added){
					session.rpcs[UUID].videoElement.srcObject.addTrack(track);
				}
				
			} else {
				session.rpcs[UUID].videoElement.srcObject.getAudioTracks().forEach(trk=>{ // make sure to remove all tracks.
					session.rpcs[UUID].videoElement.srcObject.remove(trk);
				});
			}
			
		} else {
			var expected = [];
			tracks = session.rpcs[UUID].videoElement.srcObject.getAudioTracks();  // add audio tracks
			session.rpcs[UUID].streamSrc.getAudioTracks().forEach((trk)=>{
				var added = false;
				tracks.forEach(trk2 =>{
					if (trk2.id == trk.id){
						added=true;
						expected.push(trk2); // 
					}
				});
				if (!added){
					session.rpcs[UUID].videoElement.srcObject.addTrack(trk);
				}
			});
			tracks.forEach((trk)=>{
				var added = false;
				expected.forEach((trk2)=>{
					if (trk2.id == trk.id){
						added=true;
					}
				});
				if (!added){ // not expected. so lets delete. 
					warnlog("this shouldn't happen that often, audio track orphaned. removing it");
					session.rpcs[UUID].videoElement.srcObject.removeTrack(trk);
				}
			});
		}
	}
}


function addAudioPipeline(UUID, track){  // INBOUND AUDIO EFFECTS
	try{
		log("Triggered webaudio effects path");
		
		for (var tid in session.rpcs[UUID].inboundAudioPipeline){
			delete session.rpcs[UUID].inboundAudioPipeline[tid]; // get rid of old nodes.
		}
		var trackid = track.id;
		session.rpcs[UUID].inboundAudioPipeline[trackid] = {};
		
		session.rpcs[UUID].inboundAudioPipeline[trackid].mediaStream = createMediaStream();
		session.rpcs[UUID].inboundAudioPipeline[trackid].mediaStream.addTrack(track);
		session.rpcs[UUID].inboundAudioPipeline[trackid].mutedAudio = createAudioElement();
		session.rpcs[UUID].inboundAudioPipeline[trackid].mutedAudio.muted = true;
		session.rpcs[UUID].inboundAudioPipeline[trackid].mutedAudio.srcObject = session.rpcs[UUID].inboundAudioPipeline[trackid].mediaStream; // needs to be added as an streamed element to be usable, even if its hidden
		
		session.rpcs[UUID].inboundAudioPipeline[trackid].mutedAudio.play().then(_ => {
			log("playing 1");
		}).catch(warnlog);
	
		// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamTrackSource
		source = session.audioCtx.createMediaStreamSource(session.rpcs[UUID].inboundAudioPipeline[trackid].mediaStream); 
		
		//////////////////
	
		var screwedUp = false;
		session.rpcs[UUID].inboundAudioPipeline[trackid].destination = false;
		if (session.sync!==false){
			log("adding a delay node to audio");
			source = addDelayNode( source, UUID, trackid);
			screwedUp = true;
		}
		
		if (session.style===2){
			log("adding a fftwave node to audio");
			source = fftWaveform( source, UUID, trackid);
		} else if (session.style===3 || session.meterStyle){
			log("adding a loudness meter node to audio");
			source = audioMeterGuest(source, UUID, trackid); 
		} else if (session.audioMeterGuest){
			log("adding a loudness meter node to audio");
			source = audioMeterGuest(source, UUID, trackid);
		} else if (session.activeSpeaker){
			log("adding a loudness meter node to audio");
			source = audioMeterGuest(source, UUID, trackid);
		} else if (session.quietOthers){
			log("adding a loudness meter node to audio");
			source = audioMeterGuest(source, UUID, trackid);
		}
		
		if (session.rpcs[UUID].channelOffset !== false){
			log("custom offset set");
			session.rpcs[UUID].inboundAudioPipeline[trackid].destination = session.audioCtx.createMediaStreamDestination();
			source = offsetChannel( session.rpcs[UUID].inboundAudioPipeline[trackid].destination, source, session.rpcs[UUID].channelOffset);
			screwedUp = true;
		} else if (session.offsetChannel !== false){  // proably better to do this last.
			log("adding offset channels");
			session.rpcs[UUID].inboundAudioPipeline[trackid].destination = session.audioCtx.createMediaStreamDestination();
			source = offsetChannel( session.rpcs[UUID].inboundAudioPipeline[trackid].destination, source, session.offsetChannel);
			screwedUp = true;
		} else if (session.panning !== false){  // proably better to do this last.
			log("adding offset channels");
			session.rpcs[UUID].inboundAudioPipeline[trackid].destination = session.audioCtx.createMediaStreamDestination();
			source = stereoPanning( source, UUID, trackid, session.panning);
			screwedUp = true;
		}
		
		if (screwedUp){
			if (session.rpcs[UUID].inboundAudioPipeline[trackid].destination===false){
				session.rpcs[UUID].inboundAudioPipeline[trackid].destination = session.audioCtx.createMediaStreamDestination();
			}
			source.connect(session.rpcs[UUID].inboundAudioPipeline[trackid].destination);
			
			try {
				if (session.audioCtx.state == "suspended"){
					session.audioCtx.resume();
				}
			} catch(e){warnlog("session.audioCtx.resume(); failed");}
			
			return session.rpcs[UUID].inboundAudioPipeline[trackid].destination.stream.getAudioTracks()[0];
		}
		
		try {
			if (session.audioCtx.state == "suspended"){
				session.audioCtx.resume();
			}
		} catch(e){warnlog("session.audioCtx.resume(); failed");}
		
		return track;
	} catch(e) {errorlog(e);}
	return track;
}


function changeGroupDirector(ele, state=null){

	var group = ele.dataset.value;
	
	var index = session.group.indexOf(group);
	
	if (state===true){
		ele.classList.add("pressed");
		if (index === -1){
			session.group.push(group);
		}
	} else if (state === false){
		ele.classList.remove("pressed");
		if (index > -1){
			ssession.group.splice(index, 1);
		}
	} else if (ele.classList.contains("pressed")){
		ele.classList.remove("pressed");
		if (index > -1){
			session.group.splice(index, 1);
		}
	} else {
		ele.classList.add("pressed");
		if (index === -1){
			session.group.push(group);
		}
	}
	
	if (session.group.length){
		session.sendMessage({"group":session.group.join(",")});
	} else {
		session.sendMessage({"group":false});
	}
}


function changeGroup(ele, state=null){

	var group = ele.dataset.value;
	
	var index = session.rpcs[ele.dataset.UUID].group.indexOf(group);
	
	if (state===true){
		ele.classList.add("pressed");
		if (index === -1){
			session.rpcs[ele.dataset.UUID].group.push(group);
		}
	} else if (state === false){
		ele.classList.remove("pressed");
		if (index > -1){
			session.rpcs[ele.dataset.UUID].group.splice(index, 1);
		}
	} else if (ele.classList.contains("pressed")){
		ele.classList.remove("pressed");
		if (index > -1){
			session.rpcs[ele.dataset.UUID].group.splice(index, 1);
		}
	} else {
		ele.classList.add("pressed");
		if (index === -1){
			session.rpcs[ele.dataset.UUID].group.push(group);
		}
	}
	if (session.rpcs[ele.dataset.UUID].group.length){
		session.sendRequest({"group":session.rpcs[ele.dataset.UUID].group.join(",")}, ele.dataset.UUID);
	} else {
		session.sendRequest({"group":false}, ele.dataset.UUID);
	}
	syncDirectorState(ele);

}

function changeChannelOffset(UUID, channel){
	var ele = document.querySelectorAll('[data-action-type="add-channel"][data--u-u-i-d="' + UUID + '"]');
	for (var i=0;i<ele.length;i++){
		if (channel===i){
			if (ele[i].classList.contains("pressed")){
				ele[i].classList.remove("pressed");
				channel=false;
			} else {
				ele[i].classList.add("pressed");
			}
		} else {
			ele[i].classList.remove("pressed");
		}
	}
	session.rpcs[UUID].channelOffset = channel;
	
	updateIncomingVideoElement(UUID, false, true);
}

function offsetChannel(destination, source, offset){
	session.audioCtx.destination.channelCountMode = 'explicit';
	session.audioCtx.destination.channelInterpretation = 'discrete';
	destination.channelCountMode = 'explicit';
	destination.channelInterpretation = 'discrete';
	
	try {
		destination.channelCount = session.audioChannels;
	} catch (e){errorlog("Max channels: "+destination.channelCount);}
	
	var splitter = session.audioCtx.createChannelSplitter(2);
	var merger = session.audioCtx.createChannelMerger(2+offset);
	
	source.connect(splitter);
	splitter.connect(merger, 0,offset);
	
	if ((session.stereo) && (session.stereo!=3)){
		splitter.connect(merger, 1, 1+offset);
	}
	return merger;
}

function addReverb(source, UUID, trackid, value){ // not yet actually working. requires a buffer; bleh!
	if (value === true){
		value = Math.random() * (Math.random()*2-1);
		errorlog(value);
	} else if (value === false){
		return source;
	} else {
		value = parseFloat(value/90) -1 || 0;
		if (value<-1){value=-1;}
		if (value>1){value=1;}
	}
	//// some reverb logic goes here...
	///var reverbNode  = session.audioCtx.createStereoPanner();
	///session.rpcs[UUID].inboundAudioPipeline[trackid].reverbNode = reverbNode;
	////
	
	source.connect(reverbNode);
	return reverbNode;
}

function stereoPanning(source, UUID, trackid, value){
	if (parseInt(value) === -1){
		value = Math.random() * (Math.random()*2-1);
		warnlog(value);
	} else if (value === false){
		return source;
	} else if (value === true){
		value = 90;
	} else {
		value = parseFloat(value/90) -1 || 0;
		if (value<-1){value=-1;}
		if (value>1){value=1;}
	}
	
	var gainNode = session.audioCtx.createGain();
	session.rpcs[UUID].inboundAudioPipeline[trackid].gainPanNode = gainNode;
	gainNode.value = (1-Math.abs(value)/2); // the stereo panner seems to make things extra loud, so they clip. REDUCE IT.
	source.connect(gainNode);
	
	var panNode  = session.audioCtx.createStereoPanner();
	session.rpcs[UUID].inboundAudioPipeline[trackid].panNode = panNode;
	panNode.pan.value = value;
	gainNode.connect(panNode);
	return panNode;
}

function adjustPan(UUID, value){
	
	if (value === true){
		value = Math.random() * (Math.random()*2-1);
	} else if (value === false){
		value=0;
	} else {
		value = parseFloat(value/90) -1 || 0;
		if (value<-1){value=-1;}
		if (value>1){value=1;}
	}
	
	for (var trackid in session.rpcs[UUID].inboundAudioPipeline){
		if ("panNode" in session.rpcs[UUID].inboundAudioPipeline[trackid]){
			session.rpcs[UUID].inboundAudioPipeline[trackid].panNode.pan.setValueAtTime(value, session.audioCtx.currentTime);
		}
		if ("gainPanNode" in session.rpcs[UUID].inboundAudioPipeline[trackid]){
			session.rpcs[UUID].inboundAudioPipeline[trackid].gainPanNode.setValueAtTime((1-Math.abs(value)/2), session.audioCtx.currentTime);
		}
	}
}

function addDelayNode(source, UUID, trackid){  // append the delay Node to the track??? WOULD THIS WORK?
	
	var delay = parseFloat(session.sync/1000);
	if (delay<0){delay=0;}
	
	session.rpcs[UUID].inboundAudioPipeline[trackid].delayNode = session.audioCtx.createDelay(delay+5);// 5 seconds additionally added for the purpose of flexibility
	
	session.rpcs[UUID].inboundAudioPipeline[trackid].delayNode.delayTime.value = delay; // delayTime takes it in seconds.
	source.connect(session.rpcs[UUID].inboundAudioPipeline[trackid].delayNode);
	log("added new delay node");
	return session.rpcs[UUID].inboundAudioPipeline[trackid].delayNode;
}


function createStyleCanvas(UUID){  // append the delay Node to the track??? WOULD THIS WORK?
	if (!session.rpcs[UUID].canvas){ // just make sure that if using &effects or something, to null the canvas after use, else this won't trigger.
		session.rpcs[UUID].canvas = document.createElement("canvas");
		session.rpcs[UUID].canvas.dataset.UUID = UUID
		session.rpcs[UUID].canvas.style.pointerEvents = "auto";
		session.rpcs[UUID].canvasCtx = session.rpcs[UUID].canvas.getContext('2d', { alpha: session.alpha });
		//
		session.rpcs[UUID].canvas.addEventListener('click', function(e) { // show stats of video if double clicked
			log("clicked");
			try {
				var uid = e.currentTarget.dataset.UUID;
				if ((e.ctrlKey)||(e.metaKey)){
					e.preventDefault();
					
					if ("stats" in session.rpcs[uid]){
						var [menu, innerMenu] = statsMenuCreator();
						printViewStats(innerMenu, uid );
						menu.interval = setInterval(printViewStats, session.statsInterval, innerMenu, uid);
					}
					e.stopPropagation();
					return false;
				} else if ("prePausedBandwidth" in session.rpcs[uid]){
					unPauseVideo(e.currentTarget);
				}
				
			} catch(e){errorlog(e);}
		});
		
		if (session.statsMenu){
			if ("stats" in session.rpcs[UUID]){
				var [menu, innerMenu] = statsMenuCreator();
				printViewStats(innerMenu, UUID );
				menu.interval = setInterval(printViewStats, session.statsInterval, innerMenu, UUID);
			}
		}
		
		if (session.aspectRatio){
			if (session.aspectRatio==1){
				session.rpcs[UUID].canvas.width="720";
				session.rpcs[UUID].canvas.height="1280";
			} else if (session.aspectRatio==2){
				session.rpcs[UUID].canvas.width="960";
				session.rpcs[UUID].canvas.height="960";
			} else if (session.aspectRatio==3){
				session.rpcs[UUID].canvas.width="1280";
				session.rpcs[UUID].canvas.height="960";
			}
		} else {
			session.rpcs[UUID].canvas.width="1280";
			session.rpcs[UUID].canvas.height="720";
		}
		
		updateMixer();
		return true;
	} else {
		return false;
	}
}

function applyStyleEffect(UUID){
	if (!session.rpcs[UUID].canvas || !session.rpcs[UUID].canvasCtx){return;}
	
	/* session.rpcs[UUID].canvasContainer = document.createElement("div");
	session.rpcs[UUID].canvasContainer.appendChild(session.rpcs[UUID].canvas);
	session.rpcs[UUID].canvas.style = "width:100%;height:100%;display:block;";
	session.rpcs[UUID].canvasContainer.appendChild(session.rpcs[UUID].videoElement); */
	
	if (session.style==3){ // black
		session.rpcs[UUID].canvasCtx.fillStyle = "rgb(0, 0, 0)";
		session.rpcs[UUID].canvasCtx.fillRect(0, 0, session.rpcs[UUID].canvas.width, session.rpcs[UUID].canvas.height);
	} else if (session.style==4){
		session.rpcs[UUID].canvasCtx.fillStyle = "rgb(0, 0, 0)";
		session.rpcs[UUID].canvasCtx.fillRect(0, 0, session.rpcs[UUID].canvas.width, session.rpcs[UUID].canvas.height);
	} else if (session.style==5){
		var r = Math.random()*255;
		var g = Math.random()*255;
		var b = Math.random()*255;
		session.rpcs[UUID].canvasCtx.fillStyle = "rgb("+r+", "+g+", "+b+")";
		session.rpcs[UUID].canvasCtx.fillRect(0, 0, session.rpcs[UUID].canvas.width, session.rpcs[UUID].canvas.height);
	} else if (session.style==6){
		
		session.rpcs[UUID].canvasCtx.fillStyle = "rgb(0,0,0)";
		session.rpcs[UUID].canvasCtx.fillRect(0, 0, session.rpcs[UUID].canvas.width, session.rpcs[UUID].canvas.height);
		
		var r = Math.random()*150+50;
		var g = Math.random()*150+50;
		var b = Math.random()*150+50;
		session.rpcs[UUID].canvasCtx.fillStyle = "rgb("+r+", "+g+", "+b+")";
		session.rpcs[UUID].canvasCtx.beginPath();
		session.rpcs[UUID].canvasCtx.arc(parseInt(session.rpcs[UUID].canvas.width/2), parseInt(session.rpcs[UUID].canvas.height/2), parseInt(session.rpcs[UUID].canvas.height/4), 0, 2 * Math.PI, false);
		session.rpcs[UUID].canvasCtx.fill();
		
		if (session.rpcs[UUID].label){
			session.rpcs[UUID].canvasCtx.fillStyle = "rgb(0,0,0)";
			session.rpcs[UUID].canvasCtx.textAlign = "center";
			session.rpcs[UUID].canvasCtx.font = parseInt(session.rpcs[UUID].canvas.height/2.11)+"px Arial";
			session.rpcs[UUID].canvasCtx.fillText(session.rpcs[UUID].label[0].toUpperCase(), parseInt(session.rpcs[UUID].canvas.width/2), parseInt(session.rpcs[UUID].canvas.height*2/3)); 
		} else {
			var tmp = getComputedStyle(document.querySelector(':root')).getPropertyValue('--video-background-image').split('"');
			if (tmp.length===3){
				var img = new Image();
				img.onload = function() {
					session.rpcs[UUID].canvasCtx.fillStyle = "rgb(25,0,0)";
					session.rpcs[UUID].canvasCtx.drawImage(img, parseInt(session.rpcs[UUID].canvas.width/2-110), parseInt(session.rpcs[UUID].canvas.height/2-110),220,220);
				}
				img.src = tmp[1];
			}
		}
		
	} 
}

function fftWaveform( source, UUID, trackid){  // append the delay Node to the track??? WOULD THIS WORK?
	// https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
	session.rpcs[UUID].inboundAudioPipeline[trackid].analyser = session.audioCtx.createAnalyser();
	session.rpcs[UUID].inboundAudioPipeline[trackid].analyser.fftSize = 512;
	var bufferLength = session.rpcs[UUID].inboundAudioPipeline[trackid].analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);
	session.rpcs[UUID].inboundAudioPipeline[trackid].analyser.getByteTimeDomainData(dataArray);
	// analyser.getByteTimeDomainData(dataArray);
	source.connect(session.rpcs[UUID].inboundAudioPipeline[trackid].analyser);
	
	createStyleCanvas(UUID);
	clearInterval(session.rpcs[UUID].canvasIntervalAction);
	var canvasIntervalAction = setInterval(function(uuid){
		try{
			session.rpcs[uuid].inboundAudioPipeline[trackid].analyser.getByteTimeDomainData(dataArray);
			session.rpcs[uuid].canvasCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
			session.rpcs[uuid].canvasCtx.fillRect(0, 0, session.rpcs[uuid].canvas.width, session.rpcs[uuid].canvas.height);
			session.rpcs[uuid].canvasCtx.lineWidth = 10;
			session.rpcs[uuid].canvasCtx.strokeStyle = "rgb(111, 255, 111)";
			
			var sliceWidth = session.rpcs[uuid].canvas.width * 1.0 / bufferLength;
			
			var loudness = dataArray;
			var Squares = loudness.map((val) => ((val-128.0)*(val-128.0)));
			var Sum = Squares.reduce((acum, val) => (acum + val));
			var Mean = Sum/loudness.length;
			loudness = Math.sqrt(Mean)*10;
			session.rpcs[uuid].stats.Audio_Loudness = parseInt(loudness);
			
			if (session.pushLoudness==true){
				var loudnessObj = {};
				loudnessObj[session.rpcs[uuid].streamID] = session.rpcs[uuid].stats.Audio_Loudness;
				
				if (isIFrame){
					parent.postMessage({"loudness": loudnessObj, "action":"loudness", "value":loudness, "UUID":uuid}, "*");
				}
			}
			
			if (loudness<2){return;}
			
			//log(bufferLength);
			session.rpcs[uuid].canvasCtx.beginPath();
			var m = session.rpcs[uuid].canvas.height / 256.0;
			session.rpcs[uuid].canvasCtx.moveTo(0, dataArray[0]*m);
			var x = 0;
			for (var i = 1; i < bufferLength; i++){
				var y = dataArray[i] * m;
				session.rpcs[uuid].canvasCtx.lineTo(x, y);
				x += sliceWidth;
			}
			session.rpcs[uuid].canvasCtx.lineTo(session.rpcs[uuid].canvas.width, session.rpcs[uuid].canvas.height / 2);
			session.rpcs[uuid].canvasCtx.stroke();
		} catch(e){
			warnlog(e);
			warnlog("Did the remote source disconnect?");
			clearInterval(canvasIntervalAction);
			warnlog(session.rpcs[uuid]);
		}
	},50, UUID);
	session.rpcs[UUID].canvasIntervalAction = canvasIntervalAction;
	return session.rpcs[UUID].inboundAudioPipeline[trackid].analyser; 
}

function audioMeterGuest(mediaStreamSource, UUID, trackid){
	log("audioMeterGuest started");
	session.rpcs[UUID].inboundAudioPipeline[trackid].analyser = session.audioCtx.createAnalyser();
	mediaStreamSource.connect(session.rpcs[UUID].inboundAudioPipeline[trackid].analyser);
	session.rpcs[UUID].inboundAudioPipeline[trackid].analyser.fftSize = 256;
	session.rpcs[UUID].inboundAudioPipeline[trackid].analyser.smoothingTimeConstant = 0.05;
	
	var bufferLength = session.rpcs[UUID].inboundAudioPipeline[trackid].analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);
	
	function updateLevels() {
		
		if (!session.rpcs || !(UUID in session.rpcs)){return;}
		try {
			session.rpcs[UUID].inboundAudioPipeline[trackid].analyser.getByteFrequencyData(dataArray);
			var total = 0;
			for (var i = 0; i < dataArray.length; i++){
				total += dataArray[i];
			}
			total = total/100;
			session.rpcs[UUID].stats.Audio_Loudness = parseInt(total);
			
			if (session.pushLoudness==true){
				var loudnessObj = {};
				loudnessObj[session.rpcs[UUID].streamID] = session.rpcs[UUID].stats.Audio_Loudness;
				
				if (isIFrame){
					parent.postMessage({"loudness": loudnessObj, "action":"loudness", "value":session.rpcs[UUID].stats.Audio_Loudness, "UUID":UUID}, "*");
				}
			}
			
			try{
				clearTimeout(session.rpcs[UUID].inboundAudioPipeline[trackid].analyser.interval);
				session.rpcs[UUID].inboundAudioPipeline[trackid].analyser.interval = setTimeout(function(){updateLevels();},100);
			} catch(e){
				log("closing old inaudio pipeline");
			}
			
			if (session.style==3 || session.meterStyle){ // overrides style
				// continue
			} else if (session.scene!==false){ // if a scene, cancel
				return;
			} else if (session.audioMeterGuest===false){  // don't show if we just want the volume levels
				return;
			}
			
			if (session.rpcs[UUID].voiceMeter){
				session.rpcs[UUID].voiceMeter.dataset.level = total;
				if (session.meterStyle==1){
					session.rpcs[UUID].voiceMeter.style.height = Math.min(total,100) + "%";
					if (total>75){
						total = Math.min(100,(total - 75)*4);
						var R = parseInt((255 * total) / 100).toString(16).padStart(2, '0');
						var G = parseInt(255 * (100 - total) / 100).toString(16).padStart(2, '0');
						session.rpcs[UUID].voiceMeter.style.backgroundColor = "#" + R + G + "00";
					} else {
						session.rpcs[UUID].voiceMeter.style.backgroundColor = "#00FF00";
					}
				} else {
					if (total>15){
						session.rpcs[UUID].voiceMeter.style.opacity = 100; // temporary
					} else {
						session.rpcs[UUID].voiceMeter.style.opacity = 0; // temporary
					}
				}
				
			} else {
				session.rpcs[UUID].voiceMeter = document.createElement("div");
				session.rpcs[UUID].voiceMeter.id = "voiceMeter_"+UUID;
				session.rpcs[UUID].voiceMeter.dataset.level = total;
				if (session.meterStyle==1){
					session.rpcs[UUID].voiceMeter.classList.add("video-meter2");
				} else {
					if (total>15){
						session.rpcs[UUID].voiceMeter.style.opacity = 100; // temporary
					} else {
						session.rpcs[UUID].voiceMeter.style.opacity = 0; // temporary
					}
					if (session.meterStyle==2){
						session.rpcs[UUID].voiceMeter.classList.add("video-meter-2");
					} else {
						session.rpcs[UUID].voiceMeter.classList.add("video-meter");
					}
				}
				updateMixer();
			}
			
		} catch(e){
			warnlog(e);
			return;
		}
	};
	clearTimeout(session.rpcs[UUID].inboundAudioPipeline[trackid].analyser.interval);
	session.rpcs[UUID].inboundAudioPipeline[trackid].analyser.interval = setTimeout(function(){updateLevels();},100);
	return session.rpcs[UUID].inboundAudioPipeline[trackid].analyser;
}

function effectsDynamicallyUpdate(event, ele){
	log("effectsDynamicallyUpdate");
	session.effects = ele.options[ele.selectedIndex].value;
	
	getById("selectImageTFLITE").style.display = "none";
	getById("selectImageTFLITE3").style.display = "none";
	getById("selectEffectAmount").style.display = "none";
	getById("selectEffectAmount3").style.display = "none";
	
	 if (session.effects == "3a"){
		session.effects = "3";
		session.effectValue = 5;
	}
	if ((session.effectValue_default===false) && (session.effects=="3")){
		session.effectValue = 2;
	} else {
		session.effectValue = session.effectValue_default;
	}
	
	if (session.effects == "0" || !session.effects){
		updateRenderOutpipe();
		return;
	} else if (session.effects === "3" || session.effects === "4"){
		attemptTFLiteJsFileLoad();
		if (!session.tfliteModule.looping){
			updateRenderOutpipe();
		} 
		if ((session.effects === "3") && (session.effectValue_default==false)){
			getById("selectEffectAmount").style.display = "block";
			getById("selectEffectAmount3").style.display = "block";
			getById("selectEffectAmountInput").value = session.effectValue;
			getById("selectEffectAmountInput3").value = session.effectValue;
		}
	} else if (session.effects === "5"){
		attemptTFLiteJsFileLoad();
		if (!session.tfliteModule.looping){
			updateRenderOutpipe();
		}
		loadTFLITEImages();
	} else if (session.effects === "6"){
		if (!gpgpuSupport){
			if (!session.cleanOutput){
				warnUser("Hardware acceleration isn't detected.<br /><br />This effect will not work",4000);
				return;
			}
		} else if (gpgpuSupport == "Google SwiftShader"){
			if (!session.cleanOutput){
				warnUser("Hardware acceleration isn't detected.<br /><br />Please enable it for this effect to work correctly.<br /><br /><i>Settings -> Advanced -> System -> Use hardware-accleration</i>");
			}
			return;
		}
		loadTensorflowJS();
		updateRenderOutpipe();
		//mainMeshMask();
	}  else {
		//loadEffect(session.effects);
		updateRenderOutpipe();
	}
	
	if ((session.permaid===false) && (session.roomid===false) && (session.view===false) && (session.director===false)){
		updateURL("effects");
	}
}

function loadTFLITEImages(){
	if (session.effects!=="5"){return;} // only load if effects 5 is set.
	
	if (session.defaultBackgroundImages){
		try {
			session.defaultBackgroundImages.reverse();
		}catch(e){
			errorlog("Could not process image list");
			session.defaultBackgroundImages = false;
			session.selectImageTFLITE_contents = getById("selectImageTFLITE_contents");
			return;
		}
		session.defaultBackgroundImages.forEach(imgSrc=>{
			try {
				var img = document.createElement("img");
				img.onerror = function(){this.style.display="none";}; // hide images that fail to load
				img.crossOrigin = "Anonymous";
				img.src = imgSrc;
				img.style="max-width:130px;max-height:73.5px;display:inline-block;margin:10px;cursor:pointer;";
				img.onclick=function(event){changeTFLiteImage(event, this);};
				getById("selectImageTFLITE_contents").prepend(img);
			} catch(e){};
		});
		session.defaultBackgroundImages = false;
		session.selectImageTFLITE_contents = getById("selectImageTFLITE_contents");
	} else if (!session.selectImageTFLITE_contents){
		session.selectImageTFLITE_contents = getById("selectImageTFLITE_contents");
	}
	if (document.getElementById("selectImageTFLITE")){
		document.getElementById("selectImageTFLITE").style.display = "block";
		document.getElementById("selectImageTFLITE").appendChild(session.selectImageTFLITE_contents);
		session.selectImageTFLITE_contents.classList.remove("hidden");
	} else if (document.getElementById("selectImageTFLITE3")){
		document.getElementById("selectImageTFLITE3").style.display = "block";
		document.getElementById("selectImageTFLITE3").appendChild(session.selectImageTFLITE_contents);
		session.selectImageTFLITE_contents.classList.remove("hidden");
	}
}

var effectsLoaded = {};
var JEELIZFACEFILTER = null;
function loadEffect(effect){
	warnlog("effect:"+effect);
	var filename = effect.replace(/\W/g, '');
	if (effectsLoaded[filename]){
		effectsLoaded[filename]();
		return;
	}
	warnlog("Loading Effect: "+effect);
	var script = document.createElement('script');
	script.onload = function() {
		
		effectsLoaded[filename] = effectsEngine(effect);
		effectsLoaded[filename]();
		
		if (gpgpuSupport == "Google SwiftShader"){
			if (!session.cleanOutput){
				warnUser("Hardware acceleration isn't detected.<br /><br />Please enable it for better performance.<br /><br /><i>Settings -> Advanced -> System -> Use hardware-accleration</i>");
			}	
		}
	}
	script.src = "./filters/"+filename+".js?"+parseInt(1000*Math.random());
	document.head.appendChild(script);
	warnUser("Loading custom effects model...",1000);
}

function loadTensorflowJS(){
	if (session.TFJSModel!=null){
		return;
	}
	log("loadTensorflowJS()");
	session.TFJSModel=true;
	var script = document.createElement('script');
	var script2 = document.createElement('script');
	var script3 = document.createElement('script');
	var script4 = document.createElement('script');
	script.onload = function() {
		document.head.appendChild(script2);
	}
	script2.onload = function() {
		document.head.appendChild(script3);
	}
	script3.onload = function() {
		document.head.appendChild(script4);
	}
	script4.onload = function() {
		async function loadModel(){
			session.TFJSModel = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
			closeModal();
			warnUser("Almost done loading model...",3000);
		}
		loadModel();
		
	}
	script.src = "./thirdparty/tfjs/tf-core.js";
	script2.src = "./thirdparty/tfjs/tf-converter.js";
	script3.src = "./thirdparty/tfjs/tf-backend-webgl.js";
	script4.src = "./thirdparty/tfjs/face-landmarks-detection.js";
	warnUser("Downloading a big effects model... may take a minute",15000);
	
	script.type = 'text/javascript';script2.type = 'text/javascript';script3.type = 'text/javascript';script4.type = 'text/javascript';
	document.head.appendChild(script);
}



var TFLITELOADING = false;
function attemptTFLiteJsFileLoad(){
	if (session.tfliteModule!==false){
		return true;
	}
	warnUser("Loading effects model...");
	TFLITELOADING=true;
	session.tfliteModule={};
		
	if (!document.getElementById("tflitesimdjs")){
		var tmpScript = document.createElement('script');
		tmpScript.onload = loadTFLiteModel;
		tmpScript.type = 'text/javascript';
		tmpScript.src = "./thirdparty/tflite/tflite-simd.js?ver=2";
		tmpScript.id = "tflitesimdjs";
		document.head.appendChild(tmpScript);
	}
	
	return false;
}
async function changeTFLiteImage(ev, ele){
	if (ele.files && ele.files[0]) {
		if (session.tfliteModule.img){
			session.tfliteModule.img.classList.remove("selectedTFImage");
		}
		session.tfliteModule.img = document.createElement("img");
		session.tfliteModule.img.style="max-width:130px;max-height:73.5px;display:inline-block;margin:10px;cursor:pointer;";
		session.tfliteModule.img.onclick=function(event){changeTFLiteImage(event, this);};
		ele.parentNode.parentNode.insertBefore(session.tfliteModule.img, ele.parentNode);
		session.tfliteModule.img.onload = () => {
			URL.revokeObjectURL(session.tfliteModule.img.src);  // no longer needed, free memory
		}
		session.tfliteModule.img.src = URL.createObjectURL(ele.files[0]); // set src to blob url
		session.tfliteModule.img.classList.add("selectedTFImage");
		
	} else if (ele.tagName.toLowerCase() == "img"){
		session.tfliteModule.img.classList.remove("selectedTFImage");
		session.tfliteModule.img = ele
		session.tfliteModule.img.classList.add("selectedTFImage");
	}
}
async function changeEffectAmount(ev, ele){
	session.effectValue = parseInt(ele.value);
	log("session.effectValue: "+session.effectValue);
}
async function loadTFLiteModel(){
	try {
		
		if (session.tfliteModule && (session.tfliteModule.img)){
			var img = session.tfliteModule.img;
			session.tfliteModule = await createTFLiteSIMDModule();
			session.tfliteModule.img = img;
		} else {
			session.tfliteModule = {};
			session.tfliteModule = await createTFLiteSIMDModule();
		}
		if (!session.tfliteModule.simd){
			var elements = document.querySelectorAll('[data-warnSimdNotice]')
			for (let i = 0; i < elements.length; i++) {
				elements[i].style.display = "inline-block";
			}
		}
	} catch(e){
		warnlog("TF-LITE FAILED TO LOAD");
		closeModal();
		return;
	}
	const modelResponse = await fetch("./thirdparty/tflite/segm_full_v679.tflite");
	session.tfliteModule.model = await modelResponse.arrayBuffer();
	
	session.tfliteModule.HEAPU8.set(new Uint8Array(session.tfliteModule.model), session.tfliteModule._getModelBufferMemoryOffset());
	session.tfliteModule._loadModel(session.tfliteModule.model.byteLength);
	session.tfliteModule.activelyProcessing = false;
	TFLITELOADING = false;
	closeModal();
	if (LaunchTFWorkerCallback){TFLiteWorker();}
}
function smdInfo(){
	warnUser("For improved performance, use Chrome v87 or newer with SIMD support enabled.<br />Enable SIMD here: <a href='chrome://flags/#enable-webassembly-simd' onclick='copyFunction(this,event)' target='_blank'>chrome://flags/#enable-webassembly-simd</a>");
}

function getGuestTarget(type, id){
	var element = document.querySelectorAll('[data-action-type="'+type+'"][data-sid="'+id+'"]'); // data-sid="P5MQpia"
	if (!element.length){
		return element = getRightOrderedElement('[data-action-type="'+type+'"][data--u-u-i-d]', id);
	} else {
		element = element[0];
	}
	return element;
}

function getGuestTargetScene(scene, id){
	var element = document.querySelectorAll('[data-action-type="addToScene"][data-scene="'+scene+'"][data-sid="'+id+'"]'); // data-sid="P5MQpia"
	if (!element.length){
		return element = getRightOrderedElement('[data-action-type="addToScene"][data-scene="'+scene+'"][data--u-u-i-d]', id);
	} else {
		element = element[0];
	}
	return element;
}
function getGuestTargetGroup(group, id){
	var element = document.querySelectorAll('[data-action-type="toggle-group"][data-value="'+group+'"][data-sid="'+id+'"]'); // data-sid="P5MQpia"
	if (!element.length){
		return getRightOrderedElement('[data-action-type="toggle-group"][data-value="'+group+'"][data--u-u-i-d]', id);
	} else {
		element = element[0];
	}
	return element;
}

function targetGuest(guestslot, action, value=null){
	
	if (guestslot){
		if ((guestslot == (parseInt(guestslot)+"")) && guestslot<100){
			guestslot -=1;
		}
	} else {
		guestslot=1;
	}
	warnlog("guestslot "+guestslot);
	warnlog("action "+action);
	warnlog("value "+value);
	if ((action == 0) || (action == "forward")) {
		var element = getGuestTarget("forward", guestslot);
		if (element) {
			directMigrate(element, true, value); // if value is set, it will auto transfer the guest to that room.
		}
	} else if ((action == 1) || (action == "addScene")) {
		if (value == "null" || value == null){
			value = 1;
		}
		var element = getGuestTargetScene(value, guestslot); // oscid/action/target/value   1/1/scene
		if (element) {
			directEnable(element, true);
		}
	} else if ((action == 2) || (action == "muteScene")) {
		var element = getGuestTarget("mute-scene", guestslot);
		if (element) {
			directMute(element, true);
		}
	} else if ((action == 3) || (action == "mic")) { 
		var element = getGuestTarget("mute-guest", guestslot);
		if (element) {
			remoteMute(element, true);
		}
	}  else if ((action == 4) || (action == "hangup")) { 
		var element = getGuestTarget("hangup", guestslot);
		if (element) {
			directHangup(element, true);
		}
	} else if ((action == 5) || (action == "soloChat")) { 
		var element = getGuestTarget("solo-chat", guestslot);
		if (element) {
			session.toggleSoloChat(element.dataset.UUID);
		}
	} else if ((action == 6) || (action == "speaker")) {
		var element = getGuestTarget("toggle-remote-speaker", guestslot);
		if (element) {
			remoteSpeakerMute(element);
		}
	} else if ((action == 7) || (action == "display")) {
		var element = getGuestTarget("toggle-remote-display", guestslot);
		if (element) {
			remoteDisplayMute(element);
		}
	} else if ((action == 8) || (action == "group")) {
		if (value == "null" || value == null){
			value = 1;
		}
		var element = getGuestTargetGroup(value, guestslot);
		if (element) {
			changeGroup(element, null, value);
		}
	} else if ((action == 12) || (action == "addScene2")) { 
		var element = getGuestTargetScene(2, guestslot);
		if (element) {
			directEnable(element, true)
		}
	} else if ((action == 13) || (action == "addScene3")) { 
		var element = getGuestTargetScene(3, guestslot);
		if (element) {
			directEnable(element, true)
		}
	} else if ((action == 14) || (action == "addScene4")) { 
		var element = getGuestTargetScene(4, guestslot);
		if (element) {
			directEnable(element, true)
		}
	} else if ((action == 15) || (action == "addScene5")) { 
		var element = getGuestTargetScene(5, guestslot);
		if (element) {
			directEnable(element, true)
		}
	} else if ((action == 16) || (action == "addScene6")) {
		var element = getGuestTargetScene(6, guestslot);
		if (element) {
			directEnable(element, true)
		}
	} else if ((action == 17) || (action == "addScene7")) {
		var element = getGuestTargetScene(7, guestslot);
		if (element) {
			directEnable(element, true)
		}
	} else if ((action == 18) || (action == "addScene8")) {
		var element = getGuestTargetScene(8, guestslot);
		if (element) {
			directEnable(element, true)
		}
	} else if ((action == 19) || (action == "forceKeyframe")) {
		var element = getGuestTarget("force-keyframe", guestslot);
		if (element) {
			requestKeyframeScene(element);
		}
	} else if ((action == 20) || (action == "soloVideo")) {
		var element = getGuestTarget("solo-video", guestslot);
		if (element) {
			requestInfocus(element);
		}
	} else if ((action == 27) || (action == "volume")){
		var element = getGuestTarget("volume", guestslot);
		if (element) {
			element.value = parseInt(value) || 100;
			remoteVolume(element);
		}
	}
}

function oscClient(){ // OSC (websocket / https API hotkey support).  The iFrame API method provides greater customization.
	if (!session.api){return;}
	warnlog("oscClient started");
	
	var socket = null;
	var connecting = false;
	var failedCount = 0;
	
	function connect(){
		clearTimeout(connecting);
		if (socket){
			if (socket.readyState === socket.OPEN){return;}
			try{
				socket.close();
			} catch(e){}
		}
		socket = new WebSocket(session.apiserver);
		
		socket.onclose = function (){
			failedCount+=1;
			clearTimeout(connecting);
			connecting = setTimeout(function(){connect();},100*(failedCount-1));
		};

		socket.onerror = function (){
			failedCount+=1;
			clearTimeout(connecting);
			connecting = setTimeout(function(){connect();},100*failedCount);
		};

		socket.onopen = function (){
			failedCount = 0;
			try{
				socket.send(JSON.stringify({"join":session.api}));
			} catch(e){
				connecting = setTimeout(function(){connect();},1);
			}
		};
		
		socket.addEventListener('message', function (event) {
			if (event.data){
				var data = JSON.parse(event.data);
				if ("msg" in data){
					data = data.msg
				}
				var resp = processMessage(data);
				if (resp!==null){
					socket.send(JSON.stringify(resp));
					log(JSON.stringify(resp));
				}
			}
		});
	}
	connect();
}

function setupCommands(){
	var commands = {}
	
	commands.raisehand = function(value){raisehand();};
	commands.togglehand = function(value){raisehand();};
	commands.togglescreenshare = function(value){toggleScreenShare();}; 
	commands.chat 		= function(value){toggleChat(value);}; 
	commands.speaker 	= function(value){
		if (value === true) { // unmute
			session.speakerMuted = false; // set
			toggleSpeakerMute(true); // apply 
		} else if (value === false) { // mute
			session.speakerMuted = true; // set
			toggleSpeakerMute(true); // apply
		} else if (value === "toggle") { // toggle
			toggleSpeakerMute();
		}
	};  // mute speaker
	commands.mic 		= function(value){
		if (value === true) { // unmute
			session.muted = false; // set
			log(session.muted);
			toggleMute(true); // apply 
		} else if (value === false) { // mute
			session.muted = true; // set
			log(session.muted);
			toggleMute(true); // apply
		} else if (value === "toggle") { // toggle
			toggleMute();
		}
	}; 
	commands.camera 	= function(value){
		if (value === true) { // unmute
			session.videoMuted = false; // set
			log(session.videoMuted);
			toggleVideoMute(true); // apply 
		} else if (value === false) { // mute
			session.videoMuted = true; // set
			log(session.videoMuted);
			toggleVideoMute(true); // apply
		} else if (value === "toggle") { // toggle
			toggleVideoMute();
		}
	}
	commands.hangup		= function(value){hangup();};
	commands.bitrate = function(value){
		if (value===false){
			value = 0;
		} else if (value===true){
			value = -1;
		} else {
			value = parseInt(value) || 0;
		}
		for (var i in session.rpcs) {
			try {
				session.requestRateLimit(value, i);
			} catch (e) {
				errorlog(e);
			}
		}
	}; 
	
	commands.getDetails = function(value){
		var msg = {};
		msg.callback = {};
		msg.callback.value = value;
		msg.callback.action = "getDetails";
		msg.callback.result = getDetailedState();
		return msg;
	}
	
	commands.reload = function(value){reloadRequested();}; 
	commands.volume = function(value){
		if (value===false){
			value = 0;
		} else if (value===true){
			value = 100
		} else {
			value = parseInt(value) || 0;
		}
		value = parseFloat(value/100);
		for (var i in session.rpcs) {
			try {
				session.rpcs[i].videoElement.volume = parseFloat(value);
			} catch (e) {
				errorlog(e);
			}
		}
	}; 
	
	commands.forceKeyframe = function(value=null){
		session.forcePLI();
	}; 
	
	commands.panning = function(value){
		if (value===false){
			value = 90;
		} else if (value===true){
			value = 90
		} else {
			value = parseInt(value);
		}
		for (var uuid in session.rpcs) {
			try {
				adjustPan(uuid, value); // &panning needs to be added to enable. playback only; not mic out.
			} catch (e) {
				errorlog(e);
			}
		}
	}; 
	
	commands.record = function(value){
		if (value === false) { // mute
			if ("recording" in session.videoElement) {
				recordLocalVideo("stop");
			}
		} else if (value === true){
			if ("recording" in session.videoElement) {
				// already recording
			} else {
				recordLocalVideo("start");
			}
		}
	}; 
	
	commands.sendChat = function(value){sendChat(value);}; 
	return commands;
}
var Commands = setupCommands();
	

function processMessage(data) {
	try {
		warnlog(data);
		if (("target" in data) && (data.target !== "null" && data.target !== null)) {
			if ("action" in data){
				if ("value" in data){
					return targetGuest(data.target, data.action, data.value)  || null;
				} else {
					return targetGuest(data.target, data.action, null)  || null;
				}
			}
		} else if ("action" in data){
			if (data.action in Commands){
				if ("value" in data){
					if (data.value=="true"){
						data.value=true;
					} else if (data.value=="false"){
						data.value=false;
					}
					return Commands[data.action](data.value) || null;
				} else {
					return Commands[data.action]() || null;
				}
			}
		}
	} catch(e){errorlog(e);}
	return null;
}


function midiHotkeysNote(note, velocity=false){
	if (session.midiHotkeys==1){
		if (note == "G3") {  // open and close the chat window
			toggleChat();
		} else if (note == "A3") { // mute your audio output
			toggleMute();
		} else if (note == "B3") { // mute your video output
			toggleVideoMute();
		} else if (note == "C4") { // enable / disable screenshare
			toggleScreenShare();
		} else if (note == "D4") { // completely kill your connection/session
			hangup();
		} else if (note == "E4") { // raise your hand; director sees this
			raisehand();
		} else if (note == "F4") { // start/stop local recording
			recordLocalVideoToggle();
		} else if (note == "G4") {  // Director Enables their Audio output
			press2talk(true);
		} else if (note == "A4") {  // Director cut's their audio/video output
			hangup2();
		} else if (note == "B4") { // toggle speaker
			toggleSpeakerMute();
		}
	} else if (session.midiHotkeys==2){
		if (note == "G1") {  // open and close the chat window
			toggleChat();
		} else if (note == "A1") { // mute your audio output
			toggleMute();
		} else if (note == "B1") { // mute your video output
			toggleVideoMute();
		} else if (note == "C2") { // enable / disable screenshare
			toggleScreenShare();
		} else if (note == "D2") { // completely kill your connection/session
			hangup();
		} else if (note == "E2") { // raise your hand; director sees this
			raisehand();
		} else if (note == "F2") { // start/stop local recording
			recordLocalVideoToggle();
		} else if (note == "G2") {  // Director Enables their Audio output
			press2talk(true);
		} else if (note == "A2") {  // Director cut's their audio/video output
			hangup2();
		} else if (note == "B2") { //  toggle speaker
			toggleSpeakerMute();
		}
	} else if (session.midiHotkeys==3){
		if (note == "C1"){
			if (velocity == "0") {  // open and close the chat window
				toggleChat();
			} else if (velocity == "1") { // mute your audio output
				toggleMute();
			} else if (velocity == "2") { // mute your video output
				toggleVideoMute();
			} else if (velocity == "3") { // enable / disable screenshare
				toggleScreenShare();
			} else if (velocity == "4") { // completely kill your connection/session
				hangup();
			} else if (velocity == "5") { // raise your hand; director sees this
				raisehand();
			} else if (velocity == "6") { // start/stop local recording
				recordLocalVideoToggle();
			} else if (velocity == "7") {  // Director Enables their Audio output
				press2talk(true);
			} else if (velocity == "8") {  // Director cut's their audio/video output
				hangup2();
			} else if (velocity == "9") { // toggle speaker
				toggleSpeakerMute();
			}
		}
	}
}

function getRightOrderedElement(selector, guestslot, UUID=false){
	
	var elements = getById("guestFeeds").children;
	if (!UUID){
		for (var i=0;i<elements.length;i++){
			try {
				UUID = elements[i].UUID;
				var lock = parseInt(document.getElementById("position_"+UUID).dataset.locked);
				if (lock && (lock==guestslot+1)){
					return elements[i].querySelector(selector) || false;
				}
			} catch(e){}
		}
	}
	
	if (elements[guestslot]){
		return elements[guestslot].querySelector(selector) || false;
	} else {
		return false;
	}
}

function midiHotkeysCommand_offset(command, value, offset=1){
	//console.log(offset,command);
	for (var i = 0; i<9;i++){
		if (command == offset+i) { 
			var ele =  getRightOrderedElement('[data-action-type="mute-guest"][data--u-u-i-d]', command - offset);
			if (ele) {
				remoteMute(ele, true);
			}
		}
	}
}

function midiHotkeysCommand(command, value){
	if (command == 110){
		if (value == 0) {  // open and close the chat window
			toggleChat();
		} else if (value == 1) { // mute your audio output
			toggleMute();
		} else if (value == 2) { // mute your video output
			toggleVideoMute();
		} else if (value == 3) { // enable / disable screenshare
			toggleScreenShare();
		} else if (value == 4) { // completely kill your connection/session
			hangup();
		} else if (value == 5) { // raise your hand; director sees this
			raisehand();
		} else if (value == 6) { // start/stop local recording
			recordLocalVideoToggle();
		} else if (value == 7) {  // Director Enables their Audio output
			press2talk(true);
		} else if (value == 8) {  // Director cut's their audio/video output
			hangup2();
		}
	} else if (command > 110){
		var guestslot = command-111;
		if (value == 0) { 
			var ele = getRightOrderedElement('[data-action-type="forward"][data--u-u-i-d]', guestslot);
			if (ele) {
				directMigrate(ele, true);
			}
		} else if (value == 1) { 
			var ele = getRightOrderedElement('[data-action-type="addToScene"][data-scene="1"][data--u-u-i-d]', guestslot);
			if (ele) {
				directEnable(ele, true);
			}
		} else if (value == 2) { 
			var ele = getRightOrderedElement('[data-action-type="mute-scene"][data--u-u-i-d]', guestslot);
			if (ele) {
				directMute(ele, true);
			}
		} else if (value == 3) { 
			var ele = getRightOrderedElement('[data-action-type="mute-guest"][data--u-u-i-d]', guestslot);
			if (ele) {
				remoteMute(ele, true);
			}
		}  else if (value == 4) { 
			var ele = getRightOrderedElement('[data-action-type="hangup"][data--u-u-i-d]', guestslot);
			if (ele) {
				directHangup(ele, true);
			}
		} else if (value == 5) { 
			var ele = getRightOrderedElement('[data-action-type="solo-chat"][data--u-u-i-d]', guestslot);
			if (ele) {
				session.toggleSoloChat(ele.dataset.UUID);
			}
		} else if (value == 6) { 
			var ele = getRightOrderedElement('[data-action-type="toggle-remote-speaker"][data--u-u-i-d]', guestslot);
			if (ele) {
				remoteSpeakerMute(ele);
			}
		} else if (value == 7) { 
			var ele = getRightOrderedElement('[data-action-type="toggle-remote-display"][data--u-u-i-d]', guestslot);
			if (ele) {
				remoteDisplayMute(ele);
			}
		} else if (value == 8) { 
			var ele = getRightOrderedElement('[data-action-type="force-keyframe"][data--u-u-i-d]', guestslot);
			if (ele) {
				requestKeyframeScene(ele);
			}
		} else if (value == 12) { 
			var ele = getRightOrderedElement('[data-action-type="addToScene"][data-scene="2"][data--u-u-i-d]', guestslot);
			if (ele) {
				directEnable(ele, true);
			}
		} else if (value == 13) { 
			var ele = getRightOrderedElement('[data-action-type="addToScene"][data-scene="3"][data--u-u-i-d]', guestslot);
			if (ele) {
				directEnable(ele, true);
			}
		} else if (value == 14) { 
			var ele = getRightOrderedElement('[data-action-type="addToScene"][data-scene="4"][data--u-u-i-d]', guestslot);
			if (ele) {
				directEnable(ele, true);
			}
		} else if (value == 15) { 
			var ele = getRightOrderedElement('[data-action-type="addToScene"][data-scene="5"][data--u-u-i-d]', guestslot);
			if (ele) {
				directEnable(ele, true);
			}
		} else if (value == 16) { 
			var ele = getRightOrderedElement('[data-action-type="addToScene"][data-scene="6"][data--u-u-i-d]', guestslot);
			if (ele) {
				directEnable(ele, true);
			}
		} else if (value == 17) { 
			var ele = getRightOrderedElement('[data-action-type="addToScene"][data-scene="7"][data--u-u-i-d]', guestslot);
			if (ele) {
				directEnable(ele, true);
			}
		} else if (value == 18) { 
			var ele = getRightOrderedElement('[data-action-type="addToScene"][data-scene="8"][data--u-u-i-d]', guestslot);
			if (ele) {
				directEnable(ele, true);
			}
		} else if ((value => 27)) { 
			var ele = getRightOrderedElement('[data-action-type="volume"][data--u-u-i-d]', guestslot);
			if (ele) {
				ele.value = parseInt(value-27);
				remoteVolume(ele);
			}
		}
	}
}

function sendRawMIDI(input, UUID=false, streamID=false){
	// session.sendRawMIDI(e.data.sendRawMIDI);
	log(input);
	var msg = {};
	msg.midi = {};
	msg.midi.d = input.data;
	if ("timestamp" in input){
		msg.midi.s = input.timestamp;
	} else {
		msg.midi.s =  Date.now(); // unix timestamp
	}
	
	if (input.message && input.message.channel){
		msg.midi.c = input.message.channel;
	} else if (input && input.channel){
		msg.midi.c = input.channel;
	}
	
	if (UUID && session.pcs[UUID] && session.pcs[UUID].allowMIDI){
		session.sendMessage(msg, UUID);
	} else if (UUID && session.rpcs[UUID] && session.rpcs[UUID].allowMIDI){
		session.sendRequest(msg, UUID);
	} else if (streamID){
		for (var UUID in session.rpcs){
			if (session.rpcs[UUID].allowMIDI && (session.rpcs[UUID].streamID === streamID)){  // specific to gstreamer code aplication
				session.sendRequest(msg, UUID)
				return; // only one stream ID should match
			}
		}
	} else {
		var list = [];
		for (var UUID in session.pcs){
			if (session.pcs[UUID].allowMIDI){
				if (session.sendMessage(msg, UUID)){
					list.push(UUID);
				}
			}
		}
		for (var UUID in session.rpcs){
			if (session.rpcs[UUID].allowMIDI){  // specific to gstreamer code aplication
				if (!list.includes(UUID)){
					session.sendRequest(msg, UUID)
				}
			}
		}
	}
}

function playbackMIDI(msg, unsafe=false){
	if (session.midiIn===false && session.midiRemote===false){return;} // just in case; security
	else if ((session.midiOut===session.midiIn) && (session.midiRemote===false)){return;}  // avoid feedback loops
	//msg.midi.d = e.data;
	//msg.midi.s = e.timestamp;
	//msg.midi.t = e.type;
	if (session.midiIn===true){
		if ("d" in msg){
			for (var i in WebMidi.outputs){
				try {
					if ("c" in msg){
						WebMidi.outputs[i].channels[msg.c].send(msg.d);
					} else {
						WebMidi.outputs[i].send(msg.d);
					}
				} catch(e){errorlog(e);}
			}
		}
	} else if (session.midiIn==parseInt(session.midiIn)){
		try {
			var i = parseInt(session.midiIn)-1;
			if ("d" in msg){
				if ("c" in msg){
					WebMidi.outputs[i].channels[msg.c].send(msg.d);
				} else {
					WebMidi.outputs[i].send(msg.d);
				}
			}
		} catch(e){errorlog(e);};
	}
	
	if (unsafe){return;} // I don't know how midi remote works in reverse, so lets ignore it
	
	if (session.midiRemote==4){
		if (msg.d[0] == 176){
			midiHotkeysCommand(msg.d[1], msg.d[2]);
		} 
	} else if (session.midiRemote==1 || session.midiRemote==2 || session.midiRemote==3){
		if  (msg.d[0] == 156){
			if (msg.d[1] == 33){
				midiHotkeysNote("A1", msg.d[2]);
			} else if (msg.d[1] == 55){
				midiHotkeysNote("G3", msg.d[2]);
			} else if (msg.d[1] == 57){
				midiHotkeysNote("A3", msg.d[2]);
			} else if (msg.d[1] == 59){
				midiHotkeysNote("B3", msg.d[2]);
			} else if (msg.d[1] == 60){
				midiHotkeysNote("C4", msg.d[2]);
			} else if (msg.d[1] == 62){
				midiHotkeysNote("D4", msg.d[2]);
			} else if (msg.d[1] == 64){
				midiHotkeysNote("E4", msg.d[2]);
			} else if (msg.d[1] == 65){
				midiHotkeysNote("F4", msg.d[2]);
			} else if (msg.d[1] == 67){
				midiHotkeysNote("G4", msg.d[2]);
			} else if (msg.d[1] == 69){
				midiHotkeysNote("A4", msg.d[2]);
			} else if (msg.d[1] == 43){
				midiHotkeysNote("G2", msg.d[2]);
			} else if (msg.d[1] == 35){
				midiHotkeysNote("B1", msg.d[2]);
			} else if (msg.d[1] == 36){
				midiHotkeysNote("C2", msg.d[2]);
			} else if (msg.d[1] == 38){
				midiHotkeysNote("D2", msg.d[2]);
			} else if (msg.d[1] == 40){
				midiHotkeysNote("E2", msg.d[2]);
			} else if (msg.d[1] == 41){
				midiHotkeysNote("F2", msg.d[2]);
			} else if (msg.d[1] == 24){
				midiHotkeysNote("C1", msg.d[2]);
			}
		}
	}
	//var output = WebMidi.getOutputById("123456789");
	//output = WebMidi.getOutputByName("Axiom Pro 25 Ext Out");
	//output = WebMidi.outputs[0];
}

function addEventToAll(targets, trigger, callback) { // js helper
	const target = document.querySelectorAll(targets);
	var triggers = trigger.split(" ");
	for (let i = 0; i < target.length; i++) {
		for (let j = 0; j < triggers.length; j++) {
			setTimeout(function(t1,t2){
				t1.addEventListener(t2, function(e) {
					callback(e, t1);
				});
			},0,target[i],triggers[j]);
		}
	}
}
addEventToAll(".column", 'click', function(e, ele) {
	if (ele.classList.contains("skip-animation")) {
		return;
	}
	var bounding_box = ele.getBoundingClientRect();
	ele.style.top = bounding_box.top + "px";
	ele.style.left = (bounding_box.left - 20) + "px";
	ele.classList.add('in-animation');
	ele.classList.remove('pointer');
	ele.classList.remove('rounded');
	
	if (document.getElementById("empty-container")) {
		getById("empty-container").parentNode.removeChild(getById("empty-container"));
	}
	var empty = document.createElement("DIV");
	empty.id = "empty-container";
	empty.className = "column";
	ele.parentNode.insertBefore(empty, ele.nextSibling);
	const styles = "\
		@keyframes outlightbox {\
			0% {\
				height: 100%;\
				width: 100%;\
				top: 0px;\
				left: 0px;\
			}\
			50% {\
				height: 200px;\
				top: " + bounding_box.y + "px;\
			}\
			100% {\
				height: 200px;\
				width: " + bounding_box.width + "px;\
				top: " + bounding_box.y + "px;\
				left: " + bounding_box.x + "px;\
			}\
		}\
	";
	if (document.getElementById('lightbox-animations')) {
		getById("lightbox-animations").innerHTML = styles;
	}
	document.body.style.overflow = "hidden";
});
addEventToAll(".close", 'click', function(e, ele) {
	cleanupMediaTracks();
	ele.style.display = "none";
	mapToAll(".container-inner", function(target) {
		target.style.display = "none";
	});
	document.body.style.overflow = "auto";
	var bounding_box = getById("empty-container").parentNode.getBoundingClientRect();
	setTimeout(function() { // just smoothes things out; breathing room to clean up things first.
		ele.parentNode.classList.add('out-animation');
	}, 1);
	ele.parentNode.style.top = bounding_box.top + 'px';
	ele.parentNode.style.left = bounding_box.left + 'px';
	e.stopPropagation();
});
addEventToAll(".column", 'animationend', function(e, ele) {
	if (e.animationName == 'inlightbox') {
		ele.classList.add("skip-animation");
		mapToAll(".close", function(target) {
			target.style.display = "block";
		}, ele);
		mapToAll(".container-inner", function(target) {
			target.style.display = "block";
		}, ele);
	} else if (e.animationName == 'outlightbox') {
		ele.classList.remove('in-animation');
		ele.classList.remove('out-animation');
		ele.classList.remove("skip-animation");
		ele.classList.remove('columnfade');
		ele.classList.add('pointer');
		ele.classList.add('rounded');
		getById("empty-container").parentNode.removeChild(getById("empty-container"));
		getById("lightbox-animations").sheet.deleteRule(0);
	}
});
addEventToAll("#audioSource", 'mousedown touchend focusin focusout', function(e, ele) {
	var state = getById('multiselect-trigger').dataset.state || 0; // Does this return TRU instead??. GAH. #TODO: 
	if (state == 0) {
		getById('multiselect-trigger').dataset.state = 1;
		getById('multiselect-trigger').classList.add('open');
		getById('multiselect-trigger').classList.remove('closed');
		mapToAll('.chevron', function(ele) {
			ele.classList.remove('bottom');
		}, parentElement = getById('multiselect-trigger'));
		mapToAll('.multiselect-contents', function(ele) {
			ele.style.display = "block";
			mapToAll('input[type="checkbox"]', function(ele2) {
				ele2.parentNode.style.display = "block";
				ele2.style.display = "inline-block";
			}, ele);
		}, parentElement = getById('multiselect-trigger').parentNode);
	}
	e.stopPropagation();
	//e.preventDefault();
});
addEventToAll("#audioSource3", 'mousedown touchend focusin focusout', function(e, ele) {
	var state = getById('multiselect-trigger3').dataset.state || 0; // Does this return TRU instead??. GAH. #TODO: 
	if (state == 0) {
		getById('multiselect-trigger3').dataset.state = 1;
		getById('multiselect-trigger3').classList.add('open');
		getById('multiselect-trigger3').classList.remove('closed');
		mapToAll(".chevron", function(target) {
			target.classList.remove('bottom');
		}, getById('multiselect-trigger3'));
		mapToAll(".multiselect-contents", function(target) {
			target.style.display = "block";
		}, getById('multiselect-trigger3').parentNode);
		mapToAll(".multiselect-contents", function(target) {
			mapToAll('input[type="checkbox"]', function(target2) {
				target2.style.display = "inline-block";
				target2.parentNode.style.display = "block";
			}, target);
		}, getById('multiselect-trigger3').parentNode);
	}
	e.stopPropagation();
	//e.preventDefault();
});
addEventToAll("#multiselect-trigger", 'mousedown touchend focusin focusout', function(e, ele) {
	var state = ele.dataset.state || 0; //  Does this return TRU instead??. GAH. #TODO: 
	if (state == 0) { // open the dropdown
		ele.dataset.state = 1;
		ele.classList.add('open');
		ele.classList.remove('closed');
		mapToAll(".chevron", function(target) {
			target.classList.remove('bottom');
		}, getById('multiselect-trigger'));
		mapToAll(".multiselect-contents", function(target) {
			target.style.display = "block";
		}, ele.parentNode);
		mapToAll(".multiselect-contents", function(target) {
			mapToAll('input[type="checkbox"]', function(target2) {
				target2.style.display = "inline-block";
				target2.parentNode.style.display = "block";
			}, target);
		}, ele.parentNode);
	} else { // close the dropdown
		ele.dataset.state = 0;
		ele.classList.add('closed');
		ele.classList.remove('open');
		mapToAll(".chevron", function(target) {
			target.classList.add('bottom');
		}, ele);
		mapToAll(".multiselect-contents", function(target) {
			mapToAll('input[type="checkbox"]', function(target2) {
				target2.style.display = "none";
				if (!target2.checked) {
					target2.parentNode.style.display = "none";
				}
			}, target);
		}, ele.parentNode);
	}
	e.preventDefault();
	e.stopPropagation();
});
addEventToAll("#multiselect-trigger3", 'mousedown touchend focusin focusout', function(e, ele) {
	var state = ele.dataset.state || 0;  // Does this return TRU instead??. GAH. #TODO: 
	if (state == 0) { // open the dropdown
		ele.dataset.state = 1;
		ele.classList.add('open');
		ele.classList.remove('closed');
		mapToAll(".chevron", function(target) {
			target.classList.remove('bottom');
		}, ele);
		mapToAll(".multiselect-contents", function(target) {
			target.style.display = "block";
		}, ele.parentNode);
		mapToAll(".multiselect-contents", function(target) {
			mapToAll('input[type="checkbox"]', function(target2) {
				target2.style.display = "inline-block";
				target2.parentNode.style.display = "block";
			}, target);
		}, ele.parentNode);
	} else { // close the dropdown
		ele.dataset.state = 0;
		ele.classList.add('closed');
		ele.classList.remove('open');
		mapToAll(".chevron", function(target) {
			target.classList.add('bottom');
		}, ele);
		mapToAll(".multiselect-contents", function(target) {
			mapToAll('input[type="checkbox"]', function(target2) {
				target2.style.display = "none";
				if (!target2.checked) {
					target2.parentNode.style.display = "none";
				}
			}, target);
		}, ele.parentNode);
	}
	e.preventDefault();
	e.stopPropagation();
});


function getSenders2(UUID){
	var fixedSenders = [];
	var isAlt = false;
	if (!(UUID in session.pcs)){return fixedSenders;}
	if ("realUUID" in session.pcs[UUID]){
		isAlt=true;
		UUID = session.pcs[UUID].realUUID;
		if (!(UUID in session.pcs)){return fixedSenders;}
	}
	var senders = session.pcs[UUID].getSenders();
	
	if (isAlt){
		senders.forEach((sender)=>{
			if (sender.track && sender.track.id){
				if (sender.track.id in screenshareTracks) {
					fixedSenders.push(sender);
				}
			}
		});
	} else {
		senders.forEach((sender)=>{
			if (sender.track && sender.track.id){
				if (!(sender.track.id in screenshareTracks)){
					fixedSenders.push(sender);
				}
			}
		});
	}
	
	return fixedSenders;
}

function getReceivers2(UUID){
	var fixedReceivers = [];
	var isAlt = false;
	var ssTracks = [];
	if ("realUUID" in session.rpcs[UUID]){
		isAlt=true;
		UUID = session.rpcs[UUID].realUUID;
		if (!("screenIndexes" in session.rpcs[UUID])){
			errorlog("this is supposed to be a screen share, but no screen share index was found");
			return;
		}
		ssTracks = session.rpcs[UUID].screenIndexes;
	} else if (("screenIndexes" in session.rpcs[UUID]) && session.rpcs[UUID].screenIndexes){
		ssTracks = session.rpcs[UUID].screenIndexes;
	}
	
	var receivers = session.rpcs[UUID].getReceivers();
	
	if (isAlt){
		for (var i=0;i<receivers.length;i++){
			for (var j=0;j<ssTracks.length;j++){
				if (i == ssTracks[j]) {
					fixedReceivers.push(receivers[i]);
					break;
				}
			}
		}
	} else {
		for (var i=0;i<receivers.length;i++){
			var matched = false;
			for (var j=0;j<ssTracks.length;j++){
				if (i == ssTracks[j]) {
					matched = true;
				}
			}
			if (!matched){
				fixedReceivers.push(receivers[i]);
			}
		}
	}
	return fixedReceivers;
}

function createSecondStream2(UUID){
	if (!("allowScreen" in session.pcs[UUID])){return false;}
	if ("realUUID" in session.pcs[UUID]){return false;} // we don't want to attach to an existing screen share obviously
	if (!session.screenStream){return false;}
	
	if (!((UUID+"_screen") in session.pcs)){
		warnlog(UUID+"_screen; new screen link");
		session.pcs[UUID+"_screen"] = {};
		session.pcs[UUID+"_screen"].realUUID = UUID;
		session.pcs[UUID+"_screen"].stats = {};
		session.pcs[UUID+"_screen"].sceneDisplay = null;
		session.pcs[UUID+"_screen"].sceneMute = null;
		session.pcs[UUID+"_screen"].obsVisibility = null;
		session.pcs[UUID+"_screen"].obsSourceActive = null;
		session.pcs[UUID+"_screen"].obsStreaming = null;
		session.pcs[UUID+"_screen"].obsRecording = null;
		session.pcs[UUID+"_screen"].optimizedBitrate = false;
		session.pcs[UUID+"_screen"].savedBitrate = false;
		session.pcs[UUID+"_screen"].bitrateTimeout = null;
		session.pcs[UUID+"_screen"].bitrateTimeoutFirefox = false;
		session.pcs[UUID+"_screen"].setBitrate = false;
		session.pcs[UUID+"_screen"].maxBandwidth = null; // based on max available bitrate
		session.pcs[UUID+"_screen"].limitAudio = false;
		session.pcs[UUID+"_screen"].enhanceAudio = false;
		session.pcs[UUID+"_screen"].meshcast = null;
		session.pcs[UUID+"_screen"].UUID = UUID+"_screen";
		session.pcs[UUID+"_screen"].scale = false;
		session.pcs[UUID+"_screen"].scaleDueToBitrate = false;
		session.pcs[UUID+"_screen"].scaleWidth = false;
		session.pcs[UUID+"_screen"].scaleHeight = false;
		session.pcs[UUID+"_screen"].scaleResolution = false;
		session.pcs[UUID+"_screen"].scene = false;
		session.pcs[UUID+"_screen"].keyframerate = false;
		session.pcs[UUID+"_screen"].keyframeTimeout = null;
		session.pcs[UUID+"_screen"].label = false;
		session.pcs[UUID+"_screen"].order = false;
		session.pcs[UUID+"_screen"].preferVideoCodec = false;
		session.pcs[UUID+"_screen"].startTime = Date.now();
		
		session.pcs[UUID+"_screen"].getStats = function(){
			return new Promise((resolve, reject) => {
				resolve([]);
			});
		}
	}
	
	var senders = getSenders2(UUID+"_screen");
	session.screenStream.getTracks().forEach(function(track){
		var added = false;
		senders.forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
			if (added){return;}
			if (sender.track && (sender.track.kind == track.kind)) {
				sender.replaceTrack(track); // replace may not be supported by all browsers.  eek.
				sender.track.enabled = true; 
				added = true;
			}
		});
		if (!added){
			session.pcs[UUID].addTrack(track, session.screenStream);
		}
	});
}
var screenshareTracks = {};
var screenShareState2 = false;
var firsttime = true;
async function createSecondStream() { //////////////////////////// 
	if (screenShareState2 == false) { // adding a screen
	
		var video = {}
		
		var quality = session.quality_ss || 0;
		
		if (session.quality !== false){
			quality = session.quality;
		}
		if (session.screensharequality!==false){
			quality = session.screensharequality;
		}
	
		if (quality == -1) {
			// unlocked capture resolution
		} else if (quality == 0) {
			video.width = {
				ideal: 1920
			};
			video.height = {
				ideal: 1080
			};
		} else if (quality == 1) {
			video.width = {
				ideal: 1280
			};
			video.height = {
				ideal: 720
			};
		} else if (quality == 2) {
			video.width = {
				ideal: 640
			};
			video.height = {
				ideal: 360
			};
		} else if (quality >= 3) { // lowest
			video.width = {
				ideal: 320
			};
			video.height = {
				ideal: 180
			};
		}

		if (session.width) {
			video.width = {
				ideal: session.width
			};
		}
		if (session.height) {
			video.height = {
				ideal: session.height
			};
		}
		
		var constraints = { // this part is a bit annoying. Do I use the same settings?  I can add custom setting controls here later
			audio: {
				echoCancellation: true, // we want to cancel echo, since this is a secondary stream
				autoGainControl: false,
				noiseSuppression: false
			}, 
			video: video
			//,cursor: {exact: "none"}
		};
		
		if (session.screensharecursor){
			constraints.video.cursor = ["always", "motion"];
		} else {
			try {
				let supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
				if (supportedConstraints.cursor) {
					constraints.video.cursor = "never";
				}
			} catch(e){
				warnlog("navigator.mediaDevices.getSupportedConstraints() not supported");
			}
		}

		if (session.echoCancellation === false) {
			constraints.audio.echoCancellation = false;
		}
		if (session.autoGainControl === true) {
			constraints.audio.autoGainControl = true;
		}
		if (session.noiseSuppression === true) {
			constraints.audio.noiseSuppression = true;
		}
		//if (audio == false) {
		//	constraints.audio = false;
		//}

		if (session.framerate) {
			constraints.video.frameRate = session.framerate;
		} else if (session.maxframerate !== false){ // not limiting screen share's fps with quality=2 due to gaming centric nature
			constraints.video.frameRate = {
				ideal: session.maxframerate,
				max: session.maxframerate
			};
		}
		
		if (session.screenshareVideoOnly){
			constraints.audio = false;
		}

		if ((constraints.video!==false) && (Object.keys(constraints.video).length==0)){
			constraints.video = true;
		}
		
		if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
			if (!ElectronDesktopCapture){
				if (!(session.cleanOutput)) {
					warnUser("Enable Elevated Privileges to allow screen-sharing. (right click this window to see that option)");
				}
				return false;
			}
		}
		
		log("sstype3 screen share");
		log(constraints);
		
		//
		navigator.mediaDevices.getDisplayMedia(constraints).then(function(stream) {
			screenShareState2 = true;
			session.screenStream = stream; 
			try {
				stream.getVideoTracks()[0].onended = function () {
					stopSecondScreenshare();
				};
			} catch(e){log("No Video selected; screensharing?");}
			
			session.screenStream.getTracks().forEach(function(track){
				screenshareTracks[track.id] = true;
			});
			for (UUID in session.pcs){
				createSecondStream2(UUID);
			}
			
			if (!firsttime){
				var msg = {};
				msg.screenStopped = false; 
				session.sendMessage(msg);
			}
			firsttime=false
			getById("screenshare3button").classList.remove("float");
			getById("screenshare3button").classList.add("float2");
			getById("screenshare3button").title = miscTranslations["stop-screen-sharing"];
		}).catch(function(err) {
			errorlog(err);
		});
	} else { // removing a screen
		stopSecondScreenshare();
	}
}

function stopSecondScreenshare(){
	var msg = {};
	msg.screenStopped = true;
	session.sendMessage(msg);

	session.screenStream.getTracks().forEach(function(track) { // previous video track; saving it. Must remove the track at some point.
		for (UUID in session.pcs){
			if (!("realUUID" in session.pcs[UUID])){continue;} // not a screen share, so skip
			var senders = getSenders2(UUID);
			senders.forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
				if (sender.track && sender.track.kind == "video") {
					sender.track.enabled = false;
				}
			});
		}
		if (track.id in screenshareTracks) {
			session.screenStream.removeTrack(track);
			track.stop();
			screenshareTracks[track.id] = false;
		}
	});
	session.screenStream = false;
	screenShareState2 = false;
	getById("screenshare3button").classList.remove("float2");
	getById("screenshare3button").classList.add("float");
	getById("screenshare3button").title = miscTranslations["share-a-screen"];
	pokeIframeAPI("screen-share-ended");
}

function createControlBoxScreenshare(UUID, soloLink, streamID) {
	if (document.getElementById("deleteme")) {
		getById("deleteme").parentNode.removeChild(getById("deleteme"));
	}
	var controls = getById("controls_blank").cloneNode(true);
	controls.style.display = "block";
	controls.id = "controls_" + UUID;
	
	var container = document.createElement("div");
	container.id = "container_" + UUID; // needed to delete on user disconnect
	container.UUID = UUID;
	container.className = "vidcon directorMargins";
	
	if (session.orderby){
		try {
			var added = false;
			for (var i=0;i<getById("guestFeeds").children.length;i++){
				if (getById("guestFeeds").children[i].UUID && !getById("guestFeeds").children[i].shifted){
					if (getById("guestFeeds").children[i].UUID in session.rpcs){
						if (session.rpcs[getById("guestFeeds").children[i].UUID].streamID.toLowerCase() > streamID.toLowerCase()){
							getById("guestFeeds").insertBefore(container, getById("guestFeeds").children[i]);
							added = true;
							break;
						}
					}
				}
			
			}
			if (!added){
				getById("guestFeeds").appendChild(container);
			}
		} catch(e){
			getById("guestFeeds").appendChild(container);
		}
	} else {
		getById("guestFeeds").appendChild(container);
	}

	controls.querySelector(".controlsGrid").classList.add("notmain");
	
	if (!session.rpcs[UUID].voiceMeter) {
		if (session.meterStyle==1){
			session.rpcs[UUID].voiceMeter = getById("voiceMeterTemplate2").cloneNode(true);
		} else {
			session.rpcs[UUID].voiceMeter = getById("voiceMeterTemplate").cloneNode(true);
			session.rpcs[UUID].voiceMeter.style.opacity = 0; 
			if (session.meterStyle==2){
				session.rpcs[UUID].voiceMeter.classList.add("video-meter-2");
				session.rpcs[UUID].voiceMeter.classList.remove("video-meter");
			} else {
				session.rpcs[UUID].voiceMeter.classList.add("video-meter-director");
			}
		}
		session.rpcs[UUID].voiceMeter.id = "voiceMeter_" + UUID;
		session.rpcs[UUID].voiceMeter.dataset.level = 0;
		session.rpcs[UUID].voiceMeter.classList.remove("hidden");
	}

	session.rpcs[UUID].remoteMuteElement = getById("muteStateTemplate").cloneNode(true);
	session.rpcs[UUID].remoteMuteElement.id = "";
	session.rpcs[UUID].remoteMuteElement.style.top = "5px";
	session.rpcs[UUID].remoteMuteElement.style.right = "7px";
	
	session.rpcs[UUID].remoteVideoMuteElement = getById("videoMuteStateTemplate").cloneNode(true);
	session.rpcs[UUID].remoteVideoMuteElement.id = "";
	session.rpcs[UUID].remoteVideoMuteElement.style.top = "5px";
	session.rpcs[UUID].remoteVideoMuteElement.style.right = "28px";
	
	session.rpcs[UUID].remoteRaisedHandElement = getById("raisedHandTemplate").cloneNode(true);
	session.rpcs[UUID].remoteRaisedHandElement.id = "";
	session.rpcs[UUID].remoteRaisedHandElement.style.top = "5px";
	session.rpcs[UUID].remoteRaisedHandElement.style.right = "49px";


	var videoContainer = document.createElement("div");
	videoContainer.id = "videoContainer_" + UUID; // needed to delete on user disconnect
	videoContainer.style.margin = "0";
	videoContainer.style.position = "relative";
	videoContainer.style.minHeight = "30px";
	
	var iframeDetails = document.createElement("div");
	iframeDetails.id = "iframeDetails_" + UUID; // needed to delete on user disconnect
	iframeDetails.className = "iframeDetails hidden";

	controls.innerHTML += "<div style='margin:10px;' id='advanced_audio_director_" + UUID + "' class='hidden'></div>";
	controls.innerHTML += "<div style='margin:10px;' id='advanced_video_director_" + UUID + "' class='hidden'></div>";

	var handsID = "hands_" + UUID;

	controls.innerHTML += "<div>";
	
	if (session.hidesololinks==false){
		controls.innerHTML += "<div class='soloButton' title='A direct solo view of the video/audio stream with nothing else.'> \
			<a class='soloLink advanced' data-sololink='true' data-drag='1' draggable='true' onclick='copyFunction(this,event)' \
			value='" + soloLink + "' href='" + soloLink + "'/>" + sanitizeChat(soloLink) + "</a>\
			<button class='pull-right' style='width:100%;background-color:#ecfaff;' onclick='copyFunction(this.previousElementSibling,event)'><i class='las la-user'></i> copy Solo view link</button>\
			</div>";
	}
	
	controls.innerHTML += "<button data-action-type=\"hand-raised\" id='" + handsID + "' class='lowerRaisedHand'  data-value='0' title=\"This guest raised their hand. Click this to clear notification.\" onclick=\"remoteLowerhands('" + UUID + "');\">\
			<i class=\"las la-hand-paper\"></i>\
			<span data-translate=\"user-raised-hand\">Lower Raised Hand</span>\
		</button>\
		</div>";

	controls.querySelectorAll('[data-action-type]').forEach((ele) => { // give action buttons some self-reference
		ele.dataset.UUID = UUID;
		ele.dataset.sid = streamID;
	});
	
	var buttons = "";
	if (session.slotmode){
		buttons += "<div draggable='true' title='Drag to swap layout positions' ondragstart='dragSlot(event)' ondrop='dropSlot(event)' ondragover='allowDropSlot(event)' data-slot='"+biggestSlot+"' data--u-u-i-d='"+UUID+"' class='slotsbar'>slot: "+biggestSlot+"</div>";
	}
	buttons += "<div title='Does not impact scene order.' class='shift'><i class='las la-angle-left' data--u-u-i-d='"+UUID+"' onclick='shiftPC(this,-1);'></i><span onclick='lockPosition(this);' style='cursor:pointer;' data-locked='0' data--u-u-i-d='"+UUID+"' id='position_"+UUID+"'><i class='las la-lock-open'></i></span><i class='las la-angle-right' data--u-u-i-d='"+UUID+"' onclick='shiftPC(this,1);'></i></div><div class='streamID' style='user-select: none;'>ID: <span style='user-select: text;'>" + streamID + "</span>\
	<i class='las la-copy' data-sid='" + streamID + "' onclick='copyFunction(this.dataset.sid,event)' title='Copy this Stream ID to the clipboard' style='cursor:pointer'></i>\
	<span id='label_" + UUID + "' class='addALabel' title='Click here to edit the label for this stream. Changes will propagate to all viewers of this stream'></span>\
	</div>";

	container.innerHTML = buttons;
	updateLockedElements();
	
	container.appendChild(videoContainer);
	
	if (session.signalMeter){
		if (!session.rpcs[UUID].signalMeter){
			session.rpcs[UUID].signalMeter = getById("signalMeterTemplate").cloneNode(true);
			session.rpcs[UUID].signalMeter.id = "signalMeter_" + UUID;
			session.rpcs[UUID].signalMeter.dataset.level = 0;
			session.rpcs[UUID].signalMeter.classList.remove("hidden");
			session.rpcs[UUID].signalMeter.dataset.UUID = UUID;
			session.rpcs[UUID].signalMeter.title = miscTranslations["signal-meter"];
			
			//if (session.rpcs[UUID].stats.info && session.rpcs[UUID].stats.info.cpu_maxed){
			//	session.rpcs[UUID].signalMeter.dataset.cpu = "1";
			//} 
			
			session.rpcs[UUID].signalMeter.addEventListener('click', function(e) { // show stats of video if double clicked
				log("clicked signal meter");
				try {
					e.preventDefault();
					var uid = e.currentTarget.dataset.UUID;
					if ("stats" in session.rpcs[uid]){
						
						var [menu, innerMenu] = statsMenuCreator();
						
						printViewStats(innerMenu, uid );
						
						menu.interval = setInterval(printViewStats, session.statsInterval, innerMenu, uid);
						
					}
					e.stopPropagation();
					return false;
					
				} catch(e){errorlog(e);}
			});
		}
		
		videoContainer.appendChild(session.rpcs[UUID].signalMeter);
	}
	
	videoContainer.appendChild(session.rpcs[UUID].voiceMeter);
	videoContainer.appendChild(session.rpcs[UUID].remoteMuteElement);
	videoContainer.appendChild(session.rpcs[UUID].remoteVideoMuteElement);
	videoContainer.appendChild(session.rpcs[UUID].remoteRaisedHandElement);
	videoContainer.appendChild(iframeDetails);
	videoContainer.appendChild(session.rpcs[UUID].videoElement);
	container.appendChild(controls);
	initSceneList(UUID);
	pokeIframeAPI("control-box", true, UUID);
}