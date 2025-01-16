
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (url, loaded, total) => {
    console.log(`Loading 3D model: ${(loaded / total * 100)}%`);
};
