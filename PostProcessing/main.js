	

		    //	import * as THREE from '../build/three.module.js';
			//import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
			//import { RenderPass } from './jsm/postprocessing/RenderPass.js';
			import { OrbitControls } from './jsm/controls/OrbitControls.js'
			import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
			//import { threex.keyboardstate } from './jsm/controls/threex.keyboardstate.js'

			
			let camera, scene, renderer, composer, stats, container;
			let light;
			let checkpoint=550;
			let group;
			let controls;
			
			let cameraActive=0;

			
			let keyboard = new THREEx.KeyboardState();
			
			let clock = new THREE.Clock();
			let chasecamera;
			let car,car2;
			let tree=[];
			
			let relativeCameraOffset;
			let cameraOffset;
			
			let collisions = true;
			
			let collidableMeshList = [];
			let collidableMeshList2 = [];
			let collidableMeshList3 = [];
			let collidableMeshList4 = [];
			let collidableMeshList5=[];
            
			var timer = new THREE.Clock();

           	let cpcolor= 0x009933;
			let cpgeo=new THREE.PlaneGeometry(49,60,5,4);;
			let cpmat=new THREE.MeshPhongMaterial({color: cpcolor,opacity:0.5,transparent:true,side:THREE.DoubleSide});
			let cpmesh;
			
            THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

			// mute do dzwiekow - 1 to checkpoint,2- crash
			let mute1=0.5,mute2=0.3;

			let speed=0;

			//let moveStatus =true;

            
			function init() {


			
		        renderer = new THREE.WebGLRenderer( {antialias:true} );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );
				
				renderer.shadowMap.enabled = true;
      
				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
				camera.position.set(0,20,200);
				
				 controls = new OrbitControls( camera, renderer.domElement );
				 controls.update();
				
				

				scene = new THREE.Scene();
				
				container = document.getElementById( 'ThreeJS' );
				
				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.bottom = '0px';
				stats.domElement.style.zIndex = 100;
				container.appendChild( stats.domElement );
				
				timer.stop();
				
				chasecamera = new THREE.PerspectiveCamera( 75,window.innerWidth/window.innerHeight,0.1,1000);
				scene.add(chasecamera);

				// light = new THREE.DirectionalLight( 0xffffff );
				// light.position.set( 1, 100, 700 );
				// scene.add( light );
				
				 // const light1 = new THREE.AmbientLight( 0x404040 ); // soft white light
				// light1.position.set(1,100,1)
				 // scene.add( light1 );
				 
				
				 
				 const point_light = new THREE.PointLight(0xffffff,3,1500);
				 point_light.position.set(500,80,0);
				 point_light.castShadow = true;
				 
				point_light.shadow.mapSize.width = 1200; // default
				point_light.shadow.mapSize.height = 1200; // default
				point_light.shadow.camera.near = 0.5; // default
				point_light.shadow.camera.far = 1200; // default
				 
				 scene.add(point_light);
				 
				  const sphereSize_top = 10;
				const pointLightHelper_top = new THREE.PointLightHelper( point_light, sphereSize_top );
				scene.add( pointLightHelper_top );
				
				const loaderSkybox = new THREE.CubeTextureLoader();
    			const texture1 = loaderSkybox.load([
        		'./resources/posx.jpg',
        		'./resources/negx.jpg',
        		'./resources/posy.jpg',
        		'./resources/negy.jpg',
        		'./resources/posz.jpg',
        		'./resources/negz.jpg',
    			]);
    			scene.background = texture1;

				map1();
				


				
				
				const loader = new FBXLoader();
				loader.load( 'fbx/Models/shelby.fbx', function ( object ) {
					object.traverse( function ( child ) {
						if ( child.isMesh ) {
							child.castShadow = true;
							child.receiveShadow = true;
						}
					} );
					object.scale.multiplyScalar(0.8);
					console.log(object.children);
					car.add(object);
				});
				
				let group2=new THREE.Group();
				let carG=new THREE.CubeGeometry(2.8,6.5,8,1,1,1);
            	car=new THREE.Mesh(carG,new THREE.MeshStandardMaterial( {color: 0xffffff,visible:false}));
                car.position.set(0,0,550);
				group2.add(car);
				scene.add(group2);

				window.addEventListener( 'resize', onWindowResize, false );

				let cpGeo=new THREE.CubeGeometry( 50, 50, 1, 1, 1, 1 );
				let cpMat=new THREE.MeshBasicMaterial( {color: 0x8888ff, visible:false} );

				let cp1=new THREE.Mesh(cpGeo,cpMat);
				cp1.position.set(0,4.75,500);
				scene.add(cp1);
				collidableMeshList.push(cp1);
				collidableMeshList3.push(cp1);
				
				let cp2=new THREE.Mesh(cpGeo,cpMat);
				cp2.position.set(0,4.75,400);
				scene.add(cp2);
				collidableMeshList.push(cp2);

				let cp3=new THREE.Mesh(cpGeo,cpMat);
				cp3.position.set(0,4.75,300);
				scene.add(cp3);
				collidableMeshList.push(cp3);

				let cp4=new THREE.Mesh(cpGeo,cpMat);
				cp4.position.set(0,4.75,200);
				scene.add(cp4);
				collidableMeshList.push(cp4);

				let cp5=new THREE.Mesh(cpGeo,cpMat);
				cp5.position.set(0,4.75,100);
				scene.add(cp5);
				collidableMeshList.push(cp5);

				let cp6=new THREE.Mesh(cpGeo,cpMat);
				cp6.position.set(0,4.75,0);
				scene.add(cp6);
				collidableMeshList.push(cp6);

				let cp7=new THREE.Mesh(cpGeo,cpMat);
				cp7.position.set(0,4.75,-100);
				scene.add(cp7);
				collidableMeshList.push(cp7);

				let cp8=new THREE.Mesh(cpGeo,cpMat);
				cp8.position.set(0,4.75,-200);
				scene.add(cp8);
				collidableMeshList.push(cp8);

				let cp9=new THREE.Mesh(cpGeo,cpMat);
				cp9.position.set(0,4.75,-300);
				scene.add(cp9);
				collidableMeshList.push(cp9);

				let cp10=new THREE.Mesh(cpGeo,cpMat);
				cp10.position.set(0,4.75,-400);
				scene.add(cp10);
				collidableMeshList.push(cp10);

				let cp11=new THREE.Mesh(cpGeo,cpMat);
				cp11.position.set(0,4.75,-500);
				scene.add(cp11);
				collidableMeshList.push(cp11);
				collidableMeshList4.push(cp11);

				let wall1=new THREE.Mesh(cpGeo,cpMat);
				wall1.position.set(0,4.75,-600);
				scene.add(wall1);
				collidableMeshList2.push(wall1);

				let wall2=new THREE.Mesh(cpGeo,cpMat);
				wall2.position.set(0,4.75,600);
				scene.add(wall2);
				collidableMeshList2.push(wall2);

				let sidewallGeo=new THREE.CubeGeometry( 1, 20, 1200, 1, 1, 1 );
				let sidewallMat=new THREE.MeshBasicMaterial( {color: 0x8888ff, visible:false} );

				let sidewallL=new THREE.Mesh(sidewallGeo,sidewallMat);
				sidewallL.position.set(25,4.75,0)
				scene.add(sidewallL);
				collidableMeshList2.push(sidewallL);

				let sidewallR=new THREE.Mesh(sidewallGeo,sidewallMat);
				sidewallR.position.set(-25,4.75,0)
				scene.add(sidewallR);
				collidableMeshList2.push(sidewallR);

				
				let group4=new THREE.Group();
				let treeG=new THREE.CubeGeometry(5,5,5,1,1,1);
				
				

				
		
				let cubemat=
					[
					new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('./textures/boxtexture.jpg'),side:THREE.DoubleSide}),
					new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('./textures/boxtexture.jpg'),side:THREE.DoubleSide}),
					new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('./textures/boxtexture.jpg'),side:THREE.DoubleSide}),
					new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('./textures/boxtexture.jpg'),side:THREE.DoubleSide}),
					new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('./textures/boxtexture.jpg'),side:THREE.DoubleSide}),
					new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('./textures/boxtexture.jpg'),side:THREE.DoubleSide})
					];

				let material1=new THREE.MeshFaceMaterial(cubemat);

				for( let i=0;i<80;i++)
				{
					tree[i]=new THREE.Mesh(treeG,material1);				
                	tree[i].position.set(random(-20,20),2.7,random(-500,500));
					group4.add(tree[i]);
					scene.add(tree[i]);	
					collidableMeshList2.push(tree[i]);
					
					tree[i].castShadow = true;
					tree[i].receiveShadow = true;
				}
				
				
				
				 
				
       
        
		let i=500;
		do
		{
		
		cpmesh=new THREE.Mesh(cpgeo,cpmat);
		scene.add(cpmesh);
		cpmesh.position.set(0,10,i);
		i=i-100;
		}while(i>-501)

				
		
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );
				


			}

			
			
			function update()
			{
				
				

				// local transformations
				
				 set_time();
				
				stats.update();
				
	
				// move forwards/backwards

				let delta = clock.getDelta(); // seconds.
				
				let moveDistance = speed * delta; // 
				let rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

				// if ( keyboard.pressed("W") && moveStatus==true)
				if ( keyboard.pressed("W") )
				{
					car.translateZ( -moveDistance );

				}
				
				if ( keyboard.pressed("S") )
					car.translateZ(  moveDistance );
	

				// rotate left/right

				let rotation_matrix = new THREE.Matrix4().identity();

				if ( keyboard.pressed("A") && keyboard.pressed("W") && speed>0 )
					car.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
					if ( keyboard.pressed("A") && keyboard.pressed("S") && speed>0 )
					car.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
				if ( keyboard.pressed("D")&& keyboard.pressed("W")  && speed>0 )
					car.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
					if ( keyboard.pressed("D") && keyboard.pressed("S") && speed>0 )
					car.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
	
				//reset

				if ( keyboard.pressed("Z") )
				{
					
					car.position.set(0,0,checkpoint);
					car.rotation.set(0,0,0);
					
				}
				if( keyboard.pressed("R") )
				{
					
					timer = new THREE.Clock(true);
					timer.stop();
					car.position.set(0,0,550);
					car.rotation.set(0,0,0);

				}
				if( keyboard.pressed("P") )
				{
					sound.pause();
				}
				if( keyboard.pressed("L") )
				{
					carsound();
				}
				if (keyboard.pressed("O"))
				{
					
					if(collisions==true)
					{
						
						collisions = false;
						
					}
					else
					{
						
						collisions = true;
						
					}
					
				}
			
	
					relativeCameraOffset = new THREE.Vector3(0,10,20);

					cameraOffset = relativeCameraOffset.applyMatrix4( car.matrixWorld );

					chasecamera.position.x = cameraOffset.x;
					chasecamera.position.y = cameraOffset.y;
					chasecamera.position.z = cameraOffset.z;

					chasecamera.lookAt(car.position );
					
		
					if ( keyboard.pressed("1") )
						cameraActive=0;
					// if ( keyboard.pressed("2") )
					// 	cameraActive=1;
					
					
                   let originPoint=car.position.clone();

				    

				   for (let vertexIndex = 0; vertexIndex < car.geometry.vertices.length; vertexIndex++)
					{
						let localVertex = car.geometry.vertices[vertexIndex].clone();
						let globalVertex = localVertex.applyMatrix4( car.matrix );
						let directionVector = globalVertex.sub( car.position );
		
						let ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
						let collisionResults = ray.intersectObjects( collidableMeshList );
						if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() && collisions==true ) 
							{
							
							checkpoint=car.position.z;
							cpsound();
							
							
							}
					}

					 for (let vertexIndex = 0; vertexIndex < car.geometry.vertices.length; vertexIndex++)
					{
						let localVertex = car.geometry.vertices[vertexIndex].clone();
						let globalVertex = localVertex.applyMatrix4( car.matrix );
						let directionVector = globalVertex.sub( car.position );
		
						let ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
						let collisionResults = ray.intersectObjects( collidableMeshList2 );
						if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() && collisions==true ) 
							{
							
							car.position.set(0,0,checkpoint);
							car.rotation.set(0,0,0);
							// moveStatus=false;
							crashsound();
							
							}
							// else
							// moveStatus=true;
					}
					
					for (let vertexIndex = 0; vertexIndex < car.geometry.vertices.length; vertexIndex++)
					{
						let localVertex = car.geometry.vertices[vertexIndex].clone();
						let globalVertex = localVertex.applyMatrix4( car.matrix );
						let directionVector = globalVertex.sub( car.position );
		
						let ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
						let collisionResults = ray.intersectObjects( collidableMeshList3 );
						if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
							{
							
							timer.start();
							
							
							}
					}
					
					for (let vertexIndex = 0; vertexIndex < car.geometry.vertices.length; vertexIndex++)
					{
						let localVertex = car.geometry.vertices[vertexIndex].clone();
						let globalVertex = localVertex.applyMatrix4( car.matrix );
						let directionVector = globalVertex.sub( car.position );
		
						let ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
						let collisionResults = ray.intersectObjects( collidableMeshList4 );
						if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
							{
							
							timer.stop();
							
							}
					}

					

					

					
			}
			
			
	function animate() {

		requestAnimationFrame( animate );
		
		render();

	}
	
	function render(){
	
	renderer.clear();
	//stopwatch();
	switch(cameraActive)
	{
		case 1:
		renderer.render(scene,camera);
		break;

		case 2:
		renderer.render(scene,chasecamera);
		break;
		
		default:
		renderer.render(scene,chasecamera);
	}
	update();

}

function map1()
{
		let map1=new THREE.Group();
		//droga
		let roadG=new THREE.BoxGeometry(100,0.5,1000);
		let roadT=new THREE.ImageUtils.loadTexture( 'textures/asfalt.jpg' );
		let roadM=new THREE.Mesh(roadG,new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide,map:roadT}));
		roadM.position.y=-0.25;
		//roadM.castShadow=true;
		roadM.receiveShadow=true;
		roadT.wrapS = roadT.wrapT =THREE.RepeatWrapping; 
		roadT.repeat.set( 1, 10 );
		map1.add(roadM);
		// start (miejsce gdzie jest renderowany samochod)
		let startG=new THREE.BoxGeometry(100,0.5,100);
		let startT=new THREE.ImageUtils.loadTexture( 'textures/asfalt.jpg' );
		let startM=new THREE.Mesh(startG,new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide,map:startT}));
		startM.position.y=-0.25;
		startM.position.z=550;
		//startM.castShadow=true;
		startM.receiveShadow=true;
		startT.wrapS = startT.wrapT =THREE.RepeatWrapping; 
		startT.repeat.set( 1, 10 );
		map1.add(startM);
		// start 
		let sPointG=new THREE.BoxGeometry(50,0.5,1);
		let sPointT=new THREE.ImageUtils.loadTexture( 'textures/start.png' );
		let sPointM=new THREE.Mesh(sPointG,new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide,map:sPointT}));
		sPointM.position.y=-0.20;
		sPointM.position.z=500;
		//sPointM.castShadow=true;
		sPointM.receiveShadow=true;
		sPointT.wrapS = sPointT.wrapT =THREE.RepeatWrapping; 
		sPointT.repeat.set( 10, 10 );
		map1.add(sPointM);
		//meta - miejsce gdzie mozna jezdzis samochodem po przejechaniu mety
		let endG=new THREE.BoxGeometry(100,0.5,100);
		let endT=new THREE.ImageUtils.loadTexture( 'textures/asfalt.jpg' );
		let endM=new THREE.Mesh(endG,new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide,map:endT}));
		endM.position.y=-0.25;
		endM.position.z=-550;
		//endM.castShadow=true;
		endM.receiveShadow=true;
		endT.wrapS = endT.wrapT =THREE.RepeatWrapping; 
		endT.repeat.set( 1, 10 );
		map1.add(endM);
		//meta
		let ePointG=new THREE.BoxGeometry(50,0.5,1);
		let ePointT=new THREE.ImageUtils.loadTexture( 'textures/start.png' );
		let ePointM=new THREE.Mesh(ePointG,new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide,map:ePointT}));
		ePointM.position.y=-0.20;
		ePointM.position.z=-500;
		//ePointM.castShadow=true;
		ePointM.receiveShadow=true;
		ePointT.wrapS = ePointT.wrapT =THREE.RepeatWrapping; 
		ePointT.repeat.set( 10, 10 );
		map1.add(ePointM);

		//barierki
		let barrGeo=new THREE.CubeGeometry( 1, 5, 1200, 1, 1, 1 );
		let barrT=new THREE.TextureLoader().load('./textures/kerb.jpg')
		
		let barrMat=new THREE.MeshStandardMaterial( {color: 0xffffff, side:THREE.DoubleSide,map:barrT} );
		
		let barrL=new THREE.Mesh(barrGeo,barrMat);
		barrT.wrapS = barrT.wrapT =THREE.RepeatWrapping; 
		barrT.repeat.set( 10, 1 );
		barrL.position.set(25,0,0)
		map1.add(barrL);
		

		let barrR=new THREE.Mesh(barrGeo,barrMat);
		barrR.position.set(-25,0,0)
		map1.add(barrR);

		let barrStartGeo=new THREE.CubeGeometry( 50, 5, 1, 1, 1, 1 );
		let barrT2=new THREE.TextureLoader().load('./textures/kerb.jpg')
		let barrMat2=new THREE.MeshStandardMaterial( {color: 0xffffff, side:THREE.DoubleSide,map:barrT2} );
		barrT2.wrapS = barrT2.wrapT =THREE.RepeatWrapping; 
		barrT2.repeat.set( 1, 1 );
		
		let barrstart=new THREE.Mesh(barrStartGeo,barrMat2);
		barrstart.position.set(0,0,600);
		map1.add(barrstart);
		let barrend=new THREE.Mesh(barrStartGeo,barrMat2);
		barrend.position.set(0,0,-600);
		map1.add(barrend);

		let cylGeo=new THREE.CylinderGeometry( 30, 30, 1202, 32 );
		let cylT=new THREE.TextureLoader().load('./textures/tunnel.jpg')
		let cylM = new THREE.MeshStandardMaterial( {color: 0xffffff,side:THREE.DoubleSide,map:cylT} );
		cylT.wrapS = cylT.wrapT =THREE.RepeatWrapping; 
		cylT.repeat.set( 100, 10 );
		let cylinder = new THREE.Mesh( cylGeo, cylM );
		//cylinder.rotation.z=Math.PI/4;
		 cylinder.rotation.x=Math.PI/2;
		cylinder.position.set(0,5,0);
		map1.add(cylinder);

		scene.add(map1);
				
		} 
		
	init();
	animate();
	
	function random(min, max) {
		
		return Math.floor(Math.random() * (max - min)) + min;
		
	}
	 
	function set_time() {
		 
		document.getElementById("time").innerHTML = timer.getElapsedTime().toFixed(2);
		
	}
	
	const listener = new THREE.AudioListener();
	
	camera.add( listener );
	
	const sound = new THREE.Audio( listener );

	const audioLoader = new THREE.AudioLoader();
	function playstart(){
	audioLoader.load( 'sounds/StartCar.mp3', function( buffer ) {
		sound.setBuffer( buffer );
		sound.setLoop( false );
		sound.setVolume( 0.5 );
		sound.play();
	
		});
	}
	function carsound()// glosneeee
	{
		audioLoader.load( 'sounds/carrunning.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 0.01 );
			sound.play();

			});
			
	}
	function crashsound(){
		audioLoader.load( 'sounds/carcrash.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( mute2 );
			sound.play();
		
			});
		}
	function cpsound(){
			audioLoader.load( 'sounds/ding.mp3', function( buffer ) {
				sound.setBuffer( buffer );
				sound.setLoop( false );
				sound.setVolume( mute1 );
				sound.play();
				sound.duration(0.01);
			
				});
			}
	

			function clearDIV()
		{
		
		
			Element.prototype.remove = function() {
			this.parentElement.removeChild(this);
			}
			NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
			for(var i = this.length - 1; i >= 0; i--) {
				if(this[i] && this[i].parentElement) {
					this[i].parentElement.removeChild(this[i]);
				}
			}
		}
		
		document.getElementsByClassName("container").remove();
		
		}
	document.getElementById("but").onclick = function() {
		
		playstart();
		clearDIV();
	};

	
		
			
					
	const KeyUp=function(event)
	{
		switch (event.code)
		{
			case 'KeyO':
				if(collisions==true)
					{
						
						collisions = false;
						
					}
					else
					{
						
						collisions = true;
						
					}
				break;
			case 'ShiftLeft':
				if(speed<61)
				speed=speed+10;
				break;
			case 'ControlLeft':
				if(speed>0)
				speed=speed-10;
				break;
			case 'KeyW':

				speed=0;
				
				break;

			case 'KeyS':

				speed=0;
					
				break;
			case 'BracketLeft':
				if(mute1 !=0)
				{
				mute1=0;
				}
				else
				{
					mute1=0.5;
				}

				break;
			case 'BracketRight':
				if(mute2!=0)
				{
				mute2=0;
				}
				else
				{
					mute2=0.03;
				}

		}
	}
	document.addEventListener('keyup',KeyUp);