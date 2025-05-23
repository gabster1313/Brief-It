<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['user-brief']) && $_FILES['user-brief']['error'] == UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        $uploadFile = $uploadDir . basename($_FILES['user-brief']['name']);

        // Optional: check file type
        $fileType = strtolower(pathinfo($uploadFile, PATHINFO_EXTENSION));
        if ($fileType !== 'JPEG') {
            echo "Only PNG files are allowed.";
            exit;
        }

        if (move_uploaded_file($_FILES['user-brief']['tmp_name'], $uploadFile)) {
            echo "File uploaded successfully.";
        } else {
            echo "Error moving the uploaded file.";
        }
    } else {
        echo "File upload error.";
    }
}
?>

<form action="upload_handler.php" method="POST" enctype="multipart/form-data">
  <p>Upload your deliverables in PNG format:</p>
  <input type="file" name="user-brief" accept="image/jpg,PNG" required />
  <br>
  <input type="submit" value="Upload" />
</form>
