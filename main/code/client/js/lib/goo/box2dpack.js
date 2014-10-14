/* Goo Engine box2dpack 
 * Copyright 2014 Goo Technologies AB
 */
(function(window){function f(){
define("goo/addons/box2dpack/systems/Box2DSystem",["goo/entities/systems/System"],function(e){function t(){e.call(this,"Box2DSystem",["Box2DComponent","MeshDataComponent"]),this.SCALE=.5,this.world=new Box2D.b2World(new Box2D.b2Vec2(0,-9.81)),this.sortVertexesClockWise=function(e,t){var n=Math.atan2(e.get_y(),e.get_x()),r=Math.atan2(t.get_y(),t.get_x());return n>r?1:-1},this.velocityIterations=8,this.positionIterations=3;var t=4;this.createPolygonShape=function(e){var n=new Box2D.b2PolygonShape,r=Box2D.allocate(e.length*t*2,"float",Box2D.ALLOC_STACK),i=0;for(var s=0;s<e.length;s++)Box2D.setValue(r+i,e[s].get_x(),"float"),Box2D.setValue(r+(i+t),e[s].get_y(),"float"),i+=t*2;var o=Box2D.wrapPointer(r,Box2D.b2Vec2);return n.Set(o,e.length),n}}return t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.prototype.inserted=function(e){var t=e.box2DComponent,n=0,r=0,i=new Box2D.b2PolygonShape;if(t.shape==="box")i.SetAsBox(t.width*this.SCALE,t.height*this.SCALE);else if(t.shape==="circle")i=new Box2D.b2CircleShape,i.set_m_radius(t.radius);else if(t.shape==="mesh"){var s=e.meshDataComponent.meshData,o=s.getAttributeBuffer("POSITION"),u=0,a=[],f=Infinity,l=-Infinity,c=Infinity,h=-Infinity;while(u<=o.length-3){var p=o[u],d=o[++u];d<f&&(f=d),d>l&&(l=d),p<c&&(c=p),p>h&&(h=p),++u,e.transformComponent.updateWorldTransform();var v=new Box2D.b2Vec2(p,d);a.push(v)}i=this.createPolygonShape(a),n=l-f,r=h-c}else if(t.shape==="polygon"){var a=[],u=0;while(u<=t.vertices.length-2){var v=new Box2D.b2Vec2(t.vertices[u],t.vertices[++u]);a.push(v),++u}i=this.createPolygonShape(a)}var m=new Box2D.b2FixtureDef;m.set_shape(i),m.set_density(1),m.set_friction(t.friction),m.set_restitution(t.restitution);var g=new Box2D.b2BodyDef;t.movable===!0&&g.set_type(Box2D.b2_dynamicBody),g.set_position(new Box2D.b2Vec2(e.transformComponent.transform.translation.x+t.offsetX,e.transformComponent.transform.translation.y+t.offsetY));var y=e.transformComponent.transform.rotation.toAngles();g.set_angle(y.z);var b=this.world.CreateBody(g);b.CreateFixture(m),b.SetLinearDamping(.95),b.SetAngularDamping(.6),t.body=b,t.world=this.world,e.body=b,e.body.h=n,e.body.w=r},t.prototype.deleted=function(e){this.world.DestroyBody(e.body)},t.prototype.process=function(e,t){this.world.Step(t,this.velocityIterations,this.positionIterations);for(var n=0;n<e.length;n++){var r=e[n],i=r.transformComponent,s=i.transform,o=r.body.GetPosition(),u=o.get_x(),a=o.get_y();if(a<-10){r.removeFromWorld();continue}s.translation.x=u-r.box2DComponent.offsetX,s.translation.y=a-r.box2DComponent.offsetY,i.setRotation(0,0,r.body.GetAngle()),i.setUpdated()}},t}),define("goo/addons/box2dpack/components/Box2DComponent",["goo/entities/components/Component"],function(e){function t(e){this.type="Box2DComponent",this.body=null,this.world=null,this.mass=1,this.settings=e||{},this.shape=e.shape?e.shape:"box",this.width=e.width?e.width:1,this.height=e.height?e.height:1,this.radius=e.radius?e.radius:1,this.vertices=e.vertices?e.vertices:[0,1,2,2,0,2],this.movable=e.movable!==!1,this.friction=e.friction?e.friction:1,this.restitution=e.restitution?e.restitution:0,this.offsetX=e.offsetX?e.offsetX:0,this.offsetY=e.offsetY?e.offsetY:0}return t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t}),define("goo/addons/box2dpack/Box2DRegister",["goo/scripts/Scripts","goo/addons/box2dpack/systems/Box2DSystem","goo/addons/box2dpack/components/Box2DComponent"],function(e){var t=["goo/scripts/Scripts","goo/addons/box2dpack/systems/Box2DSystem","goo/addons/box2dpack/components/Box2DComponent"];for(var n=1;n<t.length;n++){var r=t[n].slice(t[n].lastIndexOf("/")+1);e.addClass(r,arguments[n])}}),require(["goo/addons/box2dpack/Box2DRegister","goo/addons/box2dpack/components/Box2DComponent","goo/addons/box2dpack/systems/Box2DSystem"],function(e,t,n){var r=window.goo;if(!r)return;r.Box2DRegister=e,r.Box2DComponent=t,r.Box2DSystem=n}),define("goo/addons/box2dpack/box2dpack",function(){});
}try{
if(window.localStorage&&window.localStorage.gooPath){
window.require.config({
paths:{goo:localStorage.gooPath}
});
}else f()
}catch(e){f()}
})(window)