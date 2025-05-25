const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');

http.createServer((req, res) => {
    if (req.method.toLowerCase() === 'post') {
        const form = new formidable.IncomingForm({ maxFiles: 1 });

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Error parsing form.');
                return;
            }

            const uploadedFile = files.fileupload;

            if (!uploadedFile) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('No file uploaded.');
                return;
            }

            const fileData = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(fileData.mimetype)) {
                res.writeHead(415, { 'Content-Type': 'text/plain' });
                res.end('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
                return;
            }

            const oldPath = fileData.filepath;
            const fileName = path.basename(fileData.originalFilename);

            const imageDir = path.join('/tmp', 'Images');

            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir);
            }

            const newPath = path.join(imageDir, fileName);

            const readStream = fs.createReadStream(oldPath);
            const writeStream = fs.createWriteStream(newPath);

            readStream.on('error', (error) => {
                console.error('Read error:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading file.');
            });

            writeStream.on('error', (error) => {
                console.error('Write error:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error saving file.');
            });

            writeStream.on('close', () => {
                fs.unlink(oldPath, (error) => {
                    if (error) console.error('Temp file delete error:', error);
                    else console.log('Temp file deleted');
                });

                res.writeHead(302, { Location: 'https://briefitapp.netlify.app/talentshow' });
                res.end();
            });

            readStream.pipe(writeStream);

        });
    } else {
        // Basic form for testing
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <form action="/" method="post" enctype="multipart/form-data">
                <input type="file" name="fileupload" accept=".jpg,.jpeg,.png,.gif" required />
                <input type="submit" value="Upload Image" />
            </form>
        `);
    }
}).listen(90, () => {
    console.log('Server listening on port 90');
});



