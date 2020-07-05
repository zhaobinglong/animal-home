#!/bin/bash
su - ubuntu <<!
cd /home/wwwroot/default/spider/unibbs/ && python index.py $1 
!