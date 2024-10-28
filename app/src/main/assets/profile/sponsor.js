let animationQueue = [];
function anim(fromId, interval) {
    const frames = document.querySelectorAll(`#${fromId} pre`);
    const view = document.getElementById('view');
    let currentFrame = 0;

    return new Promise((resolve) => {
        function showNextFrame() {
            view.textContent = frames[currentFrame].textContent;
            currentFrame++;
            
            if (currentFrame >= frames.length) {
                clearInterval(animation);
                resolve();
            }
        }

        const animation = setInterval(showNextFrame, interval);
        showNextFrame();
    });
}
async function autoPlayAnimations() {
    while (true) {
        if (animationQueue.length > 0) {
            const [id, interval] = animationQueue.shift();
            await anim(id, interval);
        } else {
            await new Promise(resolve => setTimeout(resolve, 10)); // 等待 10ms 后再检查队列
        }
    }
}
function addAnimation(id, interval) {
    animationQueue.push([id, interval]);
}
addAnimation('wag_tail', 100);

autoPlayAnimations();

var sponsors = [
    "中二病nono",
    "就是冰糖丫",
    "沼泽",
    "Lumix",
    "星越子",
    "春天里的故事",
    "皇家隼隼",
    "矜spirit",
    "小河Vitchz",
    "Kosma",
    "浪漫至死不渝",
    "下北泽大现充",
    "fgdgdf",
    "周全zzzzz",
    "小蘇菌"
];

sponsors.forEach(function(sponsor) {
    _ie({
        tag : "p",
        innerHTML : sponsor,
        className : "draggable",
        draggable : "true"
    },document.getElementById("sponsors"))
});

const draggables = document.querySelectorAll('.draggable');
const dropzone = document.getElementById('view');
let draggedElement = null;

draggables.forEach(draggable => {
    draggable.addEventListener('touchstart', (event) => {
        draggedElement = event.target;
        event.target.style.opacity = 0.5; 
    });

    draggable.addEventListener('touchend', () => {
        if (draggedElement) {
            draggedElement.style.opacity = 1;
            draggedElement = null;
        }
    });

    draggable.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = touch.pageX + 'px';
        draggedElement.style.top = touch.pageY + 'px';

        const dropzoneRect = dropzone.getBoundingClientRect();
        const draggedRect = draggedElement.getBoundingClientRect();

        if (
            draggedRect.left < dropzoneRect.right &&
            draggedRect.right > dropzoneRect.left &&
            draggedRect.top < dropzoneRect.bottom &&
            draggedRect.bottom > dropzoneRect.top
        ) {
            draggedElement.remove();
            addAnimation('wag_tail', 100);
            draggedElement = null;
            ate();
        }
    });
});


function ate() {
    const view = document.getElementById('view');
    
    const currentFontSize = parseInt(window.getComputedStyle(view).fontSize);
    view.style.fontSize = (currentFontSize + 1) + 'px';

    if (Math.random() < 0.2) {
        const randomIndex = Math.floor(Math.random() * buff.length);
        buff[randomIndex]();
    }
}
function animateColor() {
    const view = document.getElementById('view');
    gsap.to(view, {
        color: "rgb(255, 0, 0)",
        duration: 1,
        onComplete: () => {
            gsap.to(view, {
                color: "rgb(0, 255, 0)",
                duration: 1,
                onComplete: () => {
                    gsap.to(view, {
                        color: "rgb(0, 0, 255)",
                        duration: 1,
                        onComplete: () => {
                            animateColor();
                        }
                    });
                }
            });
        }
    });
}
function createCharacterRain() {
    const container = document.getElementById('window');
    const characters = "喵❤$￥喵";
    const numChars = 50;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    for (let i = 0; i < numChars; i++) {
        const charElement = document.createElement('div');
        charElement.textContent = characters.charAt(Math.floor(Math.random() * characters.length));
        charElement.style.position = 'absolute';
        charElement.style.left = `${Math.random() * (containerWidth - 20)}px`;
        charElement.style.fontSize = '20px';
        charElement.style.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        container.appendChild(charElement);
        animateRainDrop(charElement, containerHeight);
    }
}
function animateRainDrop(element) {
    const fallDistance = 300;
    gsap.to(element, {
        y: fallDistance,
        duration: Math.random(),
        onComplete: () => {
            element.remove();
        }
    });
}
var buff = [
    function(){
        animateColor();
    },
    function(){
        createCharacterRain();
    },
    function(){
        createCharacterRain();
    },
    function(){
        createCharacterRain();
    },
    function(){
        createCharacterRain();
    },
    function(){
        createCharacterRain();
    },
    function(){
        createCharacterRain();
    },
]

document.getElementById('back').addEventListener('click', function() {
    window.location.href = 'profile.html';
});