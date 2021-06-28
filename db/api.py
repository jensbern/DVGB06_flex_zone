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


def create_staff(data):
    staff = Staff(name=data["name"], username=data["username"],
                  contact_type=data["contact_type"], contact_info=data["contact_address"])
    
    psw_hash = hashpw(data["password"].encode(), gensalt())
    password = Staff_password(password=psw_hash, staff=staff)
    db_session.add(staff)
    db_session.add(password)
    db_session.commit()
    staff_id = Staff.query.filter(Staff.username == data["username"]).first().id
    return staff_id
