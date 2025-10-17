// Supabase Configuration and Helper Functions
// This file initializes Supabase and provides functions to interact with the database

import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
// Make sure to create a .env file with your Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Creates a new canvas document in Supabase
 * @returns {Promise<string>} The ID of the newly created canvas document
 */
export const createNewCanvas = async () => {
  try {
    // Insert a new row in the 'canvases' table with auto-generated UUID
    const { data, error } = await supabase
      .from('canvases')
      .insert([
        {
          canvas_data: null, // Initially empty canvas
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('New canvas created with ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error creating canvas:', error);
    throw new Error('Failed to create new canvas. Please try again.');
  }
};

/**
 * Saves canvas data to Supabase
 * @param {string} canvasId - The ID of the canvas document to update
 * @param {object} canvasData - The serialized canvas data (JSON from Fabric.js)
 */
export const saveCanvasData = async (canvasId, canvasData) => {
  try {
    // Update the specific canvas row in Supabase
    const { error } = await supabase
      .from('canvases')
      .update({
        canvas_data: canvasData,
        updated_at: new Date().toISOString()
      })
      .eq('id', canvasId);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Canvas saved successfully:', canvasId);
    return true;
  } catch (error) {
    console.error('Error saving canvas:', error);
    throw new Error('Failed to save canvas. Please check your connection and try again.');
  }
};

/**
 * Fetches canvas data from Supabase
 * @param {string} canvasId - The ID of the canvas document to fetch
 * @returns {Promise<object|null>} The canvas data or null if not found
 */
export const getCanvasData = async (canvasId) => {
  try {
    // Fetch the specific canvas row from Supabase
    const { data, error } = await supabase
      .from('canvases')
      .select('canvas_data')
      .eq('id', canvasId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - canvas doesn't exist
        console.log('No canvas found with ID:', canvasId);
        return null;
      }
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Canvas data loaded:', canvasId);
    return data?.canvas_data || null;
  } catch (error) {
    console.error('Error loading canvas:', error);
    throw new Error('Failed to load canvas. Please check your connection and try again.');
  }
};

export default supabase;

