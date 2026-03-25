import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base

load_dotenv()
URL_emp=os.getenv("URL_EMP")
engine=create_engine(URL_emp,pool_size=5)
Session=sessionmaker(bind=engine)
Base=declarative_base()



def get_db():
    try:
        db=Session()
        yield db
    finally:
        db.close()