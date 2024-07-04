import React, { useState, useEffect } from "react";
import { storage } from "../firebaseConfig";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "./EditPage.css";

function EditPage() {
  const [image, setImage] = useState(null);
  const [loadedIds, setLoadedIds] = useState({
    academics: [],
    extracurricular: [],
    programs: [],
    workshops: [],
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [sectionsData, setSectionsData] = useState({
    academics: { imageName: "", activeSection: "" },
    extracurricular: { imageName: "", activeSection: "" },
    programs: { imageName: "", activeSection: "" },
    workshops: { imageName: "", activeSection: "" },
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    listAll(ref(storage, "uploads")).then((imgs) => {
      const promises = imgs.items.map((val) => {
        return getDownloadURL(val).then((url) => {
          const id = val.name;
          return { id, url };
        });
      });

      Promise.all(promises).then((results) => {
        const newIds = {
          academics: [],
          extracurricular: [],
          programs: [],
          workshops: [],
        };

        results.forEach(({ id, url }) => {
          if (id.includes("academics")) {
            newIds.academics.push({ id, url });
          } else if (id.includes("extracurricular")) {
            newIds.extracurricular.push({ id, url });
          } else if (id.includes("programs")) {
            newIds.programs.push({ id, url });
          } else if (id.includes("workshops")) {
            newIds.workshops.push({ id, url });
          }
        });

        setLoadedIds(newIds);
      });
    });
  };

  const handleFileChange = (e, section) => {
    // setEditMode(false);
    const file = e.target.files[0];
    setImage(file);
    setSectionsData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], imageName: file.name },
    }));
    setSectionsData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], activeSection: section },
    }));
  };

  const handleDragOver = (e, section) => {
    e.preventDefault();
    e.stopPropagation();
    setSectionsData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], activeSection: section },
    }));
  };

  const handleDrop = (e, section) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    setImage(file);
    setSectionsData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], imageName: file.name },
    }));
    setSectionsData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], activeSection: section },
    }));
  };

  const handleUpload = (section) => {
    if (image !== null) {
      setLoading(true); // Set loading state
      const id = `${section}_${uuidv4()}`;
      const imgRef = ref(storage, `uploads/${id}`);
      uploadBytes(imgRef, image)
        .then(() => getDownloadURL(imgRef))
        .then((url) => {
          const newImage = { id, url };
          const newIds = {
            ...loadedIds,
            [section]: [...loadedIds[section], newImage],
          };
          setLoadedIds(newIds);
          setImage(null);
          setSectionsData((prevData) => ({
            ...prevData,
            [section]: { ...prevData[section], imageName: "" },
          }));
          setLoading(false); // Unset loading state
        })
        .catch((error) => {
          console.error("Error uploading image: ", error);
          setLoading(false); // Unset loading state
        });
    }
  };

  const handleEdit = (id, section) => {
    setEditMode(true);
    setEditId(id);
    setEditing(false);
    setSectionsData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], imageName: "" },
    }));
    setSectionsData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], activeSection: section },
    }));
  };

  const handleSaveEdit = (section) => {
    if (image !== null && editId !== null) {
      setLoading(true); // Set loading state
      const imgRef = ref(storage, `uploads/${editId}`);
      uploadBytes(imgRef, image)
        .then(() => getDownloadURL(imgRef))
        .then((url) => {
          const updatedImages = loadedIds[section].map((item) =>
            item.id === editId ? { id: editId, url } : item
          );

          const newIds = { ...loadedIds, [section]: updatedImages };
          setLoadedIds(newIds);
          setEditMode(false);
          setEditId(null);
          setImage(null);
          setSectionsData((prevData) => ({
            ...prevData,
            [section]: { ...prevData[section], imageName: "" },
          }));
          setLoading(false); // Unset loading state
          setEditing(true);
        })
        .catch((error) => {
          console.error("Error updating image: ", error);
          setLoading(false); // Unset loading state
        });
    }
  };

  const handleCancelEdit = (section) => {
    setEditMode(false);
    setEditId(null);
    setImage(null);
    setSectionsData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], imageName: "" },
    }));
  };

  const handleRemove = (id, section) => {
    const imgRef = ref(storage, `uploads/${id}`);
    deleteObject(imgRef)
      .then(() => {
        const updatedImages = loadedIds[section].filter(
          (item) => item.id !== id
        );
        const newIds = { ...loadedIds, [section]: updatedImages };
        setLoadedIds(newIds);
      })
      .catch((error) => {
        console.error("Error removing image: ", error);
      });
  };

  return (
    <div className="App">
      <div className="sections">
        {/* Academics Section */}
        <div className="section">
          <h1>Academics</h1>
          {/* Upload Section */}
          <div className="upload-section mb">
            {/* File upload label and input */}
            <label
              title="select image"
              htmlFor="file-upload-academics"
              className="custom-file-upload"
            >
              <i className="fas fa-file-upload"></i>
            </label>
            <input
              id="file-upload-academics"
              type="file"
              onChange={(e) => handleFileChange(e, "academics")}
            />
            {/* Drag and drop zone */}
            <div
              title="drag & drop image"
              className="drop-zone"
              onDragOver={(e) => handleDragOver(e, "academics")}
              onDrop={(e) => handleDrop(e, "academics")}
            >
              <p>Drag & Drop or Choose File</p>
            </div>
            {/* Display file name when selected */}
            {sectionsData.academics.activeSection === "academics" &&
              sectionsData.academics.imageName &&
              !editMode && (
                <span
                  title={sectionsData.academics.imageName}
                  className="file-name"
                >
                  {sectionsData.academics.imageName}
                </span>
              )}
            {/* Upload button */}
            <button
              title="upload image"
              className="upload-button"
              onClick={() => handleUpload("academics")}
            >
              Upload
            </button>
          </div>
          {/* Loading spinner during image upload */}
          {loading && sectionsData.academics.activeSection === "academics" && (
            <div className="loading"></div>
          )}
          {/* Image Gallery */}
          <div className="image-gallery">
            {/* Display uploaded images */}
            {loadedIds.academics.map(({ id, url }, index) => (
              <div key={index} className="image-container">
                {/* Display each image */}
                <img src={url} alt={`Academics ${index}`} className="image" />
                {/* Button container for edit and remove */}
                <div className="button-container">
                  {/* Edit button */}
                  <button
                    title="edit"
                    className="edit-button"
                    onClick={() => handleEdit(id, "academics")}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  {/* Remove button */}
                  <button
                    title="remove"
                    className="remove-button"
                    onClick={() => handleRemove(id, "academics")}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
                {/* Edit section when in edit mode */}
                {editMode && editId === id && (
                  <div className="edit-section">
                    {/* File upload label and input for editing */}
                    <div className="upload-section">
                      <label
                        htmlFor="file-edit-academics"
                        className="custom-file-upload"
                      >
                        <i className="fas fa-file-upload"></i>
                      </label>
                      <input
                        id="file-edit-academics"
                        type="file"
                        onChange={(e) => handleFileChange(e, "academics")}
                      />
                      {/* Display current file name */}
                      {sectionsData.academics.activeSection === "academics" &&
                        sectionsData.academics.imageName && (
                          <span
                            title={sectionsData.academics.imageName}
                            className="file-name"
                          >
                            {sectionsData.academics.imageName}
                          </span>
                        )}
                    </div>
                    {/* Save and Cancel buttons */}
                    <div className="edit-controls">
                      <button
                        title="Save edit"
                        className="save-button"
                        onClick={() => handleSaveEdit("academics")}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        title="Cancel edit"
                        className="cancel-edit"
                        onClick={() => handleCancelEdit("academics")}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Extracurricular Section */}
        <div className="section">
          <h1>Extracurricular</h1>
          {/* Upload Section */}
          <div className="upload-section mb">
            {/* File upload label and input */}
            <label
              title="select image"
              htmlFor="file-upload-extracurricular"
              className="custom-file-upload"
            >
              <i className="fas fa-file-upload"></i>
            </label>
            <input
              id="file-upload-extracurricular"
              type="file"
              onChange={(e) => handleFileChange(e, "extracurricular")}
            />
            {/* Drag and drop zone */}
            <div
              title="drag & drop image"
              className="drop-zone"
              onDragOver={(e) => handleDragOver(e, "extracurricular")}
              onDrop={(e) => handleDrop(e, "extracurricular")}
            >
              <p>Drag & Drop or Choose File</p>
            </div>
            {/* Display file name when selected */}
            {sectionsData.extracurricular.activeSection === "extracurricular" &&
              sectionsData.extracurricular.imageName &&
              !editMode && (
                <span
                  title={sectionsData.extracurricular.imageName}
                  className="file-name"
                >
                  {sectionsData.extracurricular.imageName}
                </span>
              )}
            {/* Upload button */}
            <button
              title="upload image"
              className="upload-button"
              onClick={() => handleUpload("extracurricular")}
            >
              Upload
            </button>
          </div>
          {/* Loading spinner during image upload */}
          {loading &&
            sectionsData.extracurricular.activeSection ===
              "extracurricular" && <div className="loading"></div>}
          {/* Image Gallery */}
          <div className="image-gallery">
            {/* Display uploaded images */}
            {loadedIds.extracurricular.map(({ id, url }, index) => (
              <div key={index} className="image-container">
                {/* Display each image */}
                <img
                  src={url}
                  alt={`Extracurricular ${index}`}
                  className="image"
                />
                {/* Button container for edit and remove */}
                <div className="button-container">
                  {/* Edit button */}
                  <button
                    title="edit"
                    className="edit-button"
                    onClick={() => handleEdit(id, "extracurricular")}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  {/* Remove button */}
                  <button
                    title="remove"
                    className="remove-button"
                    onClick={() => handleRemove(id, "extracurricular")}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
                {/* Edit section when in edit mode */}
                {editMode && editId === id && (
                  <div className="edit-section">
                    {/* File upload label and input for editing */}
                    <div className="upload-section">
                      <label
                        htmlFor="file-edit-extracurricular"
                        className="custom-file-upload"
                      >
                        <i className="fas fa-file-upload"></i>
                      </label>
                      <input
                        id="file-edit-extracurricular"
                        type="file"
                        onChange={(e) => handleFileChange(e, "extracurricular")}
                      />
                      {/* Display current file name */}
                      {sectionsData.extracurricular.activeSection ===
                        "extracurricular" &&
                        sectionsData.extracurricular.imageName && (
                          <span
                            title={sectionsData.extracurricular.imageName}
                            className="file-name"
                          >
                            {sectionsData.extracurricular.imageName}
                          </span>
                        )}
                    </div>
                    {/* Save and Cancel buttons */}
                    <div className="edit-controls">
                      <button
                        title="Save edit"
                        className="save-button"
                        onClick={() => handleSaveEdit("extracurricular")}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        title="Cancel edit"
                        className="cancel-edit"
                        onClick={() => handleCancelEdit("extracurricular")}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Programs Section */}
        <div className="section">
          <h1>Programs</h1>
          {/* Upload Section */}
          <div className="upload-section mb">
            {/* File upload label and input */}
            <label
              title="select image"
              htmlFor="file-upload-programs"
              className="custom-file-upload"
            >
              <i className="fas fa-file-upload"></i>
            </label>
            <input
              id="file-upload-programs"
              type="file"
              onChange={(e) => handleFileChange(e, "programs")}
            />
            {/* Drag and drop zone */}
            <div
              title="drag & drop image"
              className="drop-zone"
              onDragOver={(e) => handleDragOver(e, "programs")}
              onDrop={(e) => handleDrop(e, "programs")}
            >
              <p>Drag & Drop or Choose File</p>
            </div>
            {/* Display file name when selected */}
            {sectionsData.programs.activeSection === "programs" &&
              sectionsData.programs.imageName &&
              !editMode && (
                <span
                  title={sectionsData.programs.imageName}
                  className="file-name"
                >
                  {sectionsData.programs.imageName}
                </span>
              )}
            {/* Upload button */}
            <button
              title="upload image"
              className="upload-button"
              onClick={() => handleUpload("programs")}
            >
              Upload
            </button>
          </div>
          {/* Loading spinner during image upload */}
          {loading && sectionsData.programs.activeSection === "programs" && (
            <div className="loading"></div>
          )}
          {/* Image Gallery */}
          <div className="image-gallery">
            {/* Display uploaded images */}
            {loadedIds.programs.map(({ id, url }, index) => (
              <div key={index} className="image-container">
                {/* Display each image */}
                <img src={url} alt={`Programs ${index}`} className="image" />
                {/* Button container for edit and remove */}
                <div className="button-container">
                  {/* Edit button */}
                  <button
                    title="edit"
                    className="edit-button"
                    onClick={() => handleEdit(id, "programs")}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  {/* Remove button */}
                  <button
                    title="remove"
                    className="remove-button"
                    onClick={() => handleRemove(id, "programs")}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
                {/* Edit section when in edit mode */}
                {editMode && editId === id && (
                  <div className="edit-section">
                    {/* File upload label and input for editing */}
                    <div className="upload-section">
                      <label
                        htmlFor="file-edit-programs"
                        className="custom-file-upload"
                      >
                        <i className="fas fa-file-upload"></i>
                      </label>
                      <input
                        id="file-edit-programs"
                        type="file"
                        onChange={(e) => handleFileChange(e, "programs")}
                      />
                      {/* Display current file name */}
                      {sectionsData.programs.activeSection === "programs" &&
                        sectionsData.programs.imageName && (
                          <span
                            title={sectionsData.programs.imageName}
                            className="file-name"
                          >
                            {sectionsData.programs.imageName}
                          </span>
                        )}
                    </div>
                    {/* Save and Cancel buttons */}
                    <div className="edit-controls">
                      <button
                        title="Save edit"
                        className="save-button"
                        onClick={() => handleSaveEdit("programs")}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        title="Cancel edit"
                        className="cancel-edit"
                        onClick={() => handleCancelEdit("programs")}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Workshops & Events Section */}
        <div className="section">
          <h1>Workshops & Events</h1>
          {/* Upload Section */}
          <div className="upload-section mb">
            {/* File upload label and input */}
            <label
              title="select image"
              htmlFor="file-upload-workshops"
              className="custom-file-upload"
            >
              <i className="fas fa-file-upload"></i>
            </label>
            <input
              id="file-upload-workshops"
              type="file"
              onChange={(e) => handleFileChange(e, "workshops")}
            />
            {/* Drag and drop zone */}
            <div
              title="drag & drop image"
              className="drop-zone"
              onDragOver={(e) => handleDragOver(e, "workshops")}
              onDrop={(e) => handleDrop(e, "workshops")}
            >
              <p>Drag & Drop or Choose File</p>
            </div>
            {/* Display file name when selected */}
            {sectionsData.workshops.activeSection === "workshops" &&
              sectionsData.workshops.imageName &&
              !editMode && (
                <span
                  title={sectionsData.workshops.imageName}
                  className="file-name"
                >
                  {sectionsData.workshops.imageName}
                </span>
              )}
            {/* Upload button */}
            <button
              title="upload image"
              className="upload-button"
              onClick={() => handleUpload("workshops")}
            >
              Upload
            </button>
          </div>
          {/* Loading spinner during image upload */}
          {loading && sectionsData.workshops.activeSection === "workshops" && (
            <div className="loading"></div>
          )}
          {/* Image Gallery */}
          <div className="image-gallery">
            {/* Display uploaded images */}
            {loadedIds.workshops.map(({ id, url }, index) => (
              <div key={index} className="image-container">
                {/* Display each image */}
                <img
                  src={url}
                  alt={`Workshops & Events ${index}`}
                  className="image"
                />
                {/* Button container for edit and remove */}
                <div className="button-container">
                  {/* Edit button */}
                  <button
                    title="edit"
                    className="edit-button"
                    onClick={() => handleEdit(id, "workshops")}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  {/* Remove button */}
                  <button
                    title="remove"
                    className="remove-button"
                    onClick={() => handleRemove(id, "workshops")}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
                {/* Edit section when in edit mode */}
                {editMode && editId === id && (
                  <div className="edit-section">
                    {/* File upload label and input for editing */}
                    <div className="upload-section">
                      <label
                        htmlFor="file-edit-workshops"
                        className="custom-file-upload"
                      >
                        <i className="fas fa-file-upload"></i>
                      </label>
                      <input
                        id="file-edit-workshops"
                        type="file"
                        onChange={(e) => handleFileChange(e, "workshops")}
                      />
                      {/* Display current file name */}
                      {sectionsData.workshops.activeSection === "workshops" &&
                        sectionsData.workshops.imageName && (
                          <span
                            title={sectionsData.workshops.imageName}
                            className="file-name"
                          >
                            {sectionsData.workshops.imageName}
                          </span>
                        )}
                    </div>
                    {/* Save and Cancel buttons */}
                    <div className="edit-controls">
                      <button
                        title="Save edit"
                        className="save-button"
                        onClick={() => handleSaveEdit("workshops")}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        title="Cancel edit"
                        className="cancel-edit"
                        onClick={() => handleCancelEdit("workshops")}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
