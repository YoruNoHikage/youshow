#! /bin/bash
export PROJECT=youshow-front
rm -rf $PROJECT &&
git clone git@github.com:YoruNoHikage/youshow.git $PROJECT &&
sed -i "s/myproject/$PROJECT/" ./apache-config.conf &&
cd $PROJECT &&
npm install &&
npm run build &&
cd .. &&
docker build --build-arg PROJECT=$PROJECT -t $PROJECT . &&
rm -rf $PROJECT