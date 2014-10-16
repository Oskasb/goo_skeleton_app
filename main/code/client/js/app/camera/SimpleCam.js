
"use strict";

define([
	'goo/renderer/Camera',
	'goo/entities/components/CameraComponent',
	'goo/entities/components/ScriptComponent',
	'goo/scripts/OrbitCamControlScript',
	'goo/scripts/Scripts',
	'goo/scriptpack/ScriptRegister',
	'goo/math/Vector3'
],
	function(
		Camera,
		CameraComponent,
		ScriptComponent,
		OrbitCamControlScript,
		Scripts,
		ScriptRegister,
		Vector3

		) {

		var SimpleCam = function(goo) {
			// Add camera
			this.camera = new Camera(45, 1, 1, 1000);
			this.cameraEntity = goo.world.createEntity("CameraEntity");
			this.cameraEntity.transformComponent.transform.translation.set(0, 0, 20);
			this.cameraEntity.transformComponent.transform.lookAt(new Vector3(0, 0, 0), Vector3.UNIT_Z);
			this.cameraEntity.setComponent(new CameraComponent(this.camera));
			this.cameraEntity.addToWorld();

			// Camera control set up
			var scripts = new ScriptComponent();
			scripts.scripts.push(Scripts.create('WASD', {
				domElement : goo.renderer.domElement,
				walkSpeed : 25.0,
				crawlSpeed : 10.0
			}));
			scripts.scripts.push(Scripts.create('MouseLookScript', {
				domElement : goo.renderer.domElement
			}));
			//    scripts.scripts.push(worldFittedTerrainScript);
			this.cameraEntity.setComponent(scripts);
		};




		return SimpleCam;

	});