document.addEventListener('DOMContentLoaded', () => {
    loadLearningSet();
    document.getElementById('next-button').addEventListener('click', loadLearningSet);
});

let correctAnswers = [];
let audioMap = {};

function resetLearningMode() {
    // Clear drop boxes
    document.querySelectorAll('.drop-box').forEach(box => box.textContent = '');

    // Show all hidden draggable items
    document.querySelectorAll('.draggable').forEach(item => {
        item.style.visibility = 'visible';
    });

    // Clear result message
    document.getElementById('learning-result').textContent = '';
}

function clearInterface() {
    document.getElementById('image-row').innerHTML = '';
    document.getElementById('drop-row').innerHTML = '';
    document.getElementById('drag-row').innerHTML = '';
    document.getElementById('learning-result').textContent = '';
}

function loadLearningSet() {
    fetch('/learning-mode')
        .then(res => res.json())
        .then(data => {
            clearInterface();
            correctAnswers = data.words.map(w => w.word);
            audioMap = {};

            const imageRow = document.getElementById('image-row');
            const dropRow = document.getElementById('drop-row');
            const dragRow = document.getElementById('drag-row');
            data.words.forEach((w, idx) => {
                // Create container div for image and audio
                const imageBox = document.createElement('div');
                imageBox.className = 'image-box';
            
                const img = document.createElement('img');
                img.src = w.img_path;
                img.className = 'learning-image';
            
                const audio = new Audio(w.audio_path);
                img.addEventListener('click', () => {
                    audio.play();
                });
            
                imageBox.appendChild(img);
                imageRow.appendChild(imageBox);
            
                // Create matching drop box
                const drop = document.createElement('div');
                drop.className = 'drop-box';
                drop.dataset.index = idx;
                drop.ondragover = e => e.preventDefault();
                drop.ondrop = e => {
                    e.preventDefault();
                    const text = e.dataTransfer.getData("text/plain");
                    drop.textContent = text;
                    drop.dataset.user = text;
                    document.querySelectorAll('.draggable').forEach(d => {
                        if (d.textContent === text) d.style.visibility = 'hidden';
                    });
                };
                drop.addEventListener('click', () => {
                    const text = drop.textContent;
                    drop.textContent = '';
                    delete drop.dataset.user;
                    drop.style.backgroundColor = '';
                    drop.style.borderColor = '';
                    document.querySelectorAll('.draggable').forEach(d => {
                        if (d.textContent === text) d.style.visibility = 'visible';
                    });
                });
                dropRow.appendChild(drop);
            });         

            // Draggable choices
            data.choices.forEach(word => {
                const drag = document.createElement('div');
                drag.className = 'draggable';
                drag.textContent = word;
                drag.draggable = true;

                drag.addEventListener('dragstart', e => {
                    e.dataTransfer.setData("text/plain", drag.textContent);
                });

                dragRow.appendChild(drag);
            });
        });
}

function checkLearningAnswer() {
    const boxes = document.querySelectorAll('.drop-box');
    let incorrect = 0;

    boxes.forEach((box, idx) => {
        const correct = box.dataset.correct;
        const user = box.dataset.user;

        if (user === correct) {
            box.style.borderColor = 'green';
            box.style.borderWidth = '3px';
            audioMap[correct]?.play();
        } else {
            box.style.borderColor = 'red';
            box.style.borderWidth = '3px';
            incorrect++;
        }
    });

    const result = document.getElementById('learning-result');
    if (incorrect === 0) {
        result.textContent = '✅ ត្រឹមត្រូវទាំងអស់!';
        result.style.color = 'green';
    } else {
        result.textContent = `❌ ខុស ${incorrect} ប្រភេទ`;
        result.style.color = 'red';
    }
}
