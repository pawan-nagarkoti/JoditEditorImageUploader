import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";

const MyEditor = () => {
  const editor = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState("");

  const config = {
    uploader: {
      url: "http://localhost:3000/upload",
      insertImageAsBase64URI: false,
      format: "json",
      method: "POST",
      filesVariableName: () => "file",
      withCredentials: false,
      prepareData: (formData) => {
        console.log("Preparing data for upload:", formData);
        return formData;
      },
      isSuccess: (response) => {
        console.log("Checking success response:", response);
        return response.success && response.file && response.file.url;
      },
      process: (response) => {
        console.log("Processing response:", response);
        return response;
      },
      error: (e) => {
        console.error("Upload error:", e);
        setUploading(false); // Reset upload state on error
      },
      defaultHandlerSuccess: (response) => {
        console.log("Raw response from server:", response);

        try {
          if (typeof response === "string") {
            response = JSON.parse(response);
          }

          if (!response || !response.success || !response.file || !response.file.url) {
            console.error("Invalid response:", response);
            setUploading(false); // Reset upload state on error
            return;
          }

          console.log("Upload successful:", response.file);

          // Ensure the editor instance is ready before inserting the image
          if (editor.current) {
            if (editor.current.selection) {
              editor.current.selection.insertHTML(`<img src="${response.file.url}" alt="Image" />`);
            } else {
              const currentValue = editor.current.value;
              editor.current.value = currentValue + `<img src="${response.file.url}" alt="Image" />`;
            }
            setUploading(false); // Reset upload state on success
          } else {
            console.error("Editor instance is not ready.");
            setUploading(false); // Reset upload state if editor is not ready
          }
        } catch (err) {
          console.error("Error parsing response:", err, response);
          setUploading(false); // Reset upload state on error
        }
      },
      headers: {
        Accept: "application/json",
      },
    },
    buttons: ["bold", "italic", "underline", "link", "unlink", "source", "image", "table", "ul", "ol", "outdent", "indent", "font", "fontsize", "brush", "paragraph", "align", "undo", "redo", "hr"],
    toolbarSticky: false,
    readonly: false,
    height: 400,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted content:", content);
    // You can now submit the content to your server or perform other actions
  };

  return (
    <div>
      {/* {uploading && <div className="upload-indicator">Image is uploading...</div>} */}
      <form onSubmit={handleSubmit}>
        <JoditEditor
          ref={editor}
          config={config}
          tabIndex={1} // tabIndex of textarea
          onBlur={(newContent) => setContent(newContent)}
          onChange={() => setUploading(true)} // Set upload state when the change starts (optional)
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MyEditor;
