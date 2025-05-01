document.addEventListener('DOMContentLoaded', () => {
    const dropBoxes = document.querySelectorAll('.drop-box');
    const dragItems = document.querySelectorAll('.draggable');

    // Allow dragging
    dragItems.forEach(item => {
        item.dataset.letter = item.textContent;
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData("text/plain", item.textContent);
        });
    });

    dropBoxes.forEach(box => {
        box.ondragover = e => e.preventDefault();

        box.ondrop = e => {
            e.preventDefault();
            const data = e.dataTransfer.getData("text/plain");

            // Check for duplicates in drop boxes
            const isDuplicate = [...dropBoxes].some(b => b.textContent === data);
            if (isDuplicate) return;

            box.textContent = data;

            // Hide the dragged letter from the pool
            const items = document.querySelectorAll('.draggable');
            for (const item of items) {
                if (item.dataset.letter === data && item.style.visibility !== 'hidden') {
                    item.style.visibility = 'hidden';
                    break;  // Hide only one matching letter
                }
            }            
        };

        // Click to remove letter from drop box and show back in drag pool
        box.addEventListener('click', () => {
            const removedLetter = box.textContent.trim();
            box.textContent = '';

            // Make the letter visible again in drag area
            const items = document.querySelectorAll('.draggable');
            for (const item of items) {
                if (item.dataset.letter === removedLetter && item.style.visibility === 'hidden') {
                    item.style.visibility = 'visible';
                    break;  // Show only one hidden instance
                }
            }            
        });
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
            result.textContent = "✅ ត្រឹមត្រូវ!";
            result.style.color = "green";
    
            // After a short delay (like 1 second), load a new word automatically
            setTimeout(() => {
                loadNewWord();
            }, 1000);
        } else {
            result.textContent = "❌ ខុស!";
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
                div.dataset.letter = letter;


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

  