
import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

from flask_jwt_extended import jwt_required
from sqlalchemy.orm import interfaces

from .models import Staff as StaffModel, Experience as ExperienceModel, Skill as SkillModel, Staff_password as Staff_passwordModel, Reference as ReferenceModel, Interest as InterestModel
from .api import create_interest, create_reference, create_staff, create_skill, create_experience, delete_interest, delete_reference, delete_staff, delete_experience, delete_skill, update_interest, update_reference, update_staff, update_experience, update_skill, update_staff_password, check_password, login


class Staff(SQLAlchemyObjectType):
    class Meta:
        model = StaffModel
        interfaces = (relay.Node, )

class Staff_password(SQLAlchemyObjectType):
    class Meta:
        model = Staff_passwordModel
        interfaces = (relay.Node, )

class Interest(SQLAlchemyObjectType):
    class Meta:
        model = InterestModel
        interfaces = (relay.Node, )

class Reference(SQLAlchemyObjectType):
    class Meta:
        model = ReferenceModel
        interfaces = (relay.Node, )

class Experience(SQLAlchemyObjectType):
    class Meta:
        model = ExperienceModel
        interfaces = (relay.Node, )
    references = graphene.List(Reference)


class Skill(SQLAlchemyObjectType):
    class Meta:
        model = SkillModel
        interfaces = (relay.Node, )

    references = graphene.List(Reference)


class SearchResult(graphene.Union):
    class Meta:
        types = (Staff, Experience, Skill)


class Tokens(graphene.ObjectType):
    access_token = graphene.String()
    refresh_token = graphene.String()


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
        staff = Staff(name=name, contact_info=contact_info,
                      contact_type=contact_type, username=username)
        tokens = create_staff(name, contact_info,
                              contact_type, username, password)

        ok = True
        return CreateStaff(staff=staff, ok=ok, tokens=tokens)


class CreateSkill(graphene.Mutation):
    class Arguments:
        staff_username = graphene.String()
        name = graphene.String()
        description = graphene.String()

    ok = graphene.Boolean()
    skill = graphene.Field(lambda: Skill)

    @jwt_required()
    def mutate(root, info, staff_username, name, description):
        skill_id, staff = create_skill(
            staff_username, name, description,)
        skill = Skill(name=name, description=description,
                       staff=staff)
        skill.uuid = skill_id
        ok = True
        return CreateSkill(skill=skill, ok=ok)


class CreateExperience(graphene.Mutation):
    class Arguments:
        staff_username = graphene.String(required=True)
        exp_type = graphene.String(required=True)
        at = graphene.String(required=True)
        description = graphene.String()
        start = graphene.Date(required=True)
        end = graphene.Date()

    ok = graphene.Boolean()
    experience = graphene.Field(lambda: Experience)

    @jwt_required()
    def mutate(root, info, staff_username, exp_type, at, start, description=None, end=None):
        experience_id, staff = create_experience(
            staff_username, exp_type, description, at, start, end)
        experience = Experience(type=exp_type, description=description,
                                at=at, start=start, end=end, staff=staff)
        experience.uuid = experience_id
        ok = True
        return CreateExperience(experience=experience, ok=ok)

class CreateReference(graphene.Mutation):
    class Arguments:
        for_id = graphene.ID(required=True)
        for_type = graphene.String(required=True)
        type = graphene.String(required=True)
        link = graphene.String(required=True)
    ok = graphene.Boolean()
    reference = graphene.Field(lambda: Reference)

    @jwt_required()
    def mutate(root, info, for_id, for_type, type, link):
        
        reference = create_reference(for_id, for_type, type, link)
        
        ok = True
        return CreateReference(ok=ok, reference=reference)

class CreateInterest(graphene.Mutation):
    class Arguments:
        owner = graphene.String(required=True) #username
        to = graphene.String(required=True) #username
    
    ok = graphene.Boolean()
    interest = graphene.Field(lambda: Interest)
    
    @jwt_required()
    def mutate(root, _, owner, to):
        interest = create_interest(owner, to)
        ok = True

        return CreateInterest(ok=ok, interest=interest)

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

class DeleteReference(graphene.Mutation):
    class Arguments:
        reference_id = graphene.ID(required=True)
    ok=graphene.Boolean()

    @jwt_required()
    def mutate(root, info, reference_id):
        delete_reference(reference_id)
        ok=True
        return DeleteReference(ok=ok)

class DeleteInterest(graphene.Mutation):
    class Arguments:
        interest_uuid = graphene.ID(required=True)
    
    ok=graphene.Boolean()
    
    @jwt_required()
    def mutate(root, _, interest_uuid):
        delete_interest(interest_uuid)
        ok=True

        return DeleteInterest(ok=ok)

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
        staff = update_staff(current_username, name,
                             new_username, contact_type, contact_info)
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
        experience_id = graphene.ID(required=True)
        type = graphene.String()
        description = graphene.String()
        at = graphene.String()
        start = graphene.Date()
        end = graphene.Date()

    ok = graphene.Boolean()
    experience = graphene.Field(lambda: Experience)

    @jwt_required()
    def mutate(root, info, experience_id, type=None, description=None, at=None,  start=None, end=None):
        experience = update_experience(
            experience_id, type, description, at,  start, end)
        ok = True
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
        skill_id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()

    ok = graphene.Boolean()
    skill = graphene.Field(lambda: Skill)

    def mutate(root, info, skill_id, name=None, description=None):
        skill = update_skill(skill_id, name, description)
        ok = True
        return UpdateSkill(ok=ok, skill=skill)

class UpdateReference(graphene.Mutation):
    class Arguments:
        uuid = graphene.ID(required=True)
        type=graphene.String()
        link=graphene.String()
    ok=graphene.Boolean()
    reference = graphene.Field(lambda:Reference)
    
    @jwt_required()
    def mutate(root, info, uuid, type=None, link=None):
        reference = update_reference(uuid, type, link)
        ok=True
        return UpdateReference(ok=ok, reference=reference)

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

class UpdateInterest(graphene.Mutation):
    class Arguments():
        interest_uuid = graphene.ID(required=True)
        is_interested = graphene.Boolean()
    
    ok = graphene.Boolean()
    interest = graphene.Field(lambda: Interest)

    @jwt_required()
    def mutate(root, _, interest_uuid, is_interested=None):
        interest = update_interest(interest_uuid, is_interested)
        ok = True
        return UpdateInterest(ok=ok, interest=interest)



class Mutations(graphene.ObjectType):
    create_staff = CreateStaff.Field()
    create_skill = CreateSkill.Field()
    create_experience = CreateExperience.Field()
    create_reference = CreateReference.Field()
    create_interest = CreateInterest.Field()
    delete_staff = DeleteStaff.Field()
    delete_experience = DeleteExperience.Field()
    delete_skill = DeleteSkill.Field()
    delete_reference = DeleteReference.Field()
    delete_interest = DeleteInterest.Field()
    update_staff = UpdateStaff.Field()
    update_experience = UpdateExperience.Field()
    update_skill = UpdateSkill.Field()
    update_password = UpdateStaffPassword.Field()
    update_reference = UpdateReference.Field()
    update_interest = UpdateInterest.Field()
    login_user = Login.Field()



class Query(graphene.ObjectType):
    node = relay.Node.Field()
    search = graphene.List(SearchResult, q=graphene.String())
    staff = graphene.List(Staff, name=graphene.String(),
                          uuid=graphene.Int(), username=graphene.String())
    skills = graphene.List(Skill, name=graphene.String(), id=graphene.ID())
    experiences = graphene.List(
        Experience, experience_type=graphene.String(), at=graphene.String(), id=graphene.ID())
    
    references = graphene.List(Reference, refType=graphene.String(), link=graphene.String())
    # Allows sorting over multiple columns, by default over the primary key
    all_staff = SQLAlchemyConnectionField(Staff.connection)
    all_experience = SQLAlchemyConnectionField(Experience.connection)
    # Disable sorting over this field
    all_skills = SQLAlchemyConnectionField(Skill.connection)

    def resolve_search(self, info, **args):
        q = args.get("q")
        staff_query = Staff.get_query(info)
        experience_query = Experience.get_query(info)
        skill_query = Skill.get_query(info)

        staff = staff_query.filter(StaffModel.name.contains(
            q) | StaffModel.username.contains(q)).all()
        experiences = experience_query.filter(
            ExperienceModel.type.contains(q) | ExperienceModel.description.contains(q) |  ExperienceModel.at.contains(q)).all()
        skills = skill_query.filter(
            SkillModel.name.contains(q) | SkillModel.description.contains(q)).all()
        return staff + experiences + skills

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

    def resolve_staff(self, info, **args):
        name = args.get("name")
        username = args.get("username")
        staff_id = args.get("uuid")
        staff_query = Staff.get_query(info)
        if staff_id:
            staff = staff_query.filter(StaffModel.uuid == staff_id).all()
            return staff

        if name and username:
            staff = staff_query.filter(StaffModel.name.startswith(
                name) | StaffModel.username.startswith(name)).all()
            return staff

        if username:
            staff = staff_query.filter(StaffModel.username == username).all()
            return staff

        if name:
            staff = staff_query.filter(StaffModel.name.contains(name)).all()
            return staff

    def resolve_skills(self, info, **args):
        name = args.get("name")
        id = args.get("id")
        skill_query = Skill.get_query(info)
        if id:
            skills = skill_query.filter(SkillModel.uuid.contains(id)).all()
        if name:
            skills = skill_query.filter(SkillModel.name.contains(name) | SkillModel.description.contains(name)).all()
            
        return skills

    def resolve_experiences(self, info, **args):
        experience_type = args.get("experience_type")
        at = args.get("at")
        id = args.get("id")
        experience_query = Experience.get_query(info)

        if id:
            experiences = experience_query.filter(
                ExperienceModel.uuid.contains(id)).all()
            return experiences
        
        if experience_type:
            experiences = experience_query.filter(
                ExperienceModel.type.contains(experience_type)).all()
            return experiences

        if at:
            experiences = experience_query.filter(
                ExperienceModel.at.contains(at)).all()
            return experiences
        
    def resolve_references(self, info, **args):
        reference_query = Reference.get_query(info)
        refType = args.get("refType")
        link = args.get("link")
        if refType == "user":
            references = reference_query.filter(ReferenceModel.link == link)
            return references

schema = graphene.Schema(query=Query, mutation=Mutations, types=[
                         Staff, Experience, Skill, Reference, SearchResult])
