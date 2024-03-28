// Initialize Three.js variables
let camera, scene, renderer;
let particles = [];

// Initialize text-to-speech variables
const textarea = document.querySelector("textarea");
const voiceList = document.querySelector("select");
const speechBtn = document.querySelector("#convertBtn");
const saveBtn = document.querySelector("#saveBtn");
const speechRateInput = document.getElementById("speechRate");
const pitchInput = document.getElementById("pitch");
const volumeInput = document.getElementById("volume");
const speechRatePercent = document.getElementById("speechRatePercent");
const pitchPercent = document.getElementById("pitchPercent");
const volumePercent = document.getElementById("volumePercent");

let synth = window.speechSynthesis;
let voices = [];

// Fetch voices when the page is loaded
window.addEventListener("load", () => {
    voices = synth.getVoices();
    populateVoiceList();
});

function populateVoiceList() {
    voiceList.innerHTML = ""; // Clear previous options
    if (voices.length === 0) {
        console.error("No voices available");
        return;
    }
    
    voices.forEach(voice => {
        const option = document.createElement("option");
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = voice.name;
        voiceList.appendChild(option);
    });
}

function textToSpeech(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoiceName = voiceList.value;
    const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        console.error("Selected voice not found");
        return;
    }
    utterance.rate = parseFloat(speechRateInput.value);
    utterance.pitch = parseFloat(pitchInput.value);
    utterance.volume = parseFloat(volumeInput.value);
    synth.speak(utterance);
}

textarea.addEventListener("input", () => {
    const text = textarea.value.trim();
    if (text !== "") {
        textToSpeech(text);
    }
});

speechBtn.addEventListener("click", e => {
    e.preventDefault();
    const text = textarea.value.trim();
    if (text !== "") {
        if (!synth.speaking) {
            textToSpeech(text);
        }
    }
});

saveBtn.addEventListener("click", e => {
    e.preventDefault();
    const text = textarea.value.trim();
    if (text !== "") {
        saveSpeech(text);
    }
});

// Update percentage indicators when input values change
speechRateInput.addEventListener("input", () => {
    const ratePercentage = Math.round((parseFloat(speechRateInput.value) / 2) * 100);
    speechRatePercent.textContent = `${ratePercentage}%`;
});

pitchInput.addEventListener("input", () => {
    const pitchPercentage = Math.round((parseFloat(pitchInput.value) / 2) * 100);
    pitchPercent.textContent = `${pitchPercentage}%`;
});

volumeInput.addEventListener("input", () => {
    const volumePercentage = Math.round(parseFloat(volumeInput.value) * 100);
    volumePercent.textContent = `${volumePercentage}%`;
});

// Initialize Three.js scene for particle background
function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    scene = new THREE.Scene();

    const particleCount = 1000;
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < particleCount; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            Math.random() * 800 - 400,
            Math.random() * 800 - 400,
            Math.random() * 800 - 400
        );
        particles.push(mesh);
        scene.add(mesh);
    }

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("background") });
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Update particle animation
function animate() {
    requestAnimationFrame(animate);

    particles.forEach(particle => {
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
}

// Resize canvas when window is resized
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

// Initialize Three.js scene and start animation
init();
animate();
