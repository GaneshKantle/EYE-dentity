import torch
import numpy as np
from facenet_pytorch import MTCNN, InceptionResnetV1
from PIL import Image
from config.face_recognition_config import config

class FaceRecognition:
    def __init__(self):
        self.device = config.device
        
        # Initialize MTCNN for detection+alignment
        self.mtcnn = MTCNN(**config.mtcnn_config)
        
        # Initialize InceptionResnetV1 (pretrained on VGGFace2)
        self.facenet = InceptionResnetV1(pretrained=config.facenet_pretrained).eval().to(self.device)
        
        print(f"🤖 Face Recognition models initialized on {self.device}")
    
    def _fixed_image_standardization(self, x):
        """Convert [0,1] -> [-1,1] (FaceNet standardization)"""
        return (x - 0.5) / 0.5
    
    def get_embedding(self, img_path):
        """
        Returns (512, ) normalized embedding and the PIL image for display.
        Uses MTCNN; if it fails (common for some sketches), falls back to
        standardized center-crop so recognition can still attempt.
        """
        img = Image.open(img_path).convert("RGB")
        
        with torch.no_grad():
            face = self.mtcnn(img)  # tensor (3,160,160) standardized to [-1,1], or None
            
            if face is None:
                # Fallback: center-crop + resize + standardize (only if detection fails)
                # This keeps logic intact but prevents total failure on tough sketches
                img_resized = img.resize((160, 160))
                face = torch.from_numpy(np.array(img_resized)).permute(2,0,1).float() / 255.0
                face = self._fixed_image_standardization(face)
            
            if face.ndim == 3:
                face = face.unsqueeze(0)  # (1,3,160,160)
            
            face = face.to(self.device)
            emb = self.facenet(face)          # (1,512)
            emb = emb.squeeze(0).detach().cpu().numpy().astype("float32")
            # L2-normalize for cosine similarity = dot product
            emb = emb / (np.linalg.norm(emb) + 1e-10)
            return emb, img
    
    def cos_sim(self, a, b):
        """Calculate cosine similarity between two embeddings"""
        # a and b should already be L2-normalized
        a = np.asarray(a, dtype="float32").flatten()
        b = np.asarray(b, dtype="float32").flatten()
        return float(np.dot(a, b))
    
    def is_match(self, similarity_score):
        """Check if similarity score meets recognition threshold"""
        return similarity_score >= config.recognition_threshold

# Global face recognition instance
face_recognition = FaceRecognition()
