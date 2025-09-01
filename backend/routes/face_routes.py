from flask import Blueprint
from controllers.face_controller import face_controller

# Create blueprint for face recognition routes
face_bp = Blueprint('face', __name__)

@face_bp.route('/add', methods=['POST'])
def add_face():
    """Add a new face/sketch to the database"""
    return face_controller.add_face()

@face_bp.route('/recognize', methods=['POST'])
def recognize_face():
    """Recognize a face/sketch from uploaded image"""
    return face_controller.recognize_face()

@face_bp.route('/thresholds', methods=['PUT'])
def adjust_thresholds():
    """Adjust recognition and rejection thresholds"""
    return face_controller.adjust_thresholds()

@face_bp.route('/clear', methods=['DELETE'])
def clear_database():
    """Clear all database entries"""
    return face_controller.clear_database()

@face_bp.route('/count', methods=['GET'])
def count_entries():
    """Count total database entries"""
    return face_controller.count_entries()
