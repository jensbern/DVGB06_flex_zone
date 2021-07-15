from db.models import db_session, Staff, Staff_password, Skill, Experience
# from flask import jsonify
from bcrypt import gensalt, hashpw, checkpw
from flask_jwt_extended import create_access_token, create_refresh_token

def check_password(staff_uuid, password) -> bool:
    # print(username)
    # query = Staff_passwordSchema.get_query(info)
    # s = Staff.query.filter(Staff.uuid == staff_uuid).first()
    # if s == None:
    #     return False
    s_pw = Staff_password.query.filter(Staff_password.staffid == staff_uuid).first()
    # print(s.username, s_pw.password)
    if checkpw(password.encode(), s_pw.password):
        return True
    else:
        return False

def login(username, password):
    # print(username)
    s = Staff.query.filter(Staff.username == username).first()
    if s == None:
        return {"msg": "Bad username or password"}
    s_pw = Staff_password.query.filter(Staff_password.staffid == s.uuid).first()
    # print(s.username, s_pw.password)
    if checkpw(password.encode(), s_pw.password):
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        return {"access_token":access_token, "refresh_token":refresh_token}
    else:
        return {"msg": "Bad username or password"}

def check_username(username):
    s = Staff.query.filter(Staff.username == username).first()
    if s == None:
        return True
    return False

# data contains:
# name, username, password, contact_type, contact_address, contact_description(optional),


def create_staff(name, contact_info, contact_type, username, password):
    staff = Staff(name=name, contact_info=contact_info,
                       contact_type=contact_type, username=username)
    psw_hash = hashpw(password.encode(), gensalt())
    staff_password = Staff_password(password=psw_hash, staff=staff)
    
    db_session.add(staff)
    db_session.commit()
    db_session.add(staff_password)    
    db_session.commit()
    access_token = create_access_token(identity=username)
    refresh_token = create_refresh_token(identity=username)
    return {"access_token":access_token, "refresh_token":refresh_token}


def create_skill(staff_username, name, description, reference):
    staff = Staff.query.filter(Staff.username == staff_username).first()
    skill = Skill(name=name, description=description, reference=reference, staff=staff)
    db_session.add(skill)
    db_session.commit()
    db_session.refresh(skill)
    return skill.uuid, staff

def create_experience(staff_username, exp_type, description, at, reference, start, end):
    staff = Staff.query.filter(Staff.username == staff_username).first()
    experience = Experience(type=exp_type, description=description, at=at, reference=reference, start=start, end=end, staff=staff)
    db_session.add(experience)
    db_session.commit()
    db_session.refresh(experience)
    return experience.uuid, staff

def delete_staff(username):
    staff = Staff.query.filter(Staff.username == username).first()
    db_session.delete(staff)
    db_session.commit()

def delete_experience(experience_id):
    experience = Experience.query.filter(Experience.uuid == experience_id).first()
    
    db_session.delete(experience)
    db_session.commit()

def delete_skill(skill_id):
    skill = Skill.query.filter(Skill.uuid == skill_id).first()
    db_session.delete(skill)
    db_session.commit()

def update_staff(current_username, name, new_username, contact_type, contact_info):
    staff_update = {}
    if name != None:
        staff_update[Staff.name] = name
    if new_username != None:
        staff_update[Staff.username] = new_username
    if contact_type != None:
        staff_update[Staff.contact_type] = contact_type
    if contact_info != None:
        staff_update[Staff.contact_info] = contact_info
    staff_db = Staff.query.filter(Staff.username == current_username)
    staff = staff_db.first()
    staff_db.update(staff_update,synchronize_session = "fetch")
    db_session.commit()
    return staff

def update_staff_password(staff_uuid, new_password):
    sp = Staff_password.query.filter(Staff_password.staffid == staff_uuid)
    psw_hash = hashpw(new_password.encode(), gensalt())
    sp.update({Staff_password.password:psw_hash}, synchronize_session=False)
    db_session.commit()

def update_experience(experience_id, type, description, at, reference, start, end):
    experience_update = {}
    if type != None:
        experience_update[Experience.type] = type
    if description != None:
        experience_update[Experience.description] = description
    if at != None:
        experience_update[Experience.at] = at
    if reference != None:
        experience_update[Experience.reference] = reference
    if start != None:
        experience_update[Experience.start] = start
    if end != None:
        experience_update[Experience.end] = end
    experience_db = Experience.query.filter(Experience.uuid == experience_id)
    experience = experience_db.first()
    experience_db.update(experience_update, synchronize_session="fetch")
    db_session.commit()
    return experience    

def update_skill(skill_id, name, description, reference):
    skill_update={}
    if name != None:
        skill_update[Skill.name] = name
    if description != None:
        skill_update[Skill.description] = description
    if reference != None:
        skill_update[Skill.reference] = reference
    skill_db = Skill.query.filter(Skill.uuid == skill_id)
    skill = skill_db.first()
    skill_db.update(skill_update, synchronize_session="fetch")
    db_session.commit()
    return skill
