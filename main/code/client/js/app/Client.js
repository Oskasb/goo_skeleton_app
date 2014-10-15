"use strict";


define([
	'app/camera/TerrainCamera',
	'gui/CanvasGuiAPI'
],
	function(
		TerrainCamera,
		CanvasGuiAPI
		) {

		var guiMasterUrl = 'configs/config_urls.json';

		var Client = function() {
			this.canvasGuiAPI = new CanvasGuiAPI(1024);
		};

		Client.prototype.initiateClient = function(gooSetup) {
			this.now = new Date().getTime();
			this.gooSetup = gooSetup;
			this.gooSetup.setupGooRunner();
			this.camera = new TerrainCamera(this.gooSetup.goo, null);
			this.preload();
		};

		Client.prototype.preload = function() {
			this.gooSetup.startRenderLoop();

			var guiReady = function() {
				console.error("Gui init OK");
				this.loadingCompleted();
			}.bind(this);

			var guiInitFail = function(err) {
				console.error("Gui failed:", err);
			};

			this.canvasGuiAPI.initCanvasGui(guiMasterUrl, this.camera, {}, guiReady, guiInitFail);
		};

		Client.prototype.tickClient = function(tpf) {
			this.now += tpf;

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