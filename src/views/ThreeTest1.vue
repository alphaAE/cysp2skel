<template>
    <div ref="view"></div>
</template>

<script>
import * as THREE from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
let scene, camera, renderer, mesh;
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
                1000
            );
            camera.position.z = 5;

            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight - 38.4);
            this.viewNode.appendChild(renderer.domElement);

            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshNormalMaterial();
            mesh = new THREE.Mesh(geometry, material);

            scene.add(mesh);
        },
        animation() {
            this.animationId = requestAnimationFrame(this.animation);
            renderer.render(scene, camera);

            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;
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