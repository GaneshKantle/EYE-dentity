from flask import Blueprint, jsonify

recognize_blueprint = Blueprint('recognize', __name__)

@recognize_blueprint.route('/recognize', methods=['GET', 'POST'])
def recognize():
    return jsonify({"message": "Recognize route is live"})
