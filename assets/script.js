const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let placedFeatures = [];
let selectedFeature = null;
let isDragging = false;
let isResizing = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Load categories & features from PHP
fetch('load_features.php')
  .then(res => res.json())
  .then(data => {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';

    for (let category in data) {
      const li = document.createElement('li');
      li.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      li.dataset.category = category;
      li.addEventListener('click', () => {
        loadFeaturesFromList(data[category], category);
      });
      categoryList.appendChild(li);
    }
  });

function loadFeaturesFromList(imageList, category) {
  const container = document.getElementById('featureContainer');
  document.getElementById('featureTitle').textContent =
    category.charAt(0).toUpperCase() + category.slice(1);
  container.innerHTML = '';

  imageList.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.classList.add('feature');
    img.draggable = true;
    img.addEventListener('dragstart', e => {
      e.dataTransfer.setData('src', e.target.src);
    });
    container.appendChild(img);
  });
}

// Allow dropping onto canvas
canvas.addEventListener('dragover', e => e.preventDefault());
canvas.addEventListener('drop', e => {
  e.preventDefault();
  const src = e.dataTransfer.getData('src');
  const img = new Image();
  img.src = src;
  img.onload = () => {
    placedFeatures.push({
      img,
      x: e.offsetX - 40,
      y: e.offsetY - 40,
      width: 80,
      height: 80
    });
    drawAll();
  };
});

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  placedFeatures.forEach(f => {
    ctx.drawImage(f.img, f.x, f.y, f.width, f.height);
    if (f === selectedFeature) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(f.x, f.y, f.width, f.height);
      ctx.fillStyle = 'red';
      ctx.fillRect(f.x + f.width - 8, f.y + f.height - 8, 8, 8);
    }
  });
}

// Select feature
canvas.addEventListener('mousedown', e => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  selectedFeature = null;
  for (let i = placedFeatures.length - 1; i >= 0; i--) {
    let f = placedFeatures[i];
    if (mouseX >= f.x && mouseX <= f.x + f.width &&
        mouseY >= f.y && mouseY <= f.y + f.height) {
      selectedFeature = f;
      if (mouseX >= f.x + f.width - 8 && mouseY >= f.y + f.height - 8) {
        isResizing = true;
      } else {
        isDragging = true;
        dragOffsetX = mouseX - f.x;
        dragOffsetY = mouseY - f.y;
      }
      break;
    }
  }
  drawAll();
});

// Move/resize
canvas.addEventListener('mousemove', e => {
  if (!selectedFeature) return;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  if (isDragging) {
    selectedFeature.x = mouseX - dragOffsetX;
    selectedFeature.y = mouseY - dragOffsetY;
    drawAll();
  } else if (isResizing) {
    selectedFeature.width = mouseX - selectedFeature.x;
    selectedFeature.height = mouseY - selectedFeature.y;
    drawAll();
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  isResizing = false;
});

// Delete key
document.addEventListener('keydown', e => {
  if (e.key === 'Delete' && selectedFeature) {
    placedFeatures = placedFeatures.filter(f => f !== selectedFeature);
    selectedFeature = null;
    drawAll();
  }
});

// Buttons
document.getElementById('deleteBtn').addEventListener('click', () => {
  if (selectedFeature) {
    placedFeatures = placedFeatures.filter(f => f !== selectedFeature);
    selectedFeature = null;
    drawAll();
  } else {
    alert("No feature selected to delete.");
  }
});

document.getElementById('clearBtn').addEventListener('click', () => {
  placedFeatures = [];
  selectedFeature = null;
  drawAll();
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'composite.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
