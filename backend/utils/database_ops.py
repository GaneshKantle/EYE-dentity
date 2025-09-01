import pickle
import base64
import io
from PIL import Image
from config.database import db_instance
from config.face_recognition_config import config

class DatabaseOps:
    def __init__(self):
        self.db = db_instance
    
    def _encode_embedding(self, embedding):
        """Encode numpy array to base64 string for storage"""
        emb_bytes = pickle.dumps(embedding.astype("float32"))
        return base64.b64encode(emb_bytes).decode("utf-8")
    
    def _decode_embedding(self, b64):
        """Decode base64 string back to numpy array"""
        return pickle.loads(base64.b64decode(b64.encode("utf-8"))).astype("float32")
    
    def save_face_to_db(self, name, image_path, embedding):
        """Save face embedding and image to MongoDB"""
        try:
            # Put image bytes into GridFS
            with open(image_path, "rb") as f:
                image_id = self.db.fs.put(f.read(), filename=name)
            
            # Upsert by name (replace if exists)
            encoded = self._encode_embedding(embedding)
            self.db.collection.replace_one(
                {"name": name},
                {"name": name, "embedding": encoded, "image_id": image_id},
                upsert=True
            )
            
            print(f"[DB] ✅ Saved/Updated '{name}' in MongoDB Atlas")
            return True
            
        except Exception as e:
            print(f"[DB] ❌ Failed to save '{name}': {e}")
            return False
    
    def load_faces_from_db(self):
        """Load all face embeddings from database"""
        try:
            faces = []
            for doc in self.db.collection.find():
                emb = self._decode_embedding(doc["embedding"])
                faces.append({
                    "name": doc["name"],
                    "embedding": emb,
                    "image_id": doc["image_id"]
                })
            return faces
            
        except Exception as e:
            print(f"[DB] ❌ Failed to load faces: {e}")
            return []
    
    def get_image_from_db(self, image_id):
        """Retrieve image from GridFS by ID"""
        try:
            image_data = self.db.fs.get(image_id).read()
            return Image.open(io.BytesIO(image_data)).convert("RGB")
        except Exception as e:
            print(f"[DB] ❌ Failed to retrieve image {image_id}: {e}")
            return None
    
    def clear_database(self):
        """Clear all documents and GridFS files"""
        try:
            # Clear documents
            result = self.db.collection.delete_many({})
            
            # Clear GridFS files
            for f in self.db.fs.find():
                try:
                    self.db.fs.delete(f._id)
                except Exception:
                    pass
            
            print(f"🗑️ Database cleared: {result.deleted_count} documents removed")
            return True
            
        except Exception as e:
            print(f"[DB] ❌ Failed to clear database: {e}")
            return False
    
    def count_entries(self):
        """Count total database entries"""
        try:
            count = self.db.collection.count_documents({})
            return count
        except Exception as e:
            print(f"[DB] ❌ Failed to count entries: {e}")
            return 0

# Global database operations instance
db_ops = DatabaseOps()
