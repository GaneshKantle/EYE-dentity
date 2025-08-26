from flask import Flask
from flask_cors import CORS
from routes.register import register_blueprint
from routes.recognize import recognize_blueprint

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(register_blueprint, url_prefix="/api")
app.register_blueprint(recognize_blueprint, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
