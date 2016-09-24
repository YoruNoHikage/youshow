# How to docker this front app
## Build
Add the execute right to the main bash script. 
```bash
chmod u+x ./build-docker.sh
```
Make sure the following packages are installed : `docker-engine`, `npm`, `vnodejs`, `git` and `sed`.
For docker installation, please follow the instructions from the [official 
documentation](https://docs.docker.com/engine/installation/linux/). Don't forget to add you to the docker group. Then
```bash
./build-docker.sh
```
## Test
You can check the new docker images with `docker images`.
```
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
youshow-front       latest              83d4f028dd72        17 minutes ago      326.5 MB
```
You can launch the docker on your own machine for testing.
``` bash
docker run -p 80:80 -d youshow-front
```
`-p 80:80` will bind the port 80 of the host to the port 80 of the container. Let's browse now `localhost` !
