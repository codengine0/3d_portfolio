import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ThreeScene: React.FC = () => {
    const [modelLoaded, setModelLoaded] = useState(false);
    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.maxPolarAngle = Math.PI / 2; // Lock controls to horizontal

    const animate = () => {
        requestAnimationFrame(animate);
        // gltf.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    useEffect(() => {
        let model: THREE.Group | THREE.Object3D | undefined;

        if(!modelLoaded) {
            // Set up your Three.js scene here
            const loader = new GLTFLoader();

            loader.load('/room_1.glb', (gltf) => {
                model = gltf.scene;
                scene.add(model);

                model.scale.set(1, 1, 1); // Adjust the scale as needed
                camera.position.set(2, 5, 10); // Adjust the position as needed

                const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                scene.add(ambientLight);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
                scene.add(directionalLight);
            })
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            // camera.position.z = 5

            

            animate();

            setModelLoaded(true);
        }

        return () => {
            // Clean up any resources if needed
            renderer.dispose();
            if (model) {
                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.geometry.dispose();
                        child.material.dispose();
                    }
                })
            }
        };
    }, [modelLoaded]);

    return <div/>;
};

export default ThreeScene;