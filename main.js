/*
*  Copyright (c) 2022 Steve Seguin. All Rights Reserved.
*
*  Use of this source code is governed by the APGLv3 open-source license
*  that can be found in the LICENSE file in the root of the source
*  tree. Alternative licencing options can be made available on request.
*
*/
/*jshint esversion: 6 */
async function main(){ // main asyncronous thread; mostly initializes the user settings.
	var delayedStartupFuncs = [];
	
	// translation stuff start ////
	
	var ConfigSettings = getById("main-js");
	var ln_template = false;
	
	try {
		if (ConfigSettings) {
			ln_template = ConfigSettings.getAttribute('data-translation'); // Translations
			if (typeof ln_template === "undefined") {
				ln_template = false;
			} else if (ln_template === null) {
				ln_template = false;
			}
		}

		if (urlParams.has('ln')) {
			ln_template = urlParams.get('ln');
		}
	} catch (e) {
		errorlog(e);
	}

	if (ln_template) { // checking if manual lanuage override enabled
		try {
			log("Lang Template: " + ln_template);
			changeLg(ln_template);
			//getById("mainmenu").style.opacity = 1;
		} catch (error) {
			errorlog(error);
			getById("mainmenu").style.opacity = 1;
		}
	}
	if (location.hostname !== "vdo.ninja" && location.hostname !== "backup.vdo.ninja" && location.hostname !== "obs.ninja") {
		if (location.hostname === "rtc.ninja"){
			try {
				if (session.label === false) {
					document.title = "";
				}
				getById("qos").innerHTML = "";
				getById("logoname").innerHTML = "";
				getById("helpbutton").style.display = "none";
				getById("helpbutton").style.opacity = 0;
				getById("reportbutton").style.display = "none";
				getById("reportbutton").style.opacity = 0;
				//getById("mainmenu").style.opacity = 1;
				getById("mainmenu").style.margin = "30px 0";
				getById("translateButton").style.display = "none";
				getById("translateButton").style.opacity = 0;
				getById("info").style.display = "none";
				getById("info").style.opacity = 0;
				getById("chatBody").innerHTML = "";
			} catch (e) {}
		}
		try {
			if (!ln_template){
				changeLg("blank");
			}
			//getById("mainmenu").style.opacity = 1;
			if (session.label === false) {
				document.title = location.hostname;
			}
			getById("qos").innerHTML = '<i class="las la-plug"></i>'
			getById("logoname").innerHTML = getById("qos").outerHTML;
			getById("helpbutton").style.display = "none";
			getById("reportbutton").style.display = "none";
			getById("chatBody").innerHTML = "";
			getById("qos").style.color = "#FFF0";
			getById("qos").style.fontSize = "70%";
			getById("logoname").style.display = "none";
			getById("logoname").style.margin = "0 0 0 5px";
		} catch (error) {
			getById("mainmenu").style.opacity = 1;
			errorlog(error);
		}
	} else { // check if automatic language translation is available
		getById("mainmenu").style.opacity = 1;
	}

	
	//// translation stuff ends ////
	
	if (urlParams.has('cleanoutput') || urlParams.has('clean') || urlParams.has('cleanish')) {
		session.cleanOutput = true;
	}
	
	if (urlParams.has('cleanviewer') || urlParams.has('cv')) {
		session.cleanViewer = true;
	}
	
	if (urlParams.has('controls') || urlParams.has('videocontrols')) {
		session.showControls = true; // show the video control bar
		
		if (urlParams.get('controls') === "false"){
			session.showControls = false;
		} else if (urlParams.get('controls') === "0"){
			session.showControls = false;
		} else if (urlParams.get('controls') === "off"){
			session.showControls = false;
		}
	}
	if (urlParams.has('nocontrols')) {
		session.showControls = false; // show the video control bar
	}

	if (!isIFrame){
		if (ChromeVersion===65){
			 // pass, since probably manycam and that's bugged
		} else if (getStorage("redirect") == "yes") {
			setStorage("redirect", "", 0);
			session.sticky = true;
		} else if (getStorage("settings") != "") {
			
			 if (!(session.cleanOutput)){
				
				window.focus();
				session.sticky = confirm("Would you like to load your previous session?\n\nThis will redirect you to: "+getStorage("settings"));
				if (!session.sticky) {
					setStorage("settings", "", 0);
					log("deleting cookie as user said no");
				} else {
					var cookieSettings = decodeURI(getStorage("settings"));
					setStorage("redirect", "yes", 1);
					window.location.replace(cookieSettings);
				}
			} else {
				var cookieSettings = decodeURI(getStorage("settings"));
				setStorage("redirect", "yes", 1);
				window.location.replace(cookieSettings);
			}
		}

		if (urlParams.has('sticky')){ // won't work with iframes.
		
			//if (getStorage("permission") == "") {
			//	session.sticky = confirm("Would you allow us to store a cookie to keep your session settings persistent?");
			//} else {
			session.sticky = true;
			
			getById("saveRoom").style.display = "none";
			//}
			//if (session.sticky) {
			setStorage("permission", "yes", 999);
			setStorage("settings", encodeURI(window.location.href), 90);
			//}
		}
	}
	
	
	if (urlParams.has('safemode')) {
		session.safemode = true; // load defa
	} else {
		session.store = {}; 
		loadSettings();
	}
	
	if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
		try {
			getById("electronDragZone").style.cursor="grab";
			if (!ipcRenderer){
				ipcRenderer = require('electron').ipcRenderer;
			}
			window.prompt = function(title, val){
			  return ipcRenderer.sendSync('prompt', {title, val}); // call if needed in the future
			};
			//ipcRenderer.sendSync('prompt', {title, val}); // call now -- but why?
		} catch(e){}
	}

	if (urlParams.has('retrytimeout')) {
		session.retryTimeout = parseInt(urlParams.get('retrytimeout')) || 5000;
		if (session.retryTimeout<5000){
			session.retryTimeout = 5000;
		}
	}

	if (urlParams.has('ptz')){
		session.ptz=true;
	}

	if (urlParams.has('optimize')) {
		session.optimize = parseInt(urlParams.get('optimize')) || 0;
	}

	if (urlParams.has('nosettings') || urlParams.has('ns')) {
		session.screensharebutton = false;
		session.showSettings = false;
	}

	if (urlParams.has('nomicbutton') || urlParams.has('nmb')) {
		getById("mutebutton").style.setProperty("display", "none", "important");
	}
	
	if (urlParams.has('novice') ) {
		document.documentElement.style.setProperty('--advanced-mode', "none"); // hide advanced items
	}
	
	if (urlParams.has('bgimage')) { // URL or data:base64 image. Becomes local to this viewer only.  This is like &avatar, but slightly different. Just CSS in this case
		var avatarImg = urlParams.get('bgimage') || false; 
		if (avatarImg){
			try {
				avatarImg = decodeURIComponent(avatarImg);
			} catch(e){}
			try {
				avatarImg = 'url("'+avatarImg+'")';
				document.documentElement.style.setProperty('--video-background-image', avatarImg);
			} catch(e){}
		}
	}
	
	if (urlParams.has('nomouseevents') || urlParams.has('nme')) {
		session.disableMouseEvents = true;
	}

	if (urlParams.has('novideobutton') || urlParams.has('nvb')) {
		getById("mutevideobutton").style.setProperty("display", "none", "important");
	}
	
	if (urlParams.has('nospeakerbutton') || urlParams.has('nsb')) {
		getById("mutespeakerbutton").style.setProperty("display", "none", "important");
	}
	
	if (urlParams.has('noscale') || urlParams.has('noscaling')) {
		session.noScaling = true;
	}
	
	if (urlParams.has('pusheffectsdata') ) {
		session.pushEffectsData=true;
	}

	if (iOS || iPad) {
		session.mobile = true;
		session.audioEffects = false; // disable audio inbound effects also.
		session.audioMeterGuest = false;
		window.addEventListener('resize', function() {  // Safari is the new IE.
			var msg = {};
			msg.requestSceneUpdate = true;
			session.sendMessage(msg);
			
			if ( window.matchMedia("(orientation: portrait)").matches ) {
				document.getElementsByTagName("html")[0].style.height = "100vh";
				setTimeout(function(){
					document.getElementsByTagName("html")[0].style.height = "100%";
				}, 1000);
			} else if ( window.matchMedia("(orientation: landscape)").matches ) {
				document.getElementsByTagName("html")[0].style.height = "100vh";
				setTimeout(function(){
					document.getElementsByTagName("html")[0].style.height = "100%";
				}, 1000);
			}
		});
		
		if (/CriOS/i.test(navigator.userAgent)) { // if runngin Chrome on iOS
			if (!(session.cleanOutput)) {
				try {
					navigator.mediaDevices.getUserMedia;
				} catch (e) {
					warnUser("Chrome on this device does not support the required technology to use this site.\n\nPlease use Safari instead or update your iOS and browser version.");
				}
			}
		}
	} else if (/Android|Pixel|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) { // not sure how accurate this is.
		session.mobile = true;
		session.audioEffects = false; // disable audio inbound effects also.
		session.audioMeterGuest = false;
	} else {
		log("MAKE DRAGGABLE");
		delayedStartupFuncs.push([makeDraggableElement, document.getElementById("subControlButtons")]);
		if (SafariVersion && !ChromeVersion){ // if desktop Safari, so macOS, give a note saying it sucks
			getById("SafariWarning").classList.remove("hidden");
		}
	}
	
	if (urlParams.has('broadcast') || urlParams.has('bc')) {
		log("Broadcast flag set");
		session.broadcast = urlParams.get('broadcast') || urlParams.get('bc') || null;
		
		if (session.broadcast === "false") {
			session.broadcast = false;
		} else if (session.broadcast=== "0") {
			session.broadcast = false;
		} else if (session.broadcast === "no") {
			session.broadcast = false;
		} else if (session.broadcast === "off") {
			session.broadcast = false;
		} 
		
		//if ((iOS) || (iPad)) {
		//	session.nopreview = false;
		//} else {
		//	session.nopreview = true;
		//}
		session.minipreview = 2; // full screen if nothing else on screen.
		session.style = 1;
		//getById("header").style.display = "none";
		//getById("header").style.opacity = 0;
		session.showList=true;
	}

	if (urlParams.has('showlist')) {
		session.showList = urlParams.get('showlist');
		if (session.showList === "false") {
			session.showList = false;
		} else if (session.showList=== "0") {
			session.showList = false;
		} else if (session.showList === "no") {
			session.showList = false;
		} else if (session.showList === "off") {
			session.showList = false;
		} else {
			session.showList = true;
		}
	}
	
	if (urlParams.has('meshcast')) {
		session.meshcast = urlParams.get('meshcast') || "any";
	}
	
	
	var filename = false;
	try {
		filename = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
		filename = filename.replace("??", "?");
		filename2 = filename.split("?")[0];
		// split at ???
		if (filename.split(".").length == 1) {
			if (filename2.length < 2) { // easy win
				filename = false;
			} else if (filename.startsWith("&")) { // easy win
				var tmpHref = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/?" + filename.split("&").slice(1).join("&");
				log("TMP " + tmpHref);
				updateURL(filename.split("&")[1], true, tmpHref);
				filename = false;
			} else if (filename2.split("&")[0].includes("=")) {
				log("asdf  " + filename.split("&")[0]);
				if (history.pushState) {
					var tmpHref = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
					tmpHref = tmpHref + "/?" + filename;
					filename = false;
					//warnUser("Please ensure your URL is correctly formatted.");
					window.history.pushState({path: tmpHref.toString()}, '', tmpHref.toString());
				}
			} else {
				filename = filename2.split("&")[0];
				if (filename2 != filename) {
					warnUser("Warning: Please ensure your URL is correctly formatted.");
				}
			}
		} else {
			filename = false;
		}
		log(filename);
	} catch (e) {
		errorlog(e);
	}


	var directorLanding = false;
	if (urlParams.has('director') || urlParams.has('dir')) {
		directorLanding = urlParams.get('director') || urlParams.get('dir') || null;
		if (directorLanding === null) {
			directorLanding = true;
		} else if (directorLanding.length === 0) {
			directorLanding = true;
		} else {
			directorLanding = false;
		}
		session.meterStyle = 1;
		session.signalMeter = true;
	} else if (filename === "director") {
		directorLanding = true;
		filename = false;
		session.meterStyle = 1;
		session.signalMeter = true;
	}
	
	session.slotmode = false; // temporary; remove in the future TODO: ## -----------------------
	if (urlParams.has('slotmode')){
		session.slotmode = true;
	}
	

	if (urlParams.has('signalmeter')) {
		session.signalMeter = urlParams.get('signalmeter');
		if (session.signalMeter === "false") {
			session.signalMeter = false;
		} else if (session.signalMeter=== "0") {
			session.signalMeter = false;
		} else if (session.signalMeter === "no") {
			session.signalMeter = false;
		} else if (session.signalMeter === "off") {
			session.signalMeter = false;
		} else {
			session.signalMeter = true;
		}
	}

	if (urlParams.has('rooms')) {
		session.rooms = urlParams.get('rooms').split(",").map(function(e) { 
			return sanitizeRoomName(e);
		});
		getById("rooms").classList.remove('hidden');
	}

	if (urlParams.has('showdirector') || urlParams.has('sd')) {
		session.showDirector = parseInt(urlParams.get('showdirector')) || parseInt(urlParams.get('sd')) || true; // if 2, video only allowed.  True or 1 will be video + audio allowed.
	}
	
	if (urlParams.has('bitratecutoff') || urlParams.has('bitcut')) {
		session.lowBitrateCutoff = parseInt(urlParams.get('bitratecutoff')) || parseInt(urlParams.get('bitcut')) || 300; // low bitrate cut off.
	}
	
	if (urlParams.has("statsinterval")){
		session.statsInterval = parseInt(urlParams.get("statsinterval")) || 3000; // milliseconds.  interval of requesting stats of remote guests
	}
	
	if (urlParams.has('rotate') ) {
		session.rotate = urlParams.get('rotate') || 90;
		session.rotate = parseInt(session.rotate);
	}
	
	if (urlParams.has('facing') ) {
		session.facingMode = urlParams.get('facing') || false;
	}
	if (session.facingMode){
		session.facingMode = session.facingMode.toLowerCase();
		if (session.facingMode == "user"){
			//
		} else if (session.facingMode == "environment"){
			//
		} else if (session.facingMode == "rear"){
			session.facingMode = "environment";
		} else if (session.facingMode == "back"){
			session.facingMode = "environment";
		} else if (session.facingMode == "front"){
			session.facingMode = "user";
		} else {
			session.facingMode = false;
		}
	}
	
	//  session.facingMode }; // user or environment
	
	if (urlParams.has('forcelandscape') || urlParams.has('forcedlandscape') || urlParams.has('fl')){
		session.orientation = "landscape";
	} else if (urlParams.has('forceportrait') || urlParams.has('forcedportrait')|| urlParams.has('fp')){
		session.orientation = "portrait";
	}
	
	
	document.addEventListener('fullscreenchange', event => {
		log("full screen change event");
		if (session.orientation && session.mobile){
			if (document.fullscreenElement) {
				document.exitFullscreen();
			}
		} else {
			updateMixer();
		}
	});

	if (urlParams.has('midi') || urlParams.has('hotkeys')) {
		session.midiHotkeys = urlParams.get('midi') || urlParams.get ('hotkeys') || 1;
		session.midiHotkeys = parseInt(session.midiHotkeys);
	}
	
	if (urlParams.has('disablehotkeys')){
		session.disableHotKeys = true;
	}
	
	if (urlParams.has('nohangupbutton') || urlParams.has('nohub')){
		getById("hangupbutton").style.display = "none";
	}
	
	if (urlParams.has('midioffset')){
		session.midiOffset = urlParams.get('midioffset') || 0;
		session.midiOffset = parseInt(session.midiOffset);
	}
	
	if (urlParams.has('midiremote') || urlParams.has('remotemidi')){
		if (session.director!==false){
			session.midiRemote = parseInt(urlParams.get('midiremote')) || parseInt(urlParams.get ('remotemidi')) || 4;
		} else {
			session.midiRemote = parseInt(urlParams.get('midiremote')) || parseInt(urlParams.get ('remotemidi')) || 1;
		}
	}

	if (urlParams.has('midipush') || urlParams.has('midiout') || urlParams.has('mo')){
		session.midiOut =  parseInt(urlParams.get('midipush')) ||  parseInt(urlParams.get('midiout')) || parseInt(urlParams.get('mo')) || true;
	}
	
	if (urlParams.has('midipull') || urlParams.has('midiin') || urlParams.has('midin') ||  urlParams.has('mi')){
		session.midiIn = parseInt(urlParams.get('midipull')) ||  parseInt(urlParams.get('midiin')) || parseInt(urlParams.get('midin')) || parseInt(urlParams.get('mi')) || true;
	}

	if (urlParams.has('midichannel')){
		session.midiChannel =  parseInt(urlParams.get('midichannel')) || false;
	}
	if (session.midiChannel){
		session.midiChannel = parseInt(session.midiChannel);
		if (session.midiChannel>16){session.midiChannel=false;}
		if (session.midiChannel<1){session.midiChannel=false;}
	}
	if (urlParams.has('mididevice')){
		session.midiDevice =  parseInt(urlParams.get('mididevice')) || false;
	}
	if (session.midiDevice){
		session.midiDevice = parseInt(session.midiDevice);
	}
	
	if (urlParams.has('webcam') || urlParams.has('wc') || urlParams.has('miconly')) {
		session.webcamonly = true;
		session.screensharebutton = false;
		if (urlParams.has('miconly')){
			session.videoDevice=0;
			session.miconly = true;
			miniTranslate(getById("add_camera"), "share-your-mic", "Share your Microphone");
			getById("container-3").title = getById("add_camera").innerText;
			
			getById("videoMenu").style.display = "none";
			getById("container-3").classList.add("microphoneBackground");
			getById("flipcamerabutton").style.setProperty("display", "none", "important");
			getById("mutevideobutton").style.setProperty("display", "none", "important");
			getById("videoMenu3").style.setProperty("display", "none", "important");
			getById("previewWebcam").classList.add("miconly");
			//if (session.consent){
			//	setTimeout(function(){
			//		warnUser("⚠ Privacy warning: The director of this room can remotely switch your camera or microphone without permission.", 8000);
			//	}, 1500);
			//}
		}
	} else if (urlParams.has('screenshare') || urlParams.has('ss')) {
		session.screenshare = true;
		if (urlParams.get('screenshare') || urlParams.get('ss')){
			session.screenshare = urlParams.get('screenshare') || urlParams.get('ss');
		}
	} else if (urlParams.has('fileshare') || urlParams.has('fs')) {
		getById("container-5").classList.remove('hidden');
		getById("container-5").classList.add("skip-animation");
		getById("container-5").classList.remove('pointer');
		
		if (SafariVersion){
			getById("safari_warning_fileshare").classList.remove('hidden');
		} else if (!Firefox){
			getById("chrome_warning_fileshare").classList.remove('hidden');
		}
		
	} else if (directorLanding) {
		getById("container-1").classList.remove('hidden');
		getById("container-1").classList.add("skip-animation");
		getById("container-1").classList.remove('pointer');
	} else if (urlParams.has('website') || urlParams.has('iframe')) {
		getById("container-6").classList.remove('hidden');
		getById("container-6").classList.add("skip-animation");
		getById("container-6").classList.remove('pointer');
		session.website = urlParams.get('website') || urlParams.get('iframe') || false;
		if (session.website){
			if (session.director){
				delayedStartupFuncs.push([shareWebsite, session.website]);
			} else {
				delayedStartupFuncs.push([session.publishIFrame, session.website]);
			}
		}
	} else if (urlParams.has('webcam2') || urlParams.has('wc2')) {
		session.webcamonly = true;
		session.screensharebutton = false;
		session.introButton = true;
	} else if (urlParams.has('screenshare2') || urlParams.has('ss2')) {
		session.screenshare = true;
		session.introButton = true;
		if (urlParams.get('screenshare2') || urlParams.get('ss2')){
			session.screenshare = urlParams.get('screenshare2') || urlParams.get('ss2');
		}
	} 
	
	if (urlParams.has('sstype') || urlParams.has('screensharetype')) { // wha type of screen sharing is used; track replace, iframe, or secondary try
		session.screensharetype = urlParams.get('sstype') || urlParams.get('screensharetype');
		session.screensharetype = parseInt(session.screensharetype) || false;
	}
	
	if (urlParams.has('intro') || urlParams.has('ib')) {
		session.introButton = true;
	}
	
	if (urlParams.has('hidesolo') || urlParams.has('hs')){
		session.hidesololinks=true;
	}

	if (urlParams.has('ssb')) {
		session.screensharebutton = true;
	}
	
	if (urlParams.has('mute') || urlParams.has('muted') || urlParams.has('m')) {
		session.muted = true;
	}
	
	if (urlParams.has('hideguest') || urlParams.has('hidden')) {
		session.directorVideoMuted = true;
	}

	if (urlParams.has('videomute') || urlParams.has('videomuted') || urlParams.has('vm')) {
		session.videoMutedFlag = true;
	}
	
	if (urlParams.has('layout')) {
		try {
			session.layout = JSON.parse(decodeURIComponent(urlParams.get('layout'))) || JSON.parse(urlParams.get('layout')) || false;
		} catch(e){
			session.layout = null
		}
	}


	if (urlParams.has('deaf') || urlParams.has('deafen')) {
		session.directorSpeakerMuted=true; // false == true in this case.
	}

	if (urlParams.has('blind')) {
		session.directorDisplayMuted=true; // false == true in this case.
	}

	if (urlParams.has('blindall')) {
		session.directorBlindButton=true; // false == true in this case.
	}
	if (session.directorBlindButton){
		getById("blindAllGuests").classList.remove("hidden");
	}
	
	if (urlParams.has('dpi') || urlParams.has('dpr')) {
		session.devicePixelRatio = urlParams.get('dpi') || urlParams.get('dpr') || 2.0;
		session.devicePixelRatio = parseFloat(session.devicePixelRatio);
	} //else if (window.devicePixelRatio && window.devicePixelRatio!==1){ 
	//	session.devicePixelRatio = window.devicePixelRatio; // this annoys me to no end.
	//}

	if (urlParams.has('speakermute') || urlParams.has('speakermuted') || urlParams.has('mutespeaker') || urlParams.has('sm') || urlParams.has('ms')) {
		
		var checkState = urlParams.get('speakermute') || urlParams.get('speakermuted') || urlParams.get('mutespeaker') || urlParams.get('sm') || urlParams.get('ms') || true;
		
		if ( checkState === "false") {
			session.speakerMuted = false;
		} else if (checkState === "0") {
			session.speakerMuted = false;
		} else if (checkState === "no") {
			session.speakerMuted = false;
		} else if (checkState === "off") {
			session.speakerMuted = false;
		} else {
			session.speakerMuted = true;
		}
		
		session.speakerMuted_default = session.speakerMuted;
		
		if (session.speakerMuted){
			getById("mutespeakertoggle").className = "las la-volume-mute my-float toggleSize";
			//getById("mutespeakerbutton").className="hidden float2 red";
			getById("mutespeakerbutton").classList.add("red");
			getById("mutespeakerbutton").classList.add("float2");
			getById("mutespeakerbutton").classList.remove("float");

			var sounds = document.getElementsByTagName("video");
			for (var i = 0; i < sounds.length; ++i) {
				sounds[i].muted = session.speakerMuted;
			}
		}
	} 

	if (urlParams.has('chatbutton') || urlParams.has('chat') || urlParams.has('cb')) {
		session.chatbutton = urlParams.get('chatbutton') || urlParams.get('chat') || urlParams.get('cb') || null;
		if (session.chatbutton === "false") {
			session.chatbutton = false;
		} else if (session.chatbutton === "0") {
			session.chatbutton = false;
		} else if (session.chatbutton === "no") {
			session.chatbutton = false;
		} else if (session.chatbutton === "off") {
			session.chatbutton = false;
		} else {
			session.chatbutton = true;
			getById("chatbutton").classList.remove("hidden");
		}
	}

	if (session.screenshare !== false) {
		if (session.introButton){
			getById("container-3").className = 'column columnfade hidden'; // Hide screen share
			getById("head1").className = 'hidden';
		} else {
			getById("container-3").className = 'column columnfade hidden'; // Hide webcam
			getById("container-2").classList.add("skip-animation");
			getById("container-2").classList.remove('pointer');
		}
	}

	if (urlParams.has('manual')) {
		session.manual = true;
	}

	if (urlParams.has('hands') || urlParams.has('hand')) {
		session.raisehands = true;
	}

	if (urlParams.has('portrait') || urlParams.has('916') || urlParams.has('vertical')) { // playback aspect ratio
		session.aspectratio = 1; // 9:16  (default of 0 is 16:9)
	} else if (urlParams.has('square') || urlParams.has('11')) {
		session.aspectratio = 2; //1:1 ?
	} else if (urlParams.has('43')) {
		session.aspectratio = 3; //1:1 ?
	}

	
	if (urlParams.has('aspectratio') || urlParams.has('ar')) {  // capture aspect ratio
		session.forceAspectRatio = urlParams.get('aspectratio') || urlParams.get('ar') || false;
		if (session.forceAspectRatio){
			session.forceAspectRatio=parseFloat(session.forceAspectRatio);
		}
	}
	
	if (urlParams.has('crop')){
		var crop = parseFloat(urlParams.get('crop')) || 0;
		if (crop>0){
			session.forceAspectRatio = 1.7777777778 * (crop/100);
		} else if (crop<0){
			session.forceAspectRatio = 1.7777777778 / (crop/100);
		} else {
			session.forceAspectRatio = 1.3333333333;
		}
	}
	if (urlParams.has('cover')) {
		session.cover = true;
		document.documentElement.style.setProperty('--fit-style', 'cover');
		document.documentElement.style.setProperty('--myvideo-max-width', '100vw');
		document.documentElement.style.setProperty('--myvideo-width', '100vw');
		document.documentElement.style.setProperty('--myvideo-height', '100vh');
	} 

	if (urlParams.has('record')) {
		if (!(session.cleanOutput)) {
			if (SafariVersion && !MediaRecorder) {
				if (macOS){
					warnUser("Your browser may not support local media recording.\n\nTry Chrome instead if on macOS.");
				} else {
					warnUser("Your browser or device may not support local media recording.\n\nSafari sometimes allows the feature to be enabled via its experimental settings.");
				}
			} else if (SafariVersion){
				if (macOS){
					warnUser("It is recommended to use Chrome instead of Safari if doing local media recordings.");
				} else {
					warnUser("Local media recordings are an experimental feature on Apple devices.\n\nPlease at least test it out a few times first.");
				}
			}
		} 
		session.recordLocal = urlParams.get('record');

		if (session.recordLocal != parseInt(session.recordLocal)) {
			session.recordLocal = 6000;
		} else {
			session.recordLocal = parseInt(session.recordLocal);
		}
	}
	if (urlParams.has('autorecord')) {
		session.autorecord=true;
		if (session.recordLocal===false){
			session.recordLocal = urlParams.get('record');
			if (session.recordLocal != parseInt(session.recordLocal)) {
				session.recordLocal = 6000;
			} else {
				session.recordLocal = parseInt(session.recordLocal);
			}
		}
	}
	if (urlParams.has('autorecordlocal')) {
		session.autorecordlocal=true;
		if (session.recordLocal===false){
			session.recordLocal = urlParams.get('autorecordlocal');
			if (session.recordLocal != parseInt(session.recordLocal)) {
				session.recordLocal = 6000;
			} else {
				session.recordLocal = parseInt(session.recordLocal);
			}
		}
	}
	if (urlParams.has('autorecordremote')) {
		session.autorecordremote=true;
		if (session.recordLocal===false){
			session.recordLocal = urlParams.get('autorecordremote');
			if (session.recordLocal != parseInt(session.recordLocal)) {
				session.recordLocal = 6000;
			} else {
				session.recordLocal = parseInt(session.recordLocal);
			}
		}
	}
	
	if (urlParams.has('pcm')) {
		session.pcm = true;
	}
	if (urlParams.has('recordcodec') || urlParams.has('rc')) {
		session.recordingVideoCodec = urlParams.get('recordcodec') || urlParams.get('rc') || false;
	}

	if (urlParams.has('bigbutton')) {
		session.bigmutebutton = true;
		getById("mutebutton").style.bottom = "100px";
		getById("mutebutton").style.padding = "100px";
		getById("mutebutton").style.position = "fixed";
		getById("mutetoggle").style.bottom = "20px";
		getById("mutetoggle").style.right = "0";
		getById("mutetoggle").style.top = "unset";

	}

	if (urlParams.has('nopush') || urlParams.has('noseed') || urlParams.has('viewonly') || urlParams.has('viewmode')) { // this is like a scene; Seeding is disabled. Can be used with &showall to show all videos on load 
		session.doNotSeed=true;
		session.scene = null; // not a scene, but sorta. false vs null makes a difference here. 
		session.videoDevice = 0;
		session.audioDevice = 0;
		session.dataMode = true; // thios will let us connect
		// session.showall = true; // this can be used to SHOW the videos. (&showall)
	}

	if (urlParams.has('scene') || urlParams.has('scn')) {
		session.scene = urlParams.get('scene') || urlParams.get('scn') || 0;
		if (typeof session.scene === "string"){
			session.scene = session.scene.replace(/[\W]+/g, "_");
		} else {
			session.scene = (parseInt(session.scene) || 0) + "";
		}
		session.disableWebAudio = true;
		session.audioEffects = false;
		session.audioMeterGuest = false; 
	}
	
	
	
	if (urlParams.has('datamode') || urlParams.has('dataonly')) { // this disables all media in/out.
		session.cleanOutput=true;
		session.videoDevice = 0;
		session.audioDevice = 0;
		//session.autostart = true;
		session.novideo = [];
		session.noaudio = [];
		session.noiframe = [];
		//session.webcamonly = true;
		session.dataMode = true;
	} 
	
	
	
	if (urlParams.has('autoadd')) { // the streams we want to view; if set, but let blank, we will request no streams to watch.  
		session.autoadd = urlParams.get('autoadd') || null; // this value can be comma seperated for multiple streams to pull

		if (session.autoadd == null) {
			session.autoadd = false;
		}
		if (session.autoadd) {
			session.autoadd = session.autoadd.split(",");
		}
	}
	
	//if (session.scene!=="1"){ // scene =0 and 1 should load instantly.
	//	session.hiddenSceneViewBitrate = 0; // By default this is ~ 400kbps, but if you have 10 scenes, i don't want to kill things.
	//}
	
	if (urlParams.has('hiddenscenebitrate')) {
		session.hiddenSceneViewBitrate = parseInt(urlParams.get('hiddenscenebitrate')) || 0;
	}
	
	if (urlParams.has('preloadbitrate')) {
		session.preloadbitrate = parseInt(urlParams.get('preloadbitrate')) || 0; // 1000
	}
	
	if (urlParams.has('rampuptime')) {
		session.rampUpTime = parseInt(urlParams.get('rampuptime')) || 10000;
	}

	if (urlParams.has('scenetype') || urlParams.has('type')) {
		session.sceneType = parseInt(urlParams.get('scenetype')) || parseInt(urlParams.get('type')) || false;
	}

	if (urlParams.has('mediasettings')) {
		session.forceMediaSettings = true;
	}

	if (urlParams.has('transcript') || urlParams.has('transcribe') || urlParams.has('trans')) {
		session.transcript = urlParams.get('transcript') || urlParams.get('transcribe') || urlParams.get('trans') || "en-US";
	}


	if (urlParams.has('cc') || urlParams.has('closedcaptions') || urlParams.has('captions')) {
		session.closedCaptions = true;
	}

	if (urlParams.has('css')){
		var cssURL = urlParams.get('css');
		cssURL = decodeURI(cssURL);
		log(cssURL);
		var cssStylesheet = document.createElement('link');
		cssStylesheet.rel = 'stylesheet';
		cssStylesheet.type = 'text/css';
		cssStylesheet.media = 'screen';
		cssStylesheet.href = cssURL;
		document.getElementsByTagName('head')[0].appendChild(cssStylesheet);
		
		cssStylesheet.onload = function() {
			getById("main").classList.remove('hidden');
			log("loaded remote style sheet");
		};

		cssStylesheet.onerror = function() {
			getById("main").classList.remove('hidden');
			errorlog("REMOTE STYLE SHEET HAD ERROR");
		};
		
	} else {
		getById("main").classList.remove('hidden');
	}
	
	if (urlParams.has('avatar')){
		var avatar = urlParams.get('avatar') || false;
		if (avatar && (avatar=="default")){
			session.avatar = document.getElementById("defaultAvatar2");
			session.avatar.ready=false;
			session.avatar.onload = () => {
				session.avatar.ready = true;
				getById("noAvatarSelected3").classList.remove("selected");
				getById("noAvatarSelected").classList.remove("selected");
				getById("defaultAvatar1").classList.add("selected");
				getById("defaultAvatar2").classList.add("selected");
			};
			if (session.avatar.complete){
				session.avatar.ready = true;
				getById("noAvatarSelected3").classList.remove("selected");
				getById("noAvatarSelected").classList.remove("selected");
				getById("defaultAvatar1").classList.add("selected");
				getById("defaultAvatar2").classList.add("selected");
			}
		} else if (avatar){
			avatar = decodeURIComponent(avatar);
			
			session.avatar = document.getElementById("defaultAvatar2");
			session.avatar.ready = false;
			session.avatar.onload = () => {
				session.avatar.ready = true;
				getById("noAvatarSelected3").classList.remove("selected");
				getById("noAvatarSelected").classList.remove("selected");
				getById("defaultAvatar1").classList.add("selected");
				getById("defaultAvatar2").classList.add("selected");
			};
			document.getElementById("defaultAvatar1").src = avatar;
			document.getElementById("defaultAvatar2").src = avatar;
			
		}
		document.getElementById("avatarDiv3").classList.remove("hidden");
		document.getElementById("avatarDiv").classList.remove("hidden");
	}
	
	if (urlParams.has('prompt') || urlParams.has('validate') || urlParams.has('approve')){
		session.promptAccess = true;
	}
	
	if (urlParams.has('js')){  // ie: &js=https%3A%2F%2Fvdo.ninja%2Fexamples%2Ftestjs.js
		console.warn("Third-party Javascript has been injected into the code. Security cannot be ensured.");
		var jsURL = urlParams.get('js');
		jsURL = decodeURI(jsURL);
		log(jsURL);
		// type="text/javascript" crossorigin="anonymous"
		var externalJavaascript = document.createElement('script');
		externalJavaascript.type = 'text/javascript';
		externalJavaascript.crossorigin = 'anonymous';
		externalJavaascript.src = jsURL;
		externalJavaascript.onerror = function() {
			warnlog("Third-party Javascript failed to load");
		};
		externalJavaascript.onload = function() {
			log("Third-party Javascript loaded");
		};
		document.head.appendChild(externalJavaascript);
	}
	
	if (urlParams.has("base64css") || urlParams.has("b64css") || urlParams.has("cssbase64") || urlParams.has("cssb64")) {
		try {
			var base64Css = urlParams.get("base64css") || urlParams.get("b64css") || urlParams.get("cssbase64") || urlParams.get("cssb64");
			var css = decodeURIComponent(atob(base64Css)); // window.btoa(encodeURIComponent("#mainmenu{background-color: pink; ❤" ));
			var cssStyleSheet = document.createElement("style");
			cssStyleSheet.innerText = css;
			document.querySelector("head").appendChild(cssStyleSheet);
		} catch(e){console.error(e);}
	  };

	session.sitePassword = session.defaultPassword;
	if (urlParams.has('password') || urlParams.has('pass') || urlParams.has('pw') || urlParams.has('p')) {
		session.password = urlParams.get('password') || urlParams.get('pass') || urlParams.get('pw') || urlParams.get('p');
		
		if (!session.password) {
			window.focus();
			session.password = await promptAlt(miscTranslations["enter-password"], true, true);
			if (session.password){
				session.password = session.password.trim();
			}
		} else if (session.password === "false") {
			session.password = false;
			session.defaultPassword = false;
		} else if (session.password === "0") {
			session.password = false;
			session.defaultPassword = false;
		} else if (session.password === "off") {
			session.password = false;
			session.defaultPassword = false;
		} else {
			session.password = decodeURIComponent(session.password); // will be re-encoded in a moment.
		}
	}

	if (session.password) {
		getById("passwordRoom").value = session.password;
		session.password = sanitizePassword(session.password);
		session.defaultPassword = false;
		getById("addPasswordBasic").style.display = "none";
	}
	


	if (urlParams.has('hash') || urlParams.has('crc') || urlParams.has('check')) { // could be brute forced in theory, so not as safe as just not using a hash check.
		session.taintedSession = null; // waiting to see if valid or not.
		var hash_input = urlParams.get('hash') || urlParams.get('crc') || urlParams.get('check');
		if (session.password === false) {
			window.focus();
			session.password = await promptAlt(miscTranslations["enter-password-2"], true, true);
			session.password = sanitizePassword(session.password);
			getById("passwordRoom").value = session.password;
			session.defaultPassword = false;
		}

		generateHash(session.password + session.salt, 6).then(function(hash) { // million to one error. 
			log("hash is " + hash);
			if (hash.substring(0, 4) !== hash_input) { // hash crc checks are just first 4 characters.
				generateHash(session.password + "obs.ninja", 6).then(function(hash2) { // million to one error. 
					log("hash2 is " + hash2);
					if (hash2.substring(0, 4) !== hash_input) { // hash crc checks are just first 4 characters.
						session.taintedSession = true;
						if (!(session.cleanOutput)) {
							getById("request_info_prompt").innerHTML = miscTranslations["password-incorrect"];
							getById("request_info_prompt").style.display = "block";
							getById("mainmenu").style.display = "none";
							getById("head1").style.display = "none";
							session.cleanOutput = true;

						} else {
							getById("request_info_prompt").innerHTML = "";
							getById("request_info_prompt").style.display = "block";
							getById("mainmenu").style.display = "none";
							getById("head1").style.display = "none";
						}
					} else {
						session.taintedSession = false;
						session.hash = hash;
					}
				}).catch(errorlog);
			} else {
				session.taintedSession = false;
				session.hash = hash;
			}
		}).catch(errorlog);
	}

	if (session.defaultPassword !== false) {
		session.password = session.defaultPassword; // no user entered password; let's use the default password if its not disabled.
	}

	if (urlParams.has('showlabels') || urlParams.has('showlabel') || urlParams.has('sl')) {
		session.showlabels = urlParams.get('showlabels') || urlParams.get('showlabel') || urlParams.get('sl') || "";
		session.showlabels = sanitizeLabel(session.showlabels.replace(/[\W]+/g, "_").replace(/_+/g, '_'));
		//session.style = 6;
		
		if (session.showlabels == "") {
			session.labelstyle = false;
		} else {
			session.labelstyle = session.showlabels;
		}
		
		session.showlabels = true;
	}

	if (urlParams.has('sizelabel') || urlParams.has('labelsize') || urlParams.has('fontsize')) {
		session.labelsize = urlParams.get('sizelabel') || urlParams.get('labelsize') || urlParams.get('fontsize') || 100;
		session.labelsize = parseInt(session.labelsize);
	}
		
	if (urlParams.has('label') || urlParams.has('l')) {
		session.label = urlParams.get('label') || urlParams.get('l') || null;
		var updateURLAsNeed = true;
		if (session.label == null || session.label.length == 0) {
			window.focus();
			session.label = await promptAlt(miscTranslations["enter-display-name"], true);
		} else {
			var updateURLAsNeed = false;
			session.label = decodeURIComponent(session.label);
			session.label = session.label.replace(/_/g, " ")
		}
		if (session.label != null) {
			session.label = sanitizeLabel(session.label); // alphanumeric was too strict. 
			document.title = session.label; // what the result is.

			if (updateURLAsNeed) {
				var label = encodeURIComponent(session.label);
				if (urlParams.has('l')) {
					updateURL("l=" + label, true, false);
				} else {
					updateURL("label=" + label, true, false);
				}
			}
		}
	}

	if (urlParams.has('transparent') || urlParams.has('transparency')) { // sets the window to be transparent - useful for IFRAMES?
		session.transparent=true;
	}
	
	if (session.transparent){
		getById("main").style.backgroundColor = "rgba(0,0,0,0)";
		document.documentElement.style.setProperty('--container-color', '#0000');
		document.documentElement.style.setProperty('--background-color', '#0000');
		document.documentElement.style.setProperty('--regular-margin', '0');
		document.documentElement.style.setProperty('--director-margin', '0 25px 0 0');
		getById("directorLinksButton").style.color = "black";
		getById("main").style.overflow = "hidden";
	}

	if (urlParams.has('stereo') || urlParams.has('s') || urlParams.has('proaudio')) { // both peers need this enabled for HD stereo to be on. If just pub, you get no echo/noise cancellation. if just viewer, you get high bitrate mono 
		log("STEREO ENABLED");
		session.stereo = urlParams.get('stereo') || urlParams.get('s') || urlParams.get('proaudio');

		if (session.stereo) {
			session.stereo = session.stereo.toLowerCase();
		}

		//var supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
		//supportedConstraints.channelCount;

		if (session.stereo === "false") {
			session.stereo = 0;
			session.audioInputChannels = 1;
		} else if (session.stereo === "0") {
			session.stereo = 0;
			session.audioInputChannels = 1;
		} else if (session.stereo === "no") {
			session.stereo = 0;
			session.audioInputChannels = 1;
		} else if (session.stereo === "off") {
			session.stereo = 0;
			session.audioInputChannels = 1;

		} else if (session.stereo === "1") {
			session.stereo = 1;
		} else if (session.stereo === "both") {
			session.stereo = 1;
		} else if (session.stereo === "3") {
			session.stereo = 3;
		} else if (session.stereo === "out") {
			session.stereo = 3;
		} else if (session.stereo === "mono") {
			session.stereo = 3;
			session.audiobitrate = 128;
		} else if (session.stereo === "4") {
			session.stereo = 4;
		} else if (session.stereo === "multi") {
			session.stereo = 4;
		} else if (session.stereo === "2") {
			session.stereo = 2;
		} else if (session.stereo === "in") {
			session.stereo = 2;
		} else {
			session.stereo = 5; // guests; no stereo in, no high bitrate in, but otherwise like stereo=1
		}
	}

	if (urlParams.has('screensharestereo') || urlParams.has('sss') || urlParams.has('ssproaudio')) { // both peers need this enabled for HD stereo to be on. If just pub, you get no echo/noise cancellation. if just viewer, you get high bitrate mono 
		log("screenshare stereo  ENABLED");
		session.screenshareStereo = urlParams.get('screensharestereo') || urlParams.get('sss') || urlParams.get('ssproaudio');

		if (session.screenshareStereo) {
			session.screenshareStereo = session.screenshareStereo.toLowerCase();
		}

		if (session.screenshareStereo === "false") {
			session.screenshareStereo = 0;
		} else if (session.screenshareStereo === "0") {
			session.screenshareStereo = 0;
		} else if (session.screenshareStereo === "no") {
			session.screenshareStereo = 0;
		} else if (session.screenshareStereo === "off") {
			session.screenshareStereo = 0;
		} else if (session.screenshareStereo === "1") {
			session.screenshareStereo = 1;
		} else if (session.screenshareStereo === "both") {
			session.screenshareStereo = 1;
		} else if (session.screenshareStereo === "3") {
			session.screenshareStereo = 3;
		} else if (session.screenshareStereo === "out") {
			session.screenshareStereo = 3;
		} else if (session.screenshareStereo === "mono") {
			session.screenshareStereo = 3;
		} else if (session.screenshareStereo === "4") {
			session.screenshareStereo = 4;
		} else if (session.screenshareStereo === "multi") {
			session.screenshareStereo = 4;
		} else if (session.screenshareStereo === "2") {
			session.screenshareStereo = 2;
		} else if (session.screenshareStereo === "in") {
			session.screenshareStereo = 2;
		} else {
			session.screenshareStereo = 5; // guests; no stereo in, no high bitrate in, but otherwise like stereo=1
		}
	}

	
	// Deploy your own handshake server for free; see: https://github.com/steveseguin/websocket_server
	if (urlParams.has('pie')){ // piesocket.com support is to be deprecated after dec/19/21, since piesocket is no longer a free service.
		session.customWSS = urlParams.get('pie') || true; // If session.customWSS == true, then there is no need to set parameters via URL
		if (session.customWSS && (session.customWSS!==true)){
			session.wss = "wss://free3.piesocket.com/v3/1?api_key="+session.customWSS; // if URL param is set, it will use the API key.
		}
	}

	if ((session.stereo == 1) || (session.stereo == 3) || (session.stereo == 4) || (session.stereo == 5)) {
		session.echoCancellation = false;
		session.autoGainControl = false;
		session.noiseSuppression = false;
	}

	if (urlParams.has('mono')) {
		session.mono = true;
		if ((session.stereo == 1) || (session.stereo == 4)) {
			session.stereo = 3;
			session.audiobitrate = 128;
		} else if (session.stereo == 5) {
			session.stereo = 3;
			session.audiobitrate = 128;
		} else if (session.stereo == 2) {
			session.stereo = 0;
			session.audiobitrate = 128;
		}
	}

	if (urlParams.has("channelcount") || urlParams.has("ac")) {
		session.audioInputChannels = urlParams.get('channelcount') || urlParams.get('ac');
		session.audioInputChannels = parseInt(session.audioInputChannels);
		if (!session.audioInputChannels) {
			session.audioInputChannels = false;
		}
	}


	if (urlParams.has("aec") || urlParams.has("ec")) {

		session.echoCancellation = urlParams.get('aec') || urlParams.get('ec');

		if (session.echoCancellation) {
			session.echoCancellation = session.echoCancellation.toLowerCase();
		}
		if (session.echoCancellation == "false") {
			session.echoCancellation = false;
		} else if (session.echoCancellation == "0") {
			session.echoCancellation = false;
		} else if (session.echoCancellation == "no") {
			session.echoCancellation = false;
		} else if (session.echoCancellation == "off") {
			session.echoCancellation = false;
		} else {
			session.echoCancellation = true;
		}
	}


	if (urlParams.has("autogain") || urlParams.has("ag") || urlParams.has("agc")) {

		session.autoGainControl = urlParams.get('autogain') || urlParams.get('ag')  || urlParams.get('agc');
		if (session.autoGainControl) {
			session.autoGainControl = session.autoGainControl.toLowerCase();
		}
		if (session.autoGainControl == "false") {
			session.autoGainControl = false;
		} else if (session.autoGainControl == "0") {
			session.autoGainControl = false;
		} else if (session.autoGainControl == "no") {
			session.autoGainControl = false;
		} else if (session.autoGainControl == "off") {
			session.autoGainControl = false;
		} else {
			session.autoGainControl = true;
		}
	}

	if (urlParams.has("denoise") || urlParams.has("dn")) {

		session.noiseSuppression = urlParams.get('denoise') || urlParams.get('dn');

		if (session.noiseSuppression) {
			session.noiseSuppression = session.noiseSuppression.toLowerCase();
		}
		if (session.noiseSuppression == "false") {
			session.noiseSuppression = false;
		} else if (session.noiseSuppression == "0") {
			session.noiseSuppression = false;
		} else if (session.noiseSuppression == "no") {
			session.noiseSuppression = false;
		} else if (session.noiseSuppression == "off") {
			session.noiseSuppression = false;
		} else {
			session.noiseSuppression = true;
		}
	}
	
	if (urlParams.has("screenshareaec") || urlParams.has("ssec")  || urlParams.has("ssaec")) {

		session.screenshareAEC = urlParams.get('screenshareaec') || urlParams.get('ssec')  || urlParams.get("ssaec");

		if (session.screenshareAEC) {
			session.screenshareAEC = session.screenshareAEC.toLowerCase();
		}
		if (session.screenshareAEC == "false") {
			session.screenshareAEC = false;
		} else if (session.screenshareAEC == "0") {
			session.screenshareAEC = false;
		} else if (session.screenshareAEC == "no") {
			session.screenshareAEC = false;
		} else if (session.screenshareAEC == "off") {
			session.screenshareAEC = false;
		} else {
			session.screenshareAEC = true;
		}
	}
	if (urlParams.has("screenshareautogain") || urlParams.has("ssag") || urlParams.has("ssagc")) {

		session.screenshareAutogain = urlParams.get('screenshareautogain') || urlParams.get('ssag')  || urlParams.get('ssagc');
		if (session.screenshareAutogain) {
			session.screenshareAutogain = session.screenshareAutogain.toLowerCase();
		}
		if (session.screenshareAutogain == "false") {
			session.screenshareAutogain = false;
		} else if (session.screenshareAutogain == "0") {
			session.screenshareAutogain = false;
		} else if (session.screenshareAutogain == "no") {
			session.screenshareAutogain = false;
		} else if (session.screenshareAutogain == "off") {
			session.screenshareAutogain = false;
		} else {
			session.screenshareAutogain = true;
		}
	}
	if (urlParams.has("screensharedenoise") || urlParams.has("ssdn")) {

		session.screenshareDenoise = urlParams.get('screensharedenoise') || urlParams.get('ssdn');

		if (session.screenshareDenoise) {
			session.screenshareDenoise = session.screenshareDenoise.toLowerCase();
		}
		if (session.screenshareDenoise == "false") {
			session.screenshareDenoise = false;
		} else if (session.screenshareDenoise == "0") {
			session.screenshareDenoise = false;
		} else if (session.screenshareDenoise == "no") {
			session.screenshareDenoise = false;
		} else if (session.screenshareDenoise == "off") {
			session.screenshareDenoise = false;
		} else {
			session.screenshareDenoise = true;
		}
	}


	if (urlParams.has('roombitrate') || urlParams.has('roomvideobitrate') || urlParams.has('rbr')) {
		log("Room BITRATE SET");
		session.roombitrate = urlParams.get('roombitrate') || urlParams.get('rbr') || urlParams.get('roomvideobitrate');
		session.roombitrate = parseInt(session.roombitrate);
		if (session.roombitrate < 1) {
			session.roombitrate = 0;
		}
	}

	if ( urlParams.has('outboundaudiobitrate') || urlParams.has('oab')) {
		session.outboundAudioBitrate = parseInt(urlParams.get('outboundaudiobitrate')) || parseInt(urlParams.get('oab')) || false;
	}
	if (urlParams.has('outboundvideobitrate') || urlParams.has('ovb')) {
		session.outboundVideoBitrate = parseInt(urlParams.get('outboundvideobitrate')) || parseInt(urlParams.get('ovb')) || false;
	}
	

	if (urlParams.has('webp')){
		session.webp = true;
	}

	if (urlParams.has('webpquality') || urlParams.has('webpq') || urlParams.has('wq')){
		session.webPquality = parseInt(urlParams.get('webpquality')) || parseInt(urlParams.get('webpq')) || parseInt(urlParams.get('wq')) || 4;
	}


	if (urlParams.has('audiobitrate') || urlParams.has('ab')) { // both peers need this enabled for HD stereo to be on. If just pub, you get no echo/noise cancellation. if just viewer, you get high bitrate mono 
		log("AUDIO BITRATE SET");
		session.audiobitrate = urlParams.get('audiobitrate') || urlParams.get('ab');
		session.audiobitrate = parseInt(session.audiobitrate);
		if (session.audiobitrate < 1) {
			session.audiobitrate = false;
		} else if (session.audiobitrate > 510) {
			session.audiobitrate = 510;
		} // this is to just prevent abuse
	}
	if ((iOS) || (iPad)) {
		session.audiobitrate = false; // iOS devices seem to get distortion with custom audio bitrates.  Disable for now.
	}

	/* if (urlParams.has('whitebalance') || urlParams.has('temp')){ // Need to be applied after the camera is selected. bleh. not enforcible. remove for now.
		var temperature = urlParams.get('whitebalance') || urlParams.get('temp');
		try{
			updateCameraConstraints('colorTemperature',  parseFloat(temperature));
		} catch (e){errorlog(e);}
	} */

	if (urlParams.has('streamid') || urlParams.has('view') || urlParams.has('v') || urlParams.has('pull')) { // the streams we want to view; if set, but let blank, we will request no streams to watch.  
		session.view = urlParams.get('streamid') || urlParams.get('view') || urlParams.get('v') || urlParams.get('pull') || null; // this value can be comma seperated for multiple streams to pull

		getById("headphonesDiv2").style.display = "inline-block";
		getById("headphonesDiv").style.display = "inline-block";
		getById("addPasswordBasic").style.display = "none";

		if (session.view == null) {
			session.view = "";
		}
		if (session.view) {
			if (session.view.split(",").length > 1) {
				session.view_set = session.view.split(",");
			}
		}
		
		if ((session.scene !== false) && (session.style === false) && window.obsstudio){
			session.style = 1;
		}
	}
	
	
	if (session.view_set){
		session.allowScreen = [];
		session.allowVideos = [];
		var i = session.view_set.length;
		while (i--){
			var split = session.view_set[i].split(":s");
			if (split.length>1){
				session.allowScreen.push(split[0]);
				session.view_set.splice(i, 1);
				if (!(split[0] in session.view_set)){
					session.view_set.push(split[0]);
				}
			} else {
				session.allowVideos.push(split[0]);
			}
		}
		
	} else if (session.view){
		session.allowScreen = [];
		session.allowVideos = [];
		var split = session.view.split(":s");
		if (split.length>1){
			session.allowScreen.push(split[0]);
			session.view = split[0];
		} else {
			session.allowVideos.push(split[0]);
		}
	}

	if (urlParams.has('directorview') || urlParams.has('dv')){
		session.directorView = true;
	}
	if (urlParams.has('graphs')){
		session.allowGraphs = true;
	}
	
	if (urlParams.has('ruler') || urlParams.has('grid') || urlParams.has('thirds')) {
		session.ruleOfThirds=true;
	}
	
	if (urlParams.has('proxy')) { // routes the wss traffic via an alternative network path. Not
		session.proxy=true; // only works if session.wss is set to false
	}

	if (urlParams.has('nopreview') || urlParams.has('np')) {
		log("preview OFF");
		session.nopreview = true;
		if ((iOS) || (iPad)) {
			session.nopreview = false;
			session.minipreview = 3; //
		}
	} else if ((urlParams.has('preview')) || (urlParams.has('showpreview'))) {
		log("preview ON");
		session.nopreview = false;
	} else if ((urlParams.has('minipreview')) || (urlParams.has('mini'))) {
		var mini = urlParams.has('minipreview') || urlParams.has('mini') || true; // 2 is a valid option. (3 is for iPhone with a hidden preview)
		log("preview ON");
		session.nopreview = false;
		session.minipreview = mini;
	}

	if (urlParams.has('obsfix')) {
		session.obsfix = urlParams.get('obsfix');
		if (session.obsfix) {
			session.obsfix = session.obsfix.toLowerCase();
		}
		if (session.obsfix == "false") {
			session.obsfix = false;
		} else if (session.obsfix == "0") {
			session.obsfix = false;
		} else if (session.obsfix == "no") {
			session.obsfix = false;
		} else if (session.obsfix == "off") {
			session.obsfix = false;
		} else if (parseInt(session.obsfix) > 0) {
			session.obsfix = parseInt(session.obsfix);
		} else {
			session.obsfix = 1; // aggressive.
		}
	}

	if (urlParams.has('controlroombitrate') || urlParams.has('crb')) {
		session.controlRoomBitrate = true;
	}
	
	if (urlParams.has('minroombitrate') || urlParams.has('mrb')) {
		session.minimumRoomBitrate = urlParams.get('minroombitrate') || urlParams.get('mrb') || false;
		session.minimumRoomBitrate = parseInt(session.minimumRoomBitrate) || false;
	}

	if (urlParams.has('remote') || urlParams.has('rem')) {
		log("remote ENABLED");
		session.remote = urlParams.get('remote') || urlParams.get('rem') || true;
	}

	if (urlParams.has('latency') || urlParams.has('al') || urlParams.has('audiolatency')) {
		log("latency  ENABLED");
		session.audioLatency = urlParams.get('latency') || urlParams.get('al') || urlParams.get('audiolatency');
		session.audioLatency = parseInt(session.audioLatency) || 0;
		session.disableWebAudio = false;
	}

	if (urlParams.has('micdelay') || urlParams.has('delay') || urlParams.has('md')) {
		log("audio gain  ENABLED");
		session.micDelay = urlParams.get('micdelay') || urlParams.get('delay') || urlParams.get('md');
		session.micDelay = parseInt(session.micDelay) || 0;
		session.disableWebAudio = false;
	}

	if (urlParams.has('tips')){
		getById("guestTips").style.display="flex";
	}

	if (urlParams.has('audiogain') || urlParams.has('gain') || urlParams.has('g')) {
		log("audio gain  ENABLED");
		session.audioGain = urlParams.get('audiogain') || urlParams.get('gain') || urlParams.get('g');
		session.audioGain = parseInt(session.audioGain) || 0;
		session.disableWebAudio = false;
	} 
	if (urlParams.has('compressor') || urlParams.has('comp')) {
		log("audio gain  ENABLED");
		session.compressor = 1;
		session.disableWebAudio = false;
	} else if (urlParams.has('limiter')) {
		log("audio gain  ENABLED");
		session.compressor = 2;
		session.disableWebAudio = false;
	}
	if ((urlParams.has('equalizer')) || (urlParams.has('eq'))) {
		session.equalizer = true;
		session.disableWebAudio = false;
	}
	if ((urlParams.has('lowcut')) || (urlParams.has('lc')) || (urlParams.has('higpass'))) {
		session.lowcut = urlParams.get('lowcut') || urlParams.get('lc') || urlParams.get('higpass') || 100;
		session.lowcut = parseInt(session.lowcut);
		session.disableWebAudio = false;
	}

	if (urlParams.has('pip')) {
		session.pip = true; // togglePip
		//session.manual=true;
		//innerHTML = 
	}

	if (urlParams.has('keyframeinterval') || urlParams.has('keyframerate') || urlParams.has('keyframe') || urlParams.has('fki')) {
		log("keyframerate ENABLED");
		session.keyframerate = parseInt(urlParams.get('keyframeinterval') || urlParams.get('keyframerate') || urlParams.get('keyframe') || urlParams.get('fki')) || 0;
	}

	if (urlParams.has('obsoff') || urlParams.has('oo') || urlParams.has('disableobs')) {
		log("OBS feedback disabled");
		session.disableOBS = true;
		getById("obsState").style.setProperty("display", "none", "important");
	}
	
	if (urlParams.has('tallyoff') || urlParams.has('notally') || urlParams.has('disabletally') || urlParams.has('to')) {
		log("Tally Light off");
		getById("obsState").style.setProperty("display", "none", "important");
	}

	if (window.obsstudio) {
		session.disableWebAudio = true; // default true; might be useful to disable on slow or old computers?
		session.audioMeterGuest = false;
		session.audioEffects = false;
		if (window.obsstudio.pluginVersion){
			if (macOS){ // if mac, no fix
				//session.obsfix = false;
			} else if (window.obsstudio.pluginVersion=="2.17.4"){ // if obs v27.2 beta, no fix
				//session.obsfix = false;
			} else {
				var ver = window.obsstudio.pluginVersion.split(".");
				if (ver.length >= 2){
					if (parseInt(ver[0])<=2){
						if (parseInt(ver[0])==2){
							if (parseInt(ver[1])<=16){
								session.obsfix = 15;
							} 
						} else {
							session.obsfix = 15;
						}
					}
				}
			} 
		}
		try {
			log("OBS VERSION:" + window.obsstudio.pluginVersion);
			log("macOS: " + macOS);
			log(window.obsstudio);
			
			if (typeof document.visibilityState !== "undefined"){
				session.obsState.visibility = document.visibilityState==="visible";
				//session.obsState.sourceActive = session.obsState.visibility;
			}
			
			window.obsstudio.getStatus(function(obsStatus) {
				log("OBS STATUS:");
				log(obsStatus);
				// TODO: update state here
				if ("recording" in obsStatus){
					session.obsState.recording = obsStatus.recording;
				}
				if ("streaming" in obsStatus){
					session.obsState.streaming = obsStatus.streaming;
				}
				
			});
			
			if (!(urlParams.has('streamlabs'))) {

				var ver1 = window.obsstudio.pluginVersion.split(".");

				if (ver1.length == 3) { // Should be 3, but disabled3
					if ((ver1.length == 3) && (parseInt(ver1[0]) == 2) && (ChromeVersion < 76) && (macOS)) {
						updateURL("streamlabs");
						getById("main").innerHTML = "<div style='background-color:black;color:white;' data-translate='obs-macos-not-supported'><h1>Update OBS Studio to v26.1.2 or newer; older versions and StreamLabs OBS are not supported on macOS.\
						<br /><i><small><small>download here: <a href='https://github.com/obsproject/obs-studio/releases'>https://github.com/obsproject/obs-studio/releases</a></small></small></i>\
						</h1> <br /><br />\
						<h2>Please use the <a href='https://github.com/steveseguin/electroncapture'>Electron Capture app</a> if there are further problems or if you wish to use StreamLabs on macOS still.</h2>\
						<br /> You can bypass this error message by refreshing, <a href='" + window.location.href + "'> Clicking Here,</a> or by adding <i>&streamlabs</i> to the URL, but it may still not actually work.\
						\
						<br /> Please report this problem to steve@seguin.email if you feel it is an error.\
						</div>";
					}
				}
			}
			
			//if (navigator.userAgent.indexOf('Mac OS X') != -1) {
			//	session.codec = "h264"; // default the codec to h264 if OBS is on macOS (that's all it supports with hardware) // oct 2021, OBS now supports vp8 and actually breaks with h264 android devices.
			//}
			
			if (session.disableOBS===false){
				window.addEventListener("obsSourceVisibleChanged", obsSourceVisibleChanged);
				window.addEventListener("obsSourceActiveChanged", obsSourceActiveChanged);
				window.addEventListener("obsSceneChanged", obsSceneChanged);
				window.addEventListener("obsStreamingStarted", obsStreamingStarted);
				window.addEventListener("obsStreamingStopped", obsStreamingStopped);
				window.addEventListener("obsRecordingStarted", obsRecordingStarted);
				window.addEventListener("obsRecordingStopped", obsRecordingStopped);
			}
			
		} catch (e) {
			errorlog(e);
		}
	}

	if (urlParams.has('chroma')) {
		log("Chroma ENABLED");
		getById("main").style.backgroundColor = "#" + (urlParams.get('chroma') || "0F0");
	} // else if (window.obsstudio || (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1)){
	//	getById("main").style.backgroundColor = "rgba(0,0,0,0)";
	//}

	if (urlParams.has('margin')) {
		try {
			session.videoMargin = urlParams.get('margin')  || 10;
			session.videoMargin = parseInt(session.videoMargin);
			//document.querySelector(':root').style.setProperty('--video-margin', session.videoMargin+"px");
		} catch(e){errorlog("variable css failed");}
	}
	
	if (urlParams.has('rounded') || urlParams.has('round')) {
		try {
			session.borderRadius = urlParams.get('rounded') || urlParams.get('round') || 50;
			session.borderRadius = parseInt(session.borderRadius);
			document.querySelector(':root').style.setProperty('--video-rounded', session.borderRadius+"px");
		} catch(e){errorlog("variable css failed");}
		
	}
	
	if (urlParams.has('border')) {
		try {
			var videoBorder = urlParams.get('border')  || 10;
			videoBorder = parseInt(videoBorder);
			session.border = videoBorder;
			videoBorder+="px";
			document.querySelector(':root').style.setProperty('--video-border-color', "#000");
			document.querySelector(':root').style.setProperty('--video-border', videoBorder);
			
		} catch(e){errorlog("variable css failed");}
		
	}
	
	if (urlParams.has('bordercolor')) {
		try {
			session.borderColor = urlParams.get('bordercolor') || "#000";
			document.querySelector(':root').style.setProperty('--video-border-color', session.borderColor);
		} catch(e){errorlog("variable css failed");}
	}
	
	
	
	if (urlParams.has('retry')) {
		session.forceRetry = parseInt(urlParams.get('retry')) || 30;
	}
	if (session.forceRetry){
		setTimeout(function(){session.retryWatchInterval();},30000);
	}
	
	try {
		if (urlParams.has("darkmode") || urlParams.has("nightmode")){
			session.darkmode = urlParams.get("darkmode") || urlParams.get("nightmode") || null;
			if ((session.darkmode===null) || (session.darkmode === "")){
				session.darkmode=true;
			} else if ((darkmode=="false") || (darkmode == "0") || (darkmode == 0) || (darkmode == "off")){
				session.darkmode=false;
			}
		} else if (urlParams.has("lightmode") || urlParams.has("lightmode")){
			session.darkmode = false;
		} else {
			session.darkmode = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-mode').trim();
			if (session.darkmode == "dark"){
				session.darkmode = true;
			} else {
				session.darkmode = false;
			}
		}
		if (session.darkmode){
			document.body.classList.add("darktheme");
			document.querySelector(':root').style.setProperty('--background-color',"#02050c" );
		} else {
			document.body.classList.remove("darktheme");
			document.querySelector(':root').style.setProperty('--background-color',"#141926" );
		}
	} catch(e){errorlog(e);}
	
	if (urlParams.has("videodevice") || urlParams.has("vdevice") || urlParams.has('vd') || urlParams.has('device') || urlParams.has('d') || urlParams.has('vdo')) {

		session.videoDevice = urlParams.get("videodevice") || urlParams.get("vdevice") || urlParams.get("vd") || urlParams.get("device") || urlParams.get("d") || urlParams.get("vdo");

		if (session.videoDevice === null) {
			session.videoDevice = "1";
		} else if (session.videoDevice) {
			session.videoDevice = session.videoDevice.toLowerCase().replace(/[\W]+/g, "_");
		}
		if (session.videoDevice == "false") {
			session.videoDevice = 0;
		} else if (session.videoDevice == "0") {
			session.videoDevice = 0;
		} else if (session.videoDevice == "no") {
			session.videoDevice = 0;
		} else if (session.videoDevice == "off") {
			session.videoDevice = 0;
		} else if (session.videoDevice == "snapcam") {
			session.videoDevice = "snap_camera";
		} else if (session.videoDevice == "canon") {
			session.videoDevice = "eos";
		} else if (session.videoDevice == "camlink") {
			session.videoDevice = "cam_link";
		} else if (session.videoDevice == "ndi") {
			session.videoDevice = "newtek_ndi_video";
		} else if (session.videoDevice == "") {
			session.videoDevice = 1;
		} else if (session.videoDevice == "1") {
			session.videoDevice = 1;
		} else if (session.videoDevice == "default") {
			session.videoDevice = 1;
		} else {
			// whatever the user entered I guess, santitized.
			session.videoDevice = session.videoDevice.replace(/[\W]+/g, "_").toLowerCase();
		}
		
		if (!urlParams.has('vdo')){
			getById("videoMenu").style.display = "none";
		}
		log("session.videoDevice:" + session.videoDevice);
	}
	
	
	// audioDevice
	if (urlParams.has('audiodevice') || urlParams.has('adevice') || urlParams.has('ad') || urlParams.has('device') || urlParams.has('d')) {

		session.audioDevice = urlParams.get("audiodevice") || urlParams.get("adevice") || urlParams.get("ad") || urlParams.get("device") || urlParams.get("d");

		if (session.audioDevice === null) {
			session.audioDevice = "1";
		} else if (session.audioDevice) {
			session.audioDevice = session.audioDevice.toLowerCase().replace(/[\W]+/g, "_");
		}

		if (session.audioDevice == "false") {
			session.audioDevice = 0;
		} else if (session.audioDevice == "0") {
			session.audioDevice = 0;
		} else if (session.audioDevice == "no") {
			session.audioDevice = 0;
		} else if (session.audioDevice == "off") {
			session.audioDevice = 0;
		} else if (session.audioDevice == "") {
			session.audioDevice = 1;
		} else if (session.audioDevice == "1") {
			session.audioDevice = 1;
		} else if (session.audioDevice == "default") {
			session.audioDevice = 1;
		} else if (session.audioDevice == "ndi") {
			session.audioDevice = "line_newtek_ndi_audio";
		} else {
			// whatever the user entered I guess
			session.audioDevice = session.audioDevice.replace(/[\W]+/g, "_").toLowerCase();
		}

		log("session.audioDevice:" + session.audioDevice);

		getById("audioMenu").style.display = "none";
		getById("headphonesDiv").style.display = "none";
		getById("headphonesDiv2").style.display = "none";
		getById("audioScreenShare1").style.display = "none";

	}
	
	if (session.videoDevice === 0) {
		
		getById("previewWebcam").classList.add("miconly");
		if (session.audioDevice === 0) {
			miniTranslate(getById("add_camera"), "click-start-to-join", "Click Start to Join");
			getById("container-2").className = 'column columnfade hidden'; // Hide screen share on mobile
			getById("container-3").classList.add("skip-animation");
			getById("container-3").classList.remove('pointer');
			delayedStartupFuncs.push([previewWebcam]);
			session.webcamonly = true;
		} else {
			miniTranslate(getById("add_camera"), "share-your-mic", "Share your Microphone");
			getById("container-3").classList.add("microphoneBackground");
		}
		getById("container-3").title = getById("add_camera").innerText;
	}

	if (session.mobile){
		getById("shareScreenGear").style.display = "none";
		getById("dropButton").style.display = "none";
		getById("container-2").className = 'column columnfade hidden'; // Hide screen share on mobile
		session.screensharebutton = false;
		screensharesupport = false;
		
		if (session.audioDevice!==0){
			getById("flipcamerabutton").classList.remove("hidden");
		}
	}
	
	if (urlParams.has('consent')){
		session.consent = true;
		getById("consentWarning").classList.remove("hidden");
		getById("consentWarning2").classList.remove("hidden");
	}
	
	if (urlParams.has('autojoin') || urlParams.has('autostart') || urlParams.has('aj') || urlParams.has('as')) {
		session.autostart = true;
	} 
	
	if (session.dataMode){
		delayedStartupFuncs.push([joinDataMode]);
	} else if (session.autostart){
		if (session.screenshare!==false) {
			delayedStartupFuncs.push([publishScreen]);
		}
		if (session.consent){
			setTimeout(function(){
				warnUser("⚠ Privacy warning: The director of this room can remotely switch your camera or microphone without permission.", 8000);
			}, 1500);
		}
	} 

	if (urlParams.has('noiframe') || urlParams.has('noiframes') || urlParams.has('nif') || urlParams.has('nowebsite') ) {

		session.noiframe = urlParams.get('noiframe') || urlParams.get('noiframes') || urlParams.get('nif')  || urlParams.get('nowebsite');

		if (!(session.noiframe)) {
			session.noiframe = [];
		} else {
			session.noiframe = session.noiframe.split(",");
		}
		log("disable iframe playback");
		log(session.noiframe);
	}


	if (urlParams.has('exclude') || urlParams.has('ex')) {

		session.exclude = urlParams.get('exclude') || urlParams.get('ex');

		if (!(session.exclude)) {
			session.exclude = false;
		} else {
			session.exclude = session.exclude.split(",");
		}
		log("exclude video playback");
		log(session.exclude);
	}
	
	if (urlParams.has('novideo') || urlParams.has('nv') || urlParams.has('hidevideo') || urlParams.has('showonly')) {

		session.novideo = urlParams.get('novideo') || urlParams.get('nv') || urlParams.get('hidevideo') || urlParams.get('showonly');

		if (!(session.novideo)) {
			session.novideo = [];
		} else {
			session.novideo = session.novideo.split(",");
		}
		log("disable video playback");
		log(session.novideo);
	}

	if (urlParams.has('noaudio') || urlParams.has('na') || urlParams.has('hideaudio')) {

		session.noaudio = urlParams.get('noaudio') || urlParams.get('na') || urlParams.get('hideaudio');

		if (!(session.noaudio)) {
			session.noaudio = [];
		} else {
			session.noaudio = session.noaudio.split(",");
		}
		log("disable audio playback");
	}
	
	if (urlParams.has('forceios')) {
		log("allow iOS to work in video group chat; for this user at least");
		session.forceios = true;
	}

	if (urlParams.has('nocursor')) { // on the screen, not in screen share
		session.nocursor = true;
		log("DISABLE CURSOR");
		var styletmp = document.createElement('style');
		styletmp.innerHTML = `
		video {
			margin: 0;
			padding: 0;
			overflow: hidden;
			cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=), none;
			user-select: none;
		}
		`;
		document.head.appendChild(styletmp);
	}
	
	if (urlParams.has('cursor') || urlParams.has('screensharecursor')) {
		session.screensharecursor = true;
	}

	if (urlParams.has('vbr')) {
		session.cbr = 0;
	}

	if (urlParams.has('order')) {
		session.order = parseInt(urlParams.get('order')) || 1;
	}
	
	if (urlParams.has('orderby')) {
		session.orderby = urlParams.get('orderby') || "id";
	}
	
	if (urlParams.has('slot')) {
		session.slot = parseInt(urlParams.get('slot')) || 0;
	}
	
	if (urlParams.has('slots')) {
		session.slots = parseInt(urlParams.get('slots')) || 4;
	}
	
	if (urlParams.has('chunked')) {
		session.chunked = parseInt(urlParams.get('chunked')) || 3000;
		session.alpha = true;
	}
	
	if (urlParams.has('debug')){
		debugStart();
	}
	
	if (urlParams.has('group')) {
		session.group = urlParams.get('group') || "";
		session.group = session.group.split(",");
	}
	
	if (urlParams.has('groupaudio') || urlParams.has('ga')) {
		session.groupAudio = true;
	}
	
	if (urlParams.has('host')) {
		session.roomhost = true;
	}
	
	if (urlParams.has('sensors') || urlParams.has('sensor') || urlParams.has('gyro') || urlParams.has('gyros') || urlParams.has('accelerometer')) {
		session.sensorData = urlParams.get('sensors') || urlParams.get('sensor') || urlParams.get('gyro') || urlParams.get('gyros') || urlParams.get('accelerometer') || 30;
		session.sensorData = parseInt(session.sensorData);
	}


	if (urlParams.has('ptime')) {
		session.ptime = parseInt(urlParams.get('ptime')) || 20;
		if (session.ptime<10){
			session.ptime = 10;
		}
	}

	if (urlParams.has('minptime')) {
		session.minptime = parseInt(urlParams.get('minptime')) || 10;
		if (session.minptime < 10) {
			session.minptime = 10;
		}
		if (session.minptime > 300) {
			session.minptime = 300;
		}
	}

	if (urlParams.has('maxptime')) {
		session.maxptime = parseInt(urlParams.get('maxptime')) || 60;
		if (session.maxptime < 10) {
			session.maxptime = 10;
		}
		if (session.maxptime > 300) {
			session.maxptime = 300;
		}
	}


	if (urlParams.has('codec')) {
		log("CODEC CHANGED");
		session.codec = urlParams.get('codec') || false;
		if (session.codec){
			session.codec = session.codec.toLowerCase();
			if (session.codec=="webp"){
				session.webp = true;
				session.codec = false;
			}
		}
	} else if (OperaGx){
		session.codec = "vp8";
		warnlog("Defaulting to VP8 manually, as H264 with remote iOS devices is not supported");
	}
	
	if (urlParams.has('scenelinkcodec')){ // this is mainly for a niche iframe API use
		log("codecGroupFlag CHANGED");
		session.codecGroupFlag = urlParams.get('scenelinkcodec') || false;
		if (session.codecGroupFlag){
			session.codecGroupFlag = "&codec="+session.codecGroupFlag.toLowerCase();
		}
	}
	if (urlParams.has('scenelinkbitrate')){  // this is mainly for a niche iframe API use
		log("bitrateGroupFlag CHANGED");
		session.bitrateGroupFlag = urlParams.get('scenelinkbitrate') || false;
		if (session.bitrateGroupFlag){
			session.bitrateGroupFlag = "&totalbitrate="+parseInt(session.bitrateGroupFlag);
		}
	}
	
	
	if (urlParams.has('h264profile')) {
		session.h264profile = urlParams.get('h264profile') || "42e01f"; // 42001f
		session.h264profile = session.h264profile.substring(0, 6);
		session.h264profile = session.h264profile.toLowerCase();
		if (session.h264profile=="0"){
			session.h264profile = false;
		} else if (session.h264profile=="off"){
			session.h264profile = false;
		} else if (session.h264profile=="disabl"){
			session.h264profile = false;
		} else if (session.h264profile=="defaul"){
			session.h264profile = false;
		} else if (session.h264profile=="false"){
			session.h264profile = false;
		}
	}

	if (urlParams.has('nonacks')){ // disables error control / throttling.
		session.noNacks = true;
	}
	if (urlParams.has('nopli')){ // disables error control / throttling.
		session.noPLIs = true;
	}
	if (urlParams.has('noremb')){ // disables error control / throttling.
		session.noREMB = true;
	}

	if (urlParams.has('scale')) {
		if (urlParams.get('scale') == "false") {} else if (urlParams.get('scale') == "0") {} else if (urlParams.get('scale') == "no") {} else if (urlParams.get('scale') == "off") {} else {
			log("Resolution scale requested");
			session.scale = parseFloat(urlParams.get('scale')) || 100;
		}
		session.dynamicScale = false; // default true
	} else if (urlParams.has('viewwidth') || urlParams.has('vw')) {
		session.viewwidth = urlParams.get('viewwidth') || urlParams.get('vw') ||false;
		session.dynamicScale = false; // default true
	} else if (urlParams.has('viewheight') || urlParams.has('vh')) {
		session.viewheight = urlParams.get('viewheight') || urlParams.get('vh') ||false;
		session.dynamicScale = false; // default true
	}


	if (isIFrame) {
		getById("helpbutton").style.display = "none";
		getById("helpbutton").style.opacity = 0;
		getById("reportbutton").style.display = "none";
		getById("reportbutton").style.opacity = 0;
		getById("calendarButton").style.display = "none";
		getById("calendarButton").style.opacity = 0;
		getById("chatBody").innerHTML = "";
	}

	if (urlParams.has('beep') || urlParams.has('notify') || urlParams.has('tone')) {
		session.beepToNotify = true;
		var addtone = createAudioElement();
		addtone.id = "jointone";
		addtone.src = "./media/join.mp3";
		getById("testtone").parentNode.insertBefore(addtone, getById("testtone").nextSibling)
		var addtone = createAudioElement();
		addtone.id = "leavetone";
		addtone.src = "./media/leave.mp3";
		getById("testtone").parentNode.insertBefore(addtone, getById("testtone").nextSibling)
		
		if (!Notification) {
			warnlog('Desktop notifications are not available in your browser.');
		} else if (Notification.permission !== 'granted') {
			Notification.requestPermission();
		}
		
	}
	if (urlParams.has('r2d2')) {
		/* var addtone = createAudioElement();
		addtone.id = "jointone";
		addtone.src = "./media/join.mp3";
		getById("testtone").parentNode.insertBefore(addtone, getById("testtone").nextSibling)
		var addtone = createAudioElement();
		addtone.id = "leavetone";
		addtone.src = "./media/leave.mp3";
		getById("testtone").parentNode.insertBefore(addtone, getById("testtone").nextSibling) */
		getById("testtone").innerHTML = "";
		getById("testtone").src = "./media/robot.mp3";
		session.beepToNotify = true;
	}
	
	if (urlParams.has('easyexit') || urlParams.has('ee')) {
		session.noExitPrompt = true;
	}
	
	if (urlParams.has('entrymsg') || urlParams.has('welcome')) {
		session.welcomeMessage = urlParams.get('entrymsg') || urlParams.get('welcome');
		session.welcomeMessage = decodeURIComponent(session.welcomeMessage);
	}

	if (urlParams.has('videobitrate') || urlParams.has('bitrate') || urlParams.has('vb')) {
		session.bitrate = urlParams.get('videobitrate') || urlParams.get('bitrate') || urlParams.get('vb');
		if (session.bitrate) {
			if ((session.view_set) && (session.bitrate.split(",").length > 1)) {
				session.bitrate_set = session.bitrate.split(",");
				session.bitrate = parseInt(session.bitrate_set[0]);
			} else {
				session.bitrate = parseInt(session.bitrate);
			}
			if (session.bitrate < 1) {
				session.bitrate = false;
			}
			log("BITRATE ENABLED");
			log(session.bitrate);

		}
	}

	if (urlParams.has('maxvideobitrate') || urlParams.has('maxbitrate') || urlParams.has('mvb')) {
		session.maxvideobitrate = urlParams.get('maxvideobitrate') || urlParams.get('maxbitrate') || urlParams.get('mvb');
		session.maxvideobitrate = parseInt(session.maxvideobitrate);

		if (session.maxvideobitrate < 1) {
			session.maxvideobitrate = false;
		}
		log("maxvideobitrate ENABLED");
		log(session.maxvideobitrate);
	}

	if (urlParams.has('totalroombitrate') || urlParams.has('totalroomvideobitrate') || urlParams.has('trb') || urlParams.has('totalbitrate') || urlParams.has('tb')) {
		session.totalRoomBitrate = urlParams.get('totalroombitrate') || urlParams.get('totalroomvideobitrate') || urlParams.get('trb') || urlParams.get('totalbitrate') || urlParams.get('tb') || 0;
		session.totalRoomBitrate = parseInt(session.totalRoomBitrate);

		if (session.totalRoomBitrate < 1) {
			session.totalRoomBitrate = false;
		}
		log("totalRoomBitrate ENABLED");
		log(session.totalRoomBitrate);
		
	}
	if (session.totalRoomBitrate===false){
		session.totalRoomBitrate = session.totalRoomBitrate_default;
	} else {
		session.totalRoomBitrate_default = session.totalRoomBitrate; // trb_default doesn't change dynamically, but trb can (per director I guess)
	}
	
	if (urlParams.has('maxtotalscenebitrate') || urlParams.has('totalscenebitrate') || urlParams.has('mtsb') || urlParams.has('tsb') || urlParams.has('totalbitrate') || urlParams.has('tb')) {
		session.totalSceneBitrate = urlParams.get('maxtotalscenebitrate') || urlParams.get('totalscenebitrate') || urlParams.get('mtsb') || urlParams.get('tsb') || urlParams.get('totalbitrate') || urlParams.get('tb') || false;
		if (session.totalSceneBitrate){
			session.totalSceneBitrate = parseInt(session.totalSceneBitrate);
		}
	}


	if (urlParams.has('limittotalbitrate') || urlParams.has('ltb')){
		session.limitTotalBitrate = urlParams.get('limittotalbitrate') || urlParams.get('ltb') || 2500;
		session.limitTotalBitrate = parseInt(session.limitTotalBitrate);
	}
	
	if (urlParams.has('mcb') || urlParams.has('mcbitrate') || urlParams.has('meshcastbitrate')){
		session.meshcastBitrate = urlParams.get('mcb') || urlParams.get('mcbitrate') || urlParams.get('meshcastbitrate') || 2500;
		session.meshcastBitrate = parseInt(session.meshcastBitrate);
	}
	
	if (urlParams.has('mcscreensharebitrate') || urlParams.has('mcssbitrate')){
		session.meshcastScreenShareBitrate = urlParams.get('mcscreensharebitrate') || urlParams.get('mcssbitrate') || 2500;
		session.meshcastScreenShareBitrate = parseInt(session.meshcastScreenShareBitrate);
	}
	
	if (urlParams.has('mcscreensharecodec') || urlParams.has('mcsscodec')){
		session.meshcastScreenShareCodec = urlParams.get('mcscreensharecodec') || urlParams.get('mcsscodec') || false;
	}
	if (session.meshcastScreenShareCodec){
		session.meshcastScreenShareCodec = session.meshcastScreenShareCodec.toLowerCase();
	}
	
	if (urlParams.has('mcab') || urlParams.has('mcaudiobitrate') || urlParams.has('meshcastab')){
		session.meshcastAudioBitrate = urlParams.get('mcab') || urlParams.get('mcaudiobitrate') || urlParams.get('meshcastab') || 32;
		session.meshcastAudioBitrate = parseInt(session.meshcastAudioBitrate);
	}
	
	if (urlParams.has('mccodec') || urlParams.has('meshcastcodec')){
		session.meshcastCodec = urlParams.get('mccodec') || urlParams.get('meshcastcodec') || false;
	}
	if (session.meshcastCodec){
		session.meshcastCodec = session.meshcastCodec.toLowerCase();
	}

	if (urlParams.has('height') || urlParams.has('h')) {
		session.height = urlParams.get('height') || urlParams.get('h');
		session.height = parseInt(session.height);
	}

	if (urlParams.has('width') || urlParams.has('w')) {
		session.width = urlParams.get('width') || urlParams.get('w');
		session.width = parseInt(session.width);
	}

	if (urlParams.has('quality') || urlParams.has('q')) {
		try {
			session.quality = urlParams.get('quality') || urlParams.get('q') || 0;
			session.quality = parseInt(session.quality);
			getById("gear_screen").parentNode.removeChild(getById("gear_screen"));
			getById("gear_webcam").parentNode.removeChild(getById("gear_webcam"));
		} catch (e) {
			errorlog(e);
		}
	}

	if (urlParams.has('sink')) {
		session.sink = urlParams.get('sink');
	} else if (urlParams.has('outputdevice') || urlParams.has('od') || urlParams.has('audiooutput')) {
		session.outputDevice = urlParams.get('outputdevice') || urlParams.get('od') || urlParams.get('audiooutput') || null;
		
		if (session.outputDevice) {
			session.outputDevice = session.outputDevice.toLowerCase().replace(/[\W]+/g, "_");
		} else {
			session.outputDevice = null;
			getById("headphonesDiv3").style.display = "none"; // 
		}

		if (session.outputDevice) {
			try {
				enumerateDevices().then(function(deviceInfos) {
					for (let i = 0; i !== deviceInfos.length; ++i) {
						if (deviceInfos[i].kind === 'audiooutput') {
							if (deviceInfos[i].label.replace(/[\W]+/g, "_").toLowerCase().includes(session.outputDevice)) {
								session.sink = deviceInfos[i].deviceId;
								log("AUDIO OUT DEVICE: " + deviceInfos[i].deviceId);
								break;
							}
						}
					}
				});
			} catch (e) {}
		}
		
		getById("headphonesDiv").style.display = "none";
		getById("headphonesDiv2").style.display = "none";
	} else if (session.sink){
		if (session.sink == "default"){session.sink = false;}
		else {
			enumerateDevices().then(function(deviceInfos) {
				var matched = false;
				for (let i = 0; i !== deviceInfos.length; ++i) {
					if (deviceInfos[i].kind === 'audiooutput') {
						if (deviceInfos[i].deviceId == session.sink) {
							matched = true;
							break;
						}
					}
				}
				if (!matched){
					session.sink = false; // make sure any saved output device exists.
				}
			});
		}
	}

	if (window.obsstudio || (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1)){
		session.fullscreen = true;
	} else if (urlParams.has('fullscreen')) {
		session.fullscreen = true;
	}

	if (urlParams.has('stats')) {
		session.statsMenu = true;
	}
	
	if (urlParams.has('cleandirector') || urlParams.has('cdv')) {
		session.cleanDirector = true;
	}

	if (session.cleanOutput){
		getById("translateButton").style.display = "none";
		getById("credits").style.display = "none";
		getById("header").style.display = "none";
		getById("controlButtons").style.display = "none";
		getById("helpbutton").style.display = "none";
		getById("helpbutton").style.opacity = 0;
		getById("reportbutton").style.display = "none";
		getById("reportbutton").style.opacity = 0;
		getById("calendarButton").style.display = "none";
		getById("calendarButton").style.opacity = 0;
		document.documentElement.style.setProperty('--myvideo-background', '#0000');
		var styleTmp = document.createElement('style');
		styleTmp.innerHTML = `
		video {
			background-image: none;
		}
		`;
		document.head.appendChild(styleTmp);
	}
	getById("credits").innerHTML = "Version: " + session.version + " - " + getById("credits").innerHTML;

	if (urlParams.has('minidirector')) {
		try {
			var cssStylesheet = document.createElement('link');
			cssStylesheet.rel = 'stylesheet';
			cssStylesheet.type = 'text/css';
			cssStylesheet.media = 'screen';
			cssStylesheet.href = 'minidirector.css';
			document.getElementsByTagName('head')[0].appendChild(cssStylesheet);
		} catch (e) {
			errorlog(e);
		}
	}
	
	if (urlParams.has('cleanish')) {
		session.cleanish = true;
	}

	if (urlParams.has('channels')) { // must be loaded before channelOffset
		session.audioChannels = parseInt(urlParams.get('channels'));
		session.offsetChannel = 0;
		log("max channels is 32; channels offset");
		session.audioEffects = true;
	}
	if (urlParams.has('channeloffset')) {
		session.offsetChannel = parseInt(urlParams.get('channeloffset'));
		log("max channels is 32; channels offset");
		session.audioEffects = true;
	}

	if (urlParams.has('enhance')) {
		//if (parseInt(urlParams.get('enhance')>0){
		session.enhance = true; //parseInt(urlParams.get('enhance'));
		//}
	}

	if (urlParams.has('maxviewers') || urlParams.has('mv')) {

		session.maxviewers = urlParams.get('maxviewers') || urlParams.get('mv');
		if (session.maxviewers.length == 0) {
			session.maxviewers = 1;
		} else {
			session.maxviewers = parseInt(session.maxviewers);
		}
		log("maxviewers set");
	}

	if (urlParams.has('maxpublishers') || urlParams.has('mp')) {

		session.maxpublishers = urlParams.get('maxpublishers') || urlParams.get('mp');
		if (session.maxpublishers.length == 0) {
			session.maxpublishers = 1;
		} else {
			session.maxpublishers = parseInt(session.maxpublishers);
		}
		log("maxpublishers set");
	}

	if (urlParams.has('maxconnections') || urlParams.has('mc')) {

		session.maxconnections = urlParams.get('maxconnections') || urlParams.get('maxconnections');
		if (session.maxconnections.length == 0) {
			session.maxconnections = 1;
		} else {
			session.maxconnections = parseInt(session.maxconnections);
		}

		log("maxconnections set");
	}


	if (urlParams.has('secure')) {
		session.security = true;
		if (!(session.cleanOutput)) {
			delayedStartupFuncs.push([warnUser, "Enhanced Security Mode Enabled."]);
		}
	}

	if (urlParams.has('random') || urlParams.has('randomize')) {
		session.randomize = true;
	}

	if (urlParams.has('framerate') || urlParams.has('fr') || urlParams.has('fps')) {
		session.framerate = urlParams.get('framerate') || urlParams.get('fr') || urlParams.get('fps');
		session.framerate = parseInt(session.framerate);
		log("framerate Changed");
		log(session.framerate);
	}
	
	if (urlParams.has('tz')){
		session.tz = urlParams.get('tz');
		if ((session.tz === null) || (session.tz === "")){
			session.tz = false;
		} else {
			session.tz = parseInt(session.tz);
		}
	}

	if (urlParams.has('maxframerate') || urlParams.has('mfr') || urlParams.has('mfps')) {
		session.maxframerate = urlParams.get('maxframerate') || urlParams.get('mfr') || urlParams.get('mfps');
		session.maxframerate = parseInt(session.maxframerate);
		log("max framerate assigned");
		log(session.maxframerate);
	}

	if (urlParams.has('buffer')) { // needs to be before sync
		if ((ChromeVersion > 50) && (ChromeVersion< 78)){
			
		} else {
			session.buffer = parseFloat(urlParams.get('buffer')) || 0;
			log("buffer Changed: " + session.buffer);
			session.sync = 0;
			session.audioEffects = true;
		}
	}
	
	if (urlParams.has('panning') || urlParams.has('pan')) {
		session.panning = urlParams.get('panning') || urlParams.get('pan');
		if (session.panning===""){
			session.panning=true
		}
		session.audioEffects = true;
	}

	if (urlParams.has('sync')) {
		if ((ChromeVersion > 50) && (ChromeVersion< 78)){
			
		} else {
			session.sync = parseFloat(urlParams.get('sync'));
			log("sync Changed; in milliseconds.  If not set, defaults to auto.");
			log(session.sync);
			session.audioEffects = true;
			if (session.buffer === false) {
				session.buffer = 0;
			}
		}
	}

	if (urlParams.has('mirror')) {
		if (urlParams.get('mirror') == "3") {
			getById("main").classList.add("mirror");
		} else if (urlParams.get('mirror') == "2") {
			session.mirrored = 2;
		} else if (urlParams.get('mirror') == "0") {
			session.mirrored = 0;
		} else if (urlParams.get('mirror') == "false") {
			session.mirrored = 0;
		} else if (urlParams.get('mirror') == "off") {
			session.mirrored = 0;
		} else {
			session.mirrored = 1;
		}
	}

	if (urlParams.has('flip')) {
		if (urlParams.get('flip') == "0") {
			session.flipped = false;
		} else if (urlParams.get('flip') == "false") {
			session.flipped = false;
		} else if (urlParams.get('flip') == "off") {
			session.flipped = false;
		} else {
			session.flipped = true;
		}
	}

	if ((session.mirrored) && (session.flipped)) {
		try {
			log("Mirror all videos");
			var mirrorStyle = document.createElement('style');
			mirrorStyle.innerHTML = "video {transform: scaleX(-1) scaleY(-1); }";
			document.getElementsByTagName("head")[0].appendChild(mirrorStyle);
		} catch (e) {
			errorlog(e);
		}
	} else if (session.mirrored) { // mirror the video horizontally
		try {
			log("Mirror all videos");
			var mirrorStyle = document.createElement('style');
			mirrorStyle.innerHTML = "video {transform: scaleX(-1);}";
			document.getElementsByTagName("head")[0].appendChild(mirrorStyle);
		} catch (e) {
			errorlog(e);
		}
	} else if (session.flipped) { // mirror the video vertically
		try {
			log("Mirror all videos");
			var mirrorStyle = document.createElement('style');
			mirrorStyle.innerHTML = "video {transform: scaleY(-1);}";
			document.getElementsByTagName("head")[0].appendChild(mirrorStyle);
		} catch (e) {
			errorlog(e);
		}
	}


	if (urlParams.has('icefilter')) {
		log("ICE FILTER ENABLED");
		session.icefilter = urlParams.get('icefilter');
	}
	
	//if (!(ChromeVersion>=57)){
	//	getById("effectSelector").disabled=true;
	//	getById("effectSelector3").disabled=true;
	//	getById("effectSelector").title = "Effects are only support on Chromium-based browsers";
	//	getById("effectSelector3").title = "Effects are only support on Chromium-based browsers";
	//	var elementsTmp = document.querySelectorAll('[data-effectsNotice]');
	//	for (let i = 0; i < elementsTmp.length; i++) {
	//		elementsTmp[i].style.display = "inline-block";
	//	}
	//} 


	if (urlParams.has('viewereffect') || urlParams.has('viewereffects') || urlParams.has('ve')) {
		session.viewereffects = parseInt(urlParams.get('viewereffect')) || parseInt(urlParams.get('ve')) || false;
	}

	if (urlParams.has('activespeaker') || urlParams.has('speakerview')  || urlParams.has('sas')){
		session.activeSpeaker = urlParams.get('activespeaker') || urlParams.get('speakerview')  || urlParams.get('sas') || 1;
		session.activeSpeaker = parseInt(session.activeSpeaker);
		session.style=6;
		session.audioEffects = true;
		session.audioMeterGuest = true; 
		session.minipreview = 2;
		if (session.activeSpeaker==1){
			session.animatedMoves = false;
		}
		session.fadein=true;
		document.querySelector(':root').style.setProperty('--fadein-speed', 0.5);
		setInterval(function(){activeSpeaker(false);},100);
		
	} else if (urlParams.has('noisegate')){
		session.quietOthers = urlParams.get('noisegate') || 1;
		session.quietOthers = parseInt(session.quietOthers);
		session.audioEffects = true;
		session.audioMeterGuest = true;
		setInterval(function(){activeSpeaker(false);},100);
	}
	
	if (urlParams.has('fadein')) {
		session.fadein=true;
		if (urlParams.get('fadein') || 0){
			try {
				var fadeinspeed = parseInt(urlParams.get('fadein') || 0)/1000.0;
				fadeinspeed+="s";
				document.querySelector(':root').style.setProperty('--fadein-speed', fadeinspeed);
			} catch(e){errorlog("variable css failed");}
		} else {
			try {
				var fadeinspeed = 0.5;
				fadeinspeed+="s";
				document.querySelector(':root').style.setProperty('--fadein-speed', fadeinspeed);
			} catch(e){errorlog("variable css failed");}
		}
	}

	if (urlParams.has('animated') || urlParams.has('animate')){
		session.animatedMoves = urlParams.get('animated') || urlParams.get('animate');
		if (session.animatedMoves === "false") {
			session.animatedMoves = false;
		} else if (session.animatedMoves === "0") {
			session.animatedMoves = false;
		} else if (session.animatedMoves === "no") {
			session.animatedMoves = false;
		} else if (session.animatedMoves === "off") {
			session.animatedMoves = false;
		} else {
			session.animatedMoves = parseInt(session.animatedMoves) || 100;
		}
		if (session.animatedMoves>200){
			session.animatedMoves = 200;
		}
	} else if (session.mobile){
		session.animatedMoves=false;
	}

	if (urlParams.has('meter') || urlParams.has('meterstyle')){ // same as also adding &style=3
		session.meterStyle = urlParams.get('meter') || urlParams.get('meterstyle') || 1;
		session.meterStyle = parseInt(session.meterStyle);
		session.style=3;
		session.audioEffects = true;
	}

	if (urlParams.has('directorchat') || urlParams.has('dc')){
		session.directorChat = true;
	}

	if (urlParams.has('style') || urlParams.has('st')) {
		session.style = urlParams.get('style') || urlParams.get('st');
		if ((parseInt(session.style) === 0) || (session.style == "controls")) { // no audio only
			session.style = 0;
		} else if ((parseInt(session.style) == 1) || (session.style == "justvideo")) { // no audio only
			session.style = 1;
		} else if ((parseInt(session.style) == 2) || (session.style == "waveform")) { // audio waveform
			session.style = 2;
			session.audioEffects = true; ////!!!!!!! Do I want to enable the audioEffects myself? or do it here?
		} else if ((parseInt(session.style) == 3) || (session.style == "volume")) { // audio meter ; see &meterstyle , where optios include default(false), 1, and 2.
			session.style = 3;
			session.audioEffects = true;
		} else if (parseInt(session.style) == 4) { // black background
			session.style = 4;
		} else if (parseInt(session.style) == 5) { // random colored background
			session.style = 5;
		} else if (parseInt(session.style) == 7) {  // shows video elements for all connections; even those without video/audio
			session.style = parseInt(session.style);
			session.showall = true;
		} else if (parseInt(session.style)) {  // 6 is the first letter of the name, surrounded with a colored circle
			session.style = parseInt(session.style);
		} else {
			session.style = 1;
		}
	}
	if (urlParams.has('showall')){ // just an alternative; might be compoundable
		session.showall = true;
	}


	if (urlParams.has('samplerate') || urlParams.has('sr')) {
		session.sampleRate = parseInt(urlParams.get('samplerate')) || parseInt(urlParams.get('samplerate')) || 48000;
		if (session.audioCtx) {
			session.audioCtx.close(); // close the default audio context.
		}
		session.audioCtx = new AudioContext({ // create a new audio context with a higher sample rate. 
			sampleRate: session.sampleRate
		});
		session.audioEffects = true;
	}


	if (urlParams.has('noaudioprocessing') || urlParams.has('noap')) {
		session.disableWebAudio = true; // default true; might be useful to disable on slow or old computers?
		session.audioEffects = false; // disable audio inbound effects also.
		session.audioMeterGuest = false;
	}
	
	// For info, see this: https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidatePairStats/availableOutgoingBitrate
	if (urlParams.has('maxbandwidth')) { // limits the bitrate based on the outbound total available bandwidth; chromium-based
		session.maxBandwidth = urlParams.get('maxbandwidth') || 80; // 0 to 100; will reduce bitrate as a percentage of available
		session.maxBandwidth = parseInt(session.maxBandwidth);
		if (session.maxBandwidth > 200){ // will over ride default 2500kbps if no bitrate is specified
			session.maxBandwidth = 200;
		} else if (session.maxBandwidth<0){
			session.maxBandwidth = 0;
		}
	}

	if (urlParams.has('tcp')){ // forces the TURN servers to use TCP mode; still need to add &private to force TURN also tho
		session.forceTcpMode = true;
	}
	if (urlParams.has('speedtest')){ // forces essentially UDP mode, unless TCP is specified, and some other stuff
		session.speedtest = true;
		if (urlParams.get('speedtest')){
			session.speedtest = urlParams.get('speedtest').toLowerCase();
		}
	}
	
	var iceServers = [{ urls: ["stun:stun.l.google.com:19302", "stun:stun4.l.google.com:19302"]}]; // google stun servers.
	
	if (urlParams.has('stun')) {
		var stunstring = urlParams.get('stun');
		stunstring = stunstring.split(";");
		if (stunstring !== "false") { // false disables the TURN server. Useful for debuggin
			var stun = {};
			if (stunstring.length==3){
				stun.username = stunstring[0]; // myusername
				stun.credential = stunstring[1]; //mypassword
				stun.urls = [stunstring[2]]; //  ["turn:turn.obs.ninja:443"];
			} else if (stunstring.length==1){
				stun.urls = [stunstring[0]];
			}
			iceServers = [stun];
		} else {
			iceServers = [];
		}
	}
	if (urlParams.has('addstun')) {
		var stunstring = urlParams.get('addstun');
		stunstring = stunstring.split(";");
		var stun = {};
		if (stunstring.length==3){
			stun.username = stunstring[0]; // myusername
			stun.credential = stunstring[1]; //mypassword
			stun.urls = [stunstring[2]]; //  ["turn:turn.obs.ninja:443"];
		} else if (stunstring.length==1){
			stun.urls = [stunstring[0]];
		}
		iceServers = iceServers.concat(stun);
	} 

	if (urlParams.has('turn')) {
		var turnstring = urlParams.get('turn');
		if (turnstring == "twilio") { // a sample function on loading remote credentials for TURN servers.
			try {
				
				session.ws = false; // prevents connection
				var twillioRequest = new XMLHttpRequest();
				twillioRequest.onreadystatechange = function() {
					if (twillioRequest.status === 200) {
						try{
							var res = JSON.parse(twillioRequest.responseText);
						} catch(e){return;}
						session.configuration = {
							iceServers: [{
									"username": res["1"],
									"credential": res["2"],
									"url": "turn:global.turn.twilio.com:3478?transport=tcp",
									"urls": "turn:global.turn.twilio.com:3478?transport=tcp"
								},
								{
									"username": res["1"],
									"credential": res["2"],
									"url": "turn:global.turn.twilio.com:443?transport=tcp",
									"urls": "turn:global.turn.twilio.com:443?transport=tcp"
								}
							],
							sdpSemantics: 'unified-plan' // future-proofing
						};
						if (session.ws===false){
							session.ws=null; // allows connection (clears state)
							session.connect(); // connect if not already connected.
						}
					}
					// system does not connect if twilio API does not respond.
				};
				twillioRequest.open('GET', 'https://api.obs.ninja:1443/twilio', true); // `false` makes the request synchronous
				twillioRequest.send();

				
			} catch (e) {
				errorlog("Twilio Failed");
			}
		} else if (turnstring == "nostun") { // disable TURN servers
			session.configuration = {
				sdpSemantics: 'unified-plan' // future-proofing
			};
		} else if ((turnstring == "false") || (turnstring == "off") || (turnstring == "0")) { // disable TURN servers
			session.configuration = {
				iceServers: iceServers,
				sdpSemantics: 'unified-plan' // future-proofing
			};
		} else {
			try {
				//session.configuration = {iceServers: [], sdpSemantics: 'unified-plan'};
				turnstring = turnstring.split(";");
				if (turnstring !== "false") { // false disables the TURN server. Useful for debuggin
					var turn = {};
					if (turnstring.length==3){
						turn.username = turnstring[0]; // myusername
						turn.credential = turnstring[1]; //mypassword
						turn.urls = [turnstring[2]]; //  ["turn:turn.obs.ninja:443"];
					} else if (turnstring.length==1){
						turn.urls = [turnstring[0]];
					}
					session.configuration = {
						iceServers: iceServers,
						sdpSemantics: 'unified-plan' // future-proofing
					};
					
					session.configuration.iceServers.push(turn);
				}
			} catch (e) {
				if (!(session.cleanOutput)) {
					warnUser("TURN server parameters were wrong.");
				}
				errorlog(e);
			}
		}
	} else {
		chooseBestTURN(iceServers); // vdo.ninja turn servers, if needed.
	}


	if (urlParams.has('privacy') || urlParams.has('private') || urlParams.has('relay')) { // please only use if you are also using your own TURN service.
		session.privacy = true;
		
		try {
			session.configuration.iceTransportPolicy = "relay"; // https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/address
		} catch (e) {
			if (!(session.cleanOutput)) {
				warnUser("Privacy mode failed to configure.");
			}
			errorlog(e);
		}
		
		if (session.speedtest){
			if (session.maxvideobitrate !== false) {
				if (session.maxvideobitrate > 6000) {
					session.maxvideobitrate = 6000; // Please feel free to get rid of this if using your own TURN servers...
				}
			} else {
				session.maxvideobitrate = 6000; // don't let people pull more than 2500 from you
			}
			if (session.bitrate !== false) {
				if (session.bitrate > 6000) {
					session.bitrate = 6000; // Please feel free to get rid of this if using your own TURN servers...
				}
			}
		} else {
			if (session.maxvideobitrate !== false) {
				if (session.maxvideobitrate > 2500) {
					session.maxvideobitrate = 2500; // Please feel free to get rid of this if using your own TURN servers...
				}
			} else {
				session.maxvideobitrate = 2500; // don't let people pull more than 2500 from you
			}
			if (session.bitrate !== false) {
				if (session.bitrate > 2500) {
					session.bitrate = 2500; // Please feel free to get rid of this if using your own TURN servers...
				}
			}
		}
	}

	if (urlParams.has('wss')) {
		session.customWSS = true;
		if (urlParams.get('wss')) {
			session.wss = "wss://" + urlParams.get('wss');
		}
	}
	
	if (urlParams.has("bypass")){
		session.bypass = true;
		session.customWSS = true;
	}
	
	if (urlParams.has('osc') || urlParams.has('api')) {
		if (urlParams.get('osc') || urlParams.get('api')) {
			session.api = urlParams.get('osc') || urlParams.get('api');
			setTimeout(function(){oscClient();},1000);
		}
	}

	if (urlParams.has('queue')) {
		session.queue = true;
	}

	if (urlParams.has('push') || urlParams.has('id') || urlParams.has('permaid') ) {
		session.permaid = urlParams.get('push')  || urlParams.get('id') || urlParams.get('permaid');

		if (session.permaid) {
			session.streamID = sanitizeStreamID(session.permaid);
		} else {
			session.permaid = null;
		}
		
		if (urlParams.has('push')){
			updateURL("push="+session.streamID, true, false);
		} else if (urlParams.has('id')){
			updateURL("id="+session.streamID, true, false); // not 'officially' supporting this yet; we'll see.
		} else if (urlParams.has('permaid')){
			updateURL("permaid="+session.streamID, true, false);
		} else {
			updateURL("push="+session.streamID, true, false);
		}
		
		if (urlParams.has('director') || urlParams.has('dir')) { // if I do a short form of this, it will cause duplications in the code elsewhere.
			//var director_room_input = urlParams.get('director');
			//director_room_input = sanitizeRoomName(director_room_input);
			//createRoom(director_room_input);
			session.permaid = false; // used to avoid a trigger later on.
		} else {
			getById("container-1").className = 'column columnfade hidden';
			getById("container-4").className = 'column columnfade hidden';
			getById("dropButton").className = 'column columnfade hidden';

			getById("info").innerHTML = "";
			if (session.videoDevice === 0) {
				miniTranslate(getById("add_camera"), "share-your-mic", "Share your Microphone");
			} else {
				miniTranslate(getById("add_camera"), "share-your-camera", "Share your Camera");
			}
			miniTranslate(getById("add_screen"), "share-your-screen", "Share your Screen");
			getById("container-2").title = getById("add_screen").innerText;
			getById("container-3").title = getById("add_camera").innerText;

			getById("passwordRoom").value = "";
			getById("videoname1").value = "";
			getById("dirroomid").innerHTML = "";
			getById("roomid").innerHTML = "";

			getById("mainmenu").style.alignSelf = "center";
			getById("mainmenu").classList.add("mainmenuclass");
			getById("header").style.alignSelf = "center";

			//if ((iOS) || (iPad)) {
				//getById("header").style.display = "none"; // just trying to free up space.
			//}

			if (session.webcamonly == true) { // mobile or manual flag 'webcam' pflag set
				getById("head1").innerHTML = '<font style="color:#CCC;" data-translate="please-accept-permissions">- Please accept any camera permissions</font>';
			} else {
				getById("head1").innerHTML = '<br /><font style="color:#CCC" data-translate="please-select-which-to-share">- Please select which you wish to share</font>';
			}
		}
	}
	
	if ((session.roomid) || (urlParams.has('roomid')) || (urlParams.has('r')) || (urlParams.has('room')) || (filename) || (session.permaid !== false)) {

		var roomid = "";
		if (urlParams.has('room')) { // needs to be first; takes priority
			roomid = urlParams.get('room');
		} else if (filename) {
			roomid = filename;
		} else if (urlParams.has('roomid')) {
			roomid = urlParams.get('roomid');
		} else if (urlParams.has('r')) {
			roomid = urlParams.get('r');
		} else if (session.roomid) {
			roomid = session.roomid;
		}
		session.roomid = sanitizeRoomName(roomid);
	}
	
	if ((session.permaid===false) && (session.roomid===false) && (session.view===false) && (session.effects===false) && (session.director===false)){
		session.effects = null;
	}
	
	if (urlParams.has('effects') || urlParams.has('effect')) {
		session.effects = urlParams.get('effects') || urlParams.get('effect') || null;
	}
	
	if (urlParams.has('imagelist')){ // "&imagelist="+encodeURIComponent(JSON.stringify(["./media/bg_sample.webp", "./media/bg_sample2.webp"]))
		var imageList = urlParams.get('imagelist'); // 
		if (imageList){
			try {
				imageList = JSON.parse(decodeURIComponent(imageList));
			} catch(e){
				console.error(e);
			}
			if (imageList.length){
				session.defaultBackgroundImages = imageList; //  ["./media/bg_sample.webp", "./media/bg_sample2.webp"]
			} else {
				warnlog("empty image array; skipping");
			}
		}
	}
	
	if (session.effects!==false){
		if (session.effects === null){
			getById("effectsDiv").style.display = "block";
			session.effects = "0";
		} else if (session.effects === "0" || session.effects === "false" || session.effects === "off" || session.effects === 0){
			session.effects = false;
			getById("effectSelector3").style.display = "none";
			getById("effectsDiv3").style.display = "none";
			getById("effectSelector").style.display = "none";
			getById("effectsDiv").style.display = "none";
		}
		
		if (session.effects === "5"){
			
			loadTFLITEImages();
			
			getById("effectSelector").style.display = "none";
			getById("effectsDiv").style.display = "block";
			
		}
		if (session.effect === "3a"){ // heavier blur
			session.effectValue = 5;
			session.effect = "3";
		} else if (session.effect === "3"){
			session.effectValue = 2;
		}
		// mirror == 2
		// face == 1
		// blur = 3
		// green = 4
		// image = 5
	}
	
	if (urlParams.has('effectvalue') || urlParams.has('ev')) {
		session.effectValue = parseInt(urlParams.get('effectvalue')) || parseInt(urlParams.get('ev')) || 0;
		session.effectValue_default = session.effectValue;
	}
	
	if (session.webcamonly == true) {
		if (session.introButton){
			getById("container-2").className = 'column columnfade hidden'; // Hide screen share
			getById("head3").classList.add('hidden');
			getById("head3a").classList.add('hidden');
		} else {
			getById("container-2").className = 'column columnfade hidden'; // Hide screen share
			getById("container-3").classList.add("skip-animation");
			getById("container-3").classList.remove('pointer');
			delayedStartupFuncs.push([previewWebcam]);
		}
	}
	if (session.introOnClean && (session.permaid===false) && (session.roomid===false)){ 
		//getById("container-2").className = 'column columnfade hidden'; // Hide screen share
		getById("head3").classList.add('hidden');
		getById("head3a").classList.add('hidden');
	} else if (session.introOnClean && (session.scene===false) && ((session.permaid!==false || session.roomid!==false))){
		getById("container-2").className = 'column columnfade hidden'; // Hide screen share
		getById("container-3").classList.add("skip-animation");
		getById("container-3").classList.remove('pointer');
		delayedStartupFuncs.push([previewWebcam]); 
	}
	
	//if (!session.director && ((ChromeVersion == 86) || (ChromeVersion == 77) || (ChromeVersion == 62) || (ChromeVersion == 51)) && (((session.permaid===false) && session.view) || (session.scene!==false))){
	//	session.studioSoftware = true; // vmix
	if (window.obsstudio){
		session.studioSoftware = true;
	}
	if (session.cleanViewer){
		if (session.view && !session.director && session.permaid===false){
			session.cleanOutput = true;
		}
	}
	
	if (urlParams.has('hidescreenshare') || urlParams.has('hidess') || urlParams.has('sshide') || urlParams.has('screensharehide')) { // this way I don't need to remember what it's called. I can just guess. :D
		session.screenShareElementHidden = true;
	}
	
	if (urlParams.has('sspaused') || urlParams.has('sspause') || urlParams.has('ssp')) { // this way I don't need to remember what it's called. I can just guess. :D
		session.screenShareStartPaused = true;
	}
	
	if (urlParams.has('zoomedbitrate') || urlParams.has('zb')) { // this way I don't need to remember what it's called. I can just guess. :D
		session.zoomedBitrate = urlParams.get('zoomedbitrate') || urlParams.get('zb') || 2500;
		session.zoomedBitrate = parseInt(session.zoomedBitrate) ;
	}
	
	if (urlParams.has('screenshareid') || urlParams.has('ssid')) {
		if (urlParams.get('screenshareid') || urlParams.get('ssid')) {
			session.screenshareid = urlParams.get('screenshareid') || urlParams.get('ssid');
			session.screenshareid = sanitizeStreamID(session.screenshareid);
		} else {
			session.screenshareid = session.streamID + "_ss";
		}
	}
	
	if (urlParams.has('screensharevideoonly') || urlParams.has('ssvideoonly') || urlParams.has('ssvo')) {
		session.screenshareVideoOnly = true;
	}

	if (urlParams.has('screensharefps') || urlParams.has('ssfps')) {
		if (urlParams.get('screensharefps') || urlParams.get('ssfps')) {
			session.screensharefps = urlParams.get('screensharefps') || urlParams.get('ssfps');
			session.screensharefps = parseInt(session.screensharefps) || 2;
		}
	}

	if (urlParams.has('screensharequality') || urlParams.has('ssq')) {
		if (urlParams.get('screensharequality') || urlParams.get('ssq')) {
			session.screensharequality = urlParams.get('screensharequality') || urlParams.get('ssq');
			session.screensharequality = parseInt(session.screensharequality) || 0;
			try {
				getById("gear_screen").parentNode.removeChild(getById("gear_screen"));
			} catch(e){}
		}
	}
	
	if (urlParams.has('screensharebitrate') || urlParams.has('ssbitrate')) {
		session.screenShareBitrate = urlParams.get('screensharebitrate') || urlParams.get('ssbitrate');
		session.screenShareBitrate = parseInt(session.screenShareBitrate) || 2500;
	}
	
	if (urlParams.has('screensharelabel') || urlParams.has('sslabel')) {
		session.screenShareLabel = urlParams.get('screensharelabel') || urlParams.get('sslabel');
		session.screenShareLabel = decodeURIComponent(session.screenShareLabel);
		session.screenShareLabel = session.screenShareLabel.replace(/_/g, " ")
	}
	
	if (session.roomid!==false){
		if (!(session.cleanOutput)) {
			if (session.roomid === "test") {
				if (session.password === session.defaultPassword) {
					window.focus();
					var testRoomResponse = confirm(miscTranslations["room-test-not-good"]);
					if (testRoomResponse == false) {
						hangup();
						throw new Error("User requested to not enter room 'room'.");
					}
				}
			}
		}

		if (session.audioDevice === false && session.outputDevice === false) {
			getById("headphonesDiv2").style.display = "inline-block";
			getById("headphonesDiv").style.display = "inline-block";
		}
		getById("addPasswordBasic").style.display = "none";
		
		getById("info").innerHTML = "";
		getById("info").style.color = "#CCC";
		getById("videoname1").value = session.roomid;
		getById("dirroomid").innerText = session.roomid;
		getById("roomid").innerText = session.roomid;
		getById("container-1").className = 'column columnfade hidden';
		getById("container-4").className = 'column columnfade hidden';
		// container 5 is share media file; 6 is share website
		getById("container-7").style.display = 'none';
		getById("container-8").style.display = 'none';
		getById("container-9").style.display = 'none';
		getById("container-10").style.display = 'none';
		getById("container-11").style.display = 'none';
		getById("container-12").style.display = 'none';
		getById("container-13").style.display = 'none';
		getById("mainmenu").style.alignSelf = "center";
		getById("mainmenu").classList.add("mainmenuclass");
		getById("header").style.alignSelf = "center";

		if (session.webcamonly == true) { // mobile or manual flag 'webcam' pflag set
			getById("head1").innerHTML = '';
		} else {
			getById("head1").innerHTML = '<font style="color:#CCC" data-translate="please-select-option-to-join">Please select an option to join.</font>';
		}

		if (session.roomid.length > 0) {
			if (session.videoDevice === 0) {
				if (session.audioDevice === 0) {
					miniTranslate(getById("add_camera"), "join-room", "Join room");
				} else {
					miniTranslate(getById("add_camera"), "join-room-with-mic", "Join room with Microphone");
				}
			} else {
				miniTranslate(getById("add_camera"), "join-room-with-camera", "Join Room with Camera");
			}
			miniTranslate(getById("add_screen"), "share-screen-with-room", "Screenshare with Room");
		} else {
			if (session.videoDevice === 0) {
				miniTranslate(getById("add_camera"), "share-your-mic", "Share your Microphone");
			} else {
				miniTranslate(getById("add_camera"), "share-your-camera",  "Share your Camera");
			}
			miniTranslate(getById("add_screen"), "share-your-screen", "Share your Screen");
		}
		getById("head3").classList.add('hidden');
		getById("head3a").classList.add('hidden');
		getById("container-2").title = getById("add_screen").innerText;
		getById("container-3").title = getById("add_camera").innerText;

		if (session.scene !== false) {
			getById("container-4").className = 'column columnfade';
			getById("container-3").className = 'column columnfade';
			getById("container-2").className = 'column columnfade';
			getById("container-1").className = 'column columnfade';
			getById("header").className = 'hidden';
			getById("info").className = 'hidden';
			getById("head1").className = 'hidden';
			getById("head2").className = 'hidden';
			getById("mainmenu").style.display = "none";
			getById("translateButton").style.display = "none";
			log("Update Mixer Event on REsize SET");
			window.onresize = updateMixer;
			window.onorientationchange = function(){
				setTimeout(updateMixer, 200);
				
			};
			joinRoom(session.roomid); // this is a scene, so we want high resolutions
			getById("main").style.overflow = "hidden";

			if (session.chatbutton === true) {
				getById("chatbutton").classList.remove("hidden");
				getById("controlButtons").style.display = "inherit";
			} else if (session.chatbutton === false) {
				getById("chatbutton").classList.add("hidden");
			}
		} else if ((session.permaid === null) && (session.roomid == "")) {
			if (!(session.cleanOutput)) {
				getById("head3").classList.remove('hidden');
				getById("head3a").classList.remove('hidden');
			}
		} else if ((window.obsstudio) && (session.permaid === false) && (session.director === false) && (session.view) &&(session.roomid.length>0)) { // we already know roomid !== false
			updateURL("scene", true, false); // we also know it's not a scene, but we will assume it is in this specific case.
		}
		

	} else if (urlParams.has('director') || urlParams.has('dir')) { // if I do a short form of this, it will cause duplications in the code elsewhere.
		if (directorLanding == false) {
			var director_room_input = urlParams.get('director') || urlParams.get('dir');
			director_room_input = sanitizeRoomName(director_room_input);
			log("director_room_input:" + director_room_input);
			
			if (urlParams.has('codirector') || urlParams.has('directorpassword') || urlParams.has('dirpass') || urlParams.has('dp')) {
				session.directorPassword = urlParams.get('codirector') || urlParams.get('directorpassword') || urlParams.get('dirpass') || urlParams.get('dp');
				if (!session.directorPassword) {
					window.focus();
					session.directorPassword = await promptAlt(miscTranslations["enter-director-password"], true);
				} else {
					session.directorPassword = decodeURIComponent(session.directorPassword);
				}
				if (session.directorPassword){
					session.directorPassword = sanitizePassword(session.directorPassword)
					await generateHash(session.directorPassword + session.salt + "abc123", 12).then(function(hash) { // million to one error. 
						log("dir room hash is " + hash);
						session.directorHash = hash;
						return;
					}).catch(errorlog);
				} else {
					session.directorPassword = false;
				}
			}
			
			createRoom(director_room_input);
		}
		if (session.chatbutton === true) {
			getById("chatbutton").classList.remove("hidden");
			getById("controlButtons").style.display = "inherit";
		} else if (session.chatbutton === false) {
			getById("chatbutton").classList.add("hidden");
		}
	} else if ((session.view) && (session.permaid === false)) {
		//if (!session.activeSpeaker){
		session.audioMeterGuest = false;
		//}
		if ((session.style===false) && window.obsstudio){
			session.style = 1;
		}
		if (session.audioEffects === null) {
			session.audioEffects = false;
		}
		log("Update Mixer Event on REsize SET");
		getById("translateButton").style.display = "none";
		window.onresize = updateMixer;
		window.onorientationchange = function(){setTimeout(updateMixer, 200);};
		getById("main").style.overflow = "hidden";

		if (session.chatbutton === true) {
			getById("chatbutton").classList.remove("hidden");
			getById("controlButtons").style.display = "inherit";
		} else if (session.chatbutton === false) {
			getById("chatbutton").classList.add("hidden");
		}
	} 
	
	if (urlParams.has('nofileshare') || urlParams.has('nodownloads') || urlParams.has('nofiles')){
		session.hostedFiles = false;
		session.nodownloads = true;
		getById('sharefilebutton').style.display = "none";
		getById('sharefilebutton').classList.add("hidden");
	} else if (session.mobile){
		getById('sharefilebutton').style.display = "none";
		getById('sharefilebutton').classList.add("hidden");
	} else if (session.roomid==false){
		getById('sharefilebutton').style.display = "none";
		getById('sharefilebutton').classList.add("hidden");
	}

	if (session.audioEffects === null) {
		session.audioEffects = true;
	}

	if (session.audioEffects) {
		getById("channelGroup1").style.display = "block";
		getById("channelGroup2").style.display = "block";
	}

	if (urlParams.has('hidemenu') || urlParams.has('hm')) { // needs to happen the room and permaid applications
		getById("mainmenu").style.display = "none";
		getById("header").style.display = "none";
		getById("mainmenu").style.opacity = 0;
		getById("header").style.opacity = 0;
	}

	if (urlParams.has('hideheader') || urlParams.has('noheader') || urlParams.has('hh')) { // needs to happen the room and permaid applications
		getById("header").style.display = "none";
		getById("header").style.opacity = 0;
	}
	
	
	
	if (session.view) {
		getById("main").className = "";
		getById("credits").style.display = 'none';
		try {
			if (session.label === false) {
				if (document.title == "") {
					document.title = "View=" + session.view.toString();
				} else {
					document.title += ", View=" + session.view.toString();
				}
			}
		} catch (e) {
			errorlog(e);
		};
	}

	if ((session.view) && (session.roomid === false)) {
		
		getById("container-4").className = 'column columnfade';
		getById("container-3").className = 'column columnfade';
		getById("container-2").className = 'column columnfade';
		getById("container-1").className = 'column columnfade';
		//getById("header").className = 'hidden';
		getById("info").className = 'hidden';
		getById("header").className = 'hidden';
		getById("head1").className = 'hidden';
		getById("head2").className = 'hidden';
		getById("head3").classList.add('hidden');
		getById("head3a").classList.add('hidden');
		

		getById("mainmenu").style.backgroundRepeat = "no-repeat";
		getById("mainmenu").style.backgroundPosition = "bottom center";
		getById("mainmenu").style.height = "100%";
		getById("mainmenu").style.backgroundSize = "100px 100px";
		getById("mainmenu").innerHTML = '';
		getById("mainmenu").classList.remove("row");

		var timeout = 5000;
		if (urlParams.has('waittimeout')){
			timeout = parseInt(urlParams.get('waittimeout')) || 0;
		}
		setTimeout(function() {
			try {
				if ((session.view)) {
					if (document.getElementById("mainmenu")) {
						if (urlParams.has('waitimage')){
							getById("mainmenu").innerHTML += '<img id="retryimage"/>';
							getById("retryimage").src = decodeURIComponent(urlParams.get('waitimage'));
							getById("retryimage").onerror = function(){this.style.display='none';};
							
						} else if (!(session.cleanOutput)){
							getById("mainmenu").innerHTML += '<div class="retry-spinner" id="retrySpinner"></div>';
							getById("retrySpinner").onclick = function(){
								updateURL("cleanoutput");
								location.reload();
							}
							getById("retrySpinner").title = miscTranslations["waiting-for-the-stream"]
						}
						if (urlParams.has('waitmessage')){
							getById("mainmenu").innerHTML += '<div id="retrymessage"></div>';
							getById("retrymessage").innerText = urlParams.get('waitmessage');
							getById("retrySpinner").title = urlParams.get('waitmessage');
						}
					}
				}
			} catch (e) {
				errorlog(e);
			}
		}, timeout);

		log("auto playing");
		if ((iPad || iOS) && navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1 && SafariVersion > 13) { // Modern iOS doesn't need pop up
			play();
		} else if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) { // Safari on Desktop does require pop up
			if (!(session.cleanOutput)) {
				warnUser("Safari requires us to ask for an audio permission to use peer-to-peer technology. You will need to accept it in a moment if asked to view this live video", 20000);
			}
			navigator.mediaDevices.getUserMedia({
				audio: true
			}).then(function() {
				closeModal();
				play();
			}).catch(function() {
				play();
			});
		} else { // everything else is OK.
			play();
		}
	} else if (session.roomid) {
		try {
			if (session.label === false) {
				if (document.title == "") {
					document.title = "Room=" + session.roomid.toString();
				} else {
					document.title += ": " + session.roomid.toString();
				}
			}
		} catch (e) {
			errorlog(e);
		};

	}
	setTimeout(function(){
		for (var i in delayedStartupFuncs) {
			var cb = delayedStartupFuncs[i];
			log(cb.slice(1));
			cb[0](...cb.slice(1)); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#A_better_apply
		}
		delayedStartupFuncs = [];
	},50);

	if ((session.effects=="3") || (session.effects=="4") || (session.effects=="5")){
		attemptTFLiteJsFileLoad();
	} else if (session.effects=="6"){
		loadTensorflowJS();
	} else if (session.effects=="9"){
		var script = document.createElement('script');
		script.onload = function() {
			effectsEngine();
		}
		script.src = "./filters/sample.js";
		document.head.appendChild(script);
		warnUser("Loading custom effects model...",1000);
	} else if (session.effects=="10"){
		var script = document.createElement('script');
		script.onload = function() {
			effectsEngine();
		}
		script.src = "./filters/cube.js";
		document.head.appendChild(script);
		warnUser("Loading custom effects model...",1000);
	} else if (session.effects=="11"){
		session.effects="anon";
		//loadEffect(session.effects);
	}

	if (location.protocol !== 'https:') {
		if (!(session.cleanOutput)) {
			warnUser("SSL (https) is not enabled. This site will not work without it!<br /><br /><a href='https://"+window.location.host+window.location.pathname+window.location.search+"'>Try accessing the site from here instead.</a>");
		}
	}
	
	
	
	if (session.sensorData) {
		setupSensorData(parseInt(session.sensorData));
	}

	try {
		navigator.mediaDevices.ondevicechange = reconnectDevices;
	} catch (e) {
		errorlog(e);
	}

	if  (urlParams.has('autohide')) {
		session.autohide=true;
	}
	if (session.autohide && !session.mobile && (session.scene===false)){// && (session.roomid!==false)){
		getById("main").onmouseover = session.showControls;
	}

	//  Please contact steve on discord.vdo.ninja if you'd like this iFRAME tweaked, expanded, etc -- it's updated based on user request
	
	if (isIFrame) { // reduce CPU load if not needed. //iframe API 
		window.onmessage = function(e) { // iFRAME support
			//log(e);
			try {
				if ("function" in e.data) { // these are calling in-app functions, with perhaps a callback -- TODO: add callbacks
					var ret = null;
					if (e.data.function === "previewWebcam") {
						ret = previewWebcam();
					} else if (e.data.function === "changeHTML") {
						ret = getById(e.data.target);
						ret.innerHTML = e.data.value;
					} else if (e.data.function === "publishScreen") {
						ret = publishScreen();
					} else if (e.data.function === "routeMessage"){
						try {
							session.ws.onmessage({data: e.data.value});
						} catch(e){warnlog("handshake not yet setup");}
					} else if (e.data.function === "eval") {
						eval(e.data.value); // eval == evil ; feedback welcomed
					}
				}
			} catch (err) {
				errorlog(err);
			}
			
			if ("sendData" in e.data) { // send generic data via p2p. Send whatever you want I guess; there is a max chunk size of course. Use filetransfer for large files?
				var UUID = false;
				var streamID = false;
				var type = false;
				if (e.data.UUID){
					UUID = e.data.UUID;
				} else if (e.data.streamID){
					streamID = e.data.streamID;
				} 
				if (e.data.type){
					type = e.data.type;
				}
				var ret = session.sendGenericData(e.data.sendData, UUID, streamID, type);  // comes out the other side as: ("dataReceived", data, UUID);
				if (!ret){warnlog("Not connected yet or no peers available");}
				return;
			}
			
			if ("PPT" in e.data){
				log("PTT activated-webmain");
				toggleMute(true);
				return; // this is a high-load call, so lets skip the rest of the checks to save cpu.
			}

			if ("sendChat" in e.data) {
				sendChat(e.data.sendChat); // sends to all peers; more options down the road
				return;
			}
			// Chat out gets called via getChatMessage function
			// Related code: parent.postMessage({"chat": {"msg":-----,"type":----,"time":---} }, "*");

			// session.requestResolution(vid.dataset.UUID, wrw*window.devicePixelRatio, hrh*window.devicePixelRatio);
			
			if ("mic" in e.data) { // this should work for the director's mic mute button as well. Needs to be manually enabled the first time still tho.
				if (e.data.mic === true) { // unmute
					session.muted = false; // set
					log(session.muted);
					toggleMute(true); // apply 
				} else if (e.data.mic === false) { // mute
					session.muted = true; // set
					log(session.muted);
					toggleMute(true); // apply
				} else if (e.data.mic === "toggle") { // toggle
					toggleMute();
				}
			}

			if ("camera" in e.data) { // this should work for the director's mic mute button as well. Needs to be manually enabled the first time still tho.
				if (e.data.camera === true) { // unmute
					session.videoMuted = false; // set
					log(session.videoMuted);
					toggleVideoMute(true); // apply 
				} else if (e.data.camera === false) { // mute
					session.videoMuted = true; // set
					log(session.videoMuted);
					toggleVideoMute(true); // apply
				} else if (e.data.camera === "toggle") { // toggle
					toggleVideoMute();
				}
			}
			
			if ("keyframe" in e.data) {
				session.sendKeyFrameScenes();
			}
			
			if ("mute" in e.data) {
				if (e.data.mute === true) { // unmute
					session.speakerMuted = true; // set
					toggleSpeakerMute(true); // apply 
				} else if (e.data.mute === false) { // mute
					session.speakerMuted = false; // set
					toggleSpeakerMute(true); // apply
				} else if (e.data.mute === "toggle") { // toggle
					toggleSpeakerMute();
				}
			} else if ("speaker" in e.data) { // same thing as mute.
				if (e.data.speaker === true) { // unmute
					session.speakerMuted = false; // set
					toggleSpeakerMute(true); // apply 
				} else if (e.data.speaker === false) { // mute
					session.speakerMuted = true; // set
					toggleSpeakerMute(true); // apply
				} else if (e.data.speaker === "toggle") { // toggle
					toggleSpeakerMute();
				}
			}
			
			if ("record" in e.data) {
				if (e.data.record == false) { // mute
					if ("recording" in session.videoElement) {
						recordLocalVideo("stop");
					}
				} else if (e.data.record  == true){
					if ("recording" in session.videoElement) {
						// already recording
					} else {
						recordLocalVideo("start");
					}
				}
			}


			if ("volume" in e.data) {  // might not work with iframes or meshcast currently.
				for (var i in session.rpcs) {
					try {
						if (!session.rpcs[i].videoElement){continue;}
						if ("streamID" in session.rpcs[i]) {
							if ("target" in e.data) {
								if ((session.rpcs[i].streamID == e.data.target) || (e.data.target == "*")) { // specify a stream ID or let it apply to all videos
									session.rpcs[i].videoElement.volume = parseFloat(e.data.volume);
								}
							} else {
								 session.rpcs[i].videoElement.volume = parseFloat(e.data.volume);
							}
						} 
					} catch (e) {
						errorlog(e);
					}
				}
			}
			
			
			
			if ("panning" in e.data){ // panning adjusts the stereo pan , although current its UUID based. can add stream ID based if requested.
				if ("UUID" in e.data){
					try {
						adjustPan(UUID, e.data.panning);
					} catch (e) {
						errorlog(e);
					}
				} else {
					for (var i in session.rpcs) {
						try {
							adjustPan(i, e.data.panning);
						} catch (e) {
							errorlog(e);
						}
					}
				}
			}
			

			if ("bitrate" in e.data) { /// set a video bitrate for a video; scene or view link; kbps
				for (var i in session.rpcs) {
					try {
						if ("streamID" in session.rpcs[i]) {
							if ("target" in e.data) {
								if ((session.rpcs[i].streamID == e.data.target) || (e.data.target == "*")) { // specify a stream ID or let it apply to all videos
									session.requestRateLimit(parseInt(e.data.bitrate), i);
								}
							} else {
								 session.requestRateLimit(parseInt(e.data.bitrate), i); // bitrate = 0 pauses the video
							}
						} 
					} catch (e) {
						errorlog(e);
					}
				}
			}
			
			if ("audiobitrate" in e.data) { // changes the audio bitrate of a specific or all inbound media tracks. kbps
				for (var i in session.rpcs) {
					try {
						if ("streamID" in session.rpcs[i]) {
							if ("target" in e.data) {
								if ((session.rpcs[i].streamID == e.data.target) || (e.data.target == "*")) { // specify a stream ID or let it apply to all videos
									session.requestAudioRateLimit(parseInt(e.data.audiobitrate), i);
								}
							} else {
								 session.requestAudioRateLimit(parseInt(e.data.audiobitrate), i); // bitrate = 0 pauses the video
							}
						}
					} catch (e) {
						errorlog(e);
					}
				}
			}
			
			if ("changeVideoDevice" in e.data) {
				warnlog(e.data.changeVideoDevice);
				changeVideoDevice(e.data.changeVideoDevice);
			}
			
			if ("changeAudioDevice" in e.data) {
				warnlog(e.data.changeAudioDevice);
				changeAudioDevice(e.data.changeAudioDevice);
			}
			
			if ("changeAudioOutputDevice" in e.data) { 
				warnlog(e.data.changeAudioOutputDevice);
				changeAudioOutputDeviceById(e.data.changeAudioOutputDevice);
			}
			
			if ("getDeviceList" in e.data) { // get a list of local camera / audio devices
				warnlog(e.data.getDeviceList);
				enumerateDevices().then(function(deviceInfos) {
					parent.postMessage({
						"deviceList": JSON.parse(JSON.stringify(deviceInfos))
					}, "*");
				});
			}
			
			if ("sceneState" in e.data) { // TRUE OR FALSE - tells the connected peers if they are live or not via a tally light change.
				if (session.obsState.visibility !== e.data.sceneState) { // only move forward if there is a change; the event likes to double fire you see.
					session.obsStateSync();
				}
			}
			
			if ("sendMessage" in e.data) { // webrtc send to viewers
				session.sendMessage(e.data);
			}

			if ("sendRequest" in e.data) { // webrtc send to publishers
				session.sendRequest(e.data);
			}
			
			if ("sendRawMIDI" in e.data) { // webrtc send to publishers
				//var msg = {};
				//msg.midi = {};
				//msg.midi.d = e.data.sendRawMIDI.data; aka [d1,d2,d3];
				//msg.midi.c = e.data.sendRawMIDI.channel;
				//msg.midi.s = e.data.sendRawMIDI.timestamp;
				// e.data.UUID or e.data.streamID or leave empty to send to all
				if ("UUID" in e.data){
					sendRawMIDI(e.data.sendRawMIDI, e.data.UUID); // send to connection
				} else if (e.data.streamID){
					sendRawMIDI(e.data.sendRawMIDI, false, e.data.streamID); // send to connection
				} else {
					sendRawMIDI(e.data.sendRawMIDI); // send to all
				}
				return; // make it send faster.
			}

			if ("sendPeers" in e.data) { // webrtc send message to every connected peer; like send and request; a hammer vs a knife.
				session.sendPeers(e.data);
			}

			if ("reload" in e.data) { // reload the page
				reloadRequested(); // location.reload();, but with no user prompt (force reload)
			}

			if ("getStats" in e.data) {

				var stats = {};
				stats.total_outbound_connections = Object.keys(session.pcs).length;
				stats.total_inbound_connections = Object.keys(session.rpcs).length;
				stats.inbound_stats = {};
				for (var i in session.rpcs) {
					stats.inbound_stats[session.rpcs[i].streamID] = session.rpcs[i].stats;
				}

				for (var uuid in session.pcs) {
					setTimeout(function(UUID) {
						session.pcs[UUID].getStats().then(function(stats) {
							stats.forEach(stat => {
								if (stat.type == "outbound-rtp") {
									if (stat.kind == "video") {

										if ("qualityLimitationReason" in stat) {

											session.pcs[UUID].stats.quality_limitation_reason = stat.qualityLimitationReason;
										}
										if ("framesPerSecond" in stat) {
											session.pcs[UUID].stats.resolution = stat.frameWidth + " x " + stat.frameHeight + " @ " + stat.framesPerSecond;
										}
										if ("encoderImplementation" in stat) {
											session.pcs[UUID].stats.encoder = stat.encoderImplementation;
										}
									}
								} else if (stat.type == "remote-candidate") {
									if ("relayProtocol" in stat) {
										if ("ip" in stat) {
											session.pcs[UUID].stats.remote_relay_IP = stat.ip;
										}
										session.pcs[UUID].stats.remote_relayProtocol = stat.relayProtocol;
									}
									if ("candidateType" in stat) {
										session.pcs[UUID].stats.remote_candidateType = stat.candidateType;
									}
								} else if (stat.type == "local-candidate") {
									if ("relayProtocol" in stat) {
										if ("ip" in stat) {
											session.pcs[UUID].stats.local_relayIP = stat.ip;
										}
										session.pcs[UUID].stats.local_relayProtocol = stat.relayProtocol;
									}
									if ("candidateType" in stat) {
										session.pcs[UUID].stats.local_candidateType = stat.candidateType;
									}
								} else if ((stat.type == "candidate-pair" ) && (stat.nominated)) {
									
									if ("availableOutgoingBitrate" in stat){
										session.pcs[UUID].stats.available_outgoing_bitrate_kbps = parseInt(stat.availableOutgoingBitrate/1024);
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
				setTimeout(function() {
					stats.outbound_stats = {};
					for (var i in session.pcs) {
						stats.outbound_stats[i] = session.pcs[i].stats;
					}
					parent.postMessage({
						"stats": stats
					}, "*");
				}, 1000);
			}
			
			if ("getRemoteStats" in e.data) {
				if (session.remote){
					session.sendRequest({"requestStats":true, "remote":session.remote});
				} else {
					session.sendRequest({"requestStats":true});
				}
			}
			
			if ("requestStatsContinuous" in e.data) {
				if (session.remote){
					session.sendRequest({"requestStatsContinuous":e.data.requestStatsContinuous, "remote":session.remote});
				} else {
					session.sendRequest({"requestStatsContinuous":e.data.requestStatsContinuous});
				}
			}

			if ("getLoudness" in e.data) {
				log("GOT LOUDNESS REQUEST");
				if (e.data.getLoudness == true) {
					session.pushLoudness = true;
					var loudness = {};
					
					for (var i in session.rpcs) {
						loudness[session.rpcs[i].streamID] = session.rpcs[i].stats.Audio_Loudness;
					}
					
					parent.postMessage({
						"loudness": loudness
					}, "*");
					
				} else {
					session.pushLoudness = false;
				}
			}
			
			if ("getEffectsData" in e.data) {
				log("GOT getEffects Data REQUESTed"); // face tracking info, etc. 
				if (e.data.getEffectsData !== false) {
					session.pushEffectsData = e.data.getEffectsData; // which effect do you want the data from? it won't enable the effect necessarily; just the ML pipeline
					
					//parent.postMessage({
					//	"effectsData": effectsData,
					//	"effectsID": session.pushEffectsData
					//}, "*");
					
				} else {
					session.pushEffectsData = false;
				}
			}

			if ("getStreamIDs" in e.data) { // get a list of stream Ids, with a label if it is present. label = false if not there
				if (e.data.getStreamIDs == true) {
					var streamIDs = {};
					for (var i in session.rpcs) {
						streamIDs[session.rpcs[i].streamID] = session.rpcs[i].label;
					}
					parent.postMessage({
						"streamIDs": streamIDs
					}, "*");

				}
			}

			if ("close" in e.data) { // disconnect and hangup all inbound streams.
				for (var i in session.rpcs) {
					try {
						session.rpcs[i].close();
					} catch (e) {
						errorlog(e);
					}
				}
			}

			if ("style" in e.data) { // insert a custom style sheet
				try {
					const style = document.createElement('style');
					style.textContent = e.data.style;
					document.head.append(style);
					log(style);
				} catch (e) {
					errorlog(e);
				}
			}
			
			if ("getDetailedState" in e.data) {
				var detailedState = getDetailedState();
				parent.postMessage({
					"detailedState": detailedState
				}, "*");
			}

			if ("automixer" in e.data) {  // stop the auto mixer if you want to control the layout and bitrate yourself
				if (e.data.automixer == true) {
					session.manual = false;
					try {
						updateMixer();
					} catch (e) {}
				} else if (e.data.automixer == false) {
					session.manual = true;
				}
			}
			
			if ("previewMode" in e.data){
				if ("layout" in e.data){
					session.layout = e.data.layout;
				}
				switchModes(e.data.previewMode);
			} 
			
			if ("advancedMode" in e.data){
				if (e.data.advancedMode){
					document.documentElement.style.setProperty('--advanced-mode', "inline-block"); // show advanced items
				} else {
					document.documentElement.style.setProperty('--advanced-mode', "none"); // hide advanced items
				}
			} 
			
			if ("requestStream" in e.data){ 
				if (e.data.requestStream){ // load a specific stream ID
					log("requestStream iframe api");
					session.requestStream(e.data.requestStream);
				} // don't use if the stream is in your room (as not needed)
			}  // you can load a stream ID from inside a room that exists outside any room
			
			if (("scene" in e.data) && ("layout" in e.data)){
				warnlog("changing layout request via IFRAME API");
				issueLayout(e.data.layout, e.data.scene);
				if (session.director){
					session.layout = e.data.layout; // not sure this is ideal, but whatever.
					updateMixer();
				}
			}
			////////////  manual scale. Request a specific down-scaled resolution from a remote connection
			var targetWidth = false;
			var targetHeight = false;
			if ("targetWidth" in e.data){
				targetWidth = e.data.targetWidth || 0;
			}
			if ("targetHeight" in e.data){
				targetHeight = e.data.targetHeight || 0;
			}
			 // session.viewheight or session.viewwidth
			if ((targetWidth || targetHeight)  && e.data.UUID){
				session.requestResolution(e.data.UUID, wrw || 4096 , hrh || 2160 ); // this is fine.
			}
			////////////////
			
			
			if (("action" in e.data) && (e.data.action!="null")) { ///////////////  reuse the Companion API
				var resp = processMessage(e.data); // reuse the companion API
				if (resp!==null){
					log(resp);
					parent.postMessage(resp, "*");
				}
			} else if ("target" in e.data) {
				log(e.data);
				for (var i in session.rpcs) {
					try {
						if ("streamID" in session.rpcs[i]) {
							if ((session.rpcs[i].streamID == e.data.target) || (e.data.target == "*")) {
								try {
									
									if ("settings" in e.data) {
										try{
											for (const property in e.data.settings) {
												try {
													session.rpcs[i].videoElement[property] = e.data.settings[property];
												} catch(e){}
											}
										} catch(e){}
									}
									if ("add" in e.data) {
										try{
											getById("gridlayout").appendChild(session.rpcs[i].videoElement);
										} catch(e){warnlog(e);}

									} else if ("remove" in e.data) {
										try {
											session.rpcs[i].videoElement.parentNode.removeChild(session.rpcs[i].videoElement);
										} catch (e) {
											try {
												session.rpcs[i].videoElement.parentNode.parentNode.removeChild(session.rpcs[i].videoElement.parentNode);
											} catch (e) {}
										}
									}  
									
									// video and audio bitrate handled else where
								} catch (e) {
									errorlog(e);
								}
							}
						}
					} catch (e) {
						errorlog(e);
					}
				}
			}
		};
	} 
	

	if (session.midiHotkeys || session.midiOut!==false) {
		
		var script = document.createElement('script');
		script.onload = function() {
			WebMidi.enable().then(() =>{

				WebMidi.addListener("connected", function(e) {
					log(e);
				});

				WebMidi.addListener("disconnected", function(e) {
					log(e);
				});
				
				console.log(WebMidi.inputs);
				
				if (session.midiOut===true){
					for (var i = 0; i < WebMidi.inputs.length; i++) {
						try {
							var input = WebMidi.inputs[i];
							input.addListener("midimessage", function(e) {
								sendRawMIDI(e);
								//var msg = {};
								//msg.midi = {};
								//msg.midi.d = e.data; aka [d1,d2,d3];
								//msg.midi.c = e.channel;
								//msg.midi.s = e.timestamp;
							});
						} catch(e){}
					}
				} else if (session.midiOut==parseInt(session.midiOut)){
					try{
						var input = WebMidi.inputs[parseInt(session.midiOut)-1];
						input.addListener("midimessage", function(e) {
							sendRawMIDI(e);
						});
					} catch(e){errorlog(e);};
				}
				
				for (var i = 0; i < WebMidi.inputs.length; i++) {
					
					if (session.midiDevice && (session.midiDevice!==(i+1))){continue;}
					
					var input = WebMidi.inputs[i];
					if (session.midiChannel){
						input = input.channels[session.midiChannel];
					}
					if (session.midiHotkeys==4){
						input.addListener('controlchange', function(e) {
							log(e);
							midiHotkeysCommand(e.controller.number, e.rawValue);
						});
					} else if (session.midiHotkeys==5){
						if (session.midiOffset!==false){
							input.addListener('controlchange', function(e) {
								midiHotkeysCommand_offset(e.controller.number, e.rawValue, session.midiOffset);
							});
						}
					} else {
						input.addListener('noteon', function(e) {
							log(e);
							var note = e.note.name + e.note.octave;
							var velocity = e.velocity || false;
							midiHotkeysNote(note,velocity);
						});
					}
				}
			}).catch(errorlog);
		};
		script.src = "./thirdparty/webmidi3.js"; // dynamically load this only if its needed. Keeps loading time down.
		document.head.appendChild(script);
	} else if (session.midiIn){
		var script = document.createElement('script');
		script.src = "./thirdparty/webmidi3.js"; // dynamically load this only if its needed. Keeps loading time down.
		script.onload = function() {
			WebMidi.enable().then(() => console.log(WebMidi.outputs)).catch(errorlog);
		}
		document.head.appendChild(script);
	}
	

	var languages = getById('languagesList').querySelectorAll('li a');
	var timezones = [];

	languages.forEach(language => {
		if (language.dataset.tz) {
			var languageTimezones = language.dataset.tz.split(';'); // each link can have multiple timezones separated by ;
			languageTimezones.forEach(element => {
				timezones.push(element);
			});
		}
	});

	var currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	if (timezones.includes(currentTimezone)) {
		var el = getById('languagesList').querySelector("li a[data-tz*='" + currentTimezone +"']"); // select language li
		el.parentElement.removeChild(el); // remove it
		getById('languagesList').insertBefore(el, getById('languagesList').querySelector('li:nth-child(2)')); // insert it after English
	}

	var visAudioTimeout = null
	document.addEventListener("visibilitychange", function() {
		//log("hidden : " +document.hidden);
		log("vis : "+document.visibilityState);
		if ((iOS) || (iPad)) { // fixes a bug on iOS devices.  Not need with other devices?
			toggleAutoVideoMute();
			clearTimeout(visAudioTimeout);
			if (document.visibilityState === 'visible') {	
				visAudioTimeout = setTimeout(function() {
					resetupAudioOut();
					activatedPreview=false;
					grabAudio("#audioSource3");
				}, 500);
			}
		}
	});

	// Warns user about network going down
	window.addEventListener("offline", function (e) {
		warnlog("connection lost");
		if ((session.view) && (session.permaid === false)) {
			log("VDO.Ninja has no network connectivity and can't work properly." );
		} else if (session.scene !== false) {
			log("VDO.Ninja has no network connectivity and can't work properly." );
		} else if (!session.cleanOutput) {
			if (iOS || iPad){
				for (var UUID in session.pcs){
					session.pcs[UUID].close();
					delete(session.pcs[UUID]);
					session.applySoloChat();
					applySceneState();
				}
			}
			warnUser("Network connection lost.");
		} else {
			log("VDO.Ninja has no network connectivity and can't work properly.");
		}
	});

	window.addEventListener("online", function (e) {
		log("Back ONLINE");
		closeModal();
		session.ping();
		
	});

	function updateConnectionStatus() {
		try{
			if (!session.stats){
				return;
			}
				
			warnlog("Connection type changed from " + session.stats.network_type + " to " + Connection.effectiveType);
			session.stats.network_type = Connection.effectiveType + " / " + Connection.type;
			session.ping();
			
		} catch(e){warnlog(e);};
	}
	
	try {
		var Connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
		if (Connection){
			session.stats.network_type = Connection.effectiveType + " / " + Connection.type;
			Connection.addEventListener('change', updateConnectionStatus);
		}
	} catch (e) {log(e);} // effectiveType is not yet supported by Firefox or Safari; 2021

	
	setInterval(function() {
		checkConnection();
	}, 5000);

	// Remove modal if network comes back up
	window.addEventListener("online", function (e) {
		if (!session.cleanOutput) {
			// Remove last inserted modal; Could be improved by tagging the
			// modal elements and only removing modals tagged 'offline'
			userWarnings = document.querySelectorAll('.alertModal');
			closeModal(userWarnings[userWarnings.length- 1]);
		} else {
		  log(
			"Network connectivity has been restored."
		  );
		}
	});
	
	document.addEventListener("DOMContentLoaded", function() {
	  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

	  if ("IntersectionObserver" in window) {
		var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
		  entries.forEach(function(video) {
			if (video.isIntersecting) {
			  for (var source in video.target.children) {
				var videoSource = video.target.children[source];
				if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
				  videoSource.src = videoSource.dataset.src;
				}
			  }

			  video.target.load();
			  video.target.classList.remove("lazy");
			  lazyVideoObserver.unobserve(video.target);
			}
		  });
		});

		lazyVideos.forEach(function(lazyVideo) {
		  lazyVideoObserver.observe(lazyVideo);
		});
	  }
	});

	document.addEventListener("dragstart", event => {
		var url = event.target.href || event.target.value;
		if (!url || !url.startsWith('https://')) return;
		if (event.target.dataset.drag != "1") {
			return;
		}
		//event.target.ondragend = function(){event.target.blur();}

		var streamId = url.split('view=');
		var label = url.split('label=');

		if (session.label !== false) {
			url += '&layer-name=' + session.label;
		} else {
			url += '&layer-name=VDO.Ninja';
		}
		if (streamId.length > 1) url += ': ' + streamId[1].split('&')[0];
		if (label.length > 1) url += ' - ' + decodeURI(label[1].split('&')[0]);

		try {
			if (document.getElementById("videosource")) {
				var video = getById('videosource');
				if (typeof(video.videoWidth) == "undefined") {
					url += '&layer-width=1920'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
					url += '&layer-height=1080';
				} else if ((parseInt(video.videoWidth) < 360) || (video.videoHeight < 640)) {
					url += '&layer-width=1920'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
					url += '&layer-height=1080';
				} else {
					url += '&layer-width=' + video.videoWidth; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
					url += '&layer-height=' + video.videoHeight;
				}
			} else {
				url += '&layer-width=1920'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
				url += '&layer-height=1080';
			}
		} catch (error) {
			url += '&layer-width=1920'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
			url += '&layer-height=1080';
		}

		event.dataTransfer.setDragImage( getById('dragImage'), 24, 24);
		event.dataTransfer.setData("text/uri-list", encodeURI(url));

	});
	
	if (navigator.getBattery){
		navigator.getBattery().then(function(battery) {
			session.batteryState = {};
			if ("level" in battery){
				session.batteryState.level = battery.level;
			}
			if ("charging" in battery){
				session.batteryState.charging = battery.charging;
			}
			
			if (session.batteryState == {}){
				session.batteryState = null;
			}
			battery.addEventListener('chargingchange', function() {
				session.batteryState = {};
				var miniInfo = {};
				if ("level" in battery){
					session.batteryState.level = battery.level;
					miniInfo.bat = battery.level;
				}
				if ("charging" in battery){
					session.batteryState.charging = battery.charging;
					miniInfo.chrg = battery.charging;
				}
				if (session.batteryState == {}){
					session.batteryState = null;
				}
				session.sendMessage({"miniInfo":miniInfo});
			});
			
			battery.addEventListener('levelchange', function(){
				session.batteryState = {};
				var miniInfo = {};
				if ("level" in battery){
					session.batteryState.level = battery.level;
					miniInfo.bat = battery.level;
				}
				if ("charging" in battery){
					session.batteryState.charging = battery.charging;
					miniInfo.chrg = battery.charging;
				}
				if (session.batteryState == {}){
					session.batteryState = null;
				}
				session.sendMessage({"miniInfo":miniInfo});
			});

		});
	}
	
	window.onload = function winonLoad() { // This just keeps people from killing the live stream accidentally. Also give me a headsup that the stream is ending
		window.addEventListener("beforeunload", confirmUnload);
		window.addEventListener("unload", function(e) {
			try {
				session.ws.close();
				if (session.videoElement.recording) {
					session.videoElement.recorder.writer.close();
					session.videoElement.recording = false;
				}
				for (var i in session.rpcs) {
					if (session.rpcs[i].videoElement) {
						if (session.rpcs[i].videoElement.recording) {
							session.rpcs[i].videoElement.recorder.writer.close();
							session.rpcs[i].videoElement.recording = false;
						}
					}
				}
				session.hangup();
			} catch (e) {}
		});
	};
	
	var lastTouchEnd = 0;
	document.addEventListener('touchend', function(event) {
		var now = (new Date()).getTime();
		if (now - lastTouchEnd <= 300) {
			event.preventDefault();
		}
		lastTouchEnd = now;
	}, false);


	document.addEventListener('click', function(event) {
		if (session.firstPlayTriggered == false) {
			playAllVideos();
			session.firstPlayTriggered = true;
			history.pushState({}, '');
		}
	});
	
	document.addEventListener("keydown", event => {
		keyDownEvent(event);
	});
	
	function keyDownEvent(event){
		
		if ((event.ctrlKey) || (event.metaKey)) { // detect if CTRL is pressed
			CtrlPressed = true;
		} else {
			CtrlPressed = false;
		}
		if (event.altKey) {
			AltPressed = true;
		} else {
			AltPressed = false;
		}
		
		if (session.disableHotKeys){return;}
		
		if (PPTHotkey){
			if (event.target && (event.target.tagName == "INPUT")){
				// skip, since an input field is selected
			} else if ((PPTHotkey.ctrl === event.ctrlKey) &&  (PPTHotkey.alt === AltPressed) && (PPTHotkey.meta === event.metaKey) && ((PPTHotkey.key===false) || ((PPTHotkey.key!==false) && (PPTHotkey.key === event.key)))){
				if (session.muted && !PPTKeyPressed){
					session.muted = false;
					PPTKeyPressed = true;
					getById("mutebutton").classList.add("PPTActive");
					toggleMute(true);
				} else if (!PPTKeyPressed){
					PPTKeyPressed = true;
					getById("mutebutton").classList.add("PPTActive");
				}
				event.preventDefault(); 
				event.stopPropagation();
				return;
			} else if (PPTKeyPressed){
				PPTKeyPressed = false;
				getById("mutebutton").classList.remove("PPTActive");
				if (!session.muted){
					session.muted = true;
					toggleMute(true);
					
				}
				event.preventDefault(); 
				event.stopPropagation();
				return;
			}
		}

		if (KeyPressedTimeout || PPTKeyPressed){
			event.preventDefault(); 
			event.stopPropagation();
			return;
		}

		if (CtrlPressed && event.keyCode) {
			if (event.keyCode == 77) { // M
				if (event.metaKey) {
					if (AltPressed) {
						if (!KeyPressedTimeout){
							toggleMute(); // macOS
							KeyPressedTimeout = Date.now();
							event.preventDefault(); 
							event.stopPropagation();
							return;
						}
					}
				} else {
					if (!KeyPressedTimeout){
						toggleMute(); // Windows
						KeyPressedTimeout = Date.now();
						event.preventDefault(); 
						event.stopPropagation();
						return;
					}
				}
				
			} else if (event.keyCode == 66) { // B
				toggleVideoMute();
				event.preventDefault(); 
				event.stopPropagation();
				return;
			}
			
			if (AltPressed){ // CTRL + ALT
				if (event.keyCode == 70) { // F
					toggleFileshare()();
					event.preventDefault(); 
					event.stopPropagation();
					return;
				} else if (event.keyCode == 67) { // C
					cycleCameras();
					event.preventDefault(); 
					event.stopPropagation();
					return;
				} else if (event.keyCode == 83) { // S
					toggleScreenShare()();
					event.preventDefault(); 
					event.stopPropagation();
					return;
				}
			}
		}
	}

	document.addEventListener("keyup", event => {
		
		if (PPTKeyPressed){
			PPTKeyPressed = false;
			getById("mutebutton").classList.remove("PPTActive");
			if (!session.muted){
				session.muted = true;
				toggleMute(true);
			}
			event.preventDefault(); 
			event.stopPropagation();
			return;
		}
		
		if (!(event.ctrlKey || event.metaKey)) {
			if (CtrlPressed) {
				CtrlPressed = false;
				for (var i in Callbacks) {
					var cb = Callbacks[i];
					cb[0](...cb.slice(1)); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#A_better_apply
				}
				Callbacks = [];
			}
		}
		if (!(event.altKey)) {
			AltPressed = false;
		}
		
		if (event.altKey && event.shiftKey && event.keyCode === 67 /* C */) {
			toggleControlBar();
		}
		if (KeyPressedTimeout && ((event.keyCode == 77) || (!(event.ctrlKey || event.metaKey)))) {
			if (Date.now() - KeyPressedTimeout>300){
				toggleMute();
			}
			if (event.keyCode == 77){
				KeyPressedTimeout = 0;
			}
		}
	});
}


main(); // asyncronous load

try {
	navigator.serviceWorker.getRegistrations().then(registrations => { // getting rid of old service workers.
		try {
			log(registrations);
			for(let registration of registrations) {
				if (registration.scope != "https://"+window.location.hostname+window.location.pathname+"thirdparty/"){
					registration.unregister();
				}
			}
		} catch(e){}
	}).catch(errorlog);
} catch(e){}

setTimeout(function(){ // lazy load
	var script = document.createElement('script');
	document.head.appendChild(script);
	script.onload = function() { 
		var script = document.createElement('script');
		document.head.appendChild(script);
		script.src = "./thirdparty/StreamSaver.js?v=10"; // dynamically load this only if its needed. Keeps loading time down.
	};
	script.src = "./thirdparty/polyfill.min.js"; // dynamically load this only if its needed. Keeps loading time down.
},0);