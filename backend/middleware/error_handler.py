from flask import jsonify
from werkzeug.exceptions import HTTPException
import traceback
import os

def register_error_handlers(app):
    """Register error handlers for the Flask app"""
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'success': False,
            'message': 'Bad request',
            'error': str(error) if app.debug else None
        }), 400
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Endpoint not found',
            'error': str(error) if app.debug else None
        }), 404
    
    @app.errorhandler(413)
    def file_too_large(error):
        return jsonify({
            'success': False,
            'message': 'File too large',
            'error': 'Maximum file size exceeded' if app.debug else None
        }), 413
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'message': 'Internal server error',
            'error': str(error) if app.debug else None
        }), 500
    
    @app.errorhandler(Exception)
    def handle_exception(error):
        # Log the error (in production, you'd want proper logging)
        if app.debug:
            print(f"Unhandled exception: {error}")
            traceback.print_exc()
        
        return jsonify({
            'success': False,
            'message': 'An unexpected error occurred',
            'error': str(error) if app.debug else None
        }), 500
