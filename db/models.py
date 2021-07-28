from sqlalchemy import *
from sqlalchemy.orm import scoped_session, sessionmaker, relationship, backref
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine("sqlite:///database.sqlite3", convert_unicode=True)
db_session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)

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
    staff = relationship(Staff, backref=backref("password", cascade="delete,all"))


skill_reference_association = Table(
    "skill_reference_association",
    Base.metadata,
    Column("skill_id", Integer, ForeignKey("skill.uuid")),
    Column("reference_id", Integer, ForeignKey("reference.uuid")),
)

experience_reference_association = Table(
    "experience_reference_association",
    Base.metadata,
    Column("experience_id", Integer, ForeignKey("experience.uuid")),
    Column("reference_id", Integer, ForeignKey("reference.uuid")),
)


class Reference(Base):
    __tablename__ = "reference"
    uuid = Column(Integer, primary_key=True)
    ref_type = Column(String)
    link = Column(String)

interest_owner_association = Table(
    "interest_owner_assoctaion",
    Base.metadata, 
    Column("owner_id", Integer, ForeignKey("staff.uuid")),
    Column("interest_id", Integer, ForeignKey("interest.uuid"))
)

interest_to_association = Table(
    "interest_to_association",
    Base.metadata,
    Column("to_id", Integer, ForeignKey("staff.uuid")),
    Column("interest_id", Integer, ForeignKey("interest.uuid"))
)

class Interest(Base):
    __tablename__ = "interest"
    uuid = Column(Integer, primary_key=True)
    owner = relationship(Staff, secondary=interest_owner_association, uselist=False, backref="interests")
    to = relationship(Staff, secondary=interest_to_association, uselist=False, backref="interestees")
    is_interested = Column(Boolean, default=None)

class Experience(Base):
    __tablename__ = "experience"
    uuid = Column(Integer, primary_key=True)
    staffid = Column(Integer, ForeignKey("staff.uuid"))
    type = Column(String)
    description = Column(String)
    at = Column(String)
    reference = Column(String) #depricated
    references = relationship(
        Reference,
        # backref=backref("references", uselist=True, cascade="delete,all"),
        secondary=experience_reference_association,
        cascade="all, delete"
    )
    # reference = relationship(
    #     Reference, backref=backref("references", uselist=True, cascade="delete,all")
    # )
    start = Column(DateTime)
    end = Column(DateTime)
    staff = relationship(
        Staff, backref=backref("experiences", uselist=True, cascade="delete,all")
    )


class Skill(Base):
    __tablename__ = "skill"
    uuid = Column(Integer, primary_key=True)
    staffid = Column(Integer, ForeignKey("staff.uuid"))
    name = Column(String)
    description = Column(String)
    reference = Column(String) #depricated
    references = relationship(
        Reference,
        # backref=backref("references", uselist=True, cascade="delete,all"),
        secondary=skill_reference_association,
        cascade="all, delete"
    )
    staff = relationship(
        Staff, backref=backref("skills", uselist=True, cascade="delete,all")
    )


# TODO:
# Add models from UML
#
