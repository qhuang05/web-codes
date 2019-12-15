class ModelCreator{
    constructor(){

    }
    
    init(){
        // 1. 创建场景、相机、渲染器
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
        document.body.appendChild( renderer.domElement );

        // 2. 创建物体
        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );

        // 3. 将物体添加到场景中
        scene.add( cube );

        // 4. 调整相机的位置
        camera.position.z = 3;

        // 5. 渲染
        var animate = function () {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render( scene, camera );
            requestAnimationFrame( animate );
        };
        animate();
    }
}

export default ModelCreator;