<template>
    <div ref="view"></div>
</template>

<script>
import * as THREE from 'three'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

let scene, camera, renderer;
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
            // Three Test1
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

            var loader = new FBXLoader();
            loader.load("../assets/test2.fbx", function (obj) {
                //渲染阴影
                obj.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
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