import React from "react";
import ImageUploader from "./ImageUploader";
import RetinosPage from "./RetinosPage";
import FileUploader from "./FileUploader"

function App() {
  return (
    <div>
      <RetinosPage/>
      {/* <ImageUploader /> */}
      <FileUploader/>
    </div>
  );
}

export default App;
