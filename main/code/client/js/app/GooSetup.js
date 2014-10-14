"use strict"



define([
	'goo/entities/GooRunner',
	'goo/animationpack/systems/AnimationSystem'
], function(
	GooRunner,
	AnimationSystem
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


	return GooSetup;

});