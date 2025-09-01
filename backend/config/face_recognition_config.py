import torch
import os
from dotenv import load_dotenv

load_dotenv()

class FaceRecognitionConfig:
    def __init__(self):
        # Device configuration
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # MTCNN configuration
        self.mtcnn_config = {
            'image_size': int(os.getenv('FACE_IMAGE_SIZE', 160)),
            'margin': int(os.getenv('MTCNN_MARGIN', 0)),
            'min_face_size': int(os.getenv('MTCNN_MIN_FACE_SIZE', 20)),
            'keep_all': False,
            'post_process': True,
            'device': self.device
        }
        
        # Recognition thresholds
        self.recognition_threshold = float(os.getenv('RECOGNITION_THRESHOLD', 0.60))
        self.rejection_threshold = float(os.getenv('REJECTION_THRESHOLD', 0.50))
        
        # Model configuration
        self.facenet_pretrained = os.getenv('FACENET_PRETRAINED', 'vggface2')
        
        # File upload configuration
        self.max_file_size = int(os.getenv('MAX_FILE_SIZE', 16777216))  # 16MB
        self.allowed_extensions = os.getenv('ALLOWED_EXTENSIONS', 'png,jpg,jpeg,gif,bmp').split(',')
        
        print(f"🔧 Face Recognition Config:")
        print(f"   Device: {self.device}")
        print(f"   Recognition Threshold: {self.recognition_threshold}")
        print(f"   Rejection Threshold: {self.rejection_threshold}")
        print(f"   Max File Size: {self.max_file_size} bytes")
        print(f"   Allowed Extensions: {', '.join(self.allowed_extensions)}")

# Global configuration instance
config = FaceRecognitionConfig()
