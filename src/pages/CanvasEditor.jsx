// Canvas Editor Page Component
// Main page where users can create and edit their canvas

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as fabric from 'fabric';
import { saveCanvasData, getCanvasData } from '../config/supabase';
import Toolbar from '../components/Toolbar';
import './CanvasEditor.css';

function CanvasEditor() {
  // Get canvasId from URL parameters (e.g., /canvas/:canvasId)
  const { canvasId } = useParams();
  
  // Reference to the canvas HTML element
  const canvasRef = useRef(null);
  
  // Reference to the Fabric.js canvas instance
  const fabricCanvasRef = useRef(null);
  
  // Component state
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#3498db');
  const [isPenActive, setIsPenActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Text customization state
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Arial');
  
  // Pen tool state
  const [penWidth, setPenWidth] = useState(3);

  /**
   * Initialize Fabric.js canvas and load existing data
   */
  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 250, // Account for toolbar width
      height: window.innerHeight,
      backgroundColor: '#ffffff',
    });
    
    // Store canvas instance in ref
    fabricCanvasRef.current = canvas;
    
    // Load existing canvas data from Firestore
    loadCanvasFromFirestore();
    
    // Listen for object selection events
    canvas.on('selection:created', handleObjectSelection);
    canvas.on('selection:updated', handleObjectSelection);
    canvas.on('selection:cleared', () => setSelectedObject(null));
    
    // Handle window resize
    const handleResize = () => {
      canvas.setWidth(window.innerWidth - 250);
      canvas.setHeight(window.innerHeight);
      canvas.renderAll();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function - destroy canvas when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [canvasId]); // Re-run if canvasId changes

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete key or Backspace to delete selected object
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedObject) {
        // Prevent default browser back navigation on Backspace
        e.preventDefault();
        deleteSelectedObject();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedObject]);

  /**
   * Load canvas data from Firestore
   */
  const loadCanvasFromFirestore = async () => {
    try {
      setIsLoading(true);
      const canvasData = await getCanvasData(canvasId);
      
      if (canvasData && fabricCanvasRef.current) {
        // Load the saved canvas JSON into Fabric.js
        fabricCanvasRef.current.loadFromJSON(canvasData, () => {
          fabricCanvasRef.current.renderAll();
          console.log('Canvas loaded successfully');
        });
      } else {
        console.log('No existing canvas data, starting with blank canvas');
      }
    } catch (error) {
      console.error('Error loading canvas:', error);
      alert('Failed to load canvas. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle object selection
   */
  const handleObjectSelection = (e) => {
    const activeObject = e.selected[0];
    setSelectedObject(activeObject);
    
    // Update color picker to match selected object's color
    if (activeObject && activeObject.fill) {
      setSelectedColor(activeObject.fill);
    }
  };

  /**
   * Add a rectangle to the canvas
   */
  const addRectangle = () => {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 150,
      height: 100,
      fill: selectedColor,
      stroke: '#000',
      strokeWidth: 2,
    });
    
    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
    fabricCanvasRef.current.renderAll();
  };

  /**
   * Add a circle to the canvas
   */
  const addCircle = () => {
    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      radius: 60,
      fill: selectedColor,
      stroke: '#000',
      strokeWidth: 2,
    });
    
    fabricCanvasRef.current.add(circle);
    fabricCanvasRef.current.setActiveObject(circle);
    fabricCanvasRef.current.renderAll();
  };

  /**
   * Add text to the canvas
   */
  const addText = () => {
    const text = new fabric.IText('Double-click to edit', {
      left: 100,
      top: 100,
      fontSize: fontSize,
      fill: selectedColor,
      fontFamily: fontFamily,
    });
    
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  };
  
  /**
   * Update font size of selected text
   */
  const updateFontSize = (newSize) => {
    setFontSize(newSize);
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();
    
    if (activeObject && (activeObject.type === 'i-text' || activeObject.type === 'text')) {
      activeObject.set('fontSize', newSize);
      canvas.renderAll();
    }
  };
  
  /**
   * Update font family of selected text
   */
  const updateFontFamily = (newFont) => {
    setFontFamily(newFont);
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();
    
    if (activeObject && (activeObject.type === 'i-text' || activeObject.type === 'text')) {
      activeObject.set('fontFamily', newFont);
      canvas.renderAll();
    }
  };

  /**
   * Toggle drawing/pen mode
   */
  const togglePenMode = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    if (isPenActive) {
      // Disable drawing mode
      canvas.isDrawingMode = false;
      setIsPenActive(false);
    } else {
      // Enable drawing mode
      canvas.isDrawingMode = true;
      
      // Initialize brush if it doesn't exist
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }
      
      // Set brush properties
      canvas.freeDrawingBrush.color = selectedColor;
      canvas.freeDrawingBrush.width = penWidth;
      
      setIsPenActive(true);
    }
  };
  
  /**
   * Update pen width
   */
  const updatePenWidth = (newWidth) => {
    setPenWidth(newWidth);
    const canvas = fabricCanvasRef.current;
    
    if (canvas && canvas.isDrawingMode) {
      // Initialize brush if it doesn't exist
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }
      canvas.freeDrawingBrush.width = newWidth;
    }
  };

  /**
   * Delete the currently selected object
   */
  const deleteSelectedObject = () => {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
      setSelectedObject(null);
    }
  };

  /**
   * Change color of selected object
   */
  const changeObjectColor = (color) => {
    setSelectedColor(color);
    
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    
    if (activeObject) {
      // Update fill color for shapes
      if (activeObject.set) {
        activeObject.set('fill', color);
        canvas.renderAll();
      }
    }
    
    // Update pen color if in drawing mode
    if (isPenActive && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
  };

  /**
   * Save canvas to Firestore
   */
  const saveCanvas = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');
      
      // Serialize canvas to JSON
      const canvasJSON = fabricCanvasRef.current.toJSON();
      
      // Save to Firestore
      await saveCanvasData(canvasId, canvasJSON);
      
      setSaveMessage('✅ Canvas saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving canvas:', error);
      setSaveMessage('❌ Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="canvas-editor">
      {/* Toolbar on the left */}
      <Toolbar
        onAddRectangle={addRectangle}
        onAddCircle={addCircle}
        onAddText={addText}
        onTogglePen={togglePenMode}
        onDelete={deleteSelectedObject}
        onSave={saveCanvas}
        onColorChange={changeObjectColor}
        selectedColor={selectedColor}
        isPenActive={isPenActive}
        hasSelectedObject={!!selectedObject}
        isSaving={isSaving}
        // Text customization props
        fontSize={fontSize}
        fontFamily={fontFamily}
        onFontSizeChange={updateFontSize}
        onFontFamilyChange={updateFontFamily}
        isTextSelected={selectedObject?.type === 'i-text' || selectedObject?.type === 'text'}
        // Pen tool props
        penWidth={penWidth}
        onPenWidthChange={updatePenWidth}
      />
      
      {/* Canvas area on the right */}
      <div className="canvas-container">
        {/* Header with canvas info */}
        <div className="canvas-header">
          <h2>Canvas Editor</h2>
          <div className="canvas-id">
            Canvas ID: <code>{canvasId}</code>
          </div>
          {saveMessage && (
            <div className={`save-message ${saveMessage.includes('✅') ? 'success' : 'error'}`}>
              {saveMessage}
            </div>
          )}
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner">⏳ Loading canvas...</div>
          </div>
        )}
        
        {/* Fabric.js Canvas */}
        <canvas ref={canvasRef} id="canvas" />
        
        {/* Help text */}
        <div className="help-text">
          💡 Tip: Use toolbar to add shapes, select objects to move/resize/rotate them, press Delete to remove
        </div>
      </div>
    </div>
  );
}

export default CanvasEditor;
