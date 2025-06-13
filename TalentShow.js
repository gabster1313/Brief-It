const form = document.getElementById ("uploadForm");
    const fileInput = document.getElementById ("fileInput");
    const preview = document.getElementById ("message");

    form.addEventListener("submit", (event) =>{
      event.preventDefault();
      const file = fileInput.files[0];
      const maxSize = 2 * 1024 * 1024 // 2mb
      if(file){
        if (file.size > maxSize) {
          message.textContent= "File size exceeds limit of 2 MB"
          message.classname = "error";
          return;
      }
        const formData = new FormData()
        formData.append("file",file);
        formData.append("UPLOADCARE_PUB_KEY","e8d48c106a2b49b67bf3");
        formData.append("filename,=", file.name);

        message.textContent = "Uploading File...";
        message.className = "";

        fetch("https://upload.uploadcare.com/base/", {
          method: "POST",
          body: formData,
          headers:{
            "Accepts": "multipart/form-data"
          }
        })

        .then(Response=> response.json())
        .then(data => {
          console.log(data)
          message.textContent = "File Uploaded Successfully!"
          message.className = "success"
        })

        .catch(error => {
          console.log("Error", error)
          message.textContent = "Error Uploading"
          message.className = "error"
        })

      }else {
        message.textContent = "Please select a file to upload"
        message.className = "error"
        }
    })
    
    function scrollGallery(direction) {
    const container = document.getElementById('gallery');
    const scrollAmount = 600;
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }