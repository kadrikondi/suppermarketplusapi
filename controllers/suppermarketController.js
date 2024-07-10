import SUP from "../model/supermarketModel.js";
import mongoose from "mongoose";
export const createSupermarket = async (req, res) => {
  try {
    // Extract necessary fields from the request body
    const { name, phone, email, street, city, state, whatsappno, building } =
      req.body;

    // Get createdBy from request params
    const createdBy = req.params.id;

    // Check if any required field is empty
    if (
      !name ||
      !phone ||
      !email ||
      !street ||
      !city ||
      !state ||
      !whatsappno ||
      !building
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the createdBy is valid
    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Create a new Supermarket instance
    const newSupermarket = new SUP({
      name,
      phone,
      email,
      street,
      city,
      state,
      building,
      whatsappno,
      createdBy,
    });

    // Save the new supermarket to the database
    const savedSupermarket = await newSupermarket.save();

    // Respond with the saved supermarket data
    res.status(201).json({ messsage: "successs", super: savedSupermarket });
  } catch (error) {
    // Handle errors
    console.error("Error creating supermarket:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the supermarket" });
  }
};
// default createSupermarket;
// uploadpicture
// add likes

// Update a supermarket by ID
// Update a supermarket by ID
export const updateSupermarket = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is valid
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid supermarket ID" });
    }

    // Validate user input (for example, ensuring that required fields are present)user
    const { name, phone, email, street, city, state, whatsappno } = req.body;
    if (
      !name ||
      !phone ||
      !email ||
      !street ||
      !city ||
      !state ||
      !whatsappno
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find the supermarket by ID and update it
    const updatedSupermarket = await SUP.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    // Check if the supermarket exists
    if (!updatedSupermarket) {
      return res.status(404).json({ error: "Supermarket not found" });
    }

    // Respond with the updated supermarket data
    res.json(updatedSupermarket);
  } catch (error) {
    // Handle errors
    console.error("Error updating supermarket:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the supermarket" });
  }
};

// Get all supermarkets
export const getAllSupermarkets = async (req, res) => {
  try {
    // Retrieve all supermarkets from the database
    const supermarkets = await SUP.find();

    // Respond with the list of supermarkets
    res.json(supermarkets);
  } catch (error) {
    // Handle errors
    console.error("Error fetching supermarkets:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching supermarkets" });
  }
};

// Get one supermarket by ID
export const getOneSupermarketById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is valid
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid supermarket ID" });
    }

    // Find the supermarket by ID
    const supermarket = await SUP.findById(id);

    // Check if the supermarket exists
    if (!supermarket) {
      return res.status(404).json({ error: "Supermarket not found" });
    }

    // Respond with the supermarket data
    res.json(supermarket);
  } catch (error) {
    // Handle errors
    console.error("Error fetching supermarket:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the supermarket" });
  }
};

// Delete a supermarket by ID
export const deleteSupermarket = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is valid
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid supermarket ID" });
    }

    // Find the supermarket by ID and delete it
    const deletedSupermarket = await SUP.findByIdAndDelete(id);

    // Check if the supermarket exists
    if (!deletedSupermarket) {
      return res.status(404).json({ error: "Supermarket not found" });
    }

    // Respond with a success message
    res.json({ message: "Supermarket deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error deleting supermarket:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the supermarket" });
  }
};
