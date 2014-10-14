"use strict";


define([
	"app/camera/TerrainCamera"
],
	function(
		TerrainCamera
		) {

		var Client = function() {

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
			this.loadingCompleted();
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