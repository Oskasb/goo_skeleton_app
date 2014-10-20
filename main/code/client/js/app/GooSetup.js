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
		this.loadedEntities = {};
		this.callbackIndex = {};
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




	GooSetup.prototype.handleBundleUpdated = function(entityName) {
		console.log("BundleData updated", entityName, this.loadedEntities);

		if (!this.callbackIndex[entityName]) {
			this.callbackIndex[entityName] = [];
		}

		var buildCallback = function(entity) {
			console.log("We built this entity: ", entity);
			entity.addToWorld();

		};

		this.callbackIndex[entityName].push(buildCallback);

		for (var i = 0; i < this.callbackIndex[entityName].length; i++) {
			this.callbackIndex[entityName][i](this.loadedEntities[entityName].build())
		}
	};




	GooSetup.prototype.setupUpdateData = function(path, bundleMasterUrl, downloadOk, fail) {

		var assetUpdated = function(entityName, data) {
			this.loadedEntities[entityName] = data;
			this.handleBundleUpdated(entityName);
			downloadOk(entityName, data);
		}.bind(this);
		PipelineAPI.initBundleDownload(path, this.goo, bundleMasterUrl, assetUpdated, fail);
	};


	GooSetup.prototype.runGooPipeline = function(path, bundleMasterUrl) {
		var bundlesReady = function(sourceKey, res) {
			console.log("Bundle update OK", sourceKey, res);
		};

		var bundleFail = function(err) {
			console.error("Bundle update FAIL:", err);
		};

		var bundles = function() {
			this.setupUpdateData(path, bundleMasterUrl, bundlesReady, bundleFail);
		}.bind(this);

		setTimeout(function(){
			bundles()
		}, 100)

	};

	GooSetup.prototype.initBundleData = function(resourcePath, masterUrl) {
		this.runGooPipeline(resourcePath, masterUrl);
	};


	return GooSetup;

});