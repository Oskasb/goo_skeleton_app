"use strict";


define([
	'goo/entities/SystemBus',
	'app/camera/SimpleCam',
	'app/measure/PerfMon',
	'app/ui/CustomUiCallbacks',
	'gui/CanvasGuiAPI'
],
	function(
		SystemBus,
		SimpleCam,
		PerfMon,
		CustomUiCallbacks,
		CanvasGuiAPI
		) {

		var resourcePath = '';
		var guiMasterUrl = 'configs/config_urls.json';
		var bundleMasterUrl = 'configs/bundles/bundle_list.json';

		var Client = function() {
			this.canvasGuiAPI = new CanvasGuiAPI(1024);
		};

		Client.prototype.initiateClient = function(gooSetup) {
			this.now = new Date().getTime();
			this.gooSetup = gooSetup;
			this.gooSetup.setupGooRunner();
			this.cam = new SimpleCam(this.gooSetup.goo);
			this.perfMom = new PerfMon(this.gooSetup.goo, this.canvasGuiAPI);
			this.camera = this.cam.camera;
			this.camera.entity = this.cam.cameraEntity;
			this.preload();
		};

		Client.prototype.preload = function() {
			this.gooSetup.startRenderLoop();

			var guiReady = function() {
				console.error("Gui init OK");
				this.loadingCompleted();
				this.canvasGuiAPI.setUiToStateId('debug_state');

			}.bind(this);

			var guiInitFail = function(err) {
				console.error("Gui failed:", err);
			};

			var triggerGuiProcess = function(params) {
				console.log("Gui callback", params)
			};

			this.canvasGuiAPI.initCanvasGui(guiMasterUrl, this.camera, CustomUiCallbacks.getCallbackMap(), guiReady, guiInitFail);

			this.gooSetup.initBundleData(resourcePath, bundleMasterUrl);


		};

		var frames = 0;
		Client.prototype.tickClient = function(tpf) {
			frames+=1;
			SystemBus.emit("message_to_gui", {channel:'hint_channel', message:'Tick:'+ frames});

			this.now += tpf;
			this.perfMom.updateMonitorFrame(tpf);
			this.canvasGuiAPI.updateCanvasGui(tpf)
		};

		Client.prototype.loadingCompleted = function() {

			var handleGooTick = function(tpf) {
				this.tickClient(tpf)
			}.bind(this);

			this.gooSetup.registerGooUpdateCallback(handleGooTick);
		//	this.addCanvasGui(this.camera);
		};

		return Client;

	});