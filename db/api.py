from db.models import db_session, Staff, Staff_password, Skill, Experience

from bcrypt import gensalt, hashpw, checkpw


def check_login(username, password) -> bool:
    # print(username)
    # query = Staff_passwordSchema.get_query(info)
    s = Staff.query.filter(Staff.username == username).first()
    if s == None:
        return False
    s_pw = Staff_password.query.filter(Staff_password.staffid == s.id).first()
    # print(s.username, s_pw.password)
    if checkpw(password, s_pw.password):
        return True
    else:
        return False


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


def create_skill(staff_username, name, description, reference):
    staff = Staff.query.filter(Staff.username == staff_username).first()
    skill = Skill(name=name, description=description, reference=reference, staff=staff)
    db_session.add(skill)
    db_session.commit()
    return staff

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