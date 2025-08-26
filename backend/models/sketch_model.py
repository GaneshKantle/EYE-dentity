import cv2
import numpy as np
from scipy.spatial import distance
from skimage import feature

class AccuratePencilSketchRecognizer:
    def __init__(self):
        self.sketch_database = {'names': [], 'features': [], 'original_sketches': [], 'processed_sketches': []}
        self.recognition_threshold = 0.88
        self.rejection_threshold = 0.70
        self.img_size = (128, 128)

    def enhance_pencil_sketch(self, image):
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()
        gray = cv2.resize(gray, self.img_size)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)
        denoised = cv2.bilateralFilter(enhanced, 9, 75, 75)
        binary = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                       cv2.THRESH_BINARY, 11, 2)
        return 255 - binary if np.mean(binary) > 127 else binary

    def extract_accurate_features(self, image):
        processed = self.enhance_pencil_sketch(image)
        features = []

        # HOG features
        hog_features = feature.hog(processed, orientations=9, pixels_per_cell=(8, 8),
                                   cells_per_block=(2, 2), visualize=False, feature_vector=True)
        hog_features = (hog_features - np.mean(hog_features)) / (np.std(hog_features) + 1e-10)
        features.extend(hog_features)

        # LBP features
        lbp = feature.local_binary_pattern(processed, 16, 2, method="uniform")
        hist, _ = np.histogram(lbp.ravel(), bins=np.arange(0, 19), range=(0, 18))
        hist = hist.astype("float")
        hist /= (hist.sum() + 1e-6)
        features.extend(hist)

        # Edge density
        edges = cv2.Canny(processed, 50, 150)
        edge_density = np.sum(edges > 0) / edges.size
        features.append(edge_density)

        features = np.array(features)
        return (features - np.min(features)) / (np.max(features) - np.min(features) + 1e-10)

    def calculate_similarity(self, f1, f2):
        f1, f2 = np.array(f1), np.array(f2)
        cos_sim = 1 - distance.cosine(f1, f2)
        if np.isnan(cos_sim): cos_sim = 0
        return cos_sim

    def recognize_from_image(self, image):
        if not self.sketch_database['names']:
            return None, 0

        query_features = self.extract_accurate_features(image)
        similarities = [(self.calculate_similarity(query_features, dbf), idx)
                        for idx, dbf in enumerate(self.sketch_database['features'])]
        similarities.sort(reverse=True)
        best_sim, best_idx = similarities[0]
        return (self.sketch_database['names'][best_idx], float(best_sim)) if best_sim >= self.rejection_threshold else (None, float(best_sim))
