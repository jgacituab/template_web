cd C:\Dockers\template_web\api
npm install express



cd C:\Dockers\template_web\app
docker run --rm -it -v ${PWD}\app:/usr/src/app -w /usr/src/app node:14 bash -lc "npm i -g @angular/cli@11.2.19 && ng new app --skip-git --routing --style=css"



