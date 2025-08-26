from flask import Blueprint, request, jsonify

register_blueprint = Blueprint("register", __name__)

@register_blueprint.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return jsonify({"message": "Register route is live"})
    data = request.get_json()
    return jsonify({"received": data})
