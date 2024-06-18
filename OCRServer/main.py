from flask import Flask
import sys

if sys.base_prefix != sys.prefix:
    print("vritual environment is activated") 
else:
    print("virtual environment not active")

app = Flask(__name__)

@app.route('/')
def home():
    return 'hello world, from flask!'
