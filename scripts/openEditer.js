var spawn = require('child_process').exec;
hexo.on('new', function(data){
  spawn('start  "C:\ProgramData\Microsoft VS Code/code.exe" ' + data.path);
});