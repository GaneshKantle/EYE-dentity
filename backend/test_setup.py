#!/usr/bin/env python3
"""
Test script to verify Sketch Sight Backend setup
"""
import sys
import os

def test_imports():
    """Test if all required modules can be imported"""
    print("🔍 Testing imports...")
    
    try:
        import torch
        print(f"✅ PyTorch: {torch.__version__}")
    except ImportError as e:
        print(f"❌ PyTorch: {e}")
        return False
    
    try:
        import facenet_pytorch
        print("✅ facenet-pytorch")
    except ImportError as e:
        print(f"❌ facenet-pytorch: {e}")
        return False
    
    try:
        import PIL
        print(f"✅ Pillow: {PIL.__version__}")
    except ImportError as e:
        print(f"❌ Pillow: {e}")
        return False
    
    try:
        import pymongo
        print(f"✅ PyMongo: {pymongo.__version__}")
    except ImportError as e:
        print(f"❌ PyMongo: {e}")
        return False
    
    try:
        import flask
        print(f"✅ Flask: {flask.__version__}")
    except ImportError as e:
        print(f"❌ Flask: {e}")
        return False
    
    try:
        import numpy
        print(f"✅ NumPy: {numpy.__version__}")
    except ImportError as e:
        print(f"❌ NumPy: {e}")
        return False
    
    return True

def test_config():
    """Test configuration loading"""
    print("\n🔧 Testing configuration...")
    
    try:
        from dotenv import load_dotenv
        load_dotenv()
        print("✅ Environment variables loaded")
        
        # Test some key configs
        port = os.getenv('PORT', '5000')
        mongo_uri = os.getenv('MONGO_URI', 'Not set')
        print(f"   PORT: {port}")
        print(f"   MONGO_URI: {mongo_uri[:50]}...")
        
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        return False
    
    return True

def test_database_connection():
    """Test MongoDB connection"""
    print("\n🗄️ Testing database connection...")
    
    try:
        from config.database import db_instance
        print("✅ Database configuration loaded")
        
        # Test connection
        db_instance.client.admin.command('ping')
        print("✅ MongoDB connection successful")
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("   Make sure your MongoDB URI is correct in .env file")
        return False
    
    return True

def main():
    """Run all tests"""
    print("🚀 Sketch Sight Backend Setup Test")
    print("=" * 40)
    
    tests = [
        test_imports,
        test_config,
        test_database_connection
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 40)
    print(f"📊 Test Results: {passed}/{total} passed")
    
    if passed == total:
        print("🎉 All tests passed! Your backend is ready to run.")
        print("\nTo start the server:")
        print("   python run.py")
    else:
        print("⚠️ Some tests failed. Please fix the issues above.")
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
