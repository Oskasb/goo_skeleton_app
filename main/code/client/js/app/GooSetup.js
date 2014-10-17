"use strict"



define([
	'goo/entities/GooRunner',
	'goo/animationpack/systems/AnimationSystem',
	'data_pipeline/PipelineAPI'
], function(
	GooRunner,
	AnimationSystem,
	PipelineAPI
	) {

	var GooSetup = function() {

	};

	GooSetup.prototype.setupGooRunner = function() {
		this.goo = new GooRunner({
			showStats:false,
			debug:false,
			manuallyStartGameLoop:true,
			tpfSmoothingCount:1,
			useTryCatch:false
		});
		this.goo.renderer.setClearColor(0, 0.1, 0.2, 1.0);
		this.goo.world.add(new AnimationSystem());

		this.goo.renderer.domElement.id = 'goo';
		document.body.appendChild(this.goo.renderer.domElement);
		this.goo.renderer.domElement.oncontextmenu = function() { return false; };
		console.log("Goo: ", this.goo)
	};

	GooSetup.prototype.startRenderLoop = function() {
		this.goo.startGameLoop();
	};

	GooSetup.prototype.registerGooUpdateCallback = function(callback) {
		this.goo.callbacksPreRender.push(callback);
		//	this.updateCallbacks.push(callback);
	};



	GooSetup.prototype.bundleUpdated = function(srcKey, loaderData) {
		console.log("Bundle Updated: ", srcKey, loaderData)

	};

	GooSetup.prototype.initBundleData = function(srcUrl, downloadOk, fail) {


		var assetUpdated = function(srcKey, data) {
			downloadOk(srcKey, data);
			console.log("Asset Updated: ", srcKey, data);
		};

		PipelineAPI.initBundleDownload(this.goo, srcUrl, assetUpdated, fail);
	};


	return GooSetup;

});