"use strict";

define([
	'goo/entities/SystemBus',
	'goo/renderer/Camera',
	'goo/entities/components/CameraComponent',
	'goo/entities/components/ScriptComponent',
	'goo/scripts/Scripts',
	'app/camera/FlyControlScript'
//	'goo/scriptpack/WASDControlScript',


],
	function(
		SystemBus,
		Camera,
		CameraComponent,
		ScriptComponent,
		Scripts,
		FlyControlScript
		//      WASDControlScript,
		) {

		//   var Scripts;
		/*
		 require(['goo/scripts/Scripts'], function(Sc) {
		 Scripts = Sc;
		 console.log("Scripts", Sc);
		 });
		 */
		var TerrainCamera = function(goo, terrainApi) {

			var flyCamScript = new FlyControlScript({
				terrainApi:terrainApi,
				domElement: goo.renderer.domElement,
				walkSpeed: 10,
				crawlSpeed: 100,
				button: 'Right',
				turnSpeedHorizontal: 0.02,
				turnSpeedVertical: 0.01
			});

			console.log("Scripts: ", flyCamScript, Scripts)

			console.log("flyCamScript: ", flyCamScript)

			this.goo = goo;
			this.editCamera = new Camera(45, 1, 0.1, 100000);
			this.editCameraEntity = goo.world.createEntity("EditCameraEntity");
			this.editCameraEntity.setComponent(new CameraComponent(this.editCamera));

			var editCamScripts = new ScriptComponent();


			editCamScripts.scripts.push(flyCamScript);


			this.editCameraEntity.setComponent(editCamScripts);
			this.editCameraEntity.addToWorld();
		};

		TerrainCamera.prototype.setCameraAsMain = function() {
			SystemBus.emit('goo.setCurrentCamera', {
				camera: this.editCamera,
				entity: this.editCameraEntity
			});
		};

		TerrainCamera.prototype.getActiveCameraEntity = function() {
			return this.editCameraEntity;
		};

		TerrainCamera.prototype.attachSky = function(sky) {
			var camEntity = this.editCameraEntity;

		};

		TerrainCamera.prototype.setPosXYZ = function(x, y, z) {
			this.editCameraEntity.transformComponent.transform.translation.set(x, y, z);
			this.editCameraEntity.transformComponent.setUpdated();
		};

		return TerrainCamera;
	});
