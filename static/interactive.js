document.addEventListener('DOMContentLoaded', () => {
    const dropBoxes = document.querySelectorAll('.drop-box');
    const dragItems = document.querySelectorAll('.draggable');

    const letterUsage = {};  // Tracks how many times each letter is used

    // Enable dragging for letters
    dragItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData("text/plain", item.textContent);
        });
    });

    // Drop box logic
    dropBoxes.forEach(box => {
        box.ondragover = e => e.preventDefault();

        box.ondrop = e => {
            e.preventDefault();
            const data = e.dataTransfer.getData("text/plain");

            const prevLetter = box.textContent.trim();
            if (prevLetter) {
                // Decrease usage count of old letter
                letterUsage[prevLetter] = (letterUsage[prevLetter] || 1) - 1;
                if (letterUsage[prevLetter] <= 0) {
                    letterUsage[prevLetter] = 0;
                    showDragItem(prevLetter);
                }
            }

            // Set new letter
            box.textContent = data;

            // Increase usage count for dropped letter
            letterUsage[data] = (letterUsage[data] || 0) + 1;
            if (letterUsage[data] >= 1) {
                hideDragItem(data);
            }
        };

        box.addEventListener('click', () => {
            const prevLetter = box.textContent.trim();
            if (prevLetter) {
                // Decrease usage count
                letterUsage[prevLetter] = (letterUsage[prevLetter] || 1) - 1;
                if (letterUsage[prevLetter] <= 0) {
                    letterUsage[prevLetter] = 0;
                    showDragItem(prevLetter);
                }
                box.textContent = '';
            }
        });
    });

    function hideDragItem(letter) {
        const items = document.querySelectorAll('.draggable');
        items.forEach(item => {
            if (item.textContent === letter) {
                item.style.visibility = 'hidden';  // Hide but keep space
            }
        });
    }

    function showDragItem(letter) {
        const items = document.querySelectorAll('.draggable');
        items.forEach(item => {
            if (item.textContent === letter) {
                item.style.visibility = 'visible';
            }
        });
    }
});

function playAudio() {
    document.getElementById("audio").play();
  }
  
  function checkAnswer() {
    const boxes = document.querySelectorAll(".drop-box");
    const user_components = {};

    boxes.forEach(box => {
        const part = box.dataset.part;  // "top", "left", etc.
        const letter = box.textContent.trim();
        if (letter) {
            user_components[part] = letter;
        } else {
            user_components[part] = "";  // If box is empty, store an empty string
        }
    });

    // Debugging: Log the user_components to check data before sending
    console.log(user_components);

    fetch("/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ components: user_components })
    })
    .then(res => res.json())
    .then(data => {
        const result = document.getElementById("result");
        if (data.correct) {
            result.textContent = "✅ Correct!";
            result.style.color = "green";
    
            // After a short delay (like 1 second), load a new word automatically
            setTimeout(() => {
                loadNewWord();
            }, 1000);
        } else {
            result.textContent = "❌ Wrong!";
            result.style.color = "red";
    
            // Stay on the same word (do not change anything)
        }
    });
    
}

  
  function loadNewWord() {
    fetch("/get-word")
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                document.getElementById("result").textContent = "❌ Error loading new word.";
                return;
            }

            // Update image and audio
            document.querySelector('.word-image').src = data.img_path;
            document.getElementById('audio').src = data.audio_path;

            // Clear drop boxes
            const dropBoxes = document.querySelectorAll('.drop-box');
            dropBoxes.forEach(box => box.textContent = '');

            // Replace drag-area letters
            const dragArea = document.getElementById('drag-area');
            dragArea.innerHTML = '';  // Clear previous

            data.shuffled.forEach(letter => {
                const div = document.createElement('div');
                div.className = 'draggable';
                div.draggable = true;
                div.textContent = letter;

                div.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData("text/plain", div.textContent);
                });

                dragArea.appendChild(div);
            });

            // Update correct length variable
            window.correctLength = data.components.length;

            // Clear result message
            document.getElementById("result").textContent = '';
        });
}

  