// routing main /
const fs = require('fs');
const base = './files';
module.exports = function(app) {
    app.get('/', (req,res) => {    
        let path = '';
        if ('path' in req.query) {
            path = req.query.path;
        }

        if (isFolder(base + path)) {
            //если преданный параметр - папка    
            let files = fs.readdirSync(base+path).map(item => {
                const isDir = fs.lstatSync(base+path + '/' + item).isDirectory();
                let size = 0;                        
                if (!isDir) {
                    size = fs.lstatSync(base+path + '/' + item);
                                           
                } 
                return {
                    name : item,
                    dir: isDir,
                    size: size.size ?? 0,                   
                    
                }
            });
            res.json({
                path: path,
                result: true,
                files: files            
            });
        }
        app.get("/getfile", (req, res) => {
            let file_path = '';
            if ('file' in req.query) {
                file_path = req.query.file;
            }        
            let file_name = file_path.split('/').pop();                                   
            res.download(base+file_path,file_name, (err) => {
                          if (err) console.log(err);
                      });
          });
    });
}
function isFolder(path) {
    return fs.lstatSync(path).isDirectory() && fs.existsSync(path);
}