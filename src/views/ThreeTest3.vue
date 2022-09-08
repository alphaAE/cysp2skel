<template>
	<div ref="view"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as spine from '@esotericsoftware/spine-threejs'
// import * as spine  from '@/libs/spine-threejs36'
// import * as spine from 'spine-ts-threejs'
let scene, camera, renderer, controls;
let geometry, material, mesh, skeletonMesh;
let assetManager;
let canvas;
let lastFrameTime = Date.now() / 1000;

let baseUrl = "../assets/";
let skeletonFile = "raptor-new-pro.json";
let atlasFile = skeletonFile.replace("-pro", "").replace("-ess", "").replace(".json", ".atlas");
let animation = "walk";
export default {
	data() {
		return {
			viewNode: null,
			animationId: null
		}
	},
	methods: {
		init() {
			this.viewNode = this.$refs.view;

			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera(
				75,
				window.innerWidth / (window.innerHeight - 38.4),
				0.1,
				10000
			);
			camera.position.y = 100;
			camera.position.z = 400;

			renderer = new THREE.WebGLRenderer();
			renderer.setSize(window.innerWidth, window.innerHeight - 38.4);
			this.viewNode.appendChild(renderer.domElement);
			canvas = renderer.domElement;

			controls = new OrbitControls(camera, renderer.domElement);
			controls.minPolarAngle = 0;
			controls.maxPolarAngle = Math.PI;
			controls.minDistance = 1;
			controls.maxDistance = 800;

			// 加载显示 Raptor 模型所需的资源
			assetManager = new spine.AssetManager(baseUrl);
			assetManager.loadJson(skeletonFile);
			assetManager.loadTextureAtlas(atlasFile);

			this.animationId = requestAnimationFrame(this.load);
		},
		load() {
			if (assetManager.isLoadingComplete()) {
				geometry = new THREE.BoxGeometry(200, 200, 200);
				material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
				mesh = new THREE.Mesh(geometry, material);
				scene.add(mesh);

				// Load the texture atlas using name.atlas and name.png from the AssetManager.
				// The function passed to TextureAtlas is used to resolve relative paths.
				let atlas = assetManager.require(atlasFile);

				// Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
				let atlasLoader = new spine.AtlasAttachmentLoader(atlas);

				// 创建一个用于解析 .json 文件的 SkeletonJson 实例
				let skeletonJson = new spine.SkeletonJson(atlasLoader);
				console.log(skeletonJson);

				// Set the scale to apply during parsing, parse the file, and create a new skeleton.
				skeletonJson.scale = 0.4;
				let skeletonData = skeletonJson.readSkeletonData(assetManager.require(skeletonFile));
				console.log(skeletonData);

				// Create a SkeletonMesh from the data and attach it to the scene
				skeletonMesh = new spine.SkeletonMesh(skeletonData, (parameters) => {
					parameters.depthTest = true;
					parameters.depthWrite = true;
					parameters.alphaTest = 0.001;
				});
				skeletonMesh.state.setAnimation(0, animation, true);
				mesh.add(skeletonMesh);


				requestAnimationFrame(this.render);
			} else requestAnimationFrame(this.load);
		},
		render() {
			// calculate delta time for animation purposes
			let now = Date.now() / 1000;
			let delta = now - lastFrameTime;
			lastFrameTime = now;

			// resize canvas to use full page, adjust camera/renderer
			// this.resize();

			// Update orbital controls
			controls.update();

			// update the animation
			skeletonMesh.update(delta);

			// render the scene
			renderer.render(scene, camera);

			requestAnimationFrame(this.render);
		},
		resize() {
			let w = window.innerWidth;
			let h = window.innerHeight;
			if (canvas.width != w || canvas.height != h) {
				canvas.width = w;
				canvas.height = h;
			}

			camera.aspect = w / h;
			camera.updateProjectionMatrix();

			renderer.setSize(w, h);
		}

	},
	mounted() {
		this.init();
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