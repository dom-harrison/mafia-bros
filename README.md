## Mafia Bros Client App
Mafia Bros Game

#Running in local
```bash
npm install
npm start
```

#Containerization

To build container run:
```bash
docker build -t [IMAGE_NAME] .
```

To push to Google Cloud:
-Tag the image 
```bash
docker tag [IMAGE_NAME] [HOSTNAME]/[PROJECT-ID]/[IMAGE]:[TAG]
```
-Push to GCP
```bash
docker push [HOSTNAME]/[PROJECT-ID]/[IMAGE]:[TAG]
```