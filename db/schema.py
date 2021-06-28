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

class SearchResult(graphene.Union):
  class Meta:
    types = (Staff, Experience, Skill)

class CreateStaff(graphene.Mutation):
  class Arguments:
    name = graphene.String()
    contact_info = graphene.String()
    contact_type = graphene.String()
    username = graphene.String()
  
  ok = graphene.Boolean()
  staff = graphene.Field(lambda: Staff)

  def mutate(root, info, name, contact_info, contact_type, username):
    staff = Staff(name=name, contact_info=contact_info, contact_type=contact_type, username=username)
    
    

    ok = True
    return CreateStaff(staff=staff, ok=ok)

class Mutations(graphene.ObjectType):
  create_staff=CreateStaff.Field()

class Query(graphene.ObjectType):
  node = relay.Node.Field()
  search = graphene.List(SearchResult, q=graphene.String())
  staff = graphene.List(Staff, name=graphene.String(), id=graphene.Int(), username=graphene.String())
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
          id
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
    staff_id = args.get("id")
    staff_query = Staff.get_query(info)
    if staff_id:
      staff = staff_query.filter(StaffModel.id == staff_id).all()
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
