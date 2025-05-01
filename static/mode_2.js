document.addEventListener('DOMContentLoaded', () => {
    loadLearningSet();
  });

  let correctAnswers = [];
  let audioMap = {};

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

        // Limit to 2 words
        data.words.slice(0, 2).forEach((w, idx) => {
          const imageBox = document.createElement('div');
          imageBox.className = 'image-box';

          const img = document.createElement('img');
          img.src = w.img_path;
          img.className = 'learning-image';

          const audio = new Audio(w.audio_path);
          img.addEventListener('click', () => {
            audio.play();
          });

          audioMap[w.word] = audio;
          imageBox.appendChild(img);
          imageRow.appendChild(imageBox);

          // Drop box for this word
          const drop = document.createElement('div');
          drop.className = 'drop-box';
          drop.dataset.correct = w.word;

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
            drop.style.borderColor = '';
            document.querySelectorAll('.draggable').forEach(d => {
              if (d.textContent === text) d.style.visibility = 'visible';
            });
          });

          dropRow.appendChild(drop);
        });

                // Ensure correct answers are included
      const correctWords = data.words.slice(0, 2).map(w => w.word);
      const allChoices = new Set(correctWords);

      // Randomly add more distractors (wrong choices) until we have 4 total
      while (allChoices.size < 4 && data.choices.length > allChoices.size) {
        const randomChoice = data.choices[Math.floor(Math.random() * data.choices.length)];
        allChoices.add(randomChoice);
      }

      // Shuffle the final list
      const finalChoices = Array.from(allChoices).sort(() => Math.random() - 0.5);

      // Create draggable elements
      finalChoices.forEach(word => {
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
  
    boxes.forEach(box => {
      const correct = box.dataset.correct;
      const user = box.dataset.user;
  
      if (user === correct) {
        box.style.borderColor = 'green';
        box.style.borderWidth = '3px';
      } else {
        box.style.borderColor = 'red';
        box.style.borderWidth = '3px';
        incorrect++;
      }
    });
  
    const result = document.getElementById('learning-result');
    if (incorrect === 0) {
      result.textContent = '✅ ត្រឹមត្រូវ!';
      result.style.color = 'green';
  
      setTimeout(() => {
        loadLearningSet();
      }, 1500); // delay before showing next pair
    } else {
      result.textContent = `❌ ខុស ${incorrect}`;
      result.style.color = 'red';
    }
  }
  function playAudio(path) {
    const audio = new Audio(path);
    audio.play();
}

// Example: when user clicks a word
document.querySelectorAll('.word-button').forEach(btn => {
    btn.addEventListener('click', function() {
        const audioPath = this.getAttribute('data-audio');
        playAudio(audioPath);
    });
});