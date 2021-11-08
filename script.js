const inputs = document.querySelectorAll('.filters input');
const saveValue = Array.from(inputs).map(input => {
    return input.value;
});

function handleUpdate() {
    document.documentElement.style.setProperty(`--${this.name}`, this.value + this.dataset.sizing);
    this.parentElement.querySelector('[name=result]').value = this.value;
}

const resetButton = document.querySelector('.btn-reset');
resetButton.addEventListener ('click', event => {
    inputs.forEach((input, index) => {
        input.value = saveValue[index];
        handleUpdate.call(input);
    })    
});

inputs.forEach(input => input.addEventListener('input', handleUpdate));

function dayTime() {
    let nowTime = new Date();
    let hours = nowTime.getHours();
    if (hours >= 6 && hours < 12) {
        return 'morning';
    } else if (hours >= 12 && hours < 18) {
        return 'day';
    } else if (hours >= 18 && hours < 24) {
        return 'evening';
    } else {
        return 'night';
    }     
}

function getPictureSrc(day, number) {
    if (number < 10) {
        number = '0' + number;
    }
    return `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${day}/${number}.jpg`;
}

let pictureNumber = 1;

let dayTimeResult = dayTime();

function pictureSwitch () {
    let getPictureResult = getPictureSrc(dayTimeResult, pictureNumber);
    const image = document.querySelector('img');
    image.src = getPictureResult;
    pictureNumber ++;
    if (pictureNumber > 20) {
        pictureNumber = 1;
    }
}

// pictureSwitch ();

const nextButton = document.querySelector('.btn-next');
nextButton.addEventListener('click', pictureSwitch);

const screen = document.querySelector('.fullscreen');
screen.addEventListener('click', event => {
    if(document.fullscreenElement){
        document.exitFullscreen();
    } else {
        document.querySelector('html').requestFullscreen();
    }       
});

const fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', function(e) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
    document.querySelector('img').src = reader.result;
    fileInput.value = null;
  }
    reader.readAsDataURL(file);
});

const canvas = document.createElement('canvas');

const saveButton = document.querySelector('.btn-save');
const editor = document.querySelector('.editor');
saveButton.addEventListener('click', drawImage);

function drawImage(e) {
	const style = getComputedStyle(document.documentElement);
	let blur = style.getPropertyValue("--blur").trim();
	const invert = style.getPropertyValue("--invert").trim();
	const sepia = style.getPropertyValue("--sepia").trim();
	const saturate = style.getPropertyValue("--saturate").trim();
	const hue = style.getPropertyValue("--hue-rotate").trim();
	const originalImage = editor.querySelector('img');
	const k = originalImage.naturalHeight / originalImage.height;
	let img = new Image();
	img.setAttribute('crossOrigin', 'anonymous');
	img.src = editor.querySelector('img').src;
	img.onload = () => {
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext('2d');
		blur = Math.floor(parseInt(blur) * k) + "px";
		ctx.filter = `blur(${blur}) invert(${invert}) sepia(${sepia}) saturate(${saturate}) hue-rotate(${hue})`;
		ctx.drawImage(img, 0, 0);
		const dataUrl = canvas.toDataURL("image/png");
		const link = document.createElement('a');
		link.download = "image.png";
		link.href = dataUrl;
		link.click();
		link.delete;
	}
}
