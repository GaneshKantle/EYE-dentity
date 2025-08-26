<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Forensic Face Builder</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Forensic Face Builder</h1>
  </header>

  <div class="main-container">
    <!-- Left Sidebar: Categories -->
    <aside class="sidebar">
      <h2>Categories</h2>
      <ul id="categoryList"></ul>
    </aside>

    <!-- Middle: Canvas -->
    <section class="canvas-section">
      <canvas id="canvas" width="400" height="500"></canvas>
    </section>

    <!-- Right: Features -->
    <aside class="features-panel">
      <div class="feature-controls">
        <button id="saveBtn">Save</button>
        <button id="deleteBtn">Delete Selected</button>
        <button id="clearBtn">Clear All</button>
      </div>
      <h2 id="featureTitle">Select a Category</h2>
      <div id="featureContainer" class="feature-container"></div>
    </aside>
  </div>

  <script src="script.js"></script>
</body>
</html>
