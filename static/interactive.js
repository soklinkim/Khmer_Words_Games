// Create drop targets based on correct word length
const dropZone = document.getElementById("drop-zone");

for (let i = 0; i < correctLength; i++) {
    const box = document.createElement("div");
    box.classList.add("drop-box");
    box.setAttribute("data-index", i);
    box.ondragover = (e) => e.preventDefault();
    box.ondrop = (e) => {
        const letter = e.dataTransfer.getData("text/plain");
        box.textContent = letter;
        box.classList.add("filled");
    };
    dropZone.appendChild(box);
}

// Setup draggable letters
const draggables = document.querySelectorAll(".draggable");
draggables.forEach(item => {
    item.ondragstart = (e) => {
        e.dataTransfer.setData("text/plain", item.textContent);
    };
});

// Play pronunciation
function playAudio() {
    const audio = document.getElementById("audio");
    audio.play();
}

// Submit word to Flask
function checkAnswer() {
    const boxes = document.querySelectorAll(".drop-box");
    let user_word = "";
    boxes.forEach(box => {
        user_word += box.textContent.trim();
    });

    fetch("/check", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_word: user_word })
    })
    .then(response => response.json())
    .then(data => {
        const result = document.getElementById("result");
        if (data.correct) {
            result.textContent = "🎉 Correct! Good job!";
            result.style.color = "green";
            setTimeout(() => {
                window.location.reload(); // load a new word
            }, 1500);
        } else {
            result.textContent = "❌ Try again!";
            result.style.color = "red";
        }
    });
}
