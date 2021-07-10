class Config(object):
    DEBUG = False
    CSRF_ENABLED = True
    SECRET_KEY = 'plasma-web2'
    # SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:masterkey@localhost/example'

class ProductionConfig(Config):
    # DEVELOPMENT = False
    DEBUG = False

class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True