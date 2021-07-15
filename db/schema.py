
import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

from flask_jwt_extended import jwt_required

from .models import Staff as StaffModel, Experience as ExperienceModel, Skill as SkillModel, Staff_password as Staff_passwordModel
from .api import create_staff, create_skill, create_experience, delete_staff, delete_experience, delete_skill, update_staff, update_experience, update_skill, update_staff_password, check_password, login


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

class Tokens(graphene.ObjectType):
  access_token=graphene.String()
  refresh_token=graphene.String()


class Login(graphene.Mutation):
  class Arguments:
    username = graphene.String(required=True)
    password = graphene.String(required=True)

  tokens = graphene.Field(lambda: Tokens)
  msg = graphene.String()

  def mutate(root, _, username, password):
    resp = login(username, password)
    if resp.get("msg"):
      return Login(msg=resp["msg"], tokens=None)
    else:
      return Login(msg=None, tokens=resp)

class CreateStaff(graphene.Mutation):
  class Arguments:
    name = graphene.String()
    contact_info = graphene.String()
    contact_type = graphene.String()
    username = graphene.String()
    password = graphene.String()
  
  ok = graphene.Boolean()
  tokens = graphene.Field(lambda: Tokens)
  staff = graphene.Field(lambda: Staff)

  def mutate(root, info, name, contact_info, contact_type, username, password):
    staff = Staff(name=name, contact_info=contact_info, contact_type=contact_type, username=username)
    tokens = create_staff(name, contact_info, contact_type, username, password)

    ok = True
    return CreateStaff(staff=staff, ok=ok, tokens=tokens)

class CreateSkill(graphene.Mutation):
  class Arguments:
    staff_username = graphene.String()
    name = graphene.String()
    description = graphene.String()
    reference = graphene.String()
  
  ok = graphene.Boolean()
  skill = graphene.Field(lambda: Skill)
  @jwt_required()
  def mutate(root, info, staff_username, name, description, reference):
    skill_id, staff = create_skill(staff_username, name, description, reference)
    skill = Skill(name=name, description=description, reference=reference, staff=staff)
    skill.uuid = skill_id
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
  @jwt_required()
  def mutate(root, info, staff_username, exp_type, at, description, reference, start, end):
    experience_id, staff = create_experience(staff_username, exp_type, description, at, reference, start, end)
    experience = Experience(type=exp_type, description=description, at=at, reference=reference, start=start, end=end, staff=staff)
    experience.uuid = experience_id
    ok = True
    return CreateExperience(experience=experience, ok=ok)

class DeleteStaff(graphene.Mutation):
  class Arguments:
    username = graphene.String(required=True)

  ok = graphene.Boolean()

  @jwt_required()
  def mutate(root, info, username):
    delete_staff(username)
    ok = True
    return DeleteStaff(ok=ok)

class DeleteExperience(graphene.Mutation):
  class Arguments:
    experience_id = graphene.ID()
  
  ok = graphene.Boolean()
  
  @jwt_required()
  def mutate(root, info, experience_id):
    delete_experience(experience_id)
    ok = True
    return DeleteExperience(ok=ok)
  
class DeleteSkill(graphene.Mutation):
  class Arguments:
    skill_id = graphene.ID()
  ok = graphene.Boolean()
  
  @jwt_required()
  def mutate(root, info, skill_id):
    delete_skill(skill_id)
    ok = True
    return DeleteSkill(ok=ok)

class UpdateStaff(graphene.Mutation):
  class Arguments:
    current_username = graphene.String(required=True)
    name = graphene.String(required=False)
    new_username = graphene.String(required=False)
    contact_info = graphene.String(required=False)
    contact_type = graphene.String(required=False)
  
  ok = graphene.Boolean()
  staff = graphene.Field(lambda: Staff)
  @jwt_required()
  def mutate(root, info, current_username, name=None, new_username=None, contact_info=None, contact_type=None):
    staff = update_staff(current_username, name, new_username, contact_type, contact_info)
    ok = True
    return UpdateStaff(ok=ok, staff=staff)

""" e.g.
mutation UpdateStaff($current_username:String!, $name:String, $new_username:String, $contact_info:String, $contact_type:String) {
  updateStaff(currentUsername: "pelle123", name:"Pelle P", contactInfo:"pelle#123") {
    staff {
      name
      contactInfo
    }
  }
}
"""
class UpdateStaffPassword(graphene.Mutation):
  class Arguments:
    staff_uuid = graphene.ID(required=True)
    old_password = graphene.String(required=True)
    new_password = graphene.String(required=True)
    confirm_password = graphene.String(required=True)

  ok = graphene.Boolean()
  
  @jwt_required()
  def mutate(root, info, staff_uuid, old_password, new_password, confirm_password):
    ok = False
    if new_password == confirm_password:
      if(check_password(staff_uuid, old_password)):
        
        update_staff_password(staff_uuid, new_password)
        ok = True
    return UpdateStaffPassword(ok=ok)
"""
mutation UpdatePassword($staff_id: ID!, $old_password: String!, $confirm_password: String!, $new_password: String!) {
  updatePassword(staffUuid: $staff_id, oldPassword: $old_password, confirmPassword: $confirm_password, newPassword: $new_password) {
    ok
  }
}
"""

class UpdateExperience(graphene.Mutation):
  class Arguments: 
    experience_id=graphene.ID(required=True)
    type=graphene.String()
    description=graphene.String()
    at=graphene.String()
    reference=graphene.String()
    start=graphene.Date()
    end=graphene.Date()
  
  ok=graphene.Boolean()
  experience=graphene.Field(lambda:Experience)

  @jwt_required()
  def mutate(root, info, experience_id, type=None, description=None, at=None, reference=None, start=None, end=None):
    experience = update_experience(experience_id, type, description, at, reference, start, end)
    ok=True
    return UpdateExperience(ok=ok, experience=experience)

""" e.g.
mutation UpdateExperience {
  updateExperience(experienceId: 3, at: "Pepega Gaming") {
    experience {
      type
      at
    }
  }
}
""" 

class UpdateSkill(graphene.Mutation):
  class Arguments:
    skill_id=graphene.ID(required=True)
    name=graphene.String()
    description=graphene.String()
    reference=graphene.String()
  
  ok=graphene.Boolean()
  skill=graphene.Field(lambda:Skill)

  def mutate(root, info, skill_id, name=None, description=None, reference=None):
    skill = update_skill(skill_id, name, description, reference)
    ok=True
    return UpdateSkill(ok=ok, skill=skill)
"""
mutation UpdateSkill {
  updateSkill(skillId: 4, name: "Test") {
    ok
    skill {
      name
      description
    }
  }
}
"""


class Mutations(graphene.ObjectType):
  create_staff=CreateStaff.Field()
  create_skill=CreateSkill.Field()
  create_experience=CreateExperience.Field()
  delete_staff=DeleteStaff.Field()
  delete_experience=DeleteExperience.Field()
  delete_skill=DeleteSkill.Field()
  update_staff=UpdateStaff.Field()
  update_experience=UpdateExperience.Field()
  update_skill=UpdateSkill.Field()
  update_password = UpdateStaffPassword.Field()
  login_user=Login.Field()

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
