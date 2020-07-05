
#!/usr/bin/python3
# -*- coding: utf-8 -*-
# 微信小程序海报生成脚本
# 1. 合并三张图片为一排
# from flask import Flask, request

import sys

from PIL import Image, ImageDraw,ImageFont
import requests as req
from io import BytesIO

print(sys.argv[1])