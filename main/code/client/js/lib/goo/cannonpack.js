/* Goo Engine cannonpack 
 * Copyright 2014 Goo Technologies AB
 */
(function(window){function f(){
define("goo/addons/cannonpack/CannonBoxColliderComponent",["goo/entities/components/Component","goo/shapes/Box","goo/math/Vector3"],function(e,t,n){function r(e){this.type="CannonBoxColliderComponent",e=e||{};var t=this.halfExtents=e.halfExtents||new n(.5,.5,.5);this.cannonShape=new CANNON.Box(new CANNON.Vec3(t.x,t.y,t.z)),this.isTrigger=typeof e.isTrigger!="undefined"?e.isTrigger:!1}return r.prototype=Object.create(e.prototype),r.constructor=r,r}),define("goo/addons/cannonpack/CannonCylinderColliderComponent",["goo/entities/components/Component"],function(e){function t(e){e=e||{},this.type="CannonCylinderColliderComponent";var t=typeof e.radiusTop=="number"?e.radiusTop:.5,n=typeof e.radiusBottom=="number"?e.radiusBottom:.5,r=typeof e.height=="number"?e.height:1,i=typeof e.numSegments=="number"?e.numSegments:10;this.cannonShape=new CANNON.Cylinder(t,n,r,i)}return t.prototype=Object.create(e.prototype),t.constructor=t,t}),define("goo/addons/cannonpack/CannonDistanceJointComponent",["goo/entities/components/Component","goo/util/ObjectUtil"],function(e,t){function n(e){e=e||{},this.type="CannonDistanceJointComponent",t.defaults(e,{distance:1,connectedBody:null}),this.distance=e.distance,this.connectedBody=e.connectedBody,this.cannonConstraint=null}return n.prototype=Object.create(e.prototype),n.constructor=n,n.prototype.createConstraint=function(e){var t=e.cannonRigidbodyComponent.body,n=this.connectedBody.body;return this.cannonConstraint=new CANNON.DistanceConstraint(t,n,this.distance),this.cannonConstraint},n}),define("goo/addons/cannonpack/CannonPlaneColliderComponent",["goo/entities/components/Component"],function(e){function t(e){this.type="CannonPlaneColliderComponent",e=e||{},this.cannonShape=new CANNON.Plane}return t.prototype=Object.create(e.prototype),t.constructor=t,t}),define("goo/addons/cannonpack/CannonTerrainColliderComponent",["goo/entities/components/Component"],function(e){function t(e){this.type="CannonTerrainColliderComponent",e=e||{data:[],shapeOptions:{}},this.cannonShape=new CANNON.Heightfield(e.data,e.shapeOptions)}return t.prototype=Object.create(e.prototype),t.constructor=t,t}),define("goo/addons/cannonpack/CannonRigidbodyComponent",["goo/entities/components/Component","goo/math/Quaternion","goo/math/Vector3","goo/math/Transform","goo/shapes/Box","goo/shapes/Sphere","goo/shapes/Quad","goo/util/ObjectUtil"],function(e,t,n,r,i,s,o,u){function a(e){e=e||{},this.type="CannonRigidbodyComponent",u.defaults(e,{mass:1,velocity:new n}),this.mass=e.mass,this._initialPosition=null,this._initialVelocity=new n,this._initialVelocity.setv(e.velocity),this.body=null,this.centerOfMassOffset=new n}a.prototype=Object.create(e.prototype),a.constructor=a,a.prototype.api={setForce:function(e){a.prototype.setForce.call(this.cannonRigidbodyComponent,e)},setVelocity:function(e){a.prototype.setVelocity.call(this.cannonRigidbodyComponent,e)},setPosition:function(e){a.prototype.setPosition.call(this.cannonRigidbodyComponent,e)},setAngularVelocity:function(e){a.prototype.setAngularVelocity.call(this.cannonRigidbodyComponent,e)}};var f=new t;return a.prototype.setForce=function(e){this.body.force.set(e.x,e.y,e.z)},a.prototype.setVelocity=function(e){this.body.velocity.set(e.x,e.y,e.z)},a.prototype.setPosition=function(e){this.body?this.body.position.set(e.x,e.y,e.z):this._initialPosition=new n(e)},a.prototype.setAngularVelocity=function(e){this.body.angularVelocity.set(e.x,e.y,e.z)},a.getCollider=function(e){return e.cannonBoxColliderComponent||e.cannonPlaneColliderComponent||e.cannonSphereColliderComponent||e.cannonTerrainColliderComponent||e.cannonCylinderColliderComponent||null},a.prototype.addShapesToBody=function(e){var t=e.cannonRigidbodyComponent.body,n=a.getCollider(e);if(!n){var i=e.transformComponent.worldTransform,s=new r;s.copy(i),s.invert(s);var o=new r,u=this.centerOfMassOffset;e.traverse(function(e){var n=a.getCollider(e);if(n){o.copy(e.transformComponent.worldTransform);var i=new r;r.combine(s,o,i),i.update();var l=i.translation,c=i.rotation,h=new CANNON.Vec3(l.x,l.y,l.z),p=f;p.fromRotationMatrix(c);var d=new CANNON.Quaternion(p.x,p.y,p.z,p.w);h.vadd(u,h),n.isTrigger&&(n.cannonShape.collisionResponse=!1),t.addShape(n.cannonShape,h,d)}})}else t.addShape(n.cannonShape)},a}),define("goo/addons/cannonpack/CannonSphereColliderComponent",["goo/entities/components/Component"],function(e){function t(e){e=e||{},this.type="CannonSphereColliderComponent",this.radius=e.radius||.5,this.cannonShape=new CANNON.Sphere(this.radius)}return t.prototype=Object.create(e.prototype),t.constructor=t,t}),define("goo/addons/cannonpack/CannonSystem",["goo/entities/systems/System","goo/renderer/bounds/BoundingBox","goo/renderer/bounds/BoundingSphere","goo/math/Quaternion","goo/math/Transform","goo/math/Vector3","goo/util/ObjectUtil"],function(e,t,n,r,i,s,o){function u(t){e.call(this,"CannonSystem",["CannonRigidbodyComponent","TransformComponent"]),t=t||{},o.defaults(t,{gravity:new s(0,-10,0),stepFrequency:60,broadphase:"naive"}),this.priority=1;var n=this.world=new CANNON.World;n.gravity.x=t.gravity.x,n.gravity.y=t.gravity.y,n.gravity.z=t.gravity.z,this.setBroadphaseAlgorithm(t.broadphase),this.stepFrequency=t.stepFrequency,this.maxSubSteps=t.maxSubSteps||0}var a=new r;u.prototype=Object.create(e.prototype),u.prototype.reset=function(){for(var e=0;e<this._activeEntities.length;e++){var t=this._activeEntities[e];if(t.cannonRigidbodyComponent.added){var n=t.cannonRigidbodyComponent.body,i=t.transformComponent.worldTransform.translation,s=new r;s.fromRotationMatrix(t.transformComponent.worldTransform.rotation),n.position.set(i.x,i.y,i.z),n.quaternion.set(s.x,s.y,s.z,s.w),n.velocity.set(0,0,0),n.angularVelocity.set(0,0,0)}}},u.prototype.inserted=function(e){var t=e.cannonRigidbodyComponent;t.body=null},u.prototype.deleted=function(e){var t=e.cannonRigidbodyComponent;t&&t.body&&(this.world.remove(t.body),t.body=null)};var f=new s;return u.prototype.process=function(e){var t=this.world;for(var n=0;n<e.length;n++){var r=e[n],i=r.cannonRigidbodyComponent;if(i&&i.added)continue;var s=r.transformComponent,o=new CANNON.Body({mass:i.mass});i.body=o,i.addShapesToBody(r);if(!o.shapes.length){r.clearComponent("CannonRigidbodyComponent");continue}i._initialPosition?r.setPosition(i._initialPosition):r.setPosition(s.transform.translation),r.setVelocity(i._initialVelocity);var u=a;u.fromRotationMatrix(s.transform.rotation),o.quaternion.set(u.x,u.y,u.z,u.w),t.add(o);var l=r.cannonDistanceJointComponent;l&&t.addConstraint(l.createConstraint(r)),i.added=!0}var c=1/this.stepFrequency,h=this.maxSubSteps;if(h){var p=performance.now()/1e3;this._lastTime||(this._lastTime=p);var d=p-this._lastTime;this._lastTime=p,t.step(c,d,h)}else t.step(c);for(var n=0;n<e.length;n++){var r=e[n],v=r.cannonRigidbodyComponent;if(!v)continue;var m=v.body.quaternion,g=v.body.position;m.vmult(v.centerOfMassOffset,f),g.vadd(f,f),r.transformComponent.setTranslation(f.x,f.y,f.z),a.set(m.x,m.y,m.z,m.w),r.transformComponent.transform.rotation.copyQuaternion(a),r.transformComponent.setUpdated()}},u.prototype.setBroadphaseAlgorithm=function(e){var t=this.world;switch(e){case"naive":t.broadphase=new CANNON.NaiveBroadphase;break;case"sap":t.broadphase=new CANNON.SAPBroadphase(t);break;default:throw new Error("Broadphase not supported: "+e)}},u}),define("goo/addons/cannonpack/CannonRegister",["goo/scripts/Scripts","goo/addons/cannonpack/CannonBoxColliderComponent","goo/addons/cannonpack/CannonDistanceJointComponent","goo/addons/cannonpack/CannonPlaneColliderComponent","goo/addons/cannonpack/CannonTerrainColliderComponent","goo/addons/cannonpack/CannonRigidbodyComponent","goo/addons/cannonpack/CannonSphereColliderComponent","goo/addons/cannonpack/CannonCylinderColliderComponent","goo/addons/cannonpack/CannonSystem"],function(e){var t=["goo/scripts/Scripts","goo/addons/cannonpack/CannonBoxColliderComponent","goo/addons/cannonpack/CannonDistanceJointComponent","goo/addons/cannonpack/CannonTerrainColliderComponent","goo/addons/cannonpack/CannonRigidbodyComponent","goo/addons/cannonpack/CannonSphereColliderComponent","goo/addons/cannonpack/CannonCylinderColliderComponent","goo/addons/cannonpack/CannonSystem"];for(var n=1;n<t.length;n++){var r=t[n].slice(t[n].lastIndexOf("/")+1);e.addClass(r,arguments[n])}}),require(["goo/addons/cannonpack/CannonBoxColliderComponent","goo/addons/cannonpack/CannonCylinderColliderComponent","goo/addons/cannonpack/CannonDistanceJointComponent","goo/addons/cannonpack/CannonPlaneColliderComponent","goo/addons/cannonpack/CannonRegister","goo/addons/cannonpack/CannonRigidbodyComponent","goo/addons/cannonpack/CannonSphereColliderComponent","goo/addons/cannonpack/CannonSystem","goo/addons/cannonpack/CannonTerrainColliderComponent"],function(e,t,n,r,i,s,o,u,a){var f=window.goo;if(!f)return;f.CannonBoxColliderComponent=e,f.CannonCylinderColliderComponent=t,f.CannonDistanceJointComponent=n,f.CannonPlaneColliderComponent=r,f.CannonRegister=i,f.CannonRigidbodyComponent=s,f.CannonSphereColliderComponent=o,f.CannonSystem=u,f.CannonTerrainColliderComponent=a}),define("goo/addons/cannonpack/cannonpack",function(){});
}try{
if(window.localStorage&&window.localStorage.gooPath){
window.require.config({
paths:{goo:localStorage.gooPath}
});
}else f()
}catch(e){f()}
})(window)