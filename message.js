const messageText = "Ты моё всё, я с тобой рядышком и до конца, ты важна для меня и мы преодолеем всё, любимая";
const container = document.getElementById('animated-message');
let index = 0;

function typeWriter() {
    if (index < messageText.length) {
        container.textContent += messageText[index];
        index++;
        setTimeout(typeWriter, 50);
    }
}

typeWriter();
