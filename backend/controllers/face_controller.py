import os
import tempfile
from flask import request, jsonify
from werkzeug.utils import secure_filename
from utils.face_recognition import face_recognition
from utils.database_ops import db_ops
from config.face_recognition_config import config

class FaceController:
    def __init__(self):
        self.allowed_extensions = config.allowed_extensions
    
    def allowed_file(self, filename):
        """Check if file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.allowed_extensions
    
    def add_face(self):
        """Add a new face/sketch to the database"""
        try:
            # Check if image file is present
            if 'image' not in request.files:
                return jsonify({
                    'success': False,
                    'message': 'No image file provided'
                }), 400
            
            file = request.files['image']
            if file.filename == '':
                return jsonify({
                    'success': False,
                    'message': 'No image file selected'
                }), 400
            
            # Check file extension
            if not self.allowed_file(file.filename):
                return jsonify({
                    'success': False,
                    'message': f'File type not allowed. Allowed types: {", ".join(self.allowed_extensions)}'
                }), 400
            
            # Get name from form data
            name = request.form.get('name', '').strip()
            if not name:
                return jsonify({
                    'success': False,
                    'message': 'Name is required'
                }), 400
            
            # Save file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                file.save(temp_file.name)
                temp_path = temp_file.name
            
            try:
                # Generate embedding
                embedding, _ = face_recognition.get_embedding(temp_path)
                
                # Save to database
                if db_ops.save_face_to_db(name, temp_path, embedding):
                    return jsonify({
                        'success': True,
                        'message': f'Face/sketch "{name}" added successfully',
                        'data': {
                            'name': name,
                            'embedding_shape': embedding.shape
                        }
                    }), 201
                else:
                    return jsonify({
                        'success': False,
                        'message': 'Failed to save to database'
                    }), 500
                    
            finally:
                # Clean up temporary file
                os.unlink(temp_path)
                
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Internal server error',
                'error': str(e) if config.device == 'development' else None
            }), 500
    
    def recognize_face(self):
        """Recognize a face/sketch from uploaded image"""
        try:
            # Check if image file is present
            if 'image' not in request.files:
                return jsonify({
                    'success': False,
                    'message': 'No image file provided'
                }), 400
            
            file = request.files['image']
            if file.filename == '':
                return jsonify({
                    'success': False,
                    'message': 'No image file selected'
                }), 400
            
            # Check file extension
            if not self.allowed_file(file.filename):
                return jsonify({
                    'success': False,
                    'message': f'File type not allowed. Allowed types: {", ".join(self.allowed_extensions)}'
                }), 400
            
            # Save file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                file.save(temp_file.name)
                temp_path = temp_file.name
            
            try:
                # Generate embedding for uploaded image
                embedding, _ = face_recognition.get_embedding(temp_path)
                
                # Load faces from database
                faces = db_ops.load_faces_from_db()
                if not faces:
                    return jsonify({
                        'success': False,
                        'message': 'Database is empty. Add some faces first.'
                    }), 404
                
                # Find best match
                best_match = None
                best_score = -1.0
                
                for face in faces:
                    similarity = face_recognition.cos_sim(embedding, face["embedding"])
                    if similarity > best_score:
                        best_score = similarity
                        best_match = face
                
                # Check if match meets threshold
                if best_score >= config.recognition_threshold:
                    return jsonify({
                        'success': True,
                        'message': 'Face recognized successfully',
                        'data': {
                            'name': best_match['name'],
                            'similarity_score': round(best_score, 4),
                            'is_match': True
                        }
                    }), 200
                else:
                    return jsonify({
                        'success': True,
                        'message': 'No match found',
                        'data': {
                            'best_similarity_score': round(best_score, 4),
                            'is_match': False,
                            'threshold': config.recognition_threshold
                        }
                    }), 200
                    
            finally:
                # Clean up temporary file
                os.unlink(temp_path)
                
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Internal server error',
                'error': str(e) if config.device == 'development' else None
            }), 500
    
    def adjust_thresholds(self):
        """Adjust recognition and rejection thresholds"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({
                    'success': False,
                    'message': 'No data provided'
                }), 400
            
            recognition_threshold = data.get('recognitionThreshold')
            rejection_threshold = data.get('rejectionThreshold')
            
            if recognition_threshold is not None:
                if 0 <= recognition_threshold <= 1:
                    config.recognition_threshold = float(recognition_threshold)
                else:
                    return jsonify({
                        'success': False,
                        'message': 'Recognition threshold must be between 0 and 1'
                    }), 400
            
            if rejection_threshold is not None:
                if 0 <= rejection_threshold <= 1:
                    config.rejection_threshold = float(rejection_threshold)
                else:
                    return jsonify({
                        'success': False,
                        'message': 'Rejection threshold must be between 0 and 1'
                    }), 400
            
            return jsonify({
                'success': True,
                'message': 'Thresholds updated successfully',
                'data': {
                    'recognition_threshold': config.recognition_threshold,
                    'rejection_threshold': config.rejection_threshold
                }
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Internal server error',
                'error': str(e) if config.device == 'development' else None
            }), 500
    
    def clear_database(self):
        """Clear all database entries"""
        try:
            if db_ops.clear_database():
                return jsonify({
                    'success': True,
                    'message': 'Database cleared successfully'
                }), 200
            else:
                return jsonify({
                    'success': False,
                    'message': 'Failed to clear database'
                }), 500
                
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Internal server error',
                'error': str(e) if config.device == 'development' else None
            }), 500
    
    def count_entries(self):
        """Count total database entries"""
        try:
            count = db_ops.count_entries()
            return jsonify({
                'success': True,
                'data': {
                    'total_entries': count
                }
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Internal server error',
                'error': str(e) if config.device == 'development' else None
            }), 500

# Global face controller instance
face_controller = FaceController()
