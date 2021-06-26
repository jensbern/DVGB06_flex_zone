from db.models import engine, db_session, Base, Staff, Staff_password

import bcrypt

def check_login(username, password) -> bool:
  # print(username)
  # query = Staff_passwordSchema.get_query(info)
  s = Staff.query.filter(Staff.username == username).first()
  if s == None:
    return False
  s_pw = Staff_password.query.filter(Staff_password.staffid == s.id).first()
  # print(s.username, s_pw.password)
  if bcrypt.checkpw(password, s_pw.password):
    return True
  else:
    return False
