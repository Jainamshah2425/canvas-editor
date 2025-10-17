// Toolbar Component
// Contains all the tools for manipulating canvas objects

import './Toolbar.css';

function Toolbar({ 
  onAddRectangle, 
  onAddCircle, 
  onAddText, 
  onTogglePen, 
  onDelete, 
  onSave, 
  onColorChange,
  selectedColor,
  isPenActive,
  hasSelectedObject,
  isSaving,
  // Text customization
  fontSize,
  fontFamily,
  onFontSizeChange,
  onFontFamilyChange,
  isTextSelected,
  // Pen tool
  penWidth,
  onPenWidthChange
}) {
  
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3>🎨 Tools</h3>
        
        {/* Shape Tools */}
        <div className="tool-group">
          <button 
            className="tool-button"
            onClick={onAddRectangle}
            title="Add Rectangle"
          >
            ⬜ Rectangle
          </button>
          
          <button 
            className="tool-button"
            onClick={onAddCircle}
            title="Add Circle"
          >
            ⚫ Circle
          </button>
          
          <button 
            className="tool-button"
            onClick={onAddText}
            title="Add Text"
          >
            📝 Text
          </button>
          
          <button 
            className={`tool-button ${isPenActive ? 'active' : ''}`}
            onClick={onTogglePen}
            title="Drawing Tool"
          >
            ✏️ {isPenActive ? 'Stop Drawing' : 'Draw'}
          </button>
        </div>
      </div>

      {/* Pen Tool Settings - shown when pen is active */}
      {isPenActive && (
        <div className="toolbar-section">
          <h3>✏️ Pen Settings</h3>
          <div className="tool-group">
            <div className="color-picker-group">
              <label htmlFor="penColorPicker">Color:</label>
              <input
                id="penColorPicker"
                type="color"
                value={selectedColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="color-input"
                title="Change Pen Color"
              />
            </div>
            
            <div className="slider-group">
              <label htmlFor="penWidth">
                Width: <strong>{penWidth}px</strong>
              </label>
              <input
                id="penWidth"
                type="range"
                min="1"
                max="50"
                value={penWidth}
                onChange={(e) => onPenWidthChange(Number(e.target.value))}
                className="slider-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Text Settings - shown when text is selected */}
      {isTextSelected && (
        <div className="toolbar-section">
          <h3>📝 Text Settings</h3>
          <div className="tool-group">
            <div className="slider-group">
              <label htmlFor="fontSize">
                Size: <strong>{fontSize}px</strong>
              </label>
              <input
                id="fontSize"
                type="range"
                min="8"
                max="120"
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="slider-input"
              />
            </div>
            
            <div className="select-group">
              <label htmlFor="fontFamily">Font:</label>
              <select
                id="fontFamily"
                value={fontFamily}
                onChange={(e) => onFontFamilyChange(e.target.value)}
                className="select-input"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Impact">Impact</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Color Picker - Always visible */}
      <div className="toolbar-section">
        <h3>� Color</h3>
        <div className="tool-group">
          <div className="color-picker-group">
            <label htmlFor="globalColorPicker">Pick Color:</label>
            <input
              id="globalColorPicker"
              type="color"
              value={selectedColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="color-input"
              title="Choose Color"
            />
          </div>
          <div className="color-info">
            Current: <span className="color-preview" style={{ background: selectedColor }}></span>
            <code>{selectedColor}</code>
          </div>
        </div>
      </div>

      {/* Object Manipulation */}
      <div className="toolbar-section">
        <h3>🎯 Edit</h3>
        
        <div className="tool-group">
          <button 
            className="tool-button delete-button"
            onClick={onDelete}
            disabled={!hasSelectedObject}
            title="Delete Selected Object"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="toolbar-section">
        <button 
          className="tool-button save-button"
          onClick={onSave}
          disabled={isSaving}
          title="Save Canvas to Cloud"
        >
          {isSaving ? '⏳ Saving...' : '💾 Save Canvas'}
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
