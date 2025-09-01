from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def create_app():
    """Application factory pattern for Flask app"""
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, origins=os.getenv('CORS_ORIGINS', '*').split(','))
    
    # Configure app
    app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_FILE_SIZE', 16777216))  # 16MB default
    
    # Register blueprints
    from routes.face_routes import face_bp
    app.register_blueprint(face_bp, url_prefix='/api/face')
    
    # Register error handlers
    from middleware.error_handler import register_error_handlers
    register_error_handlers(app)
    
    # Health check route
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Sketch Sight Backend is running'}
    
    @app.route('/')
    def index():
        return {
            'message': 'Sketch Sight Face Recognition API',
            'endpoints': {
                'health': '/health',
                'add_face': '/api/face/add',
                'recognize_face': '/api/face/recognize',
                'adjust_thresholds': '/api/face/thresholds',
                'clear_database': '/api/face/clear',
                'count_entries': '/api/face/count'
            }
        }
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('NODE_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
