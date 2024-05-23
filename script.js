let editor = document.getElementById('editor');
let elementsList = document.getElementById('elements');
let editorTools = document.getElementById('editor-tools');
let activeElement = null;
let elementCounter = {
	text: 0,
	image: 0,
	div: 0,
};

function addText() {
	elementCounter.text++;
	let textElement = document.createElement('p');
	textElement.className = `text_${elementCounter.text}`;
	textElement.contentEditable = true;
	textElement.innerText = 'Editable Text';
	makeElementDraggable(textElement);
	editor.appendChild(textElement);
	updateElementsList();
	updateCode();
}

function addImage() {
	elementCounter.image++;
	let imgElement = document.createElement('img');
	imgElement.className = `image_${elementCounter.image}`;
	imgElement.src = 'https://via.placeholder.com/100';
	imgElement.style.width = '100px';
	imgElement.style.height = '100px';
	makeElementDraggable(imgElement);
	editor.appendChild(imgElement);
	updateElementsList();
	updateCode();
}

function addDiv() {
	elementCounter.div++;
	let divElement = document.createElement('div');
	divElement.className = `div_${elementCounter.div}`;
	divElement.innerText = 'Container';
	makeElementDraggable(divElement);
	editor.appendChild(divElement);
	updateElementsList();
	updateCode();
}

function makeElementDraggable(element) {
	element.style.position = 'absolute';
	element.style.top = '50px';
	element.style.left = '50px';
	element.onmousedown = dragMouseDown;
	element.onclick = showTools;
	element.ondragstart = function () {
		return false;
	};
}

function dragMouseDown(e) {
	e = e || window.event;
	e.preventDefault();

	let element = this;
	let offsetX = e.clientX - element.offsetLeft;
	let offsetY = e.clientY - element.offsetTop;

	document.onmouseup = closeDragElement;
	document.onmousemove = elementDrag;

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();

		element.style.top = e.clientY - offsetY + 'px';
		element.style.left = e.clientX - offsetX + 'px';
	}

	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
		updateCode();
	}
}

function showTools(event) {
	event.stopPropagation();
	activeElement = event.target;
	let rect = activeElement.getBoundingClientRect();
	editorTools.style.top = rect.bottom + 'px';
	editorTools.style.left = rect.left + 'px';
	editorTools.style.display = 'block';

	if (activeElement.tagName === 'P') {
		document.getElementById('text-tools').style.display = 'block';
		document.getElementById('image-tools').style.display = 'none';
		document.getElementById('text-content').value = activeElement.innerText;
		document.getElementById('font-size').value = window
			.getComputedStyle(activeElement)
			.fontSize.replace('px', '');
		document.getElementById('font-weight').value =
			window.getComputedStyle(activeElement).fontWeight;
		document.getElementById('font-style').value =
			window.getComputedStyle(activeElement).fontStyle;
	} else if (activeElement.tagName === 'IMG') {
		document.getElementById('text-tools').style.display = 'none';
		document.getElementById('image-tools').style.display = 'block';
		document.getElementById('image-src').value = activeElement.src;
		document.getElementById('image-width').value = activeElement.width;
		document.getElementById('image-height').value = activeElement.height;
	}
}

function hideTools(event) {
	if (event.target !== activeElement) {
		editorTools.style.display = 'none';
	}
}

function updateTextContent() {
	activeElement.innerText = document.getElementById('text-content').value;
	updateCode();
}

function updateTextFontSize() {
	activeElement.style.fontSize =
		document.getElementById('font-size').value + 'px';
	updateCode();
}

function updateTextFontWeight() {
	activeElement.style.fontWeight = document.getElementById('font-weight').value;
	updateCode();
}

function updateTextFontStyle() {
	activeElement.style.fontStyle = document.getElementById('font-style').value;
	updateCode();
}

function updateImageSrc() {
	activeElement.src = document.getElementById('image-src').value;
	updateCode();
}

function updateImageSize() {
	activeElement.style.width =
		document.getElementById('image-width').value + 'px';
	activeElement.style.height =
		document.getElementById('image-height').value + 'px';
	updateCode();
}

function updateElementsList() {
	elementsList.innerHTML = '';
	Array.from(editor.children).forEach((child, index) => {
		let listItem = document.createElement('li');
		listItem.innerText = `${child.tagName.toLowerCase()}_${index + 1}`;
		listItem.draggable = true;
		listItem.onclick = () => {
			activeElement = child;
			showTools({ target: child });
		};
		listItem.ondragstart = event => {
			event.dataTransfer.setData('text/plain', index.toString());
		};
		elementsList.appendChild(listItem);
	});
}

elementsList.ondragover = event => {
	event.preventDefault();
};

elementsList.ondrop = event => {
	event.preventDefault();
	let draggedIndex = event.dataTransfer.getData('text/plain');
	let targetIndex = Array.from(elementsList.children).indexOf(
		event.target.closest('li')
	);
	if (draggedIndex != null && targetIndex != null) {
		let draggedElement = editor.children[draggedIndex];
		let targetElement = editor.children[targetIndex];
		editor.insertBefore(draggedElement, targetElement.nextSibling);
		updateElementsList();
		updateCode();
	}
};
function updateCode() {
	let codeContainer = document.getElementById('code');
	let sectionTitle = document.getElementById('section-title').value;
	let htmlContent = '';
	let styleContent = '';

	// Generate HTML and styles for each element
	Array.from(editor.children).forEach(child => {
		let className = child.className;
		let style = window.getComputedStyle(child);
		let elementStyle = `top: ${child.style.top}; left: ${child.style.left}; position: absolute;`;

		// Add HTML for each element
		if (
			child.tagName === 'P' ||
			child.tagName === 'DIV' ||
			child.tagName === 'IMG'
		) {
			htmlContent += `<${child.tagName.toLowerCase()} class="${className}">${
				child.innerText
			}</${child.tagName.toLowerCase()}>`;
		}

		// Build style content for each element
		if (child.tagName === 'P') {
			elementStyle += ` font-size: ${style.fontSize}; font-weight: ${style.fontWeight}; font-style: ${style.fontStyle};`;
		} else if (child.tagName === 'IMG') {
			elementStyle += ` width: ${style.width}; height: ${style.height};`;
		}

		styleContent += `.${className} { ${elementStyle} }\n`;
	});

	let code = `<section title="${sectionTitle}">\n${htmlContent}\n</section>\n<style>\n${styleContent}</style>`;
	codeContainer.innerText = code;
}
