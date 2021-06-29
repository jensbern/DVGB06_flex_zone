from db.models import engine, db_session, Base, Staff, Staff_password

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


def create_staff(staff, staff_password):
    db_session.add(staff)
    db_session.commit()
    db_session.add(staff_password)    
    db_session.commit()

def create_skill(data):
    print(data)
