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
    uuid = Column(Integer, primary_key=True)
    name = Column(String)
    contact_info = Column(String)
    contact_type = Column(String)
    username = Column(String, unique=True)

class Staff_password(Base):
    __tablename__ = "staff_password"
    uuid = Column(Integer, primary_key=True)
    staffid = Column(Integer, ForeignKey("staff.uuid"))
    password = Column(LargeBinary)
    staff = relationship (
        Staff,
        backref=backref("password", cascade="delete,all")
    )

class Experience(Base):
    __tablename__ = "experience"
    uuid=Column(Integer, primary_key=True)
    staffid = Column(Integer, ForeignKey('staff.uuid'))
    type=Column(String)
    description=Column(String)
    at=Column(String)
    reference = Column(String)
    start = Column(DateTime)
    end = Column(DateTime)
    staff = relationship(
        Staff,
        backref=backref('experiences', uselist=True, cascade='delete,all')
    )


class Skill(Base):
    __tablename__ = "skill"
    uuid=Column(Integer, primary_key=True)
    staffid = Column(Integer, ForeignKey('staff.uuid'))
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
