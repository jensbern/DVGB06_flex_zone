from sqlalchemy.engine import interfaces
import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from .models import db_session, Staff as StaffModel, Experience as ExperienceModel, Skill as SkillModel

class Staff(SQLAlchemyObjectType):
  class Meta:
    model = StaffModel
    interfaces = (relay.Node, )

class Experience(SQLAlchemyObjectType):
  class Meta:
    model = ExperienceModel
    interfaces = (relay.Node, )

class Skill(SQLAlchemyObjectType):
  class Meta:
    model = SkillModel
    interfaces = (relay.Node, )

class Query(graphene.ObjectType):
  node = relay.Node.Field()
  # Allows sorting over multiple columns, by default over the primary key
  all_staff = SQLAlchemyConnectionField(Staff.connection)
  all_experience = SQLAlchemyConnectionField(Experience.connection)
  # Disable sorting over this field
  all_skills = SQLAlchemyConnectionField(Skill.connection)

schema = graphene.Schema(query=Query)