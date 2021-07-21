class Config(object):
    DEBUG = False
    CSRF_ENABLED = True
    SECRET_KEY = 'plasma-web2'
    SQLALCHEMY_DATABASE_URI = 'postgresql://krblgcffxmhyqa:3ce46feebe99af9650bc90aee8384af125f8464c1e26b51abb38fa4dc76245f7@ec2-52-23-45-36.compute-1.amazonaws.com:5432/d6s7qkbee18hln'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PROFILE_IMAGES = 'static/images/profile'
    REPOSITORY_IMAGES = 'static/images/repository'
    POST_IMAGES = 'static/images/posts'

class ProductionConfig(Config):
    DEBUG = False

class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True