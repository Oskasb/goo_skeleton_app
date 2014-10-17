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

	GooSetup.prototype.registerBundleList = function(bundles) {
		var fail = function(err) {
			console.error("Failed to load bundle: ", err);
		};

		for (var i = 0; i < bundles.length; i++) {

			var success = function(srcKey, loaderData) {
				this.bundleUpdated(srcKey, loaderData);
			}.bind(this);

			PipelineAPI.subscribeToGooBundle(this.goo, bundles[i].id, bundles[i].folder, bundles[i].file, success, fail)
		}

	};

	GooSetup.prototype.bundleMasterUpdated = function(srcKey, data, success, fail) {
		console.log("Bundle Master Update: ", srcKey, data);
		for (var i = 0; i < data.length; i++) {
			this.registerBundleList(data[i].bundle_index.bundles);
		}
	};


	GooSetup.prototype.initBundleData = function(srcUrl, success, fail) {
		var bundleMasterUpdated = function(srcKey, data) {
			this.bundleMasterUpdated(srcKey, data, success, fail);
		}.bind(this);
		PipelineAPI.subscribeToConfigUrl(srcUrl, bundleMasterUpdated, fail);
	};


	return GooSetup;

});