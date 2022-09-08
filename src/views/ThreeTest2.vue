<template>
    <div ref="view"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

let scene, camera, renderer, controls;
export default {
    data() {
        return {
            viewNode: null,
            animationId: null
        }
    },
    methods: {
        initThreeScene() {
            this.viewNode = this.$refs.view;
            
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / (window.innerHeight - 38.4),
                0.1,
                10000
            );
            camera.position.z = 7;

            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight - 38.4);
            this.viewNode.appendChild(renderer.domElement);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.minPolarAngle =0;
            controls.maxPolarAngle = Math.PI;
            controls.minDistance = 1;
            controls.maxDistance = 800;

            var loader = new FBXLoader();
            loader.load("../assets/test2.fbx", function (obj) {
                scene.add(obj);
            });

            var light = new THREE.HemisphereLight(0xffffff, 0x444444);
            light.position.set(0, 200, 0);
            scene.add(light);

        },
        animation() {
            this.animationId = requestAnimationFrame(this.animation);
            renderer.render(scene, camera);
        }
    },
    mounted() {
        this.initThreeScene();
        this.animation();
    },
    unmounted() {
        scene.clear();
        renderer.dispose()
        renderer.forceContextLoss()
        renderer.content = null
        cancelAnimationFrame(this.animationId)
    }
}
</script>

<style>
</style>