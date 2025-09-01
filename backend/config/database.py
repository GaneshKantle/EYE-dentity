from pymongo import MongoClient
import gridfs
import os
import certifi
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.client = None
        self.db = None
        self.collection = None
        self.fs = None
        self.connect()
    
    def connect(self):
        """Establish MongoDB connection"""
        try:
            # Use your working Atlas URI
            mongo_uri = os.getenv('MONGO_URI', 'mongodb+srv://eye-dentify:hEC0Hpcrv98THlAlf@eye-dentity.sgrj54e.mongodb.net/?retryWrites=true&w=majority')
            
            # Try different connection approaches
            try:
                # Method 1: Standard TLS with certifi
                self.client = MongoClient(mongo_uri, tls=True, tlsCAFile=certifi.where())
                self.client.admin.command('ping')
                print("✅ Connected using standard TLS with certifi")
            except Exception as e1:
                print(f"Method 1 failed: {e1}")
                try:
                    # Method 2: Direct connection without SSL verification
                    self.client = MongoClient(mongo_uri, tls=True, tlsAllowInvalidCertificates=True)
                    self.client.admin.command('ping')
                    print("✅ Connected using TLS with invalid certificates allowed")
                except Exception as e2:
                    print(f"Method 2 failed: {e2}")
                    # Method 3: Minimal connection
                    self.client = MongoClient(mongo_uri)
                    self.client.admin.command('ping')
                    print("✅ Connected using minimal configuration")
            
            db_name = os.getenv('MONGO_DB_NAME', 'eye-dentify-db')
            collection_name = os.getenv('MONGO_COLLECTION_NAME', 'recognize')
            
            self.db = self.client[db_name]
            self.collection = self.db[collection_name]
            self.fs = gridfs.GridFS(self.db)
            
            print(f"✅ Connected to MongoDB: {db_name}.{collection_name}")
            
        except Exception as e:
            print(f"❌ MongoDB connection failed: {e}")
            raise
    
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            print("🔌 MongoDB connection closed")

# Global database instance
db_instance = Database()
