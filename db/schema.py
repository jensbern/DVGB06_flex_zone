from sqlalchemy.engine import interfaces
import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from .models import db_session, Staff as StaffModel, Experience as ExperienceModel, Skill as SkillModel, Staff_password as Staff_passwordModel
from .api import create_staff, create_skill, create_experience, delete_staff, delete_experience


class Staff(SQLAlchemyObjectType):
  class Meta:
    model = StaffModel
    interfaces = (relay.Node, )

class Staff_password(SQLAlchemyObjectType):
  class Meta:
    model = Staff_passwordModel
    interfaces = (relay.Node, ) 

class Experience(SQLAlchemyObjectType):
  class Meta:
    model = ExperienceModel
    interfaces = (relay.Node, )

class Skill(SQLAlchemyObjectType):
  class Meta:
    model = SkillModel
    interfaces = (relay.Node, )

class SearchResult(graphene.Union):
  class Meta:
    types = (Staff, Experience, Skill)

class CreateStaff(graphene.Mutation):
  class Arguments:
    name = graphene.String()
    contact_info = graphene.String()
    contact_type = graphene.String()
    username = graphene.String()
    password = graphene.String()
  
  ok = graphene.Boolean()
  staff = graphene.Field(lambda: Staff)

  def mutate(root, info, name, contact_info, contact_type, username, password):
    staff = Staff(name=name, contact_info=contact_info, contact_type=contact_type, username=username)
    create_staff(name, contact_info, contact_type, username, password)

    ok = True
    return CreateStaff(staff=staff, ok=ok)

class CreateSkill(graphene.Mutation):
  class Arguments:
    staff_username = graphene.String()
    name = graphene.String()
    description = graphene.String()
    reference = graphene.String()
  
  ok = graphene.Boolean()
  skill = graphene.Field(lambda: Skill)

  def mutate(root, info, staff_username, name, description, reference):
    staff = create_skill(staff_username, name, description, reference)
    skill = Skill(name=name, description=description, reference=reference, staff=staff)
    
    ok = True
    return CreateSkill(skill=skill, ok=ok)

class CreateExperience(graphene.Mutation):
  class Arguments:
    staff_username = graphene.String()
    exp_type = graphene.String()
    at = graphene.String()
    description = graphene.String()
    reference = graphene.String()
    start = graphene.Date()
    end = graphene.Date()
  
  ok = graphene.Boolean()
  experience = graphene.Field(lambda: Experience)

  def mutate(root, info, staff_username, exp_type, at, description, reference, start, end):
    experience_id, staff = create_experience(staff_username, exp_type, description, at, reference, start, end)
    experience = Experience(type=exp_type, description=description, at=at, reference=reference, start=start, end=end, staff=staff)
    experience.uuid = experience_id
    ok = True
    return CreateExperience(experience=experience, ok=ok)

class DeleteStaff(graphene.Mutation):
  class Arguments:
    username = graphene.String()

  ok = graphene.Boolean()

  def mutate(root, info, username):
    delete_staff(username)
    ok = True
    return DeleteStaff(ok=ok)

class DeleteExperience(graphene.Mutation):
  class Arguments:
    experience_id = graphene.ID()
  
  ok = graphene.Boolean()

  def mutate(root, info, experience_id):
    delete_experience(experience_id)
    ok = True
    return DeleteExperience(ok=ok)
  
class DeleteSkill(graphene.Mutation):
  class Arguments:
    skill_id = graphene.ID()
  ok = graphene.Boolean()
  def mutate(root, info, skill_id):
    #delete_skill(skill_id)
    ok = True
    return DeleteSkill(ok=ok)

class Mutations(graphene.ObjectType):
  create_staff=CreateStaff.Field()
  create_skill=CreateSkill.Field()
  create_experience=CreateExperience.Field()
  delete_staff=DeleteStaff.Field()
  delete_experience=DeleteExperience.Field()
  delete_skill=DeleteSkill.Field()

class Query(graphene.ObjectType):
  node = relay.Node.Field()
  search = graphene.List(SearchResult, q=graphene.String())
  staff = graphene.List(Staff, name=graphene.String(), uuid=graphene.Int(), username=graphene.String())
  skills = graphene.List(Skill, name=graphene.String())
  experiences = graphene.List(Experience, experience_type=graphene.String(), at=graphene.String())
  # Allows sorting over multiple columns, by default over the primary key
  all_staff = SQLAlchemyConnectionField(Staff.connection)
  all_experience = SQLAlchemyConnectionField(Experience.connection)
  # Disable sorting over this field
  all_skills = SQLAlchemyConnectionField(Skill.connection)


  """
    {
      search(q: "Pelle") {
        __typename
        ... on Staff {
          name
          uuid
          contactInfo
        }
      }
    }
  """
  def resolve_search(self, info, **args):
    q = args.get("q")
    staff_query = Staff.get_query(info)
    
    staff = staff_query.filter(StaffModel.name.contains(q)).all()
    
    return staff
  
  def resolve_staff(self, info, **args):
    name = args.get("name")
    username = args.get("username")
    staff_id = args.get("uuid")
    staff_query = Staff.get_query(info)
    if staff_id:
      staff = staff_query.filter(StaffModel.uuid == staff_id).all()
      return staff
    
    if username:
      staff = staff_query.filter(StaffModel.username == username).all()
      return staff

    if name:
      staff = staff_query.filter(StaffModel.name.contains(name)).all()
      return staff
    
  def resolve_skills(self, info, **args):
    name = args.get("name")
    skill_query = Skill.get_query(info)
    skills = skill_query.filter(SkillModel.name.contains(name)).all()
    return skills
  
  def resolve_experiences(self, info, **args):
    experience_type = args.get("experience_type")
    at = args.get("at")

    experience_query = Experience.get_query(info)
    
    if experience_type:
      experiences = experience_query.filter(ExperienceModel.type.contains(experience_type)).all()
      return experiences
    
    if at:
      experiences = experience_query.filter(ExperienceModel.at.contains(at)).all()
      return experiences

schema = graphene.Schema(query=Query, mutation=Mutations, types=[Staff, Experience, Skill, SearchResult])
