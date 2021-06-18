from sqlalchemy import *
from sqlalchemy.orm import (scoped_session, sessionmaker, relationship,
                            backref)
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('sqlite:///database.sqlite3', convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base()
# We will need this for querying
Base.query = db_session.query_property()


class Staff(Base):
    __tablename__ = "staff"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    contact_info = Column(String)
    contact_type= Column(String)
    type = Column(String)


class Experience(Base):
    __tablename__ = "experience"
    id=Column(Integer, primary_key=True)
    staffid = Column(Integer, ForeignKey('staff.id'))
    type=Column(String)
    description=Column(String)
    reference = Column(String)
    start = Column(DateTime)
    end = Column(DateTime)
    staff = relationship(
        Staff,
        backref=backref('experiences', uselist=True, cascade='delete,all')
    )


class Skill(Base):
    __tablename__ = "skill"
    id=Column(Integer, primary_key=True)
    staffid = Column(Integer, ForeignKey('staff.id'))
    name=Column(String)
    description=Column(String)
    reference = Column(String)
    staff = relationship(
        Staff,
        backref=backref(
            'skills', uselist=True, cascade="delete,all")
    )


# TODO:
# Add models from UML
#
