#! /bin/bash

export PROJECT=youshow-front
docker run --name="$PROJECT" -d "$PROJECT":latest
